# CS224R《Deep Reinforcement Learning》成書計畫

本計畫用來把 `data/cs224r/transcripts/` 內的 Stanford CS224R Spring 2025 課程逐字稿，整理成一本繁體中文的技術書。逐字稿為純文字 `.txt`，共 18 講＋1 個 Tutorial。核心原則是：每一講都必須閱讀完整逐字稿，從第一行到最後一行，不以片段、摘要、搜尋命中或抽樣段落代替完整閱讀。

## 目標

- 把課程內容整理成一本可在本 repo 內發展為 MkDocs book 的繁體中文書稿。
- 保留課程的主線：從模仿學習、策略梯度、Actor-Critic、Q-Learning，到 Offline RL、Reward Learning、RL for LLMs、Model-Based RL、Multi-Task/Meta RL、Exploration、Hierarchical RL、機器人應用與前沿研究。
- 將逐字稿中的口語講解轉成可閱讀、可複習、可交叉引用的書面章節。
- 最後補入外部對各主題的理解、論文、筆記或延伸資源，但只補充有助於理解課程主軸的資訊。

## 非目標

- 不直接將逐字稿全文貼成書稿。
- 不在未完整閱讀逐字稿前，先依課名或既有常識寫出最終章節。
- 不用外部文章取代課程逐字稿本身。
- 不為了速度跳過重複、口誤、問答或示範段落；這些內容仍要讀完，再判斷是否進入書稿。
- 不在資訊不足時硬補內容。若本地沒有、使用者未提供、工具無法可靠取得，必須標記 `待補` 並請使用者提供，不可編造 lecture title、作業細節、檔案路徑、deadline、公式推導或資源連結。

## 資訊不足處理規則

本專案允許佔位，不允許猜測。遇到下列狀況時，主控 agent 或 worker 必須停止補寫，改以 `待補`、`待查` 或「需使用者提供」標示：

- 官方材料尚未下載到 `data/`。
- 網站資訊只有文字摘錄，缺少原始 URL 或檔案。
- 課程材料名稱相似但無法判定對應講次。
- 演算法推導、公式、參數設定等資訊在逐字稿中不完整，無法確認者。
- guest lecture、assignment optional part、程式碼等資訊不足以建立可靠關聯。

處理方式：

1. 在 plan 或 tracker 中保留佔位。
2. 明確寫出缺少什麼材料，例如 handout、code、slides 或本地路徑。
3. 若需要使用者協助，直接提出需要提供的清單。
4. 不因為章節或表格想保持完整而自行補出不存在的資料。

## 工作階段

### 多 agent 執行制度

本書由一個主控 agent 管控進度，再派多個章節 worker agent 逐講完成內容。主控 agent 負責整體一致性，不把品質責任完全交給 worker。

#### 角色分工

| 角色 | 責任 | 可寫入範圍 |
|---|---|---|
| 主控 agent | 維護計畫、派工、審稿、更新追蹤表、統一術語、處理跨章整合 | `plan/`、`docs/cs224r-deep-rl/`、`configs/cs224r-deep-rl.yml` |
| 章節 worker agent | 完整閱讀指定逐字稿，產出該講閱讀筆記與章節初稿 | 僅限被指派的 `notes/lecture-XX-*.md` 與 `XX-*.md` |
| 外部補充 agent | 在全部逐字稿初稿完成後搜尋外部理解與補充資料 | `appendix-references.md` 與指定章節的「外部補充」段落 |
| 審稿 agent | 檢查單章是否忠於逐字稿、是否跳讀、是否需要回補 | 原則上只回報問題，不直接改稿；必要時由主控 agent 整合 |

#### 派工原則

- 不一次派出所有章節 worker；每批建議 3 到 4 講，降低術語漂移與整合成本。
- 每個 worker 只負責 1 講；若該講很短且相鄰主題高度相關，最多可負責 2 講。
- worker 必須被告知：repo 內可能有其他 agent 或使用者的改動，不可 revert 或覆蓋非自己負責的檔案。
- worker 的任務必須具體包含：
  - 指定逐字稿完整路徑。
  - 指定閱讀範圍為第 1 行到最後一行。
  - 指定輸出閱讀筆記檔與章節檔。
  - 禁止網路搜尋，除非主控 agent 明確進入第 6 階段。
  - 禁止只根據課名、常識或片段搜尋結果寫章節。
  - 若材料不足，必須回報缺口，不可自行腦補。

#### Worker 交付格式

每個章節 worker 完成後必須回報：

1. 已完整閱讀的逐字稿檔名與行數。
2. 新增或修改的檔案清單。
3. 本講 5 到 10 個核心概念。
4. 與前後章需要主控 agent 注意的連結。
5. 不確定或需要主控 agent 複查的點。
6. 是否使用外部資料（初稿階段應為「否」）。

#### 主控 agent 驗收條件

主控 agent 收到 worker 結果後，必須檢查：

- 閱讀筆記是否明確標示完整閱讀範圍。
- 章節是否有把逐字稿內容抽象成書面解釋，而不是逐字翻譯或鬆散摘要。
- 是否有跳過講者問答、演算法推導、程式設計細節等看似旁支但可能重要的內容。
- 術語是否和既有章節一致。
- 是否有新增未經允許的外部資料。
- 是否只改動被指派的檔案。
- 是否把不確定或缺失材料標成 `待補`，而不是寫成已確認事實。

驗收後主控 agent 才能更新 `plan/cs224r-transcript-tracker.md` 的狀態。

### 第 0 階段：建立書籍骨架

1. 建立全書工作目錄 `docs/cs224r-deep-rl/`。
2. 建立章節命名規則、頁面模板、術語表、參考資料頁。
3. 先用課程清單建立暫定章節，不寫實質內容，只標註每章來源逐字稿。
4. 建立閱讀紀錄表，追蹤每份逐字稿是否已「完整讀完」、「抽象完成」、「章節補寫完成」、「外部補充完成」。

### 第 1 階段：課程級抽象

在逐章細讀前，先建立高層架構，但只能以課名、檔案清單與課程主題做粗略規劃：

1. 定義全書讀者：已懂基本機器學習與深度學習，想系統理解深度強化學習各主流方法。
2. 將 18 講分成幾個篇章：
   - 基礎與模仿學習
   - On-Policy 策略最佳化（Policy Gradients、Actor-Critic）
   - Off-Policy 與 Q-Learning
   - Offline RL 與 Reward Learning
   - RL for LLMs（含 LLM Reasoning）
   - Model-Based RL
   - 進階主題（Multi-Task、Meta、Exploration、Hierarchical）
   - 機器人應用與前沿
3. 為每篇寫一段暫定導言，之後會根據完整閱讀結果修正。

### 第 2 階段：逐字稿完整閱讀

每一講按順序處理，流程固定：

1. 開啟 `data/cs224r/transcripts/` 內對應的逐字稿 `.txt`。
2. 從頭到尾完整閱讀，不跳段。
3. 邊讀邊記錄：
   - 本講主問題
   - 關鍵概念
   - 重要定義
   - 公式、演算法、工程限制
   - 講者使用的直覺、例子、類比
   - 問答或容易被忽略的細節
   - 與其他講次的關聯
4. 讀完後才產出該講的「抽象筆記」。
5. 抽象筆記完成後，再改寫成書稿章節。

### 第 3 階段：章節寫作

每章建議結構：

1. 章節導讀：這一章解決什麼 RL 問題。
2. 核心概念：用書面語整理逐字稿中的主要內容。
3. 演算法設計：若講次有具體演算法，整理其推導、步驟與直覺。
4. 工程取捨：課程提到的限制、瓶頸、設計選擇。
5. 常見誤解：逐字稿中講者特別澄清、問答中出現、或容易混淆的點。
6. 與前後章的連接：說明本章如何接到下一章。
7. 小結：用 5 到 10 個條列收斂本章。

### 第 4 階段：全書整合

逐章完成後，進行跨章整理：

1. 統一術語翻譯，例如 policy gradient、advantage、critic、replay buffer、off-policy、reward shaping、inverse RL、RLHF、model-based、meta-learning、exploration、hierarchy。
2. 檢查重複概念是否需要前置說明或交叉引用。
3. 補上全書導論與結語。
4. 建立圖表清單：演算法流程圖、RL 方法分類圖、訓練架構圖、機器人系統圖。
5. 檢查章節順序是否忠於課程，但必要時可在書稿中加入跨章導讀。

### 第 5 階段：參考資料整合

本課程附有 `data/cs224r/reference/RLbook2020.pdf`（Sutton & Barto《Reinforcement Learning: An Introduction》）。整合原則：

1. 逐章標示與 RL book 的對應章節，作為延伸閱讀建議，不直接摘抄。
2. 作業材料目前 `data/cs224r/assignments/` 目錄為空，若使用者補充作業 handout，再依 CS336 作業整合模式處理。
3. 不因為作業或 slides 缺失而中止書稿進度；相關欄位標 `待補`。

### 第 6 階段：網路補充

所有逐字稿完成閱讀與初稿後，才進行外部搜尋。搜尋目標：

1. 官方 CS224R 課程頁、講義、slides 或作業。
2. 學生或研究者的課程筆記。
3. 針對某些講次的高品質心得或解釋。
4. 與課程主題直接相關的論文、官方文件或工程文章（例如 PPO、SAC、IQL、RLHF、GRPO、MBPO 等原始論文）。

補充原則：

- 外部內容只能補強理解，不取代逐字稿。
- 每則外部補充都要標註來源 URL、作者或網站、存取日期。
- 若外部說法與逐字稿不同，優先保留差異並說明脈絡，不直接混寫。
- 不收錄只有泛泛摘要、SEO 內容、無法驗證作者或與課程無關的資料。

### 第 7 階段：出版化整理

1. 將內容轉入 `docs/cs224r-deep-rl/`。
2. 建立 `configs/cs224r-deep-rl.yml`。
3. 補上首頁、目錄、術語表、參考資料、索引。
4. 執行 MkDocs build。
5. 檢查中文排版、Mermaid 圖、連結、章節導覽。

## 品質檢查清單

- 每一章都能追溯到一份或多份完整讀完的逐字稿。
- 閱讀紀錄表不可只標「完成」，必須包含完成日期與摘要檔連結。
- 每一章的重點不是單純翻譯，而是把課程內容改造成讀者能建立心智模型的書面解釋。
- 重要公式、演算法步驟、工程限制不可只用口語描述，必要時要補圖或步驟。
- 外部資料必須有引用紀錄。
- 全書術語要一致。

## 建議檔案配置

```text
plan/
  cs224r-book-plan.md
  cs224r-transcript-tracker.md
  cs224r-chapter-template.md

docs/cs224r-deep-rl/
  README.md
  00-preface.md
  01-class-intro.md
  02-imitation-learning.md
  03-policy-gradients.md
  04-actor-critic.md
  05-off-policy-actor-critic.md
  06-q-learning.md
  07-offline-rl.md
  08-reward-learning.md
  09-rl-for-llms.md
  10-rl-for-llm-reasoning.md
  11-model-based-rl.md
  12-multi-task-rl.md
  13-meta-rl.md
  14-exploration.md
  15-hierarchical-rl-il.md
  16-rl-for-robots.md
  17-advancing-robot-intelligence.md
  18-frontiers.md
  tutorial-q-learning-review.md
  glossary.md
  references.md
  notes/
    lecture-01-*.md
    ...
```
