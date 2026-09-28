// EE274 算術編碼互動頁：390×844 依序按 B、A、C，捲到控制項後，
// 檢查控制項與主要結果（共同座標）同時在底部導覽上方，並比對區間 left／width 與模型相差 ≤ 1px。
// 用法：node plan/visual-story/checks/paper-restyle/ee274-controls.cjs（需先建置 ee274-data-compression）
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || '/private/tmp/book-browser-qa/node_modules/playwright');
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '../../../..');
const out = path.join(root, 'data/visual-story/paper-restyle/arithmetic-interval');
fs.mkdirSync(out, {recursive: true});
const chrome = process.env.CHROMIUM_PATH || '/Users/wizard/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

(async () => {
  const browser = await chromium.launch({executablePath: chrome, headless: true});
  const problems = [];
  try {
    const page = await browser.newPage({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
    page.on('pageerror', e => problems.push(`pageerror ${e.message}`));
    await page.goto(`file://${root}/book/ee274-data-compression/html/resources/arithmetic-interval/index.html`);
    const target = await page.evaluate(() => story.pages.findIndex(p => p.id === 'try-symbols'));
    for (let i = 0; i < target; i++) await page.locator('#next').click();
    for (const s of ['B', 'A', 'C']) await page.locator(`#page [data-ac="${s}"]`).click();
    await page.locator('#page .ac-controls').evaluate(e => e.scrollIntoView({block: 'start'}));
    await page.mouse.move(5, 5);
    const m = await page.evaluate(() => {
      const nav = document.querySelector('nav').getBoundingClientRect();
      const box = sel => { const r = document.querySelector(sel).getBoundingClientRect(); return {top: r.top, bottom: r.bottom}; };
      const rows = [{lo: 0, hi: 1}, ...acTrace('BAC')];
      const ranges = [...document.querySelectorAll('#page .ac-main .ac-range')].map((el, i) => {
        const t = el.parentElement, tr = t.getBoundingClientRect(), r = el.getBoundingClientRect();
        const w = t.clientWidth, x0 = tr.left + t.clientLeft;
        return {dLeft: Math.abs((r.left - x0) - rows[i].lo * w), dWidth: Math.abs(r.width - (rows[i].hi - rows[i].lo) * w)};
      });
      return {navTop: nav.top, controls: box('#page .ac-controls'), result: box('#page .ac-main'), word: document.querySelector('#page .ac-number').textContent, ranges, count: rows.length};
    });
    if (!/BAC/.test(m.word)) problems.push(`序列未顯示 BAC：${m.word}`);
    for (const [name, b] of [['控制項', m.controls], ['主要結果', m.result]]) {
      if (b.top < 0 || b.bottom > m.navTop) problems.push(`${name} 不在導覽上方可見：top ${b.top.toFixed(1)} bottom ${b.bottom.toFixed(1)} nav ${m.navTop.toFixed(1)}`);
    }
    if (m.ranges.length !== m.count) problems.push(`區間數 ${m.ranges.length} ≠ ${m.count}`);
    m.ranges.forEach((d, i) => { if (d.dLeft > 1 || d.dWidth > 1) problems.push(`第 ${i} 列 left 差 ${d.dLeft.toFixed(2)}px、width 差 ${d.dWidth.toFixed(2)}px`); });
    await page.screenshot({path: `${out}/controls-390.png`});
    console.log(JSON.stringify(m));
  } finally { await browser.close(); }
  if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
  else console.log('PASS: 390×844 按 B、A、C 後控制項與共同座標同在導覽上方；4 列區間 left/width 與模型差 ≤ 1px（非視覺驗收）');
})().catch(e => { console.error(e); process.exitCode = 1; });
