# Create MkDocs Book

Create a new standalone MkDocs book under `docs/<folder-name>/` + `configs/<folder-name>.yml`. Read the `Variables`, follow the `Instructions` as guardrails, execute the `Workflow` in order, then report per the `Report` section.

> Shared conventions: Before writing content, read `.claude/commands/mkdocs-update.md` and `CLAUDE.md`. All conventions there apply here too.

## Variables

creation_brief: $ARGUMENTS
docs_dir: `docs/<folder-name>/`
config_file: `configs/<folder-name>.yml`
build_cmd: `uv run mkdocs build -f configs/<folder-name>.yml`

From `creation_brief`, extract: book title, folder name, source materials, writing angle, output language. If title or folder name is missing, ask before generating files.

## Instructions

- All conventions from `.claude/commands/mkdocs-update.md` and `CLAUDE.md` apply.
- Write original prose only (no verbatim copyrighted passages).
- Keep one concept per page and add relative cross-links.
- Add Mermaid diagrams only where they improve clarity.
- Goal: a new standalone book that stores pages under `docs_dir`, has one dedicated `config_file`, builds to `book/<folder-name>/html/`, and is launchable from the root `index.html`.

## Codebase Structure

```
docs/<folder-name>/        # page content (.md) — you create this
configs/<folder-name>.yml  # dedicated config + nav — you create this
book/<folder-name>/html/   # build output (git-ignored)
index.html                 # launcher (add a .card here)
```

## Workflow

1. **Inspect source and existing folders**
   - Read the user-provided materials.
   - If `docs_dir` already exists, ask whether to update or pick another name.
2. **Initialize content folder**
   - Create `docs_dir` with a `README.md` entry page.
   - Create first-pass chapter pages (prefer 5–12 pages unless the user asks for larger scope).
3. **Create dedicated config** `config_file` (paths are relative to the config file in `configs/`):
   - `docs_dir: ../docs/<folder-name>`
   - `site_dir: ../book/<folder-name>/html`
   - include shared theme/extensions and a nav containing only this book.
4. **Add content** following the Instructions above.
5. **Sync shared assets** — run `./sync-assets.sh` to populate `docs/<folder-name>/assets/` (required before manual build).
6. **Images (optional)** — add via `.claude/commands/mkdocs-add-images.md` (remote Wikimedia Commons URLs).
7. **Build and verify** with `build_cmd` (or `./build-books.sh` to rebuild everything). Report errors if any.
8. **Register in launcher** — update `index.html` by adding a `.card` before `<!-- 新增書籍時在此複製一個 .card 區塊 -->`, linking to `book/<folder-name>/html/index.html`.

## Examples

- `建立《Designing Data-Intensive Applications》的 MkDocs 版，資料夾 ddia`
- `根據 data/some-book.pdf 建一本文檔站，聚焦 AI infra`
- `用我提供的筆記建立新書，繁體中文`

## Report

Report the folder name, pages created, config path, build result, and the launcher card added.
