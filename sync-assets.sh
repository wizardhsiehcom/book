#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

src_assets="docs/assets"
if [[ ! -d "$src_assets" ]]; then
  echo "Missing shared assets directory: $src_assets"
  exit 1
fi

shopt -s nullglob
configs=(configs/*.yml)

if [[ ${#configs[@]} -eq 0 ]]; then
  echo "No config files found under configs/*.yml"
  exit 1
fi

for config in "${configs[@]}"; do
  book="$(basename "$config" .yml)"
  target="docs/$book/assets"
  mkdir -p "$target/fonts"

  cp "$src_assets/custom.css" "$target/custom.css"
  cp "$src_assets/mermaid-init.js" "$target/mermaid-init.js"
  cp "$src_assets/fonts/Cubic_11.woff" "$target/fonts/Cubic_11.woff"
  cp "$src_assets/fonts/Cubic_11.woff2" "$target/fonts/Cubic_11.woff2"
done

echo "Synced shared assets into docs/<book>/assets"
