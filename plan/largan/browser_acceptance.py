"""Check real Material Shadow DOM diagrams; expose roots for inspection only."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
import json
import sys
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'data/largan/validation/final'
OUT.mkdir(parents=True, exist_ok=True)

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
names = sorted(p.name for p in (ROOT / 'book/largan/html').glob('*.html') if p.name != '404.html')
if len(sys.argv) > 1:
    names = [n for n in names if n in sys.argv[1:]]
    assert names
report = {'checked_at': datetime.now(timezone.utc).isoformat(), 'pages': [],
          'inspection_note': 'Shadow roots exposed only in test browser; no production patch.',
          'failures': [], 'small_diagram_labels': []}
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless=True)
        for mode, viewport in [('desktop', {'width': 1440, 'height': 1000}), ('mobile', {'width': 390, 'height': 844})]:
            context = browser.new_context(viewport=viewport)
            context.add_init_script('''const originalAttachShadow = Element.prototype.attachShadow;
                Element.prototype.attachShadow = function(options) {
                    return originalAttachShadow.call(this, {...options, mode: 'open'});
                };''')
            for name in names:
                page = context.new_page()
                errors, warnings = [], []
                page.on('pageerror', lambda e: errors.append(str(e)))
                page.on('console', lambda m: warnings.append(m.text) if m.type == 'warning' else None)
                page.goto(f'http://127.0.0.1:{server.server_port}/book/largan/html/{name}', wait_until='networkidle', timeout=60000)
                page.wait_for_function('''() => Array.from(document.querySelectorAll('.mermaid')).every(e =>
                    Boolean((e.shadowRoot || e).querySelector('svg')))''', timeout=15000)
                for i, diagram in enumerate(page.locator('.mermaid').all()):
                    if mode == 'desktop':
                        diagram.screenshot(path=str(OUT / f'{Path(name).stem}-diagram-{i}.png'))
                for i, picture in enumerate(page.locator('article img').all()):
                    picture.screenshot(path=str(OUT / f'{Path(name).stem}-image-{i}-{mode}.png'))
                data = page.evaluate('''() => ({
                    overflow: document.documentElement.scrollWidth > innerWidth + 2,
                    images: Array.from(document.querySelectorAll('article img')).map(e => ({src:e.getAttribute('src'), loaded:e.complete && e.naturalWidth > 0})),
                    footer: document.querySelector('a.book-return-link')?.getAttribute('href'),
                    diagrams: Array.from(document.querySelectorAll('.mermaid')).map(e => {
                        const root = e.shadowRoot || e, svg = root.querySelector('svg');
                        const ratio = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
                        const labels = Array.from(svg.querySelectorAll('.nodeLabel, .edgeLabel'));
                        return {width:svg.getBoundingClientRect().width, viewBoxWidth:svg.viewBox.baseVal.width,
                            visible:svg.getBoundingClientRect().height > 0,
                            errors:root.querySelectorAll('.error-icon,.error-text,[aria-roledescription="error"]').length,
                            effective_font_px:Math.min(...labels.map(n=>parseFloat(getComputedStyle(n).fontSize)*ratio))};
                    })
                })''')
                record = {'page': name, 'viewport': mode, **data, 'page_errors': errors,
                          'warnings': sorted(set(warnings))}
                report['pages'].append(record)
                if any(not i['loaded'] for i in data['images']) or data['overflow'] or not data['footer'] or errors or any(d['errors'] or not d['visible'] for d in data['diagrams']):
                    report['failures'].append({'page': name, 'viewport': mode, 'data': record})
                for i, d in enumerate(data['diagrams']):
                    if d['effective_font_px'] < 12:
                        report['small_diagram_labels'].append({'page': name, 'viewport': mode, 'diagram': i, 'font_px': d['effective_font_px']})
                if mode == 'desktop' or name in ('index.html', '06-assembly-yield-cost.html', '11-largan-evidence-map.html'):
                    page.screenshot(path=str(OUT / f'{Path(name).stem}-{mode}.png'), full_page=True)
                page.close()
            context.close()
        browser.close()
finally:
    server.shutdown()
    server.server_close()

report['summary'] = {'page_checks': len(report['pages']), 'unique_pages': len(names),
                     'svg_checks': sum(len(x['diagrams']) for x in report['pages']),
                     'failures': len(report['failures']), 'small_labels': len(report['small_diagram_labels'])}
(ROOT / ('plan/largan/browser-validation-targeted.json' if len(sys.argv) > 1 else 'plan/largan/browser-validation.json')).write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(report['summary']))
print(json.dumps(report['small_diagram_labels']))
assert not report['failures'], report['failures']
