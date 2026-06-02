Update an existing standalone MkDocs book under `D:\book\newbook\`.

## Instructions

1. **Identify the target book**
   - If `$ARGUMENTS` names a folder (e.g. `hack100`), target paths are:
     - `D:\book\newbook\docs\<folder>\`
     - `D:\book\newbook\configs\<folder>.yml`
   - If no folder is given, list `D:\book\newbook\configs\*.yml` and ask which one.

2. **Read** `D:\book\newbook\configs\<folder>.yml` to understand nav.

3. **Interpret the update request**: `$ARGUMENTS`
   - If it names an existing page, update that page.
   - If it requests new content, create new `.md` file(s) under `docs\<folder>\` and add them to that book's nav in `configs\<folder>.yml`.
   - If it only names a book with no task detail, ask what to update.

4. **Edit or create** markdown under `D:\book\newbook\docs\<folder>\`. Use Mermaid diagrams when useful.

5. If adding a new page, insert it into `configs\<folder>.yml` nav under the most relevant section.

6. **Sync assets and rebuild** the book:
   ```
   cd D:\book\newbook && bash ./sync-assets.sh
   cd D:\book\newbook && uv run mkdocs build -f configs\<folder>.yml
   ```
   To preview locally:
   ```
   cd D:\book\newbook && bash ./serve-book.sh <folder>
   ```
   Report success or errors.

## Conventions

- All prose in Traditional Chinese (繁體中文) unless the user writes in English.
- **No notebook references**: never mention specific notebook filenames, cell numbers, or cell indices (e.g. "在 Cell 3 中…", "執行 benchmark.ipynb 第 7 個 cell"). Notebooks are revised frequently; describe concepts and steps directly instead.
- Diagrams: prefer `flowchart`, `sequenceDiagram`, or `graph` depending on what best represents the concept.
- No inline HTML — keep everything in standard Markdown + Mermaid.
- Keep pages focused: one concept per page, cross-link with relative paths when referencing other pages.

## Mermaid v11 Rules (strictly enforced)

- **Subgraph labels** containing spaces, Chinese characters, parentheses, or commas **must be quoted**: `subgraph "My Label（說明）"` — bare labels cause "Syntax error in text".
- **Node label line breaks**: use `<br/>` inside bracket syntax, never `\n`. Example: `A["line one<br/>line two"]`.
- **Node labels with special chars** (colons, parentheses, `+`, `×`): wrap in double quotes inside the brackets: `A["Conv+BN+ReLU<br/>單一 Kernel"]`.
- Test mentally: if a label has any character outside `[A-Za-z0-9_]`, add quotes.
