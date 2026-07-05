# CS234 逐字稿閱讀追蹤表

閱讀狀態定義：

- `未開始`：尚未開啟逐字稿。
- `閱讀中`：已開始從頭閱讀，但尚未讀到最後。
- `已完整讀完`：已從第一個字讀到最後一個字。
- `已抽象`：已完成該講的抽象筆記。
- `已成章`：已整理成書稿章節。
- `已外補`：已完成網路補充與引用整理。

> 說明：逐字稿為**單行檔案**（無換行），大小以位元組記錄。檔名已含講題，「課程主題」欄先以檔名填入，讀完後確認或修正。書稿章節檔名沿用 `configs/cs234-reinforcement-learning.yml` nav 既定名稱。

| 編號 | 課程主題（檔名，讀後確認） | 逐字稿 | 大小 (bytes) | 狀態 | 閱讀紀錄 | 書稿章節 |
|---:|---|---|---:|---|---|---|
| 01 | Introduction to RL | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Introduction to Reinforcement Learning I 2024 I Lecture 1 [WsvFL-LjA6U].txt` | 71,751 | 已成章 | 2026-07-05，全文 71,751 bytes，主控 agent（Batch 0） | `01-introduction.md` |
| 02 | Tabular MDP Planning | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Tabular MDP Planning I 2024 I Lecture 2 [gHdsUUGcBC0].txt` | 64,655 | 已成章 | 2026-07-05，全文 64,655 bytes | `02-tabular-mdp.md` |
| 03 | Policy Evaluation | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Policy Evaluation I 2024 I Lecture 3 [jjq51TRNVvk].txt` | 62,365 | 已成章 | 2026-07-05，全文 62,365 bytes | `03-policy-evaluation.md` |
| 04 | Q-learning and Function Approximation | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Q learning and Function Approximation I 2024 I Lecture 4 [b_wvosA70f8].txt` | 66,792 | 已成章 | 2026-07-05，全文 66,792 bytes | `04-q-learning.md` |
| 05 | Policy Search 1 | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Policy Search 1 I 2024 I Lecture 5 [L6OVEmV3NcE].txt` | 60,587 | 已成章 | 2026-07-05，全文 60,587 bytes | `05-policy-search-1.md` |
| 06 | Policy Search 2 | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Policy Search 2 I 2024 I Lecture 6 [8PwvNQ5WS-o].txt` | 67,115 | 已成章 | 2026-07-05，全文 67,115 bytes | `06-policy-search-2.md` |
| 07 | Policy Search 3 | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Policy Search 3 I 2024 I Lecture 7 [4ngb0IZTg8I].txt` | 62,448 | 已成章 | 2026-07-05，全文 62,448 bytes | `07-policy-search-3.md` |
| 08 | Offline RL 1 | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Offline RL 1 I 2024 I Lecture 8 [IEbuJtjqtMU].txt` | 64,274 | 已成章 | 2026-07-05，全文 64,274 bytes | `08-offline-rl-1.md` |
| 09 | Guest Lecture: DPO（Rafailov / Sharma / Mitchell） | `data/cs234/transcripts/Stanford CS234 I Guest Lecture on DPO： Rafael Rafailov, Archit Sharma, Eric Mitchell I Lecture 9 [Q7rl8ovBWwQ].txt` | 78,691 | 已成章 | 2026-07-05，全文 78,691 bytes | `09-guest-dpo.md` |
| 10 | Offline RL 3 | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Offline RL 3 I 2024 I Lecture 10 [F6APGIAm5fw].txt` | 68,602 | 已成章 | 2026-07-05，全文 68,602 bytes | `10-offline-rl-3.md` |
| 11 | Exploration 1 | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Exploration 1 I 2024 I Lecture 11 [sqYii3nd78w].txt` | 58,964 | 已成章 | 2026-07-05，全文 58,964 bytes | `11-exploration-1.md` |
| 12 | Exploration 2 | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Exploration 2 I 2024 I Lecture 12 [gFJNsfg_35E].txt` | 65,119 | 已成章 | 2026-07-05，全文 65,119 bytes | `12-exploration-2.md` |
| 13 | Exploration 3 | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Exploration 3 I 2024 I Lecture 13 [pc7oayCSZmQ].txt` | 59,091 | 已成章 | 2026-07-05，全文 59,091 bytes | `13-exploration-3.md` |
| 14 | Multi-Agent Game Playing | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Multi-Agent Game Playing I 2024 I Lecture 14 [UgANzoWc0nc].txt` | 67,708 | 已成章 | 2026-07-05，全文 67,708 bytes | `14-multi-agent.md` |
| 15 | 待讀後確認（檔名僅標 Emma Brunskill & Dan Webber） | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Emma Brunskill & Dan Webber I 2024 I Lecture 15 [FOlPpjNbHjE].txt` | 58,043 | 已成章 | 2026-07-05，全文 58,043 bytes | `15-guest-brunskill.md` |
| 16 | Value Alignment | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Value Alignment I 2024 I Lecture 16 [eenJzay5aLo].txt` | 60,809 | 已成章 | 2026-07-05，全文 60,809 bytes | `16-value-alignment.md` |

## Agent 派工批次

| 批次 | 範圍 | 建議 worker 數 | 狀態 | 備註 |
|---|---|---:|---|---|
| Batch 0 | 骨架核對、Lecture 1 | 主控 agent | 已完成 | 附錄骨架已建立（appendix-glossary.md、appendix-references.md）；nav 已更新；L1 完整閱讀 71,751 bytes；01-introduction.md 已成章；build 通過。 |
| Batch 1 | Lecture 2-5 | 4 | 已完成 | — |
| Batch 2 | Lecture 6-9 | 4 | 已完成 | 含 L9 DPO 客座講座。 |
| Batch 3 | Lecture 10-13 | 4 | 已完成 | — |
| Batch 4 | Lecture 14-16 | 3 | 已完成 | 含 L15 講題待確認。 |
| Batch 5 | 教材與課程資源整合 | 1 到 2 | 未開始 | Sutton & Barto 對照；slides／作業本地未見，待補。 |
| Batch 6 | 外部補充與全書整合 | 1 到 3 | 未開始 | — |

## 資訊不足追蹤

本表只追蹤已知缺口；不可為了填滿欄位而推測不存在的材料。

| 類型 | 範圍 | 缺少資訊 | 目前處理 | 需要使用者提供 |
|---|---|---|---|---|
| 講題 | Lecture 15 | 檔名僅標講者（Emma Brunskill & Dan Webber），未含主題 | tracker 標 `待讀後確認`，讀完回填 | 無；讀完逐字稿即可確認 |
| 講次結構 | Offline RL 系列 | 檔名有 Offline RL 1（L8）與 Offline RL 3（L10），無 Offline RL 2；L9 為 DPO 客座 | 讀完 L8-L10 後確認系列結構與是否缺講 | 若官方另有 Offline RL 2 影片/逐字稿，需使用者提供 |
| 學期 | 全課程 | 既有 README 標「Winter 2026/Spring 2024」，與檔名 2024 不一致 | 以檔名 2024 為準；README 待修正 | 若需精確學期（Spring/Winter），提供官方課程頁 |
| 材料 | slides / 作業 / 課程頁 | 本地僅有 Sutton & Barto PDF，無 slides、作業、官方排程 | `cs234-materials-plan.md` 標 `待補` | 若要整合，需使用者下載至 `data/cs234/` 或提供 URL |
| 格式 | 全部逐字稿 | 單行無換行檔案，行數不可用 | 閱讀範圍以字元數記錄 | 無 |
