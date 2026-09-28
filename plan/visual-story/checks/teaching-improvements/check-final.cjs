const {chromium}=require('/private/tmp/book-browser-qa/node_modules/playwright');
const assert=require('node:assert/strict');
const root='/Users/wizard/Desktop/MacCode/book';
const cases=[['systems-network-foundations','tcp-stream',11],['database-correctness','unknown-outcome',9],['cowos','package-path',9],['v5','threshold-review',9],['ee274-data-compression','arithmetic-interval',9]];
(async()=>{const browser=await chromium.launch({executablePath:'/Users/wizard/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',headless:true});try{
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 for(const [book,topic,count]of cases){
  await page.goto(`file://${root}/book/${book}/html/resources/${topic}/index.html`);
  for(let i=0;i<count-1;i++)await page.locator('#next').click();
  assert.equal(await page.locator('#feedback').innerText(),'選一個答案，查看解說。');
  await page.locator('#page [data-answer]').last().click();assert((await page.locator('#feedback').innerText()).length>25);
  await page.locator('#page [data-answer]').first().click();assert.match(await page.locator('#feedback').innerText(),/對。/);
  await page.locator('#prev').click();await page.locator('#next').click();assert.match(await page.locator('#feedback').innerText(),/對。/);
 }
 for(const [book,topic]of cases.slice(3)){
  await page.goto(`file://${root}/book/${book}/html/resources/${topic}/index.html`);for(let i=0;i<4;i++)await page.locator('#next').click();
  if(book==='v5'){await page.locator('[data-threshold]').fill('30');await page.locator('[data-threshold]').dispatchEvent('input');}
  else for(const symbol of ['B','A','C'])await page.locator(`[data-ac="${symbol}"]`).click();
  const selector=book==='v5'?'.rev-control':'.ac-controls';await page.locator(selector).evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-10));await page.mouse.move(385,5);
  await page.screenshot({path:`${root}/data/visual-story/teaching-improvements/${book}-control-viewport.png`});
  const dimensions=await page.evaluate(selector=>{const c=document.querySelector(selector).getBoundingClientRect(),nav=document.querySelector('nav').getBoundingClientRect(),result=document.querySelector('.rev-live')||document.querySelector('[data-ac-output] .ac-card');return {controlTop:c.top,resultBottom:result.getBoundingClientRect().bottom,navTop:nav.top};},selector);
  assert(dimensions.controlTop>=0&&dimensions.resultBottom<=dimensions.navTop,JSON.stringify({book,...dimensions}));
 }
 console.log('PASS: five final hints, both answers, answer restoration; 390px controls and main result simultaneously visible');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
