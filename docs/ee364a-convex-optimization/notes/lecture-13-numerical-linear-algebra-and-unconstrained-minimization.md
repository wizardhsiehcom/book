# EE364a 章節模板

每章都應從完整閱讀逐字稿後再填寫。本模板可複製到每一講的閱讀筆記或書稿初稿中。

## 基本資料

- 章節編號：13
- 章節標題：Numerical Linear Algebra and Unconstrained Minimization
- 對應逐字稿：`Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 13 [ankx1lGi5jI].en.txt`
- 完整閱讀日期：2026-07-04
- 閱讀者：Antigravity (Chapter Worker)
- 狀態：已成章

## 逐字稿完整閱讀紀錄

閱讀範圍確認：

- 起點：line 1
- 終點：line 1958
- 是否從頭到尾完整閱讀：是
- 跳過段落：無

## 本講主問題

本講首先探討如何有效率地求解線性方程組 $Ax=b$，特別是在矩陣 $A$ 具有稀疏、帶狀或區塊等特殊結構時，如何利用矩陣分解（如 LU、Cholesky）大幅降低計算複雜度。接著，進入無約束最小化（unconstrained minimization）的主題，介紹迭代下降法（descent methods）的基本框架、線搜尋（line search）技術（特別是回溯線搜尋 backtracking line search），並分析梯度下降法（gradient descent method）的行為與收斂性，以及其在條件數差（poorly conditioned）問題中會發生的 zigzagging 現象。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| Direct Methods for $Ax=b$ | 透過 Factor 與 Solve 兩階段求解，Factor 耗時（$O(n^3)$）但 Solve 快速（$O(n^2)$），有利於相同矩陣、多個右式的求解。 | 詳述 Factor-Solve 兩階段的時間複雜度差異及其應用價值。 |
| Sparse Matrix Factorization | 稀疏矩陣分解，依賴適當的排列（permutation）來減少填充（fill-in），使得時間與空間複雜度大幅下降（例如帶狀矩陣）。 | 說明稀疏結構帶來的效能提升，以及 Permutation 選擇的重要性。 |
| Schur Complement & Block Elimination | 舒爾補與區塊消去法。透過利用容易求逆的子區塊（如對角矩陣），可將大系統轉換為較小的舒爾補系統求解。 | 解釋 Block Elimination 的步驟，強調在特定結構下能達到的線性時間複雜度。 |
| Matrix Inversion Lemma | 矩陣反演引理（Woodbury formula），用於處理對角加低秩（diagonal plus low rank）結構的逆矩陣與方程組求解。 | 介紹其「反向消去（un-elimination）」的直覺，即引入新變數來轉化結構。 |
| Unconstrained Minimization | 針對無約束、平滑凸函數的最小化迭代方法，介紹 stopping criterion 以及強凸性（strong convexity）給出的次優性上界。 | 寫出一般迭代架構，與強凸性條件下的停止準則證明。 |
| Backtracking Line Search | 回溯線搜尋，相較於精確線搜尋（exact line search）更為實用。利用 $\alpha$ 和 $\beta$ 參數遞減步長直到滿足充分下降條件。 | 圖解或文字解釋其下降條件的幾何意義。 |
| Gradient Descent Method | 梯度下降法。直觀但當 level sets 呈現狹長橢圓（高條件數）時會出現嚴重的 zigzagging，收斂緩慢。 | 解釋 zigzagging 的成因以及 level set 形狀對收斂速度的影響。 |

## 重要細節

- 定義：Schur Complement、Strong convexity (minimum curvature $m$)。
- 定理／性質：強凸性保證 $f(x) - p^* \le \frac{1}{2m}\|\nabla f(x)\|_2^2$。
- 公式：$x^{(k+1)} = x^{(k)} + t \Delta x$。Matrix Inversion Lemma。
- 演算法：Factor and Solve、Block Elimination、Backtracking line search、Gradient descent method。
- 板書推導：無明顯長篇板書，主要是代數演算法的羅列與時間複雜度分析。
- 講者例子與幾何直覺：舉例控制系統（帶狀矩陣）、量化金融因子模型（對角加低秩）；梯度下降在正圓 level set 一步到位，而在狹長 level set 會 zigzag。
- 應用場景：嵌入式控制系統、金融回測（Factor-Solve 快取）、大規模控制與訊號處理問題。
- 問答重點：如何找 permutation（啟發式算法，NP-hard 但實務上很快）、求解器何時停止（直接法是有限步驟，迭代法需看梯度 norm）。
- 容易忽略的提醒：消去法未必總是好，有時為了利用結構反而要引入變數（un-elimination）；exact line search 實務上往往不如 backtracking 簡單好用。

## 求解與建模的意義

說明這一講對「辨識並求解凸優化問題」的實際幫助：

- 這一講讓你能辨識／建模什麼問題：認出具有特殊稀疏結構或 block arrow 結構的方程組，並知道它們能被極快地求解。
- 需要理解哪些最優性或對偶條件：理解梯度 $\nabla f(x)$ 為 0 的逼近過程，以及強凸性如何給出次優性的 bound。
- 會影響哪些後續章節：為後續的 Newton's Method 與內點法（求解 KKT 系統）打下解線性方程組的數值基礎。

## 書稿章節草稿

（請參見實際章節檔案）

## 跨章連結

- 前置章節：無約束優化的基本概念。
- 後續章節：Newton's method（下一講會探討如何克服 zigzagging）。
- 需要回頭補充的術語：強凸性、Schur Complement。
- 需要新增的圖表：梯度下降 zigzagging 示意圖。

## 相關教材與作業

此段只建立關聯，不提供作業解答。若材料尚未核對或資訊不足，必須保留 `待補`，不可自行腦補。

- 對應 slides（`data/EE364A/course material/slids/`）：待補
- 對應教科書章節／頁碼（`Convex Optimization` PDF）：待補
- Assignment / 考試關聯（course.md，標學期版本）：待補
- 材料狀態：待補
- 缺少的材料或 URL：

## 資訊不足與待補清單

遇到本地沒有、使用者未提供、或無法可靠取得的資訊時，列在這裡，不要寫成已確認事實。

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| 對應 Slides 頁碼 | 官方 Slides | 待補 |
| Textbook 對應章節 | 書籍 PDF | 待補 |

## 外部補充

外部搜尋只在逐字稿完整閱讀與本章初稿完成後進行。

| 來源 | URL | 補充重點 | 是否納入書稿 |
|---|---|---|---|
| 待填 | 待填 | 待填 | 待填 |

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-04 | 建立 | 由 Antigravity 自動生成 |

## Worker 回報欄

- 完整閱讀的逐字稿檔名：`Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 13 [ankx1lGi5jI].en.txt`
- 逐字稿總行數：1958
- 本講實際講題：Numerical Linear Algebra and Unconstrained Minimization
- 新增或修改檔案：
  - `docs/ee364a-convex-optimization/notes/lecture-13-numerical-linear-algebra-and-unconstrained-minimization.md`
  - `docs/ee364a-convex-optimization/13-numerical-linear-algebra-and-unconstrained-minimization.md`
- 本講核心概念：數值線性代數（直接法、稀疏矩陣分解、Schur Complement、Matrix Inversion Lemma）、無約束最小化、線搜尋技術、梯度下降法及其 zigzagging 現象。
- 需要主控 agent 複查的點：Mermaid 圖表的標籤是否完全符合 `CLAUDE.md` 的引號要求。
- 缺少的材料或需要使用者提供的 URL：Slides 與 Textbook 具體章節。
- 是否使用外部資料：否。
