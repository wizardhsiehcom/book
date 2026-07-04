# Lecture 7 閱讀筆記：向量優化與對偶初步

## 基本資料

- 對應逐字稿：`data/EE364A/transcripts/Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 7 [P_SuSVZnrT0].en.txt`
- 完整閱讀日期：2026-07-04
- 閱讀範圍：逐字稿第 1 行到第 1974 行（完整，末行為 "Thursday"）
- 狀態：已完整讀完、已抽象、已成章
- 講者：Stephen Boyd（EE364a，2023）

## 本講主問題

這一講分兩大段。**前半**收尾凸優化問題的最後一個理論主題——**向量優化（vector optimization）**：當目標本身是向量時，`minimize` 的語義要重新定義（因為向量沒有線性序），於是引入 minimal / Pareto optimal（非支配）點與 trade-off 曲線，並用 scalarization（取對偶錐中的正權重加權求和）把向量問題化回一般純量凸問題。**後半**開啟整門課後段的主線——**Lagrange 對偶**：從 Lagrangian、對偶函數 $g$，證明兩件「極淺」的事實（$g$ 恆凹、$g$ 是 $p^\star$ 的下界），並用四個例子與 dual certificate 概念收尾。

## 本講主線

1. 向量優化＝把「目標」從純量推廣成向量；約束語義不動（不可行就完全不可接受），但「minimize 一個向量」需要新語義。
2. 向量比較靠一個錐 $K$（多目標時 $K=\mathbb R^q_+$）。可達目標集合 $\mathcal O$ 的 **minimal 點**＝沒有任何點嚴格更好；經濟學叫 **Pareto optimal**，另名 **non-dominated（非支配）**。
3. 極少數情況存在唯一的 **minimum**（真的比所有其他都小），此時直接叫 optimal；實務上幾乎不發生。
4. **Multicriterion（多目標）**：$f_1,\dots,f_q$ 全要小；能同時最小化全部＝無競爭，幾乎從不發生；一般得到 trade-off（權衡）曲線／曲面。Pareto 的白話：沒有人能「羞辱你」——拿出一個在所有目標上不輸、至少一個上贏你的點。
5. 例子：雙目標最小平方（擬合誤差 vs 參數大小）＝ Ridge/正則化；投資組合（Markowitz，1953）風險-報酬 trade-off 曲線、stack plot。
6. **Scalarization**：取 $\lambda \succeq_{K^\star} 0$，最小化 $\lambda^\top f_0(x)$ → 得 Pareto 點。$f_0$ 為 K-convex 且 $\lambda\in K^\star$ 保證純量問題仍凸。$\lambda$ 可解讀為各目標的**價格**；改變權重＝沿 trade-off 曲線移動。正則化 loss + $\lambda\cdot$regularizer 就是最常見的 scalarization。
7. Risk-adjusted return：$\bar p^\top x - \gamma\, x^\top\Sigma x$，$\gamma$＝risk aversion parameter。另一種掃 trade-off 的作法：固定風險上限、最大化報酬，掃上限。
8. 轉入 **Duality**。Lagrangian $L(x,\lambda,\nu)=f_0(x)+\sum\lambda_i f_i(x)+\sum\nu_i h_i(x)$。Boyd 誠實說 Lagrange 乘子他前兩三次學都不懂（"shut up and just do it"），這門課要讓你真懂。
9. Lagrangian 幾何：把約束的「硬指示函數（0/+∞）」換成線性項——**看起來是很爛的近似**（Boyd 反覆強調 appalling），但故事會有好結局。$\lambda_i$＝warehouse 超額的價格（低於上限還能出租得補貼）。
10. **對偶函數** $g(\lambda,\nu)=\inf_x L(x,\lambda,\nu)$。兩個「淺」性質：(a) $g$ 恆為**凹**（一族仿射函數的下確界），即使原問題非凸；(b) 若 $\lambda\succeq0$，則 $g(\lambda,\nu)\le p^\star$（**下界性質**），對 $\nu$ 無任何符號限制。
11. 四個例子：least-norm（等式約束二次）、standard-form LP（含直接、非 Lagrangian 的下界證明）、norm 最小化（用到共軛函數與 dual norm）、two-way partitioning（非凸，導出 $-\mathbf 1^\top\nu$ 且 $W+\mathrm{diag}(\nu)\succeq0$）。
12. **Dual certificate**：解 LP／凸問題時 solver 除了回傳 $x$，也回傳 $\nu$（對偶變數），其對偶目標值等於 primal 目標值——一份「沒人能更好」的自足證明，不必信任 solver。
13. 收尾補 **spectral partitioning**：把 $x_i^2=1$ 鬆弛成 $\sum x_i^2=n$，變成特徵值問題（少數可解的非凸問題之一），取最小特徵向量、按 sign 取整＝partition 的 heuristic；可調整 $W$ 對角線讓結果更好。

## 重要細節

- **語義重申**：不可行＝完全不可接受，沒得討論；可行者中目標最小者最佳（純量情形）。向量情形需新語義。
- **minimal vs minimum**：minimum＝存在唯一比所有其他都小的點（罕見）；minimal＝非支配（一整條邊界）。
- **可達目標集合** $\mathcal O$＝可行點的目標值集合；以 $\mathbb R^2_+$ 為例「左下為好」。stupid 點＝被支配的可行點；不可比的兩點需 further information 才能排序。
- **Trade-off 白話**：比較兩 Pareto 點，一點在目標一贏、卻用目標二來付帳（更高），像匯率／交換。
- **投資組合設定**：$x$＝各資產權重（可正規化到和為 1、非負；後面允許負＝放空 short，借券賣出、期末買回，價跌獲利）。$\bar p^\top x$＝期望報酬，$x^\top\Sigma x$＝風險（variance，開根號＝標準差＝volatility）。統計模型「其實不太準」（Boyd 明說）。
- **多目標凸性檢查**：學生問「負號會不會破壞凸？」Boyd：risk 是 convex quadratic、負報酬是 affine，兩者皆凸，仍是凸的——但務必自己檢查。
- **Scalarization 的凸性理由**（學生問 $\lambda\in K^\star$）：只有 $\lambda\in K^\star$ 才保證 $\lambda^\top f_0(x)$ 對 $x$ 凸；否則純量問題可能非凸就沒法解。$\mathbb R^q_+$ 的對偶錐是自己。
- **掃 $\lambda$ 得幾乎所有 Pareto 點**，但拿不到極限端點；Boyd 提醒他舉的某圖是非凸問題，不該當例子（自我更正）。
- **jerk/snap 段**：位置的三階導＝jerk、四階＝snap；高級電梯／無人機軌跡最小化 snap。五、六階＝crackle、pop（玩笑，實務不用）。屬「文化補充」。
- **Lagrangian 的下界證明**（極淺）：$x$ 可行 → $h_i=0$（等式項消失）、$\lambda_i\ge0$ 且 $f_i\le0$ → 乘積 $\le0$、求和 $\le0$ → $L(x,\lambda,\nu)\le f_0(x)$；對 $x$ 取 inf 得 $g\le f_0(x^\star)=p^\star$。
- **least-norm 例**：$\min \|x\|_2^2$ s.t. $Ax=b$；$L$ 是凸二次、令梯度為 0 解出 $x$、回代得 $g(\nu)$（凹）。取 $\nu=0$ 給下界 0（"optimal value 不可能為負"，聽者覺得廢話但正是機制）。用途：巨大問題用 heuristic 解後，算此下界估「離最優多遠」。
- **standard-form LP 例**：$L$ 對 $x$ 仿射 → inf 幾乎恆為 $-\infty$，唯一例外是線性部分 $=0$（$A^\top\nu+c=\lambda\succeq0$），此時 $g=-b^\top\nu$。Boyd 現場又用「兩非負向量內積非負」直接證下界，不靠 Lagrangian。
- **norm 最小化例**：$g=b^\top\nu$，條件是 $\|A^\top\nu\|_* \le 1$（dual norm）；用到 norm 減線性＝共軛函數，最小化得 0 或 $-\infty$。應用：最小燃料軌跡（衛星，常用 $\ell_1$），任何滿足條件的 $\nu$ 給燃料下界。
- **two-way partitioning 例**：$x_i\in\{\pm1\}$，$x^\top W x=\sum w_{ij}x_ix_j$，同組 $+w_{ij}$、異組 $-w_{ij}$，$w_{ij}$＝把 $i,j$ 放同組的成本（正＝討厭彼此、負＝親和想同組）。非凸（$W$ 未必 PSD 且 $x_i^2=1$ 非凸）。$g(\nu)=-\mathbf1^\top\nu$，需 $W+\mathrm{diag}(\nu)\succeq0$。可導出許多知名下界。
- **quadratic form 最小化對話**：$\inf_x x^\top A x$（$A$ 對稱）＝ $-\infty$（有負特徵值）或 $0$（$A\succeq0$，取 $x=0$）。
- **spectral partitioning**：$\min x^\top W x$ s.t. $\sum x_i^2=n$（鬆弛自 $x_i^2=1$）＝特徵值問題，解＝最小特徵向量按 $\sqrt n$ 縮放；再對分量取 sign 得 partition heuristic；調 $W$ 對角線可改善。適用超大問題、效果很好。

## 求解與建模的意義

- 讓你能建模**多目標**問題並辨識 Pareto／trade-off 結構，用 scalarization 或掃約束上限畫出 trade-off 曲線（本週作業要對某能源儲存系統做 trade-off）。
- 讓你把 $\lambda$ 讀成**價格／匯率**，理解正則化參數、risk aversion 的真正含義。
- 對偶初步建立「**下界**」這件武器：對任意（甚至非凸）問題，找到合法 $(\lambda,\nu)$ 就得一個可驗證下界 → dual certificate → 不必信任 solver，並能估算 heuristic 解的最優性間隙。
- 為後續強對偶、KKT、演算法鋪路。

## 跨章連結

- 前置：Lecture 6（章 06，凸優化問題各類：LP/QP/SOCP/廣義不等式，並帶到向量不等式與向量優化開端）——本講開頭即續此。也回接章 05 的凸優化問題標準形式、K-convex（scalarization 的凸性依據）與共軛函數（對偶函數的解讀）。
- 後續：Duality 正題（弱／強對偶、KKT），對應下一講；本講只到「下界性質 + dual certificate + spectral partitioning」為止，Boyd 明說週四續。
- 需回頭補的術語：conjugate function（章 05 前後）、dual cone / dual norm（章 02-03）、K-convex（章 05）。
- 需要的圖：向量優化 minimal/Pareto 圖、trade-off 曲線、scalarization 支撐超平面、Lagrangian 硬指示函數 vs 線性項、duality 下界推導流程。

## 相關教材與作業

只建立關聯，不提供作業解答；未核對處保留 `待補`。

- 對應 slides：向量／多目標優化與 scalarization 屬 `04_Convex optimization problems.pdf` 收尾；Lagrangian、對偶函數、下界性質、LP/norm/partitioning 例子屬 `05_Duality.pdf` 開頭。狀態：待核對逐字稿與投影片頁次。
- 對應教科書《Convex Optimization》（Boyd & Vandenberghe）：向量優化屬第 4 章（4.7 向量優化 / multicriterion / scalarization，章節號待核對）；Lagrangian 與對偶函數屬第 5 章（5.1，章節號待核對）。頁碼 `待補`。
- 作業關聯：Boyd 說本週作業（週五截止）需要向量優化，且有一題要對某能源儲存系統求 trade-off；屬 2023 版節奏，配分等行政資訊集中於附錄，不與逐字稿混寫。
- 材料狀態：待核對。

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| Markowitz 風險-報酬曲線的專名（Boyd 現場說「有個名字我忘了」） | 教科書／投影片 | 標 `待補`，不臆造（可能指 efficient frontier，存疑） |
| slides / 教科書精確章節號與頁碼 | 材料整合階段核對 | `待補` |
| 對稱矩陣 $e^X$ 是否矩陣凸等延伸（沿用章 05 存疑） | 後續材料 | 沿用「存疑」 |

## Worker 回報欄

- 逐字稿檔名：`Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 7 [P_SuSVZnrT0].en.txt`
- 逐字稿總行數：1974（完整讀畢）
- 本講實際講題：向量優化（多目標／Pareto／scalarization）＋ Lagrange 對偶初步（Lagrangian、對偶函數、下界性質、dual certificate、spectral partitioning）
- 新增檔案：本筆記 + `07-vector-optimization-and-duality.md`
- 是否使用外部資料：否
