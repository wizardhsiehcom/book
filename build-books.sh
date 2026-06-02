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

for config in "${configs[@]}"; do
  book="$(basename "$config" .yml)"
  echo "Building $book..."
  uv run mkdocs build -f "$config"
done

echo "Done. Outputs are under book/<book>/html/"
