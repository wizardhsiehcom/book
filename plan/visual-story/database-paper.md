# 資料庫「沒收到回覆，可以再按一次嗎？」A 紙本改版

2026-09-28。只改 `docs/database-correctness/resources/unknown-outcome/story.js`、`story.css`。模型（`outcomeScenarios`、`mountOutcome`）、九頁 id、題目、章節連結、previewArt、狀態保存與清理、`data-scenario/advance/reset/result` 均保留；class 前綴仍為 `outcome-`。

## 各頁部件

| 頁 | 部件 | 要看見的因果 | 改法 |
|---|---|---|---|
| 1 lost-reply | 對照 | 客戶端證據 vs 全知狀態；「結果未知」屬於客戶端 | 重新上色；右欄以虛線分隔，表示客戶端看不到；朱紅只標「結果未知」 |
| 2 two-timelines | 時序 ×2 | 兩條不同的伺服器事件（提交後回覆遺失／提交前中斷後回滾），最後客戶端同一個「連線中斷」 | **重構**：原兩個編號清單改為兩張雙方時序圖，與第 6 頁共用同一份事件資料 |
| 3 not-found | 對照 | 「0 筆」只是一次觀察；原執行可能未結束 | 重新上色；朱紅改標全知側 |
| 4 same-intent | 紀錄表 | X 與五欄一起持久化；expected_version 也是意圖 | 改為細線分格紀錄表，expected_version 以朱紅左線標示 |
| 5 coordinate | 流程 | 同 ID 重入 → 鎖 → 依原執行留下的狀態分三路 | **重構**：三張卡片改為流程＋三分支；只把「尚未結束，逾時仍需查核」標朱紅 |
| 6 try-fault（互動） | 時序 | 請求方向、回覆遺失（虛線＋×）、連線中斷、原 ID 重送、等待逾時 | **重構**：時間線改為「客戶端｜訊息｜伺服器」三欄，訊息欄左右框線即生命線，箭頭表方向；窄容器改成訊息在列首整行、兩方並列 |
| 7 new-id | 對照 | 換 ID 仍被版本擋下（1 筆）vs 連版本也改（2 筆） | 加入大數字「1／2 筆判定」，危險側朱紅 |
| 8 old-result | 帳本＋對照 | ① X、② Y 依序寫入；③ 重送回當時結果 ≠ 目前值 | ①② 改為細線帳本列 |
| 9 reconcile | 對照 | 「已知：本次等鎖逾時」與「尚無證據：原交易終局」分開 | 重新上色；朱紅標「尚無證據」 |

時序圖事件改為結構化資料 `outcomeEvents`（每列客戶端事件、訊息種類與方向、伺服器事件）；`outcomeTimeline` 仍輸出模型檢查依賴的字串與順序（第 0 步不出現原 X 重送、pending 第 2 步為等鎖→等待逾時）。窄版以 container query 切換，因此縮圖（1000px 寬）自動保持桌面構圖；其餘 `.mini-page` 覆寫保留並補上流程與帳本。

色彩只用 reader token（`--paper --card --ink --muted --accent --line`）；story.css／story.js 無十六進位色碼、無 `--blue`／`--orange`；圓角 ≤3px（流程判斷節點依部件用膠囊形）。

## 檢查

- `node tools/check-outcome-story.cjs`：PASS。
- `uv run mkdocs build -q --strict -f configs/database-correctness.yml`：通過（僅 Material「MkDocs 2.0」提示）。
- `shoot.cjs database-correctness unknown-outcome 1,2,4,5,6,7,8,9`：9 頁 × 3 版面（1280／320／390 兩倍字）無水平溢出、無頁首重疊、無 pageerror。
- 另以暫存腳本操作第 6 頁：選情境、推進兩步後截圖（桌面 committed、changed；320 pending），無溢出與 pageerror。
- `git diff --check`：通過。

## 目視檢查

實際開啟並檢視：桌面第 2、4、5、6、7、8 頁；320 第 2、5、6 頁；390 兩倍字第 6 頁；互動第 6 頁桌面 committed 第 3 步與 320 pending 第 3 步。截圖在 `data/visual-story/paper-restyle/unknown-outcome/`。固定底部導覽出現在長截圖中段屬已知假象。

## 待使用者判斷

- 第 2 頁兩張時序並排時容器較窄，桌面也使用「訊息在列首」的窄版時序；是否改成上下兩張、各用三欄版？
- 兩倍字 390 下時序欄寬只容 3–4 字，可讀但需大量捲動。
- 伺服器側以虛線分隔／標「全知視角」來提示客戶端看不到，是否足夠清楚？

未做真實讀者試讀，也未在實體手機檢查；以上為作者自查與自動化巡檢。
