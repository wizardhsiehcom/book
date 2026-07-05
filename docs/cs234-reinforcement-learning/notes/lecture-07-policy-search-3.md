# 閱讀筆記：Lecture 7 — Policy Search 3

## 基本資料

- 章節編號：07
- 章節標題：Policy Search 3（策略搜尋 III）
- 對應逐字稿：`data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Policy Search 3 I 2024 I Lecture 7 [4ngb0IZTg8I].txt`
- 完整閱讀日期：2026-07-05
- 閱讀範圍：字元 0 到結尾，全文 62,448 位元組（單行無換行）
- 閱讀者：章節 worker agent（Batch 2）
- 狀態：已成章

---

## 逐字稿完整閱讀紀錄

- 是否從頭到尾完整閱讀：是
- 跳過段落：無
- 特殊情況：逐字稿為自動語音辨識（ASR）輸出，含多處口語化表達與識別錯誤，詳見「ASR 存疑名詞」表格

---

## 本講主問題

本講聚焦三個遞進主題。首先深入 PPO 的理論基礎：證明「最大化性能下界」在數學上保證單調改進（monotonic improvement），並說明為何直接套用此理論在實務上步伐過小。其次介紹廣義優勢估計（Generalized Advantage Estimation，GAE），作為在偏差與變異數之間取得平衡的折衷方案，以 telescoping sum 推導統一公式。最後轉入模仿學習（Imitation Learning），涵蓋行為克隆（Behavior Cloning）的原理與誤差複合問題、DAgger 迭代修正算法，以及逆強化學習（Inverse RL）的特徵匹配框架。

---

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| n 步優勢估計 | $\hat{A}_t^{(k)} = \sum_{l=0}^{k-1} \gamma^l \delta_{t+l}^V$，k=1 為 TD；k→∞ 為 MC | 以 Delta 符號推導，展示 telescoping sum |
| 廣義優勢估計 (GAE) | 所有 k 步估計的指數加權平均，權重 $(\gamma\lambda)^l$ | 呈現推導與 λ=0/1 極端情形 |
| PPO 性能下界 | $J(\pi') - J(\pi) \geq L_\pi(\pi') - C \cdot D_{KL}^{\max}(\pi \| \pi')$ | 配合 MM 算法說明單調改進保證 |
| Majorize-Maximize (MM) | 最大化性能下界可保證改進原始目標 | 搭配 $L_\pi(\pi) = 0$ 的關鍵性質 |
| 行為克隆 (BC) | 直接將模仿學習化簡為監督式學習 | 說明 IID 假設被破壞後誤差從 O(εT) 升至 O(εT²) |
| DAgger | 迭代執行策略 → 專家標注 → 資料集聚合 → 重新訓練 | 演算法流程圖 |
| 逆強化學習 (IRL) | 從最優示範中反推隱含的 reward function | 線性獎勵假設 + 特徵匹配 |
| 不可識別性 (IRL) | 多個獎勵函數可對應同一最優策略（縮放、零獎勵等） | 作為重要警示 |
| 特徵匹配 | 找到讓 $\mu(\pi) \approx \mu(\pi^*)$ 的策略即可逼近最優性能 | Holder 不等式推導 |

---

## 重要細節

### Delta 符號與 n 步優勢估計

定義一步 TD 誤差為：

$$\delta_t^V = r_t + \gamma V(s_{t+1}) - V(s_t)$$

利用此符號，k 步優勢估計可寫成 telescoping sum：

$$\hat{A}_t^{(k)} = \sum_{l=0}^{k-1} \gamma^l \delta_{t+l}^V$$

**Telescoping sum 推導（k=2 為例）**：

$$\hat{A}_t^{(2)} = r_t + \gamma V(s_{t+1}) - V(s_t) + \gamma(r_{t+1} + \gamma V(s_{t+2}) - V(s_{t+1}))$$
$$= r_t + \gamma r_{t+1} + \gamma^2 V(s_{t+2}) - V(s_t)$$

中間的 $V(s_{t+1})$ 項相消，此即 telescoping sum 之意。

偏差—變異數取捨：
- k=1（TD 估計）：高偏差、低變異數
- k→∞（MC 估計）：低偏差、高變異數

### 廣義優勢估計（GAE）

對所有 k 步估計取指數加權平均，引入超參數 $\lambda \in [0,1]$：

$$\hat{A}_t^{\text{GAE}(\gamma,\lambda)} = (1-\lambda)\sum_{k=1}^{\infty} \lambda^{k-1} \hat{A}_t^{(k)}$$

利用幾何級數化簡，最終緊湊形式為：

$$\hat{A}_t^{\text{GAE}(\gamma,\lambda)} = \sum_{l=0}^{\infty} (\gamma\lambda)^l \delta_{t+l}^V$$

**極端情形**：
- $\lambda = 0$：僅保留第一項，退化為 TD 估計（高偏差、低變異數）
- $\lambda = 1$：等同 MC 估計（低偏差、高變異數）

**PPO 中的截斷 GAE**：由於無窮 horizon 不可行，PPO 採用截斷版本，每 $T$（如 200）步計算一次，兼顧計算效率與估計品質。

### PPO 單調改進理論

**性能下界**（替代目標）：

$$J(\pi') - J(\pi) \geq L_\pi(\pi') - C \cdot D_{KL}^{\max}(\pi \| \pi')$$

其中替代目標：

$$L_\pi(\pi') = \frac{1}{1-\gamma} \mathbb{E}_{s \sim d^\pi} \left[\sum_a \frac{\pi'(a|s)}{\pi(a|s)} A^\pi(s,a)\right]$$

**單調改進定理（Majorize-Maximize）**：

設 $\pi^{k+1} = \arg\max_{\pi'} \left[L_{\pi^k}(\pi') - C \cdot D_{KL}^{\max}(\pi^k \| \pi')\right]$，則 $J(\pi^{k+1}) \geq J(\pi^k)$。

**關鍵步驟**：

1. 當代入 $\pi' = \pi^k$ 本身時：$L_{\pi^k}(\pi^k) = 0$（策略相對自身的優勢為零，因為 $Q^\pi(s,a) - V^\pi(s)$ 在策略 $\pi$ 下期望為零）
2. $D_{KL}(\pi^k \| \pi^k) = 0$（分布對自身的 KL 散度為零）
3. 因此下界在 $\pi' = \pi^k$ 時為 $0 - 0 = 0$
4. 由 argmax 的定義，$\pi^{k+1}$ 使下界 $\geq 0$
5. 因此 $J(\pi^{k+1}) - J(\pi^k) \geq 0$，即單調改進

**實務限制**：當 $\gamma \approx 1$ 時，常數 $C$ 極大（常與 $V_{\max}$ 和 $\frac{1}{1-\gamma}$ 成比例），導致步伐極小、實用性不足。這正是 PPO 採用自適應 KL 懲罰或截斷目標（clipped objective）的動機。

### 行為克隆（Behavior Cloning）

**算法**：從專家軌跡 $\{(s_0, a_0), (s_1, a_1), \ldots\}$ 直接學習策略 $\pi(a|s)$，化簡為標準監督式學習。

**早期案例**：ALVINN（存疑）——1980 年代末 CMU 開發的自動駕駛系統，以 30×32 視頻輸入配合淺層神經網路進行 BC，是此領域的先驅工作。

**誤差複合問題**：在監督式學習中假設資料 IID，期望總誤差為 $O(\epsilon T)$。但在 BC 中，決策在時序上相關，一旦偏離示範者軌跡，就會進入訓練資料稀少的區域，誤差可複合為 $O(\epsilon T^2)$——與 IID 情形差距懸殊。

**根本原因**：訓練分布（專家軌跡的狀態）與測試分布（學習策略實際訪問的狀態）不一致（distribution mismatch）。

### DAgger（Dataset Aggregation，資料集聚合）

**迭代算法**：
1. 初始化資料集 $D$，包含初始專家示範
2. 執行當前策略 $\hat{\pi}$，收集軌跡（訪問的狀態）
3. 請專家標注這些狀態對應的最優動作
4. 將新標注資料加入 $D$
5. 在 $D$ 上重新訓練（行為克隆）
6. 重複 2-5

**優點**：透過迭代覆蓋當前策略所訪問的狀態，緩解分布不匹配問題，具理論上的收斂保證。

**限制**：需要專家持續在線標注，人力成本極高，實際部署困難。相比之下，行為克隆只需一次性收集示範資料，更易於使用。

### 逆強化學習（Inverse Reinforcement Learning）

**問題設定**：已知狀態空間 $\mathcal{S}$、動作空間 $\mathcal{A}$、轉移模型，觀測到專家示範軌跡，但**不知獎勵函數** $R$；目標是反推 $R$ 並學習策略。

**不可識別性**：不存在唯一的 $R$ 使給定示範成為最優——例如縮放 $R$ 為正常數倍不改變最優策略；令 $R \equiv 0$ 則任何策略均最優。

**線性獎勵假設**：設 $R(s) = w^T \phi(s)$，其中 $\phi(s)$ 為狀態特徵向量，$w$ 為待識別的權重向量。

**價值函數分解**：在線性獎勵下，策略 $\pi$ 的期望折扣回報可寫成：

$$V^\pi = w^T \mu(\pi)$$

其中折扣狀態特徵頻率定義為：

$$\mu(\pi) = \mathbb{E}\left[\sum_{t=0}^{\infty} \gamma^t \phi(s_t) \,\Big|\, \pi, s_0\right]$$

**專家最優性約束**：若 $\pi^*$ 最優，則對所有 $\pi$ 有：

$$w^T \mu(\pi^*) \geq w^T \mu(\pi)$$

**特徵匹配**：若能找到策略 $\hat{\pi}$ 使 $\|\mu(\hat{\pi}) - \mu(\pi^*)\|_1 \leq \epsilon$，則由 Holder 不等式：

$$|V^{\hat{\pi}} - V^{\pi^*}| \leq \|w\|_\infty \cdot \|\mu(\hat{\pi}) - \mu(\pi^*)\|_1 \leq \|w\|_\infty \cdot \epsilon$$

**後續方向**（下講介紹）：最大熵逆強化學習（Maximum Entropy IRL）與 GAIL（存疑）——旨在解決不可識別性問題，在所有相容獎勵中選取特定解。

---

## 對「學會做決策」的意義

- **理論保證的重要性**：即使 PPO 實務上並不嚴格保證單調改進，理解其理論動機有助於設計更穩健的算法。
- **偏差—變異數的普遍性**：GAE 的 λ 超參數提供了在 TD（高偏差低變異）與 MC（低偏差高變異）之間的系統性折衷，這種思維框架貫穿 RL 全局。
- **從示範中學習的潛力與侷限**：BC 在資料充足時表現優良，但分布不匹配問題是本質性挑戰；DAgger 理論上更好但實務成本高；IRL 能提取隱含偏好卻面臨不可識別性。
- **現實應用的激勵**：講者多次以醫療（ICU 決策）、自動駕駛、機器人操作為例，說明這些方法在安全關鍵場景中的潛力。

---

## ASR 存疑名詞

| 原文（ASR） | 推斷 | 依據 |
|---|---|---|
| kale Divergence | KL Divergence（Kullback-Leibler Divergence）| 上下文「distance between action distributions」 |
| kust region | trust region | 上下文「trust region or clipping」，TRPO 相關 |
| Alvin / ALVINN | ALVINN（Autonomous Land Vehicle In a Neural Network）| 上下文「late '80s CMU, driving, shallow neural network」 |
| dorsa SES group | Dorsa Sadigh 的研究組（史丹福 HRI 組）| 上下文「teleoperation, robotic arm manipulation」 |
| po / ppo | PPO（Proximal Policy Optimization）| 全講核心算法 |
| dagger | DAgger（Dataset Aggregation）| 算法名稱全文 "dagger" |
| Coral | CoRL（Conference on Robot Learning）| 上下文「robotics conferences」，CoRL 為主要機器人 RL 會議 |
| Gale | GAIL（Generative Adversarial Imitation Learning）| 上下文與 Max Entropy IRL 並列，為下講主題 |
| kstep estimators | k-step estimators | 明確數學上下文 |
| Alvin 1982 | ALVINN 可能實際為 1989 年（Dean Pomerleau，CMU）| 講者說「late '80s」；1982 年另有其他早期案例 |

---

## 跨章連結

| 連結到 | 說明 |
|---|---|
| 第 5-6 章（Policy Gradient 1-2）| 本講建立在 REINFORCE 和 PPO 基礎之上；GAE 是 PPO 優勢估計的具體實現 |
| 第 3-4 章（TD 與 MC）| Delta 符號、telescoping sum、偏差—變異數取捨均在此建立 |
| 第 1 章（Introduction）| 模仿學習（IL）的地位在第一章概括介紹，本講詳細展開 BC、DAgger、IRL |
| 第 8 章（預期）| 本講結尾宣告下講主題：Max Entropy IRL 與 GAIL |
| 作業 2 | 學生實作 REINFORCE 與 PPO，須理解 GAE |
| 作業 3 | 包含 RLHF 相關內容，需理解 IRL 的偏好學習框架 |

---

## 相關教材

- **Sutton & Barto**：Chapter 13（Policy Gradient）— 待核對
- **GAE 原始論文**：Schulman et al. (2015), "High-Dimensional Continuous Control Using Generalized Advantage Estimation" — 待補
- **PPO 論文**：Schulman et al. (2017), "Proximal Policy Optimization Algorithms" — 待補
- **DAgger 論文**：Ross, Gordon & Bagnell (2011), "A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning" — 待補
- **IRL/Feature Matching**：Abbeel & Ng (2004), "Apprenticeship Learning via Inverse Reinforcement Learning" — 待補
- **投影片 / 作業**：待補

---

## 資訊不足與待補清單

1. 常數 $C$ 在性能下界中的精確形式（講者說「C is a constant, welcome to look it up in the paper」）
2. ALVINN 的準確年份（講者說「late '80s」，但也說 1982，前後有出入）
3. 截斷 GAE 的詳細邊界條件（$\lambda = 1$ 且 $H = \infty$ 時的處理）
4. 「dorsa SES group」對應的具體研究組與代表論文
5. CoRL 中關於 offline RL 重要因素的具體論文名稱
6. Max Entropy IRL 和 GAIL 的詳細內容（留待第 8 章）

---

## 修訂紀錄

| 日期 | 內容 | 負責 |
|---|---|---|
| 2026-07-05 | 建立，Batch 2 worker | 章節 worker agent |
