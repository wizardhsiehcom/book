# Lecture 4 閱讀筆記 — Actor-Critic Methods

## 基本資料

- 章節編號：04
- 章節標題：Actor-Critic 方法
- 對應逐字稿：`data/cs224r/transcripts/Stanford CS224R Deep Reinforcement Learning ｜ Spring 2025 ｜ Lecture 4： Actor-Critic Methods [oejFZShW9hU].txt`
- 完整閱讀日期：2026-07-06
- 閱讀者：主控 agent（Batch 1）
- 狀態：已抽象

## 逐字稿完整閱讀紀錄

- 起點：`Okay, let's get started for today.`
- 終點：`We talked about three different ways to estimate value. Either directly looking at summed rewards, um bootstrapping off the value function and this hybrid. Um and this is often referred to as policy evaluation.`
- 是否從頭到尾完整閱讀：是
- 跳過段落：無
- 逐字稿格式：單行 UTF-8 文字，52,730 bytes

## 本講主問題

Policy Gradient 的高方差問題根源是：用單條軌跡的 reward-to-go 估計動作好壞，樣本效率低。能否用神經網路顯式學習「什麼動作好」（值函數），再讓策略根據這個估計更新？

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| 值函數 V^π(s) | 從 s 開始按 π 執行的期望累積獎勵 | 第一節 |
| Q 函數 Q^π(s,a) | 從 s 取動作 a 再按 π 執行的期望累積獎勵 | 第一節 |
| 優勢函數 A^π(s,a) | Q^π(s,a) - V^π(s)；相對於策略平均的優勢 | 第一節 |
| 優勢加權梯度 | ∇J(θ) ∝ E[∇log π · A^π(s,a)] | 第二節 |
| Monte Carlo 估計 V | 迴歸到觀測到的 sum of rewards；無偏但高方差 | 第三節 |
| TD（Bootstrapping）估計 V | 迴歸到 r_t + V^π(s_{t+1})；低方差但有偏 | 第三節 |
| n-step returns | 混合：Σ_{k=0}^{n-1} r_{t+k} + V^π(s_{t+n}) | 第三節 |
| Discount factor γ | 對未來獎勵降權；防止長 horizon 值函數發散 | 第三節 |
| Actor-Critic 架構 | Actor = 策略 π_θ；Critic = 值函數 V^φ；兩個神經網路 | 第四節 |
| Policy evaluation | 擬合 V^π 的過程；迭代監督學習 | 第四節 |

## 關鍵關係推導

**V、Q、A 的關係：**
$$V^\pi(s) = \mathbb{E}_{a \sim \pi}[Q^\pi(s,a)]$$
$$A^\pi(s,a) = Q^\pi(s,a) - V^\pi(s)$$

**Q 分解為 r + V（讓只用 V 就能估計 A）：**
$$Q^\pi(s_t, a_t) = r(s_t, a_t) + \mathbb{E}_{s_{t+1}}[V^\pi(s_{t+1})]$$
$$\Rightarrow A^\pi(s_t, a_t) \approx r(s_t, a_t) + V^\pi(s_{t+1}) - V^\pi(s_t)$$

（用觀測到的 s_{t+1} 當做期望的單樣本估計）

**優勢加權策略梯度：**
$$\nabla_\theta J(\theta) \approx \frac{1}{N}\sum_i \sum_t \nabla_\theta \log \pi_\theta(a_t^i|s_t^i) \cdot \hat{A}^\pi(s_t^i, a_t^i)$$

## 三種估計 V^π 的方法

| 方法 | 目標值 | 偏差 | 方差 |
|---|---|---|---|
| Monte Carlo | $\sum_{t'=t}^T r_{t'}$（觀測值） | 零 | 高 |
| TD（Bootstrap, n=1） | $r_t + V^\phi(s_{t+1})$ | 有 | 低 |
| n-step returns | $\sum_{k=0}^{n-1}r_{t+k} + V^\phi(s_{t+n})$ | 介中 | 介中 |

**加入 discount factor γ 的版本：**
$$\sum_{k=0}^{n-1} \gamma^k r_{t+k} + \gamma^n V^\phi(s_{t+n})$$

discount factor 等效於：以機率 (1-γ) 進入 zero-reward 吸收狀態。

## 直覺說明（搭配講者範例）

**打鼓學習問題（Q&A 範例）：**
- 當前策略：永遠坐在海灘
- V^π(當前狀態) = 0（永遠學不會）
- Q^π(s, 坐海灘) = 0，Q^π(s, 看電視) = 0，Q^π(s, 練習) > 0
- A^π(s, 練習) > 0 → 增加練習的似然；其他動作 A ≈ 0 → 不改變

**Monte Carlo vs Bootstrapping（兩條軌跡範例）：**
- 藍色狀態：同時出現在 +1 和 -1 結果的軌跡
- Monte Carlo：直接平均 → 0（正確但只用了路過它的軌跡）
- Bootstrapping：用已學到的值函數估計 → 能跨軌跡聚合信息，結果更準確

## 工程注意

- Critic（V^φ）輸入狀態，輸出單一純量
- 每個 batch 更新後重新擬合 V^φ（多次梯度步可在同一 batch 上進行）
- 策略更新只能用一次梯度步（on-policy），但值函數可多步更新
- PPO（下一講）在此基礎上加入 clipping 限制更新幅度

## 跨章連結

- 前置：Lecture 3（Policy Gradients 提供 REINFORCE baseline）
- 後續：Lecture 5（Off-Policy Actor-Critic，SAC；如何在不重採樣的情況下更新）
- 術語：Actor-Critic、Critic、policy evaluation、TD learning、bootstrapping、discount factor
