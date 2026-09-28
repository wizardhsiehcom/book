# 書籍視覺解說範本

這是放在書籍資源中的獨立 HTML 閱讀器，不是 PPT 檔，也不是固定圖表格式。每頁可以使用不同的圖解；共用的只有閱讀順序、縮圖、翻頁與可釘選索引。

在 repo 內直接開啟 `index.html` 即可試讀，無需安裝、建置或網路。此資料夾只存編寫範本，不含閱讀器。

## 正式位置與依賴方向

```text
templates/visual-story/                 編寫起點，不隨書發布
docs/assets/story-reader/               閱讀器唯一來源
  ↓ sync-assets.sh（複製，不是 symlink）
docs/<book>/assets/story-reader/         生成副本，Git 忽略
docs/<book>/resources/<topic>/          主題內容，Git 追蹤
  ↓ MkDocs build
book/<book>/html/                       可整份搬走的輸出
  assets/story-reader/                  每本書只放一份
  resources/<topic>/                    各主題相對引用它
```

閱讀器不依賴 MkDocs、特定書籍、範本或 playground。主題只使用 `story` 資料契約與可選的 `mount`；外部套件由主題自己載入。

## 功能區與檔案責任

| 檔案 | 負責 | 何時修改 |
| --- | --- | --- |
| `index.html` | 頂部書籍資訊、主要閱讀區、側邊索引、底部翻頁四個區域，以及載入順序 | 返回書籍、標題、引入額外主題檔案 |
| `story.js` | 書籍資訊、分鏡順序、文字、圖解、題目、頁內互動 | 建立每個新主題 |
| `story.css` | 主題自己的圖解與視覺元件 | 主題需要新的呈現方法 |
| `../../docs/assets/story-reader/reader.js` | 翻頁、進度、縮圖、題目狀態、索引釘選、掛載與清理 | 改所有主題共同的閱讀行為 |
| `../../docs/assets/story-reader/reader.css` | 共用版面、字級、縮圖縮放、hover、釘選佔位、響應式 | 改所有主題共同的外觀 |

載入順序固定為 reader CSS → story CSS → story JS → reader JS。使用一般 script，不用 ES module 或 fetch，所以基本版本支援 `file://` 離線開啟。

## 建立流程

1. 建立 `docs/<book>/resources/<topic>/`，只複製本範本的 `index.html`、`story.js`、`story.css`，並依下方「路徑範例」改 HTML 的兩個 reader 路徑。
2. 先列出讀者要理解的問題、必要前置知識、最後應能回答的問題。
3. 在 `story.js` 寫出分鏡；先讓每頁的 `title` 與 `point` 連起來能講清楚，再補圖與互動。
4. 改 `story.title`、`story.label`、HTML 的 `<title>`；需要返回章節時設定 `story.back`（見路徑範例）。
5. 改 `story.css`。新 class 加主題前綴，不覆寫 `nav`、`.index`、`.mini` 等外殼選擇器。
6. 在章節加入相對連結，建置後依「驗收」檢查。

不需要固定十頁、每頁相同圖表或每個主題都有測驗。內容變長就多拆一頁，不要一味縮小字體。

### 路徑範例

所有路徑規則以此表為準。假設章節是 `docs/<book>/08-tcp-stream.md`、主題是 `resources/tcp-stream/`，且 `use_directory_urls: false`：

| 引用位置 | 填入內容 |
| --- | --- |
| 章節 Markdown | `[開啟逐步解說](resources/tcp-stream/index.html)` |
| 主題 HTML 的 CSS | `../../assets/story-reader/reader.css`（範本內為 `../../docs/assets/…`） |
| 主題 HTML 的 JS | `../../assets/story-reader/reader.js`（同上） |
| `story.back` | `{ href: '../../08-tcp-stream.html', label: '返回章節' }` |

- 章節位於子目錄或 `use_directory_urls: true` 時，依實際建置網址調整。
- HTML / JS 裡的 `.md` 不會被 MkDocs 轉成 `.html`；返回連結只能在建置結果中測試。
- 不要把主題 HTML 加進 MkDocs `nav`，也不要用 `extra_javascript` 在全書每一頁載入 reader。

### 預覽方式

- 原始範本：直接開啟 `templates/visual-story/index.html`。
- 書籍主題：`./serve-book.sh <book>`，或建置後 `python3 -m http.server 8765 --bind 127.0.0.1 --directory book/<book>/html`。
- 測試 Three.js 等動態依賴時使用 HTTP，並檢查載入失敗時的靜態替代。
- `<book>`、`<topic>` 是佔位符，執行指令前需換成真實名稱。

## 分鏡資料契約

```js
const story = {
  title: '主題名稱',
  label: '視覺解說 / 章節名稱',
  // back: { href: '../../08-tcp-stream.html', label: '返回章節' },
  pages: [{
    id: 'stable-page-id',
    section: '01 / 情境',
    title: '這一頁要說清楚的一句話',
    lead: '讀者需要知道的背景。',
    art: '<div class="topic-diagram">圖解內容</div>',
    point: '讀完應帶走的理解。',
    detail: '可選：前提、限制、來源連結。',
  }],
};
```

- `id` 必填且整份唯一；重排時不要改 id，題目及互動狀態以它索引。
- `section`、`title`、`lead`、`art`、`point` 必須是字串。`detail` 可省略。
- `art` 不限制圖解類型，可寫 HTML、SVG、表格，或放置 Canvas / 3D 的容器。
- HTML 字串只接受作者審查過的可信本地內容。不可直接塞入 URL 參數、讀者輸入或遠端文字；預覽的字串替換不是安全清理器。
- 靜態圖解盡量用 class / data attribute，不放固定 ID。SVG 若使用 defs/id，請另外提供沒有重複 ID 的 `previewArt`，避免縮圖引用衝突。
- 本文與縮圖共享主題 CSS。預覽以 1000px 寬、約 800px 高的內容縮放；超長頁面會被裁切，應拆頁或提供較精簡的 `previewArt`。

### 預測題（可選）

在頁面加 `question: { prompt, choices, hideFuturePreviews }`，每個 choice 有 `value`、`label`、`feedback`。`value` 為唯一英數、底線或連字號字串。參考範本第二頁。

`hideFuturePreviews: true` 會在目前題目尚未作答時遮住後續預覽，但不阻止翻頁。它是避免劇透，不是考試存取控制。每頁答案獨立；返回或重新閱讀保留答案，重新整理才清空。

### 頁內互動與 Three.js 擴充

提供 `mount(root, state)`：閱讀器插入當頁 HTML 後呼叫，`root` 是主閱讀區，`state` 是這頁專用、保留到重新整理為止的物件。返回此頁會重新掛載，可用 state 恢復操作位置。

`mount` 必須同步回傳清理函式或 undefined；翻頁（包括索引跳頁與重播）會先呼叫清理，再移除舊 DOM。範本第三頁有可執行例子。不要在內容檔載入時直接操作 DOM。

互動頁必須另設 `previewArt`（靜態 HTML / SVG / 圖片），縮圖不呼叫 mount。一般靜態頁預設直接縮小同一份內容；需要即時 3D 縮圖不是本範本已提供的能力。

日後加入 Three.js 時：

1. 在主題自己的檔案載入所需版本，不改共用 reader，也不要求所有書籍載入 3D。
2. `art` 放容器；`mount` 只在 root 內建立 renderer、scene 和 controls。
3. 清理函式停止動畫、移除事件、斷開 ResizeObserver，並釋放 controls、geometry、material、texture 與 renderer 資源。
4. 非同步載入需在清理時標記已離開；結果回來時若已離開，釋放資源，不再操作舊頁面。
5. 提供文字等價說明與靜態預覽；WebGL 失敗仍能閱讀重點。
6. 若採 ES module、模型載入或 fetch，改用 HTTP 預覽並測試離線需求，不能再宣稱直接雙擊即支援。此範本未安裝 Three.js。

## LLM 建立與迭代規則

可將以下工作要求貼給 LLM：

> 依本資料夾 README 建立「〔主題〕」的逐步解說。讀者是〔對象〕，讀完應能〔能力〕。先列分鏡，再改 story.js / story.css。每頁只處理一個認知步驟，保留必要前提與來源；不必壓縮頁數。依內容選擇圖表、對照、步驟或互動，不要強套 TCP 圖形。除非明確要求修改閱讀器，勿改 docs/assets/story-reader/ 或各書生成的 assets 副本。動態頁必須有 previewArt 和清理函式。完成後依 README「驗收」逐項檢查，明確區分自動檢查與實際瀏覽器驗證。

一次迭代只處理一件事：理解順序、單頁圖解或導覽行為，避免改文案時順便重寫外殼。來源不足時標明假設，別把教學簡化說成真實系統的完整行為。

### Agent 使用圖解部件的工作流程

實作者是 LLM agent；由 agent 讀取原始檔、選擇部件、修改與驗證，不要求使用者手動複製 HTML。使用者負責提供閱讀目標與回饋視覺方向。

視覺方向為 A「紙本圖解」：暖白底、留白、細線、清楚字級與少量朱紅。共用 reader 已套用，色票定義在 `reader.css` 的 `:root`（`--paper --card --ink --muted --accent --line --tint`）。主題 CSS 一律使用這些 token，不自行定義外殼配色；`--accent` 只標重點狀態。`--blue`／`--orange` 是舊主題的相容別名，新主題不要使用。

依要表達的關係選圖；下表是選圖與修改時必須守住的約束，不綁定任何部件檔：

| 要表達的關係 | 圖解類型 | 調整時必須保留 |
| --- | --- | --- |
| 步驟、判斷與重試 | 流程 | 箭頭方向、分支條件、回到哪一步 |
| 兩方事件與等待 | 時序 | 時間方向、傳送方向、本地事件與未知狀態 |
| 修改前後或方案比較 | 對照 | 相同起點、單位、尺度與容量線 |
| 層次與組成 | 分層 | 層間關係；物理剖面需補連接路徑與比例說明 |
| 範圍與逐步縮小 | 區間 | 座標範圍、端點是否包含、位置與寬度 |
| 數量分流與負荷 | 分流 | 分流加總、數量比例、後續工時計算 |

部件候選在本機 `playground/paper-components/`（Git 忽略，其他 checkout 可能不存在）。存在時可從對應 section 的 `.demo > figure` 與 `components.css` 取用；不存在時參考 `docs/*/resources/` 既有故事實作最小圖解。正式故事不得引用 playground；部件選定後再收進本範本。

1. **先寫計畫**：在 `plan/visual-story/<topic>-plan.md` 記錄讀者能力、分鏡、每頁的因果關係與預計使用的圖解類型。不必六種全用。
2. **先做關鍵頁**：挑最能表達機制的一頁，改成該主題的真實內容。只取需要的 HTML/CSS 放進主題的 `story.js`／`story.css`。
3. **核對模型再調外觀**：文案、單位、數字與圖形比例一起更新。動態圖的數字和尺寸由同一模型推導；不保留範例的固定百分比或容量線。研究來源與不確定處寫在 `plan/visual-story/<topic>-sources.md`，明確區分教學假設與查證事實。
4. **實際渲染並迭代**：在正式 reader 中看桌面與手機畫面；檢查閱讀順序、標籤、比例、導覽遮擋、縮圖，以及控制項和結果能否一起觀察。修完再看，確認後才擴展其他分鏡。
5. **需要時分派部件**：依使用者授權，可把來源查核、單張圖解或版面探索交給 subagent。任務寫明輸入、輸出檔案、可編輯範圍與驗收條件，避免多人修改同一檔；主 agent 負責模型正確性、風格一致、整合與最終驗收。
6. **完成整合與交付**：依「驗收」逐項檢查，回報實際做過的檢查、預覽位置與仍需使用者判斷的視覺取捨。

## 書籍整合與 Git

多主題共用該書的 `assets/story-reader/`。只修改 `docs/assets/story-reader/`，由 `sync-assets.sh` 複製到每本書；不要改生成副本，下次同步會覆蓋。`build-books.sh` 與 `serve-book.sh` 已先同步；手動 MkDocs build 前，或 serve 期間改了共用來源，需自行執行 `./sync-assets.sh`。

交付整份 `book/<book>/html/`。若只交付單一主題，另帶上兩個 reader 檔案並調整引用路徑，不能依賴 repo 外部或 symlink。

閱讀器本身可離線；書籍其他部分仍可能引用 CDN 或外部書架，單本離線交付須另查。需要離線依賴時放在該書的 `resources/vendor/` 讓同書主題共用；固定版本、保留授權並帶齊 module 的轉接依賴，並在主題說明中記錄版本、網路需求和靜態替代方式。不把第三方套件寫進共用 reader。

Git 追蹤 HTML、CSS、JS 與必要來源資產；不提交 node_modules、書籍建置結果、逐頁截圖或重複的大型套件。縮圖從靜態內容渲染，無須存 PNG。只有主題真的需要時才加入圖片、模型或影片，並記錄來源、授權與大小。

若頁面空白，先檢查兩個閱讀器路徑、是否執行同步，以及 story JS 是否在 reader JS 之前載入。若更新後沒有變化，確認改的是共用來源而非生成副本。若只有返回失敗，對照實際建置網址，不改成 repo 的原稿路徑。

## 驗收

### 工程

- 從第一頁讀到最後，再回上一頁、從索引跳頁和重播；頁碼與進度正確。
- hover 底部導覽展開、離開縮小；預覽無可操作元件、無重複 ID。
- 左上標籤 hover 暫開，點一下釘選；釘選佔位，不蓋住底部導覽；解除後能收起。
- 鍵盤可翻頁、選答案、開關索引；輸入與互動控制不被全域快捷鍵攔截。
- 窄螢幕、200% 文字放大、減少動態效果時仍可讀；長頁操作後的結果能與控制項一起觀察。
- 互動離頁後沒有殘留動畫或事件；返回恢復預期狀態；沒有 WebGL 也有文字資訊。
- 原始資料夾與書籍建置後的所有本地資產、章節連結都有效。

自動檢查（repo 根目錄）：`node tools/check-story-reader.cjs` 用 DOM stub 檢查外殼、重複 ID、導覽、題目、釘選、連結與互動清理，含刪除必要節點的反向測試；`uv run python tools/check-story-package.py` 實際建置兩個暫存主題、搬移輸出並驗證引用仍在交付目錄內。兩者都不代表瀏覽器視覺驗收。

### 教學（完成門檻）

圖表、按鈕或測試數量不能代替以下三件事：

1. **核心因果可見**：在計畫寫下「改了什麼 → 哪個中間狀態改變 → 得到什麼結果」，指出各段由哪張圖呈現。讀者須能從位置、路徑、長度或狀態變化指出機制；只把結論放進文字卡片仍不足。標示比例、座標與縮放，不能讓視覺暗示與數字矛盾。
2. **操作顯示對應後果**：同一模型的控制項應同步呈現本篇要解釋的結果。例如門檻改變後，同時看到分流數量與工時；使用固定對照時明示條件。靜態圖足以解釋的步驟不必加入動畫。
3. **新例子先預測，再揭曉**：結尾安排一個未逐步示範的切法、序列或情境，要求讀者說出結果與理由。可使用 question 或明確的自查題；答案只放在作答回饋，當頁圖、摘要及預覽不提前揭露。題目針對本篇機制，避免只考名詞記憶。

計畫檔留下「能力 → 圖解／操作頁 → 新例子與答案」的簡短對照。完成時分開記錄作者自查、瀏覽器驗收與讀者試讀；尚無試讀時，不宣稱已證明學習成效。
