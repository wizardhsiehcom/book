# 第九章：RL for LLMs

> **逐字稿：** Lecture 9 RL for LLMs（完整閱讀，2026-07-06）

## 導讀

大型語言模型（LLM）的預訓練讓模型學會了大量知識與語言能力，但「預測下一個 token」≠「幫助使用者」。這一章系統梳理從「預訓練 LM」到「有用的聊天機器人」的三條路線：**指令微調（SFT）、RLHF、DPO**。

---

## 一、預訓練 vs. 助手行為的落差

預訓練目標：給定上下文，預測下一個 token。這個目標讓模型學到了語法、事實知識，甚至某種「世界運作原理」——但它不學「如何回答使用者的問題」。

**典型失敗案例：** 問 GPT-3「用幾句話向六歲小孩解釋月球登陸」，模型會繼續預測「其他解釋類問題的句子」，而不是真正給出解釋。

---

## 二、指令微調（Supervised Fine-Tuning, SFT）

**方法：** 收集（instruction, output）配對資料，在預訓練模型上做監督學習（最大化目標輸出的 log 概率）。

**效果：** 主要是教模型「格式」，而不是新知識。知識仍然來自預訓練，但 SFT 讓模型學會如何「表現得像個助手」。

**限制：**

| 限制 | 說明 |
|---|---|
| 資料採集昂貴 | 需要人工撰寫高品質示範，問題越難越貴 |
| 創意任務無唯一答案 | 不適合對話、故事創作等場景 |
| 誤差懲罰不區分輕重 | 整句「對」或「錯」，不區分哪個部分出錯 |
| 受人類能力限制 | 若 LM 實際上比人類更擅長某些任務，模仿人類反而是瓶頸 |
| 目標不對齊 | 訓練目標是「預測示範答案」，而非「最大化使用者滿意度」|

---

## 三、RLHF：強化學習人類反饋

### 3.1 問題設定

給定 prompt $x$，模型生成回覆 $y$。目標：最大化期望回報

$$\max_\theta \mathbb{E}_{y \sim \pi_\theta(\cdot|x)}\big[R(x,y)\big]$$

其中 $R(x,y)$ 是人類對回覆的評分。

### 3.2 為什麼不能直接反傳？

就算有可微的獎勵模型，LM 生成的是**離散 token**。採樣操作（從概率分布中採樣 token）不可微，梯度無法直接從獎勵模型傳回 LM 參數。

**解法：策略梯度（Policy Gradient）**

利用 log-derivative trick，把梯度轉換為可採樣的期望：

$$\nabla_\theta J(\theta) = \mathbb{E}_{y \sim \pi_\theta}\big[R(x,y) \cdot \nabla_\theta \log\pi_\theta(y|x)\big]$$

直覺：高回報的輸出 → 增加其 log 概率；低回報的輸出 → 降低其 log 概率。

### 3.3 學習獎勵模型（Bradley-Terry 模型）

讓人類標注成本高且難以直接給分（不同人的分數標尺不同）。更好的方式是**偏好對比**：給人看兩個回覆，選哪個更好。

**偏好資料集：** $\mathcal{D} = \{(x, y_W, y_L)\}$（$W$ = winning，$L$ = losing）

**Bradley-Terry 模型：**

$$P(y_W \succ y_L \mid x) = \sigma\!\big(R_\psi(x, y_W) - R_\psi(x, y_L)\big)$$

**訓練目標（最大似然）：**

$$\max_\psi \sum_{(x,y_W,y_L)\in\mathcal{D}} \log\sigma\!\big(R_\psi(x, y_W) - R_\psi(x, y_L)\big)$$

### 3.4 RLHF 帶 KL 懲罰

直接優化學習到的獎勵模型會導致 **reward hacking**（模型找到讓獎勵高但品質差的輸出）。加入 KL 懲罰防止策略偏離預訓練模型太遠：

$$r_{total}(x,y) = R_\psi(x,y) - \beta\log\frac{\pi_\theta(y|x)}{\pi_{ref}(y|x)}$$

其中 $\pi_{ref}$ 是 SFT 後的參考模型，$\beta$ 控制約束強度。

### 3.5 RLHF 管線

```
1. 大規模預訓練（next-token prediction）
2. SFT（監督微調，對齊格式）
3. 收集偏好資料：對同一 prompt 採樣多個回覆，人類排序
4. 訓練獎勵模型 R_ψ（Bradley-Terry 目標）
5. PPO 優化 π_θ 最大化 r_total = R_ψ(x,y) - β·KL
```

**實驗結果（新聞摘要任務）：** RLHF 模型的摘要偏好率超過人類撰寫的摘要（即使在小模型上）——這是 RLHF 第一個展示超越人類示範者的關鍵結果。

---

## 四、DPO：直接偏好優化

### 4.1 動機

RLHF 需要單獨訓練獎勵模型、維護參考模型、做昂貴的 RL 採樣循環。能不能直接用偏好資料訓練 LM？

### 4.2 關鍵推導

**KL-constrained RL 有閉合最優解：**

$$\pi^*(y|x) = \pi_{ref}(y|x) \cdot \frac{\exp(R(x,y)/\beta)}{Z(x)}$$

其中 $Z(x) = \sum_y \pi_{ref}(y|x)\exp(R(x,y)/\beta)$ 是歸一化常數。

**把獎勵用策略比值表示：**

$$R(x,y) = \beta\log\frac{\pi^*(y|x)}{\pi_{ref}(y|x)} + \beta\log Z(x)$$

用可學習的策略 $\pi_\theta$ 替換 $\pi^*$：

$$R_\theta(x,y) = \beta\log\frac{\pi_\theta(y|x)}{\pi_{ref}(y|x)} + \underbrace{\beta\log Z(x)}_{\text{只依賴}\, x}$$

**代入 Bradley-Terry 目標：**（$Z(x)$ 在差值中相消）

$$\max_\theta \sum_{(x,y_W,y_L)\in\mathcal{D}} \log\sigma\!\left(\beta\log\frac{\pi_\theta(y_W|x)}{\pi_{ref}(y_W|x)} - \beta\log\frac{\pi_\theta(y_L|x)}{\pi_{ref}(y_L|x)}\right)$$

### 4.3 DPO 的直覺

- 最大化優勝回覆在 $\pi_\theta$ 相對於 $\pi_{ref}$ 的對數概率比
- 同時最小化失敗回覆的對數概率比
- 純分類目標，**無需採樣、無需獎勵模型、無需 RL 循環**

### 4.4 DPO vs RLHF

| | RLHF | DPO |
|---|---|---|
| 訓練目標 | 最大化期望獎勵 + KL | 分類（Bradley-Terry）|
| 計算成本 | 高（需採樣、RL 循環）| 低（純監督）|
| 靈活性 | 高（獎勵模型可複用）| 低（不顯式建模獎勵）|
| 使用場景 | 大規模、需精細控制 | 快速對齊、開源模型 |
| 代表模型 | ChatGPT | Llama、Mistral |

---

## 五、完整 LLM 訓練管線

```
預訓練（海量資料）
    ↓
SFT（指令格式對齊）
    ↓
RLHF 或 DPO（人類偏好對齊）
    ↓
部署
```

**Reward Hacking 的現實案例：** GPT-4o 因某次更新過度強調用戶反饋，變得過於「諂媚」（對一切想法都給予正面回應），引發廣泛批評——即使偏好數據正確，過度優化仍會導致不良行為。

---

## 六、侷限與未解問題

- **偏好資料的代表性：** 人類標注者的偏好可能不反映多樣化用戶需求
- **短期 vs 長期偏好：** 當前 RLHF 優化短期偏好，難以捕捉長期利益
- **個性化：** LLM 對齊到「人類偏好的平均」，而非個別用戶的需求
- **幻覺與意外湧現行為：** 仍是開放問題

---

## 小結

1. **SFT** 教格式，主要知識來自預訓練；限制在於人類示範的上限。
2. **RLHF** 用 Bradley-Terry 偏好模型學習獎勵，再用 PPO 優化；首次超越人類示範者。
3. **DPO** 把 KL-constrained RL 的最優解帶回 Bradley-Terry 目標，完全繞過顯式 RL 循環。
4. **KL 懲罰** 防止策略過度偏離參考模型，避免 reward hacking。
5. **三段式管線**（預訓練 → SFT → RLHF/DPO）是現代聊天機器人的標準流程。

---

*下一章：RL for LLM Reasoning —— 如何用 RL 讓 LLM 學會解數學、寫代碼等需要多步推理的任務？*
