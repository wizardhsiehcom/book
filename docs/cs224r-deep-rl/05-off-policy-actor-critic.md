# 第五章：Off-Policy Actor Critic

> **逐字稿：** Lecture 5 Off-Policy Actor Critic（完整閱讀，2026-07-06）

## 導讀

上一章的 Actor-Critic 是 on-policy 算法：每次更新策略後，必須重新採集資料，資料效率很低。這一章的核心問題是：**如何讓 Actor-Critic 更好地重用過去的資料？**

答案分為兩條路線：

1. **短程 off-policy（PPO）：** 同一批資料做多次梯度步，靠 clipping 限制更新幅度。
2. **完全 off-policy（SAC）：** 把所有歷史資料存進 Replay Buffer，每次從中隨機採樣更新。

---

## 一、為何需要多步更新 — Importance Sampling 回顧

On-policy Actor-Critic 的瓶頸在於「一批資料只能做一個梯度步」。若要用舊策略 $\pi_\theta$ 收集的資料估計新策略 $\pi_{\theta'}$ 的梯度，需要加入**重要性權重**：

$$\nabla_{\theta'} J(\theta') \approx \frac{1}{N}\sum_{i,t} \frac{\pi_{\theta'}(a_t^i|s_t^i)}{\pi_\theta(a_t^i|s_t^i)} \cdot \nabla_{\theta'} \log \pi_{\theta'}(a_t^i|s_t^i) \cdot \hat{A}^\pi(s_t^i, a_t^i)$$

對應的 **Surrogate Objective**（代理目標，供 PyTorch 自動微分）：

$$\mathcal{L}(\theta') = \frac{1}{N}\sum_{i,t} \frac{\pi_{\theta'}(a_t^i|s_t^i)}{\pi_\theta(a_t^i|s_t^i)} \cdot \hat{A}^\pi(s_t^i, a_t^i)$$

**問題：** 多次更新 $\theta'$ 後，$\theta'$ 與收集資料時的 $\theta$ 差距越來越大，優勢估計 $\hat{A}^\pi$ 會過時，學習不穩定。

---

## 二、PPO：Proximal Policy Optimization

PPO 的目標是允許多次梯度步，同時避免策略偏離太遠。它提供兩種機制：

### 2.1 方法一：KL 散度懲罰

在代理目標中加入 KL 散度懲罰，阻止新舊策略差距過大：

$$\mathcal{L}_{KL}(\theta') = \mathcal{L}(\theta') - \beta \cdot D_{KL}(\pi_{\theta'} \| \pi_\theta)$$

超參數 $\beta$ 控制約束強度。KL 約束也是後來 LLM 對齊中常用的技術。

### 2.2 方法二：Clipping（PPO-Clip，最常用版本）

直接截斷重要性比值，讓它無法超出 $[1-\epsilon,\, 1+\epsilon]$：

$$r_t(\theta') = \frac{\pi_{\theta'}(a_t|s_t)}{\pi_\theta(a_t|s_t)}, \qquad \epsilon \approx 0.2$$

$$\mathcal{L}_{\text{clip}}(\theta') = \min\!\Big(\underbrace{r_t(\theta') \cdot \hat{A}}_{\text{原始代理}},\; \underbrace{\text{clip}(r_t(\theta'), 1-\epsilon, 1+\epsilon) \cdot \hat{A}}_{\text{截斷代理}}\Big)$$

取 **min** 的意義：確保截斷永遠不會讓目標函數變得「比原始更好」——這是對原始代理目標的下界，避免 clipping 在某些極端情況下誤讓目標升高。

### 2.3 技巧三：廣義優勢估計（GAE）

PPO 還使用 GAE（Generalized Advantage Estimation），對不同步長 $n$ 的優勢估計做指數加權平均：

$$\hat{A}_t^{GAE} = \sum_{l=0}^{\infty} (\gamma\lambda)^l \delta_{t+l}, \qquad \delta_t = r_t + \gamma V(s_{t+1}) - V(s_t)$$

$\lambda \in [0,1]$ 控制偏差-方差折衷（$\lambda=0$ 等同 TD，$\lambda=1$ 等同 Monte Carlo）。

### 2.4 完整 PPO 算法

```
初始化：π_θ（Actor），V^φ（Critic）

外層循環（約 500 次）：
  1. 用 π_θ 採集約 2000 步資料，存入 batch
  2. 對 batch 做 V^φ 擬合（回歸到 TD 目標）
  3. 用 GAE 計算所有 (s,a) 的優勢估計 Â
  4. 對 surrogate objective（帶 clip）做 M 個 epoch（約 10 epoch = ~300 梯度步）
  5. 更新 θ；θ_old ← θ 並重新採樣
```

**實務超參數：** batch ≈ 2000 步，10 epoch（batch size 64），ε = 0.2，外層重複 ≈ 500 次。

---

## 三、完全 Off-Policy：Replay Buffer

若要重用**所有歷史資料**（而不只是最後一批），需要：

1. **Replay Buffer：** 存所有歷史 $(s, a, r, s')$ 轉移。
2. **修正算法：** 去除對「資料來自當前策略」的假設。

```
初始化：空 Replay Buffer D

循環：
  1. 用 π_θ 採集一步（或一批），將 (s,a,r,s') 加入 D
  2. 從 D 中隨機抽取 mini-batch
  3. 用 mini-batch 更新 Critic 和 Actor
```

### 為什麼 V 函數不能直接用 Replay Buffer？

Buffer 中的資料來自**過去各版本策略的混合**，用它學到的 $V$ 不是當前策略的值函數，優勢估計會失準。

### 解法：用 Q 函數代替 V 函數

Q 函數有遞迴定義（Bellman 方程）：

$$Q^\pi(s_t, a_t) = r(s_t, a_t) + \gamma \cdot \mathbb{E}_{s_{t+1} \sim p,\; a_{t+1} \sim \pi}\big[Q^\pi(s_{t+1}, a_{t+1})\big]$$

這個等式**對任意 $(s, a)$ 都成立，不管是哪個策略收集的**。

**更新步驟：**

1. 從 Buffer 中採樣 $(s, a, r, s')$，$a$ 來自舊策略（無妨）
2. 從**當前策略**採樣 $a' \sim \pi_\theta(\cdot|s')$（這是關鍵！）
3. 目標值：$y = r + \gamma \cdot Q^\pi(s', a')$
4. 最小化 $\|Q^\phi(s,a) - y\|^2$

**策略更新：**

$$\nabla_\theta J(\theta) \approx \mathbb{E}_{s \sim D,\; a \sim \pi_\theta(\cdot|s)}\big[\nabla_\theta \log \pi_\theta(a|s) \cdot Q^\phi(s,a)\big]$$

動作 $a$ 從當前策略採樣（不用 Buffer 中的舊動作）。

---

## 四、Soft Actor-Critic（SAC）

以上就是 **SAC** 的核心框架。SAC 完整算法：

```
初始化：π_θ（Actor），Q^φ（Critic），Replay Buffer D

循環：
  1. 用 π_θ 採集轉移 (s,a,r,s')，加入 D
  2. 從 D 採樣 mini-batch
  3. 採樣 a' ~ π_θ(·|s')，計算目標 y = r + γ·Q^φ(s',a')
  4. 更新 φ：最小化 E[(Q^φ(s,a) - y)²]
  5. 採樣 a ~ π_θ(·|s)，更新 θ：最大化 E[Q^φ(s,a)]
  6. 重複
```

---

## 五、PPO 與 SAC 的比較

| 特性 | PPO | SAC |
|---|---|---|
| 資料利用方式 | 一批資料多步更新 | 全歷史 Replay Buffer |
| 資料效率 | 中 | 高 |
| 穩定性 | 高 | 低（需較多調參）|
| 超參數敏感度 | 低 | 高 |
| 適用場景 | 模擬器（資料便宜）、LLM 訓練 | 真實機器人（資料昂貴）|
| 代表應用 | Atari、MuJoCo、ChatGPT 對齊 | 機器人手臂操控（2小時學會行走）|

---

## 六、PPO 與模仿學習的比較

模仿學習（BC）直接最大化示範動作的 log 概率，不需要獎勵函數；PPO 通過試錯最大化獎勵，可以超越示範者。兩者在「是否需要獎勵函數」和「是否可超越示範上限」上互為互補。

---

## 小結

1. **Importance Sampling** 讓 off-policy 更新成為可能，但差距過大時比值爆炸。
2. **PPO** 通過 clipping（或 KL 懲罰）穩定多步更新，是最廣泛使用的 RL 算法之一。
3. **GAE** 在 TD 與 Monte Carlo 之間取折衷，改善優勢估計質量。
4. **Replay Buffer** 允許重用所有歷史資料，但必須改用 Q 函數（而非 V 函數）以支持 off-policy 更新。
5. **SAC** 結合 Replay Buffer + Q 函數，是數據效率最高的連續動作 RL 算法。

---

*下一章：Q-Learning —— 走向另一條路線：不顯式學習策略，只學 Q 函數，用 argmax 直接推導策略。*
