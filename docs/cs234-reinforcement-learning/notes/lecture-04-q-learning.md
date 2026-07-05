# 閱讀筆記：Lecture 04

## 基本資料

| 欄位 | 內容 |
|---|---|
| 講次 | 04 |
| 標題 | Q-learning and Function Approximation |
| 逐字稿路徑 | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Q learning and Function Approximation I 2024 I Lecture 4 [b_wvosA70f8].txt` |
| 閱讀日期 | 2026-07-05 |
| 位元組數 | 66,792 |
| 狀態 | 已成章 |

---

## 逐字稿完整閱讀紀錄

全文為單行格式，共 66,792 bytes。已以 `limit=1` 完整讀取，無分頁截斷。講者為 Emma Brunskill，課程為 Stanford CS234 2024 春季學期。逐字稿含課堂問答互動（含學生提問）、板書說明穿插及少量 ASR 辨識噪音。

---

## 本講主問題

本講的核心問題是：**如何在不知道環境動態與獎勵模型的情況下，純粹透過與環境互動，學習到最優的動作-價值函數 $Q^*$？** 並進一步追問：當狀態空間龐大（如 Atari 遊戲的像素輸入）到無法逐一記錄每個狀態的情況下，如何使用函數逼近器（尤其是深度神經網路）來表示 $Q$ 函數，同時維持學習的穩定性？本講從 tabular 設定出發，介紹 ε-greedy 策略改進、GLIE 收斂條件、SARSA 與 Q-learning 兩種 TD 控制演算法，再延伸至函數逼近的挑戰（致命三角），最後以 DQN（Deep Q-Network）作為理論與實踐的橋接。

---

## 核心概念 table

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| ε-greedy 策略 | 以機率 $1-\varepsilon$ 選擇最大 Q 值的動作，以機率 $\varepsilon$ 隨機選擇動作 | 4.1 節，含單調改進定理 |
| GLIE | Greedy in the Limit of Infinite Exploration；確保所有狀態-動作對被無限次訪問，且策略漸進收斂至貪婪策略 | 4.2 節，收斂條件核心 |
| SARSA | 在線策略 TD 控制；目標值使用實際下一動作 $a'$ | 4.4 節，含虛擬碼與更新公式 |
| Q-learning | 離線策略 TD 控制；目標值使用 $\max_{a'} Q(s', a')$ | 4.5 節，含虛擬碼與更新公式 |
| 函數逼近 | 以參數化函數（線性或神經網路）表示 $Q(s,a;w)$，取代 tabular 查找表 | 4.6–4.8 節 |
| 致命三角 | 自舉（bootstrapping）+ 函數逼近 + 離線策略學習同時出現時，學習可能不收斂 | 4.9 節，理論警示 |
| 經驗回放 | 將歷史轉移元組 $(s,a,r,s')$ 儲存於緩衝區，隨機抽樣以打破樣本相關性 | 4.10 節，DQN 關鍵創新 1 |
| 固定 Q 目標網路 | 使用一組凍結的目標權重 $w^-$ 計算 TD 目標，週期性同步 | 4.10 節，DQN 關鍵創新 2 |
| Robbins-Monro 步長條件 | $\sum_t \alpha_t = \infty$ 且 $\sum_t \alpha_t^2 < \infty$，確保 TD/Q-learning 收斂 | 4.2、4.4、4.5 節理論支撐 |

---

## 重要細節

### 4.A ε-greedy 策略改進定理

講者指出，deterministic 策略在 model-free 設定下無法估計 $Q(s,a)$ 對所有動作 $a$（因為 deterministic 策略在同一狀態只選同一動作，其他動作無資料）。ε-greedy 策略透過以機率 $\varepsilon$ 隨機探索解決此問題。

**定理（非正式）**：若當前策略 $\pi_i$ 是相對於 $Q^{\pi_i}$ 的 ε-greedy 策略，則下一個 ε-greedy 策略 $\pi_{i+1}$ 滿足 $V^{\pi_{i+1}}(s) \geq V^{\pi_i}(s)$ 對所有 $s$，即單調改進。

### 4.B GLIE（Greedy in the Limit of Infinite Exploration）

正式條件：
1. 所有狀態-動作對被訪問無限次：$\lim_{k\to\infty} N_k(s,a) = \infty \quad \forall s,a$
2. 行為策略漸進收斂至貪婪策略：$\lim_{k\to\infty} \pi_k(a|s) = \mathbf{1}[a = \arg\max_{a'} Q_k(s,a')]$ with prob. 1

一個滿足 GLIE 的簡單方法：以 $\varepsilon_k = 1/k$ 的速率衰減 ε-greedy。

**收斂結果**：tabular 設定下，Monte Carlo 控制在 GLIE 條件下收斂至 $Q^*$。

### 4.C 蒙地卡羅控制

演算法骨架：
```
對每個 episode k：
  1. 在策略 π_k 下採樣一條完整軌跡
  2. 對首次訪問的 (s,a)，更新 Q(s,a) ← 加權平均(舊估計, G)
  3. 策略改進：π_{k+1} 設為相對於 Q 的 ε-greedy
```

注意：講者強調 Q 並非 $Q^{\pi_k}$ 的無偏估計，而是所有歷史策略加權平均的奇異混合物（因為每個 episode 後策略就改變了）。這看似有問題，但 GLIE 條件下仍可保證最終收斂。

### 4.D SARSA 演算法

**名稱由來**：State-Action-Reward-State'-Action'，更新所需元組 $(s_t, a_t, r_{t+1}, s_{t+1}, a_{t+1})$。

**更新公式（在線策略）**：

$$Q(s_t, a_t) \leftarrow Q(s_t, a_t) + \alpha \underbrace{\big[r_{t+1} + \gamma Q(s_{t+1}, a_{t+1}) - Q(s_t, a_t)\big]}_{\text{TD 誤差}}$$

其中 $a_{t+1}$ 是**實際在策略 $\pi$ 下選取**的下一動作，這正是「在線策略」的含義。

**虛擬碼骨架**：
```
初始化 Q(s,a) = 0，選擇初始 s，根據 π 選 a
迴圈：
  執行 a，觀測 r, s'
  根據 π 選取 a'（ε-greedy）
  Q(s,a) ← Q(s,a) + α[r + γQ(s',a') - Q(s,a)]
  策略改進：更新 π 為 ε-greedy(Q)
  衰減 ε
  s ← s', a ← a'
  若 s' 為終止狀態則重置
```

**收斂條件**：策略序列滿足 GLIE + Robbins-Monro 步長 → 收斂至 $Q^*$。

**計算複雜度**：每步更新 $O(1)$，不依賴狀態空間大小。

### 4.E Q-learning 演算法

**更新公式（離線策略）**：

$$Q(s_t, a_t) \leftarrow Q(s_t, a_t) + \alpha \big[r_{t+1} + \gamma \max_{a'} Q(s_{t+1}, a') - Q(s_t, a_t)\big]$$

關鍵差異：目標中使用 $\max_{a'}$，而非實際採取的 $a_{t+1}$，因此直接逼近 $Q^*$，而不是當前行為策略的 $Q^{\pi}$。

**收斂條件**（tabular 設定）：
- 所有 $(s,a)$ 被訪問無限次（不需要 GLIE；即使完全隨機探索也可學到 $Q^*$）
- 步長滿足 Robbins-Monro：$\sum_t \alpha_t = \infty$，$\sum_t \alpha_t^2 < \infty$（例如 $\alpha_t = 1/t$）

**與 SARSA 的關鍵差異**：Q-learning 不需要行為策略為 GLIE（只要足夠探索）；SARSA 需要。但若要實際執行最優策略，Q-learning 仍須讓策略漸進變貪婪。

### 4.F 函數逼近動機

對於 Atari 等像素輸入，狀態空間達 $256^{120000}$，不可能維護 tabular Q 函數。目的：
- 減少記憶體
- 減少計算量
- 透過泛化減少所需樣本數（相似狀態有相似 Q 值）

### 4.G 函數逼近的通用框架

若有 oracle 提供每個 $(s,a)$ 的真實 $Q^{\pi}(s,a)$，則可視為監督回歸問題。目標：最小化均方誤差

$$\min_w \mathbb{E}\big[(Q(s,a;w) - Q^{\pi}(s,a))^2\big]$$

以 SGD 求解，梯度更新為

$$w \leftarrow w - \alpha \nabla_w \frac{1}{2}\big[Q(s,a;w) - y\big]^2 = w + \alpha\big[y - Q(s,a;w)\big]\nabla_w Q(s,a;w)$$

實際上沒有 oracle，用 Monte Carlo 回報 $G_t$ 或 TD 目標代替 $y$。

### 4.H 含函數逼近的 Q-learning

TD 目標：$y = r + \gamma \max_{a'} Q(s', a'; w)$

更新：$w \leftarrow w + \alpha[y - Q(s,a;w)] \nabla_w Q(s,a;w)$

此處 $y$ 依賴 $w$ 本身（非穩定目標），加上：
- 樣本相關性（連續時間步強相關）
- 函數逼近可能是「擴張算子」（expansion operator）

→ 引發不穩定性，即致命三角問題。

### 4.I 致命三角（Deadly Triad）

Sutton & Barto 教科書作者指出，同時滿足下列三條件，學習**可能不收斂甚至發散**：

1. **自舉（Bootstrapping）**：TD 方法用 $\hat{Q}(s')$ 估計目標值
2. **函數逼近（Function Approximation）**：用神經網路或線性模型表示 $Q$
3. **離線策略學習（Off-policy Learning）**：行為策略與目標策略不同

直觀原因：Bellman 算子是壓縮映射（contraction），但函數逼近擬合步驟可能是擴張映射（expansion）——兩者交替應用，無法保證收斂到固定點。

**Gordon（1995）**：有一個直觀範例（存疑：講者稱 "Jeff Gordon"，應為 Geoff Gordon）展示線性函數逼近下距離如何在擬合後放大。

### 4.J DQN 兩大創新

**背景**：DeepMind 2014 年在 NeurIPS 展示，單一演算法從像素輸入學習多種 Atari 遊戲，引起轟動。

**創新 1：經驗回放（Experience Replay）**
- 維護一個大型回放緩衝區 $\mathcal{D}$（存儲最近約 100 萬條轉移元組）
- 每步從 $\mathcal{D}$ 中隨機抽取 mini-batch 進行 SGD 更新
- 優點：打破樣本時序相關性（IID 近似）；資料可重複利用（樣本效率）

**創新 2：固定 Q 目標網路（Fixed Q-Targets）**
- 維護兩組權重：當前網路 $w$（持續更新）和目標網路 $w^-$（週期性同步）
- TD 目標：$y = r + \gamma \max_{a'} Q(s', a'; w^-)$
- 使目標 $y$ 在短期內固定，類似監督學習的穩定標籤
- 代價：記憶體需求加倍（需儲存兩份網路參數），但計算時間不變

**消融實驗結果**（講者提及）：
- 僅使用 DNN（無固定目標、無回放）：不比線性函數逼近好
- 加入固定目標：超越線性函數逼近
- 加入回放緩衝區：分數從 3-10 倍提升至 241 倍或更高
- 兩者結合：最佳效果；若只能選一個，**回放緩衝區影響更大**

**DQN 虛擬碼骨架**：
```
初始化 Q(s,a;w)，目標網路 Q(s,a;w^-)
迴圈：
  選擇動作 a（ε-greedy w.r.t. Q(·,·;w)）
  執行 a，觀測 r, s'
  儲存 (s,a,r,s') 至回放緩衝區 D
  從 D 隨機抽樣 mini-batch
  對每個 (s_i,a_i,r_i,s'_i)：
    若 s'_i 為終止：y_i = r_i
    否則：y_i = r_i + γ max_{a'} Q(s'_i,a';w^-)
  用 (y_i - Q(s_i,a_i;w))^2 做梯度下降更新 w
  每 C 步同步：w^- ← w
```

### 4.K 講者課堂範例與互動

- **Mars Rover**：7 個狀態、左右兩個動作，ε-greedy 可確保在同一狀態嘗試不同動作，累積 $Q$ 估計
- **咖啡比喻**（Kupa 咖啡館）：你無法知道如果選擇不同的東西生活會更好還是更差，因為你只能從自己嘗試的事物中學習——exploration 的直觀說明
- **SF 通勤比喻**：只走一次沒有塞車就說路況好，一次樣本不足；需要多次平均——強調 one-rollout 的不足
- **Motor babbling**：智能體一開始 $Q=0$，所有動作等值，等同於完全隨機按鍵（馬達亂動），類比嬰兒學習
- **課堂 Q&A**：學生問確定性策略為何無法計算所有 $Q$？ → 因為只會在同一狀態取同一動作，永遠不會有其他動作的資料。另有學生問是否能做離線策略學習 → 講者說「yes, 幾張投影片後就是 Q-learning」

---

## 對「學會做決策」的意義

Q-learning 是無模型控制的里程碑：智能體無需知道環境動態，只需與環境互動，就能學習到最優行動策略。探索-利用的張力（ε-greedy）和在線更新的 TD 方法是其核心機制。更深層的意義在於：即使演算法在理論上有潛在的不穩定性（致命三角），實踐中透過工程手段（經驗回放、固定目標網路）可以大幅緩解，最終實現從像素輸入直接學習 Atari 遊戲這樣「不可思議」的成果。本講也說明了泛化的重要性——函數逼近不只是計算上的便利，它允許從相似狀態的經驗中推廣，是 RL 在現實世界規模化的基礎。

---

## ASR 存疑名詞 table

| 逐字稿原文 | 可能正確術語 | 說明 |
|---|---|---|
| Glee / GLE | GLIE（Greedy in the Limit of Infinite Exploration）| 全程被 ASR 轉寫為發音相近的 "Glee" |
| qar / qstar / qy | $Q^*$（optimal Q-function）| ASR 讀出 "Q star" 轉寫失敗 |
| Ruben's Monroe sequence | Robbins-Monro 序列 | 標準機率論中的收斂條件 |
| Jeff Gordon | Geoff Gordon | 1995 年函數逼近擴張性論文作者，應為 Geoffrey Gordon |
| autoi per deal networks | autograd / autodifferentiation through neural networks | 自動微分，ASR 辨識嚴重失誤 |
| sarsa / Sara / sari / sersa | SARSA（State-Action-Reward-State-Action）| 多處拼寫不一致 |
| eg greedy / egedy / egy | ε-greedy | ε-greedy 的口語讀法 ASR 誤轉 |
| Turnal | terminal | 「終止狀態」，ASR 缺首音 |
| bman backup | Bellman backup | Bellman 被 ASR 截斷 |
| motor babbling | motor babbling | 發育機器人學術語，ASR 正確；非 ASR 錯誤，此處列出供確認 |
| meting | 不明（可能為 "meeting"？）| 出現在一句不完整語句中，上下文不清 |
| bless you | 打噴嚏旁白 | ASR 誤收環境音 |

---

## 跨章連結

| 連結目標 | 關係說明 |
|---|---|
| 第 1 章：探索（Exploration） | 第 4 章 ε-greedy 和 GLIE 是第 1 章探索概念的具體演算法實現 |
| 第 2 章：Bellman 方程與 MDP | Bellman 算子的壓縮性（contractive）是理解致命三角的前提 |
| 第 3 章：TD 策略評估 | SARSA / Q-learning 是 TD(0) 評估方法擴展至控制的結果 |
| 第 5–7 章：策略梯度方法 | 講者結束時明確說「下週開始策略梯度」；與策略迭代的 Monte Carlo 面向有相似結構 |
| 後續 Exploration 章節（Lecture 11-13）| ε-greedy 是最簡單的探索策略；UCB、Thompson Sampling 等進階方法待後續章節 |
| Double DQN（Lecture 後續提及）| Q-learning 最大化偏差（maximization bias）的修正版，講者在 Atari 結果後簡略提及 |

---

## 相關教材

| 類型 | 內容 |
|---|---|
| Sutton & Barto | 第 6 章（TD 學習）、第 9 章（函數逼近）（待核對） |
| 關鍵論文 1 | Watkins & Dayan (1992)：Q-learning 收斂性證明（講者稱「1992 年論文」）（待核對） |
| 關鍵論文 2 | 1994 年相關論文（講者提及，確切作者待補）（待核對） |
| 關鍵論文 3 | Gordon (1995)：線性函數逼近的擴張性反例（待核對） |
| DQN 論文 | Mnih et al. (2015)，DeepMind，Nature；或 2013/2014 NIPS 版本（待核對） |
| Double DQN | van Hasselt et al.（講者提及作為後續工作，待補） |
| 投影片 | 待補 |
| 作業 | 待補 |

---

## 資訊不足與待補清單

- [ ] 確認 1992 和 1994 年 Q-learning 收斂論文的完整引用（Watkins & Dayan 1992？Tsitsiklis 1994？）
- [ ] Gordon 1995 論文的完整引用（作者應為 Geoffrey Gordon）
- [ ] DQN 論文正式引用（Mnih et al. NIPS 2013 / Nature 2015）
- [ ] Double DQN 的具體算法細節（本講只簡略提及）
- [ ] SARSA 收斂証明的完整數學推導（講者說放在投影片末尾，未在逐字稿中詳述）
- [ ] ε-greedy 策略改進定理的完整證明（講者說「放在最後供選讀」）
- [ ] Mars Rover worked example for SARSA（講者說在投影片末尾，逐字稿中未展開）
- [ ] Robbins-Monro 序列的精確數學定義（逐字稿中未完整展示）
- [ ] 確認 DQN 是否所有遊戲使用完全相同的超參數

---

## 修訂紀錄

| 日期 | 動作 | 負責人 |
|---|---|---|
| 2026-07-05 | 建立 | Batch 1 worker |
