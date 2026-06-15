# Update MkDocs Book

Update an existing standalone MkDocs book under `book/`. Read the `Variables`, follow the `Instructions` as guardrails, execute the `Workflow` in order, then report per the `Report` section.

## Variables

update_request: $ARGUMENTS
docs_dir: `book/docs/<folder>/`
config_file: `book/configs/<folder>.yml`
build_cmd: `cd book && uv run --with mkdocs-material mkdocs build -f configs/<folder>.yml`
serve_cmd: `cd book && uv run --with mkdocs-material mkdocs serve -f configs/<folder>.yml`

## Instructions

- All prose in Traditional Chinese (繁體中文) unless the user writes in English.
- **No notebook references**: never mention specific notebook filenames, cell numbers, or cell indices (e.g. "在 Cell 3 中…", "執行 benchmark.ipynb 第 7 個 cell"). Notebooks are revised frequently; describe concepts and steps directly instead.
- Diagrams: prefer `flowchart`, `sequenceDiagram`, or `graph` depending on what best represents the concept. Add Mermaid only where it improves clarity.
- No inline HTML — keep everything in standard Markdown + Mermaid.
- Keep pages focused: one concept per page, cross-link with relative paths when referencing other pages.
- Do not edit other books' config or content files unless the user asks.

### Mermaid v11 Rules (strictly enforced)

- **Subgraph labels** containing spaces, Chinese characters, parentheses, or commas **must be quoted**: `subgraph "My Label（說明）"` — bare labels cause "Syntax error in text".
- **Node label line breaks**: use `<br/>` inside bracket syntax, never `\n`. Example: `A["line one<br/>line two"]`.
- **Node labels with special chars** (colons, parentheses, `+`, `×`): wrap in double quotes inside the brackets: `A["Conv+BN+ReLU<br/>單一 Kernel"]`.
- Test mentally: if a label has any character outside `[A-Za-z0-9_]`, add quotes.

## Codebase Structure

```
book/
├── docs/<folder>/        # page content (.md) for this book
├── configs/<folder>.yml  # this book's dedicated config + nav
├── book/<folder>/html/   # build output
└── index.html            # launcher
```

## Workflow

1. **Identify the target book**
   - If `update_request` names a folder (e.g. `hermes-agent`), use `docs_dir` and `config_file`.
   - If no folder is given, list `book/configs/*.yml` and ask which one.
2. **Read** `config_file` to understand the nav.
3. **Interpret the update request**:
   - If it names an existing page, update that page.
   - If it requests new content, create new `.md` file(s) under `docs_dir` and add them to this book's nav in `config_file`.
   - If it only names a book with no task detail, ask what to update.
4. **Edit or create** markdown under `docs_dir`.
5. If adding a new page, insert it into `config_file` nav under the most relevant section.
6. **Rebuild** with `build_cmd` (or `bash book/build.sh`). To preview locally, use `serve_cmd`.

## Examples

- `hermes-agent — 更新 architecture.md 的快取段落`
- `gpu — 新增一頁講 NVLink`

## Report

Report which pages were edited/created, whether nav changed, and the build result (success or errors).
