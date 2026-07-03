# Parallelism I

## 導讀

前面幾講把訓練語言模型的效能問題一路推到硬體底層：GPU 有很多算力，但資料不會自己出現在 tensor core 旁邊。單張 GPU 上，我們要避免反覆讀寫 HBM；多張 GPU 上，同一個問題變成：資料可能在另一張 GPU，甚至另一個節點上。

這一講的主題是多 GPU parallelism。它不是單純把 GPU 數量加倍，速度就跟著加倍；真正的問題是如何切分資料、參數與計算，並用正確的通訊模式把必要的資訊送到必要的位置。換句話說，多 GPU 訓練的基本功，是理解「什麼被複製、什麼被切開、什麼每一步都要通訊」。

本章先介紹 collective operations，也就是多 GPU 程式設計常用的通訊原語；再看 GPU 之間的硬體連線如何限制可行策略；最後用 MLP 訓練流程說明 data parallelism、tensor parallelism、pipeline parallelism 三種基本切法。

## 從一張 GPU 到很多張 GPU

在單 GPU 中，compute units 與資料之間已經有距離：register、shared memory / L1、L2、HBM 形成一層層記憶體階層。上一講的 kernel fusion、tiling、memory coalescing，本質上都是為了少搬資料、讓資料在較快的層級多停留一點。

多 GPU 只是把這個問題放大。若模型太大，單張 GPU 的 HBM 放不下 parameters、activations、gradients 或 optimizer state，就必須把它們切到多張 GPU。即使模型放得下，也可能為了更快訓練而使用更多 GPU。但只要跨 GPU，通訊就會介入：你省下的計算時間，可能被資料傳輸吃掉。

因此，多 GPU 訓練有兩個常見動機：

1. 單張 GPU 記憶體不夠，必須分散儲存。
2. 單張 GPU 算得太慢，希望分散計算加速。

這兩個動機常常同時存在，但工程取捨不同。若只是為了加速，可能願意複製參數以減少複雜度；若是模型根本放不下，就必須更積極地 shard 參數、gradient 或 optimizer state。

## Collective Operations

分散式訓練不會讓使用者手寫每一對 GPU 之間的封包傳輸。實務上，我們使用 collective operations：一組跨 rank 的標準通訊模板。rank 可以理解為一個 process 或 device；在本課脈絡中，通常就是一張 GPU。world size 則是參與訓練的 rank 總數。

幾個基本操作如下。

`broadcast` 是把某個 rank 上的 tensor 複製到所有 rank。它常用在初始化，例如載入 checkpoint 後，把同一份參數發給所有 GPU。它不是訓練主循環中最重的操作，但很適合用來理解「一對多」的通訊。

`scatter` 是把一個 rank 上的大 tensor 切成多份，分散到各 rank。`gather` 則是反向操作：把各 rank 的分片收集到某個指定 rank。

`reduce` 是把各 rank 的資料用某種 reduction 合併，例如 sum、max、min。若每個 rank 各有一個 gradient shard，reduce with sum 就是把它們加總到某個 rank。

這些操作是基礎，但語言模型訓練更常看到的是下面三個。

`all gather` 是對所有 rank 做 gather：每個 rank 最後都拿到完整拼接結果。當參數或 activation 被切開，但某一步需要完整 tensor 時，就會用到它。

`reduce scatter` 是先 reduce，再把結果分散回各 rank。這在 gradient 或 sharded state 的處理中很重要。

`all reduce` 則可以看成：

```text
all reduce = reduce scatter + all gather
```

它先把各 rank 的 tensor 做 reduction，再讓每個 rank 都得到同一份 reduction 結果。最經典的用途是 data parallel training 的 gradient synchronization：每張 GPU 用不同資料算出 gradient，然後用 all reduce 把 gradient 平均成一致結果。

最後，`all to all` 是更一般的通訊型態：每個 rank 可以把不同 slice 送到不同 rank。在平衡情況下，它有點像把一個以 rank 為列與欄的矩陣轉置。這種模式對 MoE 很重要，因為 token 或 activation 會依 router 結果送到不同 experts。

## 硬體決定通訊成本

多 GPU 訓練不能只看 GPU 數量，還要看 GPU 怎麼連。

同一張 GPU 內，HBM 在上一講被視為慢；但到了多 GPU 世界，HBM 已經算快。GPU 之間若在同一節點，通常可以透過 NVLink 與 NVLink Switch 連接。這比跨節點通訊快很多，但仍慢於單 GPU 內的 HBM。

跨節點時，通訊可能走 InfiniBand；再往更大規模，可能會遇到 Ethernet。傳統 Ethernet 常需要 CPU 參與資料搬移，會帶來更高 latency。RDMA 的意義就在於讓一張 GPU 可以直接讀寫另一張 GPU 的記憶體，避免資料繞過 CPU network stack。NVLink / NVSwitch 與 InfiniBand 支援這類能力；RoCE 則是在 Ethernet 上提供 RDMA 的方向。

在軟體層，NCCL 負責把 all reduce、broadcast、reduce 等 collective operations 轉成實際的 GPU communication kernels 與網路傳輸。使用者在 PyTorch 中呼叫 `torch.distributed`，底層可能由 NCCL 根據硬體拓撲安排資料路徑。

這帶來一個重要原則：parallelism strategy 要配合硬體。需要每層交換大量 activation 的 tensor parallelism 通常適合放在 NVLink domain 內；可以忍受較慢連線的 pipeline parallelism，才比較可能跨較慢的 interconnect。

## PyTorch Distributed 的基本程式模型

`torch.distributed` 提供 collective operations 的高階介面。GPU 訓練常用 NCCL backend；CPU 或教學示例可用 Gloo backend。

一個分散式程式通常會用 multiprocessing 產生 world size 個 process。每個 process 有自己的 rank，執行同一段程式，但依 rank 處理不同資料或參數分片。

幾個同步概念很關鍵。

`barrier` 是 process 間同步點。所有 rank 都到達 barrier 後，程式才繼續。它能讓示例輸出更容易理解，但過度使用會造成等待。

CUDA kernel 本身也是 asynchronous。也就是說，Python 執行到下一行時，GPU 上的工作不一定已完成。因此做 benchmark 或需要嚴格同步時，要處理 CUDA synchronize 與 distributed barrier 這兩層非同步。

collective operation 也可以非同步啟動。這讓程式有機會在通訊進行時做別的計算，例如一邊傳送某些 gradient，一邊繼續 backward 其他層。這種 communication / computation overlap 是多 GPU 效能工程中的重要技巧。

## Data Parallelism：切資料

Data parallelism 是最容易理解、也最模組化的平行化方式。每個 rank 都持有完整模型，但 batch 被切開。若 world size 是 4，一個 batch 可按 row 切成四份，每張 GPU 只處理自己的 local batch。

訓練流程如下：

1. 每個 rank 用自己的資料分片做 forward。
2. 每個 rank 做 backward，得到本地 gradient。
3. 對每個 parameter 的 gradient 做 all reduce，通常再除以 world size 取平均。
4. 每個 rank 用相同 gradient 更新自己的完整參數。

這裡的關鍵是：loss 可以不同，原始 gradient 可以不同，但 all reduce 後每張 GPU 都有相同 gradient，所以參數會保持同步。從程式結構看，data parallelism 幾乎不需要修改模型本身；它只是在 backward 後插入 gradient synchronization。

這也是 Distributed Data Parallel 的優雅之處。它不太在意 forward pass 是 MLP、Transformer 還是其他網路，只要能取得參數 gradient，就能同步。

但 data parallelism 的限制也很明顯：每張 GPU 都要放完整參數、完整 gradient 與 optimizer state。若模型本身放不下，單純 DDP 就不夠。這也是下一講會走向 FSDP / ZeRO 的原因：把 all reduce 拆成 reduce scatter 與 all gather，中間介入 state 的儲存與重建。

另一個限制是 batch size。local batch 至少要有資料，global batch 通常也希望能被 world size 整除。當 data parallelism 擴太大，global batch 可能超過 critical batch size；再增加 batch 不一定改善訓練效率，反而只是浪費 compute。

## Tensor Parallelism：切矩陣

Tensor parallelism 不切資料，而是切 layer 內的 tensor。以一個 MLP layer 的矩陣乘法為例，可以把 weight matrix 的 columns 分到不同 rank。每個 rank 只負責算出 activation 的一部分。

在 column tensor parallelism 中，每個 rank 持有 `num_dim x local_num_dim` 的 weight shard。forward 時，各 rank 都用輸入資料乘上自己的 weight shard，得到 partial activation。由於下一層通常需要完整 activation，因此接著要 all gather，將各 rank 的 partial activation 收集並 concat 成完整 tensor。

這和 data parallelism 有一個根本差異：data parallelism 把模型當黑盒處理；tensor parallelism 必須理解模型內部的矩陣形狀與 layer 結構。它要知道哪個維度可切、何時要 all gather、backward 時何時要 reduce scatter。

代價是通訊更頻繁。每一層都可能需要搬 activation，而 activation 往往很大。因此 tensor parallelism 通常只適合在高速互連內做，例如同一節點的 NVLink / NVSwitch domain。把它放到慢速跨節點網路上，通訊成本很容易壓過計算收益。

## Pipeline Parallelism：切層

Pipeline parallelism 切的是模型深度。假設有多層 MLP，rank 0 負責前幾層，rank 1 負責中間幾層，rank 2 負責後面幾層。資料先進 rank 0，算完後把 activation send 給 rank 1，再一路傳下去。

這種切法自然解決了「單張 GPU 放不下所有層」的問題，因為每個 rank 只持有一部分 layers。但它帶來另一個問題：pipeline bubbles。

若一次只送整個 batch，rank 1 必須等 rank 0 算完，rank 2 又要等 rank 1 算完。很多時間裡，部分 GPU 其實在等待。micro batching 的目的就是把 batch 切成更小的 micro batches，讓 pipeline 可以更密集地填滿：當 rank 1 處理第一個 micro batch 時，rank 0 可以繼續處理第二個。

實務上，pipeline parallelism 還需要重疊通訊與計算。理想情況下，一個 rank 在計算目前 micro batch 的 local layers 時，同時接收下一個 activation 或傳送上一個 activation。否則 send/receive 仍會造成大量等待。

相比 tensor parallelism，pipeline parallelism 有時能容忍較慢的 interconnect，因為它不是每一層內都要做 dense activation gather。但它的 scheduling、bubble 控制與 backward 管理會變得複雜。

## 工程取捨

三種 parallelism 可以用一句話區分：

- data parallelism 切 batch，模型完整複製。
- tensor parallelism 切 layer 內部 tensor，頻繁交換 activation。
- pipeline parallelism 切 layers，靠 micro batches 填滿 pipeline。

它們不是互斥的。大模型訓練常會組合使用：例如同一節點內做 tensor parallelism，節點間做 data parallelism 或 sharded data parallelism；必要時再加 pipeline parallelism 分散 layers。

選擇策略時，要同時看記憶體與通訊：

- 若模型可完整放在每張 GPU，DDP 最簡單。
- 若模型放不下，但高速互連足夠，tensor parallelism 可切開大矩陣。
- 若模型深度很大或跨較慢節點，pipeline parallelism 可能更合理。
- 若 optimizer state 與參數記憶體才是主要壓力，FSDP / ZeRO 會比純 DDP 更重要。
- 若通訊可以與計算 overlap，同樣的 collective cost 對 wall-clock time 的影響會降低。

這些取捨也延續前面幾講的核心模式：可以重算、可以儲存、也可以把資料放到另一張 GPU。每一種選擇都只是用 compute、memory、communication 中的一項去換另一項。

## 常見誤解

第一個誤解是「GPU 越多一定越快」。GPU 數量只代表潛在算力；如果每一步都在等跨節點通訊，實際利用率可能很差。

第二個誤解是「all reduce 只是把 gradient 加起來」。概念上是，但工程上它代表大量跨 GPU 資料搬移。理解 all reduce 可以拆成 reduce scatter 與 all gather，是理解 FSDP / ZeRO 的前置概念。

第三個誤解是「data parallelism、tensor parallelism、pipeline parallelism 只是三種 API」。它們其實是三種不同的切分模型：切資料、切矩陣、切層。每一種都改變了資料放置與通訊型態。

第四個誤解是「tensor parallelism 可以隨便跨節點做」。tensor parallelism 往往每層都要 all gather 或 reduce scatter activation，對互連頻寬很敏感，通常需要很快的 NVLink / NVSwitch。

第五個誤解是「pipeline parallelism 只要把 layers 平均分給 GPU」。平均分層只是開始；真正困難的是 bubble、micro-batch schedule、send/receive、以及 communication / computation overlap。

## 相關作業與材料

本講逐字稿提到 Assignment 2 會讓學生更實際地接觸 distributed communication 與 parallelism，尤其是 collective operations、不同 parallelization techniques 的組合，以及 communication / computation overlap。

依本章 worker 階段規則，以下材料只列狀態，不閱讀、不整合：

| 材料 | 狀態 |
|---|---|
| `data/Stanford CS336 Language Modeling from Scratch/cs336_materials/lectures-main/lecture_07.py` | 已下載，待材料階段閱讀 |
| `data/Stanford CS336 Language Modeling from Scratch/cs336_materials/lectures-main/var/traces/lecture_07.json` | 已下載，待材料階段閱讀 |
| `data/Stanford CS336 Language Modeling from Scratch/cs336_materials/lectures-main/var/traces/lecture_07_stdout.txt` | 已下載，待材料階段閱讀 |
| `data/Stanford CS336 Language Modeling from Scratch/code/assignment2-systems-main/` | 已下載，待材料階段閱讀 |

因此，本章目前只根據逐字稿建立初稿。程式細節、stdout 數字、trace 行為與 assignment API 需要在材料階段再核對。

## 小結

Parallelism 的核心不是「把模型丟到很多 GPU 上」，而是控制資料位置。Data parallelism 複製模型、切資料，靠 all reduce 同步 gradient；tensor parallelism 切矩陣，靠 all gather / reduce scatter 在層與層之間重建必要 tensor；pipeline parallelism 切 layers，靠 micro batches 與 overlap 降低 pipeline bubbles。

這一講把單 GPU 的 memory hierarchy 推廣成多 GPU 的 communication hierarchy。從零實作語言模型時，這個視角很重要：只有知道每個 tensor 何時被 shard、replicate、gather、reduce，才知道訓練速度與記憶體上限究竟卡在哪裡。
