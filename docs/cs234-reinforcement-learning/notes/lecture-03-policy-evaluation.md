# 閱讀筆記：Lecture 3 — Policy Evaluation

## 基本資料

- 章節編號：03
- 章節標題：Policy Evaluation（策略評估）
- 對應逐字稿：`data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Policy Evaluation I 2024 I Lecture 3 [jjq51TRNVvk].txt`
- 完整閱讀日期：2026-07-05
- 閱讀範圍：字元 0 到結尾，全文 62,365 位元組（單行無換行）
- 閱讀者：章節 worker agent（Batch 1）
- 狀態：已成章

---

## 逐字稿完整閱讀紀錄

- 是否從頭到尾完整閱讀：是
- 跳過段落：無
- 內容起點：課前複習投票（policy iteration vs value iteration 的性質比較）
- 內容終點：批次策略評估比較（MC vs TD(0) 收斂目標差異），結尾預告下週講授 control 與函數逼近

---

## 本講主問題

當智能體不知道環境動態模型（轉移機率 $P$）與獎勵模型（$R$）時，如何僅靠與環境的直接互動資料估計一個固定策略的價值函數？本講介紹兩個主要方法：蒙地卡羅（Monte Carlo）策略評估與時序差分學習（Temporal Difference learning，TD(0)），並比較它們在無限資料下的收斂性，以及在有限批次資料（batch data）下所收斂的不同目標，說明偏差（bias）、變異數（variance）與資料效率之間的根本取捨。

---

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| 模型無關策略評估 | 無需 $P$ 或 $R$ 的顯式模型，直接從樣本軌跡估計 $V^\pi$ | 作為第 3 章開篇動機，對比第 2 章的動態規劃 |
| 蒙地卡羅策略評估 | 多次展開軌跡，對回報 $G_t$ 求平均，不作 Markov 假設 | 3.2 節，含首訪 / 每訪 / 增量三種變體 |
| 首訪 vs 每訪 MC | 首訪每集至多更新一次；每訪每次經過皆更新（相依樣本，有偏差） | 3.2 節表格對比 |
| 增量蒙地卡羅 | 以學習率 $\alpha$ 做線上更新，不需記住所有 $G_t$ | 3.2 節，強調與機器學習「學習率」概念的聯繫 |
| TD(0) | bootstrap：用 $r + \gamma V(s')$ 作目標，立即更新，無需等到回合結束 | 3.3 節，含 TD 目標、TD 誤差的定義 |
| Bootstrap（自舉）| 用舊估計值代替未來回報的一部分，以換取更低變異數與支援無限 Horizon | 核心詞彙，在 3.3、3.4 節反覆出現 |
| 偏差-變異數取捨 | 首訪 MC：無偏、高變異；TD：有偏、低變異 | 3.4 節對比分析 |
| 確定性等效（Certainty Equivalence） | 用資料估計最大概似 MDP 模型，再做動態規劃；與 TD(0) 在批次設定下等價 | 3.5 節 |
| 批次策略評估 | 固定 $K$ 條軌跡，反覆對其應用 MC 或 TD，觀察各自收斂目標 | 3.6 節，以兩狀態例（A、B）說明 MC vs TD 的差異 |
| MC vs TD 批次收斂差異 | MC 最小化觀測回報的均方誤差；TD(0) 等價於最大概似 MDP 的動態規劃解 | 3.6 節，為整章最重要結論 |

---

## 重要細節

### 課前複習重點

- Policy iteration 至多 $|\mathcal{A}|^{|\mathcal{S}|}$ 輪（每個確定性策略最多出現一次）；Value iteration 可能需要更多迭代（但最終仍收斂）。
- 單狀態單動作 MDP 範例：$R=1$，$\gamma=0.9$，真值 $V^* = 1/(1-0.9)=10$；Value iteration 需要許多輪逐漸逼近，而 Policy iteration 只需一輪。

### 回報與價值函數（複習符號）

$$G_t = r_t + \gamma r_{t+1} + \gamma^2 r_{t+2} + \cdots = \sum_{k=0}^{H-1} \gamma^k r_{t+k}$$

$$V^\pi(s) = \mathbb{E}_\pi[G_t \mid S_t = s]$$

$$Q^\pi(s, a) = \mathbb{E}_\pi[G_t \mid S_t = s, A_t = a]$$

### 動態規劃備份（複習）

$$V^\pi_k(s) \leftarrow R(s, \pi(s)) + \gamma \sum_{s'} P(s' \mid s, \pi(s))\, V^\pi_{k-1}(s')$$

此為「Bootstrapping」——以舊估計協助計算新估計。

### 蒙地卡羅策略評估

**假設**：今日大多數討論假設策略 $\pi$ 為確定性策略；$G_t$ 的計算需等到回合結束。

**首訪蒙地卡羅演算法（First-Visit MC）：**
```
初始化：N(s) = 0，G_total(s) = 0，對所有 s
對每條軌跡（直到第 T 步）：
  G ← Σ_{t'=t}^{T} γ^(t'-t) r_{t'}
  對每個時間步 t：
    若 S_t 在本條軌跡中首次出現：
      N(S_t) ← N(S_t) + 1
      G_total(S_t) ← G_total(S_t) + G_t
V(s) ← G_total(s) / N(s)
```

**每訪蒙地卡羅（Every-Visit MC）**：去掉「首次出現」的條件，每次到達皆更新。

**增量蒙地卡羅（Incremental MC）**：
$$V(s_t) \leftarrow V(s_t) + \frac{1}{N(s_t)}\bigl(G_t - V(s_t)\bigr)$$

更一般地用學習率 $\alpha$（可隨時間衰減）：
$$V(s_t) \leftarrow V(s_t) + \alpha\bigl(G_t - V(s_t)\bigr)$$

### TD(0) 演算法

**核心思想**：不等到回合結束，每看到一個 $(s_t, a_t, r_t, s_{t+1})$ tuple 就立即更新。

**TD 目標（TD Target）**：$r_t + \gamma V(s_{t+1})$（用當前 $V$ 估計未來回報）

**TD(0) 誤差（TD Error）**：
$$\delta_t = r_t + \gamma V(s_{t+1}) - V(s_t)$$

**TD(0) 更新規則**：
$$V(s_t) \leftarrow V(s_t) + \alpha\, \delta_t = V(s_t) + \alpha\bigl(r_t + \gamma V(s_{t+1}) - V(s_t)\bigr)$$

**TD(0) 演算法**：
```
初始化：V(s) = 0，對所有 s
在環境中執行策略 π：
  觀測 (s_t, a_t, r_t, s_{t+1})
  V(s_t) ← V(s_t) + α(r_t + γ V(s_{t+1}) - V(s_t))
  t ← t + 1
```

### Mars Rover 範例（TD 更新追蹤）

策略：永遠選 A1；$\gamma = 1$；S1 或 S7 終結回合。

軌跡範例：$s_3 \xrightarrow{0} s_2 \xrightarrow{0} s_1 \xrightarrow{+1} \text{terminal}$

初始化 $V = \mathbf{0}$，則第一個有非零 TD 誤差的更新發生於 $s_1 \to \text{terminal}$：
$$V(s_1) \leftarrow 0 + \alpha(1 + 1 \cdot 0 - 0) = \alpha$$

在本條軌跡結束後，TD 的 $V$ 向量為 $[\alpha, 0, 0, 0, 0, 0, 0]$（只有 $s_1$ 被更新），而首訪 Monte Carlo 則是 $[1, 1, 1, 0, 0, 0, 0]$（全程 $\gamma=1$，回合中所有經過的狀態同時獲得回報 1）。

### 偏差與變異數性質

| 方法 | 偏差 | 一致性 | 變異數 | 需要回合結束 |
|---|---|---|---|---|
| 首訪 MC | 無偏 | 是（樣本數 $\to \infty$） | 高 | 是 |
| 每訪 MC | 有偏（樣本相依，非 IID） | 是 | 較低（重用資料） | 是 |
| 增量 MC | 視 $\alpha$ 序列而定 | 若 $\alpha$ 滿足 Robbins-Monro | 視 $\alpha$ | 是 |
| TD(0) | 有偏（bootstrap）| 若 $\alpha$ 滿足 Robbins-Monro | 低 | 否 |

**Robbins-Monro 條件**（增量 MC 與 TD(0) 的充分收斂條件）：
$$\sum_{t=1}^\infty \alpha_t = \infty \quad \text{且} \quad \sum_{t=1}^\infty \alpha_t^2 < \infty$$

### 確定性等效（Certainty Equivalence）

從資料中估計最大概似 MDP：
$$\hat{P}(s' \mid s, a) = \frac{N(s, a, s')}{N(s, a)}, \quad \hat{R}(s, a) = \frac{\sum_{t: s_t=s, a_t=a} r_t}{N(s, a)}$$

其中 $N(s,a,s')$ 為 $(s,a,s')$ 出現次數，$N(s,a)$ 為 $(s,a)$ 出現次數。

取得 $\hat{P}$、$\hat{R}$ 後，用第 2 章的動態規劃直接求解策略評估。雖然在計算複雜度上較高（需 $O(S^2 A)$ 操作的迭代），但對稀少資料的利用效率極高（一旦到達某狀態即可傳播資訊至可達前驅狀態）。

### 批次策略評估：MC vs TD(0) 的關鍵差異

**實驗設定**（來自 Sutton & Barto（存疑：ASR 轉寫為「sardo」））：

- 兩個狀態：A 與 B；$\gamma = 1$
- 8 條軌跡：
  - 1 條：$A \xrightarrow{0} B \xrightarrow{0} \text{end}$
  - 6 條：$B \xrightarrow{1} \text{end}$
  - 1 條：$B \xrightarrow{0} \text{end}$

**$V(B)$ 的計算**：兩種方法皆得 $V(B) = 6/8 = 0.75$（只需平均 B 的即時獎勵）。

**$V(A)$ 的計算**：
- **MC**：A 只出現在一條軌跡，回報 = 0 → $V(A) = 0$
- **TD(0)**：$V(A) \leftarrow 0 + \alpha(0 + 1 \cdot V(B) - 0)$，最終 $V(A) = V(B) = 0.75$

**結論**：
- 批次 MC 收斂到**最小化觀測回報均方誤差**（不使用 Markov 結構）
- 批次 TD(0) 收斂到**最大概似 MDP 的動態規劃解**（即確定性等效解，完全利用 Markov 結構）

### 投票題重點（課堂 Check Your Understanding）

1. $\alpha = 0$：TD 目標完全被忽略，估計值永不更新 → **False**（不收斂到 $V^\pi$）
2. $\alpha = 1$：每次看到新 tuple 都完全覆蓋舊估計 → 對確定性 MDP 可收斂（終端狀態附近即穩定）
3. 隨機系統（S → +1 或 -1 各 50%）加上 $\alpha = 1$：估計值在 +1/-1 之間震盪，不收斂
4. 確定性 MDP + $\alpha = 1$：若無隨機性，到達終端後值不再改變 → **可收斂**

### 問答重點

- 問：MC 如何取得獎勵（不知道模型怎麼計算 $G$）？答：假設在真實環境中執行，觀測到實際獎勵。
- 問：Monte Carlo 是否不假設 Markov 性？答：是，MC 只做平均，不利用轉移結構。
- 問：TD 與 MC 的關係？答：TD(0) 是一步 bootstrap，可推廣為 $n$-step TD 以調節 MC 與 TD 的權衡。

---

## 對「學會做決策」的意義

本講說明即使在無模型設定下，仍可有效評估策略好壞：MC 在違反 Markov 性或模型未知時依然可用（只要回合有限）；TD 利用 Markov 結構進行高效 bootstrap，支援無限 Horizon 問題，並為後續的 Deep Q-Learning、策略梯度等方法奠定基礎。批次比較揭示了統計估計的一個根本取捨：是否信任 Markov 假設？這個問題在後續的 offline RL 和 healthcare/policy AI 章節將反覆出現。

---

## ASR 存疑名詞

| 原文（ASR） | 推斷 | 依據 |
|---|---|---|
| multicol / POC multicol | Monte Carlo | 上下文「approximate expectations by sampling」，與 MC 概念完全吻合 |
| sardo | Sutton & Barto | 「really nice example from sardo」→ Sutton & Barto 教科書 |
| certain abto / Sutton Berto | Sutton & Barto | 教科書名稱 |
| ASM totically | asymptotically | 音近 |
| TD Z / tt0 | TD(0) | 反覆出現並說明含義為「zero-step lookahead TD」 |
| Michael Kern | Michael Kocsis？（存疑）| 上下文「mid 2000s, Monte Carlo tree search foundation」；可能為 Kocsis & Szepesvári (UCT, 2006) |
| Li / Li all | 學生姓名 | 課堂互動，不影響內容 |
| Pritt | 不確定 | 可能是學生名，音轉義不明 |

---

## 跨章連結

- **第 2 章**（Tabular MDP Planning）：動態規劃策略評估的 Bellman backup 是本章 MC 與 TD 的對比基準；bootstrap 概念在此首次出現。
- **第 4 章**（待補，預計為 Control）：TD(0) 的控制版本即 Q-learning，講者明確提及。
- **後續函數逼近章節**：批次 MC/TD 的思想直接延伸至 DQN、策略梯度。
- Mars Rover 例子（S1=+1，S7=+10，try-left/try-right）在本講的 TD 更新追蹤中被使用，需在後續章節保持一致。

---

## 相關教材

- **Sutton & Barto（《Reinforcement Learning: An Introduction》）**：
  - Ch. 5（Monte Carlo Methods）對應本講 MC 部分（`待核對`）
  - Ch. 6（Temporal-Difference Learning）對應 TD(0) 部分（`待核對`）
  - TD(0) 的兩狀態 AB 例子出自 S&B 原書
- 課程 slides / 作業：`待補`（本地未見）

---

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| Sutton & Barto 對應頁碼 | `data/cs234/reference/SuttonBarto-RL-2nd.pdf` | 待核對 |
| "Michael Kern" 真實姓名 | 原始論文名稱 | 外部補充階段核對（可能是 Kocsis & Szepesvári） |
| 課堂 slides（完整投影片） | 課程網頁 / 本地 PDF | 待補 |
| n-step TD 的形式定義 | 後續講次或 S&B Ch.7 | 本章提及但未展開，於後續章節補充 |
| TD 收斂的正式定理（含函數逼近） | Tsitsiklis & Van Roy (1997) 等 | 後續章節 |

---

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-05 | 建立 | Batch 1 worker，完整閱讀全文 62,365 bytes |
