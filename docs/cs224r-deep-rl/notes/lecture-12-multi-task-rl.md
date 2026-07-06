# Lecture 12 閱讀筆記 — Multi-Task RL

## 基本資料

- 章節編號：12
- 章節標題：Multi-Task RL
- 逐字稿：`data/cs224r/transcripts/Stanford CS224R Deep Reinforcement Learning ｜ Spring 2025 ｜ Lecture 12： Multi-Task RL [qNdsI_4AQJw].txt`
- 完整閱讀日期：2026-07-06
- 狀態：已抽象

## 本講主問題

如何訓練一個策略同時完成多個任務？如何利用一個任務的資料幫助其他任務學習？

## 核心概念

| 概念 | 說明 | 書稿章節 |
|---|---|---|
| MBRL 合成資料 | 從已知狀態做短 rollout，生成補充資料 | 第一節 |
| 任務識別符 z_i | 語言/索引/目標狀態，加入觀測作為條件 | 第二節 |
| 聚合 MDP | 把 z_i 加入狀態，所有任務形成單一 MDP | 第二節 |
| 分層采樣 | mini-batch 確保每任務有 1/N 比例，降低梯度方差 | 第三節 |
| 事後重標籤 | 把任務 i 的資料重標籤為任務 j 的獎勵，重用資料 | 第四節 |
| 目標條件 RL | 特殊多任務 RL：任務 = 達到某個目標狀態 | 第四節 |

## MBRL 合成資料的條件

- 需要學習獎勵模型（或獎勵函數已知）
- 何時適用：模型比策略更容易學（例：迷宮）
- 何時不適用：策略比模型更容易學（例：倒水的流體動力學）

## 多任務 IL 目標函數

$$\min_\theta \frac{1}{N}\sum_{i=1}^N \mathbb{E}_{(s,a)\sim\mathcal{D}_i}[-\log\pi_\theta(a|s,z_i)]$$

分層采樣：每 mini-batch 確保各任務均等 → 降低梯度方差。

## 事後重標籤的前提條件

1. 共享狀態-動作空間
2. 相似初始狀態分布
3. **相同動態**（最關鍵）
4. 不同獎勵函數（才值得重標籤）
5. 離線（Off-Policy）算法

## 目標條件 RL 的自監督性

- 任意狀態可作為目標，不需要人工定義任務
- 事後重標籤：失敗軌跡重標籤為「目標是實際到達的狀態」→ 變成成功資料

## 跨章連結

- 前置：Lecture 11（MBRL）、Lecture 7（Offline RL）
- 後續：Lecture 13（Meta RL）
- 術語：task identifier、stratified mini-batch、hindsight relabeling、goal-conditioned RL、aggregated MDP
