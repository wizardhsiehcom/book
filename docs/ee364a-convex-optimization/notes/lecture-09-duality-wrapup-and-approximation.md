# Lecture 9 閱讀筆記：對偶理論收尾與近似擬合

## 基本資料

- 對應逐字稿：`data/EE364A/transcripts/Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 9 [whE03c84ahA].en.txt`
- 完整閱讀日期：2026-07-04
- 閱讀範圍：逐字稿第 1 行到第 2014 行（完整，末行 "Thursday"）
- 狀態：已完整讀完、已抽象、已成章
- 講者：Stephen Boyd

## 本講定位

這一講是**分水嶺**：前約 20 分鐘收尾「理論部分」（Duality 的最後幾個主題），之後正式進入課程第二部分「應用」，第一站是**近似與擬合（approximation and fitting）**。Boyd 明說「這實際上結束了課程第一部分（全部理論），接下來三、四週都是應用，而你會發現它們慢慢看起來都一樣，因為它們本來就一樣」。

## 上半場：Duality 收尾（新內容，不是純複習）

1. **重構會改變對偶**：同一個問題做不同的等價轉換，取對偶會得到「天差地遠」的對偶問題。數學背景的人會想畫箭頭把它們連起來，但這通常不成立。
   - 例 A：無約束問題 `min f0(Ax)`。直接取對偶 → 沒有對偶變數（無約束），對偶就是把目標極小化 = p*，是「精確但完全無用」的下界（數學家笑話）。改成引入 `y = Ax`（給名字）→ 對偶用到 **共軛函數 f0\***，變得有意思。
   - 例 B：範數近似 `min ||Ax - b||`。引入 `y = Ax - b` → 對偶出現 **對偶範數（dual norm）** 的指示函數。
   - **模式（pattern）**：Primal 出現某函數，Dual 就該預期它的共軛。KL divergence／相對熵 → 期待 exp、log-sum-exp；看到 A → 期待 A^T（adjoint）；L∞ 範數 → 期待 L1 範數。沒出現就該回頭檢查。
2. **部分對偶化（partial dualization / partial Lagrangian）**：LP 的 box 約束 `-1 ≤ x ≤ 1`。可以「不對它做對偶」，改把它變成指示函數塞進目標（顯式約束變隱式）。極小化 affine 函數在 box 上可解析算（Hölder 不等式：分量為正取 x_i = -1、為負取 x_i = +1），得到 `-sum |a^T ν + c|` 這種 L1 形式（呼應 L∞→L1）。這裡 D 與 D̃ 極為接近。
3. **廣義不等式（generalized inequality）的對偶**：約束 `f_i(x) ⪯_K 0` 是向量／矩陣（例如矩陣 ⪯ 0 即負半定）。Lagrangian 用**內積** `⟨λ_i, f_i⟩`，且 λ_i 必須在**對偶錐（dual cone）** 中非負。下界性質同理：對偶錐中非負的向量，與錐中非正的向量做內積 ≤ 0。
   - **SDP／LMI 例**：`min c^T x` s.t. `sum x_i F_i + G ⪯ 0`（LMI，F_i、G 對稱矩陣，⪯ 對半正定錐）。乘子改稱對稱矩陣 Z，內積讀成 `trace(Z · (...))`。極小化 affine 於 x → 線性部分須消失（否則 -∞），得到對偶 SDP。弱對偶顯然，強對偶不顯然。Boyd：25–30 年前沒人知道這些。
4. **替代定理（theorems of the alternative）＝可行性問題的對偶**：把可行性寫成 `min 0` s.t. 約束，則 p* = 0（可行）或 +∞（不可行，空集的 inf 定義為 +∞）。取對偶，**弱對偶永遠成立（凸／非凸都一樣）**。
   - 若對偶「上無界」（d* = +∞）→ 原問題不可行的**憑證（certificate）**，即使原問題判定可行性是 NP-hard，只要找到一個對偶點使 d = 1（下界 > 0，而值只能是 0 或 +∞）就證明不可行。
   - 名稱：一組不等式有解 ⟺ 另一組無解。線性情形叫 **Farkas 引理**（ASR: "farcus"）。
   - 應用：古典經濟學／金融的「無套利（no arbitrage）」基礎；Boyd 講了一個「不錄用經濟系背景」的玩笑。作業的選擇權定價題其實就用到它（stealth：不講 d-word）。

## 下半場：近似與擬合（Part 2 開場）

1. **範數近似 `min ||Ax - b||`**（任意範數）。三種詮釋：
   - 幾何：Ax* 是 range(A) 中在該範數下離 b 最近的點。
   - 估計：線性測量模型 `y = Ax + v`；A 稱 model／**forward model**（來自物理）；`v = y - Ax` 稱 **residual / physics residual**；範數表達測量誤差 v 的**不合理程度（implausibility）**。若不對 v 加約束，任何 x 都能用「測量誤差」解釋（可以宣稱源為零、其餘全是誤差）。
   - 最優設計：x 是設計變數，範數表示「miss 目標 b」有多惱人（衛星推進器序列 → 盡量靠近目標軌跡）。
   - 具名特例：L2 = 最小平方（平方後可微 → normal equations）；L∞ = **Chebyshev 近似**（可轉 LP）；L1 = 絕對殘差和（可轉 LP）。CVXPY 一行：`minimize(norm(A@x-b, 1))`。
2. **懲罰函數近似**：`min sum φ(r_i)`，`r = Ax - b`，separable（各分量函數之和）。φ(u) = 對大小為 u 的殘差「有多惱火」。
   - quadratic（→ 最小平方）、deadzone-linear（帶內不在乎、帶外線性）、log barrier（小殘差近似平方、|r|<a 外 +∞）、L1（絕對值）、非對稱／quantile（正殘差比負殘差惱人 N 倍 → quantile 估計）。
   - **near-zero 行為**：有**尖點（sharp point）**（如 L1）→ 解**稀疏**（很多 0），因為降低殘差的邊際收益直到 0 都不減（compress sensing 那套複雜理論的樸素解釋）；平方很「chill」，變小後更不在乎；deadzone 帶內完全不在乎。
   - **large 行為**：線性成長 → 對少數大殘差比較「chill」→ **robust estimator（穩健估計）**。
   - 例：100×30 隨機矩陣，看殘差直方圖，逐一 anthropomorphize（least squares / log barrier / deadzone / L1）。
3. **Huber 懲罰**（Boyd 列為本課 top-10 該帶走的觀念）：閾值 M 內平方、外線性（linear tails）。= 「想做最小平方，但若非得有大殘差，就比最小平方淡定得多」→ robust。**機械彈簧詮釋**：平方 = 虎克彈簧（位移平方勢能）；超過閾值後勢能線性 = **定力（constant force）**，不會對離群點無限加力矩。能「輾過」20–30% 離群點。命名自統計學家 Peter Huber。回歸小例：兩個離群點把 least squares 擬合「torque」歪，Huber 不受影響。「大部分擬合資料的場合都該用 Huber 而非最小平方」。
   - 可加凸約束：如 Huber 單調回歸（Huber + `x_1 ≤ x_2 ≤ ...`），仍是 QP，「50 種解法」。
4. **最小範數問題 `min ||x|| s.t. Ax = b`**：解集在原點的投影；估計＝測量很準但不夠多（晶片上少數溫度感測器推估其他點）；設計＝硬約束下最小範數（最小燃料機動）。可用絕對值和（燃料用量的初階模型）或最小懲罰。
5. **正則化近似（regularized approximation）**：bi-criterion `(||Ax-b||, ||x||)`。scalarization → `||Ax-b|| + γ||x||`；常用 `||Ax-b||_2^2 + δ||x||_2^2` = **Tikhonov 正則化 / Ridge regression**，有解析解。
   - 為何要 x 小？(a) 先驗 x 小；(b) **對 A 的不確定性 robust**：Ax 中 x 乘 A，x 越小，A 抖動對 Ax 的影響越小（x=0 完全不受影響）。
   - 權重怎麼選？→ **交叉驗證（cross-validation）／樣本外驗證**（Boyd 說這是「對的答案」；長篇高斯漸近理論是「錯的答案」）。很多領域（影像處理、控制）就是轉旋鈕轉到滿意（hyperparameter tweaking）。
6. **最優輸入設計例**：`y = h * u`（卷積 / 線性動態系統）。三個目標：tracking error `||y - y_des||`、輸入大小 `||u||_2^2`、平滑度（差分平方和）。合成 regularized least squares，權重 δ、η 調 magnitude / wiggliness 相對 tracking。展示不同權重下輸入與追蹤結果。同一問題在金融（追蹤債券組合，turnover = 交易量）等 50 個領域重複出現。後面會把平方換成別的懲罰再問結果。

## 課務／雜項（Boyd 2023，僅記錄不當事實外推）

- 我們的官方解答比要求詳盡得多（含 corner cases），不期待學生照做。
- CVXPY 作業精神＝紀律凸規劃（DCP），別當「打字機前的猴子」硬湊；`=` 是賦值、`==` 在兩個 CVXPY 運算式間被 overload 成約束、只有兩邊 affine 才能當約束求解；`x.value` 取數值。
- 實務題設計成能「直覺檢查」（例：加了儲能，成本應下降）；很多題暗藏 Duality 卻不點名（stealth）。
- ChatGPT 期中考只拿 12/43（Boyd 打趣「文筆一定很好」）。

## 跨章連結

- 前置：Lecture 6–8 的凸優化問題與 Lagrange 對偶（本講延續其收尾：共軛、部分對偶化、廣義不等式、替代定理）；共軛函數見凸函數章。
- 後續：近似與擬合展開（統計估計、robust／Huber、正則化、稀疏 L1）對應教科書 Ch.6–7；SDP／LMI 對偶延伸到後段。
- 需回頭複習的術語：共軛函數（conjugate）、對偶範數（dual norm）、對偶錐（dual cone）、指示函數、scalarization / bi-criterion。

## 存疑與待補

- QP 的不同對偶被稱作 "Clark Duel"、"Frank duel"（ASR），實際人名／拼寫**存疑**（可能為 Wolfe/Dorn 等，待核對，不作事實斷言）。
- "Chevy CHF" = Chebyshev；"farcus" = Farkas；"kback lier" = Kullback–Leibler；"holder" = Hölder；"Yuber/Huber" = Huber。以上依語意還原。
- slides 與教科書精確頁碼對應：待材料整合階段核對（`待補`）。
- 逐字稿多為板書指涉（"this"、"that"），公式為依語意還原，未逐一標教科書定理編號（`待補`）。
