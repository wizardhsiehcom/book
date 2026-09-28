const {chromium}=require(process.env.PLAYWRIGHT_MODULE || '/private/tmp/book-browser-qa/node_modules/playwright');
const fs=require('node:fs');
const out='/Users/wizard/Desktop/MacCode/book/data/visual-story/ee274-validation';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Users/wizard/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',headless:true});
 const report=[];
 for(const [name,width,height,motion] of [['desktop',1280,900,'no-preference'],['mobile',390,844,'no-preference'],['small',320,740,'reduce'],['zoom-equivalent',640,450,'reduce'],['text200',390,844,'reduce']]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:motion});
 await page.goto('file:///Users/wizard/Desktop/MacCode/book/book/ee274-data-compression/html/resources/arithmetic-interval/index.html');
 for(let i=0;i<9;i++){
 if(i===4) for(const symbol of ['B','A','C']) await page.locator(`[data-ac="${symbol}"]`).click();
 if(name==='text200') await page.evaluate(()=>{
 const nodes=[...document.querySelectorAll('header *, #page *, #index summary, nav *')].filter(e=>!e.closest('.mini'));
 const sizes=nodes.map(e=>parseFloat(getComputedStyle(e).fontSize));
 nodes.forEach((e,i)=>{if(!e.dataset.enlarged){e.style.fontSize=`${sizes[i]*2}px`;e.dataset.enlarged='true';}});
 });
 await page.waitForTimeout(350);
 const metrics=await page.evaluate(()=>{
 const stage=document.querySelector('#page .stage'), label=document.querySelector('#story-label').getBoundingClientRect(), summary=document.querySelector('#index summary').getBoundingClientRect();
 return {overflow:document.documentElement.scrollWidth>innerWidth,opacity:getComputedStyle(stage).opacity,animation:getComputedStyle(stage).animationName,headerOverlap:label.left<summary.right&&label.bottom>summary.top&&label.top<summary.bottom};
 });
 report.push({name,page:i+1,...metrics});
 if([2,4,6,7].includes(i)) await page.screenshot({path:`${out}/${name}-${i+1}.png`,fullPage:true});
 await page.locator('#next').click();
 }
 await page.close();
 }
 fs.writeFileSync(`${out}/metrics.json`,JSON.stringify(report,null,2));
 console.log(JSON.stringify(report.filter(r=>r.overflow||r.opacity!=='1'||r.headerOverlap),null,2));
 await browser.close();
 if(report.some(r=>r.overflow||r.opacity!=='1'||r.headerOverlap)) process.exitCode=1;
})();
