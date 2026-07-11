# 《Pfeffer on Power：權力、影響力與組織現實》成書計畫

本計畫用來把 `data/PfefferOnPower/` 內的 Jeffrey Pfeffer 相關訪談、演講與 Podcast 逐字稿，整理成一本繁體中文的主題書。主要材料位於 `data/PfefferOnPower/transcripts/`，目前只有 `.txt` 逐字稿，共 62 份；沒有本地 PDF、slides、書籍原文或官方課綱。核心原則是：每一份逐字稿都必須從第一個字到最後一個字完整閱讀，不以標題、搜尋命中、片段摘要或既有常識代替。

## 材料格式注意事項

- 來源不是單一線性課程，而是同一主題的多場演講、訪談、Podcast 集數與短片。
- 檔名可作為初步主題線索，但不得用來直接決定章節內容；實際分類需在完整閱讀後回填。
- 有多份材料看似重疊，例如 `Power: Why Some People Have It and Others Don't`、`7 Rules of Power`、`Leadership BS`、`Dying for a Paycheck`。重複內容先保留，讀完後再決定合併、引用或列為補充案例。
- `Ep 1` 到 `Ep 25` 屬於 `Pfeffer on Power` 節目訪談序列；其他檔案多為 Pfeffer 本人演講、訪談或相關嘉賓主題。
- 本地沒有 `.vtt`、PDF 或課程 slides；任何缺少的出版資訊、日期、節目來源、書籍頁碼與外部連結都標記 `待補`。

## 目標

- 把分散的權力、影響力、職涯、組織政治與職場健康材料，整理成一本可在本 repo 內發展的 MkDocs 繁體中文書稿。
- 保留 Pfeffer 的核心張力：權力不是道德宣言，而是組織生活中會實際分配資源、機會與聲望的機制。
- 將口語訪談改寫成可閱讀、可複習、可引用的書面章節。
- 區分「取得權力」、「使用權力」、「保住權力」、「失去權力」、「權力的代價」與「工作場所制度」等主題。
- 在逐字稿初稿完成後，再補入外部資料，例如 Pfeffer 原書、Stanford 頁面、節目頁、論文或書評。

## 非目標

- 不直接貼逐字稿全文。
- 不在未完整閱讀前，根據書名或 YouTube 標題寫出最終章節。
- 不用外部文章或既有常識取代本地逐字稿。
- 不為了速度跳過問答、主持人追問、嘉賓案例或口誤修正。
- 不硬補缺漏資訊。凡本地沒有、使用者未提供、工具無法可靠取得者，標記 `待補`。

## 資訊不足處理規則

遇到下列狀況時，主控 agent 或 worker 必須停止補寫該欄位，改以 `待補`、`待讀後確認` 或「需使用者提供」標示：

- 每段影片／Podcast 的正式發布日期、節目名稱、主持人姓名與官方 URL。
- Pfeffer 相關書籍版本、章節、頁碼與出版資訊。
- 嘉賓姓名、職稱或公司若與檔名或 ASR 內容衝突。
- 逐字稿是否有 ASR 漏字、錯字、講者誤標或段落缺失。
- 哪些材料應合併進同一章、哪些只作為案例或附錄。

## 工作階段

### 第 0 階段：建立書籍骨架

1. 建立 `docs/pfeffer-on-power/`、`configs/pfeffer-on-power.yml` 與 launcher 卡片。
2. 先建立 README、notes 目錄與附錄骨架，不急著建立 62 個章節。
3. 選 1 份 Pfeffer 本人長訪談作為樣式基準，完整閱讀後產出第一份筆記與示範章。

### 第 1 階段：全書主線抽象

1. 定義讀者：創業者、管理者、職場專業人士、MBA／管理學讀者，以及想理解組織政治但不想停留在口號的人。
2. 先以檔名暫分主題，但所有分類都標記為暫定。
3. 建立術語表：power、status、influence、network、visibility、reputation、politics、leadership、workplace toxicity 等。

### 第 2 階段：逐字稿完整閱讀

每份逐字稿流程固定：

1. 開啟 tracker 指定的 `.txt` 檔。
2. 從頭到尾完整閱讀，記錄位元組數與完成日期。
3. 摘出本份材料的主問題、核心概念、具體案例、主持人追問、嘉賓經驗、與其他材料重疊或衝突之處。
4. 產出 `docs/pfeffer-on-power/notes/source-XXX.md`。
5. 回填 tracker：實際主題、可歸入章節、是否重複、是否需要外部查證。

### 第 3 階段：章節寫作

每章建議結構：

1. 章節導讀：本章處理哪一種權力問題。
2. 核心論點：用書面語整理逐字稿的主要主張。
3. 機制：權力如何被取得、維持、交換或失去。
4. 案例：保留逐字稿中的具體人物、公司、職涯或制度案例。
5. 反直覺點：Pfeffer 或嘉賓挑戰常見管理迷思的地方。
6. 應用清單：讀者可用來檢查自己處境的問題。
7. 與其他章節的連接。

### 第 4 階段：全書整合

1. 合併重複訪談中的相同主張，保留最清楚的版本。
2. 統一術語翻譯與人名、書名、公司名格式。
3. 建立交叉引用，尤其是權力七規則、領導迷思、職場毒性與人脈網絡之間的連接。
4. 補全導論、結語、術語表與參考資料。

### 第 5 階段：外部補充

所有逐字稿筆記與章節初稿完成後才進行。可補來源包括：

- Jeffrey Pfeffer 的原書與 Stanford 個人頁。
- `Power: Why Some People Have It and Others Don't`、`7 Rules of Power`、`Leadership BS`、`Dying for a Paycheck` 的出版資訊。
- 逐字稿對應的官方影片、Podcast show notes 或節目頁。
- 和材料直接相關的研究、新聞或案例背景。

補充資料必須標明來源與存取日期，且不得取代逐字稿本身。

### 第 6 階段：出版化整理

1. 執行 MkDocs build。
2. 檢查中文排版、連結、圖片授權、引用格式。
3. 建立首頁導讀與章節導覽，避免讀者面對 62 份來源而失去路線。

## 多 agent 執行制度

本材料量適合多 agent，但每個 worker 的寫入範圍必須小。

| 角色 | 責任 | 可寫入範圍 |
|---|---|---|
| 主控 agent | 維護計畫、派工、審稿、更新 tracker、統一術語、處理章節整合 | `plan/pfeffer-on-power/`、`docs/pfeffer-on-power/`、`configs/pfeffer-on-power.yml` |
| 來源 worker | 完整閱讀指定逐字稿，產出單份來源筆記 | 僅限被指派的 `docs/pfeffer-on-power/notes/source-XXX.md` |
| 章節 worker | 根據已驗收的來源筆記寫章節初稿 | 僅限被指派的章節檔 |
| 外部補充 agent | 在 transcript-first 初稿完成後補來源與查證 | `appendix-references.md` 與指定章節的「外部補充」段落 |
| 審稿 agent | 檢查是否忠於逐字稿、是否跳讀、是否亂補外部資訊 | 原則上只回報問題 |

### 派工原則

- 每批 3 到 4 份逐字稿。
- 每個來源 worker 一次只負責 1 份逐字稿。
- worker 不得修改其他 worker 的筆記、全書 config 或 launcher。
- worker 不得網路搜尋，除非主控 agent 明確進入外部補充階段。
- worker 必須回報完整閱讀範圍、檔案大小、核心概念、待查證點與建議章節歸屬。

### Worker 交付格式

1. 已完整閱讀的逐字稿檔名與位元組數。
2. 新增或修改的檔案清單。
3. 5 到 10 個核心概念。
4. 本份材料的實際主題。
5. 建議歸入章節或標記 `待讀後分派`。
6. 與其他來源的重複、互補或衝突。
7. 不確定或需要主控 agent 複查的點。
8. 是否使用外部來源；預設答案應為「否」。

### 主控 agent 驗收條件

- 閱讀筆記明確標示完整閱讀範圍與位元組數。
- 筆記不是逐字翻譯，也不是只根據標題摘要。
- 重要案例、問答、反直覺主張沒有被省略。
- 不確定資訊已標 `待補` 或 `待查證`。
- 未提前加入外部資料。
- 只改動被指派的檔案。

## 暫定全書篇章

以下只依檔名與材料集合做粗分，讀完後必須修正：

| 篇 | 暫定章節 | 主題 |
|---|---|---|
| 第一篇：權力為何重要 | 01-03 | 權力的定義、為何好人也需要懂權力、權力與改變世界 |
| 第二篇：取得權力 | 04-07 | 七條權力規則、打破規則、建立能見度、職涯推進 |
| 第三篇：人脈、品牌與說服 | 08-10 | 網絡、個人品牌、溝通、連結勝過完美 |
| 第四篇：使用與保住權力 | 11-13 | 影響力、政治操作、失權與守權、企業與政治案例 |
| 第五篇：領導迷思與組織現實 | 14-16 | Leadership BS、組織中的權力、Amazon Way、創新阻力 |
| 第六篇：權力的代價與工作制度 | 17-19 | Dying for a Paycheck、職場毒性、工作未來與制度修復 |
| 第七篇：訪談案例庫 | 附錄 | Pfeffer on Power 嘉賓訪談的案例整理 |

## 建議檔案配置

```text
plan/pfeffer-on-power/
  pfeffer-on-power-book-plan.md
  pfeffer-on-power-transcript-tracker.md
  pfeffer-on-power-chapter-template.md

docs/pfeffer-on-power/
  README.md
  01-why-power-matters.md
  02-rules-of-power.md
  03-network-and-visibility.md
  04-career-advancement.md
  05-using-influence.md
  06-keeping-and-losing-power.md
  07-leadership-bs.md
  08-workplace-toxicity.md
  09-case-library.md
  appendix-glossary.md
  appendix-references.md
  notes/source-001.md ...
```

## 品質檢查清單

- 每個章節都能追溯到已完整讀完的逐字稿。
- tracker 狀態不得在沒有筆記證據時改成完成。
- 所有外部資料都在 transcript-first 初稿之後加入。
- 重複訪談不直接刪除；先標記重疊，再由主控 agent 合併。
- 全書不把「權力」寫成抽象道德評語，而要說清楚具體機制與代價。
