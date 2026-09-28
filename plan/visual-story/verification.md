# TCP 逐步解說：實作與驗收紀錄

日期：2026-09-28。

## 最終狀態

第一篇已完成實作、建置與瀏覽器驗收。Safari 完成實際章節跳轉；Playwright／Chromium 補完窄版、兩倍文字、減少動態效果與鍵盤互動。尚未做實體手機或讀者試讀。

驗收發現共用 reader 的固定索引標籤在窄版遮住頁首及章節編號，已修正：桌面頁首保留標籤空間；700px 以下收合標籤改橫排並佔用自己的版面列。修正放在 `docs/assets/story-reader/reader.css`，同步後重建本書。

## 交付

- [正式主題原始檔](../../docs/systems-network-foundations/resources/tcp-stream/index.html)：11 頁，包含預測題、三種切段操作、尾巴保留、EOF 與正式章節銜接。
- [第 08 章](../../docs/systems-network-foundations/08-tcp-stream.md)、[第 09 章](../../docs/systems-network-foundations/09-message-contract.md) 已加入入口。
- 輸出位置：`book/systems-network-foundations/html/resources/tcp-stream/index.html`。整本交付目錄為 `book/systems-network-foundations/html/`。
- 候選清單已依要求另存 `/Users/wizard/Documents/gpm/temp/書籍視覺解說候選清單.md`，內容比對通過。
- 主題只使用本機 reader、原生 HTML/CSS/JS；共用 reader 的 CSS 已修正窄版索引遮擋，JavaScript 沒有改動。

## 自動檢查：通過

```bash
node tools/check-tcp-story.cjs
node tools/check-story-reader.cjs
UV_CACHE_DIR=/private/tmp/book-uv-cache uv run python tools/check-story-package.py
UV_CACHE_DIR=/private/tmp/book-uv-cache bash sync-assets.sh
UV_CACHE_DIR=/private/tmp/book-uv-cache uv run mkdocs build --strict -f configs/systems-network-foundations.yml
node --check docs/systems-network-foundations/resources/tcp-stream/story.js
git diff --check
```

- 正式主題測試：12-byte 串流的全部 2,048 種切法，各中間步驟的完整訊息與尾巴、EOF 截斷、單次多筆、三種模式、重設、返回恢復及事件清理。
- 共用 reader：模板外殼、導航、題目、索引釘選與生命週期，DOM stub 檢查通過。
- 打包檢查：既有兩主題模板搬移測試通過。
- 另將本次實際整本輸出複製到暫存目錄，檢查所有主題本機引用仍留在交付目錄、08／09 雙向入口及實驗入口存在，沒有 symlink 或指回作者目錄；通過。
- 本環境 `./sync-assets.sh` 沒有執行權限，改以 `bash` 執行；預設 uv cache 不可寫，改用 `/private/tmp/book-uv-cache`。未更動專案權限或依賴。

## 瀏覽器：早期原生工具紀錄

使用本機 Chrome 訪客視窗，從 `http://127.0.0.1:8765/08-tcp-stream.html` 點章節入口。

- 已看到章節入口、正式故事網址與桌面首屏（工具回傳畫面約 1048×768）。數量卡片、標題、翻頁導覽顯示正常。
- DevTools 未顯示 JavaScript 錯誤；只有未提供的 `/favicon.ico` 404。
- AX 文字曾顯示第 03、04 頁，代表頁面狀態可推進；但之後畫面與 AX 回報不同步，因此不據此登記完整翻頁或題目驗收通過。
- 瀏覽器連線工具沒有可用 browser；改用原生 Chrome 後，電腦控制工具最終回報 `noWindowsAvailable`。本輪未能可靠繼續畫面操作。

### 續作：Safari 實際操作

Chrome 再次回報 `noWindowsAvailable`，改用 Safari 新分頁檢查同一建置產物。

- 已逐頁走過 11 頁；頁碼、標題與圖解內容對應。
- 預測題兩個答案均顯示各自回饋。
- `2 → 6 → 4` 逐次得到 HE、HELLO／WO、HELLO＋WORLD；完成後接收按鈕停用，重設回到零。
- 全部一次模式經一次接收得到兩筆；每段 1 byte 模式以點擊與空白鍵接收至 HE。逐 byte 的完整 12 步仍由自動測試覆蓋。
- 離開互動頁再返回，保留所選模式、2 次接收與 HE 尾巴。
- 索引可釘選、跳至第一頁、解除釘選及以 Escape 收起；釘選時正文與底部導覽讓出左欄。
- 點擊「返回第 08 章」確實到達章節，章節仍顯示故事入口。
- 放大後標題會換行，但未取得確切倍率；不能登記為 200% 文字放大通過。放大截圖中左上索引標籤遮到部分頁首標籤，列為後續共用 reader 版面檢查項。
- 圖解截圖持續呈現淡入中的低透明度；CSS 有 0.25 秒淡入，但本輪無法確定是截圖時序還是實際動畫未完成，未因此修改樣式。
- Safari 的座標拖曳也回報 `noWindowsAvailable`，無法可靠調整手機視窗。方向鍵未觀察到翻頁，尚未確認焦點與工具送鍵影響。

### 再續作：鍵盤、重播與第 09 章

- 從新載入頁面的焦點按右方向鍵，頁碼由 1 推進至 2，再連續推進至 11，確認全域方向鍵翻頁正常。
- 先前焦點停在按鈕或 summary，符合 reader 明確略過互動元件的快捷鍵規則，無須修改程式。
- 點擊末頁「重新看一次」回到 1 / 11，上一頁停用。
- 點擊末頁「閱讀第 09 章：訊息契約」實際載入 `09-message-contract.html`，標題符合。
- Chrome 開發工具快捷鍵未生效；Safari 響應式模式快捷鍵也未產生可見變化。原生 UI 路徑仍不足以完成剩餘環境模擬。

### 最終補驗：Playwright／Chromium

使用既有 Chromium 1228，以及暫存目錄中的 Playwright；沒有新增專案依賴。直接載入建置後的 `file://` 故事，確認本機 reader 與故事資產可載入。

- 1280×900、390×844、320×740、640×450 共四種 viewport，逐一驗證 11 頁。最後一種是 1280×900 在 200% 頁面縮放時的等效 CSS viewport，不冒稱操作過瀏覽器縮放選單。
- 另在 390×844 將本文、頁首、索引標籤和導覽的計算字級加倍，逐頁驗證 200% 文字壓力情境。
- 55 個頁面情境皆無水平溢出、無收合索引與頁首文字重疊；動畫後圖解 opacity 均為 1。reduce 模式的圖解 animation 為 none。
- 實際操作通過：索引 hover 暫開／離開收起、底部 hover 預覽展開／離開縮小、Tab 經返回與來源連結到索引、Enter 釘選／解除、Escape 收起、Tab 選題目答案並 Enter 作答。
- 390px 下逐 byte 接收 12 次，得到兩筆訊息、零尾巴，接收按鈕停用；無 JavaScript pageerror。
- 人工檢視桌面首屏、手機互動頁與兩倍文字互動頁截圖，確認文字與控制元件換行、圖解已恢復完整對比。固定底部導覽會出現在長頁截圖中間；讀取下方內容需捲動。

產物位於忽略追蹤的 `data/visual-story/validation/`；重跑：

```bash
node plan/visual-story/checks/validation/check-browser.cjs
node plan/visual-story/checks/validation/check-controls.cjs
```

脚本預設使用 `/private/tmp/book-browser-qa/node_modules/playwright`，可用 `PLAYWRIGHT_MODULE` 指定其他安裝位置；Chromium 路徑為本機既有快取，換環境需調整。`metrics.json` 保存 55 個情境，PNG 保存各尺寸的第 1、3、9、11 頁。這些是模擬環境檢查，不是實體手機測試。

**尚未進行**：讀者試讀、學習成效驗證。此故事為受控教學模型，不是真 TCP 量測；整本書仍有其他 CDN／書庫外連，未宣稱全書離線可用。

## 後續教學補強

2026-09-28 已更新末頁新例子，並依主題補強圖解與互動。以上為首版紀錄；目前內容差異與新增驗收見 [教學補強](teaching-improvements.md)。
