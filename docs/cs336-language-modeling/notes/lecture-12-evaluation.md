# Lecture 12：Evaluation 閱讀筆記

## 基本資料

- 課程：Stanford CS336 Language Modeling from Scratch, Spring 2026
- 講次：Lecture 12, Evaluation（講者：Percy）
- 逐字稿檔案：`data/cs336/transcripts/12_Stanford_CS336_Language_Modeling_from_Scratch_Spring_2026_Lecture_12_Evaluation.txt`
- 完整閱讀範圍：第 1 行到第 2044 行（檔案總行數 2044，已從頭讀到最後一行 "Okay. See you next time."）
- 閱讀者：Lecture 12 章節 worker agent
- 狀態：已完整讀完、已抽象、已成章初稿
- 本筆記限制：未使用網路搜尋，未加入逐字稿外部資料。逐字稿中提到的機構、基準、論文名稱（例如 MMLU、GPQA、Humanity's Last Exam、SWE-bench、ARC-AGI、HarmBench、AIR-Bench、GDPval 等）只依講者口頭描述整理，不外查原始論文的精確年份、作者列表或數值細節。
- 逐字稿中出現多處明顯是「未來情境教學示範」的內容（例如提到 GPT-5.5、Claude Opus、一個名稱疑似 ASR 誤植的模型「Mythos」在多個 benchmark 上接近滿分，以及 2026 年的排行榜數字），這些屬於講者用來說明「benchmark 會隨時間飽和」的教學示例，本筆記照實記錄講者說法，但不代入真實世界模型評比事實。

## 逐字稿完整閱讀範圍確認

- 起點：第 1 行（"So, today we're going to talk about evaluation."）
- 終點：第 2044 行（"Okay. See you next time."）
- 是否從頭到尾完整閱讀：是，逐段閱讀，未跳段、未只用搜尋或抽樣代替。
- 跳過段落：無。

## 本講主問題

這一講要回答的核心問題是：給定一個已經訓練好的語言模型，我們要如何知道它「好不好」？講者一開始就指出，evaluation 表面上像是機械化流程（送 prompt、拿 response、算 accuracy），但實際上是一個很深的主題，因為 evaluation 定義了整個領域的「北極星」——模型開發者用什麼指標判斷進步，就會實質上塑造模型被訓練成什麼樣子。本講的核心困難在於：我們通常從一個抽象構念出發（例如「模型要善於對話」或「模型要善於推理」），evaluation 的工作就是把這個抽象構念轉成具體、可計算的 metric（搭配具體的 prompt 或環境）。這一講會逐一檢視這個「抽象構念 → 具體 metric」的落地過程在 perplexity、考試型 benchmark、對話型 benchmark、agentic benchmark、純推理 benchmark、safety benchmark 中各自長什麼樣子，並在最後討論跨這些方法都會遇到的科學有效性問題：train/test contamination、資料集品質、以及「評估的目的是什麼」。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| 評估即「抽象構念到具體 metric」的轉譯 | Evaluation 不是單純算分，而是把「好的對話」「好的推理」這類抽象目標，轉成具體 prompt/環境與可計算 metric | 導讀與核心內容第一段的貫穿框架 |
| Perplexity 作為分布層級的評估 | 語言模型本質是序列上的分布 P(x)，perplexity/log-likelihood 是最自然的評估方式，也是 in-distribution 與 out-of-distribution 評估分野的起點 | 獨立一節，含 GPT-2 zero-shot 案例 |
| 「Perplexity is all you need」與其限制 | 理論上把 perplexity 壓到熵下限等於學到真實分布；但實務上 perplexity 對每個 token 一視同仁，出現 conditional perplexity 與「偽裝成 perplexity」的 benchmark（LAMBADA、HellaSwag） | 獨立小節，帶出「evaluation 的表面形式可能和底層度量不同」 |
| 考試型 benchmark 的軍備競賽 | MMLU → MMLU-Pro → GPQA → Humanity's Last Exam 呈現「模型飽和某 benchmark → 設計更難 benchmark」的循環，同時暴露 contamination 疑慮 | 獨立一節，強調難度提升與生態效度下降的取捨 |
| 開放式對話評估：人類偏好與 LLM-as-judge | Chatbot Arena 的 pairwise Elo、AlpacaEval 的 win-rate against baseline、WildBench 的 checklist/rubric，三者共同回答「沒有標準答案的回應怎麼評」 | 獨立一節，含 Elo 公式與長度偏誤案例 |
| Meta-evaluation：如何評估一個 metric 本身 | 用與既有 metric 的相關係數作為 sanity check（如 AlpacaEval 與 Chatbot Arena 相關係數 0.98），但這種相關性只在特定模型集合下成立 | 併入對話評估小節末段 |
| Agentic 評估：模型與 scaffold 綁在一起評 | SWE-bench、Terminal-Bench、cybersecurity CTF、MLE-bench 都顯示：同一個模型換不同 agent scaffold，分數可以差很多，因此「評估 agent」其實是同時評估語言模型與外部邏輯 | 獨立一節，含 scaffold 設計原則（planning、delegation、memory、context engineering） |
| 純推理 benchmark 想把知識與推理分開 | ARC-AGI 系列（1/2/3）刻意設計成不需世界知識、每題都是「特例」，用來檢驗 pretraining 知識是否真的能轉成推理能力；o1/o3 出現後 ARC-AGI-1 迅速被解出 | 獨立一節，強調「完全分離推理與知識」本身也有極限 |
| Safety 評估缺乏像車輛安全那樣公認的標準 | HarmBench（拒絕有害指令）、AIR-Bench（法規/政策整合的風險分類）、jailbreak（GCG 這類自動化攻擊可跨模型遷移）共同顯示 safety 是高度情境依賴、多面向、有時和能力互相拮抗或雙重用途的問題 | 獨立一節 |
| 評估的科學有效性：contamination 與資料品質 | Train/test overlap 的偵測（順序效應）、私有評測、fresh eval、以及 SWE-bench Verified、GSM8K/MMLU 資料品質問題，說明 benchmark 分數本身需要被審視，而非照單全收 | 併入「工程取捨」與「常見誤解」 |
| 沒有單一「正確」評估 | 評估的用途（消費者決策、研究者的智能構念、政策影響評估、模型開發者的改進回饋）決定該用什麼 benchmark；評估對象也從「方法」（pre-foundation-model 時代的固定 train/test split）轉為「模型/系統」 | 小結收斂 |

## 重要細節

### 定義

- Evaluation：把「模型好不好」這個抽象問題，轉成具體 prompt/environment 與可計算 metric 的過程；不只是算分，而是隱含地為整個領域設定發展方向（"evaluation sets north stars"）。
- Perplexity / log-likelihood / log loss：對一個測試資料集 D，衡量語言模型 P 分配給 D 的機率質量，再做正規化使數字可解讀。訓練時本身就是在最小化訓練集上的 perplexity，因此在測試集上量 perplexity 是最自然的延伸。
- In-distribution evaluation：訓練與測試資料來自同一個資料集的 train/test split（例如 2010 年代常見的 Penn Treebank、WikiText-103、1 Billion Word Benchmark）。
- Out-of-distribution / zero-shot evaluation：訓練資料與測試 benchmark 資料集不同來源；GPT-2 用 WebText（40GB、Reddit 外連結網頁）訓練後，在 PTB 等它從未訓練過的資料集上做 zero-shot 評估，開啟了「訓練一個大資料集、在標準 benchmark 上評估」的新範式。
- Conditional perplexity：在給定 prompt 的條件下，只量測回應部分的 perplexity，讓評估聚焦在使用者真正關心的 token，而不是每個 token 一視同仁。
- Closed task（cloze task）：填空型任務，例如 LAMBADA、HellaSwag，表面上用 accuracy 衡量，但本質上仍是 next-token prediction、是 perplexity 的偽裝形式。
- Exam benchmark：以考試題目（多選、簡答）評估模型，優點是主題與難度可控、答案明確、易於評分。
- Chat benchmark：評估開放式、無標準答案的對話回應，代表方法有 Chatbot Arena（人類 pairwise 偏好 + Elo）、AlpacaEval（LLM-as-judge 的 win rate）、WildBench（checklist/rubric 化的 LLM-as-judge）。
- LLM-as-judge：用另一個語言模型（而非人類）判斷回應優劣，是目前很流行的評估手段，但存在偏誤（如偏好較長回應）需要被偵測與修正。
- Agent：語言模型加上一個 scaffold（呼叫模型的邏輯，包含何時呼叫模型、可用哪些工具等）。
- Scaffold：agent 的外部邏輯層，包含 planning、sub-agent 委派、記憶（讀寫檔案）、context engineering 等設計，會顯著影響同一個底層模型的 agentic 表現。
- Pure reasoning benchmark：如 ARC-AGI 系列，刻意設計成每題都是獨特的、不依賴世界知識或先前解過的問題，用來嘗試把「推理能力」和「知識/語言」分離開來衡量。
- Train/test contamination：測試資料（或衍生自測試資料的內容）出現在訓練資料中，導致 benchmark 分數失去真實的泛化意義；contamination 常常不是「逐字訓練到測試集」，而是更細微地訓練到「衍生自測試來源的資料」。
- Fresh eval：用訓練截止日期之後才出現的網頁、論文、GitHub 內容建構的評測，藉此降低 contamination 疑慮。
- Private evaluation：使用未公開在網路上的資料（公司內部程式碼庫、個人未發表文稿）做評測，理論上完全避免 contamination。
- Ecological validity（生態效度）：評估情境與真實世界使用情境的吻合程度；考試題目生態效度低，Chatbot Arena 較高但分布仍不明確代表誰。

### 公式

Elo 評分模型（Chatbot Arena 使用）：

```text
P(model A beats model B) = f(Elo(A), Elo(B))
```

其中 `f` 是一個平滑映射，Elo(A) 越大，A 打敗 B 的機率越高；實際做法是把 Elo 分數當成待擬合參數，用「最大化觀察到的 pairwise 比較結果的機率」來擬合，最終得到每個模型的 Elo rating。

Perplexity 最優解的論證（"perplexity is all you need"）：

```text
真實分布 T，訓練模型 P
最佳可能 perplexity = entropy(T)
此下界僅在 P = T 時達成
```

因此持續壓低 perplexity，理論上唯一的全域最小值就是完全學到真實分布 T；這是驅動許多人持續 scale 語言模型的一個核心信念（講者強調這是一種 mindset，不是嚴謹證明）。

Compute-optimal 之外的科學有效性問題（無正式公式，但講者提出的推論結構）：

```text
若 benchmark 題目順序本應隨機
但模型偏好與 benchmark 呈現順序一致的順序
→ 該模型很可能在訓練中見過這個順序 → 疑似 contamination
```

### 演算法 / 流程

- Chatbot Arena 流程：使用者到網站與匿名的兩個模型對話 → 對同一 prompt 得到兩個回應（來自不同模型）→ 使用者投票（A 較好／兩者皆好／兩者皆差／B 較好）→ 累積大量 pairwise 比較資料 → 用 Elo 模型擬合出每個模型的排名。這個方法不需要每個模型都對每個 prompt 作答（如同西洋棋不需要每個人都跟每個人對弈），只要比較圖是連通的，就能推得穩定排名；新 prompt 與新模型加入時也能自然更新。
- AlpacaEval 流程：對一組 instruction，讓待測模型與一個基準模型（例如某個 GPT-4 preview 版本）各自生成回應 → 用另一個 LLM 當 judge 判斷哪個回應較好 → 統計待測模型相對基準模型的 win rate。早期版本因 judge 偏好長回應而被「刷榜」（模型只要輸出更長的回應就拿高分），後續論文用簡單的迴歸方法把這個長度偏誤 debias 掉。
- WildBench 流程：從真實使用者與 chatbot 的對話中蒐集 prompt → 用 LLM-as-judge 評分，但關鍵創新是先針對每個 prompt/task 生成一份專屬 checklist（rubric），讓「這個回應好不好」從一個定義模糊的任務，變成對照 checklist 逐項檢查的較明確任務。
- GPQA 的問題產製流程：題目由 61 位來自 Upwork 的 PhD 級約聘者撰寫 → 送交專家驗證並提供回饋 → 出題者依回饋修訂 → 另一位專家再審 → 篩出「diamond」子集（需兩位專家都同意，且最多只有一位「有 Google 存取權的非專家」在有限時間內答對）。
- Humanity's Last Exam（HLE）的問題產製流程：眾包蒐集題目（同時用金錢與掛名兩種誘因激勵出題者）→ 經多輪審查，並用前沿模型過濾掉太容易的題目 → 保留一個不公開發布的私有子集，避免題目進入訓練資料（但仍需信任送出的 API 呼叫本身不會被拿去訓練）。
- Contamination 的四種因應路徑（講者明確列出）：
  1. 嘗試推斷模型是否見過測試資料（例如利用「benchmark 題目順序理論上應為隨機」這個假設，若模型行為顯示對某個特定順序有偏好，暗示可能訓練過該順序的資料，這個方法歸功於 Tatsu 的研究群）。
  2. 鼓勵業界建立回報 train/test overlap 的規範，類似統計學界要求回報信賴區間；有 position paper 主張模型提供者宣稱某 benchmark 分數時，應同時提供「未訓練在測試集上」的佐證。
  3. 乾脆假設最壞情況（大家都可能訓練過公開 benchmark），改用「fresh eval」：用訓練截止日期之後才出現的網頁、論文、GitHub 程式碼構造新評測；但時間戳記本身也不完全可信（例如某個「新」GitHub repo 可能其實衍生自更早的舊程式碼）。
  4. 使用私有評測：公司可用內部程式碼庫（假設不在網路上）；個人可用從未公開發表的私人文稿（講者舉自己讀研究所時被拒稿、從未上線的論文為例）。這種方法對 perplexity 類評測特別友善，因為只需要一份乾淨的私有文本就能算 log-probability。

### 工程限制

- Perplexity 評測需要「信任」：對外部提交的模型算 perplexity 時，必須信任對方回傳的 log-prob 真的來自一個合法機率分布（總和為一）；否則有人可以回傳極端值製造假的完美 perplexity。這比黑盒下游任務（只需要黑盒生成一個回應算 accuracy）要脆弱得多；對 VAE 這類只能算 bound（而非精確機率）的模型，問題更嚴重，還要信任該 bound 本身是正確推導的。
- Exam 型 benchmark 有明顯的「保鮮期」：講者列出 MMLU（幾年間從剛好高於 chance 進步到 90 幾分）、MMLU-Pro（加大選項數、引入 chain-of-thought 後短時間內又回升到接近 90）、GPQA（PhD 專家基準約 65%，GPT-4 時期 39%，現況已到 94）、HLE（初代得分只有個位數，目前約 64.7），呈現一個持續出現的模式：新 benchmark 出爐時很難，模型進步後迅速飽和，接著又有更難的新 benchmark 出現。
- Chat/agentic 評估中，scaffold（agent 的外部邏輯）與底層語言模型同等重要：同一個模型換不同 scaffold，在 Terminal-Bench 這類 benchmark 上分數可以明顯不同，因此「評估 agent」實際上是在評估「模型 + scaffold」這個組合，而不是單獨評估模型。
- Agent 的 context 管理是實際工程瓶頸：早期簡單 scaffold 把所有動作與環境回饋都串接進同一段連續記憶，隨任務進行 context 會不斷變長；因此需要顯式 planning（維護 to-do list）、hierarchical delegation（把細節封裝在 sub-agent 內，只回傳結果給主 agent）、顯式記憶（讀寫檔案，不能只靠 context window）等工程手段。
- Contamination 沒有萬能解法：即使用 fresh eval，時間戳記仍可能不可靠；即使用私有評測，也只有少數機構或個人才有足夠乾淨的私有資料。
- 資料集品質本身是持續維護成本：SWE-bench 因原始 unit test 不夠嚴謹而推出 SWE-bench Verified；GSM8K、MMLU 都被發現過有缺陷題目（例如題目引用了文中未提供的圖表、或問題本身無法從敘述判斷答案，如「嬰兒有沒有穿襪子」這種無法回答的案例）；agentic benchmark 更難審核，因為評估對象是整個環境而非單一問答，測試案例可能不完整（通過所有測試但方案其實無效），甚至有 benchmark 被發現「輸出空白回應」就能拿到約 38% 分數。

### 講者例子

- 「Stanford was founded in 1885」：用來說明 perplexity 對句中每個 token 一視同仁——預測 "1885" 這種帶知識的 token 很有價值，但預測句首詞或 "founded" 這類 token 對衡量模型是否「聰明」幫助有限。
- LAMBADA（2016）：填空句「Do you honestly think I will want you to have a blank?」，刻意挑選需要長距離上下文才能解出的詞，早期 GPT 論文特別重視這種能凸顯長距離依賴的評測。
- HellaSwag：句子「A woman is outside with a pug and a dog. The dog is running around, she blank.」的多選句子補全，本質上仍是 perplexity 的變體。
- 10,000 張 B200 的情境（前一講延續的比喻，本講未重複，但延續同一種「昂貴決策需要事前證據」的敘事）——此處不重複列出，僅供跨章呼應。
- Beet salad 的例子：「我想做甜菜沙拉，哪些香草搭配好、哪些不好」，用來說明開放式問題沒有 exact-match 答案，必須靠人類或 LLM judge 比較。
- ARC-AGI 第一版例子：給一系列圖案，要求猜下一步（例如把黃色補滿成長方形），聲稱人類 10 秒內可解，但 2019 年（GPT-2 時代）的預訓練模型完全無法移動這個分數，直到 2024 年 o1/o3 出現後才快速被解出。
- ARC-AGI-3：變成互動式、可線上遊玩的遊戲環境，不含語言，仍在早期低分階段；輸入可以是圖片（約 64×64）或 ASCII/文字化表示，凸顯空間推理無法完全化約成自然語言。
- GCG 越獄攻擊：一種座標式（coordinate-wise）最佳化演算法，在開源模型上優化出的「亂碼」prompt，可以遷移到其他（包含閉源）模型，誘使模型生成本應拒絕的有害內容（講者舉「摧毀人類的逐步計畫」為例，並強調這類特定攻擊現在多半已失效）。
- 車輛安全類比：車輛安全有數十年遊說與測試標準（撞牆測試、假人保護程度）；AI safety 目前沒有類似成熟、公認的定義與標準。
- GDPval（OpenAI）：依美國 GDP 前九大產業，找約 14 年資歷的專業人士（護理師、櫃檯服務、房仲、影片剪輯師等）設計任務。
- 醫療領域評測：121 個任務來自 29 位臨床醫師，刻意脫離標準化考試形式，貼近臨床醫師實際會問模型的問題類型。
- 使用真實用量資料但保護隱私的做法：因隱私考量不能直接檢視使用者對話，改用語言模型本身去分析、摘要大量真實使用模式，藉此了解人們實際上如何使用一個部署中的模型（例如 Claude）。

### 問答重點

- 學生問：MMLU/GPQA 這類分數如何確定沒有被訓練污染？講者答：不知道，因為不知道訓練集內容；並強調 contamination 常是更細微的過程（衍生自測試來源的資料被訓練，而非逐字訓練到測試集本身），建議所有這類分數都要「打折扣」看待。
- 學生問：多選題的 accuracy 如何計算，是否要比較每個選項的機率？講者答：實務上是看模型生成的字母（A/B/C/D）是否等於標準答案；但這牽涉到模型如何生成答案（直接取樣一個字母，或先生成 chain-of-thought 再抽取答案），而答案抽取方式本身會顯著影響評估結果的敏感度，此處未深入展開。
- 學生問：ARC-AGI-3 看起來很視覺化，語言模型的輸入是什麼形式？講者答：可以是圖片（約 64×64），也可以轉成 ASCII 或其他文字化表示；不論哪種形式，都存在一個非自然語言的空間推理成分。

### 容易忽略的提醒

- Perplexity 雖然乾淨、低變異、適合 scaling law，但「相信 perplexity 就等於相信 AGI 會自然浮現」是一種 mindset，不是被證明的定律；懷疑者仍需要下游 benchmark 才會被說服。
- 多選題格式常被誤認為「太簡單」，但講者指出多選題本身沒有難度上限（你可以出任意困難的多選題），真正的限制是多選題**限制了你能問的問題種類**，而不是限制了難度。
- 用相關係數驗證一個新 metric（如 AlpacaEval 對 Chatbot Arena 相關係數 0.98）時，這個相關性是針對特定模型集合成立的，換到更強模型（超越當時基準模型的世代）不保證同樣成立。
- WildBench 用「與 Chatbot Arena 的相關性」佐證自身有效性，講者自己承認這帶有循環論證的味道（Chatbot Arena 本身是否就是 ground truth 也可以被質疑）。
- Fresh eval 的時間戳記不是萬無一失的保證；private eval 也只在真正私有、未曾外流時才可靠。
- 評估 agentic 系統時，看似「乾淨」的量化分數（如通過率）可能掩蓋資料集本身的缺陷（測試不完整、可用空白回應取巧得分），因此講者建議務必人工檢視 output/trace（並提到 Docent 這個用語言模型檢查 agent trace 的工具），把質化檢查當成量化 benchmark 的必要補充。

## 從零實作語言模型的意義

1. 從零實作語言模型時，「訓練完就結束」是不成立的——訓練完之後如何量測「好」本身是需要設計的系統，perplexity、下游 benchmark、人類偏好、agentic 分數各自量測不同的東西，實作者需要清楚知道自己現在用的是哪一種。
2. 若要重現論文或做 scaling law 實驗，perplexity/log-likelihood 是最容易大規模、低變異地重複量測的 metric（呼應 Lecture 9），但若目標是下游能力或使用者滿意度，必須額外設計 benchmark 或評測流程，不能只看 perplexity 曲線漂亮。
3. 若要做 agent 或 assistant 類系統，實作者必須意識到：評估分數同時反映底層模型與外部 scaffold（planning、delegation、memory、context engineering）的品質，換掉 scaffold 就可能大幅改變分數，因此比較「模型」時要控制 scaffold 是否一致。
4. 若要對外公布或使用某個 benchmark 分數，需要具備 contamination 意識：知道 in-distribution 與 zero-shot/held-out 評估的差異、知道 fresh eval 與 private eval 的做法與限制，而不是把任何公開 benchmark 分數當成毫無疑義的事實。
5. 設計或使用 benchmark 時要能分辨資料集品質問題（不完整測試、有缺陷題目）與模型能力問題，並養成人工審視 output 的習慣，而不是只信任聚合後的量化分數。

## 跨章連結

- Lecture 9/11 Scaling Laws I/II：本講延續「perplexity 適合 scaling law（低變異、平滑隨規模變化）」與「upstream perplexity 不保證 downstream 表現」的落差，並把這個落差具體展開成一整套 benchmark 分類（考試型、對話型、agentic、推理型、safety）。
- Lecture 10 Inference：agentic benchmark（SWE-bench、Terminal-Bench、cybersecurity CTF、MLE-bench）涉及多輪呼叫模型、管理 context、工具使用，與 inference 章節談到的推論效率、context 長度議題相關。
- Lecture 13/14 Data（Sources/Datasets、Filtering/Deduplication/Mixing/Synthetic Data）：本講反覆出現的 train/test contamination 問題（模型「見過」測試資料的疑慮），與下一講開始要談的資料來源、資料去重、資料混合直接相關；本講只從評估角度點出問題，資料處理面的因應留給 Lecture 13/14。
- 全書一致性提醒：本講出現的 in-distribution vs out-of-distribution/zero-shot evaluation 概念，與書中其他章節談到的 held-out set、test split 用語需要保持一致翻譯（「保留集」「測試切分」等，待主控 agent 統一）。

## 相關作業與材料佔位

- Lecture 12 lecture code：`data/cs336/lectures material/lecture_12.py` 已下載，待材料階段閱讀。
- Lecture 12 trace：`var/traces/lecture_12.json` 已下載，待材料階段閱讀。
- Assignment 3（Scaling）：依材料計畫，Assignment 3 對應本課程排程為本講 due（Assignment 3 due；Assignment 4 out）。本筆記未讀 Assignment 3/4 code repo，不整合作業細節，僅記錄本講在課程排程上是 Assignment 3 due、Assignment 4 out 的節點。
- Assignment 4（Data）：本講之後緊接 Data 相關課程（Lecture 13/14），Assignment 4 對應章節為 12-14；本筆記不展開 Assignment 4 內容。

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| Lecture 12 投影片/程式碼中的圖表、確切數值、benchmark 版本號 | `lecture_12.py`、trace `lecture_12.json` | 待材料階段閱讀後補齊 |
| 逐字稿中提到的 benchmark 原始論文精確年份、作者、資料集大小 | MMLU、GPQA、HLE、SWE-bench、ARC-AGI、HarmBench、AIR-Bench、AlpacaEval、WildBench 等原論文 | 待材料階段或外部補充階段查核，本筆記只依講者口頭描述整理 |
| 「Tatsu 的研究群」提出的 contamination 順序效應方法的確切論文與方法細節 | 論文原文 | 待材料階段或外部補充階段查核 |
| GCG 越獄演算法的完整推導與原始論文 | 論文原文 | 待材料階段或外部補充階段查核 |
| ARC-AGI-3、GDPval、醫療臨床評測專案、Claude 真實用量分析專案的機構名稱與確切發布時間 | 官方頁面或論文 | 待材料階段或外部補充階段查核 |
| Docent 工具的確切功能與出處 | 官方文件 | 待材料階段或外部補充階段查核 |
| 逐字稿中出現、疑似 ASR 誤植的模型名稱（例如聽起來像「Mythos」的模型） | 無法由逐字稿本身確認拼寫 | 標記為 ASR 不確定，不代入真實模型名稱 |
| Assignment 3/Assignment 4 與本講評估內容的具體實作關聯 | `code/assignment3-scaling-main/`、`code/assignment4-data-main/` | 待材料階段閱讀後補齊 |

## 暫不處理的外部補充

- 不外查 MMLU、MMLU-Pro、GPQA、Humanity's Last Exam 原始論文。
- 不外查 Chatbot Arena / Arena AI、AlpacaEval、WildBench 原始論文與現行排行榜即時數字。
- 不外查 SWE-bench / SWE-bench Verified、Terminal-Bench、cybersecurity CTF benchmark、MLE-bench 原始論文與即時排行榜。
- 不外查 ARC-AGI 1/2/3 官方頁面與即時分數。
- 不外查 HarmBench、AIR-Bench、GCG 越獄演算法原始論文。
- 不外查 GDPval、醫療臨床評測專案、Claude 真實用量分析專案的官方頁面。
- 不外查 Docent 工具官方文件。
- 不外查 artificialanalysis.ai、OpenRouter 的即時排行榜或統計頁面。
