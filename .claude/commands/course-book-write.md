# Course Book Write

Continue writing a course book from its transcript tracker: pick the next
batch of unfinished lectures, read them completely, write notes + chapter
pages, update the tracker and nav, then build. This is the execution loop
that `/course-book-plan` intentionally does not run.

## Variables

write_request: $ARGUMENTS
book_slug: resolved from `write_request`, or from `plan/*-transcript-tracker.md` if ambiguous
tracker: `plan/<book_slug>-transcript-tracker.md`
book_plan: `plan/<book_slug>-book-plan.md`
chapter_template: `plan/<book_slug>-chapter-template.md`
docs_dir: `docs/<book_slug>/`
config_file: `configs/<book_slug>.yml`
batch_size: 3–4 lectures unless the user specifies a number

If no plan files exist for the named slug, tell the user to run
`/course-book-plan` first.

## Instructions

- Follow `CLAUDE.md` for language, one-concept-per-page, and Mermaid rules.
- Follow the complete-reading rule in `book_plan`: read each transcript from
  beginning to end before writing. No paragraph sampling, no writing from the
  lecture title alone.
- Follow `chapter_template` for the structure of new chapter pages.
- Do not invent content absent from the transcript. Mark uncertain points
  instead of guessing, and leave a `待補` note for the user.
- External web research stays out unless `book_plan` explicitly allows it at
  this stage.

## Workflow

1. Resolve `book_slug`; read `tracker`, `chapter_template`, and `config_file`.
2. Pick the next `batch_size` rows in `tracker` with status `未開始` or
   `閱讀中` (tracker order).
3. For each lecture: read its transcript file completely, write
   `docs/<book_slug>/notes/lecture-XX-*.md`, then the chapter page
   `docs/<book_slug>/XX-*.md` following `chapter_template`.
4. Add each new chapter page to `config_file` nav in lecture order.
5. Update `tracker` status per lecture (`已成章`, or `閱讀中`/`已抽象` if only
   partially done).
6. Run `./sync-assets.sh`, then `uv run mkdocs build -f config_file`. Report
   build errors if any.

## Examples

- `/course-book-write cs224r`
- `/course-book-write cs224r-deep-rl 5 講`

## Report

Report: lectures processed, files created/edited, tracker rows updated, nav
changes, build result, and any `待補` blockers needing user input.
