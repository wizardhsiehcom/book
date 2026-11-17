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
# 平行建置：JOBS 可覆寫（預設 4 本）；每本輸出整段緩衝後再印，避免交錯。
jobs="${JOBS:-4}"
printf '%s\0' "${configs[@]}" | xargs -0 -n1 -P "$jobs" bash -c '
  book="$(basename "$1" .yml)"
  if out="$(uv run mkdocs build -f "$1" 2>&1)"; then
    # MkDocs 的字型複本改為相對 symlink；Git Bash 須明確要求原生連結。
    # 先建暫存連結再替換；連結失敗時保留 MkDocs 的複本。
    fonts="book/$book/html/assets/fonts"
    for f in "$fonts"/*; do
      s="docs/assets/fonts/${f##*/}"
      if [[ -f "$s" ]]; then
        MSYS="${MSYS:-} winsymlinks:nativestrict" ln -s "../../../../../$s" "$f.symlink" 2>/dev/null &&
          mv -f "$f.symlink" "$f" || rm -f "$f.symlink"
      fi
    done
    echo "Building $book... ok"
  else
    printf "Building %s... FAILED\n%s\n" "$book" "$out" >&2
    exit 1
  fi
' _ || { echo "Some books failed to build." >&2; exit 1; }

echo "Done. Outputs are under book/<book>/html/"
