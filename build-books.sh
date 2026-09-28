#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

node tools/check-books.cjs
bash ./sync-assets.sh

shopt -s nullglob
configs=(configs/*.yml)

if [[ ${#configs[@]} -eq 0 ]]; then
  echo "No config files found under configs/*.yml"
  exit 1
fi

# 全量建置：不維護不完整的依賴指紋；舊 .build-hash 不再讀寫。
for config in "${configs[@]}"; do
  book="$(basename "$config" .yml)"
  echo "Building $book..."
  uv run mkdocs build -f "$config"
done

echo "Done. Outputs are under book/<book>/html/"
