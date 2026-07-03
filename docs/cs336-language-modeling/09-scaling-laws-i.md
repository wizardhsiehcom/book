# Scaling Laws I

## 導讀

前幾講我們已經看到語言模型的主要組件：tokenizer、Transformer 架構、GPU/TPU、kernel、parallelism。這些知識讓我們能把一個模型訓練起來。但如果目標不是訓練一個作業模型，而是投入非常昂貴的 compute，訓練一個真正有競爭力的大模型，問題會變成另一個形狀：在大 run 開始前，我們要如何知道它值得跑？

想像有人給你 10,000 張 B200 一個月，要你訓練一個很好的開源語言模型。資料、基礎設施、訓練程式都暫時假設已準備好，真正困難的是決策：模型要多大？資料要多少？batch size 怎麼設？learning rate 如何放大？架構是否值得改？如果每個問題都靠 full-scale trial-and-error，代價會高到不可接受。

Scaling laws 的工程價值就在這裡。它們不是單純畫出好看的 log-log 線，而是把大規模訓練前的未知，轉化成一組小規模實驗與外推規則。若小模型到大模型之間存在穩定規律，我們就能先在便宜尺度上做 sweep，再把結論帶到昂貴尺度。

本講是 scaling laws 的基本版。重點不是背某個固定比例，而是學會一種思考方式：大模型工程應該盡量在跑之前就有數字預期。

## 從 Generalization 到 Scaling

Scaling laws 看起來很像大型語言模型時代的新詞，但它和古典機器學習問題其實很接近。機器學習理論長期關心 generalization：模型在有限訓練集上表現如何，能否推估到測試分布？許多 generalization bound 都會依賴樣本數，因此本來就在問「資料變多時，錯誤率如何下降」。

從這個角度看，scaling law 可以理解成 empirical sample complexity。與其只證明一個寬鬆上界，我們直接訓練一批模型，觀察 error 或 loss 如何隨資料量、參數量、compute 改變，然後擬合一條可外推的曲線。

最常見的形式是 power law。若在 log-log plot 上，資源量與 loss 近似直線，原尺度上通常表示：

```text
error(n) ≈ A / n^α + B
```

其中 `n` 可以是資料量、參數量或 compute，`B` 是無法再下降的 asymptote 或 irreducible error。當模型還離 asymptote 很遠時，log-log plot 會呈現清楚直線；接近下限後，曲線會逐漸變平。

這種 polynomial decay 在簡單統計問題中很自然。估計 Gaussian mean 時，均方誤差約是 `σ² / n`，slope 約為 `-1`。但神經網路的 data scaling exponent 通常小很多，例如約 `-0.1` 到 `-0.3` 的量級。這代表語言模型從資料中學習的速度比簡單參數估計慢得多，也比較像高維 non-parametric estimation：任務越彈性、函數類越複雜，樣本效率越低。

這個解釋不必被當成完整理論，但它提供了有用直覺：scaling law 的斜率不是裝飾，它在告訴我們模型從某種資源中獲得改進的速度。

## Data Scaling：最自然的外推

最基本的 scaling law 是 data scaling。固定模型與訓練流程，逐步增加資料量，觀察 test loss 如何下降。若超參數調得合理，資料越多應該越好；但如果模型容量不足，資料再多也會進入平坦區，無法突破模型類別的限制。

因此做 data scaling 時，重要的是留在 power-law regime。講者提到「模型大於資料量」時，重點不是嚴格比較參數個數與 token 個數，而是避免模型太小導致資料增加後 loss 不再下降。若已接近 irreducible error，就需要顯式 fit asymptote，否則外推會誤導。

Data scaling 本身可用於 forecasting，但工程上更常問的是資料怎麼選。資料混比、資料重複、資料過濾都會影響 scaling。

資料混比的一個有用直覺是：很多 intervention 主要改變 intercept，而不是 slope。假設 news 與 Wikipedia 有不同混比，小模型實驗可能顯示某個混比的 loss 整體較低。如果不同混比的 slope 近似相同，那小尺度最佳混比也很可能是大尺度最佳混比。這解釋了為什麼實務上有時不必真的擬合複雜 data mixture law，只要訓練一批小模型、選小尺度最佳資料配方再放大，就能得到不錯結果。

資料重複則是另一個問題。當 compute 成長快於可取得的新資料，模型不可避免會看到重複資料。逐字稿中提到，標準 recipe 下重複到數個 epochs 以前可能傷害不大，但超過後，實際 scaling 會比「一直有新資料」的外推更差。固定資料、無限 compute 的極端情況下，單靠重複訓練或加大模型都會遇到遞減報酬，可能需要 regularization、ensembling 等方法榨出更多訊號。

資料過濾也不是固定規則。小 compute 場景下，積極過濾、只保留高品質資料通常合理；大 compute 場景下，若資料太少會被迫重複，最佳 filter 可能反而要放寬，納入更多樣、品質較低但仍有價值的資料。也就是說，資料品質與資料數量的 tradeoff 本身會隨 scale 改變。

## Model Scaling：把架構選擇變成證據

Scaling laws 不只用於資料。它也能回答架構與超參數問題。

例如，Transformer 是否真的比 LSTM 更值得放大？暴力做法是直接訓練一個巨大 LSTM 與巨大 Transformer 比較，但這太貴。Scaling-law 做法是訓練一系列較小模型，在多個 compute 範圍上比較 loss。如果 LSTM 的曲線有較差 intercept，或更糟的是 slope 較差，那放大後通常也不值得期待。

這也是許多現代架構論文會畫 scaling plot 的原因。若新架構只在小尺度贏，但 slope 較差，代表它可能在大尺度被反超。反過來，如果新方法在多個尺度都有更低 loss，且 slope 至少不差，才更像值得放大的候選。

同樣方法可以用於 optimizer 與模型形狀。SGD 與 Adam 的比較可能顯示不同 intercept，但 slope 類似。Depth/width tradeoff 則需要分清哪些 quantity 會隨 scale 改變，哪些可能 scale-invariant。層數本身通常不是 scale-invariant，因為模型變大時層數也會增加；但某種 aspect ratio，例如每層對應的 hidden dimension，可能在不同模型大小下維持近似最佳值。這類分析能讓「我們固定某個比例放大」不只是慣例，而有實驗依據。

Mixture of Experts 讓事情更複雜。MoE 中 total parameters 與 active parameters 分離，未被當前 token 啟用的 expert 參數仍可能改善 loss。這意味著「模型大小」不再只有一個數字；active parameters、total parameters、sparsity level 都可能成為 scaling law 的資源軸。

## Batch Size 與 Learning Rate

真正訓練大模型時，有兩個參數幾乎一定要重新處理：batch size 與 learning rate。

Batch size 有 systems 面的壓力。上一階段 parallelism 告訴我們，data parallelism 需要足夠大的 batch 才能有效餵飽硬體。但 batch 不是越大越好。小 batch 時，增加 batch size 可以降低 gradient noise，訓練效率幾乎線性改善；但超過某個點後，訓練不再主要受 variance 限制，而是受 local descent direction 與全域 optimum 的偏差限制，收益開始遞減。

這個折衷點稱為 critical batch size。估計方式是選一個 target loss，掃不同 batch size，記錄到達 target loss 所需的 steps 與 examples。steps 越少通常需要更大 batch，examples 越少通常需要更小 batch。擬合兩者 tradeoff 後，可以把 critical batch size 理解為：

```text
B_crit ≈ E_min / S_min
```

其中 `E_min` 是達到該 loss 所需的最少 examples，`S_min` 是最少 steps。這不是唯一推導，但提供了工程上可用的估計。

Critical batch size 之所以屬於 scaling lecture，是因為它也會隨 target loss 呈現規律變化。模型訓練到越低 loss，最佳 batch size 通常越大。這對大規模訓練是好消息：越接近 frontier 的 run，越可能用大 batch 獲得 parallelism，而不立刻付出嚴重樣本效率代價。

Learning rate 的尺度問題則有兩種哲學。第一種是直接估計最佳 learning rate 如何隨模型大小改變，再外推到大模型。常見直覺是模型越寬、參數越多，learning rate 應該越小。第二種是重新 parameterize 模型，例如調整 initialization 與各層 step size，讓不同尺度的最佳 learning rate 盡量保持一致；μP 屬於這一類想法。本講只點到為止，細節留給後續進階 scaling lecture。重要的是：兩種方法都曾在大規模訓練中使用，沒有必要把其中一種神化。

## Upstream 與 Downstream 的落差

Scaling laws 在預訓練 loss、perplexity、log likelihood 上通常最乾淨。這些 metric variance 低，資料量大，模型重跑後差異也常很小。因此它們適合用來建立可外推的 regularity。

但 perplexity 最好的模型，不一定 downstream 最好。逐字稿提到某些 T5-style architecture study 中，log likelihood 最漂亮的模型，並不是下游任務最好的模型。這提醒我們：scaling law 可以可靠預測 upstream loss，不等於自動保證 downstream capability。

工程上，預訓練團隊不能只說「perplexity 很好，剩下是 post-training 的問題」。如果 downstream 表現重要，就需要建立 upstream 到 downstream 的 transfer 證據，或直接在下游指標上做更謹慎的 scaling study。只是 downstream metric 通常更 noisy，外推也更難。

## Compute-Optimal Scaling 與 Chinchilla

最有名的 scaling-law 問題之一是：固定 compute budget 時，要用更大模型，還是更多 tokens？

粗略地說，預訓練 compute 與參數量、token 數近似成正比：

```text
C ∝ N × D
```

其中 `N` 是模型參數，`D` 是訓練 tokens。若模型太小、資料太多，loss 很快變平，後續 token 被浪費；若模型太大、資料太少，模型 undertrained。Kaplan 與 Rosenfeld 類 work 會假設一個 joint scaling law，把 loss 寫成 `N` 與 `D` 的函數，再在固定 `C` 下求最佳配置。

Kaplan 的早期結論導向越大 compute 下訓練越大的模型，tokens per parameter 隨 compute 下降。這在 GPT-3 之後的巨大 dense model 風潮中很有影響力。

Chinchilla 則給出不同結論：許多模型太大、資料太少；更 compute-optimal 的方向是較小模型搭配更多 tokens。常見口訣是約 20 tokens per parameter。但本講最重要的提醒是：不要把 20:1 當永恆黃金比例。Chinchilla 的價值在於展示如何更仔細地 fit scaling laws，以及哪些細節會改變結論。

Chinchilla 使用三種方法。第一種是 lower envelope：從多條 training curves 中，找同 FLOP 下達到的最佳 loss，再看這些點對應的模型大小如何隨 compute 改變。第二種是 IsoFLOPs：固定多個 FLOP budgets，在每個 budget 下掃模型大小與資料量 tradeoff，找 terminal loss 最低點，再外推最佳點。第三種是直接 fit joint functional form，把 loss surface 當成 `N` 與 `D` 的函數來擬合。

其中 IsoFLOPs 特別實用。它的程序簡單：固定 compute，掃設計自由度，找該 compute 下的最佳點；對多個 compute 重複後，看最佳點如何移動。當你不知道某個 tradeoff 怎麼決定時，IsoFLOPs 是很好的預設工具。

## 為什麼 Scaling Laws 會出錯

Kaplan 與 Chinchilla 的差異不是因為其中一邊完全不懂 scaling laws，而是因為 scaling laws 對細節敏感。

第一，參數怎麼數會改變 x 軸。Embedding parameters、final softmax/output layer parameters、non-embedding parameters 是否納入，都會影響曲線形狀。這在小模型 regime 尤其敏感。

第二，小模型的訓練 recipe 必須合理。如果 warmup 太長，某些小模型在 warmup 結束前還沒有真正收斂，那它們提供的 scaling datapoint 就不是同一種訓練流程的乾淨測量。

第三，batch size 與 optimizer 不能偷懶。固定一個大 batch size 可能對小模型 suboptimal；若小模型都被壞 batch size 傷害，外推得到的 scaling law 會反映這個傷害。

這帶出一個重要心法：scaling law 像是某種 lower bound。它告訴你「如果沿用這個 recipe 放大，會得到什麼」。若 recipe 本身很差，scaling law 也只會忠實預測壞 recipe 的大尺度結果。

## 工程取捨

Training-compute optimum 不一定是 production optimum。Chinchilla ratio 是在節省訓練 compute 的觀點下得到的；但如果模型要被大量 serving，inference 成本可能比 final training run 更重要。此時我們往往寧可訓練較小但看過更多 tokens 的模型，讓服務成本下降。這種模型常被稱為 overtrained，但在實務上可能正是正確訓練量。

這也解釋了為什麼後續模型常超過 20 tokens per parameter，甚至轉向 MoE 等架構：目標不只是訓練時 FLOPs 最省，而是整個模型生命週期的成本與品質最佳。

Scaling laws 因此不是替工程師做決策，而是把 tradeoff 攤開。若目標是研究、只在意 training compute，可能接近 Chinchilla-style optimum；若目標是高流量服務，可能選更小、更充分訓練、更便宜推論的模型；若目標是探索新架構，則應先看它的 scaling trend 是否穩定。

## 常見誤解

第一個誤解是把 scaling law 當成自然定律。它其實是經驗規律與工程流程的結合。要得到可外推曲線，必須選對 x 軸、控制好 recipe、確保資料與評估穩定。

第二個誤解是只看小尺度勝負。小模型贏不代表大模型贏；斜率更差的方法可能在放大後被反超。比較方法時要同時看 intercept 與 slope。

第三個誤解是把 Chinchilla 的 20:1 當固定答案。它是特定目標與條件下的 compute-optimal 結論，不必然適用於 serving-heavy production model。

第四個誤解是認為 perplexity 好就萬事大吉。Perplexity 是乾淨的 upstream metric，但 downstream transfer 仍需驗證。

第五個誤解是忽略小模型實驗的超參數。Scaling law 的 datapoint 不是中立觀測；它們會受 warmup、batch size、optimizer、parameter counting 影響。

## 小結

Scaling laws 的核心承諾是：在大模型訓練前，用小模型實驗建立可外推的數字預期。Data scaling 告訴我們資料增加時 loss 如何下降；model scaling 讓架構與 optimizer 比較更有證據；critical batch size 與 learning rate scaling 把訓練超參數帶入跨尺度分析；compute-optimal scaling 則處理模型大小與 token 數的配置。

但這個工具必須謹慎使用。Scaling laws 不是按下按鈕就得到答案。它們依賴良好實驗設計、正確尺度、穩定 metric，以及對 production 目標的清楚定義。真正的重點不是背一條線，而是建立一種大規模工程習慣：昂貴 run 開始前，先用小規模證據知道自己大概會得到什麼。

## 相關作業與材料

- Lecture 9 PDF：`data/cs336/lectures material/lecture_09.pdf` 已下載，待材料階段閱讀。
- Assignment 3 code repo：已下載，待材料階段閱讀。
- 逐字稿中提到 Assignment 3 會讓學生做出類似 data scaling law 的圖；本章目前未閱讀 assignment repo，不整合作業細節。
- 待材料階段補齊：投影片中的 exact equations、圖表、作者名校正、Chinchilla 三種方法的數值與 MoE/critical batch size 的圖示細節。
