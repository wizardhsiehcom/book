# EE364a 章節模板

每章都應從完整閱讀逐字稿後再填寫。本模板可複製到每一講的閱讀筆記或書稿初稿中。

## 基本資料

- 章節編號：10
- 章節標題：統計估計與強健近似 (Statistical Estimation and Robust Approximation)
- 對應逐字稿：Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 10 [N3V2AdTImJE].en.txt
- 完整閱讀日期：2026-07-04
- 閱讀者：Antigravity Agent
- 狀態：已完整讀完

## 逐字稿完整閱讀紀錄

閱讀範圍確認：

- 起點：第 1 行
- 終點：第 1991 行
- 是否從頭到尾完整閱讀：是
- 跳過段落：無。

## 本講主問題

本講主要解決如何在面對不確定性或噪音干擾時，利用凸優化方法進行穩健的模型配適與信號重建。探討了不同懲罰函數（如 L1、Huber、Dead zone）的統計意義與幾何直覺。最後介紹了如何將參數分佈估計（如最大似然估計、羅吉斯回歸）及假設檢定轉化為凸優化問題。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| L1 懲罰與稀疏性 (Sparsity) | L1 範數作為懲罰函數時，會促使最佳解中出現大量零值（稀疏性）。對應到信號處理中的總變差 (Total Variation) 平滑，能保留信號的突變邊緣。 | 在信號重建與平滑化的小節中詳細對比 L1 與二次平滑的差異。 |
| 強健近似 (Robust Approximation) | 面對矩陣 $A$ 存在不確定性時的近似方法，包括隨機模型 (Stochastic)、最差情況 (Worst-case) 等。 | 獨立成節，說明處理不確定性的策略。 |
| Tikhonov 正則化 (Ridge Regression) | 等同於在最小平方法中假設矩陣 $A$ 受到獨立的高斯隨機擾動。 | 作為強健最小平方法的具體案例。 |
| 最大似然估計 (Maximum Likelihood Estimation) | 尋找使觀測資料發生機率最大的參數。當對數似然函數為凹函數時，即為凸優化問題。 | 闡述不同噪音假設對應的優化目標（高斯 $\rightarrow$ 最小平方，拉普拉斯 $\rightarrow$ L1，Huber $\rightarrow$ Huber 函數）。 |
| 羅吉斯回歸 (Logistic Regression) | 用於二元分類的統計模型，其對數似然函數是凹函數。當資料線性可分時，對數似然函數無上界。 | 作為最大似然估計的重要應用範例。 |
| 假設檢定 (Hypothesis Testing) | 判斷樣本來自哪個分佈。尋找最佳偵測器（包含隨機偵測器與確定性偵測器）是一個多目標優化問題，可簡化為線性規劃。 | 獨立成節，介紹檢定與偵測器矩陣的概念。 |

## 重要細節

- 定義：隨機偵測器矩陣 (Randomized detector matrix)、對數似然函數 (Log-likelihood function)。
- 定理／性質：當噪音為拉普拉斯分佈時，最大似然估計等同於 L1 估計；當噪音為高斯分佈時，等同於最小平方估計。
- 公式：總變差 (Total variation) 懲罰：$\sum \|x_{i+1} - x_i\|_1$。
- 演算法：無特定複雜演算法，均轉化為標準凸優化。
- 板書推導：從強健最小平方法 (Stochastic robust least squares) 展開期望值，推導出 Tikhonov 正則化項。
- 講者例子與幾何直覺：舉例影像去噪中，二次平滑會使邊緣模糊，而全變差去噪 (Total variation denoising) 會產生「卡通化」或塊狀等值的效果。
- 應用場景：火箭推進器推力設計（稀疏性）、影像與訊號去噪、供應鏈不確定性處理。
- 問答重點：關於資料線性可分時羅吉斯回歸的行為，講者引導學生推導出此時邊界會變得「無限陡峭」，對應目標函數無上界。
- 容易忽略的提醒：最大似然估計的凸性要求是對數似然函數對**參數**為凹函數，這與前面章節提到的「對數凹分佈 (log-concave density) 對變數為凹」不完全相同，需小心區分。

## 求解與建模的意義

說明這一講對「辨識並求解凸優化問題」的實際幫助：

- 這一講讓你能辨識／建模什麼問題：能夠將含有不確定性的問題建立為強健優化模型，並能將各種統計估計問題（MLE、MAP、假設檢定）建模為凸優化問題。
- 需要理解哪些最優性或對偶條件：無特別強調對偶性，主要著重於目標函數的建模與轉換。
- 會影響哪些後續章節：會影響後續關於統計、機器學習應用以及更進階的不確定性處理章節。

## 書稿章節草稿

詳見 `10-statistical-estimation.md`

## 跨章連結

- 前置章節：近似與配適 (Approximation and Fitting)、無約束優化基本概念。
- 後續章節：機器學習與統計應用、強健優化進階。
- 需要回頭補充的術語：無。
- 需要新增的圖表：二次平滑與 L1 平滑的對比圖、羅吉斯回歸的 S 型曲線圖。

## 相關教材與作業

- 對應 slides（`data/EE364A/course material/slids/`）：待補
- 對應教科書章節／頁碼（`Convex Optimization` PDF）：待補
- Assignment / 考試關聯（course.md，標學期版本）：待補
- 材料狀態：待補
- 缺少的材料或 URL：待補

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| 對應 Slides 頁數 | 課程 Slides 檔案 | 待補 |
| 教科書具體對應頁碼 | 教科書 PDF | 待補 |
| 作業關聯 | 課程作業 PDF | 待補 |

## 外部補充

| 來源 | URL | 補充重點 | 是否納入書稿 |
|---|---|---|---|
| 待填 | 待填 | 待填 | 待填 |

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-04 | 建立 | 由 Antigravity 建立初稿 |

## Worker 回報欄

章節 worker 完成後，需在最終回報中列出：

- 完整閱讀的逐字稿檔名：Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 10 [N3V2AdTImJE].en.txt
- 逐字稿總行數：1991
- 本講實際講題：Statistical Estimation and Robust Approximation
- 新增或修改檔案：`docs/ee364a-convex-optimization/notes/lecture-10-statistical-estimation.md`, `docs/ee364a-convex-optimization/10-statistical-estimation.md`
- 本講核心概念：懲罰函數與稀疏性、總變差去噪、強健近似與 Tikhonov 正則化、最大似然估計與懲罰函數的等價性、羅吉斯回歸、隨機假設檢定。
- 需要主控 agent 複查的點：教材與作業對應（目前為待補）、Mermaid 標籤是否完全符合規範。
- 缺少的材料或需要使用者提供的 URL：Slides、作業關聯。
- 是否使用外部資料：否。
