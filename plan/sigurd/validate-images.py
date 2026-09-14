"""Check published image decoding, credits, anchors, and responsive layout."""
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / 'book/sigurd/html'
OUT = Path(__file__).parent / 'validation'
OUT.mkdir(exist_ok=True)
results = []
with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path='C:/Users/edisonhsieh/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe',
        headless=True, args=['--disable-gpu'])
    page = browser.new_page(viewport={'width': 1365, 'height': 1000})
    for chapter in ['02-test-cost-model', '03-test-cell', '06-silicon-photonics-test']:
        page.goto((SITE / f'{chapter}.html').as_uri(), wait_until='load')
        figures = page.locator('figure.external-image')
        for i in range(figures.count()):
            figure = figures.nth(i)
            figure.scroll_into_view_if_needed()
            img = figure.locator('img')
            img.evaluate('(img) => img.decode()')
            assert img.get_attribute('alt')
            assert img.evaluate('(img) => img.naturalWidth > 0')
            figure.screenshot(path=str(OUT / f'{chapter}-{i+1}.png'), timeout=15000)
        for width in [390, 1365]:
            page.set_viewport_size({'width': width, 'height': 1000})
            assert figures.evaluate_all('(fs) => fs.every(f => f.getBoundingClientRect().right <= innerWidth && f.getBoundingClientRect().left >= 0)')
        results.append({'chapter':chapter, 'images_decoded':figures.count(), 'widths_checked':[390,1365]})
    # All published local links, including source fragments and cross-book links.
    failures=[]
    for html in SITE.glob('*.html'):
        if html.name == '404.html':
            continue
        page.goto(html.as_uri(), wait_until='domcontentloaded')
        links=page.locator('a[href]').evaluate_all('(els) => els.map(e => e.getAttribute("href"))')
        for href in links:
            u=urlsplit(href)
            if u.scheme or u.netloc:
                continue
            target=(html.parent/unquote(u.path)).resolve() if u.path else html
            if not target.is_file():
                failures.append([html.name,href,'missing file'])
            elif u.fragment and target.suffix=='.html':
                # Parse IDs without navigating away from the current document.
                content=target.read_text(encoding='utf-8')
                found=page.evaluate('([text,id]) => new DOMParser().parseFromString(text,"text/html").getElementById(id) !== null',[content,unquote(u.fragment)])
                if not found:
                    failures.append([html.name,href,'missing anchor'])
    browser.close()
report={'pages':results, 'local_link_failures':failures}
(OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=True))
assert not failures, failures
