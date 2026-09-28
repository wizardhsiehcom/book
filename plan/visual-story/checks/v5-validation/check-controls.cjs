const {chromium}=require('/private/tmp/book-browser-qa/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:'/Users/wizard/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base='file:///Users/wizard/Desktop/MacCode/book/book/v5/html/';
 const jump=async n=>{await page.locator('#index summary').click();await page.locator(`[data-page="${n}"]`).click();await page.locator('#pin').click();await page.keyboard.press('Escape');};
 const enter=async()=>page.locator('a[href="resources/threshold-review/index.html"]').click();
 for(const chapter of ['04-defects-and-quality','08-adc-and-human-review','13-throughput-and-acceptance']){
  await page.goto(base+chapter+'.html');await enter();assert.match(page.url(),/threshold-review\/index.html$/);
 }
 await jump(3);await page.locator('[data-answer]').first().focus();await page.keyboard.press('Enter');assert.match(await page.locator('#feedback').innerText(),/看分數帶/);
 await page.keyboard.press('Tab');await page.keyboard.press('Enter');assert.match(await page.locator('#feedback').innerText(),/對。/);
 await page.locator('#next').click();const slider=page.locator('[data-threshold]');
 await slider.focus();for(let i=0;i<6;i++)await page.keyboard.press('ArrowLeft');
 assert.equal(await slider.inputValue(),'30');assert.match(await page.locator('[data-review-output]').innerText(),/送複判 42/);
 await page.locator('#next').click();await page.locator('#prev').click();assert.equal(await slider.inputValue(),'30');
 await slider.focus();await page.keyboard.press('Home');assert.equal(await slider.inputValue(),'0');assert.match(await page.locator('[data-review-output]').innerText(),/送複判 100/);
 await page.keyboard.press('End');assert.equal(await slider.inputValue(),'100');assert.match(await page.locator('[data-review-output]').innerText(),/直接放行 100/);
 await page.locator('#story-back').click();assert.match(page.url(),/04-defects-and-quality.html$/);
 for(const chapter of ['04-defects-and-quality','08-adc-and-human-review','13-throughput-and-acceptance']){
  await enter();await jump(8);await page.locator(`#page a[href="../../${chapter}.html"]`).click();assert(page.url().endsWith(chapter+'.html'));
 }
 await enter();await jump(8);await page.locator('#next').click();assert.match(await page.locator('#position').innerText(),/1 \/ 9/);
 await page.setViewportSize({width:1280,height:900});await page.locator('#index summary').hover();assert(await page.locator('#index').evaluate(e=>e.open));
 await page.mouse.move(1000,250);assert(!(await page.locator('#index').evaluate(e=>e.open)));
 await page.locator('#next').hover();assert(await page.locator('#next .mini').evaluate(e=>e.getBoundingClientRect().width)>0);
 await page.mouse.move(1000,250);assert.equal(await page.locator('#next .mini').evaluate(e=>e.getBoundingClientRect().width),0);
 assert.deepEqual(errors,[]);console.log('PASS: chapter links, quiz, slider arrows/Home/End, restoration, index/replay/hover, no pageerrors');
}finally{await browser.close();}
})();
