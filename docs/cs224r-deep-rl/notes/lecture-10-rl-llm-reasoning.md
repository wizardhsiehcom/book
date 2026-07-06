# Lecture 10 閱讀筆記 — RL for LLM Reasoning

## 基本資料

- 章節編號：10
- 章節標題：RL for LLM Reasoning
- 逐字稿：`data/cs224r/transcripts/Stanford CS224R Deep Reinforcement Learning ｜ Spring 2025 ｜ Lecture 10： RL for LLM Reasoning [O2VpNnwB4lM].txt`
- 完整閱讀日期：2026-07-06
- 狀態：已抽象

## 逐字稿完整閱讀紀錄

- 起點：為什麼監督學習不夠（SFT scaling limit）
- 完整閱讀：是，78,049 bytes

## 本講主問題

如何讓 LLM 學會多步推理（數學、代碼）？監督學習為何不夠？RL 帶來哪些方法和效率提升？

## 核心概念

| 概念 | 說明 | 書稿章節 |
|---|---|---|
| SFT 上界 | 誤差 ∝ D^{-0.15}，資料接近耗盡 | 第一節 |
| 推理 MDP | state=前綴，action=步驟，reward ∈{0,1}，確定性動態 | 第二節 |
| RFT | 採樣 N 個解答，保留正確的，SFT 訓練；2× 效率 | 第三節 |
| 虛假步驟（Spurious Steps）| RFT scale up 後模型學到邏輯錯誤但最終「通過」的步驟 | 第三節 |
| Q 函數（PRM）| Q(s_i,a_i) = 從前綴 rollout 的成功率；Process Reward Model | 第四節 |
| 優勢（Advantage）| A(s_i,a_i) = Q(s_i,a_i) - Q(s_{i-1},a_{i-1}) | 第四節 |
| 優勢過濾 SFT | 只在正優勢步驟上 SFT（即使整條軌跡錯）| 第四節 |
| Per-step DPO | 用前綴分岐構建偏好對，DPO 訓練；8× 效率 | 第四節 |
| GRPO | PPO 無 V 函數版；組內均值作基線 | 第五節 |
| PAV（過程優勢驗證器）| PRM + 在線 RL；5-6× 效率 + 6-7% 絕對提升 | 第五節 |
| Thinking Models | 更強基礎模型（可回溯/驗證）+ 長 token 預算 + 同樣算法 | 第六節 |

## 關鍵公式

**GRPO 優勢估計（組內相對）：**
$$A_i = \frac{R_i - \text{mean}(R_1,\ldots,R_N)}{\text{std}(R_1,\ldots,R_N)}$$

**Q 函數（rollout 估計）：**
$$Q^{\tilde{\pi}}(s_i, a_i) = \mathbb{E}_{a_{i+1:\ldots}\sim\tilde{\pi}}\big[\text{最終獎勵}\big]$$

**步驟優勢：**
$$A(s_i, a_i) = Q(s_i, a_i) - Q(s_{i-1}, a_{i-1})$$

## 資料效率彙整

| 方法 | 相對 SFT 效率 |
|---|---|
| SFT | 1× |
| RFT | ~2× |
| Per-step DPO（offline）| ~8× |
| GRPO + PAV（online）| 5-6× + 6-7% 絕對提升 |

## 虛假步驟的具體機制

RFT 的過濾是「整條軌跡」正確與否，不區分步驟好壞。
結果：在 N 個樣本中，整體正確但含虛假步驟的軌跡會通過過濾，模型學到這些步驟。
當 N 增大，模型越來越依賴「先出錯再修正」的模式，在新問題上泛化失敗。

## Per-step DPO 的構建方式

1. 找到兩個從相同前綴分岐的軌跡：一個最終正確，一個最終錯誤
2. 把分岐點的動作對視為（winning, losing）偏好對
3. 套用標準 DPO 損失

## 跨章連結

- 前置：Lecture 9（RLHF、DPO 基礎）、Lecture 7（Offline RL 技術）
- 後續：Lecture 11（Model-Based RL，不同方向）
- 術語：RFT、spurious steps、PRM、per-step DPO、GRPO、PAV、thinking models
