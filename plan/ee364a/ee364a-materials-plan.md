# EE364a 教材與課程資源整合計畫

管理 `data/EE364A/` 內非逐字稿材料（教科書、slides、course.md 行政資訊），以「關聯層」方式連到章節，不打散混入書稿主線。

## 材料清單（本地已存在）

| 材料 | 本地路徑 | 說明 | 狀態 |
|---|---|---|---|
| 教科書 PDF | `data/EE364A/course material/Convex Optimization (Stephen Boyd) ....pdf` | Boyd & Vandenberghe《Convex Optimization》全書（約 5.2 MB） | 已存在，未逐頁核對 |
| 課程網頁 | `data/EE364A/course.md` | 2025–2026 夏季學期課程頁（中英對照），含 staff、schedule、grading、LLM policy | 已存在 |
| Slides 01 | `data/EE364A/course material/slids/01_Introduction.pdf` | Introduction | 待讀後對應講次 |
| Slides 02 | `.../slids/02_Convex sets.pdf` | Convex sets | 待讀後對應講次 |
| Slides 03 | `.../slids/03_Convex functions.pdf` | Convex functions | 待讀後對應講次 |
| Slides 04 | `.../slids/04_Convex optimization problems.pdf` | Convex optimization problems | 待讀後對應講次 |
| Slides 05 | `.../slids/05_Duality.pdf` | Duality | 待讀後對應講次 |
| Slides 06 | `.../slids/06_Approximation and fitting.pdf` | Approximation and fitting | 待讀後對應講次 |
| Slides 07 | `.../slids/07_Statistical estimation.pdf` | Statistical estimation | 待讀後對應講次 |
| Slides 08 | `.../slids/08_Geometric problems.pdf` | Geometric problems | 待讀後對應講次 |
| Slides 09 | `.../slids/09_Numerical linear algebra background.pdf` | Numerical linear algebra background | 待讀後對應講次 |
| Slides 10 | `.../slids/10_Unconstrained minimization.pdf` | Unconstrained minimization | 待讀後對應講次 |
| Slides 11 | `.../slids/11_Equality constrained minimization.pdf` | Equality constrained minimization | 待讀後對應講次 |
| Slides 12 | `.../slids/12_Interior-point methods.pdf` | Interior-point methods | 待讀後對應講次 |
| Slides 13 | `.../slids/13_Conclusions.pdf` | Conclusions | 待讀後對應講次 |

> 註：資料夾拼字為 `slids`（原始命名），路徑照實引用。

## Slides ↔ Lecture 對應

13 份 slides 對應 18 講，**非一對一**（部分主題跨多講）。對應關係只能在對應講次逐字稿完整讀完後，由內容比對確認，**不可依編號猜測**。

| Slides | Slides 主題 | 對應 Lecture | 狀態 |
|---|---|---|---|
| 01 | Introduction | Lecture 01 | 已對應 |
| 02 | Convex sets | Lecture 02-03 | 已對應 |
| 03 | Convex functions | Lecture 03-04 | 已對應 |
| 04 | Convex optimization problems | Lecture 05-07 | 已對應 |
| 05 | Duality | Lecture 07-09 | 已對應 |
| 06 | Approximation and fitting | Lecture 09 | 已對應 |
| 07 | Statistical estimation | Lecture 10 | 已對應 |
| 08 | Geometric problems | Lecture 11-12 | 已對應 |
| 09 | Numerical linear algebra background | Lecture 12-13 | 已對應 |
| 10 | Unconstrained minimization | Lecture 13-14 | 已對應 |
| 11 | Equality constrained minimization | Lecture 15 | 已對應 |
| 12 | Interior-point methods | Lecture 16-17 | 已對應 |
| 13 | Conclusions | Lecture 17-18 | 已對應 |

## 教科書使用原則

- 教科書只作對照與補充，不取代逐字稿。
- 引用定理／習題／頁碼前必須開 PDF 核對，未核對前標 `待補`。
- 逐字稿與教科書說法不同時，以逐字稿為書稿主線，並在附錄註明差異。

## 行政資訊（course.md，2025–2026 學期）

以下屬 2025–2026 夏季學期版本，**只放附錄並標學期**，不可當成 2023 逐字稿版本的事實：

| 項目 | 內容（來源 course.md） |
|---|---|
| 授課教師 | Logan Bell、Nikhil Devanathan |
| 助教 | Jaewook (David) Lee |
| 上課時間 | 週二、週四 12:00–14:00，Skilling Auditorium，首堂 6/23 |
| 期中 | 7/16 課堂考，範圍 Ch. 1–4 與 DCP |
| 期末 | 8/14 現場考 12:15–15:15 |
| 評分 | 作業 10%、期中 25%、期末 65% |
| 先修 | 線性代數（EE263）、機率、基本 Python（CVXPY） |
| LLM 政策 | 允許作業使用 LLM，但需自行驗證正確性 |

> deadline 與確切日期屬該學期，若要引用最新版本需使用者提供官方 Ed／課程頁。

## 待補清單

| 缺口 | 需要 | 暫定處理 |
|---|---|---|
| slides ↔ lecture 對應 | 讀完各講逐字稿後比對 | `待讀後確認` |
| 教科書定理／習題編號 | 開 PDF 核對 | `待補` |
| CVXPY 教程、範例、補充材料連結 | course.md 只列名稱未附本地檔 | `待補`，需 URL 或下載 |
| 2023 版本行政資訊 | 逐字稿為 2023 但無 2023 課程頁 | 只用逐字稿內容，不補行政細節 |
