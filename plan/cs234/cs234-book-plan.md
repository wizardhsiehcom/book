# CS234《Reinforcement Learning》成書計畫

本計畫用來把 `data/cs234/` 內的 Stanford CS234（Reinforcement Learning，Emma Brunskill，2024）課程逐字稿，整理成一本繁體中文的技術書。逐字稿位於 `data/cs234/transcripts/`（純文字、無 timestamp）。核心原則是：每一講都必須閱讀完整逐字稿，從第一個字到最後一個字，不以片段、摘要、搜尋命中或抽樣段落代替完整閱讀。

## 材料格式注意事項

- 逐字稿為**單行檔案**（全文一行、無換行符號），`wc -l` 顯示 0 行。完整閱讀範圍以**字元數／位元組數**記錄，不以行數記錄。worker 讀取時需以 offset/limit 或分段方式讀完整個檔案。
- 逐字稿檔名**已含講題**（如 Policy Search 1、Offline RL 1、Value Alignment），與 EE364a 不同；但章節實際內容仍以完整閱讀為準，檔名只作初始參考。
- 共 16 講。其中 Lecture 9 為 **DPO 客座講座**（Rafael Rafailov、Archit Sharma、Eric Mitchell）；Lecture 15 檔名只標「Emma Brunskill & Dan Webber」未含主題，實際講題`待讀後確認`。
- 檔名顯示 Offline RL 1（L8）與 Offline RL 3（L10），中間夾著 L9 客座講座；是否存在「Offline RL 2」對應 L9 或缺講，`待讀後確認`。
- 本地既有骨架：`docs/cs234-reinforcement-learning/`（README、assets、空 notes/）、`configs/cs234-reinforcement-learning.yml`（nav 已列 16 章檔名但章節檔尚未建立）、launcher 卡片已註冊。寫作時沿用既定章節檔名。
- README 中「Winter 2026/Spring 2024」的學期標示存疑；逐字稿檔名標 2024，以 2024 為準。

## 目標

- 把課程內容整理成一本可在本 repo 內發展的 MkDocs 繁體中文書稿（目錄與 config 已存在）。
- 保留課程主線：MDP 與規劃、免模型評估與控制（Q-learning、函數逼近）、策略搜尋（policy gradient / PPO 系列）、Offline RL 與 DPO、探索（bandits / UCB / Thompson sampling）、多智能體、價值對齊（RLHF）。
- 將逐字稿中的口語講解轉成可閱讀、可複習、可交叉引用的書面章節。
- 以本地參考書《Reinforcement Learning: An Introduction》（Sutton & Barto 2nd ed，`data/cs234/reference/SuttonBarto-RL-2nd.pdf`）為對照輔助。
- 最後才補入網路上他人對 CS234 的理解、筆記、討論或延伸資源。

## 非目標

- 不直接將逐字稿全文貼成書稿。
- 不在未完整閱讀逐字稿前，先依檔名講題或既有常識寫出最終章節。
- 不用 Sutton & Barto 或外部文章取代課程逐字稿本身。
- 不為了速度跳過重複、口誤、問答或示範段落。
- 不在資訊不足時硬補內容。若本地沒有、使用者未提供、工具無法可靠取得，必須標記 `待補` 並請使用者提供，不可編造講題、作業細節、檔案路徑、deadline、作者或連結。

## 資訊不足處理規則

本專案允許佔位，不允許猜測。遇到下列狀況時，主控 agent 或 worker 必須停止補寫該欄位，改以 `待補`、`待讀後確認` 或「需使用者提供」標示：

- Lecture 15 的實際講題（檔名未含主題）。
- Offline RL 2 是否存在／L9 客座講座與 Offline RL 系列的關係。
- 課程作業、考試、slides 等材料（本地未見，僅有教科書 PDF）。
- Sutton & Barto 頁碼、定理、演算法編號未經核對。
- 客座講者姓名拼寫（ASR 轉寫需比對檔名確認）。

## 工作階段

### 多 agent 執行制度

本書由一個主控 agent 管控進度，派多個章節 worker agent 逐講完成內容。主控 agent 負責整體一致性。

#### 角色分工

| 角色 | 責任 | 可寫入範圍 |
|---|---|---|
| 主控 agent | 維護計畫、派工、審稿、更新追蹤表、統一術語、處理跨章整合 | `plan/cs234/`、`docs/cs234-reinforcement-learning/`、`configs/cs234-reinforcement-learning.yml` |
| 章節 worker agent | 完整閱讀指定逐字稿，產出該講閱讀筆記與章節初稿 | 僅限被指派的 `notes/lecture-XX-*.md` 與 `XX-*.md` |
| 外部補充 agent | 在全部逐字稿初稿完成後搜尋外部理解與補充資料 | `appendix-references.md` 與指定章節的「外部補充」段落 |
| 審稿 agent | 檢查單章是否忠於逐字稿、是否跳讀、是否需要回補 | 原則上只回報問題，不直接改稿 |

#### 派工原則

- 每批 3 到 4 講，降低術語漂移與整合成本。
- 每個 worker 只負責 1 講。
- worker 必須被告知：repo 內可能有其他 agent 或使用者的改動，不可 revert 或覆蓋非自己負責的檔案。
- worker 的任務必須具體包含：
  - 指定逐字稿完整路徑與檔案大小（位元組）。
  - 指定閱讀範圍為檔案開頭到結尾（單行檔案，以字元計）。
  - 指定輸出閱讀筆記檔與章節檔（章節檔名沿用 config nav 既定名稱）。
  - 禁止網路搜尋，除非主控 agent 明確進入外部補充階段。
  - 禁止只根據檔名講題、常識或片段搜尋結果寫章節。
  - 若材料不足，必須回報缺口，不可自行腦補。

#### Worker 交付格式

每個章節 worker 完成後必須回報：

1. 已完整閱讀的逐字稿檔名與總字元數（或位元組數）。
2. 新增或修改的檔案清單。
3. 本講 5 到 10 個核心概念。
4. 本講實際講題（讀完後確認，回填 tracker）。
5. 與前後章需要主控 agent 注意的連結。
6. 不確定或需要主控 agent 複查的點（含 ASR 存疑名詞）。

#### 主控 agent 驗收條件

- 閱讀筆記是否明確標示完整閱讀範圍（字元數）。
- 章節是否把逐字稿內容抽象成書面解釋，而不是逐字翻譯或鬆散摘要。
- 是否跳過講者推導、問答、例子等內容。
- 術語是否和既有章節一致（MDP、value function、policy gradient、regret、RLHF 等）。
- 是否新增未經允許的外部資料。
- 是否只改動被指派的檔案。
- 是否把不確定或缺失材料標成 `待補`。
- MkDocs build 通過。

驗收後主控 agent 才能更新 `plan/cs234/cs234-transcript-tracker.md` 的狀態。

### 第 0 階段：核對書籍骨架

骨架已部分存在（README、config nav、launcher 卡片）。本階段：

1. 核對 config nav 的 16 個章節檔名與逐字稿對應。
2. 建立附錄骨架（術語表、參考資料）並接入 nav。
3. 完成 Lecture 1 的完整閱讀與成章，作為後續 worker 的樣式基準。

### 第 1 階段：課程級抽象

1. 定義全書讀者：具備機器學習基礎（機率、監督式學習），想系統理解 RL 的決策核心與現代應用（含 RLHF/DPO）。
2. 依檔名講題把 16 講粗分篇章（見「暫定全書篇章」，讀完後修正）。

### 第 2 階段：逐字稿完整閱讀

每一講流程固定：

1. 開啟 `data/cs234/transcripts/` 對應逐字稿。
2. 從頭到尾完整閱讀（單行檔案，分段讀完全部內容），不跳段。
3. 邊讀邊記錄：本講主問題、關鍵概念與定義、公式／定理／演算法、講者直覺與例子、問答重點、跨講關聯。
4. 讀完後產出「抽象筆記」，回填實際講題。
5. 抽象筆記完成後改寫成書稿章節。

### 第 3 階段：章節寫作

每章建議結構：

1. 章節導讀：這一章解決什麼問題。
2. 核心概念：用書面語整理逐字稿主要內容。
3. 定義與演算法：MDP／值函數／演算法虛擬碼等關鍵結果，必要時補圖。
4. 理論與保證：收斂性、樣本複雜度、regret bound 等課程提到的結果。
5. 常見誤解：講者特別澄清或問答中出現的點。
6. 與前後章的連接。
7. 小結：5 到 10 個條列。

### 第 4 階段：全書整合

1. 統一術語翻譯（value function、policy gradient、regret、exploration、offline RL、alignment 等）。
2. 檢查交叉引用、補全書導論與結語、建立圖表清單。

### 第 5 階段：教材與課程資源整合

由 `plan/cs234/cs234-materials-plan.md` 管理。本地僅有 Sutton & Barto PDF；課程 slides、作業等未下載，標 `待補`。

### 第 6 階段：網路補充

所有逐字稿完成閱讀與初稿後才進行。目標：官方 CS234 課程頁、slides、作業說明（不含解答）、DPO 論文等講座直接相關文獻。補充原則同 EE364a 計畫：標註來源與存取日期、不取代逐字稿、差異並陳。

### 第 7 階段：出版化整理

1. 補齊附錄、統一導覽。
2. 執行 MkDocs build，檢查中文排版、數學式、Mermaid、連結。

## 品質檢查清單

- 每一章都能追溯到一份完整讀完的逐字稿。
- 閱讀紀錄包含完成日期與閱讀範圍（字元數）。
- 章節是書面解釋，不是逐字翻譯。
- 重要定義、演算法、bound 不可只用口語描述。
- 外部資料必須有引用紀錄。
- 全書術語一致。

## 暫定全書篇章

依檔名講題做的**暫定**分篇，讀完後修正：

| 篇 | 章節 | 主題 |
|---|---|---|
| 第一篇：基礎與規劃 | 01-02 | RL 導論、Tabular MDP Planning |
| 第二篇：免模型評估與控制 | 03-04 | Policy Evaluation、Q-learning 與函數逼近 |
| 第三篇：策略搜尋 | 05-07 | Policy Search 1-3 |
| 第四篇：Offline RL 與 DPO | 08-10 | Offline RL 1、DPO 客座講座、Offline RL 3 |
| 第五篇：探索 | 11-13 | Exploration 1-3 |
| 第六篇：多智能體與對齊 | 14-16 | Multi-Agent、客座（主題待確認）、Value Alignment |

## 建議檔案配置

```text
plan/cs234/
  cs234-book-plan.md
  cs234-transcript-tracker.md
  cs234-chapter-template.md
  cs234-materials-plan.md

docs/cs234-reinforcement-learning/   （已存在）
  README.md                          （已存在）
  01-introduction.md ... 16-value-alignment.md  （依 config nav 既定檔名）
  notes/lecture-XX-*.md
  appendix-glossary.md
  appendix-references.md
```
