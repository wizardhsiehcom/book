# V5 門檻與複判：驗收

日期：2026-09-28。完成 9 頁、門檻滑桿、預測題及 04／08／13 章入口。

- 原始檔：`docs/v5/resources/threshold-review/`。
- 可閱讀產物：`book/v5/html/resources/threshold-review/index.html`；交付時帶整份 `book/v5/html/`。
- 計畫：[v5-plan.md](v5-plan.md)。來源備料：[v5-sources.md](v5-sources.md)。正式故事保留官方文件連結。

## 已通過

- `node tools/check-review-story.cjs`：101 個整數門檻、相等邊界、兩端、固定 10／90 分母、候選單調性、零分母、28／84 分鐘工作量、狀態恢復及清理。
- `node tools/check-story-reader.cjs`、`UV_CACHE_DIR=/private/tmp/book-uv-cache uv run python tools/check-story-package.py`。
- `UV_CACHE_DIR=/private/tmp/book-uv-cache bash sync-assets.sh` 後執行 `UV_CACHE_DIR=/private/tmp/book-uv-cache uv run mkdocs build --strict -f configs/v5.yml`。Material 通用 MkDocs 2.0 提示不影響本次建置成功。
- JS 語法、`git diff --check`。
- 真實 V5 建置目錄複製到暫存位置，檢查主題 HTML／JS 的本地資產與所有返回／延伸連結皆存在且位於搬移根目錄；三個章節入口正確，無 symlink。

## Chromium 瀏覽器

腳本在 `checks/v5-validation/`；截圖與 metrics 在 `data/visual-story/v5-validation/`。沿用先前授權的 Playwright 與暫存環境，不新增專案依賴。

- `check-browser.cjs`：9 頁 × 5 組，共 45 組；1280×900、390×844、320×740、640×450（相當於桌面 200% zoom 可用寬度）與 390×844 兩倍文字。後三組減少動態效果。無水平溢出、標籤重疊或未顯示頁面。
- `check-controls.cjs`：三個章節入口、返回與最後一頁延伸連結；題目 Enter／Tab；滑桿方向鍵、Home／End、狀態恢復；索引跳頁、釘選／解除、Escape、重播、桌面 hover；無 pageerror。
- 人工檢視 `text200-5.png`（滑桿／分流／分數帶）與 `desktop-7.png`（複判工作量）。文字可換行、計數完整；全頁截圖中的固定底部導覽會出現在截圖中段，內容可透過捲動閱讀。

## 教學與限制

- 固定合成 100 個單位，一次評分、一次分流；分數 >= 門檻送複判，其餘在本教學規則下直接放行。這不是倍利產品流程或數據。
- 參考判定固定、無未知；人工錯誤與最終報廢未模擬。ADC 頁僅說明分流界線。
- 工作量是假設每小時 100 個同分布單位、每候選 2 分鐘，一人 60 分鐘純判讀；不是現場等待時間預測。
- 主題無網路執行依賴；整本書仍有 Mermaid CDN／外部書架，不宣稱全書離線。
- 未做實體手機、真實讀者試讀、公司資料驗證或學習成效評估。兩倍文字以 CSS 放大測試，640 寬度測試並非瀏覽器選單 zoom。

## 後續教學補強

2026-09-28 已更新末頁新例子，並依主題補強圖解與互動。以上為首版紀錄；目前內容差異與新增驗收見 [教學補強](teaching-improvements.md)。
