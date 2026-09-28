const {chromium}=require('/private/tmp/book-browser-qa/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:'/Users/wizard/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',headless:true});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base='file:///Users/wizard/Desktop/MacCode/book/book/database-correctness/html/';
 await page.goto(base+'16-unknown-outcome.html');
 await page.locator('a[href="resources/unknown-outcome/index.html"]').click();
 assert.match(page.url(),/resources\/unknown-outcome\/index.html$/);
 await page.locator('#next').click();await page.locator('#next').click();
 await page.locator('[data-answer]').first().focus();await page.keyboard.press('Enter');
 assert.match(await page.locator('#feedback').innerText(),/不能/);
 await page.keyboard.press('Tab');await page.keyboard.press('Enter');
 assert.match(await page.locator('#feedback').innerText(),/對。/);
 await page.locator('#index summary').click();await page.locator('[data-page="5"]').click();
 await page.locator('#pin').click();await page.keyboard.press('Escape');
 for(const [scenario,result] of [['committed','已提交：X'],['rolledback','首次提交'],['pending','仍未知'],['changed','版本衝突']]) {
  await page.locator('[data-scenario]').selectOption(scenario);
  await page.locator('[data-advance]').focus();await page.keyboard.press('Space');
  await page.locator('#next').click();await page.locator('#prev').click();
  assert.equal(await page.locator('[data-scenario]').inputValue(),scenario);
  assert.match(await page.locator('.outcome-step').innerText(),/2 \/ 3/);
  await page.locator('[data-advance]').click();
  assert((await page.locator('[data-result]').innerText()).includes(result));
  assert(await page.locator('[data-advance]').isDisabled());
  await page.locator('[data-reset]').click();
  assert.match(await page.locator('.outcome-step').innerText(),/1 \/ 3/);
 }
 await page.locator('#story-back').click();assert.match(page.url(),/16-unknown-outcome.html$/);
 await page.goto(base+'15-operation-identity.html');
 await page.locator('a[href="resources/unknown-outcome/index.html"]').click();
 await page.locator('#index summary').click();await page.locator('[data-page="8"]').click();
 await page.locator('#pin').click();await page.keyboard.press('Escape');
 await page.locator('#page a[href="../../labs.html#l06"]').click();assert.match(page.url(),/labs.html#l06$/);
 await page.goto(base+'resources/unknown-outcome/index.html');
 await page.locator('#index summary').click();await page.locator('[data-page="8"]').click();
 await page.locator('#pin').click();await page.keyboard.press('Escape');
 await page.locator('#next').click();assert.match(await page.locator('#position').innerText(),/1 \/ 9/);
 assert.deepEqual(errors,[]);
 console.log('PASS: chapter entrances/return/L06, quiz keyboard, index, four scenarios, restoration/reset, replay, no pageerrors');
}finally{await browser.close();}
})();
