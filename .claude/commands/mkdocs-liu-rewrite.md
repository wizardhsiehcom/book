# Structural Rewrite (劉仲敬式局面分析)

Rewrite selected chapters of an existing book from its situation-analysis data layer. Read the `Variables`, follow the `Instructions` as guardrails, execute the `Workflow` in order with its gates, then report per the `Report` section.

Reference implementation: `plan/tsmc/` and `docs/tsmc/02-history.md`, `08-customers.md`, `11-geopolitics.md`.

## Variables

rewrite_request: $ARGUMENTS
docs_dir: `docs/<folder>/`
plan_dir: `plan/<folder>/`
method_doc: `templates/situation-analysis/README.md`
check_cmd: `uv run python tools/check-situation-data.py plan/<folder>`
build_cmd: `uv run mkdocs build -f configs/<folder>.yml`

## Instructions

- Content conventions and Mermaid rules: follow `CLAUDE.md`. Data rules, evidence wording, and scene rules: follow `method_doc`.
- Never write prose before the data layer passes `check_cmd`. Fluent narrative hides gaps that empty fields and failed tests expose.
- Copy the method, not the voice: no fixed "表面是 X，真正是權力結構" output, no certainty beyond the evidence, no cross-era analogy used as proof.
- Do not edit chapters outside the request except to fix contradictions the rewrite exposes; report those.

## Workflow

1. **Data gate**
   - Identify the book and chapters from `rewrite_request`; if none, list `configs/*.yml` and ask.
   - Run `check_cmd`. If `plan_dir` lacks data or the check fails, run the `/situation-analysis` workflow first for these chapters.
2. **Generate chapters (gate: traceability)**
   - Rewrite only the selected chapters from the data, using the layers `method_doc` assigns to this book type. Open with the reframed question; keep facts in body text; format interpretations, weak-mechanism limits, scenes, and trace comments as `method_doc` specifies.
   - Short punchline sentences only where a non-weak mechanism supports them.
   - Move lookup material (timelines, rosters) to an appendix table; add a sources section and a pointer to `plan_dir`.
3. **Build and verify**
   - Run `./sync-assets.sh`, then `build_cmd`. Confirm admonitions render: the count of `class="admonition` in each built HTML page should be twice the count of `!!!` lines in the Markdown.
   - Commit chapters separately from data changes.

## Examples

- `nvidia — cuda-ecosystem、competitive-moat、risks-export-controls`
- `pfeffer-on-power — 10-position-as-leverage、17-founders-and-power-loss`

## Report

Report: chapters rewritten; which interpretations were weakened or removed because the data could not support them; contradictions found in other chapters; build result and commits.
