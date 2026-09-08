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
    classList: { add: c => classes.add(c), remove: c => classes.delete(c), contains: c => classes.has(c) },
    getBoundingClientRect: () => ({ left: 0, top: 600, width: 200, height: 280 }),
    getAnimations: () => animations.filter(a => !a.cancelled),
    animate: () => { animations.push({ cancelled: false, cancel() { this.cancelled = true; } }); },
    addEventListener: (type, fn) => { listeners[type] = fn; },
  };
}
const elements = { samuraiWrap: element(), blade: element(), grid: element() };
const context = {
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
console.log('PASS：原生導覽、修飾鍵、減少動畫、無角色、連點、快照與返回清理');
