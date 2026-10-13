// 資料檢查：頁數、唯一 ID、講者動作、互動頁的預覽，以及兩個互動實驗的判定邏輯與本機引用。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const stub = () => '';
const context = { document: { currentScript: { getAttribute: () => 'resources/harness-engineering/story.js' } }, deck: {
  table: stub, cards: stub, compare: stub, steps: stub, flow: stub, sequence: stub, predict: stub,
  cover: o => ({ id: 'cover', ...o }), end: o => ({ id: 'thanks', ...o }),
} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'story.js'), 'utf8') + '\nthis.s = story; this.edit = editResult; this.sum = summaryLabHtml;', context);
const pages = context.s.pages;
assert.equal(pages.length, 11);
assert.equal(new Set(pages.map(p => p.id)).size, 11);
for (const p of pages) { assert.ok(p.instruction, p.id); if (p.mount) assert.ok(p.previewArt, p.id); }
assert.equal(context.s.attachments.length, 4);
for (const a of context.s.attachments) assert.ok(fs.existsSync(path.join(root, a.href)), a.href);

const e = (f, o) => JSON.parse(JSON.stringify(context.edit(f, o).json));
assert.deepEqual([e('one', 'short').changed, e('one', 'short').matches], [true, 1]);
assert.deepEqual([e('zero', 'short').error, e('zero', 'short').changed], ['not_found', false]);
assert.deepEqual([e('two', 'short').error, e('two', 'short').matches], ['ambiguous', 2]);
assert.equal(e('two', 'long').changed, true);
assert.ok(context.edit('one', 'short').after.includes('total >= 1000'));
assert.ok(!context.edit('two', 'short').after.includes('>=')); // 拒絕時原文不變

assert.ok(context.sum('incomplete').includes('限制、證據'));
assert.ok(context.sum('incorrect').includes('抓到問題：證據'));
assert.ok(context.sum('preserved').includes('可以交接'));

for (const [, ref] of fs.readFileSync(path.join(root, 'index.html'), 'utf8').matchAll(/(?:src|href)="([^"]+)"/g)) {
  assert.ok(!ref.startsWith('http'), ref); assert.ok(fs.existsSync(path.resolve(root, ref)), ref);
}
console.log('PASS: 11 pages, IDs, notes, 4 attachments, previews, edit/summary logic, local references');
