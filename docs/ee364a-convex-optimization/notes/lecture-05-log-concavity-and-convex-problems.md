# Lecture 5 閱讀筆記：對數凹性與凸優化問題

## 基本資料

- 對應逐字稿：`data/EE364A/transcripts/Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 5 [AAjG1TQcL7c].en.txt`
- 完整閱讀日期：2026-07-04
- 閱讀範圍：逐字稿第 1 行到第 1908 行（完整，無跳段）
- 狀態：已完整讀完、已抽象、已成章
- 講者：Stephen Boyd

## 本講主問題

Boyd 開場說今天是整門課的「情緒最低點」與轉折點（inflection point）：前面兩週幾乎純數學（凸集、凸函數、辨識規則），從今天下半段開始「往上爬」，逐步接近可以真正 coding、可以行動（actionable）的東西。這一講因此分兩半：

1. **收尾凸性的兩個有用推廣**：對數凹／對數凸函數（log-concave / log-convex），以及對廣義不等式的凸性（K-convexity）。
2. **正式進入「問題」（problems）**：什麼是優化問題、標準形式、可行／最優／局部最優、隱含 vs 顯式約束、可行性問題、凸優化問題的定義、等價問題與各種變換、最優性條件、擬凸優化的二分法。

貫穿全講的底層論點：**凸優化問題是可解的（tractable）**，這才是「一個問題是凸的」真正重要之處——不是為了做數學宣稱，而是能真的解出來。

## 重要主線

### A. 對數凹／對數凸函數

1. 定義：正函數 $f$ 若 $\log f$ 為凹，稱 log-concave；若 $\log f$ 為凸，稱 log-convex。
2. 奇怪的不對稱：log-concave 到處都是（統計、經濟），log-convex 幾乎查不到。Boyd 不知道原因。
3. 對 Jensen 取 log 再取指數：$f(\theta x+(1-\theta)y)\ge f(x)^\theta f(y)^{1-\theta}$（加權**幾何**平均；凹則是加權算術平均）。$\theta=1/2$ 就是兩值的幾何平均。
4. 例子：冪函數 $x^a$，$a<0$ 為 log-convex，$a\ge0$ 為 log-concave。
5. 標準例：$\mathbb R^n$ 上的常態密度是 log-concave（取 log = 常數 + 負二次式，$\Sigma\succ0$ 故凹）。密度為 log-concave 的測度稱 log-concave measure，在統計、經濟很重要；「擬合一個 log-concave 分布」是很合理的 regularizer（Boyd 標為進階，可略）。
6. 大量常見機率密度是 log-concave（Boyd 說「大概一半以上具名密度」）。
7. 高斯 CDF $\Phi$ 是 log-concave——完全不顯然，是有提示的作業題。更一般：**任何 log-concave 密度的 CDF 也是 log-concave**（本講稍後會看到）。
8. 二階條件：由 $\nabla^2\log f\preceq0$ 整理得 $f(x)\nabla^2 f(x)\preceq \nabla f(x)\nabla f(x)^\top$（右邊 rank 1）。含義：$f\cdot$Hessian $\preceq$ rank-one → Hessian 至多一個正特徵值。
9. 乘積規則：log-concave 的乘積仍 log-concave（取 log 變成凹函數之和）。
10. **和不封閉**：log-concave 函數之和未必 log-concave。反例：兩個高斯密度相加，出現雙峰（bump-谷-bump），連 quasiconcave 都不是（中間彎下去）。

### B. 積分規則（1973 年才知道）與其應用

11. 積分規則：若 $f(x,y)$ 對 $(x,y)$ 聯合 log-concave，對 $y$ 積分掉，得 $g(x)=\int f(x,y)\,dy$ 仍 log-concave。Boyd 說「就我所知這要到 1973 年才知道」，證明不簡單。**逐字稿未給定理名稱，不臆造。**
12. 推論一：log-concavity 在**卷積**下保持 → 兩個各自 log-concave 密度的獨立隨機變數相加，其密度仍 log-concave。
13. 推論二：$C\subseteq\mathbb R^n$ 為凸集、$Y$ 有 log-concave 密度，則 $x\mapsto \Pr(x+Y\in C)$ 是 $x$ 的 log-concave 函數。證明：寫成 $\int p(y)\,g(x+y)\,dy$，$g$ 是 $C$ 的 0/1 指示函數（log 在 $C$ 內為 0、外為 $-\infty$，故 log-concave），$g(x+y)$ 是 log-concave 前置合成仿射，被積式聯合 log-concave，積掉 $y$ 得 log-concave。
14. **良率（yield）應用**：$x$ = 產品標稱／目標參數，$S$ = 可接受集合，$w$ = 製造隨機擾動（設為高斯），良率 $Y(x)=\Pr(x+w\in S)$。良率是 log-concave。故良率區域 $\{x:Y(x)\ge\alpha\}$ 是**凸集**（凹函數 $\log Y$ 的超水平集）；可能為空（那就沒轍）。
15. 幾何直覺（2D 高斯示例）：目標落在集合外 → 10%；壓在一個邊界 → 略低於 50%（半空間恰 50%）；目標放中心 → 90%~95%。要最大良率就瞄準集合「中心」。附帶：一維區間的中心無爭議（中點），但二維以上「集合的中心」有很多種定義，課程後面會談。

### C. 對廣義不等式的凸性（K-convexity）

16. $f:\mathbb R^n\to\mathbb R^m$ 向量值，$K$ 為 proper cone。$f$ 為 K-convex：Jensen 兩邊皆向量，用 $\preceq_K$。
17. 名例（矩陣凸）：$F(X)=X^2$，$X$ 對稱、$K$ 為半正定錐。要證 $(\theta X+(1-\theta)Y)^2\preceq\theta X^2+(1-\theta)Y^2$，等價於對所有 $z$ 有 $z^\top(\cdot)z\ge0$，化約成純量凸函數而成立。
18. 警告：不是每個「聽起來該凸」的都成立。Boyd 舉「對稱矩陣的指數 $e^X$」聽起來該矩陣凸，但他認為不是（**Boyd 自己也不確定，說 "I could be wrong"，標 存疑**）。

Boyd 建議：每隔一陣子花半小時回頭重讀第 1、2、3 章某一段，兩週前看不懂的會開始通，而且會連上別的東西。

### D. 優化問題（正式定義）

19. 把問題視為 CS 意義的**物件**：屬性有 objective（minimize $f_0(x)$）、inequality constraints 清單 $f_i(x)\le0$、equality constraints 清單 $h_i(x)=0$。
20. `minimize` 不是 `min`。`min` 是數學運算子（有限集取最小），`minimize` 是問題的建構子。Boyd 偷懶在黑板寫 `Min.`（加句點）代表 minimize。
21. 最優值 $p^\star=\inf\{f_0(x):x\text{ 可行}\}$。star 不是 asterisk（asterisk 保留給共軛等，兩週後）。
22. 病態一：可行集為空 → $p^\star=+\infty$（空集的 inf 定為 $+\infty$），即 infeasible。
23. 病態二：$p^\star=-\infty$，unbounded below（有一列可行點目標無限往下）。風險趨避控制裡戲稱 **euphoric breakdown**（欣快崩潰）。兩者都是病態、實務上通常代表你問題建錯了。
24. 可行點：在目標定義域內且滿足約束。最優點：可行且值 $=p^\star$。$X_{\text{opt}}$ 為最優點集合，是**凸集**（$p^\star$ 水平下集合 ∩ 可行集）。
25. 局部最優：在受限鄰域內最優。
26. 一連串小例子（見下方「例子」）。

### E. 隱含 vs 顯式約束、無約束、可行性問題

27. 問題定義域 = 所有 $f_0,f_i,h_i$ 定義域的交集。提出定義域外的 $x$ 比 infeasible 還糟——根本無法評估。
28. 隱含約束：只因寫下某函數就自帶。本課「社會契約」：$\log$ 定義域 $\mathbb R_{++}$、$1/x$ 定義域 $\mathbb R_{++}$，寫下就隱含正性。
29. 顯式約束：實際寫出的 $f_i\le0,h_i=0$。
30. 無約束問題：無顯式約束（但可有隱含約束，如 $\min -\sum\log(b_i-a_i^\top x)$ 隱含 $a_i^\top x<b_i$）。
31. 可行性問題：「find $x$ s.t. 約束」。等於 minimize $0$ s.t. 約束；可行則 $p^\star=0$（且該點即最優），不可行則 $p^\star=+\infty$。約束是 hard constraints（不可談判）。應用：經濟學「無套利」（no arbitrage）就是一個可行性問題。Boyd 對某些人另立「satisficing problem」理論頗不以為然。

### F. 凸優化問題

32. 定義：標準形式 + 曲率限制——$f_0$ 凸、$f_i$ 凸（$\le0$）、等式約束**仿射**（$Ax=b$）。即目標非負曲率、不等式非負曲率、等式零曲率。
33. 為何等式要仿射？Boyd 誠實版答案：「因為這是定義。」
34. 凸性依賴**表述**（objective/約束函數），不只看可行集。
35. 例：minimize $x_1^2+x_2^2$ s.t. $x_1/(1+x_2^2)\le0,\ (x_1+x_2)^2=0$。$f_1$ 不凸、$h$ 不仿射 → 非凸問題。`is_convex` 走查：objective 凸=true；inequality 凸=false（game over）；equality 仿射=false。
36. 等價改寫：minimize $x_1^2+x_2^2$ s.t. $x_1\le0,\ x_1+x_2=0$ → 這是凸的。兩者**等價（equivalent）但不相等（equal）**：`==` 會比對每條約束函數，故為 false。**非凸問題可以等價於凸問題**。等價 ≠ 同一個 $p^\star$；等價指有簡單方法把一者的解轉成另一者的解（CS 的 reduction，但本課用非正式版）。

### G. 局部＝全域、最優性條件

37. 凸問題的**任何局部最優點都是全域最優**。Boyd 用電路設計師、衛星最小燃料軌跡兩則軼事凸顯這宣稱多強。
38. 圖證：設 $x_{\text{loc}}$ 局部最優但非全域，取可行 $\tilde x$ 目標更低；連線段全可行（可行集凸），$f_0$ 沿線段是凸函數、起於 $f_0(x_{\text{loc}})$、終於更低值 → 靠近 $t=0$ 必下降 → 與局部最優矛盾。
39. 可微最優性條件：$x$ 最優 ⟺ 可行且 $\nabla f_0(x)^\top(y-x)\ge0$ 對所有可行 $y$。幾何：$-\nabla f_0$ 指向下坡並與切線正交，梯度定義了可行集的一個 supporting hyperplane。
40. 特例：無約束 → $\nabla f_0(x)=0$（否則取 $y=-t\nabla f_0$ 大 $t$ 破壞不等式）。回到微積分二，但這裡因凸性直接是全域最優，沒有「可能是極大/鞍點」的免責條款。
41. 等式約束特例 → $\nabla f_0(x)+A^\top\nu=0$（Lagrange 乘子；兩週後在 Duality 才會真正懂）。非負卦限特例也可直接算出分量條件（在邊界上想往下但不能）。

### H. 等價問題的常見變換

42. **消去等式約束**：$x=Fz+x_0$，$\mathrm{range}(F)=\mathrm{null}(A)$、$Ax_0=b$（線性代數：QR 等）。得無等式約束的 $z$ 問題，同 $p^\star$。可寫 wrapper：$b\notin\mathrm{range}(A)$ 回報 infeasible，否則解完回傳 $Fz^\star+x_0$。**天真陷阱**：以為 100 變數消成 50 變數就比較好——完全錯，後面會學到有時 100 變數反而好解。
43. **引入等式約束**（相反操作）：聽起來蠢，卻極有用（後面會見）。前置合成仿射保持凸性。
44. **鬆弛變數（slack）**：$a_i^\top x\le b_i \Rightarrow a_i^\top x+s_i=b_i,\ s_i\ge0$。源自 OR（1940 年代）。slack 取自鋼索/鏈條張力：等長時繃緊（taut），短於則零張力、鬆弛。
45. **上圖形式（epigraph）**：minimize $f_0(x)$ → minimize $t$ s.t. $f_0(x)\le t$，變數 $(x,t)$。有人說「凸優化中線性目標是 universal」。很多軟體只吃線性目標，就是預期你自行化成 epigraph form。
46. **選擇性（部分）最小化**：若能對 $x_2$ 解析最小化（如 $f_0$ 對 $x_2$ 為二次），可消去 $x_2$。這正是動態規劃的作法（value function）。部分最小化保持凸性。

### I. 擬凸優化

47. 凸不等式 + 仿射等式 + 擬凸目標 = 擬凸優化。要小心：擬凸函數可能有非全域的局部最優（平坦段例子）。
48. 解法：凸可行性 + 二分法。把擬凸 $f_0$ 的水平下集 $\{x:f_0(x)\le t\}$ 表為凸函數族 $\phi_t(x)\le0$。
49. 例：$p(x)/q(x)$，$p$ 非負凸、$q$ 正凹 → 擬凸。$p/q\le t \Leftrightarrow p(x)-t\,q(x)\le0$，對固定 $t\ge0$ 是 $x$ 的凸函數（非對 $(x,t)$ 聯合）。
50. 二分法：解可行性「是否存在 $x$ 使 $\phi_t(x)\le0$ 且滿足約束」；可行 → $p^\star\le t$，不可行 → $p^\star>t$，對 $t$ 二分。今日到此，下週四續。

## 例子清單（供書稿取用）

| 函數/問題 | 定義域 | $p^\star$ | 最優點 | 備註 |
|---|---|---|---|---|
| $x^3-3x$（無約束） | $\mathbb R$ | $-\infty$ | 無 | $x=1$ 在 $|x-1|\le0.5$ 下局部最優 |
| $1/x$ | $\mathbb R_{++}$ | $0$ | 無（未達成） | inf 不被取到 |
| $-\log x$ | $\mathbb R_{++}$ | $-\infty$ | 無 | unbounded below |
| $x\log x$（負熵） | $\mathbb R_{+}$ | $-1/e$ | $x=1/e$ | 無病態；$0\log0:=0$ 續延 |
| minimize $1/x$ s.t. $x\le3$ | $\mathbb R_{++}$ | $1/3$ | $x=3$（唯一） | well-posed |

## 求解與建模的意義

- 這一講把「凸函數辨識」正式接上「凸**問題**」：學會寫標準形式、判斷一個問題是否凸（逐屬性檢查 is_convex / is_affine）。
- 關鍵可帶走：凸問題局部＝全域；可微時 $\nabla f_0^\top(y-x)\ge0$（無約束退化成 $\nabla f_0=0$）。
- 建模工具箱：epigraph 化線性目標、slack 變數、消去/引入等式約束、部分最小化、擬凸→二分法。這些正是後面 CVXPY 幕後自動做的 reduction。
- log-concavity 直接對應良率最大化這種真實工程問題（良率區域是凸集）。

## 跨章連結

- 前置：Lecture 1 導論（優化問題三組成、minimize vs min、star 符號、快照過的凸優化）；Lecture 2 凸集（supporting hyperplane、proper cone、卦限）；Lecture 3–4 凸函數（Jensen、二階條件、擬凸、前置合成仿射保凸、部分最小化保凸）。
- 後續：Lagrange 乘子 / 最優性條件的完整版在 **Duality**（Boyd 說約兩週後，對應教科書 Ch.5、slides `05_Duality.pdf`）；「集合的中心」多種定義在後面（幾何問題，slides `08_Geometric problems.pdf` 存疑）；求解演算法（內點法等）在課程後段。
- asterisk 符號保留給共軛/對偶。

## 相關教材與材料

- 對應 slides：主體對應 `data/EE364A/course material/slids/04_Convex optimization problems.pdf`（Convex optimization problems）；開頭 log-concave / K-convex 收尾自 `03_Convex functions.pdf`。狀態：待核對逐字稿與投影片頁次對應。
- 對應教科書《Convex Optimization》（Boyd & Vandenberghe）：log-concave/K-convex 屬第 3 章（3.5、3.6 存疑）；優化問題屬第 4 章 4.1–4.2、4.4（等價變換）、4.2.5（擬凸）。狀態：**章節號待核對，頁碼待補**。
- 積分規則的定理名稱（1973）：逐字稿未給，**待補**，不臆造。

## 存疑／待補清單

| 缺口 | 需要的來源 | 暫定處理 |
|---|---|---|
| 積分規則（log-concave 積分掉一維仍 log-concave）的定理名 | 教科書 Ch.3 / 文獻 | 逐字稿只說「1973 年才知道」，標 待補 |
| 對稱矩陣指數 $e^X$ 是否矩陣凸 | 教科書 / 文獻 | Boyd 自稱不確定，標 存疑，不下結論 |
| slides / 教科書精確頁碼 | 材料整合階段核對 | 待補 |

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-04 | 建立 | 完整讀完 1908 行，產出筆記與書稿章節 |
