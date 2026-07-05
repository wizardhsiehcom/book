# 閱讀筆記：Lecture 9 — Guest Lecture on DPO

## 基本資料

- 章節編號：09
- 章節標題：Guest Lecture on DPO（直接偏好優化來賓演講）
- 對應逐字稿：`data/cs234/transcripts/Stanford CS234 I Guest Lecture on DPO： Rafael Rafailov, Archit Sharma, Eric Mitchell I Lecture 9 [Q7rl8ovBWwQ].txt`
- 完整閱讀日期：2026-07-05
- 閱讀範圍：字元 0 到結尾，全文 78,691 位元組（單行無換行）
- 閱讀者：Batch 2 chapter worker
- 狀態：已成章

---

## 逐字稿完整閱讀紀錄

- 是否從頭到尾完整閱讀：是
- 跳過段落：無
- 結構：四段演講（Emma Brunskill 引言、Eric Mitchell RLHF 背景、Archit Sharma DPO 推導、Rafael Rafailov 實驗與新研究）+ Q&A

---

## 本講主問題

本講的核心問題是：**能否繞過 RLHF 三步驟中成本高昂的強化學習（PPO）階段，直接用人類偏好資料訓練語言模型**？演講者展示了 DPO（Direct Preference Optimization）如何利用「KL 正則化 RLHF 問題存在封閉解」這一數學事實，將獎勵模型與策略合併為同一個物件，從而把偏好學習化簡為一個單純的二元分類問題。關鍵洞見是：偏好損失函數中的分配函數 $Z(x)$ 因只依賴輸入 $x$ 而在兩個答案的差值中自然消去，無需顯式計算。演講同時揭示了 DPO 的新挑戰——「長度 reward hacking」——說明直接對齊演算法同樣面臨獎勵過優化問題，且程度可能比 PPO 更嚴重。

---

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| RLHF 三步驟 | 監督微調（SFT）→ 獎勵模型訓練（Bradley-Terry）→ PPO 策略優化 | 作為 DPO 動機的對比背景 |
| Bradley-Terry 模型 | 偏好機率 = sigmoid(r(x,y_w) − r(x,y_l))；最大化負對數似然 | DPO 推導的起點 |
| KL 正則化 RLHF 目標 | max E[r(x,y)] − β·KL(π∥π_ref) | 封閉解推導的基礎 |
| 封閉解 | π*(y|x) ∝ π_ref(y|x) · exp(r(x,y)/β) / Z(x) | 已知結果（Boltzmann 分布），非 DPO 原創 |
| 獎勵—策略對應 | r(x,y) = β log(π*(y|x)/π_ref(y|x)) + β log Z(x) | 核心代數變換 |
| 分配函數消去 | r(y_w) − r(y_l) 中 β log Z(x) 項對消 | DPO 可行的關鍵 |
| DPO 損失函數 | −log σ(β log[π_θ(y_w|x)/π_ref(y_w|x)] − β log[π_θ(y_l|x)/π_ref(y_l|x)]) | 最終二元分類損失 |
| Pareto 最優曲線 | 固定 KL 散度下最大化獎勵；DPO 在 IMDb 情緒實驗中達到 Pareto 最優 | 與 PPO 比較的方法論 |
| Reward Hacking（DPO） | 過度訓練後輸出長度爆炸；與 PPO reward hacking 同源但機制略異 | 新研究成果，尚未有完整論文 |
| DPO 作為隱式 Q 函數 | paper：「Your Language Model is Secretly a Q-function」；DPO 可詮釋為最大熵 RL 下的逆 Q-learning | 延伸閱讀 |
| Best of N 基線 | 從原始模型生成 N 個答案，用獎勵模型選最佳；不用 RL，也有相當表現 | RL 替代方案比較 |
| 非遞移偏好 | 偏好不滿足全序時，獎勵最大化框架失效；Nash-based 方法（NLHF、Direct Nash Optimization）可處理 | Q&A 延伸 |
| MoDPO | 多目標 DPO；條件化在不同目標權重的混合策略上 | 延伸應用 |

---

## 重要細節

### DPO 推導步驟（Archit Sharma 段落）

**Step 1：RLHF 策略學習目標**

$$\max_{\pi_\theta} \mathbb{E}_{x \sim \mathcal{D},\, y \sim \pi_\theta(\cdot|x)} [r(x,y)] - \beta\, \text{KL}[\pi_\theta(\cdot|x) \| \pi_{\text{ref}}(\cdot|x)]$$

**Step 2：封閉解**（已知結果，Boltzmann 形式）

$$\pi^*(y \mid x) = \frac{\pi_{\text{ref}}(y \mid x)\, \exp\!\bigl(r(x,y)/\beta\bigr)}{Z(x)}, \quad Z(x) = \sum_y \pi_{\text{ref}}(y \mid x)\, e^{r(x,y)/\beta}$$

**Step 3：以策略表示獎勵**

$$r(x,y) = \beta \log \frac{\pi^*(y \mid x)}{\pi_{\text{ref}}(y \mid x)} + \beta \log Z(x)$$

**Step 4：Bradley-Terry 損失**

$$\mathcal{L}_{\text{BT}}(r) = -\mathbb{E}\bigl[\log \sigma\!\bigl(r(x,y_w) - r(x,y_l)\bigr)\bigr]$$

**Step 5：代入 Step 3，Z(x) 項消去**

$$r(x,y_w) - r(x,y_l) = \beta \log \frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}$$

**Step 6：DPO 損失**

$$\mathcal{L}_{\text{DPO}}(\pi_\theta;\pi_{\text{ref}}) = -\mathbb{E}_{(x,y_w,y_l)}\!\left[\log \sigma\!\left(\beta \log \frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}\right)\right]$$

### PPO 與 DPO 的比較

| 面向 | PPO-based RLHF | DPO |
|---|---|---|
| 步驟數 | 三步（SFT → 獎勵模型 → PPO）| 兩步（SFT → DPO 直接訓練）|
| 需要顯式獎勵模型 | 是 | 否（隱含於策略中）|
| 訓練時需要採樣 | 是（從策略採樣回滾）| 否（固定偏好資料集）|
| 信號雜訊比 | 約 40%（Rafael：60% 獎勵分數是雜訊）| 較高，但 reward hacking 更快 |
| Reward Hacking 程度 | 存在，可透過弱優化器效應緩和 | 存在且可能更嚴重（最優優化器）|

### 實驗結果（Rafael Rafailov 段落）

- **IMDb 情緒實驗**：使用預訓練情緒分類器作為 gold reward；DPO 在 reward-KL Pareto 曲線上達到最優；PPO 在同等 KL 下獎勵較低
- **HuggingFace 開放模型排行榜**（幾個月前資料）：前 10 名中 9 個使用 DPO
- **Mistral**：僅用 DPO 作為 RLHF 演算法
- **Llama 3**：混合使用 DPO 與其他方法
- **Reward Bench**：DPO 模型主導 chat/safety 類別前四名；reasoning 類別次四名也是 DPO

### Reward Hacking 新發現（Rafael，進行中研究）

- **長度偏差**：訓練集中偏好回應略長於被拒回應（人類標注者偏好冗長摘要）；DPO 訓練後長度分布大幅偏移至分布外
- **機制**：DPO 是 RLHF 目標的精確最優優化器；PPO 是弱優化器，提供隱性正則化
- **類比**：OpenAI 論文「Scaling Laws for Reward Model Overoptimization」的 gold vs proxy reward 發散現象
- **同樣的問題也出現在**：IPO、RAFT、SLiC 等 DPO 變體

### Q&A 重要討論

- **非遞移偏好（Rock-Paper-Scissors 問題）**：獎勵最大化框架無法處理；Nash-based 方法（Nash Learning from Human Feedback、Direct Nash Optimization）以 win rate 期望值為目標
- **Bradley-Terry ↔ win rate 最大化**：若 BT 模型成立，兩者等價；OpenAI 做法是正規化獎勵函數（以人類完成的獎勵為基線），這等價於最大化對人類回應的勝率，同時大幅降低變異數
- **SFT + DPO 合併**：有幾篇論文嘗試，尚未成熟；SFT 的作用是提供有意義的探索起點，使偏好資料品質更好
- **多步推理（Multi-step Reward）**：DPO 在 token-level MDP 下仍可隱式做信用分配（credit assignment），但無顯式 bootstrapping
- **權重平均（Weight Averaging）**：社群意外發現多個 DPO checkpoint 平均後品質提升；WARM（Weight Averaging for Reward Models）論文有理論支撐；類比 DQN target network
- **數據品質限制**：若資料集中所有回應都很差，比較式偏好標注無法解決此探索問題

---

## 對「學會做決策」的意義

DPO 代表一個深刻洞見：「最優決策」與「人類偏好」之間存在精確的數學對應，而這個對應允許我們繞開傳統 RL 中代價高昂的策略梯度估計。從 RL 視角看，DPO 是把獎勵函數參數化在策略空間而非獨立網路中——策略本身就是隱式獎勵函數。這說明「學會做決策」在語言模型領域有一個特殊的捷徑：當決策空間（文字生成分布）足夠豐富，我們可以直接在決策空間做獎勵推斷，而不必進行蒙地卡羅軌跡採樣。同時，reward hacking 問題提醒我們，任何「代理目標」（proxy objective）被最大化時都存在失控風險，即使這個代理目標是從精確的數學推導得來。

---

## ASR 存疑名詞

| 原文（ASR）| 推斷正確名稱 | 依據 |
|---|---|---|
| raphael / rapael / Rafael | Rafael Rafailov | 逐字稿檔名明確列出；負責實驗結果段落 |
| archit / archid | Archit Sharma | 逐字稿檔名明確列出；負責數學推導段落（"fun math stuff"）|
| Eric | Eric Mitchell | 逐字稿檔名明確列出；負責 RLHF 背景段落 |
| rhf | RLHF（Reinforcement Learning from Human Feedback）| 課程全程使用此縮寫 |
| po / poo | PPO（Proximal Policy Optimization）| 上下文討論策略優化算法 |
| nerps / nerx / NS | NeurIPS（NeurIPS 2023）| DPO 獲 Outstanding Paper Runner-up；"premier machine learning conference" |
| DPO best paper runner up at NS | NeurIPS 2023 Outstanding Paper Runner-Up | 上下文確認 |
| tldr | TL;DR | 英文縮寫，非 ASR 錯誤 |
| Tatsu Hashimoto | Tatsunori Hashimoto（Stanford NLP 教授）| 上下文"NLP class lecture notes" |
| mujoku | MuJoCo（物理模擬環境）| 上下文"control problems like MuJoCo" |
| warm | WARM（Weight Averaging for Reward Models）| 論文名稱，存疑但上下文吻合 |
| slick / slick as well | SLiC（Sequence Likelihood Calibration）| DPO 相關基線論文 |
| IPO | IPO（Identity-mapping Preference Optimization）| DPO 變體 |
| Mo DPO | MoDPO（Multi-Objective DPO）| Q&A 段落明確提及 |
| reward bench | RewardBench | Hugging Face / AI2 評測基準 |
| trl | TRL（Transformers Reinforcement Learning，Hugging Face 函式庫）| PPO 基線實作 |

---

## 跨章連結

- **第 1 章（導論）**：RLHF 三步驟作為 ChatGPT 訓練管線首次提及；DPO 是其替代方案
- **第 8 章（Offline RL）**：DPO 在固定偏好資料集上訓練，本質是 offline 設定；reward hacking 問題與 offline distributional shift 同源
- **第 10 章（RLHF / Value Alignment）**：DPO 是 RLHF 家族的核心成員；本章是第 10 章的前置
- **第 16 章（Value Alignment 深化，待補）**：reward hacking、plurality of preferences、Nash-based alignment 在此章深入展開
- **Appendix Glossary**：需新增詞條：DPO、Bradley-Terry 模型、Pareto 最優曲線、Reward Hacking（DPO）、分配函數、KL 懲罰

---

## 相關教材

- **Sutton & Barto**：DPO 特定內容 = **不適用**（2018 年版早於 DPO；RLHF 只在附錄提及）
- **DPO 原始論文**：Rafailov, Sharma, Mitchell, Ermon, Manning, Finn (2023). "Direct Preference Optimization: Your Language Model is Secretly a Reward Model." NeurIPS 2023 Outstanding Paper Runner-Up. `待補`完整 arXiv 或 DOI
- **Your LM is Secretly a Q-function**：Rafailov et al. 後續論文，DPO 詮釋為逆 Q-learning `待補`
- **WARM 論文**：weight averaging for reward models `待補`引用
- **Scaling Laws for Reward Model Overoptimization**：OpenAI, Gao et al. `待補`
- **Nash Learning from Human Feedback / Direct Nash Optimization**：`待補`引用

---

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| DPO 論文完整引用（arXiv/DOI）| arXiv:2305.18290 | 外部補充階段處理 |
| "Your LM is Secretly a Q-function" 完整引用 | arXiv 編號待查 | 外部補充階段處理 |
| WARM 論文完整引用 | 外部搜尋 | 外部補充階段處理 |
| IPO 論文完整引用 | arXiv:2310.12036（存疑）| 外部補充階段核對 |
| DPO reward hacking 長度實驗的完整論文 | Rafael 提及「現在正在開發」 | 等待正式發表 |
| Reward Bench 論文引用 | Lambert et al. `待補` | 外部補充階段處理 |
| Mistral 論文引用（使用 DPO 的版本）| Mistral 7B Instruct | 外部補充階段處理 |
| Llama 3 技術報告引用 | Meta AI | 外部補充階段處理 |
| MoDPO 論文完整引用 | `待補` | 外部補充階段處理 |
| 第 10 章（RLHF）路徑確認 | 待 Batch 2 其他 worker 完成 | 跨章更新 |

---

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-05 | 建立 | Batch 2 chapter worker，完整閱讀全文 78,691 bytes |
