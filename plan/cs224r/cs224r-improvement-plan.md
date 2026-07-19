# CS224R 深度強化學習 — 改進計畫

- 審查日期：2026-07-19
- 審查範圍：`docs/cs224r-deep-rl/` 全部 22 頁（README、01–18 章、Tutorial、glossary、references）逐頁完整閱讀；`configs/cs224r-deep-rl.yml`（nav）、`js/books-data.js`、build 輸出驗證。
- 課程本體：Stanford CS224R *Deep Reinforcement Learning*，Spring 2025（Chelsea Finn）。逐字稿初稿已全數成章（每章 150–280 行），本計畫對應「出版化整理 + 外部查證」階段。
- 既有規劃：`plan/cs224r/` 內有 `cs224r-book-plan.md`、`cs224r-chapter-template.md`、`cs224r-transcript-tracker.md`（建置期文件），本計畫延續其章節模板意圖，不推翻。

---

## 0. Phase 1 研究裁決（2026-07-19，寫作 agent 必讀，裁決優先）

三份研究筆記在 `plan/cs224r/research/`（`naming-and-xrefs.md`、`citations.md`、`timeliness.md`），全部已上網查證（查核日 2026-07-19）。以下為已裁決事項，寫作時直接照辦；細節與 URL 見各筆記。

### `references.md` 修正（W0 定稿）
- **MEDAL 條目引錯論文（嚴重）**：`references.md:132` 目前引 arXiv:2107.12931，那其實是 **VaPRL**，不是 MEDAL。改為 **MEDAL = Sharma, Ahmad & Finn, 2022, _A State-Distribution Matching Approach to Non-Episodic RL_, arXiv:2205.05212**（MEDAL = Matching Expert Distributions for Autonomous Learning）。
- **補三篇缺漏論文**：① RLPD（Ball et al., 2023, _Efficient Online RL with Offline Data_, arXiv:2303.02948）→ 第十八章；② HIL-SERL（Luo et al., 2024, arXiv:2410.21845, Science Robotics 2025）→ 第十八章 100/100 可靠性（**注意：不是** RL-100 arXiv:2510.14830，該文晚於 2025 春季課程）；③ Setlur et al., 2024, arXiv:2406.14532（RFT 2×、Per-step DPO 8× 的出處）→ 第十章，與既有 PAV（arXiv:2410.08146，5–6%）分列兩條。
- **回填 arXiv ID/日期**：DeepSeek-R1 = arXiv:2501.12948（2025-01-22）；GRPO 源自 DeepSeekMath = arXiv:2402.03300（2024-02-05）。
- **PPO 章號**：`references.md:40` 把 PPO 對應「第三章」，PPO 正文實在**第五章**，改對應第五章（或第三、五章並列）。

### 正文用字/數字修正
- `16-rl-for-robots.md`：「Metal」四處 → **MEDAL**（純聽寫誤植）。
- `01-class-intro.md:121`：「第三章（Actor-Critic）」→ **第四章**；「第五章（Q-Learning）」→ **第六章**（名稱對、章號錯）。
- `03-policy-gradients.md:136`：「下一章的 PPO」→ **第五章的 PPO**。
- `18-frontiers.md`：「Bala et al., 2023」→ **Ball et al., 2023**（RLPD）。
- `10-rl-llm-reasoning.md`：PAV「6-7% 絕對提升」→ **>6%**（貼合原文）。
- `18-frontiers.md`：人機協作 **92% / 76% / 74%** 三數 → **待查，無可查來源**，改「據課堂講述」語態或刪去具體百分比。
- `18-frontiers.md`：「1300 引用」的影片生成論文 = Finn, Goodfellow & Levine, 2016（arXiv:1605.07157）；引用數隨時間變動，**不要寫死數字**，改「廣受引用」。

### 時間錨點（不改寫課堂敘述，只加註）
- 課程官網以 `cs224r.stanford.edu` 標示為「課程官網（每年更新）」——該 URL 已滾動到 2026 春季；Spring 2025 講座影片在 Stanford Online YouTube 播放清單 `PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL`。
- GPT-4o sycophancy（ch9/ch18）：2025-04-25 發布、2025-04-29 回滾（課程學期內事件），OpenAI 官方貼文可引。
- Tesla Optimus 能力表（ch17）：加「（截至 2025 年春季）」錨點，不更新到 2026。
- 「資料約 2028 耗盡」（ch10）：與 Villalobos et al./Epoch（arXiv:2211.04325）一致，**數字不改**，補來源即可。
- DeepSeek-R1 公開於 2025-01；「O 系列」= OpenAI o1/o3 推理模型。

---

## 1. 審查結論（依嚴重度排序）

### P0-1　本書未登錄到首頁啟動器，讀者進不來

`grep -c cs224r js/books-data.js` = **0**。18 張書卡皆有，唯獨缺 cs224r。`index.html` 卡片牆沒有本書入口，違反 CLAUDE.md〈Adding a new book〉第 4 步。這是全書內容最完整卻對讀者不可見的矛盾。

**行動**：主控直接在 `js/books-data.js` 新增書卡（icon、title、desc、tags、href=`book/cs224r-deep-rl/html/index.html`、accent、glow），格式照抄既有 entry。deep purple 配色可對齊 config palette。

### P0-2　README 進度表整張過時，與實際內容矛盾

`README.md` 章節列表 19 列全標「待補」（僅第 1 章「撰寫中」），但 01–18 章＋Tutorial 全部已完整成章。讀者看到的首頁宣稱全書未寫，實際每章 150–280 行。另有：

- 「課程官網：待補」——CS224R Spring 2025 有公開課程頁，應查證回填。
- 「逐字稿來源：`data/cs224r/transcripts/`」「`data/cs224r/reference/RLbook2020.pdf`」——本地路徑對讀者無意義，應改為指向 references 頁或課程官網。
- README 課程主線 Mermaid 圖的箭頭把 RLHF→「RL for LLMs（含 Reasoning）」壓成一個節點，和實際第 9、10 兩章不完全對應（可接受，但更新時一併校準）。

**行動**：改寫進度表為「章節地圖」（狀態欄全部改為已完成，並把每列連結到對應章節）；回填課程官網；`data/` 路徑改為讀者導向敘述。

### P1-1　全書零內部超連結，交叉引用只存在於文字裡

`grep -rE '\]\([^)]*\.md'` 全書**零命中**。大量交叉引用全是純文字：各章末的 `*下一章：…*` 斜體、ch16–18／Tutorial 末的「延伸閱讀：第十五章（層級 RL）、第八章（獎勵學習）」、正文中的「見第八章」「（接第十三章）」「見第七章」等。讀者無法點擊跳轉，MkDocs 的核心價值沒用上；glossary 80+ 術語也沒有任何一條被章節連回。

**行動**：所有跨章引用轉相對路徑連結（如 `[第四章](04-actor-critic.md)`）；每章末「下一章／延伸閱讀」改為連結；章節首見術語連回 `glossary.md`。

### P1-2　兩套頁面骨架並存，且無一章符合自訂模板

- **A 式（ch1–15）**：開頭 `> **逐字稿：** Lecture X（完整閱讀，2026-07-06）` metadata blockquote → `## 導讀` → 中文數字節（一、二、三…）→ `## 小結`（編號 bullet）→ 斜體 `*下一章：…*`。
- **B 式（ch16、17、18、Tutorial）**：**無 metadata blockquote**、**無「導讀」標題**（直接一段引言）→ 小數編號節（16.1、17.2、T.3…）→ `## 章節總結`／速查表 → 粗體「延伸閱讀」。
- `cs224r-chapter-template.md` 規定骨架為 導讀／核心內容／演算法與推導／工程取捨／**常見誤解**／小結。**全書 22 頁沒有任何一頁有「常見誤解」段**，也沒有一頁完全照模板。ch16 標題「機器人的自主強化學習」與 nav 的「RL for Robots」不一致（ch16–18 標題都改寫成中文意譯，ch1–15 則多為直譯＋英文並存）。

**行動**：定義統一模板（見第 5 節），全 19 章＋Tutorial 收斂；補齊每章「常見誤解」；ch16–18／Tutorial 補 metadata blockquote 與「導讀」；標題風格統一。

### P1-3　全書幾乎零圖，改用 ASCII code block 假圖

只有 `README.md` 與 `01-class-intro.md` 有 Mermaid；其餘 20 頁一張 Mermaid 都沒有。大量以 ```` ``` ```` 純文字 code block 假裝圖表，明顯可圖解者：

- ch2 雙峰動作分佈直方圖（ASCII 長條）、複合誤差雪球流程、DAgger 迴圈。
- ch3 Online RL 迴圈、ch4/5/6 演算法虛擬碼與 MC-vs-TD 資訊傳播。
- ch7 IQL 的 Q 值分佈（ASCII 散點）。
- ch11/12/13 演算法家族樹（ch11 已用 ASCII 樹狀圖，最適合改 Mermaid）、ch18 開放問題藍圖樹。

**行動**：寫作階段每章評估 1–2 張 Mermaid（家族樹、流程圖、偏差-方差取捨），取代 ASCII 假圖；演算法虛擬碼可保留為 code block（那是程式碼不是圖）。遵守 CLAUDE.md mermaid@10 規則（中文/括號 label 加引號、`<br/>`）。人物/系統照片可另跑 `/mkdocs-add-images`（Finn、AlphaGo、Tesla Optimus 等）。

### P1-4　資料可信度：命名矛盾、章號誤標、正文研究未溯源

- **「Metal」vs「MEDAL」**：ch16 四處寫「Metal 算法」（16.5、表格 ×2、16.9），但 `references.md:132` 引的論文是 **MEDAL**（Sharma et al., 2021, *Autonomous RL via Subgoal Curriculum*）。正文與參考頁自相矛盾，疑為逐字稿聽寫誤植。**不得憑記憶逕改**——交研究階段確認正確名稱後統一。
- **章號誤標**：`01-class-intro.md:121`「第三章（Actor-Critic）、第五章（Q-Learning）」——依 nav，Actor-Critic 是**第四章**、Q-Learning 是**第六章**。另 `03-policy-gradients.md:136`「下一章的 PPO」實際 PPO 在第五章（下一章第四章談 Actor-Critic 尚未引入 PPO）。
- **正文研究未進 references**：ch16–18 出現多筆具體研究/數據卻未收錄或未標註：ch18「Bala et al., 2023」「Luo et al.」「AI 92% / 人+AI 76%」人機協作實驗、GPT-4o「IQ 130–145」案例、作者論文「1300 引用」；ch9 GPT-4o sycophancy 事件、ch10「資料到 2028 年耗盡」「Per-step DPO 8×」「PAV 5–6×」。`references.md` 本身其實相當完整（約 40 篇正確引用、對應到章），問題在**正文主張沒有連回它**，且上述十餘筆散落研究不在表內。

**行動**：research 階段查證 MEDAL 名稱、補齊 ch16–18 缺漏引用、核對章號；寫作階段把正文可查主張連回 references，敏感數字標「據課堂講述／某研究」。

### P0-3　`notes/` 工作檔被打包進網站（已於 Phase 0 修正）

`docs/cs224r-deep-rl/notes/` 有 19 份 `lecture-*.md` 逐字稿閱讀筆記，build 時列為 orphan（不在 nav 但仍隨網站發佈、可經 URL 開啟）。內含製作過程 metadata（`閱讀者：主控 agent（Batch 0）`、byte 數、`data/cs224r/transcripts/` 本地路徑、`狀態：已抽象`），不該對讀者公開。與 mas531 書的 P0-3 同型。

**行動（已完成）**：`git mv docs/cs224r-deep-rl/notes → plan/cs224r/research/transcripts/`，移出 `docs/`，rebuild 後 0 orphan。副效益：這 19 份筆記成為 Phase 1 研究 agents 的一手素材。

### P2-1　時效性：LLM 與機器人章的 2025 現況需加時間錨點（非糾錯）

本書是 2025 春季一門課的整理，忠於當時敘述才是「正確」。真正的時效問題是**用現在式陳述當時前沿卻無時間錨**：ch9 GPT-4o 諂媚事件、ch10 DeepSeek-R1／O 系列、ch17 Tesla Optimus 能力表、ch18 各前沿判斷。處置是加「（截至 2025 年春季課程）」錨點與 references 溯源，**不改寫成 2026 現況**。

### P2-2　glossary／references 收尾項

- glossary 內容紮實但零章節回連（併入 P1-1 處理）；少數詞條可標主要出現章節。
- references「課程官網：待補」「作業 handout：待補」「`data/` 路徑」需與 README 一併清理；Sutton & Barto 標「(2018)」但檔名 `RLbook2020.pdf`，統一年份表述。

---

## 2. 逐頁問題追蹤表

| 頁面 | 問題 | 行動 |
|---|---|---|
| `README.md` | 進度表全「待補」與實情矛盾；課程官網待補；`data/` 路徑；主線圖壓縮 | 改章節地圖＋狀態更新＋各章連結；回填官網；路徑改讀者導向 |
| `01-class-intro.md` | 121 行章號誤標（三→四、五→六）；A 式骨架、無常見誤解 | 修章號並連結化；補常見誤解；下一章改連結 |
| `02-imitation-learning.md` | 雙峰直方圖等 3 處 ASCII 假圖；無常見誤解 | 直方圖/雪球/DAgger 迴圈改 Mermaid；補常見誤解、連結化 |
| `03-policy-gradients.md` | 「下一章的 PPO」位置不精確；ASCII 迴圈圖；無常見誤解 | 改為「第五章」；迴圈改 Mermaid；補段、連結化 |
| `04-actor-critic.md` | 「PPO 在下一章展開」（正確，第五章）；ASCII 演算法框；無常見誤解 | 保留虛擬碼、補常見誤解、連結化 |
| `05-off-policy-actor-critic.md` | PPO/SAC 對照佳；無常見誤解、無圖 | 補常見誤解；PPO vs SAC 決策圖可加 |
| `06-q-learning.md` | DQN 三技巧清楚；無常見誤解、無圖 | 補常見誤解；策略迭代循環圖 |
| `07-offline-rl.md` | IQL Q 值分佈為 ASCII 散點；方法多而無圖；無常見誤解 | 分佈圖改示意；五法比較已有表；補常見誤解、連結化 |
| `08-reward-learning.md` | 三段式管線 ASCII；無常見誤解 | 管線改 Mermaid；補常見誤解；連結第一章稀疏獎勵 |
| `09-rl-for-llms.md` | GPT-4o 諂媚事件無錨點/來源；DPO 表；無常見誤解 | 加時間錨點＋references；補常見誤解、連結化 |
| `10-rl-llm-reasoning.md` | 「2028 耗盡」「8×」「5–6×」等數字未溯源；DeepSeek-R1 需錨點 | 數字連 references（PAV/DeepSeekMath）；加錨點；補常見誤解 |
| `11-model-based-rl.md` | 開場 ASCII 演算法家族樹（最適改圖）；篇幅最長無圖；無常見誤解 | 家族樹改 Mermaid；補常見誤解、連結化 |
| `12-multi-task-rl.md` | 與 ch11 合成資料重疊；無常見誤解、無圖 | 釐清與 ch11 界線並連結；補常見誤解 |
| `13-meta-rl.md` | DREAM 前引第十四章（正確）；無常見誤解、無圖 | 連結化第十四章；補常見誤解 |
| `14-exploration.md` | bandit 表佳；DREAM 樣本複雜度；無常見誤解、無圖 | 補常見誤解；探索法比較已有表 |
| `15-hierarchical-rl-il.md` | 內容佳；無常見誤解、無圖 | 補常見誤解；層級架構圖 |
| `16-rl-for-robots.md` | **B 式**：無 metadata、無導讀；「Metal」vs MEDAL 矛盾；標題與 nav 不一致；延伸閱讀純文字 | 補 metadata＋導讀；Metal→查證統一；標題對齊；延伸閱讀連結化；補常見誤解 |
| `17-advancing-robot-intelligence.md` | **B 式**；Tesla Optimus 表無錨點；2021–2022 脈絡；延伸閱讀純文字 | 補 metadata＋導讀；加時間錨點；連結化；補常見誤解 |
| `18-frontiers.md` | **B 式**；Bala/Luo/92%-76%/1300 引用等未溯源；藍圖 ASCII 樹 | 補 metadata＋導讀；缺漏引用進 references；藍圖改 Mermaid；補常見誤解 |
| `tutorial-q-learning-review.md` | **B 式**（T.x）；延伸閱讀已含正確引用但純文字 | 補 metadata＋導讀或標明 Tutorial 體例；延伸閱讀連結化 |
| `glossary.md` | 零章節回連；部分詞條可標出現章節 | 首見詞由各章連入；可加「主要章節」欄 |
| `references.md` | 內容佳但正文未連回；課程官網/作業/`data/` 待補；年份表述 | 補官網；`data/` 清理；作為權威來源頁，正文事實連回此頁 |

---

## 3. 新增頁面清單

本書章節結構已完整，**不建議新增章節頁**。僅以下微調（皆為既有檔改寫，非新檔）：

| 優先 | 對象 | 內容 | 連動更新 |
|---|---|---|---|
| P0 | `js/books-data.js` | 新增 cs224r 書卡 | index.html 卡片牆（主控直做） |
| P1 | `README.md` | 進度表→章節地圖（狀態更新＋章節連結） | 各章 metadata 一致後回填 |
| P2（選配） | `references.md` 末 | 補「本書提及但未列出的研究」小節收容 ch16–18 散落引用 | 正文對應處連回 |

不新增：獨立「演算法速查」頁——各章小結與 Tutorial T.9 速查表已涵蓋，另建會製造第二真相源。

---

## 4. 網路搜索規範

外部補充嚴格按 WebSearch → WebFetch，遵守：

1. **來源分級**：官方一手（Stanford CS224R Spring 2025 課程頁、Chelsea Finn／作者頁、arXiv/會議原始論文、DeepSeek-R1 技術報告）＞ 權威二手（Sutton & Barto、綜述）＞ 新聞媒體（僅供 GPT-4o 事件、Tesla Optimus 等時間線）＞ 社群（僅交叉比對）。
2. **每筆採納事實記錄三項**：URL、發布日期、查核日期（2026-07-XX）。
3. **敏感數字兩個獨立來源**：ch10 的 2×／8×／5–6× 效率數字、ch18 的 92%/76% 人機協作、ch17 Tesla Optimus 能力宣稱、「資料 2028 耗盡」預測。單一來源只能寫「據課堂講述」。
4. **MEDAL 專項**：查 Sharma et al., 2021 論文正式縮寫（疑正名為 MEDAL，正文「Metal」為聽寫誤植），確認後全書統一，並在 references 對齊。
5. **查不到 = 待查**，不得用訓練記憶補寫。逐字稿口述主張永遠保留「Finn 認為／課堂指出」歸屬語態；外部資料只做溯源與時間錨點，不覆寫課堂解讀（transcript-first）。
6. **時效語態**：LLM/機器人前沿一律加「（截至 2025 年春季課程）」；查得後續發展只在錨點旁補註，不改寫原敘述。

研究輸出到 `plan/cs224r/research/`；research agents 可上網、只寫該目錄；查不到標 `待查`。

---

## 5. 統一頁面模板

所有正文章節（01–18）收斂到：

```markdown
# 第 N 章：標題（中文主標題，英文原題可括號並存，與 nav 對齊）

> **逐字稿：** Lecture X（完整閱讀，2026-07-06）   ← ch16–18/Tutorial 需補

## 導讀
（2–3 段：本章處理哪個 RL 問題、承接前章什麼、讀完能理解什麼）

## 機制／論點小節 × N
（保留現有寫法；演算法虛擬碼維持 code block；ASCII 假圖改 Mermaid；
 首見術語連回 glossary；人物/研究首次出現一句身分＋references 連結）

## 常見誤解            ← 全書目前缺，每章補 1–3 條
（對應本章機制的易錯點）

## 小結
（編號 bullet，現有）

## 延伸閱讀            ← 取代純文字「下一章／見第 X 章」
（2–4 條相對路徑連結：相鄰章＋相關章＋glossary/references）
```

節內編號風格全書擇一（建議 A 式中文數字，或全改小數 N.x），不得同書混用。Tutorial 可維持 T.x 但需補 metadata 與導讀，並在開頭標明「本頁為助教複習課，體例略異」。

references 為**權威來源頁**：正文任何可查事實以此頁為準，不在正文重複維護完整引用；正文只放連結＋歸屬語態。

---

## 6. 多 Agent 執行制度

主控＝本 session，負責派工、驗收、更新 tracker／README、統一術語與 launcher 書卡。

### 研究 agents（可平行，輸出至 `plan/cs224r/research/`）

| Agent | 任務 | 輸出 |
|---|---|---|
| R1 命名與章號 | 確認 MEDAL 正名；核對全書跨章引用章號（ch1:121 等）；列出應連結化的交叉引用清單 | `research/naming-and-xrefs.md` |
| R2 缺漏引用與數字 | ch16–18 散落研究（Bala 2023、Luo、92%/76%、1300 引用）、ch10 效率數字（PAV/DeepSeekMath/RFT）、DeepSeek-R1 報告——URL＋日期，敏感數字兩來源 | `research/citations.md` |
| R3 時效與課程資源 | CS224R Spring 2025 課程官網、GPT-4o sycophancy 事件、Tesla Optimus 現況、「2028 資料耗盡」出處——供時間錨點小註 | `research/timeliness.md` |

### 寫作 agents（研究驗收後啟動，每批 3–4 相關頁）

| 批次 | 頁面 | 工作 |
|---|---|---|
| W0（先行） | `references.md`、`glossary.md` | references 補官網/清 `data/`/收容散落引用定稿；glossary 標出現章節。**其他批次等本批完成。** |
| W1 | README、01、02、03 | 模板收斂（常見誤解、延伸閱讀連結、術語回連）、README 章節地圖、01 章號修正、ASCII→Mermaid |
| W2 | 04、05、06、07 | 同上 + IQL/管線 ASCII→Mermaid |
| W3 | 08、09、10 | 同上 + LLM 章時間錨點與數字溯源 |
| W4 | 11、12、13、14 | 同上 + ch11 家族樹 Mermaid |
| W5 | 15、16、17、18、Tutorial | B 式補 metadata＋導讀；MEDAL 統一；Tesla/前沿錨點；延伸閱讀連結化；藍圖 Mermaid |

寫作 agents 只寫被指派檔案；數字與 URL 只准取自 `research/` 與 references；交叉引用必須相對路徑並確認目標檔存在；不得自行搜索、不得改寫逐字稿口述解讀。

### 審稿 agent（唯讀，最後執行）

- [ ] 每章有 metadata blockquote、導讀、常見誤解、延伸閱讀（連結）、小結
- [ ] 全書內部連結可解析（build 無 broken link）；glossary 有被連回
- [ ] Mermaid 合規（中文 label 引號、`<br/>`）；無殘留 ASCII 假圖（虛擬碼除外）
- [ ] MEDAL 命名全書一致；章號引用正確
- [ ] 敏感數字兩來源或「據課堂講述」；LLM/機器人前沿有時間錨點
- [ ] 術語譯名跨章一致（對照 glossary）
- [ ] README 章節地圖與實際檔案狀態一致
- [ ] 只回報問題，不改檔

### 主控（launcher 註冊）

`js/books-data.js` 書卡由主控自己加（單檔小 diff，不派工）。

---

## 7. 階段總覽與驗收

| 階段 | 內容 | 平行度 | 依賴 |
|---|---|---|---|
| Phase 0 | launcher 書卡註冊；README「待補」占位先去除 | 主控直做 | 無 |
| Phase 1 | R1、R2、R3 研究 | 3 agents 平行 | 無 |
| Phase 2 | W0 references／glossary 定稿 | 1 agent | Phase 1 驗收 |
| Phase 3 | W1–W5 章節改寫（模板收斂＋常見誤解＋連結化＋Mermaid） | 每批平行、批間互不寫同檔 | Phase 2 |
| Phase 4 | 審稿 agent + 主控修正 | 1 agent | Phase 3 |
| Phase 5 | `./sync-assets.sh` && `uv run mkdocs build -f configs/cs224r-deep-rl.yml`；README/tracker 終態更新 | 主控 | Phase 4 |

### 驗收清單

- [ ] launcher 出現 CS224R 書卡且連結可開
- [ ] README 章節地圖狀態正確，各章可點擊進入
- [ ] 19 章＋Tutorial 全部符合統一模板（metadata、導讀、常見誤解、延伸閱讀、小結）
- [ ] 全書內部連結 ≥ 60 條且 build 無 broken link；glossary 被章節連回
- [ ] 每章至少一張 Mermaid（或明確不需要），ASCII 假圖已改圖或還原為虛擬碼
- [ ] MEDAL 命名統一；ch1 章號修正；正文可查主張連回 references
- [ ] 敏感數字兩來源或標註；LLM/機器人前沿有「截至 2025 春」錨點
- [ ] `uv run mkdocs build` 通過、無 WARNING（Material 贊助橫幅除外）
