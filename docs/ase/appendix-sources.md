# 附錄 A　來源索引

查閱日期一律為 **2026-09-15**。本書所有行內引用的 ID（`A1`、`F1`、`M1`…）都對應到本頁的條目；**正文不得使用本頁沒有的 ID**。

## 證據等級

四級定義如下，轉述時**不得升級**：

| 等級 | 定義 | 能證明什麼 |
|---|---|---|
| 一手・經查核 | 經會計師查核簽證的財務報表、向 SEC 申報的 Form 20-F | 財務數字與法人關係 |
| 一手・公司文件 | 公司官網頁面、公司新聞稿、未經查核的公司財報新聞稿 | **公司對外這樣陳述**，不等於第三方已驗證 |
| 二手・轉載公告 | 媒體逐字轉載的公司公告或新聞稿 | 公告內容存在 |
| 二手・轉述 | 媒體或分析機構對法說會、產業狀況的報導與推估 | 有人這樣說；**不能當公司陳述用** |

!!! warning "公司新聞稿是「公司自述」"
    本書把公司新聞稿列為一手來源，是因為它證明「公司正式這樣說過」。它**不是**技術性能的獨立驗證，也不證明量產或客戶採用。技術主張的階段一律依 [00 全書地圖](00-map.md) 的四階段標示：**研發 → 展示 → 客戶驗證 → 量產**。

---

## 取用限制（先讀這一節）

本書撰寫期間，日月光的部分官方網域**無法取得正文**：

| 網域 | 狀態 | 本書的處理 |
|---|---|---|
| `ase.aseglobal.com`（ASE 品牌技術站） | 直接抓取一律回 **HTTP 403**，文字代理亦失敗 | 技術頁**僅引用其在導覽或搜尋摘要中可確認存在的名稱**，不引用未取得的正文 |
| `ir.aseglobal.com`（投資人關係站） | 直接抓取回 **HTTP 403** | 法說會簡報原檔**未取得**；相關數字改用財報新聞稿（F 系列）或標為二手・轉述 |
| `www.aseglobal.com` | 可取得 | 本書主要的公司官方來源 |

因此本書引用 VIPack 各技術規格時，多數經由**公司新聞稿**或**第三方工程媒體**取得，而非技術站原頁。凡屬此情形，條目內會註明。

---

# A 系列　公司官方文件

## A0　日月光投控官網「About」 {: #A0 }

<https://www.aseglobal.com/about>

**等級**：一手・公司文件。**逐字原文**：

> "ASE Technology Holding Co (ASEH) combines the strengths and expertise of Advanced Semiconductor Engineering, Inc. (ASE), Siliconware Precision Industries Co., Ltd. (SPIL), and USI Inc. (USI) to create meaningful impact and value for the semiconductor industry."

頁面同時載明 ASEH 於 2018 年掛牌於台灣證交所（3711）與紐約證交所（ASX）。**該頁未出現 ATM／EMS 兩個分部的定義文字**——分部定義見 [F1](#F1)、[F4](#F4)。

---

## A1　廠區與辦公室列表 {: #A1 }

<https://www.aseglobal.com/plants-offices/>

**等級**：一手・公司文件。列出集團廠區與辦公室的**地址**，依「Corporate Administration」與各公司設施分組。台灣列有高雄（楠梓，總部）、中壢、新竹、台中、彰化、后里、草屯、南港、台北等；中國列有上海（張江、金橋、盛夏）、蘇州、昆山、惠州、無錫；另有韓國（坡州、天安）、日本（山形）、馬來西亞（檳城）、新加坡、菲律賓（甲美地）、越南、墨西哥（瓜達拉哈拉、托納拉）、波蘭、法國（ASTEELFLASH）、美國（Fremont，ISE Labs）。

**取用限制**：該頁**只有地址與分組名稱**，**未標示各廠區的製程用途、產能、面積或所屬法人的持股比例**。本書因此不把「某項技術在某廠做」寫成事實，除非另有來源。

---

## A2　VIPack 平台發布稿（2022-06-01） {: #A2 }

<https://www.aseglobal.com/press-room/vipack/>

**等級**：一手・公司文件。VIPack 被定義為 "an advanced packaging platform designed to enable vertically integrated package solutions"，官方列出六項組成技術：高密度 RDL 扇出堆疊（FOPoP）、FOCoS、FOCoS-Bridge、FOSiP、TSV 為基礎的 2.5D／3D IC，以及光電共封裝處理。

**取用限制**：這是**平台命名與範圍的發布**，**不是六項技術同步量產的證明**。各技術的階段須逐項回到 [A3](#A3)–[A6](#A6) 判讀。

---

## A3　FOCoS-Bridge 發布（2023-05-31） {: #A3 }

<https://www.aseglobal.com/press-room/focos-bridge/>、<https://www.businesswire.com/news/home/20230531005467/en/>

**等級**：一手・公司文件。原文描述 "qualifying a large 70mm x 78mm package integrating two ASICs and eight High Bandwidth Memory devices through eight silicon bridges"。矽橋提供 "fine lines (L/S<0.5/0.5μm)" 的高密度繞線。

**階段判讀**：原文用字為 **qualifying**（驗證中）＋**測試載具（test vehicle）**，非量產出貨。**未具名客戶。**

---

## A4　FOCoS-Bridge with TSV（2025-05-28） {: #A4 }

<https://www.aseglobal.com/press-room/ase-announces-focos-bridge-with-tsv/>

**等級**：一手・公司文件。測試載具 85 mm × 85 mm，兩組扇出模組各含 1 顆 ASIC 與 4 顆 HBM3，4 顆 TSV 橋接晶片與 10 顆整合被動元件，RDL 3 層、線寬線距 5 µm。公司宣稱相對傳統作法**功率損耗降低 3 倍**、相對標準 FOCoS-Bridge **電阻降低 72%、電感降低 50%**。發表場合為 ECTC 2025。

**取用限制**：上述改善幅度為**公司自述**，新聞稿**未說明完整量測條件與對照組定義**。本書引用時一律連同「比較基準未完整公開」一起寫。與 [A3](#A3) **是不同世代，不得混寫**。

---

## A5　CPO 展示稿（2025-04-01） {: #A5 }

<https://www.aseglobal.com/press-room/ase-demonstrates-cpo-for-ai-applications>

**等級**：一手・公司文件。展示內容為將多顆光引擎直接貼裝於基板上的光電共封裝元件。公開條件：功耗 "<5pJ/bit"（對照 faceplate-pluggable 約 30 pJ/bit、on-board 約 20 pJ/bit）、可相容 1.6 Tb/s 或 3.2 Tb/s、封裝本體 ">75mm X 75mm"，並提供邊耦合與面耦合兩種光纖介面。公司定位其為邁向全整合 3D 方案的 "key interim step"。發表於 OFC 2025（2025-04-03 演講）。

**階段判讀**：**展示（demonstration）**。通道數、光纖規格、測試環境**未公開**；**未具名客戶**。

---

## A6　310 mm 面板級封裝發布稿（2026-05-26） {: #A6 }

<https://www.aseglobal.com/press-room/310x310>

**等級**：一手・公司文件。標題為 "ASE Launches Automated 310mm Panel-Level Packaging to Accelerate AI Innovation"。公開條件：面板 310 mm × 310 mm，單片可用面積達 96,100 mm²，支援 FOCoS（線寬線距 2/2 µm）與 FOCoS-Bridge（8/8 µm）。原文：**"The new panel line is expected to enter production in the first half of 2027."** 另提及後續有擴至 600 × 600 mm 的規劃。

**階段判讀**：**平台發布＋時程目標**，不是量產實績。**廠區位置、良率、客戶均未公開。**

---

## A7　IDE（Integrated Design Ecosystem）發布 {: #A7 }

`https://ase.aseglobal.com/press-room/ide/`（**原頁 403，正文未取得**）

**等級**：二手・轉述（就本書取得的版本而言）。IDE 於 2023 年 10 月發布，定位為整合設計生態系，涵蓋設計規則檢查與設計套件；2025 年另發布 IDE 2.0。媒體轉述的效益主張包含「週期縮短 50%」一類說法。

**取用限制**：**本書未取得官方原文**，故所有 IDE 的效益數字一律標為二手，且**比較基準與測試條件未公開**。設計套件（PDK）依轉述為 "upon request & under NDA"，本書**未能驗證**其內容與可取得範圍。相關未決問題見 [待查事項](appendix-open-questions.md)。

---

## A8　ASE 品牌技術站的頁面名稱（僅名稱可確認） {: #A8 }

`https://ase.aseglobal.com/` 下的產品與技術頁，包括（但不限於）：wire-bond-bga、flip-chip-packaging、bumping-services、wafer-level-packaging、fan-out-packaging、leadframe-packaging、system-in-package、package-design、focos、focos-bridge、3d-ic-packaging、en/products/test。

**等級**：**二手・轉述**。這些頁面**直接抓取一律回 HTTP 403**，本書取得的只有搜尋引擎摘要。

**取用限制（重要）**：本書引用 A8 時，**只引用「這個服務或技術頁在官網上存在」這件事**，代表公司對外宣稱提供該類服務；**絕不引用其中的任何規格數字**（球距、腳數、層數、機台裝機量、良率、產能）。要規格請回到 [A2](#A2)–[A6](#A6) 的新聞稿，或承認未取得。

---

# F 系列　財務與營運

## F1　2026 年第二季未經查核合併財報新聞稿（2026-07-30） {: #F1 }

<https://www.prnewswire.com/news-releases/ase-technology-holding-co-ltd-reports-its-unaudited-consolidated-financial-results-for-the-second-quarter-of-2026-302838714.html>

**等級**：一手・公司文件（**未經查核 unaudited**）。主體：日月光投控合併。期間：2026 年第二季。

| 項目 | 數值 |
|---|---|
| 合併營收 | NT$191,064 百萬（年增 26.7%、季增 10.0%） |
| 毛利率 | 21.0%（前一季 20.0%） |
| 營業利益率 | 11.1%（前一季 10.1%） |
| 歸屬母公司淨利 | NT$21,068 百萬 |
| 基本每股盈餘 | NT$4.80（每單位 ADS US$0.304） |
| ATM 分部 | 營收 NT$126,148 百萬｜毛利率 27.3%｜營業利益率 15.7% |
| EMS 分部 | 營收 NT$65,789 百萬｜毛利率 8.9%｜營業利益率 2.4% |
| 設備資本支出 | US$1,695 百萬（封裝 US$840 百萬、測試 US$804 百萬、EMS US$49 百萬） |

**逐字原文（分部描述）**：公司自述為 "semiconductor assembly and testing services (ATM) and the provider of electronic manufacturing services (EMS)"。

**口徑提醒**：**ATM ＋ EMS 不等於合併營收**（126,148 ＋ 65,789 ＝ 191,937，與 191,064 相差 873，差額為分部間交易沖銷）。本書**不自行加總分部**。資本支出以 **US$** 計、營收以 **NT$** 計，**兩者不可混用**。

---

## F2　2026 年第一季未經查核合併財報新聞稿 {: #F2 }

<https://www.prnewswire.com/news-releases/ase-technology-holding-co-ltd-reports-its-unaudited-consolidated-financial-results-for-the-first-quarter-of-2026-302756590.html>

**等級**：一手・公司文件（未經查核）。本書用於 [F1](#F1) 的季度對照（毛利率 20.0%、營業利益率 10.1%）。

---

## F3　2025 年第四季與全年未經查核合併財報新聞稿（2026-02-05） {: #F3 }

<https://www.prnewswire.com/news-releases/ase-technology-holding-co-ltd-reports-its-unaudited-consolidated-financial-results-for-the-fourth-quarter-and-the-full-year-of-2025-302679779.html>

**等級**：一手・公司文件（未經查核）。主體：日月光投控合併。期間：2025 會計年度。

| 項目 | 2025 全年 | 2024 對照 |
|---|---|---|
| 合併營收 | NT$645,388 百萬（年增 8.4%） | — |
| 毛利率 | 17.7% | 16.3% |
| 營業利益率 | 7.9% | 6.6% |
| 歸屬母公司淨利 | NT$40,658 百萬 | NT$32,483 百萬 |
| ATM 分部 | 營收 NT$389,228 百萬｜毛利率 23.5%｜營業利益率 11.3% | 毛利率 22.5%｜營業利益率 9.8% |
| EMS 分部 | 營收 NT$259,079 百萬｜毛利率 9.1%｜營業利益率 2.9% | 毛利率 9.0%｜營業利益率 2.9% |
| 折舊與攤銷 | NT$67,440 百萬 | — |
| 資本支出 | US$3,396 百萬（封裝 2,104／測試 1,140／EMS 139／其他 13） | — |

**口徑提醒**：ATM ＋ EMS ＝ 648,307，與合併營收 645,388 相差 2,919（分部間沖銷）。折舊與攤銷以 NT$ 計、資本支出以 US$ 計。

---

## F4　Form 20-F（FY2025，2026-04-01 申報） {: #F4 }

<https://www.sec.gov/Archives/edgar/data/1122411/000119312526135585/d50802d20f.htm>

**等級**：**一手・經查核**。申報人 ASE Technology Holding Co., Ltd.（CIK 0001122411），Accession No. 0001193125-26-135585，涵蓋會計年度截至 **2025-12-31**，申報日 **2026-04-01**。

### 報導分部的正式定義（逐字）

> "OPERATING SEGMENTS INFORMATION　The Group has the following reportable segments: **Packaging, Testing and EMS.** The Group packages bare semiconductors into finished semiconductors with enhanced electrical and thermal characteristics; provides testing services, including front-end engineering testing, wafer probing and final testing services; engages in the designing, assembling, manufacturing and sale of electronic components and telecommunications equipment motherboards. Information about other business activities and operating segments that are not reportable are combined and disclosed in Others."

!!! danger "本書查到最重要的一個口徑落差"
    經查核的 20-F 裡，正式報導分部是 **Packaging、Testing、EMS 三個**（另有不可報導的 Others）。**全文檢索「ATM」這個縮寫的出現次數是 0。**

    而未經查核的季度財報新聞稿（[F1](#F1)）用的是 **ATM／EMS 兩分部**，並自述為 "the leading provider of semiconductor assembly and testing services (\"ATM\")"。

    也就是說：**「ATM」是公司對外自我描述的業務簡稱，不是 SEC 申報文件裡的會計分部名稱。** 讀季報的 ATM 數字與讀 20-F 的 Packaging／Testing 數字，是在讀兩套不同顆粒度的口徑，**不可互相代換**。詳見 [09](09-capacity-and-economics.md)。

### 先進封裝的正式技術定義（逐字）

> "We define **leading-edge advanced packages** as packaging technologies that incorporate redistribution layer (RDL) processes. By leveraging RDL processes, embedded integration, and 2.5D and 3D technologies, these packaging solutions facilitate unprecedented innovation in integrating multiple chips within a single package. Notable technologies include ASEH's FOWLP (Fan-Out Wafer-Level Package), high-density RDL-based Fanout Package-on-Package (FOPoP), Fanout Chip-on-Substrate (FOCoS), Fanout Chip-on-Substrate-Bridge (FOCoS-Bridge), Fanout System-in-Package (FOSiP), Through Silicon Via (TSV)-based 2.5D and 3D IC, along with Co-Packaged Optics processing capabilities."

這份清單與 [A2](#A2) 的 VIPack 六大支柱**高度重疊**——但 20-F 用的是「leading-edge advanced packages」，**全文查無 "LEAP" 這個縮寫**。LEAP 是法說會口頭與媒體使用的簡稱，見 [F5](#F5)、[F8](#F8)。

### 子公司持股（逐字）

> "SPIL Group　Siliconware Precision Industries Co., Ltd., which was established on May 17, 1984, is our **wholly owned subsidiary**."

> "USI Group　… As of January 31, 2026, we held **100.0% interest in USI Inc.**, **71.6% interest in USI Shanghai** through USI Inc. and ASE Shanghai, **75.1% interest in HCC Group** through USI Inc., and **100.0% interest in FAFG** through USIFR and USI Shanghai."

**注意**：USI 集團**不是單一持股比例**，是一組不同比例的實體。把「環旭電子」當成一個 100% 子公司來讀，會弄錯合併報表裡的非控制權益。

### 主要廠區（20-F 表格節錄，含用途）

20-F 的 "PROPERTY, PLANTS AND EQUIPMENT" 表格載有地點、啟用或取得時間、**主要用途**、樓地板面積與所有權——這是 [A1](#A1) 官網廠區頁**沒有**的資訊。節錄：

| 設施 | 地點 | 啟用／取得 | 主要用途 |
|---|---|---|---|
| ASE Inc.（高雄） | 台灣高雄 | 1984-03 | 主要封裝設施；覆晶、晶圓凸塊、細間距打線 |
| ASE Inc.（中壢） | 台灣中壢 | 1999-07 取得 | 整合封裝與測試；通訊與消費性電子 |
| ASE Test Taiwan | 台灣高雄 | 1990-04 取得 | 主要測試設施；先進邏輯／混合訊號／RF／3D IC 測試 |
| ASE Malaysia | 馬來西亞檳城 | 1991-02 | 整合封裝與測試；主要服務 IDM |
| ASE Korea | 南韓 Paju | 1999-07 取得 | 整合封裝與測試；RF、感測器、車用 |
| ISE Labs | 美國加州 | 1999-05 取得 | 前段工程測試與最終測試 |
| ASE Singapore | 新加坡 | 1999-05 取得 | 整合封裝與測試；通訊、電腦、消費性電子 |
| ASE Shanghai | 中國上海 | 2004-06 | 封裝材料設計與生產 |
| ASE Japan | 日本 Takahata | 2004-05 取得 | 整合封裝與測試；手機、家電、車用 |
| ASE Electronics | 台灣高雄 | 2006-08 | 互連材料（封裝基板）設計與生產 |
| Wuxi Tongzhi | 中國無錫 | 2013-05 取得 | 整合封裝與測試；消費性電子 |
| CHE | 南韓天安 | 2024-08 取得 | 整合封裝與測試 |
| ASE Philippines Branch | 菲律賓甲美地 | 2024-08 取得 | 整合封裝與測試 |
| USI | 台灣南投 | 2010-02 取得 | 電子零組件製造與銷售 |
| USI de Mexico | 墨西哥 | 2010-02 取得 | 主機板與電腦零組件製造 |
| USI Shanghai | 中國上海 | 2010-02 取得 | 電子零組件設計、製造與銷售 |
| Universal Global Technology | 中國崑山 | 2011-08 | 電子零組件設計與製造 |

**取用限制**：上表為本書擷取到的部分，20-F 原表可能另有設施（含矽品自身廠區與其餘環旭廠區）**未完整核對**。

---

## F5　2026 年第二季法說會轉述 {: #F5 }

<https://www.investing.com/news/transcripts/earnings-call-transcript-ase-technology-posts-strong-q2-2026-growth-shares-fall-93CH-4822859>

**等級**：**二手・轉述**。法說會的口頭說明與展望由第三方平台轉錄。**原始簡報（`ir.aseglobal.com`）未取得**，因此本書凡引用法說會內容一律標為二手，並與 [F1](#F1) 的書面數字分開處理。

---

## F6　2026 年度資本支出上修報導（2026-07-31） {: #F6 }

<https://www.trendforce.com/news/2026/07/31/news-ase-again-raises-2026-capex-to-record-us10-5b-eyes-2x-leading-edge-advanced-packaging-revenue-by-2027/>、<https://www.digitimes.com/news/a20260731PD223/ase-2026-data-revenue-2027.html>

**等級**：二手・轉述。內容：日月光於 2026 年內**第二次**上修 2026 年度資本支出，由 US$8.5 十億調高至 **US$10.5 十億**。

!!! warning "同一組數字，兩個不同的主詞——本書並列不調和"
    報導中「約 US$4 十億用於廠房與基礎建設、US$6.5 十億用於設備」這組拆分，本書查到**兩個來源用同樣的數字但主詞不同**：

    - **公司自述**：2026-07-30 法說會問答中，財務長的逐字回答為 "out of this $10.5 billion, $4 billion will be for new factory buildings and facilities and $6.5 billion for equipment."（見 [F5](#F5)）
    - **法人估計**：本條的 TrendForce 報導原句主詞是 "**institutional investors estimate** about US$4 billion of this year's capital expenditure will be allocated to new fabs and infrastructure…"

    兩者並存，本書**不代為判定哪一個在先**。引用時請標明是哪一個來源：要當公司陳述用，引 [F5](#F5)（且需注意 F5 本身是第三方逐字稿平台，非官方原檔）；要當法人推估用，引本條。

**2026 年度資本支出的修訂軌跡**（口徑各不相同，見 [09](09-capacity-and-economics.md)）：US$7.0 十億（2026-02，原始年度指引，[F8](#F8)）→ 最高 US$8.5 十億（2026-04-30，第一次上修，[M5](#M5)）→ US$10.5 十億（2026-07-30，第二次上修，[F5](#F5)、本條）。**這三個都是「指引」，不是實際支出**；實際支出見 [F1](#F1)（單季設備資本支出）與 [F3](#F3)（2025 全年 US$3,396 百萬）。

---

## F7　2026 年第一季法說會轉述 {: #F7 }

<https://www.investing.com/news/transcripts/earnings-call-transcript-ase-technology-q1-2026-results-miss-eps-forecasts-93CH-4643872>

**等級**：**二手・轉述**（第三方逐字稿平台）。2026-04-29 法說會，財務長說明將年度資本支出自 US$7.0 十億上修，增量中約三分之二用於廠房與設施；增量的機器設備約 75% 用於封裝、25% 用於測試。

**取用限制**：該逐字稿把廠房增量記為 "TWD 0.9 billion"，但同段落的總增量為 US$1.5 十億，且 0.9 ＋ 0.6 ＝ 1.5 恰好吻合，**幣別標示極可能是轉錄誤植**。本書照錄並註記存疑，**不逕自更正**。

---

## F8　2026 年度原始資本支出與 LEAP 指引報導（2026-02-06） {: #F8 }

<https://www.taipeitimes.com/News/biz/archives/2026/02/06/2003851840>

**等級**：二手・轉述（媒體引用公司聲明，"ASE said"）。內容：2026 年度資本支出指引 US$7.0 十億（較 2025 年的 US$5.5 十億增約 27%），其中約三分之二用於先進服務產能；**LEAP（leading-edge advanced packaging）服務營收預期自 2025 年的 US$1.6 十億至少倍增至 US$3.2 十億**。報導並稱 LEAP 服務**包含 wafer-on-substrate 製程，該製程是 CoWoS 的一部分**。

!!! note "LEAP 與 20-F 用語的落差"
    「LEAP」這個縮寫**只出現在法說會口頭發言與媒體報導**；經查核的 [F4](#F4) 20-F 全文查無此縮寫，用的是完整敘述 "leading-edge advanced packages"。兩者所指範疇是否完全一致，**公司未明文對應**——列為待查。

    公司對 LEAP 營收的歸屬只有定性說明（"LEAP services are primarily included within our computing applications, with a lesser amount being included in communications"），**與 ATM 分部營收、SiP 營收之間是否重疊計算，未公開**。

---

---

# M 系列　媒體與第三方

## M1　台積電 CoWoS 委外報導（2025-12-08） {: #M1 }

<https://www.trendforce.com/news/2025/12/08/news-tsmcs-cowos-l-s-reportedly-fully-booked-osat-partners-step-up-with-ases-cowop-in-focus/>

**等級**：二手・轉述。報導稱台積電擴大 CoWoS 中 CoW（Chip-on-Wafer）段的委外規模，交由日月光等封測廠承接，先前主要委外的是 WoS 段。

**取用限制**：這是**媒體轉述**，非台積電或日月光的公告。本書據此**只能寫「承接特定工站」**，**不能寫成日月光供應整套 CoWoS**。相關未決問題見 [Q04](appendix-open-questions.md)。

---

## M2　EDN 對 FOCoS-Bridge 的工程報導 {: #M2 }

<https://www.edn.com/fan-out-bridge-package-achieves-high-density/>

**等級**：二手・轉述。工程媒體對 [A3](#A3) 結構的說明，本書用於補充結構描述，不用於證實性能。

---

## M3　日月光與矽品合併案反壟斷限制解除報導（2020-03-26） {: #M3 }

<https://www.digitimes.com/news/a20200326PD204.html>

**等級**：二手・轉載公告。內容：中國反壟斷機構於 2017-11-24 有條件核准，要求兩公司在公司治理、財務、人資、定價、銷售、產能與採購等事項維持獨立運作一段期間；該限制於 2020 年解除。

---

## M4　日月光與矽品聯合換股公告（2016-06-30） {: #M4 }

`https://ase.aseglobal.com/press-room/joint-announcement-by-ase-and-spil/`

**等級**：一手・公司文件（**原頁 403，本書取得的是搜尋摘要**，故實際引用時視為二手）。內容為雙方董事會決議簽訂聯合換股協議、共同成立控股公司。

---

## M5　2026 年度資本支出第一次上修報導（2026-04-30） {: #M5 }

<https://www.digitimes.com/news/a20260430PD210/ase-packaging-2026-demand-capex.html>

**等級**：二手・轉述。內容：日月光將 2026 年度資本支出指引上修至最高 US$8.5 十億。

**取用限制**：該頁**有付費牆**，本書僅取得開頭段落，其餘內容（是否含廠房／設備拆分）**未取得**。

---

# T 系列　標準與技術文獻

## T1　JEDEC JESD22-A104（溫度循環） {: #T1 }

**等級**：標準文件（標準編號與名稱）。封裝可靠度的溫度循環測試方法。本書僅引用**標準的存在與用途**，不引用未取得的條文內容。

## T2　JEDEC JESD22-A110（HAST，高加速應力測試） {: #T2 }

**等級**：標準文件。偏壓濕熱加速測試方法，同上只引用用途。

## T3　異質整合的設計流程討論 {: #T3 }

<https://www.3dincites.com/2024/04/five-workflows-for-tackling-heterogeneous-integration-of-chiplets-for-2-5d-3d/>

**等級**：二手・轉述。用於說明 chiplet／2.5D／3D 共同設計流程的產業討論，非任一公司的能力證明。

## T4　面板級封裝的翹曲與對位限制 {: #T4 }

**等級**：二手・技術文獻整理。扇出封裝的翹曲來自環氧模封膠（EMC）固化收縮與各材料熱膨脹係數不匹配；重構後的晶粒放置誤差在面板格式下被放大，文獻記載 **50 µm 以上並不罕見**。本書引用這些限制時，**不把它們當成日月光特定產線的表現**。

**取用限制**：多數 IEEE／ECTC 論文全文在付費牆後，本書**未取得全文**，僅引用可公開取得的摘要與轉述。

---

## 本書未取得的來源

| 來源 | 狀態 | 影響 |
|---|---|---|
| `ase.aseglobal.com` 技術頁正文 | HTTP 403 | VIPack 各技術的官方規格表無法逐字核對 |
| `ir.aseglobal.com` 法說會簡報原檔 | HTTP 403 | 法說會數字只能用二手轉述 |
| 公開資訊觀測站年報中文原檔 | 未取得 | 法人、持股比例、事業定義未能逐項核讀 |
| IEEE／ECTC 論文全文 | 付費牆 | 技術限制只能引用摘要層級 |
| 日月光官方設計規則（PDK） | NDA | IDE 的實際能力邊界無法驗證 |

這些缺口列在[待查事項](appendix-open-questions.md)，**是證據缺口，不是尚未撰寫的章節**。
