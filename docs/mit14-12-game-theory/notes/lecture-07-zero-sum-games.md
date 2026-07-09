# Lecture 07 閱讀筆記：零和賽局（Zero-Sum Games）

## 基本資料

- 章節編號：07
- 章節標題：零和賽局（Zero-Sum Games）
- 對應逐字稿（`data/mit14-12/clean/`）：`07 - Lecture 7： Zero-Sum Games.txt`
- 完整閱讀日期：2026-07-09
- 閱讀者：章節 worker agent
- 狀態：已成章

## 逐字稿完整閱讀紀錄

閱讀範圍確認（逐字稿為單行含標點純文字）：

- 檔案大小（bytes）：65835
- 是否從頭到尾完整閱讀：是（第一個字到最後一個字，分段讀取）。
- 第一句：「Uh so today the topic is zero-sum games.」
- 最後一句：「But I'll put this on the problem set for you to work out.」
- 跳過段落：無。
- 是否回查 `raw/*.vtt`：否。`.txt` 語意連貫，無明顯漏字或斷句錯誤。

## 本講主問題

本講回答「在利益完全對立（strictly competitive）的策略互動中，理性玩家應如何遊玩、又誰佔優勢」這個問題。講者把零和賽局形式化為 finite 兩人 strategic form 賽局，引入「最壞情況推理（worst-case reasoning）」與「安全策略（security strategy）」，定義玩家能保證的收益（$\underline{V}$）與能保證的損失（$\overline{V}$），再用 von Neumann 的極大極小定理（minimax theorem, 1928）證明兩者相等，得到賽局的「價值（value of the game）」，最後說明零和賽局中安全策略與 [Nash 均衡](../05-nash-equilibrium.md) 完全等價，並以 von Neumann poker 展示理論威力（bluffing 是理性行為）。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| 零和賽局（zero-sum / strictly competitive game） | 利益完全對立：一方效用之得＝另一方效用之失，$u_1(s)+u_2(s)=0$ 對所有 $s$ 成立 | 導讀＋定義小節 |
| 效用 vs 金錢 | 零和針對效用（vNM utility），金錢交易須加「錢不進出」＋「風險中立」兩條件才是零和 | 常見誤解 |
| 單一收益函數慣例 | 因 $u_2=-u_1$，只保留 $U=u_1$；player 1 為 maximizer，player 2 為 minimizer | 定義小節 |
| 最壞收益 / 最壞損失（worst gain / worst loss） | $WG(\sigma_1)=\min_{\sigma_2}U(\sigma_1,\sigma_2)$；$WL(\sigma_2)=\max_{\sigma_1}U(\sigma_1,\sigma_2)$；內層 min/max 用純策略即可 | 形式化小節 |
| 安全策略（security strategy） | player 1 取最大化 $WG$ 之策略；player 2 取最小化 $WL$ 之策略 | 形式化小節 |
| 可保證的收益／損失 $\underline{V},\overline{V}$ | $\underline{V}=\max_{\sigma_1}WG(\sigma_1)$；$\overline{V}=\min_{\sigma_2}WL(\sigma_2)$；一般僅有弱不等式 $\underline{V}\le\overline{V}$ | 形式化小節 |
| 極大極小定理（minimax theorem） | von Neumann 1928：finite 兩人零和賽局中 $\underline{V}=\overline{V}=V$（賽局價值） | 定理小節 |
| 賽局價值（value of the game） | 對雙方相對優勢／公平性的客觀量測；先後手不影響 | 定理小節＋實例 |
| 安全策略＝Nash 均衡 | finite 兩人零和賽局中，$(\sigma_1,\sigma_2)$ 為 Nash 均衡 $\iff$ 兩者皆為各自安全策略 | 定理小節 |
| von Neumann poker | 簡化撲克，示範 value>0、player 1 佔優、理性 bluffing | 賽局實例與應用 |

## 重要細節

### 定義（解概念／賽局元素／經濟量）

- **零和條件**：$u_1(s)+u_2(s)=0$ 對每一個策略組合 $s=(s_1,s_2)$ 皆成立。講者強調這看似一條方程式，其實是對每一組策略各一條方程式的多條方程式。由此代數推得 $u_2(s)=-u_1(s)$，故只需一個函數。
- **慣例**：令 $U=u_1$，隱含 $u_2=-U$。$U$ 同時代表 player 1 的收益（gain）與 player 2 的損失（loss）。player 1 最大化 $U$，player 2 最小化 $U$。講者反覆提醒「min 與 max 很容易搞混」，這是全課最容易混淆的一講。
- **最壞收益 $WG(\sigma_1)=\min_{\sigma_2\in\Sigma_2}U(\sigma_1,\sigma_2)=\min_{s_2\in S_2}U(\sigma_1,s_2)$**：固定我方 $\sigma_1$，對手選讓我收益最小的策略。內層取 min 時只需檢查純策略即可（因固定一方策略後 $U$ 對另一方是線性，線性函數在端點取極值）。
- **最壞損失 $WL(\sigma_2)=\max_{\sigma_1\in\Sigma_1}U(\sigma_1,\sigma_2)=\max_{s_1\in S_1}U(s_1,\sigma_2)$**：player 2 的損失由對手決定，最壞情況是對手把損失推到最大。內層取 max 同樣只需純策略。
- **安全策略**：$\sigma_1^\*$ 為 player 1 安全策略 $\iff WG(\sigma_1^\*)\ge WG(\sigma_1)$ 對所有 $\sigma_1$；$\sigma_2^\*$ 為 player 2 安全策略 $\iff WL(\sigma_2^\*)\le WL(\sigma_2)$ 對所有 $\sigma_2$。講者強調外層（挑選安全策略）**必須允許混合策略**，不能只看純策略。
- **$\underline{V}=\max_{\sigma_1}WG(\sigma_1)$**：player 1 能保證的最好最壞收益。**$\overline{V}=\min_{\sigma_2}WL(\sigma_2)$**：player 2 能保證的最好（最小）最壞損失。

### 定理敘述與證明思路

- **弱不等式 $\underline{V}\le\overline{V}$**：對任意安全策略對 $(\sigma_1^\*,\sigma_2^\*)$，考慮實際收益 $U(\sigma_1^\*,\sigma_2^\*)$。一方面它是 player 2 在 $\sigma_2^\*$ 下的損失，$\le WL(\sigma_2^\*)=\overline{V}$；另一方面它是 player 1 在 $\sigma_1^\*$ 下的收益，$\ge WG(\sigma_1^\*)=\underline{V}$。中間兩個不等式只用到 worst gain/loss 的定義，外側等式才用到「是安全策略」。講者用一張圖示意：若雙方都玩安全策略，結果必落在 $[\underline{V},\overline{V}]$ 的方框內。
- **先後手詮釋**：$\underline{V}$ 相當於「player 1 先動且被觀察」——對手看到後把我收益壓到最低，我事先預期並最佳化。$\overline{V}$ 相當於「player 2 先動且被觀察」。因此不等式 $\underline{V}\le\overline{V}$ 表達「在利益對立下，先動且被看穿至少是弱劣勢」。
- **極大極小定理（minimax theorem）**：von Neumann 於 1928 證明；任何 finite 兩人零和賽局中 $\underline{V}=\overline{V}$。講者指出這早於 Nash 1950，所以零和賽局理論在 Nash 之前已成熟；Nash 的貢獻是把賽局理論推廣到非零和。定理令「先後手方框」塌縮成一點 $V$。展開式：
  $$\underline{V}=\max_{\sigma_1}\min_{\sigma_2}U(\sigma_1,\sigma_2)=\min_{\sigma_2}\max_{\sigma_1}U(\sigma_1,\sigma_2)=\overline{V}=V.$$
- **安全策略 $\iff$ Nash 均衡**（finite 兩人零和賽局）：
  - **（安全 ⇒ Nash）**：設 $\sigma_1^\*,\sigma_2^\*$ 各為安全策略。由 minimax 定理 $WG(\sigma_1^\*)=WL(\sigma_2^\*)=V$。player 2 偏離到 $\sigma_2'$：$U(\sigma_1^\*,\sigma_2')\ge WG(\sigma_1^\*)$（worst gain 定義）→ player 2 損失變大，不划算。player 1 偏離到 $\sigma_1'$：$U(\sigma_1',\sigma_2^\*)\le WL(\sigma_2^\*)$（worst loss 定義）→ player 1 收益變小，不划算。故無人可獲利偏離，是 Nash 均衡。關鍵是把中間的等號用 minimax 定理串起來。
  - **（Nash ⇒ 安全，反證法）**：設 $\sigma_1$ 非 player 1 安全策略，欲證 $(\sigma_1,\sigma_2)$ 非 Nash。由 $U(\sigma_1,\sigma_2)\ge WG(\sigma_1)$，分兩情況：
    - **情況一 $U(\sigma_1,\sigma_2)=WG(\sigma_1)$**：因 $\sigma_1$ 非安全策略，$WG(\sigma_1)<WG(\sigma_1^\*)$（$\sigma_1^\*$ 為安全策略）。又 $WG(\sigma_1^\*)\le U(\sigma_1^\*,\sigma_2)$。串起來得 player 1 偏離到 $\sigma_1^\*$ 嚴格獲利。
    - **情況二 $U(\sigma_1,\sigma_2)>WG(\sigma_1)=\min_{\sigma_2'}U(\sigma_1,\sigma_2')$**：存在 $\sigma_2'$ 達到此 min，使 $U(\sigma_1,\sigma_2')<U(\sigma_1,\sigma_2)$，即 player 2 偏離到 $\sigma_2'$ 損失嚴格變小，獲利。注意此 $\sigma_2'$ 是對「怪異的」$\sigma_1$ 的最佳反應，未必是 player 2 的安全策略，故偏離後未必立刻是均衡。
  - **計算意涵**：要找零和賽局的 Nash 均衡，可分別對兩玩家各解一個最佳化（各找安全策略）再組合。對電腦這比一般求 Nash 更快，因為把「策略相依」拆成兩個獨立最佳化。講者坦言對人類在考試上不見得比較快。

### 賽局實例（矩陣、payoff 設定）

零和賽局矩陣每格只填一個數（player 1 收益＝player 2 損失）。

**（1）剪刀石頭布（rock-paper-scissors）** — 依口語重建，講者明確給值：

| P1 ＼ P2 | Rock | Paper | Scissors |
|---|---|---|---|
| **Rock** | 0 | −1 | 1 |
| **Paper** | 1 | 0 | −1 |
| **Scissors** | −1 | 1 | 0 |

對角線平手為 0；scissors 勝 paper、paper 勝 rock、rock 勝 scissors 各記 +1（player 1 勝），其餘 −1。純策略下每步最壞收益皆為 −1；混合策略 $(\tfrac13,\tfrac13,\tfrac13)$ 使任何對手回應都得期望 0，是安全策略，$V=0$。

**（2）結構優勢範例** — 依口語重建（講者給「1 1 −4 −8」，P1 選 Top/Bottom，P2 選 Left/Right）：

| P1 ＼ P2 | Left | Right |
|---|---|---|
| **Top** | 1 | 1 |
| **Bottom** | −4 | −8 |

雖有大負值（看似對 player 2 有利），但 player 1 玩 Top 保證得 1（$\min(1,1)=1$）。player 2 的 $WL(L)=\max(1,-4)=1$、$WL(R)=\max(1,-8)=1$，故**任何策略都是 player 2 的安全策略**。$V=1$。重點：不能只看數字大小，結構決定優勢；仍是零和（−4 代表 player 2 贏 4）。

**（3）全正數範例** — 依口語重建（講者說「把數字全改成正的」，口語提到 loss 23、8、1）：

| P1 ＼ P2 | Left | Right |
|---|---|---|
| **Top** | 1 | 23 |
| **Bottom** | 1 | 8 |

player 2 玩 R 會損失 23 或 8，玩 L 則不論對手只損失 1，故 L 是安全策略，$V=1$。講者對照範例（2）：兩局幾乎每格數字都比範例（2）大（對 player 1 更好看），但 value 相同（皆為 1）——value 是客觀相對優勢，不能靠逐格比較判斷。附註：value 相同的前提是雙方都理性最佳化；若對手會犯錯，你或許偏好數字更大的那局。（L 欄兩格皆 1、R 欄為 23 與 8 之對應列依口語重建，確切上下位置無法從語音完全確定，標「依口語重建」。）

**（4）配對錢幣型 2×2**（講者稱「a game we studied before」，value 0） — 依口語重建：

| P1 ＼ P2 | Left | Right |
|---|---|---|
| **Top** | 1 | −1 |
| **Bottom** | −1 | 1 |

player 1 玩 T 最壞得 −1（對手玩 R）、玩 B 最壞得 −1（對手玩 L）；但 50/50 混合保證得 0。雙方唯一安全策略皆為 $(\tfrac12,\tfrac12)$，$V=0$。（此為典型 matching pennies 結構，具體正負配置依口語重建。）

**（5）von Neumann poker（簡化撲克）** — 講者明確描述規則，但未給解：

- player 1 得手牌 $X\sim U[0,1]$，player 2 得手牌 $Y\sim U[0,1]$，數字越大越好。
- 雙方各下底注（ante）\$1。
- player 1 選擇下注（bet，固定金額 $B$）或過牌（check）。
- 若 player 1 bet，player 2 可跟注（call）或蓋牌（fold）。
- payoff：（a）check → 比牌，高者贏池，$\pm1$；（b）bet 且 fold → player 1 自動贏，得 $+1$；（c）bet 且 call → 比牌，$\pm(B+1)$（含底注與下注）。
- 假設風險中立。結論：$V>0$，**player 1 佔優勢**；原因是 player 1 check 後 player 2 無權下注（標準撲克中後手可在對手 check 後下注、通常後手有利，此簡化版反而先手有利）。求解與精確安全策略講者留作 problem set（`待補`：習題解答）。
- **punchline**：安全策略中 player 1 有時會 **bluff**（手牌很差時仍下注）。講者說 bluffing 過去被視為超越數學的心理博弈，minimax 定理卻直接解釋了 bluffing 為何理性。

**chess（西洋棋）作為概念示例**：假設玩家只在乎勝負（勝 +1、負 −1、和 0），chess 是 finite 兩人零和賽局，故有 value，且 value $\in\{+1,-1,0\}$。+1 表先手（白）必勝、−1 表後手（黑）必勝、0 表雙方可保和。value 存在但未知——不是理論限制，而是策略數比宇宙原子還多，最佳化問題算不動。

### 課堂 MobLab 遊戲

本講**無** MobLab 互動遊戲；剪刀石頭布、配對錢幣、von Neumann poker 皆為板書講解範例。

### 經濟應用場景

- 講者強調現實世界「很少」是零和：政治上常說「this is not a zero-sum game」，存在讓雙方都變好的安排；賽局理論因此走向 Nash 均衡以涵蓋非零和。
- 零和理論作為 benchmark 適用於接近「strictly competitive／完全利益對立」的情境，以及 parlor games（chess、checkers、poker）。

### 講者例子或直覺說明

- WG 是「多個線性函數取 min」，故為**凹函數（concave）**；這解釋了為何外層挑安全策略時混合策略可能嚴格優於純策略，而內層固定一方時純策略即可達到極值（線性函數在端點取極值）。
- 「先動被觀察是弱劣勢」的直覺：利益對立時，對手看到你的策略只會利用你、對你不利。

### 問答重點

- **risk-neutral 的形式定義**：vNM 效用函數對金錢為線性函數；例如對「確定得 \$10」與「½ 機率 0、½ 機率 20 的彩券」無差異。
- **「內層 min/max 用純策略即可」是否為一般結果？** 是。固定 $n$ 人賽局中其他 $n-1$ 人策略後，最後一人的 payoff 是其策略的線性函數，最大／最小必可由純策略達成（也可能有混合策略達成，但至少有純策略）。但外層的最壞情況收益（挑安全策略）不成立，因 WG 是凹而非線性。
- **$\underline{V}\le\overline{V}$ 是否嚴格？** 否，是弱不等式；minimax 定理保證等號。
- **「無嚴格優勢策略是否 value 必為 0？」** 否。這些範例只是弱優勢；一般可有更複雜賽局，甚至一方有嚴格優勢策略卻仍大輸。
- **反證法是否「乾淨」？** 講者說此處一切 finite，可輕易改寫成直接證明。

### 容易忽略的提醒

- 損失方向易錯：player 2 玩 rock、對手玩 paper，其「最壞損失」是 **+1**（損失 1），不是 −1。矩陣裡的數字對 player 2 是損失。
- 大負值不代表對 player 2 有利；仍是零和，結構決定優勢。
- value 相同的兩局在對「會犯錯的對手」時未必等價。

## 解概念與均衡分析

- **解概念名稱**：安全策略（security strategy）／極大極小策略（maximin / minimax strategy）；並證明其與 [Nash 均衡](../05-nash-equilibrium.md) 在 finite 兩人零和賽局中等價。
- **形式化定義**：$\sigma_1^\*$ 安全 $\iff WG(\sigma_1^\*)=\max_{\sigma_1}WG(\sigma_1)=\underline{V}$；$\sigma_2^\*$ 安全 $\iff WL(\sigma_2^\*)=\min_{\sigma_2}WL(\sigma_2)=\overline{V}$。minimax 定理：$\underline{V}=\overline{V}=V$。
- **求解程序**：分別對兩玩家各解一個最佳化找安全策略，組合即得 Nash 均衡；小型賽局可用「逐純策略算最壞收益／損失，再取 max／min」求得，混合策略須用線性代數平均各列。
- **適用範圍與限制（講者實際說明）**：安全策略概念僅在**兩人零和**賽局有意義；Nash 均衡則普遍適用。等價定理只在 finite 兩人零和賽局成立。
- **在精煉鏈上的位置**：本講是靜態解概念鏈中的特例——[Nash 均衡](../05-nash-equilibrium.md) 在零和情境退化為 maximin/minimax，並與安全策略重合；承接 [不完全競爭](../06-imperfect-competition.md) 的靜態應用，之後進入動態賽局。

## 書稿章節草稿

見 `../07-zero-sum-games.md`。

## 跨章連結

- 前置章節：[第 05 章 Nash 均衡](../05-nash-equilibrium.md)（本講為其零和特例）、[第 06 章 不完全競爭](../06-imperfect-competition.md)（同屬靜態賽局應用）。
- 後續章節：動態賽局（逆向歸納、子賽局完美）——「先後手」直覺在此延伸。
- 需要回頭補充的術語或符號：$U=u_1$ 單一收益函數慣例；$WG,WL,\underline{V},\overline{V},V$；maximin/minimax。
- 需要新增的圖表：worst-case reasoning 流程圖、$\underline{V}\le\overline{V}$ 塌縮示意（先後手方框）。

## 相關材料

- Slides / 板書：（待補，`data/mit14-12/` 只有逐字稿與字幕）
- Syllabus / reading：（待補）
- 習題：von Neumann poker 的 value 與安全策略，講者明言留作 problem set（待補解答）。

## 外部補充

> 外部搜尋僅在第 6 階段（全部逐字稿初稿完成後）進行。初稿階段本節留白。

| 來源 | URL | 存取日期 | 補充內容摘要 |
|---|---|---|---|
| 待補 | 待補 | 待補 | 待補 |
