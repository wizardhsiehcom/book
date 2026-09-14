# MIT MAS.531《Computational Camera and Photography 計算攝影》成書計畫

本計畫用來把 `data/mas531/transcripts/` 內的 MIT MAS.531（Fall 2009，講者 Ramesh Raskar，MIT Media Lab）課程逐字稿，整理成一本繁體中文的知識書。逐字稿為 YouTube 自動字幕匯出的純文字 `.txt`（單行、無標點、無換行），共 20 支影片，對應課程第 1 到 11 講（其中第 7、10 講無逐字稿）。另有 `data/mas531/reference/` 內 18 份 OCW 官方講義 PDF 作為本地輔助材料。核心原則是：每一支影片的逐字稿都必須完整閱讀，從第一個字到最後一個字，不以片段、摘要、搜尋命中或抽樣段落代替完整閱讀。

## 目標

- 把課程內容整理成一本可在本 repo 內發展為 MkDocs book 的繁體中文書稿。
- 保留課程主線：從課程總覽與計算攝影的定義，到現代光學與 ray-matrix 運算、epsilon photography、計算照明（dual photography、relighting）、光場（lightfields）成像與光場相機、面向人機互動的相機、波長與顏色、高光譜成像、計算成像領域綜覽（含醫學與科學應用）、以及 coded imaging（編碼成像）。
- 將逐字稿中的口語講解轉成可閱讀、可複習、可交叉引用的書面章節。
- 善用本地 OCW 講義 PDF 還原逐字稿中「看投影片講解」的內容；PDF 是本地材料，可在初稿階段引用，不算外部搜尋。
- 最後補入外部對各主題的理解、經典論文（如 light field rendering、coded aperture、Lytro/plenoptic camera、femto-photography 前身研究），但只補充有助於理解課程主軸的資訊。

## 非目標

- 不直接將逐字稿全文貼成書稿。
- 不在未完整閱讀逐字稿前，先依課名或既有常識寫出最終章節。
- 不用外部文章取代課程逐字稿本身。
- 不為了速度跳過重複、口誤、學生問答、demo 或 guest talk 段落；這些內容仍要讀完，再判斷是否進入書稿。
- 不在資訊不足時硬補內容。若本地沒有、使用者未提供、工具無法可靠取得，必須標記 `待補` 並請使用者提供，不可編造 lecture title、論文名稱、作者、年份、實驗數據、檔案路徑或資源連結。

## 資訊不足處理規則

本專案允許佔位，不允許猜測。遇到下列狀況時，主控 agent 或 worker 必須停止補寫，改以 `待補`、`待查` 或「需使用者提供」標示：

- 第 7 講與第 10 講沒有逐字稿：第 7 講連 PDF 都沒有；第 10 講只有 `MITMAS_531F09_lec10_notes.pdf`。不可從講次編號推測其主題與內容。
- 逐字稿中提到某張投影片、demo 影片或器材展示，但文字無法還原其內容，且對應 PDF 中也找不到。
- 講者引用的論文、人名、年份在逐字稿中含糊（自動字幕常拼錯專有名詞），無法可靠對應時。
- reference PDF 檔名（lec02–lec11）與影片講次的對應關係不明確時，先核對 PDF 內容再對應，不可只憑檔名編號硬配。

處理方式：

1. 在 plan 或 tracker 中保留佔位。
2. 明確寫出缺少什麼材料，例如第 7 講的影片／逐字稿、第 10 講的逐字稿。
3. 若需要使用者協助，直接提出需要提供的清單。
4. 不因為章節或表格想保持完整而自行補出不存在的資料。

## 材料特性注意事項

- 逐字稿是 YouTube 自動字幕：無標點、無換行、專有名詞常拼錯（例如「Ramesh Raskar」被轉成「ramish raskar」、「MAS 131/531」被轉成「mass 131 and 531」）。worker 閱讀時要主動辨識並修正這類錯拼，無法確認的名詞標 `待查`。
- 檔名含全形冒號「：」、全形引號「＂」與方括號中的 YouTube ID，路徑必須完全照抄。
- 同一講次常由多支影片組成（Part 1/Part 2、guest talk、recent research 短講）；書稿章節以主題重組，不硬套影片編號。

## 工作階段

### 多 agent 執行制度

本書由一個主控 agent 管控進度，再派多個章節 worker agent 逐講完成內容。主控 agent 負責整體一致性，不把品質責任完全交給 worker。

#### 角色分工

| 角色 | 責任 | 可寫入範圍 |
|---|---|---|
| 主控 agent | 維護計畫、派工、審稿、更新追蹤表、統一術語、處理跨章整合 | `plan/mas531/`、`docs/mas531-computational-photography/`、`configs/mas531-computational-photography.yml` |
| 章節 worker agent | 完整閱讀指定逐字稿，比對對應講義 PDF，產出該講閱讀筆記與章節初稿 | 僅限被指派的 `notes/lecture-XX-*.md` 與 `XX-*.md` |
| 外部補充 agent | 在全部逐字稿初稿完成後搜尋外部理解與補充資料 | `references.md` 與指定章節的「外部補充」段落 |
| 審稿 agent | 檢查單章是否忠於逐字稿、是否跳讀、是否需要回補 | 原則上只回報問題，不直接改稿；必要時由主控 agent 整合 |

#### 派工原則

- 不一次派出所有章節 worker；每批建議 3 到 4 支影片，降低術語漂移與整合成本。
- 每個 worker 原則上負責 1 支影片；同講次的 Part 1/Part 2 屬同一主題，可由同一 worker 負責 2 支。
- worker 必須被告知：repo 內可能有其他 agent 或使用者的改動，不可 revert 或覆蓋非自己負責的檔案。
- worker 的任務必須具體包含：
  - 指定逐字稿完整路徑（照抄全形字元）。
  - 指定閱讀範圍為全文（單行檔案，從第一個字到最後一個字）。
  - 指定可比對的本地講義 PDF 路徑（若有）。
  - 指定輸出閱讀筆記檔與章節檔。
  - 禁止網路搜尋，除非主控 agent 明確進入第 6 階段。
  - 禁止只根據課名、常識或片段搜尋結果寫章節。
  - 若材料不足，必須回報缺口，不可自行腦補。

#### Worker 交付格式

每個章節 worker 完成後必須回報：

1. 已完整閱讀的逐字稿檔名與位元組數（本課逐字稿為單行檔，以 bytes 取代行數）。
2. 新增或修改的檔案清單。
3. 本講 5 到 10 個核心概念。
4. 與前後章需要主控 agent 注意的連結。
5. 不確定或需要主控 agent 複查的點（含自動字幕錯拼修正清單）。
6. 是否使用外部資料（初稿階段應為「否」；本地 reference PDF 不算外部資料）。

#### 主控 agent 驗收條件

主控 agent 收到 worker 結果後，必須檢查：

- 閱讀筆記是否明確標示完整閱讀範圍。
- 章節是否有把逐字稿內容抽象成書面解釋，而不是逐字翻譯或鬆散摘要。
- 是否有跳過學生問答、demo、guest talk、器材展示等看似旁支但可能重要的內容。
- 術語是否和既有章節一致。
- 是否有新增未經允許的外部資料。
- 是否只改動被指派的檔案。
- 是否把不確定或缺失材料標成 `待補`，而不是寫成已確認事實。

驗收後主控 agent 才能更新 `plan/mas531/mas531-computational-photography-transcript-tracker.md` 的狀態。

### 第 0 階段：建立書籍骨架

1. 建立全書工作目錄 `docs/mas531-computational-photography/`。
2. 建立章節命名規則、頁面模板、術語表、參考資料頁。
3. 先用影片清單建立暫定章節，不寫實質內容，只標註每章來源逐字稿與對應 PDF。
4. 建立閱讀紀錄表，追蹤每份逐字稿是否已「完整讀完」、「抽象完成」、「章節補寫完成」、「外部補充完成」。

### 第 1 階段：課程級抽象

在逐講細讀前，先建立高層架構，但只能以影片標題、檔案清單與課程主題做粗略規劃：

1. 定義全書讀者：對攝影、電腦視覺或影像處理有興趣，想理解「相機不只是取代底片的感光元件，而是可以重新設計的光學＋計算系統」的讀者；假設具備基本線性代數與幾何光學常識，不預設圖形學背景。
2. 將 20 支影片分成幾個篇章：
   - 導論：計算攝影是什麼、課程全覽（L1 Part 1/2）
   - 現代光學與 ray-matrix 運算（L2 Part 1/2）
   - Epsilon photography 與單張多域相機（L3 兩支）
   - 計算照明：dual photography 與 relighting（L4 Part 1/2）
   - 光場一：光場概念與擷取（L5 Part 1/2、L6 Lightfields part 2）
   - 感測與互動：Retrographic sensing、BiDi Screen、HCI 相機（L5/L6 recent research 與 HCI 講）
   - 波長、顏色與高光譜成像（L8 三支：wavelengths and colors、hyperspectral survey、project ideas）
   - 計算成像綜覽：拍不到的相機、醫學與科學應用（L9 兩支）
   - 編碼成像 coded imaging（L11）
3. 為每篇寫一段暫定導言，之後會根據完整閱讀結果修正。
4. 注意多影片講次：同一講次的 guest talk / recent research 短講主題可能與主講不同（例如 L5 主題是光場，但 recent research 是觸覺感測），書稿須依主題重組，不可只依講次編號硬歸類。
5. 第 7、10 講缺逐字稿，章節結構先預留缺口標 `待補`，不推測其主題。

### 第 2 階段：逐字稿完整閱讀

每支影片按順序處理，流程固定：

1. 開啟 `data/mas531/transcripts/` 內對應的逐字稿 `.txt`。
2. 從頭到尾完整閱讀，不跳段（單行長檔案，分段讀取但必須讀完全文）。
3. 邊讀邊記錄：
   - 本講主問題
   - 關鍵概念
   - 重要定義（光學量、成像模型、演算法）
   - 公式與推導（如 thin lens equation、ray transfer matrix、light field 參數化）
   - 系統與器材（相機改裝、mask、光源陣列、感測器）
   - 講者使用的直覺、例子、類比
   - demo、guest talk、學生問答或容易被忽略的細節
   - 與其他講次的關聯
4. 讀完逐字稿後，比對同講次的 reference PDF，還原「這張投影片」類指涉；PDF 中有而逐字稿沒講的內容只能標註為補充，不可寫成講者說過的話。
5. 讀完後才產出該講的「抽象筆記」。
6. 抽象筆記完成後，再改寫成書稿章節。

### 第 3 階段：章節寫作

每章建議結構：

1. 章節導讀：這一章要解決什麼成像問題、突破傳統相機的哪個限制。
2. 核心概念：用書面語整理逐字稿中的主要內容。
3. 原理與系統：成像模型、光學設計、演算法流程，以及支持它們的關鍵系統或實驗。
4. 公式與推導：課程提到的數學工具，必要時補步驟。
5. 常見誤解：逐字稿中講者特別澄清、問答中出現、或容易混淆的點。
6. 與前後章的連接：說明本章如何接到下一章。
7. 小結：用 5 到 10 個條列收斂本章。

### 第 4 階段：全書整合

逐章完成後，進行跨章整理：

1. 統一術語翻譯，例如 computational photography、epsilon photography、light field、plenoptic function、coded aperture、coded exposure、dual photography、relighting、depth of field、bokeh、ray-matrix、hyperspectral imaging、BiDi screen、retrographic sensing 等。
2. 檢查重複概念是否需要前置說明或交叉引用（例如「光場」在 L5、L6、L11 都會出現；「mask/coded」概念橫跨多講）。
3. 補上全書導論與結語。
4. 建立圖表清單：成像光路圖、light field 兩平面參數化示意、dual photography 光路對偶示意、coded aperture 原理圖等，優先以 Mermaid 或簡單示意重繪。
5. 檢查章節順序是否忠於課程，但必要時可在書稿中加入跨章導讀。

### 第 5 階段：本地參考資料整合

1. 逐章核對 `data/mas531/reference/` 的講義 PDF，在章節「相關材料」段標明對應 PDF 檔名與可補充的圖表。
2. 第 7 講無任何材料、第 10 講只有 notes PDF：第 10 講可依 `MITMAS_531F09_lec10_notes.pdf` 建立一份「僅講義」的簡短章節或附錄，但必須標明無逐字稿佐證；第 7 講整講標 `待補`。
3. 不因為材料缺失而中止書稿進度；相關欄位標 `待補`。

### 第 6 階段：網路補充

所有逐字稿完成閱讀與初稿後，才進行外部搜尋。搜尋目標：

1. 官方 MIT OCW MAS.531 課程頁（含 syllabus、lecture notes 清單，可順便確認第 7、10 講的官方主題）。
2. 課程相關經典論文（逐字稿中實際提到者優先）。
3. 針對某些主題的高品質解釋（如 plenoptic camera、coded exposure）。
4. 講者與 guest speaker 的原始發表資料。

補充原則：

- 外部內容只能補強理解，不取代逐字稿。
- 每則外部補充都要標註來源 URL、作者或網站、存取日期。
- 若外部說法與逐字稿不同，優先保留差異並說明脈絡，不直接混寫。
- 不收錄只有泛泛摘要、SEO 內容、無法驗證作者或與課程無關的資料。

### 第 7 階段：出版化整理

1. 將內容轉入 `docs/mas531-computational-photography/`。
2. 建立 `configs/mas531-computational-photography.yml`。
3. 補上首頁、目錄、術語表、參考資料、索引，並在 `index.html` 註冊書卡。
4. 執行 `./sync-assets.sh` 與 MkDocs build。
5. 檢查中文排版、Mermaid 圖、連結、章節導覽。

## 品質檢查清單

- 每一章都能追溯到一份或多份完整讀完的逐字稿（第 10 講「僅講義」章節除外，須明確標示）。
- 閱讀紀錄表不可只標「完成」，必須包含完成日期與筆記檔連結。
- 每一章的重點不是單純翻譯，而是把課程內容改造成讀者能建立心智模型的書面解釋。
- 重要成像模型、公式、系統架構不可只用口語描述，必要時要補圖或步驟。
- 多影片講次的內容已依主題拆到正確篇章。
- 自動字幕錯拼的專有名詞已修正或標 `待查`。
- 外部資料必須有引用紀錄。
- 全書術語要一致。

## 建議檔案配置

```text
plan/mas531/
  mas531-computational-photography-book-plan.md
  mas531-computational-photography-transcript-tracker.md
  mas531-computational-photography-chapter-template.md

docs/mas531-computational-photography/
  README.md
  00-preface.md
  01-introduction.md
  02-modern-optics-ray-matrix.md
  03-epsilon-photography.md
  04-computational-illumination.md
  05-lightfields-1.md
  06-lightfields-2.md
  07-sensing-and-interaction.md
  08-wavelengths-color-hyperspectral.md
  09-computational-imaging-survey.md
  10-coded-imaging.md
  glossary.md
  references.md
  notes/
    lecture-01a-*.md
    ...
```

> 註：docs 章節數與影片數不一一對應。Part 1/Part 2 併章、guest talk 與 recent research 短講依主題重組，最終章節劃分以 tracker 的對應欄位為準。第 7 講與第 10 講的缺口以 `待補` 呈現，待使用者提供材料或第 6 階段由 OCW 官方頁確認。
