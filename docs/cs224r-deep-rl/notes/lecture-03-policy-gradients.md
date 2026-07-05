# Lecture 3 閱讀筆記 — Policy Gradients

## 基本資料

- 章節編號：03
- 章節標題：策略梯度
- 對應逐字稿：`data/cs224r/transcripts/Stanford CS224R Deep Reinforcement Learning ｜ Spring 2025 ｜ Lecture 3： Policy Gradients [KCAOXd4IO9o].txt`
- 完整閱讀日期：2026-07-06
- 閱讀者：主控 agent（Batch 1）
- 狀態：已抽象

## 逐字稿完整閱讀紀錄

- 起點：`Okay, let's get started.`
- 終點：`Next time we'll talk about actor critic methods which will build closely on what we talked about today including PPO.`
- 是否從頭到尾完整閱讀：是
- 跳過段落：無
- 逐字稿格式：單行 UTF-8 文字，53,852 bytes

## 本講主問題

如何讓策略透過自己的試錯經驗學習，而不是依賴示範者？核心目標是推導一個可計算的梯度，使 RL 目標（期望累積獎勵）沿梯度方向上升，並解決梯度的高方差問題。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| Online RL 框架 | 採集資料 → 改進策略 → 重複；資料來自當前策略 | 第一節 |
| Log trick | ∇p = p · ∇log p，讓期望梯度可用採樣估計 | 第二節（推導） |
| REINFORCE / Vanilla PG | ∇J(θ) = E[Σ_t ∇log π(a_t|s_t) · r(τ)] | 第二節 |
| 因果性修正 (causality) | 動作 a_t 只能影響 t 之後的獎勵；改用 reward-to-go | 第二節 |
| Baseline | 減去常數 b（如平均獎勵）；期望值不變，降低方差 | 第三節 |
| On-policy | 梯度估計需要當前策略的資料；每次更新後需重採樣 | 第四節 |
| Importance sampling | 用舊策略資料估計新策略梯度；權重比 π_new/π_old | 第四節 |
| Surrogate objective | 可用 autodiff 直接微分的代理目標；等效一次 backward | 第四節 |

## 推導摘要

**目標：** θ* = argmax_θ J(θ) = argmax_θ E_{τ~p_θ(τ)} [r(τ)]

**問題：** J(θ) 不可直接對 θ 微分（採樣過程與 dynamics 不透明）

**Log trick：**
$$\nabla_\theta p_\theta(\tau) = p_\theta(\tau) \cdot \nabla_\theta \log p_\theta(\tau)$$

**軌跡 log 展開：**
$$\log p_\theta(\tau) = \log p(s_1) + \sum_t [\log \pi_\theta(a_t|s_t) + \log p(s_{t+1}|s_t, a_t)]$$

**取梯度（dynamics 與 θ 無關，消去）：**
$$\nabla_\theta \log p_\theta(\tau) = \sum_t \nabla_\theta \log \pi_\theta(a_t|s_t)$$

**REINFORCE 梯度（因果性修正版）：**
$$\nabla_\theta J(\theta) \approx \frac{1}{N} \sum_i \sum_t \nabla_\theta \log \pi_\theta(a_t^i | s_t^i) \cdot \left(\sum_{t' \geq t} r(s_{t'}^i, a_{t'}^i)\right)$$

**加 baseline（average reward b）：**
$$\nabla_\theta J(\theta) \approx \frac{1}{N} \sum_i \sum_t \nabla_\theta \log \pi_\theta(a_t^i | s_t^i) \cdot \left(\hat{r}_t^i - b\right)$$

E[∇log p · b] = 0，因此 baseline 不引入偏差，但能降低方差。

**重要性採樣版（Off-policy PG）：**
$$\nabla_\theta J(\theta) \approx \frac{1}{N} \sum_i \sum_t \frac{\pi_\theta(a_t^i|s_t^i)}{\pi_{\theta_{old}}(a_t^i|s_t^i)} \nabla_\theta \log \pi_\theta(a_t^i|s_t^i) \cdot \hat{r}_t^i$$
（產品比例形式在長軌跡下不穩定，實務上近似為 state-action 邊際比）

## 直覺說明

- PG 等同「加權模仿學習」：對自身 rollout 做模仿，高獎勵軌跡增加似然，低獎勵軌跡降低似然
- 加 baseline 後：只對高於平均的動作升似然，低於平均的降似然
- 問題：梯度高方差；需要大 batch 與稠密獎勵

## 工程限制

- On-policy：每次梯度更新後必須重採樣
- 高方差：同一策略在不同 rollout 可能得到非常不同的梯度方向
- 稀疏獎勵：如果大量 rollout 回報都是 0，梯度幾乎無訊號
- 重要性採樣只在 old/new policy 相近時有效；否則比例爆炸或歸零

## 典型失敗案例（講者舉例）

1. 人形機器人行走：前三個 rollout 後退，第二個 rollout 跌前→獲得正獎勵；梯度鼓勵「跌前」而非「行走」
2. 折夾克（稀疏獎勵）：只有一個成功 rollout；梯度歸零給所有失敗 rollout，無法分辨「折袖子」和「沒動」的差距

## 跨章連結

- 前置：Lecture 2（Imitation Learning 是 offline；PG 是 online，能超越示範者）
- 後續：Lecture 4（Actor-Critic，用值函數替代 reward-to-go，降低方差）
- PPO 在 Lecture 4-5 展開（重要性採樣 + 限制更新幅度）
