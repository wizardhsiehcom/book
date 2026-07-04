# Lecture 3：Architectures

## 導讀

訓練語言模型時，架構設計常讓人覺得混亂：為什麼現在大家用 RMSNorm 而不是 LayerNorm？為什麼 FFN 要用 SwiGLU？RoPE 到底改變了什麼？GQA 是架構選擇還是推論最佳化？這一講的重點不是從第一原理推導出唯一答案，而是觀察許多成功模型的共同選擇，整理出一組可用來從零實作語言模型的工程基準。

講者把 architecture 看成一組折衷。模型要能學習資料，也要有效使用 GPU；要有足夠表徵能力，也要在長時間訓練中不爆掉；訓練完還要能用合理成本服務使用者。因此現代 Transformer 的許多「小改動」其實都不是小事，而是表徵、硬體、穩定性與推論成本共同形成的結果。

## 核心內容

原始 Transformer 的大方向非常耐用：token 進入 residual stream，交替通過 attention 與 feed-forward network，最後輸出下一個 token 的機率分布。現代 decoder-only 語言模型仍大致保留這個骨架。真正改變的地方多半在 normalization、activation、position embedding、attention head 的共享方式，以及穩定化技巧。

第一個共識是 normalization 不應放在 residual stream 裡。原始 Transformer 採用類似 post-norm 的形式，也就是每個子層算完後再把 residual 結果 normalize。現代模型多改成 pre-norm：先 normalize，再進 attention 或 FFN，最後把輸出加回 residual stream。這背後的直覺是保持 residual stream 乾淨，讓訊號與梯度能沿著加法路徑直接穿過深層網路。

第二個共識是 RMSNorm 幾乎取代完整 LayerNorm。LayerNorm 會扣掉平均值、除以標準差，再加上 scale 與 bias；RMSNorm 則主要只用 root mean square 做尺度正規化。從表徵能力看，完整 LayerNorm 更有彈性，但在語言模型中這個額外彈性通常沒有帶來足夠收益。從系統角度看，normalization 的 FLOPs 佔比雖小，卻需要大量記憶體搬移，可能顯著拖慢 runtime。RMSNorm 省掉不必要操作，讓模型更容易把時間花在大矩陣乘法上。同樣邏輯也解釋了為什麼現代 Transformer 常移除 linear layer 的 bias。

Transformer block 中的 FFN 早期可以只是：

```text
FFN(x) = activation(x W1) W2
```

現代模型大多使用 gated linear unit，例如 SwiGLU 或 GeGLU：

```text
FFN(x) = (activation(x W1) * x V) W2
```

這個 gate 逐元素調節 activation 的輸出，讓 FFN 多一種控制資訊流的方式。因為 GLU 多了一個矩陣 `V`，如果要和原本 MLP 參數量接近，常見做法是把 FFN hidden dimension 乘上 `2/3`。因此傳統非 gated MLP 常用 `ffn_dim ≈ 4 * d_model`，而 GLU 版本常落在 `ffn_dim ≈ 2.67 * d_model` 附近。比較重要的不是 SwiGLU 和 GeGLU 誰在每個情境都更好，而是「gating」這個軸線本身。

位置資訊則是另一個核心差異。Attention 本身不理解順序，如果不加入位置資訊，模型很難區分 token 的排列。RoPE 的核心想法是用旋轉表示位置。假設兩個 token 在句子中相鄰，不管它們出現在句首還是句尾，模型真正關心的常是它們的相對距離。RoPE 讓每個 token 的 query/key 向量依照位置旋轉；如果兩個 token 的絕對位置一起平移，它們各自的角度都會改變，但相對角度保持不變。因此它們的內積可以主要反映相對位置。

在高維向量中，RoPE 把 hidden dimension 切成多個二維 pair。每個 pair 用不同頻率旋轉：低頻 pair 轉得慢，適合承載長距離關係；高頻 pair 轉得快，適合辨識局部鄰近。實作時，RoPE 通常套在每層 attention 的 Q 與 K 上，而不是只在最底層 token embedding 加一次。

當真的要訓練模型時，架構會立刻變成一堆具體數字。FFN ratio 常用的安全區間是：非 gated MLP 約 `4 * d_model`，GLU 類 MLP 約 `2.5` 到 `3.5 * d_model`。Attention head 的常見規則是讓所有 heads 合起來的維度等於 `d_model`。模型深度與寬度的比例也有經驗甜蜜點，許多模型的 `d_model / n_layers` 落在約 100 附近。Vocabulary size 則和資料範圍有關：英文單語模型常使用約 30K；多語與生產級模型常上升到 100K 到 200K。

穩定性是另一個主軸。大模型訓練中途爆掉的成本非常高；一次 loss spike 或 attention degeneration 可能毀掉昂貴訓練。Softmax 是重要危險區，因為它包含 exponential 與 normalization。Output softmax 可用 Z-loss 控制 normalizer：

```text
log p_y = u_y - log Z
loss = cross_entropy + lambda * (log Z)^2
```

Attention softmax 則常用 QK norm。標準 attention 會把 Q 與 K 做 dot product，再進 softmax；如果 Q/K 尺度失控，attention logits 也會失控。QK norm 在 Q/K 相乘前先 normalize，讓 softmax 的輸入尺度更可控。更強的做法是 logit soft capping，用 bounded function 直接限制 logits；它很安全，但也可能犧牲模型表達高信心 attention 的能力。

推論成本也會反過來塑造架構。訓練時，我們可以平行處理整段序列；推論生成時，卻必須一個 token 接一個 token 產生。為了避免每一步重算所有歷史資訊，系統會保存過去 token 的 key/value，也就是 KV cache。標準 multi-head attention 中，每個 head 都有自己的 key/value，KV cache 會隨 head 數增加。Multi-query attention 讓所有 query heads 共用一組 key/value，cache 變小很多但可能損失表徵能力。Grouped-query attention 是折衷：保留多個 query heads，但讓多個 query heads 共用較少的 key/value heads。這大幅降低推論記憶體成本，同時保留接近 multi-head attention 的品質。

長上下文讓 attention 成本急速上升。若每一層都做 full attention，模型能看見全部歷史，但成本很高。Sliding window attention 只允許 token 看固定局部窗口，成本較低，但單層無法直接取得全局資訊。近期常見折衷是交替使用 full attention 與 sliding window attention：局部層先聚合鄰近資訊，全域層再讓資訊跨長距離流動。

## 工程取捨

第一個取捨是表徵能力與硬體效率。RMSNorm、移除 bias、GLU 維度調整、parallel block、GQA，都不是單純數學問題，而是要讓 GPU 做更多高算術強度工作，少做低效率資料搬移。

第二個取捨是穩定性與自由度。Z-loss、QK norm、soft capping 都限制某些尺度或 logits 的行為。限制越強，越能避免訓練爆掉，但也越可能損失模型表達極端關係的能力。實務上會偏好先用溫和技巧；只有在不穩定風險很高時才採取更硬的限制。

第三個取捨是訓練成本與推論成本。標準 multi-head attention 在訓練時直觀且表徵能力強，但推論時 KV cache 昂貴。GQA 之所以重要，是因為它承認模型最終要被服務，而服務成本會反過來塑造架構。

第四個取捨是全域資訊與長上下文成本。Full attention 最直接，但長上下文昂貴；sliding window 便宜，但需要和 full attention 或其他機制混合，才能維持跨長距離資訊流。

## 常見誤解

一個常見誤解是「現代架構選擇都有漂亮理論解釋」。實際上，很多共識是大量實驗與模型報告累積出的工程知識。我們常無法事前純推理出某個小改動一定可行，只能透過跨模型觀察與小規模實驗建立信心。

另一個誤解是「FLOPs 越少就一定越快」。LayerNorm 這類操作 FLOPs 很少，但可能因為記憶體搬移而佔不少 runtime。看系統效率時，arithmetic intensity 與 memory access 和 FLOPs 一樣重要，甚至更重要。

第三個誤解是「regularization 在這裡仍主要防 overfitting」。在大語料、單次 pass、算力受限的語言模型預訓練中，overfitting 往往不是核心問題。Weight decay 的效果可能來自 optimization，而不是傳統 regularization。

第四個誤解是「RoPE 只是另一種 positional embedding」。RoPE 的重點是它改變 Q/K 的幾何關係，使 attention inner product 更自然地依賴相對位置。它不是把一個位置向量加到 token embedding 上那麼簡單。

第五個誤解是「GQA 只是省記憶體的小技巧」。GQA 直接改變 attention head 如何共享 key/value，並且是為自回歸解碼與 KV cache 成本而生的架構折衷。它是部署需求進入模型設計的典型例子。

## 小結

Lecture 3 給出一個現代 decoder-only language model 的實作基準：使用 residual stream 外的 normalization，通常採 pre-norm；用 RMSNorm 取代完整 LayerNorm；移除不必要 bias；FFN 採 SwiGLU 或其他 GLU 類 activation；用 RoPE 在 Q/K 中加入相對位置；選擇落在共識區間的 FFN ratio、head dimension、depth-width ratio 與 vocabulary size；視需求加入 QK norm、Z-loss 等穩定性技巧；推論導向模型則多半使用 GQA；長上下文模型則常混合 full attention 與 sliding window attention。

這些選擇不是唯一能訓練語言模型的方式，但它們代表目前從零實作時最合理的起點。更重要的是，本講示範了一種讀模型報告的方法：不要只記每個模型用了什麼，而要問哪些選擇反覆出現、哪些選擇仍在變動、哪些改動是為了表徵能力、哪些是為了硬體效率、哪些又是為了訓練穩定與推論成本。

## 相關作業與材料

- Course material：`data/cs336/lectures material/lecture_03.pdf`。狀態：已核對 PDF metadata / outline；投影片未完整閱讀。
- Assignment 關聯：Assignment 1（`data/cs336/code/assignment1-basics-main/`）對應 Transformer LM、RMSNorm、RoPE、attention、FFN、optimizer 與 training loop 的實作範圍；Assignment 3（`data/cs336/code/assignment3-scaling-main/`）對應把模型設定放入 scaling experiment 的範圍。狀態：已核對 README、PDF outline、測試/API 檔案；handout 未完整閱讀。
- 本段只整理學習目標與章節關聯，不提供作業解答。
