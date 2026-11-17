#!/usr/bin/env bash
# 產生可單獨帶走的一本書：dist/<book>/，字型是真實檔案，不依賴 repo 內的連結。
set -euo pipefail

cd "$(dirname "$0")"

if [[ $# -ne 1 || ! -f "configs/$1.yml" ]]; then
  echo "Usage: ./deliver-book.sh <book>   (book = configs/<book>.yml 的檔名)"
  exit 1
fi

book="$1"
# pwd -W：Git Bash 下給 Windows 形式的絕對路徑；其他系統沒有 -W 就用一般 pwd。
dest="$(pwd -W 2>/dev/null || pwd)/dist/$book"

bash ./sync-assets.sh
# 直接建到 dist/：MkDocs 複製檔案時會寫出真實內容，book/ 裡的全局輸出不受影響。
uv run mkdocs build -f "configs/$book.yml" -d "$dest"

echo "Done. Standalone copy: dist/$book/"
