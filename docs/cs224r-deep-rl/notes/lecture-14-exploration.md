# Lecture 14 閱讀筆記 — Exploration

## 基本資料

- 章節編號：14
- 章節標題：Exploration
- 逐字稿：`data/cs224r/transcripts/Stanford CS224R Deep Reinforcement Learning ｜ Spring 2025 ｜ Lecture 14： Exploration [4tlSKdi8teU].txt`
- 完整閱讀日期：2026-07-06
- 狀態：已抽象

## 本講主問題

探索問題的理論基礎是什麼？Bandit 算法如何量化探索效率？大規模 MDP 中應如何探索？

## 核心概念

| 概念 | 說明 | 書稿章節 |
|---|---|---|
| 後悔值（Regret）| T·E[r(a*)] - ∑r(a_t)；越低越好 | 第二節 |
| ε-greedy | ε 隨機，(1-ε) greedy；簡單但長期次優 | 第二節 |
| UCB | 平均獎勵 + 不確定性獎勵；對未知保持樂觀 | 第二節 |
| 後驗採樣 | 維護每臂信念分布，採樣 → 選最優 → 更新 | 第二節 |
| 大規模 MDP 探索 | 依賴預訓練模型和示範資料 | 第三節 |
| DREAM 探索策略 | 最大化對任務 ID 的資訊增益 | 第四節 |
| 逐步資訊增益 | r_t = 預測誤差(t-1) - 預測誤差(t) | 第四節 |
| 變分資訊瓶頸 | KL 正則化壓縮任務表示，去除無關資訊 | 第四節 |

## Bandit 後悔值公式

$$\text{Regret}(T) = T \cdot \mathbb{E}[r(a^*)] - \sum_{t=1}^{T} r(a_t)$$

- 線性增長 = 算法沒有學習
- 次線性增長 = 算法在改進，逼近最優

## UCB 公式

$$a_t = \arg\max_a \left[\hat{r}(a) + c\sqrt{\frac{\ln t}{N_t(a)}}\right]$$

不確定性項隨採樣次數增加而降低，確保每個臂都被充分嘗試。

## 藥物開發實驗（Bandit 遊戲）

5000 個病人，10 種藥物。結果：後驗採樣 > UCB > ε-greedy > 純貪婪。

## DREAM 探索獎勵

$$r^{\text{explore}}_t = \|\hat{z}(\tau_{1:t-1}) - z\|^2 - \|\hat{z}(\tau_{1:t}) - z\|^2$$

含義：此步驟讓任務預測誤差**減少了多少**（資訊增益）。

## 樣本複雜度比較

| 方法 | 達到最優所需樣本 |
|---|---|
| 端到端 meta 訓練 | O(A² log A) |
| DREAM | O(A log A) |

## CS106A 應用結果

- 任務：自動找出學生程式 bug
- 探索策略學會了：試探「球碰到邊界」「球落地」「撞牆」等極端情況
- **結果：** TA 評分速度提升 44%，準確率提升 6%

## 大規模 MDP 的探索原則

- 純隨機探索不可行（語言空間、機器人關節空間太大）
- 必須依靠：① 預訓練/示範 ② 稠密獎勵（若可設計）③ 良好的初始化

## 跨章連結

- 前置：Lecture 13（Meta RL，DREAM 的問題設定）
- 後續：Lecture 15（Hierarchical RL）
- 術語：regret、UCB、Thompson sampling、DREAM、information gain、variational information bottleneck
