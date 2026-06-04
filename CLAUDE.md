# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A personal reading-notes knowledge base made of independent [mdBook](https://rust-lang.github.io/mdBook/) projects. Each book lives at `book/<name>/` and builds to `book/<name>/html/` (git-ignored). `index.html` at the repo root is a card-grid launcher that links to all built books.

## Commands

```bash
# Build a specific book
cd book/<name> && mdbook build

# Serve locally (hot-reload, port 9000)
cd book/<name> && mdbook serve --port 9000 --open
```

**Prerequisites**: `mdBook` and `mdbook-mermaid` must be installed.

## Adding a new book

1. Copy the full `book/template/` directory to `book/<new-name>/`.
2. Update `title` in the new `book.toml`.
3. Create `src/SUMMARY.md` and `src/README.md`.
4. Register the book in `index.html` by copying an existing `.card` block before the `<!-- 新增書籍時在此複製一個 .card 區塊 -->` comment.

Or use the `/mkdocs-create` command to do all of this automatically.

## Content conventions

- **Language**: all prose in Traditional Chinese (繁體中文) unless the user writes in English.
- **One concept per page**; cross-link with relative paths.
- **No inline HTML** — standard Markdown + Mermaid only.
- Prefer `flowchart`, `sequenceDiagram`, or `graph` diagram types.

## Mermaid v11 rules (strictly enforced)

- Subgraph labels with spaces, Chinese characters, parentheses, or commas **must be quoted**: `subgraph "My Label（說明）"`.
- Line breaks inside node labels: use `<br/>`, never `\n`. Example: `A["line one<br/>line two"]`.
- Node labels with special chars (colons, parentheses, `+`, `×`) must be wrapped in double quotes inside brackets: `A["Conv+BN+ReLU"]`.
- Rule of thumb: if a label contains any character outside `[A-Za-z0-9_]`, add quotes.

## Claude commands (`.claude/commands/`)

| Command | Purpose |
|---------|---------|
| `/mkdocs-create` | Create a new standalone MkDocs book |
| `/mkdocs-update` | Update or add pages in an existing MkDocs book |
| `/mkdocs-theme` | Change a book's MkDocs theme in `newbook/configs/*.yml` |
| `/mkdocs-add-images` | Find Wikimedia Commons images and insert them into book pages with captions and credit entries |
