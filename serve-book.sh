#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

shopt -s nullglob
configs=(configs/*.yml)

if [[ ${#configs[@]} -eq 0 ]]; then
  echo "No config files found under configs/*.yml"
  exit 1
fi

books=()
for config in "${configs[@]}"; do
  books+=("$(basename "$config" .yml)")
done

book_list="$(printf '%s|' "${books[@]}")"
book_list="${book_list%|}"

if [[ $# -ne 1 ]]; then
  echo "Usage: ./serve-book.sh <$book_list>"
  exit 1
fi

book="$1"
config="configs/$book.yml"

if [[ ! -f "$config" ]]; then
  echo "Unknown book: $book"
  echo "Available books: $book_list"
  exit 1
fi

bash ./sync-assets.sh

uv run mkdocs serve -f "$config"
