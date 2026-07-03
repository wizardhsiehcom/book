# Sync Agent

Synchronize Claude Code, Codex, and Antigravity project instructions, using
Claude as the source of truth. Read the `Variables`, follow the `Workflow`, then
report with the `Report` section.

## Variables

sync_brief: $ARGUMENTS
canonical: `CLAUDE.md`
claude_commands: `.claude/commands/`
shared_skills: `.claude/skills/`
codex_entry: `AGENTS.md`
skill_pointer: `.agents/skills`
sync_skill: `.claude/skills/sync-agent/SKILL.md`
antigravity_entry: `.agents/AGENTS.md`

## Instructions

- Treat `CLAUDE.md` as canonical. Do not make Codex or Antigravity the source of
  truth.
- Codex and Antigravity files should stay thin. They should point to
  `CLAUDE.md` and only include tool-specific routing when needed.
- Codex/Antigravity command-style workflows should be exposed as shared skills
  under `.claude/skills/`, with `.agents/skills` pointing to that directory.
- Every Claude command that Codex or Antigravity must be able to invoke needs a
  matching shared skill at `.claude/skills/<command-name>/SKILL.md`.
- Do not create `.codex/commands/` for this repo; Codex command-style access is
  provided through shared skills.
- If the requested change is a durable project rule, update `CLAUDE.md` first.
- If the requested change is a Claude workflow, update or add the relevant file
  under `.claude/commands/`.
- Avoid copying long rule blocks into `AGENTS.md` or `.agents/AGENTS.md`; that
  creates drift.
- Preserve existing user content. If an entry point already contains local
  tool-specific instructions, keep them and add the canonical-reference block.

## Workflow

1. Inspect current state:
   - `CLAUDE.md`
   - `AGENTS.md`
   - `.agents/AGENTS.md`
   - `.agents/skills`
   - `.claude/skills/sync-agent/SKILL.md`
   - `.claude/commands/`
2. Decide the sync scope from `sync_brief`:
   - `rules`: project-wide durable instructions.
   - `commands`: Claude slash commands.
   - `all` or empty: both rules and commands.
3. Update Claude first:
   - Put durable rules in `CLAUDE.md`.
   - Put command behavior in `.claude/commands/<name>.md`.
4. Sync Codex:
   - Ensure `AGENTS.md` points to `./CLAUDE.md`.
   - Ensure `.agents/skills` points to `../.claude/skills`.
   - Ensure every command in `.claude/commands/` has a matching skill at
     `.claude/skills/<command-name>/SKILL.md`. Derive gaps by globbing the two
     directories and comparing names; do not keep a hand-maintained list.
   - Each matching skill must name the workflow, explain when to use it, and
     point back to `.claude/commands/<command-name>.md` as the canonical
     command definition.
   - Keep Codex-specific text minimal and subordinate to `CLAUDE.md`.
5. Sync Antigravity:
   - Ensure `.agents/AGENTS.md` points to `../CLAUDE.md`.
   - Keep Antigravity-specific text minimal and subordinate to `CLAUDE.md`.
6. Verify there are no conflicting source-of-truth statements:
   - `CLAUDE.md` must identify itself as canonical.
   - `AGENTS.md` must not claim to be canonical.
   - `.agents/AGENTS.md` must not claim to be canonical.
   - `.agents/skills` must remain a one-line pointer to `../.claude/skills`.
   - There must be no `.codex/commands/` command source for this repo.
   - Every command under `.claude/commands/` has a matching shared skill under
     `.claude/skills/` (verify by globbing both and diffing names).
7. Report the files changed and any remaining manual follow-up.

## Report

- Canonical file updated: yes/no, path.
- Codex entry updated: yes/no, path.
- Shared skill updated: yes/no, path.
- Skill pointer updated: yes/no, path.
- Antigravity entry updated: yes/no, path.
- Claude command changes: list paths.
- Command-to-skill links: list command -> skill mappings.
- Conflicts found: list or `none`.
