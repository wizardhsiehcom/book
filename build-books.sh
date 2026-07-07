#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

bash ./sync-assets.sh

shopt -s nullglob
configs=(configs/*.yml)

if [[ ${#configs[@]} -eq 0 ]]; then
  echo "No config files found under configs/*.yml"
  exit 1
fi


# ponytail: content-hash skip; delete book/<name>/.build-hash to force a rebuild
for config in "${configs[@]}"; do
  book="$(basename "$config" .yml)"
  stamp="book/$book/.build-hash"
  hash="$( (cat "$config"; find "docs/$book" -type f -print0 | sort -z | xargs -0 sha1sum) | sha1sum | cut -d' ' -f1 )"
  if [[ -d "book/$book/html" && -f "$stamp" && "$(cat "$stamp")" == "$hash" ]]; then
    echo "Skipping $book (unchanged)"
    continue
  fi
  echo "Building $book..."
  uv run mkdocs build -f "$config"
  echo "$hash" > "$stamp"
done

echo "Done. Outputs are under book/<book>/html/"
