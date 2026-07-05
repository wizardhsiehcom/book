# 閱讀筆記：Lecture 11 — Exploration 1: Multi-Armed Bandits

## 基本資料

- 章節編號：11
- 章節標題：Exploration 1: Multi-Armed Bandits（探索一：多臂賭博機）
- 對應逐字稿：`data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Exploration 1 I 2024 I Lecture 11 [sqYii3nd78w].txt`
- 完整閱讀日期：2026-07-05
- 閱讀範圍：字元 0 到結尾，全文 58,964 位元組（單行無換行）
- 閱讀者：章節 worker（Batch 3）
- 狀態：已成章

---

## 逐字稿完整閱讀紀錄

- 是否從頭到尾完整閱讀：是
- 跳過段落：無
- 前置複習段落（importance sampling / PPO 複習）：已讀，不納入本章主要內容

---

## 本講主問題

本講的核心問題是：**在樣本數有限的情況下，強化學習智能體應如何有策略地收集資料、以最小的代價找到最優動作？** Brunskill 以多臂賭博機（Multi-Armed Bandit, MAB）作為最簡化的 RL 問題框架，說明貪婪演算法（greedy）為何失敗，以及後悔值（regret）如何量化演算法的優劣。她接著引入 Hoeffding 不等式和樂觀原則（optimism under uncertainty），推導出 UCB1 演算法，並證明其期望後悔值為對數成長（logarithmic regret），達到 Lai-Robbins 下界所允許的最佳數量級。

---

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| 多臂賭博機（MAB） | 無狀態、有限行動、每次拉桿得到 stochastic 獎勵；目標最大化累積獎勵 | 11.1 節正式定義 |
| 貪婪演算法 | 每次選期望值最高的臂；可能永遠鎖定次優臂 → 線性後悔 | 11.2 節反例說明 |
| 後悔值（Regret） | $\Delta_a = Q(a^*) - Q(a)$；$L_T = \sum_a N_T(a)\Delta_a$ | 11.3 節定義 |
| ε-greedy | 以 ε 機率隨機探索；靜態 ε → 線性後悔 | 11.4 節分析 |
| Lai-Robbins 下界 | 任何演算法的後悔至少是 $\Omega(\log T)$ 的；給出希望 | 11.5 節 |
| 樂觀原則（Optimism Under Uncertainty） | 選 UCB 最大的臂：要麼得高獎勵，要麼學到東西 | 11.6 節原理 |
| Hoeffding 不等式 | $P(\bar{X}_n - \mu \geq u) \leq e^{-2nu^2}$；推導置信上界 | 11.7 節推導 |
| UCB1 演算法 | $a_t = \arg\max_a\bigl[\hat{Q}(a) + \sqrt{c\log(1/\delta)/N_t(a)}\bigr]$ | 11.8 節演算法與例子 |
| UCB 後悔界 | 次優臂被拉的次數 $\leq 4c\log(1/\delta)/\Delta_a^2$；總後悔 $O(\log T)$ | 11.9 節證明草稿 |
| 悲觀演算法（Lower Bound）的失敗 | 選最高 lower bound → 可能永遠不探索次優臂 → 線性後悔 | 11.10 節對比 |

---

## 重要細節

### 定義

**多臂賭博機（MAB）：**
- 動作集合 $\mathcal{A}$，共 $K$ 個臂
- 每個臂 $a$ 有未知獎勵分布，期望值 $Q(a) = \mathbb{E}[r \mid a]$
- 無狀態轉移，無折扣，目標：最大化 $\sum_{t=1}^T r_t$
- 破趾甲例子：三臂為「手術」、「固定」、「不處理」；獎勵 = 六週後是否痊癒（Bernoulli）

**後悔值（Regret）：**
$$V^* = \max_a Q(a), \qquad \Delta_a = V^* - Q(a)$$
$$L_T = \sum_{t=1}^T (V^* - Q(a_t)) = \sum_{a \in \mathcal{A}} N_T(a) \cdot \Delta_a$$

其中 $N_T(a)$ 為截至時間 $T$ 選擇行動 $a$ 的次數。

**目標等價性：** 最大化累積獎勵 ≡ 最小化總後悔值。

### 定理與不等式

**Hoeffding 不等式（Hoeffding's Inequality）：**

設 $X_1, \ldots, X_n$ 為 i.i.d. 隨機變數，值域 $[0,1]$，真實期望 $\mu$，樣本均值 $\bar{X}_n$：
$$P(\bar{X}_n - \mu \geq u) \leq e^{-2nu^2}$$
等價地（取雙側絕對值形式）：
$$P(|\bar{X}_n - \mu| \geq u) \leq 2e^{-2nu^2}$$

**由 Hoeffding 推導置信上界（UCB）：**

設 $\delta = 2e^{-2nu^2}$，則 $u = \sqrt{\frac{\log(2/\delta)}{2n}}$。
以 $c$ 吸收常數，並令 $n = N_t(a)$：
$$\text{UCB}_t(a) = \hat{Q}(a) + \sqrt{\frac{c\log(1/\delta)}{N_t(a)}}$$
此上界以 $\geq 1 - \delta$ 的機率包含真實期望 $Q(a)$。

**Lai-Robbins 下界（存疑：ASR "lean Robbins"，推斷為 Lai & Robbins 1985）：**

對任意一致演算法，問題相依後悔下界為：
$$L_T \geq \sum_{a:\Delta_a > 0} \frac{\Delta_a}{\text{KL}(\mu_a \| \mu^*)} \cdot \log T$$
此下界為 $\Omega(\log T)$，表明對數成長是「最佳可能」的目標。

**UCB1 後悔上界（問題相依）：**

對任何次優臂 $a$（即 $\Delta_a > 0$），在置信區間成立條件下：
$$N_T(a) \leq \frac{4c \log(1/\delta)}{\Delta_a^2} + \sqrt{3} + 1$$
因此期望累積後悔 $L_T = O\!\left(\sum_{a:\Delta_a>0} \frac{\log T}{\Delta_a}\right)$，為對數成長。

### 演算法

**貪婪演算法（Greedy）：**
1. 每個臂各拉一次（初始化）
2. 計算 $\hat{Q}(a) = \frac{\sum_t r_t \mathbf{1}[a_t = a]}{N_T(a)}$
3. $a_{t+1} = \arg\max_a \hat{Q}(a)$
- 缺陷：可因隨機初始值鎖定次優臂，後悔值線性成長 $O(T)$

**ε-greedy（靜態 ε）：**
- 以機率 $1 - \varepsilon$ 貪婪；以機率 $\varepsilon$ 均勻隨機
- 靜態 $\varepsilon > 0$：後悔值線性，因每個次優臂仍有 $\Omega(\varepsilon T / K)$ 次被拉
- $\varepsilon = 0$（即 greedy）：同樣可能線性後悔
- 衰減 $\varepsilon(t)$：在適當衰減率下可達到次線性後悔

**UCB1 演算法：**

```
初始化：每個臂各拉一次
for t = K+1, K+2, ... do
    for 每個臂 a do
        UCB(a) = Q̂(a) + sqrt(c · log(1/δ) / N_t(a))
    end
    a_t = argmax_a UCB(a)
    觀察獎勵 r_t，更新 N_t(a_t) 與 Q̂(a_t)
end
```

**Union Bound 與 δ 的設定：**

為確保所有 $T$ 個時間步、所有 $|A|$ 個臂的置信區間**同時**成立：
$$\delta \approx \frac{\delta'}{T \cdot |\mathcal{A}|}$$
代入後 $\log(1/\delta)$ 項出現 $\log(T |\mathcal{A}| / \delta')$，不改變後悔值的對數成長數量級。

### 講者例子

- **破趾甲 MAB**：手術、固定、不處理；真實勝率 $\theta_1 > \theta_2 > \theta_3$；用貪婪法在初始壞樣本後永遠選擇次優臂
- **廣告點擊率**：差距（Gap）極小（如 0.10 vs 0.11），需要大量樣本；說明問題相依界的重要性
- **UCB 更新過程**：以三臂具體示範 UCB 值如何隨樣本增加而收縮，並說明為何不同臂會交替被選

### Q&A 重點

- **為何優化等同最小化後悔？** 因 $V^*$ 固定不變，最大化 $\sum r_t$ 等同最小化 $\sum \Delta_{a_t}$
- **δ 如何設定？** 用 Union Bound，令 $\delta = \delta'/(T|A|)$，確保所有置信區間同時成立
- **UCB 比 Greedy 好在哪？** Greedy 不更新未探索臂的置信區間；UCB 在少樣本時給高 bonus，迫使系統探索
- **如果選最高 lower bound 呢？** 悲觀選擇（pessimistic）會導致線性後悔：例如真值高但 lower bound 低的臂永遠不被選中

---

## 對「學會做決策」的意義

- 本講是第一個給出**可證明次線性後悔**的演算法（UCB1），標誌著從「以計算資源換效能」到「以理論保證換樣本效率」的轉變
- 樂觀原則（optimism under uncertainty）是 RL 探索設計的根本原則：**面對未知要樂觀，因為樂觀要麼直接得到高獎勵，要麼加速學習**
- 後悔（regret）框架將探索—利用取捨量化為可比較的指標，是評估 bandit / RL 演算法的標準工具
- MAB 的結論將在後續 MDP 探索章節（Lecture 12-13）推廣到有狀態的環境

---

## ASR 存疑名詞

| 原文（ASR） | 推斷 | 依據 |
|---|---|---|
| lean Robbins | Lai and Robbins（Lai-Robbins 1985） | 上下文「lower bound on regret」，著名理論結果 |
| ladimore and Chaba sasari | Tor Lattimore and Csaba Szepesvári | 上下文「great book on bandits, came out of blog posts」 |
| ofu | OFU（Optimism in the Face of Uncertainty） | 上下文為 UCB 演算法族的別名 |
| newly variable | Bernoulli variable（伯努利變數） | 上下文「model each arm as a __ variable with unknown parameter Theta」 |
| hopings inequality | Hoeffding's inequality | 上下文明確：n samples, empirical vs true mean |
| our UE 2002 / AuR 2002 | Auer et al. 2002（UCB1 原始論文） | 上下文「paper where they first named it one」 |
| kale difference / a kale | KL divergence（Kullback-Leibler 散度） | 出現在 Lai-Robbins 下界表達式中 |
| Mofo | 課堂學生名字（不明） | 上下文「Mofo's toe」，舉例說明 |
| Sophie | 課堂學生名字 | 上下文「when Sophie shows up」 |
| deadly Triad | Deadly Triad（致命三角） | 已知 RL 術語，三要素：函數逼近、bootstrapping、off-policy |

---

## 跨章連結

- **第 1 章**：探索（Exploration）是 RL 四支柱之一；「探索就是隨機行動」是常見誤解，本章正式駁斥
- **先前章節**：ε-greedy 在 policy evaluation 中曾提及；本講深入分析其後悔特性
- **Lecture 12**：貝葉斯 Bandits（Bayesian Bandits）/ Thompson Sampling，從頻率學派轉向貝葉斯觀點
- **Lecture 13**：回到 MDP 設定下的探索（exploration in MDPs），MAB 概念推廣

---

## 相關教材

- **Sutton & Barto**：Ch. 2（Multi-armed Bandits）對應本講 MAB 框架與 UCB 內容；`待核對`頁碼
- **Lattimore & Szepesvári**：*Bandit Algorithms*（2020），約第 7 章有本講 UCB1 後悔界的嚴格證明；`待核對`
- 課程 slides / 作業關聯：作業三（homework 3）涉及 Hoeffding 不等式；`待補`其他細節

---

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| Lai-Robbins (1985) 論文完整引用 | 原始論文 | 外部補充階段處理 |
| Auer et al. (2002) UCB1 論文引用 | Journal of Machine Learning Research | 外部補充階段處理 |
| Lattimore & Szepesvári 書的章節確認 | `data/cs234/reference/` 或網路 | `待核對` |
| Sutton & Barto Ch. 2 頁碼 | `data/cs234/reference/SuttonBarto-RL-2nd.pdf` | `待核對` |
| UCB1 後悔界的完整常數 C' 值 | 課程講義或上述書籍 | 待補 |
| ε 衰減的具體公式與最優衰減率 | 課程後續或書籍 | 待補 |

---

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-05 | 建立 | Batch 3 worker，完整閱讀全文 58,964 bytes |
