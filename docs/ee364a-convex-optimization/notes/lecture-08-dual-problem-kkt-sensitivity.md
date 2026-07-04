# Lecture 8 閱讀筆記：對偶問題、KKT 條件與敏感度分析

## 基本資料

- 章節編號：08
- 章節標題：對偶問題、KKT 條件與敏感度分析（Lagrange duality 續：dual problem、weak/strong duality、KKT、sensitivity / shadow price）
- 對應逐字稿：`data/EE364A/transcripts/Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 8 [wsRznzNgTS0].en.txt`
- 完整閱讀日期：2026-07-04
- 閱讀範圍：逐字稿第 1 行到第 2038 行（完整）
- 是否從頭到尾完整閱讀：是
- 跳過段落：無
- 閱讀者：章節 worker（Claude）
- 狀態：已完整讀完、已抽象、已成章
- 講者：Stephen Boyd

## 本講主問題

這一講延續 Duality。前面已建立：任意優化問題（凸或不凸）都能形成 Lagrangian、對 $x$ 極小化得到 dual function $g(\lambda,\nu)$，它是最優值的**參數化下界**。本講要回答：既然每組 $(\lambda,\nu)$ 都給一個下界，如何找**最好的下界**？這就是 **Lagrange dual problem**。由此展開 weak/strong duality、Slater 條件、幾何詮釋、complementary slackness、KKT 條件，最後進入**擾動與敏感度分析（shadow price / 局部靈敏度）**，並在結尾拋出「等價問題的對偶」這個下一講主題。

## 邊界

- 開場（第 1–41 行）只花很短篇幅 recap 前一講的 Lagrangian / dual function / 下界，隨即進入新材料。應交叉連結回前一講（Lagrangian 與 dual function 的建立），不重推。
- 結尾（第 1926–2038 行）開始鋪「problem reformulation / equivalent problem 的對偶」與交換圖（commutative diagram）的 setup，明說「I think we'll quit for today」，屬下一講預告，本章只點到為止。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| Dual function 是下界 | $g(\lambda,\nu)\le p^\star$，對任意 $\lambda\succeq0,\nu$ 成立（recap） | 開頭簡述、連回前一講 |
| Partitioning 問題的對偶 | 非凸（$W$ 未必 PSD、$x_i^2=1$）；對偶下界 $-\mathbf 1^\top\nu$，須 $W+\mathrm{diag}(\nu)\succeq0$ | 例子＋街頭實作（1-opt/2-opt greedy） |
| 與 conjugate 的關係 | dual function 中「min 函數＋線性項」正是共軛 $f^\ast$（差符號） | 公式＋max-entropy 例 |
| Lagrange dual problem | maximize $g(\lambda,\nu)$ s.t. $\lambda\succeq0$；**永遠是凸問題** | 定義＋標準式 LP 對偶 |
| Weak duality | $d^\star\le p^\star$ 恆成立（凸或不凸），gap $=p^\star-d^\star\ge0$ | 定義＋「非負數相乘/相加」直觀 |
| Strong duality | $d^\star=p^\star$；凸問題「幾乎都成立」 | 定義＋工程語氣 |
| Slater 條件 | 凸問題存在嚴格內點（strict inequality）⇒ strong duality；線性不等式免驗 | constraint qualification |
| 幾何詮釋 | 集合 $\mathcal G=\{(f_1(x),f_0(x))\}$；gap ＝ $\mathcal G$ 的凹陷（非凸） | Mermaid/文字圖 |
| Complementary slackness | $\lambda_i^\star f_i(x^\star)=0$：constraint slack ⇒ 乘子為 0 | 推導＋力學類比 |
| KKT 條件 | 可行、$\lambda\succeq0$、互補鬆弛、$\nabla_x L=0$；凸問題下充要 | 條件列表＋與微積分連結 |
| Water-filling | 通訊功率分配，可解析解 KKT；「注水」直覺 | 例子＋圖 |
| 擾動與敏感度 | $p^\star(u,v)$；weak duality 給全域不等式；$\lambda^\star,\nu^\star$ 為局部偏導 | 主線應用 |
| Shadow price / LMP | 乘子＝資源價格、力學接觸力、電網節點邊際電價 | 應用清單 |

## 重要細節

- **定義（dual problem）**：$\text{maximize } g(\lambda,\nu)\ \text{s.t. } \lambda\succeq0$。$d^\star$ 為其最優值，是「用 Lagrange duality 能得到的最大下界」。$d^\star,p^\star$ 皆可為 $\pm\infty$；$d^\star=+\infty$ 是原問題不可行的憑證。
- **weak duality**：$d^\star\le p^\star$，恆成立、無例外、無病態；Boyd 說它「深」只是因為建立在「兩非負數相乘/相加仍非負」這種最簡單的事實上。
- **strong duality**：$d^\star=p^\star$。一般不成立，但**凸問題在所有實務情況都成立**；若遇到反例，多半代表你的模型建錯了、該回頭檢查。
- **Slater 條件**（最著名的 constraint qualification，Boyd 稱之為 sledgehammer）：凸問題若存在一點使所有不等式**嚴格**成立，則 strong duality 成立。線性不等式可豁免嚴格性要求。
- **標準式 LP 對偶**：minimize $c^\top x$ s.t. $Ax=b, x\succeq0$，其對偶亦為 LP；兩者為 dual LPs。inequality-form LP 的對偶顯式寫出後，feasible $\lambda$ 給下界；solver 回傳的 dual optimal 即**最優性憑證**（certificate of optimality）——solver 同時回傳 primal optimal 與 dual optimal，這在數值計算裡很罕見。
- **QP 對偶**：minimize quadratic over polyhedron；對偶亦有清楚形式，線性不等式免 Slater，$p^\star=d^\star$。
- **幾何詮釋**：$\mathcal G=\{(f_1(x),f_0(x)):x\}$。橫軸 $f_1$（左側可接受、右側不可）、縱軸 $f_0$（越小越好）。$p^\star$＝左半部最低點。固定 $\lambda$（斜率）的 Lagrangian level curve 往下推到剛好觸及 $\mathcal G$，與縱軸交點即 $g(\lambda)$。轉動斜率，$g$ 上升到最大（$d^\star$）再下降，$g$ 為凹。gap 來自 $\mathcal G$ 的**凹陷（dent）＝非凸**；凸問題（用 epigraph 版集合 $\mathcal A$）可對每點取 supporting hyperplane，故零 gap。
- **非凸零 gap 的名例**：兩個二次式的問題（min 非凸 quadratic s.t. quadratic $\le$，如單位球上）有 strong duality（不易證）。推論：任何「兩個二次式」的問題（凸或不凸）都可 tractable 求解，含特徵值問題 $\max x^\top Ax$ s.t. $x^\top x=1`。Boyd 說有人據此主張「凡是能全域求解的問題，背後都藏著凸性」，是極端但不算壞的觀點。此「兩二次式」事實每約 10 年在不同領域被重新發現一次。也存在極少數更「病態」的非凸零 gap（如複域六變數四次式），源自代數幾何，Boyd 建議忘掉。
- **complementary slackness 推導**：strong duality 且達到時，$f_0(x^\star)=g(\lambda^\star,\nu^\star)=\inf_x L\le L(x^\star,\lambda^\star,\nu^\star)=f_0(x^\star)+\sum\lambda_i^\star f_i(x^\star)+\sum\nu_i^\star h_i(x^\star)\le f_0(x^\star)$。夾擠 ⇒ 全為等式 ⇒ $\sum\lambda_i^\star f_i(x^\star)=0$；每項 $\lambda_i^\star\ge0$、$f_i(x^\star)\le0$ ⇒ 每項為 0 ⇒ $\lambda_i^\star f_i(x^\star)=0$。
- **slack / tight（taut）**：$f_i(x^\star)<0$ 為 slack，$=0$ 為 tight。互補鬆弛＝「constraint slack ⇒ 乘子 0」「乘子正 ⇒ constraint tight」。力學類比：懸鏈/纜繩，slack ⇒ 張力 0，taut ⇒ 張力恰為 $\lambda$（單位 Newton，接觸力）。
- **KKT 條件**（differentiable $f_i,h_i$）：(1) primal feasible $f_i(x)\le0, h_i(x)=0$；(2) $\lambda\succeq0$；(3) $\lambda_i f_i(x)=0$（互補鬆弛）；(4) $\nabla f_0(x)+\sum\lambda_i\nabla f_i(x)+\sum\nu_i\nabla h_i(x)=0$（$\nabla_x L=0$）。
  - 任何問題（含非凸）若 strong duality 成立且達到，則 primal-dual optimal 滿足 KKT。
  - **凸問題**：滿足 KKT ⇒ optimal（充要）。因互補鬆弛使 $L(x^\star)=f_0(x^\star)$，且凸 $L$ 的梯度歸零 ⇒ $x^\star$ 為 $L$ 的最小點 ⇒ $g=f_0(x^\star)$，primal=dual ⇒ 最優。
  - 定位：KKT 把「無約束凸函數最優性 $\nabla f_0=0$」與「1830 年代 Lagrange 乘子（僅等式約束）」推廣到含不等式約束。滿足 KKT 的 $(x,\lambda,\nu)$ 稱 KKT point；非凸時只類比「stationary point」，未必最優。
- **KKT 命名故事**：Karush–Kuhn–Tucker。Kuhn & Tucker（普林斯頓，約 1951）擴充 Lagrange 到不等式，曾稱 Kuhn–Tucker conditions；後發現 Karush 1939 前後的碩士論文已含全部內容，遂正名為 KKT。Boyd 藉此告誡：別宣稱自己「首創」，多半 Gauss 早就知道（如 Cauchy–Schwarz 其實更早的 Bunyakovsky/「bachara」不等式，存疑拼寫）。
- **Water-filling（通訊功率分配）**：無線裝置把頻譜分成如 512 通道，各有雜訊/SNR（含 $\alpha_i$）。maximize 總位元率 $\sum\log(x_i+\alpha_i)$（$x_i$＝通道功率），s.t. 功率預算。KKT 可解析解，直覺為「注水到某水位」：雜訊大的通道少放功率、太差的放 0、乾淨通道多放。Boyd 評註：即使有解析式，數值法一樣快，還能加其他約束，故過度歌頌解析式在今日略顯多餘。
- **擾動（perturbation）**：把不等式右側改為 $u_i$、等式右側改為 $v_i$。$u_i>0$＝relax（放寬）、$u_i<0$＝tighten（收緊/restrict）。等式擾動 $v_i$：如電網節點功率守恆，$v_i\ne0$＝「拉條電線把功率抽出或灌入該節點」。研究 $p^\star(u,v)$。
- **全域不等式（weak duality 給的）**：$p^\star(u,v)\ge p^\star(0,0)-\sum\lambda_i^\star u_i-\sum\nu_i^\star v_i$。這是**全域、非近似**的界，對應 $p^\star$ 曲線在 $(0,0)$ 的一個支撐超平面（$p^\star$ 為 $u$ 的凸函數）。
  - **不對稱性**：若 $\lambda_i^\star$ 大且你**收緊**該約束，$p^\star$ 保證上升「至少」該量（可能更多，甚至到 $+\infty$／infeasible）。若你**放寬**該約束，$p^\star$ 下降「最多」該量（可能更少；Boyd 畫的 sad case：曲線很快變平，實際降幅遠小於乘子預測）。
- **局部靈敏度**：若 $p^\star$ 在 $(0,0)$ 可微（常常不可微），則
  $$\lambda_i^\star=-\frac{\partial p^\star}{\partial u_i},\qquad \nu_i^\star=-\frac{\partial p^\star}{\partial v_i}.$$
  乘子＝最優成本對約束擾動的（負）偏導。
- **命名與應用**：
  - **Shadow price（影子價格）**：relax/restrict 約束一單位，目標變化多少「錢」。資料中心資源分配（cores、IO bandwidth）中 $\lambda^\star$＝資源價格。
  - **Locational marginal price（LMP，節點邊際電價）**：電網節點功率守恆等式約束的乘子，單位 $/MWh；可實際查到德州/加州某節點某 15 分鐘的 LMP（如 \$83/MWh）。
  - **力學接觸力/張力**：乘子單位 Newton。
  - **Trade-off curve**：單一約束時，掃描 $u_i$ 重解一系列問題得最優權衡曲線。
  - Boyd 軼事：曾為電路設計做工具，把 50 條約束依乘子大小上色（紅＝大、橙＝中、黃＝小、無色＝slack），設計師驚為新法，Boyd 答「這叫 Lagrange 乘子，他 1840 年就過世了」。
- **結尾 setup（下一講）**：equivalent problem（CS 的 reduction；CVXPY 就是不斷做等價重寫直到 solver 能吃、再把解拉回，如同 compiler 的 rewriting system）。問題 P 與其等價 P̃ 各有對偶，四者的關係想連成「交換圖」——本講只擺出 setup。

## 求解與建模的意義

- 讓你能對**任意**問題（含非凸）用 dual 得到最優值下界，並在 solver 回傳的 dual optimal 中拿到**最優性憑證**。
- 讓你辨識並運用 **strong duality / Slater**，知道凸問題何時可用 KKT 當最優性充要條件。
- 讓你用 **KKT** 手解少數可解析問題（water-filling），並理解一般 solver 回傳 primal-dual 的意義。
- 讓你把 **乘子讀成敏感度/價格**：不重解就能預測收緊/放寬約束對最優值的影響（含不對稱界），這是工程與經濟裡最實用的 duality 應用。

## 跨章連結

- 前置章節：前一講（Lagrangian、dual function 的建立、共軛函數；lecture 06/07 待確認）；第 05 講最優性條件裡已預告 Lagrange 乘子要到 Duality 才講清楚。
- 後續章節：下一講的「等價問題之對偶 / reformulation」（交換圖 setup）；conjugate 與 approximation/estimation（教科書 Ch.6–7）也與 duality 交織。
- 需回頭補的術語：Lagrangian、dual function、conjugate（前一講）、epigraph、supporting hyperplane（第 02–03 講）。

## 相關教材與作業

- 對應 slides（`data/EE364A/course material/slids/`）：`05_Duality.pdf`（Duality）。本講屬該檔中後段（dual problem、weak/strong duality、Slater、geometric interpretation、complementary slackness、KKT、perturbation & sensitivity）。頁次對應：待核對。
- 對應教科書《Convex Optimization》(Boyd & Vandenberghe) 第 5 章 Duality：dual problem（5.2）、weak/strong duality 與 Slater（5.2.3、5.3.2）、geometric interpretation（5.3）、optimality/complementary slackness/KKT（5.5）、perturbation & sensitivity（5.6）、examples（5.7）。**章節號待核對、頁碼待補**。
- 「兩個二次式」strong duality（S-procedure / trust-region 類）：教科書附錄 B / 5.x，**待核對**，不臆造定理號。
- Water-filling：教科書 5.5 例題，**頁碼待補**。
- KKT 命名（Karush 1939 碩論、Kuhn–Tucker 1951）：史實引用**待核對**，Boyd 口述年份僅供參考。
- 材料狀態：待核對（slides/教科書頁次未逐一比對）。

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| slides 頁次對應 | `05_Duality.pdf` 逐頁比對 | 待補 |
| 教科書精確章節號/頁碼 | 《Convex Optimization》PDF | 待補 |
| 「兩二次式零 gap」定理正式名稱 | 教科書/文獻 | 待補，不臆造 |
| KKT/Karush 史實年份 | 逐字稿為口述，需查證 | 標「Boyd 口述」 |
| 「bachara/Bunyakovsky」拼寫 | ASR 不確定 | 標 存疑 |

## 存疑／待補（ASR 相關）

- 「bachara inequality」（Cauchy–Schwarz 更早版本）拼寫存疑，疑指 Bunyakovsky。
- level curve 斜率為 $-\lambda$ 或 $-1/\lambda$：Boyd 自己在板上也不確定（口述「maybe minus lambda... or minus one over lambda」）；書稿標存疑，不下定論。
- 「locational marginal price \$83/MWh」為 Boyd 舉例數字，非特定實測值。

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-04 | 建立 | 完整讀畢 2038 行，抽象並成章 |
