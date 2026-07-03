# PyTorch (einops)

本章來源逐字稿：`data/cs336/transcripts/02_Stanford_CS336_Language_Modeling_from_Scratch_Spring_2026_Lecture_2_PyTorch_eino.txt`

完整閱讀筆記見：[Lecture 2 閱讀筆記](notes/lecture-02-pytorch-einops.md)。

## 導讀：把 PyTorch 程式看成資源流

訓練語言模型不是只把資料丟進 `model.forward()`，再等 loss 下降。CS336 在第二講先建立一個更工程化的視角：任何一段訓練程式，都可以拆成 tensor 的儲存、搬移與運算。你如果不知道某個 tensor 的 shape、dtype、生命週期，以及它在 forward、backward、optimizer step 中扮演什麼角色，就很難判斷模型為什麼慢、為什麼 OOM，或為什麼硬體利用率低。

這一講的主角有兩個。第一個是 PyTorch tensor：參數、梯度、activation、optimizer state、資料批次，最後都落成 tensor。第二個是 einops/einsum：它不是魔法加速器，而是一種更可靠的張量語言，讓我們用命名維度描述運算，少依賴脆弱的 `transpose(-2, -1)` 與隱含 broadcasting。

本章要回答的核心問題是：在有限 compute 和 memory 下，如何用足夠簡單的估算，理解一個語言模型訓練工作負載的形狀。

## Tensor、dtype 與記憶體

Tensor 的記憶體成本很直接：

```text
memory bytes = number of elements * bytes per element
```

困難不在公式，而在你能不能在寫程式時持續知道每個 tensor 有多少元素，以及它的 dtype 是什麼。以浮點數為例，FP32 每個值 4 bytes，數值範圍和精度都比較穩，但訓練大型模型時太貴。FP16 每個值 2 bytes，速度和記憶體都較好，卻因 exponent bits 較少，dynamic range 不足，容易 underflow、overflow 或 NaN。

BF16 是深度學習裡常見的折衷。它同樣每個值 2 bytes，但保留接近 FP32 的 dynamic range，犧牲的是 mantissa resolution。對語言模型訓練來說，隨機梯度本來就有噪聲，許多運算更需要「不要爆掉」而不是「小數點後非常精準」，因此 BF16 經常比 FP16 更實用。

實務訓練通常採用 mixed precision。粗略地說，parameters、activations、gradients 可以用 BF16，optimizer states 常保留 FP32。原因是 optimizer 會長期累積梯度統計量，例如平方梯度、一階與二階動量；這些狀態若精度太低，穩定性會變差。

更低 bit 的 FP8、FP4 代表硬體與軟體棧的趨勢，但本講只把它們當背景知識。低 bit inference 和低 bit training 也要分開看：把訓練好的模型量化到低 bit 供推論使用，和直接用一兩 bit 訓練可信的大型語言模型，是不同難度的問題。

## 用 einops 讓維度變成程式語意

矩陣乘法的傳統寫法常把維度藏在位置裡。看到 `x @ y.transpose(-2, -1)` 時，讀者必須在腦中追蹤倒數第二維、倒數第一維各自代表什麼。模型一旦有 batch、sequence、head、hidden 等多個維度，這種寫法很容易出錯。

einsum 的想法是把維度命名。假設 `x` 的維度是 `seq1 hidden`，`y` 的維度是 `hidden seq2`，輸出要是 `seq1 seq2`，那麼 `hidden` 沒出現在輸出端，就表示沿著 hidden 維度加總。這和矩陣乘法相同，但 bookkeeping 更清楚。

einops 還提供幾個常用操作：

- `reduce`：用命名維度表達 sum、mean、max、min 等 reduction。沒有出現在輸出 pattern 的維度會被消去。
- `rearrange`：拆分或合併維度。例如一個 hidden 維度其實是 `heads * hidden_per_head`，就能用括號 pattern 把它拆開。
- `...`：代表任意數量的前綴 batch 維度，讓函式不必硬編碼輸入 rank。

這些工具的主要價值是降低維度錯誤，而不是自動帶來速度提升。底層通常仍會落到相同的 primitive operations。對從零實作 Transformer 來說，這一點很重要：我們希望程式能忠實呈現數學結構，也希望讀程式的人能看出每個維度的意義。

## Flops、FLOPS/s 與 MFU

資源估算的第一個量是 flops，也就是 floating point operations 的數量。它描述一個運算「需要做多少浮點工作」。硬體規格表上的 FLOPS/s 則是另一件事，表示硬體每秒理想上能做多少浮點工作。

大型模型訓練中，矩陣乘法通常支配計算量。若 `X` 是 `B x D`，`W` 是 `D x K`，則 `X @ W` 的 forward 大約需要：

```text
flops ~= 2 * B * D * K
```

乘上 2 是因為每個乘積累加包含 multiplication 和 addition。元素級運算如加法、ReLU、GELU 也有成本，但對足夠大的矩陣來說，通常不是 flops 主體。

把理論工作量和真實時間接起來，需要量測 wall-clock time。GPU 執行常是非同步的，所以計時前後要放 synchronization barrier，否則你量到的可能只是 kernel launch 回傳的時間。量到實際 FLOPS/s 後，可以定義：

```text
MFU = actual FLOPS/s / promised FLOPS/s
```

MFU 是 Model FLOPs Utilization。它回答的是：你的模型實際用了硬體理論峰值的多少比例。現代模型若有約 0.5 的 MFU 已經不差；單純大型矩陣乘法可以更高，但完整訓練迴圈還有記憶體搬移、非 matmul kernel、通訊與框架 overhead。

## 為什麼只算 flops 不夠

硬體不是抽象的計算神諭。Tensor 通常先在高頻寬記憶體中，運算時要搬到 accelerator，算完再把結果寫回。於是時間受兩個因素限制：

- accelerator speed：每秒能做多少浮點運算。
- memory bandwidth：每秒能搬多少 bytes。

本講用 arithmetic intensity 連接兩者：

```text
arithmetic intensity = flops / bytes moved
```

如果一個演算法每搬一個 byte 只能做很少工作，它通常是 memory bound；大部分時間都在等資料。如果每搬一個 byte 能做很多工作，它才有機會 compute bound，也就是主要受計算單元速度限制。

幾個例子能建立直覺：

- ReLU 幾乎只是在每個元素上做比較，但仍要讀入和寫回 tensor，所以 intensity 很低，是 memory bound。
- GELU 每個元素做的浮點工作比 ReLU 多，但仍然只是讀一批值、寫一批值，通常也還是 memory bound。
- Dot product 和 matrix-vector product 需要搬很多資料，重用程度有限，仍容易 memory bound。
- Matrix-matrix multiplication 讀入的是 `O(N^2)`，計算卻是 `O(N^3)`，矩陣夠大時 arithmetic intensity 會變高，因此能更好地餵飽 GPU。

這也是 Transformer 訓練對 GPU 友善的原因之一：它把大量工作寫成大型矩陣乘法。相對地，推論階段一次生成一個 token，常常更像 matrix-vector product，重用程度低，記憶體頻寬容易成為瓶頸。

Roofline plot 是同一套想法的視覺化：低 arithmetic intensity 的演算法沿著記憶體頻寬斜線上升；到某個點後，硬體 peak FLOPS/s 形成天花板，再增加 intensity 也不能超過該峰值。

## Backward 為什麼約是 forward 的兩倍

訓練不是只有 forward。以一層 linear layer 為例，forward 做一次矩陣乘法。Backward 至少要算兩類梯度：

- 對輸入 activation 的梯度，讓誤差信號繼續往前傳。
- 對參數的梯度，讓 optimizer 更新權重。

這兩個梯度各自也可寫成矩陣乘法，成本大致各等於一次 forward matmul。因此對 linear-heavy 的網路來說：

```text
forward ~= 2 * data points * parameters
backward ~= 4 * data points * parameters
training ~= 6 * data points * parameters
```

這就是常見 `6 * tokens * parameters` 粗估的來源。它不是神祕常數，而是「一次 forward 加上兩份 backward 工作」的結果。對 Transformer，當 context length 不過度拉長時，這是很有用的近似；若 sequence 很長，attention 的 context-length-squared 成本會變得更顯著。

## Optimizer state 也是模型的一部分

從記憶體角度看，模型不只是權重檔。訓練時至少要考慮：

- parameters：模型權重本身。
- gradients：每個參數對 loss 的梯度。
- activations：forward 中存下來、backward 會用到的中間值。
- optimizer states：optimizer 為每個參數維護的統計量。

AdaGrad 會存平方梯度累積量，Adam/AdamW 會存一階與二階 moment。這些 state 通常用 FP32，因此 Adam 系列光 optimizer state 就可能是每參數 8 bytes。再加上 BF16 參數與梯度，粗估常會看到每參數十多個 bytes 的記憶體需求。這解釋了為什麼「模型參數量乘以 2 bytes」遠遠低估訓練所需 HBM。

Optimizer state 通常不是主要 compute bottleneck，但它決定模型能不能放得進 GPU 記憶體。這在估算最大可訓練模型大小時尤其重要。

## 兩個用 compute 換 memory 的工具

第一個工具是 gradient accumulation。大 batch 有助於訓練穩定，但一次塞進大 batch 會讓 activation memory 爆掉。做法是把大 batch 切成 micro-batches：每個 micro-batch 做 forward/backward 並累積梯度，不立刻清空；累積到目標 batch 後才 optimizer step。這樣可以用較小的瞬時 activation memory 模擬較大的 batch。

第二個工具是 activation checkpointing，也叫 gradient checkpointing 或 rematerialization。預設訓練會存所有中間 activation，因為 backward 要用。Checkpointing 則只存部分節點，缺少的中間值在 backward 時從最近 checkpoint 重新算一次。它的本質是用額外 compute 換較低 memory。

這個取捨可以很溫和，也可以很極端。若只在 block 內少存一些中間 activation，可能省下可觀記憶體而重算成本有限。若幾乎不存中間層，記憶體最低，但每次 backward 都要從很前面重算，成本可能大幅增加。課堂中提到一個平衡直覺：每隔約 `sqrt(L)` 層存 checkpoint，可讓 activation memory 和 recomputation overhead 都落在約 `sqrt(L)` 的尺度。

## 工程取捨

本講的核心工程取捨可以整理成幾條：

- Precision：FP32 穩但貴；FP16 省但 range 不足；BF16 是語言模型訓練常見折衷；optimizer state 常需要 FP32。
- Readability：einops 不保證更快，但能降低維度錯誤，尤其適合 Transformer 這類多維 tensor 程式。
- Batch size：較大 batch 和矩陣通常提高 arithmetic intensity，但也增加 activation memory。
- Memory vs compute：gradient accumulation 和 activation checkpointing 都是在用更多步驟或重算，換取較低瞬時記憶體。
- Training vs inference：訓練可把整段序列一起處理，形成大型 matmul；推論逐 token 生成，常更受記憶體頻寬限制。

這些取捨沒有單一答案。重要的是每次調整都能說清楚：省了哪一種 memory、增加了哪一種 compute、是否改善了 arithmetic intensity，以及是否真的提高 wall-clock throughput。

## 常見誤解

第一個誤解是「flops 少就一定快」。如果運算是 memory bound，減少少量 flops 可能幾乎不改變時間；真正卡住的是 bytes moved。

第二個誤解是「GELU 比 ReLU 複雜很多，所以一定慢很多」。在大型 GPU 上，兩者若都被記憶體頻寬限制，額外 element-wise flops 不一定支配時間。

第三個誤解是「BF16 只是比較粗的 FP32」。BF16 的重點不是平均地犧牲所有能力，而是保留 dynamic range、犧牲 resolution。這正是它比 FP16 更適合許多訓練場景的原因。

第四個誤解是「模型記憶體等於參數量乘以 dtype bytes」。訓練還有 gradients、activations、optimizer states。Adam 類 optimizer 的 state 往往是大頭之一。

第五個誤解是「einops 是效能最佳化」。它主要是語意與可維護性工具。好的維度命名讓你更不容易把 head、sequence、hidden 搞混，這對從零實作比微小語法差異更重要。

## 小結

Lecture 2 把 PyTorch 從「會用 API」提升到「能估算資源」。Tensor 的大小由元素數和 dtype 決定；矩陣乘法主導大多數訓練 flops；forward 加 backward 給出 `6 * data points * parameters` 的常用估算；MFU 衡量實際吞吐量離硬體理論峰值多遠；arithmetic intensity 則解釋為什麼有些程式即使 flops 不多也很慢。

從零實作語言模型時，這些概念會一路跟著我們。架構設計、optimizer 實作、batch size 選擇、checkpointing、parallelism、inference，都不是彼此孤立的技巧，而是在同一個資源預算下做取捨。
