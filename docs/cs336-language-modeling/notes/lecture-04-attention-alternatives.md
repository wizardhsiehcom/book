# Lecture 4 閱讀筆記：Attention Alternatives

## 基本資料

- 課程：Stanford CS336 Language Modeling from Scratch, Spring 2026
- 講次：Lecture 4
- 主題：Attention Alternatives 與 Mixture of Experts
- 逐字稿檔案：`data/Stanford CS336 Language Modeling from Scratch/04 - Stanford CS336 Language Modeling from Scratch ｜ Spring 2026 ｜ Lecture 4： Attention Alternatives.en.txt`
- 完整閱讀範圍：第 1 行到第 2581 行
- 總行數：2581 行
- 外部資料：未使用；本筆記只依據逐字稿整理

## 本講主問題

本講延續上一講的現代 Transformer 架構細節，討論兩個更進階、也更貼近現代大模型實務的架構方向：

1. 當 context length 從幾千、幾萬推到百萬級甚至更長時，標準 softmax attention 的二次成本如何被控制？
2. 當模型想要更多參數但不想在每個 token 上支付所有參數的計算量時，Mixture of Experts 如何用稀疏啟用改善 compute-to-parameter 的取捨？

講者反覆強調：不要只看 Big-O。常數因子、記憶體搬移、通訊拓樸、KV cache、路由負載是否平衡，都會決定一個架構能不能真的在大規模訓練與推論中工作。

## 核心概念

### 長 context 的 attention 成本

- Feed-forward/MLP 層對序列長度大致是線性成長。
- 標準 attention 需要所有位置互相作用，成本隨序列長度呈二次成長。
- 在較短 context 與大模型中，MLP 可能是主要成本；context 變長後，attention 會快速成為瓶頸。
- 基本工具包含 local attention、occasional global attention、FlashAttention 這類系統工程改進，以及更激進的線性或稀疏 attention 變體。

### 線性 attention 的結合律視角

標準 attention 可抽象成：

```text
softmax(QK^T)V
```

若暫時拿掉 softmax/row normalization，則可用矩陣乘法結合律改寫：

```text
(QK^T)V = Q(K^TV)
```

原本瓶頸在 `QK^T` 的 `N x N` 交互，成本含有 `N^2`。改成先算 `K^TV` 後，序列長度依賴可轉為線性，成本形如與 `N d_k d_v` 相關。這不是免費午餐，因為拿掉 softmax 會降低表達力；但它提供了許多線性 attention 與 state space model 的共同起點。

### dense/parallel form 與 recurrent form 的 duality

線性 attention 的 `K^TV` 可以寫成左到右掃描的狀態更新：

```text
S_t = S_{t-1} + k_t v_t^T
y_t = q_t S_t
```

這帶來一個重要 duality：

- 訓練時可用 dense/parallel matrix operations，保留硬體效率。
- 推論時可用 recurrent state，狀態大小固定，不必保存完整歷史。

講者特別釐清：線性 attention 的 dense form 與 recurrent form 在拿掉 softmax 後是等價的；但它們不等價於原始 full softmax attention。

### Hybrid 而非純線性

逐字稿中的大規模實例幾乎都不是純線性 attention，而是 hybrid：

- Minimax M1 使用 7:1 的 linear attention/full attention hybrid。
- NeMoTron 3 使用 Mamba 2 與 full softmax attention 混合。
- Qwen Next/Qwen 3.5 類模型使用 Gated DeltaNet 與 full attention 混合。

講者指出目前尚未看到完全線性 attention 在大規模上取代 full attention；低比例替換通常損失很小，但接近純 recurrent/RNN-style 後，長 context 與 QA 等能力會明顯下降。

### Mamba 2：在 recurrent state 上加入 input-dependent gate

Mamba 2 可被視為線性 attention recurrent form 的延伸。核心想法是加入只依賴當前輸入的 gate `gamma_t`：

```text
S_t = gamma_t S_{t-1} + k_t v_t^T
```

直覺：

- 不是所有過去狀態都應該永遠傳下去。
- gate 決定保留多少既有 state。
- 只要 gate 不依賴 state，而只依賴 input，仍能保留 parallel/serial duality。

Mamba 2 也包含 output 端的 pass-through/residual-like value term，講者說這是架構改進，但不是狀態更新的核心。

### Gated DeltaNet：輸入 gate 與 key direction 更新

Gated DeltaNet 在 Mamba 2 的基礎上再加一個 `beta_t` gate，控制是否把當前資訊寫入 state。它也包含一個近似投影的更新方向：

```text
I - beta_t k_t k_t^T
```

直覺：

- 寫入目前 key direction 的新資訊時，也清除或投影掉過去同一方向的舊資訊。
- 這與 fast weight programming、test-time training、meta-learning least squares 類問題中出現的更新形式有相似性。
- 其 gate 結構和 LSTM 的「忘記/寫入」精神相近，但推導來源與現代實作不同。

### DSA：稀疏 attention 與 top-K selection

DeepSeek sparse attention 類方法不是把 attention 變成線性時間，而是先用輕量 indexer 選出少量 token，再對該子集做 full attention。

流程：

1. 用較便宜的 QK-like indexer 估計哪些 token 值得被看見。
2. 用 top-K 選出候選位置。
3. 在候選位置上做標準 attention。

工程意義：

- indexer 仍可能是二次成本，但可用低維、低精度或其他方式讓常數成本很小。
- 真正昂貴的 full attention 只在 bounded K 上做。
- 可在 long-context extension 階段插入，不一定要從 pretraining 一開始就使用。

這裡的 top-K selection 也成為後半講 MoE 的重要鋪墊。

### MoE 的基本動機

Mixture of Experts 可視為更有效率的 MLP/FFN：

- 把一個 FFN 擴展成多個 expert FFN。
- 每個 token 只啟用其中 K 個 expert。
- 總參數量增加，但每個 token 的 active FLOPs 不按總參數量等比例增加。

核心 mental model：增加 sparse parameters，同時維持相近的 forward/backward compute。

### MoE 的效果與普及原因

逐字稿整理的經驗觀察：

- 在相同 active compute 下，增加 experts 通常可降低 validation/test loss。
- 同樣訓練 compute 下，MoE 往往比 dense model 更快達到較好表現。
- 大模型發布中，過一定規模後 MoE 幾乎成為主流選項。
- MoE 也提供 expert parallelism 這個額外的平行化軸。

代價：

- infrastructure 複雜；
- 通訊成本高；
- 參數總量大，不易放在單一設備；
- 訓練不穩定，容易 expert collapse；
- fine-tuning 時更容易過擬合。

### token-level top-K routing

現代 MoE 多採 token choice top-K routing：

- 每個 token 自己選擇 top-K experts。
- router 通常非常簡單，是 input 與 expert vectors 的內積，再 softmax/top-K。
- routing granularity 是 token level，不是 request、sentence 或 domain level。

常見 routing 選項：

- learned top-K inner product router：主流做法；
- hash routing：簡單且有時有效，但不是部署主流；
- RL/bandit routing：概念自然但 overhead 與 variance 高；
- linear assignment/global optimization：形式漂亮但太貴，尚未成為大規模主流。

### experts 不是真正語義專家

學生問到 expert 是否像「醫療專家」或「法律專家」。講者回答：通常不是。因為 router 很簡單，實際觀察可能是標點、符號、非英語字元集等 token 類型被不同 expert 處理，但不能期待 expert 對應明確的高層語義領域。

### shared experts 與 fine-grained experts

DeepSeek MoE 推廣了兩個設計：

- fine-grained experts：把 experts 切得更細，讓同等預算下有更多可選 expert。
- shared experts：部分 experts 永遠啟用，不經 router，處理所有 token 的共通計算。

直覺：

- shared experts 承擔普遍計算，減少 routed experts 被迫重複學 common processing。
- routed experts 更容易專門化。
- shared experts 沒有 routing parallelism 的節省，可選擇複製到設備上換取較低通訊。

講者指出不同研究對 shared experts 的收益評估不完全一致；但 DeepSeek 系列設計在後續多個現代 MoE 中被廣泛採用。

### MoE 訓練困難：非可微與 counterfactual 缺失

訓練時也必須稀疏啟用 experts，否則就失去 MoE 的效率優勢。這造成兩個問題：

- top-K routing 是非可微決策。
- 被選中的 expert 才會得到梯度，看不到其他 expert 的 counterfactual 表現。

直覺上這像 bandit/RL 問題，但主流不是用 RL，而是用一組深度學習 heuristics。

### expert collapse 與 load balancing loss

若只用一般 gradient descent，早期被選到且表現較好的 experts 會獲得更多梯度，之後更常被選到，形成 rich-get-richer。結果是：

- 少數 experts 吃掉大部分 token；
- 其他 experts starving；
- 實際可用參數遠少於名義參數。

Switch Transformer 類方法加入 load balancing loss。典型形式使用：

- `f_i`：dispatch 到 expert `i` 的 token fraction。
- `P_i`：router 分配給 expert `i` 的總 probability mass。

loss 對熱門 expert 的 probability mass 產生負向壓力，使 token 分配更平均。DeepSeek 類方法還會加入 device-level balancing，因為系統吞吐量取決於設備負載是否平均。

### MoE 系統工程

MoE 帶來 expert parallelism：

- 每個 expert 是自然切分單位。
- token activation 需被送到所在設備，產生 communication overhead。
- 可用 structured sparsity/block sparse matrix multiply 讓多個 expert 的計算更有效。
- 可先把 routed activation down-project，再跨設備傳送，降低通訊量。

早期 inference infrastructure 可能因 expert queue 過長而 drop tokens，造成非預期 stochasticity；現代 dropless 架構如 MegaBlocks 類框架已大幅緩解。

### MoE 穩定性與 fine-tuning

MoE router 又引入一個 softmax。上一講提過 exponentials、divisions、softmax 都是穩定性風險，因此 router 常需要額外處理：

- router 可用 float32；
- 加入 router Z-loss 以控制 softmax logit scale；
- fine-tuning 時可只調 attention、非 MoE layers，或在資料量足夠時再全量 fine-tune。

MoE 因總參數量大，對小資料 downstream fine-tuning 更容易出現 train/validation gap。

### Upcycling

Upcycling 是把 dense model 轉成 MoE 的做法：

1. 複製 dense model 的 MLP 成多個 experts。
2. router 隨機初始化。
3. 繼續訓練，讓 copied experts 分化。

早期 MiniCPM、Qwen MoE 等曾展示成效。不過講者指出近一年較少見，因為若一開始就知道要訓練大模型，通常直接 train MoE hero run。

### DeepSeek MoE 演化

講者最後用 DeepSeek 系列串起現代 MoE 設計：

- V1：shared/fine-grained experts、standard top-K routing、auxiliary load balancing。
- V2：規模擴大，加入 device routing、communication balancing 等系統導向目標。
- V3：保留 shared/fine-grained experts，但使用 aux-loss-free balancing 類方法與不同 expert weighting。

講者也順帶提到 DeepSeek V3 的其他架構：

- MLA：用 latent activation 壓縮 KV cache，只保存較低維的 latent `C`，再從它生成 Q/K/V 相關量；需處理與 RoPE 的交互。
- MTP：multi-token prediction，同時預測多個未來 token，兼具統計與 speculative decoding 的系統動機。

## 重要問答整理

- 線性 attention 的 recurrent form 是否與 full attention 等價？
  - 不等價。拿掉 softmax 後才得到線性 attention；線性 attention 的 dense 與 recurrent form 才是等價。
- DSA indexer 是否仍是二次時間？
  - 是。它仍需看所有 pairwise inner products；優勢在於 indexer 可非常輕量，後續 full attention 只對 top-K 子集做。
- DSA 是 pretraining 還是 post-training？
  - 通常在 short-context pretraining 後的 long-context extension 階段加入，再進入 post-training。
- state space/linear attention 相對 Transformer 的缺點？
  - 表達力。固定大小 state 很難無損壓縮完整長 context，而 full softmax attention 的 all-to-all 連接很強。
- MoE expert parallel 會不會有通訊瓶頸？
  - 會。MoE 用更多總 FLOPs/更少單設備記憶體壓力交換跨設備 activation communication，是否划算取決於拓樸與實作。
- MoE 訓練時是否啟用所有 experts？
  - 否。訓練時也 sparse，這正是 MoE 難訓練的原因。
- routing 粒度是什麼？
  - token level。每個 token 選 experts。
- experts 是否有可讀語義？
  - 通常沒有高層語義，只可能觀察到字元集、標點、符號等低層 token 類型偏好。

## 從零實作語言模型的意義

這一講對「from scratch」很關鍵，因為它把 Transformer block 的兩個主要成本中心拆開看：

- attention block：長 context 使二次成本、KV cache 與記憶體搬移成為核心問題。
- MLP block：參數量與 active compute 的比例決定模型能否用同樣 FLOPs 擁有更大容量。

從零實作不只是把公式寫成 PyTorch module，也要理解：

- softmax attention 為何強，但在長 context 下昂貴；
- 線性 attention 為何可同時有 training parallelism 與 inference recurrence；
- top-K selection 雖非可微，仍可透過 loss shaping 與 heuristics 大規模訓練；
- router/load balancing/device balancing 是模型品質與系統吞吐的共同設計；
- 架構選擇常常是演算法、硬體、通訊、數值穩定性的混合取捨。

## 跨章連結

- Lecture 1/overview：從 LM 需求看 context length 的產品壓力。
- Lecture 2/PyTorch 與 einops：矩陣形狀、batch/sequence/head 維度會直接影響 attention 實作。
- Lecture 3/Transformer 架構：本講的所有變體都建立在 attention block 與 MLP block 的拆解上。
- 後續 systems lectures：FlashAttention、expert parallel、structured sparsity、communication balancing、KV cache 都需要系統章節補完。
- 後續 inference lectures：MLA、MTP、speculative decoding 與長 context serving 成本有直接連結。
- 後續 post-training/fine-tuning：MoE fine-tuning 過擬合、router stability、只調 attention 或非 MoE layers 等策略會再出現。

## 暫不處理的外部補充

本 worker 任務明確要求不做網路搜尋、不加入外部資料。因此以下內容只標記為後續主控 agent 可補充，不在本稿展開：

- 各模型與論文的正式引用、年份、URL、benchmark 數字校對。
- FlashAttention、Mamba/Mamba 2、Gated DeltaNet、DeepSeek Sparse Attention、Switch Transformer、GShard、MegaBlocks、MLA、MTP 的原始論文細節。
- DeepSeek、Qwen、GLM、NeMoTron、Minimax、OLMo 等模型的最新版本與實際配置。
- 具體 PyTorch/Megablocks/Triton 實作與 benchmark。
