# Lecture 1 閱讀筆記 — Class Intro

## 基本資料

- 章節編號：01
- 章節標題：Class Intro — 深度強化學習的基本框架
- 對應逐字稿：`data/cs224r/transcripts/Stanford CS224R Deep Reinforcement Learning ｜ Spring 2025 ｜ Lecture 1： Class Intro [EvHRQhMX7_w].txt`
- 完整閱讀日期：2026-07-06
- 閱讀者：主控 agent（Batch 0）
- 狀態：已抽象

## 逐字稿完整閱讀紀錄

- 起點：`Welcome to deep reinforcement learning or CS 224R.`
- 終點：`They're referring to this formulation of a reinforcement learning problem. And we also talked about trajectories, policies, the objective of reinforcement learning, value functions, and and Q functions for each state.`
- 是否從頭到尾完整閱讀：是
- 跳過段落：無
- 逐字稿格式：單行 UTF-8 文字，51,242 bytes

## 本講主問題

本講解決兩個問題：（1）什麼是深度強化學習？它和一般監督式學習差在哪裡？（2）如何把一個真實問題正式地寫成強化學習問題（MDP / POMDP）？講者先建立直覺動機，再引入正式符號，為後續所有演算法打下共同語言。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| RL vs. 監督式學習 | 監督學習有 IID labeled data；RL 學習行為，從間接回饋，資料分布依賴於當前策略 | 第一節對比說明 |
| State (S) | 世界的完整表示；滿足 Markov property：S_{t+1} 只依賴 S_t 和 A_t | 定義節 |
| Observation (O) | 狀態的部分函數；可能缺少資訊，需要歷史觀測才能做決策 | 定義節，對比 State |
| Action (A) | 智能體在每個時間步選擇的決策 | 定義節 |
| Trajectory (τ) | 狀態–動作序列 (s1, a1, s2, a2, …, sT, aT) | 定義節 |
| Reward R(s, a) | 衡量當前狀態-動作好壞的純量；多數情況只依賴狀態 | 定義節，附範例 |
| Policy (π) | 從狀態（或觀測歷史）映射到動作的函數，通常是隨機的；用神經網路實作，參數為 θ | 第三節 |
| Markov Property | P(S_{t+1} \| S_t, A_t) = P(S_{t+1} \| S_1..S_t, A_1..A_t)；讓問題可分解 | 說明節 |
| MDP | 完整狀態可觀測時的正式框架 | 最後節 |
| POMDP | 只有觀測（部分可觀測）時的正式框架；需要記憶 | 最後節 |
| RL 目標 | max_π E_τ~π [Σ r(s_t, a_t)]；期望累積獎勵最大化 | 第四節 |
| Discount factor γ | γ^t 加權未來獎勵；γ∈(0,1]；越小越短視 | 第四節 |
| Value function V^π(s) | 從狀態 s 開始，執行策略 π 的預期未來累積獎勵 | 第五節 |
| Q function Q^π(s,a) | 從 s 採取動作 a，之後執行 π 的預期未來累積獎勵 | 第五節 |
| Rollout / Episode | 用策略生成一條軌跡的過程 | 定義節 |

## 重要細節

**定義與公式：**

- 策略：π(a \| s) 或 π(a \| o1..ot)（有觀測時需要歷史）
- 軌跡分布：p(τ) = p(s1) · ∏ π(a_t\|s_t) · p(s_{t+1}\|s_t,a_t)
- RL 目標：θ* = argmax_θ E_{τ~p_θ(τ)} [Σ_t r(s_t, a_t)]
- 折扣版目標：E [Σ_t γ^t r(s_t, a_t)]，γ 通常接近 1（如 0.99）

**工程細節：**
- 機器人時間離散化通常為 20 Hz（每 0.05 秒一個 state-action）
- 機器人 state 範例：RGB 影像 + 各關節位置 + 各關節速度；action：下一時間步指令關節位置
- Chatbot 範例：observation = 用戶最新訊息；action = 下一句回應；trajectory = 對話紀錄；reward = 按讚(+1) / 按噓(-10) / 無回饋(0)

**問答重點（從逐字稿 Q&A 段落）：**
- 機器人真實世界獎勵怎麼量？用負的物件位置誤差（task-specific）；一般場景需要 Reward Learning
- 稀疏獎勵問題：全是零就沒訓練信號，解法是先給幾次示範（初始化探索）
- 觀測 vs. 狀態的判斷：感測器偶爾失效仍可近似當成狀態用，因為頻率極低
- 需要多少歷史觀測？高度依賴 domain；觸覺感測器需要較多歷史，視覺較少

**容易忽略的提醒：**
- RL 的資料分布依賴當前策略，不是固定的；這是與 supervised learning 最根本的差異，決定了算法的複雜性
- T 不必是固定的；折扣因子讓無限 horizon 的 sum 也能收斂
- Value function 和 Q function 今天只引入概念，不展開，之後幾週會詳細討論

## 算法家族對比（本講引入，後續展開）

| 方法 | 核心思路 |
|---|---|
| Imitation Learning | 模仿高獎勵的示範者行為 |
| Policy Gradients | 直接對目標函數求梯度 |
| Actor-Critic | 學 V/Q 估計值，再用來改進策略 |
| Value-based (Q-Learning) | 學最佳策略的 V/Q，反推行為 |
| Model-Based | 學動態模型，再做規劃或策略更新 |

## 跨章連結

- 後續章節：Lecture 2（模仿學習）直接建立在本章的 MDP 框架上；Lecture 3（Policy Gradients）開始真正使用 RL 目標函數的梯度
- 術語確認：Policy、State、Action、Reward、Trajectory 的中文翻譯需在全書統一（見術語表）
- 需要補的圖：MDP 狀態轉移圖、POMDP 觀測依賴圖、算法家族分類圖
