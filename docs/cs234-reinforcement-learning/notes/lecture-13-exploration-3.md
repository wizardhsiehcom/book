# 閱讀筆記：Lecture 13 — Exploration 3

## 基本資料

| 欄位 | 內容 |
|---|---|
| 講次 | 13 |
| 標題 | Exploration 3（高效探索三：MDP 中的樂觀探索、貝氏方法與泛化） |
| 逐字稿路徑 | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Exploration 3 I 2024 I Lecture 13 [pc7oayCSZmQ].txt` |
| 閱讀日期 | 2026-07-05 |
| 位元組數 | 59,091 |
| 狀態 | 已成章 |

---

## 逐字稿完整閱讀紀錄

逐字稿格式為單行（全文無換行），使用 `limit=1` 一次讀取完畢。全文約 59,091 bytes，已完整閱讀並摘要。ASR 錯誤比例中等：技術術語拼寫尤多（見下方存疑表）。

---

## 本講主問題

本講是 CS234 探索主題三講的最終章，核心問題是：**如何把多臂賭博機上的高效探索演算法（UCB、Thompson Sampling）提升到完整馬可夫決策過程（MDP）中，並進一步推廣到大型或連續狀態空間？** 具體包含：（1）在表格式 MDP 中建構 Q 函數的樂觀上界（MBIE 演算法）；（2）用 Simulation Lemma 將模型誤差與價值誤差繋結；（3）以 Dirichlet 先驗維護貝氏 MDP 並實施 PSRL；（4）在上下文賭博機與深度 RL 設定下討論泛化到大型狀態空間的方法；（5）透過決策預訓練 Transformer（DPT）達成元探索。

---

## 核心概念 table

| 概念 | 英文全稱 | 一句說明 |
|---|---|---|
| MBIE | Model-Based Interval Estimation | 在表格式 MDP 的 Bellman backup 中加入探索獎勵 $\beta / \sqrt{N(s,a)}$，驅動對少訪問狀態動作對的探索 |
| PAC-MDP | Probably Approximately Correct MDP | 演算法以高機率僅在多項式步數內犯錯（距最優策略超過 ε 的情形） |
| Simulation Lemma | Simulation Lemma | 若兩個 MDP 的獎勵差距 ≤ α、轉移差距 ≤ β，則其 Q 函數差距 ≤ $(α + γ V_{\max} β) / (1-γ)$ |
| PSRL | Posterior Sampling for Reinforcement Learning | 每段情節（episode）開始時從後驗中取樣一個完整 MDP，求解規劃問題後按該 MDP 的最優策略行動整個情節 |
| Dirichlet 先驗 | Dirichlet Prior | 多項式分布的共軛先驗，用於維護轉移動態的貝氏後驗 |
| 種子取樣 | Seed Sampling | 並行 RL 中的協調探索策略，多個智能體提交不同取樣 MDP 以分散探索 |
| 上下文賭博機 | Contextual Bandit | 有狀態但動作不影響下一狀態的設定，介於多臂賭博機與完整 MDP 之間 |
| LinUCB | Linear UCB | 假設獎勵為特徵線性函數時的 UCB 演算法，使用橢球勢定理建構置信集 |
| 偽計數 | Pseudo-Count | 將表格式計數推廣到大型狀態空間的密度近似，用於深度 RL 探索獎勵 |
| 決策預訓練 Transformer | Decision Pre-Trained Transformer (DPT) | 將 RL 映射為監督式學習以學習最優探索策略；在特定條件下等同 Thompson Sampling |

---

## 重要細節

### MBIE 演算法（Model-Based Interval Estimation）

**演算法框架**：

1. 維護計數 $N(s,a)$（狀態動作訪問次數）和 $N(s,a,s')$（轉移計數）
2. 計算經驗獎勵 $\hat{R}(s,a)$ 與經驗轉移模型 $\hat{T}(s' \mid s,a)$
3. Bellman backup 加入探索獎勵：

$$\tilde{Q}(s,a) = \hat{R}(s,a) + \gamma \sum_{s'} \hat{T}(s' \mid s,a) \max_{a'} \tilde{Q}(s',a') + \underbrace{\beta}_{\text{探索獎勵}}$$

其中 $\beta$ 的一種形式為：

$$\beta = \frac{1}{1-\gamma} \cdot \frac{1}{\sqrt{N(s,a)}}$$

4. 重複 Bellman backup（對所有狀態動作對）直到收斂
5. 以 $\tilde{Q}$ 的貪婪策略行動；更新計數；重複

**直觀理解**：對未被充分訪問的 $(s,a)$ 對，探索獎勵使 $\tilde{Q}$ 樂觀地過估，促使策略優先訪問那些地方。隨著探索，計數增加、獎勵遞減，直到模型變得精確。

**PAC-MDP 保證**：

設 $\pi_t^{\text{MBIE}}$ 為 MBIE 在時間步 $t$ 的策略，$V^*(s_t)$ 為最優價值，以高機率：

$$V^{\pi_t^{\text{MBIE}}}(s_t) \geq V^*(s_t) - \varepsilon$$

成立於所有但有限步數，該有限步數為以下量的多項式：$|S|, |A|, 1/\varepsilon, 1/(1-\gamma)$。

**保守性的量化範例**（Brunskill 課堂示範）：設 $|S|=10, |A|=10, \varepsilon=0.1, \gamma=0.9$，理論上界 ≈ $10^{12}$ 步——對只有 10 個狀態的 MDP 而言極為保守，實務中通常遠比理論界好。

---

### Simulation Lemma（模擬引理）

**定理陳述**（草圖版本）：

設兩個 MDP $M_1$、$M_2$ 在相同策略 $\pi$ 下，若：
- $\|R_1 - R_2\|_\infty \leq \alpha$（獎勵函數∞-範數誤差）
- $\|T_1(\cdot \mid s,a) - T_2(\cdot \mid s,a)\|_1 \leq \beta$（轉移動態 L1 誤差）

則：

$$\|Q_1^\pi - Q_2^\pi\|_\infty \leq \frac{1}{1-\gamma}\left(\alpha + \gamma V_{\max} \beta\right)$$

**關鍵證明步驟**：
1. 展開兩個 Q 函數的差值
2. 用三角不等式分離獎勵誤差與轉移誤差
3. 在轉移項中加減 $\sum_{s'} T_1(s')V_2^\pi(s')$（添加/減去零的技巧）
4. 遞歸定義 $\Delta = \|Q_1^\pi - Q_2^\pi\|_\infty$，解出 $\Delta \leq (1-\gamma)^{-1}(\alpha + \gamma V_{\max}\beta)$

**重要性**：
- 允許用 Hoeffding 不等式對 $\alpha$、$\beta$ 定界，進而對 Q 函數誤差定界
- 在 PAC-MDP 證明中用於論證：隨著探索的推進，經驗模型（$\hat{R}, \hat{T}$）對真實模型的近似越來越準，Q 函數隨之收斂
- 廣泛用於各種模型基礎 RL 的理論分析

---

### 貝氏 MDP 與 PSRL

**貝氏 MDP 框架**：

在貝氏視角下，不僅維護一個（確定性等效）模型，而是維護對所有 MDP 模型的後驗分布：
- 獎勵模型：用 Beta（二元）或 Gaussian 後驗，與多臂賭博機的 Thompson Sampling 一致
- 轉移動態：每個 $(s,a)$ 對的轉移 $P(s' \mid s,a)$ 為多項式分布，共軛先驗為 **Dirichlet 分布**

**Dirichlet 先驗更新**：

若在狀態 $s$、動作 $a$ 下觀察到 $n_i$ 次轉移到 $s_i$（$i=1,\ldots,|S|$），Dirichlet 後驗直接在計數上累加，維持共軛閉合。

**PSRL 演算法**（Osband, Russo, Van Roy, 2013/存疑）：

```
對每個 episode k：
  1. 從當前後驗 p(MDP | 歷史資料) 中取樣一個 MDP M_k
  2. 用值迭代（或策略迭代）求解 M_k 得最優 Q_k*
  3. 在整個 episode 中按 Q_k* 的貪婪策略行動
  4. 記錄 episode 資料，更新後驗
```

**為何每個 episode 只取樣一次（承諾策略）**：

若在 episode 中途頻繁重新取樣，可能在「鏈式 MDP」等設定中出現**抖動**（thrashing）——智能體來回切換探索方向，無法有效探索。承諾機制確保在一個 episode 內保持策略一致性。

---

### Seed Sampling（種子取樣）與並行 RL

Dimakopoulou（存疑）等人（2018/存疑，NeurIPS 存疑）在 PSRL 之上考慮**多個智能體同時在相同 MDP 中探索**：

- 多個智能體各自取樣不同的 MDP（不同的「種子」），以此分散探索
- 協調取樣使所有智能體加總的探索效率趨近線性加速（理論上即使不協調也能達到接近線性加速，但實驗顯示協調有更快的實務效果）
- **老鼠找起司動畫**（課堂示範）：324 步後所有智能體均找到起司

---

### 泛化：上下文賭博機與 LinUCB

**上下文賭博機設定**：有狀態 $s$（上下文），有 $K$ 個臂（動作），但動作不影響下一狀態。

**線性 UCB（LinUCB）假設**：

$$r(s,a) = \phi(s,a)^\top \theta + \varepsilon$$

其中 $\phi(s,a) \in \mathbb{R}^d$ 為特徵向量，$\theta \in \mathbb{R}^d$ 為未知參數，$\varepsilon$ 為雜訊。

**好處**：即使 $K$ 個臂非常多（例如 4000），若特徵維度 $d$ 固定，後悔值（regret）不隨 $K$ 惡化——因為臂之間共享了結構（特徵）。

**橢球勢定理（Elliptical Potential Lemma）**（存疑）：在線性模型下，提供對 $\theta$ 的置信集（confidence set）的嚴格界，使 UCB 具備理論後悔上界。

**新聞推薦案例**：LinUCB 約 14 年前就在新聞文章推薦中取得實用效果（Sutton & Barto 第 19 章，待核對）。

---

### 深度 RL 的探索

**問題**：MBIE 的計數獎勵 $1/\sqrt{N(s,a)}$ 在大/連續狀態空間中無法直接使用（每個 Atari 幀幾乎只見一次）。

**偽計數（Pseudo-Count）方法**（Bellemare 等，存疑）：

用密度模型 $\rho_n(x)$ 估計狀態訪問密度，定義偽計數：

$$\hat{N}(s) = \frac{\rho_n(s) (1-\rho_n'(s))}{\rho_n'(s) - \rho_n(s)}$$

其中 $\rho_n'(s)$ 為添加狀態 $s$ 後的更新密度。偽計數越低 → 探索獎勵越高。

**Montezuma's Revenge 實驗**：
- DQN + ε-greedy 訓練 5000 萬幀：從未跨越第二個房間
- DQN + 偽計數探索獎勵：大幅提升，首次大量跨越房間

**Thompson Sampling 近似方法**：
- **自舉（Bootstrapping）**：Osband 等人以自舉樣本近似後驗不確定性（較粗糙）
- **貝氏最後一層（Bayesian Last Layer）**：深度網路最後一層做貝氏線性回歸，較輕量但往往出乎意料地有效

---

### 決策預訓練 Transformer（DPT）

**目標**：元探索——跨多個任務學習如何高效探索，以便在新任務上快速適應。

**核心思想**：

1. 離線生成大量 Bandit/MDP 問題的最優軌跡（若能事後計算最優動作，即可建立監督資料）
2. 用 Transformer 在這些軌跡上做監督學習，預測最優動作
3. 等同於在能夠計算 Thompson Sampling 最優解的情況下，直接學習 Thompson Sampling 的策略

**理論保證**：在 Thompson Sampling 有效的設定下，DPT 可繼承其後悔上界。

**線性結構誘導實驗**：
- 若領域存在低維線性結構（如 $d$ 維 Bandit），但不明確告訴 DPT
- DPT 在多個任務訓練後，自動學習利用該線性結構，性能接近知道線性結構的 LinUCB

---

## 對「學會做決策」的意義

本講完成了探索三部曲的核心論點：高效探索不僅是設計良好的啟發式策略，更有嚴格的理論框架（PAC-MDP、後悔界、Simulation Lemma）支撐。從多臂賭博機到完整 MDP、再到大型狀態空間，樂觀原則（Optimism Under Uncertainty）與後驗取樣（Thompson Sampling）兩條主線均可一路延伸。DPT 的出現更提示：探索策略本身也可以被學習——這是邁向通用智能體的重要一步。

---

## ASR 存疑名詞 table

| 逐字稿原文 | 推測正確術語 | 依據 |
|---|---|---|
| MBI / MBAB | MBIE（Model-Based Interval Estimation） | 上下文：tabular MDP UCB 演算法、PAC-MDP 保證 |
| hting | Hoeffding（inequality） | 上下文：統計界，concentration inequality |
| nervs / nervs paper | NeurIPS paper | 上下文：機器學習頂會論文引用 |
| basian / basy in / basium | Bayesian | 上下文：先驗、後驗、Thompson Sampling |
| dlay / durle / DL / deo's | Dirichlet | 上下文：多項式分布的共軛先驗 |
| cuf | Q（function） | 上下文：Q* 規劃問題求解 |
| pack | PAC（Probably Approximately Correct） | 上下文：PAC-MDP 演算法定義 |
| GPS | MDPs | 上下文：「bring this to GPS」→「apply to MDPs」 |
| maria's deo's work | Dimakopoulou 等人的論文 | 上下文：concurrent RL、seed sampling |
| psrl 2013 / 2015 / 2018 | PSRL (2013), seed sampling (2018) 存疑 | 年份由 ASR 口誤或記憶有誤，待核對 |
| elliptical potential themma | Elliptical Potential Lemma | 上下文：LinUCB 的理論支撐 |
| dream algorithm | DREAM（探索演算法） | 上下文：meta-RL、grading 應用 |
| GRE line | 圖中的曲線（Green line） | 上下文：DPT 實驗曲線說明 |
| 1 minus R2 | $\|R_1 - R_2\|_\infty$ | 上下文：Simulation Lemma 獎勵誤差 |
| code.org | Code.org（程式教育平台） | 上下文：Breakout 作業使用場景 |

---

## 跨章連結

### 關閉探索三部曲（第 11–13 章）

| 章次 | 主題 | 本章的連接點 |
|---|---|---|
| 第 11 章 | 探索：多臂賭博機、UCB | MBIE 是 UCB 概念在 MDP 的直接推廣 |
| 第 12 章 | 探索二：Thompson Sampling、貝氏賭博機 | PSRL 是 Thompson Sampling 到 MDP 的直接推廣；Beta/Dirichlet 先驗延伸 |
| 第 13 章（本章） | 探索三：MDP 探索、泛化、元探索 | 完成整個探索框架；引入泛化到大型狀態空間的方法 |

### 向後連結

- **第 14 章（預計）**：Monte Carlo Tree Search（MCTS）與 AlphaGo——Brunskill 在本講結尾明確宣告下週主題
- **元強化學習章節**：DPT、DREAM 演算法為元 RL 的代表案例
- **函數近似章節**：LinUCB 及偽計數與深度 Q-learning 的整合延伸函數近似討論
- **並行 RL**：Seed Sampling 涉及多智能體協同探索，連結分散式 RL 主題

---

## 相關教材

| 類型 | 參考 |
|---|---|
| Sutton & Barto 教材 | 第 19 章（LinUCB 相關，待核對）；PAC-MDP 未在 S&B 主要章節（待核對） |
| 原始論文 | MBIE：待補；PSRL：Osband, Russo, Van Roy（NeurIPS 2013，存疑）；LinUCB：Li et al. 2010（存疑）；偽計數：Bellemare et al. 2016（存疑）；DPT：Brunskill lab（存疑） |
| 課程投影片 | 待補 |
| 作業 | 作業三（Homework 3）正在進行中（本講隱含） |

---

## 資訊不足與待補清單

1. **MBIE 的完整 $\beta$ 公式**：逐字稿給出近似式，但完整定義包含狀態、動作數等常數，待查原始論文
2. **Simulation Lemma 的精確版本**：逐字稿為草圖；應有更嚴格的版本（含 union bound 與 |S|、|A| 依賴）
3. **PSRL 的 sample complexity / 後悔界**：Brunskill 提及有界，但未在本講詳述
4. **Seed Sampling 論文出版年份與作者列表**：ASR 中「Maria's deo's work」指向 Dimakopoulou，但發表年份及會議待查
5. **DPT 論文完整引用**：「decision pre-trained Transformers」論文為 Brunskill lab，待補精確引用
6. **DREAM 演算法詳細描述**：僅在課程動機部分提及，未有完整演算法說明
7. **Elliptical Potential Lemma 的陳述**：僅提及名稱，完整定理待補
8. **作業三內容**：本講提及「hope HW3 is going well」，但作業三的具體題目未知
9. **Montezuma's Revenge 數值**：課堂提到「50 million frames, never past the second room」，偽計數結果的具體分數待核對

---

## 修訂紀錄

| 日期 | 動作 | 執行者 |
|---|---|---|
| 2026-07-05 | 建立 | Batch 3 worker |
