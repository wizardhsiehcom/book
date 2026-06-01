Create a new mdBook for another book, paper collection, or study source.

> **Shared conventions**: Before writing any content, read `skill:mdbook-update.md` (at `D:\book\.claude\commands\mdbook-update.md`). All Conventions and Mermaid v11 Rules defined there apply here too.

## Goal

Turn a source book or learning resource into a fresh mdBook project that starts with a strong information architecture and then fills in focused pages with original prose.

## Interpret the user's request

Treat `$ARGUMENTS` as the creation brief. Extract as many of these as possible:

- book title or source name
- folder name for the new book (used as the subdirectory name)
- source materials such as PDF, EPUB, notes, URLs, or an existing folder
- writing angle, such as study notes, technical summary, AI relevance, systems view, or teaching material
- output language

If the title or source material is missing and you cannot infer them safely, ask the user before writing files.

## Instructions

1. **Inspect the source**
   - Read the source materials the user named.
   - If a folder with the same name already exists under `D:\book\book\`, confirm whether to update in place or create a fresh book.

2. **Initialise from the book template**
   - The template lives at `D:\book\book\template\`.
   - Create the new book directory at `D:\book\book\<folder-name>\`.
   - Copy all files from the template into it:
     ```
     Copy-Item -Recurse -Path "D:\book\book\template\*" -Destination "D:\book\book\<folder-name>\"
     ```
   - Create the `src\` folder if not already present, then add:
     - `src\SUMMARY.md`
     - `src\README.md`
   - Edit `book.toml` to update the `title` field to the correct book title.

3. **Build the architecture first**
   - Before writing detailed pages, identify the major themes of the source.
   - Create a clean `SUMMARY.md` with focused sections and page titles.
   - Create the first set of stub pages so the structure is navigable immediately.
   - Prefer 5 to 12 pages for the first pass unless the user explicitly wants a larger structure.

4. **Then fill in the details**
   - Expand each page with original summaries, explanations, and cross-links.
   - Keep one concept per page.
   - Add Mermaid diagrams when they genuinely clarify the idea.
   - When useful, connect the source material to modern practice, tools, or adjacent topics named by the user.

5. **Handle copyrighted books safely**
   - Do not copy large passages from copyrighted books.
   - Do not translate the book verbatim into mdBook pages.
   - Use public metadata, chapter titles, user-provided notes, and your own original prose.
   - If OCR or text extraction quality is poor, say so and reconstruct the structure from available evidence instead of inventing precise claims.
   - It is fine to add a short copyright or sources appendix when the material comes from a published book.

6. **Rebuild the book**
   - Run:
     ```
     cd D:\book\book\<folder-name> && mdbook build
     ```
   - To preview locally: `mdbook serve --port 9000 --open`
   - Report success or any errors.

7. **Register the book in the launcher**
   - Open `D:\book\index.html`.
   - Copy an existing `.card` block and update the `href`, icon, title, description, and tag to match the new book.
   - Insert it before the `<!-- 新增書籍時在此複製一個 .card 區塊 -->` comment.

## Recommended output shape

Unless the user asks for a different structure, aim for:

- `README.md` as the introduction and reading guide
- `SUMMARY.md` as the chapter map
- several focused concept pages
- optional appendices for tools, references, terminology, copyright, or source notes

## Good examples of requests

- `建立《Designing Data-Intensive Applications》的 mdBook，資料夾名稱 ddia，先做章節架構再補細節`
- `根據 data\some-book.pdf 建一本讀書 mdBook，重點放在現代 AI infra 的關聯`
- `用我提供的筆記與網址建立一本教學用 mdBook，語言用繁體中文`
