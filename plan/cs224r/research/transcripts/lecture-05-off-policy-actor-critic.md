# Lecture 5 閱讀筆記 — Off-Policy Actor Critic

## 基本資料

- 章節編號：05
- 章節標題：Off-Policy Actor Critic
- 逐字稿：`data/cs224r/transcripts/Stanford CS224R Deep Reinforcement Learning ｜ Spring 2025 ｜ Lecture 5： Off-Policy Actor Critic [cRGKc-nAWho].txt`
- 完整閱讀日期：2026-07-06
- 狀態：已抽象

## 逐字稿完整閱讀紀錄

- 起點：`Let's recap what we've talked about the last couple lectures`
- 終點：`PPO is also a common choice for language models.`
- 完整閱讀：是，61,003 bytes

## 本講主問題

如何讓 Actor-Critic 更有效地重用過去資料，減少昂貴的環境互動次數？

## 核心概念

| 概念 | 說明 | 書稿章節 |
|---|---|---|
| Importance sampling | 用舊策略資料估計新策略梯度；重要性比值 π_θ'/π_θ | 第一節 |
| Surrogate objective | 代理目標讓 PyTorch 自動計算梯度 | 第一節 |
| KL divergence constraint | 加 β·KL(π_θ', π_θ) 懲罰，限制策略偏離 | 第二節 |
| PPO-Clip | clip(π_θ'(a|s)/π_θ(a|s), 1-ε, 1+ε) | 第二節 |
| PPO 最終目標 | min(原始代理, 截斷代理)，確保下界 | 第二節 |
| GAE | 廣義優勢估計，指數加權 n-step 優勢；λ 控制偏差-方差 | 第二節 |
| Replay Buffer | 儲存所有歷史 (s,a,r,s')；支援完全 off-policy 更新 | 第三節 |
| Q 函數遞迴定義 | Q(s,a) = r + γ·E_{a'~π}[Q(s',a')]，對任意資料成立 | 第三節 |
| SAC | Replay Buffer + Q 函數的完全 off-policy Actor-Critic | 第四節 |
| PPO vs SAC | PPO 穩定/低效；SAC 高效/不穩定 | 第五節 |

## 關鍵公式

**PPO Clip 目標：**
$$\mathcal{L}(\theta') = \min\!\Big(r_t(\theta') \cdot \hat{A}, \; \text{clip}(r_t(\theta'), 1-\epsilon, 1+\epsilon) \cdot \hat{A}\Big)$$

**Q 函數 Bellman 遞迴（任意資料適用）：**
$$Q^\pi(s_t, a_t) = r(s_t, a_t) + \gamma \cdot \mathbb{E}_{s'\sim p, a'\sim\pi}[Q^\pi(s', a')]$$

**SAC 策略更新：**
$$\nabla_\theta J(\theta) \approx \mathbb{E}_{s \sim D, a \sim \pi_\theta}\big[\nabla_\theta \log \pi_\theta(a|s) \cdot Q^\phi(s,a)\big]$$

## 重要說明（課堂問答）

- 多步更新（如 300 步）不穩定原因：優勢估計基於舊策略，更新太多步後策略變化大，優勢估計失效
- Replay Buffer 中 V 函數失效原因：Buffer 來自多個舊策略的混合，V 不是當前策略的值函數
- Q 函數為何可用舊資料：Bellman 等式對任意 (s,a) 成立，只要 $a'$ 用當前策略採樣

## 實務超參數（PPO）

- batch size：~2000 steps
- epochs per batch：~10（≈ 300 梯度步）
- clipping ε：≈ 0.2
- 外層迭代：~500 次 → ~100 萬步總資料

## 跨章連結

- 前置：Lecture 4（Actor-Critic 基礎）、Lecture 3（Importance Sampling）
- 後續：Lecture 6（Q-Learning 進一步脫離 Actor-Critic）
- 術語：PPO、SAC、Replay Buffer、GAE、Surrogate Objective、KL constraint
