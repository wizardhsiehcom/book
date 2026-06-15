# Change MkDocs Theme

Change the theme settings for one book config under `book/configs/`. Read the `Variables`, follow the `Instructions` as guardrails, execute the `Workflow` in order, then report per the `Report` section.

## Variables

theme_request: $ARGUMENTS
config_file: `book/configs/<book>.yml`
build_cmd: `cd book && uv run --with mkdocs-material mkdocs build -f configs/<book>.yml`

Supported themes:

| Name | Description |
|------|-------------|
| `material` | Current default in this repo |
| `mkdocs` | Built-in MkDocs theme |
| `readthedocs` | Built-in Read the Docs style |

## Instructions

- Update only the `theme` section of `config_file`. Keep language and nav intact.
- Do not edit other book config files unless the user asks for bulk changes.
- Do not change page content files when only a theme change is requested.
- If switching away from `material`, remove Material-only `features` keys that other themes don't support.
- If the requested theme is unsupported, list the supported names and ask the user to choose.

## Workflow

1. **Identify target config**
   - Use `theme_request` to resolve the book name (e.g. `hermes-agent`) and the target theme.
   - If either argument is missing, ask the user to provide both.
2. **Read** `config_file` to inspect the current `theme.name` (keep unrelated settings unchanged).
3. **Apply theme change** per the Instructions above.
4. **Rebuild and verify** with `build_cmd`.

## Examples

- `hermes-agent material`
- `gpu readthedocs`

## Report

Report old theme → new theme and the build result.
