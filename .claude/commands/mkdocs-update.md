# Update MkDocs Book

Update an existing standalone MkDocs book under `docs/<folder>/` + `configs/<folder>.yml`. Read the `Variables`, follow the `Instructions` as guardrails, execute the `Workflow` in order, then report per the `Report` section.

## Variables

update_request: $ARGUMENTS
docs_dir: `docs/<folder>/`
config_file: `configs/<folder>.yml`
build_cmd: `uv run mkdocs build -f configs/<folder>.yml`
serve_cmd: `./serve-book.sh <folder>`

## Instructions

- Content conventions and Mermaid rules: follow `CLAUDE.md` (canonical, do not restate here).
- Do not edit other books' config or content files unless the user asks.

## Codebase Structure

```
docs/<folder>/        # page content (.md) for this book
configs/<folder>.yml  # this book's dedicated config + nav
book/<folder>/html/   # build output (git-ignored)
index.html            # launcher
```

## Workflow

1. **Identify the target book**
   - If `update_request` names a folder (e.g. `cs224r-deep-rl`), use `docs_dir` and `config_file`.
   - If no folder is given, list `configs/*.yml` and ask which one.
2. **Read** `config_file` to understand the nav.
3. **Interpret the update request**:
   - If it names an existing page, update that page.
   - If it requests new content, create new `.md` file(s) under `docs_dir` and add them to this book's nav in `config_file`.
   - If it only names a book with no task detail, ask what to update.
4. **Edit or create** markdown under `docs_dir`.
5. If adding a new page, insert it into `config_file` nav under the most relevant section.
6. **Sync assets** with `./sync-assets.sh` (required before a manual build), then **rebuild** with `build_cmd` (or `./build-books.sh`). To preview locally, use `serve_cmd`.

## Examples

- `hermes-agent — 更新 architecture.md 的快取段落`
- `gpu — 新增一頁講 NVLink`

## Report

Report which pages were edited/created, whether nav changed, and the build result (success or errors).
