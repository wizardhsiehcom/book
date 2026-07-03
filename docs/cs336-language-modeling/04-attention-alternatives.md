# 04. Attention Alternatives

## 導讀

上一章把 Transformer 的基本 block 拆開：attention 負責讓 token 彼此交換資訊，MLP 負責每個位置上的非線性轉換。本章討論兩種更進階、也更貼近現代大模型實務的架構改造。

第一種改造針對 attention。當 context length 只有幾千時，標準 full attention 的二次成本還能被硬體與系統最佳化吸收；當 context length 走向幾十萬、百萬甚至更長，`QK^T` 的所有位置互相作用就會成為主要瓶頸。這時候只靠「Transformer 寫得更快」不夠，必須重新思考 attention 的計算形式。

第二種改造針對 MLP。Mixture of Experts（MoE）的目標不是讓模型每次計算更多，而是讓模型擁有更多參數，但每個 token 只啟用其中一小部分。它讓「總參數量」和「每 token active compute」不再綁死在一起，也因此成為近年大模型架構的重要主線。

這兩條線看似不同，但有共同主題：現代語言模型的架構不是單純追求漂亮的數學形式，而是在表達力、計算量、記憶體、通訊、數值穩定性之間做工程取捨。

## 核心內容

### 長 context 為什麼讓 attention 變貴

標準 self-attention 可以寫成：

```text
softmax(QK^T)V
```

其中 `N` 是序列長度。`QK^T` 讓每個位置和每個位置互相作用，因此會產生 `N x N` 的 attention score。這就是 attention 對 context length 呈二次成長的根源。

在較短 context 中，Transformer 的 MLP/FFN 可能是主要成本；但序列長度拉長後，MLP 仍大致線性成長，attention 卻會快速超過它。這也是長 context 模型需要特別處理 attention 的原因。

常見的控制方法有幾類：

- 使用 local attention，只讓 token 看附近範圍，偶爾插入 full/global attention。
- 使用 FlashAttention 這類系統最佳化，避免 materialize 巨大的 attention matrix，降低記憶體搬移成本。
- 使用線性 attention、state space model、稀疏 attention 等架構替代。

這裡要特別注意：Big-O 不是全部。FlashAttention 沒有改變 full attention 的二次複雜度，但透過重排計算與降低記憶體傳輸，仍能帶來非常大的常數因子改善。相反地，一個理論上更低複雜度的方法，如果常數、硬體利用率或通訊模式不好，也未必能在真實系統中勝出。

### 線性 attention：從結合律開始

理解許多 attention alternatives 的入口，是矩陣乘法的結合律。

先暫時拿掉 softmax，attention 變成：

```text
(QK^T)V
```

由於矩陣乘法可以改變括號位置，我們也可以先算右邊：

```text
Q(K^TV)
```

這個改寫改變了昂貴的維度。原本先算 `QK^T` 會產生 `N x N` 的矩陣；改成先算 `K^TV`，成本主要依賴序列長度 `N` 和 key/value 維度，而不是 `N^2`。在 context length 很大、hidden dimension 相對小得多時，這是一個有吸引力的方向。

代價也很明確：拿掉 softmax 不是無損操作。full softmax attention 的 all-to-all、內容依賴式權重非常強；線性 attention 是用表達力換取長 context 成本。

### Parallel form 與 recurrent form

線性 attention 還有一個重要性質：它可以同時被寫成 parallel form 與 recurrent form。

parallel form 適合訓練：

```text
Q(K^TV)
```

recurrent form 適合推論：

```text
S_t = S_{t-1} + k_t v_t^T
y_t = q_t S_t
```

`S_t` 是固定大小的 state。推論時模型不必每次重新看完整歷史，而是把狀態一路帶下去。這讓它有 RNN 的推論優勢；同時在訓練時又能回到矩陣乘法形式，保留平行化效率。

這個 duality 是很多現代 state space 或 linear attention 架構的共同基礎。要避免誤解的是：線性 attention 的 parallel/recurrent form 彼此等價，但它們不等價於原始的 full softmax attention；差異從拿掉 softmax 的那一步就已經開始。

### Mamba 2 與 Gated DeltaNet

線性 attention 最樸素的狀態更新會一直把所有過去資訊累積進 state。這太僵硬。從 LSTM 的直覺看，模型應該能決定何時保留、何時忘記、何時寫入。

Mamba 2 可以被理解為在線性 attention 的 recurrent form 上加入 gate：

```text
S_t = gamma_t S_{t-1} + k_t v_t^T
```

`gamma_t` 只依賴當前輸入，不依賴 state。這點很重要：只要 gate 是 input-dependent，就仍然能保留訓練時 parallel、推論時 recurrent 的 duality。Mamba 2 還有類似 residual/pass-through 的 value term，讓當前 token 的 value 可以直接進入 output，但狀態更新的核心仍是 gate 控制的 recurrent state。

Gated DeltaNet 再往前一步，加入另一個 gate `beta_t` 控制當前資訊是否寫入，並使用類似投影的更新方向：

```text
I - beta_t k_t k_t^T
```

直覺上，當模型要沿著目前 key direction 寫入新資訊時，也應該清掉過去同方向的舊資訊。這讓狀態不是單純累積，而是有更精細的覆寫能力。

這些方法在大規模模型中通常不是完全取代 full attention，而是和 full softmax attention 混合使用。低比例替換通常可以大幅降低長 context 成本，同時保留足夠表達力；若接近純 recurrent，長 context QA、retrieval 等能力會更容易下降。

### 稀疏 attention：先選，再看

另一條路不是把 attention 改成線性，而是讓 full attention 只發生在少量候選 token 上。DeepSeek sparse attention 類方法採用這種思路。

流程可以簡化成：

1. 用輕量 indexer 對長 context 做候選 token 選擇。
2. 用 top-K 選出最值得注意的位置。
3. 只在這些位置上做標準 attention。

這不是線性時間方法。indexer 仍要看大量 pairwise 關係，所以理論上可能仍有二次成分。但它可以被做得很便宜：例如較低維、較低精度，或其他專門為索引設計的計算形式。真正昂貴的 full attention 則只在 bounded K 上執行。

這個設計也常和訓練流程結合：先訓練 short-context 模型，再在 long-context extension 階段加入 sparse attention/indexer，最後進入 post-training。它再次提醒我們，架構不只是 module 本身，也包含它被放進訓練 pipeline 的哪個階段。

### MoE：更大的參數量，不等於更大的 active compute

Mixture of Experts 可以先用很樸素的方式理解：把 Transformer 裡的 MLP 換成多個 MLP experts，然後讓每個 token 只選其中少數幾個。

假設原本有一個 FFN。現在我們放四個同樣大小的 FFN，但每個 token 只通過其中一個。總參數量變成四倍，但每個 token 的 FFN 計算量仍接近原本的一倍。這就是 MoE 的核心吸引力：增加 sparse parameters，而不是等比例增加 FLOPs。

大量經驗結果顯示，在 active compute 類似的情況下，增加 expert 數量常常能改善 loss 與下游表現。這也是為什麼過一定規模後，許多大模型都走向 MoE：它提供了 dense model 沒有的參數/計算取捨。

不過 MoE 不是免費的。它帶來：

- 更複雜的 routing；
- 更高的總參數記憶體壓力；
- expert parallelism 的跨設備通訊；
- 訓練時的 expert collapse；
- router softmax 的穩定性問題；
- fine-tuning 時更嚴重的過擬合風險。

### Top-K routing

現代 MoE 最常見的是 token choice top-K routing：每個 token 自己選擇要送到哪些 experts。

典型 router 很簡單。對每個 token hidden state `u`，和每個 expert 的 routing vector 做內積，得到分數；再經過 softmax/top-K，選出 K 個 experts。這不是一個高階語義分類器，而是一個很輕量的線性路由器。

因此，「expert」這個名字容易誤導。它通常不是醫療專家、法律專家、金融專家。實際觀察中，某些 expert 可能偏好標點、符號、特定字元集或語言形態，但不應期待它們對應清楚的人類語義領域。

routing 還有其他選項，例如 hash routing、RL/bandit routing、global linear assignment。它們各有理論吸引力，但大規模主流做法仍是簡單 top-K routing 加上一系列訓練穩定化技巧。

### Shared experts 與 fine-grained experts

DeepSeek MoE 系列推廣了兩個重要設計。

第一是 fine-grained experts：把 expert 切成更多、更小的單位。這讓 token 有更細的選擇空間，也讓模型在相同 active compute 下擁有更多組合可能。

第二是 shared experts：部分 experts 不經 router，永遠對所有 token 啟用。直覺是，語言模型中有些處理是共通的，不需要每個 routed expert 都重複學。shared expert 承擔共通計算後，routed experts 可以更專注於條件化的差異。

shared experts 的系統取捨也很直接：因為每個 token 都要用，所以它們不像 routed experts 那樣帶來稀疏路由節省。實作上可以選擇把 shared experts 複製到多個設備上，用更多記憶體換較少通訊。

### MoE 為什麼難訓練

MoE 訓練時也必須稀疏啟用 experts。若訓練時把所有 expert 都跑一遍，就失去 MoE 的效率優勢。

這立刻帶來兩個問題：

- top-K selection 是非可微的；
- 沒被選到的 experts 沒有 counterfactual gradient。

從機器學習角度看，這很像 bandit 或 RL 問題：你選了一些 action，但看不到其他 action 的結果。可是實務主流並沒有用複雜 RL 解法，而是直接對被選到的路徑反傳，再加入 balancing heuristics。

最大問題是 expert collapse。早期稍微強一點或比較常被選到的 expert，會得到更多梯度；得到更多梯度後，它更容易被 router 選到；於是越強越強，其他 experts 逐漸餓死。最後名義上有很多參數，實際上只有少數 experts 在工作。

解法是 load balancing loss。它通常同時看：

- 每個 expert 實際收到多少 token；
- router 給每個 expert 的 probability mass。

熱門 expert 會受到額外懲罰，促使 routing 分配更平均。對大規模系統來說，只平衡 expert 還不夠，還要平衡 device：如果某台機器上的 experts 特別熱門，整體吞吐仍會被它拖慢。因此 DeepSeek 類系統還會加入 device-level balancing 或 communication balancing。

## 工程取捨

### Hybrid 架構是現階段主流

逐字稿中的線性 attention、Mamba 2、Gated DeltaNet 等案例，多半不是純粹替換掉所有 full attention，而是和 full attention 混合。這個取捨很務實：便宜層提供長 context 吞吐，少量 full attention 保留全域資訊交換能力。

### 常數因子和硬體利用率會改變結論

DSA 類方法不一定改善理論複雜度，但它把昂貴 full attention 限制在 top-K 子集上，並讓 indexer 變得非常便宜。MoE 也是類似：理論上參數更多，但 active compute 稀疏；真正的瓶頸可能轉移到 activation communication、設備負載或 router stability。

### MoE 的平行化多一個軸，也多一個通訊問題

MoE 提供 expert parallelism。每個 expert 是天然的切分單位，可以放在不同設備上；token activation 被 router 分派到對應設備處理。

這帶來一個額外的平行化軸，但也引入通訊成本。當 token 需要跨設備送到 expert，activation 的搬移可能成為瓶頸。為了降低通訊，有些設計會先把 routed activation down-project 成較小維度，再送到遠端 expert；shared expert 則留在較大維度處理共通部分。

MoE 的計算模式也和 structured sparsity 很契合。多個 experts 看似是許多小矩陣乘法，但實作上可以整理成 block sparse 或其他硬體友善的 sparse matrix multiply，讓 GPU 更有效率地處理。

### 穩定性、fine-tuning 與 serving runtime 都是架構的一部分

MoE router 通常又引入一個 softmax。softmax 涉及 exponentials 與 divisions，本來就是數值穩定性的敏感區。常見處理包含 router 使用 float32、對 router 加 Z-loss、監控 routing 分佈與 loss spikes。

MoE fine-tuning 也更麻煩。因為總參數量很大，在小資料任務上全量調整 experts 很容易過擬合。實務上可能只 fine-tune attention、非 MoE layers，或在資料量足夠時才更完整地調整 experts。

早期 MoE serving 還可能因 expert queue 過長而 drop tokens，導致同一請求在不同負載下結果不穩定。現代 dropless MoE infrastructure 已經大幅緩解這類問題，但它提醒我們，MoE 的品質不只取決於模型權重，也取決於 serving runtime。

## 常見誤解

### 誤解一：線性 attention 等價於 full attention

不等價。線性 attention 的 parallel/recurrent form 是等價的，但它們已經拿掉 softmax，因此不是原始 full softmax attention。

### 誤解二：二次時間方法一定不可用

不一定。FlashAttention 沒改變二次複雜度，仍然非常重要。DSA 的 indexer 也可能有二次成分，但透過低維、低精度與 top-K 子集，實際成本可以大幅下降。常數因子與硬體效率很重要。

### 誤解三：state space model 沒有代價

有代價。固定大小 state 很適合推論，但要把完整長 context 壓進有限 state，必然有資訊瓶頸。這也是為什麼現代方法多採 hybrid，而不是完全放棄 full attention。

### 誤解四：MoE 的 experts 是人類可解釋的領域專家

通常不是。router 太簡單，expert 分工多半是 token 分佈與訓練動態產生的低層模式，而不是「醫療」「法律」這類語義部門。

### 誤解五：MoE 只是在 inference 時稀疏

訓練時也稀疏。這正是 MoE 難訓練的原因：非可微 top-K、缺少 counterfactual gradient、expert collapse，都來自訓練時只啟用少數 experts。

### 誤解六：load balancing 是可有可無的小技巧

不是。沒有 load balancing，少數 experts 會吃掉大部分 token，其他 experts 幾乎不學習。這會讓 MoE 的大量參數形同浪費，也會破壞系統利用率。

## 小結

本章的兩條主線分別改造 Transformer 的兩個成本中心。

attention alternatives 試圖讓長 context 更便宜。線性 attention 用結合律把 `N^2` 交互轉成固定 state 的 recurrent form，Mamba 2 與 Gated DeltaNet 再用 gate 增強狀態更新能力；稀疏 attention 則用 indexer 和 top-K 先選候選 token，再對小集合做 full attention。實務上最可靠的方向多半是 hybrid：保留少量 full attention，搭配便宜的長 context 機制。

MoE 則改造 MLP。它用 token-level top-K routing 讓模型擁有大量 sparse parameters，但每個 token 只支付少數 experts 的 active compute。這帶來更好的參數/計算取捨，也帶來 routing、load balancing、expert parallel、通訊、數值穩定性與 fine-tuning 的新問題。

從零實作語言模型時，這一講的關鍵不是背每個模型名稱，而是掌握現代架構設計的思考方式：先找出真正的成本瓶頸，再決定要用數學重寫、稀疏選擇、系統最佳化，或訓練 heuristic 去換取可接受的表達力與可部署性。
