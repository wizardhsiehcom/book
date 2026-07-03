# Lecture 7：Parallelism I 閱讀筆記

## 基本資料

- 課程：Stanford CS336 Language Modeling from Scratch, Spring 2026
- 講次：Lecture 7, Parallelism
- 逐字稿檔案：`data/cs336/transcripts/07_Stanford_CS336_Language_Modeling_from_Scratch_Spring_2026_Lecture_7_Parallelism.txt`
- 完整閱讀範圍：第 1 行到第 1980 行
- 總行數：1980
- 閱讀狀態：已完整閱讀逐字稿；本筆記未整合 lecture code、trace、stdout、assignment repo 或外部資料。

## 本講主問題

上一講把視角放在單張 GPU：如何理解 SM、HBM、shared memory、kernel fusion、tiling，以及如何讓單張卡少搬資料、多做有效計算。本講把同一個問題放大到多張 GPU：當參數、activation、gradient、optimizer state 或訓練速度需求超出單張 GPU 時，如何把計算切到多個 rank 上，同時避免跨 GPU 通訊成為瓶頸。

本講的核心問題可以概括成：

1. 多 GPU 訓練中有哪些標準通訊原語？
2. GPU 之間的硬體連線速度如何限制平行化策略？
3. PyTorch distributed 如何把 collective operations 暴露給使用者？
4. data parallelism、tensor parallelism、pipeline parallelism 分別切開什麼，付出什麼通訊代價？
5. 從零實作語言模型時，為什麼不能只知道「多卡比較快」，還要知道資料到底在哪裡、何時被搬動？

## 核心概念

### 1. 多 GPU 的本質仍是資料搬移問題

單 GPU 內，compute units 離資料很遠：資料可能在 HBM，而計算在 SM / tensor cores 上。多 GPU 時，距離更遠：需要的 tensor 甚至可能在另一張 GPU 的 HBM 裡。平行化的主要挑戰不是「把 GPU 數量加上去」，而是讓 computation orchestration 避免 data transfer bottleneck。

逐字稿中反覆強調：使用很多 GPU 很容易，有效使用很多 GPU 很難。

### 2. 記憶體與通訊層級

本講延伸上一講的 memory hierarchy：

- 單 GPU 內：register / shared memory / L1 最快，HBM 相對慢。
- 單節點多 GPU：GPU 之間通常靠 NVLink / NVLink Switch，HBM 在這一講反而被視為「快」。
- 多節點多 GPU：跨節點會走 InfiniBand 或 Ethernet，速度與延遲條件更差。

這個層級直接決定平行策略。需要高頻、大量交換 activation 的策略通常只能放在高速互連內；較能忍受慢互連的策略才適合跨節點。

### 3. rank 與 world size

分散式程式中的 rank 是一個參與通訊與計算的 process/device。在本課脈絡中，可以近似理解為一張 GPU。world size 是 rank 的總數。例如四張 GPU 時，world size = 4，rank 通常是 0, 1, 2, 3。

### 4. collective operations

Collective operation 是分散式程式設計的標準通訊模板。它不要求使用者逐一手寫「rank 0 傳給 rank 1、rank 2 傳給 rank 3」之類的點對點協定，而是以較高層的方式描述一群 rank 之間的資料流動與 reduction。系統或通訊函式庫可以根據硬體拓撲最佳化實際傳輸。

本講介紹的 operations：

- broadcast：某個 rank 的 tensor 複製到所有 rank，常用於初始化或載入 checkpoint 後同步。
- scatter：把一個 rank 上的大 tensor 切成 world size 份，分送到各 rank。
- gather：scatter 的反向，把各 rank 的 pieces 收集到某個指定 rank。
- reduce：把各 rank 的資料用 sum / max / min 等 associative、commutative operation 合併到指定 rank。
- all gather：對所有 rank 做 gather，讓每個 rank 都得到完整拼接結果。
- reduce scatter：先對每個位置做 reduction，再把 reduction 結果分散到不同 rank。
- all reduce：reduce scatter 加 all gather；把各 rank 的 tensor reduction 後，再讓所有 rank 都持有相同結果。
- all to all：每個 rank 可把不同 slice 發給不同 rank，近似矩陣轉置式通訊；在 MoE expert routing 中重要。

### 5. all reduce、reduce scatter、all gather 的關係

all reduce 可以分解成：

```text
all reduce = reduce scatter + all gather
```

這個分解很重要。基本 data parallelism 可直接用 all reduce 同步 gradient；但更進階的 ZeRO / FSDP 會拆開 all reduce 的步驟，介入中間狀態，以管理參數、gradient、optimizer state 的儲存位置，降低單卡記憶體壓力。

### 6. all to all 與 MoE

all to all 是更一般的通訊模式：每個 rank 的不同部分可以送到不同目的 rank。如果把每個 rank 的資料視為一列，目的 rank 視為欄，平衡情況下 all to all 可類比為 transpose。

MoE 中，每個 rank 可能同時持有一部分資料與一部分 experts。router 需要根據 token/activation 動態決定送到哪些 experts，因此會形成 all-to-all 型態的通訊。逐字稿提到，理想狀況是 splits 盡量平衡；這呼應先前 MoE lecture 中的 load balancing。

## 硬體與通訊限制

### NVLink、NVLink Switch、InfiniBand、Ethernet

典型訓練硬體不是普通 PCIe + Ethernet 的桌機形態，而是多張 GPU 透過 NVLink 連到 NVLink Switch。逐字稿提到常見節點可能有 8 張 GPU；較昂貴的新系統可把更大的 GPU domain 透過 NVLink Switch 串起來，例如 NVL72 這類 72 GPU 的 NVLink domain。

粗略層級：

- 同 GPU 內 HBM 很快，但仍慢於 shared memory / L1。
- 同節點 GPU 間 NVLink / NVSwitch 很快，但仍慢於 HBM。
- 跨節點 InfiniBand 速度更低。
- 傳統 Ethernet 更慢，且常引入 CPU 參與與額外 latency。

### RDMA

Remote Direct Memory Access 允許一張 GPU 直接讀寫另一張 GPU 的記憶體，不經由 CPU socket buffer 與傳統 kernel network stack。NVLink / NVSwitch 與 InfiniBand 支援這類能力；傳統 Ethernet 通常不支援。逐字稿也提到 RoCE（RDMA over Converged Ethernet）作為 Ethernet 上繞過 CPU 的進展。

### NCCL

NVIDIA Collective Communications Library（NCCL）把 all reduce、broadcast、reduce 等 collective operations 轉成實際在 GPU 和網路上執行的低階封包與 communication kernels。使用者呼叫 collective 時，NCCL 會根據硬體拓撲與路徑安排傳輸。

本講不深入 NCCL 內部，但把它定位成 PyTorch distributed 與硬體通訊之間的重要層。

## PyTorch distributed 程式模型

本講使用 `torch.distributed` 展示 collective operations。GPU backend 通常是 NCCL；CPU backend 可用 Gloo。課程 code 為了逐行 trace，有特殊 single-process mode；真正執行時會用 multiprocessing，透過 world size 產生多個 process。

重要元素：

- `spawn`：建立 world size 個 process，各自以不同 rank 執行同一段函式。
- master address / port：用於 metadata 與 coordination，不是大量 tensor 資料本身的傳輸路徑。
- `barrier`：同步 barrier，等所有 process 到達同一點；太多 barrier 會造成等待。
- CUDA synchronize：CUDA kernel 本身是 asynchronous，計時或同步前需要確認 GPU work 完成。
- `async_op=True`：collective 可非同步啟動，之後用 wait 或 barrier 確認完成；這是 overlap communication and computation 的基礎。

### 範例：all reduce

每個 rank 先各自有不同 tensor，例如 rank 0 有 `[0,1,2,3]`，rank 1 有 `[1,2,3,4]` 等。呼叫 all reduce with sum 後，每個 rank 都得到逐元素加總後的相同 tensor。

data parallelism 中，gradient synchronization 就是這種模式：每個 rank 用不同 data shard 算出不同 gradient，再 all reduce / average，使所有 rank 的 gradient 一致。

### 範例：reduce scatter 與 all gather

reduce scatter 會把各 rank 的輸入先逐位置 reduce，再把結果分散到不同 rank。all gather 則把各 rank 持有的分片收集到每個 rank。示範中可看出：

```text
all reduce 的效果 = 先 reduce scatter，再 all gather
```

### effective bandwidth

本講也示範如何 benchmark collective。計時時要處理兩層非同步：CUDA kernel 非同步與多 process 非同步。有效 bandwidth 的估計方式類似前面 MFU 的精神：用「理論上搬了多少 bytes」除以「實際 wall-clock duration」。

逐字稿給出 all reduce 的 sent bytes 估計概念：

```text
sent_bytes ≈ size_bytes * 2 * (world_size - 1)
total_duration ≈ world_size * duration
effective_bandwidth ≈ sent_bytes / total_duration
```

當 world size 變大時，`(world_size - 1) / world_size` 接近 1，因此可粗略視為 `2 * size_bytes / duration`。reduce scatter 與 all gather 各自約是 all reduce 的半邊工作；all reduce 移動約兩倍資料，也約花兩倍時間，因此有效 bandwidth 可能相近。

## 三種平行化策略

### Data parallelism

Data parallelism 切的是 batch 維度。每個 rank 持有完整模型參數，但只處理 batch 的一部分。

流程：

1. 把 batch rows 切成 world size 份。
2. 每個 rank 對自己的 local batch 做 forward。
3. 每個 rank 做 backward，得到自己的 gradient。
4. 對每個 parameter 的 gradient 做 all reduce，通常再除以 world size 取平均。
5. 每個 rank 用同步後相同的 gradient 更新自己的完整參數。

這種方法優雅之處在於 forward/backward 幾乎不需要知道模型內部結構；只要在 backward 後插入 gradient synchronization。不同 rank 的 loss 與原始 gradient 會不同，但 all reduce 後 gradient 一致，因此參數也會保持一致。

限制：

- 每張 GPU 都要放完整 parameters、gradients、optimizer state。
- batch size 至少要大於等於 world size，且最好能整除 world size。
- 當 global batch size 繼續放大但已超過 critical batch size，額外 data parallelism 可能無法轉成有效訓練收益。

### Tensor parallelism

Tensor parallelism 切的是 layer 內部的 tensor/parameter。例如 column tensor parallelism 會把矩陣的 columns 分到不同 rank。每個 rank 只保存每層參數的一部分，但計算一層後需要把部分 activation 收集回完整 activation，才能進入下一層。

本講的簡化 MLP 例子：

- data 在每個 rank 上完整存在。
- 每個 rank 只持有每層 weight 的一部分，例如 `num_dim x local_num_dim`。
- forward 時，每個 rank 算出 partial activation。
- 用 all gather 把各 rank partial activation 收集並 concat 成完整 activation。
- backward 時，all gather 與 reduce scatter 形成對偶：forward 若 all gather，backward 需要 reduce scatter。

與 data parallelism 相比，tensor parallelism 需要深入模型內部，因為你必須知道矩陣乘法可如何拆分、activation 何時需要 gather。這也代表它通訊更頻繁：每層都可能搬 activation。因此它通常適合在 NVLink / NVSwitch 這種高速 domain 內使用。

### Pipeline parallelism

Pipeline parallelism 切的是 layers。每個 rank 持有連續的一段 layers，每層本身是完整維度。前一個 rank 做完自己的 layers 後，把 activation 傳給下一個 rank。

本講簡化 MLP 例子：

- `local_num_layers = num_layers / world_size`
- 每個 rank 只初始化自己負責的 layers。
- rank 0 取得 data，切成 micro batches。
- 每個 rank 對每個 micro batch：從前一 rank receive，跑自己的 local layers，再 send 給下一 rank。

pipeline parallelism 的主要問題是 pipeline bubbles：某些 rank 在等前一段資料或等下一段處理，導致 GPU 閒置。micro batches 的目的就是把大 batch 切小，使 pipeline 能更密集地填滿。更進階實作還要重疊 communication 與 computation，例如一邊算目前 micro batch，一邊收下一個或送上一個。

pipeline parallelism 通常比 tensor parallelism 更能忍受慢一點的 interconnect，因為它的通訊頻率與形態不同；但要降低 bubbles 與管理 schedule，工程複雜度很高。

## 重要問答與提醒

- `broadcast` 是否和 NumPy broadcasting 有關？概念上都是「一份東西到多處」，但本講的 broadcast 是跨 device 的 collective communication，不是 tensor shape broadcasting。
- gather/reduce 的目標 rank 是否必然是 rank 0？不是；呼叫 collective 時可指定目標 rank。課堂例子用 rank 0 只是方便說明。
- collective operations 只是概念還是真的有 code？兩者都是。本講先畫概念圖，再用 PyTorch distributed 實作。
- rank 在本課是否就是 GPU？在本課脈絡中可以這樣理解。
- async collective 如何工作？呼叫後啟動底層 communication / CUDA kernels 並返回，程式可做其他工作；需要結果時再 wait 或同步。
- DDP 是否只適用 MLP？不是。DDP 不太關心 forward pass 內部，Transformer 也可同樣在 backward 後同步 gradient。
- Tensor parallelism 的 backward 是否 autograd 自動處理？本課從零實作的簡化版本需要自己管理 communication；實務框架可能封裝這些細節。

## 從零實作語言模型的意義

本講很符合「from scratch」的精神：不是只呼叫高階 FSDP/DDP 包裝器，而是拆開看每個 collective 在做什麼。這讓讀者能回答訓練大模型時真正關鍵的問題：

- 哪些 tensor 被 replicate？
- 哪些 tensor 被 shard？
- 哪些 tensor 每一步都需要跨 GPU 搬？
- communication 是否可以與 computation overlap？
- 目前瓶頸是 HBM、NVLink、InfiniBand、Ethernet，還是 Python / synchronization？
- 為什麼同樣是「多卡」，data parallel、tensor parallel、pipeline parallel 對硬體要求完全不同？

對語言模型訓練而言，這些問題直接影響最大可訓練模型大小、吞吐量、batch size、optimizer state 記憶體占用與整體成本。

## 跨章連結

- Lecture 5 GPUs/TPUs：本講把單 GPU 的 memory hierarchy 延伸到多 GPU 的 communication hierarchy。
- Lecture 6 kernels/Triton/XLA：上一講的核心是減少 HBM 往返；本講的核心是減少跨 GPU 往返。
- Transformer / MLP：本講用 MLP 示範 parallelism，因為 MLP 是 Transformer 中重要 compute bottleneck；完整 Transformer 會有更多 bookkeeping。
- MoE 相關章節：all-to-all 與 expert routing、load balancing 直接相關。
- 後續 Parallelism II：本講只講 DDP，下一講預告會深入 FSDP / ZeRO 與更進階 parallelism。
- Scaling laws / training efficiency：data parallelism 受 critical batch size 限制，不能無限靠增大 batch 換取有效學習進度。
- Inference 章節：多 GPU 的資料位置與通訊瓶頸也會影響 inference serving，但本講主要討論 training。

## 相關作業與材料佔位

依本 worker 任務要求，以下材料只列狀態，不閱讀、不整合：

| 材料 | 狀態 | 本階段處理 |
|---|---|---|
| `data/cs336/lectures material/lecture_07.py` | 已下載，待材料階段閱讀 | 未讀、不整合 |
| `data/cs336/lectures material/var/traces/lecture_07.json` | 已下載，待材料階段閱讀 | 未讀、不整合 |
| `data/cs336/lectures material/var/traces/lecture_07_stdout.txt` | 已下載，待材料階段閱讀 | 未讀、不整合 |
| `data/cs336/code/assignment2-systems-main/` | 已下載，待材料階段閱讀 | 未讀、不整合 |

逐字稿中與 Assignment 2 有關的線索：

- 會實作或練習 `torch.distributed` collective operations。
- 會探索 communication / computation overlap。
- 可能會組合不同 parallelization techniques。

這些僅為逐字稿中提及的方向，細節需材料階段閱讀 assignment repo 與 handout 後確認。

## 資訊不足與待補清單

- Lecture 7 code 的實際函式、wrapper、single-process mode 細節尚未閱讀。
- trace JSON 與 stdout 尚未閱讀，尚未核對課堂執行輸出、benchmark 數字與示例 tensor。
- Assignment 2 code repo 尚未閱讀，無法確認作業要求、API、測試與應實作的 parallelism 組合。
- 逐字稿對 NCCL、RDMA、RoCE、NVL72 等只做高層說明；若正式書稿要加硬體細節，應由主控 agent 在材料或引用階段補來源。
- 逐字稿對 TPU / JAX sharding 只略談，且講者表示部分細節不熟；不應在本 worker 階段擴寫。
- Pipeline parallelism 的 scheduling、bubble 公式、1F1B 等未在本講完整展開，需待後續 lecture 或材料階段補充。
- FSDP / ZeRO 僅被預告，不在本講完整處理。

## 暫不處理的外部補充

本階段未使用外部資料，也不補入逐字稿以外資訊。以下主題即使與本講相關，也先不展開：

- NCCL 內部 ring/tree algorithm 實作細節。
- NVIDIA NVLink / InfiniBand / RoCE 官方規格。
- PyTorch DDP/FSDP 官方文件。
- Megatron-LM tensor/pipeline parallelism 實作。
- DeepSpeed ZeRO paper 與作業之外的 ZeRO 細節。
- TPU/JAX sharding compiler 的正式語意。
