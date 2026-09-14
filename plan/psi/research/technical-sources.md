# PSI 技術來源研究筆記（T1–T4）

> 研究用途：供 PSI 書計畫的 01–06 章及 09 證據矩陣使用。本檔只記錄已實際開啟的原廠／標準入口與可支持的技術論點，不是書稿正文。
>
> 查閱日期：2026-09-14（Asia/Taipei）。網頁沒有顯示發布日期時，明列「未標示」，不以查閱日代替。原廠產品頁的能力、數字與「industry-leading」等語句屬供應商自述，不能直接轉成昇陽已具備的能力或客戶允收規格。

## 研究結論先記

1. `test`、`monitor`、`dummy`、`reclaimed` 不應當作同一個分類軸。SEMI 公開草案把 `monitor` 定義為觀察製程、`dummy` 定義為調整製程條件；Philtech 的產品頁則把 test wafer 用於設備／材料開發與評估，並同時提供 bare、blanket film、patterned 與 charge-up monitor 等不同工件。也就是說，用途／run 角色與材料、膜層、圖案、是否使用過的履歷要分欄記錄。
2. 再生不是固定的「清洗一次」。Pure Wafer 與 SVM 都把進料檢查／分類、去膜或蝕刻／研磨、拋光、清洗、終檢列為流程，但兩者都明示流程依膜種、圖案、厚度、電阻率、表面狀況與客戶規格而變。書稿可以畫成決策流程，不能寫成每片晶圓都必經同一順序或同一去除量。
3. `TTV`、`bow`、`warp` 是有不同夾持狀態、參考面與資料處理的幾何量。KLA 的幾何量測頁同時列出 thickness、TTV、flatness、bow/warp、stress、edge roll-off；KOBELCO 則公開說明 TTV 是夾持狀態的厚度最大／最小差，bow／warp 是未夾持自然狀態的形狀量。任何數字都必須附量測方法、edge exclusion、夾持狀態與 wafer 形態。
4. 顆粒與金屬污染不能用同一個「清潔度」數字代替。KLA Surfscan 是以散射／多通道光學檢查表面缺陷、顆粒、刮痕、殘留物；Rigaku TXRF 與 Hitachi 的 VPD-ICPMS／VPD-TXRF 是量測表面元素／金屬污染，VPD 還涉及 HF 分解與回收液前處理。前者不等於元素分析，後者也不等於顆粒計數。
5. DISCO TAIKO 是特定背磨幾何：外周約 3 mm 留框，只研削內圈；原廠宣稱可降低薄晶圓搬送風險與翹曲、提高強度及後續加工性。薄化後是否要拋光、乾式應力釋放、濕式 CMP、乾蝕刻或 DBG，取決於材料、目標厚度、潔淨度、die strength、翹曲與後續流程；不能把 TAIKO 直接當成 PSI 已有的服務證據。

## T1：晶圓用途、角色與 reclaimed wafer

### T1-1　SEMI Document 6091（公開 letter-ballot 草案）

- 來源：SEMI，`Document 6091`，頁 27 的 `WaferType` 定義。
- 發布／文件日期：2017-02-09（PDF 內標示）；查閱：2026-09-14。
- URL：[SEMI Document 6091 PDF](https://downloads.semi.org/web/wstdsbal.nsf/0/ca03ccbf4225ad42882580c700369d87/$FILE/6091.pdf)
- 實際可支持的論點：文件把 `Product`、`Monitor`、`Dummy`、`Jig` 分開；其中 `Monitor` 是用來觀察製程的 wafer，`Dummy` 是用來調整製程條件的 wafer，`Product` 是將成為產品的 wafer。這可作為書中「用途／流程角色」分類的第一手行業語彙來源。
- 限制：這是 SEMI International Standards program 的 **Draft Document**，PDF 自己聲明不是 official or adopted Standard，也不是安全指南；不可寫成現行 SEMI 標準的正式定義。文件沒有給出各角色的厚度、粒子、金屬或電阻率允收值，也沒有規定 reclaimed wafer 的加工歷史。

### T1-2　Philtech：Test Wafers

- 來源：Philtech Inc.，測試晶圓製造商產品頁。
- 發布日期：未標示；查閱：2026-09-14。
- URL：[Philtech Test Wafers](https://www.philtech.co.jp/en/testwafer/)
- 實際可支持的論點：Philtech 將 test wafer（頁面稱也可叫 TEG wafer 或 dummy wafer）用於設備與材料的 development/evaluation，並說明可從 bare wafer 做到 highly processed patterned wafer。產品清單把 charge-up monitor、trench pattern、hole pattern、poly-Si pattern、CMP evaluation wafer 分開，展示「test」可以是用途集合，不代表單一材料狀態。頁面也指出 CMP evaluation wafer 用於 CMP 設備與 slurry 評估，charge-up monitor 用於 plasma 設備的 charge-up damage 評估。
- 限制：這是單一供應商的產品命名與供應範圍；「test wafer 也叫 dummy」不是普遍強制同義規則，不能取代客戶／廠內的 wafer type、膜層與 recipe 定義。頁面沒有提供 reclaimed wafer 的回用資格或完整允收規格。

### T1-3　Pure Wafer：Glossary

- 來源：Pure Wafer，晶圓再生／薄膜服務商公開術語表。
- 發布日期：未標示；查閱：2026-09-14。
- URL：[Pure Wafer Glossary](https://purewafer.com/glossary/)
- 實際可支持的論點：頁面將 `Test Wafer` 定義為製造中用於 monitoring and testing 的 silicon wafer；另列 `Mechanical Test Wafer`、`Process Test Wafer`、`Particle Counting`、`Premium Wafer` 等術語。`Premium Wafer` 的用途例包含 particle counting、光刻圖形解析度量測與 metal contamination monitoring；`Particle Counting` 是用來測試設備粒子污染的 wafers。這支持「test／monitor 是用途與規格組合，不能只用外觀或是否裸片判斷」的教學表述。
- 限制：這是公司 glossary，不是 SEMI 標準全文，也沒有對每個 grade 給出客戶允收數字。Glossary 的用途例不能推成所有 fab 的統一分類，也不能推定昇陽供應的每種測試晶圓都符合這些 grade。

### T1-4　Silicon Valley Microelectronics（SVM）：Polishing & Reclaim

- 來源：Silicon Valley Microelectronics，晶圓拋光／再生服務頁。
- 發布日期：未標示（頁尾版權顯示 2011–2026）；查閱：2026-09-14。
- URL：[SVM Wafer Polishing & Reclaim](https://svmi.com/service/polishing-and-reclaim/)
- 實際可支持的論點：SVM 說明半導體 fab 使用過的 silicon wafer 可以 re-polish/reclaim 後作為 test wafer 再利用；再生次數取決於 silicon removal rate，頁面以「最多五次」作為其服務說法。進料先依厚度、類型、電阻率檢查／分類，再依膜種、圖案和進料狀況選擇 lapping 或 etching，之後可做 SSP 或 DSP、清洗、含 particle inspection 的 final inspection，最後以 clean cassette、雙袋包裝出貨。這是「加工履歷」和「用途」必須分開記錄的直接案例。
- 限制：最多五次是 SVM 的一般服務說法，不是跨材料、尺寸、膜種和客戶規格的保證；頁面沒有給出所有客戶的厚度下限、金屬上限或回廠 qualification。不能用「再生五次」作為 PSI 的通用能力或經濟模型參數。

### T1-5　Pure Wafer：Wafer Reclaim 與 Company Overview

- 來源：Pure Wafer，晶圓再生產品頁／公司技術概述。
- 發布日期：未標示；查閱：2026-09-14。
- URL：[Pure Wafer Wafer Reclaim](https://purewafer.com/wafer-reclaim/)；[Pure Wafer Company Overview](https://purewafer.com/overview/)
- 實際可支持的論點：Pure Wafer 描述再生流程包含詳細 inspection and sorting、lapping and etching、polishing、cleaning、final inspection，最後以污染控制的 cassette、雙袋及 yield documentation 出貨；能力表列出 100–300 mm、TTV `< 1 µm`、金屬 `< 1E10/CM2`、LPD 19／26 nm defect counts，以及 strip、etch、lapping、polish、clean 等服務。公司概述另說明多輪再生後 wafer 會逐漸變薄並在需要時替換。這可支持「再生要把履歷、去除量、檢查與 replacement wafer 一起看」的流程敘述。
- 限制：能力表是 Pure Wafer 自己的產品能力／標示；頁面沒有公開每一項指標的量測標準、取樣、edge exclusion、膜種條件、客戶允收規格或良率。不得把 `<1 µm`、`<1E10/cm²` 或 19／26 nm 寫成 SEMI 通用標準，也不能寫成昇陽實績。

## T2：去膜、蝕刻、研磨、CMP、清洗與流程條件

### T2-1　Lam Research：Strip & Clean

- 來源：Lam Research，strip／wet clean／plasma bevel clean 原廠流程頁。
- 發布日期：未標示；查閱：2026-09-14。
- URL：[Lam Strip & Clean Products](https://www.lamresearch.com/products/our-processes/strip-clean/?highlight=electro+etch+machine)
- 實際可支持的論點：Lam 說明 strip and clean 是在製程步驟間移除會造成缺陷的 unwanted material，並準備後續表面；photoresist strip 用於 ion implant 或 etch 後移除 photoresist 與 residue，清洗步驟則處理 particles、contaminants、residues。頁面也把 wet processing 用於 clean、strip、etch，plasma bevel clean 用於 wafer edge 的 unwanted material。這支持「去膜與清洗目標由來料、污染種類和位置決定」以及「不能把所有去膜寫成一個固定化學步驟」。
- 限制：Lam 的頁面是設備／產品能力介紹，不是 reclaimed wafer 的完整 recipe 或客戶允收規格；它沒有告訴讀者特定 PSI 來料應使用哪一種化學、溫度、時間或是否必須加 plasma bevel clean。

### T2-2　Entegris：Wet Etch and Clean

- 來源：Entegris，wet etch／clean 與污染控制方案頁。
- 發布日期：未標示；查閱：2026-09-14。
- URL：[Entegris Wet Etch and Clean](https://www.entegris.com/en/home/our-science/by-industry/microelectronics/semiconductor/wet-etch-clean.html)
- 實際可支持的論點：頁面把 wet etch／clean 的控制目標列為 uniform etch rate、surface roughness，以及移除 residues、particles 和其他 contaminants；另列 post-etch residue／hard-mask removal、liquid filtration、purification、process measurement 等模組。這支持「去除量與表面形貌、污染控制要一起驗證」的工程框架。
- 限制：頁面主要是供應商解決方案總覽，沒有給出一套適用所有膜層／substrate 的化學配方，也沒有說所有 reclaim 都要使用 wet etch。書稿只能用作流程選擇條件的來源，不可擷取成固定 recipe。

### T2-3　Applied Materials：Opta CMP

- 來源：Applied Materials，CMP 原廠平台頁。
- 發布日期：未標示；查閱：2026-09-14。
- URL：[Applied Materials Opta CMP](https://www.appliedmaterials.com/us/en/product-library/opta-cmp.html)
- 實際可支持的論點：Applied 將 CMP 的工程目標描述為更緊的 planarization、更低 defectivity 與更強 within-wafer／wafer-to-wafer uniformity；Opta 支援 metal 與 non-metal CMP，並整合多個 cleaning modules，另以 cleaning／rinsing 改善 defectivity。這支持 CMP 的工作不只「洗乾淨」，而是移除材料、整平／控制均勻度，再處理清洗與缺陷。
- 限制：Opta 是晶片製造 CMP 平台介紹，未直接描述 PSI 的 reclaimed bare wafer 流程；產品頁的效能詞彙不是客戶允收標準，也不支持特定材料或污染能被一次 CMP 移除的結論。

### T2-4　Entegris：Post-CMP cleaning

- 來源：Entegris 2016-01-26 官方新聞稿，PlanarClean AG post-CMP cleaning。
- 發布日期：2016-01-26；查閱：2026-09-14。
- URL：[Entegris Announces New Post-CMP Cleaning Solutions](https://www.entegris.com/en/home/about-us/news/news012616.html)
- 實際可支持的論點：Entegris 說明 CMP 以化學 slurry 加機械拋光移除導電或介電材料、建立平坦表面；post-CMP clean 則移除 nanoparticles，以降低 wafer defect 並維持既有薄膜完整性。它還指出不同 exposed films／slurry particle 會使傳統 cleaner 的效果不同，因此需要配方化清洗。這可支持「拋光和後清洗是不同控制問題」以及「膜種會改變清洗路線」。
- 限制：這是 Entegris 特定產品在先進 FEOL／CMP 的供應商資料，且產品／客戶評估條件未公開。不可把它當成任何 reclaimed wafer 的通用化學流程或實際回貨規格。

### T2-5　DISCO：Grinding 與 polishing 的條件差異

- 來源：DISCO `Tech Briefing 2025`，頁 7–10／16。
- 發布日期：2025-12（PDF 封面）；查閱：2026-09-14。
- URL：[DISCO Tech Briefing 2025 PDF](https://www-hq.disco.co.jp/jp/ir/movie/doc/E_Tech_Briefing_2025.pdf)
- 實際可支持的論點：DISCO 把 grinding（Kezuru）說成 volume removal，把 polishing（Migaku）說成改善 grinding 後的 surface condition，例如 roughness 與 grinding damage；若 grinding 後表面已足夠，polishing 可以不做。頁面列 dry polishing、wet polishing（CMP）、dry etching，並說 optimal method 依 required cleanliness 與 die strength 選擇。這是「流程有條件分支，不應畫成必經固定鏈」的原廠來源。
- 限制：簡報面向 DISCO 設備／應用介紹；其中示例不是 PSI 的 recipe 或實際交付數據。文件另明示不同半導體廠製程屬機密，DISCO 原則上不回答特定客戶的 order、throughput 或 equipment specification；因此不能拿它推定昇陽的服務站點或客戶流程。

## T3：TTV、bow、warp、顆粒與金屬污染量測

### T3-1　KLA：Wafer geometry metrology

- 來源：KLA，Wafer Manufacturing／Metrology 原廠產品總覽。
- 發布日期：未標示（頁尾版權 2026）；查閱：2026-09-14。
- URL：[KLA Metrology – Wafer Manufacturing](https://www.kla.com/products/wafer-manufacturing/wafer-metrology)
- 實際可支持的論點：KLA 將 wafer geometry 系統的輸出分開列為 thickness、flatness、bow/warp、dual-sided nanotopography、stress、edge roll-off；MicroSense 系列明列 thickness、total thickness variation、flatness、bow/warp、P/N type、resistivity，並可產生 full-wafer 2D／3D maps。這支持書中把 TTV、形狀、平面度和邊緣輪廓分欄，並要求交代 map／取樣而非只給一個「平坦度」數字。
- 限制：頁面沒有公開每個 metric 的完整定義、夾持狀態、edge exclusion、掃描 recipe 或客戶規格；也沒有說不同廠的同名數值可直接互比。`SEMI standard metrics` 的字樣只支持「依標準化 metric 輸出」，不能由此宣稱某一 wafer 已符合 SEMI。

### T3-2　KOBELCO LEO：公開幾何量定義與測量狀態

- 來源：KOBELCO Research Institute LEO，wafer flatness/profile measurement system。
- 發布日期：2019（頁尾版權）；查閱：2026-09-14。
- URL：[KOBELCO LEO Flatness／Profile Measurement](https://www.kobelcokaken.co.jp/leo/en/item/sbw/)
- 實際可支持的論點：頁面說 bow／warp 是 wafer 在未真空吸附的自然狀態下的 shape 參數；bow 是未夾持 wafer 中心相對 best-fit plane 的距離，warp 是相對該參考面的最大正／負偏差總和；GBIR（頁面括號標 TTV）是夾持 wafer 時厚度最大值與最小值的差。這可作為讀者理解「TTV 不等於 bow／warp」以及「夾持條件會改變量測意義」的公開工程定義來源。
- 限制：KOBELCO 是量測設備／服務供應商頁，術語中的參考面、edge exclusion、取樣點仍可能依 SEMI test method、設備 recipe 或客戶規格不同；頁面不取代付費 SEMI 標準，也不提供 reclaimed wafer 的 acceptance limit。

### T3-3　SEMI 3D4-0924：標準入口與方法限制

- 來源：SEMI 官方商店，`SEMI 3D4-0924` 現行版頁面。
- 發布／修訂日期：現行版代號為 3D4-0924；頁面未另列發布日；查閱：2026-09-14。
- URL：[SEMI 3D4-0924 product page](https://store-us.semi.org/products/3d00400-semi-3d4-guide-for-metrology-for-measuring-thickness-total-thickness-variation-ttv-bow-warp-sori-and-flatness-of-bonded-wafer-stacks)
- 實際可支持的論點：官方摘要說明 TTV、bow、warp/sori、flatness 對 bonded wafer stack 的 thinning quality、bond uniformity、deformation 及後續 lithographic overlay／metal contact 有意義；範圍列出 IR laser profiling、white-light confocal、visible／IR interferometry、capacitance、back-pressure、acoustic microscopy 等技術，並列出單晶圓量測相關的 `SEMI MF533`、`MF1390`、`MF1451`。這支持「量測方法有能力與限制，要按工件與狀態選擇」的寫法。
- 限制：完整標準需購買，公開頁只有摘要；公開摘要沒有給出全部公式、取樣與允收數字。不能以此頁宣稱某件 reclaim 或 thinning wafer 已符合 SEMI 3D4，也不能把 bonded stack 指南直接套成單片 bare wafer 規格。

### T3-4　KLA：Surfscan 顆粒與缺陷分類

- 來源：KLA-Tencor（現 KLA）官方投資人新聞稿，Surfscan SP2XP。
- 發布日期：2008-09-04；查閱：2026-09-14。
- URL：[KLA Surfscan SP2XP Monitor-Wafer Defect Inspection](https://ir.kla.com/news-events/press-releases/detail/312/kla-tencor-introduces-new-surfscan-sp2xp-monitor-wafer)
- 實際可支持的論點：新聞稿描述 SP2XP 可在 silicon、poly、metal films 上檢出缺陷，並以多通道／演算法區分 particles、microscratches、voids、watermarks、residues；可對 bare wafers 及前／後段 films 做檢查。這支持「粒子檢查是表面缺陷／散射與分類問題，不是金屬元素濃度量測」以及「同一表面信號可能需要分類才知道是 particle、scratch 或 residue」。
- 限制：這是 2008 年的 SP2XP 產品公告；30 nm 等靈敏度只適用公告所述 polished-wafer／操作條件，不能移植到現代工具、不同膜層或 PSI 服務規格。KLA 的產品宣稱也不是客戶的 particle acceptance limit。

### T3-5　KLA：WaferSight 幾何量測

- 來源：KLA-Tencor 官方新聞稿，WaferSight 2。
- 發布日期：2007-12-02；查閱：2026-09-14。
- URL：[KLA WaferSight 2 Geometry Metrology](https://ir.kla.com/news-events/press-releases/detail/350/kla-tencor-introduces-complete-measurement-solution-for)
- 實際可支持的論點：KLA 將 bare wafer 的 flatness、shape、edge roll-off、nanotopography 列為不同量測能力，並說明 front／back nanotopography 可在同一次非破壞量測中取得。這可用來解釋「幾何平坦度、形狀和奈米形貌是不同輸出」，以及為何 incoming／outgoing quality control 需要指定量測項目。
- 限制：新聞稿是 45 nm 世代產品公告，不能拿當代產品數字或特定節點的 lithography margin 直接套到 PSI；其性能與應用是原廠條件下的聲明，不是 reclaimed wafer 通用驗收規格。

### T3-6　Rigaku：TXRF 表面金屬／元素污染

- 來源：Rigaku，半導體 TXRF 技術與產品頁。
- 發布日期：頁面未標示；查閱：2026-09-14。
- URL：[Rigaku TXRF for Semiconductor Metrology](https://rigaku.com/products/semiconductor-metrology/txrf)
- 實際可支持的論點：Rigaku 說 TXRF 用於 semiconductor fabrication 的 surface contamination，能以非破壞方式分析週期表 Na–U 的多數元素；全反射條件下，螢光主要來自表面污染，理論 X-ray penetration depth 約 5 nm，因此 TXRF 是 surface analysis。這支持「金屬／元素污染要使用元素分析方法，不能以光學 particle count 代替」。
- 限制：TXRF 對表面與樣品平整度、元素、校正、背景和取樣位置有條件；約 5 nm 是理論深度，不是所有設備、樣品與元素的實際 detection depth。頁面沒有給出 PSI 客戶的金屬允收值，也不能推出所有埋藏或 bulk contamination 都能同樣量到。

### T3-7　Rigaku VPD 與 Hitachi High-Tech VPD-ICPMS／TXRF

- 來源：Rigaku VPD 技術頁；Hitachi High-Tech 日本官方分析方法頁。
- 發布日期：兩頁均未標示；查閱：2026-09-14。
- URL：[Rigaku Vapor Phase Decomposition](https://rigaku.com/resources/techniques/vapor-phase-decomposition-vpd)；[Hitachi High-Tech VPD-ICPMS／TXRF](https://www.hitachi-hightech.com/jp/ja/products/semiconductor-manufacturing/others/component-analysis/se-analysis/vpd-icpms-txrf.html)
- 實際可支持的論點：Rigaku 說 VPD 先用 HF vapor 分解 wafer 表面 oxide，再以回收液收集金屬與其他污染物，乾燥後可做 TXRF；原廠稱 VPD 可在需要時提高 TXRF sensitivity（頁面寫 up to 100×）。Hitachi 的程序頁把 VPD-ICPMS 寫成回收液直接進 ICPMS／ZAA，VPD-TXRF 則把回收液在 wafer 上乾燥後再作 TXRF。這支持「金屬分析有非破壞 TXRF 與含前處理的 VPD-ICPMS／VPD-TXRF 分支」，也支持量測結果要附方法。
- 限制：VPD 涉及化學前處理，可能改變樣品狀態，不能與粒子 inspection 當同一測試；「up to 100×」是 Rigaku 產品／技術說法，不能當所有元素與樣品的保證。公開頁未給出昇陽的 sample recovery、blank、LOD、面積取樣或 customer limit。

### T3-8　Pure Wafer reclaim capability 表（數字只能作供應商案例）

- 來源：Pure Wafer Wafer Reclaim 頁，與 T1-5 相同。
- 發布日期：未標示；查閱：2026-09-14。
- URL：[Pure Wafer Wafer Reclaim capabilities](https://purewafer.com/wafer-reclaim/)
- 實際可支持的論點：頁面同時列出 metals `<1E10/CM2`、TTV `<1 µm`、LPD down to 19／26 nm defect counts、100% inspection of listed removable films。這可作為說明再生交付可能把金屬、厚度均勻度與局部光散射缺陷分開列為不同驗收欄位的供應商案例。
- 限制：頁面未交代 metal 測量是 TXRF、VPD 或其他方法，未交代 LPD 的 PSL／粒徑、掃描面積、edge exclusion、TTV 公式和 sample condition；所有數字應標註「Pure Wafer 公開能力表」，不能寫成行業標準或 PSI 事實。

## T4：DISCO TAIKO、背磨與薄化服務

### T4-1　DISCO：TAIKO Process

- 來源：DISCO Corporation，TAIKO 原廠技術頁。
- 發布日期：未標示；查閱：2026-09-14。
- URL：[DISCO TAIKO Process](https://www.disco.co.jp/eg/solution/library/grinder/taiko_process.html)
- 實際可支持的論點：TAIKO 是背面研削方法，保留 wafer 最外周約 3 mm 的 edge ring，只薄化內圈。DISCO 列出的效果包括降低 warpage、提高 wafer strength、改善 handling，以及便於 thinning 後的 through-hole／bump processing。原廠還說一體結構不需 hard substrate，因此高溫 metallization 後不會有該支撐基材的 outgassing，且形狀單純有助降低 particle introduction；不對外周施加研削負荷可降低 edge chipping。
- 限制：頁面是 DISCO 的原廠產品／應用聲明，沒有給出跨 wafer size、材料、厚度或 recipe 的 warpage／strength 統計，也沒有客戶允收規格。不能把「約 3 mm」或「zero edge chipping」寫成所有條件下的量產保證；更不能由 TAIKO 技術頁推論昇陽已提供此服務。

### T4-2　DISCO：Grinding 總覽與 SiC power device

- 來源：DISCO Grinding solutions；DISCO SiC Device Wafer 應用頁。
- 發布日期：兩頁未標示；查閱：2026-09-14。
- URL：[DISCO Grinding Solutions](https://www.disco.co.jp/eg/solution/library/grinding.html)；[DISCO Grinding of SiC Device Wafers](https://athqga01.disco.co.jp/eg/solution/library/grinder/sic.html)
- 實際可支持的論點：DISCO 說 SiC power device 常為 vertical structure，薄化可降低 substrate resistance、提高 energy conversion efficiency；但 SiC 比 Si 更 rigid、難加工，需要專用 application／wheel。其案例把 rough grinding、fine grinding、dry polishing 分開，並在 6-inch SiC、finish thickness 0.15 mm、10×10 mm die、ball-point bending test 條件下展示 dry polishing 後 die strength 顯著提升。這可支持「功率元件薄化的收益與損傷／強度風險同時存在」的教學敘述。
- 限制：SiC 案例是 DISCO 的標準參數／示範，頁面明示 die strength 會依 wafer 與 processing conditions 變化；不能把該強度差異、0.15 mm 或 vertical-device 敘述直接套到所有 Si、SiC、GaN 或昇陽客戶。頁面沒有 PSI 的材料組合、客戶認證或出貨證據。

### T4-3　DISCO：Ultra-Thin Grinding、應力釋放與 DBG

- 來源：DISCO Ultra-Thin Grinding；Dry Polishing（Stress Relief）；DBG Process。
- 發布日期：三頁未標示；查閱：2026-09-14。
- URL：[DISCO Ultra-Thin Grinding](https://www.disco.co.jp/eg/solution/library/grinder/thin.html)；[DISCO Dry Polishing Stress Relief](https://disco.co.jp/eg/solution/library/polisher/strelief.html)；[DISCO DBG Process](https://www.disco.co.jp/eg/solution/library/dbg/dbg_process.html)
- 實際可支持的論點：
  - Ultra-Thin 頁展示一個 Φ300 mm silicon wafer 以 grinding-only 做到 5 µm 的原廠案例，但同頁明確說薄化降低機械強度、使 wafer 容易 crack；edge shape 變尖、可能因 grinding water／process condition flutter 而 chipping。頁面另列以 fine wheel、dry etching 或 dry polishing 移除 grinding damage／提升 die strength 的路線。
  - Dry polishing 頁說 fine grinding 後會留 damage layer；stress relief 可提高 die strength、降低 die warpage，並以 DISCO research 的條件指出約 2 µm removal 的示範最佳點。這是條件化實驗，不是 universal optimum。
  - DBG 先 half-cut，再由背磨薄化至切口以下完成 singulation；原廠宣稱因薄 wafer 不需被搬送，wafer-level breakage 可降低，backside chipping 可減少並可得到高 die strength。
- 限制：5 µm、2 µm、300 mm 與 DBG 效果都是特定設備／輪具／材料／流程條件下的原廠例子；不可寫成每一片薄化晶圓都能做到的目標，也不能把 device wafer 的 stress relief／DBG 流程套到 reclaim test wafer。`DBG` 還改變了 singulation 的時序，應與一般「先研削、後切割」分開描述。

### T4-4　DISCO：薄化量測與製程品質的直接證據

- 來源：DISCO Technical Review `TR24-01`。
- 發布日期：2025-01-20（DISCO technical review index）；查閱：2026-09-14。
- URL：[Governing Factors of Processing Quality for the Silicon Wafer Thinning Process PDF](https://www.disco.co.jp/eg/solution/technical_review/doc/TR24-01_Governing%20Factors%20of%20Processing%20Quality%20for%20the%20Silicon%20Wafer%20Thinning%20Process_20250120.pdf)；[DISCO Technical Review index](https://www.disco.co.jp/eg/solution/technical_review/index.html)
- 實際可支持的論點：DISCO 把 backgrinding 的加工品質以 TTV、front-side saw marks、die strength 評估，並指出 backgrinding 直接影響 device yield／reliability。其 DGP8762 實驗在同一輪具／自研削條件下得到約 1.3 µm TTV；調整 processing recipe 與 chuck-table inclination 後，案例 TTV 約 0.3 µm、形狀較平坦；PDF 明示這些是 without tape 的 reference values，不適用 tape grinding。這可支持「TTV 不只是量測項目，也是研削條件／機台調整的閉環控制量」，並示範為何數字一定要帶條件。
- 限制：這是 DISCO 工程部門的研究案例，樣本數、設備、輪具、recipe 與不使用 tape 的條件都限定了結果；不能把 0.3 µm 或 1 µm 以下寫成薄化代工的通用允收規格，也不能以此證明昇陽的機台能力。

### T4-5　DISCO：低於 100 µm 的搬送風險

- 來源：DISCO glass processing site 的 grinding process 說明（同公司輪具／背磨原理頁）。
- 發布日期：未標示；查閱：2026-09-14。
- URL：[DISCO Grinding Process Using Wheels](https://glass-kakou.disco.co.jp/en/solution/grinding.html)
- 實際可支持的論點：頁面說背磨使用水冷卻加工點並帶走研削粒子；研削表面會留下 processing marks，粗糙度受 abrasive size 影響；對 semiconductor wafer 而言，厚度低於 100 µm 時 breakage risk 會升高，需要特別考慮設備內搬送與 grinding wheel。這可作為解釋「薄化服務不只有去除厚度，還要處理搬送、研削粒子、表面形貌與後續強度」的原廠補充。
- 限制：這是原理／應用說明，沒有針對特定材料或客戶給出失效率；`100 µm` 是頁面情境下的風險描述，不能當成所有 wafer 的硬性破片分界。

## 來源之間可合併的工程模型

### 可用於 01–03 章的分類表

| 欄位 | 應記錄什麼 | 來源支持 | 寫作限制 |
|---|---|---|---|
| wafer role | product／monitor／dummy／jig；該 run 的主目的 | SEMI 6091 草案 | 草案，不寫成現行標準；角色不等於材料 grade |
| physical state | bare、blanket film、patterned、TEG、膜種／圖案 | Philtech | 供應商產品命名，需保留客戶 recipe 差異 |
| history | virgin、used、reclaimed、曾去除的膜與表面損傷 | SVM、Pure Wafer | reclaimed 的允收條件必須依客戶 spec；不能用循環次數保證 |
| geometry | thickness、TTV、flatness、bow、warp、edge roll-off | KLA、KOBELCO、SEMI 3D4 頁面 | 必須附夾持／自然狀態、參考面、取樣與 edge exclusion |
| surface defect | particles、LPD、scratch、residue、haze | KLA、Pure Wafer、SVM | optical defect count 不等於元素污染 |
| elemental contamination | metal／element surface concentration、VPD recovery | Rigaku、Hitachi | 必須附 TXRF／VPD-ICPMS／VPD-TXRF、元素、LOD、取樣面積 |

### 可用於 02、06 章的流程圖語意

```text
進料履歷／膜種／圖案／厚度／電阻率／表面狀況
        ↓
檢查與分類 ── 不符合用途或厚度預算 → 拒收、報廢或 replacement wafer
        ↓
選擇性 strip / etch / lapping（取決於膜、圖案、缺陷與目標）
        ↓
SSP／DSP／CMP／dry polish／dry etch（取決於 geometry、roughness、damage、die strength）
        ↓
clean / dry
        ↓
幾何（thickness/TTV/bow/warp）＋表面粒子／LPD＋金屬／元素＋用途相容性
        ↓
合格回貨；留下 measurement method、recipe、lot、wafer history
```

此圖是依來源的共同工程結構整理出的研究模型，不是昇陽公開的製程流程。Pure Wafer 與 SVM 可支持「檢查→去除／整平→拋光→清洗→終檢」的服務流程；Lam、Entegris、Applied、DISCO 支持各步驟有不同目的與條件分支；沒有來源支持把此圖當成 PSI 的固定站點配置。

### 不能從這批來源跨越的推論

- 不能由 Pure Wafer／SVM／DISCO 的供應商能力推定昇陽已有相同設備、相同 recipe、相同 TTV／金屬／LPD 數字或相同客戶 qualification。
- 不能由「test wafer 可用於 monitoring」推定所有 monitor wafer 都是 reclaimed，也不能由 `dummy` 推定 electrical test 或金屬／粒子允收值。
- 不能由一次 `TTV < 1 µm`、`metals < 1E10/cm²` 或 `LPD 19／26 nm` 的能力表，推導回貨良率、再生次數、成本或碳排。
- 不能把光學 particle inspection、LPD、haze 與 TXRF／VPD 的金屬表面濃度合成單一「清潔度」指標。
- 不能由 DISCO TAIKO 的原理頁推定薄化後一定要做 TAIKO、一定不需要 carrier，或推定 PSI 提供 TAIKO；必須另找公司正式揭露、客戶驗證或設備／服務證據。
- 不能以原廠示範的 5 µm、0.15 mm、2 µm stress-relief removal、0.3 µm TTV 當成一般量產允收或昇陽實績。

## T5 狀態

本輪未把材料／填充物／散熱／CTE／界面熱阻的來源併入，以免在 T1–T4 尚未進入正文前擴大範圍。T5 應另找材料原廠或封裝熱機械研究，並把材料物性、界面結構、翹曲量測與客戶驗證分開；本檔沒有 T5 的已讀證據。

