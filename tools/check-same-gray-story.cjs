// 檢查 mit9-35-perception/resources/same-gray：資料契約、「同一灰色」常數、示意模型、mount 清理。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const dir = 'docs/mit9-35-perception/resources/same-gray/';
const src = fs.readFileSync(dir + 'story.js', 'utf8'), css = fs.readFileSync(dir + 'story.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const context = vm.createContext({});
vm.runInContext(src + '\nglobalThis.subject={story,sgGray,sgGrayValue,sgDark,sgLight,sgWhite,sgHex,sgScene,sgModes,sgRevealView,sgSurroundView,sgCS,sgR,sgL,sgGuess,sgAnchor,sgFrames,mountReveal,mountSurround};', context);
const S = context.subject, {story} = S;

// 契約
assert.equal(new Set(story.pages.map(p => p.id)).size, story.pages.length);
for (const p of story.pages) { for (const k of ['id', 'section', 'title', 'lead', 'art', 'point']) assert.equal(typeof p[k], 'string'); if (p.mount) assert.equal(typeof p.previewArt, 'string'); }
assert.equal(story.back.href, '../../12-lightness-and-color.html');
assert.match(fs.readFileSync('docs/mit9-35-perception/12-lightness-and-color.md', 'utf8').split('\n')[2], /^\[開啟視覺解說：.+\]\(resources\/same-gray\/index\.html\)$/);

// 同一灰色：唯一常數；所有渲染狀態中的灰塊與橋都只用它
assert.equal(S.sgGray, '#808080'); assert.equal(S.sgHex(S.sgGrayValue), S.sgGray);
assert.equal(src.split('#808080').length - 1, 1, 'story.js 只能在一處寫出灰色值');
for (const v of [S.sgDark, S.sgLight, S.sgWhite]) assert.notEqual(v, S.sgGrayValue);
const htmls = [...story.pages.flatMap(p => [p.art, p.previewArt ?? '']),
  ...Object.keys(S.sgModes).map(S.sgRevealView)];
for (let v = S.sgDark; v <= S.sgLight; v += 8) htmls.push(S.sgSurroundView(v));
let scenes = 0;
for (const h of htmls) {
  for (const m of h.matchAll(/<span class="sg-(target|bridge)"([^>]*)>/g)) assert.equal(m[2], ` style="background:${S.sgGray}"`, `灰塊／橋的樣式：${m[0]}`);
  for (const sc of h.split('class="sg-scene"').slice(1)) { scenes++; assert.equal((sc.split('class="sg-names"')[0].match(/class="sg-target"/g) || []).length, 2); }
}
assert.ok(scenes >= 8, `刺激數 ${scenes}`);
assert.match(S.sgRevealView('bridge'), /class="sg-bridge"/);
assert.doesNotMatch(S.sgRevealView('remove'), /sg-panel" style/); // 移除背景：兩格都沒有背景
// CSS 不改灰塊／橋的外觀，也沒有動畫
for (const rule of css.match(/[^{}]*\.sg-(target|bridge)[^{]*\{[^}]*\}/g) || []) assert.doesNotMatch(rule.split('{')[1], /background|opacity|filter|mix-blend/);
assert.ok(!/transition|animation|@keyframes/.test(css), 'story.css 不可有動畫');

// Hering 示意：中心 − 周圍
assert.equal(S.sgCS(S.sgDark), 96); assert.equal(S.sgCS(S.sgLight), -96);
assert.match(S.sgSurroundView(S.sgLight), /左右像素完全相同/);
assert.match(S.sgSurroundView(S.sgDark), /左背景比右背景暗 192：左邊的「中心 − 周圍」比右邊大 192/);
// Helmholtz 示意：R = L ÷ I
assert.equal(S.sgR(S.sgL, S.sgGuess.left), 0.6); assert.equal(S.sgR(S.sgL, S.sgGuess.right), 0.3);
// 錨定：左框架灰塊最亮；右框架背景最亮；第 08 頁加白塊後錨點換成白
assert.equal(S.sgAnchor(S.sgFrames.left.map(x => x[1])), S.sgGrayValue);
assert.equal(S.sgAnchor(S.sgFrames.right.map(x => x[1])), S.sgLight);
assert.equal(S.sgAnchor([S.sgDark, S.sgGrayValue, S.sgWhite]), S.sgWhite);
assert.match(story.pages.at(-1).art, /class="sg-patch" style="background:#ffffff"/);

// mount：事件掛上、狀態保留、清理全數移除
const listeners = new Set();
const el = (extra = {}) => ({value: '', dataset: {}, setAttribute() {}, textContent: '', innerHTML: '',
  addEventListener(k, f) { listeners.add(this); (this.ev ??= {})[k] = f; }, removeEventListener(k, f) { assert.equal(this.ev[k], f); delete this.ev[k]; if (!Object.keys(this.ev).length) listeners.delete(this); },
  querySelectorAll: () => [], ...extra});
{ const btns = ['original', 'remove', 'bridge'].map(m => ({dataset: {mode: m}, pressed: '', setAttribute(k, v) { this.pressed = v; }}));
  const box = el({querySelectorAll: () => btns}), out = el(); const state = {};
  const root = {querySelector: s => ({'[data-sg-modes]': box, '[data-sg-reveal]': out})[s]};
  let clean = mountReveal(root, state); assert.match(out.innerHTML, /原圖/); assert.equal(btns[0].pressed, 'true');
  box.ev.click({target: {dataset: {mode: 'bridge'}}}); assert.equal(state.mode, 'bridge'); assert.match(out.innerHTML, /sg-bridge/); assert.equal(btns[2].pressed, 'true');
  box.ev.click({target: {dataset: {}}}); assert.equal(state.mode, 'bridge');
  clean(); assert.equal(listeners.size, 0); clean = mountReveal(root, state); assert.match(out.innerHTML, /sg-bridge/); clean(); assert.equal(listeners.size, 0); }
{ const input = el(), label = el(), out = el(); const state = {};
  const root = {querySelector: s => ({'[data-sg-left]': input, '[data-sg-left-label]': label, '[data-sg-surround]': out})[s]};
  let clean = mountSurround(root, state); assert.equal(input.value, S.sgDark); assert.match(out.innerHTML, /＋96/);
  input.value = String(S.sgLight); input.ev.input(); assert.equal(state.left, S.sgLight); assert.match(out.innerHTML, /完全相同/);
  clean(); assert.equal(listeners.size, 0); clean = mountSurround(root, state); assert.equal(input.value, S.sgLight); clean(); assert.equal(listeners.size, 0); }

// 題目：答案只在回饋
const qs = story.pages.filter(p => p.question); assert.equal(qs.length, 2); assert.equal(qs.at(-1), story.pages.at(-1));
const last = story.pages.at(-1); assert.doesNotMatch(last.art + last.lead + last.point + last.title, /變暗|變亮|差異變小|差異變大/);
assert.doesNotMatch((story.pages[0].art + story.pages[0].lead + story.pages[0].point).replace(/<[^>]*>/g, ''), /808080|相同的顏色|同一個顏色值/); // 第 01 頁可見文字不先揭曉
console.log(`PASS: contract, one gray constant across ${scenes} rendered scenes, CSS leaves gray untouched, no animation, models, mounts and cleanup`);
function mountReveal(r, s) { return S.mountReveal(r, s); }
function mountSurround(r, s) { return S.mountSurround(r, s); }
