# 資料庫逐步解說：驗收紀錄

日期：2026-09-28。

## 交付

- 主題：`docs/database-correctness/resources/unknown-outcome/`，9 頁。
- 成品：`book/database-correctness/html/resources/unknown-outcome/index.html`；交付整份 `book/database-correctness/html/`。
- 第 15、16 章均新增入口，返回第 16 章；末頁連回操作身分與 L06。
- 四種受控情境：已提交但回覆遺失、原交易已回滾、原交易仍持鎖且重送等待逾時、回滾後另一操作已改版。
- 沿用既有 reader，這篇未新增依賴或修改共用元件。完整情境名稱另顯示於可換行的結果區，補足窄版原生 select 顯示寬度。

## 自動檢查

通過：

```bash
node tools/check-outcome-story.cjs
node tools/check-story-reader.cjs
UV_CACHE_DIR=/private/tmp/book-uv-cache uv run python tools/check-story-package.py
UV_CACHE_DIR=/private/tmp/book-uv-cache bash sync-assets.sh
UV_CACHE_DIR=/private/tmp/book-uv-cache uv run mkdocs build --strict -f configs/database-correctness.yml
node --check docs/database-correctness/resources/unknown-outcome/story.js
git diff --check
```

主題檢查直接載入正式 story.js，驗證四種情境的可見結論、重設、離頁返回恢復、末步停用及事件清理。情境是固定快照，這個檢查不能替代 SQL 程序驗證。

另把實際整本輸出複製到暫存位置，核對主題本機 CSS／JS、返回章節與 SQL／實驗連結均存在且不逃出交付目錄；兩章入口存在，無 symlink，通過。首次檢查因 macOS `/var` 與 `/private/var` 路徑別名誤判；統一 resolve 後通過，未修改產物路徑。

## 瀏覽器：通過

使用本機既有 Chromium 與暫存安裝的 Playwright，載入建置後的 file URL。

- 9 頁 × 5 情境：1280×900、390×844、320×740、640×450，以及 390×844 兩倍文字；共 45 個版面情境。
- 640×450 為 200% 頁面縮放的等效 CSS viewport；兩倍文字另將本文、頁首、索引和導覽字級加倍。沒有操作瀏覽器縮放選單。
- 全部 45 個情境無水平溢出、無索引與頁首重疊，圖解 opacity 為 1；減少動態情境的 animation 為 none。
- 以下實際操作全部通過，無 pageerror：兩章入口、返回第 16 章、L06、索引跳頁／釘選／解除、題目鍵盤作答、四種情境、離頁返回、重設、末頁重播及 pageerror。
- 截圖人工查看桌面與兩倍文字互動頁。長頁需捲動；固定底部導覽會出現在全頁截圖中段。

可重跑腳本在 `checks/database-validation/`（`check-browser.cjs`、`check-controls.cjs`）；截圖與 `metrics.json` 在 `data/visual-story/database-validation/`。腳本使用本機 Chromium 快取與 `/private/tmp/book-browser-qa/node_modules/playwright`，換環境需調整。

## 來源與限制

已閱讀 [database-sources.md](database-sources.md) 的 Microsoft 第一手查核，對照本書 ApplyJudgment 原始程序。故事呈現固定教學事件，沒有重新執行 SQL Server 或真實斷線實驗，也沒有讀者試讀或實體手機測試。全書其他外連與 CDN 不在主題離線能力的保證範圍內。

## 後續教學補強

2026-09-28 已更新末頁新例子，並依主題補強圖解與互動。以上為首版紀錄；目前內容差異與新增驗收見 [教學補強](teaching-improvements.md)。
