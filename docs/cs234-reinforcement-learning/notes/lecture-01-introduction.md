# 閱讀筆記：Lecture 1 — Introduction to Reinforcement Learning

## 基本資料

- 章節編號：01
- 章節標題：Introduction to Reinforcement Learning（強化學習導論）
- 對應逐字稿：`data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Introduction to Reinforcement Learning I 2024 I Lecture 1 [WsvFL-LjA6U].txt`
- 完整閱讀日期：2026-07-05
- 閱讀範圍：字元 0 到結尾，全文 71,751 位元組（單行無換行）
- 閱讀者：主控 agent（Batch 0）
- 狀態：已成章

## 逐字稿完整閱讀紀錄

- 是否從頭到尾完整閱讀：是
- 跳過段落：無

## 本講主問題

強化學習（RL）是什麼、為什麼重要，以及它與其他機器學習典範（監督式學習、模仿學習）的關係。課程引入四個核心支柱：優化（optimization）、延遲後果（delayed consequences）、探索（exploration）、泛化（generalization）。最後以 Markov Reward Process（MRP）作為後續 MDP 的基礎。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| RL 定義 | automated agent learning through experience to make good decisions | 書面化為「智能體透過直接經驗學習做出好決策」 |
| 四個支柱 | Optimization、Delayed Consequences、Exploration、Generalization | 每項展開為獨立段落，含 Mars Rover 等講者例子 |
| 與其他 ML 的對比 | RL 具備全四項；AI Planning 有前兩項；SL 有後兩項；IL 有後兩項但無探索 | 表格對比 |
| 模仿學習 / 行為克隆 | 從好的示範軌跡中 reduce 回 supervised learning | 說明 ChatGPT 第一步 |
| RLHF | 收集偏好資料 → 學習 reward model → 用 RL 優化 | 完整的 ChatGPT 訓練三步驟 |
| Markov 假設 | P(S_{t+1}|S_t,A_t) = P(S_{t+1}|H_t,A_t)，「未來獨立於過去，給定現在」 | 正式定義加直觀解釋 |
| MRP | Markov chain + reward function + discount factor | 定義 G_t 與 V(s) |
| Reward Hacking | reward 設計不當時 agent 會利用漏洞（e.g., 教學 agent 只給簡單題） | 作為常見誤解章節 |
| 評估 vs 控制 | Evaluation：給定 policy 評估好壞；Control：找最優 policy | 對應後續章節架構 |
| Mars Rover 例子 | 7 個離散狀態，try-left/try-right，S1=+1, S7=+10 | 全書運行例子，需在後續章節保持一致 |

## 重要細節

**定義：**
- State S_t 是 Markov 若 P(S_{t+1}|S_t,A_t) = P(S_{t+1}|H_t,A_t)
- History H_t = A_1, O_1, R_1, …, A_t, O_t, R_t
- Policy π：S → A（確定性）或 π(a|s)（隨機性）

**公式：**
- Return: G_t = r_t + γ·r_{t+1} + γ²·r_{t+2} + … = Σ_{k=0}^{H-1} γ^k r_{t+k}
- Value function (MRP): V(s) = E[G_t | S_t = s]
- Discount factor γ ∈ [0,1]；有限 horizon 可令 γ=1

**演算法 / 流程：**
- ChatGPT 訓練三步驟：(1) 行為克隆（SL on human demos）→ (2) 偏好資料訓練 reward model → (3) RL using learned reward (RLHF)
- Markov chain episode 生成：從初始狀態 S_0 依 P(S'|S) 採樣

**講者例子與直覺：**
- 教育 AI tutor：state = (加法精熟度, 減法精熟度) 或歷史序列；action = 出加法題或減法題；reward = +1 對/-1 錯 → reward hacking：agent 只給簡單題
- Mars Rover：7 狀態，動作有隨機性，兩個有值狀態 +1/+10
- 血壓控制：agent 建議運動/藥物，reward = 健康範圍內 +1
- AlphaTensor（存疑：ASR 轉寫 "Alpha tenser"）：用 RL 學到比人類快的矩陣乘法演算法

**應用場景：** AlphaGo、核融合電漿控制、希臘 COVID 邊境測試、ChatGPT/RLHF

**問答重點：**
- 模仿學習 vs RL：RL 應可達到或超越模仿學習（因為可優化而非只模仿）
- Atari 用最後四幀作為 state（含速度/加速度資訊）
- 部分可觀測性（POMDP）本課不主要涵蓋，參見 Michael Kochenderfer 課程

## 對「學會做決策」的意義

- 本講建立 RL 的完整定位：比 SL、IL、AI Planning 更全面的決策學習框架
- 核心取捨：探索（需嘗試才能學習）vs 利用（利用已知資訊）；bias/variance（state 表示粒度）
- 後續章節基礎：Markov 假設 → MDP → Value Function → Bellman Equation

## ASR 存疑名詞

| 原文（ASR） | 推斷 | 依據 |
|---|---|---|
| bman / belman | Richard Bellman | 上下文為 Bellman's equation，1950s 奠基人 |
| Sutton Narto | Sutton & Barto（Richard Sutton） | 教科書作者，上下文「optional textbook」 |
| HMA Basi | Hamsa Bastani（賓大教授） | 上下文「Stanford Graduate…professor at Penn」 |
| Alpha tenser | AlphaTensor（DeepMind） | 上下文「faster matrix multiplication」 |
| nerps | NeurIPS | 上下文「major machine learning conference」 |
| rhf | RLHF（Reinforcement Learning from Human Feedback） | 課程全程使用此縮寫 |
| Peter Henderson | Peter Henderson | 上下文「paper showing RL paper count growth」 |
| Yan Lun / Yan theun | Yann LeCun | Turing Award winner, neural network pioneer |

## 跨章連結

- 後續章節：第 2 章（Tabular MDP Planning）—— MDP 正式定義，Bellman 方程，Policy Iteration / Value Iteration
- 需要保持一致：Mars Rover 運行例子（7 狀態，S1=+1，S7=+10，動作 try-left/try-right）
- 需新增圖表：RL 循環（agent-environment loop）；四支柱與其他 ML 對比表；MRP 轉移矩陣示意

## 相關教材與材料

- 對應 Sutton & Barto 章節：Ch. 1（Introduction）對應本講整體框架；Ch. 3（MDPs）對應 MRP/MDP 基礎部分。未核對頁碼，標 `待核對`。
- 課程 slides / 作業關聯：`待補`（本地未見）
- 材料狀態：`待核對`

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| AlphaTensor 論文完整引用 | DeepMind Nature 2022 原文 | 外部補充階段處理 |
| 希臘 COVID 測試論文引用 | Hamsa Bastani 論文 | 外部補充階段處理 |
| Sutton & Barto 對應頁碼 | `data/cs234/reference/SuttonBarto-RL-2nd.pdf` | 待核對 |
| "Peter Henderson RL papers" 圖 | 原始論文名稱與年份 | 外部補充階段處理 |

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-05 | 建立 | Batch 0，主控 agent，完整閱讀全文 71,751 bytes |
