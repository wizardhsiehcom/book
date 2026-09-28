const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({});vm.runInContext(fs.readFileSync('docs/ee274-data-compression/resources/arithmetic-interval/story.js','utf8')+';globalThis.api={acTrace,acDecode,acAxis,mountAc,story};',ctx);
const {acTrace,acDecode,acAxis,mountAc,story}=ctx.api;
let count=0;
function check(word){if(word){const rows=acTrace(word),r=rows.at(-1);assert.equal(r.hi-r.lo,[...word].reduce((p,s)=>p*(s==='A'?.5:.25),1));assert.equal(acDecode(r.lo,word.length),word);assert.equal(acDecode((r.lo+r.hi)/2,word.length),word);assert(r.lo>=r.parentLo&&r.hi<=r.parentHi);count++;}if(word.length<3)for(const s of 'ABC')check(word+s);}
check('');assert.equal(count,39);assert.equal(acDecode(.5,1),'B');assert.equal(acDecode(.75,1),'C');assert.throws(()=>acDecode(1,3));assert.throws(()=>acTrace('D'));
const r=acTrace('BAC').at(-1);assert.equal(r.lo,19/32);assert.equal(r.hi,20/32);assert(18/32<r.lo);assert.equal(acDecode(19/32,3),'BAC');
const buttons=['A','B','C','undo','reset'].map(action=>({dataset:{ac:action},listeners:new Set(),addEventListener(_,fn){this.listeners.add(fn);},removeEventListener(_,fn){this.listeners.delete(fn);},click(){for(const fn of this.listeners)fn({currentTarget:this});}}));const output={innerHTML:''},root={querySelectorAll:()=>buttons,querySelector:()=>output},state={};
let cleanup=mountAc(root,state);for(const i of [1,0,2])buttons[i].click();assert.equal(state.word,'BAC');assert(buttons[0].disabled);buttons[0].click();assert.equal(state.word,'BAC');cleanup();assert(buttons.every(b=>b.listeners.size===0));cleanup=mountAc(root,state);assert.match(output.innerHTML,/BAC/);buttons[3].click();assert.equal(state.word,'BA');buttons[4].click();assert.equal(state.word,'');cleanup();
assert.equal(story.pages.length,9);assert.equal(new Set(story.pages.map(p=>p.id)).size,9);for(const p of story.pages){for(const key of ['section','title','lead','art','point'])assert.equal(typeof p[key],'string');if(p.mount)assert(p.previewArt);}
console.log('PASS: 39 sequences, boundary decoding, binary interval, controls/restoration/cleanup, story contract');

const ca=acTrace('CA').at(-1);assert.equal(ca.lo,.75);assert.equal(ca.hi,.875);
assert.match(acAxis([{label:'BAC',lo:19/32,hi:20/32}],0,1,19/32),/left:59.375%;width:3.125%/);
assert.match(acAxis([{label:'BAC',lo:19/32,hi:20/32}],0,1,19/32),/ac-marker.*left:59.375%/);
assert(story.pages.at(-1).question);
