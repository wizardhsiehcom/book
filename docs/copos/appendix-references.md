# 學習資源

本頁彙整撰寫本書時參考、且讀者可自行延伸查證的公開來源。

!!! warning "使用須知"
    - 連結與日期為撰寫時（**2026 年 9 月**）狀態；網址可能失效，請以來源網站當下版本為準。
    - 涉及時程與數字時，請優先參照本書時效主頁 [09 TSMC 布局與時程](09-tsmc-roadmap.md)。
    - 本書僅做原創概念整理，不轉載受版權保護的原文。

## 一、官方一手來源（可信度最高）

| 資源 | 來源 | 日期 | 重點 |
|------|------|------|------|
| **TSMC 2026 Q1 法說會** | TSMC | 2026-04-16 | **CoPoS 唯一的官方確認來源**：試產線存在、補充而非取代 CoWoS、承認翹曲與熱管理挑戰、量產「還要幾年」 |
| **TSMC 2026 Q2 法說會** | TSMC | 2026 | 玻璃基板與 CoPoS「沒有捷徑，還要兩到三年」 |
| **日月光 310 × 310 mm 面板級封裝產線發表** | ASE 新聞稿 | 2026-05-26 | 支援 FOCoS（2/2 μm）與 FOCoS-Bridge（8/8 μm），目標 2027 上半年投產 |
| **TSMC 北美技術論壇**（每年 4 月） | pr.tsmc.com | 2025、2026 | CoWoS 面積路線圖（5.5 → 9.5 → 14 倍光罩）、SoW-X 時程、SoIC 間距路線圖 |
| Absolics CHIPS 法案資助 | 美國商務部 | — | 玻璃基板廠的官方資助確認 |

> **提醒**：CoPoS 的官方資訊就這麼多。任何具體的年份、地點、面板尺寸或客戶名稱，都不是官方確認的。

## 二、產業報告與市場分析

| 資源 | 來源 | 日期 | 重點 |
|------|------|------|------|
| TSMC Advances Panel-Level Packaging, CoPoS Pilot Line Set for June Completion, 2028–29 Ramp Eyed | TrendForce | 2026-04-13 | 試產線時程與 2028–29 放量的主要來源 |
| TSMC Reportedly Runs Dual-Track Evaluation on CoPoS Pilot Line | TrendForce | 2026-06-16 | 國際軌／本土軌雙軌驗證 |
| TSMC Accelerates CoPoS Development; Taiwan Panel Makers Leverage FOPLP for Glass Core Substrate Opportunity | TrendForce | 2026-06-17 | 台廠切入機會分析，第 [10 章](10-supply-chain-competition.md)主要依據 |
| 第一代 CoPoS 可能「零玻璃」 | 天下雜誌 | 2026-07-06 | **本書最重要的一則修正來源**，引述熟悉台積電先進封裝的資深研發主管 |
| AP7 嘉義 CoPoS 產線完成運作、良率成熟需約一年 | 首爾經濟日報 | 2026-08-11 | 最新的進度報導 |
| CoPoS 量產目標 2029 | DigiTimes | 2026 | 與 TrendForce 的 2H2028 說法衝突，本書並列呈現 |
| Glass Core Substrates: The New Race for Advanced Packaging Giants | Yole Group | 2026 | 玻璃核心基板競局的市調觀點 |
| FOPLP / PLP 市場規模預估 | Yole，經 SemiEngineering 引用 | 2024–2025 | 市場規模的量級參照 |

## 三、技術深度來源

| 資源 | 來源 | 重點 |
|------|------|------|
| **Planning for Panel-Level Fan-Out** | Semiconductor Engineering，2025-07 | **本書 [13 章](13-process-flow.md)的主要依據**：chip-first vs chip-last、微影方案取捨、die shift |
| **Fan-Out Panel-Level Packaging Hurdles** | Semiconductor Engineering，2024-01 | 翹曲放大約五倍、CTE 不匹配、ADK 標準化缺口 |
| The Rise of Panel-Level Packaging | Semiconductor Engineering | 邊緣損耗與利用率的幾何分析 |
| 面板級製程與設備技術總結 | ACM Research，2026-07 | 面積換算、電鍍均勻性、邊緣處理的具體設備規格 |
| Adaptive Patterning 技術資料 | Deca Technologies | die shift 補償的原理與成本影響 |
| **2026 IEEE ECTC** | ectc.net，2026-05-26～29 | 含「面板級整合使能的新封裝技術」專題議程 |
| **IEEE EPS 異質整合路線圖（HIR）工作坊** | ECTC 2026，2026-05-26 | 由 Intel 與 ASE 高層共同主持的產業路線圖 |
| A Review of Glass Substrate Technologies | MDPI（開放取用） | 玻璃基板材料與製程的學術綜述 |
| Glass Substrates Gain Momentum | Semiconductor Engineering | 玻璃基板技術與供應鏈的持續追蹤 |

## 四、追蹤用新聞源與使用建議

| 來源 | 特性 | 使用建議 |
|------|------|---------|
| **Semiconductor Engineering** | 製程與設備的技術深度 | 面板級封裝最好的非論文來源 |
| **TrendForce** | 產能、時程、供應鏈 | CoPoS 時程的主要來源，但多為推估 |
| **SemiAnalysis** | 深度架構與供應鏈分析 | 推理深度最好 |
| Yole Group | 市場規模與技術路線 | 市場量級的參照 |
| DigiTimes / 經濟日報 / 工商時報 / 天下 | 台灣供應鏈 | 獨家性強，但多為未具名來源，應標為[傳聞] |
| 首爾經濟日報 / TheElec | 韓國供應鏈 | 三星系與玻璃基板進度的重要來源 |
| TechPowerUp / Tom's Hardware / Wccftech | 科技媒體 | 速度快，但數字常為轉述，需回溯原始出處 |

!!! tip "讀 CoPoS 新聞的四個檢查"
    1. **這是台積電說的，還是供應鏈說的？** 九成以上是後者。
    2. **這個面板尺寸是誰的？** 600×600 是 Nepes、650×650 是 Amkor、700×700 是 SpaceX——不是台積電的路線圖。
    3. **這是量產，還是規劃？** 目前全球沒有任何 AI 級面板產品量產。
    4. **報導日期是什麼時候？** 玻璃基板陣營的時程一年內改了好幾次。

!!! tip "自行查證的建議關鍵字"
    英文：`TSMC CoPoS panel-level packaging`、`fan-out panel level packaging die shift`、`glass core substrate TGV`、`adaptive patterning panel`、`chip-first vs chip-last RDL`。
    中文：`CoPoS 面板級封裝`、`玻璃基板 台積電`、`扇出型面板級封裝`。搭配年份過濾出最新進展。

## 五、本書庫相關筆記

- **《CoWoS 技術精讀筆記》**——本書多次點到為止的 CoWoS 細節，在該專書完整展開；理解 CoPoS 的直接前提。特別建議搭配該書的「封裝路線圖、產能與經濟學」一章閱讀，因為 CoWoS 的路線圖直接決定了 CoPoS 的必要性有多急迫。

## 相關頁面

- 全書結構與閱讀地圖：[全書地圖](00-map.md)
- 名詞速查：[術語表](appendix-glossary.md)
