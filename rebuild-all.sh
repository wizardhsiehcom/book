#!/usr/bin/env bash
# Rebuild all mdBook projects under book/
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
BOOKS_DIR="$REPO_ROOT/book"
FAILED=()

for book_dir in "$BOOKS_DIR"/*/; do
    name="$(basename "$book_dir")"
    # Skip the template
    if [[ "$name" == "template" ]]; then
        continue
    fi
    # Ensure mermaid.min.js is present
    if [[ ! -f "$book_dir/mermaid.min.js" ]]; then
        cp "$BOOKS_DIR/template/mermaid.min.js" "$book_dir/mermaid.min.js"
        echo "  ℹ Copied missing mermaid.min.js to $name"
    fi
    echo "▶ Building $name ..."
    if (cd "$book_dir" && mdbook build); then
        echo "  ✓ $name"
    else
        echo "  ✗ $name (FAILED)"
        FAILED+=("$name")
    fi
done

echo ""
if [[ ${#FAILED[@]} -eq 0 ]]; then
    echo "✅ All books built successfully."
else
    echo "❌ Failed books: ${FAILED[*]}"
    exit 1
fi
