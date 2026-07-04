# Lecture 3 閱讀筆記：凸函數（含廣義不等式與對偶錐收尾）

## 基本資料

- 對應逐字稿：`data/EE364A/transcripts/Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 3 [1menqhfNzzo].en.txt`
- 完整閱讀日期：2026-07-04
- 閱讀範圍：逐字稿第 1 行到第 2045 行（完整，從頭到尾逐行讀完）
- 是否從頭到尾完整閱讀：是；無跳過段落
- 狀態：已完整讀完、已抽象、已成章
- 講者：Stephen Boyd（EE364a，2023）

## 本講主問題

這一講先把「凸集」章節收尾（最小元 vs 極小元、分離超平面、支撐超平面、對偶錐與廣義不等式），再正式進入「凸函數」。Boyd 反覆強調此時仍是「毫無動機的背景數學」（unmotivated background material），本週會在週五左右結束純數學階段，之後才轉入有趣的應用。全講要回答的是：什麼是凸函數、怎麼辨識它、以及為什麼「局部資訊能給出全域結論」是整門課的核心。

## 本講主線（依逐字稿順序）

1. 廣義不等式回顧（承上一講）：用 proper cone 定義不等式；實務只用兩個錐——非負卦限（比較向量，逐元素）與半正定錐（比較對稱矩陣，差為 PSD）。廣義不等式**不是全序（total / linear ordering）**，可能兩個向量互不可比。
2. 無限集合的 min 要換成 **infimum（下確界）**；不熟就先當成 min。
3. 向量不等式下，min 的概念**分裂成兩個不同概念**：**最小元（minimum）** 與 **極小元（minimal）**。
   - 最小元：集合中一點，其餘所有點都「可比且 $\succeq$ 它」；若存在則唯一。
   - 極小元：沒有其他點 $\preceq$ 它（除自身）。極小元可以有很多個。
   - 兩者都是**相對於某個特定錐**而言；換錐答案可能改變（Boyd 現場用 R2 換一個小錐示範，結論 X2 仍極小）。
4. **分離超平面定理（separating hyperplane theorem）**：兩個不相交（disjoint）凸集，可用一個超平面隔開。存在非零 $a$ 與 $b$，使 $a^\top x \le b$ 於 C、$a^\top x \ge b$ 於 D。Boyd 說「幾乎整門課都建立在這張圖上」，第五週會對應到經濟學的「無套利（no arbitrage）」。ML 裡叫「線性可分」。strict 分離等變體看書即可，不必記。
5. **支撐超平面定理（supporting hyperplane theorem）**：集合邊界上一點，存在通過該點、把整個集合放在其一側的超平面（roughly 切線）。凸集在每個邊界點都有支撐超平面；有 kink 的點可以有多個；凹進去的角點沒有。逆定理也成立（每個邊界點都有支撐超平面 → 凸）。
6. **對偶錐（dual cone）** $K^* = \{y \mid y^\top x \ge 0,\ \forall x \in K\}$。類比線性代數的正交補 $V^\perp$；概念上「用不等式做線性代數」。
   - 例：Singleton $\{0\}$ 的對偶是 $\mathbf{R}^2$；$\mathbf{R}^2$ 的對偶是 $\{0\}$。**小錐 ↔ 大錐**（像時間有限訊號 ↔ 頻寬很寬的共軛概念）。
   - 射線（ray）的對偶是半空間（half space）。
   - 非負卦限 $\mathbf{R}^n_+$ **自對偶（self-dual）**。
   - 「對偶的對偶＝自身」是反覆出現的 meta 概念。
7. 最小元與對偶錐的連結：$x$ 是 $S$ 的最小元 ⟺ 對**任意** $\lambda \succ_{K^*} 0$，$x$ 都是 $\min \lambda^\top z$ 的唯一最小者（不論權重怎麼取都到同一點）。極小元則是：取**某個**正權重 $\lambda$ 去最小化線性函數，得到的就是極小點（多目標優化的加權法 → Pareto 最優）。
8. 經濟學嬰兒範例：生產集合（production set），fuel/labor 都是正價值時「往左下都更好」；不效率的選擇是「stupid choice」；這就是 Pareto 最優 / 極小點。
9. **凸函數定義**：$f:\mathbf{R}^n\to\mathbf{R}$，domain 為凸集，且 $f(\theta x+(1-\theta)y)\le \theta f(x)+(1-\theta)f(y)$。幾何：**弦（chord）在圖形上方**＝**非負曲率**＝二階導號正。concave 是 $-f$ 為凸。strict convex 是 $0<\theta<1$ 時嚴格不等。
10. R 上的例子：affine（$ax+b$，等號成立）、exp（$e^{ax}$）、正冪 $x^a$（$a\ge1$）與負冪、negative entropy $x\log x$。concave：$\sqrt{x}$、$x^{0.7}$、$\log x$。R 上檢查凸性＝腦中畫圖。
11. $\mathbf{R}^n$ 上例子：affine（既凸又凹）、任意 norm（含 p-norm，$p\ge1$；1-norm、2-norm、$\infty$-norm）。矩陣上的函數：det、trace、norm。affine on matrix ＝ $\mathrm{tr}(A^\top X)+b$；並現場驗證 $\mathrm{tr}(A^\top B)=\sum_{ij}A_{ij}B_{ij}$ 是矩陣內積。**譜範數（spectral / 最大奇異值）** 是凸函數，且維度 >5 時無解析式（五次以上多項式無根式解），但仍照用。
12. **限制到直線（restriction to a line）**：$f$ 凸 ⟺ 對每條直線，$g(t)=f(x_0+tv)$ 都凸。可當數值檢查法（隨機取直線畫圖）。用它證明 **$\log\det X$ 在正定矩陣上凹**（1905 年就知道！）。板書推導：沿 $X+tV$，$g(t)=\log\det X + \sum_i \log(1+t\lambda_i)$，$\lambda_i$ 為 $X^{-1/2}VX^{-1/2}$ 的特徵值；$\log(1+t\lambda)$ 對任意 $\lambda$ 皆凹，凹之和為凹。
13. **擴充值延拓（extended-value extension）**：$\tilde f(x)=f(x)$ 在 domain 內，否則 $=+\infty$。把「出界」自然編碼成 $+\infty$，方便表達約束；不等式仍成立。
14. **一階條件**：$f$ 可微且凸 ⟺ domain 凸且 $f(y)\ge f(x)+\nabla f(x)^\top (y-x)$。意義：一階泰勒近似是**全域下界（global underestimator）**。這是「從局部資訊得到全域結論」——Boyd 說「這其實是整門課的重點」。梯度是行向量（column vector），是所有偏導數。
15. **二階條件**：$f$ 二次可微 ⟹（凸 ⟺ Hessian $\nabla^2 f(x)\succeq 0$ 於所有點）。Hessian 是曲率的度量。
16. 例子：二次函數 $\tfrac12 x^\top Px + q^\top x + r$，$\nabla=Px+q$，$\nabla^2=P$，凸 ⟺ $P\succeq0$。最小平方 $\|Ax-b\|^2$，Hessian $=2A^\top A\succeq0$。
17. $f(x,y)=x^2/y$（$y>0$）**聯合凸**（不只各別凸）；Hessian 是 rank-1 PSD。**警告**：各變數分別凸 **不等於** 聯合凸；反例 $f(x,y)=xy$（saddle，Hessian 特徵值 $\pm1$）。附帶「PSD 矩陣任一元素 $\le$ 對應對角元的幾何平均」性質。
18. **log-sum-exp**（softmax / 又名 Boltzmann function / EE 的 dB 合成公式）：凸；Hessian 是 PSD 減 rank-1 仍 PSD（需證）。是 max 的光滑近似。**幾何平均**（n 個非負數的 n 次方根）為凹。
19. **凸集 vs 凸函數的連結**：（a）**次水平集（sublevel set）** $\{x\mid f(x)\le\alpha\}$，凸函數的次水平集為凸（反之不真）。（b）**上圖（epigraph, epi f）**：$f$ 凸 ⟺ epi $f$ 為凸集——這才是兩個「凸」的真正橋樑。統計例子：負對數似然的次水平集 ＝ 對數似然的超水平集 ＝ 信賴區域；近最大似然點的超水平集在多維呈**橢球**，曲率由 **Fisher 資訊矩陣**給出。沒有「凹集」這種東西。
20. **Jensen 不等式**：即凸定義本身；推廣到期望 $f(\mathbf E Z)\le \mathbf E f(Z)$。兩點分布是特例。直覺：「抖動 / 風險使目標變差」——繞著標稱值波動，因非負曲率，結果總是往上。Jensen 約 120 年前把眾人各自用的不等式「編碼」成凸性概念。
21. **建構式凸性分析（constructive convexity analysis）** 的預告：不用定義、不用 Hessian、不用梯度，而是用 **atoms（20–50 個已知凸/凹函數）＋ calculus rules（組合規則）**。例：正倍數、和、affine 預合成（$f(Ax+b)$ 凸）。log-barrier $-\sum\log(b_i-a_i^\top x)$：concave of affine → concave，和為 concave，負號轉成 convex。此法「100% 可落地成程式碼」，兩週後會用（DCP / CVXPY 前導）。

## 重要細節速記

- 定義：dual cone、minimum、minimal、separating/supporting hyperplane、sublevel set、epigraph、Jensen、extended-value extension、convex/concave/strictly convex。
- 定理／性質：凸集每邊界點有支撐超平面（及逆）；不相交凸集可分離；$f$ 凸 ⟺ 限制到任意直線凸 ⟺ epi f 凸 ⟺（可微）一階下界 ⟺（二次可微）Hessian PSD。
- 板書推導：$\log\det$ 凹（沿直線 + 特徵值 + $\log(1+t\lambda)$ 凹）。
- 反例：$xy$ 各別凸但非聯合凸（Hessian 特徵值 $\pm1$）。
- 講者例子：Singleton/R2/ray/非負卦限的對偶錐；生產集合經濟學；照明無；統計信賴橢球 + Fisher 資訊。
- 容易忽略：向量不等式非全序；min→infimum；梯度是行向量；`minimize` 精神延續 Lecture 1；domain of log 在此課是 $\mathbf R_{++}$。

## 求解與建模的意義

- 這一講讓你能：辨識一個函數是否凸（三種等價判準 + atoms/rules），以及理解「凸 → 局部即全域」為何讓最優值成為可信的全域界。
- 需要理解的最優性線索：極小元 ↔ 加權線性掃描（多目標 / Pareto）；一階條件是後續最優性條件（KKT）的雛形；分離/支撐超平面是對偶（Lecture 5）的幾何基礎。
- 影響後續章節：凸優化問題（Ch4）、對偶（Ch5，asterisk 與無套利）、內點法的 log-barrier（Ch11-12）、DCP/CVXPY（兩週後）。

## 跨章連結

- 前置：Lecture 1（凸函數定義、非負曲率、最小平方/LP）、Lecture 2（凸集、cone、廣義不等式——本講前半是其收尾）。
- 後續：Lecture 4 會接著講 convexity-preserving operations（本講結尾只起了頭）；Ch4 凸優化問題；Ch5 對偶（分離超平面、self-dual）；DCP。
- 需回頭補的術語：proper cone、PSD 錐、infimum（若前面章節未定義）。

## 相關教材與作業

只建立關聯，不提供解答；未核對處保留 `待補`。

- 對應 slides：`data/EE364A/course material/slids/02_Convex sets.pdf`（dual cone、separating/supporting hyperplane、minimum/minimal 為第 2 章尾段）與 `03_Convex functions.pdf`（凸函數主體）。狀態：待核對頁碼。
- 對應教科書：《Convex Optimization》(Boyd & Vandenberghe) 第 2 章尾（2.5–2.6 分離/支撐超平面與對偶錐、廣義不等式）＋第 3 章（凸函數，3.1–3.2）。狀態：待核對節號頁碼。
- Assignment / 考試：期中範圍含 Ch.1–4 + DCP（依附錄課務版本，屬 2025–26；2023 逐字稿只提及本週為背景數學、homework 1）。狀態：待核對。
- 材料狀態：待核對。

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| slides 精確頁碼對應 | 02/03 PDF | 待補 |
| 教科書節號頁碼 | Convex Optimization PDF | 待補 |
| log-sum-exp / geometric mean 之 Hessian PSD 完整證明 | Boyd 未展開 | 標「需證」，不自行補公式 |

## 存疑（ASR 誤轉）

- 「vurp / vur / V per」＝ $V^\perp$（正交補）。
- 「Koshi Schwarz」＝ Cauchy–Schwarz。
- 「chesy factorization」＝ Cholesky 分解。
- 「boltman function」＝ Boltzmann function（存疑，Boyd 亦稱不確定）。
- 「Pito optimal」＝ Pareto optimal。
- 「I 488 / I 4A」＝某數值/訊號工具或課程代號，未定；標 存疑。
- 「high BBC mathematics」＝ Boyd 慣用語，指通用的「正式數學方言」。

## Worker 回報欄

- 逐字稿檔名：見上；總行數：2045。
- 實際講題：凸函數（含凸集章節收尾：極小元、分離/支撐超平面、對偶錐）。
- 新增檔案：本筆記 + `03-convex-functions.md`。
- 是否使用外部資料：否。
