# AA228V 書稿事實查核報告（R2）

- 查核範圍：12 條宣稱（出自依 Stanford AA228V「Validation of Safety Critical Systems」課程影片寫成的繁中書稿）
- 驗證日期：2026-07-10
- 原則：敏感事實（頭銜、課號、榜單、數字）以兩個獨立來源交叉驗證；查不到即標「待查」，不做推測。

## 總表

| # | 宣稱 | 判定 | 一句修正 |
|---|------|------|----------|
| 1 | 機制性可解釋性入選 MIT TR 2026 十大突破技術 | **正確** | 確為 2026 榜單第 7 項「Mechanistic interpretability」，無需修正。 |
| 2 | Stanford CS 221M（機制性可解釋性，Thomas Icard 授課） | **正確（部分細節需補）** | 課號與課名屬實；Icard 為哲學系教授（CS 兼任禮遇），課程為 2026 春季開設，且為四位講師合授（Icard、Geiger、Zur、Huang）。 |
| 3 | AST 提出者「SISL 校友 Richie Lee」 | **部分正確** | 正確拼寫為 **Ritchie** Lee；當時任職 NASA Ames（RSE 組，經 SGT Inc.）；原始論文為 DASC 2015〈Adaptive Stress Testing of Airborne Collision Avoidance Systems〉；其博士出自 CMU ECE（2019），Stanford 學位為 Aero/Astro 碩士，稱「SISL 校友」不準確，宜稱「SISL 長期合作者」。 |
| 4 | DIFFS 由「Harrison（SISL）開發」 | **部分正確** | 應為 **Harrison Delecki**（Harrison 是名非姓，SISL 博士生、第一作者）等人；正式縮寫為 **DiFS** 非 DIFFS；論文〈Diffusion-Based Failure Sampling for Evaluating Safety-Critical Autonomous Systems〉，arXiv 2024，發表於 IEEE ERAS 2025。 |
| 5 | 「Robert 的多場景 AST 框架」 | **部分正確／待查** | 指涉對象確為 SISL 的 Robert J. Moss（POMDPStressTesting.jl、FMS 軌跡預測 AST 等），但未找到明確題為「多場景 AST」的單一論文，具體指涉待查。 |
| 6 | Somil Bansal 頭銜與經歷 | **部分正確** | Stanford Aero/Astro 助理教授 ✓、曾任 USC ECE 助理教授 ✓、曾任 Waymo 研究科學家（一年）✓；實驗室全名 Safe and Intelligent Autonomy Lab ✓，但縮寫為 **SIA Lab**，非 SAIL（SAIL 是 Stanford AI Lab 的縮寫，勿混用）。 |
| 7 | Anthony Corso 頭銜 | **部分正確** | Stanford Aero/Astro 博士（2021，SISL）✓；曾任（2021–2024，已卸任）Stanford Center for AI Safety 執行主任 ✓；Terra AI 應寫「**共同創辦人兼 CTO**」而非「創辦人」；現另為 Stanford 訪問學者。 |
| 8 | 氣候數字（2.7°C／>4°C／1.5–2°C） | **部分正確** | 「現有政策約 2.7°C」為 CAT 2021–2024 數據，2025-11 最新更新已下修為 **2.6°C**；「無作為超過 4°C」對應的是 IPCC AR6 極高排放情境 SSP5-8.5 的 4.4°C（並非嚴格的「無作為」）；「積極減排 1.5–2°C」大致對應 CAT 樂觀情境中位數 1.9°C，惟 1.5°C 需超出現有淨零承諾的行動。 |
| 9 | 南韓地熱廠導致地震 | **正確** | 即 2017-11-15 浦項 Mw 5.4 地震；南韓政府調查（2019-03）認定由 EGS 地熱注水觸發，為全球 EGS 相關最大誘發地震。 |
| 10 | 1986 年 Lake Nyos CO₂ 窒息事件 | **正確** | 1986-08-21 喀麥隆尼奧斯湖湖底噴發（limnic eruption），釋出大量 CO₂，窒息致死 1,746 人與約 3,500 頭牲畜。 |
| 11 | 2018 Uber ATG 亞利桑那事故「感測器誤判行人」 | **部分正確** | 事故屬實（2018-03-18，Tempe, AZ，Elaine Herzberg 身亡）；但 NTSB 認定感測器**有偵測到**（撞擊前 5.6 秒），失效在**感知分類軟體**——反覆在車輛／自行車／其他之間切換、始終未辨識為行人，且原廠自動緊急煞車被停用。「感測器誤判」宜改為「感知系統分類失效」。 |
| 12 | Anthropic Golden Gate SAE 實驗與 Dallas→Texas→Austin 電路追蹤 | **正確** | Golden Gate 出自〈Scaling Monosemanticity〉（2024-05-21）與示範產品 Golden Gate Claude（2024-05-23）；Dallas→Texas→Austin 兩跳推理出自〈On the Biology of a Large Language Model〉（2025-03-27，方法論姊妹篇〈Circuit Tracing〉同日發表）。 |

---

## 逐條詳查

### 1. 機制性可解釋性入選 MIT Technology Review 2026 十大突破技術

- **判定**：正確
- **修正後表述**：機制性可解釋性（Mechanistic interpretability）是 MIT Technology Review「10 Breakthrough Technologies 2026」榜單十項之一（同榜還有鈉離子電池、生成式編程、次世代核能、AI 伴侶、胚胎評分、基因復活、商業太空站、鹼基編輯嬰兒、超大規模 AI 資料中心）。榜單描述：「沒有人確切知道大型語言模型如何運作……巧妙的研究技術正給我們窺見黑箱內部的最佳視角。」
- **來源 1**：MIT Technology Review 官方榜單 — https://www.technologyreview.com/2026/01/12/1130697/10-breakthrough-technologies-2026/ （發布日期：2026-01-12）
- **來源 2**：Forbes 報導（列出含 mechanistic interpretability）— https://www.forbes.com/sites/johnwerner/2026/01/25/mit-technology-review-details-big-tech-trends-for-2026/ （2026-01-25）
- **輔助**：官方新聞稿 — https://www.prnewswire.com/news-releases/mit-technology-review-announces-the-2026-list-of-10-breakthrough-technologies-302658798.html （2026-01-12）
- **驗證日期**：2026-07-10

### 2. Stanford CS 221M（機制性可解釋性，Thomas Icard 授課）

- **判定**：正確（部分細節需補充）
- **修正後表述**：Stanford 確有「CS 221M: Mechanistic Interpretability」，於 **2026 年春季**開設；講師團隊為 Thomas Icard、Atticus Geiger、Amir Zur、Jing Huang（助教 Junyi Tao、Taka Yamakoshi）。Thomas Icard 為 Stanford **哲學系教授**（兼任 Computer Science 禮遇職位），研究橫跨邏輯、因果抽象與機制性可解釋性（與 Geiger、Goodman、Potts 合著 JMLR 論文〈Causal Abstraction: A Theoretical Foundation for Mechanistic Interpretability〉）。
- **注意**：書稿若寫成「Thomas Icard 授課」可保留，但宜註明他是四位講師之一、來自哲學系；不宜寫成 CS 系專任教授。
- **來源 1**：課程官網 — https://cs221m.github.io/ （2026 春季課程頁）
- **來源 2**：Stanford ExploreCourses 講師頁 — https://explorecourses.stanford.edu/m_instructor?sunet=icard ；Stanford Profiles — https://profiles.stanford.edu/thomas-icard
- **驗證日期**：2026-07-10

### 3. AST 提出者：Ritchie Lee 還是 Richie Lee？

- **判定**：部分正確（拼寫錯誤＋「SISL 校友」不準確）
- **修正後表述**：AST（Adaptive Stress Testing）由 **Ritchie Lee**（非 Richie）等人提出。原始論文為 Ritchie Lee, Mykel J. Kochenderfer, Ole J. Mengshoel, Guillaume P. Brat, Michael P. Owen,〈Adaptive Stress Testing of Airborne Collision Avoidance Systems〉，IEEE/AIAA Digital Avionics Systems Conference (DASC), **2015**（NASA NTRS 20160005033）。Lee 當時透過 SGT Inc. 任職於 **NASA Ames Research Center**（Robust Software Engineering 組研究科學家）。學歷：CMU 電機與電腦工程博士（2019，論文即〈AdaStress: Adaptive Stress Testing and Interpretable Categorization for Safety-Critical Systems〉）、Stanford 航太碩士——因此稱「SISL 校友」並不準確，宜稱「Kochenderfer／SISL 的長期合作者」。其後任職 Cruise（Simulation & Testing 資深主任工程師）、現任 Wayve。
- **來源 1**：NASA NTRS 原始論文 — https://ntrs.nasa.gov/archive/nasa/casi.ntrs.nasa.gov/20160005033.pdf （2015-09-13，DASC 2015）
- **來源 2**：Ritchie Lee 個人網站（經歷與拼寫）— https://ritchielee.net/ 、https://ritchielee.net/research/
- **輔助**：AST 回顧論文（JAIR）— https://www.jair.org/index.php/jair/article/download/12190/26631/25188 ；arXiv:1811.02188
- **驗證日期**：2026-07-10

### 4. DIFFS（Diffusion-based Failure Sampling）

- **判定**：部分正確（人名與縮寫需修正）
- **修正後表述**：**DiFS**（非 DIFFS）由 **Harrison Delecki**（SISL 博士生，第一作者；Harrison 是名、Delecki 是姓）與 Marc R. Schlichting、Mansur Arief、Anthony Corso、Marcell Vazquez-Chanlatte、Mykel J. Kochenderfer 共同提出。論文標題〈Diffusion-Based Failure Sampling for Evaluating Safety-Critical Autonomous Systems〉，arXiv:2406.14761（初版 2024-06-20，v2 2025-05-20），正式發表於 **IEEE International Conference on Engineering Reliable Autonomous Systems (ERAS) 2025**。方法：以條件式去噪擴散模型自適應逼近失效分布，在五個驗證問題上優於基準（失效分布保真度、多樣性、樣本效率）。
- **來源 1**：arXiv — https://arxiv.org/abs/2406.14761 （2024-06-20 提交；v2 註明發表於 IEEE ERAS 2025）
- **來源 2**：IEEE Xplore — https://ieeexplore.ieee.org/iel8/11135509/11135541/11135908.pdf ；ResearchGate（載明縮寫 DiFS）— https://www.researchgate.net/publication/381652492_Diffusion-Based_Failure_Sampling_for_Cyber-Physical_Systems
- **驗證日期**：2026-07-10

### 5. 「Robert 的多場景 AST 框架」

- **判定**：部分正確／待查（人物正確，具體指涉論文待確認）
- **修正後表述**：「Robert」幾乎可確定指 **Robert J. Moss**（SISL，Kochenderfer 指導）。其 AST 相關代表作：
  - 〈POMDPStressTesting.jl: Adaptive Stress Testing for Black-Box Systems〉, Journal of Open Source Software 6(60):2749, **2021**（黑盒系統 AST 的通用 Julia 框架）— https://joss.theoj.org/papers/10.21105/joss.02749
  - Moss, Lee, Visser, Hochwarth, Lopez, Kochenderfer,〈Adaptive Stress Testing of Trajectory Predictions in Flight Management Systems〉, DASC **2020**, arXiv:2011.02559 — https://arxiv.org/abs/2011.02559
- 未能找到明確以「多場景（multi-scenario）AST」為題的論文；書稿此語可能是課堂口語對上述框架（可跨場景／黑盒套用 AST）的概括。建議書稿改寫為「Robert Moss 開發的黑盒 AST 框架（POMDPStressTesting.jl）」或回查課程影片原句後標註確切出處。
- **來源**：GitHub（SISL 官方 repo）— https://github.com/sisl/POMDPStressTesting.jl ；Stanford 個人頁 — https://web.stanford.edu/~mossr/research/
- **驗證日期**：2026-07-10

### 6. Somil Bansal 的頭銜與經歷

- **判定**：部分正確（實驗室縮寫錯誤）
- **修正後表述**：Somil Bansal 現任 **Stanford Aeronautics & Astronautics 助理教授**，主持 **Safe and Intelligent Autonomy Lab（SIA Lab）**——縮寫是 **SIA Lab，不是 SAIL**（Stanford 的 SAIL 慣指 Stanford Artificial Intelligence Laboratory，易誤導，務必更正）。此前為 **USC ECE 助理教授**；博士（UC Berkeley EECS, 2020）畢業後曾在 **Waymo** 任研究科學家一年。2026 年 5 月獲 IEEE RAS Early Career Award。
- **來源 1**：個人首頁 — https://smlbansal.github.io/ ；SIA Lab 官網 — https://smlbansal.github.io/sia-lab/
- **來源 2**：Stanford Aero/Astro 系方頁面 — https://aa.stanford.edu/people/somil-bansal ；CV — https://smlbansal.github.io/Papers/Somil_Bansal_CV.pdf
- **驗證日期**：2026-07-10

### 7. Anthony Corso 的頭銜

- **判定**：部分正確（Terra AI 職稱需修正；執行主任為「曾任」）
- **修正後表述**：Anthony Corso 於 **2021 年取得 Stanford Aeronautics & Astronautics 博士**（SISL，Kochenderfer 指導），其後留任博士後至 2024；**2021–2024 年間曾任 Stanford Center for AI Safety 執行主任（Executive Director），現已卸任**；現為 **Terra AI 共同創辦人兼 CTO**（開發礦產探勘、地熱、碳封存等永續資源專案的決策支援工具），並為 Stanford 訪問學者。書稿寫「創辦人」應改為「共同創辦人兼 CTO」。
- **來源 1**：個人 Bio — https://ancorso.github.io/bio/ （載明 ED 任期 2021–2024、Terra AI co-founder & CTO）
- **來源 2**：LinkedIn（Co-founder and CTO at Terra AI）— https://www.linkedin.com/in/anthonycorso1/ ；Stanford SAIL-Toyota Center 頁 — https://aicenter.stanford.edu/people/anthony-corso
- **驗證日期**：2026-07-10

### 8. 氣候數字（2.7°C／>4°C／1.5–2°C）

- **判定**：部分正確（數據需更新並標註年份與情境定義）
- **修正後表述**：
  - **現有政策路徑**：Climate Action Tracker（CAT）2021–2024 年評估約 **2.7°C**；**2025-11-13 最新更新下修至約 2.6°C**（主因中國排放路徑的方法學調整，非實質政策進展）。書稿寫 2.7°C 應標註「CAT 2024 年評估」或更新為 2.6°C（2025-11）。
  - **「無作為超過 4°C」**：對應 IPCC AR6 極高排放情境 **SSP5-8.5：2081–2100 年最佳估計 +4.4°C**（範圍 3.3–5.7°C，相對 1850–1900）。嚴格說 SSP5-8.5 是「極高排放」而非「無作為」；以「若排放持續高速成長，本世紀末可能超過 4°C」表述較嚴謹。
  - **積極減排**：CAT 樂觀情境（140+ 國淨零目標全數兌現）中位數 **1.9°C**；「控制在 1.5–2°C」中的 1.5°C 需超出現有承諾的額外行動。書稿宜寫「若所有淨零承諾兌現約可壓到 1.9°C；1.5°C 需更積極行動」。
- **來源 1**：CAT 2025 年全球更新 — https://climateactiontracker.org/publications/warming-projections-global-update-2025/ （2025-11-13）；CAT 排放路徑頁 — https://climateactiontracker.org/global/emissions-pathways/
- **來源 2**：IPCC AR6 WG1 SPM — https://www.ipcc.ch/report/ar6/wg1/chapter/summary-for-policymakers/ （2021-08）；Carbon Brief AR6 解析 — https://www.carbonbrief.org/in-depth-qa-the-ipccs-sixth-assessment-report-on-climate-science/
- **驗證日期**：2026-07-10

### 9. 南韓地熱廠導致地震（浦項）

- **判定**：正確
- **修正後表述**：2017-11-15，南韓浦項（Pohang）發生 **Mw 5.4** 地震（南韓現代史上第二大），造成約 90 人受傷、約 5,200 萬美元損失。2019 年 3 月南韓政府委託調查團隊結論：地震由鄰近**增強型地熱系統（EGS）的流體注入觸發**——注入流體直接進入近臨界應力斷層帶，為全球已知 EGS 場址最大的誘發／觸發地震。（學界對「induced vs. triggered」仍有技術性辯論，但「與 EGS 地熱廠相關」的表述成立。）
- **來源 1**：Science 論文 — https://www.science.org/doi/10.1126/science.aat6081 （2018）；Science 新聞 — https://www.science.org/content/article/second-largest-earthquake-modern-south-korean-history-tied-geothermal-plant
- **來源 2**：Wikipedia（含政府調查結論時間線）— https://en.wikipedia.org/wiki/2017_Pohang_earthquake
- **驗證日期**：2026-07-10

### 10. 1986 年尼奧斯湖（Lake Nyos）CO₂ 事件

- **判定**：正確
- **修正後表述**：**1986 年 8 月 21 日**，喀麥隆西北部尼奧斯湖發生**湖底翻騰噴發（limnic eruption）**，突然釋出約 10–30 萬噸 CO₂；比空氣重的氣體雲沉降至周邊村落，**窒息致死 1,746 人與約 3,500 頭牲畜**（波及湖周 25 公里）。書稿「CO₂ 窒息人畜」的性質描述正確。
- **來源 1**：Wikipedia — https://en.wikipedia.org/wiki/Lake_Nyos_disaster
- **來源 2**：Britannica — https://www.britannica.com/event/Lake-Nyos-disaster ；Eos（30 週年回顧）— https://eos.org/science-updates/cameroons-lake-nyos-gas-burst-30-years-later
- **驗證日期**：2026-07-10

### 11. 2018 年 Uber ATG 亞利桑那事故

- **判定**：部分正確（「感測器誤判」表述不精確）
- **修正後表述**：2018-03-18，Uber ATG 自駕測試車（有安全駕駛員）在亞利桑那州 Tempe 撞死推自行車橫越馬路的 Elaine Herzberg——首例自駕車撞死行人事故。NTSB 調查（HWY18MH010，2019-11）指出：**雷達／光達在撞擊前 5.6 秒即偵測到她**，失效發生在**感知分類軟體**——系統反覆將她重新分類為車輛、自行車、其他物體，**始終未辨識為行人**（系統設計未考慮行人穿越道以外的行人），每次重分類還重置軌跡預測；且 Volvo 原廠自動緊急煞車被停用，僅依賴分心的安全駕駛員介入。因此書稿「感測器誤判行人」宜改為「**感知系統未能把她正確分類為行人**（感測器有偵測到）」。
- **來源 1**：NPR（NTSB 調查結果）— https://www.npr.org/2019/11/07/777438412/feds-say-self-driving-uber-suv-did-not-recognize-jaywalking-pedestrian-in-fatal- （2019-11-07）
- **來源 2**：Wikipedia（含 NTSB 細節）— https://en.wikipedia.org/wiki/Death_of_Elaine_Herzberg ；IEEE Spectrum — https://spectrum.ieee.org/ntsb-investigation-into-deadly-uber-selfdriving-car-crash-reveals-lax-attitude-toward-safety
- **驗證日期**：2026-07-10

### 12. Anthropic「Golden Gate Bridge」與「Dallas→Texas→Austin」實驗出處

- **判定**：正確
- **修正後表述**：
  - **Golden Gate Bridge SAE 干預**：出自 Templeton et al.,〈Scaling Monosemanticity: Extracting Interpretable Features from Claude 3 Sonnet〉, Transformer Circuits Thread, **2024-05-21**——以稀疏自編碼器（SAE）從 Claude 3 Sonnet 中間層殘差流萃取約 3,400 萬特徵；將「Golden Gate Bridge」特徵鉗制到最大激活值的 10 倍後，模型自稱「我就是金門大橋」。Anthropic 並於 **2024-05-23** 短暫公開示範模型「Golden Gate Claude」。
  - **Dallas→Texas→Austin 電路追蹤**：出自 Lindsey et al.,〈On the Biology of a Large Language Model〉, Transformer Circuits, **2025-03-27**（對象為 Claude 3.5 Haiku）——用歸因圖（attribution graphs）追蹤「含 Dallas 之州的首府」的**兩跳推理**：Dallas 先激活 Texas 相關特徵，再與「首府」特徵結合輸出 Austin。方法論姊妹篇為 Ameisen et al.,〈Circuit Tracing: Revealing Computational Graphs in Language Models〉（同日發表）。
- **來源 1**：Scaling Monosemanticity — https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html （2024-05-21）；Golden Gate Claude 公告 — https://www.anthropic.com/news/golden-gate-claude （2024-05-23）
- **來源 2**：On the Biology of a Large Language Model — https://transformer-circuits.pub/2025/attribution-graphs/biology.html （2025-03-27）；Anthropic 官方推文（兩篇論文連結）— https://x.com/AnthropicAI/status/1905303860765225009 ；MIT TR 報導 — https://www.technologyreview.com/2025/03/27/1113916/anthropic-can-now-track-the-bizarre-inner-workings-of-a-large-language-model/
- **驗證日期**：2026-07-10

---

## 待查清單

1. **（第 5 條）「多場景 AST 框架」的確切指涉**：Robert J. Moss 身分已確認，但查無明確題為「multi-scenario AST」的論文。建議回查 AA228V 課程影片原句，確認是指 POMDPStressTesting.jl（JOSS 2021）、FMS 軌跡預測 AST（DASC 2020），或其博士論文中的其他工作；Moss 的出版清單頁（web.stanford.edu/~mossr/publications.html）目前回傳 403，無法直接核對全表。
2. **（第 3 條）Ritchie Lee 在 Stanford 的碩士年份與是否曾隸屬 SISL**：已確認其 Stanford 學位為 Aero/Astro 碩士、博士為 CMU ECE（2019），但碩士就讀期間是否正式隸屬 SISL 未能證實（SISL 成立於 2013 年，時間上可能不重疊）；書稿宜避免「SISL 校友」的說法。
3. **（第 8 條）CAT「無作為／baseline」情境數字**：CAT 現行公開頁面已不再突出 pre-Paris baseline（歷史上約 4.1–4.8°C）；本報告改以 IPCC AR6 SSP5-8.5（4.4°C）支撐「>4°C」表述。若書稿堅持引 CAT baseline，需另行查證其存檔版本。
