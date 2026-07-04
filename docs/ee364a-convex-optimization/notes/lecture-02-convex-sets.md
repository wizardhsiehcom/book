# Lecture 2 閱讀筆記：凸集

## 基本資料

- 對應逐字稿：`data/EE364A/transcripts/Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 2 [2H4_7izio9Y].en.txt`
- 完整閱讀日期：2026-07-04
- 閱讀範圍：逐字稿第 1 行到第 2287 行（完整，第 2288 行為空白結尾）
- 狀態：已完整讀完、已抽象、已成章
- 講者：Stephen Boyd

## 本講主問題

這是課程真正進入數學的第一講，主題是**凸集（convex sets）**。Boyd 先給凸優化的簡短歷史，再從仿射組合／凸組合出發，逐一介紹常見凸集（超平面、半空間、球與橢球、範數球與範數錐、多面體、半正定錐），最後帶出本課核心方法論：**用「保凸運算」構造凸集，做語法式（syntactic）驗證凸性**，而不是每次回到定義硬證。收尾介紹廣義不等式與 minimum／minimal 的區別。全講要訓練的實務技能是：一眼辨識一個集合是不是凸的。

## 重要主線

1. **歷史背景**：凸性作為數學領域至少 120 年（19 世紀末寫下、20 世紀初命名），到 1970 年代凸分析已「收工」；但真正起飛是 1940 年代與電腦一起，因為「everything is actionable」。simplex 法（LP）與 Stanford 的 George Dantzig；1960–80 年代蘇聯的大量工作；2000 年後統計／機器學習接手（logistic regression、SVM），其 subgradient 類方法（本課不教）後來成了訓練神經網路的方法。早期應用：1950s 航太最輕結構、1960s EE 的 FIR 濾波器設計；1990s 末～2000s 控制、訊號、通訊「開閘」。
2. **仿射與凸的層級**：線性組合 → 仿射組合（係數和為 1）→ 凸組合（係數和為 1 且非負，即 mixture／加權平均／期望值）→ 錐組合（係數非負，不必和為 1）。
3. **仿射集**：含任兩相異點連線；等於某組線性方程 $Ax=b$ 的解集（且每個仿射集都能這樣表示）。仿射集皆凸。
4. **凸集**：含任兩點的線段（「彼此有清楚視線 line of sight」）。凸包 = 所有凸組合之集 = 包含 $S$ 的最小凸集。錐（conic hull）含 0（取 $\theta=0$）。
5. **常見凸集目錄**：超平面（單一非零線性方程解集）、半空間（單一線性不等式，$a$ 是 outward normal）、Euclidean 球與橢球（多種參數化，`==` 判等不簡單，涉及旋轉）、範數與範數球（三公理：非負／定性、齊次、三角不等式）、範數錐（$\{(x,t):\|x\|\le t\}$，Euclidean 版即 second-order／Lorentzian／「ice cream」錐）、多面體／polytope（線性不等式解集＝半空間交集；bounded 用語兩派相反，本課不區分）、半正定錐 $\mathbf{S}^n_+$（$\dim \mathbf{S}^n = n(n+1)/2$；2×2 例子：對角元非負且行列式非負）。
6. **保凸運算（本講方法論核心）**：交集（可無限多個）、仿射函數的像與反像（inverse image 不需 $f$ 可逆）、透視函數 $P(x,t)=x/t$（$t>0$）、線性分式函數（perspective ∘ affine）。三角多項式例子把集合寫成無限多個 slab（雙半空間夾出的板）的交集。透視／線性分式保凸「一點都不顯然」，用「視網膜成像／無人機俯視」做幾何直覺（線段映成線段，但中點不映到中點）。
7. **廣義不等式**：由 proper cone（closed、solid＝有內部、pointed＝不含直線）定義 $x \preceq_K y \iff y-x\in K$。非負卦限給出逐元素不等式；PSD 錐給出 Löwner 序（矩陣半正定序）。R2 反例：ray 不 solid、half space 不 pointed。
8. **minimum vs minimal**：向量序非全序（total ordering），故 R 上「最小」分裂成兩個概念。minimum element：集合中所有點都與它可比且更大（很強，不一定存在）。minimal element：沒有其他點 $\preceq$ 它（除自己）。幾何上用（平移）卦限判斷。應用：多目標、Pareto 點／efficient design。

## Boyd 的教學法與金句

- 反覆提醒：接下來兩週純數學、脫離應用很正常，拿到 70% 掌握度即可，之後在應用中概念才落地。
- 「convex analysis 像線性代數，但引入不對稱（係數非負）」。
- 「以微積分為喻」：少數 atoms（基本凸集）＋少數規則（保凸運算）＝一套 calculus，做語法驗證凸性。
- 「street fighting / method zero」：寫程式隨機取兩點與 $\theta$ 檢查凸組合是否在集合內；找到反例就知非凸，找不到則「什麼都不知道」——這段講得很幽默（去吃午餐、刪掉腳本、對朋友說「憑直覺」、寄信給 Yuri Nesterov）。強調這只是啟發式，不是證明。
- 力勸修 analysis 作為「智識自衛（intellectual self-defense）」，但本課不用 analysis，會給術語的口語翻譯。
- 好符號設計：要喚起既有直覺（如廣義不等式喚起數的不等式），但要小心「看似成立」的性質有些為假。

## 可放入書稿的重點

- 三種組合（仿射／凸／錐）的定義差異與係數條件，是後續一切的基礎。
- 常見凸集目錄可做成一張表，附幾何描述。
- 半正定錐 2×2 具體條件（$x\ge0, z\ge0, xz\ge y^2$）是好例子；$\dim=n(n+1)/2$。
- 保凸運算清單 + 三角多項式「無限 slab 交集」例子。
- 透視／線性分式的視網膜直覺。
- minimum/minimal 用卦限圖說明（適合 Mermaid 或文字圖）。

## 跨章連結

- 前置：Lecture 1（辨識凸性的動機、least squares/LP/凸優化三分法、非負曲率）。本講把「辨識」落實到凸集層次。
- 後續：Lecture 3（下週）講**凸函數**，方法論相同（atoms + 保凸規則）。半正定錐、範數錐、廣義不等式會在 SDP、SOCP、對偶、多目標（Pareto）等後續章節反覆出現。約第 5 週會做橢球優化（最大內接／最小外覆橢球）。
- 術語橋接：affine vs linear、image/inverse image、perspective/linear-fractional、Löwner 序。

## 暫不處理

- slides `02_Convex sets.pdf` 與教科書《Convex Optimization》第 2 章的精確頁碼／定理編號對應，待材料整合階段核對，先標 `待補`。
- analysis 相關的閉性／緊性等技術細節，Boyd 明確略過，本書亦不深入。
- 逐字稿未定義的細節公式（如橢球各參數化間的精確轉換、線性分式保凸的完整證明）標 `待補`，不自行補證。
