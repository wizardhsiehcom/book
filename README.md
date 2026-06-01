# book

個人閱讀筆記知識庫，以 [mdBook](https://rust-lang.github.io/mdBook/) 建立，每本書各自一份可瀏覽的靜態網站。

## 結構

```
book/
├── template/          # 新書模板（book.toml、Mermaid assets、CSS）
├── hack100/           # Binary Hacks 精讀筆記：AI 時代的底層觀念
│   ├── book.toml
│   ├── src/           # Markdown 原始頁面
│   └── html/          # Build 輸出（git ignored）
└── ...                # 未來書籍
data/                  # 來源 PDF 等素材（git ignored）
.claude/commands/      # Claude commands
```

## 現有書籍

| 資料夾 | 書名 | 說明 |
|--------|------|------|
| `hack100` | Binary Hacks 精讀筆記 | 從 AI 工程角度重組，聚焦底層觀念 |

## 快速開始

**Prerequisites**：[mdBook](https://github.com/rust-lang/mdBook)、[mdbook-mermaid](https://github.com/badboy/mdbook-mermaid)

```powershell
# Build 某本書
cd book\hack100
mdbook build

# 本地預覽（port 9000）
mdbook serve --port 9000 --open
```

**啟動書庫**：直接用瀏覽器開啟 `index.html`，點選任一本書即可閱讀（不需 server）。

## 建立新書

使用 Claude command：

```
/mdbook-create <書名或資料夾名稱>
```

流程：從 `book/template/` 複製模板 → 填入架構 → 補充細節 → `mdbook build`。

## Claude Commands

| Command | 說明 |
|---------|------|
| `/mdbook-create` | 建立新書（從 template 初始化） |
| `/mdbook-update` | 更新現有書籍的頁面或新增章節 |
| `/mdbook-theme` | 調整 mdBook 主題與 CSS |
