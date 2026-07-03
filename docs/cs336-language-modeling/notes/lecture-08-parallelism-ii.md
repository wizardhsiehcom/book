# Lecture 8: Parallelism II 閱讀筆記

## 基本資料

- 課程：Stanford CS336 Language Modeling from Scratch, Spring 2026
- 講次：Lecture 8, Parallelism II
- 逐字稿檔案：`data/Stanford CS336 Language Modeling from Scratch/08 - Stanford CS336 Language Modeling from Scratch ｜ Spring 2026 ｜ Lecture 8： Parallelism.en.txt`
- 完整閱讀範圍：第 1 行到第 2407 行
- 逐字稿總行數：2407
- 閱讀狀態：已完整閱讀逐字稿。未讀投影片、assignment code、外部論文或網頁；相關內容僅依逐字稿中提到的資訊作佔位。

## 本講主問題

本講要回答的是：當語言模型大到單一 GPU 無法承載計算量與記憶體需求時，如何把訓練拆到多 GPU、多節點，甚至多資料中心，同時仍保持高硬體利用率？

這不是單一演算法問題，而是資源配置問題。模型訓練同時受限於：

- 計算量：單一晶片 FLOPs 不足，需要更多 accelerator。
- 記憶體：參數、梯度、optimizer state、activation 都可能放不下。
- 通訊：節點內連線快，節點間或機房間連線慢。
- 批次大小：data parallelism 會消耗 batch size，但 batch size 超過 critical batch size 後，最佳化收益會遞減。

因此，大規模訓練常需要把 data parallelism、ZeRO/FSDP、pipeline parallelism、tensor parallelism、sequence parallelism、expert parallelism、context parallelism 組合起來。

## 核心概念

### 1. Collective communication 是本講的抽象層

講者不從封包或 NIC 細節談起，而是用 collective primitives 做演算法層級的通訊成本分析。最重要的等價關係是：

```text
all-reduce ~= reduce-scatter + all-gather
```

這個等價關係支撐 ZeRO stage 1/2 的「幾乎免費」記憶體節省：原本 data parallelism 需要一次 all-reduce 同步梯度；若改成 reduce-scatter 梯度再 all-gather 更新後參數，通訊量在同一量級。

### 2. 硬體拓撲決定平行化策略

本講區分 intra-node 與 inter-node parallelism：

- 節點內連線快，可以承受高頻、高頻寬的 all-reduce 或 all-to-all。
- 節點間連線慢，適合通訊量較小、點對點的策略，例如 pipeline parallelism。

TPU 與 GPU 的網路哲學在逐字稿中被拿來對比：

- TPU 傳統上偏向 toroidal mesh，鄰居通訊規律，適合規則且可預測的 partition。
- GPU 叢集偏向 fat-tree / all-to-all，對隨機或稀疏路由更有彈性。
- MoE 與 inference workload 使更強的 all-to-all 需求變得重要。

逐字稿也提到 Huawei Ascend 910 一類設計，用大量光纖交換與高功耗換取更大規模連接。這裡的重點不是特定產品評價，而是硬體設計可在晶片效能、網路能力、功耗之間取捨。

### 3. Data parallelism 解決計算，不解決記憶體

最基本的 data parallelism 做法：

1. 將 batch `B` 切成 `M` 份。
2. 每個 GPU 計算自己資料上的完整梯度。
3. 用 all-reduce 同步梯度。
4. 每個 GPU 保留完整模型副本並做同樣的更新。

優點是計算可隨 GPU 數擴展；缺點是每個 GPU 都保留完整參數、梯度與 optimizer state，記憶體沒有變少。

通訊量粗略記為每 step 需要約 `2 * parameters` 的資料交換。

### 4. Optimizer state 讓記憶體比「參數量」更糟

逐字稿強調：訓練記憶體不只是模型參數。常見需要儲存：

- model parameters
- gradients
- 可能的高精度 accumulator
- Adam first moment
- Adam second moment

因此可用粗略規則估計為多份權重副本，逐字稿提到約 `16 bytes / parameter`、約五份相關狀態。Optimizer state 常是最大記憶體來源之一。

### 5. ZeRO stage 1/2/3 與 FSDP

ZeRO 的核心是把原本每張卡都完整持有的狀態切開。

#### ZeRO stage 1

- 切 optimizer state。
- 每個 worker 負責更新一段參數。
- 梯度用 reduce-scatter 分發到負責的 worker。
- 更新後參數用 all-gather 回到所有 worker。
- 因為 `reduce-scatter + all-gather` 與 all-reduce 通訊量等價，所以相對 naive DDP 幾乎不增加通訊。

#### ZeRO stage 2

- 進一步切 gradients。
- backward sweep 時，每算出一層梯度就送到負責的 worker，並釋放不再需要的梯度。
- 不必 materialize 完整梯度向量。
- 通訊量仍與 stage 1 同量級。

#### ZeRO stage 3 / FSDP

- 參數、梯度、optimizer state 全部 sharding。
- 每個 GPU 只在需要某層時 all-gather 該層參數。
- forward 用完就釋放；backward 時再按需 all-gather、計算梯度、reduce-scatter 梯度。
- 通訊為兩次 all-gather 加一次 reduce-scatter，比 stage 1/2 多一次 all-gather。
- 效率依賴 overlap communication and computation。若網路夠快、每層計算量夠大，通訊可被計算掩蔽。

講者特別指出，FSDP 在概念上像 wrapper：每張卡仍執行完整模型的計算流程，但參數不再同時完整存在。

### 6. Batch size 是稀缺資源

Data parallelism 把 batch 切給多張卡，因此可用的 data parallel degree 受 global batch size 限制。不能無限增加 batch size，因為存在 critical batch size：超過某個點後，增加 batch element 的邊際收益低於再做一次 SGD update。

這導致 parallelism 必須消耗多種資源，而不只是「多加 GPU、多加 batch」。

### 7. Pipeline parallelism 沿深度切模型

Pipeline parallelism 把不同層放在不同 GPU 上：

- forward pass 傳 activation。
- backward pass 傳 partial derivatives。
- 通訊量約與 activation 大小有關，可粗略記為 `B * S * H`。
- 通訊是 point-to-point，因此適合慢連線或跨節點。

問題是 pipeline bubble：若只有一個 microbatch，任何時刻幾乎只有一個 stage 在工作，GPU 大量閒置。

解法是用 microbatch pipeline，把 batch 切成多個 microbatches，讓不同 stage 同時處理不同 microbatch。Bubble 比例會隨 microbatch 數增加而下降，逐字稿以「約隨 microbatch size 的倒數下降」描述。

進階排程包括 zero-bubble pipelining。Backward 可分成：

- `B`：向前一層傳播 partial derivatives，會阻塞下一個 pipeline stage，應優先做。
- `W`：計算 weight gradients，是 leaf-like computation，可延後到空檔做。

把 B 與 W 分開排程，可以更好填滿 pipeline bubble。

### 8. Tensor parallelism 沿寬度切矩陣

Tensor parallelism 把矩陣乘法切成多個小矩陣乘法，再用 collective 合併 partial results。它類似 tiling，但跨裝置而非單晶片內。

在 Transformer 中常見切法：

- MLP input projection、attention projections：column-wise split。
- MLP down projection、attention output projection：row-wise split。
- layer norm、非線性、router 等小操作通常複製，不切分。

重要性質：

- 無 pipeline bubble。
- 可降低參數與 activation 記憶體。
- 但每層矩陣乘法附近都需要高頻通訊，常是 all-reduce。
- 通訊量大、頻率高，因此通常只在最快 interconnect 上使用，例如單機 8 GPU 的 NVLink。

TPU mesh 因為拓撲規律，可能支援比 GPU 更大的 tensor parallel domain；GPU 上跨節點 tensor parallelism 通常會明顯變慢。

### 9. Activation memory 不能忽略

逐字稿強調，訓練峰值記憶體常出現在 backward 開始後：activation 尚未完全釋放，gradient 也開始累積。

Activation memory 粗略公式：

```text
activation memory ~= 34 * S * B * H + 5 * A * S / H
```

其中 `S` 是 sequence length，`B` 是 batch size，`H` 是 hidden dimension，`A` 與 attention heads 相關。第二項來自 attention quadratic terms 與 dropout 等，可透過 FlashAttention / recomputation 降低。

Tensor parallelism 可降低 MLP 與 attention 部分 activation，但 layer norm、dropout、residual inputs 等約 `10 * S * B * H` 的項不會自然跟著 tensor parallel degree 下降。

### 10. Sequence parallelism 是 tensor parallel 的 activation 補丁

Sequence parallelism 這個名稱容易誤導；逐字稿說更自然的「沿長序列切」其實常被稱為 context parallel。這裡的 sequence parallelism 是為了補上 tensor parallelism 沒切到的 activation terms：

- 將 lightweight operations 的 activation 沿 sequence axis sharding。
- 需要時 all-gather，算完後 reduce-scatter。
- 概念上類似 FSDP：平時以 sharded form 儲存，需要時 materialize。

結合 tensor parallel、sequence parallel、activation recomputation 後，activation memory 可接近：

```text
activation memory ~= S * B * H * 34 / T
```

其中 `T` 是 tensor parallel degree。這是逐字稿中給出的實用下界感估算，用於手算模型是否能放進 GPU。

### 11. Expert parallelism 是 MoE 的主要切法

MoE 將 FFN/MLP 換成多個 experts，因此可以把 experts 分散到不同裝置：

- 類似 tensor parallelism，都是高頻寬模型平行策略。
- 對 MoE 來說，通常優先用 expert parallelism 而不是 tensor parallelism。
- 原因包括：tensor parallelism 把矩陣切太小會降低 matmul utilization；MoE 本來就需要 sparse token routing，順勢把 token route 到 expert 所在裝置更合理。

困難點：

- token dispatch 是 all-to-all 且 latency-sensitive。
- 每個 MoE layer 都要快速把 token 送到對應 expert。
- 低階實作需要深入 GPU networking / PTX / kernel-level optimization。

逐字稿提到 DeepSeek 的 expert parallel dispatch library、NVIDIA Hybrid EP 等，作為複雜度例子；本 worker 未讀這些外部資料。

### 12. Expert parallelism 與 tensor parallelism 會互相牽制

MoE 只改 MLP，不改 attention。因此：

- attention 仍可能需要 tensor parallelism。
- MoE MLP 更希望用 expert parallelism，且 tensor parallel degree 太高會讓 expert 內矩陣太小。

因此現代系統可能 decouple attention layers 與 MoE layers 的 tensor parallel degree：attention 用較高 TP，MoE 用較低 TP 或偏 EP。

### 13. Context parallelism / ring attention

Context parallelism 或 ring attention 用於長序列，把 activation / context 沿 sequence dimension 切到不同 accelerator。逐字稿只簡述：

- 適合 long context extension 與 serving。
- 原始 ring attention 在 TPU mesh 上展示效果。
- 本講不深入，因為概念與前述 activation sharding、通訊/計算重疊有重疊。

### 14. 3D/4D parallelism 的組合規則

逐字稿給出實務規則：

1. 先用必要的 model parallelism 讓模型放進記憶體。
2. 在最快連線上用 tensor parallelism 或 expert parallelism。
3. 跨慢連線時用 pipeline parallelism 或 FSDP/ZeRO-3。
4. 模型放得下後，把剩餘 GPU 用於 data parallelism。
5. 若 batch size 太小造成 utilization 不佳，可用 gradient accumulation。

Megatron 類指南的概念總結為：

- minimize model parallelism, maximize data parallelism。
- GPU 上 TP/EP 盡量留在 NVLink domain。
- 多節點用 pipeline parallelism。
- MoE 優先 expert parallelism。
- 長序列使用 context parallelism。

## 重要定義、公式、演算法與工程限制

| 主題 | 筆記 |
|---|---|
| all-reduce | 所有 worker 交換並聚合完整張量，DDP 同步梯度的基本操作。 |
| reduce-scatter | 聚合後只把結果切片分給對應 worker。 |
| all-gather | 每個 worker 持有一片，最後收集成完整張量。 |
| ZeRO stage 1 | sharding optimizer state。 |
| ZeRO stage 2 | sharding optimizer state + gradients。 |
| ZeRO stage 3 / FSDP | sharding optimizer state + gradients + parameters。 |
| pipeline bubble | pipeline 中因 stage 等待資料而閒置的時間。 |
| microbatch | 為了填滿 pipeline，把 global batch 切成更小的批次。 |
| tensor parallelism | 切矩陣或 hidden dimension，常在 attention/MLP 的 matmul 周圍通訊。 |
| sequence parallelism | 將 tensor parallel 沒切到的 activation 沿 sequence axis 切開。 |
| expert parallelism | MoE 中把 experts 分散到不同裝置，並 route token。 |
| context parallelism | 長上下文場景沿 sequence/context 切分，常與 ring attention 相關。 |
| critical batch size | batch size 遞增收益開始小於更多 SGD step 的臨界區域。 |

重要公式與估算：

```text
all-reduce ~= reduce-scatter + all-gather
```

```text
DDP communication per step ~= 2 * parameters
```

```text
pipeline activation communication ~= B * S * H
```

```text
activation memory baseline ~= 34 * S * B * H + 5 * A * S / H
```

```text
with tensor + sequence parallel + recomputation:
activation memory ~= 34 * S * B * H / T
```

工程限制：

- FSDP 效率依賴 communication/computation overlap。
- Pipeline parallelism 需要足夠 microbatches，否則 bubble 大。
- Tensor parallelism 通訊頻繁，通常不能跨慢速節點。
- Expert parallelism 的 token dispatch latency 會直接卡住計算。
- Long-context training 會讓 activation memory 成為主要瓶頸。
- 大規模訓練還要處理 GPU failure 與 redundancy；逐字稿提到 Llama 3 405B 訓練期間 GPU failure 次數很多。

## 逐字稿中的例子與問答

### Q: 為什麼特別強調 all-reduce = reduce-scatter + all-gather？

因為 ZeRO stage 1 使用 reduce-scatter 發送各參數 slice 的梯度，再 all-gather 更新後參數。這使它在通訊量上接近 naive DDP，但能節省 optimizer state 記憶體。

### Q: FSDP 是否像 pipeline 一樣把不同層放到不同 GPU？

不是。FSDP 中每張 GPU 仍走完整模型的 forward/backward；差別是任何時刻只 materialize 當前需要的參數 slice。Pipeline parallelism 才是把不同層放在不同 GPU 上。

### Q: FSDP 每層都通訊，為何通訊成本沒有再乘上層數？

操作數量會隨層數變多，但每次通訊的是該層的小片段；加總後對應到整個模型的參數量級。並且通訊可與計算重疊。

### Q: Pipeline parallelism 為何通訊性質好？

它主要傳 activation，量級約 `B * S * H`，且是 point-to-point，不是全域 all-to-all。因此適合慢速連線。

### Q: 為何 activation recomputation 有時反而提升整體利用率？

Recomputation 增加計算，但省下 activation memory；省出的記憶體可換成更大的 batch size，而更大的 batch size 可改善 pipeline 或整體 GPU utilization。

## 從零實作語言模型的意義

Lecture 8 把「從零實作」推到單機之外。前面章節若只寫出 Transformer、loss、optimizer，仍不足以訓練 frontier-scale 或 even moderately large models。真正的訓練系統必須能回答：

- 參數、梯度、optimizer state、activation 分別在哪裡？
- 哪些張量何時 materialize，何時 free？
- 哪些通訊可用 collective 表達？
- 哪些通訊能被計算掩蔽？
- 哪些 parallelism 消耗 batch size，哪些消耗 fast interconnect？
- 模型 dense 或 MoE 時，切法是否應不同？

從零實作的意義不是手寫每個低階 kernel，而是理解系統邊界：同一個 Transformer 數學式，在不同 memory layout、communication topology、parallel sharding 下，可能有完全不同的可訓練規模與成本。

## 跨章連結

- Lecture 5 GPUs/TPUs：本講延續 GPU/TPU 的硬體與網路差異，將其提升到 cluster-level topology。
- Lecture 6/7 parallelism 前置內容：collectives、基礎通訊原語與 parallelism mechanics 是本講 ZeRO/FSDP/TP/PP 的前提。
- Transformer 架構章：tensor parallelism 的 column-wise / row-wise split 直接依賴 attention projection 與 MLP projection 結構。
- Attention / FlashAttention：activation memory 中的 attention quadratic term 可用 recomputation / FlashAttention 類策略降低。
- MoE 章：expert parallelism 只在 MoE 結構下自然成立，且 token routing 使 all-to-all dispatch 成為核心瓶頸。
- Scaling laws 下一講：本講最後銜接到 scaling laws；平行化決定可用 compute 與 utilization，會影響 scaling 實驗是否可行。

## 相關作業與材料佔位

| 材料 | 本次狀態 | 備註 |
|---|---|---|
| `lecture_08.pdf` | 已下載，待材料階段閱讀 | 路徑：`data/Stanford CS336 Language Modeling from Scratch/cs336_materials/lectures-main/lecture_08.pdf`。本 worker 依指示未讀。 |
| Assignment 2 code repo | 已下載，待材料階段閱讀 | 路徑：`data/Stanford CS336 Language Modeling from Scratch/code/assignment2-systems-main`。本 worker 依指示未讀。 |

逐字稿中提到 assignment 會要求學生：

- 實作或理解 FSDP wrapper 的概念。
- 在給定 network topology 與 model 設定下，推算合適 parallelization strategy。
- 做 compute / communication accounting，判斷是否 communication-bound 或 compute-bound。

## 資訊不足與待補清單

- 投影片中的表格、圖片與數值細節未讀，需材料階段從 `lecture_08.pdf` 補齊。
- ZeRO 各 stage 的精確記憶體公式與圖中數值需用投影片核對。
- activation memory 公式中 `5 * A * S / H` 的符號定義需用投影片確認；逐字稿語音轉寫可能有誤。
- Megatron 指南、DeepSeek pipeline / expert parallelism、PyTorch FSDP paper、NVIDIA Megatron Bridge 等均只在逐字稿中被提到，本 worker 未讀原文。
- 各實例訓練設定如 OLMo、DeepSeek V1/V3、Yi、Llama 3、Gemma 2、Mixtral、Nemotron、Qwen 3 等，需後續材料階段用原始報告核對。
- 講者提到 Google 當天公告的 TPU / Ironwood / Virgo network 等硬體資訊，逐字稿可能有轉寫錯字，需材料階段確認名稱與細節。

## 暫不處理的外部補充

依任務要求，本 worker 未使用網路搜尋，也未加入外部資料。以下只列為後續可能由主控 agent 或材料階段處理的補充方向：

- Megatron-LM / Megatron-Core parallelism guideline
- PyTorch FSDP documentation 或 paper
- ZeRO / DeepSpeed 原始論文
- Ring Attention / context parallelism 論文
- DeepSeek V3 technical report 與 DeepEP/DualPipe 相關資料
- Llama 3 report 的 parallelism 與 failure statistics
- NVIDIA Megatron Bridge recipe repository
