# Course Book Plan

Generate a reusable book-writing plan for a course transcript collection. Read
the `Variables`, follow the `Instructions`, execute the `Workflow`, then report
with the `Report` section.

## Variables

course_brief: $ARGUMENTS
plan_dir: `plan/`
source_dir: user-specified course transcript directory
book_slug: derived from course title unless explicitly provided

From `course_brief`, extract:

- course title
- transcript/source directory
- target book title
- target language
- whether the source files are transcript `.txt`, subtitle `.vtt`, PDF, or mixed
- whether multi-agent delegation should be planned

If the source directory or course title is missing, ask before creating files.

## Instructions

- Follow `CLAUDE.md` as the canonical project guidance.
- Write all planning prose in Traditional Chinese unless the user asks for
  another language.
- Create planning files under `plan/`; do not create `.codex/commands/`.
- This workflow creates a plan only. Do not write final book chapters unless the
  user explicitly asks to start writing the book.
- If transcript `.txt` files exist, prefer them over `.vtt` for the reading
  source. Keep `.vtt` as secondary reference only.
- The plan must explicitly require complete transcript reading from beginning to
  end. Do not allow paragraph sampling, keyword search summaries, or writing
  from lecture titles alone.
- External web research belongs after the transcript-based first drafts unless
  the user explicitly changes the order.
- Preserve existing files. If target plan files already exist, update them
  carefully instead of overwriting unrelated content.
- For multi-agent execution, define disjoint write scopes for workers and make
  the main agent responsible for final review and tracker updates.
- Do not force completion when information is insufficient. If required
  materials are missing locally, inaccessible, not supplied by the user, or
  cannot be reliably found with available tools, mark the item as `待補` and ask
  the user to provide the material or a source URL. Never invent lecture titles,
  assignment details, file paths, deadlines, prices, authors, readings, or
  resource links.

## Output Files

Create or update these files, using `book_slug` in the filename:

```text
plan/<book_slug>-book-plan.md
plan/<book_slug>-transcript-tracker.md
plan/<book_slug>-chapter-template.md
```

Optional if the user asks for implementation scaffolding:

```text
docs/<book_slug>/
configs/<book_slug>.yml
```

## Workflow

1. Inspect project guidance:
   - Read `CLAUDE.md`.
   - Check whether `plan/` already contains related plan files.
2. Inspect source materials:
   - List files in `source_dir`.
   - Prefer transcript `.txt` files if present.
   - Record lecture number, title, path, extension, and file size.
   - If both `.txt` and `.vtt` exist for the same lecture, track `.txt` as the
     primary reading source.
   - If expected materials are missing or ambiguous, do not infer their content.
     Add a `待補` placeholder and list exactly what the user needs to provide.
3. Derive the book identity:
   - Choose `book_slug` from the course title.
   - Choose a target MkDocs folder name if future implementation is likely.
   - Record the target audience and scope assumptions.
4. Create the book plan:
   - Goals and non-goals.
   - Complete-reading rule.
   - Work stages: skeleton, course-level abstraction, full transcript reading,
     chapter writing, cross-chapter integration, external supplementation,
     publication cleanup.
   - Quality checklist.
   - Suggested future file layout.
5. Create the transcript tracker:
   - One row per primary transcript.
   - Include lecture number, topic, source path, size, status, notes file, and
     future chapter file.
   - Initial status should be `未開始` unless existing notes prove otherwise.
6. Create the chapter template:
   - Basic metadata.
   - Complete reading confirmation.
   - Main problem of the lecture.
   - Core concepts.
   - Important definitions, formulas, algorithms, engineering constraints,
     examples, Q&A details, and cross-lecture links.
   - Chapter draft sections.
   - External supplementation table, marked as postponed until transcript-based
     draft completion.
7. Add multi-agent management if requested or useful:
   - Define main agent, chapter worker agent, review agent, and external
     supplement agent responsibilities.
   - Define worker write scopes.
   - Define batch sizes, usually 3 to 4 lectures per batch.
   - Define worker final report format.
   - Define main-agent acceptance checks.
8. Verify:
   - Re-open the created files with UTF-8.
   - Confirm transcript paths are correct.
   - Confirm the plan does not claim chapters have been read unless they have.
   - Confirm every unavailable material is clearly marked `待補` instead of
     being silently filled from guesswork.

## Multi-Agent Defaults

Use these defaults unless the user requests otherwise:

- Main agent owns `plan/`, global structure, tracker updates, terminology, and
  integration.
- Each chapter worker owns only:
  - `docs/<book_slug>/notes/lecture-XX-*.md`
  - `docs/<book_slug>/XX-*.md`
- Workers must not edit other chapters, global configs, or launcher files.
- Workers must report:
  - transcript filename and total line count
  - files changed
  - 5 to 10 core concepts
  - cross-chapter links
  - uncertain points for main-agent review
  - whether external sources were used
- External sources are disallowed until the transcript-first drafts are done,
  unless the user explicitly requests early external research.

## Report

Report:

- plan files created or updated
- source directory inspected
- number of primary transcripts tracked
- inferred book slug
- whether multi-agent management was included
- any assumptions or blockers
- missing materials that require user input

## Examples

- `/course-book-plan data/Stanford CS336 Language Modeling from Scratch，書名 CS336 語言模型從零開始，繁體中文，多 agent`
- `/course-book-plan 幫 data/my-course 建立成書計畫，先完整讀逐字稿，最後才做網路補充`
- `/course-book-plan course title: Advanced GPU Programming, source: data/gpu-course, output language: zh-TW`
