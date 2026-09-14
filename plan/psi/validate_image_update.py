"""Real browser acceptance for images, existing Mermaid and affected page layout."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
from datetime import datetime, timezone
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
PLAN = ROOT / 'plan/psi'
OUT = ROOT / 'data/psi/validation/image-update'
OUT.mkdir(parents=True, exist_ok=True)
items = json.loads((PLAN / 'image-additions.json').read_text(encoding='utf-8'))
names = sorted({Path(i['page']).with_suffix('.html').name for i in items} | {'99-image-credits.html'})

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Quiet, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
report = {'checked_at': datetime.now(timezone.utc).isoformat(), 'pages': [], 'failures': []}
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe', headless=True)
        for mode, viewport in [('desktop', {'width': 1440, 'height': 1000}), ('mobile', {'width': 390, 'height': 844})]:
            context = browser.new_context(viewport=viewport)
            context.add_init_script('''const attach = Element.prototype.attachShadow;
                Element.prototype.attachShadow = function(o) { return attach.call(this,{...o,mode:'open'}); };''')
            for name in names:
                page = context.new_page()
                errors = []
                page.on('pageerror', lambda error: errors.append(str(error)))
                page.goto(f'http://127.0.0.1:{server.server_port}/book/psi/html/{name}', wait_until='networkidle', timeout=60000)
                page.wait_for_function('''() => [...document.querySelectorAll('.mermaid')].every(e => (e.shadowRoot || e).querySelector('svg'))''', timeout=20000)
                page.evaluate('''async () => {await Promise.all([...document.querySelectorAll('article img')].map(i => i.decode().catch(()=>null)));}''')
                data = page.evaluate('''() => ({
                    overflow: document.documentElement.scrollWidth > innerWidth + 2,
                    footer: !!document.querySelector('a.book-return-link'),
                    images: [...document.querySelectorAll('article img')].map(i => ({
                        src:i.getAttribute('src'), naturalWidth:i.naturalWidth, naturalHeight:i.naturalHeight,
                        width:i.getBoundingClientRect().width, height:i.getBoundingClientRect().height,
                        complete:i.complete, alt:i.alt})),
                    diagrams:[...document.querySelectorAll('.mermaid')].map(e => {
                        const root=e.shadowRoot || e, s=root.querySelector('svg');
                        const scale=s.getBoundingClientRect().width/s.viewBox.baseVal.width;
                        return {visible:s.getBoundingClientRect().height>0,
                            errors:root.querySelectorAll('.error-icon,.error-text').length,
                            labelPx:Math.min(...[...s.querySelectorAll('.nodeLabel,.edgeLabel')].map(n=>parseFloat(getComputedStyle(n).fontSize)*scale))};
                    })})''')
                record = {'page':name, 'mode':mode, **data, 'page_errors':errors}
                report['pages'].append(record)
                if (errors or data['overflow'] or not data['footer'] or
                    any(not i['complete'] or not i['naturalWidth'] or not i['alt'] or i['width']<=0 for i in data['images']) or
                    any(not d['visible'] or d['errors'] or d['labelPx']<12 for d in data['diagrams'])):
                    report['failures'].append(record)
                for i, locator in enumerate(page.locator('article img').all()):
                    locator.screenshot(path=str(OUT / f'{Path(name).stem}-{mode}-image-{i}.png'))
                page.screenshot(path=str(OUT / f'{Path(name).stem}-{mode}.png'), full_page=True)
                page.close()
            context.close()
        browser.close()
finally:
    server.shutdown()
    server.server_close()
report['summary'] = {'page_checks':len(report['pages']), 'image_checks':sum(len(p['images']) for p in report['pages']),
                     'mermaid_checks':sum(len(p['diagrams']) for p in report['pages']), 'failures':len(report['failures'])}
(PLAN / 'image-update-validation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(report['summary']))
raise SystemExit(bool(report['failures']))
