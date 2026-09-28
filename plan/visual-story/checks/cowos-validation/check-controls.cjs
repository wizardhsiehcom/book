const {chromium}=require('/private/tmp/book-browser-qa/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:'/Users/wizard/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base='file:///Users/wizard/Desktop/MacCode/book/book/cowos/html/';
 const jump=async n=>{await page.locator('#index summary').click();await page.locator(`[data-page="${n}"]`).click();await page.locator('#pin').click();await page.keyboard.press('Escape');};
 for(const chapter of ['03-silicon-interposer-2d5','06-cowos-r-l','07-hbm-integration']){
  await page.goto(base+chapter+'.html');await page.locator('a[href="resources/package-path/index.html"]').click();
  assert.match(page.url(),/package-path\/index.html$/);
 }
 await jump(5);
 await page.locator('[data-answer]').first().focus();await page.keyboard.press('Enter');assert.match(await page.locator('#feedback').innerText(),/再看/);
 await page.keyboard.press('Tab');await page.keyboard.press('Enter');assert.match(await page.locator('#feedback').innerText(),/對。/);
 await page.locator('#next').click();
 for(const variant of ['R','L','S']){
  await page.locator(`[data-variant="${variant}"]`).focus();await page.keyboard.press('Space');
  assert.equal(await page.locator(`[data-variant="${variant}"]`).getAttribute('aria-pressed'),'true');
  assert.match(await page.locator('.pkg-title').innerText(),new RegExp(`CoWoS-${variant}`));
  assert.equal(await page.locator('[data-package] .pkg-bridge').count(),variant==='L'?1:0);
  assert.equal(await page.locator('[data-package] .pkg-via').count(),variant==='S'?1:0);
  await page.locator('#next').click();await page.locator('#prev').click();
  assert.equal(await page.locator(`[data-variant="${variant}"]`).getAttribute('aria-pressed'),'true');
 }
 await page.locator('[data-variant="L"]').click();
 await page.screenshot({path:'data/visual-story/cowos-validation/mobile-L.png',fullPage:true});
 await page.locator('#story-back').click();assert.match(page.url(),/03-silicon-interposer-2d5.html$/);
 await page.locator('a[href="resources/package-path/index.html"]').click();await jump(8);
 await page.locator('#page a[href="../../06-cowos-r-l.html"]').click();assert.match(page.url(),/06-cowos-r-l.html$/);
 await page.locator('a[href="resources/package-path/index.html"]').click();await jump(8);
 await page.locator('#page a[href="../../07-hbm-integration.html"]').click();assert.match(page.url(),/07-hbm-integration.html$/);
 await page.locator('a[href="resources/package-path/index.html"]').click();await jump(8);await page.locator('#next').click();assert.match(await page.locator('#position').innerText(),/1 \/ 9/);
 await page.setViewportSize({width:1280,height:900});
 await page.locator('#index summary').hover();assert(await page.locator('#index').evaluate(e=>e.open));
 await page.mouse.move(1000,250);assert(!(await page.locator('#index').evaluate(e=>e.open)));
 await page.locator('#next').hover();assert(await page.locator('#next .mini').evaluate(e=>e.getBoundingClientRect().width)>0);
 await page.mouse.move(1000,250);assert.equal(await page.locator('#next .mini').evaluate(e=>e.getBoundingClientRect().width),0);
 assert.deepEqual(errors,[]);console.log('PASS: 3 chapter entrances, return/06/07 links, quiz keyboard, S/R/L keyboard/restoration, index/replay/hover, no pageerrors');
}finally{await browser.close();}
})();
