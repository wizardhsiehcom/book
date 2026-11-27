// 執行：node tools/check-book-transition.cjs（無額外依賴）
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const { join } = require('node:path');

const listeners = {};
const motion = { matches: false, addEventListener: (_, fn) => { listeners.motion = fn; } };
let noCharacter = false;
function element() {
  const animations = [];
  const classes = new Set();
  return {
    style: {},
    classList: { add: c => classes.add(c), remove: (...names) => names.forEach(c => classes.delete(c)), contains: c => classes.has(c) },
    getBoundingClientRect: () => ({ left: 0, top: 600, width: 200, height: 280 }),
    getAnimations: () => animations.filter(a => !a.cancelled),
    animate: () => { animations.push({ cancelled: false, cancel() { this.cancelled = true; } }); },
    addEventListener: (type, fn) => { listeners[type] = fn; },
  };
}
const elements = { samuraiWrap: element(), blade: element(), grid: element() };
const context = {
  getComputedStyle: frame => ({ visibility: frame.visibility || 'hidden' }),
  matchMedia: () => motion,
  document: {
    getElementById: id => elements[id],
    body: { classList: { contains: () => noCharacter } },
  },
  innerWidth: 1280, innerHeight: 900, location: { protocol: 'http:' },
  window: { onpageswap: null, onpagereveal: null, addEventListener: (type, fn) => { listeners[type] = fn; } },
  setTimeout: () => assert.fail('不可用計時器延遲導覽'),
};
runInNewContext(readFileSync(join(__dirname, '../js/book-transition.js'), 'utf8'), context);
const card = {
  href: 'http://localhost/book/example/html/index.html', target: '',
  hasAttribute: () => false,
  style: { getPropertyValue: () => '#6366f1' },
  getBoundingClientRect: () => ({ left: 20, top: 100, width: 280, height: 220 }),
};
const click = overrides => listeners.click({
  button: 0, target: { closest: () => card },
  preventDefault: () => assert.fail('不可攔截原生連結'), ...overrides,
});
function assertIdle() {
  assert.equal(elements.blade.getAnimations().length, 0);
  assert.equal(elements.samuraiWrap.getAnimations().length, 0);
  assert.equal(elements.blade.style.viewTransitionName, '');
}

listeners.pageshow();
for (const overrides of [{ metaKey: true }, { ctrlKey: true }, { shiftKey: true },
  { altKey: true }, { button: 1 }, { defaultPrevented: true }, { target: { closest: () => null } }]) {
  click(overrides);
  assertIdle();
}
card.target = '_blank'; click(); assertIdle(); card.target = '';
card.hasAttribute = () => true; click(); assertIdle(); card.hasAttribute = () => false;
motion.matches = true; click(); assertIdle(); motion.matches = false;
noCharacter = true; click(); assertIdle(); noCharacter = false;
listeners.pageswap({ get viewTransition() {
  assert.fail('未選書時不應取得已停用的跨頁轉場');
} });

click(); click(); // 重複點擊會取消舊動畫，且不鎖住導覽。
assert.equal(elements.samuraiWrap.getAnimations().length, 1);
assert.equal(elements.blade.getAnimations().length, 0);
assert.equal(elements.blade.classList.contains('blade-local'), false);
assert.equal(elements.blade.style.left, '128px');
assert.ok(parseFloat(elements.blade.style.rotate) < 0);
// 直線必須穿過目標中心 (160, 210)。
const angle = parseFloat(elements.blade.style.rotate);
const originY = parseFloat(elements.blade.style.top) + 5;
assert.ok(Math.abs(originY + Math.tan(angle) * (160 - 128) - 210) < 0.001);
// 點書後改變視窗／卡片排版，切線必須改用新座標。
const originalCardRect = card.getBoundingClientRect;
const originalActorRect = elements.samuraiWrap.getBoundingClientRect;
card.getBoundingClientRect = () => ({ left: 40, top: 240, width: 300, height: 200 });
elements.samuraiWrap.getBoundingClientRect = () => ({ left: 0, top: 400, width: 108, height: 140 });
context.innerWidth = 390; context.innerHeight = 600;
listeners.resize?.();
function assertAim() {
  const r = card.getBoundingClientRect(), b = elements.blade.style;
  const angle = parseFloat(b.rotate), x = parseFloat(b.left), y = parseFloat(b.top) + 5;
  const error = Math.abs((r.left + r.width / 2 - x) * Math.sin(angle) -
    (r.top + r.height / 2 - y) * Math.cos(angle));
  assert.ok(error < 0.01, `縮放後切線偏離卡片中心 ${error.toFixed(1)} px`);
  const actor = elements.samuraiWrap.getBoundingClientRect();
  assert.equal(x, actor.left + actor.width * 0.64);
}
assertAim();
card.getBoundingClientRect = () => ({ left: 40, top: 120, width: 300, height: 200 });
listeners.scroll?.(); assertAim();
card.getBoundingClientRect = originalCardRect;
elements.samuraiWrap.getBoundingClientRect = originalActorRect;
context.innerWidth = 1280; context.innerHeight = 900;
listeners.pageswap({ viewTransition: null }); // 不支援跨頁轉場仍能導覽。
assert.equal(elements.blade.style.viewTransitionName, '');
let cleanup = () => {}; // 沒有離頁完成回呼時，舊轉場不會再修改狀態。
const swap = { activation: { entry: { url: card.href } },
  viewTransition: { finished: { then: fn => { cleanup = fn; } } } };
listeners.pageswap({ ...swap, activation: { entry: { url: 'http://localhost/elsewhere' } } });
assert.equal(elements.blade.style.viewTransitionName, '');
listeners.pageswap(swap);
assertAim(); // 快照前也要重算，不依賴 resize 事件是否已送達。
assert.equal(elements.blade.style.viewTransitionName, 'book-blade');
assert.equal(elements.blade.classList.contains('blade-local'), false);
// 返回快取恢復後，舊轉場的完成通知可能晚於下一次點書。
const finishPreviousTransition = cleanup;
listeners.pageshow(); assertIdle();
card.href = 'http://localhost/book/another/html/index.html';
click();
finishPreviousTransition();
listeners.pageswap({ ...swap, activation: { entry: { url: card.href } } });
assert.equal(elements.blade.style.viewTransitionName, 'book-blade', '舊轉場完成不可清掉新選中的書');
listeners.pageshow(); assertIdle();
click(); listeners.pageshow(); assertIdle();
click(); motion.matches = true; listeners.motion(); assertIdle();
motion.matches = false; context.location.protocol = 'file:';
click(); assert.equal(elements.blade.classList.contains('blade-local'), true);
listeners.pageshow(); assert.equal(elements.blade.classList.contains('blade-local'), false);
// 執行首頁真正的角色切換函式，確保隱藏不只是略過出刀，也退出跨頁轉場。
const homepage = readFileSync(join(__dirname, '../index.html'), 'utf8');
assert.match(homepage, /<style id="book-transition-opt-out" media="not all">\s*@view-transition\s*\{\s*navigation:\s*none;\s*\}/);
const variantFunction = homepage.match(/function applyVariant\(v\) \{[\s\S]*?\n    \}/)?.[0];
assert.ok(variantFunction);
const optOut = { media: 'not all' };
const stage = { style: {} };
const image = { style: {}, hasAttribute: () => true };
const bodyClasses = new Set();
let storedVariant;
const variantContext = {
  resetBookTransition: listeners.pageshow,
  savePreference: (key, value) => { storedVariant = value; },
  document: {
    getElementById: id => ({ 'book-transition-opt-out': optOut, samuraiStage: stage, imgSvg: image })[id],
    querySelectorAll: () => [],
    body: { classList: {
      remove: (...names) => names.forEach(name => bodyClasses.delete(name)),
      add: name => bodyClasses.add(name),
    } },
  },
};
runInNewContext(variantFunction, variantContext);
for (const variant of ['none', 'svg', 'none', 'invalid']) {
  variantContext.applyVariant(variant);
  const hidden = variant === 'none';
  assert.equal(optOut.media, hidden ? 'all' : 'not all');
  assert.equal(stage.style.display, hidden ? 'none' : '');
  assert.equal(bodyClasses.has('variant-none'), hidden);
  assert.equal(storedVariant, hidden ? 'none' : 'svg');
}
// 已載入的關鍵圖走真正的點書計時分支，手動推進計時器以核對每格。
{
  const timers = new Map();
  let id = 0;
  const frame = { complete: true, naturalWidth: 1024 };
  Object.assign(elements, { imgSvg: frame, slashDraw: { ...frame }, slashStrike: frame });
  context.location.assign = href => { context.destination = href; };
  context.setTimeout = (fn, ms) => { timers.set(++id, { fn, ms }); return id; };
  context.clearTimeout = key => timers.delete(key);
  runInNewContext(readFileSync(join(__dirname, '../js/book-transition.js'), 'utf8'),
    { ...context });
  function tick(ms) {
    assert.equal(timers.size, 1);
    const [key, timer] = timers.entries().next().value;
    assert.equal(timer.ms, ms);
    timers.delete(key);
    timer.fn();
  }
  const classes = elements.samuraiWrap.classList;
  const activate = () => click({ preventDefault() {} });
  activate(); tick(60); assert.ok(classes.contains('slash-draw'));
  listeners.pageshow(); assert.equal(timers.size, 0); assert.ok(!classes.contains('slash-draw'));
  activate(); tick(60); tick(80); assert.ok(classes.contains('slash-strike'));
  listeners.pageswap({ ...swap, activation: { entry: { url: card.href } } });
  const actor = elements.samuraiWrap.getBoundingClientRect();
  assert.equal(parseFloat(elements.blade.style.left), actor.left + actor.width * 1273 / 1024);
  assert.equal(parseFloat(elements.blade.style.top) + 5, actor.top + actor.height * 887 / 1536);
  tick(210); assert.equal(context.destination, card.href);
  listeners.pageshow();
  elements.slashDraw.visibility = 'visible';
  activate(); assert.ok(classes.contains('slash-strike')); tick(210);
  listeners.pageshow();
  elements.slashDraw.visibility = 'hidden';
  elements.slashDraw.complete = false;
  activate(); tick(90); assert.ok(classes.contains('slash-strike')); tick(260);
  listeners.pageshow();
}
console.log('PASS：原生導覽、修飾鍵、減少動畫、無角色、連點、快照與返回清理');

// 兩個姿勢分別載入。單一姿勢缺少裁片時，另一個仍可播放。
async function checkMotionLayers(failedId) {
  const stacks = {};
  const finish = {};
  for (const id of ['scarletIdle', 'scarletDrawMotion']) {
    const stack = stacks[id] = element();
    const pending = new Promise((resolve, reject) => {
      finish[id] = id === failedId ? () => reject(new Error(id)) : resolve;
    });
    stack.querySelectorAll = () => [Promise.resolve(), pending].map(result => ({ decode: () => result }));
  }
  runInNewContext(readFileSync(join(__dirname, '../js/book-transition.js'), 'utf8'), {
    ...context,
    document: { ...context.document, getElementById: id => stacks[id] || elements[id] },
  });
  for (const id of Object.keys(stacks)) {
    assert.equal(stacks[id].classList.contains('is-ready'), false);
    finish[id]();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(stacks[id].classList.contains('is-ready'), id !== failedId);
  }
}
Promise.all([undefined, 'scarletIdle', 'scarletDrawMotion'].map(checkMotionLayers)).then(() => {
  console.log('PASS：姿勢 1、2 的圖層分別就緒與缺圖備援');
}).catch(error => { console.error(error); process.exitCode = 1; });
