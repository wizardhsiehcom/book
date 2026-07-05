# 附錄 A：術語表

本術語表在全書撰寫過程中逐步填入，確保各章使用的專業術語保持一致。

---

## A

| 術語 | 英文 | 定義 | 首次出現 |
|---|---|---|---|
| 動作 | Action / $a$ | 智能體在每個時間步可執行的選擇 | 第 1 章 |

## B

| 術語 | 英文 | 定義 | 首次出現 |
|---|---|---|---|
| 行為克隆 | Behavior Cloning | 將模仿學習化簡為監督式學習，直接從示範軌跡學習 | 第 1 章 |
| Bellman 方程 | Bellman Equation | 價值函數的遞迴分解，由 Richard Bellman 提出 | 待補（第 2 章） |

## D

| 術語 | 英文 | 定義 | 首次出現 |
|---|---|---|---|
| 折扣因子 | Discount Factor / $\gamma$ | $\gamma \in [0,1]$，對未來獎勵進行折扣的係數 | 第 1 章 |
| 動態規劃 | Dynamic Programming | 利用 Bellman 方程遞迴求解 MDP 的方法族 | 待補（第 2 章） |

## E

| 術語 | 英文 | 定義 | 首次出現 |
|---|---|---|---|
| 評估 | Evaluation | 給定一個固定策略，計算其期望回報 | 第 1 章 |
| 探索 | Exploration | 為了獲取新資訊而嘗試未充分了解的行動 | 第 1 章 |
| 利用 | Exploitation | 根據已有知識選擇目前已知最好的行動 | 第 1 章 |

## G

| 術語 | 英文 | 定義 | 首次出現 |
|---|---|---|---|
| 泛化 | Generalization | 將有限經驗推廣到未曾遇過的狀態或情境 | 第 1 章 |

## H

| 術語 | 英文 | 定義 | 首次出現 |
|---|---|---|---|
| 歷史 | History / $H_t$ | 到時間步 $t$ 為止所有動作、觀測、獎勵的序列 | 第 1 章 |

## M

| 術語 | 英文 | 定義 | 首次出現 |
|---|---|---|---|
| Markov 假設 | Markov Assumption | $P(S_{t+1}\|S_t,A_t) = P(S_{t+1}\|H_t,A_t)$：未來獨立於過去，給定現在 | 第 1 章 |
| Markov 決策過程 | Markov Decision Process (MDP) | 含動作的 Markov Reward Process，RL 的核心模型 | 第 1 章（概念）/ 第 2 章（正式定義） |
| Markov Reward Process | Markov Reward Process (MRP) | Markov chain + 獎勵函數 + 折扣因子 | 第 1 章 |
| 模仿學習 | Imitation Learning | 從示範軌跡學習策略的方法，包含行為克隆與逆強化學習 | 第 1 章 |

## O

| 術語 | 英文 | 定義 | 首次出現 |
|---|---|---|---|
| Offline RL | Offline Reinforcement Learning | 只使用固定歷史資料集（不與環境互動）進行學習的 RL 方法 | 待補（第 8 章） |
| 觀測值 | Observation / $O_t$ | 智能體在時間步 $t$ 從環境接收到的資訊 | 第 1 章 |

## P

| 術語 | 英文 | 定義 | 首次出現 |
|---|---|---|---|
| 策略 | Policy / $\pi$ | 從狀態到動作（或動作分布）的映射 | 第 1 章 |
| 策略梯度 | Policy Gradient | 直接對策略參數求梯度以優化期望回報的方法族 | 待補（第 5-7 章） |

## R

| 術語 | 英文 | 定義 | 首次出現 |
|---|---|---|---|
| 回報 | Return / $G_t$ | $G_t = \sum_{k=0}^{H-1} \gamma^k r_{t+k}$，折扣累積獎勵 | 第 1 章 |
| 獎勵 | Reward / $r_t$ | 智能體在時間步 $t$ 從環境接收的標量訊號 | 第 1 章 |
| 獎勵破解 | Reward Hacking | 智能體利用 reward 函數設計漏洞，達到高 reward 但非預期行為 | 第 1 章 |
| RLHF | Reinforcement Learning from Human Feedback | 以人類偏好資料訓練 reward model 後再做 RL 的方法 | 第 1 章 |

## S

| 術語 | 英文 | 定義 | 首次出現 |
|---|---|---|---|
| 狀態 | State / $S_t$ | 對當前情境的充分統計量（sufficient statistic of history） | 第 1 章 |

## V

| 術語 | 英文 | 定義 | 首次出現 |
|---|---|---|---|
| 價值函數 | Value Function / $V(s)$ | $V(s) = \mathbb{E}[G_t \mid S_t = s]$，從狀態 $s$ 出發的期望回報 | 第 1 章 |

---

*本術語表隨各章完成後持續更新。*
