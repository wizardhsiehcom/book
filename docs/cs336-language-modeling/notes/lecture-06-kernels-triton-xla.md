# Lecture 6：Kernels, Triton, XLA 閱讀筆記

## 基本資料

- 課程：Stanford CS336 Language Modeling from Scratch, Spring 2026
- 講次：Lecture 6, Kernels, Triton, XLA
- 逐字稿檔案：`data/Stanford CS336 Language Modeling from Scratch/06 - Stanford CS336 Language Modeling from Scratch ｜ Spring 2026 ｜ Lecture 6： Kernels, Triton, XLA.en.txt`
- 完整閱讀範圍：第 1 行到第 2275 行
- 總行數：2275
- 閱讀狀態：已完整閱讀逐字稿；未讀 lecture code、trace、assignment code repo，依任務要求僅列材料狀態。

## 本講主問題

本講接續 Lecture 5 的 GPU 高階概念，問題不是「GPU 很快」這種抽象說法，而是：當我們真的要替語言模型寫一個 GPU kernel 時，應該如何把計算切成 thread block、如何理解資料在 HBM、shared memory、register 間的移動、如何用 benchmark/profile 找瓶頸，以及如何用 Triton 寫出比純 PyTorch primitive 更貼近硬體的 fused kernel。

講者反覆強調兩層視角：

1. 程式模型看起來乾淨：threads、thread blocks、grid；Triton 讓我們主要思考「一個 block 做什麼」。
2. 真正效能由硬體細節決定：SM 數量、register 數量、warp scheduling、bank conflict、memory coalescing、occupancy、tile 大小，都會讓同一個數學運算有完全不同的執行時間。

## 核心概念

### GPU 記憶體階層

本講以 NVIDIA GPU 為主。每代 GPU 有許多 SM，數量大約在一百到兩百的量級；每個 SM 有 registers、L1/shared memory；整顆晶片有 L2；更外層是 HBM。

重要關係是容量與速度的取捨：

- registers：最快、最小、屬於 thread 或編譯後的局部值。
- shared memory / L1：在 SM 上，shared memory 可由程式明確使用，L1 cache 不直接控制。
- L2：整顆 GPU 共用。
- HBM：容量大、頻寬高，但相對 registers/shared memory 仍然慢，跨 kernel 中間結果通常要回到 HBM。

本講的工程核心是盡量減少不必要的 HBM read/write，把可重用資料搬到 shared memory/register 旁邊做更多計算。

### Thread、Thread Block、Grid

GPU kernel launch 時啟動的是一個 grid；grid 由許多 thread blocks 組成；每個 block 內有多個 threads。thread 適合描述 element-wise 工作，例如 GELU 的每個元素可以獨立處理。

但 softmax、row reduction、matmul 需要同一組 threads 共同處理一段資料，甚至需要溝通與 reduction。這時 block 的意義就出現了：一個 block 可以被排到一個 SM 上，block 內 threads 可以透過 shared memory 協作。

Triton 的抽象重點是「寫每個 program/block 要做的事」，比 CUDA 直接寫每個 thread 的行為更高一層。

### Warp 與 Control Divergence

thread block 內的 threads 會被分成 warp；一個 warp 通常有 32 個 threads。warp 內 threads 以 lockstep 執行相同指令。若同一個 warp 內不同 threads 走不同分支，硬體會序列化執行不同路徑，形成 control divergence。

這說明為什麼 GPU kernel 裡要小心分支。對 CPU 友善的 `if/else`，在 GPU warp 中可能變成遮罩與序列化成本。

### Occupancy 與 Register 壓力

SM 的 registers 數量有限。若每個 thread 使用很多 registers，同時能 resident 的 threads/warps 就會減少，warp occupancy 下降。講者舉例：128 threads/block、160 registers/thread，B200 每 SM 約 65,000 registers，最多只能同時放 3 個 blocks，也就是 12 warps；若硬體上限是 64 warps，occupancy 約 18%。

但 occupancy 不是越高越好。若每個 thread 做更多工作，例如 thread coarsening，一個 thread 處理多個元素，可能減少排程成本並改善整體效率。要看 bottleneck 是 memory、compute、launch overhead 還是其他硬體限制。

### Bank Conflict

shared memory 被分成 32 個 banks，每個 bank 每 cycle 只能服務有限存取。若同一 warp 的多個 threads 同時打到同一 bank，存取會被序列化，形成 bank conflict。最壞情況可達 32-way bank conflict。

這和矩陣 layout、row/column traversal、transpose、matmul 有關。講者提到 swizzling 可作為避免 bank conflict 的技巧，但本講未深入。

### Memory Coalescing

warp 內 threads 讀 HBM 時，硬體會把相鄰記憶體存取合併成 cache-line transaction。若 32 個 threads 讀相鄰位置，可以 full coalescing；若沿著 column 對 row-major memory 做 stride 讀取，可能抓了大量不用的資料。

coalescing 針對 HBM；bank conflict 針對 shared memory。兩者看起來都和 memory layout 有關，但硬體層級不同。

### Block Occupancy 與尾端浪費

thread blocks 會被排到有限數量的 SM。若有 148 個 SM 卻 launch 160 個 blocks，前 148 個先跑，剩下 12 個成為第二波；第二波只有 12 個 SM 忙，其餘 SM 閒置。講者稱這種尾端不整齊造成低 block occupancy，也可視為 wave/tail inefficiency。

問答中有人問 block 是否能分享或拆到多個 SM。講者回答重點是 block 必須待在一起，若 block 已用滿某 SM 的 tensor cores，再塞另一個 block 不一定加速；通常要調整 block size 或 block 數量來改善尾端。

### Benchmarking 與 Profiling

benchmark 回答「整體花多久」，profiling 回答「時間花在哪裡」。講者的流程是：

1. benchmark/profile 現有程式。
2. 根據瓶頸修改。
3. 再 benchmark/profile。

benchmark GPU 程式時要注意 warmup，因為 lazy compilation 或初始化成本不代表穩態；要用 CUDA events 記錄時間；GPU 執行是 async，因此需要 synchronize。多次測量後可看平均或更完整的分布。

profiling 可揭露 PyTorch 背後實際呼叫的 CUDA kernels。`A + B` 會對應加法 kernel；matmul 會依 tensor dimension 呼叫不同 CUTLASS/CUDA kernel，kernel 名稱可透露 architecture、dtype、tile shape 等資訊。

### Kernel Fusion

純 PyTorch 寫 GELU 公式時，每個 primitive 可能是一個 kernel，例如乘法、加法、tanh、再乘法等。每個 kernel 都要從 HBM 讀，算完再寫回 HBM，下一個 kernel 再讀回來。

內建 GELU 或 `torch.compile` 可把多個 primitive fuse 成單一 kernel：讀一次、在本地做多個操作、寫一次。內建 GELU 在示範中比 compiled Triton kernel 還快，講者提醒這依硬體與實作而變，不應假設 Triton 一定贏內建 CUDA kernel。

### Triton 的程式模型

Triton kernel 通常包含：

1. 輸入/輸出 pointer。
2. `program_id` 決定目前 block 的身份。
3. 用 block id 和 offsets 算出要讀寫的 memory addresses。
4. 用 mask 處理尾端不足 block size 的元素。
5. `tl.load` 從 HBM 讀入。
6. 在 block 內做向量化計算、reduction 或 dot。
7. `tl.store` 寫回 HBM。

Triton 的值看起來像向量或小矩陣，計算寫法接近 PyTorch；但語意上是在描述一個 block 的工作，而不是整個 tensor 的全域 operation。

### PTX

Triton compiler 會產生 PTX，PTX 是 NVIDIA GPU 的中介組合語言。講者展示 PTX 不是要大家手寫，而是讓學生看到 `ld.global`、register、multiply、store 等底層指令。

PTX 更接近「每個 thread 實際跑的程式」。同一段 compiled code 由不同 threads 執行，透過 block id、thread id 區分自己處理哪段資料。講者也指出 PTX 仍不完全決定所有事情，例如實際 SM 排程、warp scheduler 等仍由硬體控制。

問答中確認：當某 warp 執行到 global load 並等待 HBM 時，SM 可以切換到其他 ready warp 來隱藏 latency。

## 重要定義、公式、演算法與例子

### GELU

GELU 是 element-wise activation。講者示範三種版本：

- naive PyTorch：照公式寫，會產生多個 kernel。
- built-in PyTorch GELU：單一 CUDA kernel。
- `torch.compile` 後版本：可能 fuse 成 Triton kernel。

GELU 的教學意義不是公式本身，而是展示同一個數學函數因 kernel fusion 差異而有大幅效能差距。

### Softmax

softmax 以 row-wise 形式討論。穩定版本：

```text
m_i = max_j x_{ij}
z_{ij} = exp(x_{ij} - m_i)
y_{ij} = z_{ij} / sum_j z_{ij}
```

naive PyTorch 版本會有多次 HBM read/write：max、subtract、exp、sum、divide 都可能是不同 kernel。若一整列能放進一個 Triton block，則每個 block 負責一列：load row、masked invalid positions with -inf、做 max/reduction、exp、sum、divide、store。

這是從 element-wise 進入 reduction 的第一個例子。block 之間不需互動，因為每列 softmax 獨立；block 內需要共同完成 row reduction。

### Row Sum 與「baby tiling」

若 row 長度大於 block size，例如 row 有 4000 columns、block size 只有 1024，就不能一次把整列放進 block 的一次向量操作。策略是把 row 切成 tiles，仍由同一個 block 負責一列，但 block 內 threads 迭代多個 tiles，維持 accumulator，最後再 reduction 成 scalar。

講者特別區分 block 與 tile：GELU 切成多段時，每段可以是獨立 block；row sum 這裡切成 tiles，但整列仍是一個 block 的責任，因為最後需要合併成同一個 row result。

### Matmul：naive、idealized、tiled

矩陣乘法設定：

```text
A: M x K
B: K x N
C: M x N
C_{mn} = sum_k A_{mk} B_{kn}
```

naive kernel 可讓每個 output element 各自掃過 K，從 HBM 讀 A 與 B，累加後寫 C。這是正確的，但 HBM reads 約為 `O(M K N)`，與 FLOPs 同階，arithmetic intensity 是常數，效能不好。

idealized 作法是把 A 與 B 全部載入 shared memory，只讀一次再算 C，HBM reads 降為二次量級，arithmetic intensity 可到 `O(N)`。但完整 A、B 通常放不進 shared memory。

實際作法是 tiling：把 C 切成 tiles，每個 output tile 對應一個 thread block。block 沿著 K 維度掃過 A 的 row tiles 與 B 的 column tiles，每次載入小 tile 到 shared memory，做局部 dot，累加 partial sum，最後把 output tile 寫回 HBM。arithmetic intensity 約提升到 tile size 的量級。

講者用 matmul + ReLU 說明 kernel fusion：既然 output tile 已在本地 accumulator/shared memory 中，寫回 HBM 前順手套 element-wise activation，可避免額外 kernel 與 HBM 往返。

### Strides

tensor 是多維陣列，但實體 memory 是線性。stride 用來把 `(row, column)` 映射成線性 index：

```text
address_offset = row * stride_row + column * stride_column
```

row-major matrix 中，往下一列通常加上 column count，往右一欄加 1；transpose 後 stride 會交換。Triton matmul/softmax kernel 需要顯式處理 pointer arithmetic 與 stride。

## 工程限制

- HBM 雖然頻寬高，但相對 SM 內部 memory 慢；多 kernel 的中間結果反覆回 HBM 是常見瓶頸。
- block 不能任意拆散到多個 SM；block size 與 block 數量會影響尾端浪費。
- register 使用量會限制 resident warps；降低 occupancy 未必錯，但必須量測。
- shared memory 有 bank conflict；HBM 有 coalescing 問題；兩者都由 memory layout 與 access pattern 影響。
- Triton 提供 block-level 抽象，但 compiler/hardware 仍決定許多低層細節，例如 accumulator 放 register 或 shared memory、thread coarsening、warp scheduling。
- 內建函式可能已高度最佳化；自寫 Triton kernel 的目標不是凡事取代 library，而是在 exotic operation、fusion、特殊 shape 或教學理解上取得控制。

## 重要問答

- 問：block 能不能共享 SM 或把一個 block 拆散到多個 SM？
  答：block 必須待在一起；若一個 block 已用滿 SM 的主要資源，再放另一個 block 不一定有利。改善方式通常是調整 block size 或 block 數量，減少尾端浪費。

- 問：Triton 的 `tl.load` 實際如何從 HBM 到 shared/register？
  答：Triton code 是給 compiler 的描述，不是 GPU 直接執行 Python。compiler 產生 PTX，實際 local variable 可能放 register 或 shared memory，由 compiler/hardware 決定。概念上 pointer 指向 HBM，load 取回資料，之後在本地做計算。

- 問：PTX 是否每個 thread 各生成一份？
  答：compiled code 生成一次，所有 threads 跑同一段 code；block id 與 thread id 讓每個 thread 知道自己處理哪段資料。

- 問：等待 HBM load 時是不是像 blocking？
  答：某個 warp 等 memory 時，SM 的 warp scheduler 可切到其他 ready warp，藉此隱藏 latency。

- 問：Triton 的替代方案有哪些？
  答：CUDA、PTX、ThunderKittens、CUTE 等不同層級或 DSL。Triton 對 transformer 類 workload 友善，但每種語言都有 inductive bias；PTX 最細但不建議作為第一步。

- 問：高維 tensor 應一次載入還是逐元素處理？
  答：抽象上無法回答，取決於計算性質；需依 access pattern、tile、資料重用與硬體限制分析。

## 從零實作語言模型的意義

本講把「from scratch」從 Python/PyTorch 層往下推到 kernel 層。語言模型不是只有 Transformer 方程式；真正訓練時，GELU、softmax、matmul、attention 都會變成 GPU kernels。若不知道 kernel launch、HBM traffic、fusion、tiling，就無法理解為什麼同樣的數學運算在某些 shape 上很快、某些 shape 上很慢。

對語言模型實作最直接的意義：

- attention 的 softmax 與 matmul 是 reduction 和 tiling 的核心案例。
- MLP 的 linear + activation 適合用 fusion 減少 memory traffic。
- hidden size、head dimension、sequence length、batch size 不只是模型設計參數，也會影響 tile alignment、coalescing、occupancy。
- `torch.compile`、Triton、自寫 kernel、library kernel 的選擇應由 benchmark/profile 驅動。
- FlashAttention 的作業需要理解本講的 row reduction、tiling、online/fused 計算思維；逐字稿結尾明確說本講為 assignment 的 FlashAttention 實作準備素材。

## 跨章連結

- Lecture 2：PyTorch/einops 的 tensor shape、stride、contiguity 是本講 pointer arithmetic 與 memory layout 的前置知識。
- Lecture 4：attention alternatives 中的 attention 計算，會在本講 softmax/matmul/tiling 中得到 kernel 層解釋。
- Lecture 5：GPU/TPU、roofline、operational intensity、tiling、coalescing、FlashAttention 的高階概念，是本講深入寫 kernel 的背景。
- 後續多 GPU：本講結尾說單 GPU kernel 到此為止，下一講會進入 multi-GPU programming；single-GPU memory hierarchy 與 kernel bottleneck 是理解跨 GPU communication 前的基礎。
- Assignment 2：本講提到這些 Triton ingredient 會用於實作 FlashAttention。

## 相關作業與材料佔位

- `data/Stanford CS336 Language Modeling from Scratch/cs336_materials/lectures-main/lecture_06.py`：已下載，待材料階段閱讀。此 worker 依任務要求未讀、不整合。
- `data/Stanford CS336 Language Modeling from Scratch/cs336_materials/lectures-main/var/traces/lecture_06.json`：已下載，待材料階段閱讀；本 worker 未讀。
- `data/Stanford CS336 Language Modeling from Scratch/code/assignment2-systems-main/`：已下載，待材料階段閱讀。此 worker 依任務要求未讀、不整合。

## 資訊不足與待補清單

- 講題包含 XLA，但逐字稿主要談 PyTorch profiling、`torch.compile`、Triton、PTX，未看到系統性 XLA/JAX/XLA compiler pipeline 說明。章節中應標註待材料階段補 XLA。
- 講者展示的實際程式碼、benchmark 數字、profile table、PTX 片段在逐字稿中不完整；需材料階段閱讀 `lecture_06.py` 與 trace 後補精準程式碼與數據。
- swizzling 只被提到用於避免 bank conflict，未展開；不應在初稿中補外部細節。
- softmax by column 的回答帶有即場推測語氣，章節中不應當成正式建議，只可保留「可透過 stride/pointer pattern 改寫，但需驗證」。
- Triton accumulator 實際放 register 或 shared memory 由 compiler 決定；逐字稿未提供確定規則。
- built-in GELU、compiled GELU 的具體 benchmark 數值逐字稿只有口語近似；需材料階段以 notebook/code/trace 確認。
- `lecture_06.py`、trace 與 Assignment 2 repo 均已定位到本地路徑；仍待材料階段閱讀後補精準程式碼與數據。

## 暫不處理的外部補充

- 未搜尋網路。
- 未加入 OpenAI Triton 官方文件、NVIDIA CUDA/PTX 文件、CUTLASS 文件、XLA/JAX 文件、ThunderKittens/CUTE 文件。
- 未加入 FlashAttention 論文或外部教學內容。
- 未加入 Lecture 6 以外材料中的程式碼與 profiling trace。
