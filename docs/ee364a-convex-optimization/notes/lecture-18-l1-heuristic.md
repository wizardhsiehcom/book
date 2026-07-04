# EE364a 章節模板

每章都應從完整閱讀逐字稿後再填寫。本模板可複製到每一講的閱讀筆記或書稿初稿中。

## 基本資料

- 章節編號：18
- 章節標題：L1 Heuristics, Rank Minimization, and Practical Tips
- 對應逐字稿：Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 18 [4A5opemjRW4].en.txt
- 完整閱讀日期：2026-07-04
- 閱讀者：Antigravity Agent
- 狀態：已成章

## 逐字稿完整閱讀紀錄

閱讀範圍確認：

- 起點：1
- 終點：1883
- 是否從頭到尾完整閱讀：是
- 跳過段落：無。如有跳過，必須說明原因並回補。

## 本講主問題

如何處理實際應用中常見的非凸約束（如基數或秩約束），並在不保證全域最佳的情況下獲得實用的次佳解（heuristics）？
當遇到無法完全轉換為凸優化形式的現實問題（例如離散狀態、固定維護成本、非凸懲罰）時，工程師可以採取哪些「街頭格鬥」（street fighting）式的逼近或啟發式方法？

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| L1 Heuristic | 將基數（cardinality, $l_0$ pseudo-norm）最小化問題放寬為 L1 範數最小化問題。 | 作為核心內容詳細解釋其動機與效果。 |
| Polishing | 先用 L1 啟發式方法找出非零特徵（sparsity pattern），固定這些特徵後再次求解無正則化的原問題，以消除 L1 帶來的縮水效應。 | 列為重要技巧並舉例說明。 |
| Iterated Reweighted L1 | 迭代地求解 L1 問題，對上一步中較小或為零的變數施加更大的權重，較大的變數給予較小權重，進一步提高稀疏度。 | 說明其與順序凸優化（sequential convex optimization）的關聯。 |
| Convex Envelope | 給定非凸函數的凸包絡，即其雙共軛（F star star），是原函數最大的凸下界。 | 用於解釋 L1 作為基數函數凸包絡的理論基礎。 |
| Rank Minimization | 矩陣秩的最小化，其類比於向量的基數最小化。其凸啟發式方法為最小化奇異值之和（Nuclear Norm）。 | 在核心內容中簡述。 |
| Total Variation (TV) | 信號或影像相鄰元素差值的 L1 範數，用於去噪（denoising）時能保留信號邊緣（銳利度）。 | 作為 L1 啟發式方法的經典應用。 |

## 重要細節

- 定義：Convex envelope ($f^{**}$)，Nuclear norm（奇異值之和）。
- 定理／性質：無特別深入定理，但提及 $f^{**}$ 是最大的凸下界，基數函數在 $[-R, R]$ 區間的凸包絡是 L1 範數。
- 公式：TV denoising: minimize $\|x - x_{\text{corrupted}}\|_2^2 + \lambda \|Dx\|_1$。Iterated reweighted L1: $W_{ii} \propto 1 / (\epsilon + \|x_i\|)$。
- 演算法：Polishing (兩階段求解)、Iterated Reweighted L1。
- 板書推導：無。
- 講者例子與幾何直覺：圖解非凸函數的 convex envelope ；基因序列選擇特徵數量。
- 應用場景：Regressor selection (lasso), sparse signal reconstruction, total variation image/signal denoising, time-varying AR models, minimum trade size in finance。
- 問答重點：無特定長篇問答，但講者強調不需要太執著於「非得是全局最佳解」，工程實踐中能降低成本 20% 就很好。
- 容易忽略的提醒：L1 regularizer 會同時造成 feature selection 與 coefficient shrinkage，統計學上通常不建議 polishing，但在工程設計上（如保留少數鋼條）polishing 是必要的。

## 求解與建模的意義

說明這一講對「辨識並求解凸優化問題」的實際幫助：

- 這一講讓你能辨識／建模什麼問題：遇到需要稀疏性、矩陣低秩、或者有離散限制（如最低交易量）的非凸問題。
- 需要理解哪些最優性或對偶條件：Dual of spectral norm is nuclear norm。
- 會影響哪些後續章節：本講為最後一講，總結實用技巧，並引導至進階課程。

## 書稿章節草稿

見對應章節草稿。

## 跨章連結

- 前置章節：凸函數、對偶性。
- 後續章節：無。
- 需要回頭補充的術語：無。
- 需要新增的圖表：基數函數與其 L1 凸包絡的對比圖。

## 相關教材與作業

此段只建立關聯，不提供作業解答。若材料尚未核對或資訊不足，必須保留 `待補`，不可自行腦補。

- 對應 slides（`data/EE364A/course material/slids/`）：待補
- 對應教科書章節／頁碼（`Convex Optimization` PDF）：待補
- Assignment / 考試關聯（course.md，標學期版本）：待補
- 材料狀態：待補
- 缺少的材料或 URL：待補

## 資訊不足與待補清單

遇到本地沒有、使用者未提供、或無法可靠取得的資訊時，列在這裡，不要寫成已確認事實。

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| 對應投影片 | 投影片 PDF | 待補 |
| 作業與考試關聯 | 作業清單 | 待補 |

## 外部補充

外部搜尋只在逐字稿完整閱讀與本章初稿完成後進行。

| 來源 | URL | 補充重點 | 是否納入書稿 |
|---|---|---|---|
| 待填 | 待填 | 待填 | 待填 |

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-04 | 建立 | 初稿完成 |

## Worker 回報欄

章節 worker 完成後，需在最終回報中列出：

- 完整閱讀的逐字稿檔名：Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 18 [4A5opemjRW4].en.txt
- 逐字稿總行數：1883
- 本講實際講題：L1 Heuristics, Rank Minimization, and Practical Tips
- 新增或修改檔案：notes/lecture-18-l1-heuristic.md, 18-l1-heuristic.md
- 本講核心概念：L1 Heuristic, Polishing, Iterated Reweighted L1, Convex Envelope, Rank Minimization
- 需要主控 agent 複查的點：請確認是否需要額外引入具體的程式碼範例。
- 缺少的材料或需要使用者提供的 URL：Slides 與作業對應。
- 是否使用外部資料：否。
