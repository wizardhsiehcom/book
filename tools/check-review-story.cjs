const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync('docs/v5/resources/threshold-review/story.js','utf8')+'\nglobalThis.subject={story,reviewCounts,reviewRatio,reviewLoad,mountReview};',context);
const {story,reviewCounts,reviewRatio,reviewLoad,mountReview}=context.subject;
assert.equal(new Set(story.pages.map(p=>p.id)).size,story.pages.length);
for(const p of story.pages){for(const key of ['id','section','title','lead','art','point']) assert.equal(typeof p[key],'string');if(p.mount)assert.equal(typeof p.previewArt,'string');}
const plain=x=>JSON.parse(JSON.stringify(x));
assert.deepEqual(plain(reviewCounts(60)),{tp:7,fp:7,fn:3,tn:83});
assert.deepEqual(plain(reviewCounts(30)),{tp:10,fp:32,fn:0,tn:58});
assert.deepEqual(plain(reviewCounts(0)),{tp:10,fp:90,fn:0,tn:0});
assert.deepEqual(plain(reviewCounts(100)),{tp:0,fp:0,fn:10,tn:90});
assert.equal(reviewCounts(65).tp,7);assert.equal(reviewCounts(70).tp,6);
let prev=reviewCounts(0);
for(let t=0;t<=100;t++){
 const c=reviewCounts(t);assert.equal(c.tp+c.fn,10);assert.equal(c.fp+c.tn,90);
 assert(c.tp<=prev.tp&&c.fp<=prev.fp&&c.fn>=prev.fn&&c.tn>=prev.tn);prev=c;
}
assert.equal(reviewRatio(0,0),'0 / 0：無定義');assert.equal(reviewRatio(10,42),'10 / 42 = 23.81%');
assert.deepEqual(plain(reviewLoad(60)),{candidates:14,minutes:28,excess:0});
assert.deepEqual(plain(reviewLoad(30)),{candidates:42,minutes:84,excess:12});
const slider={value:'60',events:{},setAttribute(){},addEventListener(k,f){this.events[k]=f;},removeEventListener(k,f){assert.equal(this.events[k],f);delete this.events[k];}};
const output={},label={},state={};
const root={querySelector:s=>s==='[data-threshold]'?slider:s==='[data-review-output]'?output:label};
let cleanup=mountReview(root,state);assert.equal(state.threshold,60);
slider.value='30';slider.events.input();assert.equal(state.threshold,30);assert.match(output.innerHTML,/送複判 42/);assert.match(output.innerHTML,/84 分鐘／小時/);assert.match(output.innerHTML,/超出容量 12/);
slider.value='50';slider.events.input();assert.match(output.innerHTML,/40 分鐘／小時/);assert.match(output.innerHTML,/總需求未超出容量/);
slider.value='30';slider.events.input();
cleanup();assert.equal(Object.keys(slider.events).length,0);
cleanup=mountReview(root,state);assert.equal(slider.value,30);assert.match(label.textContent,/門檻 30/);cleanup();
console.log('PASS: story contract, 101 thresholds, equality, totals, denominators, load, state and cleanup');

assert.deepEqual(plain(reviewLoad(50)),{candidates:20,minutes:40,excess:0});assert(story.pages.at(-1).question);
