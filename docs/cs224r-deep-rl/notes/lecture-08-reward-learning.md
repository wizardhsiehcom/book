# Lecture 8 閱讀筆記 — Reward Learning

## 基本資料

- 章節編號：08
- 章節標題：Reward Learning
- 逐字稿：`data/cs224r/transcripts/Stanford CS224R Deep Reinforcement Learning ｜ Spring 2025 ｜ Lecture 8： Reward Learning [PDIxDhA9Z6Y].txt`
- 完整閱讀日期：2026-07-06
- 狀態：已抽象

## 逐字稿完整閱讀紀錄

- 起點：`Okay, let's get started. Great. Um, so for today, we're planning to finish offline reinforcement learning.`
- 終點：`you can formulate this as a game between these two different agents.`
- 完整閱讀：是，56,128 bytes

## 本講主問題

當獎勵函數無法直接定義時，如何從人類示例或偏好中學習獎勵函數？

## 核心概念

| 概念 | 說明 | 書稿章節 |
|---|---|---|
| 代理獎勵 Reward Hacking | 智能體找到讓代理獎勵高但真實目標差的行為 | 第一節 |
| Goal Classifier | 訓練成功/失敗二元分類器作為獎勵 | 第二節 |
| Adversarial Updates | 把策略訪問的狀態加入負例，防止 reward hacking | 第二節 |
| GAN 等價 | 策略 = 生成器，分類器 = 判別器 | 第二節 |
| Bradley-Terry 偏好模型 | P(τ_W > τ_L) = σ(R(τ_W) - R(τ_L)) | 第三節 |
| RLHF | 從人類偏好學獎勵模型，再用 PPO 優化 | 第三節 |
| 偏好 vs 絕對評分 | 配對比較比絕對評分更容易、更一致 | 第三節 |
| RLHF for LLMs | 三階段：預訓練 → SFT → 獎勵模型 + PPO | 第四節 |
| RLAIF | 用強 AI 模型代替人類反饋 | 第四節 |

## IQL 補充說明（本講開頭）

講師在本講前段完成了上一講 IQL 的一個補充解釋：

- V 訓練用非對稱損失 → 偏向高 Q 動作 → 更好的動作選擇
- Q 訓練用對稱 L2 → 偏向均值 → 不高估好運氣
- 這個區別是 IQL 的設計核心

## CQL 目標函數的細節

$$\mathcal{L}_{CQL} = \mathcal{L}_{TD} + \alpha \cdot \log\sum_a\exp(Q^\phi(s,a)) - \alpha \cdot \mathbb{E}_{a\sim\mathcal{D}}[Q^\phi(s,a)]$$

其中 $\log\sum\exp$ 是 soft-max，等同選最高 Q 值的 $\mu$（熵正則化後閉合解）。

## Bradley-Terry 模型推導

$$P(\tau_W \succ \tau_L) = \sigma(R_\psi(\tau_W) - R_\psi(\tau_L))$$

$$\max_\psi \sum_{(\tau_W, \tau_L)\in\mathcal{D}} \log\sigma(R_\psi(\tau_W) - R_\psi(\tau_L))$$

$R_\psi(\tau) = \sum_t r_\psi(s_t, a_t)$

## LLM RLHF 流程

1. **預訓練**：大量混合資料，next-token prediction
2. **SFT（Supervised Fine-Tuning）**：高質量示範，模仿學習
3. **RLHF**：
   - 採集偏好資料（同 prompt K 個回覆排序）
   - 訓練 reward model $r_\psi$
   - PPO 優化 $\pi_\theta$ 最大化 $r_\psi$ + KL 約束（防偏離 SFT）

## Goal Classifier 的 50/50 平衡論證

設第 2 個 50% 中有 x% 偽負例（真正是正例但標為負）：
- 只要 x < 50%，真正成功狀態的預測概率 > 0.5
- 分類器仍能區分真正成功 vs 真正失敗
- 這確保獎勵信號在真正目標狀態附近仍然有效

## 跨章連結

- 前置：Lecture 7（CQL 等 offline RL 技術）、Lecture 2（模仿學習）
- 後續：Lecture 9（RL for LLMs，RLHF 的系統整合）
- 術語：RLHF、RLAIF、reward hacking、Bradley-Terry、goal classifier、adversarial training、SFT
