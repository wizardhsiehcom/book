# 第四章：Actor-Critic 方法

> **逐字稿：** Lecture 4 Actor-Critic Methods（完整閱讀，2026-07-06）

## 導讀

這一章解決的問題是：Policy Gradient 的梯度為什麼這麼嘈雜，以及如何系統性地降低它的方差？

上一章推導出 REINFORCE 梯度，其核心是用觀測到的 reward-to-go 來衡量每個動作的好壞。問題是，一條軌跡的 reward-to-go 是一個高方差估計：同樣的動作在不同 rollout 可能因為環境噪聲或後續決策的差異，得到截然不同的結果。

Actor-Critic 方法的解法是：不要等 rollout 結束才評估動作，而是**顯式學習一個值函數**（Critic），讓它更準確、更穩定地告訴我們某個狀態或動作的長期價值。

---

## 一、三個核心函數

### 1.1 值函數 $V^\pi(s)$

從狀態 $s$ 出發，按策略 $\pi$ 執行，期望的累積未來獎勵：

$$V^\pi(s_t) = \mathbb{E}_{\tau \sim \pi} \left[\sum_{t'=t}^T r(s_{t'}, a_{t'}) \;\Big|\; s_t\right]$$

直覺：V 是一張地圖，告訴你每個狀態在當前策略下值多少。

### 1.2 Q 函數 $Q^\pi(s, a)$

從狀態 $s$ 先強制採取動作 $a$（不管 $\pi$ 的選擇），之後再按 $\pi$ 執行：

$$Q^\pi(s_t, a_t) = \mathbb{E}_{\tau \sim \pi} \left[\sum_{t'=t}^T r(s_{t'}, a_{t'}) \;\Big|\; s_t, a_t\right]$$

關係：$V^\pi(s) = \mathbb{E}_{a \sim \pi(\cdot|s)}[Q^\pi(s, a)]$

### 1.3 優勢函數 $A^\pi(s, a)$

這個動作比策略的「平均水準」好多少？

$$A^\pi(s, a) = Q^\pi(s, a) - V^\pi(s)$$

- $A > 0$：這個動作比策略的平均期望更好 → 增加其似然
- $A < 0$：這個動作比策略的平均期望更差 → 降低其似然
- $A = 0$：和策略一樣好，不需要改變

**範例（打鼓練習）：**

| 動作 | $Q^\pi$ | $V^\pi$ | $A^\pi$ | 梯度方向 |
|---|---|---|---|---|
| 坐海灘 | 0 | 0 | 0 | 不變 |
| 看電視 | 0 | 0 | 0 | 不變 |
| 練習打鼓 | 1 | 0 | +1 | 增加似然 |

（當前策略是永遠坐海灘，所以 $V^\pi = 0$）

---

## 二、優勢加權策略梯度

用優勢函數替換 REINFORCE 中的 reward-to-go：

$$\nabla_\theta J(\theta) \approx \frac{1}{N}\sum_i \sum_t \nabla_\theta \log \pi_\theta(a_t^i|s_t^i) \cdot \hat{A}^\pi(s_t^i, a_t^i)$$

**為什麼更好？** Reward-to-go 用單條軌跡估計，方差高；優勢函數用神經網路學習，可以利用所有見過的資料，估計更穩定。

---

## 三、如何估計 $V^\pi$

我們不需要直接估計 $Q^\pi$ 或 $A^\pi$——可以只估計 $V^\pi$，然後用下面的關係推導出優勢：

$$Q^\pi(s_t, a_t) = r(s_t, a_t) + V^\pi(s_{t+1})$$
$$\Rightarrow \hat{A}^\pi(s_t, a_t) \approx r(s_t, a_t) + V^\pi(s_{t+1}) - V^\pi(s_t)$$

（用觀測到的 $s_{t+1}$ 作為期望的單樣本近似）

### 估計 $V^\pi$ 的三種方法

#### 方法一：Monte Carlo

用觀測到的 reward-to-go 作為監督目標：

$$\text{目標}_{MC} = \sum_{t'=t}^T r(s_{t'}, a_{t'})$$

- **偏差：** 零（直接觀測）
- **方差：** 高（軌跡的隨機性全部保留）

#### 方法二：Temporal Difference（TD / Bootstrapping）

用「當前獎勵 + 下一狀態的值函數估計」作為目標：

$$\text{目標}_{TD} = r_t + \gamma V^\phi(s_{t+1})$$

- **偏差：** 有（依賴 $V^\phi$ 的準確性）
- **方差：** 低（只有一步的噪聲，其餘由模型估計）

#### 方法三：n-step Returns（混合）

結合直接觀測 $n$ 步獎勵，再 bootstrap：

$$\text{目標}_{n\text{-step}} = \sum_{k=0}^{n-1} \gamma^k r_{t+k} + \gamma^n V^\phi(s_{t+n})$$

- $n=1$：等同 TD
- $n=T$：等同 Monte Carlo
- 實務上 $n$ 選 1 到 $T$ 之間，視環境確定性和時間步長而定

| 方法 | 偏差 | 方差 | 適用場景 |
|---|---|---|---|
| Monte Carlo | 無 | 高 | 短 horizon、確定性環境 |
| TD (n=1) | 有 | 低 | 長 horizon、stochastic 環境 |
| n-step | 介中 | 介中 | 多數實務場景 |

### Discount Factor $\gamma$

對無限 horizon 或極長 horizon，直接累積所有獎勵可能使 $V$ 發散。加入折扣因子：

$$\text{目標} = \sum_{k=0}^{n-1} \gamma^k r_{t+k} + \gamma^n V^\phi(s_{t+n}), \quad \gamma \in (0, 1]$$

等效解釋：每個時間步有 $(1-\gamma)$ 的機率進入 zero-reward 吸收狀態。$\gamma = 0.99$ 表示約 100 步後獎勵降至初始的 $e^{-1}$。

---

## 四、完整的 Actor-Critic 算法

```
初始化：策略 π_θ（Actor），值函數 V^φ（Critic）

循環：
  1. 以 π_θ 採樣 N 條軌跡
  2. 擬合 V^φ：
     - 計算每個 (s_t, s_{t+1}, r_t) 的目標值（TD 或 n-step）
     - 最小化 MSE(V^φ(s_t), 目標值)，多次梯度步
  3. 計算優勢估計：
     Â(s_t, a_t) = r_t + γ·V^φ(s_{t+1}) - V^φ(s_t)
  4. 更新策略：
     θ ← θ + α · Σ_t ∇_θ log π_θ(a_t|s_t) · Â(s_t, a_t)
  5. 重新採樣（on-policy）
```

**兩個神經網路：**
- **Actor（π_θ）**：輸入狀態，輸出動作分布；只更新一次（on-policy）
- **Critic（V^φ）**：輸入狀態，輸出單一純量；可更新多次

**名稱由來：** Critic「批評」每個狀態的價值，Actor 根據批評決定行動。

---

## 五、TD 學習的直覺：跨軌跡資訊聚合

**Monte Carlo vs Bootstrapping 對比（兩條軌跡）：**

```
軌跡 1：藍色狀態 → ... → 最終獎勵 +1
軌跡 2：                  → 最終獎勵 -1
（藍色狀態在兩條軌跡都出現）
```

- Monte Carlo：藍色狀態的值估計 = (1 + (-1)) / 2 = 0（正確，但只利用了路過的資料）
- Bootstrapping：藍色狀態的值估計也能聚合兩條軌跡的信息，並且把信息傳播到更早的狀態

TD 的優勢在於：通過反覆更新，信息從有獎勵的狀態「向前」傳播到更早的狀態，不需要等到 episode 結束才能學到有用的信息。

---

## 六、Actor-Critic 解決 Policy Gradient 的問題

**問題一：折夾克稀疏獎勵**

PG 看不出「折袖子」和「沒動」的差別（都是 reward = 0）。Critic 學會後，能估計出「折袖子」的 $V$ 更高，讓梯度知道這個動作是有進展的。

**問題二：一步前進、隨後摔倒**

PG 因為整條軌跡的 reward 為負，會降低「前進一步」的似然。Critic 能估計出「向前一步」之後的 $V$ 更高，讓 $A > 0$，梯度正確地鼓勵這個中間步驟。

---

## 小結

1. **V^π, Q^π, A^π** 是三個互相關聯的值函數；優勢函數衡量動作相對策略均值的好壞。
2. **用優勢代替 reward-to-go**：優勢加權梯度與原始 RL 目標一致，且方差更低。
3. **V^π 可用監督學習擬合**，目標值有 Monte Carlo（無偏高方差）、TD（有偏低方差）、n-step（折衷）三種。
4. **Discount factor γ** 讓長 horizon 的值函數可以穩定學習。
5. **Actor-Critic = 策略網路（Actor）+ 值函數網路（Critic）**；Critic 多次更新，Actor 每批一次更新。
6. 這是 PPO、SAC 等現代算法的基礎——PPO 在下一章展開。

---

*下一章：Off-Policy Actor Critic —— 如何讓 Actor-Critic 支持 off-policy 更新，更有效地重用歷史資料（SAC）。*
