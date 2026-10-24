# Structural Rewrite (劉仲敬式局面分析)

Rewrite selected chapters of an existing book from its situation-analysis data layer. Read the `Variables`, follow the `Instructions` as guardrails, execute the `Workflow` in order with its gates, then report per the `Report` section.

Reference implementation: `plan/tsmc/` and `docs/tsmc/02-history.md`, `08-customers.md`, `11-geopolitics.md`. Where they differ from the rules below, the rules win.

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
- Copy the method, not the voice: no fixed "表面是 X，真正是權力結構" output. Three principles: facts are strict; small details do not get caveats; interpretations are partial but rest on facts. Speculation and cross-era analogy belong inside interpretation boxes, never as evidence for a fact and never in body text.
- Do not edit chapters outside the request except to fix contradictions the rewrite exposes; report those.

## Workflow

1. **Data gate**
   - Identify the book and chapters from `rewrite_request`; if none, list `configs/*.yml` and ask.
   - Run `check_cmd`. If `plan_dir` lacks data or the check fails, run the `/situation-analysis` workflow first for these chapters.
   - Read `plan_dir/voices.md` and `plan_dir/stance.md`. If `voices.md` is absent, search for the sharpest attributed claims on the topic from founders, architects, rivals, politicians, and critics, on both sides, and record them per `method_doc`. Choose voices for the judgment or new facts they yield, not for how sharp they sound. Read voices before setting a stance; if `stance.md` already exists, search specifically for voices that could overturn it, then keep, revise, or replace it and record why. If `stance.md` is absent, write one per `method_doc`, borrowing a voice where one fits, with its strongest opposing voice; report it so the user can change it.
2. **Generate chapters (gate: traceability)**
   - Rewrite only the selected chapters from the data, using the layers `method_doc` assigns to this book type. Open with the reframed question; keep facts in body text; format interpretations, weak-mechanism limits, scenes, and trace comments as `method_doc` specifies.
   - Short punchline sentences are fine where a mechanism or a labeled conjecture supports them.
   - No process residue in prose: no notes on what the original said, what was removed, what lacks a source, or what each box type means. That belongs in `plan_dir` and the report.
   - Every interpretation argues the stance: extend it, read a fact through it, or answer a counterexample head-on. No per-box falsifiers or hedges on details that do not change the conclusion; a cautious cliché is worse than no box. Facts that cut against the stance stay in body text. Quote voices in body text with name, date, and venue; name the person when an interpretation borrows their frame. Quote only the few voices that move the stance or bring a new fact; the rest stay in `voices.md`. Evidence for the stance must lead directly to the conclusion: a fact that merely points the same way but has a more direct explanation stays in body as a fact, not as an argument; search for direct evidence instead.
   - A scene must show roles facing the same situation and choosing differently for a reason the mechanism names; if it cannot, drop it. A frame table needs a sourced reading per row; otherwise drop it.
   - A chapter whose data yields no mechanism, not even a weak one, stays a fact chapter: fix the facts, add no interpretation for its own sake.
   - Move lookup material (timelines, rosters) to an appendix table; add a sources section. Do not link or name `plan_dir` in chapters; it is not published, and the trace comments already point to it.
3. **Build and verify**
   - Run `./sync-assets.sh`, then `build_cmd`. Confirm admonitions render: the count of `class="admonition` in each built HTML page should be twice the count of `!!!` lines in the Markdown.
   - Commit chapters separately from data changes.
4. **Independent review (gate: fresh eyes)**
   - Spawn a reviewer agent that did not write the chapters. Give it the method doc, `CLAUDE.md` 〈Facts and sources〉, the stance and voices files, and the chapter list; ask it to rank problems: facts without sources, evidence that only points the same way, unfavorable facts left out, interpretations that do not argue the stance, the strongest hostile reading the chapter ignores. Do not rely on your own review.
   - Verify each finding before acting; the reviewer can be wrong or work from memory. Fix, revise the stance if needed, and record why in `stance.md`.

## Examples

- `nvidia — cuda-ecosystem、competitive-moat、risks-export-controls`
- `pfeffer-on-power — 10-position-as-leverage、17-founders-and-power-loss`

## Report

Report: chapters rewritten; the reviewer's findings and what was fixed or rejected; which interpretations were weakened or removed because the data could not support them; contradictions found in other chapters; build result and commits.
