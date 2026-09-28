const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync('docs/database-correctness/resources/unknown-outcome/story.js', 'utf8') + '\nglobalThis.subject = {story, mountOutcome, outcomeTimeline};', context);
const {story, mountOutcome, outcomeTimeline} = context.subject;
assert.equal(new Set(story.pages.map(p => p.id)).size, story.pages.length);
for (const p of story.pages) {
  for (const key of ['id', 'section', 'title', 'lead', 'art', 'point']) assert.equal(typeof p[key], 'string');
  if (p.mount) assert.equal(typeof p.previewArt, 'string');
}
const nodes = Object.fromEntries(['scenario','advance','reset','result'].map(key => [key, {
  events: {}, addEventListener(type, handler) { this.events[type] = handler; },
  removeEventListener(type, handler) { assert.equal(this.events[type], handler); delete this.events[type]; },
}]));
const root = {querySelector(selector) { return nodes[selector.slice(6,-1)]; }};
const state = {};
let cleanup = mountOutcome(root, state);
for (const [scenario, expected] of [
  ['committed', /已提交：X → 80 分／版本 1.*仍 1 筆判定/s],
  ['rolledback', /已提交：X → 80 分／版本 1.*首次提交；1 筆判定/s],
  ['pending', /仍未知：操作 X 待查核.*原交易結局未取得/s],
  ['changed', /版本衝突：本次 X 未寫入.*仍只有 Y/s],
]) {
  nodes.scenario.value = scenario; nodes.scenario.events.change();
  assert.equal(state.step, 0); assert.equal(nodes.advance.disabled, false);
  assert.match(nodes.result.innerHTML, /結果未知/);
  nodes.advance.events.click();
  cleanup();
  for (const node of Object.values(nodes)) assert.equal(Object.keys(node.events).length, 0);
  cleanup = mountOutcome(root, state);
  assert.equal(state.step, 1); assert.equal(nodes.scenario.value, scenario);
  nodes.advance.events.click(); assert.match(nodes.result.innerHTML, expected);
  assert.equal(nodes.advance.disabled, true);
  nodes.advance.events.click(); assert.equal(state.step, 2);
  nodes.reset.events.click(); assert.equal(state.step, 0); assert.equal(state.scenario, scenario);
}
cleanup();
console.log('PASS: outcome story contract, four scenarios, reset, restoration, listener cleanup');

assert(!outcomeTimeline('committed',0).includes('原 X ＋完整意圖'));
assert.match(outcomeTimeline('committed',2),/提交 X，保存 80 分.*成功回覆遺失.*原 X ＋完整意圖/s);
assert.match(outcomeTimeline('pending',2),/等鎖.*等待逾時；仍未知/s);
assert(story.pages.at(-1).question);
