Change the MkDocs theme settings for one book config under `D:\book\newbook\configs\`.

## Supported themes

| Name | Description |
|------|-------------|
| `material` | Current default in this repo |
| `mkdocs` | Built-in MkDocs theme |
| `readthedocs` | Built-in Read the Docs style |

## Instructions

1. Identify target config
   - Use `$ARGUMENTS` to resolve a book name (e.g. `cowos`) and theme name.
   - Config path: `D:\book\newbook\configs\<book>.yml`.
   - If missing arguments, ask user to provide both.

2. Read existing config
   - Inspect current `theme.name` (and keep unrelated settings unchanged).

3. Apply theme change
   - Update only the `theme` section in that file.
   - Keep language and nav intact.
   - If switching away from `material`, remove Material-only `features` keys that are unsupported.

4. Rebuild and verify
   - Run:
     - `cd D:\book\newbook && uv run mkdocs build -f configs\<book>.yml`
   - Report old theme → new theme and build result.

## Rules

- Do not edit other book config files unless user asks for bulk changes.
- Do not change page content files when only theme is requested.
- If the requested theme is unsupported, list the supported names and ask user to choose.
