const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync('docs/largan/resources/assembly-yield/story.js', 'utf8') + '\nglobalThis.subject={story,asyBlur,asyPairs,asyCost,mountFocus,mountPair,mountCost};', context);
const {story, asyBlur, asyPairs, asyCost, mountFocus, mountPair, mountCost} = context.subject;

assert.equal(new Set(story.pages.map(p => p.id)).size, story.pages.length);
for (const p of story.pages) { for (const k of ['id', 'section', 'title', 'lead', 'art', 'point']) assert.equal(typeof p[k], 'string'); if (p.mount) assert.equal(typeof p.previewArt, 'string'); }
assert.equal(story.back.href, '../../06-assembly-yield-cost.html');

// 幾何離焦 c = |Δz + x·e| / N，N = 2；第 07 頁題目答案
assert.equal(asyBlur(4, 0, 0), 2);
assert.deepEqual([-1, 0, 1].map(x => asyBlur(2, 3, x)), [0.5, 1, 2.5]);
for (const x of [-1, -0.5, 0.5, 1]) assert.equal(asyBlur(5, 0, x), asyBlur(5, 0, -x)); // 間距：對稱
assert.notEqual(asyBlur(0, 5, 1), asyBlur(0, 5, 0)); assert.equal(asyBlur(0, 5, 1), asyBlur(0, 5, -1)); // 純傾斜：中心清楚、兩緣同大
assert.ok(asyBlur(1, 5, 1) > asyBlur(1, 5, -1)); // 加上偏移後單側較糊

// 配對：12 片都合格；依順序 4/6、互補 6/6；每片恰用一次
const parts = [...asyPairs('order').flatMap(p => [p.a, p.b])];
assert.ok(parts.every(p => Math.abs(p.e) <= 6));
for (const mode of ['order', 'match']) assert.equal(new Set(asyPairs(mode).flatMap(p => [p.a.id, p.b.id])).size, 12);
assert.equal(asyPairs('order').filter(p => p.pass).length, 4);
assert.equal(asyPairs('match').filter(p => p.pass).length, 6);

// 成本：章節表 06-6 四列與推理檢查第 2 題
const row = p => { const c = asyCost(p); return [c.stage1, c.good, c.total, Number(c.K.toFixed(2))]; };
assert.deepEqual(row({}), [9400, 8460, 1662800, 196.55]);
assert.deepEqual(row({y1: 0.97}), [9700, 8730, 1666400, 190.88]);
assert.deepEqual(row({y2: 0.82}), [9400, 7708, 1662800, 215.72]);
assert.deepEqual(row({fixed: 550000}), [9400, 8460, 1812800, 214.28]);
assert.deepEqual(row({y2: 0.93}), [9400, 8742, 1662800, 190.21]);
assert.ok(asyCost({y1: 1, y2: 1, fixed: 800000}).total <= 2100000); // 成本條共同滿格

// mount：事件掛上、狀態保留、清理全數移除
const listeners = new Set();
const el = (extra = {}) => ({value: '', dataset: {}, setAttribute() {}, textContent: '', innerHTML: '',
  addEventListener(k, f) { listeners.add(this); (this.ev ??= {})[k] = f; }, removeEventListener(k, f) { assert.equal(this.ev[k], f); delete this.ev[k]; if (!Object.keys(this.ev).length) listeners.delete(this); },
  querySelectorAll: () => [], ...extra});
{ const dz = el(), edge = el(), out = el(), btns = el(), label = el(); const state = {};
  const root = {querySelector: s => ({'[data-dz]': dz, '[data-edge]': edge, '[data-focus-output]': out, '[data-presets]': btns})[s] ?? label};
  let clean = mountFocus(root, state); assert.match(out.innerHTML, /左右完全對稱/);
  btns.ev.click({target: {dataset: {preset: 'tilt'}}}); assert.equal(state.edge, 5); assert.match(out.innerHTML, /不對稱/);
  dz.value = '2'; edge.value = '3'; dz.ev.input(); assert.match(out.innerHTML, /超出規格：右緣。/);
  clean(); assert.equal(listeners.size, 0); clean = mountFocus(root, state); assert.equal(dz.value, 2); clean(); }
{ const box = el(), out = el(); const state = {};
  const root = {querySelector: s => ({'[data-pair-modes]': box, '[data-pair-output]': out})[s]};
  const clean = mountPair(root, state); assert.match(out.innerHTML, /4 \/ 6/);
  box.ev.click({target: {dataset: {mode: 'match'}}}); assert.match(out.innerHTML, /6 \/ 6/); clean(); assert.equal(listeners.size, 0); }
{ const ins = ['y1', 'y2', 'fixed'].map(k => el({dataset: {cost: k}})), box = el(), out = el(), label = el(); const state = {};
  const root = {querySelectorAll: () => ins, querySelector: s => ({'[data-scenarios]': box, '[data-cost-output]': out})[s] ?? label};
  const clean = mountCost(root, state); assert.match(out.innerHTML, /1,662,800 元/);
  box.ev.click({target: {dataset: {scenario: 'A'}}}); assert.match(out.innerHTML, /1,666,400 元<small>比基準 ＋3,600/); assert.match(out.innerHTML, /190\.88/);
  ins[1].ev.input({target: {dataset: {cost: 'y2'}, value: '0.93'}}); assert.equal(state.p.y2, 0.93);
  ins[1].ev.input({target: {dataset: {cost: 'y2'}, value: '0.9'}}); assert.equal('y2' in state.p, false); // 回到基準值不殘留
  clean(); assert.equal(listeners.size, 0); }

const last = story.pages.at(-1); assert.ok(last.question);
for (const p of story.pages.filter(p => p.question)) assert.doesNotMatch(p.art + p.point + p.lead, /190\.21|2\.5 µm|只有右緣/); // 答案只在回饋
console.log('PASS: story contract, blur model, pairing 4/6→6/6, chapter cost rows, mounts and cleanup');
