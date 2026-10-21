# Situation Analysis Data Layer

Build or extend the situation-analysis data layer (`cases.yml` + `mechanisms.yml`) for a book or topic. This command writes no chapter prose; its output feeds rewrites, new chapters, reviews, or standalone posts. Read the `Variables`, follow the `Instructions` as guardrails, execute the `Workflow` in order with its gates, then report per the `Report` section.

## Variables

analysis_request: $ARGUMENTS
plan_dir: `plan/<name>/`
method_doc: `templates/situation-analysis/README.md`
starter_files: `templates/situation-analysis/cases.yml`, `templates/situation-analysis/mechanisms.yml`
check_cmd: `uv run python tools/check-situation-data.py plan/<name>`

## Instructions

- Read `method_doc` first; its schema and rules are canonical. Do not restate them here.
- Write only under `plan_dir`. Do not edit book chapters; list contradictions and stale facts found in them instead.
- If `plan_dir` already has data, extend it; never discard existing cards without saying why.

## Workflow

1. **Scope (gate: fit)**
   - Identify the book or topic from `analysis_request`; if none, list `configs/*.yml` and ask.
   - Check the fit conditions in `method_doc`. If the material fails them, say so and stop.
   - Name the questions the data must answer (e.g. chapters to rewrite, a claim to audit, a post topic).
2. **Fact-check source material (gate: corrections listed)**
   - If the target is an existing book, verify its facts per `CLAUDE.md` 〈Facts and sources〉 across every chapter, not only those the analysis will use, and list errors, stale items, unsourced claims, and cross-chapter contradictions.
3. **Build cases (gate: coverage)**
   - Copy `starter_files` into `plan_dir` if absent. Write 15–20 cards for a book, fewer for a single post.
   - Gate: the outside-subject share and source rules in `method_doc` hold.
4. **Build mechanisms, frames, tests (gate: discrimination)**
   - Run `check_cmd`. Gate: no missing or unused cases, every mechanism has a challenge, every test is `pass` or `pass_weak`. Research and add cases until it passes, or mark the mechanism `weak`.
5. **Voices and stance (gate: attributed)**
   - Write `voices.md` and `stance.md` per `method_doc`. Gate: every quote has a date and a source, and the stance names its strongest opposing voice.
6. **Commit** the data files on their own.

## Examples

- `nvidia — 為 cuda-ecosystem、competitive-moat 建資料`
- `pfeffer-on-power — 審查 10-position-as-leverage 的推論`

## Report

Report: questions the data answers; fact corrections for the source material; case count by evidence status and the outside-subject cases; each mechanism's status and key challenge; test results; claims in existing chapters that the data cannot support; suggested next step (`/mkdocs-liu-rewrite`, a new chapter, a review, or a post); commit.
