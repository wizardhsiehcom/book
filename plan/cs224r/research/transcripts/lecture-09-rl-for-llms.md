# Lecture 9 閱讀筆記 — RL for LLMs

## 基本資料

- 章節編號：09
- 章節標題：RL for LLMs
- 逐字稿：`data/cs224r/transcripts/Stanford CS224R Deep Reinforcement Learning ｜ Spring 2025 ｜ Lecture 9： RL for LLMs [XKLGuwvSKvI].txt`
- 完整閱讀日期：2026-07-06
- 狀態：已抽象

## 逐字稿完整閱讀紀錄

- 起點：預訓練 LM 與助手行為的落差
- 完整閱讀：是，55,334 bytes

## 本講主問題

如何把預訓練 LLM 對齊到「有用的助手」行為？SFT、RLHF、DPO 三條路線各解決什麼問題？

## 核心概念

| 概念 | 說明 | 書稿章節 |
|---|---|---|
| 預訓練 vs 助手行為落差 | next-token prediction ≠ 回答問題 | 第一節 |
| SFT 限制 | 受人類示範能力上限、資料昂貴、目標不對齊 | 第二節 |
| Log-derivative trick | ∇J = E[R·∇log π]，繞過離散採樣不可微 | 第三節 |
| Bradley-Terry 偏好模型 | P(y_W≻y_L) = σ(R(y_W)-R(y_L)) | 第三節 |
| RLHF | 偏好資料 → 獎勵模型 → PPO + KL 懲罰 | 第三節 |
| KL 懲罰 | r_total = R_ψ(x,y) - β·log(π/π_ref)，防 reward hacking | 第三節 |
| DPO 閉合最優策略 | π*(y｜x) ∝ π_ref·exp(R/β)/Z(x) | 第四節 |
| Z 相消 | 代入 Bradley-Terry 後分母 Z 抵消 | 第四節 |
| Sycophancy（諂媚）| GPT-4o 案例：過度優化短期偏好 | 第四節 |

## 關鍵公式

**Policy Gradient（Log-Derivative Trick）：**
$$\nabla_\theta J(\theta) = \mathbb{E}_{y \sim \pi_\theta}\big[R(x,y) \cdot \nabla_\theta \log\pi_\theta(y|x)\big]$$

**Bradley-Terry 目標：**
$$\max_\psi \sum_{(x,y_W,y_L)} \log\sigma\!\big(R_\psi(x,y_W) - R_\psi(x,y_L)\big)$$

**KL-constrained 最優策略：**
$$\pi^*(y|x) = \frac{\pi_{ref}(y|x)\exp(R(x,y)/\beta)}{Z(x)}$$

**DPO 損失：**
$$\max_\theta \sum \log\sigma\!\left(\beta\log\frac{\pi_\theta(y_W|x)}{\pi_{ref}(y_W|x)} - \beta\log\frac{\pi_\theta(y_L|x)}{\pi_{ref}(y_L|x)}\right)$$

## 為何離散 token 無法直接反傳？

採樣操作（從概率分布中抽 token）是不可微的。Log-derivative trick 把梯度轉為「採樣 + 加權」形式，讓期望可以估計但無需直接微分採樣操作。

## DPO 的關鍵洞見

1. KL-constrained RL 有**閉合**最優解 π*
2. 把 R 用 log(π*/π_ref) 表示，代入 Bradley-Terry
3. 歸一化常數 Z(x) 只依賴 x，在偏好對中**相消**
4. 最終目標變成純分類問題

## 跨章連結

- 前置：Lecture 8（Bradley-Terry、RLHF 概念）、Lecture 5（PPO）
- 後續：Lecture 10（RL for LLM Reasoning，更進階應用）
- 術語：SFT、RLHF、DPO、Bradley-Terry、KL penalty、reward hacking、sycophancy
