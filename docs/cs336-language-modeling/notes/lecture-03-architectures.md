# Lecture 3: Architectures 閱讀筆記

## 基本資料

- 課程：Stanford CS336 Language Modeling from Scratch, Spring 2026
- 講次：Lecture 3
- 主題：Architectures
- 逐字稿檔案：`data/Stanford CS336 Language Modeling from Scratch/03 - Stanford CS336 Language Modeling from Scratch ｜ Spring 2026 ｜ Lecture 3： Architectures.en.txt`
- 完整閱讀範圍：第 1 行到第 2648 行
- 總行數：2648 行
- 外部資料：未使用；本筆記只根據逐字稿整理

## 本講主問題

本講要回答的問題不是「Transformer 的唯一正確架構是什麼」，而是：如果要從零訓練現代語言模型，面對 layer norm、activation、position embedding、head 數、FFN 維度、vocabulary size、regularization、stability trick、attention variant 等大量選項時，哪些選擇已經變成實務共識，哪些仍是可調的折衷？

講者採取 survey lens：直接觀察許多成功模型的設計，從集體經驗歸納出穩健的規則。這也呼應課程精神：最好是自己訓練模型、做 ablation；如果算力不足，次佳方法是讀大量模型報告，找出共同模式。

## 核心概念

### 1. 架構選擇是多重目標折衷

語言模型架構同時要滿足：

- 能從資料中學到可泛化的表示。
- 能有效利用 GPU，避免被記憶體搬移拖慢。
- 訓練過程不能在中途爆掉。
- 推論時成本不能過高，尤其是長上下文與自回歸解碼。

因此很多設計看起來不優雅，因為它們不是單一理論目標的解，而是表徵能力、硬體效率、穩定性與部署成本共同壓出來的工程形狀。

### 2. Layer norm 的位置：保持 residual stream 乾淨

原始 Transformer 把 layer norm 放在 residual path 內，也就是 post-norm 或 residual norm。現代語言模型幾乎都把 normalization 移到 residual stream 外面，常見是 pre-norm：先 norm，再進 attention 或 FFN，最後把輸出加回 residual stream。

直覺是「keep your residual stream clean」。乾淨的 residual stream 讓 forward signal 與 backward gradient 能直接穿過多層，不必每層都被 layer norm 改變尺度。這有助於深模型的梯度傳播與訓練穩定。

補充觀察：

- 有些模型把 norm 放在 computation 之後但仍在 residual stream 外。
- 有些模型在 block 前後都放 norm。
- 當模型不穩時，實務上常見做法是再加入 normalization，例如 attention 內的 QK norm。

### 3. RMSNorm 取代 LayerNorm

LayerNorm 會做 mean subtraction、variance normalization，再 scale/bias。RMSNorm 省略 mean subtraction 與 bias，主要做尺度 normalization。

重點不是 FLOPs，而是 runtime 與記憶體搬移。LayerNorm 這類 statistical normalization 的 FLOPs 佔比可能很小，卻可能佔顯著 runtime，因為 arithmetic intensity 低，GPU 在搬資料而不是做大矩陣乘法。RMSNorm 在語言模型中通常沒有明顯表徵損失，卻較簡單、較快。

同樣原理也支持移除 transformer linear layer 的 bias：bias 通常貢獻有限，卻增加不划算的記憶體與實作負擔，也可能引入穩定性問題。

### 4. Gated linear units 成為 FFN activation 主流

ReLU、GELU 都能訓練語言模型，但現代模型多採 gated linear unit，如 SwiGLU 或 GeGLU。

一般 FFN 可寫成：

```text
FFN(x) = activation(x W1) W2
```

GLU 類型加入 gate：

```text
FFN(x) = (activation(x W1) * x V) W2
```

因為多了一個矩陣 `V`，若要維持參數量相近，FFN hidden dimension 常乘上 `2/3`。所以非 gated MLP 常見 FFN ratio 約為 4，而 GLU 版本常落在約 2.67 或略高。

講者強調，重要軸線不是 SwiGLU 與 GeGLU 的微小差異，而是「是否 gated」。多個實驗與模型經驗都支持 gated FFN 在參數匹配下有穩定收益。

### 5. Serial block 仍比 parallel block 常見

標準 transformer block 串行執行 attention 再執行 MLP。平行 block 讓 attention 與 MLP 同時作用於同一輸入，再一起加回 residual stream，理論上可分享 layer norm、融合矩陣乘法，帶來系統效率。

但平行化可能犧牲等效深度與表徵能力。雖然 PaLM 等模型曾採用並宣稱系統收益，近年多數模型仍回到 serial block。講者將這解讀為：serial 形式的系統最佳化已足夠好，使 parallel block 的表徵損失不一定值得。

### 6. RoPE：用旋轉表示相對位置

Attention 本身對位置不敏感，必須加入 position information。早期方法包含 sine/cosine absolute embedding、learned absolute embedding、relative bias 等。現代模型常用 RoPE。

RoPE 的目標是讓 attention inner product 只依賴相對位置，而不是絕對位置。做法是把語義向量依照 token 位置旋轉。若兩個 token 的絕對位置一起平移，它們之間的相對角度不變，內積也保持相對位置不變。

高維向量中，RoPE 將維度切成多個 2D pair，各自以不同頻率旋轉：

- 低頻維度轉得慢，可承載長距離關係。
- 高頻維度轉得快，可承載鄰近位置關係。

實作上，RoPE 通常套在 attention 的 query 與 key 上，而不是只在底層 token embedding 加一次。

### 7. Hyperparameter 多數有寬鬆但穩定的共識區間

講者列出幾個常見規則：

- FFN ratio：非 GLU 約 4；GLU 常用 `4 * 2/3 = 2.67` 附近，也有 LLaMA 類模型偏高。
- Attention head：常讓 `num_heads * head_dim = d_model`，也就是所有 heads 合起來維度等於模型 hidden dimension。
- Aspect ratio：模型寬度與深度的比例常落在 `d_model / n_layers` 約 100 附近。
- Vocabulary size：英文單語模型常約 30K；多語與較大型生產模型常約 100K 到 200K。

這些值不是精密常數，而是寬闊 basin。只要落在合理區間，性能差異往往小於系統效率、資料、訓練穩定性等因素。

### 8. Regularization 在語言模型中不一定是 regularization

在 compute-constrained language modeling 中，模型通常只對巨大語料做單次 pass，因此傳統 overfitting 不是主要問題。這讓 dropout 與 weight decay 的角色變得反直覺。

講者指出 dropout 近年較少用，但 weight decay 仍常見。原因可能不是它降低 validation overfitting，而是它與 optimizer、learning rate decay 互動，改善 optimization path。也就是說，weight decay 在這裡可能更像 optimization intervention，而不是經典意義的 regularizer。

### 9. 穩定性技巧：softmax 是危險區

語言模型有兩個重要 softmax：

- output softmax：輸出 vocabulary distribution。
- attention softmax：正規化 attention logits。

Softmax 有 exponential 與 division，容易造成數值或梯度不穩。

重要技巧：

- Z-loss：懲罰 output softmax 的 `log Z` 偏離 0，讓 normalizer 接近穩定範圍。
- QK norm：在 Q 與 K 進入 dot product 前做 normalization，控制 attention logits 的尺度。
- Logit soft capping：用類似 `tanh` 的 bounded function 限制 logits，強力穩定但可能犧牲表徵能力。

### 10. GQA / MQA：為推論成本重塑 attention

訓練或 prompt prefill 可平行處理整段序列，算術強度較高。自回歸解碼則必須一 token 一 token 生成，依賴 KV cache。此時瓶頸常是 memory access，而不是純 FLOPs。

Multi-query attention (MQA) 讓多個 query heads 共用同一組 key/value heads，大幅縮小 KV cache，但可能損失表徵能力。Grouped-query attention (GQA) 是折衷：query heads 保持多個，但 key/value heads 分組共享。這在推論成本與模型品質間取得較好平衡，因此成為現代模型常見設計。

### 11. Sliding window attention 與長上下文

全域 attention 在長上下文下成本高。Sliding window attention 只讓 token 看局部窗口；若與 periodic full attention 交替使用，就能在局部成本與全局資訊間折衷。

講者指出近年模型常採混合模式：部分層 full attention，部分層 sliding window 或其他便宜機制。這反映長上下文仍是架構創新的活躍區域。

## 重要定義、公式與演算法

### LayerNorm 與 RMSNorm

LayerNorm 概念：

```text
LayerNorm(x) = gamma * (x - mean(x)) / sqrt(var(x) + eps) + beta
```

RMSNorm 概念：

```text
RMSNorm(x) = gamma * x / sqrt(mean(x^2) + eps)
```

RMSNorm 省略 mean subtraction 與 bias，換取更低資料搬移與更簡單的 kernel。

### GLU 類 FFN

非 gated FFN：

```text
y = activation(x W1) W2
```

Gated FFN：

```text
y = (activation(x W1) * x V) W2
```

參數匹配常用 rule：

```text
ffn_dim_glu ~= (2 / 3) * ffn_dim_nonglu
```

### RoPE 的相對位置目標

希望 embedding 函數滿足：

```text
<f(x_i, i), f(y_j, j)> = g(x_i, y_j, i - j)
```

也就是 inner product 只依賴 token identity 與相對距離，而非絕對位置。

實作輪廓：

1. 產生每個 position 對應的 sine/cosine。
2. 將 query/key 向量切成 2D pairs。
3. 每個 pair 按 position 與該 pair 的 frequency 旋轉。
4. 用旋轉後的 Q/K 做 attention dot product。

### Output softmax 與 Z-loss

log probability 可拆成：

```text
log p_y = u_y - log Z
Z = sum_i exp(u_i)
```

Z-loss 概念：

```text
loss = cross_entropy + lambda * (log Z)^2
```

目的不是改變 softmax 表達，而是避免 normalizer 遠離穩定範圍。

### QK norm

標準 attention 會計算：

```text
softmax(Q K^T / sqrt(d)) V
```

QK norm 在 Q/K 進入 dot product 前做 normalization：

```text
softmax(norm(Q) norm(K)^T / sqrt(d)) V
```

它控制 attention logits 尺度，降低 attention degeneration 與 gradient spike。

### GQA / MQA

- MHA：每個 query head 有自己的 key/value head。
- MQA：所有 query heads 共用一組 key/value。
- GQA：多個 query heads 共用一組 key/value；key/value head 數少於 query head 數。

GQA 的核心演算法改動很小，但大幅影響 KV cache 大小與推論記憶體頻寬。

## 工程限制與取捨

- FLOPs 不是 runtime。小型 normalization 或 bias 操作 FLOPs 少，但可能因 memory movement 造成高 runtime。
- GPU 喜歡大矩陣乘法；architecture 會為了 arithmetic intensity 改寫。
- 深模型可能有 pipeline parallel 的系統麻煩；寬模型較容易 tensor parallel。
- 訓練穩定性本身就是成本問題：若中途 loss spike 或 divergence，昂貴訓練可能報廢。
- 推論階段的 KV cache 與 memory bandwidth 會改變 attention 設計，GQA 是典型例子。
- 長上下文不能只靠全域 attention；混合 full attention 與 local/cheap layer 是近期趨勢。

## 例子與模型觀察

- LLaMA 2 之後，許多模型採用 LLaMA-like 設計：RMSNorm、pre-norm、SwiGLU、RoPE、serial blocks。
- Google 系模型常比較大膽，例如 T5 的極大 FFN ratio、PaLM 的 parallel layers、Gemma 系列的 soft capping 與其他位置/長上下文變體。
- GPT-3 可用 GELU 與較早設計成功訓練，說明現代共識不是唯一可行路徑，而是更常見、更穩健的路徑。
- GPT-J 在 RoPE 與 parallel block 的傳播上有歷史影響。
- Cohere、LLaMA 4、Gemma 4、Olmo 3 等被提到作為 sliding window/full attention 混合趨勢的例子。

## 問答重點

- 架構知識如何內化？講者建議兩條路：廣泛看模型報告找模式，以及自己在小尺度實驗形成直覺。單讀一篇 paper 往往不夠，因為現代報告不一定公開所有細節。
- Parallel layers 是否真的無損？PaLM 報告宣稱性能不掉且系統利用率提升，但後續模型較少採用，可能暗示有表徵損失；缺少乾淨控制實驗。
- Relative embedding 不一定要能 factorize 成 inner product。RoPE 的美學與技術限制是相對位置且可寫成 embedding inner product；Alibi 等方法也能有效，但不是同一類。
- bits per byte 可否比較不同 tokenizer？若 tokenizer 是 complete、不改變原始 byte sequence，且用相同 byte 數 normalize，bits per byte 是有效比較；perplexity 則受 tokenization 長度影響較大。
- 架構 hyperparameters 會不會訓練中改變？多數架構選項固定，因為改了會不相容；weight decay 可與 learning rate schedule 一起調整。

## 從零實作語言模型的意義

這一講對「from scratch」特別重要，因為從零實作時，很多看似細節的選擇其實會決定模型能否訓練、能否有效跑在 GPU 上、能否便宜推論。

實作一個現代 decoder-only LM 時，合理 baseline 應包含：

- residual stream 外的 normalization，通常 pre-norm。
- RMSNorm 而不是完整 LayerNorm。
- 移除不必要 bias。
- SwiGLU 或其他 GLU 類 FFN。
- RoPE 套在 Q/K。
- 合理 FFN ratio、head dimension、aspect ratio。
- GQA 以降低推論 KV cache 成本。
- QK norm、Z-loss 或其他穩定性工具視規模與訓練狀況加入。

這些不是「追流行」，而是把過去大量失敗與昂貴實驗壓縮成可執行的初始設計。

## 跨章連結

- Lecture 1 tokenization：vocabulary size 與 tokenizer 完整性會影響多語能力、bits per byte 比較與 output softmax 成本。
- Lecture 2 PyTorch / einops：本講的 RMSNorm、SwiGLU、RoPE、GQA 都會落到 tensor shape 與高效實作。
- Lecture 4 attention alternatives：本講刻意只談 dense attention 內的改動；state space model、linear attention、DeltaNet 等留到下一講。
- GPU / kernel 相關章：arithmetic intensity、memory movement、normalization kernel、矩陣乘法融合會在系統章更深入。
- Parallelism 章：depth/width aspect ratio 與 pipeline/tensor parallel 的取捨會連到分散式訓練。
- Inference 章：KV cache、GQA、prefill vs decode 的成本模型會在推論章展開。
- Scaling laws 章：本講多次提到寬鬆 hyperparameter basin 與 FLOPs 主導效果，會連到 scaling law 的實驗觀點。
- Evaluation 章：architecture 小改動常需要下游任務、loss、runtime、穩定性一起評估。

## 暫不處理的外部補充

依任務要求，本次不加入外部資料。以下內容適合主控 agent 或後續章節視需要補：

- 各模型技術報告的精確表格與 citation。
- RoPE、ALiBi、relative bias 的形式化推導。
- QK norm、logit soft capping、Z-loss 的更多實驗數據。
- GQA/MQA/MLA 的推論成本公式完整推導。
- Sliding window attention 在不同模型中的具體 layer pattern。
- State space model 與 gated DeltaNet，應交給 Lecture 4。

