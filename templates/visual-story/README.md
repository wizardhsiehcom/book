# 書籍視覺解說範本

這是放在書籍資源中的獨立 HTML 閱讀器，不是 PPT 檔，也不是固定圖表格式。每頁可以使用不同的圖解；共用的只有閱讀順序、縮圖、翻頁與可釘選索引。

在 repo 內直接開啟 `index.html` 即可試讀，無需安裝、建置或網路。此資料夾只存編寫範本，不含閱讀器；新主題只複製 `index.html`、`story.js`、`story.css`，依下方說明改兩個引用路徑。

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

TCP 與 Three.js 實驗保留在 repo 的 `playground/`，直接引用正式閱讀器；正式範本及建置流程不依賴實驗區。

## 建立流程

1. 建立 `docs/<book>/resources/<topic>/`，複製本範本的 `index.html`、`story.js`、`story.css`（不要複製 README）。把 HTML 兩處 `../../docs/assets/story-reader/` 改為 `../../assets/story-reader/`。
2. 先列出讀者要理解的問題、必要前置知識、最後應能回答的問題。
3. 在 `story.js` 寫出分鏡；先讓每頁的 `title` 與 `point` 連起來能講清楚，再補圖與互動。
4. 改 `story.title`、`story.label`、HTML 的 `<title>`；需要返回章節時設定 `back: { href: '../../08-tcp-stream.html', label: '返回章節' }`，此例適用 `use_directory_urls: false`；其他設定依實際建置網址調整。HTML / JS 裡的 `.md` 不會自動轉成 `.html`。
5. 改 `story.css`。新 class 加主題前綴，不覆寫 `nav`、`.index`、`.mini` 等外殼選擇器。
6. 在章節加入相對連結（根目錄章節例如 `[開啟逐步解說](resources/<topic>/index.html)`），執行 `bash sync-assets.sh`、`uv run mkdocs build -f configs/<book>.yml`，再依下方清單驗收。返回章節需在建置結果中測試，原始 Markdown 旁尚未生成章節 HTML。

不需要固定十頁、每頁相同圖表或每個主題都有測驗。內容變長就多拆一頁，不要一味縮小字體。

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

> 依本資料夾 README 建立「〔主題〕」的逐步解說。讀者是〔對象〕，讀完應能〔能力〕。先列分鏡，再改 story.js / story.css。每頁只處理一個認知步驟，保留必要前提與來源；不必壓縮頁數。依內容選擇圖表、對照、步驟或互動，不要強套 TCP 圖形。除非明確要求修改閱讀器，勿改 docs/assets/story-reader/ 或各書生成的 assets 副本。動態頁必須有 previewArt 和清理函式。完成後檢查翻頁、預覽、索引釘選、手機版與返回章節連結，明確區分自動檢查與實際瀏覽器驗證。

一次迭代只處理一件事：理解順序、單頁圖解或導覽行為，避免改文案時順便重寫外殼。來源不足時標明假設，別把教學簡化說成真實系統的完整行為。

## 書籍整合與 Git

把整個主題資料夾放到 `docs/<book>/resources/<topic>/`，章節用相對連結開啟 `resources/<topic>/index.html`。返回章節路徑依 `use_directory_urls` 與實際輸出確認；不要把原稿 `.md` 連結原封不動當成發佈連結。

多主題共用該書的 `assets/story-reader/`。只修改 `docs/assets/story-reader/`，由 `sync-assets.sh` 複製兩個執行期檔案到每本書；不要改生成副本，下次同步會覆蓋。不複製範本、說明或實驗。

`build-books.sh` 與 `serve-book.sh` 已先同步。手動 MkDocs build 前須同步；serve 期間修改共用來源後也須重新同步。同步後的閱讀器納入原有 build hash，變更會使書籍重建。

交付整份 `book/<book>/html/`。若只交付單一主題，另帶上兩個 reader 檔案並調整引用路徑，不能依賴 repo 外部或 symlink。

閱讀器本身可離線；書籍其他部分仍可能引用 CDN 或外部書架。單本離線交付須另查這些依賴；本次搬遷不自動下載 Three.js、Mermaid 或修改書架連結。

Git 追蹤 HTML、CSS、JS 與必要來源資產；不提交 node_modules、書籍建置結果、逐頁截圖或重複的大型套件。縮圖從靜態內容渲染，無須存一套 PNG。只有主題真的需要時才加入圖片、模型或影片，並記錄來源、授權與大小。

## 驗收

- 從第一頁讀到最後，再回上一頁、從索引跳頁和重播；頁碼與進度正確。
- hover 底部導覽展開、離開縮小；預覽無可操作元件、無重複 ID。
- 左上標籤 hover 暫開，點一下釘選；釘選佔位，不蓋住底部導覽；解除後能收起。
- 鍵盤可翻頁、選答案、開關索引；輸入與互動控制不被全域快捷鍵攔截。
- 窄螢幕、200% 文字放大、減少動態效果時仍可讀。
- 互動離頁後沒有殘留動畫或事件；返回恢復預期狀態；沒有 WebGL 也有文字資訊。
- 原始資料夾與書籍建置後的所有本地資產、章節連結都有效。

repo 根目錄執行 `node tools/check-story-reader.cjs`，檢查三頁範本的導覽、題目、釘選、連結及互動清理（DOM stub）。執行 `uv run python tools/check-story-package.py`，用暫存書籍實際建置兩個主題、搬移輸出並驗證引用仍位於交付目錄。兩者不依賴 playground，也不代表瀏覽器視覺驗收。
