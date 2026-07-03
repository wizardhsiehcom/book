# Lecture 11：Scaling Laws II 閱讀筆記

## 基本資料

- 課程：Stanford CS336 Language Modeling from Scratch, Spring 2026
- 講次：Lecture 11, Scaling Laws（本書視為 Scaling Laws II，承接 Lecture 9 Scaling Laws I）
- 逐字稿檔案：`data/cs336/transcripts/11_Stanford_CS336_Language_Modeling_from_Scratch_Spring_2026_Lecture_11_Scaling_Law.txt`（檔名「Lecture 11：」後有兩個空格）
- 完整閱讀範圍：第 1 行到第 2355 行（檔案總行數）
- 總行數：2355
- 本筆記限制：未使用網路搜尋，未加入逐字稿外部資料。逐字稿中出現的人名與論文名（例如 Hessness/Hestness、Kaya、Tengyu、Percy、David、Jeremy Bernstein、Greg Yang、Will Held、StepFun、Kimi K2 等）皆可能有 ASR 轉寫誤差，本筆記只依講者口頭描述整理，不外查校正拼寫或出處。
- 相關材料狀態：Lecture 11 PDF 已下載，待材料階段閱讀。Assignment 3（Scaling）code repo 已下載，待材料階段閱讀。

## 完整閱讀範圍

已完整讀取上述逐字稿從第一行到最後一行。內容從講者說明本講是「進階版 scaling laws grab bag」開始，經過業界 scaling report 案例、hyperparameter scaling law 研究、optimizer scaling（含 Muon）、μP 的概念與推導，到講者總結「scaling in the wild 很混亂、沒有銀彈」結束。

## 本講主問題

本講的主問題是：Lecture 9 講的 scaling laws 基本版，實際套用到真正在建置開源大模型的團隊身上，是否真的可行？如果模型規模一大，optimizer 行為、learning rate、batch size 的最佳值都會隨尺度飄移，我們該用什麼工程手段（scaling-law 擬合、或是重新 parameterize 讓超參數不隨尺度改變）去掌握這些漂移？以及在最新的 optimizer 研究（例如 Muon）裡，「小尺度效果很好」是否真的能轉移到大尺度？

講者把本講切成三大塊：一，檢視幾份近年開源模型的 scaling report（MiniCPM、DeepSeek LLM，以及 Qwen、Hunyuan、Llama 3、MiniMax 等的簡述），呈現業界實際如何處理 scaling；二，更深入的 learning rate / batch size / optimizer scaling 討論，包含一份大規模 hyperparameter grid search 研究與 Muon 這個新 optimizer；三，μP 的完整概念與數學推導，說明如何透過改變 initialization 與 per-layer/per-parameter learning rate，讓最佳 learning rate 不隨模型寬度改變。

## 核心概念

### 1. 本講定位：Scaling laws 的進階與實戰版

講者開場說明，前面兩講（Lecture 9）建立的是「scaling laws canon」，大約停在 Kaplan、Hestness、Chinchilla 這些 2022 年左右的經典結果。本講要做的是把時間往前推：近年有哪些開源模型的 scaling report 值得參考？這些團隊在乎什麼、擔心什麼？如果要從 Chinchilla 一路「speed run」到像 Kimi K2 這種現代前沿開源模型，中間還需要補上什麼？

講者也明確預告本講三個部分：(1) 業界 scaling report 案例；(2) learning rate、batch size、optimizer 的 scaling；(3) initialization/μP。這三部分彼此獨立又互補：業界案例展示兩種對立哲學（穩定超參數 vs. 擬合超參數的 scaling law），後面兩部分則分別深入這兩種哲學各自的技術細節。

### 2. MiniCPM：用 μP 穩定 learning rate 的案例

MiniCPM 是 2024 年由中國開源社群一群產學合作者做出的高效能 1–2B 模型，發布當時是該量級的 SOTA。講者選它作為案例，因為它清楚示範「用 reparameterization 讓超參數不隨尺度漂移」這條路線。

MiniCPM 論文列出的具體作法：scale embedding output、把 residual connection 乘上 `sqrt(層數)`、依 fan-in/fan-out 比例 scale 所有矩陣參數的 initialization、對不同 tensor 給不同的 learning rate（per-parameter learning rate，講者特別提醒這對還不熟悉的人來說是「exotic」的做法）、以及 scale LM head。這一整組操作都屬於 μP 這一類 initialization。

MiniCPM 的實驗設計是訓練一個「scaling ladder」：一系列遠小於最終釋出模型（約 5 倍差距）的小模型，目的是釘死幾個對尺度敏感的超參數——最佳 batch size、最佳 learning rate，以及 Chinchilla 式的 token/parameter 比例——而不是直接暴力訓練大量目標尺寸的模型。

實驗結果顯示，掃過不同模型尺寸的 learning rate 後，最小 loss 幾乎都落在同一個 learning rate 值（約 `1e-2`）附近，只有最小的模型略微偏移。講者認為這是 μP 方法成功的乾淨案例：一旦做到這樣，就等於不再需要為每個尺度重新調 learning rate。

### 3. 即使有 μP，batch size 仍然要隨尺度改變

講者強調：即使 μP 把最佳 learning rate 穩定住了，最佳 batch size 仍然是資料量與模型大小的函數，不會被 μP 一併解決。MiniCPM 的做法是固定 batch size、增加 token 數做一系列 run，再對每個「等 loss」的資料點擬合二次曲線，找出每個 loss 水準下的最佳 batch size。

結果重現了 Lecture 9 提過的 critical batch size power law：目標 loss 越低，最佳（critical）batch size 越大。這讓 batch size 的設定可以直接依 loss 目標查表，不必每次重新搜尋。

### 4. Warmup-Stable-Decay（WSD）learning rate schedule

這是本講一個明確補在 Lecture 9 之外的新概念。背景問題：如果要做 Chinchilla 式的 isoFLOPs 分析，需要在固定 FLOPs 下掃 token 數與模型大小的組合；但標準 cosine learning rate schedule 需要事先知道訓練終點才能排出完整的下降曲線。這代表如果想多測一個更長的 token 數，幾乎必須整個重新訓練，成本近似隨組合數平方增長，非常浪費。

MiniCPM（以及其他人）提出的解法是 WSD，形狀像一個大梯形：

1. Warmup 階段：固定步數（不是訓練總長度的比例），讓 warmup 與訓練 horizon 無關。
2. Stable 階段：learning rate 維持恆定，且佔訓練大部分時間。
3. Decay 階段：訓練最後 10%–20% 的 steps，把 learning rate 快速降到約最大值的 10%。

WSD 的關鍵好處是：可以在 stable 階段任何一點把訓練「倒帶」到最後一個 stable checkpoint，繼續往前跑更多 token，再重新做一次 decay，而不必從頭重跑整個 pretraining。也就是說每次多測一個資料點的成本只有一次 decay（約 10% 的總成本），而不是整個 run。

講者也提到 WSD 與 cosine 的效能比較：WSD 曲線在到達 decay 階段前看起來明顯落後 cosine，但一進入 decay 階段就會迅速追平甚至反超；經驗上，很多人認為調得好的 cosine 略優，但 WSD 幾乎一樣好，而且更適合重複利用同一條訓練軌跡做多組實驗。

### 5. MiniCPM 的 Chinchilla 複製與其侷限

有了 WSD，做 Chinchilla 分析變得容易：跑一條長 run，倒帶並重複 decay，就能同時掃資料維度與模型維度。MiniCPM 選擇複製 Chinchilla 的方法一（lower envelope）與方法三（joint functional form fitting），講者認為這兩種是三種方法中「最不可靠」的，但 MiniCPM 得到的曲線看起來仍算平滑合理。講者特別指出：MiniCPM 的 joint fit 得出的 exponent 與原始 Chinchilla 不同，論文因此宣稱他們的模型應該用遠多於 Chinchilla 建議的 token 數訓練；但講者對這個結論保持懷疑，認為也可能只是他們的 Chinchilla fit 本身有點奇怪。

### 6. DeepSeek LLM：直接擬合超參數 scaling law 的對照案例

DeepSeek（MoE 化之前的原始 DeepSeek LLM 論文）走的是完全相反的哲學：不做 μP 式的 reparameterization，而是直接對 optimal batch size 與 optimal learning rate 各自擬合一條 scaling law。

做法是在多個尺度上做大規模 grid search，固定 compute（token 數），掃 learning rate 與 batch size 的組合，找出 terminal loss 最低的點（用星號標記）。把不同 compute 尺度下的最佳點畫在一起，就能得到「optimal batch size 隨 non-embedding training FLOPs 成長」與「optimal learning rate 隨 FLOPs 下降」兩條近似線性（log-log）關係。講者指出 batch size 的擬合線看起來相當合理，但 learning rate 的擬合線沒有那麼乾淨，若 grid 沒有打在對的範圍，很容易只得到一條看似隨意的線。

DeepSeek 同樣使用 WSD，但有一個特別的變體：他們用兩段 decay 而不是一段，講者表示不確定原因，且這個做法後來沒有被廣泛採用。DeepSeek 的 isoFLOPs 分析畫出的曲線比 MiniCPM 乾淨許多，最終他們拿兩個實際訓練的大模型（星號）去對照小尺度 scaling law 的預測（灰點），預測與實際結果相當接近，說明 Chinchilla 類分析在真實開源模型上是可重現、可信賴的。

### 7. 業界近況：Qwen、Hunyuan/Chinchilla 2、Llama 3、MiniMax

講者快速帶過幾個更近期的模型報告，說明 scaling laws 在業界已變成「標準配方」：

- Qwen 2.5、Qwen 3：延續 DeepSeek 式的做法——做 scaling 實驗找最佳 batch size/learning rate，並把方法延伸到 MoE。Qwen 3 幾乎直接沿用 Qwen 2.5 已建立好的流程。
- Chinchilla 2 與 Hunyuan（皆為 MoE scaling law 案例）：核心問題是「該用多少 active parameters／多少 sparsity」。做法是固定 FLOPs、比較不同 sparsity 水準下的 validation loss，越稀疏 loss 越低（不令人意外），但重點是可以把 sparsity 與 loss 的關係量化，據此做出架構決策（例如選擇 sparsity 48，因為在該點已進入報酬遞減）。Hunyuan 則固定 sparsity，掃 active-parameter 比例，得到約 96 個資料點的擬合。
- Llama 3：isoFLOPs 分析得到略有不同但相近的 token:model 比例，講者認為這部分不算特別有用。更有趣的是他們畫出「log loss → downstream accuracy」的 sigmoid 映射：pretraining loss 與下游 benchmark 準確率之間存在雖有系統性偏差、但大致一致的 sigmoid 關係，說明 upstream loss 與 downstream 表現並非完全脫鉤。
- MiniMax-01（MiniMax zero one）：用 scaling law 比較架構——lightning attention（一種 linear attention）、標準 softmax attention、以及兩者混合的 hybrid 架構——在不同 compute 下的 scaling 曲線幾乎沒有明顯優劣差異，三者需要相近的模型大小才能達到同樣 loss。這組實驗被用來為部署版本選擇 hybrid 架構背書，是「用 scaling law 支持架構決策」的清楚範例。

講者的整體觀察是：這類「核心 scaling machinery」（Chinchilla、learning rate scaling）現在被視為業界共識，因此近期論文反而較少花篇幅詳細展示，屬於「大家都懂，不用再證明」的階段。

### 8. 問答：Scaling laws 與 post-training 的關係仍是開放問題

有學生問：以上討論都停在 pretraining 階段，當 post-training 已成為標準流程時，scaling 的思考會有什麼改變？講者回答：目前沒有很好的方法把 post-training 完整整合進 scaling law 分析，因為 post-training 有時會根本改變「應該做什麼樣的 pretraining」才是最佳。他提到唯一比較接近的方向是研究 pretraining 資料的 coverage／diversity，藉此預測 post-training 階段的表現，但這仍是相當初期的研究，沒有定論。

### 9. Hyperparameter scaling law 的細節研究（StepFun 論文）

講者接著深入介紹一份較新的 preprint（來自 StepFun 團隊），專門對 learning rate 與 batch size 的 scaling 做大規模 grid search 研究。講者強調這不是唯一可靠的研究，但目前算是相對接近可信的版本，因為該團隊燒了大量 compute 做 grid search。

論文附有一張整理表，列出多個團隊（OpenAI/Kaplan、DeepSeek、MiniCPM 等）提出的 batch size 與 learning rate scaling 公式。講者特別指出一個值得注意的現象：不同團隊的公式甚至連「應該用什麼變數」都不一致——例如 Kaplan 的 batch size 公式是 terminal loss 的函數，而 StepFun 認為正確的 batch size scaling 應該是資料量的函數。講者提醒不要把任何一條公式當「聖經」，但實驗現象本身很值得學習。

StepFun 的研究設計與 DeepSeek 類似：在多個模型尺寸與資料量尺度上，對 learning rate 與 batch size 做密集 grid search，並用 contour plot 呈現 loss landscape（例如固定 1B 參數、100B token 的切片）。這個 landscape 每個切面都相當平滑、凸性良好，讓講者認為「用網格搜尋超參數」這件事在這個解析度下是可信的，因為最小值不會被鋸齒狀 landscape 誤導。

### 10. StepFun 的核心發現：batch size 主要依賴資料量、learning rate 依賴方向反直覺

StepFun 論文最值得注意的結論是：最佳 batch size 幾乎只依賴訓練的總資料量 `D`（不同顏色代表不同模型大小的點都落在同一條趨勢線上），呈現 log-log 下的 power law。相對地，最佳 learning rate 的行為明顯不同：模型越大，最佳 learning rate 越小；資料量越多，最佳 learning rate反而越大——這個「資料越多、learning rate 應該越大」的方向講者形容為「有點反直覺」，並提醒有其他論文主張這個對資料量的依賴方向應該相反，所以這個結論可能不夠穩固／可能是資料相關（data-dependent）而非普適規律。

講者也提到一個經驗性的安慰：learning rate 其實相當 robust——如果現場問大家「訓練一個語言模型該用多大 learning rate」，多數人都能大致答對一個合理範圍（例如 `1e-3` 到 `1e-4` 附近），這說明 learning rate 的最佳值雖然理論上隨尺度變化，但實務上的容錯範圍不算窄。

StepFun 的 scaling law 也在一定程度上遷移到 MoE：只要適當地用 active parameters 校正，用 dense 模型 scaling law 預測出的 MoE 最佳超參數（黃星）與直接在 MoE 上調出的最佳值（紅叉）相當接近。但如果訓練資料分布改變，最佳 learning rate 與 batch size 會跟著小幅偏移，這代表這些具體數字終究是「依資料而定」的，不是絕對常數。

最終簡化版的經驗法則：batch size 大致與 `sqrt(資料量)` 成正比；learning rate 隨資料量上升、隨模型大小下降。講者解釋這在 Chinchilla-style scaling（`N` 與 `D` 都隨 compute 同步增長）下並不矛盾：兩個效應會部分抵消，整體上 compute 越大、learning rate 越低——這與 DeepSeek 的規律方向一致，只是具體 exponent 不同。

### 11. 問答：該直接套用別人的 scaling law，還是自己重跑 grid search？

有學生問：既然這些超參數 scaling law 已經存在，是否就該直接套用，不必自己再做 grid search？講者回答：取決於你的 compute 預算與需要多精準。如果你的訓練規模落在別人做 grid search 的範圍內，這些公式是很好的預設值（比自己隨便猜好）；但如果架構或設計有明顯差異（例如特別大的 weight decay），這些超參數不一定會用同樣的方式 scale，因此大型 pretraining 團隊通常還是會重跑一次 Chinchilla 式驗證，確認至少一階（first-order）正確。

講者藉此點出一個貫穿全講的心法：scaling laws 表面上看起來很科學（畫線外推），但本質上仍需要判斷力（他用「vibes」形容）——你永遠無法百分之百確定別人的實驗設定與你的情境足夠相似而可以轉移，因為總會有微小差異。

### 12. Optimizer 案例：Muon 在小尺度的驚人效果

講者切入 optimizer 主題，用 nanoGPT speedrun（Assignment 1 的靈感來源）這個小模型、短訓練時間的基準來開場。在這個基準上，一個叫做 Muon 的 optimizer（圖上紫色）相對 Adam（藍色）取得非常顯著的提升，而且速度沒有明顯變慢。但講者立刻提出關鍵問題：這種小尺度的優勢，在大尺度是否依然成立？他提到之後有人做過 scaling study，發現 Muon 的優勢似乎隨尺度增加而遞減。

### 13. 比較 optimizer 時的兩個必查軸：compute 與 Chinchilla ratio

講者引用一份對 optimizer 做嚴謹大規模比較的論文（作者提及 Kaya、Tengyu、Percy、David，ASR 拼寫可能不準確），強調任何做 scale-dependence 研究時都必須檢查兩個軸：

1. Compute 軸：固定模型大小與資料量的比例（即固定 Chinchilla ratio），沿 compute 增加畫出趨勢。在這篇論文中，Muon 相對 Adam 的加速比在小尺度很大，但隨 compute 增加逐漸縮小——這不是我們希望看到的「持續有效」的圖像。
2. Chinchilla ratio 軸：資料量與模型大小的比例本身也是一個獨立且重要的混淆變數。某些演算法可能在「模型遠大於資料」（over-parameterized）的情形下表現特別好（可能提供某種隱式正則化，或資料效率差但因為 compute 充裕而無妨），另一些演算法則可能在「資料遠多於模型」的情形下較好（因為能把知識更有效壓進參數）。講者特別提醒：很多做得不錯的 scaling 實驗只檢查了模型大小這一軸，卻沒有 compute 去檢查 token/parameter 比例這一軸，而這個比例常常出乎意料地重要。這篇論文剛好兩個軸都有檢查，且發現在他們的設定下，不同 optimizer 之間的相對排序在不同 Chinchilla ratio 下是一致的——但講者強調這不代表一般情況下都會如此。

講者也提醒一個更基本但容易被忽略的坑：比較 optimizer 前必須把每個 optimizer 都調好（learning rate、weight decay 等），否則調得差的 baseline（例如沒調好的 Adam）看起來會遠差於其他方法，一旦調好 learning rate，優勢可能整個消失；同理，若共用同一組 weight decay 而沒有分別調optimal，也會讓比較失真。

### 14. 案例：Marin 專案中「看起來很美、卻突然爆炸」的 scaling 曲線

講者引用 Percy 的開源語言模型訓練專案 Marin 中 Will Held 的實驗（不是正式論文，而是一組公開的實驗記錄，包含失敗的 run），示範一組使用 Cautious AdamW 變體、`sqrt(batch size)` scaling 等看似標準設定的超參數配置：在較小 compute 範圍內，Chinchilla 式的 scaling 曲線非常漂亮，一路到某個 compute 量級都近似直線；但繼續放大後，先是略差，接著明顯變差，最後完全崩壞。講者用這個例子說明：即使多個數量級的漂亮線性趨勢，也可能在某個尺度突然偏離甚至爆炸。他們最後透過改用更謹慎的 μP 式 parameterization，以及更換 optimizer，才重新獲得跨更大尺度範圍的良好 scaling。這個案例的教訓是：叫大家「都去做 scaling 實驗」講起來輕鬆，但實務上有相當比例的時間會得到這種崩潰、難以診斷問題出在哪裡的曲線。

### 15. Muon 的演算法細節：從 momentum 到 spectral-norm 正交化

講者接著詳細講解 Muon 的機制。標準 momentum-based optimizer：對梯度累積 momentum（`B_t = μ B_{t-1} + gradient`），再用 `B_t` 更新參數。Muon 的關鍵差異在於：它不直接把 `B_t` 拿去更新參數，而是先對 `B_t` 做一個叫做 Newton-Schulz（具體是 Newton-Schulz 5）的操作，把 `B_t` 這個矩陣「正交化」。

概念上等同於把 `B_t` 做 SVD 分解 `B_t = U S V^T`，然後把所有奇異值都設成 1（過大的奇異值收縮回單位值，過小的則放大回單位值），得到新的更新方向 `U V^T`。

講者提供的直覺對照：Adagrad/Adam 這類方法是在「逐座標」層面把梯度大小正規化（讓每個座標大致同尺度）；Muon 則是在 spectral norm（矩陣的奇異值結構）層面正規化，讓每個方向的更新量大致同尺度。這個操作只對矩陣型參數（attention、MLP 的權重矩陣）有意義，因為 SVD 需要一個矩陣；向量型參數（例如 RMSNorm 裡的 gain 參數）仍然用 AdamW 之類的方法更新，因為它們與 Newton-Schulz 這項操作沒有交互作用。

Newton-Schulz 本身只是對「正交化」這個操作的近似，只需要有限次矩陣乘法即可完成，因此在系統面（GPU）上是高效的；相對地，真正的 SVD 在 GPU 上運算效率不佳。這一點在問答中被學生問到，講者確認 Muon 並不直接做 SVD，而是用 matmul-only 的有限迭代方法近似它。

### 16. Muon 的完整故事：小尺度亮眼、中尺度存疑、Kimi K2 證明可規模化

講者用一段敘事收尾 Muon 這個話題：Muon 最初在 nanoGPT speedrun 這種小尺度、短訓練場景中表現極佳；後續有人（同一批做大規模 optimizer 比較的作者）做了 scaling study，發現優勢隨尺度上升而遞減，讓講者一度以為「這個故事大概到此為止，沒有人會燒大 compute 去把它 scale 到真正的 pretraining 規模」。

但後來 Kimi K2 這個模型幾乎完全用 Muon 訓練（並加上一些防止不穩定的技巧），且訓練曲線看起來合理、最終模型表現非常出色。講者指出：Kimi K2 本身沒有做 Muon vs Adam 的 ablation，所以嚴格來說我們仍然不知道在那個尺度下 Muon 是否真的優於 Adam；但它至少證明了 Muon 是一個「在真正大尺度上可行、能訓練出優秀模型」的方案。講者用這個故事強調：判斷一個方法是否真的能在大尺度奏效非常困難，小尺度實驗轉移到大尺度，目前仍然是這個領域做研究、做決策的主要方式，儘管它並不保證成功。

### 17. 問答：每個參數都該有自己的 optimizer 與超參數嗎？

有學生問 Muon 的超參數設定，講者答矩陣參數用 Muon、向量參數沿用 AdamW，且兩者超參數不同。另一位學生延伸提到 Jeremy Bernstein 這一派 μP 相關研究主張「每一層甚至每個參數都該有自己的 learning rate／甚至自己的 optimizer」，講者半開玩笑地說這可能是未來的方向,但也坦言自己不想真的去調那麼多超參數。

另有學生問：這些超參數之間彼此有交互作用，只掃 learning rate 與 batch size 是否足夠？講者回答：確實會有交互作用，理論上超參數空間隨數量指數增長，不可能全部網格化；實務作法是優先網格化最敏感、最重要的超參數（learning rate 幾乎公認是最重要的一項），其餘像 weight decay 之類的超參數，通常事後再做一維（univariate）掃描，在其餘設定固定的情況下找局部最佳值。

### 18. μP 的目標與經驗驗證（Cerebras）

進入本講最後一個主題：μP。講者強調 μP 是個「有點神秘」的東西——即使有很多論文與多套實作，彼此對底層數學或實作細節也未必一致，但有一組共享的核心想法，且經驗上普遍有效。

μP 的目標可以用一張圖說明：正常情況下，模型（例如只改變寬度）變大時，最佳 learning rate 會隨之偏移；μP 希望的是無論模型多寬，最佳 learning rate 都維持一致。為了達成這個目標，願意調整的旋鈕包括：per-layer 的 initialization、per-parameter 的 learning rate，以及依模型大小縮放 residual connection 等。

經驗驗證方面，講者提到 Cerebras（一家晶片公司，同時也有語言模型訓練團隊，由 scaling law 論文作者之一 Hestness 主持）發布的 Cerebras-GPT，訓練了 0.1B 到 13B 的模型，同時比較標準 Chinchilla recipe 與加上 μP 變體的版本。結果顯示：採用 μP parameterization 後，scaling law 的擬合更穩定，對實際大模型的 loss 預測幾乎命中；相對地，非 μP 版本的 loss 預測波動較大。這被講者當作「μP 在真實尺度上被驗證有效」的一個例證。

### 19. μP 推導：兩個「物理學家式」的不變量假設

講者花了相當篇幅講解 μP 背後的推導邏輯，強調這種論證方式更接近物理學家的思考習慣：先在「把網路寬度放大到極限」這個 scaling limit 下，假設兩個不變量（invariant）應該成立：

- **A1（初始化不變量）**：模型初始化後、輸入隨機資料，各層 activation 的量級應該大致與網路寬度無關，既不能隨寬度爆炸也不能趨近於零，否則代表 parameterization 選錯了。
- **A2（feature learning 不變量）**：做完一次梯度更新後，activation 的變化量也應該是 `O(1)`，不隨寬度改變。這正是所謂的 feature learning——網路在做完一步更新後確實「學到東西」、有實質變化。講者對比 Neural Tangent Kernel（NTK）regime：在 NTK 極限下，activation 的變化量會隨寬度增加而消失，這不是我們想要的行為，因為我們希望即使在超大模型的極限下，網路仍然持續學習與改變特徵，而不是退化成靜態的 kernel 方法。

### 20. μP 推導：從 A1 求出 initialization scale

講者以一個簡化的 deep linear network 為例，逐步推導。若每層權重矩陣以 `sigma^2` 的高斯分布初始化，可以用標準矩陣集中不等式（random Gaussian matrix 的 operator norm 性質）寫出該層 operator norm 的量級；在 fan-out 不遠大於 fan-in 的情形下，該層輸出的 norm 近似等於輸入 norm 乘上該層 operator norm。

透過歸納法（假設第 `L-1` 層的 activation norm 是 `sqrt(N_{L-1})`，其中 `N` 是該層寬度），可以解出使得每一層 activation norm 都維持 `sqrt(N_L)` 的 `sigma`：結果會得到一個與 `sqrt(fan_out/fan_in)` 成正比的修正項，乘上標準初始化的 `1/sqrt(fan_in)` 尺度。當 `fan_out/fan_in = 1` 時，這退化回標準初始化；當這個比例偏離 1，就得到與標準初始化不同的結果。

### 21. μP 推導：從 A2 求出 per-layer learning rate

第二部分推導更複雜。考慮單一樣本的 SGD 更新（deep linear network），某一層權重的變化量 `ΔW_L` 是梯度與該層輸入 activation 的 rank-one outer product（因為前向是 rank-one 乘法，反向自然得到 rank-one 外積）。該層輸出 activation 的變化量 `ΔH_L` 可以展開成三項：一項來自上一層 activation 本身的變化（直接繼承 A2 的歸納假設)，另外兩項則是「權重變化」與「activation」交互產生的 cross term。

講者要求這三項的量級都必須是 `sqrt(N_L)`，且假設彼此之間沒有互相抵消。由此可以反解出：要讓 cross term 的量級正確，該層權重更新 `ΔW_L` 的 operator norm 必須是 `sqrt(fan_out/fan_in)`。

接著講者引入另一個「最不討喜」的假設：無論模型多大，每一步造成的 loss 變化量應該是 `O(1)`——也就是假設模型每一步都在做出「量級一致、有意義」的學習進展，不隨尺度變化。這個假設讓後續代數可以順利求解：把 loss 的變化用泰勒展開寫成梯度與權重變化的內積，再利用 rank-one 結構把它改寫成 Frobenius norm 與 operator norm的乘積，最終可以解出所需要的 learning rate `eta`，其量級恰好等於 `fan_out/fan_in` 這個比例（對 SGD 而言）。

講者補充：對 Adam 而言，由於 Adam 本身對梯度的正規化方式不同，推導出的結果會少一個 `1/N_L` 項，最終得到約 `1/fan_in` 的 per-layer learning rate scaling——意味著 fan-in 越大的層，在 Adam + μP 下應該用越小的 learning rate。

### 22. μP 推導的整體意義：一種可推廣的方法論

講者總結，μP 推導真正有意義的地方，不只是最後得到的具體公式，而是整個推導方法本身：先取一個 scaling limit，對網路行為斷言若干不變量，加入額外假設，然後反解出這些不變量所隱含的超參數 scaling 限制。這是一種與一般 CS/ML 訓練直覺很不同的思考方式，也是可以類推到其他超參數 scaling 問題的通用原則。

### 23. μP 的壓力測試：哪些設計會破壞 μP

講者引用一篇獨立研究者對 μP 做「壓力測試」的論文。該研究複製了 μP 在不同模型元件（embedding、attention、MLP/softmax linear 層）上的 scaling 規則，發現在受控條件下，最基本版的 μP（以及一些追蹤 attention projection bias 的變體）確實能重現「learning rate 最佳值跨尺度不變」的核心結果。

但現實中很多常見設計技術上並不完全符合 μP 理論的前提，例如 SwiGLU、initialization 的各種變體、RMSNorm 等；該研究測試發現，大多數這類「理論上不被允許」的設計實務上仍然大致相容於 μP。真正會明顯破壞 μP 的情形包括：

- 在 RMSNorm 中學習 gain 參數（learnable gain）——這會破壞 μP，不過講者提到很多情況下拿掉這個 gain 參數並不會傷害模型表現，所以也不算是很大的犧牲。
- 使用像 Lion 這類依賴梯度符號（sign of gradient）的「exotic」optimizer——這在精神上與 Muon 有相似之處，同樣會破壞 μP 的假設。
- 使用較大的 decoupled weight decay——講者指出這是壓力測試中「最令人擔心」的一項，會造成顯著的 μP 失效。

### 24. μP 的整體評價：有用，但不是唯一解法，也不是終點

講者對 μP 的總評是：如果目標是穩定 learning rate 跨尺度的行為，μP 確實相當有效——有大量實驗顯示，若不用 μP，模型寬度增加時最佳 learning rate 會顯著且可預期地偏移，而使用 μP 後這個偏移基本消失。μP 是控制超參數隨尺度漂移的工具之一，另一個工具則是本講前半段介紹的直接擬合 scaling law（如 DeepSeek、StepFun 的做法）。講者認為這仍是一個活躍但尚未「解決」的研究領域，不存在唯一正確答案。

### 25. 結語：Scaling in the wild 是一門手藝，不是精確科學

講者在結尾明確表達一個貫穿全講的態度：scaling laws 最初的呈現方式讓它聽起來很科學——畫一條線、照著步驟做，就能確知大尺度會發生什麼。但現實中這件事遠比想像中混亂、充滿未知。人們確實會用 scaling laws 來選架構、選 optimizer、選超參數，但這其中有相當程度的「藝術成分」：你永遠無法保證外推會一路成立，只能透過 μP、超參數的 scaling law 擬合等手段，盡量提高成功機率，目前並不存在一個「一勞永逸」解決這個問題的銀彈方法。

## 重要定義、公式、演算法、工程限制、例子與問答

### 定義

- μP（Maximal Update Parameterization）：一組 initialization 與 per-parameter learning rate 的設計原則，目標是讓模型在不同寬度下的最佳 learning rate 保持不變。
- WSD（Warmup-Stable-Decay）：一種 learning rate schedule，由固定步數 warmup、長時間 stable、最後 10%–20% 快速 decay 組成，可支援從 stable 階段任意點「倒帶」再訓練。
- Critical/optimal batch size：能在樣本效率與訓練步數之間取得平衡的 batch size，會隨目標 loss、資料量、模型大小改變。
- Chinchilla ratio：資料量與模型參數量的比例，是除了 compute 之外另一個重要的 scale 混淆軸。
- Feature learning：模型在一次梯度更新後，activation 出現有意義且與寬度無關的變化量，與 Neural Tangent Kernel（NTK）regime 中變化量隨寬度消失的行為相對。
- Muon：一種只作用於矩陣型參數的 optimizer，先取 momentum，再用 Newton-Schulz 迭代將更新矩陣正交化（把奇異值都設為 1）。
- Newton-Schulz（Newton-Schulz 5）：只用矩陣乘法、有限次迭代來近似矩陣正交化的方法，比直接做 SVD 在 GPU 上更有效率。

### 公式（依講者口頭描述整理，非逐字抄寫投影片）

WSD 結構（示意）：

```text
warmup（固定步數）→ stable（大部分訓練時間，learning rate 固定）→ decay（最後 10%-20%，快速降到約 10% 峰值）
```

μP 的 per-layer initialization scale（deep linear network 推導結果，示意）：

```text
sigma_L ∝ 1 / sqrt(fan_in) × sqrt(fan_out / fan_in)
```

μP 的 per-layer learning rate（SGD，示意）：

```text
eta_L ∝ fan_out / fan_in
```

μP 的 per-layer learning rate（Adam，示意，講者省略完整推導）：

```text
eta_L ∝ 1 / fan_in
```

### 工程限制

- Cosine learning rate schedule 需要事先知道訓練終點，導致想多測不同 token 預算時幾乎要整個重新訓練；WSD 用倒帶＋重新 decay 解決這個問題，但每個新資料點仍需要重跑一次 decay（約 10% 成本）。
- 比較不同尺度下的超參數/optimizer 表現時，必須同時檢查 compute 軸與 Chinchilla ratio 軸；只檢查其中一軸的研究可能得到誤導性結論。
- 超參數之間存在交互作用，但完整網格化所有超參數在計算上不可行；實務上優先網格化最敏感的 learning rate（有時含 batch size），其餘超參數多用事後一維掃描。
- SVD 在 GPU 上運算效率不佳，因此 Muon 使用只需矩陣乘法的 Newton-Schulz 迭代近似正交化，以維持系統效率。
- μP 的理論假設（無 learnable RMSNorm gain、標準 optimizer 等）在實務中常被違反；大多數違反情形影響不大，但 learnable RMSNorm gain、sign-based optimizer（如 Lion）、大 decoupled weight decay 會明顯破壞 μP 的不變量。
- 好看的 scaling 曲線可能在數個數量級後突然崩壞（Marin 案例），代表僅憑小範圍的線性外觀不足以保證外推安全。

### 例子

- MiniCPM：μP 式 initialization + WSD + scaling ladder，訓練 1–2B 高效能小模型。
- DeepSeek LLM：grid search 直接擬合 optimal batch size / learning rate 的 scaling law，並用兩個大模型驗證預測準確性。
- Qwen 2.5/3、Chinchilla 2、Hunyuan：延續同一套 scaling law 方法論，並延伸到 MoE sparsity 的選擇。
- Llama 3：isoFLOPs 分析 + pretraining loss 到 downstream accuracy 的 sigmoid 映射。
- MiniMax-01：用 scaling law 比較 lightning attention、softmax attention、hybrid 架構，支持部署時選 hybrid 的決策。
- nanoGPT speedrun：Muon 在小尺度、短訓練場景中大幅領先 Adam 的原始案例。
- Marin 專案（Will Held）：Cautious AdamW 變體在中大尺度突然崩壞、後以 μP 式 parameterization 與換 optimizer 解決的失敗又修復案例。
- Cerebras-GPT：0.1B–13B 模型比較標準 Chinchilla recipe 與 μP 變體，μP 版本的 scaling 預測更準確。

### 問答重點

- 問：Post-training 標準化後，scaling 的思考要怎麼變？答：仍是開放問題，沒有完整整合 pretraining 與 post-training 的 scaling 方法；較接近的方向是研究 pretraining 資料 coverage/diversity 對 post-training 的影響，但研究尚屬早期。
- 問：該直接套用他人已發表的超參數 scaling law，還是自己重跑 grid search？答：取決於 compute 預算與所需精確度；同一個 compute 範圍內，已發表的 scaling law 是不錯的預設值，但架構差異（例如特殊 weight decay 設計）常讓大型團隊選擇重新驗證。
- 問：SVD 在 GPU 上快嗎？答：不快；Muon 實際使用的是只需矩陣乘法的 Newton-Schulz 有限迭代近似，而非直接 SVD。
- 問：Muon 的超參數是什麼？答：矩陣參數用 Muon 自己的超參數，向量參數（如 RMSNorm）仍用 AdamW 及其超參數，兩者不共用同一套設定。
- 問：超參數之間彼此有交互作用，只掃 learning rate 和 batch size 夠嗎？答：交互作用確實存在，但超參數空間隨數量指數增長，無法全面網格化；實務上優先網格化最重要且最敏感的 learning rate，其餘超參數常用事後一維掃描補足。

## 從零實作語言模型的意義

從零實作語言模型到了這個階段，不只是選好 scaling law 的公式代入，而是要能自己動手驗證、甚至重新推導超參數該怎麼隨尺度改變：

1. 需要能設計並執行 grid search／scaling ladder：像 MiniCPM、DeepSeek、StepFun 那樣，在多個模型與資料尺度上系統性地掃 learning rate 與 batch size，並能畫出 contour plot 判斷 landscape 是否平滑可信。
2. 需要理解並能實作 WSD schedule：包含固定步數 warmup、長 stable 段、可倒帶的 checkpoint 機制，以及最後的 decay 段，這樣才能用同一條訓練軌跡衍生多個資料點，而不必每次重新從頭訓練。
3. 需要理解 μP 的推導邏輯，即使不追求完全嚴謹的推導，也要能判斷「這個模型的 initialization/learning rate 設定，是否已經隨 fan-in/fan-out 或層數做了合理調整」。
4. 需要對 optimizer 選擇保持審慎：Muon 這類新方法在小尺度的亮眼表現，不能直接當作大尺度也一定有效的證據；必須同時檢查 compute 軸與 Chinchilla ratio 軸，並確保每個 baseline 都調到位（learning rate、weight decay）才能做公平比較。
5. 需要對「scaling 曲線突然崩壞」保持心理準備：即使多個數量級都呈現漂亮的線性關係，也可能在某個尺度後急遽偏離，這代表 from-scratch 訓練流程需要有能力偵測異常、回頭診斷（例如切回更保守的 parameterization 或更換 optimizer）。

## 跨章連結

- Lecture 9 Scaling Laws I：本講的基礎知識（power law、critical batch size 公式、Chinchilla 三方法、data/model scaling）已在 Lecture 9 建立，本講不重複完整推導，只在提到 critical batch size、Chinchilla 方法時直接沿用 Lecture 9 的定義與符號。Lecture 9 結尾明確預告「learning rate scaling 與 μP 留到進階 scaling lecture」，本講正是兌現這個預告的章節。
- Lecture 3 Architectures：MoE 的 active/total parameters 分離、SwiGLU、RMSNorm 等架構選擇，在本講的 μP 壓力測試與 MoE scaling law 段落中被重新提及，補上「這些設計是否與 μP 相容」的細節。
- Lecture 5/7/8 GPUs/TPUs/Parallelism：Newton-Schulz 相對 SVD 的系統效率考量、batch size 對 data parallelism 的意義，延續前面對硬體與並行訓練的討論。
- Lecture 10 Inference：本講未直接重提 inference/serving 成本，但 Chinchilla ratio、overtraining 等概念與 Lecture 9 結尾對 production-optimal vs training-compute-optimal 的討論一脈相承。
- Lecture 12 Evaluation：Llama 3 的 loss-to-downstream-accuracy sigmoid 映射，以及 post-training 與 scaling 的開放問答，都直接連向後續評估章節的主題。
- Lecture 15/16 Post-training：本講問答中提到「pretraining 與 post-training 的 scaling 尚無整合方法」，是留給後續 post-training 章節的一個明確伏筆。

## 相關作業與材料佔位

- Lecture 11 PDF：`data/cs336/lectures material/lecture_11.pdf` 已下載，待材料階段閱讀。
- Assignment 3（Scaling）code repo：已下載，待材料階段閱讀。逐字稿本身未在本講明確提及 Assignment 3 的細節（Lecture 9 才提到），本筆記不補充作業細節。
- 待材料階段補齊：MiniCPM、DeepSeek LLM、StepFun 超參數論文、Muon 原始說明、μP 相關論文（Tensor Programs、Jeremy Bernstein 的 review、Cerebras-GPT）的確切公式、圖表與作者/機構名稱校正。

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| Lecture 11 投影片與確切公式、圖表 | Lecture 11 PDF | 待材料階段閱讀 |
| 大規模 optimizer 比較論文的正確作者/篇名（逐字稿聽起來像 Kaya、Tengyu、Percy、David） | 論文原文或課程材料 | 待材料階段核對，本筆記暫不外查校正 |
| StepFun 超參數 scaling 論文的正確篇名與公式細節 | 論文原文 | 待材料階段核對 |
| Muon、Newton-Schulz 的原始論文與精確算法定義 | 論文原文 | 待材料階段核對 |
| μP 相關論文（Tensor Programs 系列、Jeremy Bernstein 的 review paper、Cerebras-GPT 論文）的精確內容 | 論文原文 | 待材料階段核對 |
| Kimi K2、MiniCPM、DeepSeek LLM、Qwen 2.5/3、Hunyuan、Llama 3、MiniMax-01 等模型報告的精確數值與圖表 | 對應論文/技術報告 | 待材料階段或外部補充階段核對 |
| Assignment 3 是否涉及本講內容（μP、optimizer scaling、WSD） | Assignment 3 handout/code | 待材料階段閱讀後確認 |

## 暫不處理的外部補充

- 不外查 MiniCPM、DeepSeek LLM、Qwen 2.5/3、Chinchilla 2、Hunyuan、Llama 3、MiniMax-01、Kimi K2 等模型的技術報告原文。
- 不外查 Muon、Newton-Schulz 正交化的原始論文或程式碼實作。
- 不外查 μP、Tensor Programs、Jeremy Bernstein review paper、Cerebras-GPT 論文。
- 不外查本講提到的大規模 optimizer 比較論文（作者姓名可能因 ASR 有誤）。
- 不外查任何最新的 frontier model 訓練細節或超參數建議。
