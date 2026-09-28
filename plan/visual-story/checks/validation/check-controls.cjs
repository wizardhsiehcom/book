const {chromium}=require(process.env.PLAYWRIGHT_MODULE || '/private/tmp/book-browser-qa/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:'/Users/wizard/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',headless:true});
try {
const page=await browser.newPage({viewport:{width:1280,height:900}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('file:///Users/wizard/Desktop/MacCode/book/book/systems-network-foundations/html/resources/tcp-stream/index.html');
await page.locator('#index summary').hover();assert(await page.locator('#index').evaluate(e=>e.open));
await page.mouse.move(900,300);assert(!(await page.locator('#index').evaluate(e=>e.open)));
await page.locator('#next').hover();assert(await page.locator('#next .mini').evaluate(e=>e.getBoundingClientRect().width)>0);
await page.mouse.move(900,300);assert.equal(await page.locator('#next .mini').evaluate(e=>e.getBoundingClientRect().width),0);
await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'story-back');
await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.tagName),'A');
await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.tagName),'SUMMARY');
await page.keyboard.press('Enter');assert.equal(await page.locator('#pin').getAttribute('aria-pressed'),'true');
await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'pin');
await page.keyboard.press('Enter');await page.keyboard.press('Escape');assert(!(await page.locator('#index').evaluate(e=>e.open)));
await page.locator('#next').click();await page.locator('#next').click();
await page.locator('[data-answer]').first().focus();await page.keyboard.press('Tab');await page.keyboard.press('Enter');assert.match(await page.locator('#feedback').innerText(),/對。/);
await page.setViewportSize({width:390,height:844});
await page.locator('#index summary').click();await page.locator('[data-page="8"]').click();
await page.locator('#pin').click();await page.keyboard.press('Escape');
await page.locator('#page select').selectOption('single');
for(let i=0;i<12;i++)await page.getByRole('button',{name:'接收下一段',exact:true}).click();
assert(await page.getByRole('button',{name:'接收下一段',exact:true}).isDisabled());
assert.match(await page.locator('.tcp-meter').innerText(),/12 次接收 · 2 筆完整訊息 · 尾巴 0 bytes/);
assert.deepEqual(errors,[]);
console.log('PASS: hover, keyboard focus/quiz/index, mobile 12-byte receive, no page errors');
}finally{await browser.close();}
})();
