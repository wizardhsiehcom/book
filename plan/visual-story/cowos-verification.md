# CoWoS 逐步解說：驗收紀錄

日期：2026-09-28。

## 交付

- 9 頁故事：`docs/cowos/resources/package-path/`。
- 成品：`book/cowos/html/resources/package-path/index.html`；交付整份 `book/cowos/html/`。
- 03、06、07 章新增入口，返回第 03 章，末頁連 06／07。
- 原創 HTML/CSS 剖面；S／R／L 按鈕切換，保留選擇，使用既有 reader。未新增專案依賴或修改共用 reader。

## 自動檢查：通過

```bash
node tools/check-package-story.cjs
node tools/check-story-reader.cjs
UV_CACHE_DIR=/private/tmp/book-uv-cache uv run python tools/check-story-package.py
UV_CACHE_DIR=/private/tmp/book-uv-cache bash sync-assets.sh
UV_CACHE_DIR=/private/tmp/book-uv-cache uv run mkdocs build --strict -f configs/cowos.yml
node --check docs/cowos/resources/package-path/story.js
git diff --check
```

主題檢查載入正式 story.js，驗證頁面契約、S 專用的中介板 TSV、L 專用的局部矽結構、按鈕選擇狀態、離頁返回及事件清理。這只檢查圖解程式，不是封裝電氣／製程驗證。

另外把整本實際輸出複製至暫存目錄，檢查本地 CSS／JS、返回章節及末頁連結存在且留在交付目錄；三章入口存在、無 symlink，通過。

## 瀏覽器：通過

使用本機 Chromium 與暫存 Playwright，直接載入建置後的 file URL。

- 9 頁 × 5 情境：1280×900、390×844、320×740、640×450、390×844 兩倍文字，共 45 個版面情境。
- 640×450 是 1280×900 在 200% 縮放時的等效 CSS viewport，沒有操作瀏覽器縮放選單。文字壓力測試另將頁首、本文、索引及導覽字級加倍。
- 全部情境無水平溢出、無收合索引與頁首重疊，圖解 opacity 為 1；reduce 模式 animation 為 none。
- 三章入口、返回 03、末頁 06／07 連結、索引跳頁／釘選／解除／Escape、重播、hover 展開／收起皆通過。
- 題目 Enter／Tab 作答、S／R／L 以空白鍵切換、離頁再返回保留選擇皆通過；無 pageerror。
- 人工查看桌面橫向路徑、兩倍文字的 L 剖面。原生文字隨版面換行，長頁需捲動；固定底部導覽會位於全頁截圖中段。

腳本 `checks/cowos-validation/` 的 `check-browser.cjs`、`check-controls.cjs`；截圖與 `metrics.json` 在 `data/visual-story/cowos-validation/`。環境沿用 `/private/tmp/book-browser-qa/node_modules/playwright` 與本機 Chromium 快取，其他機器需調整路徑。

## 來源

已核對 TSMC 官方 CoWoS 頁面與 SK hynix 的 HBM／2.5D 封裝說明，備料見 [cowos-sources.md](cowos-sources.md)。S／R／L 依官方結構定義；HBM 頁加入獨立來源連結。第 06 章原有「L 矽橋含 TSV」比較列改為依實作，並明確限定該列討論中介層 TSV。沒有全面更新原書其他章節的產品／規格數字。

## 範圍

結構示意不按比例、不代表特定產品或 HBM 世代，不模擬電氣、時序、材料或製程。不由圖推出成本、良率、規模上限。省略散熱、填充材料、大部分訊號及電源／接地；R／L 垂直連接細節另依設計。

尚未進行讀者試讀與實體手機測試。主題使用本地資產，不宣稱全書 CDN／外連皆可離線。

## 後續教學補強

2026-09-28 已更新末頁新例子，並依主題補強圖解與互動。以上為首版紀錄；目前內容差異與新增驗收見 [教學補強](teaching-improvements.md)。
