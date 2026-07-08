# MIT 14.12 逐字稿閱讀追蹤表

閱讀狀態定義：

- `未開始`：尚未開啟逐字稿。
- `閱讀中`：已開始從頭閱讀，但尚未讀到最後。
- `已完整讀完`：已從第一個字讀到最後一個字。
- `已抽象`：已完成該講的抽象筆記。
- `已成章`：已整理成書稿章節。
- `已外補`：已完成網路補充與引用整理。

> 主要閱讀來源為 `data/mit14-12/clean/*.txt`（清理版，單行含標點）；`data/mit14-12/raw/*.vtt` 為次要參照，僅在懷疑清理錯誤時回查。檔名含全形冒號「：」，路徑須完全照抄。大小以 bytes 計。

| 編號 | 課程主題 | 逐字稿（主要來源） | 大小（bytes） | 狀態 | 閱讀筆記 | 書稿章節 |
|---:|---|---|---:|---|---|---|
| 01 | Introduction to Individual Decision-Making | `data/mit14-12/clean/01 - Lecture 1： Introduction to Individual Decision-Making.txt` | 51,867 | 未開始 | 待補 | 待補 |
| 02 | Representation of Games | `data/mit14-12/clean/02 - Lecture 2： Representation of Games.txt` | 63,228 | 未開始 | 待補 | 待補 |
| 03 | Dominance | `data/mit14-12/clean/03 - Lecture 3： Dominance.txt` | 62,218 | 未開始 | 待補 | 待補 |
| 04 | Rationalizability | `data/mit14-12/clean/04 - Lecture 4： Rationalizability.txt` | 67,196 | 未開始 | 待補 | 待補 |
| 05 | Nash Equilibrium | `data/mit14-12/clean/05 - Lecture 5： Nash Equilibrium.txt` | 69,170 | 未開始 | 待補 | 待補 |
| 06 | Imperfect Competition | `data/mit14-12/clean/06 - Lecture 6： Imperfect Competition.txt` | 68,164 | 未開始 | 待補 | 待補 |
| 07 | Zero-Sum Games | `data/mit14-12/clean/07 - Lecture 7： Zero-Sum Games.txt` | 65,835 | 未開始 | 待補 | 待補 |
| 08 | Backward Induction | `data/mit14-12/clean/08 - Lecture 8： Backward Induction.txt` | 65,051 | 未開始 | 待補 | 待補 |
| 09 | Negotiation | `data/mit14-12/clean/09 - Lecture 9： Negotiation.txt` | 57,460 | 未開始 | 待補 | 待補 |
| 10 | Subgame-Perfect Nash Equilibrium | `data/mit14-12/clean/10 - Lecture 10： Subgame-Perfect Nash Equilibrium.txt` | 61,332 | 未開始 | 待補 | 待補 |
| 11 | One-Shot Deviation Principle and Bargaining | `data/mit14-12/clean/11 - Lecture 11： One-Shot Deviation Principle and Bargaining.txt` | 67,049 | 未開始 | 待補 | 待補 |
| 12 | Finitely Repeated Games | `data/mit14-12/clean/12 - Lecture 12： Finitely Repeated Games.txt` | 57,478 | 未開始 | 待補 | 待補 |
| 13 | Infinitely Repeated Games | `data/mit14-12/clean/13 - Lecture 13： Infinitely Repeated Games.txt` | 66,720 | 未開始 | 待補 | 待補 |
| 14 | Folk Theorem | `data/mit14-12/clean/14 - Lecture 14： Folk Theorem.txt` | 58,661 | 未開始 | 待補 | 待補 |
| 15 | Implicit Cartels | `data/mit14-12/clean/15 - Lecture 15： Implicit Cartels.txt` | 68,709 | 未開始 | 待補 | 待補 |
| 16 | Bayesian Games | `data/mit14-12/clean/16 - Lecture 16： Bayesian Games.txt` | 71,004 | 未開始 | 待補 | 待補 |
| 17 | Bayesian Nash Equilibrium: Applications | `data/mit14-12/clean/17 - Lecture 17： Bayesian Nash Equilibrium： Applications.txt` | 62,862 | 未開始 | 待補 | 待補 |
| 18 | Auctions | `data/mit14-12/clean/18 - Lecture 18： Auctions.txt` | 62,413 | 未開始 | 待補 | 待補 |
| 19 | Revenue Equivalence | `data/mit14-12/clean/19 - Lecture 19： Revenue Equivalence.txt` | 66,003 | 未開始 | 待補 | 待補 |
| 20 | Ad Auctions | `data/mit14-12/clean/20 - Lecture 20： Ad Auctions.txt` | 63,624 | 未開始 | 待補 | 待補 |
| 21 | Perfect Bayesian Equilibrium | `data/mit14-12/clean/21 - Lecture 21： Perfect Bayesian Equilibrium.txt` | 65,716 | 未開始 | 待補 | 待補 |
| 22 | Signaling | `data/mit14-12/clean/22 - Lecture 22： Signaling.txt` | 70,095 | 未開始 | 待補 | 待補 |
| 23 | Bargaining with Incomplete Information | `data/mit14-12/clean/23 - Lecture 23： Bargaining with Incomplete Information.txt` | 70,804 | 未開始 | 待補 | 待補 |
| 24 | Cheap Talk | `data/mit14-12/clean/24 - Lecture 24： Cheap Talk.txt` | 58,908 | 未開始 | 待補 | 待補 |
| 25 | Common Knowledge | `data/mit14-12/clean/25 - Lecture 25： Common Knowledge.txt` | 41,863 | 未開始 | 待補 | 待補 |

## Agent 派工批次

| 批次 | 範圍 | 建議 worker 數 | 狀態 | 備註 |
|---|---|---:|---|---|
| Batch 0 | 書籍骨架 | 主控 agent | 未開始 | 建立 `docs/mit14-12-game-theory/`、config、README、glossary、references、章節 stub。 |
| Batch 1 | Lecture 1–4 | 4 | 未開始 | 導論與個體決策、賽局表示、優勢、可理性化。 |
| Batch 2 | Lecture 5–7 | 3 | 未開始 | Nash 均衡、不完全競爭、零和賽局。 |
| Batch 3 | Lecture 8–11 | 4 | 未開始 | 逆向歸納、談判、子賽局完美、一次偏離原理與議價。 |
| Batch 4 | Lecture 12–15 | 3–4 | 未開始 | 重複賽局系列（有限、無限、Folk 定理、隱性卡特爾）；主題連續，可兩講併派。 |
| Batch 5 | Lecture 16–20 | 4 | 未開始 | 貝氏賽局、BNE 應用、拍賣、收益等價、廣告拍賣；L18–19 主題連續可併派。 |
| Batch 6 | Lecture 21–25 | 4–5 | 未開始 | PBE、訊號傳遞、不完全訊息議價、cheap talk、共同知識。 |
| Batch 7 | 全書整合 | 主控 agent | 未開始 | 統一術語與符號、解概念鏈跨章導讀、術語表、出版化整理。 |
| Batch 8 | 外部補充 | 1–2 | 未開始 | OCW 官方頁核對（講者、學期、syllabus）、經典文獻引用。 |

## 資訊不足追蹤

本表只追蹤已知缺口；不可為了填滿欄位而推測不存在的材料。

| 類型 | 範圍 | 缺少資訊 | 目前處理 | 需要使用者提供 |
|---|---|---|---|---|
| 講者與學期 | 全課 | 逐字稿開頭未自報講者姓名與開課學期 | 標 `待查`，第 6 階段由 OCW 或影片來源確認 | 若知道課程來源（OCW 版本／YouTube 播放清單），請提供連結 |
| Slides / 板書 | 全課 | 無投影片或板書照片；矩陣與賽局樹只能依口語重建 | 依口語重建並標明；無法重建者標 `待補` | 若有官方 lecture notes 或 slides，請提供 |
| Syllabus / reading | 全課 | 無課綱、無指定教科書或 reading 清單 | 標記待補 | 若有 syllabus 或 reading list，請提供 |
| 習題 | 全課 | 無 problem sets | 標記待補，書稿不自創習題冒充課程內容 | 若有官方 problem sets，請提供 |
