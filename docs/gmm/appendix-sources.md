# 附錄 A：來源索引與證據邊界

查閱基準：**2026-09-10**。本書針對均華精密工業股份有限公司（GMM，6640）寫作，不沿用均豪書中的持股或營收快照。網頁未標發布日就記「未標示」，查閱日不是發布日。

## 如何讀來源標記

| 標記 | 能支持什麼 | 不能自動支持什麼 |
|---|---|---|
| 公司自述 | 官網／法說中確實公開的產品、功能、歷史數字或方向 | 第三方驗收、特定型號與客戶配對、量產合約 |
| 專利揭露 | 公開書目、實施例所描述的機構 | 商品已採用、通過驗證、出貨或量產 |
| 技術指引 | 在明定條件下成立的量測方法或工程原則 | 均華產品規格、客戶實績 |
| 教學模型 | 本書自行設定條件後的流程、計算與判斷方法 | 真實產線配方、保證精度、良率或產能 |
| 待查 | 本次來源未能回答的具體問題 | 「公司一定不會做」的反向斷言 |

來源直接性與主張強度是兩件事：官方文件直接證明「公司這樣說」，不必然獨立證明「結果已被客戶接受」。公司圖表轉引的研究機構預測，仍是轉引預測，不因放進法說就升級為公司訂單。

## G：公司與產品頁

本節全部於 **2026-09-10** 查閱，頁面發布日期均**未標示**。定位以主文或「產品特色」條列為準；未從搜尋摘要補充性能。

| ID | 原始來源 | 已讀位置與支持範圍 | 限制 |
|---|---|---|---|
| G1 | [均華首頁](https://www.gmmcorp.com.tw/) | 公司介紹：法人、股票代號與分割沿革 | 不推算現時持股比例 |
| G2 | [關於均華](https://www.gmmcorp.com.tw/aboutus/1) | 主文：先進封裝發展、公司層級具名客戶 | 台積電、矽品、日月光是公司自述客戶，沒有型號／製程配對 |
| G3 | [G2C+ 策略聯盟](https://www.gmmcorp.com.tw/aboutus/4) | 志聖、均豪、均華於 2020 年組盟的歷史敘述 | 不是目前成員與持股的完整清單；較新成員標示另見 F2 第 10 頁 |
| G4 | [KS-856／852](https://www.gmmcorp.com.tw/chip-sorter/KS-856-852) | 翻面、晶粒尺寸字面範圍 0.5–50 mm、載具及厚度量測選配 | 尺寸定義、精度、UPH、厚度下限未明 |
| G5 | [KS-956／962](https://www.gmmcorp.com.tw/chip-sorter/KS-956-962) | 側壁崩邊／裂紋、「Defect size 30um」、NG 導出、條碼確認 map、SECS 選配 | 不把 30 µm 當成無條件偵測下限；6S 定義未明 |
| G6 | [KS-812](https://www.gmmcorp.com.tw/chip-sorter/KS-812) | 2／3／4 吋 tray、3／6 bin、雙 feeder、線性取放、mapping、背面檢查選配 | tray 尺寸不是晶粒尺寸；未列精度及 UPH |
| G7 | [KS-962JL](https://www.gmmcorp.com.tw/chip-sorter/KS-962JL) | 四頭取放、十二頭旋轉、AOI 與轉移並行、pre-peeling 與 heating ejector 可選 | 頭數不是倍率保證；未揭露薄晶粒配方或產能 |
| G8 | [KB-9000](https://www.gmmcorp.com.tw/die-bonder/KB-9000) | fan-out／PoW／PoP、翻面、表面 AOI、high bonding force process ready >300 N | 力不是壓力；未揭露接合法、溫壓時間、精度或客戶驗收 |
| G9 | [KB-9X00](https://www.gmmcorp.com.tw/die-bonder/KB-9X00) | fan-out、2.5D／3D IC、搬送、追溯、報表與通訊 | 應用標籤不是 HBM／混合鍵合型號證據 |
| G10 | [KB-9300](https://www.gmmcorp.com.tw/die-bonder/KB-9300) | 3D IC、wafer／substrate 搬送與資料功能 | 不能由頁面判定與 KB-9150 的性能差異 |
| G11 | [KB-9150](https://www.gmmcorp.com.tw/die-bonder/KB-9150) | 3D IC、wafer／substrate 搬送與資料功能 | 接合法、精度、UPH、驗證階段未明 |

## F：法說簡報與日期

兩份官方中文 PDF 均已逐頁核讀。**PDF 頁碼從封面算第 1 頁**，不是擷取圖片的排列順序。日期由[官方法人說明會列表](https://www.gmmcorp.com.tw/investor/corporate-briefing)對應；查閱皆為 **2026-09-10**。

| ID | 文件與發布／活動日 | 本書主要引用位置 | 證據上限 |
|---|---|---|---|
| F1 | [2026-06-12 中文法說](https://www.gmmcorp.com.tw/upload-files/designs/20260612_CN.pdf) | 第 1 頁法人；第 2 頁前瞻限制；第 6–8 頁封裝／Multi Bin／Multi Die Size 背景；第 9 頁核心技術整合；第 10 頁 AI 分選示意 | 公司技術方向與轉引的產業背景，不是品牌／型號／量產線對應 |
| F2 | [2026-08-12 中文法說](https://www.gmmcorp.com.tw/upload-files/designs/20260812_GMM_Investor_Conference_cn.pdf) | 第 1 頁法人；第 2 頁前瞻限制；第 4–5 頁市場預測；第 6 頁 Bonder 營收占比；第 7 頁布局；第 9 頁 H1 亮點；第 10 頁聯盟與展會 | 歷史 Bonder 類別已有營收，不等於每型號或每接合法已量產；個體／合併口徑待核 |

!!! warning "避免跨頁挪用數字"
    F2 第 6 頁的 2022–2025 Bonder 占比依序標為 **6%、9%、14%、22%**；2026 F 柱形**未標明百分比**。第 9 頁的 **41% 是 H1 YoY 成長**，不是 Bonder 占比。本書不按柱高估算 2026 F，也不把預測改成已實現。

F1／F2 的市場容量、reticle 路線與示意品牌只用來辨認「公司拿什麼背景說明需求」，不是本書對市場數字、未來產品時程或供應關係的獨立確認。本書不轉錄整張投影片，不把第三方圖表當均華原創實測。

## P：公開專利

| ID | 原始來源 | 日期與已讀範圍 | 限制 |
|---|---|---|---|
| P1 | [TW202135198A：高產能之晶粒接合裝置](https://patents.google.com/patent/TW202135198A/zh) | 申請 2020-03-04、公布 2021-09-16；查閱 2026-09-10。書目、摘要、圖 1–9 的實施例及旋轉／視覺／翻轉說明 | 原始申請人均華精密工業股份有限公司；本書只採技術揭露層次，不作專利有效性或商業採用判定 |

## T：量測與製造方法

全部查閱於 **2026-09-10**。除 T1 所屬文件標示 1994 版，其餘網頁未標明發布日期；未假定等同設備驗收標準。

| ID | 原始來源與定位 | 支持範圍 | 限制 |
|---|---|---|---|
| T1 | [NIST TN 1297（1994 版）](https://www.nist.gov/pml/nist-technical-note-1297)；[第 2 節](https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-2-classification-components-uncertainty)；[第 5 節](https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-5-combined-standard-uncertainty) §5.1–5.5 | 標準不確定度、相關項、校正及合成；Type A／B 不等於隨機／系統二分 | 本書把框架應用到放置量測；不是 NIST 給某 Bonder 的認證 |
| T2 | [NIST Gauge R&R](https://www.itl.nist.gov/div898/handbook/mpc/section4/mpc4.htm) 章節導覽；[Drift](https://www.itl.nist.gov/div898/handbook/mpc/section4/mpc453.htm) 全文 | 重複性、再現性、偏差、穩定性與 check standard 漂移追蹤 | 量測系統變異與製程放置變異需分開 |
| T3 | [Besi Scientific Publications](https://www.besi.com/scientific-publications/) 先進封裝摘要 | 細間距、對位與互連完整性的挑戰；熱壓與混合鍵合是不同課題 | 競品摘要，未讀全文論文，不移植其規格或客戶 |
| T4 | [Vorne：Calculating OEE](https://www.oee.com/calculating-oee/) 定義與公式 | Availability × Performance × Quality，首次合格品的計數 | 指標解說，不是 SEMI 標準；適用時間與產品單位須先定義 |

## B：跨書先備，不作公司一手證據

| 既有內容 | 本書分工 |
|---|---|
| <a href="../../gpm/html/04-workpiece-flow.html">均豪書：工件流</a> | 只回顧晶圓、晶粒與載具；本書新增剝離／取放的受力與交接 |
| <a href="../../cowos/html/13-test-and-kgd.html">CoWoS 書：測試與 KGD</a> | KGD 基礎回原書；本書新增 bin 資料契約、方向與追溯 |
| <a href="../../gpm/html/08-hbm.html">均豪書：HBM</a> | 回顧堆疊與系統封裝差異；本書不重寫 HBM 製程 |
| <a href="../../gpm/html/09-soic-hybrid-bonding.html">均豪書：SoIC 與混合鍵合</a> | 接合背景回原書；本書新增責任邊界與證據判讀 |
| <a href="../../smt-bonding/html/index.html">SMT／電子接合書</a> | 回流／ACF 背景；板級條件不得直接搬成晶粒條件 |

跨書 URL 指向書庫的已建置 HTML，相對於本書 `book/gmm/html/` 解析；不把來源 Markdown 路徑直接帶到獨立站台。

## 缺口與研究材料

薄晶粒的受力、資料契約、交接狀態機與檢驗設計為本書的**工程教學整理**；尚未取得足夠公開原廠資料來設定膠膜、頂針、真空、薄度與污染的數值窗口，因此不給實機配方。未取得 SEMI E142 正文，不宣稱相容該標準。未取得型號別的客戶驗收報告或混合鍵合量產證據。

中間研究保存在專案 `data/gmm/`，不進入出版頁面及搜尋索引。可持續追查的條目集中於[附錄 C](appendix-open-questions.md)；正文的教學數據與真實規格分開，不能拿教材算例比較廠商。
