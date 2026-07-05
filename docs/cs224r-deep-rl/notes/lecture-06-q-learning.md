# Lecture 6 閱讀筆記 — Q-Learning

## 基本資料

- 章節編號：06
- 章節標題：Q-Learning
- 逐字稿：`data/cs224r/transcripts/Stanford CS224R Deep Reinforcement Learning ｜ Spring 2025 ｜ Lecture 6： Q-Learning [-7kv6jf0isQ].txt`
- 完整閱讀日期：2026-07-06
- 狀態：已抽象

## 逐字稿完整閱讀紀錄

- 起點：`So as a recap for the last couple lectures, uh we talked a lot about value functions`
- 終點：`Um we're done with online reinforcement learning algorithms for now.`
- 完整閱讀：是，50,863 bytes

## 本講主問題

若 Q 函數已知，能否完全不需要顯式策略網路？Q-Learning 如何讓深度 RL 成為可能？

## 核心概念

| 概念 | 說明 | 書稿章節 |
|---|---|---|
| 隱式策略 | π(s) = argmax_a Q(s,a)，無需策略網路 | 第一節 |
| 策略改進定理 | π' = argmax Q^π ≥ π（在所有狀態）| 第一節 |
| Policy Iteration | 評估（擬合 Q^π）→ 改進（argmax）交替 | 第二節 |
| Bellman 方程 | Q^π(s,a) = r + γ·E_{a'~π}[Q^π(s',a')]，任意策略 | 第三節 |
| Bellman 最優性方程 | Q*(s,a) = r + γ·E[max_{a'} Q*(s',a')]，僅最優策略 | 第三節 |
| Q-Learning target | y = r + γ·max_{a'} Q(s',a')，off-policy | 第四節 |
| ε-greedy 探索 | ε 機率隨機，1-ε 機率 argmax Q | 第四節 |
| Boltzmann 探索 | π(a|s) ∝ exp(Q(s,a)) | 第四節 |
| Target Network（DQN 技巧1）| 凍結 φ'，每 N 步同步一次；目標穩定 | 第五節 |
| Double DQN（技巧2）| 用 φ 選動作，用 φ' 估值；消除高估 | 第五節 |
| n-step returns（技巧3）| 累積 n 步獎勵再 bootstrap；早期加速 | 第五節 |
| DQN | 2013 DeepMind，Atari 遊戲，像素輸入，第一個深度 RL | 第五節 |

## 關鍵公式

**Bellman 最優性方程（Q-Learning 目標的依據）：**
$$Q^*(s,a) = r(s,a) + \gamma \cdot \mathbb{E}_{s'}[\max_{a'} Q^*(s',a')]$$

**Q-Learning 訓練目標：**
$$y_i = r_i + \gamma \max_{a'} Q^{\phi'}(s'_i, a') \qquad \mathcal{L}(\phi) = \mathbb{E}[(Q^\phi(s,a) - y)^2]$$

**Double DQN 目標：**
$$y_i = r_i + \gamma \cdot Q^{\phi'}\!\left(s'_i,\; \arg\max_{a'} Q^\phi(s'_i, a')\right)$$

**n-step Returns：**
$$y_i = \sum_{k=0}^{n-1} \gamma^k r_{t+k} + \gamma^n \max_{a'} Q^{\phi'}(s_{t+n}, a')$$

## 課堂範例：格子世界

- 舊策略：一直向右
- 目標星：右上方
- Q^π 顯示右上方格子「向上」的 Q 值高
- 一次改進後：策略在右上方改向上，但對最下方格子仍無改善
- 多次迭代：優勢逐步向下傳播，收斂最優策略

## 收斂性說明

- **可保證收斂：** 表格式設定（狀態-動作空間有限）+ 充分探索
- **一般情況（深度網路）：** 不保證收斂，甚至可能發散
- DQN 三技巧在實務上大幅提升穩定性

## 實務提示

訓練中 Q-Learning 損失函數可能持續上升——正常，因為資料中的 Q 值目標也在隨訓練增大。不要因 loss 升高就判斷訓練失敗。

## 算法選擇對照

| 算法 | 適用場景 |
|---|---|
| PPO | 模擬器（資料便宜）、LLM 訓練 |
| DQN | 離散動作、低維動作空間 |
| SAC | 連續控制、真實機器人（資料昂貴）|

## 跨章連結

- 前置：Lecture 5（Q 函數 Bellman 遞迴）、Lecture 4（Actor-Critic 值函數估計）
- 後續：Lecture 7（Offline RL 使用 Q-Learning 技術）
- 術語：Bellman equation、Bellman optimality equation、DQN、target network、double DQN、ε-greedy
