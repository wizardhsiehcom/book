# 閱讀筆記：Lecture 05 — Policy Search 1

---

## 基本資料

| 欄位 | 內容 |
|---|---|
| 講次 | 05 |
| 標題 | Policy Search 1（策略搜尋一） |
| 逐字稿路徑 | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Policy Search 1 I 2024 I Lecture 5 [L6OVEmV3NcE].txt` |
| 閱讀日期 | 2026-07-05 |
| 位元組數 | 60,587 |
| 狀態 | 已成章 |

---

## 逐字稿完整閱讀紀錄

- 單行檔，已以 `limit=1` 完整讀取全部內容（60,587 bytes）。
- 全程無分段，音訊辨識（ASR）品質中等，存有多處拼寫錯誤（見「ASR 存疑名詞」節）。
- 講者：Emma Brunskill（史丹佛大學，2024 年春季）。
- 結構：熱身複習 → 策略搜尋動機 → 梯度推導（似然比技巧）→ 評分函數 → REINFORCE → 基準線簡介（留至下一講）。

---

## 本講主問題

本講從「我們為何需要直接對策略參數化？」出發，說明以往基於價值函數的方法在隨機性策略與部分可觀測環境下的局限。接著推導**策略梯度定理**的核心等式——利用似然比技巧將期望梯度改寫為可由蒙地卡羅採樣估計的形式，並展示動態模型和獎勵函數均無需可微。最後介紹 **REINFORCE** 演算法，利用時間因果結構降低梯度估計的變異數，並在結尾引入**基準線（baseline）**的概念，說明其在不引入偏差的前提下能進一步降低變異數（證明留至下一講）。

---

## 核心概念 table

| 概念 | 英文 | 簡要定義 |
|---|---|---|
| 策略梯度 | Policy Gradient | 直接對策略參數 $\theta$ 取梯度以最大化 $V(\theta)$ |
| 軌跡 | Trajectory / $\tau$ | 完整的狀態-動作序列 $(s_0, a_0, s_1, a_1, \ldots)$ |
| 似然比技巧 | Likelihood Ratio Trick | $\nabla_\theta p(\tau;\theta) = p(\tau;\theta)\,\nabla_\theta \log p(\tau;\theta)$，使梯度可由樣本估計 |
| 評分函數 | Score Function | $\nabla_\theta \log \pi_\theta(a \mid s)$，策略對數的梯度 |
| 動態模型無關性 | Dynamics Independence | 轉移機率和初始狀態分布與 $\theta$ 無關，取梯度後消去 |
| REINFORCE | REINFORCE（Williams, 1992） | 蒙地卡羅策略梯度演算法，以 $G_t$ 加權更新 |
| 時間因果結構 | Temporal Causality | 未來決策不影響過去獎勵，用以降低梯度估計的變異數 |
| 基準線 | Baseline / $b(s)$ | 從回報中減去僅依賴狀態的函數，不改變無偏性但降低變異數 |
| 演員-評論家 | Actor-Critic | 同時維護策略（演員）與價值函數（評論家）的方法族 |
| 交叉熵方法 | Cross-Entropy Method (CEM) | 不使用梯度的策略搜尋基線方法 |

---

## 重要細節

### 熱身複習（前 5 分鐘）

講者以問答形式複習前幾講：

1. **表格式 Q-learning（tabular Q-learning）在無限次更新下會收斂至真實 Q 值**：真（前提：學習率排程適當，無函數逼近）。
2. **批次 TD 等價於確定性等效模型（certainty equivalent model）**：真（先估計動態模型與獎勵模型，再做動態規劃）。
3. **DQN 保證收斂至最優 Q 函數**：假。原因：若函數逼近器（如線性函數）無法實現真實 Q 函數（realizability 失敗），即使無限次迭代也不保證收斂；此外還有各種不穩定性問題。

### 動機一：為何需要隨機性策略（Stochastic Policy）

**例一：剪刀石頭布（Rock-Paper-Scissors）**

- 若使用確定性策略（如固定出「布」），對手可利用此規律永遠贏。
- 最優解是**均勻隨機策略**，即一個 Nash 均衡。
- 此問題不滿足 Markov 假設（對手行為依賴歷史），純確定性策略均被好的隨機策略所主宰（strictly dominated）。

**例二：別名狀態（Aliased States）/ 部分可觀測**

- 機器人僅能感知上下左右是否有牆，導致兩個不同位置的特徵表示完全相同。
- 基於價值的方法必須在這兩處採取相同行動（確定性策略）；若選「一直往西」或「一直往東」，其中一個位置必定受困，無法到達獎勵。
- **最優隨機策略**：在別名狀態以 0.5 機率往東或往西，平均而言能迅速到達目標。

### 策略搜尋的範疇（David Silver 圖示）

強化學習方法可按是否維護顯式價值函數與策略分成三區：

```
┌──────────────────────────────────────┐
│  基於價值    │    演員-評論家    │ 基於策略 │
│  (Value-based)│  (Actor-Critic)  │(Policy-based)│
└──────────────────────────────────────┘
```

AlphaGo 屬於演員-評論家（同時維護策略網路與價值網路）。

### 應用案例

| 應用 | 方法 | 說明 |
|---|---|---|
| 外骨骼步態最佳化 | CEM（不用梯度） | Stephen Collins 團隊（史丹佛機械系），2-3 小時內將代謝效率提升約 20-30%，發表於 Science |
| 機器人端到端視覺策略 | 策略梯度 | Chelsea Finn（PhD，伯克利）+ Sergey Levine，從像素直接學習機械臂動作 |
| RoboCup 四足機器人快跑 | 有限差分策略梯度（2004） | Peter Stone 團隊，對步態曲線參數化後搜尋更快的走法 |
| RLHF（ChatGPT） | 策略梯度（PPO） | 以 PPO 訓練語言模型，PPO 是 REINFORCE 的延伸 |
| 序列級語言模型訓練 | REINFORCE | 以 REINFORCE 直接在序列層次優化 |

### 無梯度方法（Gradient-Free Methods）

- 爬山法（Hill Climbing）、遺傳演算法、**交叉熵方法（CEM）**等。
- CEM 維護一個策略參數分布，每輪平行採樣多個策略，保留表現最好的子集來更新分布。
- **優點**：不需可微策略；易於並行化；對複雜獎勵亦有效。
- **缺點**：較不具資料效率（忽略時間結構）。
- 作為強基線（strong baseline）很有用，尤其當不確定能否良好建模時。

### 策略參數化與優化目標

設策略參數為 $\theta$，定義單一片段（episodic）的策略目標為：

$$V(\theta) = V^{\pi_\theta}(s_0) = \mathbb{E}_{\tau \sim \pi_\theta}\left[\sum_{t=0}^{T} r_t\right]$$

（有限 Horizon 不需折扣；若要推廣到無限 Horizon 可加 $\gamma$。）

目標：找 $\theta^* = \arg\max_\theta V(\theta)$。

**重要說明**：此為非凸優化問題，梯度下降（上升）只保證收斂至**局部最優（local optimum）**，而非全局最優；此與表格式方法的全局最優保證形成對比。

### 策略梯度推導（似然比技巧）

以軌跡分布表達目標：

$$V(\theta) = \sum_\tau p(\tau;\theta)\,R(\tau)$$

對 $\theta$ 求梯度：

$$\nabla_\theta V(\theta) = \sum_\tau \nabla_\theta p(\tau;\theta)\,R(\tau)$$

**似然比技巧**（Likelihood Ratio Trick）：

$$\nabla_\theta p(\tau;\theta) = p(\tau;\theta)\,\frac{\nabla_\theta p(\tau;\theta)}{p(\tau;\theta)} = p(\tau;\theta)\,\nabla_\theta \log p(\tau;\theta)$$

因此：

$$\nabla_\theta V(\theta) = \mathbb{E}_{\tau \sim \pi_\theta}\!\left[R(\tau)\,\nabla_\theta \log p(\tau;\theta)\right]$$

**可由蒙地卡羅採樣估計**（以 $M$ 條軌跡近似期望）：

$$\nabla_\theta V(\theta) \approx \frac{1}{M}\sum_{m=1}^{M} R(\tau^{(m)})\,\nabla_\theta \log p(\tau^{(m)};\theta)$$

### 軌跡機率的分解與動態模型無關性

$$\log p(\tau;\theta) = \log \mu(s_0) + \sum_{t=0}^{T-1}\left[\log \pi_\theta(a_t \mid s_t) + \log P(s_{t+1} \mid s_t, a_t)\right]$$

對 $\theta$ 取梯度：

- $\log \mu(s_0)$：初始狀態分布，與 $\theta$ 無關，**消去**。
- $\log P(s_{t+1} \mid s_t, a_t)$：轉移動態，與 $\theta$ 無關，**消去**。
- 只剩 $\sum_{t=0}^{T-1} \nabla_\theta \log \pi_\theta(a_t \mid s_t)$。

因此：

$$\nabla_\theta \log p(\tau;\theta) = \sum_{t=0}^{T-1} \nabla_\theta \log \pi_\theta(a_t \mid s_t)$$

**關鍵推論**：
1. **不需要知道動態模型**（model-free）。
2. **不需要獎勵函數可微**（$R(\tau)$ 甚至可以是黑盒、不連續）。
3. 策略可以是非 Markov 策略（若策略依賴歷史，$\pi_\theta(a_t \mid h_t)$ 仍適用），雖然動態不需 Markov，但本講通常假設策略僅依賴當前狀態。

### 評分函數（Score Function）

定義：

$$\text{score}(\theta; s, a) = \nabla_\theta \log \pi_\theta(a \mid s)$$

**Softmax 策略的評分函數**：

$$\pi_\theta(a \mid s) = \frac{\exp(\phi(s,a)^\top \theta)}{\sum_{a'}\exp(\phi(s,a')^\top \theta)}$$

評分函數為：

$$\nabla_\theta \log \pi_\theta(a \mid s) = \phi(s,a) - \mathbb{E}_{\pi_\theta}[\phi(s,\cdot)]$$

直觀：「目前採取的特徵向量，減去策略加權的期望特徵向量」。

**高斯（Gaussian）策略**（連續動作空間）：

$$\pi_\theta(a \mid s) = \mathcal{N}(\mu(s;\theta),\,\sigma^2)$$

其中 $\mu(s;\theta) = \phi(s)^\top \theta$，$\sigma^2$ 可固定或亦為參數。可直接解析計算評分函數。

### 策略梯度定理（Policy Gradient Theorem）

對於多種目標函數（片段獎勵、每步平均獎勵、平均價值），梯度均可統一寫成：

$$\nabla_\theta V(\theta) \propto \mathbb{E}_{\pi_\theta}\!\left[\nabla_\theta \log \pi_\theta(a \mid s) \cdot Q^{\pi_\theta}(s, a)\right]$$

其中 $Q^{\pi_\theta}(s,a)$ 可替換為軌跡回報 $G_t$（如 REINFORCE）或其他估計量（如演員-評論家中的值函數估計）。

### 時間因果結構（Temporal Causality）

原始梯度估計為：

$$\nabla_\theta V(\theta) = \mathbb{E}\!\left[\left(\sum_{t=0}^{T-1}\nabla_\theta \log \pi_\theta(a_t \mid s_t)\right)\left(\sum_{t=0}^{T-1} r_t\right)\right]$$

利用**因果性**（$t$ 步之前的決策不影響 $t$ 步之後的獎勵）可重寫為：

$$\nabla_\theta V(\theta) = \mathbb{E}\!\left[\sum_{t=0}^{T-1}\nabla_\theta \log \pi_\theta(a_t \mid s_t)\cdot G_t\right]$$

其中 $G_t = \sum_{t'=t}^{T-1} r_{t'}$ 為從時間步 $t$ 起的回報（return）。

**效果**：每個評分函數只被與其有因果關係的獎勵（當下及未來）加權，而非全段軌跡的總獎勵；這大幅降低梯度估計的變異數，且**不引入任何偏差**。

### REINFORCE 演算法

由 Williams（1992）提出，又稱蒙地卡羅策略梯度：

**參數更新規則**：

$$\theta \leftarrow \theta + \alpha\,\nabla_\theta \log \pi_\theta(a_t \mid s_t)\cdot G_t$$

**虛擬碼**（每回合）：
1. 以當前策略 $\pi_\theta$ 運行完整片段，得 $(s_0, a_0, r_0, s_1, a_1, r_1, \ldots, s_{T-1}, a_{T-1}, r_{T-1})$。
2. 對每個時間步 $t = 0, 1, \ldots, T-1$：
   - 計算 $G_t = \sum_{t'=t}^{T-1} r_{t'}$。
   - 更新：$\theta \leftarrow \theta + \alpha\,\nabla_\theta \log \pi_\theta(a_t \mid s_t)\cdot G_t$。
3. 重複至收斂。

特性：必須等片段結束才能更新；每回合產生 $T$ 個梯度更新步。

### 基準線（Baseline）

為進一步降低變異數，從回報中減去只依賴狀態的函數 $b(s)$：

$$\nabla_\theta V(\theta) = \mathbb{E}\!\left[\sum_{t=0}^{T-1}\nabla_\theta \log \pi_\theta(a_t \mid s_t)\cdot (G_t - b(s_t))\right]$$

**關鍵性質**：對任何只依賴狀態的函數 $b(s)$，梯度估計**保持無偏**（證明留至 Lecture 6）。

直覺：不只關心回報是否為正，而是關心「這次回報相對於我能期望的平均水準好多少」；若某狀態通常能獲得 90，則得到 100 就很好，得到 80 就很差。

典型基準線選擇（留至 Lecture 6）：
- 狀態的平均回報（empirical estimate）
- 狀態價值函數估計 $V^{\pi_\theta}(s)$（此時得到演員-評論家方法）

---

## 對「學會做決策」的意義

本講從根本上拓展了決策的可能性：過去課程中的 Q-learning / TD 方法尋找「最佳動作的價值」，但在**部分可觀測**或**多玩家博弈**等情境下，最佳策略本身就是隨機的，無法用確定性 Q 函數捕捉。策略梯度讓系統直接優化「做決策的方式」——包括何時應該主動引入隨機性。似然比技巧更揭示了一個深刻事實：**只要策略可微、且能從中採樣，我們就能優化任何黑盒獎勵**，這是 RLHF、機器人學習等現代應用的共同數學基礎。

---

## ASR 存疑名詞 table

| 逐字稿原文 | 推測正確詞彙 | 說明 |
|---|---|---|
| `sarcastic` | stochastic（隨機性的） | 「the optimal thing to do here is to be sarcastic」→ 上下文明確為 stochastic policy |
| `DQI` | DQN（Deep Q-Network） | 討論深度 Q 學習不收斂時使用 |
| `sarer` / `saret` | SARSA | 批次 TD 方法列舉中 |
| `CES` | CEM（Cross-Entropy Method） | 無梯度策略搜尋方法 |
| `Gan` / `Galan` | Gaussian（高斯） | 策略類別討論中 |
| `autoi` | autodiff（自動微分） | 提到 autodiff 尚未普及時 |
| `five sa` / `5 sa` | $\phi(s,a)$（特徵向量） | softmax 策略的特徵表示 |
| `B of Sr` | $V(s_0)$（初始狀態價值） | 策略目標函數 |
| `Rambo` | 剪刀石頭布（Rock-Paper-Scissors） | 講者提到在中文稱為 Rambo；存疑，可能是 ASR 轉寫錯誤，推測為「猜拳」或其他中文名稱 |
| `step Collins` / `Collings` | Steven Collins | 史丹佛機械工程系，外骨骼研究 |
| `Peter Stones` | Peter Stone | 德州大學奧斯汀分校，RoboCup 研究 |
| `Chelsea Finn` | Chelsea Finn | 史丹佛 CS，端到端機器人策略，名字應正確無誤 |
| `dera` | derivative（導數）| 梯度計算討論中 |
| `policy of essay` | $\pi_\theta(s,a)$（策略在 s,a 的機率）| ASR 誤轉 "s, a" |

---

## 跨章連結

| 連結方向 | 說明 |
|---|---|
| ← 第 1 章（導論） | 四個 RL 支柱：優化、延遲後果、探索、泛化；策略定義（確定性 vs 隨機性）；Mars Rover 貫穿例子 |
| ← 第 2-3 章（MDP、動態規劃） | 價值函數 $V^\pi$、Q 函數；Bellman 方程；批次 TD = 確定性等效模型 |
| ← 第 4 章（函數逼近） | 深度 Q 學習（DQN）不保證收斂的原因（本講複習）；$\theta$ 記法從函數逼近章節延伸 |
| → 第 6 章（Policy Search 2） | 基準線無偏性的正式證明；PPO（Proximal Policy Optimization）作業實作；演員-評論家方法 |
| → 第 7 章及後 | 演員-評論家；更高效的梯度估計；TRPO、PPO 等進階演算法 |
| ↔ RLHF | 本講 REINFORCE 是 RLHF 訓練語言模型（ChatGPT）的數學基礎 |

---

## 相關教材

| 教材 | 建議章節 | 說明 |
|---|---|---|
| Sutton & Barto《Reinforcement Learning: An Introduction》第 2 版 | 第 13 章（Policy Gradient Methods） | 涵蓋 REINFORCE、基準線、策略梯度定理；另有以狀態分布定義目標函數的推導路徑（與本講的軌跡路徑互補）（待核對） |
| 課程投影片 | Lecture 5 | 待補 |
| 作業二（Homework 2） | PPO 實作 | 作業要求實作 Proximal Policy Optimization，為本講方法的延伸 |

---

## 資訊不足與待補清單

1. **基準線無偏性證明**：本講僅陳述結果，正式推導在 Lecture 6，待讀後補充。
2. **演員-評論家方法細節**：本講僅提及概念（David Silver 圖示），詳細演算法與推導待後續章節。
3. **PPO（Proximal Policy Optimization）**：本講提及作業，但正式內容在 Lecture 6 以後。
4. **Rambo 名稱來源**：講者說在中文環境稱剪刀石頭布為 "Rambo"，ASR 轉寫可能失真，需確認。
5. **Chelsea Finn 論文確切引用**：講者提及端到端機器人策略論文，但未給出 citation，待查補。
6. **Stephen Collins 外骨骼論文**：發表於 Science，約 7-8 年前（相對 2024），待確認確切年份與引用。
7. **Peter Stone RoboCup 2004 論文**：講者說約 2004 年，待確認。
8. **REINFORCE 原始論文**：Williams (1992)，具體期刊/會議待確認。
9. **Sutton & Barto 第 13 章對應**：已標「待核對」。

---

## 修訂紀錄

| 日期 | 動作 | 執行者 |
|---|---|---|
| 2026-07-05 | 建立 | Batch 1 worker |
