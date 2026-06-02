Create a new MkDocs book workspace entry under `D:\book\newbook\`.

> Shared conventions: Before writing content, read `D:\book\.claude\commands\mkdocs-update.md`. All conventions and Mermaid rules there apply here too.

## Goal

Turn a source book or learning resource into a new standalone MkDocs book that:

- stores pages under `D:\book\newbook\docs\<folder-name>\`
- has one dedicated config file `D:\book\newbook\configs\<folder-name>.yml`
- builds to `D:\book\newbook\book\<folder-name>\html\`
- is launchable from `D:\book\index.html`

## Interpret the user request

Treat `$ARGUMENTS` as the creation brief. Extract:

- book title
- folder name
- source materials
- writing angle
- output language

If title or folder name is missing, ask before generating files.

## Instructions

1. Inspect source and existing folders
   - Read the user-provided materials.
   - If `D:\book\newbook\docs\<folder-name>\` already exists, ask whether to update or create another name.

2. Initialize MkDocs content folder
   - Create `D:\book\newbook\docs\<folder-name>\`.
   - Create `README.md` as the entry page.
   - Create first-pass chapter pages (prefer 5 to 12 pages unless user asks larger scope).

3. Create dedicated MkDocs config
   - Add `D:\book\newbook\configs\<folder-name>.yml`.
   - Keep this pattern:
     - `docs_dir: ../docs/<folder-name>`
     - `site_dir: ../book/<folder-name>/html`
     - include shared theme/extensions and a nav that only contains this book.

4. Add content
   - Write original prose only (no verbatim copyrighted passages).
   - Keep one concept per page and add relative links.
   - Add Mermaid diagrams only where they improve clarity.

5. Ensure assets are ready
   - Use `bash ./sync-assets.sh` in `D:\book\newbook` to sync shared assets for this book.

6. Build and verify
   - Run:
     - `cd D:\book\newbook && uv run mkdocs build -f configs\<folder-name>.yml`
   - Report errors if any.

7. Register in launcher
   - Update `D:\book\index.html` by adding a `.card` before `<!-- 新增書籍時在此複製一個 .card 區塊 -->`.
   - Link format must be:
     - `newbook/book/<folder-name>/html/index.html`

## Example requests

- `建立《Designing Data-Intensive Applications》的 MkDocs 版，資料夾 ddia`
- `根據 data\some-book.pdf 建一本文檔站，聚焦 AI infra`
- `用我提供的筆記建立新書，繁體中文`
