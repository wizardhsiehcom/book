# 五篇改用 A「紙本圖解」

2026-09-28。依交接文件執行，調整：來源、計畫與腳本放 `plan/visual-story/`；截圖與 metrics 放 `data/visual-story/<topic>/`（Git 忽略）。

## 範圍

- 保留：五篇模型、互動、章節入口、教學補強（見 [teaching-improvements.md](teaching-improvements.md)）、資料契約。
- 改：共用 reader 外殼改 A 色票與線條；各篇 `story.css` 改 A；圖解依內容換成紙本部件的結構，不只換底色。
- 不做：新增依賴、改 reader 行為或 DOM、引用 playground。

## 步驟與所有權

| 步驟 | 內容 | 負責 |
|---|---|---|
| 1 | reader.css 改 token（`--paper --card --line --accent`），硬編碼藍色改 token；`--blue`／`--orange` 保留為別名以免既有主題斷色 | 主 agent |
| 2 | TCP 關鍵頁：條帶改紙本 byte 格、流程頁用 flow 部件；渲染、截圖、修改 | 主 agent |
| 3 | 其他四篇各一個 subagent，只改自己的 `story.js`／`story.css`，不動 reader | 子任務 |
| 4 | 整合、五篇模型檢查、reader/package 檢查、strict build、瀏覽器截圖檢視 | 主 agent |
| 5 | README 移除「尚未套用」，更新範本 `story.css` 色票 | 主 agent |

## 部件對應（初擬，實作時依內容調整）

| 篇 | 主要關係 | 部件 |
|---|---|---|
| TCP | 收取邊界 vs 訊息邊界、換行判斷 | byte 格、flow |
| 資料庫 | 兩方事件與逾時未知 | sequence |
| CoWoS | 剖面與路徑 | layers（物理剖面，保留連接路徑） |
| V5 | 門檻分流與工時 | split、compare |
| EE274 | 區間縮小 | interval（共同座標） |

## 驗收

依範本 README「驗收」工程與教學兩節；另檢查 A 外觀一致性（色票、線條、無殘留藍色硬編碼）。未做讀者試讀。

## 驗收紀錄（2026-09-28）

各篇細節：[database-paper.md](database-paper.md)、[cowos-paper.md](cowos-paper.md)、[v5-paper.md](v5-paper.md)、[ee274-paper.md](ee274-paper.md)。TCP 由主 agent 完成：逐 byte 格子讓切段大小可數；第 7、8、9 頁補「原本保留」列，互動頁由同一模型推出上一步的緩衝區。

共用 reader：token 化並改 A 色票；`--blue`／`--orange` 留作別名。修正既存 bug：`.index-item small`／`.preview small` 會套到縮圖內主題的 `<small>`（TCP 第 1 頁縮圖可見），收窄為 reader 自己的標記。範本 `story.css` 改用 token。

整合時主 agent 另修：CoWoS 第 4 頁 detail 與新圖矛盾（仍寫「焊球另畫」）；V5 滑桿填色由朱紅改墨色（朱紅代表送複判，但滑桿填的是門檻左側）。

自動檢查（全部通過）：五篇模型檢查、`check-story-reader`、`check-story-package`、五本 strict build、`checks/paper-restyle/shoot.cjs` 五篇 × 三版面逐頁（水平溢出、頁首遮擋、pageerror）、`v5-controls.cjs`、`ee274-controls.cjs`、上一輪 `teaching-improvements/check-final.cjs` 回歸、`git diff --check`、舊藍色殘留掃描。

主 agent 看過的畫面：TCP 桌面 7、10，窄版 7，兩倍文字 9；釘選索引＋導覽展開；範本第 2 頁；資料庫互動頁與第 2 頁；CoWoS 第 4 頁；EE274 第 8 頁；V5 第 5 頁。其他頁由各子 agent 檢視。

待使用者判斷：V5 FP／TN 同色只靠括號區分；CoWoS 兩倍文字時 TSV 標籤壓到中介板標籤；EE274 1/64 區間在 320px 端點重疊；資料庫兩倍文字時時序欄很窄。未做讀者試讀、實體手機、色覺辨識測試。
