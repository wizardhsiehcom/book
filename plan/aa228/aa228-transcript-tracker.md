# AA228V 逐字稿與筆記追蹤表

本表格用於追蹤 `data/aa228/transcripts/` 中 17 份逐字稿的處理進度。
目標是將每份逐字稿轉換為「個人閱讀筆記」與「繁體中文章節草稿」，並關聯對應的 Julia Notebooks。

## 處理進度

| 講次 | 影片主題 | 原始檔名 | 狀態 | 筆記檔案 | 草稿檔案 |
|---|---|---|---|---|---|
| 01 | Introduction & Overview | `data/aa228/transcripts/Stanford AA228V I Validation of Safety Critical Systems I Introduction & Overview [hE9iWwMZANE].txt` | 已成章 | `plan/aa228/notes/01-introduction.md` | `docs/aa228-safety-critical-systems/README.md` |
| 02 | System Modeling | `data/aa228/transcripts/Stanford AA228V I Validation of Safety Critical Systems I System Modeling [6-qnwn23Iq4].txt` | 已成章 | `plan/aa228/notes/02-system-modeling.md` | `docs/aa228-safety-critical-systems/02-system-modeling.md` |
| 03 | Property Specification 1 | `data/aa228/transcripts/Stanford AA228V I Validation of Safety Critical Systems I Property Specification 1 [AgZH1k9yObs].txt` | 已成章 | `plan/aa228/notes/03-property-specification-1.md` | `docs/aa228-safety-critical-systems/03-property-specification-1.md` |
| 04 | Property Specification 2 | `data/aa228/transcripts/Stanford AA228V I Validation of Safety Critical Systems I Property Specification 2 [rBGh5uJhAmo].txt` | 已成章 | `plan/aa228/notes/04-property-specification-2.md` | `docs/aa228-safety-critical-systems/04-property-specification-2.md` |
| 05 | Discrete Reachability | `data/aa228/transcripts/Stanford AA228V I Validation of Safety Critical Systems I Discrete Reachability [GysI7p6y1Hs].txt` | 已成章 | `plan/aa228/notes/05-discrete-reachability.md` | `docs/aa228-safety-critical-systems/05-discrete-reachability.md` |
| 06 | Reachability for Linear Systems | `data/aa228/transcripts/Stanford AA228V I Validation of Safety Critical Systems I Reachability for Linear Systems [jwR2excDAJo].txt` | 已成章 | `plan/aa228/notes/06-linear-reachability.md` | `docs/aa228-safety-critical-systems/06-linear-reachability.md` |
| 07 | Reachability for Nonlinear Systems | `data/aa228/transcripts/Stanford AA228V I Validation of Safety Critical Systems I Reachability for Nonlinear Systems [KsR5zqAS_GE].txt` | 已成章 | `plan/aa228/notes/07-nonlinear-reachability.md` | `docs/aa228-safety-critical-systems/07-nonlinear-reachability.md` |
| 08 | Falsification through Optimization | `data/aa228/transcripts/Stanford AA228V I Validation of Safety Critical Systems I Falsification through Optimization [iO6OACXaF1Q].txt` | 已成章 | `plan/aa228/notes/08-falsification-optimization.md` | `docs/aa228-safety-critical-systems/08-falsification-optimization.md` |
| 09 | Falsification through Planning | `data/aa228/transcripts/Stanford AA228V I Validation of Safety Critical Systems I Falsification through Planning [162ToWqAMnc].txt` | 已成章 | `plan/aa228/notes/09-falsification-planning.md` | `docs/aa228-safety-critical-systems/09-falsification-planning.md` |
| 10 | Failure Distribution | `data/aa228/transcripts/Stanford AA228V I Validation of Safety Critical Systems I Failure Distribution [7bZcHXJIaUo].txt` | 已成章 | `plan/aa228/notes/10-failure-distribution.md` | `docs/aa228-safety-critical-systems/10-failure-distribution.md` |
| 11 | Importance Sampling | `data/aa228/transcripts/Stanford AA228V I Validation of Safety Critical Systems I Importance Sampling [mzl8uer5qUc].txt` | 已成章 | `plan/aa228/notes/11-importance-sampling.md` | `docs/aa228-safety-critical-systems/11-importance-sampling.md` |
| 12 | Adaptive Importance Sampling | `data/aa228/transcripts/Stanford AA228V I Validation of Safety Critical Systems I Adaptive Importance Sampling [qspZyUkolbA].txt` | 已成章 | `plan/aa228/notes/12-adaptive-importance-sampling.md` | `docs/aa228-safety-critical-systems/12-adaptive-importance-sampling.md` |
| 13 | Runtime Monitoring | `data/aa228/transcripts/Stanford AA228V I Validation of Safety Critical Systems I Runtime Monitoring [uDaHF-rIXb0].txt` | 已成章 | `plan/aa228/notes/13-runtime-monitoring.md` | `docs/aa228-safety-critical-systems/13-runtime-monitoring.md` |
| 14 | Explainability 1 | `data/aa228/transcripts/Stanford AA228V I Validation of Safety Critical Systems I Explainability [IKSQ7IxBLxQ].txt` | 已成章 | `plan/aa228/notes/14-explainability-1.md` | `docs/aa228-safety-critical-systems/14-explainability-1.md` |
| 15 | Explainability 2 | `data/aa228/transcripts/Stanford AA228V I Validation of Safety Critical Systems I Explainability [_U0EUX2E3k0].txt` | 已成章 | `plan/aa228/notes/15-explainability-2.md` | `docs/aa228-safety-critical-systems/15-explainability-2.md` |
| 16 | Guest Lecture: Somil Bansal | `data/aa228/transcripts/Stanford AA228V I Validation of Safety Critical Systems I Guest Lecture： Somil Bansal, Stanford [OU67A1tyfmc].txt` | 已成章 | `plan/aa228/notes/16-guest-bansal.md` | `docs/aa228-safety-critical-systems/16-guest-bansal.md` |
| 17 | Guest Lecture: Anthony Corso | `data/aa228/transcripts/Stanford AA228V I Validation of Safety Critical Systems I Guest Lecture： Anthony Corso, Terra AI [v6edojW2vJI].txt` | 已成章 | `plan/aa228/notes/17-guest-corso.md` | `docs/aa228-safety-critical-systems/17-guest-corso.md` |

## Agent 派工批次

| 批次 | 涵蓋講次 | 分配 Agent 數量 | 狀態 | 備註 |
|---|---|---|---|---|
| Batch 0 | 01, 02 | 2 | 已完成 | 熟悉 Julia Notebooks (smc.jl 等) 的整合流程 |
| Batch 1 | 03, 04, 05 | 3 | 已完成 | Property Spec & Discrete Reachability |
| Batch 2 | 06, 07, 08, 09 | 4 | 已完成 | Continuous Reachability & Falsification |
| Batch 3 | 10, 11, 12, 13 | 4 | 已完成 | Probabilistic Methods & Runtime |
| Batch 4 | 14, 15, 16, 17 | 4 | 已完成 | Explainability & Guests |
