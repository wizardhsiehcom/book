"""Validate generated Largan links and record diagram provenance and source hashes."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from hashlib import sha256
import json
import re

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / 'docs/largan'
SITE = ROOT / 'book/largan/html'

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.ids, self.links = set(), []
        self.feed(path.read_text(encoding='utf-8'))

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.add(a['id'])
        if tag in ('a', 'img', 'script', 'link'):
            target = a.get('href') or a.get('src')
            if target:
                self.links.append(target)

pages = sorted(p for p in SITE.glob('*.html') if p.name != '404.html')
assert len(pages) == 18, len(pages)
parsed = {p.resolve(): Page(p) for p in pages}
failures = []
for path, page in parsed.items():
    assert page.links.count('../../../index.html') == 1, (path, 'book return link')
search = json.loads((SITE / 'search/search_index.json').read_text())
assert len({d['location'].split('#')[0] for d in search['docs']}) == 18
links = 0
for path, page in parsed.items():
    for link in page.links:
        u = urlsplit(link)
        if u.scheme or u.netloc:
            continue
        target = (path.parent / unquote(u.path)).resolve() if u.path else path
        if target.is_dir():
            target /= 'index.html'
        links += 1
        if not target.exists():
            failures.append(f'{path.name}: missing {link}')
        elif u.fragment and target.suffix == '.html':
            target_page = page if target == path else Page(target)
            if unquote(u.fragment) not in target_page.ids:
                failures.append(f'{path.name}: missing anchor {link}')
assert not failures, '\n'.join(failures)

manifest = {'book': 'largan', 'checked_date': '2026-09-15',
            'image_type': 'original Mermaid, SVG diagrams and teaching tables',
            'external_images': [], 'svg_assets': [{'file': str(p.relative_to(ROOT)), 'sha256': sha256(p.read_bytes()).hexdigest()} for p in sorted((DOCS / 'images').glob('*.svg'))], 'pages': []}
for path in sorted(DOCS.glob('*.md')):
    body = path.read_text(encoding='utf-8')
    diagrams = []
    for i, match in enumerate(re.finditer(r'```mermaid\n(.*?)```', body, re.S), 1):
        preceding = body[:match.start()]
        headings = re.findall(r'^#{1,6} (.+)$', preceding, re.M)
        diagrams.append({'id': f'{path.stem}-mermaid-{i}',
                         'insertion_heading': headings[-1] if headings else path.stem,
                         'source_line': preceding.count('\n') + 1,
                         'diagram_sha256': sha256(match.group(1).encode()).hexdigest(),
                         'origin': 'original teaching synthesis; see chapter sources and 99-image-credits.md',
                         'license': 'no external image reproduced',
                         'render_result': 'see browser-validation.json generated separately'})
    manifest['pages'].append({'file': str(path.relative_to(ROOT)).replace('\\', '/'),
                              'body_sha256': sha256(path.read_bytes()).hexdigest(),
                              'diagrams': diagrams})
(ROOT / 'plan/largan/image-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
result = {'content_pages': len(pages), 'local_links_and_resources_checked': links,
          'broken_links_or_anchors': failures,
          'mermaid_diagrams': sum(len(p['diagrams']) for p in manifest['pages'])}
(ROOT / 'plan/largan/content-validation.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
print(json.dumps(result))
