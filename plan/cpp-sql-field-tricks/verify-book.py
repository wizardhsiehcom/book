from html.parser import HTMLParser
from pathlib import Path
import json
import re
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / "book/cpp-sql-field-tricks/html"
DOCS = ROOT / "docs/cpp-sql-field-tricks"


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.returns = []
        self.diagrams = 0
        self.answers = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ("href", "src"):
            if key in attrs:
                self.links.append(attrs[key])
        if "book-return-link" in attrs.get("class", "").split():
            self.returns.append(attrs["href"])
        if "mermaid" in attrs.get("class", "").split():
            self.diagrams += 1
        if tag == "details":
            self.answers += 1


errors, diagrams, answers = [], 0, 0
pages = list(SITE.glob("*.html"))
for file in pages:
    page = Page()
    page.feed(file.read_text(encoding="utf-8"))
    diagrams += page.diagrams
    answers += page.answers
    if len(page.returns) != 1:
        errors.append(f"{file.name}: return links {len(page.returns)}")
    elif (file.parent / page.returns[0]).resolve() != (ROOT / "index.html").resolve():
        errors.append(f"{file.name}: wrong bookshelf target")
    for link in page.links:
        # MkDocs' generic 404 has no page context and uses server-root assets.
        # Its bookshelf link is checked above; arbitrary-depth HTTP 404 routing is separate.
        if file.name == "404.html":
            continue
        url = urlsplit(link)
        if url.scheme or url.netloc or not url.path:
            continue
        target = (file.parent / unquote(url.path)).resolve()
        if not target.exists():
            errors.append(f"{file.name}: missing {link}")
for file in DOCS.glob("*.md"):
    content = file.read_text(encoding="utf-8")
    if len(re.findall(r"^```", content, re.M)) % 2:
        errors.append(f"{file.name}: unbalanced fence")
    for match in re.finditer(r"\]\(([^)]+)\)", content):
        url = urlsplit(match[1])
        if url.scheme or url.netloc or not url.path:
            continue
        if not (file.parent / unquote(url.path)).exists():
            errors.append(f"{file.name}: missing source {match[1]}")
search = json.loads((SITE / "search/search_index.json").read_text(encoding="utf-8"))
if any("source-audit" in doc["location"] or "book-plan" in doc["location"] for doc in search["docs"]):
    errors.append("private work notes in search index")
if list(SITE.rglob("*.exe")) or list(SITE.rglob("*.pdb")):
    errors.append("build artifacts accidentally published")
if len(pages) != 24 or diagrams != 9 or answers != 17:
    errors.append("unexpected page/diagram/exercise count")
print(json.dumps({"html_including_404": len(pages), "mermaid": diagrams,
                  "exercises": answers, "normal_pages_resource_check": 23,
                  "404_resources": "server routing not validated", "errors": errors}, ensure_ascii=False, indent=2))
raise SystemExit(bool(errors))
