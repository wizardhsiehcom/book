# Tutorial 閱讀筆記 — Q-Learning Review

## 基本資料

- 章節編號：Tutorial
- 章節標題：Review of Q-Learning
- 逐字稿：`data/cs224r/transcripts/Stanford CS224R Deep Reinforcement Learning ｜ Spring 2025 ｜ Tutorial Session： Review of Q-Learning [07MQNMcxhZU].txt`
- 完整閱讀日期：2026-07-06
- 狀態：已抽象

## 本講主問題

Q 函數的理論基礎是什麼？如何從 tabular 設定擴展到參數化 Q-learning？有哪些讓訓練穩定的關鍵工程技巧？

## 核心概念

| 概念 | 說明 | 書稿章節 |
|---|---|---|
| Q 函數 $Q^\pi(s,a)$ | 在 $(s,a)$ 後遵循策略 $\pi$ 的期望回報 | 第一節 |
| 優勢 $A^\pi(s,a)$ | $Q^\pi(s,a) - V^\pi(s)$；最優策略優勢 ≤ 0 | 第一節 |
| Bellman 最優方程 | 描述 $Q^*$ 的不動點條件（無下標）| 第二節 |
| 迭代 Q-Iteration | 有下標的動態規劃更新（有下標 k, k+1）| 第二節 |
| 軌跡拼接 | 動態規劃能組合不同軌跡找最優路徑 | 第二節 |
| TD vs Monte Carlo | 偏差（估計值誤差）vs 方差（長視野噪聲）| 第四節 |
| 半梯度 / 停止梯度 | 對目標值不傳梯度，穩定優化方向 | 第五節 |
| 目標網路 | 獨立於訓練網路，落後更新，穩定目標值 | 第五節 |
| Replay Buffer | 存歷史轉移，打破時間相關，防近因偏差 | 第六節 |
| Q 值過高估計 | max 操作放大零均值噪聲，需集成對抗 | 第七節 |

## 三個核心量的關係

$$V^\pi(s) = \mathbb{E}_{a\sim\pi}[Q^\pi(s,a)]$$

$$A^\pi(s,a) = Q^\pi(s,a) - V^\pi(s)$$

最優策略：$A^{\pi^*}(s,a) \leq 0$（對所有動作）；最優動作 $A = 0$。

## 動態規劃 vs Monte Carlo 辨識

- Q 函數出現在**等式兩側** → Dynamic Programming（Bellman 方程的性質）
- Q 函數只出現在**右側**（只有獎勵）→ Monte Carlo

## TD vs Monte Carlo 的數學推導

由 Monte Carlo 展開，分離第一步：

$$V^\pi(s) = \mathbb{E}[r_t + \gamma V^\pi(s_{t+1})]$$（一步 TD）

這個代換引入**偏差**（$V^\pi$ 是估計值），但降低**方差**（視野從 $H$ 縮至 1）。

N 步回傳 = 在兩者之間插值（n 步展開後用 $V^\pi$ 估計餘下）。

## 離散 vs 連續 Q 網路

| | 離散動作 | 連續動作 |
|---|---|---|
| 輸入 | 狀態 $s$ | 狀態 $s$ + 動作 $a$ |
| 輸出 | 所有動作的 Q 值向量 | 標量 $Q(s,a)$ |
| 求 max | 精確（enumerate）| 採樣估計（有噪聲）|

## 穩定性技巧摘要

| 問題 | 技巧 | 原理 |
|---|---|---|
| 目標依賴自身 | 半梯度（停止梯度）| 固定梯度更新方向 |
| 目標不穩定 | 目標網路（硬/軟更新）| 落後參數提供穩定目標 |
| 梯度過大 | 梯度裁剪 | 防止參數劇烈跳躍 |
| TD 誤差異常值 | Huber Loss | 大誤差 L1，小誤差 L2 |

軟更新公式：$\theta' \leftarrow \tau\theta + (1-\tau)\theta'$（常見 $\tau \approx 0.005$）

## 過高估計的數學根因

$$\mathbb{E}\left[\max_a Q(s,a)\right] \geq \max_a \mathbb{E}[Q(s,a)]$$

即使噪聲 $\epsilon$ 均值為零，$\max$ 操作系統性地選中「噪聲最大的動作」→ 高估。通過動態規劃傳播到全局 → Q 值爆炸。

## 集成解法

- Double Q-Learning（K=2）：一個網路選動作，另一個評估 → 打破偏差
- 更大集成（K 個）+ 取 min → 保守估計，對抗高估
- 離線 RL 通常需要更大集成（EDAC 等）

## 語言模型的對應

- Language RL（GRPO 等）多用 Monte Carlo 回傳，因為：
  - 語言模型動態幾乎無噪聲
  - 數學/程式的獎勵可精確計算
  - 無需擔心長視野方差問題

## 跨章連結

- 前置：Lecture 4（Actor-Critic，優勢函數）、Lecture 5（Off-Policy SAC，replay buffer）、Lecture 6（Q-Learning DQN）
- 後續：無（Tutorial 是複習）
- 術語：Q 函數、優勢函數、TD 學習、動態規劃、目標網路、replay buffer、過高估計
