# 《半導體職務完全指南》全書補強計畫

本計畫是對 `docs/semi-jobs/`（26 頁，約 2,000 行）的完整審查結果與補強執行方案。審查日期：2026-07-06。全書內容停在 2024–2025 年，距今已一年以上，時效性是最大問題；其次是職務與產業覆蓋缺口、頁面結構不一致、薪資資料無來源。本計畫採多 agent 執行，包含研究 agent 的網路搜索規範。

---

## 一、審查結論：全書性問題（依嚴重度排序）

### P0 — 必須修正

1. **時效性全面過期**。全書所有數字標註「2024–2025 估計」，今天是 2026 年 7 月。最嚴重的是 `appendix-trends.md`：
   - CoWoS 產能寫「2025 年擴充至 15,000 片+」——已成過去式，需要 2026 實際數字與後續（CoWoS-L、SoW 面板級）規劃。
   - 「未來 3–5 年值得關注的新興職務」清單（3D IC、玻璃基板、CPO、RISC-V、AI for EDA）寫於 2024 視角，部分已實現、部分已有明確進展，需逐項重新查證改寫。
   - N2 已於 2025 下半年量產、A16 時程、High-NA EUV 導入進度、TSMC Arizona / 熊本 / Dresden 營運現況，全書隻字未提或停留在「規劃中」。
   - 提到的產品世代（H100/H200/B100）已落後，需更新到當前世代。
2. **README 承諾跳票**。`README.md` 寫「每個職務頁有『核心技能』與『面試常考方向』」——實際上 **沒有任何一頁** 有「面試常考方向」小節，只有 `appendix-resources.md` 有一段通用面試準備。必須逐頁補上，或改寫 README。本計畫選擇逐頁補上（這正是求職讀者最需要的內容）。
3. **薪資資料無來源、內部不一致**：
   - 所有薪資表無資料來源與查證日期，只有 appendix 一句免責聲明。
   - `appendix-salary.md` 有重複列：「失效分析工程師」與「FA Engineer（TEM / FIB 專家）」兩列新鮮人區間相同、Staff 區間不同，讀者無從分辨。
   - `00-map.md` 的薪資速覽表與 `appendix-salary.md`、各職務頁三處數字需做一致性總校（例如 Verification 新鮮人 00-map 寫 100–160萬、03 頁寫 1.0M–1.6M，目前恰好一致，但更新後極易漂移——必須指定 appendix-salary 為唯一權威來源，其他兩處從它同步）。
   - `appendix-salary.md` 的「薪資可視化比較」mermaid 只是一排文字方框，毫無視覺化效果，應改為 HTML 表格內嵌長條（repo 允許 inline HTML）或刪除。

### P1 — 覆蓋缺口（缺的職務與產業）

4. **記憶體產業完全缺席**。美光台灣（台中/桃園，台灣最大外商製造雇主之一）、南亞科、華邦、旺宏一次都沒出現。DRAM/NAND 的製程、設備、產品工程師是台灣半導體就業的重要板塊，且 HBM 熱潮下美光台灣持續擴產。需新增一頁「記憶體產業職務」。
5. **良率工程師（Yield Engineer）無專頁**。`09-integration.md` 與 `19-ai-software.md` 都提到良率工程師，但全書沒有這個職務的頁面——這是 TSMC 大量招募的職類（YE/PI），必須新增。
6. **其他職務缺口**（依優先度）：
   - 元件工程師（Device Engineer，SPICE model / TCAD，與 09、05 PDK 相鄰但被跳過）。
   - 量測 / 缺陷檢測工程師（Metrology / Defect Inspection，KLA 生態，僅在 10 的表格出現一格）。
   - 產品工程師（Product Engineer）：`16-test.md` 標題把 Test / Product Engineer 混為一談，實務上 PE 管良率與規格、TE 管測試程式，應在 16 內拆清楚。
   - 離子佈植 / 熱製程工程師：`06-process-overview.md` 流程圖畫了 Implant / Anneal，但 08 只寫蝕刻/薄膜/CMP，Implant 無人涵蓋（可併入 08 或 06）。
   - CIM / MES / 自動化 IT 工程師（晶圓廠 IT，AMHS 天車系統）：README 開頭自己就列了「IT」，內文卻沒有。
7. **公司版圖缺口**：Design Service / ASIC（世芯 Alchip——AI ASIC 熱潮核心受惠者、創意 GUC、智原 Faraday）只在 02 提過 GUC 一次；IP 公司（Andes 晶心、eMemory、M31）；化合物半導體（穩懋 GaAs、GaN/SiC 功率半導體與漢磊等）；光罩（台灣光罩、TSMC mask shop）。至少需在 00-map 的生態系圖與表格中補上，並視研究結果決定是否成頁。
8. **海外外派缺席**。TSMC Arizona / JASM 熊本 / ESMC Dresden 的外派機會、薪資溢價、輪調制度，是 2025–2026 求職者最關心的話題之一，全書無任何內容。建議新增附錄一頁。

### P2 — 結構與品質

9. **頁面小節不統一**。README 承諾每職務講「每天在做什麼、需要哪些技能、薪資大概是多少、怎麼晉升」，但實際：
   - 缺「職涯發展」：05、08、11、12、13、14、15、16、18、19（共 10 頁）。
   - 缺「主要雇主」：05、07、11、12（07 只在薪資表暗示）。
   - 需定義統一頁面模板（見第三節）並逐頁補齊。
10. **導覽與編號**：nav 把 20（合作關係圖）、21（CoWoS 合作）放在最前面、章節頁 01–19 在後，檔名編號與閱讀順序脫節（可接受，但 plan 執行時不要「修正」它——這是刻意安排）；「七、製造與 AI」同時裝 IE 與 AI/軟體，章名名實不符，建議拆成「七、製造效率」與「八、軟體與 AI」或改名。
11. **全書零圖片**。適合用 `/mkdocs-add-images` 補：無塵室 bunny suit、EUV 機台、CoWoS 剖面、探針卡、FIB/SEM 等（Wikimedia Commons 都有）。列為選配 Phase。
12. **無 glossary / references 頁**。repo 其他書（如 cs224r）慣例有 glossary；本書縮寫密度極高（ATPG、HTOL、OBIRCH、KGD⋯⋯），求職新人正是最需要 glossary 的讀者。references 頁承接所有研究引用來源。
13. **待查證的具體數字**（更新時必須重查，不可沿用）：產業就業人數「37 萬人以上」、TSMC 員工數 83,825（2023 年報數字）、ASE 65,695、High-NA EUV「超過 4 億美元」、EUV 光源 250W、各公司人數規模估計（00-map 表格）。
14. **跨書連結** `../../cowos/html/index.html`（15、21 頁）：cowos 書存在、建成後連結有效，但 mkdocs build 會出 warning。保持現狀即可，審稿時確認沒被誤刪。

### 逐頁問題追蹤表

| 頁面 | 問題 | 行動 |
|---|---|---|
| README.md | 「面試常考方向」承諾跳票；37萬人數字待查；「2024–2025」標註過期 | 更新數字與年份；承諾與內容對齊 |
| 00-map.md | 公司員工數過期；缺記憶體/ASIC/化合物半導體版塊；薪資速覽需與 appendix 同步 | 生態系圖與表格擴充；數字重查 |
| 01-ic-design.md | 內容佳；薪資過期；缺面試小節；AI 晶片段落可補 2026 現況（世芯/創意 ASIC 潮） | 模板補齊＋更新 |
| 02-layout.md | 薪資過期；缺面試小節；GAAFET（N2）帶來的新約束未提 | 模板補齊＋補 GAA 段落 |
| 03-verification.md | 薪資過期；缺面試小節 | 模板補齊＋更新 |
| 04-dft.md | 薪資過期；缺面試小節；Chiplet/UCIe 測試趨勢可補 | 模板補齊＋更新 |
| 05-eda-cad.md | 全書最短之一；缺職涯發展、主要雇主、面試小節；AI for EDA 進展需更新 | 大幅補寫 |
| 06-process-overview.md | Implant/熱製程有圖無文；薪資過期 | 補 Implant 段落；模板補齊 |
| 07-photo.md | High-NA EUV 進度過期；缺主要雇主、職涯、面試小節 | 更新 High-NA/N2 現況；模板補齊 |
| 08-etch-dep-cmp.md | 三職務都缺職涯與面試小節；GAA nanosheet 對 Etch/Dep 的新要求可補 | 模板補齊＋更新 |
| 09-integration.md | 提到良率工程師但無連結目標（新頁補後互連）；N2/A16 現況更新 | 更新＋互連新頁 |
| 10-equipment.md | 缺面試小節；薪資過期 | 模板補齊＋更新 |
| 11-facilities.md | 缺主要雇主、職涯、面試小節；可補綠電/ESG 議題（2026 相關性高） | 模板補齊 |
| 12-qa.md | 全書最薄（40 行）；缺職涯、主要雇主、面試小節 | 大幅補寫 |
| 13-reliability.md | 缺職涯、面試小節 | 模板補齊 |
| 14-failure-analysis.md | 缺職涯、面試小節 | 模板補齊 |
| 15-packaging.md | H100 世代描述過期；CoWoS-L/SoW/玻璃基板進展；缺職涯、面試小節 | 重點更新頁 |
| 16-test.md | TE/PE 職務混淆需拆清楚；缺面試小節 | 改寫＋模板補齊 |
| 17-fae.md | 缺面試小節；與 10 的 AE 內容部分重複，需互相引用而非重複 | 模板補齊＋去重 |
| 18-ie.md | 缺面試小節 | 模板補齊 |
| 19-ai-software.md | 「2023–2025」段落全面過期；RISC-V 新創現況（Tenstorrent Taiwan 等需重新查證）；缺職涯、面試小節 | 重點更新頁 |
| 20-collaboration.md | 內容完整度最佳；僅需隨新頁（良率工程師等）擴充網路圖與熱力圖 | 小幅擴充 |
| 21-cowos-collaboration.md | 產品世代與 CoWoS 世代描述需更新；HBM4 協作可補 | 更新 |
| appendix-salary.md | 全表重查；FA 重複列合併；mermaid 假視覺化改掉；建立為薪資唯一權威來源 | 重點更新頁 |
| appendix-entry.md | 台積電「直攻計畫」等制度需查證是否仍存在；缺海外外派資訊（另立新頁） | 更新＋查證 |
| appendix-trends.md | **全書最過期頁**，以 2026 視角全面改寫；「可能放緩」與「新興職務」逐項對答案 | 全面改寫 |
| appendix-resources.md | 連結有效性全查；補 2026 新資源；面試段落與各頁新小節分工（此頁留通用、各頁留專屬） | 更新 |

### 新增頁面清單

| 新頁 | 內容 | 優先度 |
|---|---|---|
| 良率工程師（yield）| YE/PI 職務、wafer map 分析、與整合/FA 的分工、AI 良率工具 | P0 |
| 記憶體產業職務（memory-industry）| 美光台灣/南亞科/華邦/旺宏；DRAM/NAND/HBM 職務與 logic 廠差異；薪資 | P1 |
| 元件工程師（device）| SPICE model、TCAD、與 PDK/整合的介面 | P1 |
| 量測/缺陷檢測工程師（metrology）| CD-SEM、Overlay、KLA 生態、與良率的關係 | P1 |
| 海外外派機會（appendix-overseas）| Arizona/熊本/Dresden 外派制度、薪資溢價、生活面 | P1 |
| glossary.md | 全書縮寫與術語 | P2 |
| references.md | 研究引用來源總表（含查證日期） | P0（隨研究產出） |

新頁完成後同步更新：`configs/semi-jobs.yml` nav、`00-map.md` 技能樹與生態系圖、`20-collaboration.md` 網路圖與熱力圖、`appendix-salary.md` 總表。

---

## 二、網路搜索規範（研究 agent 必讀）

有一年以上的資訊斷層，**所有數字與趨勢描述都必須重新查證，不可沿用書中舊值、也不可憑模型記憶補寫**。

### 工具與流程

1. 先用 `WebSearch` 找候選來源（中英文各下一輪查詢），再用 `WebFetch` 抓取內文確認原始數字與日期。
2. 每條採用的事實必須記錄：來源 URL、發布日期、查證日期（2026-07）、原文關鍵句。全部寫入 `plan/semi-jobs/research/` 下的研究筆記，最終彙整進 `references.md`。
3. 搜尋時優先加年份限定詞（`2025`、`2026`）避免撈到舊文。

### 來源分級（高→低）

| 級別 | 來源 | 用途 |
|---|---|---|
| A 官方 | 公司年報/ESG 報告（TSMC、ASE、美光）、法說會資料、官方 careers 頁、ASML Annual Report、SEMI 產業報告 | 員工數、產能、擴廠、制度 |
| B 產業研究 | TrendForce、Counterpoint、SemiAnalysis、Yole、IDC | CoWoS/HBM 產能、市場趨勢 |
| C 財經媒體 | DIGITIMES、經濟日報、工商時報、天下、中央社 | 擴廠新聞、人才議題、交叉驗證 B |
| D 社群/薪資平台 | 104 薪資情報、比薪水（salary.tw）、Glassdoor、PTT Tech_Job、Dcard | **僅限薪資區間交叉參考**，不可單獨引用 |

### 薪資查證規則（最嚴格）

- 每個薪資區間至少 **兩個獨立來源**（例如 104 薪資情報 × 比薪水，或平台 × PTT 近期文章）交叉；取交集、寧可保守。
- 查不到可靠 2025–2026 資料的職務：**保留舊區間並明確標註「2024 資料，待查」**，不可編造上調。
- 每張薪資表表尾標註「查證日期：2026-07」；appendix-salary 免責聲明保留並更新年份。

### 各主題查詢範例

| 主題 | 查詢範例（中/英） |
|---|---|
| 薪資 | 「台積電 製程工程師 年薪 2026 site:ptt.cc」「聯發科 IC設計 新鮮人 年薪 2025」「TSMC engineer salary 2026」；104/比薪水站內搜尋各職稱 |
| CoWoS/先進封裝 | 「TSMC CoWoS capacity 2026 TrendForce」「CoWoS-L SoW panel level packaging 2026」「台積電 先進封裝 擴產 嘉義」 |
| 製程節點 | 「TSMC N2 mass production yield 2026」「TSMC A16 timeline」「High-NA EUV TSMC adoption」 |
| 海外廠 | 「TSMC Arizona Fab 21 status 2026」「JASM Kumamoto fab 2」「TSMC Dresden ESMC」「台積電 美國 外派 薪資」 |
| HBM/記憶體 | 「HBM4 mass production 2026」「Micron Taiwan hiring 台中 A3」「南亞科 徵才 2026」 |
| AI ASIC | 「世芯 Alchip 徵才 2026」「創意 GUC AI ASIC」「Broadcom Google TPU ASIC Taiwan」 |
| 公司數字 | 「TSMC 2025 annual report employees」「ASE Holdings employees 2025」 |
| 制度查證 | 「台積電 直攻計畫 2026」「TSMC 輪班 津貼 制度」 |
| 新興職務 | 「glass substrate packaging engineer 2026」「CPO co-packaged optics TSMC 2026」「silicon photonics 徵才 台灣」 |

### 資訊不足處理規則

允許佔位，不允許猜測。查不到就在稿內標 `（待查：2026 年X資料）` 並回報主控 agent，不可為了表格完整而補出不存在的數字。制度類（直攻計畫、獎金月數）若查無近期佐證，降級為「過去曾有，現況待確認」措辭。

---

## 三、統一頁面模板

所有職務頁（01–19 及新頁）補齊為以下小節，順序固定；已有內容保留並更新，不重寫風格：

```
# 職務名稱
（一段定位描述：這個職務為什麼存在、在產業鏈的位置）
## 核心工作（含「每天在做什麼」清單；適合處配 mermaid）
## 核心技能
## 職涯發展（mermaid flowchart）
## 主要雇主
## 薪資（表格；表尾標註查證日期與來源等級）
## 面試常考方向（3–6 條：技術題型、行為題重點、該職務特有的考點）
（頁尾：相關頁面交叉連結）
```

寫作守則（沿用 repo 慣例）：繁體中文；一頁一概念；不引用 notebook；mermaid@10 規則（含特殊字元的標籤一律加引號、換行用 `<br/>`）；薪資數字一律從 `appendix-salary.md` 權威表同步，不得自行發明。

---

## 四、多 Agent 執行制度

由主控 agent（本會話）管控進度，派研究、寫作、審稿三類 subagent。主控負責整體一致性，不把品質責任下放。

### 角色分工

| 角色 | 型別 | 責任 | 可寫入範圍 |
|---|---|---|---|
| 主控 agent | （本會話） | 維護本計畫與追蹤表、派工、整合審稿意見、術語與薪資一致性、nav 更新、最終 build | `plan/semi-jobs/`、`docs/semi-jobs/`、`configs/semi-jobs.yml` |
| 研究 agent ×4 | general-purpose | 依第二節規範做網路搜索，產出附來源的研究筆記 | 僅 `plan/semi-jobs/research/` 下各自的檔案 |
| 寫作 agent | general-purpose | 依模板與研究筆記更新/新寫指定頁面 | 僅被指派的 `docs/semi-jobs/*.md` |
| 審稿 agent | Explore（唯讀） | 檢查一致性與規範，只回報問題不改稿 | 無（唯讀） |

### 研究 agent 分工（Phase 1，四個平行）

| Agent | 主題 | 產出 |
|---|---|---|
| R1 薪資與公司 | 全職務 2026 薪資區間、各公司員工數/獎金制度、直攻計畫等制度查證 | `research/r1-salary-companies.md` |
| R2 技術趨勢 | N2/A16/High-NA、CoWoS 世代與產能、HBM4、玻璃基板/CPO/SoW、appendix-trends 逐項對答案 | `research/r2-tech-trends.md` |
| R3 新增職務與產業 | 良率/元件/量測/CIM 職務內容；記憶體產業（美光台灣等）；AI ASIC（世芯/創意）；化合物半導體 | `research/r3-new-roles-industries.md` |
| R4 求職與海外 | 各職類面試常考題（PTT/Dcard/Glassdoor 面經）、海外外派制度、appendix-resources 連結體檢與新資源 | `research/r4-career-overseas.md` |

每個研究 agent 的任務指令必須包含：第二節搜索規範全文要點、輸出檔路徑、「查不到標待查、不可編造」、每條事實附 URL 與日期。

### 寫作 agent 派工原則

- 研究全部完成後才開始寫作（寫作依賴研究筆記，不得自行上網補數字；發現筆記不足時回報主控，由主控決定補查）。
- 每批 3–4 頁、每個 agent 一批，降低術語與薪資漂移；批內頁面主題相鄰。
- 建議批次：
  - W1：README、00-map、appendix-salary（權威薪資表先定稿，後續批次引用它）
  - W2：01–05（設計類）
  - W3：06–09 ＋ 新頁「良率工程師」「元件工程師」（製程類）
  - W4：10–14 ＋ 新頁「量測工程師」（設備/品質類）
  - W5：15–19、16 的 TE/PE 拆分（封測/支援類）
  - W6：20、21、appendix-entry、appendix-trends（趨勢頁全面改寫）
  - W7：新頁「記憶體產業」「海外外派」、glossary、references、appendix-resources
- 每個寫作 agent 的任務指令必須包含：模板全文、對應研究筆記路徑、mermaid 規則、「只改指派檔案、repo 內有其他改動不可 revert」、薪資一律抄自 appendix-salary 定稿。

### 審稿 agent（Phase 3）

檢查清單：
1. 每頁小節齊全（對照模板）；「面試常考方向」全數到位。
2. 薪資三處（00-map / 各頁 / appendix-salary）數字一致；每表有查證日期。
3. 所有 2024–2025 過期措辭已清除或明確標註為歷史脈絡。
4. mermaid 規則（特殊字元加引號、`<br/>` 換行）；內部連結有效；跨書 cowos 連結未被誤刪。
5. 新頁已進 nav、00-map、20-collaboration、appendix-salary。
6. references.md 涵蓋所有正文引用的事實。

審稿回報問題清單，由主控 agent 逐項修正或退回原批次 agent。

### 收尾（主控）

1. `./sync-assets.sh` → `uv run mkdocs build -f configs/semi-jobs.yml`，修所有 error 與新增 warning。
2. 確認 `index.html` 卡片描述是否需隨書名/內容微調。
3. 更新本計畫的追蹤表狀態。

---

## 五、階段總覽與驗收

| Phase | 內容 | 平行度 | 前置 |
|---|---|---|---|
| 0 | 主控建立 `plan/semi-jobs/research/` 目錄與追蹤表狀態欄 | — | — |
| 1 | R1–R4 網路研究 | 4 平行 | Phase 0 |
| 2 | W1 先行（薪資權威表定稿）→ W2–W7 分批 | W2–W5 可平行；W6–W7 依賴 W1/研究 | Phase 1 |
| 3 | 審稿 agent 全書檢查 → 主控修正 | 1 | Phase 2 |
| 4 | build 驗證與收尾 | — | Phase 3 |
| 5（選配） | `/mkdocs-add-images` 為重點頁配圖（07 EUV、15/21 CoWoS、14 FIB/SEM、06 無塵室） | — | Phase 4 |

### 驗收標準

- [ ] 26 舊頁全數符合模板且數字更新或標註待查
- [ ] 新增 ≥5 頁（良率、記憶體、元件、量測、海外）＋ glossary ＋ references
- [ ] appendix-trends 以 2026 視角全面改寫，舊預測逐項對答案
- [ ] 全書薪資單一權威來源、雙來源查證、標註日期
- [ ] README 的承諾（面試常考方向）與內容一致
- [ ] mkdocs build 無 error、無新增 warning
