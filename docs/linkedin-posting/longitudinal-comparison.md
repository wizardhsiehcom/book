# 跨時期讀同一作者：材料、角色與寫法

同一位作者換題目，不一定換了寫法。這一章把不同年份的文章排在一起，觀察他用什麼材料支持判斷，以及哪些結構能移用到自己的工程經驗。

## 取樣方式與可回答的問題

本輪於2026-10-03查閱三位作者的原站作品：繁中系統與軟體專欄作者洪士灝、推薦系統與LLM作者Eugene Yan、半導體分析作者Doug O’Laughlin。按時期和題材選取教學案例，沒有按讚數挑文，也不是隨機樣本。

這些是**原站文章的跨期比較**。LinkedIn先前出現存取限制，本輪沒有重新請求個人貼文。原站長文不能補算LinkedIn貼文，原站反應也不能替代LinkedIn讚數。沒有完整反應分布，不能宣稱已納入高、中、低互動對照組。

後續另補[Eugene與Fred各12篇LinkedIn貼文比較](eugene-fred-comparison.md)，可對照短貼文如何呈現問題與導向長文。本章保留原站選讀的範圍，不把兩批篇數合併。

本章完成後，晚間瀏覽器控制恢復，另有[20篇LinkedIn公開反應快照](browser-reaction-cases.md)。兩批資料分開：本章的34篇原站文章不改算LinkedIn貼文。

讀表時請保留三項界線：

- 文章日期是作品的時間點；當時職位需要另外有日期的證據。
- 全文、公開前段和只讀到標題的候選，代表不同的閱讀範圍。
- 本章比較寫作結構；沒有曝光與可比觀測窗，不能判斷哪種模式提高流量。


### 本輪取得多少材料

| 作者 | 篇數與時段 | 實際閱讀範圍 |
|---|---|---|
| 洪士灝 | 10篇，2015–2017 | 十篇正文全文；有署名轉載 |
| Eugene Yan | 12篇，2020–2025 | 十一篇讀到正文結尾、一篇部分正文；其中一篇參考文獻未完整讀 |
| Doug O’Laughlin | 12篇，2021–2026 | 兩篇完整正文、十篇公開付費前段；含一篇共同署名 |

合計34篇，均有實質正文可供分析，**未達原訂三人各12篇的36篇下限**。繁中線原先選Kyo Huang，讀取索引遇到錯誤後停止該站，改選洪士灝；其餘未讀標題不補算篇數。這次也沒有取得新的LinkedIn貼文或可比反應快照，所以尚未完成LinkedIn縱向成效試點。

## 洪士灝：把工程經驗接到人才與制度問題

這十篇2015–2017年專欄來自iThome，包含作者同意的轉載，並非全部首次刊登原站。各篇正文可讀；日期沿用iThome頁面，不推定轉載前的原始發布時間。

**當時的位置：**2015年工作坊文記述校內活動組織；2016年OpenStack文交代評審和開課；同年的能力文則自述帶領學生開發工具。這些支持當時的教學、研究與人才培育角色。頁尾職稱沒有生效日期，不用來確認每篇發表時的職等；也不把Sun任職回憶當成當年的現職。

<!-- hong-table-start -->
| 日期與署名專欄 | 閱讀範圍 | 材料與結構 |
|---|---|---|
| 2015-07-28 · [觀點：需要改變的科技人才培育模式](https://www.ithome.com.tw/guest-post/97674) | 全文；含工作坊經過、企業反應、產學結構與結尾主張。 | 從工作坊經費受阻和企業回應起筆，逐層推到產學合作與科技代工結構，結尾把責任落回支持實務人才。 |
| 2015-11-11 · [悅讀程式：自學軟體開發的第一步](https://www.ithome.com.tw/guest-post/99887) | 全文；頁面註明作者同意轉載。 | 以作家閱讀類比讀程式碼，穿插教學與 Sun 經歷，從急就章批判推到開源閱讀、自學及跨國交流。 |
| 2015-11-21 · [轉型到 Open Source 的世界來尋寶](https://www.ithome.com.tw/guest-post/100118) | 全文；含 Sun、Oracle、HTC 與開源生態案例。 | 先用 Sun 與 Oracle 的開源轉向立論，再批判台灣管理思維，最後提出高技術、低資本研發作為轉型路徑。 |
| 2015-12-25 · [別讓「主流安全牌思維」變創新絆腳石](https://www.ithome.com.tw/guest-post/101977) | 全文；含演講觀察、三組問題與結尾主張。 | 以演講和研究生分享的效果失落切入，將安全價值拆成哲學、視野、生存三題，最後轉向改革與人才合作。 |
| 2016-03-16 · [現在和未來新創所需的技能](https://www.ithome.com.tw/guest-post/104639) | 全文；含技能表、能力解說與 Alluxio 案例。 | 先列世界經濟論壇技能表，再逐項解釋前三項，最後用 Alluxio 創業史把能力映射到真實研發決策。 |
| 2016-03-22 · [為何大學得開課教 OpenStack？人才得從源培養](https://www.ithome.com.tw/guest-post/104795) | 全文；含 Hackathon、課程與產官學討論。 | 從 OpenStack 黑客松和新課程切入，以人才、薪資與產官學合作解釋生態系困境，結尾借參賽反應收束。 |
| 2016-04-22 · [IT 系統人才的出路，以技術立身如何可能](https://www.ithome.com.tw/guest-post/105459) | 全文；含讀者提問、職涯論證與人才培育方案。 | 由讀者提問轉入系統職涯論證，反駁以偏概全，最後把人才培育落到產官學協作和小規模起步。 |
| 2016-05-03 · [寫程式之外，傑出軟體工程師所需的 6 項能力](https://www.ithome.com.tw/guest-post/105688) | 全文；含能力清單、個人經驗、產學評論與收束。 | 引用五項能力清單後，以個人工程經驗逐項示範，再補上溝通能力，連回台灣產學與高生產力議題。 |
| 2016-12-15 · [革自己和世界命的程式設計師](https://www.ithome.com.tw/guest-post/110330) | 全文；含程式教育、金融科技、IC 產業及社會影響。 | 從程式自動化帶來失業風險談起，穿插金融科技與 IC 產業例子，轉向技能更新和科技成果公平分配。 |
| 2017-07-27 · [培育臺灣軟體人才，要從開源這一步邁出去](https://www.ithome.com.tw/guest-post/115807) | 全文；含開源計畫、OpenStack、求職疑慮與人才建議。 | 以開源計畫作背景，列出開源價值變化，舉 OpenStack 回應求職疑慮，末段連到國際貢獻與人才機會。 |


### 跨期對照：有立場，也要讓讀者看見推理

- **現場經驗如何支撐大問題：**2015年人才培育文由工作坊經費談產學結構，開源轉型文則由企業決策談研發路徑。模式偏觀點論證，經驗段落負責交代作者為何提出問題；經驗本身不能證明整個產業都如此。
- **同一角色可以換教學入口：**2016年OpenStack文由活動切入，系統人才文回應讀者問題，能力文借清單逐項補工程經驗。讀者可學選入口，不必模仿整段產業批判的強度。能力清單還包含引用來源，不能全部算作者原創。
- **立場鮮明與可回應的建議可以並存：**2017年開源人才文列出理由並處理求職疑慮；對照較早的批判文章，可觀察題材如何影響語氣。只有少量目的取樣，不能說作者隨年份變得更溫和或更有效。

**給你的編輯建議：**目前可先從自己參與的調試、整合或交接問題起筆，把一個局部教訓講清楚。未來若累積跨團隊材料，再寫更廣的流程或人才建議；不能只借用資深作者的肯定語氣，省略支持判斷的經驗。

## Eugene Yan：換了技術題材，仍交代方法與限制

樣本分為2020、2021–2022、2023–2025三段，各四篇。十二篇都有實質正文可讀；十一篇讀到正文結尾，其中2025年推薦／搜尋綜述未完整讀參考文獻；2023年LLM模式長文只讀到快取段。表內模式是本書編碼，不是作者自訂分類。

**當時的位置：**作者在[2025-03-30寫作FAQ](https://eugeneyan.com/writing/writing-faq/)回顧，2020年新工作聚焦推薦系統，2023年起轉向LLM。這提供工作題材的時間線，沒有確認每篇發表時的正式職稱。2020年1月文章與當年轉職的先後也未核實。

| 日期與原站文章 | 閱讀範圍 | 主要模式 | 材料與結構 |
|---|---|---|---|
| 2020-01-06 · [Building a Strong Baseline Recommender in PyTorch, on a Laptop](https://eugeneyan.com/writing/recommender-systems-baseline-pytorch/) | 正文全文 | 教學拆解／實驗復盤 | 用電商商品關聯資料逐步建基線；把清理、負採樣、模型與指標連成實驗，末段解讀失敗和限制。 |
| 2020-01-13 · [Beating the Baseline Recommender with Graph & NLP in Pytorch](https://eugeneyan.com/writing/recommender-systems-graph-and-nlp-pytorch/) | 正文全文 | 案例復盤 | 承接基線，逐項試圖隨機遊走、word2vec 與側資訊；報速度及 AUC，也坦承失敗並提煉結論。 |
| 2020-03-28 · [Writing is Learning: How I Learned an Easier Way to Write](https://eugeneyan.com/writing/reading-note-taking-writing/) | 正文全文 | 經驗敘事／方法教學 | 以自身卡稿經驗轉成讀、記、寫循環；提供日常步驟，將寫作定位為學習與思考工具。 |
| 2020-04-26 · [Serendipity: Accuracy’s Unpopular Best Friend in Recommenders](https://eugeneyan.com/writing/serendipity-and-accuracy-in-recommender-systems/) | 正文全文 | 教學拆解 | 先用音樂推薦引出準確率盲點，再整理多樣性、新穎性與驚喜度指標，接回使用者和商業目標。 |
| 2021-01-10 · [Real-time Machine Learning For Recommendations](https://eugeneyan.com/writing/real-time-recommendations/) | 正文全文 | 教學拆解／選型 | 先問即時推薦何時值得，再用中美案例講系統，最後給延遲、吞吐與成本限制下的 MVP。 |
| 2021-06-13 · [Patterns for Personalization in Recommendations and Search](https://eugeneyan.com/writing/patterns-for-personalization/) | 正文全文 | 資源整理／模式歸納 | 把產業論文歸成 bandit、embedding、序列、圖與 user embedding，逐例說明權衡，末段給選型提示。 |
| 2022-04-10 · [Counterfactual Evaluation for Recommendation Systems](https://eugeneyan.com/writing/counterfactual-evaluation/) | 正文全文 | 教學拆解 | 從離線評估的直覺矛盾切入，以 IPS 例子解式，再列零曝光與高變異風險及適用邊界。 |
| 2022-04-17 · [How to Measure and Mitigate Position Bias](https://eugeneyan.com/writing/position-bias/) | 正文全文 | 教學拆解 | 先說明位置偏差如何形成，再分類隨機化與日誌估計方法，最後依產品階段給緩解策略。 |
| 2023-07-30 · [Patterns for Building LLM-based Systems & Products](https://eugeneyan.com/writing/llm-patterns/) | 部分正文：讀到快取段；後續模式未讀 | 模式歸納 | 以七種 LLM 產品模式搭框架；正文涵蓋評估、RAG、微調與快取前段，案例密集，後段未取得。 |
| 2023-08-13 · [How to Match LLM Patterns to Problems](https://eugeneyan.com/writing/llm-problems/) | 正文全文 | 選型教學 | 把常見 LLM 產品問題映射到模式，先分外部／內部模型與資料依賴，再用短題例做決策指南。 |
| 2025-03-16 · [Improving Recommendation Systems & Search in the Age of LLMs](https://eugeneyan.com/writing/recsys-llm/) | 正文至結論；參考文獻未完整讀 | 研究整理 | 回到推薦與搜尋，按架構、資料、訓練及統一框架整理研究；逐例給結果，也指出比較限制。 |
| 2025-05-04 · [Building News Agents for Daily News Recaps with MCP, Q, and tmux](https://eugeneyan.com/writing/news-agents/) | 正文全文 | 作品展示／流程解說 | 以自建每日新聞代理為例，依序展示架構、工具、子代理流程與限制；用原型紀錄支撐技術解說。 |

### 跨期對照：先學可以延續的骨架

- **實驗可以連成兩篇。**2020年1月的基線與Graph／NLP文章，共享問題但各自交代方法、結果與失敗。可借鏡的語氣是「這次試了什麼、哪裡沒有奏效」，而不是每篇都需要宣布突破。
- **選型文章把判斷放在操作之前。**2021年的即時推薦、2022年的反事實評估，以及2023年的LLM問題映射，都幫讀者理解何時適用。這些選讀案例顯示，相鄰技術領域可以共用「條件—方法—代價」的教學結構；不能由樣本推算作者整體風格的變化。
- **後期仍可回到小型實作。**2025年的研究綜述與新聞Agent原型，一篇整理他人的研究，一篇展示自己的製作。語氣和材料會隨文種切換，不能把年份較晚等同於只寫宏觀觀點。原型文尤其適合參考如何用流程與限制支持作品介紹。

**給你的編輯建議：**先寫一篇設備文件問答基線，再寫一篇改動及失敗；等累積多個實際問題，才整理選型指南。這是練習順序，沒有證據顯示如此安排能提高LinkedIn曝光。

## Doug O’Laughlin：把舊判斷帶回來檢查

十二篇分布於2021–2022、2023–2024、2025–2026，各四篇。僅兩篇正文完整可讀，另十篇只讀公開付費前段；下表的分析到付費牆為止。2025年年度展望與Alpha Hunter共同署名，不能將全部文字歸為Doug個人語氣。

**當時的位置：**帶日期的文章能確認他當時從事半導體刊物寫作，2021-11-22的成本文章也提到訂閱與社群經營。正式雇主和職稱未核實。[About頁](https://www.fabricatedknowledge.com/about/)（2026-10-03讀取，未見版本日期）提及Bowie Capital經歷，但沒有任職日期，不能回填各年。這是產業／投資研究角度，與一線設備工程角色有距離。

| 日期與原站文章 | 閱讀範圍 | 主要模式 | 材料與結構 |
|---|---|---|---|
| 2021-02-20 · [The Digital Transformation of Cars is Just Beginning](https://www.fabricatedknowledge.com/p/the-digital-transformation-of-cars) | 全文公開：供需短缺、ADAS、電動化、結論及附錄。 | 產業機制解說 | 先用汽車缺片交代近因，再按供需、ADAS、電動化分段，最後把長期內容增長連到投資者熟悉的 S 曲線。 |
| 2021-11-22 · [The Rising Tide of Semiconductor Cost](https://www.fabricatedknowledge.com/p/the-rising-tide-of-semiconductor) | 付費前段：摩爾定律成本、設備支出、成熟製程、TSMC 議價與總結；末段投資想法在牆後。 | 資料解讀／觀點論證 | 由摩爾定律成本推到設備、成熟製程與 TSMC 議價，分層整理三種成本來源，末尾才落到價格與付費投資想法。 |
| 2022-01-06 · [In the Middle of Transition: 2022 Semiconductor Outlook](https://www.fabricatedknowledge.com/p/in-the-middle-of-transition-2022) | 全文可讀：產業週期、需求來源、2021 股票表現與估值。 | 年度展望 | 先提出產業由循環轉向長期成長的假說，再用多終端與供需支撐，並以機率和歷史基準限制自己的看多判斷。 |
| 2022-12-31 · [Semiconductor Outlook 2023: Green Shoots](https://www.fabricatedknowledge.com/p/semiconductor-outlook-2022-green) | 付費前段：年內循環和宏觀回顧、復甦線索、2022 個股回報及估值；後續分產業分析在牆後。 | 判斷復盤／展望 | 先回顧前一年判斷失準，再沿疫情庫存、升息、中國與出口管制重建下行脈絡，轉用估值與個股表尋找反轉線索。 |
| 2023-06-15 · [VLSI Japan: It’s Better on the Backside](https://www.fabricatedknowledge.com/p/vlsi-japan-its-better-on-the-backside) | 付費前段：BSPDN 定義、IR droop、PowerVia 技術難點、效能及 Intel/TSMC 競爭；個股想法在牆後。 | 技術教學 | 從 BSPDN 定義和 IR droop 講起，分談技術難點、性能、成本與競爭位置，再把會議材料連到 Intel 和 TSMC。 |
| 2024-03-03 · [Why HBM is the Hottest Thing in Memory](https://www.fabricatedknowledge.com/p/hbm-supply-and-other-ideas-right) | 付費前段：投資原則、HBM 供需類比及 SK Hynix 看法；其餘投資點子在牆後。 | 觀點論證 | 先交代投資原則，再用油氣供需比喻 HBM，推演資本支出轉移如何壓低 DRAM、NAND 供給並利好 SK Hynix。 |
| 2024-04-08 · [Beaten Down Semiconductor Could be AI Play](https://www.fabricatedknowledge.com/p/beaten-down-semiconductor-could-be) | 付費前段：MaxLinear 公司史與產品線概況；催化劑及估值明確列為付費內容。 | 公司研究導讀 | 先交代 MaxLinear 歷史與產品線，再把催化劑和估值列為付費章節；公開段以公司概況建立跌深後重新評估的前提。 |
| 2024-08-05 · [Markets and Semiconductors](https://www.fabricatedknowledge.com/p/markets-and-semiconductors) | 付費前段：日圓套利平倉、衰退疑慮、Nvidia 延遲及半導體風險報酬更新；策略點子在牆後。 | 事件解讀／判斷更新 | 由日圓套利平倉按事件序列展開，交叉檢查衰退風險與 Nvidia 延遲，最後更新半導體的風險報酬判斷。 |
| 2025-01-03 · [2025 AI & Semiconductor Outlook](https://www.fabricatedknowledge.com/p/2025-ai-and-semiconductor-outlook) | 付費前段：2024 回顧、產業分化、AI 經濟與週期判讀；非 AI 產業展望付費。 | 共同署名年度展望 | 先比較 AI 與其他半導體板塊的年度分化，再談 AI 邊際成本，並用庫存、收入象限提醒讀者週期已走到哪裡。 |
| 2025-03-12 · [Recessions and Semiconductors](https://www.fabricatedknowledge.com/p/recessions-and-semiconductors) | 付費前段：債券殖利率、貿易資金流與宏觀情境，收窄至半導體循環；更細想法在牆後。 | 情境推演 | 先以殖利率、貿易與資金流鋪宏觀推理，再收窄到半導體先行訊號，並明確標出自己不做預測的範圍。 |
| 2025-04-22 · [Where is the Tariff Pull Forward?](https://www.fabricatedknowledge.com/p/where-is-the-tariff-pull-forward) | 付費前段：TSMC 財報、多家公司電話會議、庫存與關稅情境；完整庫存循環分析在牆後。 | 資料解讀／情境推演 | 把 TSMC 財報與多家公司電話會議整理成拉貨證據，再推導企業庫存、防守決策及關稅下半年可能造成的情境。 |
| 2026-01-07 · [2026 AI & Semiconductor Outlook](https://www.fabricatedknowledge.com/p/2026-ai-and-semiconductor-outlook) | 付費前段：2025 預測得失、記憶體／光學、Semicap、汽車與 AI 週期；文末的預測續篇在牆後。 | 年度判斷復盤 | 年度回顧先逐項列出預測命中與落空，再把瓶頸轉移連到 AI、記憶體、光學、設備股與汽車週期。 |

### 跨期對照：立場可以明確，也可以修正

- **2022年展望與同年底的2023年展望可配對讀。**前一篇提出產業轉向長期成長的假說，後一篇承認前一年判斷失準，再重建庫存與宏觀事件脈絡。可學的是留下原判斷並解釋修正，不能據這兩篇評定作者整體預測準確度。
- **技術解說有明確的讀者用途。**2023年背面供電文從機制走到公司競爭，2024年HBM文則把供需與資本支出接到投資判斷。你可以學中段如何解釋機制；若寫給工程同行，結尾應換成自己有證據的驗證條件或設計取捨。
- **時事提供入口，材料支持判斷。**2024年市場文用事件順序更新立場，2025年關稅文引入財報與公司發言，2026年展望核對前一年預測。這些樣本可見第一人稱判斷與校正痕跡；本書未逐一驗證其市場主張，也沒有把它們當今日投資建議。

**給你的編輯建議：**在工程貼文中留下「原先預期、後來觀察、改變判斷的原因」。例如原以為錯誤來自模型，經紀錄發現與文件版本有關，才適合寫成復盤；若尚未測試，就寫為排查計畫。

### 互動數為什麼仍不能排名

Doug頁面抽取到若干數字，但沒有保留圖示與欄位標籤，無法可靠判斷是讚、留言或其他計數，因此不列入本章成效表。Eugene沒有取得逐篇可比互動數。兩者也都沒有對應LinkedIn貼文、曝光或固定觀測窗。**本輪取得的是可分析的作品，不是可比較的成效資料。**

## 如何把比較用在自己的題庫

先找你手上材料足以支持的寫法，再考慮想靠近的職涯角色。下面是編輯建議，並非這批案例驗證過的成效排序。

| 目前材料 | 可以寫的內容 | 需要補齊的證據 |
|---|---|---|
| 設備／視覺系統的一次異常 | 問題如何出現、如何縮小範圍、哪個觀察改變判斷 | 可公開的紀錄、條件與排除過程 |
| 軟體工具或重構嘗試 | 原本限制、採用方法、適用邊界 | 可執行範例或實際前後結果；沒有結果就寫待測設計 |
| LLM文件問答原型 | 哪類問題失敗、引用如何檢查、何時拒答 | 評估案例、文件版本與錯誤分類 |
| Agent工具流程 | 工具權限、停止條件、失敗如何回到人工 | 實際執行軌跡與驗證方式；不能把設計當部署成果 |
| 想走向架構／主管／顧問 | 選項如何比較、誰承擔成本、什麼條件會改選 | 自己參與的決策與限制；職稱無法代替這些材料 |

同一個題目可留三張卡：當時知道什麼、採取了什麼行動、後來哪項證據改變判斷。這能形成自己的跨期作品線，不必等升職才開始寫。尚未驗證的想法，用「目前假設／下一步測試」收尾；完成後再另寫結果，兩篇各自保留日期。

回到[作者歷程](author-journeys.md)、[研究方法](research-method.md)或[導讀](README.md)。
