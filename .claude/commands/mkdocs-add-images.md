# Add Images to MkDocs Book

Add one or more images to pages in an existing MkDocs book under `docs/<folder>/`. Read the `Variables`, follow the `Instructions` as guardrails, execute the `Workflow` in order, then report per the `Report` section.

## Variables

image_request: $ARGUMENTS
docs_dir: `docs/<folder>/`
config_file: `configs/<folder>.yml`
credits_page: `docs/<folder>/99-image-credits.md`
filepath_url: `https://commons.wikimedia.org/wiki/Special:FilePath/<Filename>?width=<W>`
build_cmd: `uv run mkdocs build -f configs/<folder>.yml`

From `image_request`, extract: target book folder (e.g. `gpu`, `tsmc`, `cs224r-deep-rl`), target page(s) (specific `.md` files or "all pages"), and topic/keywords. If the folder is missing, list `configs/*.yml` and ask which book.

## Instructions

- Images must use the Wikimedia Commons `Special:FilePath` API (`filepath_url`) — never hotlink `upload.wikimedia.org` directly (returns 403 / 400).
- Standard widths: `400`, `500`, `600`. Never use `upload.wikimedia.org/.../NNNpx-...` unless NNN is an exact Wikimedia standard size (250, 330, 500, 960…).
- Always append a `99-image-credits.md` citation entry for every image added.
- Alt text: short English description (for screen readers). Caption (`*...*`): Traditional Chinese, explaining what the reader should notice.
- One blank line before and after each image block. No more than **2 images per section** (keep pages readable).

### Image URL quick reference

| Format | Use |
|--------|-----|
| `https://commons.wikimedia.org/wiki/Special:FilePath/File.jpg?width=500` | ✅ Standard — always works |
| `https://upload.wikimedia.org/wikipedia/commons/thumb/.../500px-File.jpg` | ✅ Only if width is exactly 250/330/500/960 |
| `https://upload.wikimedia.org/wikipedia/commons/thumb/.../600px-File.jpg` | ❌ Non-standard size — blocked with 400 error |

## Workflow

1. **Discover existing pages** — read `config_file` for the nav, then read the target `.md` files under `docs_dir` to find sections lacking images.
2. **Find relevant images on Wikimedia Commons** — search Wikipedia articles and Commons categories for the topic. Use `web_fetch` on relevant pages to discover embedded filenames:
   - `https://en.wikipedia.org/wiki/<Topic>`
   - `https://commons.wikimedia.org/wiki/Category:<Topic>`
   - Look for lines like `[![alt](//upload.wikimedia.org/.../250px-FILENAME.ext)]` and extract only the **canonical filename** (e.g. `Reflow_oven.jpg`).
3. **Verify the image URL works** using `filepath_url` with a standard width.
4. **Insert images into markdown** immediately after the heading or paragraph they illustrate:
   ```markdown
   ![alt text](https://commons.wikimedia.org/wiki/Special:FilePath/Filename.jpg?width=500)
   *繁體中文說明：一句話說明圖片內容與閱讀重點。*
   ```
5. **Update the credits page** — if `credits_page` doesn't exist, create it. Append a row per image:
   ```markdown
   | <描述> | <頁面> | `<Filename>` | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Commons](https://commons.wikimedia.org/wiki/File:<Filename>) |
   ```
   If `99-image-credits.md` is not yet in `config_file` nav, add it as the last nav entry:
   ```yaml
     - 圖片來源與版權聲明: 99-image-credits.md
   ```
6. **Build and verify** with `build_cmd`.

## Examples

- `hermes-agent — 幫 architecture.md 添加示意圖`
- `gpu — 為所有頁面補充 GPU 架構示意圖`
- `tsmc — 在製程節點頁面加晶圓廠照片`

## Report

Report each image added (filename, target page), credits-page updates, nav changes, and the build result.
