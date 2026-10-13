const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const context = { document: {currentScript:{getAttribute:()=> 'resources/gpm/story.js'}}, deck: {
  table:()=>'',compare:()=>'',steps:()=>'', cover:o=>({id:'cover',...o}),end:o=>({id:'thanks',...o})
}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'story.js'),'utf8')+'\nthis.result = story; this.calc = capacity;',context);
assert.equal(context.result.pages.length,28);
assert.equal(new Set(context.result.pages.map(p=>p.id)).size,28);
for(const p of context.result.pages){assert.ok(p.instruction,p.id);if(p.mount)assert.ok(p.previewArt,p.id);}
assert.equal(context.calc(80000,120,70).monthly,15120);
assert.equal(context.calc(80000,120,70).added,0);
assert.equal(context.calc(120000,120,70).added,2);
assert.equal(context.calc(90720,120,70).needed,6);
assert.equal(context.calc(90721,120,70).needed,7);
for(const [,ref] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/(?:src|href)="([^"]+)"/g)){
 assert.ok(!ref.startsWith('http'),ref); assert.ok(fs.existsSync(path.resolve(root,ref)),ref);
}
console.log('PASS: 28 pages, IDs, notes, preview, capacity boundaries, local references');

const sources = fs.readFileSync(path.join(__dirname, 'sources.html'), 'utf8');
assert.ok(sources.includes('<table>'));
assert.ok(sources.includes('<article class="source-content">'));
assert.ok(!sources.includes('<pre>#'));
console.log('PASS: source Markdown rendered as static HTML');
