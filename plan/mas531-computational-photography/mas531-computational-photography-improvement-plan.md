# MAS.531 計算相機與攝影 — 改善計畫

> 審查日期：2026-07-11　審查者：主控 session（Claude Code）
> 對象：`docs/mas531-computational-photography/`（config：`configs/mas531-computational-photography.yml`）
> 課程本體：MIT MAS.531 *Computational Camera and Photography*，**Fall 2009**（Ramesh Raskar）。
> 本書性質為「單一歷史課程的逐字稿知識書」，時效性審查的重點與一般產業書不同（見第 1 節說明）。
>
> **更新 2026-07-12：Phase 0 已完成、Phase 1（R1–R5 研究）已全部回收。寫作前必讀第 0 節「Phase 1 研究結論」，其中的裁決優先於第 1–3 節原始敘述。**

---

## 0. Phase 1 研究結論（2026-07-12，寫作 agent 必讀，裁決優先）

五份研究筆記在 `plan/mas531-computational-photography/research/`（R1–R5）。以下為已裁決事項，寫作時直接照辦：

### 覆蓋缺口（原 P1-7）→ 不補新章，只加註解
- **Lecture 7（IR imaging + Tomography，兩場客座）於 OCW 零材料**——這正是章號 6→8 跳號的根源。**不補章**（無一手可依，補章必臆造）。在 `00-preface.md` 加一句：Lec7 於 OCW 未釋出材料，其主題（紅外成像／斷層掃描）已於第 8、9 章外緣涵蓋，故不立專章。
- **Transient Imaging／飛秒／看穿轉角非正式講次**，僅為 Lec1 的研究願景預告（Raskar 團隊 femto-photography 論文多在 2011 後）。**不補章**；ch1 該段加標「此為研究願景、非正式講次、OCW 無對應講義」。
- 官方 syllabus 列到 Lec12，但 Lec12 為期末專題發表、無授課內容。附錄=Lec10、第10章=Lec11 對應正確。

### 數值修正（原 P1-8 及 R2 發現）
- **水中雷射波長：改 420nm → 473nm 並加註**。R3 用 Whisper 轉錄 lec08 音檔證實 Raskar 原話確實說 630nm 以「2/3 係數」得 420 並稱「in water, 420 is red」，但 2/3 對應的是玻璃 n≈1.5；水 n≈1.33 正解為 630/1.33≈**473nm**。書稿忠實轉述了講者的口誤。處置：正文用 473nm，加註「原講以 2/3 係數推得 420nm，對應玻璃 n≈1.5；水 n≈1.33 正確值約 473nm」。待改：`08-...md` 第 12 行。
- **Vein Viewer 780nm → 改區間表述**。找不到兩個權威來源確認正是 780nm，文獻分歧（740/760/850 皆有）。改為「約 740–850nm 近紅外」或註明「依課堂講述」，勿留裸 780nm。（待改：`09-...md`）
- **光場相機數字分層**：292×292 作為「空間解析度(st 軸)」正確、可續用；但**微透鏡陣列實體為 296×296 個**（每個 125μm），寫作時**不可把微透鏡陣列說成 292×292 個**。1600萬畫素／14×14／125μm 全部相符。

### 規格已確認相符（可放心引用，來源見 R2/R5）
- 外差光場 9×9（81 視角）＝Dappled Photography (Veeraraghavan, SIGGRAPH 2007)✓
- 單張多域相機＝Horstmeyer/Euliss/Athale/Levoy, ICCP 2009：Nikon 50mm f/1.8、≈10.7MP 9μm CCD、50μm 針孔(半徑25μm)/200μm pitch、16 濾波片 ✓
- FTIR＝Jeff Han, UIST **2005** ✓；Fluttered Shutter＝Raskar SIGGRAPH **2006** ✓；Coded Aperture＝Levin SIGGRAPH **2007** ✓

### 後續發展素材（原 P2-10，供小註，見 R4）
Lytro（2006 創立／2012 首款消費機／2018 停業併入 Google）、GelSight（第7章 Retrographic 後續，已商品化：工業量測＋機器人觸覺 DIGIT/Digit 360）、手機運算攝影 2016–2020 全面標配（人像/夜景/ToF LiDAR）、Wavefront Coding→OmniVision。**BiDi Screen→屏下感測**因果證據弱，小註須用「概念上呼應」而非「直接催生」。

### 參考資料（Phase 2 直接採用 R5）
`R5-references.md` 已備妥依章分組、格式統一（作者. 標題. 場合, 年. URL）的來源清單，含 OCW 課程頁/syllabus/影片鏡像與逐講對照表、各章核心論文、客座講者更正（Smithwick／Stenner／Lanman／Athale）。Phase 2 據此定稿 `references.md`。R2/R5 合計約 12 項 `待查` 於各自檔尾，非阻斷級。

---

## 1. 審查結論（依嚴重度排序）

### 關於「時效性」的定位說明（先讀）

本書是 **2009 年一門課** 的整理，內容忠於 2009 年的講次是「正確」的，不能把 2009 年的敘述當成「過期資料」去改寫成 2025 年現況。真正的時效性問題只有一種：**書中以「未來式／現在式」陳述當年的預測，卻沒有標記時間錨點或後續發展**（例如「Lytro 前身」「未來的相機將…」）。這類地方的正解是**加註「後續發展（截至今日）」**，而不是竄改原敘述。詳見 P2-10。

### P0（阻斷級：書無法被讀者正常抵達或明顯未完工）

- **P0-1　本書未登錄到首頁啟動器**。`js/books-data.js` 完全沒有 mas531 條目（`grep` 結果為空），代表 `index.html` 卡片牆看不到這本書，讀者沒有入口。這是 `CLAUDE.md`〈Adding a new book〉第 4 步被漏做。
- **P0-2　前言與參考資料是空殼**。`00-preface.md` 內文只有「待補」、`references.md` 只有「待補」、`README.md` 寫「狀態：施工中」。nav 對外承諾了「前言」「參考資料」兩個頁面，實際交付空白。對一本知識書而言，**參考資料全空 = 全書零引用來源**（見 P1-6）。
- **P0-3　16 個內部工作檔（`notes/`）被打包進網站但不在 nav**。build log 明列 16 個 `notes/lecture-*.md` 為 orphan pages。這些檔是 agent 的「章節模板」草稿，內含 `閱讀者：Antigravity`、`自動字幕錯拼修正清單`、`待查`、`狀態：已完整讀完` 等**製作過程metadata**，不該出現在讀者可及的網站中，卻可經 URL 直接開啟。

### P1（嚴重：影響可信度、一致性、可用性）

- **P1-4　頁面骨架不一致（兩種風格並存）**。
  - 「論述＋常見誤解」風格：ch1、ch2、ch3、ch4、ch5、ch6、ch10、appendix（有 `導讀 / 核心內容 / 原理與證據 / 常見誤解 / 小結`）。
  - 「編號小節」風格：ch7（7.1–7.5）、ch8（8.1–8.8）、ch9（9.1–9.9）——**沒有「常見誤解」也沒有統一的「原理與證據」段**。
  - 其他不一致：`03-epsilon-photography-part2.md` **缺開頭的「對應講次／影片主題／對應講義」metadata 區塊**（其餘 13 章都有）；ch9 標題用「導言」，其餘用「導讀」。
- **P1-5　全書零圖表、零圖片**。`grep` 確認 14 章沒有任何 ```mermaid``` 區塊，也沒有任何 `![]` 圖片。而 `notes/` 幾乎每篇都列出「需要新增的圖表」（光路圖、頻域解碼圖、Shift-and-Add、對偶光傳輸矩陣、彩虹平面、CT 投影切片…）。純文字描述光學系統對讀者極不友善。
- **P1-6　所有數字與人名皆無出處**。references.md 為空，全書沒有一條引用。散落的可查證數字包括：史丹佛光場相機 1600 萬畫素→292×292、14×14 角度、125μm micro-lens pitch；mask-based 9×9（81）視角；Nikon 50mm f/1.8、200μm pinhole pitch／25μm 半徑；Vein Viewer 780nm；水中雷射 630nm→420nm；FTIR（Jeff Han, 2005）。需指定 references.md 為「權威來源頁」並回填。
- **P1-7　覆蓋缺口：Lecture 7 整段缺席，且 Transient Imaging 只在 ch1 預告未成章**。
  - nav 章號跳躍：ch6=Lec6、ch7=Lec5/6 的 recent research、ch8=Lec8、ch10=Lec11、附錄=Lec10。**Lecture 7 完全沒有筆記檔、沒有章節、沒有任何說明**（`notes/` 無 lecture-07）。需查 MIT OCW 確認 Lec7 主題並決定補章或明講「本書未涵蓋」。
  - ch1 大篇幅預告的 **看穿轉角／飛秒雷射（Transient Imaging, Time-of-Flight）** 之後從未有專章，形成「導讀開的支票沒兌現」。
- **P1-8　疑似數值錯誤：水中雷射 630nm →「420nm」**。水的折射率約 1.33，630/1.33 ≈ 473nm，不是 420nm（420 需要 n≈1.5）。此數字同時出現在 `08-...md` 與 `notes/lecture-08a`。**不可憑記憶改**，列入研究階段以逐字稿原文＋光學常識雙重查核（見第 4 節）。

### P2（改善：體驗與完善度）

- **P2-9　頁面之間零交叉連結**。違反 `CLAUDE.md`「cross-link with relative paths」慣例。例如 ch5/ch6（光場）↔ ch7（BiDi、防手震）↔ ch9（光場=受限 CT）↔ ch10（編碼光圈）彼此高度相關卻互不連結；術語表也沒被任何章節連回。
- **P2-10　2009 預測缺時間錨點與後續發展**。「Lytro 前身」「未來相機將…」「個人成像助理 PIA」等，應加「後續發展（截至今日）」小註（例：Lytro 2012 上市、2018 停業；ToF／多鏡頭與運算攝影已成手機標配；GelSight 已商品化，即 ch7 的 Retrographic Sensing）。屬補強不屬糾錯。
- **P2-11　glossary 與 references 待整合**。術語表內容其實紮實，但（a）未被章節以連結指向、（b）少數章節出現的詞（Transient Imaging、GRIN Lens、Scheimpflug、Wavefront coding、FTIR、Metamer 已收、Foveon 已收）覆蓋不齊；references 建好後 glossary 詞條可各自標來源。

---

## 2. 逐頁問題追蹤表

| 頁面 | 問題 | 行動 |
|---|---|---|
| `README.md` | 「狀態：施工中」；無全書地圖、無章節導覽 | 改寫為正式首頁：一句話定位＋課程背景（MIT MAS.531 F09, Raskar）＋章節地圖（連結各章）＋閱讀建議。移除「施工中」。 |
| `00-preface.md` | 只有「待補」 | 補齊前言：本書由誰／為何整理、資料來源（OCW 逐字稿＋講義 PDF）、體例說明、與原課程的對應與取捨（含明講未涵蓋 Lec7 與否）。 |
| `01-introduction.md` | 骨架 OK；預告 Transient Imaging 但全書無專章；無圖 | 保留；末段加「本書涵蓋範圍」導覽並連結各章；決定 Transient Imaging 補章或降級為「延伸閱讀」；加 1–2 張 Mermaid（計算攝影 co-design 概念圖、章節地圖）。 |
| `02-modern-optics-ray-matrix.md` | 標題含 ray-matrix 但內文自承逐字稿無光學矩陣，靠註解帶過；無圖 | 依講義 PDF 補「Ray-transfer matrix / thin lens」最小段落，或調整標題與導讀使名實相符；加多閃光陰影成因圖、逆反射三光路圖。 |
| `03-epsilon-photography.md` | 骨架 OK；末尾「後半將補充」與 part2 重疊；無圖 | 與 part2 界線講清楚；加 Epsilon 三維度分類圖、Shift-and-Add 圖。 |
| `03-epsilon-photography-part2.md` | **缺開頭 metadata 區塊**；標題格式與他章不同（`03 - …`）；無圖 | 補「對應講次／影片主題／對應講義」區塊；標題統一為「第 3 章（下）：…」；加 pupil-plane filter＋pinhole array 光路圖。 |
| `04-computational-illumination.md` | 骨架 OK；對偶攝影光傳輸矩陣 $T/T^T$ 只有文字；無圖 | 加對偶攝影矩陣轉置示意、Direct/Global 棋盤格分離示意（Mermaid 或圖片）。 |
| `05-lightfields-1.md` | 骨架 OK；$x$-$\theta$／EPI、微透鏡皆純文字；無圖 | 加 EPI（水平/垂直/斜線）示意、微透鏡陣列光路圖、Shack-Hartmann 波前偏移圖。 |
| `06-lightfields-2.md` | 骨架 OK；秤重比喻、頻域調變純文字；無圖 | 加「針孔/透鏡/遮罩」三方案對照表＋Hadamard 秤重比喻圖＋頻域搬移示意。 |
| `07-sensing-and-interaction.md` | **編號小節風格**、無「常見誤解」；混合 Lec5/6 三個主題；無圖 | 對齊統一模板（見第 5 節）；補「常見誤解」；加 FTIR 光路、Retrographic/光度立體三色光源、BiDi 分時多工圖；與 ch5/6/9 交叉連結。 |
| `08-wavelengths-color-hyperspectral.md` | **編號小節風格**；**P1-8 420nm 疑誤**；資料立方體、CTIS 純文字；無圖 | 對齊模板；420nm 待研究查核後修正；加 Bayer vs Foveon 圖、CIE 色域三角、彩虹平面遮罩、CTIS 繞射級次投影圖。 |
| `09-computational-imaging-survey.md` | **編號小節風格**、標題用「導言」；傅立葉切片、濾波反投影純文字；無圖 | 對齊模板、改「導讀」；加 Radon／傅立葉切片定理示意、共軛焦針孔 $1/r^4$ 示意、編碼孔徑 MURA 示意。 |
| `10-coded-imaging.md` | 骨架 OK；Box filter→Sinc 零點、RAT code 純文字；無圖 | 加 Box vs Coded PSF 頻譜對照、Fluttered Shutter 序列圖、Coded Aperture 7×7 示意。 |
| `appendix-lec10.md` | 骨架尚可；純筆記轉寫、無圖 | 加眼睛演化階梯圖（eye spot→pinhole→lens→compound）、GRIN lens 折射示意。 |
| `glossary.md` | 內容紮實但未被章節連回；詞條無來源 | 章節首見詞加連結指回術語表；references 建好後各詞標來源；補 Transient Imaging、GRIN Lens、Scheimpflug、FTIR、Wavefront Coding、Shield Fields 等。 |
| `references.md` | 只有「待補」＝全書零引用 | 建為**權威來源頁**：課程 OCW、Raskar/Levoy/Adelson 等關鍵論文、各章數字出處，統一格式（見第 4、5 節）。 |
| `notes/*.md`（16 檔） | orphan pages，含 agent 製作 metadata，被公開卻不在 nav | **移出 `docs/`**（搬到 `plan/mas531-computational-photography/research/transcripts/` 或 repo 內 `data/`），或加 build 排除。不對讀者公開。 |

---

## 3. 新增頁面清單（含連帶更新）

| 優先 | 新頁 | 內容 | 連帶更新 |
|---|---|---|---|
| P1 | `references.md`（改寫非新增） | 全書引用與數字出處 | glossary 詞條標源；各章數字對回本頁 |
| P1 | 決策：`11-transient-imaging.md`（或併入 ch1 延伸段） | 飛秒雷射／ToF／看穿轉角，兌現 ch1 預告 | nav 增章、ch1 導覽連結、glossary 增詞、README 章節地圖 |
| P1 | 決策：`XX-lecture-07.md` 或前言明講不涵蓋 | 先由研究階段確認 Lec7 主題再定 | 若補章：nav、README、glossary；若不補：前言與 ch6/ch8 銜接處加一句說明 |
| P2 | `00-preface.md`（改寫非新增） | 見第 2 節 | README 呼應 |

> 是否新增 Transient Imaging／Lec7 章，取決於研究階段（第 6 節 Phase 1）對 OCW 課綱與逐字稿可得性的確認。**在確認前不動 nav。**

---

## 4. 網路搜索規範（時效性與新增資訊）

流程：**WebSearch 找源 → WebFetch 讀原文 → 記錄**。每一條採用的事實需記 `URL + 發布日期 + 查核日期`，寫入 `plan/mas531-computational-photography/research/` 對應筆記。

來源分級（高→低）：
1. **官方一手**：MIT OpenCourseWare MAS.531 課程頁與講義 PDF、原始論文（SIGGRAPH／CVPR／ICCV／期刊）、作者本人頁面（Raskar、Levoy、Adelson、Athale、GelSight）。
2. **權威二手**：教科書、綜述、大學課程頁。
3. **新聞媒體**：僅用於「後續發展」時間線（如 Lytro 上市／停業年份）。
4. **社群（維基、部落格）**：僅供交叉比對，不單獨作為事實依據。

規則：
- **敏感數字需兩個獨立來源**：本書指「規格類」數字——1600 萬畫素／292×292／14×14、780nm、630nm→水中波長、f/1.8、pinhole 200μm、FTIR 2005 年份等。
- **P1-8（420nm）專項**：先回逐字稿確認講者原話數字；再以 $\lambda_{water}=\lambda_{air}/n$、$n_{water}\approx1.33$ 核算（≈473nm）。若逐字稿確為 420 而物理為 473，於正文標「講者口誤／原講如此，物理值約 473nm」並註來源，不靜默改數。
- 無法查證者標 `待查`，**絕不臆造**。
- 忠於 2009 課程的歷史敘述**不需**改為現況；只在「後續發展」小註補當代狀態。

---

## 5. 統一頁面模板（所有正文章節收斂到此）

每章開頭固定 metadata 區塊（`03b` 要補、格式對齊）：

```
# 第 N 章：標題

對應講次：Lecture X
影片主題：
- …
對應講義：MITMAS_531F09_lecXX.pdf（無則寫「無」）
```

正文骨架（章節統一用「導讀」，不用「導言」）：

1. **導讀** — 問題動機＋本章一句話主張。
2. **核心內容** — 主概念鋪陳（可含子小節，但子小節屬於「核心內容」之下，不取代頂層骨架）。
3. **原理與系統** — 光學／計算原理、系統架構、關鍵數字（數字須可對回 references）。**至少一張圖**（Mermaid 或圖片）。
4. **常見誤解** — 每章 1–3 條（目前 ch7/8/9 缺，補上）。
5. **後續發展（選配）** — 2009→今日的時間錨點小註（P2-10 適用章）。
6. **小結** — 收束＋與相鄰章的關聯。
7. **延伸連結** — relative-path 交叉連結相鄰章＋術語表（P2-9）。

Mermaid 需遵 `CLAUDE.md`〈Mermaid rules〉（含中文／括號 label 加引號、`<br/>` 換行、特殊字元 label 加雙引號）。

> ch7/8/9 目前的「7.1 / 8.1 / 9.1」編號可保留為「核心內容」下的子標題，但**必須補齊頂層的「原理與系統／常見誤解／延伸連結」**，使全書骨架一致。

---

## 6. 多 Agent 執行制度

- **主控（本 session）**：維護本計畫、切分任務、驗收、跑 build。不平行寫多章。
- **研究 agents（可上網，平行）**：輸出到 `plan/mas531-computational-photography/research/`。主題切分：
  - R1：課綱與缺口 — 確認 MIT OCW MAS.531 F09 各 Lecture 主題（特別是 **Lec7**），判定補章或說明不涵蓋。
  - R2：規格數字查核 — 光場相機規格、pinhole/filter 尺寸、780nm、FTIR 年份等（兩來源）。
  - R3：**420nm 專項** — 逐字稿原話＋折射率核算。
  - R4：後續發展時間線 — Lytro、GelSight、ToF／運算攝影落地（僅供 P2-10 小註）。
  - R5：references 骨架 — 收集各章關鍵論文/OCW 連結，產出 references.md 草稿來源清單。
- **寫作 agents（不上網，平行，每批 3–4 相關章）**：只改被指派檔案；數字只能取自研究筆記或 references.md；不得自行查資料。建議批次：
  - W1：ch1、ch2、ch3、ch3b（導論＋光學＋Epsilon）
  - W2：ch4、ch5、ch6（照明＋光場）
  - W3：ch7、ch8、ch9（感測互動＋波長＋綜覽）— 重點是**風格對齊模板＋補常見誤解**
  - W4：ch10、appendix、glossary、README、preface、references
- **審查 agent（唯讀）**檢查清單：骨架是否符第 5 節；metadata 區塊齊全；每章≥1 圖且 Mermaid 合規；數字都可對回 references；無 `待查` 遺留在正文；交叉連結存在；notes/ 已移出 docs/；books-data.js 已加條目。

依賴：**R1–R5 全部完成 → references.md（權威頁）先定稿 → 才啟動 W1–W4**。圖表可與寫作同批進行；`/mkdocs-add-images` 於文字定稿後再跑。

---

## 7. 階段總覽與驗收

| 階段 | 內容 | 平行度 | 依賴 |
|---|---|---|---|
| Phase 0 | **P0 快修**：books-data.js 加條目；notes/ 移出 docs/；README/preface 去「待補」占位 | 主控單人 | 無 |
| Phase 1 | 研究 R1–R5 | 5 agents 平行 | 無 |
| Phase 2 | references.md 定稿（權威數字頁） | 主控 | Phase 1 |
| Phase 3 | 寫作 W1–W4（骨架對齊＋補常見誤解＋後續發展小註＋交叉連結） | 4 agents 平行 | Phase 2 |
| Phase 4 | 圖表：各章 Mermaid；`/mkdocs-add-images` 補圖片 | 平行 | Phase 3 文字定稿 |
| Phase 5 | 審查 agent 全書掃描 | 1 agent | Phase 3/4 |
| Phase 6 | `./sync-assets.sh` + `uv run mkdocs build -f configs/mas531-computational-photography.yml`，確認 **0 orphan 警告** | 主控 | 全部 |

### 驗收清單

- [ ] `js/books-data.js` 有 mas531 條目，`index.html` 卡片可進入本書。
- [ ] `00-preface.md`、`references.md`、`README.md` 無「待補／施工中」占位。
- [ ] build log **無 "pages … not included in nav" 警告**（notes/ 已移出 docs/）。
- [ ] 14 章皆有開頭 metadata 區塊，且骨架符合第 5 節（含「原理與系統／常見誤解」）。
- [ ] ch9 標題改為「導讀」；ch3b 標題與 metadata 格式對齊。
- [ ] 每章至少一張圖（Mermaid 合規或圖片），且 build 無 Mermaid 語法錯誤。
- [ ] references.md 所有規格數字有來源；敏感數字兩來源；P1-8（420nm）已依第 4 節處置並註明。
- [ ] Lecture 7 與 Transient Imaging：或補章、或於前言明講不涵蓋，nav 與 README 一致。
- [ ] 相鄰章之間、章節→術語表有 relative-path 交叉連結。
- [ ] 正文無殘留 `待查`；`notes/` 內部 metadata 不再對讀者公開。
- [ ] `uv run mkdocs build` 成功產出 `book/mas531-computational-photography/html/`。
