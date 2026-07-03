# Kernels, Triton, XLA

## 導讀

上一講把 GPU/TPU 的效能問題放在較高層次：FLOPs、memory bandwidth、roofline、tiling、FlashAttention。本講往下一層，問一個更直接的問題：如果我們真的要替語言模型寫一個 GPU kernel，應該怎麼想？

答案不是先寫 Triton，也不是先追求某個神奇最佳化。講者給出的順序很務實：先理解 GPU 的程式模型與硬體限制，接著 benchmark 和 profile，知道瓶頸在哪裡，再決定是否需要寫 kernel、要 fuse 哪些 operation、要怎麼 tile。

本講標題含 XLA，但逐字稿主要內容集中在 PyTorch profiling、`torch.compile`、Triton、PTX 與單 GPU kernel。XLA 的系統性整理需要等材料階段補齊；本章初稿不硬補外部資料。

## 從程式模型到硬體現實

GPU kernel 的乾淨抽象是三層：

- thread：最小的執行單位，各自處理一小段資料。
- thread block / CTA：一群 threads，可被排到同一個 SM 上，並共享 shared memory。
- grid：一次 kernel launch 中所有 blocks 的集合。

這個模型足以描述正確性。例如 element-wise GELU 可以讓每個 thread 或每個 block 處理一段連續資料，各段互不依賴。但 softmax、row sum、matmul 這類 operation 需要 reduction 或資料重用，只靠「每個 thread 算一個元素」會讓 HBM 讀寫過多。這時 thread block 成為核心單位：block 先從 HBM 載入一段資料，在 SM 附近的 register/shared memory 做計算，再把結果寫回 HBM。

真正的效能問題來自硬體現實。registers 很快但少；shared memory/L1 在 SM 上，容量有限；L2 是整顆晶片共用；HBM 容量大但相對遠。語言模型裡的矩陣和 attention 張量很大，不可能全部塞進 SM，所以每個 kernel 都在處理一個取捨：哪些資料值得搬近一點、近端能放多久、能在寫回 HBM 前做多少計算。

## Warp、Occupancy 與記憶體存取

thread block 內的 threads 會被分成 warp；一個 warp 通常有 32 個 threads。warp 內 threads 以 lockstep 執行同一條指令，所以分支會造成 control divergence：同一個 warp 中不同 threads 走不同路徑時，硬體必須把路徑序列化。

SM 會同時 resident 多個 warps，並在某個 warp 等 HBM load 時切換到其他 ready warp，以隱藏 memory latency。這也是 occupancy 重要的原因。不過 occupancy 不是越高越好。若每個 thread 使用太多 registers，能同時 resident 的 warps 會變少；但若每個 thread 做更多有用工作，較低 occupancy 仍可能更快。效能必須量測，不能只看單一指標。

記憶體存取也有兩個容易混淆的限制：

- bank conflict：shared memory 分成多個 banks。若同一 warp 的 threads 同時打到同一 bank，存取會被序列化。
- memory coalescing：讀 HBM 時，warp 內相鄰位址可被合併成較有效率的 transaction；stride 讀取會浪費頻寬。

兩者都和 layout、stride、row/column traversal 有關，但一個發生在 shared memory，一個發生在 HBM。寫 kernel 時，矩陣 shape 與 memory layout 不是背景細節，而是效能的一部分。

## 先量測，再寫 Kernel

benchmark 告訴我們「整體跑多久」，profiling 告訴我們「時間花在哪裡」。GPU benchmark 不能只用 CPU wall-clock 包住一段程式，因為 GPU 執行通常是 async，而且第一次執行可能包含 lazy compilation 或初始化成本。實務上要 warm up，用 CUDA events 記錄 start/end，並 synchronize 後再讀時間。

profiling 的價值在於拆開高階 PyTorch 語句。`A + B` 看起來是一行 Python，底下其實會呼叫一個 CUDA add kernel。`A @ B` 也不是單一抽象動作，而是依 shape、dtype、architecture 選用不同 matmul kernel。kernel 名稱常透露它來自哪個 library、對應哪個 GPU architecture、tile shape 是多少。

這個觀察會改變我們看 PyTorch 程式的方式：高階程式的慢，不一定是數學多，而可能是切成太多 kernels，每個 kernel 都把中間結果寫回 HBM。

## GELU：Kernel Fusion 的第一個例子

GELU 是 element-wise activation，數學上不難。但若用純 PyTorch 按公式寫，乘法、加法、tanh、再乘法等 primitive 可能各自成為 kernel。每個 kernel 都要：

```text
read HBM -> compute on SM -> write HBM
```

如果把這些 primitive fuse 成單一 kernel，就變成：

```text
read once -> do all GELU arithmetic locally -> write once
```

這就是 kernel fusion 的基本收益：少搬資料。內建 GELU 通常已有手寫或高度最佳化 kernel；`torch.compile` 也可能把 naive PyTorch graph fuse 成 Triton kernel。講者的示範中，內建版本比 compiled Triton 版本更快，這提醒我們不要把「自寫 Triton」當成必然勝利。標準 library 對常見 operation 可能已經非常好；自寫 kernel 更適合特殊 operation、特殊 shape、或想把多個 operation 合在一起的情境。

## Triton 的基本形狀

CUDA 的心智模型偏向「每個 thread 做什麼」。Triton 則讓我們寫「每個 block 做什麼」。一個典型 Triton kernel 的形狀如下：

1. 收到 input/output pointers 和 shape 參數。
2. 用 `program_id` 判斷目前 block 是誰。
3. 根據 block id、block size、stride 算出要讀寫的 offsets。
4. 用 mask 處理最後一個 block 不滿的情況。
5. `tl.load` 從 HBM 讀資料。
6. 在 block 的向量或小矩陣上做計算。
7. `tl.store` 寫回 HBM。

這個寫法看起來接近 PyTorch，因為 block 內的資料可被視為一段向量或一個小矩陣。但它不是在描述整個 tensor 的全域運算，而是在描述一個 block 的工作。Triton compiler 會把這段描述降到 PTX；PTX 再由 GPU 執行。PTX 片段中可以看到 global load/store、register、thread id、block id 等更底層元素。

這也是為什麼 Triton 程式裡的 local variable 不必由作者精確指定放在 register 還是 shared memory。作者描述計算與資料範圍，compiler 和硬體再決定部分細節。這提供了生產力，但也代表需要 profile 才知道實際結果。

## Softmax：從 Element-Wise 到 Reduction

softmax 不是 element-wise。以 row-wise softmax 為例，每列都要先找最大值，再做 exponentiation、sum、normalize：

```text
m_i = max_j x_{ij}
z_{ij} = exp(x_{ij} - m_i)
y_{ij} = z_{ij} / sum_j z_{ij}
```

若用 naive PyTorch 寫，`max`、subtract、`exp`、`sum`、divide 都可能引入 HBM 往返。若一列能放進一個 Triton block，做法很自然：每個 block 負責一列，load 該列，用 mask 把無效位置設成 `-inf`，在 block 內做 max 和 sum reduction，最後 store 結果。

這個例子說明 thread block 的價值。block 之間互不溝通，因為每列 softmax 獨立；block 內 threads 需要合作，因為同一列的 normalization constant 由整列共同決定。

## Row Sum：資料放不進一個 Block 時

如果一列比 block size 長，例如 4000 個元素但 block size 是 1024，就不能一次把整列作為一個 block-local vector 處理。講者用 row sum 說明一個較簡單的 tiling 版本：

1. block 仍然負責一整列。
2. 把 row 切成多個 tiles。
3. block 內每個 thread 迭代處理多個 tiles，維持 accumulator。
4. 所有 tiles 掃完後，再把 accumulator 做 reduction，寫出該列總和。

這裡要分清楚 tile 和 block。GELU 把向量切成多段時，各段可以是獨立 blocks；row sum 中切出來的是 tiles，同一列的 tiles 仍屬於同一個 block 的責任，因為最後要得到同一個 row result。

## Matmul：Tiling 的典型案例

矩陣乘法是深度學習的核心 operation。設定：

```text
A: M x K
B: K x N
C: M x N
C_{mn} = sum_k A_{mk} B_{kn}
```

最 naive 的 kernel 可以讓每個 output element 自己掃過 K，從 HBM 讀 A 和 B，累加後寫 C。這是正確的，但有大量重複讀取。計算 `C` 的相鄰元素時，會反覆讀到同一段 A 或 B。HBM reads 約為 `O(M K N)`，與運算量同階，arithmetic intensity 只是常數。

理想上，我們想把 A 和 B 都讀進 shared memory，只讀一次，再算出 C。這會把 HBM reads 降到二次量級，arithmetic intensity 可大幅提升。但完整矩陣通常放不進 shared memory。

實際作法是 tiled matmul：

1. 把 output matrix C 切成 tiles，每個 C tile 交給一個 thread block。
2. block 沿 K 維度掃過 A 的 row tiles 和 B 的 column tiles。
3. 每次載入一小塊 A 和一小塊 B 到 shared memory。
4. 在 block 內做局部 dot，累加到 output tile 的 accumulator。
5. 掃完 K 後，把 output tile 寫回 HBM。

這種作法「全域看起來像 naive」，因為仍然掃過所有必要 tile；但「局部看起來像 idealized」，因為每次盡量在 shared memory 中重用資料。arithmetic intensity 通常提升到 tile size 的量級。

講者在 matmul 後加 ReLU，目的就是展示 fusion：當 accumulator 還在本地時，順手做 element-wise activation，再寫回 HBM，就能省掉額外 kernel。

## Stride 與 Pointer Arithmetic

Triton kernel 需要顯式算 address。tensor 是多維陣列，但 memory 是線性的。stride 告訴我們如何把 `(row, column)` 轉成 memory offset：

```text
offset = row * stride_row + column * stride_column
```

row-major matrix 中，往下一列通常跳過整列長度，往右一欄加 1；transpose 後 stride 會改變。這正是為什麼同樣是 softmax 或 matmul，沿 row 或 column 存取會有不同 coalescing 與 bank conflict 行為。

## 工程取捨

第一個取捨是 library kernel、compiler、手寫 Triton 之間的選擇。常見 operation 例如 matmul、GELU，內建 kernel 可能已經非常好。`torch.compile` 能自動做一些 fusion。手寫 Triton 的價值在於你要表達 library 沒有的 fused operation，或某個特殊 shape/workload 需要更細的控制。

第二個取捨是 occupancy 和每個 thread 的工作量。register 壓力會降低 resident warps，但 thread coarsening 可能讓每個 thread 做更多有效工作。不能把 occupancy 當唯一目標。

第三個取捨是 tile size。tile 太小，資料重用不足；tile 太大，shared memory/register 壓力上升，也可能降低 occupancy。好的 tile size 依 shape、dtype、SM 資源與 memory access pattern 而變。

第四個取捨是抽象層級。PyTorch 最容易寫，但對 HBM traffic 的控制最少；Triton 提供 block-level 控制；CUDA/PTX 更接近硬體，但開發成本更高。講者不建議一開始就手寫 PTX，除非真的需要處理 compiler 無法處理的底層細節。

## 常見誤解

一個常見誤解是「GPU 快，所以資料搬來搬去不重要」。本講正好相反：很多 kernel 最主要的成本就是 HBM 往返。fusion、tiling、coalescing 都是在減少或改善資料移動。

第二個誤解是「Triton 一定比 PyTorch 內建快」。若內建 kernel 已高度最佳化，自寫 Triton 可能比較慢。Triton 的優勢是能用較低成本寫出 block-level kernel，尤其適合 fused 或非標準 operation。

第三個誤解是「block、tile、thread 是同一種切法」。thread 是執行單位，block 是可共享 shared memory 的協作單位，tile 是演算法上切資料的方式。某些 tile 對應一個 block；某些情況下，一個 block 會迭代多個 tiles。

第四個誤解是「只要 occupancy 高就好」。occupancy 是可觀測指標，不是目的。若高 occupancy 只是讓更多 threads 等 memory，未必改善時間。

第五個誤解是「高階 tensor 程式不用管 stride」。stride 決定 address pattern，進而影響 coalescing、bank conflict、cache-line 使用率與 tile 實作。

## 從零實作語言模型的意義

語言模型的核心路徑由少數 operation 組成：embedding lookup、matmul、softmax、normalization、activation、attention。模型方程式只是第一層；訓練速度往往取決於這些 operation 被切成多少 kernels、每個 kernel 搬多少 HBM、是否能 fuse、是否能 tile。

本講把 attention 和 MLP 的效率問題拆到 kernel 層：

- MLP 中的 linear + activation 可以用 fusion 減少 HBM 往返。
- attention 中的 softmax 是 row-wise reduction，不是單純 element-wise。
- matmul 是 tiled shared-memory reuse 的典型案例。
- FlashAttention 需要把 softmax、matmul、tiling、fusion 串在一起，避免把大型 attention score matrix 寫回 HBM。

所以從零實作語言模型，不只是把 Transformer 寫出來，也要能解釋為什麼某個 shape 很慢、為什麼 padding 到某些維度可能更快、為什麼 compiler 有時能救 naive code、有時必須寫專門 kernel。

## 相關作業與材料

本講明確為後續 FlashAttention 實作鋪路：從 element-wise GELU，到 row-wise softmax，到 row 長度超過 block size 的 row sum，再到 tiled matmul。這些就是實作 memory-efficient attention 所需的基本構件。

材料狀態如下：

- `data/cs336/lectures material/lecture_06.py`：已下載，待材料階段閱讀。
- `data/cs336/lectures material/var/traces/lecture_06.json`：已下載，待材料階段閱讀。
- `data/cs336/code/assignment2-systems-main/`：已下載，待材料階段閱讀。

以上材料本章初稿均未讀、未整合。XLA 相關內容也待材料階段或主控提供來源後補齊。

## 小結

本講的主線是：GPU 程式模型很簡潔，但效能受硬體細節支配。threads、blocks、grid 決定如何描述並行；warps、registers、shared memory、HBM、bank conflict、coalescing、occupancy 決定實際速度。benchmark/profile 是進入最佳化前的必要步驟。

Triton 的價值在於讓我們以 block 為單位寫 kernel：load、compute、store。GELU 展示 fusion；softmax 展示 row-wise reduction；row sum 展示資料放不進 block 時的 tile iteration；matmul 展示用 shared memory tile 重用資料。這些概念合在一起，構成後續理解與實作 FlashAttention 的 kernel-level 基礎。
