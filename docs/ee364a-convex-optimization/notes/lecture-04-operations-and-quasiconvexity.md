# Lecture 4 閱讀筆記：保凸運算與擬凸性

## 基本資料

- 對應逐字稿：`data/EE364A/transcripts/Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 4 [U2HRwA7XePU].en.txt`
- 完整閱讀日期：2026-07-04
- 閱讀範圍：逐字稿第 1 行到第 1876 行（完整）
- 是否從頭到尾完整閱讀：是，無跳段
- 狀態：已完整讀完、已抽象、已成章
- 講者：Stephen Boyd

## 本講主問題

這一講延續凸函數，主軸是「**constructive convex analysis（建構式凸分析）**」：實務上幾乎不回頭查定義或算 Hessian，而是記住一批基礎凸函數與凸集，再用一套**保凸運算規則**把它們組合、轉換出來，並確保凸性被保留。全講依序講保凸運算（縮放、加總、仿射前置、逐點最大／supremum、composition、partial minimization、perspective、conjugate），最後轉入凸性的兩個有用推廣（quasiconvex，並預告 log-convex）。這也是所有凸優化軟體（DCP）的運作基礎。

## 重要主線

1. 辨識凸性有兩條路：回定義／算 Hessian（很罕見），或**建構式**地用規則組合（實務主流，也是程式碼的做法）。
2. 簡單規則：正數縮放（$3.7f$）、兩凸函數相加、仿射前置 $f(Ax+b)$ 皆保凸；這些多是三行證明，「有人得證，但不是我」。
3. 逐點最大保凸：piecewise-linear = 一組仿射函數取 max；「最大 $k$ 個分量之和」（甚至「最大 5.6 個分量之和」）是凸的；推廣到 supremum，$y$ 可以是任何東西（向量、圖上的路徑、排列）。
4. supremum 例子：support function $\sup_{y\in C} y^\top x$（$C$ 不必凸）、到集合的**最遠**距離、對稱矩陣的**最大特徵值** $\lambda_{\max}(X)=\sup_{\|y\|=1} y^\top X y$（關鍵：$y^\top X y$ 對 $X$ 是**線性**的，要隨時提醒自己誰是變數）。
5. **Composition（本講最重要）**：
   - 純量版：$h$ 凸且遞增、$g$ 凸 $\Rightarrow$ $h\circ g$ 凸；$h$ 凸且遞減、$g$ 凹 $\Rightarrow$ 凸。例 $e^{g(x)}$、$1/g(x)$（$g$ 正的凹函數）。
   - 助記：假設一切在 $\mathbb{R}$、可微，$f''=h''(g)\,g'^2 + h'(g)\,g''$，用 0/1/2 階導數的符號算術即可。
   - 向量版一般式（**一條規則統包一切**）：$H$ 凸，且對每個引數擇一成立：(a) 引數仿射（$H$ 無單調性要求）；(b) 引數凸且 $H$ 對該引數遞增；(c) 引數凹且 $H$ 對該引數遞減。可自由 mix and match。
   - 這條規則涵蓋「凸函數之和」「max」等所有先前規則；例：log-sum-exp（soft max）套凸函數仍凸。
   - **逆命題不成立**：composition rule 失敗，函數仍可能凸。
   - 這是 **DCP（disciplined convex programming）** 的唯一核心：走運算式樹（expression tree），對每個節點問 curvature／monotonicity，逐節點檢查此規則即可驗證整式凸性。
6. **Partial minimization**：$f(x,y)$ **jointly convex**、對 $y$ 在凸集上取 min $\Rightarrow$ 對 $x$ 凸。joint convex 是強條件（$xy$ 對各自變數線性但非 jointly convex）。二次型例 → **Schur complement**；連結 dynamic programming 的 value function。
7. **Perspective**：$g(x,t)=t\,f(x/t)$、$t>0$，$f$ 凸 $\Rightarrow$ $g$ 凸（不顯然）。例：$x^\top x \Rightarrow \sum x_i^2/t$（quadratic-over-linear）；$-\log x \Rightarrow$ 相對熵 / KL divergence。
8. **Conjugate（共軛函數）**：$f^*(y)=\sup_x\,(y^\top x - f(x))$；即使 $f$ 非凸，$f^*$ 必凸（仿射函數的 supremum）。經濟解讀：$x$ 產量、$f(x)$ 成本、$y$ 價格、$y^\top x - f(x)$ 利潤，$f^*(y)=$ 最優利潤。biconjugate $f^{**}$ = convex envelope（epigraph 取 convex hull）；$f$ 凸且閉時 $f^{**}=f$。例：$-\log$ 的共軛仍像 $-\log$；$\tfrac12 x^\top Q x$（$Q\succ0$）的共軛是 $\tfrac12 y^\top Q^{-1} y$。
9. **Quasiconvex（擬凸 / unimodal）**：所有 sublevel set 皆凸。一維 = 先降後升。例：$\sqrt{|x|}$、$\lceil x\rceil$。整數值凸函數討論：基本上只有常數（外加病態邊界例子）。cardinality $\operatorname{card}(x)=$ 非零分量數（投資組合的「名目數 / number of names」）非凸。**IRR（內部報酬率）** quasiconcave：super-level set 是 $[0,R]$ 上所有半空間的交集 → 凸。quasiconvex 有 modified Jensen：$f(\theta x+(1-\theta)y)\le \max\{f(x),f(y)\}$。
10. 最後預告下一個推廣 **log-convexity**，本講未展開，留待下次（Boyd：「太陽會在下週二講約 20 分鐘後出來」）。

## 重要細節

- 「最大 5.6 個分量之和」= 最大 5 個之和 + $0.6\times$ 第 6 大分量；仍是一堆線性函數取 max，故凸。
- 最大特徵值沒有解析公式（五次以上多項式無根式解，約 200 年前證明），但數值上天天在算；重點是它作為 $\sup y^\top X y$ 是線性函數的 supremum，故凸。
- composition 助記推導（板書）：一次微分 $h'(g)g'$，二次微分 $h''(g)g'^2 + h'(g)g''$，逐項判號。以「$h$ 凸遞減、$g$ 凹」為例：$g''\le0$、$h'(g)\le0$ 相乘 $\ge0$；$g'^2\ge0$、$h''(g)\ge0$ 相乘 $\ge0$；兩非負相加 $\ge0$ = 凸。
- 病態「sick function」示例（用 composition 一般式驗證凸）：$\dfrac{(\mathbf{1}^\top x)^2}{\min\{2,\ \sqrt{x_3}\}}$，因 $x^2/y$（$y>0$）jointly convex、對 $x$ 非單調（放 affine）、對 $y$ 遞減（放 concave），而分母 $\min\{2,\sqrt{x_3}\}$ 為兩凹函數取 min 故凹。
- s 型（sign）相依單調性：$x^2/y$ 對 $x$ 一般非單調，但若已知 $x\ge0$ 則可視為遞增——單調性可依定義域附加資訊而改變。
- joint convex 幾何：在 $xy$ 平面只沿水平或垂直走曲率都對，但 45 度斜切（如 $xy$）曲率可能向下。
- 「沒有 concave set（凹集）這種東西」：只有凸集；concave 只用於函數（與 concave 透鏡／鏡面）。
- Schur complement：對 $\begin{bmatrix}A&B\\B^\top&C\end{bmatrix}$ 消去 $y$ 得 $A-BC^{-1}B^\top$；原塊矩陣 PSD 則 Schur complement 亦 PSD。出現在 conditioning Gaussian、電路端點條件、幾乎所有工程領域。
- IRR 定義：使 net present value $\text{PV}(x,R)=\sum_i x_i (1+R)^{-i}=0$ 的最小利率；假設 $x_0<0$（先投入）且 $\sum_i x_i>0$（總額為正）。$\text{PV}$ 對 $x$ 對每個固定 $r$ 是線性 → 半空間；IRR$\ge R$ 需在 $[0,R]$ 所有半空間交集內 → 凸。

## 求解與建模的意義

- 這一講給你「不查定義就能判斷凸性」的完整工具箱，是把實務問題化簡成凸問題（Lecture 1 主題）時實際會用的手法。
- DCP = composition rule 的機器化，直接對應 CVXPY 等軟體怎麼驗證你寫下的運算式是否凸，是後續寫程式建模的基礎。
- conjugate 會在 Duality 章成為核心；perspective、partial minimization / Schur complement 會在建模與矩陣不等式反覆出現。
- quasiconvex 讓你辨識一批「不是凸但仍可有效處理（bisection over sublevel sets）」的目標，如 IRR。

## 跨章連結

- 前置章節：Lecture 1 導論（辨識並化簡成凸）、Lecture 2–3 凸集與凸函數定義（本講建立在凸集、凸函數、epigraph、sublevel set、perspective / linear-fractional 映射之上；這些前置講次尚未成章，待補）。
- 後續章節：Duality（conjugate 中心角色）、Convex optimization problems（quasiconvex 問題的求解）、Numerical linear algebra（Schur complement）。
- 需要回頭補充的術語：epigraph、sublevel set、support function、perspective 映射、linear-fractional 映射（應於 Lecture 2–3 定義）。

## 相關教材與作業

- 對應 slides：`data/EE364A/course material/slids/03_Convex functions.pdf`（Convex functions，後半段：operations that preserve convexity、composition、conjugate、quasiconvex）。狀態：待核對逐頁對應。
- 對應教科書：《Convex Optimization》（Boyd & Vandenberghe）第 3 章 Convex functions，約 §3.2（保凸運算）、§3.2.4–3.2.5（composition/minimization/perspective）、§3.3（conjugate）、§3.4（quasiconvex）。狀態：`待補`（頁碼未核對）。
- 一般式 composition 規則：Boyd 提到「應該有一題作業，其實本該是書上的一題」。狀態：`待補`（作業編號未知，2023 版）。
- log-convex（§3.5）本講僅預告，內容留待 Lecture 5。

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| slides 逐頁與教科書頁碼對應 | `03_Convex functions.pdf` / 教科書 PDF | 待補 |
| 一般式 composition 對應的作業題號 | 2023 作業檔 | 待補 |
| 五次無根式解、Schur complement 等歷史／定理編號 | 教科書 | 標 待補，不杜撰 |

## Worker 回報欄

- 完整閱讀的逐字稿檔名：`Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 4 [U2HRwA7XePU].en.txt`
- 逐字稿總行數：1876 行（第 1–1876 行全讀）
- 本講實際講題：保凸運算與擬凸性（Operations that preserve convexity, and quasiconvexity；constructive convex analysis / DCP 基礎）
- 新增或修改檔案：本筆記 + `04-operations-and-quasiconvexity.md`
- 是否使用外部資料：否
