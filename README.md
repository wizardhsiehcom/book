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
