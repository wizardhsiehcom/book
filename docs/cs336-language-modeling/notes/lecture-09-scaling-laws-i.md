# Lecture 9：Scaling Laws I 閱讀筆記

## 基本資料

- 課程：Stanford CS336 Language Modeling from Scratch, Spring 2026
- 講次：Lecture 9, Scaling Laws I
- 逐字稿檔案：`data/cs336/transcripts/09_Stanford_CS336_Language_Modeling_from_Scratch_Spring_2026_Lecture_9_Scaling_Laws.txt`
- 完整閱讀範圍：第 1 行到第 2390 行
- 總行數：2390
- 本筆記限制：未使用網路搜尋，未加入逐字稿外部資料。講者提到的 Kaplan、Rosenfeld、Chinchilla、Hessness、Hestness/Hessness、Hassabis、DataDecide、Epoch AI、Pearson and Song、Resolving Discrepancies in Compute Optimal Scaling of Language Models 等，只依逐字稿內容整理，未外查 bibliographic details。
- 相關材料狀態：Lecture 9 PDF 已下載，待材料階段閱讀。Assignment 3 code repo 已下載，待材料階段閱讀。

## 完整閱讀範圍

已完整讀取上述逐字稿從第一行到最後一行。內容從講者說明本講暫時離開 systems、進入 scaling laws 的基本版開始，結尾到講者總結 scaling laws 能把小規模規律外推到大規模工程決策，並預告下一講是 inference、之後回到更進階的 scaling topics。

## 本講主問題

本講的主問題是：如果要花非常昂貴的 compute 訓練一個大型語言模型，如何在真正的大訓練前，用小規模實驗推估大規模結果，並把架構、資料、模型大小、batch size、learning rate 等選擇變成可證據化的工程決策？

講者用一個情境引入：有朋友給你 10,000 張 B200 一個月，要你訓練很好的開源語言模型。基礎設施與預訓練資料先假設已有，但真正的大 run 仍然有許多高風險選擇：架構、超參數、資料量、模型大小、batch size、learning rate。直接在百億或千億級模型上反覆試錯代價太高，因此需要 scaling laws：用小規模模型的 performance 與 behavior，建立簡單可外推的規律，預測大規模行為。

## 核心概念

### 1. Scaling law 是工程外推工具，不只是漂亮曲線

Scaling laws 在本講中的定義是：從小規模模型的表現與行為，外推到大規模模型表現與行為的一組簡單預測規則。它可以被視為一種工程 paradigm：把昂貴的大模型設計問題，改寫成較便宜的小模型實驗與曲線擬合問題。

這種方法的前提不是神秘信仰，而是跨尺度 regularity：若小尺度與大尺度之間存在穩定關係，則小尺度 optimization 可以轉化為大尺度決策。

### 2. Scaling laws 與古典 ML 的關係

講者刻意把 scaling laws 接回古典 machine learning。Generalization bound 本來就在問：模型在訓練集上的表現如何推到 test error，而 bound 通常依賴 sample size。從這個角度看，scaling laws 很像 empirical sample complexity。

早期工作已經問過類似問題：訓練完整大資料分類器很貴，能不能只在較小 sample 上訓練，擬合 error rate 如何隨資料量下降，再外推完整資料表現？講者提到 Bell Labs、Corinna Cortes、Vladimir Vapnik 等 1993 年左右的工作，以及後來 NLP、speech recognition、machine translation、language modeling 中把資料量與 performance 關係寫成 power law 的研究。重點是：scaling law 不是 LLM 時代才有的概念，而是 empirical ML 與統計學中長期存在的想法。

### 3. Log-log 線性意味著 polynomial decay

本講最基本的數學形式是 power law。若在 log-log plot 上，x 軸是資源量如 data、parameters、compute，y 軸是 loss 或 error，而點落在近似直線上，表示原尺度上 error 以多項式形式下降：

```text
error(n) ≈ A / n^α + B
```

其中 `B` 可視為 asymptote 或 irreducible error。若還離 asymptote 很遠，log-log plot 會近似線性；接近 noise floor 時會彎平。

### 4. Data scaling laws

最自然的 scaling law 是 data scaling：固定模型與訓練流程，逐步增加資料量，觀察 test loss 或 error 如何下降。直覺上，資料越多表現越好，但最後會接近 irreducible error。

講者用兩個統計例子說明 power law 為何自然：

- Gaussian mean estimation：估計均值時，expected error 約為 `σ² / n`，因此 slope 約是 `-1`。
- Non-parametric regression：若要估計 D 維平滑函數，誤差率可能像 `n^{-1/D}`，slope 變成 `-1/D`，遠慢於 parametric rate。

神經網路 data scaling 的 exponent 常約在 `-0.1` 到 `-0.3` 的量級，遠慢於簡單 parametric estimation。講者提供一種直覺：這有點像高維 non-parametric smoother，雖然他也提醒這種解釋未必完全可靠，牽涉 intrinsic dimension 估計等爭議。

### 5. 模型要在 power-law regime

問答中，學生問「模型大於資料量」是什麼意思。講者澄清：重點不是嚴格的一對一參數數量比較，而是避免進入模型容量受限、資料再增加也無法改善的 irreducible-error regime。做 scaling laws 時通常希望留在 power-law regime，或顯式 fit asymptote 並校正。

### 6. Data mixture 與 intercept

Data scaling law 本身只告訴你模型從資料學得多快，但工程上更想知道資料怎麼混。講者指出，在許多古典模型中，資料分布或組成可能主要改變 scaling law 的 offset/intercept，而 slope 主要由模型類別決定。

因此可以用小模型嘗試不同資料混比，例如 news 與 Wikipedia，擬合不同 mixture 對 loss 的影響，再外推到大模型。但講者也提醒，實務很 noisy；常見做法只是訓練一批小模型，選小尺度表現最好的 data mix 直接放大。這與「slope 不變、intercept 不同」的假設相容：如果 slope 不變，小尺度最佳混比也會是大尺度最佳混比。

### 7. Data repetition 與資料受限訓練

當 compute 成長快於可用資料，資料重複會變成重要問題。講者提到資料受限語言模型研究：標準訓練 recipe 下，重複到大約 4 epochs 前可能不太受傷；超過後，實際 scaling law 會比假設一直有新資料的 projected scaling law 更差。

講者也提到「無限 compute、固定資料」的極端問題：不能只靠一直重複資料或一直加大模型獲得無限收益，會需要 regularization、ensembling 等其他手段。但這些 intervention 往往仍然主要改變 intercept，而不是大幅改變 slope。

### 8. Data filtering 是 scale-dependent

資料過濾不是固定規則。小 compute 情境下，應該積極過濾，只保留最高品質資料，因為根本訓練不完所有資料。大 compute 情境下，若仍只保留小而高品質的資料，會過度重複；因此 compute 越大，最佳 filter 可能越寬鬆，開始納入較低品質但更多樣的資料。

### 9. Architecture scaling laws

Scaling laws 也可用於架構選擇。若要比較 Transformer 與 LSTM，不必直接訓練 GPT-3 級 LSTM；可以訓練一系列小規模 Transformer 與 LSTM，觀察 log compute 對 loss 的線條。若 LSTM 的 intercept 或 slope 較差，放大後也可能較差。

講者指出，現代架構論文常有這類圖：baseline Transformer 與新架構在不同 compute 下的 scaling trend。若新方法只在小尺度好、slope 較差，放大後可能被反超。

### 10. 超參數、aspect ratio 與 scale-invariant quantity

Scaling laws 可以用來研究 optimizer、depth/width tradeoff、attention head dimension 等選擇。講者提到 SGD vs Adam 的比較：intercept 可能不同，但 slope 常驚人地相似。

對模型形狀，層數本身不是 scale-invariant quantity，因為模型變大時通常也要更多層；但 aspect ratio 可能較接近 scale-invariant，例如每層對應的 `d_model` 比例。Kaplan 類研究會檢查不同模型大小下，最佳 aspect ratio 是否穩定，藉此支持固定 scaling strategy。

### 11. 參數怎麼數會改變 scaling law

Scaling law 不是自動存在的自然現象，而是需要被 engineered。x 軸怎麼定義非常重要。Kaplan paper 中曾因 embedding parameters 造成奇怪 scaling，選擇只看 non-embedding parameters；但後面講者指出，是否排除 embedding 與 final softmax/output parameters 會對結果有重大影響。

這是本講最重要的警告之一：scaling law 的外推可靠性取決於實驗 recipe、parameter counting、warmup、batch size、optimizer tuning、compute range 等細節。

### 12. MoE scaling

Mixture of Experts 讓「參數量」變成更複雜的概念，因為 total parameters 與 active parameters 分離。講者提到 MoE 研究顯示：在固定 active parameters 下，增加 inactive/total parameters 仍可降低 loss；隨 compute 增加，較稀疏模型可能更有利。這說明 scaling law 可以擴展到 sparsity level、total parameters、active parameters 等更複雜資源軸。

### 13. Critical batch size

Batch size 是大模型訓練的重要工程參數，因為大 batch 能提供 data parallelism，但 batch 太大會浪費樣本效率。Critical batch size 是一個折衷點：在 noise-limited regime 中，增加 batch size 能有效降低 gradient noise，幾乎有完美收益；超過某點後，訓練進入 bias-limited regime，batch 再加大收益遞減。

估計方法：

1. 選一個 target loss。
2. 掃不同 batch sizes。
3. 記錄達到 target loss 所需 steps 與 examples。
4. 擬合 steps/examples 的 tradeoff。
5. 令兩邊成本平衡，得到 critical batch size 約為：

```text
B_crit ≈ E_min / S_min
```

其中 `E_min` 是最小 examples 數、`S_min` 是最小 steps 數。講者也提到可用 gradient covariance 與 gradient norm ratio 估計，但未深入展開。

關鍵 scaling observation：target loss 越低，也就是模型訓練到越好的 regime，critical batch size 會以可預測的 power law 增加。這對大型訓練很有利，因為越大規模、越低 loss 的 run 通常可以用更大 batch。

### 14. Learning rate scaling 與 μP

Learning rate 會隨模型尺度改變。在標準 width scaling 直覺下，模型越寬、參數越多，learning rate 往往要越小，常見 rule of thumb 是隨 width 的倒數縮小。

另一派做法是重新 parameterize network，例如調整 initialization、各部分 optimizer step size，使不同尺度模型的最佳 learning rate 盡量保持一致。講者稱這類想法為 μP 與相關方法。本講只簡述，細節留到進階 scaling lecture。兩種哲學都在大規模訓練中成功用過：

- 直接估計最佳 learning rate 隨 scale 的變化，並外推。
- 透過 reparameterization 讓 learning rate optimum 跨尺度穩定。

### 15. Upstream perplexity 與 downstream performance 不一定一致

Scaling laws 在 perplexity / log likelihood 上通常最乾淨、低 variance、可預測。但 perplexity 最好的模型不一定 downstream 最好。講者舉 T5-style architecture study：某模型 perplexity 最佳，但另一個 perplexity 較差的模型 downstream 更好。

工程含義：預訓練團隊不能只把 perplexity 好的模型交出去，然後把 downstream 問題全部推給 post-training。做大訓練前也應建立 perplexity 到下游任務的 transfer 假設或證據。

### 16. Compute-optimal model/data scaling

重要問題：固定 compute budget 時，要花在更大模型，還是更多資料？

粗略 compute 近似：

```text
compute ≈ parameters × tokens
```

若模型太小而資料太多，loss 很快變平，後續資料被浪費。若模型太大而資料太少，模型 undertrained。Kaplan 與 Rosenfeld 提出 joint scaling law，把 loss 寫成 model size 與 data size 的函數；直覺是：

- data → infinity 時，變成 model-size-limited scaling law。
- model size → infinity 時，變成 data-limited scaling law。

在固定 FLOPs constraint 下，可以最小化此 joint loss，求出 compute-optimal allocation。

### 17. Kaplan vs Chinchilla

Kaplan 的 scaling prescription 導向隨 compute 增大訓練越來越大的模型，tokens per parameter 下降。這與 GPT-3 時期巨大 dense model 的風潮有關。

Chinchilla paper 則指出 Kaplan prescription 訓練的模型太大、資料太少；更 compute-optimal 的做法是相對較小模型、更多 tokens。講者提到大家熟悉的 rule of thumb：每個 parameter 約 20 tokens。但他強調重點不是把 20:1 當黃金比例，而是理解 scaling law fitting 的方法與敏感性。

Chinchilla 使用三種方法：

1. Lower envelope：從多條 training curves 中取同 FLOP 下最佳 loss 的 lower envelope，觀察對應 model size 如何隨 FLOPs 變化。得到約 67B 的預測。
2. IsoFLOPs：固定多個 FLOP budgets，掃 parameter/data tradeoff，對每個 budget 找 terminal loss 最小點，再外推最小點趨勢。得到約 63B 的預測。講者偏好這種方法，因為簡單且 robust。
3. Joint functional form fitting：假設 loss 是 data 與 model size 的函數，對多個 training runs 做 surface fitting。這最直接，但 fitting 細節較難。

方法 1 與 2 幾乎得到 data/model exponent 各約 0.5；方法 3 原始結果略不同，後來 Epoch AI 從圖中擷取資料重擬合後，發現原 paper method 3 可能 underfit，重擬合後也接近 20:1 結論。

### 18. 為什麼 Kaplan 與 Chinchilla 差這麼多

講者強調，Kaplan 與 Chinchilla 都不是荒謬方法；差異來自一連串細節：

- 參數計數方式：排除 embedding 與 final softmax/output layer parameters 會改變 scaling law。
- Kaplan 很多小模型在 learning rate warmup 結束前尚未真正收斂，warmup 對小模型不合適。
- Kaplan 使用固定大 batch size，對小模型 suboptimal；改成隨模型調 batch size 後更接近 Chinchilla。
- Kaplan compute scale 較低，對小非線性與 parameter-counting choice 更敏感。

講者用這段說明 scaling laws 有點像 lower bound：它告訴你「若沿用這個 recipe 放大，會得到什麼」。若 recipe 本身有壞 warmup、壞 batch size、壞 optimizer 設定，外推出來也是壞 recipe 的 scaling law。

### 19. 你可能不想要 Chinchilla factor

Chinchilla 的 20 tokens/parameter 是 training-compute-optimal 的觀點，不一定是 production-optimal。若服務成本很重要，可能寧可訓練較小但更充分的模型，讓 inference/serving 成本下降。講者指出 frontier lab 的 compute 很多花在 R&D 與 serving，而不只是 final training run；因此「overtrained」模型常常才是實務上正確的訓練量。

早期 GPT-3 只有約 3 tokens/parameter，可視為 undertrained；Chinchilla 代表 20:1；後續 production era 會更常訓練超過 Chinchilla ratio，並搭配 MoE 等推論取捨。

## 重要定義、公式、演算法、工程限制、例子與問答

### 定義

- Scaling law：用小規模實驗建立資源量與表現之間的規律，外推大規模表現。
- Power law / scale-free relationship：log-log plot 上近似直線的關係。
- Noise floor / irreducible error：資料再增加也無法突破的任務或模型限制。
- IsoFLOPs：固定 compute budget，掃其他設計自由度，找每個 budget 的最佳點，再外推。
- Critical batch size：batch size 從高效 variance reduction 進入收益遞減的折衷點。
- Upstream metric：通常是預訓練 loss、perplexity、log likelihood。
- Downstream metric：下游 benchmark 或任務表現。
- Overtrained：相對 training-compute optimum 使用更多 tokens 訓練較小模型；在 serving-sensitive 場景可能是合理選擇。

### 公式

Power law：

```text
error(n) ≈ A / n^α + B
log(error - B) ≈ log A - α log n
```

Gaussian mean estimation：

```text
E[(μ_hat - μ)^2] = σ² / n
```

Non-parametric intuition：

```text
error(n) ≈ n^{-1/D}
```

Compute approximation：

```text
C ∝ N × D
```

其中 `N` 是 parameters，`D` 是 tokens/data。

Critical batch size：

```text
B_crit ≈ E_min / S_min
```

### 工程限制

- 大 run 太貴，不能用 final-scale trial-and-error。
- Scaling law 的 x 軸定義很重要：parameters、non-embedding parameters、active parameters、total parameters 會導向不同外推。
- 小模型實驗必須使用合理 recipe；否則外推的是壞 recipe。
- Data mixture、filtering、repetition 都是 scale-dependent，不應視為固定常數。
- Perplexity 很乾淨，但 downstream transfer 不保證。
- Production model 不一定追求 training compute 最省；serving 成本常改變 optimum。

### 例子

- 10,000 B200 一個月：用來說明大 run 代價高、必須事前預測。
- Transformer vs LSTM：用小尺度 scaling trend 判斷架構是否值得放大。
- SGD vs Adam：optimizer 改變可能主要改 intercept，而 slope 類似。
- Aspect ratio：用 scaling study 找跨尺度穩定的 shape choice。
- MoE：total parameters 與 active parameters 分離，需要新的 scaling 軸。
- Chinchilla vs Kaplan：同樣合理的 scaling law 方法，因 parameter counting、warmup、batch size 等細節得到不同結論。

### 問答

- 學生問 scaling laws 是純經驗還是可理論化。講者答：多半是 curve fitting，但理論與物理式極限分析提供可能 functional forms；沒有唯一黃金規則。
- 學生問「模型大於資料量」的意思。講者答：主要是要留在 power-law regime，不要進入模型容量造成的 irreducible error regime。
- 學生問某圖是否是 linear scale 而非 log-log。講者答：軸標示容易造成誤解；範圍很小時 linear 與 log 可能看起來相近，不能只看一小段就判定 functional form。
- 學生問每個 scaling-law data point 的 variance。講者答：perplexity 通常很低 variance，多數圖是 single run；但 learning rate 或 critical batch size scaling 可能很 noisy。
- 學生問為何不用 downstream metric 直接做 scaling laws。講者答：可以，但 downstream 較 noisy；常見策略是先在低 variance upstream metric 建立 regularity，再處理 transfer。
- 學生問何時用 train loss 或 test loss。講者答：科學上應用 test loss；但 one-pass pretraining regime 下 train/validation gap 很小，所以許多圖會混用。

## 從零實作語言模型的意義

從零實作語言模型不只是在寫 Transformer，而是在建立可被規模化的訓練流程。本講對 from-scratch 的意義有幾點：

1. 小模型實驗不是玩具，而是大模型決策的測量儀器。從零實作時，必須能穩定重複訓練小模型、收集 loss、compute、tokens、parameters、batch size、learning rate 等 metadata。
2. 設計選擇要能被 sweep。架構、資料混比、batch size、learning rate、模型 shape 都應能在程式中被系統性變動。
3. 評估要低 variance。若 validation loss、perplexity、資料處理 pipeline 不穩，scaling law 會失去可外推性。
4. 實作細節會進入 scaling law。warmup、optimizer、batch size schedule、parameter counting、embedding tying、MoE active parameters 都不是「小事」。
5. 大模型訓練前應先知道預期 loss。Scaling law 的工程心態是：大 run 開始前，應該已有大致數值預測，而不是只希望它能 train。

## 跨章連結

- Lecture 1 Overview/Tokenization：本講的 data scaling、data mixture、data filtering 與 tokenizer/data pipeline 的選擇相連。
- Lecture 2 PyTorch/Einops：小模型 sweep、loss logging、curve fitting 需要可靠實驗程式。
- Lecture 3 Architectures：Transformer vs LSTM、GLU、MoE、aspect ratio 等架構選擇在本講變成 scaling law 比較。
- Lecture 5 GPUs/TPUs：compute budget、B200、FLOPs、batch size 與 data parallelism 都依賴硬體與系統理解。
- Lecture 7/8 Parallelism：critical batch size 直接關係到 data parallelism 可以開多大 batch。
- Lecture 10 Inference：本講最後說明 production model 可能偏好 overtraining，因 inference/serving 成本會改變 optimum。
- Lecture 11 Scaling Laws II：本講是基本版；進階版會談現代 open model tech reports、μP、optimizer 與更細 scaling topics。
- Lecture 12 Evaluation：upstream perplexity 與 downstream performance 的落差會在 evaluation 章節延伸。
- Lecture 13/14 Data：data mixture、filtering、repetition、data constrained training 會在資料章節延伸。
- Lecture 15/16 Post-training：預訓練 perplexity 不一定保證 post-training/downstream 成功。

## 相關作業與材料佔位

- Lecture 9 PDF：`data/cs336/lectures material/lecture_09.pdf` 已下載，待材料階段閱讀。
- Assignment 3 code repo：已下載，待材料階段閱讀。
- Assignment 3 逐字稿內部關聯：講者說 assignment 3 的部分內容會讓學生做出類似 data scaling law 的圖；本筆記未讀作業 repo，不補充細節。

## 資訊不足與待補清單

- 待材料階段閱讀 Lecture 9 PDF，補齊投影片中的圖、公式、作者名與確切數值。
- 待材料階段閱讀 Assignment 3 code repo，確認學生實際要實作哪些 scaling-law 實驗。
- 逐字稿中部分作者名可能由 ASR 轉寫不穩，例如 Hessness/Hestness、E T 等，需由 PDF 或課程材料校正。
- Kaplan/Rosenfeld/Chinchilla 的 exact functional forms 未由逐字稿完整呈現，需 PDF 或原始論文材料補齊；本筆記只記錄講者口頭描述。
- Chinchilla method 3 refit、Epoch AI、Pearson and Song、Resolving Discrepancies 等細節需材料階段核對。
- MoE scaling 的圖與 functional form 未在逐字稿中完整可見，需投影片補圖後整合。
- Critical batch size 的推導與 gradient covariance ratio 未展開，需材料階段補充。

## 暫不處理的外部補充

- 不外查 Kaplan 2020 neural scaling laws paper。
- 不外查 Rosenfeld scaling law paper。
- 不外查 Chinchilla paper。
- 不外查 DataDecide、Epoch AI、Pearson and Song、Resolving Discrepancies in Compute Optimal Scaling of Language Models。
- 不外查 μP 或 optimizer scaling 文獻。
- 不外查任何最新 frontier model ratio 或 compute spending survey。
