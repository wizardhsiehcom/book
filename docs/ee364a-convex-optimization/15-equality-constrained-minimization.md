# 第 15 講：Equality Constrained Minimization

## 導讀

本講將牛頓法推廣至處理等式約束（equality constraints）的平滑凸優化問題。我們將看到，這些問題的核心在於求解一系列的 KKT 線性系統。更重要的是，在實際應用中，如何利用問題本身的結構（如稀疏性、帶狀矩陣、對角加低秩結構等）來極大化求解效率。此外，本講也介紹了不可行初始點牛頓法（Infeasible Start Newton Method），解決了實務上難以找到可行初始點的問題。

## 核心內容

### 1. 等式約束的優化問題

我們考慮以下形式的問題：
$$
\begin{array}{ll}
\text{minimize} & f(x) \\
\text{subject to} & Ax = b
\end{array}
$$
其中 $f$ 是二次可微的凸函數。

### 2. 牛頓法與 KKT 系統

在此問題中，為了尋找最佳的下降方向，我們可以將原本的目標函數進行二次泰勒展開。展開後的問題等價於求解一個帶有等式約束的二次優化問題。其對應的 KKT 系統（KKT system）如下：
$$
\begin{bmatrix}
\nabla^2 f(x) & A^T \\
A & 0
\end{bmatrix}
\begin{bmatrix}
\Delta x \\
w
\end{bmatrix}
=
\begin{bmatrix}
-\nabla f(x) \\
0
\end{bmatrix}
$$
解出這組線性方程式，便能獲得牛頓步長 $\Delta x$ 以及相關的對偶變數 $w$。每一次的牛頓迭代本質上就是數值線性代數問題。

### 3. 不可行初始點牛頓法 (Infeasible Start Newton Method)

在標準的牛頓法中，初始點 $x_0$ 必須是嚴格可行的（即滿足 $Ax_0 = b$ 且在 $f$ 的定義域內）。但在實務上，找到一組可行解有時本身就像解一個線性規劃一樣困難。為此，我們可以放寬條件，使用不可行初始點牛頓法。

此方法允許初始點僅在函數的定義域內即可（例如要求 $x > 0$），而不需要滿足等式約束。它所求解的擴充系統為：
$$
\begin{bmatrix}
\nabla^2 f(x) & A^T \\
A & 0
\end{bmatrix}
\begin{bmatrix}
\Delta x \\
w
\end{bmatrix}
=
\begin{bmatrix}
-\nabla f(x) \\
-(Ax - b)
\end{bmatrix}
$$
右下角的 $-(Ax - b)$ 稱為殘差（residual）。
**重要特性**：若演算法在某次迭代中能採取步長為 $1$ 的更新（$t=1$），則下一次的迭代點就會精確地落在約束子空間內（殘差降為零），並在後續過程中保持可行。

**實作注意事項**：在進行線搜索（line search）退回時，必須確保測試點 $x + t\Delta x$ 嚴格落在目標函數 $f$ 的定義域內（例如取 $\log(x)$ 時 $x$ 必須為正）。若超出定義域則直接縮小步長，不應強行計算梯度與 Hessian，否則會產生程式錯誤。

## 定義與定理

- **KKT Matrix (KKT 矩陣)**：
  $$
  \begin{bmatrix}
  \nabla^2 f(x) & A^T \\
  A & 0
  \end{bmatrix}
  $$
  這是一個對稱矩陣，但通常不是正定的（屬於 quasi semi-definite）。在大部分合理的條件下，它是非奇異的（non-singular）。
- **牛頓遞減量 (Newton Decrement)**：可以用來作為停止條件的標準。它近似地表示了當前點距離最佳解的次優度（suboptimality）。

## 求解與應用

### 結構的利用 (Exploiting Structure)

在真實世界的應用中，矩陣通常具有特定的模式，這能讓求解複雜度從 $O(n^3)$ 大幅降至 $O(n)$：
- **對角加低秩 (Diagonal plus low rank)**：如資源分配問題中，目標函數是可分離的（separable），其 Hessian 為對角矩陣；等式約束（總預算）帶來了秩為 1 的耦合。我們可以利用區塊消去法（block elimination）在線性時間內求解。
- **帶狀矩陣 (Banded matrix)**：如最佳控制（optimal control）問題，每個時刻的狀態只與前後時刻相關，其 Hessian 的非零元素集中在主對角線附近。
- **網路流優化 (Network Flow Optimization)**：網路的節點關聯矩陣（node incidence matrix）具有極高的稀疏性。計算過程會產生極為稀疏的拉普拉斯矩陣（Laplacian matrix）。利用這些結構，即使面對擁有百萬個節點的加州電網模型，也能非常快速地完成迭代。

## 常見誤解

- **「消除約束」或「轉為對偶問題」一定比較快？**
  直覺上，將等式約束消除可以減少變數數量。但如果原始問題的 KKT 系統具有高度稀疏性，消除變數（例如乘以一個稠密的零空間矩陣）可能會破壞結構，反而使計算量從線性時間暴增為三次方時間。只要應用了智慧的線性代數演算法，求解原始問題、對偶問題或消除約束後的問題，其計算工作量其實是等價的。

## 小結

本講將等式約束優化問題化約為求解一系列的線性方程組。這意味著我們能直接引入數值線性代數領域中成熟的技術來加速計算。只要能辨識出問題隱含的結構，就不需被龐大的變數數量所限制，能以驚人的效率求解超大規模的凸優化問題。這也為後續處理不等式約束的內點法（Interior-Point Methods）打下了穩固的基礎。
