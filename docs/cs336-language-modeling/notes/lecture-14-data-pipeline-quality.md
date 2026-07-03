# Lecture 14：Data (Pipeline, Filtering, Dedup, Mixing) 閱讀筆記

## 基本資料

- 課程：Stanford CS336 Language Modeling from Scratch, Spring 2026
- 講次：Lecture 14, Data（資料的第二講：transformation / filtering / deduplication / mixing / post-training data）
- 逐字稿檔案：`data/cs336/transcripts/14_Stanford_CS336_Language_Modeling_from_Scratch_Spring_2026_Lecture_14_Data.txt`
- 完整閱讀範圍：第 1 行到第 1812 行（讀到檔案最後一句 "Okay, that will be it for today."）
- 總行數：1812
- 本筆記限制：未使用任何網路搜尋，未加入逐字稿以外的資料。所有論文、資料集、演算法細節皆只依講者口頭描述整理；ASR 疑似誤轉寫的專有名詞（工具名、資料集名、人名）保留常見對應拼寫並標「存疑」。
- 相關材料狀態：本講對應 code/trace 逐字稿中未點名檔名，狀態待補；Assignment 4（Data）已於 Lecture 13 筆記記錄，路徑 `data/cs336/code/assignment4-data-main/`，待材料階段閱讀。

## 逐字稿完整閱讀紀錄

閱讀範圍確認：

- 起點：第 1 行（"Okay, let's get started."）
- 終點：第 1812 行（"Okay, that will be it for today."）
- 是否從頭到尾完整閱讀：是，分批依序讀完全部 1812 行，未跳段、未以搜尋或抽樣代替閱讀。
- 跳過段落：無。

## 本講主問題

本講是「資料」的第二講。上一講（Lecture 13）談資料的來源與著作權脈絡；本講把焦點轉到 pipeline 本身：拿到原始網路文件之後，如何一步步把它變成可訓練語料？講者依序處理五個階段——(1) transformation（HTML/PDF 轉文字），(2) filtering（品質、語言、毒性過濾，統一用「target vs raw、找相似子集」的框架），(3) deduplication（用 MinHash + LSH 在線性時間找近似重複），(4) mixing（多個資料源之間如何配比，處理有限資料源的 epoch 問題與 regression-based mixing），(5) post-training data（以合成資料為主，特別是 agentic coding 資料集）。核心訊息是：filtering、dedup、mixing 都不是有唯一正解的固定步驟，而是充滿 tradeoff、且很大程度靠經驗與看資料驅動的工程。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| Data transformation（轉換） | 原始資料是 HTML/PDF/目錄，不是文字；HTML 轉文字是 lossy 的線性化過程（表格、巢狀表格最麻煩），多用 rule-based 因為要快；PDF 品質平均較高但要 OCR/VLM，且 common crawl 中常被截斷需 re-crawl | 導讀 + 核心內容「從原始位元到文字」 |
| Filtering 通用框架 | 給定少量高品質 target 與大量 raw，找出 raw 中「像 target」的子集；用生成模型（如 KenLM n-gram）或分類器（fastText 線性 bag-of-words）打分後設閾值保留 | 核心內容「過濾：一個統一框架」 |
| Model-based filtering 已成主流 | 幾年前很多資料集刻意避免 model-based 過濾（怕引入偏差），現在幾乎人人都用一定程度的 model-based 過濾，因為多數人 compute-poor，不能把 flops 浪費在低品質內容 | 核心內容 + 工程取捨 |
| 過濾的三種用途 | 語言辨識（Meta fastText 176 語言）、品質過濾（主要目的）、毒性過濾（Jigsaw toxic comments / Wikipedia talk pages） | 核心內容 |
| 品質沒有普世定義 | 「品質」是工具，可自行定義：想要數學就抓數學（OpenMathText）、想要教育價值就用 LLM 打標籤（phi 系列）；target 甚至可以是昂貴分類器的輸出，再訓練便宜分類器外推 | 核心內容「品質是你自己定義的」 |
| 沒有最佳閾值：取決於訓練 token 數 | 訓練越久越能容忍低品質資料；訓練短則偏好高品質。Michael Ryan 的實驗：高品質資料（DCLM）在不 epoch 時較好，但一旦訓練大量 token，低品質但量大的資料反而勝出 | 核心內容 + 工程取捨 |
| Deduplication 動機 | 省 flops、避免記憶化（含著作權/隱私風險）、去污染（decontamination，確保 test set 不在 training set）；exact dup 與 near dup 兩類 | 核心內容「去重」 |
| Dedup 設計空間 | item 粒度（句/段/文件）、match 判準（完全相同/共享子項/子項比例）、找到重複後移除全部或留一 | 核心內容 |
| Jaccard 相似度 | 交集大小 / 聯集大小，介於 0（不相交）與 1（相同）；near dup 定義為 Jaccard 超過閾值（如 0.99） | 核心內容 |
| MinHash | 隨機 hash 函數，使兩集合碰撞機率「恰好等於」其 Jaccard；直覺是隨機置換後看誰排第一。把「線性時間 hashing」與「想要的相似度指標」連起來 | 核心內容 + Mermaid/公式 |
| LSH（locality sensitive hashing） | 把 n 個 hash 分成 b 個 band、每 band r 個 hash；只要某個 band 全數相符就算碰撞。產生 S 型相變曲線，相變點約 (1/b)^(1/r)；增大 r 使曲線變陡並右移，增大 b 使曲線左移 | 核心內容「MinHash LSH」 |
| 跨資料集去重 | 去重不能只在單一資料集內做，必須跨整個資料集做，因為不同資料源之間常有重疊 | 工程取捨/小結 |
| Data mixing | 資料源之間的配比 = 一個 distribution over sources；手動（vibes）、uniform、proportional 各有問題；直覺是上調高品質源，但要兼顧多樣性與「資料源有限」 | 核心內容「資料混比」 |
| 有限資料源與 epoch 陷阱 | 高品質源通常較小；naive 均分會導致對高品質源做幾十個 epoch（過擬合），卻只碰到低品質源的一小部分。教訓：務必檢查實際 epoch 數 | 核心內容 + 常見誤解 |
| UniMax | 均勻抽樣但對每個源的 epoch 數設硬上限（cap），作為安全網，避免小源被過度重複 | 核心內容 |
| Regression-based mixing | 訓練一群小 proxy 模型（不同 mixture，常用 Dirichlet 取樣），擬合「mixture 權重 → loss」的迴歸（log-linear / boosted trees），最佳化求最優 mixture，再外推到大模型 | 核心內容「回歸式混比」 |
| Simulate epoching | 讓小規模看起來像大規模：按比例下採樣各資料源，使小規模就能感受到大規模的資料稀缺，避免「小規模不 epoch、大規模才 epoch」的定性差異 | 核心內容 + 工程取捨 |
| 資料集內部再分格 | 可把 common crawl 依 domain（AI2 的 web organizer）× 品質切成二維網格，每個 cell 都是一個可 mixing 的單位 | 核心內容 |
| Post-training data 以合成為主 | 任務導向、大多為合成：定義 environments + tasks/prompts，再由強 teacher 模型（或人）產生 responses | 核心內容「後訓練資料」 |
| Agentic coding 資料集 | OpenThoughts（推理，QwQ-32B 比 DeepSeek R1 更好的 teacher）、SWE-Smith（合成任務）、SWE-zero（無執行回饋、真實 PR、防 agent hacking）、可擴到千萬級 trajectory | 核心內容 |

## 重要細節

### 定義

- Filtering 框架：給定 target（少量高品質）與 raw（大量原始），估一個模型並導出 scoring function，依分數保留 raw 的子集。
- 生成式過濾器：對 target 估一個生成模型（例如 KenLM 的 5-gram），用機率/perplexity 打分。
- 判別式過濾器：把 target 當正例、raw 中不在 target 的隨機子集當負例，訓練分類器（常用 fastText 線性 bag-of-words）。
- Jaccard 相似度：`|A ∩ B| / |A ∪ B|`。
- MinHash：`minhash(S) = min over x in S of h(x)`；核心性質 `P[minhash(A)=minhash(B)] = Jaccard(A,B)`（對隨機 hash 取期望）。
- LSH：把 n 個 hash 分成 b 個 band，每 band r 個 hash；A、B「碰撞」定義為「存在某個 band，其 r 個 hash 全部相符」。
- Data mixture：資料源上的機率分布。
- Decontamination：去除訓練集中與測試集重疊的內容（去重的重要特例）。

### 公式／量化描述

- Filtering 通常只留下個位數百分比的資料（要在可達 100 兆 token 級的資料上跑，所以過濾器必須極快）。
- OpenMathText（2023，存疑拼寫）：規則（是否含 LaTeX 指令）+ KenLM（在 proof pile 上訓練、perplexity 低於閾值）+ fastText 分類「是否為數學寫作」；含 LaTeX 用較低門檻、不含 LaTeX 用較高門檻；得 150 億 token，勝過用 20 倍未過濾資料訓練的模型。
- LSH S 型曲線：固定 band 相符機率 = `s^r`（s 為 Jaccard）；碰撞機率 = `1 - (1 - s^r)^b`。相變點約在 `s = (1/b)^(1/r)`，該點碰撞機率約 0.64（講者口述近似值）。
- 增大 r：相變曲線變陡、右移（更難相符）；增大 b：曲線左移（更易相符）。
- 講者引的去重論文參數：`b = 20 bands`、`r = 450`（存疑，講者口述）。
- Epoch 陷阱數值例：低品質源 10 兆 token、高品質源 100 億 token；uniform、訓練 1 兆 token → 低品質只碰到約 5%（不到 1 epoch），高品質需 5000 億 token → 每點重複約 50 次（50 epochs）。
- OpenThoughts：120 萬（1.2M）examples，每題約 16 個 generations，故實際題數約為 1.2M / 16。
- SWE-Smith：約 5 萬（50k）合成任務（去年當時算大）。
- SWE-zero（存疑）：約 30 萬（300k）agent trajectory，皆為真實 GitHub PR；無執行回饋約 70 分、有執行回饋約 80 分；另有 13k 需執行回饋的 trajectory。
- 後續擴充（存疑）：SWE-zero 思路可擴到約 1200 萬（12M）agent trajectory；rebench 任務中僅 32,000 可執行、120 不可執行，但 zero 思路兩者都能用。

### 演算法／流程

- 通用 filtering：估模型 → 導出 scoring function → 對每份新文件打分 → 依品質門檻（可 stochastic）保留。
- phi 系列（講者稱 "51 from Microsoft"，即 phi-1）品質過濾：raw = the Stack 的 Python 子集 → 定義 prompt「判斷 educational value」→ 用 GPT-4 對 raw 的 100k 子集分類 → 正例當 target → 訓練較便宜分類器（他們用 random forest，也可用 fastText）→ 套用到全體。
- Exact dedup：hash 每個 item、完全相符則移除全部但留一；C4 對「連續三句 span」做 exact dedup（副作用：可能從文件中硬挖掉三句，破壞連貫）。
- MinHash 直覺：隨機 hash 對集合元素誘導一個置換，看 A 與 B 中「排第一」的元素是否相同；相同的機率即 Jaccard。
- MinHash + LSH：對每份文件算多個 MinHash，分成 b band、每 band r hash；只要某 band 全相符就視為候選重複，再（可選）用實際 Jaccard 過濾 false positive。
- UniMax：均勻取樣資料源，但限制 `P(source) × train_tokens ≤ cap`（每源 epoch 上限），有簡單程序在此限制下決定 mixture。
- Regression-based mixing（RegMix / 講者稱 "Omix"，後者存疑）：取樣多個 mixture（Dirichlet/exponential）→ 訓練 proxy 小模型 → 每個給出 target loss（downstream eval 或 perplexity）→ 擬合 log-linear/boosted-tree 迴歸 → 最佳化求最優 mixture → 用於大模型。
- Simulate epoching：按小/大規模 token 比例（如 1:100）下採樣各源，讓小規模就出現資料稀缺，迫使最佳化選出較均衡的 mixture。

### 工程限制

- 任何 rule-based 轉換都有失敗率，資料中永遠有瑕疵；轉文字工具的準確度會影響下游（resiliparse／Trafilatura 優於 common crawl 官方 WAT，延續 Lecture 13）。
- PDF：common crawl 中的 PDF 常被截斷（PDF 很大），需要 re-crawl；有些 PDF 是掃描檔（等同影像），要跑 OCR/VLM，比純文字昂貴很多；PDF 保留 layout 但丟失語意結構（不像 HTML 有 H1、P 等標籤）。
- Dedup 不能做 n² 全比對，必須線性時間（hash 類方法）。
- BNR（b、r）調越大相變越陡，但計算越貴。
- Regression-based mixing 的兩個「信仰跳躍」：(1) 迴歸在最佳化推到分布極端時可能外推不準；(2) 小規模最優 mixture 未必轉移到大規模（明顯有 scale-dependent 效應，例如訓練更久時低品質資料反而可接受）。
- 用 downstream eval 當 mixing target 有過擬合風險（例如 code eval 多就會上調 code 資料，寫詩時才發現過擬合）；uniform/proportional 沒有這問題但也不夠好。

### 講者例子

- C4 audit：某 gas mask 產品描述在資料集中出現 61,000 次（來自 common crawl），說明「要看你的資料」。
- 近似重複類型：MIT license／ToS 樣板、網站共用 header/footer、LM1B 中僅差一個逗號的文章、把 Canada 換成 USA 的廣告模板。
- Michael Ryan 的 filtering×epoch 實驗：157M 參數模型、極小資料池（約 100 works），比較 DCLM（藍線，高品質）與 resiliparse（幾乎無過濾）隨 epoch 的 loss 走勢。
- Marin（Stanford 開放模型專案）網站追蹤下一個模型將用到的各資料源（Nemotron、FinePDFs、institutional books、code 等）。
- 資料集內再分格：AI2 的 web organizer 把 common crawl 分 topic，再交叉品質，形成 domain×quality 二維網格。
- OpenThoughts 發現：QwQ-32B 是比 DeepSeek R1 更好的 teacher（更強的模型不一定是更好的老師）；多次 generation（16）有幫助；基本答案過濾沒幫助。
- SWE-zero 防 agent hacking：指示 agent「不能執行 Python，只能用 sed/grep 等基本操作」，再從大 coding 模型蒸餾並過濾（有時模型會無視指示硬執行）。

### 問答重點

- 每個資料點是單次訓練 run，是否要做 confidence interval？理想上應做，但 pre-training run 昂貴，實務上這些點較稀疏；經驗上 pre-training 結果相對穩定。
- 若能同時「更高品質 + 訓練更久」是否仍遞減？任何資料集終究會遞減（資料有限），但曲線會整體下移並持續下降。
- mixture 在訓練時如何實現？在 batch 層級混合：每個序列來自某一 mixture component（不是逐 token 取樣），一個 batch 內應含多個 component 以降低變異。
- 下採樣會不會讓某源資料太少而無法泛化？可能，通常最優會對它給很小權重；可用「至少訓練一次」等規則避免 rounding 到 0。
- data mixing 是否也可套在單一資料集內部？可以，見上面 domain×quality 網格例子。

### 容易忽略的提醒

- 「品質」沒有普世定義，永遠是相對於「你想要什麼模型」而定義的操作性指標。
- 最重要且最反直覺的一點：定義好 mixture 分布後直接取樣，可能在不知不覺中對小的高品質源做了幾十個 epoch——一定要回頭看實際 epoch 數。
- 去重要跨整個資料集做，不能只在各資料集內部做。
- 本講不代表資料工作的全貌：真實資料工作非常 grungy、domain-specific，需要大量「看具體例子」。

## 從零實作語言模型的意義

- 需要實作什麼：完整 pipeline——HTML/PDF 轉文字 → 語言辨識 → 品質/毒性過濾（訓練 fastText 或用生成模型打分）→ MinHash+LSH 去重 → 決定 data mixture（含 epoch cap 或 simulate epoching）。這與 Assignment 4（Data）高度相關。
- 需要理解什麼取捨：規則 vs 模型過濾、資料量 vs 品質、mixing 的多樣性 vs 品質權重、有限資料源的 epoch 陷阱、小規模代理實驗到大規模的外推風險。
- 會影響哪些後續章節：mixing 的 epoch/資料稀缺討論直接連 scaling laws（data-constrained training）；post-training 合成資料連向後續 alignment / RL 相關章節。

## 書稿章節草稿

（實際書稿見 `docs/cs336-language-modeling/14-data-pipeline-quality.md`，此處不重複展開，避免雙份維護。書稿依 chapter-template 分節：導讀、核心內容（分子節）、工程取捨、常見誤解、小結。）

## 跨章連結

- 前置章節：Lecture 13（Data: Sources, Datasets）——本講是其明確預告的續集，把 filtering、dedup、mixing、synthetic data 的技術細節展開；Lecture 13 提到的 DCLM、Nemotron-CC、fastText 分類器、Wikipedia-likeness 品質代理，在本講被放進統一的 filtering 框架具體說明。
- 後續章節：Lecture 15（下一講，主題待該 worker 確認）——本講結尾的 post-training / agentic coding 合成資料，可能與後續 alignment/RL 章節銜接。
- 需要回頭補充的術語：fastText、KenLM、resiliparse/Trafilatura（Lecture 13 已提）、DCLM、Nemotron-CC、the Stack、OLMo/Marin。
- 需要新增的圖表：filtering 通用框架流程圖、MinHash 直覺（置換取 min）示意、LSH 的 band×hash 與 S 型相變曲線、epoch 陷阱數值例、regression-based mixing 流程。

## 跨章連結需主控注意

- 與 Lecture 13 有大量共享對象（DCLM、Nemotron-CC、the Stack、fastText、resiliparse/Trafilatura），本講與 13 章敘述須避免重複、保持一致；本講負責「機制與演算法」，13 章負責「來源與歷史」。
- 與 Lecture 15 的分界：本講已觸及 post-training 與合成資料（尤其 agentic coding），若 15 章也涵蓋 post-training/synthetic data，需主控協調分工，避免重疊。

## 相關作業與材料

此段只建立關聯，不提供作業解答。

- Course material：本講對應 `lecture_14.py` 之類檔名逐字稿中未提及，狀態待補（不臆測路徑）。
- Assignment 關聯：Assignment 4（Data），已下載於 `data/cs336/code/assignment4-data-main/`，本講的 transformation/filtering/dedup/mixing 正是該作業的核心；本章只整理概念，不提供作業解答。
- 本地材料路徑：Assignment 4 如上；本講 code/trace 路徑待補。
- 材料狀態：待材料階段閱讀。
- 缺少的材料或 URL：本講 code/trace 檔名、講者引用的各論文原文（見下表）。

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| 本講對應 code/trace 檔名與路徑 | 課程材料清單或使用者提供 | 待補，不臆測 |
| "Omix" 資料混比論文的正確名稱 | 原始論文 | 逐字稿轉寫為 "Omix/omix"，可能與 RegMix 同一系列，存疑待查 |
| "OpenMathText" 資料集正確名稱與年份 | 原始論文 | 逐字稿口述 "open math text 2023"，保留常見拼寫，存疑 |
| "51 from Microsoft" 對應模型 | 原始論文 | 判為 phi-1（ASR 把 "phi-1" 轉成 "51"），存疑但語境明確 |
| SWE-zero / SWE-Smith / rebench 等 coding 資料集正確名稱與數字 | 原始論文 | 逐字稿轉寫嚴重（"sweet zero"、"Sweenith Smith"、"sweet hero"、"three zero"、"rebench"），保留常見對應並全部標存疑 |
| 去重論文 b=20、r=450 參數與相變常數 0.64 | 原始論文 | 逐字稿口述數字，未核對原文，待補 |
| Jigsaw toxic comments、UniMax、Dirichlet 等專有名詞拼寫 | 原始論文 | 逐字稿轉寫 "durlay/dishlay"=Dirichlet，保留常見拼寫，存疑 |
| Michael Ryan 實驗的完整設定與圖 | 課程投影片 | 僅有逐字稿口述，圖待材料階段補 |

## 外部補充

外部搜尋只在逐字稿完整閱讀與本章初稿完成後進行，本階段留空。

| 來源 | URL | 補充重點 | 是否納入書稿 |
|---|---|---|---|
| 待填 | 待填 | 待填 | 待填 |

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-03 | 建立 | 完整閱讀 Lecture 14 逐字稿（第 1-1812 行），產出閱讀筆記與書稿章節 |

## Worker 回報欄

- 完整閱讀的逐字稿檔名：`14_Stanford_CS336_Language_Modeling_from_Scratch_Spring_2026_Lecture_14_Data.txt`
- 逐字稿總行數：1812
- 新增或修改檔案：`docs/cs336-language-modeling/notes/lecture-14-data-pipeline-quality.md`、`docs/cs336-language-modeling/14-data-pipeline-quality.md`
- 本講核心概念：見上方「核心概念」表
- 需要主控 agent 複查的點：見「資訊不足與待補清單」與「跨章連結需主控注意」
- 缺少的材料或需要使用者提供的 URL：見「資訊不足與待補清單」
- 是否使用外部資料：否。
