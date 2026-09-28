// A 紙本改版的瀏覽器巡檢：逐頁截圖、水平溢出、頁首遮擋與 pageerror。
// 用法：node plan/visual-story/checks/paper-restyle/shoot.cjs <book> <topic> [頁碼,頁碼…]
// 截圖寫到 data/visual-story/paper-restyle/<topic>/；未指定頁碼時只量測不截圖。
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || '/private/tmp/book-browser-qa/node_modules/playwright');
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '../../../..');
const [book, topic, shots = ''] = process.argv.slice(2);
if (!book || !topic) { console.error('需要 <book> <topic>'); process.exit(2); }
const want = new Set(shots.split(',').filter(Boolean).map(Number));
const out = path.join(root, 'data/visual-story/paper-restyle', topic);
fs.mkdirSync(out, {recursive: true});
const chrome = process.env.CHROMIUM_PATH || '/Users/wizard/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const layouts = [['desktop', 1280, 900, 1], ['small', 320, 740, 1], ['text200', 390, 844, 2]];

(async () => {
  const browser = await chromium.launch({executablePath: chrome, headless: true});
  const problems = [];
  try {
    for (const [name, width, height, zoom] of layouts) {
      const page = await browser.newPage({viewport: {width, height}, reducedMotion: 'reduce'});
      page.on('pageerror', e => problems.push(`${name}: pageerror ${e.message}`));
      await page.goto(`file://${root}/book/${book}/html/resources/${topic}/index.html`);
      const total = await page.evaluate(() => story.pages.length);
      for (let i = 1; i <= total; i++) {
        // 與上一輪相同：主文、頁首、索引標籤與導覽的字級逐元素加倍，縮圖除外。
        if (zoom > 1) await page.evaluate(z => {
          // 先量完再套用，避免子元素讀到已加倍的父字級而疊乘。
          const nodes = [...document.querySelectorAll('header *, #page *, #index summary, nav *')].filter(e => !e.closest('.mini') && !e.dataset.enlarged);
          const sizes = nodes.map(e => parseFloat(getComputedStyle(e).fontSize));
          nodes.forEach((e, i) => { e.style.fontSize = `${sizes[i] * z}px`; e.dataset.enlarged = '1'; });
        }, zoom);
        await page.mouse.move(width - 5, 5);
        const m = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - innerWidth,
          overlap: (() => { const l = document.querySelector('#story-label').getBoundingClientRect(), s = document.querySelector('#index summary').getBoundingClientRect(); return l.left < s.right && l.bottom > s.top && l.top < s.bottom; })(),
        }));
        if (m.overlap) problems.push(`${name} p${i}: 頁首標籤與索引重疊`);
        if (m.overflow > 1) problems.push(`${name} p${i}: 水平溢出 ${m.overflow}px`);
        if (want.has(i)) await page.screenshot({path: `${out}/${name}-${i}.png`, fullPage: true});
        if (i < total) await page.locator('#next').click();
      }
      await page.close();
    }
  } finally { await browser.close(); }
  if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
  else console.log(`PASS: ${book}/${topic} 3 版面逐頁無水平溢出、無 pageerror（非視覺驗收）`);
})().catch(e => { console.error(e); process.exitCode = 1; });
