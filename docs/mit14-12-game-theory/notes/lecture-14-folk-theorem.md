# MIT 14.12 閱讀筆記：Lecture 14 Folk Theorem

## 基本資料

- 章節編號：14
- 章節標題：Folk Theorem
- 對應逐字稿（`data/mit14-12/clean/14 - Lecture 14： Folk Theorem.txt`）：
- 完整閱讀日期：2026-07-09
- 閱讀者：Wizard's Assistant
- 狀態：已成章

## 逐字稿完整閱讀紀錄

- 檔案大小（bytes）：58661
- 是否從頭到尾完整閱讀：是
- 跳過段落：無。
- 是否回查 `raw/*.vtt`：否

## 本講主問題

本講旨在探討在無限重複賽局中，當玩家足夠有耐心（折現因子 $\delta$ 夠大）時，哪些結果可以被支持為子賽局完美納許均衡（SPNE）。引入了 Folk Theorem（無名氏定理）及其不同強度的版本（Nash Reversion, Individualized Nash Reversion, Pure Minimax），說明只要在「可行且滿足個體理性」的範圍內，幾乎任何報酬都能透過 SPNE 達成。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| Folk Theorem (無名氏定理) | 在無限重複賽局中，只要玩家夠耐心，任何「可行且滿足個體理性」的報酬都能由 SPNE 支持。 | 在核心內容介紹定理模板，並分階段推演三種不同強度的定理版本。 |
| Average Discounted Payoffs (平均折現報酬) | 將原本的折現總和乘以 $(1-\delta)$，使其在數值上等於每期的平均報酬，以解決 $\delta \to 1$ 時總報酬發散的問題。 | 在形式化定義小節詳細說明。 |
| Feasible Set (可行集合) | 各行動組合的報酬向量，透過給定權重進行凸組合（或時間上的平均分配）所能達成的報酬空間。 | 透過囚犯困境實例在座標平面上視覺化，並給出數學定義。 |
| Individual Rationality (個體理性) | 玩家保證能獲得的最低報酬（在囚犯困境為 0，或一般化的 minimax 值），低於此值的報酬不可能在均衡中出現。 | 結合可行集合，切出可被 SPNE 支持的子集合。 |
| Nash Reversion (納許回歸) | 用無限期回歸到原賽局的納許均衡來作為偏離的懲罰。 | 作為第一個定理的證明思路，並透過 One-shot deviation principle 檢驗。 |
| Pure Minimax Value (純粹極小極大值) | 其他玩家集體行動以最小化某玩家的報酬，而該玩家做出最佳回應時所能拿到的報酬，這是最嚴厲的懲罰底線。 | 在最終版的 Folk Theorem 中作為個體理性的下界，並討論「懲罰懲罰者」的問題。 |

## 重要細節

- 定義（解概念／賽局元素／經濟量）：
  - Average Payoff: $(1-\delta) \sum_{t=0}^\infty \delta^t U_i(A_t)$
  - Feasible payoff set $V(G)$: 所有行動組合報酬向量的凸組合 $\sum_{A} p(A)U(A)$, $p \in \Delta(A)$。
  - Pure minimax value $\underline{v}_i$: $\min_{A_{-i}} \max_{A_i} U_i(A_i, A_{-i})$
- 定理敘述與證明思路：
  - Folk theorem template: 給定 $V \in V(G)$，在某些條件下，存在 $\bar{\delta} \in (0,1)$，當 $\delta > \bar{\delta}$ 時，重複賽局有一 SPNE 能實現平均報酬向量 $V$。
  - Nash reversion: 條件為 $V_i > U_i(A^{NE})$。證明策略：大家合作打 $A^*$，一旦有人偏離，永遠打 $A^{NE}$。透過 one-shot deviation 驗證 $(1-\delta)$ 當期的 gain 加上 $\delta$ 之後無窮期的 loss 是否 $\le 0$。
  - Individualized Nash reversion: 條件為對每位玩家 $i$，存在 $V_i > U_i(A^{NE, i})$。如果 $i$ 偏離，大家就打對 $i$ 最不利的 $A^{NE, i}$ 懲罰他。若多人同時偏離，可隨機選一個懲罰。
  - Pure minimax folk theorem: 條件為 $V_i > \underline{v}_i$。需要解決「懲罰懲罰者」的遞迴問題，透過 Minimax 懲罰 N 期後，獎勵執行懲罰的玩家來解決。
- 賽局實例（標明「依口語重建」）：
  - 囚犯困境（依口語重建）：
    - 矩陣：(C,C)=(2,2), (D,C)=(3,-1), (C,D)=(-1,3), (D,D)=(0,0)
    - 講解中畫出了二維座標平面，將這四個點標出，凸包為 Feasible Set。因為 D 保證拿到至少 0，所以均衡報酬必須 $> 0$。
- 經濟應用場景：Cournot 競爭中的懲罰（例如大量生產淹沒市場，但這不是 NE，由此引入 Minimax 概念與懲罰者的誘因問題）。
- 講者例子或直覺說明：
  - Folk theorem 的名稱由來：1950、60 年代的「民間智慧」，大家都覺得是對的但一直沒有嚴格證明。直到 1986 年 Drew Fudenberg 等人將其形式化。Folk 指的是歷史偶然的俗稱，與人民無關。
- 容易忽略的提醒：
  - 在 Average payoffs 的計算中，當期的權重是 $(1-\delta)$，而從明天開始無窮遠的總權重剛好縮減為 $\delta$。

## 解概念與均衡分析

- 解概念名稱：Subgame Perfect Nash Equilibrium (SPNE) in infinitely repeated games
- 形式化定義：透過定義策略（在各種 history 下的行動），檢驗是否對任何子賽局皆為 Nash Equilibrium。
- 求解程序或演算法：One-shot deviation principle。將 history 分兩類：無人偏離、有人偏離。
- 適用範圍與限制：Folk Theorem 告訴我們，如果 $\delta$ 夠大，可以構造出極多 SPNE，導致「什麼都可能發生」，這在預測上會是一個問題。

## 跨章連結

- 前置章節：Lecture 13 無限重複賽局與囚犯困境。
- 後續章節：Lecture 15 將回到實質應用。

## 外部補充

> 外部搜尋僅在第 6 階段（全部逐字稿初稿完成後）進行。初稿階段本節留白。

| 來源 | URL | 存取日期 | 補充內容摘要 |
|---|---|---|---|
| 待補 | 待補 | 待補 | 待補 |
