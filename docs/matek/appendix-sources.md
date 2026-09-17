# 來源索引：每份資料能證明到哪裡

全書來源查閱日為 **2026-09-17**。網頁未標示發布日者一律寫「未標示」，不拿查閱日代替。

三件事在本書中永遠分開：**公司自己的公開陳述**、**設備原廠或學會的一般技術資料**、以及**本書作者的推論與合成案例**。公司來源能證明閎康公開說了什麼，不能證明市場地位或客戶實績；技術來源能解釋一般工程原理，不能替閎康證明任何案件；同業服務商的技術文章只作工程說明，與閎康的能力無關。

逐筆原文引用、擷取狀態與適用限制的完整紀錄保存在儲存庫的 `data/matek/`（`company-sources.md`、`company-sources-addendum.md`、`localization-sources.md`、`circuit-edit-sources.md`、`sampleprep-sources.md`、`symptom-sources.md`、`chip-access-sources.md`、`respin-sources.md`）。那是編輯紀錄，不是閱讀正文的先備。

## 一、公司來源（閎康科技，MA-tek）

閎康官網於本次查閱時已改版，早期流傳的 `Service_Scope/index` 與 `zh-TW/services/index/FIB/1000` 兩個網址均回傳 404；以下列出的是實際開啟成功的頁面。

### 服務與技術頁

| ID | 一手來源 | 用途 | 限制 |
|---|---|---|---|
| <span id="c1"></span>C1 | [全服務項目](https://www.matek.com/services/124/)，未標示發布日 | 公開服務分類架構：RA、FA、MA、SA、CA、樣品製備處理、整合性分析 | 分類清單不等於各項目的產能、案件量或客戶 |
| <span id="c2"></span>C2 | [FIB 電路修補](https://www.matek.com/services-detail/94/)，未標示發布日 | 電路編修的原理、應用清單與公司自述機台數 | 未公開廠牌、型號、廠區、稼動率、成功率 |
| <span id="c3"></span>C3 | [FIB 聚焦離子束顯微鏡](https://www.matek.com/services-detail/66/)，未標示發布日 | FIB 同時被列為材料分析技術與電路修補服務 | 未列型號；無法判斷與 C2 機台是否重疊 |
| <span id="c4"></span>C4 | [FA 故障分析](https://www.matek.com/services/71/)，未標示發布日 | 公司對失效分析的定義與子服務清單 | 定義性文字不能證明市占或案件量 |
| <span id="c5"></span>C5 | [MA 材料分析](https://www.matek.com/services/69/)，未標示發布日 | 材料分析子服務清單；官網原文有「閎康是國內規模最為齊全的材料分析電子電機實驗室」 | 此句為公司自述，不是第三方評比；不能證明市占或「全球最完整」 |
| <span id="c6"></span>C6 | [RA 可靠度測試](https://www.matek.com/services/58/)，未標示發布日 | 可靠度定義與子服務清單（含板級、元件、系統、ESD、車用） | 未公開測試件數或客戶 |
| <span id="c7"></span>C7 | [Thermal EMMI 熱點定位](https://www.matek.com/services-detail/191/)，未標示發布日 | 熱輻射式定位服務、InSb 偵測器、平台名稱（Thermo ELITE、HAMAMATSU THEMOS mini） | **頁面未載明技術限制**；解析度數字未附量測條件與樣品前提 |
| <span id="c8"></span>C8 | [IR-OBIRCH](https://www.matek.com/services-detail/190/)，未標示發布日 | OBIRCH 原理、應用範圍、平台名稱（HAMAMATSU uAMOS-200、Meridian S） | 門檻與阻值範圍未說明適用節點；不等於任何案件結果 |
| <span id="c9"></span>C9 | [SEM](https://www.matek.com/services-detail/64/)，未標示發布日 | SEM 服務範圍與自述設備型號（Hitachi 系列） | 未公開台數、購置年份與廠區 |
| <span id="c10"></span>C10 | [TEM](https://www.matek.com/services-detail/65/)，未標示發布日 | TEM 服務範圍與自述設備（Talos 系統，含 EDX/EELS） | 同上 |
| <span id="c11"></span>C11 | [TEM 試片製備](https://www.matek.com/services-detail/85/)，未標示發布日 | 三種製備法（Pre-Thin、Lift-out、Omni-probe）與官網所述典型耗時 | 耗時為「典型」描述，不適用所有樣品；不代表成功率 |
| <span id="c12"></span>C12 | [IC 去封膠](https://www.matek.com/services/80/120/)，未標示發布日 | 去封膠定義與三種子服務（乾式蝕刻研磨去層、雷射、化學） | 本頁未逐一說明適用材料與風險，不足以支持方法比較 |

### 公司與營運

| ID | 一手來源 | 用途 | 限制 |
|---|---|---|---|
| <span id="c13"></span>C13 | [公司簡介](https://www.matek.com/about/)，未標示發布日 | 2002 年成立、知識經濟／研發服務定位、多國據點、品質認證；自述「每月服務件數超過2000件，多數服務項目的交期都在24小時以內」 | 件數與交期為公司自述，未經第三方查核；據點狀態須與 C16 併讀 |
| <span id="c14"></span>C14 | [每月營收報告](https://www.matek.com/investor/Financials/203/)，涵蓋 2026 年 1–7 月 | 各月合併營收與年增率，累計 3,631,159 仟元 | 只有營收，沒有損益；未揭露 FA／MA／RA／FIB 的事業別組成 |
| <span id="c15"></span>C15 | [法說與投資人活動](https://www.matek.com/investor/shareholders-meeting/219/)，頁內單筆標示 2026-04-15 | 公司對外法人溝通活動的一例 | 本次僅擷取到 2026 年度 1 筆，不代表歷年完整清單 |
| <span id="c16"></span>C16 | [出售上海子公司 80% 股權](https://www.matek.com/news-detail/585/)，發布日 2026-08-03 | 處分標的、對價、持股安排、認列方式與預計交割時點 | 揭露時點為「預計」，不能證明已交割；未說明對服務產能的影響 |
| <span id="c17"></span>C17 | [加入 TASA iSPARK 星創基地](https://www.matek.com/news-detail/586/)，發布日 2026-08-05 | 公開表態為太空產業提供材料分析、失效分析、可靠度驗證與技術支援 | 加入聯盟不等於已取得訂單，也不代表新增專屬設備 |
| <span id="c18"></span>C18 | [114 年度產學合作成果發表會暨 MAFT 技術發表會](https://www.matek.com/news-detail/661/)，發布日 2026-09-04（活動日 2026-08-28） | 產學合作規模自述，以及公司分析服務曾協助學界研究並獲致謝 | 發表的技術突破屬各合作團隊，不是閎康自有技術；不能推出營收 |
| <span id="c19"></span>C19 | [新聞中心](https://www.matek.com/news/)，持續更新 | 近期公開消息的清單與各則網址 | 標題不能取代內文，主張須逐則開啟核實 |
| <span id="c20"></span>C20 | [TPEx 上櫃公司基本資料 OpenAPI](https://www.tpex.org.tw/openapi/v1/mopsfin_t187ap03_O)，資料日期欄位 1150916（2026-09-16） | 證券櫃檯買賣中心資料集列有代號 3587 閎康科技股份有限公司；設立日 2002-05-14、掛牌日 2009-08-18、資料日實收資本額 693,699,880 元、董事長謝詠芬 | 不能據此推算股權結構或市值；資料日之後的變動未查 |
| <span id="c21"></span>C21 | [電性故障分析](https://www.matek.com/services/71/74/)，未標示發布日 | 官網將電性量測列為 FA 第一步；I-V／C-V、probe station | 未出現 NTF 用語；不是案件紀錄 |
| <span id="c22"></span>C22 | [AFM-based 奈米探針](https://www.matek.com/services-detail/193/)，未標示發布日 | 接觸阻抗、氧化、電荷累積可能造成誤判；規格自述 | 規格未附校準條件；≠ 客戶實績 |
| <span id="c23"></span>C23 | [SEM-based Nano-probing](https://www.matek.com/services-detail/194/)，未標示發布日 | 電子束干擾、低加速電壓、−40 °C 至 150 °C 溫控；自稱用於 5nm FinFET | 不能獨立驗證 5nm 案件 |
| <span id="c24"></span>C24 | [113 年度股東會年報 PDF](https://doc.twse.com.tw/server-java/t57sb01?step=1&colorchg=1&mtype=F&co_id=3587&year=114)（檔名 `2024_3587_20250617F04.pdf`），刊印 2025-05-15 | 113 年合併營收 5,110,392 仟元；營業比重僅「檢測服務收入」100%，無 FA／MA／RA 分列；台灣實驗室地址 | 刊印時點早於 2026 上海處分；行銷語句不是市占驗證 |
| <span id="c25"></span>C25 | 重大訊息轉載：[出售上海閎康股權達喪失控制力](https://tw.stock.yahoo.com/news/%E5%85%AC%E5%91%8A-%E9%96%8E%E5%BA%B7%E5%87%BA%E5%94%AE%E9%87%8D%E8%A6%81%E5%AD%90%E5%85%AC%E5%8F%B8%E4%B8%8A%E6%B5%B7%E9%96%8E%E5%BA%B7%E8%82%A1%E6%AC%8A%E9%81%94%E5%96%AA%E5%A4%B1%E6%8E%A7%E5%88%B6%E5%8A%9B%E7%9B%B8%E9%97%9C%E4%BA%8B%E5%AE%9C-075358215.html)，訊息日 2026-07-31 | 出售 78.4658%、人民幣約 12.02 億、保留 21.5342% | **本次未直接開啟 MOPS 原件**；與 C16 的 80%／15.2 億並列、不調和；不能證明已交割 |
| <span id="c26"></span>C26 | [2026 年 8 月財務營收](https://www.matek.com/news-detail/663/)，發布日 2026-09-16 | 8 月合併營收 5.65 億、年增 17.78%、1–8 月累計 41.96 億 | 無事業別；表頭「2025 7月」語意可疑，照錄不改 |
| <span id="c27"></span>C27 | [遠端上機服務](https://www.matek.com/news-detail/584/)，發布日 2026-09-04 | 適用 InGaAs、OBIRCH、ThermoELITE、SEM；廠區矽導、竹北、台南 | 未列 FIB／TEM／奈米探針；不能證明品質等同現場 |
| <span id="c28"></span>C28 | [媒體轉載：從「找缺陷」出發](https://www.matek.com/news-detail/662/)，官網 2026-09-15 | 證明官網轉載該篇《商業週刊》報導 | 市占、日本獲利預測皆為媒體敘述，不是獨立驗證 |
| <span id="c29"></span>C29 | [EBIRCH](https://www.matek.com/services-detail/197/)，未標示發布日 | 電子束阻值變化定位；公司自述亮點面積與應用 | 數字未附量測條件 |
| <span id="c30"></span>C30 | [EBAC](https://www.matek.com/services-detail/196/)、[EBIC](https://www.matek.com/services-detail/195/)，未標示發布日 | 開路／接面漏電等服務描述 | 不能證明所有金屬層深度或上海／台灣產能分工 |

!!! note "一則公司自述與主管機關資料不一致的例子"
    閎康投資人專區頁面文字寫「TWSE: 3587」，但臺灣證券交易所的個股日成交與法說資料集查無 3587，證券櫃檯買賣中心的上櫃公司基本資料集則查得（[C20](#c20)）。本書依交易所資料集歸屬為上櫃，並把官網用字不一致列入[待查問題](appendix-open-questions.md)。這正是本書反覆強調「公司自述與主管機關資料要分欄」的現成案例。

## 二、技術來源：電性定位 {#localization}

以下皆已實際開啟原文。這些來源解釋一般工程原理，**不能證明閎康使用特定設備、參數或取得特定結果**。

| ID | 一手來源與日期 | 支持範圍 | 限制 |
|---|---|---|---|
| <span id="l1"></span>L1 | [Hamamatsu PHEMOS-X 規格書 PDF](https://www.hamamatsu.com/content/dam/hamamatsu-photonics/sites/documents/99_SALES_LIBRARY/sys/SSMS0062E_PHEMOS-X.pdf)，型錄標示 2025-07 | 光輻射顯微、背面觀測、固體浸液鏡頭、OBIRCH 與 DALS 的整合能力 | 產品型錄；規格對應特定機型與條件 |
| <span id="l2"></span>L2 | [Hamamatsu 半導體失效分析應用頁](https://www.hamamatsu.com/us/en/applications/automotive/semiconductor-failure-analysis.html)，未標示 | 定位技術在 FA 流程中的位置 | 應用概述，非方法學文件 |
| <span id="l3"></span>L3 | [Thermo Fisher Meridian WS-DP](https://www.thermofisher.com/us/en/home/electron-microscopy/products/electrical-failure-analysis-systems/meridian-ws-dp.html)，未標示 | 光學式故障隔離系統的能力範圍 | 產品頁；未揭露偵測極限的量測條件 |
| <span id="l4"></span>L4 | [AnySilicon：OBIRCH](https://anysilicon.com/obirch-for-semiconductor-failure-analysis-resistive-fault-localization/)，未標示 | OBIRCH 原理與適用症狀 | 產業科普，數字主張須另找原廠或論文 |
| <span id="l5"></span>L5 | [Wikipedia：Thermal laser stimulation](https://en.wikipedia.org/wiki/Thermal_laser_stimulation)，持續更新 | TIVA／OBIRCH 類雷射刺激法的原理分類 | 百科條目，僅作原理性佐證 |
| <span id="l6"></span>L6 | [Semitracks：Soft Defect Localization](https://www.semitracks.com/reference-material/failure-and-yield-analysis/failure-analysis-die-level/soft-defect-localization.php)，未標示 | SDL 針對時序敏感、時好時壞症狀的定位 | 教育訓練教材，非標準文件 |
| <span id="l7"></span>L7 | [AnySilicon：EMMI](https://anysilicon.com/emission-microscopy-emmi-for-semiconductor-failure-analysis/)，未標示 | 光輻射顯微原理與背面波長取捨 | 同 L4 |
| <span id="l8"></span>L8 | [AnySilicon：X-Ray Inspection](https://anysilicon.com/x-ray-inspection-for-semiconductor-package-failure-analysis/)，未標示 | 封裝層級 X 光檢查看得到與看不到什麼 | 同 L4 |
| <span id="l9"></span>L9 | [Imina：EBIC／EBAC](https://imina.ch/en/applications/ebic-ebac-nanoprobing-failure-analysis-sem)，未標示 | 電子束式定位的掃描範圍與阻值偵測範圍 | 原廠規格；需去層與奈米探針接觸 |
| <span id="l10"></span>L10 | [Imina：Origins of EBIRCH contrast（Application Note PDF）](https://imina.ch/storage/app/media/Application-Notes/IminaTechnologies_AppNote_Origins-of-EBIRCH-contrast.pdf)，v1 2023-10 | **本書「訊號不等於根因」最強的一手實驗證據**：同一缺陷在不同偏壓極性、加速電壓與溫度下，位置、形狀與正負號皆改變，訊號可能混雜 EBIRCH、EBIC、EBAC、Seebeck 與功函數溫度效應 | 單一 180 nm PMOS 閘氧漏電案例；溫度／偏壓的具體數值只適用該實驗 |
| <span id="l11"></span>L11 | [Semiconductor Digest：DCG Systems EBIRCH](https://sst.semiconductor-digest.com/2015/11/dcg-systems-addresses-localization-of-electrical-shorts-with-ebirch-technology/)，2015-11 | EBIRCH 掃描範圍（1 mm×1 mm 至 50 nm×50 nm）與阻值偵測範圍（<10 Ω 至 >50 MΩ），與 L9 互相佐證 | 產業媒體報導原廠規格；未討論深層互連下方缺陷的適用性 |
| <span id="l12"></span>L12 | [Wikipedia：Electron beam prober](https://en.wikipedia.org/wiki/Electron_beam_prober)，未標示 | 電子束探測的原理分類 | 百科條目 |
| <span id="l13"></span>L13 | [Wikipedia：Laser-assisted device alteration](https://en.wikipedia.org/wiki/Laser-assisted_device_alteration)，未標示 | LADA 找的是時序敏感位置；解讀翻轉方向需先知道被照電晶體類型 | 百科條目 |
| <span id="l14"></span>L14 | [EE Times：TDR helps isolate electronic package faults（Part 1）](https://www.eetimes.com/tdr-helps-isolate-electronic-package-faults/)，未標示 | 封裝層級時域反射的原理與用途 | 產業媒體技術專欄 |
| <span id="l15"></span>L15 | [同上 Part 2](https://www.eetimes.com/tdr-helps-isolate-electronic-package-faults-part-2/)，未標示 | TDR 的限制：分支走線無法分辨個別分支貢獻 | 同上 |
| <span id="l16"></span>L16 | [iST：Emission Microscope（EMMI）服務頁](https://www.istgroup.com/en/service/emmi/)，未標示 | EMMI 對「不發光」的純歐姆／金屬短路看不到 | **iST 宜特科技是與閎康各自獨立的上櫃同業，不是關係企業**；只作工程說明 |
| <span id="l17"></span>L17 | [ZEISS：Semiconductor Package Failure Analysis with 3D X-ray Microscopy and LaserFIB（PDF 彙編）](https://www.zeiss.co.uk/content/dam/rms/countries/united-kingdom/download/2025/ebook-semiconductor-packaging-failure-analysis.pdf)，彙編 2025，內收錄論文原發表於 ISTFA 2021/2023/2024、IPFA 2023、ICSJ 2022 | **完整因果鏈案例**：電性開路 → 表面疑似損傷 → 3D X-ray 才見被切斷的銅線 → FIB 剖面確認尖角 SiO₂ 顆粒壓穿封裝 → 追出根因在測試座夾持，而非晶片製程 | 原廠彙編；個案不可推廣為通則 |
| <span id="l18"></span>L18 | [Thermo Fisher：Lock-in Thermography ELITE](https://www.thermofisher.com/us/en/home/electron-microscopy/products/electrical-failure-analysis-systems/elite/techniques.html)，未標示 | 鎖相熱影像在定位技術組合中的位置 | 產品頁；本書未採用任何未附量測條件的靈敏度數字 |
| <span id="l19"></span>L19 | [Bruker：X-Ray Defect Inspection](https://www.bruker.com/en/products-and-solutions/semiconductor-solutions/x-ray-defect-inspection.html)，未標示 | X 光缺陷檢查的能力範圍 | 產品頁 |

## 三、技術來源：樣品製備與物理證據 {#physical}

| ID | 一手來源與日期 | 支持範圍 | 限制 |
|---|---|---|---|
| <span id="p1"></span>P1 | [Semitracks InfoTracks Issue 44（PDF）](https://www.semitracks.com/newsletters/february/2013-february-newsletter.pdf)，2013-02 | 標準 FA 流程順序：非破壞先行 → 去封裝 → 逐層去層搭配電壓對比 → 剖面或取樣 → SEM／TEM | 課程教材流程示意，非國際標準；只涵蓋短路與漏電兩類 |
| <span id="p2"></span>P2 | [Semitracks：X-Ray Radiography](https://www.semitracks.com/reference-material/failure-and-yield-analysis/failure-analysis-package-level/x-ray-radiography.php)，未標示 | 2D X 光可偵測的項目；所引標準把異物尺寸下限訂在約 0.025 mm；**鋁打線、非導電 die attach、極細特徵可能不可見** | 只討論傳統 2D radiography，不代表現代高解析 CT 的極限 |
| <span id="p3"></span>P3 | [EAG：Scanning Acoustic Microscopy](https://www.eag.com/techniques/phys-chem/scanning-acoustic-microscopy-sam/)，未標示 | SAM 對分層、空洞、界面裂縫敏感；所述缺陷解析度約 5 µm | 服務頁未給量測條件；非平面與多層樣品效果下降 |
| <span id="p4"></span>P4 | [EAG：X-Ray 與 SAM 互補](https://www.eag.com/blog/complementary-techniques-x-ray-sam/)，未標示 | 兩者互補而非可互換：密集金屬化區 X 光對比弱，SAM 較不受影響；密封空腔聲波無法穿透，X 光不受影響 | 未給兩技術的解析度對照表 |
| <span id="p5"></span>P5 | [Semitracks：Delayering](https://www.semitracks.com/reference-material/failure-and-yield-analysis/failure-analysis-die-level/delayering.php)，未標示 | 去層以濕蝕刻與乾（電漿）蝕刻為主 | 未討論機械研磨與終點控制 |
| <span id="p6"></span>P6 | [AnySilicon：IC Decapsulation](https://anysilicon.com/ic-decapsulation-methods-process-and-applications/)，未標示 | 四種去封裝法各自破壞哪些證據；**若調查的是污染或腐蝕，強蝕刻化學可能改變待查證據本身** | 產業媒體整理；未提供任何配方、溫度或時間參數 |
| <span id="p7"></span>P7 | [Nisene JetEtch](https://www.nisene.com/jetetch-systems/)，未標示 | 化學去封裝設備的能力範圍 | 原廠頁；未公開配方 |
| <span id="p8"></span>P8 | [Ultra Tec：Decapsulation](https://www.ultratecusa.com/)，未標示 | 去封裝與背面製備設備的能力範圍 | 同上 |
| <span id="p9"></span>P9 | EDFA 2025-02, Vol. 27 Issue 1：10 nm 節點全晶片背面化學輔助 FIB 去層 | 先進節點背面去層的可行性與困難：蝕刻速率不均造成局部殘留、充電假象需電子沖流抵銷 | 期刊文章；製程條件對應特定節點 |
| <span id="p10"></span>P10 | 綠光（515 nm）飛秒雷射高保真去層論文 | 雷射作為去層手段的可行性 | 學術研究，非產線標準做法 |
| <span id="p11"></span>P11 | [Buehler：Metallographic Grinding and Polishing Guide](https://www.buehler.com/)，未標示 | 機械研磨拋光的假象：浮凸、鑽石嵌入、塗抹、彗尾狀溝槽 | 金相通用指南，非 IC 專用 |
| <span id="p12"></span>P12 | [Oxford Instruments：The effects of Ga FIB milling on analysis](https://nano.oxinst.com/)，未標示 | FIB 切片的假象：curtaining、離子佈植、再沉積、約 10 nm（30 kV）表層非晶化；**非晶化會使 EBSD 繞射圖案消失** | 部落格層級；數字對應特定加速電壓 |
| <span id="p13"></span>P13 | [Nanoscience Instruments：Broad Ion Beam vs. Focused Ion Beam Polishing](https://www.nanoscience.com/)，未標示 | BIB 與 FIB 拋光的適用差異；BIB 較適合 EBSD 前處理 | 廠商部落格 |
| <span id="p14"></span>P14 | 像差校正 TEM 高品質 lamella 機器人製備論文 | lamella 製備中 over-tilt 造成 Ga 佈植與厚度梯度不均 | 學術論文；條件對應該研究 |
| <span id="p15"></span>P15 | [Bruker：Ultra-High Spatial Resolution SEM EDS of Semiconductor Devices](https://www.bruker.com/)，未標示 | EDS 定量需極薄 lamella 與低探針電流；**樣品已高度加工，不再代表原始塊材狀態** | 原廠應用資料 |
| <span id="p16"></span>P16 | [Bruker：Failure Analysis 應用頁](https://www.bruker.com/)，未標示 | 材料分析技術在 FA 中的組合 | 原廠應用頁 |
| <span id="p17"></span>P17 | [Oxford Instruments（ebsd.com）：EBSD 於半導體的應用](https://www.ebsd.com/)，未標示 | EBSD 能回答晶粒取向、差排與局部應變 | 需無變形層的平整表面 |
| <span id="p18"></span>P18 | [Bruker：AFM Methods for Semiconductor Failure Analysis（Webinar）](https://www.bruker.com/)，未標示 | AFM 在 FA 中的量測對象 | 原廠教育材料 |
| <span id="p19"></span>P19 | [Thermo Fisher：XPS Lateral Resolution](https://www.thermofisher.com/)，未標示 | XPS 的橫向解析度與化學態分析能力 | 原廠頁 |
| <span id="p20"></span>P20 | [Thermo Fisher：Polymer Analysis FAQ](https://www.thermofisher.com/)，未標示 | FTIR 對高分子與模封材料的分析範圍 | 原廠 FAQ |
| <span id="p21"></span>P21 | [Infinita Lab：Semiconductor Failure Analysis Techniques & Standards Reference Guide](https://infinitalab.com/)，未標示 | 根因結論需要多組獨立證據互相印證 | 服務商指南，一般性陳述 |
| <span id="p22"></span>P22 | [AnySilicon：Failure Analysis Process – From Failure to Root Cause](https://anysilicon.com/semiconductor-failure-analysis-process-from-failure-to-root-cause/)，未標示 | **找到異常結構不等於證明根因**；需良品（known-good）對照 | 產業媒體；未給對照樣本數的量化指引 |
| <span id="p23"></span>P23 | EDFA 2024-08, Vol. 26 Issue 4：Design for Inspection in Advanced IC Packages | 先進封裝的可檢測性設計與高解析 X 光可見特徵尺度 | 期刊文章 |
| <span id="p24"></span>P24 | [美國專利 US8357931](https://patents.google.com/patent/US8357931)：覆晶晶粒內部訊號存取 | 覆晶的主動區與 BEOL 只能從矽基板背面接近；基板厚度（例示 700 µm）遠大於主動區（約 10 µm），背面薄化與鑽孔需極高定位精度 | 專利背景說明；例示數字非通用規格 |

## 四、技術來源：電路編修與改版 {#edit}

| ID | 一手來源與日期 | 支持範圍 | 限制 |
|---|---|---|---|
| <span id="e1"></span>E1 | [iST：FIB Circuit Edit Comprehensive Guide](https://www.istgroup.com/en/tech_20250218_circuit-edit/)，2025-02-18 | 背面編修鎖定 M1–M3 關鍵間距金屬；沉積金屬的串接電阻量級（Pt 約 6 kΩ、W 約 2 kΩ） | **iST 為獨立同業，非閎康關係企業**；電阻數字未附線長、線寬與量測方法 |
| <span id="e2"></span>E2 | [iST：Backside FIB Circuit Edit for Advanced Process IC](https://www.istgroup.com/en/tech_20190314/)，2019-03-14 | 覆晶是背面編修的主因；減薄、開 trench、endpoint 控制、紅外線對位（建議誤差 ≤20 µm）；過蝕造成不可逆開路或暴露非目標金屬層 | 同上；「7 nm 建議留矽 1–2 µm」是該公司操作建議，非通用規格 |
| <span id="e3"></span>E3 | [iST：FIB Circuit Edit／CAD Probe Pad Debug 服務頁](https://www.istgroup.com/en/service/ic-fib-circuit-edit/)，未標示 | 服務商自陳限制：FIB 導體金屬電阻高於原始值；同一 IC 多次修改會降低良率 | 同上；未給量化幅度 |
| <span id="e4"></span>E4 | [iST：5nm FIB 編修挑戰](https://www.istgroup.com/en/tech_20210706-5nm-fib/)，2021-07-06 | 7／5 nm 相鄰金屬線間距可窄至 10 nm 量級；9M+AP 堆疊下正面需穿 6 層金屬、背面只需穿 1 層主動區層 | 同上；單一服務商單一案例，非通案 |
| <span id="e5"></span>E5 | [Thermo Fisher：Centrios Circuit Edit System](https://www.thermofisher.com/us/en/home/electron-microscopy/products/circuit-edit-systems/centrios.html)，未標示 | 商用編修系統的定位（prototyping、debug、repair）與正背面編修能力；Ga 液態金屬離子源 | 產品行銷頁；未揭露良率、電阻率或污染數據 |
| <span id="e6"></span>E6 | [Thermo Fisher 新聞稿（BioSpace 轉載）：Centrios HX](https://www.biospace.com/thermo-scientific-centrios-hx-offers-precise-circuit-edit-solution-for-fast-prototyping)，2022-02-16 | 明確把編修定位在「preproduction design flaws」與快速原型 | 新聞稿，廠商行銷語言 |
| <span id="e7"></span>E7 | [Thermo Fisher：Semiconductor｜FIB Circuit Edit](https://www.thermofisher.com/us/en/home/semiconductors/circuit-edit.html)，未標示 | 編修定義為「cutting and creating connections」；系統依節點分級 | 未說明分級的具體技術原因 |
| <span id="e8"></span>E8 | [EAG：FIB Circuit Edit Becomes Increasingly Valuable](https://www.eag.com/app-note/focused-ion-beam-fib-circuit-edit-becomes-increasingly-valuable-in-high-stakes-world-of-advanced-node-design/)，頁面未標發布日（圖片時間戳約 2016） | 最小孔徑約 0.1×0.1 µm、深寬比 1/20；多數 20／28 nm 設計鑽不出足夠小的孔；背面編修因金屬層數增加而常是最有效路徑；endpoint 高度依賴操作員經驗 | 文中 $5–10M／6–8 週的對比是服務商舉例，未附出處與年份基礎，與 E15 量級不同，須並列閱讀 |
| <span id="e9"></span>E9 | [EAG：FIB Circuit Edit 服務頁](https://www.eag.com/services/engineering/fib-circuit-edit-debug/)，未標示 | 編修操作四大類：金屬沉積、介電質沉積、蝕刻（含材料特定化學增強）、離子束成像導航；需 CAD 導航系統定位次表面特徵 | 「single digit nanometer scale」為行銷聲稱，未定義所指 |
| <span id="e10"></span>E10 | [Power Systems Design：FIB Circuit Edit Improves Power Device Design](https://www.powersystemsdesign.com/articles/focused-ion-beam-circuit-edit-improves-power-device-design/37/6546)，2014-02-17 | 用途分兩階段：試產前探索與驗證設計變更；量產除錯階段把修法複製到「a handful or tens of devices」供內部與客戶驗證 | 幾十顆遠低於量產規模；2014 年的節點數字不可直接套用到今日 |
| <span id="e11"></span>E11 | [ISTFA 2016 摘要：Measuring the Effect of FIB Diffusion Exposure/Damage](https://dl.asminternational.org/istfa/proceedings-abstract/ISTFA2016/81368/391/12102)，2016 | 矽基板約 1–2 µm 時元件不受影響；薄到 100 nm 等級時於環形振盪器觀察到可量測電性效應 | **僅讀到摘要**，未取得全文方法學；不可推廣到所有節點與元件 |
| <span id="e12"></span>E12 | [Höflich et al.：Roadmap for focused ion beam technologies](https://arxiv.org/abs/2305.19631)，arXiv 預印本，2023-05-31 提交／2023-10-06 定稿 | Ga FIB 原為光罩修補而生；LMIS 的 Taylor cone 機制；Xe⁺ 電漿 FIB 與 Ga-LMIS 的束流／亮度分工；氣體輔助沉積與蝕刻機制；再沉積是已知且需建模的現象 | 泛用 FIB 路線圖，未針對 circuit edit 的電阻率或 endpoint 問題 |
| <span id="e13"></span>E13 | [Oxford Instruments：Ion Beam Deposition](https://plasma.oxinst.com/technology/ion-beam-deposition)，未標示 | 離子束輔助沉積的一般特性 | **這是靶材濺射式 IBD，與編修現場的氣體前驅物沉積（FIBID）機制不同**，僅作背景概念 |
| <span id="e14"></span>E14 | [University of Oxford Physics：Focused ion beam 設施頁](https://www.physics.ox.ac.uk/about-us/our-facilities-and-services/nanofabrication-and-electron-microscopy/focused-ion-beam)，未標示 | 白金、鎢與絕緣層的局部沉積，以及針對含碳物種與絕緣材料的選擇性銑削 | 通用奈米製造設施頁，非 circuit edit 專屬 |
| <span id="e15"></span>E15 | [SemiAnalysis：The Dark Side Of The Semiconductor Design Renaissance](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)，2022-07-24 | mask set 成本量級：90–45 nm 數十萬美元、28 nm 逾 100 萬、7 nm 逾 1,000 萬、3 nm 逼近 4,000 萬美元；先進節點微影層數可逾 60 層 | **產業分析師估算，非晶圓廠或光罩廠官方揭露**；指的是全新完整 mask set，不是單次 respin |
| <span id="e16"></span>E16 | [SemiWiki 論壇：Masks for photo-lithography: what price?](https://semiwiki.com/forum/threads/masks-for-photo-lithography-what-price.19000/)，留言約 2023-10 至 2023-11 | 業界對單片光罩價格的估計彼此相差數倍，說明缺乏單一權威數字 | 論壇留言，非同儕審查；不可挑單一數字當定論 |
| <span id="e17"></span>E17 | [VLSI Universe：How Metal ECOs are done](https://vlsiuniverse.blogspot.com/2013/09/how-metal-ecos-are-done.html)，2013-09 | metal-only ECO 的前提是設計時預留足量 spare cell；完整重新投片約需 100 片光罩，metal-only 通常只需 2–4 片 | **非機構部落格**，未指明節點，精確度存疑；原文未談 FIB，與編修的銜接是本書推論 |
| <span id="e18"></span>E18 | [AnySilicon：FIB Circuit Edit](https://anysilicon.com/fib-circuit-edit/)，未標示 | 切線與接線為兩個基本動作；背面編修是基板減薄＋雷射輔助前處理＋FIB 銑削的組合；操作原則是單一晶片上編修次數盡量少 | 未標作者與日期，無任何量化數據 |

## 五、技術來源：症狀可重現 {#symptom}

完整摘錄見 `data/matek/symptom-sources.md`。

| ID | 一手來源與日期 | 支持範圍 | 限制 |
|---|---|---|---|
| <span id="s1"></span>S1 | [Semitracks：IDDQ Testing](https://www.semitracks.com/reference-material/failure-and-yield-analysis/failure-analysis-electrical/iddq-testing.php)，未標示 | Curve trace 確認症狀；socket 後先做 continuity；破壞步驟後重測 | 偏 CMOS IDDQ；無 NTF 統計 |
| <span id="s2"></span>S2 | [Semitracks：Leakage Curve Test](https://www.semitracks.com/reference-material/failure-and-yield-analysis/failure-analysis-electrical/leakage-curve-test.php)，未標示 | Bench curve trace 補足或暫代 ATE | 未直接討論 socket 氧化 |
| <span id="s3"></span>S3 | [Semitracks：Signal Tracing](https://www.semitracks.com/reference-material/failure-and-yield-analysis/failure-analysis-die-level/signal-tracing.php)，未標示 | 對照 IC、同一電性狀態；探針可能損傷樣品 | 未用 known-good 商業用語 |
| <span id="s4"></span>S4 | [Semitracks Electrical Analysis 課程導言](https://learn.semitracks.com/course/index.php?categoryid=2)，未標示 | 先重現電性失效模式，再簡化測試 | 目錄導言，非論文 |
| <span id="s5"></span>S5 | [Semitracks：Curve Tracer 課程](https://www.semitracks.com/online-training/online-courses/curve-tracer.php)，未標示 | FA 常從 curve tracer 開始釐清 failure mode | 課程介紹語氣 |
| <span id="s6"></span>S6 | [ZVEI：Schadteilanalyse Feld（PDF）](https://www.zvei.org/fileadmin/user_upload/Presse_und_Medien/Publikationen/2014/februar/Schadteilanalyse_Feld_in_der_Elektronik-Lieferkette/2014-02_Schadteilanalyse_Feld_in_der_Elektronik-Lieferkette.pdf)，2014-02 | **元件級 NTF** 定義與案例：ATE 全過後，客戶板或溫度掃描才改變結案 | 汽車供應鏈指引，**與閎康無關**；無產業比例 |
| <span id="s7"></span>S7 | [Marvin Test：IC Test Socket Contamination](https://www.marvintest.com/KnowledgeBase/KBSearchArticles.aspx?ID=240&task=go&search=&type=OR)，2013-04-25／更新 2021-06-01 | Socket 氧化與微粒造成接觸電阻、間歇失效 | 生產測試場景，不是 FA 探針台；與閎康無關 |
| <span id="s8"></span>S8 | [ICE：Curve Tracing FA](https://icenginc.com/failure-analysis-services-level-1/electrical-characterization-curve-tracing-services/)，未標示 | Known-good 對照；非破壞篩選 | 服務商行銷頁；與閎康無關 |
| <span id="s14"></span>S14 | [Hamamatsu DualPHEMOS-X 規格書](https://www.hamamatsu.com/content/dam/hamamatsu-photonics/sites/documents/99_SALES_LIBRARY/sys/SSMS0065E_DualPHEMOS-X.pdf)，型錄未標單一日期 | DALS：電壓–頻率邊界下的 pass/fail、marginal defect | 設備商文件；與閎康無關 |

## 六、技術來源：改版與 ECO {#respin}

完整摘錄與成本口徑表見 `data/matek/respin-sources.md`。衝突的光罩成本數字**並列、不調和**，正文見[第 09 章](09-validation-and-respin.md)。

| ID | 一手來源與日期 | 支持範圍 | 限制 |
|---|---|---|---|
| <span id="r1"></span>R1 | [Synopsys：Functional ECO](https://www.synopsys.com/glossary/what-is-functional-eco.html)，2020-10-05 | 閘級補丁，避免整條實作重跑 | 未定義 spare／metal-only 片數 |
| <span id="r2"></span>R2 | [Cadence Conformal ECO Designer](https://www.cadence.com/en_US/home/resources/datasheets/conformal-eco-designer-ds.html)，未標示 | Post-mask metal-only 依賴 spare gates | 產品頁，無美元 |
| <span id="r3"></span>R3 | [Siemens Aprisa：metal ECO](https://blogs.sw.siemens.com/aprisa/2022/04/26/a-cure-for-eco-headaches-aprisa-automates-metal-eco/)，2022-04-26 | FEOL 凍結、只改金屬；spare／GA filler | 無價目 |
| <span id="r4"></span>R4 | [NXP／Design-Reuse：Mask Programmable cells](https://www.design-reuse.com/article/60791-metal-eco-implementation-using-mask-programmable-cells)，2015-12-14 | Metal ECO 避免 all-layer；contact 層可能仍要動 | 「save millions」無對照表 |
| <span id="r5"></span>R5 | [STMicro：Optimizing ECO Efficiency（PDF）](https://designthesolution.org/wp-content/uploads/2025/09/optimizing-eco-efficiency-and-precision-galotta.pdf)，簡報路徑含 2024-12 | Spare 約 3–5%；不足則 metal-only 不可行；矽上驗證案例 | 成本「millions vs tens of thousands」為轉引 |
| <span id="r6"></span>R6 | [Cadence／Ethertronics 新聞稿](https://www.chipestimate.com/Ethertronics-Reduces-Design-Schedule-by-Half-and-Achieves-More-than-60-Percent-Mask-Cost-Savings-Using-Cadence-Conformal-ECO-Designer/Cadence/news/35568)，2016-03-22 | 單一客戶相對節省時程與光罩成本比例 | 無絕對美元、無節點 |
| <span id="r7"></span>R7 | [SemiconductorX：Photomasks](https://semiconductorx.com/semiconductor-photomasks.html)，站內約 2026-04 | 完整 mask set 片數與成本彙整表 | 非晶圓廠價目 |
| <span id="r8"></span>R8 | [SemiEngineering：Photomasks 座談](https://semiengineering.com/disruptive-changes-ahead-for-photomasks/)，2025-06-25 | 完整 set 千萬美元量級的專家口述 | 口述 ≠ 報價 |
| <span id="r9"></span>R9 | [SemiEngineering：Legacy nodes](https://semiengineering.com/legacy-process-nodes-going-strong/)，2024-07-23 | UMC 主管口述 5／7 nm 約 300–500 萬 | 與 E15／R7／R8 衝突，並列 |
| <span id="r10"></span>R10 | [SemiAnalysis EDA Primer](https://newsletter.semianalysis.com/p/the-eda-primer-from-rtl-to-silicon)，2026-05-12 | FIB 驗證下一版 stepping；functional vs timing ECO；8–12 週到第一批矽 | 分析師敘述 |
| <span id="r11"></span>R11 | [SemiEngineering：eBeam mask survey](https://semiengineering.com/survey-mask-complexity-to-increase/)，2015-09-29 | 完整 set 片數隨節點上升 | 2015 年資料 |
| <span id="r12"></span>R12 | [TI：Reliability testing](https://www.ti.com/support-quality/reliability/reliability-testing.html)，未標示 | HTOL＝JESD22-A108；功能通過 ≠ 資格完整 | 未對 FIB 樣品 |
| <span id="r13"></span>R13 | [Wikipedia：HTOL](https://en.wikipedia.org/wiki/High-temperature_operating_life)，持續更新 | HTOL 定義、樣本與時程量級 | 百科非標準本文 |
| <span id="r14"></span>R14 | [Cirrus：Reliability and Qualification](https://www.cirrus.com/company/quality/product-development/reliability-qualification)，未標示 | 應力後仍要過同一套電性／功能測試 | 公司資格摘要 |
| <span id="r15"></span>R15 | [ISTFA 2020 摘要：FIB 改 FinFET 驅動力](https://dl.asminternational.org/istfa/article/doi/10.31399/asm.cp.istfa2020p0122/15416/FinFET-Transistor-Output-Drive-Performance)，2020-12-01 | FIB 通過後「有信心進入改版光罩」 | **僅摘要**，全文未讀 |

## 七、未取得全文的來源與證據邊界

以下項目在本次查核中確實嘗試開啟，但受付費牆、403 或檔案限制而未取得全文。本書因此**沒有**使用其中任何具體數字：

- FIB 沉積鎢／白金通孔電阻率與機制的學術論文（SpringerLink、ResearchGate、JVSTB 各一篇）——403 或需登入。
- 鎵污染在矽中的動態模擬與原子探針實驗論文（ScienceDirect）——403。
- 光譜式光輻射顯微與 IDDQ 失效分析的兩篇 ScienceDirect 論文，以及美國專利 US 6,040,907 全文——未能取得逐字出處，因此「hot spot 是症狀而非失效本身」這句常被引用的話，本書**不以引號形式使用**。
- IEEE《Understanding Soft Defect Localization set-points for reducing cause-not-founds in integrated circuits》——僅能引用標題，證實該研究方向存在，摘要與結論未採用。
- Thermo Fisher 先進封裝失效分析白皮書 PDF（檔案過大）、Nordson／Sonoscan 的 SAM 應用筆記、Hitachi High-Tech 的 BIB 部落格——403 或無法讀取，因此 SAT／CT 的原廠一手覆蓋並不完整。
- 閎康官網年報頁仍無真實 PDF（`file.domain.com.tw` 為無效網域）。**113 年年報改由證交所電子書取得**，見 [C24](#c24)。114／115 年報未精讀。
- 公開資訊觀測站（MOPS）重大訊息**網頁原件**本次仍未直接開啟；上海處分案以中央社／Yahoo 轉載欄位（[C25](#c25)）與官網新聞（[C16](#c16)）並列，不調和。
- IEEE ITC 的 ASIC 層級 NTF 全文、ISTFA SDL 全文、JEDEC JEP-134 全文、ISTFA 2020 FIB 編修全文：未取得，不引用其中數字。

搜尋結果摘要、未開啟的 PDF 區段與未讀的論文全文，一律不列為已核對論點。

## 八、教學模型

[第 10 章](10-analysis-economics.md)的算例由 `plan/matek/analysis_value.py` 產生，可重新執行核對。模型參數全部是本書自訂的教學假設，**不是閎康或任何公司的報價、成本或成功率**；它比較的是期望成本與期望週期，不能取代品質放行資格與可靠度判定。

---

[← 回到全書地圖](00-map.md)
