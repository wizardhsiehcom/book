# Lecture 13 閱讀筆記 — Meta RL

## 基本資料

- 章節編號：13
- 章節標題：Meta RL
- 逐字稿：`data/cs224r/transcripts/Stanford CS224R Deep Reinforcement Learning ｜ Spring 2025 ｜ Lecture 13： Meta RL [wSiyEpvoGkA].txt`
- 完整閱讀日期：2026-07-06
- 狀態：已抽象

## 本講主問題

如何讓 RL 策略在新任務上「少樣本快速適應」？End-to-end meta 訓練有什麼困難？

## 核心概念

| 概念 | 說明 | 書稿章節 |
|---|---|---|
| Few-shot 適應 | K 個 episode 後能高效完成新任務 | 第一節 |
| Black-Box Meta RL | 訓練帶記憶的序列模型，記憶跨 episode | 第二節 |
| 跨 episode 記憶 | 策略在 N 個 episode 間保持隱藏狀態 | 第二節 |
| 獎勵作為輸入 | 測試時也把 r 傳入，用於任務識別 | 第二節 |
| 雞與蛋問題 | 探索和執行都差時無法獲得學習信號 | 第四節 |
| 後驗採樣 | 採樣任務假設 z，按其行動；有直接信息線索時次優 | 第四節 |
| POMDP 視角 | 任務識別符 z 未知 = 部分可觀測 MDP | 第五節 |
| 變分資訊瓶頸 | 加雜訊 + KL 正則化壓縮 z，去除無關資訊 | 第六節 |

## Black-Box Meta RL 算法

```
for 每輪：
  1. 採樣任務 T_i
  2. 在 T_i 滾動 π（跨 N 個 episode 保持記憶），獎勵也作為輸入
  3. 最大化所有任務的累積獎勵
```

## 與標準 RL 的三個關鍵區別

1. **記憶跨多個 episode**（不只是單 episode 內）
2. **獎勵在測試時也作為輸入**（用於任務識別）
3. **跨多個不同 MDP 訓練**（動態、獎勵都不同）

## 探索優化效率

使用 off-policy 算法（如 SAC）做 meta-training 比 on-policy（PO/REINFORCE）更 data-efficient。原因：replay buffer 重用歷史資料。

## 後驗採樣的局限

適合：需要試探不同位置的任務
不適合：環境中有直接信息（標誌牌、指示）的任務 → 會逐條走廊試探而不讀指示

## 變分資訊瓶頸公式

$$\mathcal{L} = \mathbb{E}[-\log\pi(a|s,z)] + \lambda \cdot D_{KL}[q(z|\mu)\,\|\,\mathcal{N}(0,I)]$$

效果：$z$ 只保留對執行任務必要的資訊，探索策略不必預測無關細節。

## 跨章連結

- 前置：Lecture 12（Multi-Task RL）
- 後續：Lecture 14（Exploration，DREAM 算法完整推導）
- 術語：meta RL、in-context learning、few-shot、Thompson sampling、POMDP、variational information bottleneck
