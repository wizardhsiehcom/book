const {chromium}=require('/private/tmp/book-browser-qa/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const root='/Users/wizard/Desktop/MacCode/book';
const cases=[['systems-network-foundations','tcp-stream',11],['database-correctness','unknown-outcome',9],['cowos','package-path',9],['v5','threshold-review',9],['ee274-data-compression','arithmetic-interval',9]];
(async()=>{
 const browser=await chromium.launch({executablePath:'/Users/wizard/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',headless:true});
 const report=[],errors=[];
 try{
 for(const [book,topic,count] of cases.filter(([book])=>!process.env.BOOKS||process.env.BOOKS.split(',').includes(book))){
 for(const [name,width,height] of [['desktop',1280,900],['small',320,740],['text200',390,844]]){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(`${book}: ${e.message}`));
  await page.goto(`file://${root}/book/${book}/html/resources/${topic}/index.html`);
  for(let i=0;i<count;i++){
   if(book==='ee274-data-compression'&&i===4)for(const symbol of ['B','A','C'])await page.locator(`[data-ac="${symbol}"]`).click();
   if(book==='database-correctness'&&i===5){await page.locator('[data-advance]').click();await page.locator('[data-advance]').click();assert.equal(await page.locator('#page .outcome-event').count(),4);}
   if(book==='v5'&&i===4){const slider=page.locator('[data-threshold]');await slider.focus();await page.keyboard.press('Home');for(let n=0;n<6;n++)await page.keyboard.press('ArrowRight');assert.match(await page.locator('[data-review-output]').innerText(),/84 分鐘／小時/);}
   if(name==='text200')await page.evaluate(()=>{
    const nodes=[...document.querySelectorAll('header *, #page *, #index summary, nav *')].filter(e=>!e.closest('.mini'));
    const sizes=nodes.map(e=>parseFloat(getComputedStyle(e).fontSize));nodes.forEach((e,i)=>{if(!e.dataset.enlarged){e.style.fontSize=`${sizes[i]*2}px`;e.dataset.enlarged='true';}});
   });
   await page.mouse.move(width-5,5);await page.waitForTimeout(50);
   const metric=await page.evaluate(()=>{const label=document.querySelector('#story-label').getBoundingClientRect(),summary=document.querySelector('#index summary').getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth,headerOverlap:label.left<summary.right&&label.bottom>summary.top&&label.top<summary.bottom,opacity:getComputedStyle(document.querySelector('#page .stage')).opacity};});
   report.push({book,name,page:i+1,...metric});
   if((book==='ee274-data-compression'&&[4,6,7,8].includes(i))||(book==='v5'&&[4,8].includes(i))||(book==='database-correctness'&&[5,8].includes(i))||(book==='cowos'&&i===8)||(book==='systems-network-foundations'&&i===10))await page.screenshot({path:`${root}/data/visual-story/teaching-improvements/${book}-${name}-${i+1}.png`,fullPage:true});
   if((book==='v5'||book==='ee274-data-compression')&&i===4){
    const details=page.locator('#page details').first();await details.locator('summary').focus();await page.keyboard.press('Enter');assert(await details.evaluate(e=>e.open));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.screenshot({path:`${root}/data/visual-story/teaching-improvements/${book}-${name}-expanded.png`,fullPage:true});
    await details.locator('summary').click();
    await page.locator('#next').click();await page.locator('#prev').click();
    if(book==='v5')assert.match(await page.locator('[data-review-output]').innerText(),/84 分鐘／小時/);
    else assert.match(await page.locator('[data-ac-output]').innerText(),/BAC/);
   }
   if(i===count-1){await page.locator('#page [data-answer]').first().focus();await page.keyboard.press('Enter');assert.match(await page.locator('#feedback').innerText(),/對。/);}
   await page.locator('#next').click();
  }
  await page.close();
 }
 console.log(`Checked ${book}`);
 }
 fs.writeFileSync(`${root}/data/visual-story/teaching-improvements/${process.env.BOOKS?'metrics-final':'metrics'}.json`,JSON.stringify(report,null,2));
 assert.deepEqual(errors,[]);assert.deepEqual(report.filter(r=>r.overflow||r.headerOverlap||r.opacity!=='1'),[]);
 console.log(`PASS: ${report.length} layouts, five final questions, live workload/timeline, no pageerrors`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
