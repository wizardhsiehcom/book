# 附錄 A：來源索引與閱讀邊界

本書查閱基準日為 **2026-09-10**。查閱日不是發布日；未標日期的產品頁只能視為當日可見的產品介紹，不能用來倒推出首次出貨時間。

## 如何使用來源

公司產品頁支持「公司公開介紹這項產品及用途」，不自動支持獨立性能認證、具名客戶、接單或量產。客戶公告可交叉確認所列關係，但仍不能越過公告的範圍。技術資料解釋原理，不是志聖的設備驗收報告。

| 標記 | 本書的使用方式 | 不能替代的證據 |
|---|---|---|
| 公司自述 | 志聖官網、公司公告及簡報直接陳述 | 客戶驗收、獨立性能測試 |
| 客戶公告 | 客戶官網直接公布供應商或獎項 | 沒有列出的機型、製程站點、平台 |
| 技術文件 | 材料商或設備商解釋其適用範圍內的機制 | 另一家公司、另一材料的相同性能 |
| 教學整理／推論 | 本書明列條件的推導、控制矩陣、自建算例 | 任何實際產線或公司的數值 |
| 未證實 | 本次來源尚未填補的缺口 | 「不存在」或「未曾出貨」的反向斷言 |

## 技術來源

下列來源皆於 2026-09-10 查閱。PDF 頁次依檔案起算；只以列出的已讀範圍支撐正文，不把附帶的產品型錄當作本書實測資料。

| 代號 | 來源及原始連結 | 已讀位置／發布日 | 支持範圍 |
|---|---|---|---|
| T1 | MicroChemicals：[Softbake](https://www.microchemicals.com/dokumente/application_notes/softbake_photoresist.pdf) | PDF 第 1–7 頁，自 Purpose 至 Measuring the Effective Resist Temperature；未標發布日 | 溶劑擴散與揮發、過烘與欠烘、厚膜、熱板間隙、烘箱升溫與量測限制 |
| T2 | MicroChemicals：[Exposure](https://www.microchemicals.com/dokumente/application_notes/exposure_photoresist.pdf) | PDF 第 1–4 頁，Photoreaction、Spectral Sensitivity、Exposure Techniques、曝光劑量；未標發布日 | 正／負光阻反應差異、波段與量測條件、劑量與時間的互換限制；不引用其後章節或先進節點數字 |
| T3 | MicroChemicals：[Substrate Preparation](https://www.microchemicals.com/dokumente/application_notes/substrate_cleaning_adhesion_photoresist.pdf) | PDF 第 1–4 頁，吸附水、附著促進劑、適用邊界、接觸角；未標發布日 | 表面除水、材料相容性、親水不等於對所有光阻附著更好 |
| T4 | Dymax：[Radiometers](https://dymax.com/products/equipment/light-curing-equipment/radiometers) | 頁面介紹文字及量測波段說明；未標發布日 | 固化光源、導光件及反射件老化會改變強度；輻射計需匹配波段 |
| T5 | Harrick Plasma：[Plasma Cleaning](https://harrickplasma.com/plasma-cleaning/) | 頁首及 Benefits of Plasma Cleaning；未標發布日 | 移除有機污染與引入表面官能基；僅一般機制，不支持先進封裝量產規格 |
| T6 | Dymax：[Comprehensive Guide to UV Light-Curing Technology](https://dymax.com/get-resource-file/7361/file/gui002_comprehensive_guide_to_uv_light_curing_technology.pdf) | GUI002，2022-02-14；§3.2、§3.5–3.10 及封底限制，印刷頁 14–15、17–20 | 固化深度、遮蔽、氧抑制、終點與上下限驗證；不移植其機型數字或配方 |

MicroChemicals 文件的[現行下載入口](https://www.microchemicals.com/DOWNLOADS/Application-Notes/)可用於原始 URL 失效時重新定位。本書沒有重製其中的圖或配方；自繪圖與另行引用的 Wikimedia Commons 線上圖片，來源及使用限制見[附錄 D](99-image-credits.md)。

## 產品頁、型錄與法說

P1–P12 皆為**公司自述**，發布日期未標示、查閱日均為 **2026-09-10**。原始碼的修改時間不當作產品發布或出貨日。已讀頁面完整「規格／特色」文字；P11 另讀 Technical Data、Applications、Feature Highlights。D1、D2 與 I1 的文字擷取會漏字，已轉為頁面影像閱讀，沒有用缺字的擷取結果猜數值。

| 代號 | 原始來源與定位 | 可支持的主張 |
|---|---|---|
| P1 | [自動曝光機 UVE-A973／A976](https://www.csun.com.tw/product/uve-a973_a976/)，規格／特色 | PCB 曝光用途及網頁規格；須與 D1 分版本，不把 LED 板溫度當工件溫度 |
| P2 | [壓膜機 CSL-A25X](https://www.csun.com.tw/product/csl-a25x/)，規格／特色 | PCB 乾膜壓膜與熱壓輪能力自述 |
| P3 | [水平式溼膜塗佈設備 RC-24](https://www.csun.com.tw/product/水平式溼膜塗佈設備/)，規格／特色 | PCB 內層液態塗佈與乾燥，不能代替完整濕式整線 |
| P4 | [IGZO 熱處理退火爐](https://www.csun.com.tw/product/igzo熱處理退火爐/)，規格／特色 | 顯示基板熱處理、氣氛與潔淨度自述；部分指標定義不足 |
| P5 | [UV 多層爐](https://www.csun.com.tw/product/uv多層爐/)，規格／特色 | 配向／聚合物穩定配向、監控回授與多世代實績自述；不引用未有比較條件的效益百分比 |
| P6 | [紫外線清洗機](https://www.csun.com.tw/product/紫外線清洗機/)，規格／特色 | 顯示玻璃有機物清潔、波長及接觸角等主張；其 172 nm「EUV」用語不延伸為半導體 EUV 微影 |
| P7 | [高溫無氧無塵自動化烤箱 HQMOL-AP51-B20-2D](https://www.csun.com.tw/product/oven-panel-level-package-auto-oven/)，規格／特色 | SiP／RDL／Fan-Out、WLP／PLP 熱處理用途及部分條件 |
| P8 | [自動晶圓真空壓膜機 WVL-A12D](https://www.csun.com.tw/product/fully-auto-wafer-vacuum-laminator/)，規格／特色 | 晶圓乾膜壓膜，不等於 Carrier Bonding |
| P9 | [Carrier Bonder WVL-A12](https://www.csun.com.tw/product/carrier-bonder/)，規格／特色 | 暫時接合、真空烘烤與最大壓力／溫度；未具名平台採用 |
| P10 | [自動晶圓撕膜機 MP-A12W](https://www.csun.com.tw/product/auto-de-taping-machine-2/)，規格／特色 | 撕膜與 UV／熱解膠選項；未載雷射解黏 |
| P11 | [De-Warpage OVEN](https://www.csun.com.tw/product/de-warpage-oven/)，Technical Data／Applications／Feature Highlights | 含 CoWoS 的應用主張；3 mm／≤5 mm 差異及 50 N 的力／壓力單位界線須保留 |
| P12 | [連續式電漿清洗機 PRCM-SC10LU](https://www.csun.com.tw/product/in-line-plasma-treatment-system/)，規格／特色 | Lead Frame、四列軌道與串線用途；非晶圓混合鍵合資格 |

| 代號 | 原始文件 | 日期／版本與已讀範圍 | 證據上限 |
|---|---|---|---|
| D1 | [UVE-A973／A976 型錄](https://s3.ap-northeast-1.amazonaws.com/csun.com.tw/wp-content/uploads/2018/03/UVE-A973、A976_外層UV-LED自動曝光機2023Q1v.pdf) | DM2023Q1-000-TW；正式發布日未標示；第 1–2 頁全讀；2026-09-10 查閱 | 公司型錄；區分外層／防焊，提供較多性能數字，但與網頁有尺寸／時間差異，且測試條件未完整 |
| D2 | [HQMOL-AP51-B20-2D 型錄](https://s3.ap-northeast-1.amazonaws.com/csun.com.tw/wp-content/uploads/2022/08/先進封裝設備＿HQMOL-AP51-B20-2D-高溫無氧無塵自動化烤箱（2021Q4）.pdf) | DM202111-000-TW，檔名 2021Q4；正式發布日未標示；第 1–2 頁全讀；2026-09-10 查閱 | 與 P7 相同發布方，不算獨立交叉驗證；沒有負載與具名客戶驗收 |
| I1 | [2026 Q2 法說簡報](https://s3.ap-northeast-1.amazonaws.com/csun.com.tw/wp-content/uploads/2026/06/2026_CONF_CN_0612.pdf)，由[公司法說索引](https://www.csun.com.tw/corporate-presentation/)取得 | 索引會議日 2026-06-12，上架日未標示；PDF 第 2、4、6、13、18、19 頁直接讀取影像；2026-09-10 查閱 | 前瞻聲明、聯盟分工、據點、技術／平台定位與虛擬設計策略；不引用未細讀頁面的財務／持股數字，不是逐機型平台量產矩陣 |

I1 第 13 頁**確有 CoPoS／FoPLP 趨勢訊號與技術發展範圍的自述**，所以本書不宣稱公司沒有這些平台的公開線索；但簡報未提供足以逐一把 P1–P12 對到客戶、站點與量產階段的資料。第 19 頁的 Omniverse／Simulation-first 則屬公司工程方法與效益主張，不是量化驗收結果。

## 公司新聞與事件

本次以有日期、可讀正文的歷史事件作案例，不宣稱涵蓋截至查閱日的全部最新消息。下列皆於 2026-09-10 查閱。

| 代號 | 原始來源 | 發布日／原文位置 | 證據等級與上限 |
|---|---|---|---|
| N1 | [設備廠善用自身優勢，切入先進封測](https://www.csun.com.tw/2020/06/04/csunnewspaper-20200527-csun-advantage-cut-in-advanced-packaging-and-testing/) | 2020-06-04；第 3 段 Carrier Bonder、CoWoS／SoIC 用途；頁尾來源「電子快訊」 | 公司官網轉載媒體；支持當時的用途與未具名切入主張，不是平台量產證明 |
| N2 | [G2C 聯盟擴大投資](https://www.csun.com.tw/2020/12/31/g2c聯盟擴大投資-晶圓製造精進推手/) | 2020-12-31；正文「明年也將在新竹建立」；頁尾連電子快訊 | 公司官網轉載；支持 2021 年服務據點的規劃，不證明落成或設備產能 |
| N3 | [2023 台積公司優良供應商卓越表現獎](https://www.csun.com.tw/2023/12/13/taiwan-semiconductor-equipment-supplier-csun-was-awarded-2023-tsmc-excellent-performance-award/) | 2023-12-13；首段量產支援、2023-12-07 頒獎場合及後文 | 公司一手公告；具名客戶與獎項，但未取得客戶獨立名單，未列機型／平台 |
| N4 | [2024 Outstanding Improvement 獎項](https://www.csun.com.tw/2024/12/18/2024｜榮獲台積公司-outstanding-improvement獎項/) | 2024-12-18；正文 Spare Parts—Outstanding Improvement 及 12 月 2 日受獎 | 公司一手公告；備品改善獎，不是新設備平台資格 |
| N5 | [舊線激活](https://www.csun.com.tw/2023/09/05/production-lines-activation/) | 2023-09-05；「產線自動化」兩段 | 公司一手服務主張；先進封裝／PCB 的 OVEN、Plasma 改造實績未具名，不含型號、數量或效益數字 |

**取得限制：**本次未取得台積公司具名列出志聖獲上述獎項的官方名單，因此 N3、N4 保留「公司自述」，不是「雙方公告」。初查僅取得 2023-11-02 法說會公告，後續已取得並讀取上列 I1 的相關頁面；本書結論以後續實際讀到的內容更新，不沿用「未取得任何法說原件」的初始限制。I1 仍未補齊獎項名單及逐機型採用證據。

## 跨書先備

以下為本書庫的概念導覽，不充當本書公司事實的一手證據。也不沿用其市場時程、持股或客戶推測。

| 代號 | 延伸閱讀 | 本書分工 |
|---|---|---|
| B1 | [材料與互連](../../gpm/html/03-materials-interconnect.html) | 已有材料層次；本書追蹤材料狀態如何受設備影響 |
| B2 | [濕製程](../../gpm/html/13-wet-process.html) | 已有清洗、顯影、去膠、蝕刻的功能區分；本書聚焦處理後的附著與等待時間 |
| B3 | [面板級製程挑戰](../../copos/html/08-panel-process-challenges.html) | 已有面板挑戰全景；本書建立跨尺寸驗收矩陣，不承接平台時程 |
| B4 | [爐溫曲線](../../smt-bonding/html/02-temp-profile.html) | 只沿用「量工件熱歷程」的概念；焊料回流溫度不能套用光阻或膠材 |

跨書連結按出版輸出 `book/<slug>/html/` 的相對位置撰寫；不是跨 docs_dir 引用 Markdown，也不會把其他書的內容複製進本站。
