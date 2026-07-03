# Lecture 5：GPUs, TPUs 閱讀筆記

## 基本資料

- 課程：Stanford CS336 Language Modeling from Scratch, Spring 2026
- 講次：Lecture 5, GPUs, TPUs
- 逐字稿檔案：`data/Stanford CS336 Language Modeling from Scratch/05 - Stanford CS336 Language Modeling from Scratch ｜ Spring 2026 ｜ Lecture 5： GPUs, TPUs.en.txt`
- 完整閱讀範圍：第 1 行到第 2404 行
- 總行數：2404
- 本筆記限制：未使用網路搜尋，未加入逐字稿外部資料。講者提到的 Horace He、GPU Mode、TPU/GPU book、FlashAttention 論文、nanoGPT speed run 等，只作為逐字稿內部內容記錄，不外查補充。

## 本講主問題

本講開始進入 systems 部分，核心問題是：大型語言模型的訓練與推論為什麼不能只從數學運算圖理解，而必須理解底層加速器？更具體地說：

1. GPU 和 CPU 的根本設計哲學有何不同？
2. GPU/TPU 的記憶體階層如何支配效能？
3. 為什麼矩陣乘法的吞吐量會隨維度出現不平滑、週期性、甚至反直覺的變化？
4. 要讓機器學習 workload 在 GPU 上跑快，需要哪些基本技巧？
5. FlashAttention 為什麼可以被理解為這些技巧的組合，而不是神祕的新 attention 數學？

講者希望學生最後能看懂「矩陣乘法吞吐量 vs. 矩陣維度」那張怪異曲線：尺寸變大通常提高吞吐，但某些維度會突然變慢；原因來自 operational intensity、tiling、memory coalescing、padding、SM 數量與 wave quantization 等硬體細節。

## 核心概念

### 1. 從序列加速到平行擴張

過去提升電腦速度的主要敘事是提高 clock speed。Dennard scaling 失效後，單純讓序列指令更快不再足夠。語言模型的規模化依賴更多 compute，這推動了 GPU 與平行化的重要性：與其讓一條指令流跑得更快，不如讓大量輕量運算單元同時工作。

GPU scaling 帶來近年浮點運算能力的大幅成長。V100 時代開始出現 Tensor Cores，後續又透過更低精度格式、結構化稀疏等方式推高可用 FLOPs。這些硬體趨勢使矩陣乘法成為機器學習中被特別優待的操作。

### 2. CPU vs. GPU：latency 與 throughput 的差異

CPU 偏向低延遲序列執行，適合複雜控制流程、分支與條件判斷。它有較重的 control units，搭配少量 ALU，目標是快速完成單一任務。

GPU 偏向高吞吐，擁有大量輕量運算單元。單一任務可能等待很久才完成，但整體上同時處理大量任務，總吞吐量高。這改變了程式設計心智模型：GPU 不適合任意分支很多的小工作，適合大量同形、可平行、資料密集的工作。

### 3. SM、thread、block、warp

- SM（Streaming Multiprocessor）：GPU 的主要獨立計算單元，類似「核心」的角色。每個 SM 內含多個 streaming processors、可存取特定層級的快取與 shared memory。
- Thread：GPU 上輕量平行執行單元。GPU thread 遵循 SIMT 模型，同一組 thread 執行相同指令，但處理不同資料。
- Block：一組 threads，保證在單一 SM 上執行。因此 block 內 threads 可以共享該 SM 上的 shared memory。
- Warp：GPU 的排程單位，通常是 32 個連續編號 threads 一起執行。講者在問答中澄清，同步執行相同指令的單位可理解為 warp。

### 4. GPU 記憶體階層

逐字稿反覆強調：現代 LLM 系統優化常由記憶體而非純 compute 支配。

記憶體層級包括：

- registers：最快、最局部，存放地址或少量中間值。
- shared memory / L1：位於 SM 附近，延遲低。L1 cache 自動保存近期資料；shared memory 是可程式控制的空間。
- L2 cache：較慢，但仍在晶片內或較接近運算單元。
- global memory / HBM / DRAM：通常是高階程式設計者看到的 GPU memory。容量大但延遲高。
- host memory：CPU 主機記憶體，可在必要時與 GPU 互傳，但代價更高。

核心工程限制：離 shared memory 越遠越慢，因此高效 kernel 的基本策略是減少 global memory 讀寫，並盡可能在 shared memory 或 registers 中重用資料。

### 5. TPU 與 GPU 的對照

本講大多談 GPU，但用兩張投影片介紹 TPU。TPU 與 GPU 在高層次上很像，這是「趨同演化」：若要打造高能效機器學習加速器，最後都會有矩陣乘法單元、向量操作單元、控制系統與快慢記憶體階層。

差異主要是配置與彈性：

- GPU 有很多較小、較彈性的 SM 與 Tensor Cores。
- TPU 數量較少但矩陣乘法單元更大，更專為 ML workload 最佳化。
- GPU 的「Tensor Core」指矩陣乘法單元；TPU 的「Tensor Core」在其語境中指處理器級單元，名稱容易混淆。
- 講者指出，TPU/GPU 更大的差別常出現在 networking，而不是單顆晶片的矩陣乘法本質。

### 6. Compute 成長快於 memory bandwidth

GPU 整體 FLOPs 成長速度比 memory bandwidth 與 device-to-device parallelism 更快。因此越新的硬體越容易出現 compute 很強、資料搬不動的情況。這也是為什麼本講後半的技巧幾乎都在處理記憶體：少讀、少寫、合併讀取、重用、降低資料表示大小、用重算換記憶體。

### 7. Roofline model 與 operational intensity

Roofline model 的直覺：

- throughput 上限受兩個因素限制：peak compute 與 memory bandwidth。
- operational intensity / arithmetic intensity 是「每搬動一單位記憶體能做多少運算」。
- 若 intensity 太低，處在 memory-bound 區域，吞吐隨 intensity 斜線上升。
- 若 intensity 足夠高，處在 compute-bound 區域，吞吐接近硬體峰值，曲線變平。

可記為：

```text
attainable throughput <= min(peak FLOPs, memory bandwidth * arithmetic intensity)
arithmetic intensity = FLOPs / bytes moved
```

目標不是盲目增加 FLOPs，而是增加每次 memory movement 產生的有效工作，讓 workload 進入 roofline 的平坦區。

## GPU 加速的六類技巧

逐字稿中講者說會談六個 tricks，實際展開時可整理為以下類別。

### 1. 避免 control divergence

GPU 遵循 SIMT。若 warp 內 threads 遇到 `if/else` 且走不同分支，硬體通常需要依序執行兩邊分支，未走該分支的 threads 被 mask 掉、空等。這稱為 control divergence。

工程含義：

- CPU 上便宜的分支，在 GPU 上可能讓部分 lanes 閒置。
- GPU code 常偏好 mask、乘以 0、向量化條件操作，而不是讓 warp 內 threads 大量分歧。

### 2. 低精度運算

降低數字精度可以減少記憶體搬運，也能讓專用硬體提供更高乘法吞吐。例子：

- FP32 到 BF16：位元數減半，memory movement 也近似減半。
- FP8：常見格式包括 E4M3、E5M2，需配合 scaling factor 避免 overflow/underflow。
- MXFP8：不是整個矩陣共用單一 scale，而是每一小塊元素使用自己的 scale。逐字稿提到每 32 個元素有一個 scale factor，scale factor 本身也可為低精度 E8M0。
- MXFP4：更極端，每 16 個數字有一個 scale factor，數值集合非常有限。

關鍵限制：

- 不是所有操作都能安全降精度。矩陣乘法較適合；softmax、exp、最後輸出層等可能需要更高精度。
- 低精度不是免費 2x speedup，因為 quantize/dequantize、scale 維護、轉置副本等都有 overhead。
- MXFP8 這類分塊 scale 使 transpose 複雜，因為轉置後分塊 scaling pattern 不同，實作可能保存原矩陣與轉置矩陣兩份量化副本。

### 3. Operator fusion

若每個小操作都各自啟動 kernel，流程會變成：

```text
global memory -> compute -> global memory -> compute -> global memory ...
```

這讓資料在 HBM 與 SM 之間反覆來回。Operator fusion 把多個操作合成單一 kernel：

```text
read once -> do many operations locally -> write once
```

例子：`sin(x)^2 + cos(x)^2` 若拆成 sin、cos、square、add，多次讀寫 global memory；若 fuse 成一個 kernel，讀一次 x、在 SM 內完成計算、寫一次結果。Torch Compile、JAX compile 可自動處理簡單 fusion；更複雜的 fusion 有時需要手寫 kernel 或專門系統支援。

### 4. Recomputation

Backprop 通常保存 forward activations，方便 backward 使用。但在 memory-bound 世界，可以選擇不保存部分 activations，backward 時重算。

逐字稿例子：

- `x -> sigmoid -> sigmoid -> sigmoid -> out`
- 保存所有中間 activation 時，forward/backward 需要較多 memory reads/writes。
- 若丟掉中間 activation，backward 時重新 forward 需要的片段，會增加 compute，但減少 memory access。

這是用便宜的 compute 換昂貴的 memory，對 attention 等需要保存巨大中間矩陣的操作特別重要。

### 5. Memory coalescing

DRAM 讀取以 burst section 為單位。讀一個位置時，同一連續區塊內的鄰近資料可能幾乎「順便」被取出。因此 warp 內 threads 若讀取同一 burst section 中連續位置，稱為 coalesced access，效率高。

工程含義：

- row-major matrix 中，沿著記憶體連續方向讀取比跨 stride 讀取好。
- 若 thread pattern 導致每個 thread 命中不同 burst section，實際搬運資料遠多於所需。
- 矩陣 layout、row/column traversal、padding 都會影響 coalescing。

### 6. Tiling

Tiling 是本講最重要的技巧。想法是把大矩陣切成小 tile，把 tile 從 global memory 載入 shared memory，然後在 shared memory 中反覆重用。

對 `n x n` 矩陣乘法：

- naive 情況下，每個 input element 可能從 global memory 讀取 `n` 次。
- 若 tile size 為 `T`，每個 input element 從 global memory 讀取約 `n/T` 次，進入 shared memory 後在 tile 內重用。
- 因此 global memory access 可獲得約 `T` 倍下降。

限制：

- tile size 受 shared memory 容量、coalescing、矩陣維度影響。
- 若矩陣尺寸不整除 tile，會產生 skinny tiles 或空 tile，浪費工作。
- PyTorch matmul kernel 會做 tiling，但 exotic operation 仍可能需要手動思考資料重用。
- auto-tuning 會嘗試不同 tile size 找到特定 shape 的最佳 kernel。

## 重要例子與問答

### Padding 反而加速

逐字稿提到 nanoGPT speed run 中將 vocabulary size 從 50257 padding 到 50304，得到約 25% speedup。這不是因為模型語義變好，而是維度對齊後改善 tile alignment 與 coalesced reads。一般原則是：常見矩陣維度最好對齊某些硬體友善倍數，講者口頭提到 powers of two、最好也 divisible by 32。

### 矩陣吞吐曲線的怪異谷底

講者用矩陣乘法 throughput plot 解釋：

- 尺寸變大，arithmetic intensity 增加，吞吐上升。
- 若維度只 divisible by 1 或 2，常因 alignment/coalescing 不佳而慢。
- divisible by 16 或 32 後，通常已滿足 burst window 對齊，懲罰消失。
- 某些維度仍有週期性下降，來自 wave quantization。

具體例子：

- tile size 為 `256 x 128`。
- 從 1792 到 1793，tile 數從 98 變成 120。
- A100 有 108 SM。98 tiles 可在一波內塞進 108 SM；120 tiles 需要第二波，但第二波只有 12 個 tiles，多數 SM 閒置。
- 因此只增加一個維度，吞吐可能大幅下降。

### SRAM 為何不做超大

學生問：既然 shared memory / SRAM 快，為何不把整顆晶片都做成 SRAM？

講者回答重點：

- SRAM 成本高。
- SRAM 必須靠近計算單元，佈線與訊號傳播困難。
- SRAM 維持資料需要持續供電，能源成本高。
- 因此實用加速器通常保留階層式記憶體，而不是全部改成快速記憶體。

### Shared memory 與 L1 cache 差異

學生多次問 shared memory 與 L1 cache 差別。講者回答：

- L1 cache 自動運作，保存近期存取資料，程式通常不直接控制。
- shared memory 是可程式控制的空間，可由 block 內 threads 明確放入、取出、共享與重用資料。

### TPU/GPU 名稱混淆

TPU 的 tensor core 指類似處理器的單元；GPU 的 Tensor Core 指矩陣乘法單元。閱讀硬體文件或章節時必須依上下文判斷。

## FlashAttention：把技巧合起來

FlashAttention 是本講收束案例。它不是改變 attention 數學，而是改變 attention 的實作方式：用 tiling、fusion、online softmax、recomputation 減少 HBM 存取。

標準 attention 包含：

```text
S = Q K^T
P = softmax(S)
O = P V
```

naive 實作會產生 `S`、`P` 等 `n x n` 中間矩陣，造成大量 HBM 讀寫與 activation 保存。

FlashAttention 的核心：

1. 把 Q、K、V 切成 tiles。
2. 在 SRAM/shared memory 中做 tiled matmul。
3. 不把完整 attention score matrix 寫回 HBM。
4. 用 online softmax 逐 tile 維護 row-wise maximum 與 normalizer。
5. backward 時不保存完整 `n x n` activation，而是重算必要 tile。

online softmax 的直覺：

```text
m_new = max(m_old, x)
l_new = exp(m_old - m_new) * l_old + exp(x - m_new)
```

tile 版則把單一 `x` 換成 tile 的局部最大值與局部 exponential sum。每次看到更大的 max，就用比例因子修正舊 accumulator。這讓 softmax 這個看似全域的操作能被分塊計算。

## 從零實作語言模型的意義

本講對「from scratch」的意義是：即使我們不手寫所有 CUDA kernel，也不能只把 GPU 視為 `model.to("cuda")` 的黑盒。語言模型架構與訓練設定會直接決定矩陣 shape、資料 layout、activation 大小、precision 格式、kernel fusion 機會與 attention 實作方式。

實作語言模型時，以下決策都和本講相關：

- hidden size、vocab size、head dimension 是否對硬體友善。
- 是否使用 BF16/FP8，哪些層不能降精度。
- attention 是否使用 memory-efficient / flash 實作。
- 是否用 gradient checkpointing / recomputation。
- 是否能透過 compiler 或手寫 kernel fuse operation。
- 是否理解效能瓶頸是 compute-bound、memory-bound，還是 communication-bound。

從零實作不等於拒絕高階框架，而是知道框架背後的限制：PyTorch 會自動處理許多 tiling/fusion，但 shape 不對齊、exotic operation、global softmax、inference decode 等場景仍會暴露底層成本。

## 跨章連結

- Lecture 1 / scaling：更多 compute 能改善模型，但前提是能有效利用硬體資源。本講解釋 utilization 的底層原因。
- Lecture 2 / PyTorch、einops：張量 shape 與 layout 不只是語法問題，會影響 coalescing、tiling 與 kernel 選擇。
- Transformer / attention 章節：attention 的數學式簡單，但 naive 實作會產生巨大 `n x n` 中間矩陣；FlashAttention 展示 systems-aware attention。
- 後續 parallelism：本講 tile 與 SM 的思路可延伸到 data/tensor/pipeline parallelism，都是切分工作與資料、避免昂貴搬運。
- inference 章節：講者提到 prefill/decode disaggregation，推論比訓練更常 memory-bound，因此本講的 memory hierarchy 對推論尤其重要。
- quantization / post-training：低精度訓練與推論會在後續模型壓縮、部署、alignment 後處理中反覆出現。

## 暫不處理的外部補充

本 worker 不加入外部資料，以下只記錄逐字稿中提到但未展開的項目，留待主控或附錄 agent 判斷是否補充：

- Horace He 的 GPU explainer。
- GPU Mode / CUDA Mode 社群資源。
- Google TPU/GPU book 與其練習。
- FlashAttention 原始論文與 FlashAttention 2/3 圖示來源。
- nanoGPT speed run 中 vocab padding 的原始脈絡。
- Step 1.3 或其他 prefill/decode/layer disaggregation 的推論系統案例。
- wafer-scale engine 與其 compilation/wave interference 問題。
- structured sparsity、MoE、quantization scaling laws、QAT/PTQ 的完整文獻。
