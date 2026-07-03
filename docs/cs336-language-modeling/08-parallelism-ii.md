# Parallelism II

前一講建立了平行訓練的基本通訊概念；這一講把問題推到真正的大規模語言模型訓練：模型放不下、單卡算不完、節點內外連線速度不同、批次大小也不能無限放大。現代訓練系統的核心，不是選一種平行化方法，而是在多種平行化策略之間配置資源。

本章要處理的問題是：當訓練單位從「一張 GPU」變成「整個資料中心」時，如何同時管理 compute、memory、communication 與 batch size，讓硬體盡量維持高利用率？

## 導讀：平行化不是只為了更快

語言模型訓練需要平行化，至少有兩個原因。

第一是計算。單一 accelerator 的 FLOPs 不足以支撐大模型與大資料量，所以必須把計算分散到大量晶片上。

第二是記憶體。模型參數、梯度、optimizer state、activation 加起來可能遠超過單張 GPU 的 HBM。即使計算量足夠，模型也可能根本放不進去。

這兩個問題會被通訊拓撲放大。節點內 GPU 之間通常有高速互連，適合頻繁同步；節點間、機櫃間或資料中心間的連線慢得多，必須使用通訊量小、模式規律的策略。這也是為什麼同一個模型，在 GPU fat-tree、TPU mesh、或其他 accelerator cluster 上，合理的切法可能不同。

本講使用的抽象層是 collective communication，例如 `all-reduce`、`reduce-scatter`、`all-gather`。其中一個關鍵等價關係是：

```text
all-reduce ~= reduce-scatter + all-gather
```

許多看似神奇的記憶體節省，都是靠這個等價關係與「按需 materialize、用完釋放、通訊與計算重疊」實現。

## Data Parallelism：最直覺，也最有限

Data parallelism 是最自然的起點。假設一個 batch 有 `B` 筆資料、共有 `M` 張 GPU，就把 batch 切成 `M` 份。每張 GPU 持有完整模型，對自己的資料計算梯度，最後用 `all-reduce` 聚合梯度並同步更新。

它的優點很清楚：只要每張 GPU 分到足夠資料，計算可以擴展。通訊量可粗略視為每 step 約 `2 * parameters`。

但它沒有解決記憶體。每張 GPU 都有完整參數、完整梯度、完整 optimizer state。對 Adam 這類 optimizer，記憶體尤其嚴重，因為除了參數與梯度，還要保存 first moment、second moment，甚至高精度 accumulator。實務上，訓練時的記憶體不是「參數量」而已，而是多份狀態的總和。

Data parallelism 還會消耗 batch size。若 batch size 太小，無法餵飽很多 GPU；若硬把 batch size 拉大，又會遇到 critical batch size：超過某個點後，增加 batch element 的最佳化收益不如多做一次更新。因此 batch size 本身也是平行化系統裡的稀缺資源。

## ZeRO 與 FSDP：把訓練狀態切開

ZeRO 的想法是：既然每張 GPU 不需要同時完整保存所有 optimizer state、gradient 與 parameter，就把這些狀態切到不同 GPU 上。

### ZeRO Stage 1：切 Optimizer State

Stage 1 只切 optimizer state。每個 worker 負責一段參數的更新。所有 GPU 仍可計算完整梯度，但梯度會透過 `reduce-scatter` 送到負責該參數 slice 的 worker；更新後，再用 `all-gather` 把新參數收集回所有 GPU。

因為 `reduce-scatter + all-gather` 與一次 `all-reduce` 通訊量相近，所以 stage 1 可以在幾乎不增加通訊的情況下節省 optimizer state 記憶體。

### ZeRO Stage 2：再切 Gradient

Stage 2 進一步切 gradients。Backward sweep 時，不必先 materialize 完整梯度向量；每算出一層梯度，就立刻 reduce-scatter 到負責的 worker，然後釋放不再需要的梯度。

這是第一個重要系統模式：沿著計算圖逐步前進，資料一旦不再需要就釋放。記憶體節省來自「不要同時擁有全部」。

### ZeRO Stage 3 / FSDP：參數也切

Stage 3 把 parameters、gradients、optimizer state 全部 sharding。PyTorch 生態中常見的 FSDP 就屬於這類想法。

FSDP 的概念可以這樣理解：每張 GPU 仍執行完整模型的 forward/backward，但任何時刻只 materialize 當前需要的 layer weights。

流程大致是：

1. 需要某層 forward 時，all-gather 該層參數。
2. 完成該層計算後，釋放參數。
3. backward 時再次 all-gather 該層參數。
4. 算出梯度後 reduce-scatter，並釋放臨時資料。

Stage 3 比前兩階段多一次 all-gather，因此不是字面上的免費。但只要網路夠快、每層計算量夠大，通訊可以與計算重疊。這也是 FSDP 實務上能接近單卡利用率的原因。

常見誤解是把 FSDP 想成 pipeline parallelism。兩者不同：FSDP 不是把不同層常駐在不同 GPU；它是所有 GPU 都走完整模型，但參數按需聚合與釋放。

## Pipeline Parallelism：沿深度切模型

Data parallelism 與 FSDP 仍受 batch size 與 activation memory 限制。另一個方向是直接切模型。

Pipeline parallelism 沿著深度切模型：前幾層放在一組 GPU，後幾層放在另一組 GPU。Forward pass 傳 activation，backward pass 傳 partial derivatives。

這種策略的最大優點是通訊性質好。它傳的是 layer 之間的 activation，量級常可粗略看成：

```text
B * S * H
```

而且通訊是 point-to-point，不是全域 all-to-all。因此 pipeline parallelism 常用在較慢的連線上，例如跨節點或跨 pod。

缺點是 pipeline bubble。若只有一個 microbatch，第一個 stage 算完交給下一個 stage 後就閒置，整條 pipeline 同一時間只有少數 GPU 在工作。解法是把 batch 切成多個 microbatches，讓不同 stage 同時處理不同 microbatch。Microbatch 越多，bubble 相對比例越小。

進階做法是 zero-bubble pipelining。Backward 其實有兩件事：

- 傳遞 partial derivatives，會阻塞前一個 stage，必須盡早做。
- 計算 weight gradients，比較像 leaf computation，可延後到空檔做。

把這兩部分拆開排程，可以把 pipeline 閒置時間填得更滿。代價是系統複雜度大幅提高。

## Tensor Parallelism：沿寬度切矩陣

Pipeline parallelism 沿深度切；tensor parallelism 則沿寬度切。Transformer 裡的大矩陣乘法可以分成多個較小矩陣乘法，再把 partial results 合併。

在 MLP 中，常見 pattern 是：

- 第一個 projection 做 column-wise split。
- 第二個 down projection 做 row-wise split。
- 中間的非線性各自本地計算。
- 在必要處用 all-reduce 合併結果。

Attention projection 也有類似切法。Layer norm、router、非線性等較小操作通常複製，不值得切。

Tensor parallelism 的優點是沒有 pipeline bubble，也能降低參數與部分 activation memory。缺點是通訊非常頻繁：每個 Transformer block 的 matmul 附近都可能需要 collective。這使它只適合最快的 interconnect。GPU 系統中通常把 tensor parallelism 限制在單機 NVLink domain，例如 8 張 GPU 以內；跨節點後效能會快速下降。

TPU mesh 的取捨不同。規律 mesh 上的 tensor parallel communication 較自然，因此 TPU 訓練可能使用比 GPU 更大的 tensor parallel domain。

## Activation Memory 與 Sequence Parallelism

訓練記憶體的峰值不只來自參數。Backward 開始後，activation 還沒完全釋放，gradient 又開始累積，這常是記憶體最高點。

逐字稿給出一個粗略 activation memory 估算：

```text
activation memory ~= 34 * S * B * H + 5 * A * S / H
```

這裡 `S` 是 sequence length，`B` 是 batch size，`H` 是 hidden dimension；第二項與 attention 的 quadratic terms 相關，常可透過 FlashAttention 或 recomputation 降低。公式細節仍需投影片核對，但重點很明確：`S * B * H` 是 activation memory 的主軸。

Tensor parallelism 可以切掉 MLP 與 attention projection 中的大部分 activation，但 layer norm、dropout、residual inputs 等輕量操作仍可能留下約 `10 * S * B * H` 的未切項。

Sequence parallelism 就是為了補這塊。它把這些 activation 沿 sequence axis sharding；需要完整 activation 時 all-gather，用完後 reduce-scatter。概念上很像 FSDP：平時分片保存，計算需要時才 materialize。

結合 tensor parallelism、sequence parallelism 與 attention recomputation 後，可把 activation memory 粗略壓到：

```text
activation memory ~= 34 * S * B * H / T
```

其中 `T` 是 tensor parallel degree。這不是精確成本模型，但很適合作為手算模型能否放入 GPU 的第一版估算。

## Expert Parallelism：MoE 的切法

MoE 模型把 dense MLP 換成多個 experts，並由 router 決定 token 要送到哪些 experts。這自然產生 expert parallelism：把不同 experts 放在不同裝置上，token route 到 expert 所在位置。

Expert parallelism 與 tensor parallelism 都是高頻寬模型平行策略，但在 MoE 中通常優先使用 expert parallelism。原因是 tensor parallelism 會把矩陣切得更小，可能降低 matmul utilization；而 MoE 本來就要做 sparse token routing，把 experts 分散出去更符合計算結構。

困難在於 dispatch。MoE layer 需要把 token all-to-all 送到不同 experts，而且這是 latency-sensitive 的：計算必須等 token 到齊才能開始。前沿系統會用非常低階的 GPU networking、kernel fusion、甚至指令層級技巧降低 dispatch overhead。

Expert parallelism 還會與 tensor parallelism 互相牽制。MoE 只替換 MLP，不替換 attention；attention 可能仍需要 tensor parallelism，但 MoE MLP 又不希望 tensor parallel degree 太高，否則 expert 內矩陣太小。現代系統因此可能對 attention layer 與 MoE layer 使用不同的 tensor parallel 設定。

## Context Parallelism：長上下文的額外維度

Context parallelism 或 ring attention 用於長序列場景，把 context / activation 沿 sequence dimension 切到多個 accelerator。它常出現在 long-context extension 與 serving。

本講沒有深入這一塊，因為它與前面談過的 activation sharding、按需通訊、拓撲感知排程有概念重疊。但在長上下文模型中，它會變成重要工具，因為 sequence length 直接放大 activation 與 attention 記憶體。

## 工程取捨：沒有單一最佳策略

這一講最重要的工程結論是：沒有一種 parallelism 嚴格支配其他策略。

Data parallelism 簡單、穩定、效率好，但不省模型記憶體，而且消耗 batch size。

FSDP 很優雅，能大幅降低 parameter / gradient / optimizer state 記憶體，但 activation memory 仍要另外處理，且依賴通訊與計算重疊。

Pipeline parallelism 通訊量小、適合慢連線，但會有 bubble，需要足夠 microbatches 與複雜排程。

Tensor parallelism 沒有 bubble，能切 activation 與參數，但通訊頻繁，只適合高速互連。

Sequence parallelism 補上 tensor parallelism 沒切到的 activation，但增加 gather/scatter 複雜度。

Expert parallelism 很適合 MoE，但 token dispatch 是 all-to-all 且高度延遲敏感。

Context parallelism 適合長上下文，但主要在特定 workload 下才成為主角。

實務規則可以簡化成：

1. 先用必要的 model parallelism 讓模型放進記憶體。
2. 在最快連線上使用 tensor parallelism 或 expert parallelism。
3. 跨慢連線時使用 pipeline parallelism 或 FSDP。
4. 模型放得下後，盡量把剩餘 GPU 用於 data parallelism。
5. 若 batch size 太小造成 utilization 差，用 gradient accumulation 或調整 parallelism 組合。

這就是所謂 3D / 4D parallelism 的精神：不是追求華麗的維度名稱，而是把不同通訊模式放到合適的網路層級上。

## 實例脈絡

逐字稿用多個公開訓練案例說明策略如何落地，但本章僅保留課堂中提到的高層結論，具體數字需後續材料階段核對。

小型 dense 模型可能只用 FSDP 就能擴到相當多 GPU。較大的 dense 模型通常會組合 tensor parallelism、pipeline parallelism、data parallelism；例如巨大 dense 模型在 long-context 階段會提高 context parallelism、降低 data parallelism。

MoE 模型則常以 expert parallelism 取代或弱化 tensor parallelism，並搭配 pipeline/data parallelism。DeepSeek 類系統展示了大 expert parallel domain 與複雜 pipeline/dispatch 排程的可能性。

另一個容易忽略的現實是可靠性。大規模訓練不是只要跑得快，還要能處理 GPU failure、checkpoint、restart 與冗餘。平行化策略一旦跨到數千張 GPU，訓練系統本身也成為分散式系統問題。

## 常見誤解

**誤解一：模型記憶體就是參數量。**  
訓練時還有 gradients、optimizer state、activation。Adam 的 moment states 與 backward 期間的 activation/gradient 重疊，常比參數本身更關鍵。

**誤解二：FSDP 是把不同層放到不同 GPU。**  
FSDP 是每張 GPU 都執行完整模型流程，但參數按需 all-gather、用完釋放。把不同層常駐在不同 GPU 是 pipeline parallelism。

**誤解三：batch size 可以無限增加來餵飽 GPU。**  
超過 critical batch size 後，增加 batch 的最佳化收益會下降。Batch size 是要被分配的資源，不是免費旋鈕。

**誤解四：tensor parallelism 越大越好。**  
Tensor parallelism 需要高頻 collective。跨過高速互連邊界後，通訊可能壓過計算；矩陣切太小也會降低 matmul utilization。

**誤解五：MoE 有 expert parallelism 就不需要其他策略。**  
Expert parallelism 主要切 MLP experts；attention、長上下文、資料擴展仍需要 tensor/context/data/pipeline 等策略配合。

## 小結

Lecture 8 把語言模型訓練從「寫出模型」推到「讓模型在資料中心裡有效運轉」。核心思想是把不同資料結構放到不同 parallelism 維度中：

- batch 交給 data parallelism；
- optimizer state、gradient、parameter 交給 ZeRO/FSDP；
- layer depth 交給 pipeline parallelism；
- matrix width 交給 tensor parallelism；
- leftover activation 交給 sequence parallelism；
- MoE experts 交給 expert parallelism；
- long context 交給 context parallelism。

好的訓練系統不是把所有技巧都打開，而是根據模型形狀、batch size、sequence length、硬體拓撲與通訊成本，選出能讓記憶體放得下、通訊藏得住、計算吃得滿的組合。

## 相關作業與材料

- Lecture 8 逐字稿已完整閱讀：第 1 行到第 2407 行。
- `lecture_08.pdf` 已下載，待材料階段閱讀。
- Assignment 2 code repo 已下載，待材料階段閱讀。

逐字稿中提到 Assignment 2 會要求學生思考或實作系統層平行化，包括 FSDP wrapper、compute/communication accounting，以及在給定網路拓撲與模型設定下選擇 parallelization strategy。本章未讀 assignment code，因此不整合作業細節。
