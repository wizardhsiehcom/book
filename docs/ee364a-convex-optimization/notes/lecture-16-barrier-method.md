# EE364a 章節模板

## 基本資料

- 章節編號：16
- 章節標題：Barrier Method
- 對應逐字稿：Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 16 [Sx7TKDFJjmk].en.txt
- 完整閱讀日期：2026-07-04
- 閱讀者：Antigravity Agent
- 狀態：已成章

## 逐字稿完整閱讀紀錄

閱讀範圍確認：

- 起點：1
- 終點：2040
- 是否從頭到尾完整閱讀：是
- 跳過段落：無

## 本講主問題

如何將帶有不等式約束的凸優化問題，轉化為可以使用牛頓法求解的無約束（或僅有等式約束）問題？本講介紹了內點法中的對數障礙法 (Logarithmic Barrier Method)，透過將不等式約束轉化為目標函數中的障礙懲罰項，並沿著中心路徑 (Central Path) 逐步逼近最優解，同時探討了如何尋找初始可行點的 Phase I 方法。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| 對數障礙函數 (Logarithmic Barrier Function) | 使用 $-\frac{1}{t}\log(-f_i(x))$ 來近似不等式約束 $f_i(x) \le 0$ 的指示函數。當 $t \to \infty$ 時逼近原約束。 | 詳細介紹其數學形式與直觀意義。 |
| 中心路徑 (Central Path) | 障礙問題的最優解 $x^\star(t)$ 隨著參數 $t$ 變化所形成的軌跡。 | 介紹中心路徑的概念，並提供幾何或力場直覺。 |
| 對偶可行性與對偶間隙 (Dual Feasibility and Duality Gap) | 中心路徑上的點自然會給出一組對偶可行解，且對偶間隙精確為 $m/t$。 | 強調這是內點法的核心優勢：能提供確切的次優性證明。 |
| 障礙法 (Barrier Method) | 結合中心路徑與牛頓法的方法。固定 $t$ 求解障礙問題後，增加 $t$（乘以 $\mu$）並以當前解作為下一次牛頓法的起點，重複此過程。| 說明演算法流程與參數 $\mu$ 的作用。 |
| 同倫方法 (Homotopy Method) | 一類藉由平滑改變參數，從一個已知易解問題的路徑追蹤到原問題解的方法。障礙法是其一種。 | 提及這個更廣泛的數學概念以深化理解。 |
| Phase I 方法 | 用於尋找一個嚴格可行初始點的方法，通常透過引入鬆弛變數 $s$ 並最小化 $s$ 達成。 | 介紹基本 Phase I 與最小化不可行性總和 (Sum of Infeasibilities) 的變體。 |

## 重要細節

- 定義：對數障礙函數 $\phi(x) = -\sum_{i=1}^m \log(-f_i(x))$。
- 定理／性質：在中心路徑上，對偶間隙等於 $m/t$（$m$ 為不等式約束個數）。
- 公式：對偶變數的構造為 $\lambda_i^\star = \frac{1}{-t f_i(x^\star(t))}$。
- 演算法：Barrier Method（內層進行 Centering step 求解牛頓法，外層更新 $t := \mu t$）。以及 Phase I 的建模方法。
- 講者例子與幾何直覺：力場解釋 (Force field interpretation) - 目標函數是恆定方向的拉力場，不等式邊界產生與距離反比的排斥力場，中心路徑上的點即為各種力達到平衡之處。
- 問答重點：冗餘的約束 (Redundant constraints) 雖然不會改變真正的可行域，但卻會產生額外的排斥力，因此「會」改變中心路徑的軌跡。
- 容易忽略的提醒：在實作障礙法時，線搜索 (Line search) 必須第一時間確保步長不會跨出定義域（即維持 $f_i(x) < 0$）。如果超出定義域卻照常計算梯度和海森矩陣，將會得到毫無意義的數值並導致災難。

## 求解與建模的意義

- 這一講讓你能辨識／建模什麼問題：任何帶有平滑不等式約束的凸優化問題。並學會處理如果沒有初始嚴格可行點時的策略 (Phase I)。
- 需要理解哪些最優性或對偶條件：理解 KKT 條件中的互補鬆弛性 (Complementary Slackness) 在此方法中被放寬為 $-\lambda_i f_i(x) = 1/t$。
- 會影響哪些後續章節：為後續探討的原始-對偶內點法 (Primal-Dual Interior-Point Methods) 以及理解底層商用求解器行為打下核心理論基礎。

## 書稿章節草稿

已撰寫於 `16-barrier-method.md`。

## 跨章連結

- 前置章節：牛頓法與無約束最佳化、KKT 條件、對偶理論。
- 後續章節：原始-對偶內點法 (Primal-Dual Methods)。
- 需要回頭補充的術語：無。
- 需要新增的圖表：中心路徑軌跡圖、力場平衡示意圖。

## 相關教材與作業

此段只建立關聯，不提供作業解答。若材料尚未核對或資訊不足，必須保留 `待補`，不可自行腦補。

- 對應 slides（`data/EE364A/course material/slids/`）：待補
- 對應教科書章節／頁碼（`Convex Optimization` PDF）：待補
- Assignment / 考試關聯（course.md，標學期版本）：待補
- 材料狀態：待補
- 缺少的材料或 URL：Slides, Homework

## 資訊不足與待補清單

遇到本地沒有、使用者未提供、或無法可靠取得的資訊時，列在這裡，不要寫成已確認事實。

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| 對應 slides | 尚未提供 | 待補 |
| 對應課本章節 | 尚未提供 | 待補 |
| Homework | 尚未提供 | 待補 |

## 外部補充

外部搜尋只在逐字稿完整閱讀與本章初稿完成後進行。

| 來源 | URL | 補充重點 | 是否納入書稿 |
|---|---|---|---|
| 待填 | 待填 | 待填 | 待填 |

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-04 | 建立 | 由 Antigravity Agent 完成初稿與閱讀筆記 |

## Worker 回報欄

章節 worker 完成後，需在最終回報中列出：

- 完整閱讀的逐字稿檔名：Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 16 [Sx7TKDFJjmk].en.txt
- 逐字稿總行數：2040
- 本講實際講題：Barrier Method
- 新增或修改檔案：
  - `docs/ee364a-convex-optimization/notes/lecture-16-barrier-method.md`
  - `docs/ee364a-convex-optimization/16-barrier-method.md`
- 本講核心概念：對數障礙函數 (Log barrier)、中心路徑 (Central Path)、障礙法 (Barrier Method)、Phase I 方法。
- 需要主控 agent 複查的點：Slide 與對應課本章節需要後續補上。
- 缺少的材料或需要使用者提供的 URL：Slides 與 Homework。
- 是否使用外部資料：否。
