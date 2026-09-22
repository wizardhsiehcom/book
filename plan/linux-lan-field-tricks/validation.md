# 成書驗證紀錄（2026-09-22）

- PASS：11 章＋導讀／地圖／4 附錄，共 17 頁正文；18 HTML 含 404。
- PASS：MkDocs strict build、17 頁 Markdown 連結與 fence、一般出版頁面本地資源。
- PASS：18 HTML 各有唯一回書庫連結，解析到根 index.html；書庫卡只登記一次。
- PASS：兩個 Mermaid 容器與既有初始化腳本；非瀏覽器渲染證明。
- PASS：出版範圍只有正文、共用資源及三個明示下載範例；無研究筆記、plan、pycache。
- PASS：接收器本機 HTTP 檢查，Python 3.12；沒有 LAN／Windows 實測。
- 未驗證：瀏覽器預覽因 Computer Use permissions are not granted；無可用 browser connector。圖表與桌面／手機實際畫面待驗。
- 限制：Material 預設 404.html 有 27 個根絕對 URL 資源／導覽引用；子路徑或 file URL 的錯誤頁不能視為可攜閱讀頁。一般 17 頁不受此限制；本輪未變更全書庫共用 404 模板。
- 獨立預覽 server 用後關閉。未連入或變更使用者 Linux／Windows 機台。

圖文版本：00-map.md SHA-256 `d756378560718a30bdbbb73b5def197aaf97068760ec5642278079c122882cc8`。
