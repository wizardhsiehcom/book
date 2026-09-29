# 技術讀書筆記（MkDocs）

此專案已改為 **MkDocs 多書獨立站點**：每本書各自一個設定檔與輸出目錄，導覽不混在一起。

## 目錄重點

- `index.html`: 根入口頁（卡片式書籍清單）
- `configs/*.yml`: 每本書一份 MkDocs 設定
- `docs/<book>/`: 各書 Markdown 內容
- `docs/assets/`: 共用資產來源（CSS / Mermaid / 字型 / 互動閱讀器）
- `templates/visual-story/`: 互動解說編寫範本與規則，不隨書發布
- `build-books.sh`: 一鍵建置所有書
- `serve-book.sh`: 單本即時預覽
- `sync-assets.sh`: 建置前同步共用資產到各書

三個腳本都會自動掃描 `configs/*.yml`。新增書時只要新增 `configs/<book>.yml` 與 `docs/<book>/`，不需改腳本。

## 初次使用

安裝 Python 3.10 以上版本與 `uv`，在 repo 根目錄執行 `uv sync`。全書建置入口與 JavaScript 檢查另需 Node.js；直接執行單本 MkDocs 建置不需要 Node.js，讀者開啟書籍也不需要安裝它。以下指令皆從 repo 根目錄執行。

## 常用指令（uv）

### 預覽書庫與拔刀轉場

```bash
bash build-books.sh
python3 -m http.server 8765 --bind 127.0.0.1
```

開啟 <http://127.0.0.1:8765/>。點書時以 Web Animations API 短促蓄勢，書頁就緒後由原生 View Transitions 出刀一次。切線從角色刀的位置穿過目標卡片，使用直線光效；載入時只捕捉透明定位框，不會凍結半截刀光。不攔截連結、不等待動畫完成。跨頁效果需瀏覽器支援與同源 HTTP(S)，直接開啟本機 HTML 時仍可正常進書。系統設定「減少動態效果」會停用動畫。

共用轉場樣式為 `docs/assets/book-transition.css`，由 `sync-assets.sh` 複製到各書；新書設定的 `extra_css` 需包含 `assets/book-transition.css`。

首頁選擇角色「隱藏」時，同時停用首頁的跨頁轉場：不出刀、不淡入淡出，也不等待動畫；只保留正常頁面載入時間。重新顯示角色便恢復切割效果。

書籍卡片採 A「朱砂薄璃」：紅色追光、薄玻璃亮邊，整合移入時掃過一次的刀光與藏印。分類／卷目按鈕採 B「琥珀液鏡」：暖金追光、雙層圓角亮邊與掃光，選中後保留琥珀底、朱紅卷號印與頂線；再點同一分類仍回到全部。玻璃只模糊背景，不扭曲文字，首頁保留純墨底，不帶入預覽用的折射襯景。

鍵盤聚焦也有回饋，觸控裝置輕點直接操作；減少動態模式只保留靜態高亮，不追光、不掃光。效果獨立於角色顯示，不攔截點擊、不等待動畫。刀光藏印樣式位於 `css/book-hover.css`，玻璃樣式與共用追光邏輯位於 `css/catalog-glass.css`、`js/catalog-glass.js`；裝飾由 `js/books-app.js` 隨卡片與分類產生，不依賴 playground 或外部套件。未懸停／聚焦時不啟用背景濾鏡，不支援背景模糊時使用墨色底。

導覽邏輯檢查：`node tools/check-book-transition.cjs`。手動驗收：一般點擊、Command／Ctrl 點擊、Enter 開書、返回後再點、搜尋後開書，以及角色「隱藏」和系統減少動畫模式。

追光邏輯檢查：`node tools/check-catalog-glass.cjs`。視覺驗收另檢查卡片與分類移入／移出、分類選中後移開滑鼠、再次點擊取消、鍵盤聚焦、搜尋重繪與手機輕點。

### 預覽單一本書

```bash
./serve-book.sh cowos
```

書名是 `configs/` 中 YAML 的檔名（不含 `.yml`），例如 `cowos`、`gpu`。此指令會先同步共用資產，再啟動 MkDocs；開啟終端顯示的網址。

### 建置全部

```bash
./build-books.sh
```

先檢查首頁卡片登錄，再同步資產並完整建置所有書籍。卡片路徑無效、重複登錄、缺少對應 config 或 docs 目錄會阻擋建置；有 config 但尚未列於首頁只提醒，允許草稿書籍。

不再使用 `.build-hash` 跳過建置，避免漏掉共用版型或工具版本變更；既有 stamp 留在磁碟也不會被讀取或更新。建置失敗會立即回傳失敗，但已寫出的部分輸出不會回滾，不可當成成功交付。平時只改一本書可用下方的單本指令。

```bash
node tools/check-books.cjs             # 檢查目前的首頁登錄
node tools/check-books.cjs --self-test # 檢查錯誤／提醒規則
node tools/check-build-books.cjs       # 建置入口回歸檢查（隔離替身）
```

### 建置單一本

```bash
bash sync-assets.sh
uv run mkdocs build -f configs/cowos.yml
```

## 章節互動解說

互動解說是章節的補充教材，不取代 Markdown。以連結開啟獨立 HTML，可使用逐步圖解、預測題或主題自己的 Canvas / 3D；翻頁、縮圖和可釘選索引由共用閱讀器負責。

先開啟 [三頁範本](templates/visual-story/index.html) 試讀，再依 [建立規則](templates/visual-story/README.md) 新增主題：

1. 複製範本的 `index.html`、`story.js`、`story.css` 到 `docs/<book>/resources/<topic>/`，不要複製 README。
2. 將 HTML 兩處 `../../docs/assets/story-reader/` 改成 `../../assets/story-reader/`。
3. 修改主題內容、標題與返回章節連結，在 Markdown 加入相對連結。
4. 執行 `bash sync-assets.sh` 和單本建置，檢查進入解說與返回章節的路徑。

共用閱讀器只修改 `docs/assets/story-reader/`，同步腳本會複製到每本書的 `assets/story-reader/`。各書資產副本與建置輸出都不提交 Git；主題原始碼與正式範本則提交。正式書籍不得引用 `playground/` 或 `templates/`，也不必在 MkDocs 的 `extra_javascript` 載入閱讀器，它只由互動頁載入。

### 驗證與修改

```bash
node tools/check-story-reader.cjs
uv run python tools/check-story-package.py
```

前者依真實範本標記建立 DOM stub，缺少必要外殼節點或重複 ID 會失敗，並檢查翻頁、釘選、題目點擊和互動清理；後者暫存兩個主題、實際 MkDocs 建置並搬移輸出，確認共用閱讀器與相對連結可攜。這些不是瀏覽器視覺驗收，新主題仍需手動檢查窄螢幕、鍵盤操作與預覽。

改單一主題只改它的檔案；改共用閱讀器後重新同步並建置。`serve-book.sh` 只在啟動時同步，共用來源變更不會自動同步到正在預覽的書。新增 Three.js 等依賴前，先看範本的掛載、清理與靜態預覽規則。

## 輸出位置

每本書輸出到：`book/<book>/html/index.html`

例如：`book/cowos/html/index.html`

### 單本交付

交付整個 `book/<book>/html/`，不是只交付 `index.html`。主題在 `resources/`，共用閱讀器在 `assets/story-reader/`；同一本書的所有主題只共用一份，搬移後不需要原始 repo。

可攜不代表完全離線或一定能雙擊使用：

- CDN 套件不會自動下載。Three.js、Mermaid 等若需離線使用，須把固定版本及其依賴一起本地化，並保留授權資訊。
- 「返回書架」若指向書籍目錄外，獨立交付前應調整或隱藏；返回本章則使用書內相對路徑。
- 含 JS module、fetch 或模型載入的主題，以 HTTP 預覽驗證，不以雙擊 HTML 作為唯一驗收方式。

例如只提供單本書的 HTTP 預覽：

```bash
python3 -m http.server 8765 --bind 127.0.0.1 --directory book/cowos/html
```

開啟 <http://127.0.0.1:8765/>，確認不依賴書籍目錄之外的資源；離線交付再斷網測試。圖片、影片與 3D 模型按需加入，不保存逐頁縮圖或重複的套件副本。

## 書籍配色與深淺模式

所有正式書籍採用 **墨朱（深色）／和紙朱印（淺色）**，以墨黑頁首與朱紅細線銜接書庫首頁。首次開啟依系統偏好選擇，之後保留 Material 原有的手動切換與記憶功能。

共用來源是 `docs/assets/book-palette.css`，由 `sync-assets.sh` 同步到每本書；不要修改各書的資產副本或生成的 `custom.css`。新書的 `extra_css` 加入 `assets/book-palette.css`（放在 `assets/custom.css` 之後、書籍專用樣式之前），並沿用現有書籍的 `theme.palette`：`primary`、`accent` 均為 `custom`，深色 `scheme: slate`、淺色 `scheme: default`。保留這兩個 Material 名稱與各書原有的排列順序，是為了相容已儲存的閱讀偏好；「墨朱／和紙朱印」是顯示名稱。

配色涵蓋導覽、正文、表格、程式碼、提示框、搜尋與 Material 原生 Mermaid 圖表；保留各書既有字型與版型。圖片、獨立互動資源，以及使用專用渲染器的白底圖表仍保留自己的色彩，不做全頁反色。

修改共用配色後重新同步並建置；檢查設定與文字對比：`node tools/check-book-palettes.cjs`。

入口視覺採煤黑、猩紅與暖白的編號書目，角色素材由內建 imagegen 生成，提示詞與來源見 [素材說明](docs/assets/characters/raster/archivist-scarlet.md)。顯示設定可切換角色與字型；手機海報捲離後縮小角色。
