# V5 成書驗收紀錄

日期：2026-09-14。入口 `book/v5/html/index.html`，正文 `docs/v5/`，設定 `configs/v5.yml`。

## 交付範圍

16 章、導讀、全書地圖與四附錄，共 22 個 Markdown 頁；約 30,691 個 CJK 字元（含表格與附錄）。9 個自建 Mermaid 圖，1 張有作者與授權的 Commons 晶圓照片。書庫使用原有 `js/books-data.js` 登記；共用依賴及模板未變更。v5 新增專用圖表初始化與捲動樣式。

## 內容核對

- 第 03 章先建立檢出、量測、複判與分類分工，再完成其餘章。公司產品與一般教學模型分列，不把自建圖當作倍利實作。
- Luna max 查核公司、技術與圖片資料；主 agent 讀研究結果、原始技術文件，並檢視三月、四月及八月簡報關鍵頁影像。
- 四月微觀檢出表為 PDF 第 19 頁、印刷頁 16；效益與實績為 PDF 第 21–22 頁、印刷頁 18–19。八月 roadmap 為 PDF 第 12 頁、印刷頁 9。已修正研究初稿的頁碼混用。
- 品質矩陣、人工工時、改造成本與節拍算例已重算；補充人力範圍及改造成本總額，以免分母歧義。
- 100X／150X 配置、量測條件、具名驗收、Inline 宿主與 ADC 完整效益分母仍屬公開資料缺口，列入正文附錄 C。
- 八月簡報的客戶群組收入沒有轉換成本書四類交付收入，也沒有用裝機數推算營收。
- 外部圖片只採用晶圓照片；透射暗場候選不採，避免與不透明晶圓光路混淆。

## 建置與靜態驗收

`bash ./sync-assets.sh` 已成功。`uv run mkdocs build -f configs/v5.yml --strict` 成功；未修改 uv 依賴。Material 自帶的 MkDocs 2.0 提示橫幅不構成本書 strict warning。

`python data/v5/verify-book.py --report data/v5/verify-book-report.json`：PASS。

- 22 個來源頁與 nav 對應；23 個 HTML（含 404）。
- 1,298 個 HTML 連結與 365 個資產參照檢查，無本地缺失。
- 每頁唯一回書庫連結解析到 repo 根的 `index.html`。
- 11 項算例檢查通過。
- 工作筆記與 PDF 快照留在 `data/v5/`，未放入 docs；搜尋索引限於出版來源頁。
- `git diff --check` 通過；本來存在的 `docs/misses.jsonl` 未更動。

## 瀏覽器驗收

第一輪使用既有 headless Chromium，未安裝新套件。對 00、02、03、08、11、14 的 1440px 與 390px 頁面截圖；正文、導覽、寬表及回書庫可見。主 agent 另檢視 03 桌面與 14 窄版截圖。

第一輪 sandbox 無法連線 unpkg 與 Wikimedia，故 Mermaid 只顯示原碼、晶圓照片未載入；此輪不能算圖表與圖片渲染通過。後續透過允許網路的工具執行取得腳本並重驗，發現繼承設定的 `<pre><code>` wrapper 會被 Mermaid 10 當作圖碼解析而失敗。

修正限定 v5：設定 `fence_code_format`、以 `.v5-mermaid` 避免 Material 與自訂初始化重複處理、初始化先提取 code 的 textContent，再執行 Mermaid 10。SVG 保留原生寬度，容器可橫向捲動，避免窄版把文字縮得過小。參考 [Material 圖表設定](https://squidfunk.github.io/mkdocs-material/reference/diagrams/)。

主 agent 在允許網路的 Chromium 批次驗證 00、01、02、03、05、06、08、09、11：9 頁均 exit 0，各有 1 個成功 flowchart／sequence SVG，無語法錯誤；已檢視 05、08、11 窄版截圖。結果與 DOM 存 `data/v5/browser/diagram-results.json` 及同目錄，頁面局部橫捲保留圖中文字尺度。

瀏覽器會拒絕共用的 `GenWanMin2-R.woff2`／`GenWanMin2-SB.woff2`（OTS 字型解析錯誤），頁面已使用後備字型正常顯示。這是既有共用資源限制，本次不修改其他書籍字型。

最後圖片驗收：主 agent 以允許網路的 Chromium 載入正式產物的第 02 章，在 1440px／390px 截圖並檢視，晶圓照片、繁中圖說及授權連結正常呈現。截圖 `data/v5/browser/02-photo-desktop.png`、`02-photo-narrow.png`。先前沙箱連線限制已排除，不再列為未完成驗收。

**最終結果：成書完成，strict build、靜態連結／資產／算例及實際圖表／圖片渲染通過。** 公司公開證據缺口與共用字型後備顯示保留如上；沒有待補正文或必要圖片。

詳細研究與工具報告留在 `data/v5/`，該目錄按現有規則被 Git 忽略；本文件保留必要的可追蹤結果。
