// 執行：node tools/check-catalog-glass.cjs（無額外依賴）
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');

const catalogListeners = {};
const windowListeners = {};
const documentListeners = {};
const queries = {};
const frames = new Map();
let nextFrame = 1;
let gridChanged;
let intersectionChanged;
const grid = {};
const categories = { dataset: {} };
const document = {
  hidden: false,
  querySelector: selector => {
    assert.equal(selector, '.catalog');
    return { addEventListener: (name, fn) => { catalogListeners[name] = fn; } };
  },
  getElementById: id => {
    assert.ok(['grid', 'categories'].includes(id));
    return id === 'grid' ? grid : categories;
  },
  addEventListener: (name, fn) => { documentListeners[name] = fn; },
};
runInNewContext(readFileSync(join(__dirname, '../js/catalog-glass.js'), 'utf8'), {
  document,
  window: { addEventListener: (name, fn) => { windowListeners[name] = fn; } },
  matchMedia: query => {
    const media = { matches: query.includes('pointer: fine'), addEventListener: (_, fn) => { media.changed = fn; } };
    queries[query] = media;
    return media;
  },
  requestAnimationFrame: fn => { const id = nextFrame++; frames.set(id, fn); return id; },
  cancelAnimationFrame: id => frames.delete(id),
  MutationObserver: class {
    constructor(fn) { gridChanged = fn; }
    observe(target) { assert.equal(target, grid); }
  },
  IntersectionObserver: class {
    constructor(fn) { intersectionChanged = fn; }
    observe(target) { assert.equal(target, categories); }
  },
});
function element() {
  const values = new Map();
  return {
    values, isConnected: true,
    style: { setProperty: (key, value) => values.set(key, value), removeProperty: key => values.delete(key) },
    getBoundingClientRect: () => ({ left: 100, top: 50, width: 200, height: 100 }),
    contains(other) { return other === this; },
  };
}
function move(target, x = 150, y = 75, pointerType = 'mouse') {
  catalogListeners.pointermove({
    target: { closest: selector => { assert.equal(selector, '.card, .category'); return target; } },
    clientX: x, clientY: y, pointerType,
  });
}
function flush() {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach(fn => fn());
}
const card = element();
const category = element();
move(card); move(card, 250, 125);
assert.equal(frames.size, 1, '同一畫格只更新一次');
flush();
assert.equal(card.values.get('--glass-x'), '75.00%');
assert.equal(card.values.get('--glass-y'), '75.00%');
assert.equal(card.values.get('--glass-opposite-x'), '25.00%');
assert.equal(frames.size, 0, '停留時不得自行排下一畫格');
move(category, 0, 999); flush();
assert.equal(card.values.size, 0);
assert.equal(category.values.get('--glass-x'), '0.00%');
assert.equal(category.values.get('--glass-y'), '100.00%');
gridChanged();
assert.equal(category.values.size, 4, '書目重繪不得清掉分類追光');
catalogListeners.pointerout({ relatedTarget: category });
assert.equal(category.values.size, 4);
catalogListeners.pointerout({ relatedTarget: null });
assert.equal(category.values.size, 0);

move(card); card.isConnected = false; gridChanged();
assert.equal(frames.size, 0);
card.isConnected = true;
move(card); card.isConnected = false; flush();
assert.equal(card.values.size, 0, '已移除的卡片不得在下一畫格更新');
card.isConnected = true;
for (const event of ['scroll', 'resize', 'blur', 'pagehide', 'pageshow']) {
  move(card); flush(); move(card);
  windowListeners[event]();
  assert.equal(card.values.size, 0);
  assert.equal(frames.size, 0);
}
move(card); flush();
document.hidden = true;
documentListeners.visibilitychange();
assert.equal(card.values.size, 0);
for (const [query, disabled] of Object.entries(queries)) {
  disabled.matches = query.includes('reduced-motion');
  disabled.changed();
  move(card); flush();
  assert.equal(card.values.size, 0);
  disabled.matches = !disabled.matches;
  disabled.changed();
}
move(card, 150, 75, 'touch'); flush();
assert.equal(card.values.size, 0);
move(null); flush();
assert.equal(frames.size, 0);
assert.equal(catalogListeners.click, undefined, '追光不得接管點擊');
assert.equal(catalogListeners.keydown, undefined, '追光不得接管鍵盤導覽');
assert.equal(categories.dataset.rimVisible, 'false');
intersectionChanged([{ isIntersecting: true }]);
assert.equal(categories.dataset.rimVisible, 'true');
intersectionChanged([{ isIntersecting: false }]);
assert.equal(categories.dataset.rimVisible, 'false');
document.hidden = false;
documentListeners.visibilitychange();
assert.equal(categories.dataset.rimHidden, 'false');
document.hidden = true;
documentListeners.visibilitychange();
assert.equal(categories.dataset.rimHidden, 'true');
document.hidden = false;
windowListeners.pagehide();
assert.equal(categories.dataset.rimHidden, 'true');
windowListeners.pageshow();
assert.equal(categories.dataset.rimHidden, 'false');
console.log('PASS：共用追光、畫格合併、重繪清理、減少動態、觸控與光邊暫停／恢復');
