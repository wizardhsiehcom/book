const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync('docs/cowos/resources/package-path/story.js','utf8')+'\nglobalThis.subject = {story, packageSection, mountPackage};',context);
const {story, packageSection, mountPackage} = context.subject;
assert.equal(new Set(story.pages.map(p=>p.id)).size,story.pages.length);
for(const p of story.pages){
 for(const key of ['id','section','title','lead','art','point'])assert.equal(typeof p[key],'string');
 if(p.mount)assert.equal(typeof p.previewArt,'string');
}
assert.match(packageSection('S','across'),/pkg-path-across/);
assert.match(packageSection('S','down'),/pkg-path-down/);
assert.match(packageSection('S'),/pkg-via/);
assert(!packageSection('R').includes('pkg-via'));
assert(!packageSection('R').includes('pkg-bridge'));
assert.match(packageSection('L'),/pkg-bridge/);
assert(!packageSection('L').includes('pkg-via'));
const buttons=['S','R','L'].map(variant=>({dataset:{variant},events:{},attrs:{},
 setAttribute(k,v){this.attrs[k]=v;},
 addEventListener(k,fn){assert(!this.events[k]);this.events[k]=fn;},
 removeEventListener(k,fn){assert.equal(this.events[k],fn);delete this.events[k];},
}));
const output={};const root={querySelectorAll:()=>buttons,querySelector:()=>output};const state={};
let cleanup=mountPackage(root,state);
for(const button of buttons){
 button.events.click({currentTarget:button});
 assert.equal(state.variant,button.dataset.variant);
 assert.equal(button.attrs['aria-pressed'],'true');
 assert.equal(buttons.filter(b=>b.attrs['aria-pressed']==='true').length,1);
 assert.match(output.innerHTML,new RegExp(`CoWoS-${state.variant}`));
 cleanup();buttons.forEach(b=>assert.equal(Object.keys(b.events).length,0));
 cleanup=mountPackage(root,state);
 assert.equal(button.attrs['aria-pressed'],'true');
 assert.match(output.innerHTML,new RegExp(`CoWoS-${state.variant}`));
}
cleanup();
console.log('PASS: package story contract, S/R/L structure, selection, restoration, listener cleanup');

assert(story.pages.at(-1).question);assert.match(story.pages.at(-1).art,/pkg-bridge/);assert(!story.pages.at(-1).art.includes('CoWoS-L'));
