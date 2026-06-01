Update an existing mdBook under `D:\book\book\`.

## Instructions

1. **Identify the target book**
   - If `$ARGUMENTS` names a book folder (e.g. `hack100`), the target is `D:\book\book\<folder>\`.
   - If `$ARGUMENTS` does not name a folder, list the subdirectories inside `D:\book\book\` and ask the user which book to update.

2. **Read** `<target>\src\SUMMARY.md` to understand the current structure.

3. **Interpret the update request**: `$ARGUMENTS`
   - If the argument names an existing page (e.g. "preprocessing", "results"), update that page.
   - If the argument describes new content (e.g. "add a page about INT8 calibration"), create the new `.md` file and add it to `SUMMARY.md`.
   - If no argument is given beyond the book name, ask the user what they want to update.

4. **Edit or create** the relevant markdown file(s) under `<target>/src/`. Use Mermaid diagrams where they help explain concepts — wrap them in ` ```mermaid ` blocks.

5. If adding a new page, insert it into `SUMMARY.md` under the most relevant section.

6. **Rebuild** the book by running:
   ```
   cd <target> && mdbook build
   ```
   Report success or any errors.

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
