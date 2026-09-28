// V5 門檻頁（紙本改版）：390×844 捲到滑桿後，滑桿與主要結果都在底部導覽上方；
// 滑桿改值後，分流條與工時尺的寬度要與同一模型的個數／分鐘成比例。
// 用法：node plan/visual-story/checks/paper-restyle/v5-controls.cjs（需先建置 v5）
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || '/private/tmp/book-browser-qa/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '../../../..');
const out = path.join(root, 'data/visual-story/paper-restyle/threshold-review');
fs.mkdirSync(out, {recursive: true});
const chrome = process.env.CHROMIUM_PATH || '/Users/wizard/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

(async () => {
  const browser = await chromium.launch({executablePath: chrome, headless: true});
  const errors = [];
  try {
    const page = await browser.newPage({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`file://${root}/book/v5/html/resources/threshold-review/index.html`);
    const idx = await page.evaluate(() => story.pages.findIndex(p => p.id === 'change-threshold'));
    for (let i = 0; i < idx; i++) await page.locator('#next').click();
    const slider = page.locator('[data-threshold]');
    const results = [];
    for (const t of [60, 30, 50, 0, 100]) {
      await slider.fill(String(t));
      await slider.dispatchEvent('input');
      await page.locator('.rev-control').evaluate(e => window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 10));
      await page.mouse.move(385, 5);
      const m = await page.evaluate(() => {
        const nav = document.querySelector('nav').getBoundingClientRect();
        const ctl = document.querySelector('.rev-control').getBoundingClientRect();
        const input = document.querySelector('[data-threshold]').getBoundingClientRect();
        const live = document.querySelector('.rev-live').getBoundingClientRect();
        const strip = document.querySelector('.rev-live .rev-strip');
        const inner = strip.clientWidth; // 扣除外框
        const segs = [...strip.querySelectorAll('.rev-seg')].map(s => ({n: +s.dataset.count, w: s.getBoundingClientRect().width}));
        const routes = [...document.querySelectorAll('.rev-live .rev-route-bar span')].map(s => ({n: +s.dataset.count, w: s.getBoundingClientRect().width}));
        const meter = document.querySelector('.rev-live .rev-meter');
        const mins = [...meter.querySelectorAll('span')].map(s => ({n: +s.dataset.minutes, w: s.getBoundingClientRect().width}));
        const cap = meter.querySelector('.rev-cap').getBoundingClientRect().left - meter.getBoundingClientRect().left;
        return {navTop: nav.top, controlTop: ctl.top, inputBottom: input.bottom, liveBottom: live.bottom, inner, routeWidth: document.querySelector('.rev-live .rev-route-bar').clientWidth, meterWidth: meter.clientWidth, segs, routes, mins, cap,
          text: document.querySelector('.rev-live').textContent};
      });
      const w = await page.evaluate(t => ({load: reviewLoad(t), counts: reviewCounts(t), total: reviewTotal, scale: reviewScale, cap: reviewCapacity}), t);
      // 版面：控制項頂端可見，主要結果底端在導覽上方
      assert(m.controlTop >= 0 && m.liveBottom <= m.navTop, `t=${t} 版面 ${JSON.stringify({controlTop: m.controlTop, liveBottom: m.liveBottom, navTop: m.navTop})}`);
      // 分流條：每段寬度 = 個數 / 總數 × 條寬（容許 1px 捨入）
      const segSum = m.segs.reduce((s, x) => s + x.n, 0);
      assert.equal(segSum, w.total, `t=${t} 分段加總`);
      for (const s of m.segs) assert(Math.abs(s.w - s.n / w.total * m.inner) <= 1, `t=${t} 分段 ${JSON.stringify(s)} inner=${m.inner}`);
      assert.deepEqual(m.segs.map(s => s.n), [w.counts.tp, w.counts.fp, w.counts.fn, w.counts.tn].filter(Boolean), `t=${t} 分段順序`);
      for (const r of m.routes) assert(Math.abs(r.w - r.n / w.total * m.routeWidth) <= 1, `t=${t} 路徑條 ${JSON.stringify(r)}`);
      // 工時尺：寬度 = 分鐘 / 滿格；容量線位置 = 容量 / 滿格
      const minSum = m.mins.reduce((s, x) => s + x.n, 0);
      assert.equal(minSum, w.load.minutes, `t=${t} 分鐘加總`);
      for (const x of m.mins) assert(Math.abs(x.w - x.n / w.scale * m.meterWidth) <= 1, `t=${t} 工時尺 ${JSON.stringify(x)}`);
      assert(Math.abs(m.cap - w.cap / w.scale * m.meterWidth) <= 1.5, `t=${t} 容量線`);
      assert(m.text.includes(`送複判 ${w.load.candidates}`) && m.text.includes(`${w.load.minutes} 分鐘／小時`), `t=${t} 文字`);
      results.push({t, candidates: w.load.candidates, minutes: w.load.minutes, segs: m.segs, mins: m.mins, controlTop: Math.round(m.controlTop), liveBottom: Math.round(m.liveBottom), navTop: Math.round(m.navTop)});
      if (t === 30 || t === 60) await page.screenshot({path: `${out}/controls-390-t${t}.png`});
    }
    // 離頁返回保留值
    await slider.fill('30'); await slider.dispatchEvent('input');
    await page.locator('#next').click(); await page.locator('#prev').click();
    assert.equal(await page.locator('[data-threshold]').inputValue(), '30');
    assert.deepEqual(errors, []);
    fs.writeFileSync(`${out}/controls-metrics.json`, JSON.stringify(results, null, 1));
    console.log('PASS: 390×844 滑桿與主要結果同在導覽上方；5 個門檻的分流條、路徑條、工時尺與容量線寬度皆與模型一致；返回保留值');
    for (const r of results) console.log(`  t=${r.t}: 候選 ${r.candidates}、${r.minutes} 分鐘；控制項頂 ${r.controlTop}、結果底 ${r.liveBottom}、導覽頂 ${r.navTop}`);
  } finally { await browser.close(); }
})().catch(e => { console.error(e.message || e); process.exitCode = 1; });
