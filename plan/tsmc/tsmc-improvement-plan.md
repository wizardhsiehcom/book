# 《台積電全方位指南》全書補強計畫

本計畫是對 `docs/tsmc/`（14 頁，約 1,100 行）的完整審查結果與補強執行方案。審查日期：2026-07-06。全書資料基準點大多停在 2023 年報＋2024 年估計，距今約一年半；台積電是變動最快的題材（財務、產能、地緣政治每季都在變），時效性問題比一般書更嚴重。另發現數處**疑似事實錯誤**需研究階段查證。本計畫採多 agent 執行。

---

## 一、審查結論（依嚴重度排序）

### P0 — 必須修正

1. **財務與關鍵數字全面過期**。
   - `01-overview.md`「關鍵數字（**2023 年**）」：營收 693 億美元、員工約 73,000 人、先進製程佔 55%——2025 全年財報早已發布，全部需更新到 2025 實績＋2026 上半年動態。
   - `10-financials.md` 營收趨勢止於「2024 ~900億美元（估計）」；關鍵指標表仍是 2023 年（毛利率 54%、資本支出 322 億美元）。2025 實績（AI 需求下營收與毛利率均顯著高於 2023）完全缺席。
   - `08-customers.md` 終端市場佔比標「2023」：HPC 43%、手機 33%——AI 爆發後佔比結構已大幅改變，這張表是全書誤導性最高的資料之一。
2. **「未來式」已成過去式**。多頁以 2025 年為未來在寫：
   - `01-overview.md`「目前量產 3nm，2nm 預計 2025 年量產」；`02-history.md` 時間軸終點「2025 2nm 預計量產」；`04-nodes.md`「N2 預計 2025 年量產」——N2 量產與否、爬坡狀況、首發客戶，現在是可查證的事實，必須改寫。
   - `05-advanced-packaging.md` 以「NVIDIA H100、H200、B100」為當前主力產品——產品世代已翻篇（Blackwell 世代之後），CoWoS 產能數字亦缺。
   - `07-fabs.md`「Fab 20 2025 年起量產」「ESMC 預計 2029 年投產」等狀態描述需逐廠對現況；**美國投資額寫「超過 650 億美元」——台積電 2025 年 3 月已宣布加碼至 1,650 億美元**，這是全書最明確的過期數字。
   - `11-geopolitics.md` 停在 2022 晶片法案視角；2025–2026 的關稅政策、對台晶片政策、出口管制演變、加碼美國投資的政治脈絡全部缺席。地緣政治頁是全書最需要以「今天視角」重寫的一頁。
3. **疑似事實錯誤（不可沿用，研究階段強制查證）**：
   - `02-history.md`「2010：Apple A4 晶片委由台積電代工」——**疑誤**。公開資訊普遍記載 A4–A7 由三星代工，台積電首顆 Apple SoC 為 A8（2014，20nm）。此錯誤同時影響時間軸圖與「2010：Apple 時代的開始」小節。
   - `04-nodes.md`「7nm（2018）——首個 EUV」——**疑誤**。N7（2018）為 DUV 多重曝光，EUV 自 N7+（2019）導入。
   - `09-supply-chain.md`「PCB / 基板：**南亞科**、台光電子」——**疑誤**。南亞科（Nanya Technology）是 DRAM 廠；載板應為欣興、南電（南亞電路板）、景碩等。台光電子是 CCL 材料商，歸類也待斟酌。
   - `09-supply-chain.md` 將東京威力科創（TEL）僅標「蝕刻設備」——TEL 在微影 Track（塗佈顯影）近乎獨佔，分類過窄。
   - `12-career.md`「校園招募計畫（**TSIA** 等）」——TSIA 是台灣半導體產業協會名稱，台積電校園計畫名稱疑誤植，待查。
4. **人事與治理資訊過期**：`02-history.md`／`03-organization.md` 記魏哲家為 CEO、劉德音 2024 卸任——2024 年中起魏哲家已身兼董事長暨 CEO，組織圖與人物表需更新（含現任高層與研發主管線）。

### P1 — 覆蓋缺口與可信度

5. **競爭格局無專頁**。Samsung Foundry 與 Intel Foundry 只在 `01-overview.md` 的圖裡各出現一個節點。讀者（尤其求職者與產業觀察者）必然想知道：Intel 18A vs N2、Samsung SF2 良率、Rapidus 2nm、中芯的成熟製程擴張。這是全書最大的內容缺口。
6. **ESG／能源／營運風險缺席**。台積電是台灣最大用電戶，綠電採購、RE100 承諾、水資源（2021 大旱的教訓）、地震韌性（2024 年 4 月花蓮地震的快速復原）都是理解台積電的重要面向，全書隻字未提。
7. **資料無「時點標註」且跨頁/跨書漂移**：
   - 員工數：`01-overview.md` 寫約 73,000（2023）；本 repo `semi-jobs` 書寫 83,825——兩書矛盾，需統一查證。
   - EUV 機台價格：本書 `09` 寫「超過 1 億美元」；`semi-jobs` 書寫 High-NA「超過 4 億美元」——應區分 Low-NA/High-NA 並統一口徑。
   - 全書沒有任何資料表標註資料時點與來源，README 雖列了來源類型但無法對應到具體數字。
   - **指定 `10-financials.md` 為財務數字唯一權威頁**、`07-fabs.md` 為廠區狀態權威頁，其他頁（01、08、README）引用不自建數字。
8. **無 glossary、無 references 頁**。縮寫密度高（BSPDN、RDL、GAA、ADR、CoWoS 各型），且依 repo 慣例（cs224r、semi-jobs 計畫）應有引用來源總表。
9. **跨書連結完全缺席**。repo 內已有高度相關的 `cowos`（CoWoS 技術專書）與 `semi-jobs`（職務指南）兩本書：`05-advanced-packaging.md` 應連 cowos 書、`12-career.md` 應連 semi-jobs 書（semi-jobs 對職務、薪資、面試的覆蓋遠深於本書 12 頁），目前零互連。

### P2 — 結構與技術品質

10. **Mermaid 規則違規**：`11-geopolitics.md` 第二張圖的邊標籤使用 `\n`（`"晶片法案（CHIPS Act）\n補貼 + 限制"`）——CLAUDE.md 明定換行只能用 `<br/>`。全書需掃一次。
11. **假視覺化**：`10-financials.md`「營收趨勢」用 mermaid flowchart 一串方框冒充折線圖，與 semi-jobs 書同樣的問題；改為表格或 inline HTML 長條。
12. **結構一致性整體良好**（每頁都有導言、小節、延伸閱讀），是六個維度中表現最好的一項；但資料頁缺統一的「資料時點」表尾，模板需補此欄。
13. **全書零圖片**。適合 `/mkdocs-add-images`：晶圓廠外觀、無塵室、張忠謀、EUV 機台、CoWoS 剖面（Wikimedia Commons 皆有）。列為選配。
14. `12-career.md` 用 PTT「Semiconductor 版」、semi-jobs 書用「Tech_Job 版」——小事，但兩書建議口徑可統一。

---

## 二、逐頁問題追蹤表

| 頁面 | 問題 | 行動 |
|---|---|---|
| README.md | 定位與來源說明尚可；缺「本書資料時點」總說明；未提示姊妹書（cowos、semi-jobs） | 補資料時點聲明與跨書導引 |
| 01-overview.md | 關鍵數字全為 2023；「2nm 預計 2025 量產」已過期；數字與 10 重複自建 | 數字改引用 10 權威表；敘述更新到 2026 現況 |
| 02-history.md | 時間軸終點停在 2025 未來式；**Apple A4 疑誤**；人物表（魏哲家職銜、現任高層）過期；2023–2026 大事（加碼美國、N2 量產）缺 | 查證 Apple 代工起點後改寫；時間軸延伸至 2026 |
| 03-organization.md | 魏哲家職銜過期；組織圖過於簡略（研發組織、平台組織未展開）；股權結構數字無時點 | 更新職銜與高層；股權數字重查標時點 |
| 04-nodes.md | 「7nm 首個 EUV」**疑誤**；N2 未來式；3nm 密度「2億/mm²」無來源；缺 N2 家族（N2P/N2X）與 A16 銜接說明 | 史實查證；補 N2 量產實況與家族 |
| 05-advanced-packaging.md | 產品世代停在 H100/B100；CoWoS 尺寸「約 2,500mm²」與產能數字過期；缺 SoW（System-on-Wafer）、面板級封裝、玻璃基板動態；未連 cowos 專書 | 重點更新頁；補跨書連結 |
| 06-roadmap.md | A16「2026」時程需對現況；缺 A14 正式規格（2025 年技術論壇已公布）；先進封裝路線缺 SoW-X | 依 2025–2026 技術論壇資訊改寫 |
| 07-fabs.md | 全書最詳盡頁，但**美國投資額 650 億已被 1,650 億取代**；各廠 Phase 狀態、JASM 2 進度、ESMC 時程需逐項對現況；「成本高 4–5 倍」「貴 50%」等說法需來源 | 重點更新頁；指定為廠區狀態權威頁 |
| 08-customers.md | 佔比表停在 2023（AI 後結構劇變）；Intel「Arrow Lake」例過期；缺 2025–2026 新客戶動態（雲端自研 ASIC 名單擴大等） | 全表更新；客戶名單對現況 |
| 09-supply-chain.md | 「南亞科＝PCB/基板」**疑誤**；TEL 分類過窄；EUV 價格需區分 Low-NA/High-NA；缺 2025 供應鏈在地化（先進封裝材料、國產設備）動態 | 錯誤查證修正；補充更新 |
| 10-financials.md | 指標停在 2023、趨勢止於 2024 估計；缺股利政策；mermaid 假折線圖 | **權威數字頁，最優先定稿**；補 2025 實績與 2026 指引 |
| 11-geopolitics.md | 停在 2022 晶片法案視角；缺 2025–2026 關稅、出口管制、加碼美國的政治脈絡、矽盾論述新進展；mermaid `\n` 違規 | 以 2026 視角全面改寫 |
| 12-career.md | 薪資無來源無時點；「TSIA」疑誤植；內容深度遠不如 semi-jobs 書卻未互連 | 查證更新；大幅引用 semi-jobs 書取代重複內容 |
| 13-resources.md | 資源清單品質佳；缺 2025–2026 新資源；外部連結需體檢；未提姊妹書 | 連結體檢＋小幅補充 |

---

## 三、新增頁面清單

| 新頁 | 內容 | 優先度 | 漣漪更新 |
|---|---|---|---|
| 競爭格局（14-competition）| Intel 18A/14A、Samsung SF2、Rapidus、中芯；先進製程市佔演變；台積電的護城河分析 | P0 | nav「三、產業版圖」；01 概覽互連 |
| ESG 與營運風險（15-esg-risk）| 用電與綠電、水資源、地震韌性、資安；風險如何影響擴廠決策 | P1 | nav「四、財務與策略」；07、11 互連 |
| glossary.md | 全書縮寫與術語（GAA、BSPDN、CoWoS 各型、ADR⋯） | P2 | nav 附錄 |
| references.md | 研究引用來源總表（URL＋發布日期＋查證日期） | P0（隨研究產出） | nav 附錄；README 來源說明改指向此頁 |

---

## 四、網路搜索規範（研究 agent 必讀）

台積電題材更新極快，**所有數字、狀態、時程都必須重新查證，不可沿用書中舊值、不可憑模型記憶補寫**。疑似事實錯誤（Apple A4、7nm EUV、南亞科）必須找到明確一手/二手來源後才能定稿。

### 工具與流程

1. 先用 `WebSearch`（中英文各一輪、加年份限定詞 `2025`/`2026`），再用 `WebFetch` 抓內文確認原始數字與日期。
2. 每條採用的事實記錄：來源 URL、發布日期、查證日期（2026-07）、原文關鍵句，寫入 `plan/tsmc/research/` 下各自筆記，最終彙整進 `references.md`。
3. 財務數字一律以台積電 IR 官方資料為準（法說會簡報、年報、月營收公告），媒體數字只作輔助。

### 來源分級（高→低）

| 級別 | 來源 | 用途 |
|---|---|---|
| A 官方 | 台積電年報／法說會（investor.tsmc.com）、月營收公告、官方新聞稿、技術論壇資料、CHIPS 法案官方文件 | 財務、產能、廠區、路線圖 |
| B 產業研究 | TrendForce、Counterpoint、SemiAnalysis、IC Insights、Yole | 市佔、CoWoS 產能、競爭比較 |
| C 財經媒體 | DIGITIMES、經濟日報、工商時報、Bloomberg、Reuters、Nikkei Asia | 擴廠與政策新聞、交叉驗證 |
| D 社群 | PTT、Dcard、比薪水、Glassdoor | **僅限薪資區間交叉參考** |

### 敏感數字規則

- 財務指標、員工數、產能、投資額、薪資：至少**兩個獨立來源**（官方＋一個 B/C 級交叉）。
- 史實查核（Apple 代工起點、EUV 導入節點）：至少兩個獨立可信來源一致才可改寫；不一致時保留爭議並註記。
- 查不到就標 `（待查：2026 年X資料）` 回報主控，不可為表格完整而編造。
- 每張資料表表尾標註「資料時點：YYYY-MM ／ 查證日期：2026-07」。

### 各主題查詢範例

| 主題 | 查詢範例 |
|---|---|
| 財務 | 「TSMC 2025 annual revenue full year results」「台積電 2026 Q1 法說會 毛利率 資本支出」「TSMC dividend 2026」 |
| 製程 | 「TSMC N2 mass production ramp 2026 customers」「TSMC A16 A14 timeline symposium 2026」「TSMC N7 EUV N7+ first EUV node」（史實查核） |
| 封裝 | 「TSMC CoWoS capacity 2026 TrendForce」「TSMC SoW-X system on wafer」「CoWoS-L Rubin」 |
| 廠區 | 「TSMC Arizona 165 billion 2025 announcement」「Fab 21 phase 2 status 2026」「JASM Kumamoto second fab delay」「ESMC Dresden production date」「台積電 嘉義 AP7 進度」 |
| 地緣政治 | 「semiconductor tariff Taiwan TSMC 2026」「US export controls China chips 2025 2026」「台積電 美國 關稅 回應」 |
| 客戶市佔 | 「TSMC revenue by platform HPC smartphone 2025」「TSMC top customers 2025 Apple percentage」「foundry market share 2026 TrendForce」 |
| 競爭 | 「Intel 18A vs TSMC N2 comparison 2026」「Samsung SF2 yield 2026」「Rapidus 2nm pilot 2026」 |
| 史實 | 「Apple A8 TSMC first Apple chip 20nm」「Apple A4 Samsung manufactured」 |
| 供應鏈 | 「TSMC advanced packaging substrate suppliers」「ABF substrate 欣興 南電 景碩」「High-NA EUV price」 |
| ESG/風險 | 「台積電 用電量 綠電 RE100 2026」「TSMC earthquake April 2024 recovery」「台積電 2021 缺水 應對」 |
| 職涯 | 「台積電 新鮮人 年薪 2026」「台積電 校園徵才 計畫名稱」 |

---

## 五、統一頁面模板

本書頁面骨架已相當一致，不需砍掉重練；收斂規則如下：

```
# 頁名
（一段導言：這頁回答什麼問題）
## 主題小節 ×N（適合處配 mermaid；圖表遵守 CLAUDE.md 規則）
（凡資料表：表尾必附「資料時點：YYYY-MM ／ 查證日期：2026-07」；
 共用數字一律引用權威頁：財務 → 10-financials、廠區狀態 → 07-fabs）
→ 延伸閱讀：本書互連＋姊妹書（cowos / semi-jobs）互連
```

寫作守則：繁體中文；一頁一概念；mermaid@10 規則（特殊字元標籤加引號、換行只用 `<br/>`、禁 `\n`）；趨勢性敘述必須寫明「截至 2026-07」的視角，不寫沒有時間錨點的「目前」「預計」。

---

## 六、多 Agent 執行制度

主控 agent（本會話）管控進度，派研究、寫作、審稿三類 subagent；主控負責一致性，不下放品質責任。

### 角色分工

| 角色 | 型別 | 責任 | 可寫入範圍 |
|---|---|---|---|
| 主控 agent | （本會話） | 維護本計畫、派工、整合審稿、數字一致性、nav 更新、最終 build | `plan/tsmc/`、`docs/tsmc/`、`configs/tsmc.yml` |
| 研究 agent ×4 | general-purpose | 依第四節規範搜索，產出附來源研究筆記 | 僅 `plan/tsmc/research/` 各自檔案 |
| 寫作 agent | general-purpose | 依模板與研究筆記更新/新寫指定頁 | 僅被指派的 `docs/tsmc/*.md` |
| 審稿 agent | Explore（唯讀） | 一致性與規範檢查，只回報不改稿 | 無 |

### 研究 agent 分工（Phase 1，四個平行）

| Agent | 主題 | 產出 |
|---|---|---|
| R1 財務與公司 | 2025 全年＋2026 上半年財務、員工數、股權、股利、資本支出指引、市值定位 | `research/r1-financials.md` |
| R2 技術與史實 | N2 量產現況與家族、A16/A14、CoWoS 世代與產能、SoW、**三項史實查核**（Apple 代工起點、N7 EUV、High-NA 價格） | `research/r2-technology.md` |
| R3 廠區與地緣政治 | 各廠 Phase 現況、美國 1,650 億投資、JASM/ESMC 進度、2025–2026 關稅與出口管制、矽盾論述 | `research/r3-fabs-geopolitics.md` |
| R4 市場與競爭 | 2025 終端市場佔比、客戶動態、競爭格局（Intel/Samsung/Rapidus/中芯）、供應鏈修正（載板供應商查證）、ESG 數據、薪資與校園計畫查證 | `research/r4-market-competition.md` |

每個研究 agent 的任務指令必須包含：第四節規範要點、輸出檔路徑、「查不到標待查、不可編造」、每條事實附 URL 與日期。

### 寫作 agent 派工原則

- 研究全部完成後才開始；寫作 agent 不自行上網，數字只取自研究筆記與權威頁；筆記不足時回報主控補查。
- 每批 2–3 頁、主題相鄰；**W1 先定稿權威數字頁**，後續批次引用。
- 建議批次：
  - W1：10-financials（權威財務表定稿）、01-overview、README
  - W2：02-history（含史實修正）、03-organization、04-nodes（含 EUV 史實修正）
  - W3：05-advanced-packaging、06-roadmap、新頁 14-competition
  - W4：07-fabs、11-geopolitics、新頁 15-esg-risk
  - W5：08-customers、09-supply-chain（含載板修正）
  - W6：12-career（引用 semi-jobs 書）、13-resources、glossary、references
- 每個寫作 agent 的任務指令必須包含：模板、對應研究筆記路徑、mermaid 規則、「只改指派檔案、不可 revert 他人改動」、資料表時點標註義務。

### 審稿 agent（Phase 3）檢查清單

1. 三項疑似事實錯誤（Apple A4、7nm EUV、南亞科載板）已依研究筆記修正且有來源。
2. 全書無殘留「預計 2025」類未來式過期措辭；每張資料表有時點標註。
3. 財務數字全書一致且來自 10-financials；廠區狀態與 07-fabs 一致；美國投資額全書統一為最新值。
4. mermaid 無 `\n`、特殊字元標籤有引號；10 的假折線圖已改；內部連結與跨書連結（cowos、semi-jobs）有效。
5. 新頁已進 nav；references 涵蓋正文所有引用事實。
6. 與 semi-jobs 書的共用數字（員工數、EUV 價格）口徑一致（如 semi-jobs 未更新，在 references 註記差異即可，不改他書）。

### 收尾（主控）

1. `./sync-assets.sh` → `uv run mkdocs build -f configs/tsmc.yml`，修所有 error 與新增 warning。
2. 確認 `index.html` 的 tsmc 卡片描述是否需微調。
3. 更新本計畫追蹤表狀態。

---

## 七、階段總覽與驗收

| Phase | 內容 | 平行度 | 前置 |
|---|---|---|---|
| 0 | 主控建立 `plan/tsmc/research/`、追蹤表狀態欄 | — | — |
| 1 | R1–R4 網路研究（含三項史實查核） | 4 平行 | 0 |
| 2 | W1 先行（財務權威頁定稿）→ W2–W6 分批 | W2–W5 可平行；W6 依賴 W1 | 1 |
| 3 | 審稿 agent 全書檢查 → 主控修正 | 1 | 2 |
| 4 | build 驗證與收尾 | — | 3 |
| 5（選配） | `/mkdocs-add-images` 配圖（01 廠區、02 張忠謀、05 CoWoS、07 Fab 21） | — | 4 |

### 驗收標準

- [ ] 14 舊頁全數更新：無 2023 停格數字、無「預計 2025」未來式、資料表皆有時點標註
- [ ] 三項疑似事實錯誤查證並修正（或註記爭議）
- [ ] 新增 14-competition、15-esg-risk、glossary、references 四頁並進 nav
- [ ] 財務／廠區數字單一權威來源；敏感數字雙來源查證
- [ ] 與 cowos、semi-jobs 書建立跨書互連
- [ ] mkdocs build 無 error、無新增 warning
