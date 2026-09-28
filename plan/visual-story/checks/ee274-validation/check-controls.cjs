const {chromium}=require('/private/tmp/book-browser-qa/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:'/Users/wizard/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base='file:///Users/wizard/Desktop/MacCode/book/book/ee274-data-compression/html/';
 const jump=async n=>{await page.locator('#index summary').click();await page.locator(`[data-page="${n}"]`).click();await page.locator('#pin').click();await page.keyboard.press('Escape');};
 const enter=async()=>page.locator('a[href="resources/arithmetic-interval/index.html"]').click();
 await page.goto(base+'06-arithmetic-coding.html');await enter();
 await jump(3);await page.locator('[data-answer]').last().focus();await page.keyboard.press('Enter');assert.match(await page.locator('#feedback').innerText(),/對。/);
 await page.locator('#next').click();
 for(const s of ['B','A','C']){await page.locator(`[data-ac="${s}"]`).focus();await page.keyboard.press('Enter');}
 assert.match(await page.locator('[data-ac-output]').innerText(),/BAC/);
 assert(await page.locator('[data-ac="A"]').isDisabled());
 await page.locator('#next').click();await page.locator('#prev').click();assert.match(await page.locator('[data-ac-output]').innerText(),/BAC/);
 await page.locator('[data-ac="undo"]').click();assert.match(await page.locator('[data-ac-output]').innerText(),/序列：BA/);
 await page.locator('[data-ac="reset"]').click();assert.match(await page.locator('[data-ac-output]').innerText(),/（空）/);
 await page.locator('#story-back').click();assert(page.url().endsWith('06-arithmetic-coding.html'));
 for(const chapter of ['06-arithmetic-coding','09-context-ac-llm']){await page.goto(base+'resources/arithmetic-interval/index.html');await jump(8);await page.locator(`#page a[href="../../${chapter}.html"]`).click();assert(page.url().endsWith(chapter+'.html'));}
 await page.goto(base+'resources/arithmetic-interval/index.html');await jump(8);await page.locator('#next').click();assert.match(await page.locator('#position').innerText(),/1 \/ 9/);
 await page.setViewportSize({width:1280,height:900});await page.locator('#index summary').hover();assert(await page.locator('#index').evaluate(e=>e.open));
 await page.mouse.move(1000,250);assert(!(await page.locator('#index').evaluate(e=>e.open)));
 await page.locator('#next').hover();assert(await page.locator('#next .mini').evaluate(e=>e.getBoundingClientRect().width)>0);
 await page.mouse.move(1000,250);assert.equal(await page.locator('#next .mini').evaluate(e=>e.getBoundingClientRect().width),0);
 assert.deepEqual(errors,[]);console.log('PASS: chapter links, quiz, symbol buttons/undo/reset, restoration, index/replay/hover, no pageerrors');
}finally{await browser.close();}
})();
