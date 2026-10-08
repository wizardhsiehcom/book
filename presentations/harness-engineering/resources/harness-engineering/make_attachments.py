"""把原書的三組小實驗與導讀複製成簡報附件（原書只讀）。
用法：D:/book/.venv/Scripts/python.exe -I make_attachments.py
"""
import pathlib, re, shutil, markdown

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE.parents[3] / "docs" / "harness-engineering" / "examples"
OUT = HERE / "examples"
STYLE = """body{max-width:960px;margin:40px auto;padding:0 24px;font:17px/1.8 system-ui;color:#243c4a;background:#faf9f5}
a{color:#265a83}h2{margin-top:2em;line-height:1.4}code{background:#e9eef0;padding:2px 5px;border-radius:3px}
pre{background:#e9eef0;padding:12px 16px;overflow-x:auto}pre code{padding:0}
.wrap{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:15px;line-height:1.65;margin:20px 0}
th,td{border:1px solid #cbd3d8;padding:10px;text-align:left;vertical-align:top}th{background:#e9eff2}
.note{border-left:4px solid #a36642;background:#f5eee4;padding:10px 18px;margin:20px 0}"""
NOTE = ('<p class="note">摘自《Coding Agent 的運作原理》的實驗導讀。程式只用 Python 標準函式庫，'
        '不呼叫模型、不連網。文中提到的原書章節只作對照，本簡報未收錄全文。</p>')

OUT.mkdir(exist_ok=True)
for name in ("loop_demo.py", "edit_demo.py", "context_demo.py"):
    shutil.copyfile(SRC / name, OUT / name)

body = markdown.markdown((SRC / "README.md").read_text(encoding="utf-8"), extensions=["tables", "fenced_code"])
# 同資料夾的 .py 連結保留；指向原書章節的 .md 連結在簡報單位內不存在，改成純文字。
body = re.sub(r'<a href="[^"]*\.md(?:#[^"]*)?">(.*?)</a>', r"\1", body)
body = body.replace("<table>", '<div class="wrap"><table>').replace("</table>", "</table></div>")
html = ('<!doctype html><html lang="zh-Hant"><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1"><title>三組小實驗</title>'
        f'<style>{STYLE}</style><a href="../../../index.html">返回簡報</a>{body.replace("</h1>", "</h1>" + NOTE, 1)}')
assert '.md"' not in html
for ref in re.findall(r'href="([^"#]+\.py)"', html):
    assert (OUT / ref).exists(), ref
(OUT / "index.html").write_text(html, encoding="utf-8")
print("wrote examples/index.html and 3 demos")
