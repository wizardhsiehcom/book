# 第六章：Q-Learning

> **逐字稿：** Lecture 6 Q-Learning（完整閱讀，2026-07-06）

## 導讀

前幾章的算法都維護了一個**顯式策略網路**（Actor），再用值函數輔助更新它。這一章走另一條路：**不學策略，只學 Q 函數**，然後直接把「取 argmax 的動作」當成策略。

這個想法簡單卻深刻，它孕育出了 2013 年的 DQN——深度強化學習的起點。

---

## 一、隱式策略：從 Q 函數直接推導動作

已知策略 $\pi$ 的 Q 函數估計 $\hat{Q}^\pi$，定義一個新策略：

$$\pi'(s) = \arg\max_a \hat{Q}^\pi(s, a)$$

這個策略**永遠選 Q 值最高的動作**。可以證明：

> $\pi'$ 對任意策略 $\pi$ 都不差：$V^{\pi'}(s) \geq V^\pi(s)$，對所有 $s$ 成立。

直覺：在每個狀態，$\pi'$ 選的是 Q 最高的動作，比 $\pi$ 的「平均水準」只高不低。

**範例（二維格子世界）：**

當前策略 $\pi$ 一路向右，但目標星在右上角。$\pi$ 的 Q 值會揭示：右上方的格子，「向上」的 Q 值高於「向右」。因此 $\pi'$ 在那些格子改向上。一次策略改進後，性能提升，但尚未達到最優——需要**迭代改進**。

---

## 二、策略迭代（Policy Iteration）

交替執行兩個步驟：

1. **策略評估（Policy Evaluation）：** 擬合 $\hat{Q}^{\pi_k}$，學習當前策略的 Q 函數。
2. **策略改進（Policy Improvement）：** $\pi_{k+1}(s) = \arg\max_a \hat{Q}^{\pi_k}(s,a)$。

反覆迭代即可收斂到最優策略 $\pi^*$（在表格設定下有保證）。

---

## 三、Bellman 方程與 Bellman 最優性方程

**Bellman 方程**（對任意策略 $\pi$）：

$$Q^\pi(s,a) = r(s,a) + \gamma \cdot \mathbb{E}_{s' \sim p,\; a' \sim \pi}\big[Q^\pi(s',a')\big]$$

**Bellman 最優性方程**（僅對最優策略 $\pi^*$ 成立）：

$$Q^*(s,a) = r(s,a) + \gamma \cdot \mathbb{E}_{s' \sim p}\big[\max_{a'} Q^*(s',a')\big]$$

Q-Learning 的目標就是**讓 Q 函數滿足 Bellman 最優性方程**——當此方程成立，$Q$ 就是 $Q^*$，策略就是最優的。

---

## 四、Q-Learning 算法

用 Bellman 最優性方程設計訓練目標。對 Replay Buffer 中的 $(s, a, r, s')$：

$$y_i = r_i + \gamma \max_{a'} \hat{Q}(s'_i, a')$$

最小化：

$$\mathcal{L}(\phi) = \frac{1}{|B|} \sum_i \big(\hat{Q}^\phi(s_i, a_i) - y_i\big)^2$$

Q-Learning 是**完全 off-policy**：$y_i$ 的推導不依賴動作來自哪個策略，因此可以使用任意舊資料。

### 探索策略

學習期間，資料收集策略應比貪婪策略 $\arg\max_a Q$ 更寬：

| 方法 | 做法 | 特點 |
|---|---|---|
| **ε-greedy** | 以機率 $\epsilon$ 隨機動作，否則 $\arg\max_a Q$ | 簡單，訓練初期 ε 大、後期 ε 小 |
| **Boltzmann** | $\pi(a|s) \propto \exp(Q(s,a)/T)$ | Q 高的動作被採樣更頻繁 |

### 完整算法

```
初始化：Q^φ，空 Replay Buffer D，探索策略 π_exp

循環：
  1. 用 π_exp 採集轉移 (s,a,r,s')，加入 D
  2. 從 D 均勻採樣 mini-batch
  3. 計算目標 y_i = r_i + γ·max_{a'} Q^φ(s'_i, a')
  4. 梯度步最小化 E[(Q^φ(s,a) - y)²]，重複 K 次
  5. 迴圈

部署：π(s) = argmax_a Q^φ(s,a)
```

---

## 五、深度 Q-Network（DQN）的穩定技巧

直接用神經網路訓練 Q-Learning 容易不穩定（目標 $y$ 本身依賴 $Q$，是「移動目標」）。DQN 引入三個技巧：

### 技巧一：Target Network（目標網路）

維護兩份 Q 網路：

- **訓練網路** $Q^\phi$：每步更新
- **目標網路** $Q^{\phi'}$：每 $N$ 步才同步到 $\phi'=\phi$，計算目標 $y$ 時用 $Q^{\phi'}$

目標 $y$ 在 $N$ 步內固定，讓內層循環變成標準監督學習，大幅提升穩定性。

### 技巧二：Double DQN（解決高估問題）

**問題：** 標準 Q-Learning 用同一個網路選動作和估值，噪聲疊加導致 Q 值系統性高估。

**解法：** 選動作用 $Q^\phi$，估值用 $Q^{\phi'}$：

$$y_i = r_i + \gamma \cdot Q^{\phi'}\!\left(s'_i,\; \arg\max_{a'} Q^\phi(s'_i, a')\right)$$

兩個網路的噪聲不完全相關，高估問題大幅緩解。

### 技巧三：n-step Returns

在 Q-Learning 中用 $n$ 步累積獎勵再 bootstrap：

$$y_i = \sum_{k=0}^{n-1} \gamma^k r_{t+k} + \gamma^n \max_{a'} Q^{\phi'}(s_{t+n}, a')$$

優點：學習初期 Q 函數不準時，直接的獎勵信號更可靠，加快學習。  
缺點：這 $n$ 步獎勵來自舊策略，對 off-policy 有輕微偏差（實務上通常忽略）。

---

## 六、DQN 的成就

DQN（2013, DeepMind）是第一個從原始像素學習的深度 RL 算法：

- 輸入：Atari 遊戲的像素畫面
- 輸出：不同按鍵的 Q 值
- 結果：在多個 Atari 遊戲上達到或超過人類水準

**實際觀察：** 訓練中損失函數可能持續上升——這是正常的，因為收集到更高回報的資料後，Q 值目標本身也在增加（不要因為 loss 升高就停止訓練）。

---

## 七、算法選擇指南

| 算法 | 最適場景 | 優點 | 缺點 |
|---|---|---|---|
| **PPO** | 模擬器、LLM 訓練 | 穩定、易調參 | 資料效率低 |
| **DQN** | 離散或低維動作空間 | 資料效率中等 | 連續動作需另行處理 |
| **SAC** | 真實機器人、連續控制 | 資料效率最高 | 不穩定、調參複雜 |

---

## 小結

1. **隱式策略：** Q 函數 + argmax = 策略，無需顯式策略網路。
2. **Policy Iteration：** 評估 → 改進 → 評估……迭代收斂至最優。
3. **Bellman 最優性方程** 是 Q-Learning 的訓練目標；學到的 Q 滿足此方程時即為 $Q^*$。
4. **DQN 三技巧：** Target Network（穩定目標）、Double DQN（消除高估）、n-step returns（加速早期學習）。
5. **探索策略（ε-greedy / Boltzmann）** 確保 Q 函數在動作空間有足夠覆蓋。

---

*下一章：Offline RL —— 如果資料已固定，不能再收集新資料，如何從中學到好策略？*
