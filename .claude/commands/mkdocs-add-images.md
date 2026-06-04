Add one or more images to pages in an existing MkDocs book under `D:\book\docs\<folder>\` or `D:\book\newbook\docs\<folder>\`.

> Images must use the Wikimedia Commons Special:FilePath API — never hotlink `upload.wikimedia.org` directly (returns 403 / 400).
> Always append a `99-image-credits.md` citation entry for every image added.

## Interpret the user request

Treat `$ARGUMENTS` as the image request. Extract:

- **Target book folder** — e.g. `smt-bonding`, `gpu`, `tsmc`
- **Target page(s)** — specific `.md` files, or "all pages"
- **Topic / keywords** — what kind of images to find

If folder is missing, list `D:\book\configs\*.yml` (and `D:\book\newbook\configs\*.yml`) and ask which book.

---

## Step-by-step instructions

### 1. Discover existing pages

Read `D:\book\configs\<folder>.yml` (or `newbook\configs`) to get the nav.
Read the target `.md` files to understand the current content and identify sections that lack images.

### 2. Find relevant images on Wikimedia Commons

Search Wikipedia articles and Commons categories related to the topic.
Use `web_fetch` on relevant Wikipedia pages to discover image filenames embedded in the article HTML:

```
https://en.wikipedia.org/wiki/<Topic>
```

Look for lines like:
```
[![alt](//upload.wikimedia.org/wikipedia/commons/thumb/.../250px-FILENAME.ext)]
```
Extract only the **canonical filename** (e.g. `Reflow_oven.jpg`).

**Useful Commons categories to explore:**
- `https://en.wikipedia.org/wiki/<Topic>`
- `https://commons.wikimedia.org/wiki/Category:<Topic>`

### 3. Verify the image URL works

Always use the **Special:FilePath** format:

```
https://commons.wikimedia.org/wiki/Special:FilePath/<Filename>?width=<W>
```

- Standard widths: `400`, `500`, `600` (pixels)
- Never use `upload.wikimedia.org/wikipedia/commons/thumb/.../NNNpx-...` — this gets blocked unless NNN is an exact Wikimedia standard size (250, 330, 500, 960…)

### 4. Insert images into markdown

Place images immediately **after the relevant heading or paragraph** they illustrate.
Use this format:

```markdown
![alt text](https://commons.wikimedia.org/wiki/Special:FilePath/Filename.jpg?width=500)
*繁體中文說明：一句話說明圖片內容與閱讀重點。*
```

Rules:
- Alt text: short English description (used by screen readers)
- Caption (`*...*`): Traditional Chinese, explain what the reader should notice
- One blank line before and after the image block
- Do not insert more than **2 images per section** (keep pages readable)

### 5. Update the image credits page

Every book should have a `99-image-credits.md`. If it doesn't exist, create one.

Append a row to the credits table for each image added:

```markdown
| <描述> | <頁面> | `<Filename>` | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Commons](https://commons.wikimedia.org/wiki/File:<Filename>) |
```

If `99-image-credits.md` is not yet in the book's nav (`configs/<folder>.yml`), add it as the last nav entry:

```yaml
  - 圖片來源與版權聲明: 99-image-credits.md
```

### 6. Build and verify

```
cd D:\book && uv run mkdocs build -f configs\<folder>.yml
```

(Or `newbook\configs\<folder>.yml` for newbook.)

Report build success or errors.

---

## Image URL quick reference

| Format | Use |
|--------|-----|
| `https://commons.wikimedia.org/wiki/Special:FilePath/File.jpg?width=500` | ✅ Standard — always works |
| `https://upload.wikimedia.org/wikipedia/commons/thumb/.../500px-File.jpg` | ✅ Only if width is exactly 250/330/500/960 |
| `https://upload.wikimedia.org/wikipedia/commons/thumb/.../600px-File.jpg` | ❌ Non-standard size — blocked with 400 error |

---

## Example requests

- `smt-bonding — 幫 03-hot-bar.md 添加更多熱壓設備的圖`
- `gpu — 為所有頁面補充 GPU 架構示意圖`
- `tsmc — 在製程節點頁面加晶圓廠照片`
