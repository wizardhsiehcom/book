# EE274 故事驗收

2026-09-28，主題 `docs/ee274-data-compression/resources/arithmetic-interval/`，正式輸出 `book/ee274-data-compression/html/resources/arithmetic-interval/index.html`。

## 已通過
- `node tools/check-arithmetic-story.cjs`：39 種長度 1–3 序列的寬度、區間包含、端點與中點解碼往返；BAC 五位前綴、半開邊界、互動上限、退一步／重設／恢復／清理。
- `node tools/check-story-reader.cjs`、`UV_CACHE_DIR=/private/tmp/book-uv-cache uv run python tools/check-story-package.py`。
- 同步共享資產後，`UV_CACHE_DIR=/private/tmp/book-uv-cache uv run mkdocs build --strict -f configs/ee274-data-compression.yml` 通過。
- Playwright Chromium：9 頁 × 5 版面，45 組無水平溢出、標籤重疊或不可見 stage。互動頁已填入 BAC 三步。涵蓋 1280×900、390×844、320×740、640×450 與 390×844 兩倍 CSS 文字；後三者減少動態效果。
- 鍵盤作答與符號按鈕、三步上限、退一步／重設、離頁恢復、章節入口與返回、最後延伸章節、索引跳頁／釘選／Escape、重播、桌面 hover，無 pageerror。
- 人工檢視 `text200-5.png` 與 `desktop-7.png`：三步端點與前綴區間清楚；長頁可捲動。全頁截圖把固定底部導覽拍在畫面中段，此為固定定位的截圖結果。
- 複製整本建置輸出到暫存目錄，主題本地資產與章節連結均存在且留在交付根目錄內，無 symlink。

## 備料與限制
腳本在 `checks/ee274-validation/`；45 組 metrics 與截圖在 `data/visual-story/ee274-validation/`。來源在 [ee274-sources.md](ee274-sources.md)。
640px 為縮小可用寬度的 zoom 等效檢查；未操作瀏覽器選單縮放、未測實體手機、未做讀者試讀。此短序列教具不含正式整數編碼器、重縮放或 EOF。交付整份 html 目錄；主題無網路依賴，但全書 MathJax CDN 與外部書架仍需另查離線需求。

## 後續教學補強

2026-09-28 已更新末頁新例子，並依主題補強圖解與互動。以上為首版紀錄；目前內容差異與新增驗收見 [教學補強](teaching-improvements.md)。
