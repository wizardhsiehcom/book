# 閱讀筆記：Lecture 8 — Offline RL 1

## 基本資料

- 章節編號：08
- 章節標題：Offline RL 1（最大熵逆強化學習 + 人類偏好強化學習入門）
- 對應逐字稿：`data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Offline RL 1 I 2024 I Lecture 8 [IEbuJtjqtMU].txt`
- 完整閱讀日期：2026-07-05
- 閱讀範圍：字元 0 到結尾，全文 64,274 位元組（單行無換行）
- 閱讀者：Batch 2 worker agent
- 狀態：已成章

## 逐字稿完整閱讀紀錄

- 是否從頭到尾完整閱讀：是
- 跳過段落：無
- 備註：逐字稿為單行檔案，以 `limit=1` 一次讀取完畢。

## 本講主問題

本講以「如何在沒有明確獎勵函數的情況下，利用離線人類資料學習好的決策」為核心主題。首先回顧模仿學習的挑戰——最核心的問題是：**從示範中無法唯一確定獎勵函數**。對此，最大熵逆強化學習（MaxEnt IRL）提出以「最大化熵」的原則打破模糊性，推導出軌跡分佈的指數族形式，進而轉化為最大似然估計問題來學習獎勵。其次，本講拓展到更廣義的人類回饋框架，介紹從主動教導、TAMER、到偏好對比等不同形式的人類輸入；並以 Bradley-Terry 模型為基礎，說明如何從軌跡偏好對比資料學習潛在獎勵，最終連接到 Christiano et al. (2017) 的深度 RLHF 與 ChatGPT 的訓練流程。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| 最大熵原理 | 在滿足約束的前提下，選擇熵最大的機率分佈 | 導出軌跡分佈的指數族形式 |
| MaxEnt IRL | Ziebart et al. 2008；使軌跡分佈熵最大化，約束為特徵期望匹配 | 詳述算法四步驟 |
| 指數族軌跡分佈 | $P(\tau) \propto \exp(R(\tau))$，最大熵約束下的函數形式 | 推導過程完整呈現 |
| 特徵匹配梯度 | $\nabla_\phi J = \sum_{\tau \in \mathcal{D}^*} \nabla_\phi R_\phi(\tau) - |\mathcal{D}^*| \sum_\tau P(\tau|\phi)\nabla_\phi R_\phi(\tau)$ | 線性獎勵下化簡為特徵均值差 |
| 狀態訪問頻率 | 用動態規劃計算策略誘導的狀態分佈，需知動態模型 | 公式化說明 |
| TAMER | Brad Knox & Peter Stone (UT Austin)；從人類回饋建立顯式獎勵模型 | 作為歷史脈絡 |
| 偏好對比（Preference Pairs） | 人類比較軌跡好壞，比寫下獎勵函數更容易 | 連結 RLHF |
| Bradley-Terry 模型 | $P(b_i \succ b_j) = \exp(r_i)/(\exp(r_i)+\exp(r_j))$，遞移性偏好模型 | 形式化偏好學習 |
| Condorcet / Copeland / Borda 勝者 | 社會選擇理論的三種「最佳行動」定義 | 補充背景 |
| Deep RLHF | Christiano et al. 2017；900 bits 人類偏好資料學會後空翻 | 展示 RLHF 的實際效果 |
| ChatGPT RLHF 流程 | BC → 比較資料訓練 reward model → PPO | 連結現代 LLM 訓練 |

## 重要細節

### 定義

- **熵**：$H(P) = -\sum_s P(s) \log P(s)$，衡量分佈分散程度
- **最大熵原理**（Jaynes, 1957）：在已知約束下，選擇熵最大的機率分佈作為「最能代表當前知識狀態」的分佈
- **IRL 的獨特性問題**：多個獎勵函數均與觀測示範兼容（包括零獎勵），因此無法唯一確定
- **MaxEnt IRL 的選擇**：在「與示範特徵期望一致」的約束下，選擇熵最大的軌跡分佈

### 核心定理：最大熵軌跡分佈的函數形式

透過 Lagrange 乘數法，對約束優化問題取偏導並令其為零，可得：

$$P(\tau) = \frac{1}{Z(\phi)} \exp\!\left(\sum_{s \in \tau} R_\phi(s)\right)$$

其中 $Z(\phi) = \sum_\tau \exp(R_\phi(\tau))$ 為正規化常數。

**關鍵推導步驟：**
1. 寫下 Lagrange 形式：$\max_{P(\tau)} H(P) + \lambda_1(\sum P - 1) + \lambda_2(\mathbb{E}_P[\mu(\tau)] - \hat{\mu})$
2. 對 $P(\tau)$ 微分，令 $= 0$：$\log P(\tau) + 1 + \lambda_2 \nabla_\phi R_\phi(\tau) = 0$
3. 指數化得 $P(\tau) \propto \exp(R_\phi(\tau))$

### 最大似然學習

由於 $P(\tau|\phi)$ 的函數形式已知，可將學習獎勵轉化為最大似然：

$$\max_\phi \sum_{\tau \in \mathcal{D}^*} \log P(\tau|\phi) = \sum_{\tau \in \mathcal{D}^*} R_\phi(\tau) - |\mathcal{D}^*| \log Z(\phi)$$

梯度：

$$\nabla_\phi J(\phi) = \sum_{\tau \in \mathcal{D}^*} \nabla_\phi R_\phi(\tau) - |\mathcal{D}^*| \sum_\tau P(\tau|\phi) \nabla_\phi R_\phi(\tau)$$

**線性獎勵** $R_\phi(s) = \phi^\top f(s)$ 時，$\nabla_\phi R_\phi(s) = f(s)$，梯度化簡為：

$$\nabla_\phi J(\phi) = \sum_{\tau \in \mathcal{D}^*} f(\tau) - \sum_s P(s|\phi, T) f(s)$$

即「專家示範的特徵期望」減去「當前策略的特徵期望」。

### MaxEnt IRL 算法（Ziebart et al. 2008）

```
輸入：專家示範 D*，特徵函數 f，動態模型 T（已知）
初始化：φ
重複以下步驟：
  1. 給定 R_φ，用 Value Iteration 計算最優策略 π*
  2. 用動態規劃計算狀態訪問頻率 μ_s（需要 T）
     μ_1(s) = P(s_0 = s)
     μ_{t+1}(s') = Σ_s Σ_a μ_t(s) π(a|s) T(s'|s,a)
  3. 計算梯度 ∇_φ J(φ)
  4. 更新 φ ← φ + α · ∇_φ J(φ)
直到 φ 收斂
```

**哪些步驟需要動態模型 T？**（講者提問）
- 步驟 1（Value Iteration）：需要 T ✓
- 步驟 2（狀態訪問頻率）：需要 T ✓
- 步驟 3（梯度計算）：不需要 T（已完成步驟 2 後）

### 後續擴展（Chelsea Finn, 2016）

Chelsea Finn（當時為 Stanford 博士生，現為 Stanford 教授）：
- 移除已知動態模型的假設
- 使用通用（非線性）獎勵與代價函數（如深度神經網路）
- 處理無法用動態規劃枚舉狀態的複雜問題
- 論文為 2016 年發表

GAIL（Generative Adversarial Imitation Learning）：由 Stefano Ermon（存疑：ASR "Stephano oran's"）的 Stanford 研究組開發，是 MaxEnt IRL 的另一種延伸。

### 人類回饋的光譜

| 形式 | 說明 | 人力代價 |
|---|---|---|
| 被動示範（Passive Demos） | 日常行為軌跡（如電子病歷） | 最低 |
| 主動示範（Active Demos） | 明確為訓練生成的示範 | 低 |
| **偏好對比（Preference Pairs）** | 比較兩段軌跡哪個更好 | **中（甜蜜點）** |
| 主動教導（Active Teaching） | DAgger、TAMER 式的持續回饋 | 高 |
| 主動標記（DAger-style）| 智能體探索時專家全程在場 | 最高 |

### Bradley-Terry 偏好模型

$$P(b_i \succ b_j) = \frac{\exp(r(b_i))}{\exp(r(b_i)) + \exp(r(b_j))}$$

**性質：**
- 當 $r(b_i) = r(b_j)$ 時，偏好機率 = 0.5（自動正規化）
- **遞移性（Transitivity）**：由 $P(i \succ j)$ 和 $P(j \succ k)$ 可推算 $P(i \succ k)$
- 1950 年代提出，廣泛用於推薦系統、排名學習

**學習方式**：將偏好對 $(b_i, b_j, \mu)$（$\mu=1$ 偏好前者，$=0$ 偏好後者）化為邏輯迴歸，最大化交叉熵似然。

### 社會選擇理論中的三種勝者

| 類型 | 定義 |
|---|---|
| Condorcet 勝者（存疑：ASR "condur"） | 在每一對比較中都勝出（$P(i \succ j) > 0.5$ 對所有 $j$） |
| Copeland 勝者（存疑：ASR "cop plan"） | 對比較中勝利次數最多 |
| Borda 勝者（存疑：ASR "aort border"） | 期望分數最高（勝=1, 平=0.5, 負=0） |

### Christiano et al. 2017（Deep RL from Human Preferences）

- 任務：MuJoCo（存疑：ASR "mo"）環境中訓練後空翻（backflip）
- **關鍵結果**：僅需約 900 bits 人類偏好資料即可學會後空翻
- 流程：
  1. 顯示兩段短影片片段給人類
  2. 人類點擊「左邊更好」或「右邊更好」
  3. 從偏好資料訓練獎勵模型
  4. 用獎勵模型訓練 RL 策略
- 比較基準：Deep Q-Learning 需百萬筆資料

### ChatGPT RLHF 流程（Tatsu Hashimoto 的 NLP 課投影片）

1. **行為克隆（BC）**：人類標記員撰寫示範回答 → 監督式學習
2. **偏好資料收集**：標記員比較多個回答，選出較好的
3. **獎勵模型訓練**：Bradley-Terry 框架 + 深度神經網路
4. **PPO 更新**：用學到的獎勵函數優化語言模型

**重要觀察**：ChatGPT 的 RLHF 本質上是**多任務元強化學習**（meta-RL）——獎勵模型需要覆蓋所有人類可能提問的任務，而非單一任務。

### 推薦系統的歷史脈絡

Yisong Yue（存疑：ASR "Yan Yu"，Caltech 教授）與博士指導教授 Thorsten Joachims（存疑：ASR "Thorston ws"，Cornell）：早期推薦排名系統中利用偏好對比學習的先驅工作。

Dorsa Sadigh（存疑：ASR "d d Zig"，Stanford 教授）：自動駕駛中的人類偏好學習研究。

### 講者例子

- **計程車司機（Pittsburgh）**：Ziebart 的原始動機——從司機路線軌跡推斷隱性獎勵函數（距離、交通、費率等特徵的線性組合）
- **機器人廚房（Sophie's Kitchen）**：Andrea Thomaz（存疑：ASR "Andrea tamas"）+ Cynthia Breazeal（存疑：ASR "Cynthia Brazil"，MIT）的早期人機互動強化學習
- **Tetris（TAMER）**：Brad Knox + Peter Stone (UT Austin)；人類回饋訓練 Tetris 智能體，快速學習但長期仍可被 RL 超越
- **後空翻示範**：Christiano et al. 2017，900 bits 偏好資料的實際演示

## 對「學會做決策」的意義

- MaxEnt IRL 提供了一個嚴格且優雅的方式，在「觀測示範」與「獎勵函數不唯一」的困境中取得平衡：以最大熵原則打破模糊性，推導出可計算的最大似然目標
- 從主動教導到偏好對比的光譜揭示了一個重要取捨：人力投入越多，學習越快，但可持續性越低；偏好對比是「甜蜜點」
- 本講是連接「從示範學習（第7講）」與「直接偏好優化 DPO（第9講）」的橋梁，兩者都是在不能精確指定獎勵函數時利用人類資料做決策
- Bradley-Terry 模型中的「遞移性」與「指數族」結構，與 MaxEnt 的指數族軌跡分佈形成呼應，暗示後續 DPO 的重參數化洞見

## ASR 存疑名詞

| 原文（ASR） | 推斷 | 依據 |
|---|---|---|
| "condur winner" | Condorcet winner（孔多塞勝者） | 上下文「beats all others in pairwise」，18世紀社會選擇理論 |
| "cop plan winner" | Copeland winner（科普蘭勝者） | 上下文「highest number of pairwise victories」 |
| "aort border winner" | Borda winner（波達勝者） | 上下文「maximizes expected score (1/0.5/0)」 |
| "lrange multipliers" | Lagrange multipliers（拉格朗日乘數） | 上下文「rewriting constrained optimization」 |
| "Stephano oran's group" | Stefano Ermon（史丹佛教授） | 上下文「developed GAIL here at Stanford」 |
| "Andrea tamas" | Andrea Thomaz | 上下文「MIT，Sophie's Kitchen」 |
| "Cynthia Brazil" | Cynthia Breazeal（MIT Media Lab） | 上下文「Sophie's Kitchen，MIT」 |
| "Yan Yu" | Yisong Yue（Caltech 教授） | 上下文「professor at Caltech，PhD at Cornell under Joachims，recommendation ranking」 |
| "Thorston ws" | Thorsten Joachims（Cornell） | 上下文「PhD adviser at Cornell，recommendation ranking」 |
| "d d Zig" / "dorsa" | Dorsa Sadigh（Stanford 教授） | 上下文「Stanford，driving preferences research」 |
| "Brian ze's" | Brian Ziebart | 上下文「CMU grad student，taxi driver paper」 |
| "C melon" | CMU（Carnegie Mellon University） | 上下文「Brian Ziebart's institution」 |
| "Chelsea fin Finn" | Chelsea Finn（Stanford 教授） | 上下文「faculty here now，2016 paper extending MaxEnt IRL」 |
| "mo" | MuJoCo（物理模擬器） | 上下文「backflip training task，physics simulation」 |
| "rhf" | RLHF（Reinforcement Learning from Human Feedback） | 全講反復使用的縮寫 |
| "dbrl from Human preferences" | Deep RL from Human Preferences（Christiano et al. 2017） | 上下文「NIPS paper，900 bits，backflip」 |
| "po" | PPO（Proximal Policy Optimization） | 上下文「ChatGPT training，update the LLM」 |
| "nerps" / "neural information processing systems" | NeurIPS | 明確說明「premier ML conference」 |
| "Tatsu Hashimoto's" | Tatsu Hashimoto（Stanford NLP 教授） | 上下文「NLP class slides about ChatGPT RLHF」 |
| "RFI" | reward function（講者自造縮寫） | 上下文「if we had R, we'd optimize against it」 |

## 跨章連結

### Offline RL 系列結構

- **L8（本章）= Offline RL 1**：MaxEnt IRL + RLHF 入門（偏好對比、Bradley-Terry 模型）
- **L9 = DPO 客座講座**：Stanford 博士生（DPO 論文共同作者）主講；講者明確說「下次有位 DPO 作者來演講，DPO 在很多基準上已開始超越 RLHF 的表現」
- **L10 = Offline RL 3**：逐字稿集合中的標題；可能涵蓋傳統離線 RL 方法（CQL、BCQ 等）
- **注意**：L8 本身**並未明確說「這是 X 講系列的第 1 講」**——「Offline RL 1」僅出現在 YouTube 標題，而非講者口語。L9 在內容上扮演「Offline RL 2」的角色（RLHF/DPO 深化），但未以此命名。

### 與其他章節的關係

- 第 7 章（模仿學習）：本講開場是 BC / DAgger 的複習與收尾
- 第 9 章（DPO 客座）：Bradley-Terry + RLHF 架構直接為 DPO 奠基；講者預告 DPO 的重參數化洞見
- 第 2 章（Value Iteration）：MaxEnt IRL 的最優策略計算步驟依賴 VI
- 第 1 章（RLHF 概述）：ChatGPT 三步驟 BC→reward model→PPO 在本講被詳細展開

## 相關教材

- **Sutton & Barto**：Offline RL（廣義 IRL / 偏好學習）在 S&B 第二版中**幾乎未覆蓋**。IRL 相關內容不在該書範圍，RLHF 為 2017 年後新發展。標記：`待核對（預計無對應章節）`
- **Ziebart et al. (2008)**：「Learning to Search: Structured Prediction for Imitation Learning」/ 「Maximum Entropy Inverse Reinforcement Learning」，CMU，引用 `待補`
- **Christiano et al. (2017)**：「Deep Reinforcement Learning from Human Preferences」，NeurIPS 2017，引用 `待補`
- **Chelsea Finn (2016)**：IRL 一般化論文，引用 `待補`
- **課程 slides / 作業**：Homework 3 包含 RLHF 與 DPO 實作（講者明確提及）；slides 路徑 `待補`

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| Ziebart et al. (2008) 完整引用 | 原始論文 | 外部補充 |
| Chelsea Finn (2016) 完整引用 | 原始論文 | 外部補充 |
| GAIL 論文完整引用 | Ho & Ermon (2016) | 外部補充 |
| Christiano et al. (2017) 完整引用 | NeurIPS 2017 原文 | 外部補充 |
| L10（Offline RL 3）確認內容 | 讀取 L10 逐字稿 | Batch 2 後續處理 |
| Yisong Yue + Thorsten Joachims 對應論文 | 確認是否為 "Interactively Optimizing IR as Dueling Bandits" 等 | 外部補充 |
| Homework 3 的 RLHF/DPO 實作細節 | 作業說明 | 待補 |
| Sutton & Barto 對應章節核對 | `data/cs234/reference/SuttonBarto-RL-2nd.pdf` | 預計無對應，`待核對` |

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-05 | 建立 | Batch 2 worker，完整閱讀全文 64,274 bytes |
