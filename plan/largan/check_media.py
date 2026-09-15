"""Verify the book embeds Wikimedia images directly, with no local copies."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[2]
records = []
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
    for width in [1440, 390]:
        page = browser.new_page(viewport={'width': width, 'height': 900})
        for chapter in ['02-optical-tradeoffs', '03-image-quality', '04-lens-design-materials', '07-telephoto-actuation']:
            page.goto((ROOT / f'book/largan/html/{chapter}.html').as_uri())
            assert page.locator('.wiki-media video').count() == 0
            for img in page.locator('.wiki-media img').all():
                assert img.get_attribute('src').startswith('https://upload.wikimedia.org/')
                img.scroll_into_view_if_needed()
                img.evaluate('(i) => i.decode()')
                assert img.evaluate('(i) => i.naturalWidth > 0')
                records.append({'chapter': chapter, 'width': width, 'src': img.get_attribute('src'), 'loaded': True})
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 2')
        page.close()
    browser.close()
assert len(records) == 10
assert not list((ROOT/'docs/largan/images').glob('*.gif'))
assert not list((ROOT/'docs/largan/images').glob('*.mp4'))
(ROOT/'plan/largan/media-validation.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
print('PASS: 5 online images × 2 widths; loaded directly from Wikimedia.')
