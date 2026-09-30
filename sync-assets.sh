#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

src_assets="docs/assets"
if [[ ! -d "$src_assets" ]]; then
  echo "Missing shared assets directory: $src_assets"
  exit 1
fi

# 從 font.yml 生成 custom.css（含字型切換 class）
echo "Generating custom.css from font.yml..."
uv run python - <<'PYEOF'
import yaml, pathlib

root = pathlib.Path(".")
cfg = yaml.safe_load((root / "font.yml").read_text(encoding="utf-8"))

family   = cfg["family"]
fallback = cfg["fallback"]
weights  = cfg["weights"]
reg_val  = weights["regular"]["value"]
bold_val = weights["bold"]["value"]

lines = []

# ── 主字型 @font-face ──
for w in weights.values():
    lines.append(f"""@font-face {{
    font-family: '{family}';
    src: url('fonts/{w['file']}') format('woff2');
    font-weight: {w['value']};
    font-style: normal;
    font-display: swap;
}}
""")

# ── Cubic-11（像素字型，永遠附帶）──
lines.append("""@font-face {
    font-family: 'Cubic-11';
    src: url('fonts/Cubic_11.woff2') format('woff2'),
         url('fonts/Cubic_11.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}
""")

# ── 預設字型（主字型）──
lines.append(f"""/* ── 預設（{family}）── */
body,
.content p,
.content li,
.content td,
.content th,
.menu-title,
.chapter li a {{
    font-family: '{family}', {fallback};
    font-weight: {reg_val};
}}
.content h1,
.content h2,
.content h3,
.content h4,
.content h5,
.content h6 {{
    font-family: '{family}', {fallback};
    font-weight: {bold_val};
}}

""")

# ── 系統字型 class ──
lines.append("""/* ── 系統字型 ── */
body.font-system,
body.font-system .content p,
body.font-system .content li,
body.font-system .content td,
body.font-system .content th {
    font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
    font-weight: 400;
}
body.font-system .content h1,
body.font-system .content h2,
body.font-system .content h3,
body.font-system .content h4,
body.font-system .content h5,
body.font-system .content h6 {
    font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
    font-weight: 700;
}

""")

# ── 像素字型 class ──
lines.append("""/* ── 像素字型 ── */
body.font-pixel,
body.font-pixel .content p,
body.font-pixel .content li,
body.font-pixel .content td,
body.font-pixel .content th,
body.font-pixel .content h1,
body.font-pixel .content h2,
body.font-pixel .content h3,
body.font-pixel .content h4,
body.font-pixel .content h5,
body.font-pixel .content h6 {
    font-family: 'Cubic-11', monospace;
    font-weight: normal;
}
""")

out = root / "docs" / "assets" / "custom.css"
out.write_text("".join(lines), encoding="utf-8")
print(f"  Written: {out}")
PYEOF

shopt -s nullglob
configs=(configs/*.yml)

if [[ ${#configs[@]} -eq 0 ]]; then
  echo "No config files found under configs/*.yml"
  exit 1
fi

# 單一 Python 行程複製全部檔案：Windows 上每個 cp 行程約 250ms，逐本 cp 會拖到數十秒。
uv run python - "${configs[@]}" <<'PYEOF'
import shutil, sys, yaml, pathlib

src = pathlib.Path("docs/assets")
cfg = yaml.safe_load(pathlib.Path("font.yml").read_text(encoding="utf-8"))
files = ["custom.css", "book-palette.css", "book-transition.css", "mermaid-init.js", "font-init.js",
         # 每本書各帶一份閱讀器；主題範本與 playground 不屬於執行期資產。
         "story-reader/reader.js", "story-reader/reader.css"]
files += [f"fonts/{w['file']}" for w in cfg["weights"].values()]
# Cubic-11 永遠複製（pixel 模式需要）
files += ["fonts/Cubic_11.woff2", "fonts/Cubic_11.woff"]

for config in sys.argv[1:]:
    target = pathlib.Path("docs") / pathlib.Path(config).stem / "assets"
    for f in files:
        (target / f).parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src / f, target / f)
PYEOF

echo "Synced shared assets into docs/<book>/assets"
