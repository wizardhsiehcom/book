# Review MkDocs Book

Review an existing book under `docs/<folder>/` end to end, then produce a detailed improvement plan at `plan/<folder>/<folder>-improvement-plan.md` designed for multi-agent execution. This command **only reviews and plans — it never edits book content**.

## Variables

review_request: $ARGUMENTS
docs_dir: `docs/<folder>/`
config_file: `configs/<folder>.yml`
plan_file: `plan/<folder>/<folder>-improvement-plan.md`

## Instructions

- Content conventions and Mermaid rules: follow `CLAUDE.md` (canonical, do not restate here).
- Read **every page in full** before judging; never review from nav titles, samples, or grep hits alone.
- Do not fabricate facts while reviewing: flag stale/uncited claims as problems, do not "correct" them from memory — corrections belong to the plan's research phase with web verification.
- Plan and prose in Traditional Chinese (繁體中文) unless the user writes in English.
- An existing plan file for this book: read it first and update/extend it instead of overwriting.

## Review dimensions

Evaluate all of the following; rank findings P0/P1/P2:

1. **時效性** — compare every dated claim (numbers, product generations, "trends", roadmaps) against today's date; anything older than ~1 year is suspect. Trend/appendix pages are usually the stalest.
2. **承諾 vs 內容** — does the README/導讀 promise sections or coverage the pages don't deliver?
3. **覆蓋缺口** — topics/roles/companies the book's own text references but never covers; adjacent areas an intended reader would expect.
4. **結構一致性** — do parallel pages share the same section skeleton? List which pages miss which sections; define a unified page template in the plan.
5. **資料可信度** — uncited figures, duplicated/contradictory tables, cross-page number drift; designate one authoritative source page for shared numbers (e.g. a salary/summary appendix).
6. **技術品質** — Mermaid rule violations, broken internal/cross-book links, nav structure, fake visualizations, missing glossary/references pages, zero images (candidate for `/mkdocs-add-images`).

## Plan file structure

The plan must contain, in order:

1. **審查結論** — global issues ranked by severity, each with concrete evidence (page + quote/number).
2. **逐頁問題追蹤表** — one row per page: 問題 / 行動.
3. **新增頁面清單** — with priority, plus the ripple updates each new page requires (nav, overview maps, summary tables).
4. **網路搜索規範** — for stale/new information: WebSearch → WebFetch flow; source tiers (official reports > industry research > news media > community, community only for cross-checking); every adopted fact records URL + publish date + verification date; sensitive figures (salaries, capacities, headcounts) require **two independent sources**; unverifiable items are marked `待查`, never invented.
5. **統一頁面模板** — the section skeleton all pages must converge to.
6. **多 Agent 執行制度** — 主控 (this session) + parallel research agents (topic-split, output to `plan/<folder>/research/`, may search the web) + batched writer agents (3–4 related pages per batch, write only assigned files, numbers only from research notes / the authoritative page, no self-research) + a read-only reviewer agent with an explicit checklist. Writers start only after research completes; the authoritative-numbers page is finalized first.
7. **階段總覽與驗收** — phases with parallelism/dependencies, ending with `./sync-assets.sh` + `uv run mkdocs build -f configs/<folder>.yml` verification, and a checkbox acceptance list.

## Workflow

1. **Identify the target book** from `review_request`; if ambiguous, list `configs/*.yml` and ask.
2. **Read** `config_file` (nav = intended structure), then every `.md` under `docs_dir` in full.
3. **Verify** internal links and cross-book links (`ls docs/` for link targets), and note pages missing template sections.
4. **Write** the plan to `plan_file` following the structure above.
5. **Do not execute the plan** — offer to launch its Phase 1 research agents as the follow-up.

## Examples

- `semi-jobs`
- `gpu — 重點看時效性跟缺哪些主題`

## Report

Summarize the top findings (severity-ordered), the plan file path, and the offer to start Phase 1.
