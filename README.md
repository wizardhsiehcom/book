# 技術讀書筆記（MkDocs）

此專案已改為 **MkDocs 多書獨立站點**：每本書各自一個設定檔與輸出目錄，導覽不混在一起。

## 目錄重點

- `index.html`: 根入口頁（卡片式書籍清單）
- `configs/*.yml`: 每本書一份 MkDocs 設定
- `docs/<book>/`: 各書 Markdown 內容
- `docs/assets/`: 共用資產來源（CSS / Mermaid / 字型）
- `build-books.sh`: 一鍵建置所有書
- `serve-book.sh`: 單本即時預覽
- `sync-assets.sh`: 建置前同步共用資產到各書

三個腳本都會自動掃描 `configs/*.yml`。新增書時只要新增 `configs/<book>.yml` 與 `docs/<book>/`，不需改腳本。

## 常用指令（uv）

### 預覽書庫與拔刀轉場

```bash
bash build-books.sh
python3 -m http.server 8765 --bind 127.0.0.1
```

開啟 <http://127.0.0.1:8765/>。點書時以 Web Animations API 短促蓄勢，書頁就緒後由原生 View Transitions 出刀一次。切線從角色刀的位置穿過目標卡片，使用直線光效；載入時只捕捉透明定位框，不會凍結半截刀光。不攔截連結、不等待動畫完成。跨頁效果需瀏覽器支援與同源 HTTP(S)，直接開啟本機 HTML 時仍可正常進書。系統設定「減少動態效果」會停用動畫。

共用轉場樣式為 `docs/assets/book-transition.css`，由 `sync-assets.sh` 複製到各書；新書設定的 `extra_css` 需包含 `assets/book-transition.css`。

導覽邏輯檢查：`node tools/check-book-transition.cjs`。手動驗收：一般點擊、Command／Ctrl 點擊、Enter 開書、返回後再點、搜尋後開書，以及角色「隱藏」和系統減少動畫模式。

### 預覽單一本書

```bash
./serve-book.sh cowos
```

可用書名：`cowos`、`gpu`、`hack100`、`nvidia`、`semi-jobs`、`tsmc`

### 建置全部

```bash
./build-books.sh
```

### 建置單一本

```bash
uv run mkdocs build -f configs/cowos.yml
```

## 輸出位置

每本書輸出到：`book/<book>/html/index.html`

例如：`book/cowos/html/index.html`

## Dark Mode 重用

所有 `configs/*.yml` 已內建 Material 的亮暗切換按鈕（預設依系統深色偏好），新書可直接沿用同一段 `theme.palette` 設定。

入口視覺採煤黑、猩紅與暖白的編號書目，角色素材由內建 imagegen 生成，提示詞與來源見 [素材說明](docs/assets/characters/raster/archivist-scarlet.md)。顯示設定可切換角色與字型；手機海報捲離後縮小角色。
