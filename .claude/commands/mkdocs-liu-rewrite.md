# Structural Rewrite (劉仲敬式局面分析)

Rewrite selected chapters of an existing book using situation analysis: roles, dependencies, choice spaces, meaning frames, and scenes. The data layer comes first; prose is generated from it. Read the `Variables`, follow the `Instructions` as guardrails, execute the `Workflow` in order with its gates, then report per the `Report` section.

Reference implementation: `plan/tsmc/cases.yml`, `plan/tsmc/mechanisms.yml`, and `docs/tsmc/02-history.md`, `08-customers.md`, `11-geopolitics.md`.

## Variables

rewrite_request: $ARGUMENTS
docs_dir: `docs/<folder>/`
config_file: `configs/<folder>.yml`
plan_dir: `plan/<folder>/`
cases_file: `plan/<folder>/cases.yml`
mechanisms_file: `plan/<folder>/mechanisms.yml`
build_cmd: `uv run mkdocs build -f configs/<folder>.yml`

## Instructions

- Content conventions and Mermaid rules: follow `CLAUDE.md` (canonical, do not restate here).
- Never write prose before the data layer exists. Fluent narrative hides gaps that empty fields and failed tests expose.
- Copy the method, not the voice: no fixed "表面是 X，真正是權力結構" output, no certainty beyond the evidence, no cross-era analogy used as proof.
- Cases record situations, not conclusions. Mechanism links live only in `mechanisms_file`.
- Every mechanism needs prerequisites, alternative explanations, disconfirming observations, and at least one `challenges` case. A mechanism with no challenge, or supported by a single case, is `status: weak`: chapters may state its choices and outcomes, never its causation.
- At least a quarter of cases must come from outside the book's subject (other companies, industries, or eras facing the same mechanism). Independent cases are the strongest evidence; search for them deliberately by asking "who else faced this mechanism under different conditions?"
- Separate description from evaluation. A word like 背叛 / 成功 / 不可替代 is a frame-dependent reading; store it under `frames` with each position's reading.
- Evidence wording must match evidence grade: supply-chain reports and rumors are written as 「報導」 or 「時序吻合」, never 「原因是」. No 「第一次」「再也沒有」 or other universal claims unless verified.
- Scenes describe a role's situation and options only. Never invent inner monologue or lines for real, identifiable people.
- Re-check time-sensitive facts (schedules, market share, rankings) against the latest sources; today's date matters.
- Do not edit chapters outside the request except to fix contradictions the rewrite exposes; report those.

## Workflow

1. **Select scope (gate: fit)**
   - Identify the book from `rewrite_request`; if none, list `configs/*.yml` and ask.
   - For each candidate chapter, check both: the material has actors making choices (who depends on whom, who bears the cost), and the conclusions cannot be settled by direct experiment. Drop chapters that fail.
   - Pick the layers by book type: industry/company history uses all four (situation, frames, argument, scene); organization/power uses situation + frames with sparing scenes; technical design trade-offs use only roles, commitments, and costs with no historical tone; pure mechanism or procedure books are out of scope; say so and stop.
2. **Fact-check the original (gate: corrections listed)**
   - Verify the original chapters' facts independently of any rewrite, with sources. List errors and stale items.
3. **Build cases (gate: coverage)**
   - Write `cases_file`: 15–20 cards. Each card has `id`, `title`, `period`, `evidence_status` (verified | partial | unverified), `roles`, `relations`, `options`, `choice`, `outcome`, `uncertain`, `sources`; add `stated_reasons`, `contested`, `facts`, or `feasibility_of_alternative` when relevant.
   - Gate: at least a quarter of cases are outside the subject, and every card has sources or an explicit `uncertain` entry explaining the gap.
4. **Build mechanisms, frames, and tests (gate: discrimination)**
   - Write `mechanisms_file` with `mechanisms` (id, name, hypothesis, prerequisites, causal_path, alternative_explanations, disconfirming_observations, boundary, supports, challenges, scene_seed, return_point, status), `frames` (term, description, readings per position, status), and `tests` (pairs of superficially similar cases that must yield different explanations).
   - Run the integrity check below. Gate: no missing case references, no unused cases, every mechanism has a challenge, and every test is `pass` or `pass_weak` with the weakness stated. Research and add cases until the gate passes; if a test cannot pass, mark the mechanism weak instead of forcing it.
5. **Generate chapters (gate: traceability)**
   - Rewrite only the selected chapters from the data. Open with the reframed question; keep facts in body text; put inferences in `!!! note "詮釋"` (or `"詮釋的限制"` for weak mechanisms) and scenes in `!!! example "示意場景"`.
   - Place `<!-- mech: <id> -->`, `<!-- frame: <term> -->`, or `<!-- test: <id> -->` directly above each interpretation box.
   - Short punchline sentences only where a non-weak mechanism supports them.
   - Move lookup material (timelines, rosters) to an appendix table; add a sources section and a pointer to `plan_dir`.
6. **Build and verify**
   - Run `./sync-assets.sh`, then `build_cmd`. Confirm admonitions render: the count of `class="admonition` in each built HTML page should be twice the count of `!!!` lines in the Markdown.
   - Commit data files and chapters separately.

### Integrity check

```bash
uv run python - <<'EOF'
import yaml, sys
d = sys.argv[1] if len(sys.argv) > 1 else "plan/<folder>"
c = {x["id"]: x for x in yaml.safe_load(open(f"{d}/cases.yml"))["cases"]}
m = yaml.safe_load(open(f"{d}/mechanisms.yml"))
refs = [r["case"] for mm in m["mechanisms"] for k in ("supports", "challenges") for r in mm[k]]
refs += [i for t in m["tests"] for i in t["inputs"]]
print("missing:", sorted(set(refs) - set(c)))
print("unused:", sorted(set(c) - set(refs)))
print("no challenges:", [mm["id"] for mm in m["mechanisms"] if not mm["challenges"]])
print("tests:", {t["id"]: t["status"] for t in m["tests"]})
print("status:", {s: sum(x["evidence_status"] == s for x in c.values()) for s in ("verified", "partial", "unverified")})
EOF
```

Replace `<folder>` before running.

## Examples

- `nvidia — cuda-ecosystem、competitive-moat、risks-export-controls`
- `pfeffer-on-power — 10-position-as-leverage、17-founders-and-power-loss`

## Report

Report: chapters selected and dropped (with reason); original-fact corrections; case count by evidence status and the outside-subject cases; each mechanism's status and its key challenge; test results; which interpretations were weakened or removed because the data could not support them; contradictions found in other chapters; build result and commits.
