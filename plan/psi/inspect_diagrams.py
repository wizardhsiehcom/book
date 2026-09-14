"""Quick independent mobile geometry probe, without modifying the site."""
from playwright.sync_api import sync_playwright
import json
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(SimpleHTTPRequestHandler, directory='D:/book'))
Thread(target=server.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe', headless=True)
    page = b.new_page(viewport={'width': 390, 'height': 844})
    page.add_init_script('const attach = Element.prototype.attachShadow; Element.prototype.attachShadow = function(opts) { return attach.call(this, {...opts, mode: String.fromCharCode(111,112,101,110)}); };')
    page.on('console', lambda m: print('CONSOLE', m.type, ascii(m.text)))
    page.on('pageerror', lambda e: print('ERROR',ascii(str(e))))
    page.on('requestfailed', lambda r: print('FAIL',r.url,r.failure))
    page.goto(f'http://127.0.0.1:{server.server_port}/book/psi/html/06-thinning-services.html')
    print(json.dumps(page.locator('.mermaid').evaluate_all('(els)=>els.map(e=>e.outerHTML.slice(0,1800))'),ensure_ascii=True))
    page.wait_for_timeout(4000)
    print(json.dumps(page.locator('.mermaid svg').evaluate_all('''els => els.map(s => ({
        w:s.getBoundingClientRect().width, v:s.viewBox.baseVal.width,
        errors:Array.from(s.querySelectorAll('[class*="error"]')).map(e=>e.outerHTML.slice(0,180)),
        texts: Array.from(s.querySelectorAll('.nodeLabel')).map(e=>({w:e.getBoundingClientRect().width,text:e.textContent}))
    }))'''), ensure_ascii=True))
    page.screenshot(path='D:/book/data/psi/validation/probe06-mobile.png', full_page=True)
    b.close()
server.shutdown()
