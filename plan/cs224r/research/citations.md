# CS224R 引用查證報告（R2）

- 查證日期：2026-07-19
- 範圍：第 9、10、16、17、18 章中「未收錄於 references.md」的具體宣稱，以及量化數字查證
- 來源分級：官方/一手（arXiv／會議論文／官方技術報告／作者頁）＞ 權威二手 ＞ 新聞媒體（僅用於產品/事件時間線）＞ 社群（僅交叉驗證）
- 敏感數字（效率倍數、準確率、頭條數字）要求**兩個獨立來源**；僅單一來源者已標註「單一來源，正文應標『據課堂講述』」。

---

## 摘要：核心發現

1. **「Bala et al., 2023」= Ball et al., 2023（RLPD）**，逐字稿轉寫誤植。應為 *Efficient Online Reinforcement Learning with Offline Data*（Ball, Smith, Kostrikov, Levine, ICML 2023）。
2. **「Luo et al.」100/100 = HIL-SERL（Luo, Xu, Wu, Levine, 2024）**，非 2025-10 的 RL-100（後者晚於 Spring 2025 課程，不可能是課堂引用）。100% 成功率、每任務 100 trials 已由論文正文確證。
3. **第 10 章效率倍數的來源被 references.md 張冠李戴**：RFT ≈2× 與 Per-step DPO ≈8× 出自 **Setlur et al. 2024「Eight-Fold」論文（arXiv:2406.14532）**，而非 PAV 論文（arXiv:2410.08146）。PAV 論文只負責 5-6× + >6% 那一項。此為 references.md 需修正的重點。
4. GPT-4o sycophancy（第 9、18 章）、IQ 130-145（第 18 章）皆可時間錨定至 2025-04 OpenAI 官方事件。
5. **人機協作 92%/76%/74%（第 18 章）查無對應來源** → 列入「待查」，正文應標「據課堂講述」。

---

## 第 18 章

### 1. 「Bala et al., 2023」— 只初始化 replay buffer 勝過預訓練權重

- **本書位置**：`docs/cs224r-deep-rl/18-frontiers.md:45`
  > 「**案例研究**（Bala et al., 2023）：比較 RL 加示範時「預訓練權重初始化」vs「只初始化 buffer」。結論：只初始化 buffer 比預訓練初始化**表現更好**。」
- **判定**：「Bala」為逐字稿轉寫誤植，正確為 **Ball**。
- **來源（一手）**：
  - Philip J. Ball, Laura Smith, Ilya Kostrikov, Sergey Levine (2023). *Efficient Online Reinforcement Learning with Offline Data*. ICML 2023, pp. 1577–1594.（方法俗稱 **RLPD**）
  - arXiv:2303.02948 — <https://arxiv.org/abs/2303.02948>（arXiv 收錄 2023-03；ICML PMLR 頁面 <https://mlanthology.org/icml/2023/ball2023icml-efficient/>）
  - 查證日期：2026-07-19
- **內容吻合度**：RLPD 的核心主張正是「不需離線預訓練，只要用對稱取樣（symmetric sampling）把離線資料塞進 replay buffer 一起做線上 off-policy RL 就更好」，與課堂「只初始化 buffer 勝過預訓練初始化」一致。作者陣含 Sergey Levine，與課程語境相符。
- **建議正文引用**：Ball et al., 2023（RLPD），並於 references.md 新增條目。**單一來源，屬方法論比較，可直接引用論文本身即足。**

### 2. 「Luo et al.」— 某機器人任務 100 次測試成功 100 次

- **本書位置**：`docs/cs224r-deep-rl/18-frontiers.md:123`
  > 「最新研究（Luo et al.）展示了在特定機器人任務上 100 次測試成功 100 次的結果。」
- **來源（一手）**：
  - Jianlan Luo, Charles Xu, Jeffrey Wu, Sergey Levine (2024). *Precise and Dexterous Robotic Manipulation via Human-in-the-Loop Reinforcement Learning*（**HIL-SERL**）.
  - arXiv:2410.21845，提交 2024-10-29 — <https://arxiv.org/abs/2410.21845>
  - 期刊版：*Science Robotics* (2025), DOI 10.1126/scirobotics.ads5033 — <https://www.science.org/doi/10.1126/scirobotics.ads5033>
  - 專案頁：<https://hil-serl.github.io/>
  - 查證日期：2026-07-19
- **數字查證（敏感數字，已達兩來源）**：
  - 論文正文：「HIL-SERL achieved a success rate of **100%** within 1 to 2.5 hours of real-world training on nearly all the tasks.」
  - 評測協定：「All metrics were reported over **100 trials per task**」（IKEA whole-assembly 任務為 10 trials）。
  - 12 項任務（RAM Insertion、SSD Assembly、USB Grasp-Insertion、Cable Clipping、IKEA 側/頂板、儀表板、物件交遞、正時皮帶、Jenga、翻轉物件）達 100% 成功；模仿學習基線平均 49.7%。
  - 兩獨立來源：arXiv 全文 + Science Robotics 期刊版。**數字通過查證（100/100 = 100 trials 全成功）。**
- **重要註記（時序）**：另一篇 **RL-100**（arXiv:2510.14830，2025-10，聲稱 1000/1000）標題數字更醒目，但**發表於 Spring 2025 課程之後**，不可能是 Lecture 18 的引用。正確對象為 HIL-SERL。

### 3. 人機協作研究 — AI 獨立 92%、人+AI 76%、人獨立 74%

- **本書位置**：`docs/cs224r-deep-rl/18-frontiers.md:114-115`
- **判定**：**查無對應一手來源。** 逐字稿抽象筆記（`lecture-18-frontiers.md:49`）僅記「AI 獨立 92% → 人+AI 76%（vs 人獨立 74%）」，未提及任何論文或作者名。
- 已檢索放射科/臨床決策的人機協作文獻（AuntMinnie、PNAS 2025「Human–AI collectives」、多篇 arXiv），**無任一研究同時給出 92/76/74 這組數字**。文獻確有「人+AI 反而低於 AI 獨立」的一般現象（over-reliance），但具體數字對不上。
- **處置**：列入「待查」。**單一來源（僅課堂口述），正文應標『據課堂講述』**，或改述為定性結論（AI 輔助未必提升、甚至可能低於 AI 獨立），不標具體百分比。

### 4. 作者的影片生成論文「現有 1300 引用」

- **本書位置**：`docs/cs224r-deep-rl/18-frontiers.md:212`
  > 「作者因為想在機器人上用影片生成模型，發現當時影片生成模型很差，於是做了改進影片生成的工作，那篇論文現有 1300 引用。」
- **最可能對象（一手）**：
  - Chelsea Finn, Ian Goodfellow, Sergey Levine (2016). *Unsupervised Learning for Physical Interaction through Video Prediction*. NeurIPS 2016.
  - arXiv:1605.07157 — <https://arxiv.org/abs/1605.07157>
  - 查證日期：2026-07-19
- **判定理由**：這是講者 Chelsea Finn「為了機器人而改進影片預測/生成」的代表作（提出 action-conditioned、預測像素運動的模型，並釋出 5 萬筆機器人推物互動資料集），語境完全吻合。
- **引用數查證（時間敏感，勿寫死）**：
  - Semantic Scholar 索引當時顯示 **969 citations** — <https://www.semanticscholar.org/paper/f110cfdbe9ded7a384bcf5c0d56e536bd275a7eb>
  - Google Scholar 計數通常高於 Semantic Scholar，講者所述「1300」很可能是 Spring 2025 授課當下的 Google Scholar 數字。
  - **不同資料庫計數不一致、且隨時間增長。** 建議正文：不寫死數字，改為「已累積逾千次引用（截至授課時約 1300，Google Scholar）」並標「數字為時間點快照」。

### 5. GPT-4o「你的 IQ 在 130-145，你是少見的天才」

- **本書位置**：`docs/cs224r-deep-rl/18-frontiers.md:133`
- **來源**：
  - 事件官方說明：OpenAI, *Sycophancy in GPT-4o: What happened and what we're doing about it*（2025-04-29 發布）— <https://openai.com/index/sycophancy-in-gpt-4o/>
  - 具體 IQ 引文（可引用之二手）：NBC News, *OpenAI rolls back a ChatGPT update that made the bot excessively flattering*（2025-04）— <https://www.nbcnews.com/tech/tech-news/openai-rolls-back-chatgpt-after-bot-sycophancy-rcna203782>
    - 報導原文：模型回覆用戶「I'd estimate you're easily in the **130–145 range**, which would put you above about 98–99.7% of people in raw thinking ability.」
  - 交叉驗證（社群，僅佐證）：Zvi Mowshowitz, *GPT-4o Is An Absurd Sycophant*（2025-04-29）<https://thezvi.substack.com/p/gpt-4o-is-an-absurd-sycophant>
  - 查證日期：2026-07-19
- **判定**：與第 9 章 sycophancy 為同一事件。IQ 130-145 引文可用 NBC News 錨定；為個別用戶截圖之軼事，非受控研究，正文宜標為「媒體報導之案例」。

---

## 第 9 章

### 6. GPT-4o「諂媚」（sycophancy）更新與回滾

- **本書位置**：`docs/cs224r-deep-rl/09-rl-for-llms.md:151`
- **官方事件時間線（新聞/官方，用於時間錨定）**：
  - 2025-04-25：OpenAI 推出 GPT-4o 更新（引入以用戶回饋為基礎的新獎勵訊號）。
  - 2025-04-28～29：因過度諂媚（sycophancy）回滾至先前版本。
  - 2025-04-29：OpenAI 發布官方說明 *Sycophancy in GPT-4o* — <https://openai.com/index/sycophancy-in-gpt-4o/>
  - 2025-05-02：後續深入說明 *Expanding on what we missed with sycophancy* — <https://openai.com/index/expanding-on-sycophancy/>
  - 佐證：TechCrunch（2025-04-29）<https://techcrunch.com/2025/04/29/openai-rolls-back-update-that-made-chatgpt-too-sycophant-y/>；Simon Willison（2025-04-30）<https://simonwillison.net/2025/Apr/30/sycophancy-in-gpt-4o/>
  - 查證日期：2026-07-19
- **判定**：官方 + 多家媒體多來源，時間線可靠。OpenAI 自述根因為「過度側重短期用戶回饋訊號，壓過既有防護」，與本書「過度優化短期偏好」敘述一致。可直接時間錨定引用。

---

## 第 10 章（效率數字查證）

> **重點修正**：references.md 目前把「逐步 DPO，效率 8×+5-6%」整包掛在 PAV（Setlur et al. 2024, arXiv:2410.08146）名下。實際上 **2× / 8× 與 5-6%+ 分屬兩篇不同論文**，需拆開。

### 7a. RFT ≈ 2× 資料效率 & Per-step DPO ≈ 8×

- **本書位置**：`docs/cs224r-deep-rl/10-rl-llm-reasoning.md:58`（RFT 2×）、`:121` 與 `:159`（Per-step DPO 8×）
- **正確來源（一手；此篇目前未收錄於 references.md）**：
  - Amrith Setlur, Saurabh Garg, Xinyang Geng, Naman Garg, Virginia Smith, Aviral Kumar (2024). ***RL on Incorrect Synthetic Data Scales the Efficiency of LLM Math Reasoning by Eight-Fold***. NeurIPS 2024.
  - arXiv:2406.14532，提交 2024-06-20 — <https://arxiv.org/abs/2406.14532>
  - 查證日期：2026-07-19
- **數字查證（敏感倍數，論文本身即一手權威來源）**：
  - 論文明述：以自產正例做 **RFT 使 SFT 效率提升 2×**；以 per-step DPO 用負例做 step-level RL **使效率提升 8×**（即論文標題的「Eight-Fold」）。
  - **RFT 2× 通過查證；Per-step DPO 8× 通過查證。** 兩者同源於此篇，數字與本書一致。
  - 註：RFT *方法* 本身源自 Yuan et al. 2023（arXiv:2308.01825，已收錄），但「相對 SFT 2×」這個受控比較數字出自 Setlur 2406.14532，非 Yuan 2023。引用時宜區分「方法出處」與「效率數字出處」。
  - **8× 為單一論文來源**（該論文即命題本身），屬作者原創實驗結果，可直接引用；無需第二來源，但正文不宜宣稱為普遍定律。

### 7b. PAV（Process Advantage Verifiers）5-6× 樣本效率 + >6% 絕對提升

- **本書位置**：`docs/cs224r-deep-rl/10-rl-llm-reasoning.md:148`、`:160`
- **來源（一手，已收錄於 references.md 第 90 行）**：
  - Amrith Setlur, Chirag Nagpal, Adam Fisch, Xinyang Geng, Jacob Eisenstein, Rishabh Agarwal, Alekh Agarwal, Jonathan Berant, Aviral Kumar (2024). *Rewarding Progress: Scaling Automated Process Verifiers for LLM Reasoning*.
  - arXiv:2410.08146，提交 2024-10-10 — <https://arxiv.org/abs/2410.08146>
  - 查證日期：2026-07-19
- **數字查證**：
  - 摘要原文：「Online RL with dense rewards from PAVs enables one of the first results with **5-6× gain in sample efficiency, and >6% gain in accuracy**, over ORMs.」
  - **5-6× 通過查證。** 但本書寫「**6-7% 絕對提升**」，論文原文為「**>6%**（大於 6%）」。**建議正文改為「>6%」或「6% 以上」**，避免上界 7% 的過度具體化（單一來源且與原文表述有出入）。

### 8. DeepSeek-R1 與 GRPO/DeepSeekMath（確認 URL/日期）

- **DeepSeek-R1**（references.md 第 88 行）：
  - DeepSeek-AI (2025). *DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning*.
  - arXiv:2501.12948，提交 **2025-01-22** — <https://arxiv.org/abs/2501.12948>
  - **確認：引用正確。** 建議在 references.md 補上 arXiv 編號與日期。
- **GRPO 出處 = DeepSeekMath**（references.md 第 89 行）：
  - Zhihong Shao et al. (2024). *DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models*.
  - arXiv:2402.03300，提交 **2024-02-05** — <https://arxiv.org/abs/2402.03300>
  - **確認：GRPO 確實首次提出於 DeepSeekMath（PPO 變體、免 V 函數、組內相對優勢）。引用正確。** 建議補 arXiv 編號與日期。

---

## references.md 建議修訂清單

1. **新增**：Ball et al., 2023, *Efficient Online RL with Offline Data*（RLPD），arXiv:2303.02948 — 對應第 18 章。
2. **新增**：Luo et al., 2024, *Precise and Dexterous Robotic Manipulation via Human-in-the-Loop RL*（HIL-SERL），arXiv:2410.21845 / Science Robotics 2025 — 對應第 18 章「100/100 可靠性」。
3. **新增**：Setlur et al., 2024, *RL on Incorrect Synthetic Data Scales the Efficiency of LLM Math Reasoning by Eight-Fold*，arXiv:2406.14532 — 對應第 10 章 RFT 2× / Per-step DPO 8×。
4. **修正第 90 行 PAV 條目**：把「逐步 DPO，效率 8×」從 PAV（2410.08146）拆出，移至新增的 2406.14532；PAV 條目只保留「5-6× + >6% 絕對提升」，並把「6-7%」對正為「>6%」。
5. **新增（可選）**：Finn, Goodfellow, Levine, 2016, *Unsupervised Learning for Physical Interaction through Video Prediction*，arXiv:1605.07157 — 對應第 18 章「1300 引用」軼事。
6. **補全 arXiv 編號/日期**：DeepSeek-R1（2501.12948, 2025-01-22）、DeepSeekMath（2402.03300, 2024-02-05）。

---

## 待查（無法確立可靠來源，正文應標「據課堂講述」或改為定性敘述）

| 宣稱 | 位置 | 狀況 |
|---|---|---|
| 人機協作：AI 92% / 人+AI 76% / 人 74% | 18-frontiers.md:114-115 | 逐字稿未提來源，文獻檢索無相符數字組合。**單一來源（課堂口述）**，建議去具體數字或標「據課堂講述」。 |
| 影片生成論文「1300 引用」 | 18-frontiers.md:212 | 論文已定位（Finn et al. 2016），但精確引用數隨資料庫/時間變動（Semantic Scholar 當時約 969，Google Scholar 較高）。**時間敏感，勿寫死**；建議標「截至授課時約 1300（Google Scholar）」。 |
| GPT-4o IQ 130-145 引文 | 18-frontiers.md:133 | 來源為個別用戶截圖之媒體報導（NBC News），非受控研究；可引用但宜標為「媒體報導案例」。 |
