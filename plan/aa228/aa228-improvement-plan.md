# AA228V 安全關鍵系統驗證 — 全書改進計畫

- 書目：`docs/aa228-safety-critical-systems/`（17 章，nav 見 `configs/aa228-safety-critical-systems.yml`）
- 審查日期：2026-07-10（已逐頁完整閱讀全部 17 頁 + 實際執行 mkdocs build 取得警告）
- 本計畫與原建書計畫（`aa228-book-plan.md`、`aa228-transcript-tracker.md`、`aa228-chapter-template.md`）並存；本檔為**改進**計畫，僅規劃、不動手改內容。

---

## 1. 審查結論（依嚴重度排序）

### P0-1 章節順序與內文互相矛盾（結構性斷裂）

書的章節編號依 YouTube 影片標題排序（tracker 中 05=Discrete、06=Linear、07=Nonlinear），但各章內文的「上一章／前面章節」指涉顯示**實際授課順序不同**：

| 證據頁 | 原文 | 矛盾 |
|---|---|---|
| `05-discrete-reachability.md` 開頭 | 「在前一章中，我們探討了**連續系統中的可達性分析**」 | 其前一章（ch4）是屬性規範(二)，連續可達性在 ch6/ch7 |
| `05` §5.1 | 整節講泰勒模型、保守線性化（非線性可達性進階） | 正是 ch7 結尾預告「**後續的章節**將介紹泰勒模型」的內容 → 真實順序應為 6→7→5 |
| `06-linear-reachability.md` 開頭 | 「在過去的章節中，我們主要討論了**失效分析**（例如尋找失效點 Falsification 或是估計失效機率）」 | Falsification 是 ch8–9、失效機率是 ch11–12，全都排在 ch6 之後 |

推論：真實課程順序極可能是「屬性規範 → 偽造(8,9) → 失效分佈(10) → 重要性採樣(11,12) → 可達性(6→7→5) → 監控(13) → 可解釋性(14,15)」。**必須先由研究 Agent 以官方課程表（syllabus / lecture schedule）確認真實順序**，再擇一：
- 方案 A（建議）：重排 nav 與章號，使全書敘事線與轉場語句自然成立；
- 方案 B（最小改動）：保持現有編號，改寫所有錯誤的章首／章尾轉場語句。
此決策在 Phase 0 由主控依研究結果拍板。

### P0-2 壞連結 + 違反「不得引用 notebook」慣例

`mkdocs build` 實際警告（已驗證）：

```
WARNING - Doc file '12-adaptive-importance-sampling.md' contains a link
  '../../data/aa228/lectures_material/notebooks/failure_prob.jl' … not found
  （另有 failure_dist.jl、smc.jl 共 3 條）
```

`data/` 在 docs_dir 之外，建站後必然 404。此外 CLAUDE.md 明定「**No notebook references**：never cite notebook filenames」，但全書多處直接引用檔名：

- `04` §5：「在課程的 Julia 實作如 `property_specification.jl` 筆記本中」
- `10`：小節標題「Julia 實作（來自 `failure_dist.jl`）」
- `11` §3、§5：`failure_prob.jl`、`smc.jl`
- `12` §12.9：整節「相關 Julia 筆記本」表格（含 3 條壞連結）

行動：刪除所有 notebook 檔名引用，改為直述概念（Julia 程式碼片段本身可保留）；`12` §12.9 整節刪除或改寫為「延伸閱讀」。

### P0-3 `notes/` 草稿目錄被打包進網站

`docs/aa228-safety-critical-systems/notes/`（17 份個人草稿筆記）位於 docs_dir 內，build 時全數輸出成頁面（mkdocs 已警告 not included in nav），**可被站內搜尋索引到**，且品質為草稿等級。行動：把 `notes/` 移出 docs_dir（例如移到 `plan/aa228/notes/` 或 `data/aa228/notes/`），或在 config 中 exclude。

### P1-1 Mermaid 規則違規（會實際影響渲染）

| 頁 | 問題 | 規模 |
|---|---|---|
| `13-runtime-monitoring.md` | 節點標籤內用 `\n` 換行（CLAUDE.md 明定必須 `<br/>`） | ≥20 處（L29–L304） |
| `README.md`（第 1 章） | mermaid 節點標籤內含**真實換行字元**（L40–45 `E["環境 (Environment)\n狀態轉移…"]` 為跨行字串） | 3 個節點 |
| `17-guest-corso.md` | 兩個 `sequenceDiagram` 的 participant 別名寫反：`participant "行人" as P` 宣告的 ID 是「行人」、顯示名是 P；後續訊息用 `P ->> S:` 引用未宣告的 ID，導致圖中出現重複／錯誤的參與者 | 2 張圖（L122–132、L197–209） |

### P1-2 ch14 與 ch15 大量重複、數字口徑不一

兩章同為 Explainability，但以下主題**各講了兩次**：Shapley 值（14.3.3 vs 15.2.3，公式重複）、策略視覺化（14.2 vs 15.3）、積分梯度（14.3.2 vs 15.5.4，公式重複）、顯著圖 sanity checks（14.3.2 警告框 vs 15.5.6）。且複雜度舉例互相打架：ch14 說「25 個格子有超過 1600 萬種子集」、ch15 說「40 個時間步需約 $10^{47}$ 次」「特徵數 < 20 適用」。行動：兩章重新分工——ch14 = 課程核心方法（視覺化／特徵重要性／代理模型／反事實／失效聚類），ch15 = 深化與機制性可解釋性（Clever Hans、Grad-CAM、SAE、電路追蹤），重複內容只留一處、另一處改為交叉連結。

### P1-3 術語不統一（全書漂移，需權威對照表）

| 英文 | 出現的譯名 | 建議 |
|---|---|---|
| Falsification | 偽證(8)、錯誤尋找(9)、偽造(14–17) | 統一（研究 Agent 查繁中文獻慣例，暫傾向「偽造」） |
| Pareto Optimal | 柏拉圖最佳(3)、帕雷托最優(4) | 統一「帕雷托最佳」 |
| Robustness (STL) | 強健性(4)、強健度(9)、穩健性(15)、魯棒性(17) | 統一「強健性」 |
| Swiss Cheese Model | 瑞士起司模型(1)、瑞士乳酪模型(13) | 統一 |
| Bayesian | 貝氏(2,3,11)、貝葉斯(13) | 統一「貝氏」 |
| Polytope | 多胞形(6)、**多邊形(7，錯譯)**、多面體(5,13) | 統一「多胞形」；ch7 通篇錯譯必改 |
| Inverted Pendulum / Cart Pole | ch15 寫「倒立擺（Cart Pole）」混為一談 | 二者是不同系統，需依原講義核實 |

### P1-4 標題與小節編號格式混亂

- 章標題四種格式並存：「第 1 章：」(README)、「第四章：」(4,5,6,7,8)、「第十二章：」(10,12,13,14,16)、「Lecture 11:」(11)、「第 15 章：」(15,17)。
- 小節編號五種風格：`2.1`(2,3)、`1. 2. 3.`(4,7)、無編號(9,10,17 用 `17.x` 但 5,6 用 `5.x/6.x`)、`一、二、三`(13)、`14.x`(14)。
- 章末總結：10,12,13,14,15,16,17 有小結；2–9,11 沒有。
- `11` 殘留草稿段：「## 5. 待釐清與外部連結」「**待確認的課程內容**：有效樣本數 (ESS) 的計算」——筆記模板殘留，成書不應出現，ESS 應補寫成正文。

### P1-5 事實性宣稱待網路查證（不得憑記憶修改）

| 頁 | 宣稱 | 狀態 |
|---|---|---|
| `15` §15.9 | 「機制性可解釋性是 **MIT Technology Review 2026 年十大突破技術**之一」 | 待查 |
| `15` §15.9 | 「**Stanford CS 221M**（機制性可解釋性，**Thomas Icard** 授課）」 | 高度可疑（Icard 為哲學系教授；課號待查），查不到即刪或標待查 |
| `17` §17.1 | AST 由「SISL 校友 **Richie Lee**」提出 | 拼寫待核（Ritchie Lee, NASA Ames） |
| `17` §17.7 | 「**Harrison**（SISL）開發的 DIFFS」 | 作者全名與論文出處待查 |
| `17` §17.9 | 「現有政策：約 2.7°C 升溫」等氣候數字 | 無來源年份，需補（CAT/IPCC + 發布日期） |
| `17` 風險表 | 「南韓地熱廠導致地震」 | 應具體化（2017 浦項地震），待查證 |
| `16` 開頭 | Bansal 頭銜「先前曾任南加州大學助理教授、Waymo 研究科學家」 | 現職與經歷待核 |
| `17` 開頭 | Corso「前 Stanford AI 安全中心執行主任、Terra AI 創辦人」 | 待核 |
| `13` 課程總結表 | 「形式保證：可達性分析、**SMC**」 | SMC（Sequential Monte Carlo）是失效機率估計法，不屬形式保證；疑為 statistical model checking 之誤，需對照原講義 |
| `17` 延伸閱讀 | 「**Robert** 的多場景 AST 框架」 | 只有名字沒有引用（疑為 Robert Moss），待查補全 |

### P1-6 承諾 vs 內容缺口

- `01` §1.4 提到「這種概念甚至可以應用於**神經網路驗證**」、`17` 延伸閱讀寫「神經網路驗證工具（**詳見本課程後續講次**）」——但全書**沒有**神經網路驗證章節，且 ch17 已是最後一章。需查官方課程是否有該講次／教科書對應章節，決定補章或改寫措辭。
- 全書無「導讀」頁：README 直接是第 1 章內容，缺課程背景（授課者 Mykel Kochenderfer / Sydney Katz、教科書《Algorithms for Validation》、官方資源連結、本書使用方式）。
- 無術語表、無參考資料頁（ch17 有孤立的「延伸閱讀」但條目殘缺）。

### P2（次要）

- **零圖片**：全書 0 張圖，Swiss cheese、ACAS 遭遇幾何、金門橋等主題皆適合配圖 → 完成文字修訂後跑 `/mkdocs-add-images`。
- `03` §3.4.1 的 mermaid（P1→P3、P2→P3「柏拉圖最佳解集」）語意不明，屬裝飾性假圖，建議改為文字或真正的 Pareto 前緣說明圖。
- `14` §14.5 反事實分析僅 3 行 + 「詳見教材第 11.5 節」，形同空段，需擴寫或併入其他節。
- `13` 「証明」錯字（應為「證明」）。
- nav 標題全英文（`1. Introduction & Overview`），與全中文內文不搭，建議改雙語「1. 課程簡介 Introduction」。
- `aa228-transcript-tracker.md` 記錄 ch1 草稿檔為 `01-introduction.md`，實際是 `README.md`——tracker 過時，順手更正。

---

## 2. 逐頁問題追蹤表

| 頁 | 問題 | 行動 |
|---|---|---|
| `README.md` | mermaid 節點標籤內真實換行；缺導讀定位；章題格式「第 1 章：」 | 修 mermaid 為 `<br/>`；第 1 章內容保留、導讀移至新頁 `00-preface.md`；統一章題 |
| `02-system-modeling.md` | 無章末小結；小節 `2.1` 格式為基準之一 | 補小結；套用統一模板 |
| `03-property-specification-1.md` | §3.1 與 ch2 的 MLE/貝氏內容部分重複；§3.4.1 假圖；「柏拉圖」譯名；章尾「（…將在下一節繼續探討）」實為下一章 | 去重（保留一處詳述）；改圖；統一譯名；改「下一章」 |
| `04-property-specification-2.md` | 引用 `property_specification.jl` 檔名；小節用 `1. 2.`；「帕雷托最優」與 ch3 不一致 | 刪檔名引用；改 `4.x` 編號；統一譯名 |
| `05-discrete-reachability.md` | **P0-1 核心**：開頭指涉錯誤、§5.1 內容屬非線性可達性（應接在 ch7 之後）；「多面體」 | 依 Phase 0 決策重排或改寫轉場；§5.1 歸位；統一譯名 |
| `06-linear-reachability.md` | **P0-1**：開頭「過去章節討論失效分析」與現有順序矛盾 | 依 Phase 0 決策改寫開頭 |
| `07-nonlinear-reachability.md` | **P0-1**：結尾預告泰勒模型（實已在 ch5 §5.1）；通篇 Polytope 錯譯「多邊形」；小節 `1. 2.` | 修結尾銜接；全章改「多胞形」；改 `7.x` |
| `08-falsification-optimization.md` | 「偽證」譯名；無小結 | 統一譯名；補小結 |
| `09-falsification-planning.md` | 「錯誤尋找」譯名；「強健度」；小節無編號 | 統一譯名；套模板 |
| `10-failure-distribution.md` | 小節標題「Julia 實作（來自 `failure_dist.jl`）」違反慣例 | 刪檔名，改「Julia 實作」 |
| `11-importance-sampling.md` | 章題「Lecture 11:」；殘留「待釐清」草稿段；ESS 缺內容；引用 notebook 檔名；篇幅明顯單薄（127 行 vs 前後章 300+） | 改章題；刪草稿段；研究後補寫 ESS 正文；刪檔名；擴寫 |
| `12-adaptive-importance-sampling.md` | **3 條壞連結**（build 警告）；§12.9 整節 notebook 表 | 刪 §12.9 或改寫為延伸閱讀；刪壞連結 |
| `13-runtime-monitoring.md` | **≥20 處 mermaid `\n`**；「瑞士乳酪／貝葉斯／多面體」譯名；「証明」錯字；總結表「形式保證=SMC」疑錯置 | 修 mermaid；統一譯名；改錯字；SMC 歸類待研究核實後修 |
| `14-explainability-1.md` | 與 ch15 重複（Shapley/IG/顯著圖/視覺化）；§14.5 空段；複雜度數字與 ch15 不一致 | 兩章重新分工；擴寫反事實；數字以研究筆記為準 |
| `15-explainability-2.md` | 重複（同上）；MIT TR 2026、CS 221M 待查；「倒立擺（Cart Pole）」混用；「穩健性」 | 重新分工；查證後修或刪；核實系統名稱；統一譯名 |
| `16-guest-bansal.md` | Bansal 頭銜待核；其餘品質佳 | 查證後微修 |
| `17-guest-corso.md` | 2 張 sequenceDiagram participant 反置；Richie/Ritchie Lee、Harrison、Robert、氣候數字、浦項地震待查；「神經網路驗證…後續講次」承諾落空；「魯棒性」 | 修圖；逐項查證；改寫或補章（見新增頁面）；統一譯名 |
| `configs/aa228-safety-critical-systems.yml` | `notes/` 未排除；nav 全英文 | 移出 notes/；nav 改雙語；若 Phase 0 決定重排則同步改 nav 順序 |

---

## 3. 新增頁面清單

| 優先 | 頁面 | 內容 | 連帶更新 |
|---|---|---|---|
| 高 | `00-preface.md` 導讀 | 課程背景（Stanford AA228V、授課者、教科書《Algorithms for Validation》官方連結）、全書地圖（失效分析／形式化方法／監控與解釋三大軸）、各章依賴關係圖、如何使用本書 | nav 首位；README 開頭加一句指回導讀 |
| 高 | `appendix-glossary.md` 術語對照表 | 全書中英術語唯一標準（**權威來源頁**，writers 只能引用不能自創譯名） | nav 末位；各章譯名統一以此為準 |
| 中 | `appendix-references.md` 參考資料 | 教科書、各講次官方連結、ch17 延伸閱讀條目補全（含 URL + 發布日期 + 驗證日期） | nav；ch17 延伸閱讀改為指向此頁 |
| 中（視研究結果） | `18-neural-network-verification.md` | 若官方課程有此講次（或教科書有對應章）則補章，兌現 ch1/ch17 的承諾；否則改寫兩處措辭並在導讀註明不涵蓋 | nav；ch1 §1.4、ch17 延伸閱讀措辭 |

---

## 4. 網路搜索規範（研究 Agent 必遵）

1. 流程：WebSearch 找候選來源 → WebFetch 讀原文 → 記入 `plan/aa228/research/` 筆記。
2. 來源分級：官方（Stanford 課程頁、教科書、論文原文、機構官網）> 產業研究 > 新聞媒體 > 社群（僅供交叉比對，不得單獨採信）。
3. 每個採納的事實必記：**URL + 原文發布日期 + 驗證日期（2026-07）**。
4. 敏感事實（人物頭銜、課號、獎項、年度榜單、氣候數字）需**兩個獨立來源**；查不到的一律標「待查」，**嚴禁編造**。
5. 課程結構類問題（真實授課順序、是否有 NN 驗證講次）以官方 syllabus / 課程網站 / 教科書目錄為唯一準據。

---

## 5. 統一頁面模板（所有章節收斂目標）

```markdown
# 第 N 章：中文標題 (English Title)     ← 一律「第 N 章」阿拉伯數字
（1–2 段導言：本章在全書中的位置，轉場語句必須與 nav 順序一致）

## N.1 小節標題                          ← 一律 N.x 阿拉伯編號
（內文；Mermaid 遵守 CLAUDE.md：引號包標籤、<br/> 換行、不用 \n）
（Julia 程式片段可保留，但不得出現 notebook 檔名）

## N.x 本章小結                          ← 每章必有
（3–6 條要點或一張總結表；如有下一章，以一句話銜接）
```

- 譯名一律出自 `appendix-glossary.md`；首次出現附英文原文。
- 數字／頭銜／年份一律出自 `plan/aa228/research/` 筆記，附註來源。
- 訪客講座章（16、17）可放寬小節編號，但仍需章末小結與模板章題。

---

## 6. 多 Agent 執行制度

### 主控（本 session）
Phase 0 結構決策、派工、驗收、跑 build；亲自處理 config/nav/`notes/` 搬遷等跨檔小改動。

### 研究 Agent（Phase 1，3 個並行，輸出至 `plan/aa228/research/`，可上網）

| Agent | 任務 | 產出 |
|---|---|---|
| R1 課程結構 | AA228V 官方授課順序（syllabus/課程網站/YouTube 播放列表日期）、教科書《Algorithms for Validation》章節對應、是否有神經網路驗證講次 | `research/course-structure.md`（P0-1 與新章決策的唯一依據） |
| R2 事實查核 | §P1-5 全部條目：MIT TR 2026、CS 221M/Icard、Ritchie Lee、DIFFS/Harrison、Robert Moss、Bansal 與 Corso 頭銜、氣候數字、浦項地震、Uber 2018 | `research/fact-check.md`（每條：結論／URL／發布日期／驗證日期／信心） |
| R3 術語與技術覆核 | 繁中文獻的 falsification/Pareto/robustness/polytope 慣用譯名；ch13「形式保證=SMC」歸類覆核；ch15 倒立擺 vs Cart Pole；ch14/15 Shapley 複雜度數字口徑 | `research/terminology.md` + `research/tech-review.md` |

### 權威頁先行（Phase 2）
主控依 R3 定稿 `appendix-glossary.md`（譯名唯一標準），依 R1 定稿章節順序與 nav——**writers 開工前必須完成**。

### 寫作 Agent（Phase 3，批次並行；只能改被指派的檔案；數字與譯名只能取自 research 筆記與 glossary，禁止自行搜索）

| 批次 | 檔案 | 重點 |
|---|---|---|
| W1 | `00-preface.md`、`README.md`、`02`、`03` | 新導讀；README mermaid 修復；ch2/3 去重、模板化 |
| W2 | `04`、`05`、`06`、`07` | P0-1 重排後的轉場改寫、§5.1 歸位、polytope 正譯、刪 notebook 引用 |
| W3 | `08`、`09`、`10`、`11` | 譯名統一、ch11 擴寫（ESS）＋刪草稿段、刪 notebook 檔名 |
| W4 | `12`、`13` | 刪 §12.9 壞連結、ch13 mermaid `\n` 全修、SMC 歸類修正 |
| W5 | `14`、`15` | 兩章重新分工去重、反事實擴寫、查證結果落地 |
| W6 | `16`、`17`、`appendix-glossary.md`（依 R3 定稿謄寫）、`appendix-references.md`、（如立項）`18-nn-verification.md` | sequenceDiagram 修復、頭銜與引文落地、延伸閱讀補全 |

### 審查 Agent（Phase 4，唯讀）
逐頁核對 checklist：① 章首轉場與最終 nav 順序一致；② 無 notebook 檔名；③ mermaid 無 `\n`、標籤引號、sequenceDiagram participant 正確；④ 譯名與 glossary 一致；⑤ 每個新事實有 research 筆記出處；⑥ 每章有小結；⑦ 無殘留「待釐清／待確認」草稿段；⑧ 內部連結有效。輸出問題清單給主控，不直接改檔。

---

## 7. 階段總覽與驗收

| 階段 | 內容 | 並行度 | 依賴 |
|---|---|---|---|
| Phase 0 | 主控：`notes/` 移出 docs_dir、tracker 勘誤 | — | 無 |
| Phase 1 | R1/R2/R3 研究 | 3 並行 | 無 |
| Phase 2 | 主控拍板章節順序（方案 A/B）、定稿 glossary、更新 nav | — | Phase 1 |
| Phase 3 | W1–W6 寫作 | 依批次並行（互不重疊檔案） | Phase 2 |
| Phase 4 | 審查 Agent + 修正回合 | — | Phase 3 |
| Phase 5 | `./sync-assets.sh` + `uv run mkdocs build -f configs/aa228-safety-critical-systems.yml` 零 WARNING；（選配）`/mkdocs-add-images` | — | Phase 4 |

### Phase 0–2 執行記錄（2026-07-10，主控）

- Phase 0 完成：`notes/` 已移至 `plan/aa228/notes/`；tracker 路徑勘誤。
- Phase 1 完成：R1/R2/R3 研究筆記已就位（`research/course-structure.md`、`fact-check.md`、`terminology.md`、`tech-review.md`）。
- Phase 2 拍板：**採方案 A 完整重排**（依 2025 冬官方課表＝播放列表＝教科書章序，Corso 客座插第 7 章、Runtime Monitoring 收尾）。檔案已 git mv、nav 已更新為雙語並重排、`appendix-glossary.md`（譯名權威頁）已定稿入 nav。build 通過。
- 神經網路驗證：R1 證實為未公開之 Min Wu 客座（2025/2/20）→ **不補章**，改寫 ch1/ch17 措辭並在第 12 章（非線性可達性）加註教科書 §9.7 與附錄 C。
- **新舊章號對照（寫作與審查 Agent 一律用新檔名）**：

| 新檔名 | 舊章號 | 新檔名 | 舊章號 |
|---|---|---|---|
| 05-falsification-optimization | 08 | 11-linear-reachability | 06 |
| 06-falsification-planning | 09 | 12-nonlinear-reachability | 07 |
| 07-guest-corso | 17 | 13-discrete-reachability | 05 |
| 08-failure-distribution | 10 | 17-runtime-monitoring | 13 |
| 09-importance-sampling | 11 | （其餘不變） | |
| 10-adaptive-importance-sampling | 12 | | |

- 寫作批次改依新檔名：W1 = `00-preface.md`＋`README.md`＋`02`＋`03`＋`04`；W2 = `05`＋`06`＋`07-guest-corso`；W3 = `08`＋`09`＋`10`；W4 = `11`＋`12`＋`13`；W5 = `14`＋`15`；W6 = `16`＋`17-runtime-monitoring`＋`appendix-references.md`。glossary 已由主控定稿，writers 只引用不修改。**各章內文的章號（標題、小節編號、「上一章」指涉）需由 writers 更新為新章號。**

### 驗收清單（2026-07-11 全數完成；Phase 4 審查 9/9 通過，6 條 P3 潤飾已由主控收尾）

- [x] build 零 WARNING（已驗證）
- [x] `notes/` 不再出現在建站輸出與站內搜尋（已移至 `plan/aa228/notes/`）
- [x] 全書章首／章尾轉場與 nav 順序一致（P0-1 消除；審查逐邊界核對通過）
- [x] 全書 0 處 notebook 檔名引用
- [x] 全書 mermaid 0 處 `\n`；sequenceDiagram participant 格式正確
- [x] 否證 / 帕雷托 / 強健性 / 多胞形 / 貝氏 / 瑞士乳酪 全書譯名唯一，與 glossary 一致
- [x] 章題與小節編號全書統一為模板格式；每章有小結
- [x] P1-5 表全數處置：查證屬實保留 2 條（MIT TR 2026、CS 221M）、修正 8 條、改寫迴避 1 條（Robert Moss 多場景）；來源記於 `research/fact-check.md`
- [x] `00-preface.md`、`appendix-glossary.md`、`appendix-references.md` 上線並入 nav（RSS 與 Adebayo 兩條 URL 由主控補查證完成）
- [x] 神經網路驗證：採措辭改寫（Min Wu 未公開客座＋教科書 §9.7 註記於導讀、ch1、ch12、ch7）
- [x] ch14/15 無重複小節（5 節壓縮為交叉連結）；複雜度口徑統一（2ⁿ 子集 vs n! 排列分寫）

**遺留 P2（未做，另行擇期）**：全書零圖片 → 執行 `/mkdocs-add-images`。
