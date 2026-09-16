# 來源索引：每份資料能證明到哪裡

原版來源查閱日為 **2026-09-14**；失效處置增修另列 **2026-09-16** 的查閱範圍，未重查的原資料保留舊日期。發布日不明就寫未標示，不拿查閱日代替。公司來源是第一手陳述，仍不表示每個市場預測或性能主張都已被獨立驗證；技術供應商的案例也不能移植成昇陽實績。

## 公司來源

### C0 公司首頁 {#c0}

[昇陽國際半導體官網](https://www.psi.com.tw/)。頁面未標統一發布日，動態訊息各有日期。用途：公司身分與公開事業定位；排名與領先語句須保留公司自述層級。

### C1 晶圓加工 {#c1}

[公司晶圓加工頁](https://www.psi.com.tw/wafer.asp)。發布日未標示。用途：再生加工與全新測試晶圓的交付差異及公開服務範圍。限制：不是完整客戶允收規範，也不提供逐用途加工費或回貨率。

### C2 晶圓薄化 {#c2}

[公司薄化頁](https://www.psi.com.tw/wafer2.asp?set=a)。發布日未標示。用途：薄化與相關加工／測試服務範圍。限制：服務清單不表示每種工件採同流程，更不等於特定客戶量產訂單。

### C3 主要股東 {#c3}

[主要股東表](https://www.psi.com.tw/stockholder.asp)。資料基準日 2026-03-23。用途：該日股東身分與列示持股。限制：不能推定今天未變，也不能單憑持股指認設備交易。

### I1 2026 年第二季法人說明會 {#i1}

[2026-05-25 版簡報](https://www.psi.com.tw/company/2026年第二季法人說明會_20260525_中文版.pdf)；[法說索引](https://www.psi.com.tw/share_news2.asp)。32 頁；再生與品質／產能見印刷頁 10–16，薄化 18–21，先進材料 23–24，財務 26–27。引用時按原始頁碼及資料期間辨識，不把法說季度名稱當作財報期間。

用途：公司對業務、需求與規劃的說明。市場趨勢、未來產能和產品組合目標，保留估計或規劃性質；未取得原始統計方法的圖，不用作精確收入推算係數。

### A1 114 年度年報 {#a1}

[114 年度股東會年報](https://www.psi.com.tw/company/114年度股東會年報.pdf)；[公司發布入口](https://www.psi.com.tw/share_info.asp?y=2026)。涵蓋 2025 年度，刊印日 2026-03-31。PDF 共 102 頁，業務與市場主要見印刷頁 62–78，財務／風險見 89–96；PDF 頁序與印刷頁碼須分開。

用途：業務輪廓與年度營運背景。年報中的目標不因查閱時已到 2026 年下半年，就自動成為已實現結果。

### F1 財務原檔與索引 {#f1}

[公司財務報表索引](https://www.psi.com.tw/report.asp)。索引本身不等於所有期間都已完整閱讀；正文使用數字時另外寫明報告期間、單位與來源定位。沒有業務別資料，不能用總公司結果倒推單項產品毛利。

本次另讀 [TWSE 綜合損益 OpenAPI](https://openapi.twse.com.tw/v1/opendata/t187ap06_L_ci)、[資產負債 OpenAPI](https://openapi.twse.com.tw/v1/opendata/t187ap07_L_ci)及 [8028 公司資料 PDF](https://wwwc.twse.com.tw/pdf/ch/8028_ch.pdf)。以年度 115、季別 2、公司代號 8028 定位；損益為 2026-01-01 至 2026-06-30 累計，資產負債為期末存量。官方資料出表日 2026-09-14，這不是會計期間終日。官網財報索引當日仍只列到 Q1，因此未以該索引代替完整時效查核。

### N1 設備取得公告鏡錄 {#n1}

[MoneyDJ 公司公告鏡錄](https://www.moneydj.com/KMDJ/news/newsviewer.aspx?a=225ccd97-7f47-49ab-864e-06c876e264f1)，公告 2025-08-05，事實期間 2024-10-04 至 2025-08-05。內容為機器設備一批、5.51 億元、對手均豪，公告列非關係人。原始申報機關為 MOPS；本次直讀受安全驗證阻擋，故不稱為已讀原件。第 10 章據鏡錄做有界判讀，設備型號、安裝與客戶認證仍未知。

## 技術來源 {#technical}

以下皆已實際開啟來源；網頁未標發布日者明列。詳細摘錄與適用限制保存在 `plan/psi/research/technical-sources.md`。

| ID | 原始來源與日期 | 支持章節／範圍 | 限制 |
|---|---|---|---|
| T1a | [Philtech Test Wafers](https://www.philtech.co.jp/en/testwafer/)，未標發布日 | 01：測試工件的用途、膜層與圖案可不同 | 單一供應商命名，不是所有 fab 統一術語 |
| T1b | [SVM Polishing & Reclaim](https://svmi.com/service/polishing-and-reclaim/)，未標發布日 | 01、02、04：進料分類、依條件再生及厚度限制 | 所述可再生次數不是昇陽保證 |
| T1c | [Pure Wafer Reclaim](https://purewafer.com/wafer-reclaim/)，未標發布日 | 02、03、05：再生流程與多項品質指標 | 公開能力表不是跨公司通用允收值 |
| T2a | [Lam Strip & Clean](https://www.lamresearch.com/products/our-processes/strip-clean/)，未標發布日 | 02：去膜、污染、位置與清洗功能 | 不提供昇陽配方 |
| T2b | [Entegris Wet Etch and Clean](https://www.entegris.com/en/home/our-science/by-industry/microelectronics/semiconductor/wet-etch-clean.html)，未標發布日 | 02：移除、表面與污染控制 | 方案總覽，不能拼成所有晶圓必經流程 |
| T2c | [Applied Materials Opta CMP](https://www.appliedmaterials.com/us/en/product-library/opta-cmp.html)，未標發布日 | 02：平坦化、均勻度與清洗不同控制目標 | 產品平台介紹，不是再生服務規格 |
| T3a | [KLA Wafer Metrology](https://www.kla.com/products/wafer-manufacturing/wafer-metrology)，未標發布日 | 03：厚度、TTV、形貌等分項量測 | 未公開完整 recipe 與允收門檻 |
| T3b | [KOBELCO LEO 幾何量測](https://www.kobelcokaken.co.jp/leo/en/item/sbw/)，發布日未標示 | 03：bow、warp 與厚度差的概念和量測狀態 | 頁尾年份不是發布日期，方法仍須查具體規範 |
| T3c | [KLA Surfscan SP2XP 公告](https://ir.kla.com/news-events/press-releases/detail/312/kla-tencor-introduces-new-surfscan-sp2xp-monitor-wafer)，2008-09-04 | 03：表面缺陷光學檢查與分類 | 歷史設備例，不把其靈敏度當現今規格 |
| T3d | [Rigaku TXRF](https://rigaku.com/products/semiconductor-metrology/txrf)，未標發布日 | 03：表面元素污染分析 | 不是顆粒計數，也不等於所有體污染皆可檢出 |
| T4a | [DISCO TAIKO Process](https://www.disco.co.jp/eg/solution/library/grinder/taiko_process.html)，未標發布日 | 06：保留外環的薄化方法 | 非昇陽具名客戶或量產證據 |
| T4b | [DISCO Ultra-Thin Grinding](https://www.disco.co.jp/eg/solution/library/grinder/thin.html)，未標發布日 | 06：薄化、損傷與搬運風險 | 極限厚度案例不當通用規格 |
| T4c | [DISCO SiC Device Wafers](https://athqga01.disco.co.jp/eg/solution/library/grinder/sic.html)，未標發布日 | 06：垂直功率元件基材電阻與薄化取捨 | 不推廣到所有材料與元件 |
| T4d | [DISCO Tech Briefing 2025](https://www-hq.disco.co.jp/jp/ir/movie/doc/E_Tech_Briefing_2025.pdf)，2025-12 | 02、06：印刷頁 7–10／16，加工與拋光有條件分支 | 原廠應用介紹；不是特定客戶流程 |

### T5 材料與熱傳條件 {#t5}

[Nordson Thermal Compound Selection Guide](https://www.nordson.com/en/divisions/efd/resources/thermal-compound-selection-guide)與 [Dow TC-5960 產品頁](https://www.dow.com/en-us/pdp.dowsil-tc-5960-thermally-conductive-compound.523942z.html)，均未標發布日。已讀熱傳、接合層厚度／接觸條件與產品性能欄位，支持 07 章「物性不等於系統表現」。不代表昇陽使用或供應這些材料。

## 未取得全文的標準與證據邊界

[SEMI 3D4-0924 官方摘要](https://store-us.semi.org/products/3d00400-semi-3d4-guide-for-metrology-for-measuring-thickness-total-thickness-variation-ttv-bow-warp-sori-and-flatness-of-bonded-wafer-stacks)僅作量測方法範圍的入口；完整標準未取得，不宣稱本書工件符合該標準。[SEMI Document 6091](https://downloads.semi.org/web/wstdsbal.nsf/0/ca03ccbf4225ad42882580c700369d87/$FILE/6091.pdf)為 2017-02-09 的公開草案，頁 27 用途分類只作歷史用語參照，並非正式採用標準。

既有均豪與矽格書只作教學銜接，不是公司事實的一手證據。搜尋結果摘要、未取得的公告原文、未讀的 PDF 區段，不列為已核對論點。

## 失效處置增修來源（2026-09-16） {#recovery-update}

以下為本次實際重查或新讀來源，網頁均未標統一發布日。此輪未全面更新年報、法說與財務；原版的歷史定位仍保留。

| ID | 一手來源與定位 | 本次採用範圍 | 不支持的推論 |
|---|---|---|---|
| R1 | [昇陽晶圓加工](https://www.psi.com.tw/wafer.asp)，服務介紹與主要應用；重查 C1 | 01、02、09–11：監控用途及再生／新測試晶圓的服務邊界 | 不公開逐批拒收、重工授權或客訴規則 |
| R2 | [昇陽薄化](https://www.psi.com.tw/wafer2.asp?set=a)，加工服務；重查 C2 | 06：薄化與相關加工範圍 | 不能由服務清單補出異常放行條件 |
| R3 | [SVM Polishing & Reclaim](https://svmi.com/service/polishing-and-reclaim/)，流程與處理選項；重查 T1b | 02、11：依來料分類選路徑，處理程度可以不同 | 不等於每種殘留都可重工；不是昇陽配方 |
| R4 | [NanoSILICON](https://nanosiliconinc.com/)，Reclaim Wafer Process Flow／Quality Assurance | 02：其公開說明單片失敗會觸發全批 QC 複核，必要時再做全批重工 | 不是昇陽政策，也沒揭露必要時的觸發表與次數上限 |
| R5 | [KOBELCO LEO](https://www.kobelcokaken.co.jp/leo/en/item/sbw/)，Bow/Warp and Flatness；重查 T3b | 03、11：幾何指標與量測狀態必須一起比較 | 不能僅憑指標同名就認定兩份報告可比 |
| R6 | [DISCO Ultra-Thin Grinding](https://www.disco.co.jp/eg/solution/library/grinder/thin.html)，薄化、強度與後處理；重查 T4b | 06：材料移除與損傷風險；再拋光不能補回已移除厚度是工程推論 | 不等於所有薄化異常只能報廢 |

三個處置案例與跨章排查表是依上述範圍建立的教學推理，不是公開真實案件；沒有將未取得的內部規格填成數字。研究曾查看的其他業者、歷史資料及候選來源，不因被蒐集就自動成為正文證據。

## 教學模型

04 與 08 的數字為原創假設。`plan/psi/reuse_model.py` 保留有限輪次模型、獨立事件樹核對、邊界測試與月度產能基準；完整參數與結果見 `plan/psi/research/model-results.md`。模型支持的是條件推理，不預測昇陽財務。
