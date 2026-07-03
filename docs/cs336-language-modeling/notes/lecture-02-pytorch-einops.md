# Lecture 2 閱讀筆記：PyTorch (einops)

## 基本資料

- 課程：Stanford CS336 Language Modeling from Scratch, Spring 2026
- 講次：Lecture 2
- 主題：PyTorch、einops、resource accounting
- 逐字稿：`data/cs336/transcripts/02_Stanford_CS336_Language_Modeling_from_Scratch_Spring_2026_Lecture_2_PyTorch_eino.txt`
- 完整閱讀範圍：第 1 行到第 2080 行
- 外部資料：未使用。本文只根據逐字稿整理。

## 本講主問題

本講把「從零訓練語言模型」拆成一個工程問題：在有限的 compute、memory 和時間預算下，如何理解一段 PyTorch 程式真正花掉多少資源。講者希望學生養成 resource accounting 的習慣，也就是看到一個 tensor operation、training loop 或 optimizer state 時，能估算它需要多少 bytes、多少 flops、可能是 memory bound 還是 compute bound。

開場用兩個問題建立尺度感：

- 訓練 70B 參數模型、15T tokens、1024 張 H100，大約要多久？粗估公式會用到 `6 * parameters * tokens`、硬體 FLOPS/s 與 MFU。
- 8 張 80GB H100 用 AdamW 最多可容納多大模型？粗估要看每個參數除了權重以外，還有梯度與 optimizer states，常見估法是每參數約 `2 + 2 + 4 + 4` bytes，但尚未計入 activations。

## 核心概念

### Tensor 是所有訓練狀態的共同底層

參數、梯度、optimizer state、資料、activation 都是 tensor。Tensor 的儲存成本是：

```text
memory bytes = number of elements * bytes per element
```

浮點 precision 直接決定 bytes per element，也會影響硬體可達到的吞吐量。

### 浮點格式與 mixed precision

- FP32：32 bits，1 sign bit、8 exponent bits，其餘為 mantissa。每個值 4 bytes，穩定但記憶體與速度成本高。
- FP16：16 bits，exponent 較少，dynamic range 差，訓練時容易 underflow、overflow、NaN。
- BF16：同樣 16 bits，但保留 FP32 等級的 exponent range，犧牲 mantissa resolution。深度學習通常更需要 dynamic range，因此 BF16 成為常用折衷。
- Mixed precision：常見做法是 parameters、activations、gradients 用 BF16，optimizer states 用 FP32。PyTorch AMP 可在相對安全的運算中自動轉型，例如 matmul 通常可用 BF16，某些 exponentiation 類運算則保留 FP32。
- FP8/FP4：逐字稿只作趨勢說明。更低 precision 需要硬體與軟體棧配合，FP4 常搭配 block scaling，不等於每個值都能獨立覆蓋完整 dynamic range。

問答重點：低 bit training 和低 bit inference 不同。先用 BF16 等格式訓練，再量化到一兩 bit 供 inference，比直接訓練 one-bit language model 容易得多。

### einops/einsum：用命名維度取代脆弱的 transpose

講者用 einsum 的主要動機不是速度，而是可讀性與正確性。一般 PyTorch 寫法容易出現 `transpose(-2, -1)` 這類需要腦中推理維度位置的程式；einsum/einops 用維度名稱讓 tensor contract 明確化。

基本規則：

- 輸入和輸出都標上維度名稱。
- 出現在左邊但沒有出現在右邊的維度會被 sum out。
- `...` 可代表任意 batch 維度，使程式能處理 batch、sequence、head 等多個前綴維度。

重要操作：

- `einsum`：廣義矩陣乘法與 contraction。
- `reduce`：把 sum、mean、max、min 等 reduction 用命名維度表示。
- `rearrange`：把 flatten 的維度拆開，或把多個維度合併。括號表示維度乘積，例如把 hidden 拆成 `heads * hidden_per_head`。拆分時必須指定足夠資訊，例如 heads 數量。

問答重點：einops 通常只是語法糖，底層仍落到同類 primitive operation，不應期待額外 speedup。二維 flatten 成一維時的順序由 pattern 中的維度順序指定。

### Flops、FLOPS/s 與 MFU

講者特別區分：

- flops：floating point operations 的數量，表示一個演算法或模型做了多少浮點運算。
- FLOPS/s：每秒可執行多少 floating point operations，表示硬體速度。

矩陣乘法是主要成本。若 `X` 是 `B x D`，`W` 是 `D x K`，則 forward matmul 約需：

```text
flops ~= 2 * B * D * K
```

其中 2 來自 multiply 與 add。元素級操作如 addition 是 `N*M` 等級，通常不如大型 matmul 昂貴。

實際硬體測量時要注意 GPU 非同步執行，計時前後需要 synchronize。Model FLOPs Utilization 定義為：

```text
MFU = actual FLOPS/s / promised FLOPS/s
```

現代模型若 MFU 約 0.5 已屬不錯；純大型 matmul 可能更高，但一般模型會被記憶體搬移、kernel overhead、非 matmul 操作等拉低。

### Arithmetic intensity 與 memory bound / compute bound

只算 flops 不夠，因為資料必須從 HBM 搬到 accelerator，再把結果寫回。時間由 compute speed 與 memory bandwidth 共同決定。講者用簡化假設：communication 和 computation 可重疊，因此總時間近似兩者最大值。

Accelerator intensity：

```text
accelerator intensity = peak FLOPS/s / memory bandwidth
```

Algorithm arithmetic intensity：

```text
arithmetic intensity = flops / bytes moved
```

判斷：

- 若 algorithm intensity 小於 accelerator intensity，通常 memory bound。
- 若 algorithm intensity 大於 accelerator intensity，通常 compute bound。

例子：

- ReLU：讀入 BF16 向量、寫回 BF16 向量，但每元素只做一次比較，intensity 很低，memory bound。
- GELU：每元素約 20 flops，但 bytes moved 類似 ReLU，intensity 仍遠低於 H100 等級 accelerator intensity，仍 memory bound。
- Dot product：讀兩個向量、寫 scalar，約 `2N` flops，但搬移約 `4N` bytes，仍 memory bound。
- Matrix-vector product：讀矩陣成本大，intensity 仍偏低，memory bound。
- Matrix-matrix multiplication：搬移 `O(N^2)`，計算 `O(N^3)`，intensity 約隨 `N` 成長；足夠大的矩陣會 compute bound。

這也是為什麼大型 batch、大型矩陣對 GPU 友善。Transformer 訓練主要由大型矩陣乘法構成，因此能有較高 arithmetic intensity；但 inference 一次產生一個 token，較像 matrix-vector product，容易 memory bound。

Roofline plot 用圖形化方式表達同一件事：低 arithmetic intensity 區域受記憶體頻寬限制，隨 intensity 增加可達到更高實際 FLOPS/s；超過某點後進入 compute bound，受 peak FLOPS/s 限制。

### Forward、backward 與 `6 * data points * parameters`

講者用簡化深層網路說明計算量。每層是 `D x D` 矩陣乘法加上 element-wise activation。

對單一 linear layer：

- forward pass：一次 matmul。
- backward pass 要算兩種梯度：
  - 對輸入 activation 的梯度，用來把訊息往前一層傳。
  - 對參數的梯度，用來更新權重。

這兩個 backward matmul 各自大致和 forward 同成本，因此 backward 約為 forward 的兩倍。合計：

```text
forward ~= 2 * data points * parameters
backward ~= 4 * data points * parameters
training ~= 6 * data points * parameters
```

這解釋了常見的 `6ND` 粗估。對 Transformer 在 context length 不太大時也是好近似；若 context length 很大，attention 的 context-length-squared 成本會變重要。

### Optimizer state 與訓練記憶體

訓練時不只存參數，也要存 activations、gradients 和 optimizer states。

簡化深層網路中：

- parameters：每層 `D^2`，共 `L` 層；若 BF16，每參數 2 bytes。
- activations：和 batch size、hidden dimension、layers 成正比；BF16 每值 2 bytes。
- gradients：大致是參數的一份 copy，通常也可用 BF16。
- optimizer states：常用 FP32，AdaGrad 存一份 squared gradient accumulator，約每參數 4 bytes；Adam/AdamW 存一階與二階 moment，約每參數 8 bytes。

Optimizer state 對能否放進 HBM 很重要，但通常不是主要計算瓶頸。

### Gradient accumulation

大 batch size 有助於訓練穩定性，但 activation memory 隨 batch size 增加。Gradient accumulation 的做法是把大 batch 切成多個 micro-batch：

- 每個 micro-batch 做 forward/backward，累積 `.grad`。
- 不立即 `zero_grad`。
- 累積到目標 batch size 後才做 optimizer step，然後清空梯度。

這用較小 activation footprint 模擬較大 batch。

### Activation checkpointing / rematerialization

訓練時 backward 需要 forward 的中間 activations，因此預設會存所有層的 activations。Activation checkpointing 的核心是用 compute 換 memory：

- forward 只保留部分 checkpoint activations。
- backward 時從最近 checkpoint 重新計算缺失的中間 activations。

若對 block 使用 `torch.utils.checkpoint`，可以不存 block 內部某些中間值，例如 linear 前後、ReLU 前後，省下 activation memory。極端情況下若完全不存中間層，記憶體最低但重算成本可能到 `L^2`。折衷策略是每隔約 `sqrt(L)` 層存 checkpoint，使 activation memory 與 recomputation overhead 都約為 `sqrt(L)` 等級。

## 從零實作語言模型的意義

本講不是教一組 PyTorch API，而是把「模型訓練」變成可估算的工程物件。從零實作 tokenizer、Transformer、optimizer、training loop 時，學生必須知道每個 tensor 為何存在、shape 是什麼、dtype 是什麼、forward/backward 會產生哪些額外狀態，以及這些狀態如何消耗 HBM 和 wall-clock time。

這種能力直接支撐後續任務：

- 選 batch size 與 micro-batch size。
- 判斷 OOM 是參數、activation 還是 optimizer state 造成。
- 推估模型規模、資料量與訓練時間。
- 理解為什麼大型 matmul 是 GPU 友善工作負載。
- 理解 inference 與 training 的瓶頸不一樣。

## 跨章連結

- Lecture 1：前一講介紹 tokenization 與課程全貌。本講延續「有限資源下最大化訓練效率」這個總目標。
- Lecture 3 architectures：本講預告 Transformer 架構會把大型矩陣乘法放在核心，因此 arithmetic intensity 對架構設計很重要。
- GPU/TPU 與 kernels：本講只用簡化硬體模型說 HBM、accelerator、bandwidth、FLOPS/s；後續會更深入討論 GPU 與 benchmarking。
- Parallelism：本講先不處理跨 GPU communication overhead，但 MFU 與 memory movement 的概念會是 parallelism 分析基礎。
- Inference：本講預告 inference 的 one-token-at-a-time matrix-vector 型態更容易 memory bound。
- Scaling laws：開場提到 iso-flops curve、compute optimal point 與 scaling law；本講的 flops accounting 是 scaling law 成本軸的基礎。

## 暫不處理的外部補充

- 未查 H100、B200、NVIDIA Transformer Engine、FP8/FP4、NVFP4、NeMo 等外部資料。
- 未補 PyTorch AMP、einops API、torch.utils.checkpoint 的官方文件。
- 未加入 CS336 assignment 的細節或程式碼。
- 未校正逐字稿中講者口誤或投影片 typo，僅在筆記中保留其課堂脈絡，例如 optimizer state 記憶體公式講者提到需修正為 number of parameters。
