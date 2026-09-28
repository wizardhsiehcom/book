const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync('docs/gpu/resources/tiling-reuse/story.js', 'utf8') + '\nglobalThis.subject={story,trNaive,trTiled,trAI,trRoof,trX,trY,trPeak,trBW,trNaiveView,trTiledView,trRoofView,mountNaive,mountTiled,mountRoof};', context);
const S = context.subject, {story, trNaive, trTiled, trAI, trRoof} = S;

assert.equal(new Set(story.pages.map(p => p.id)).size, story.pages.length);
for (const p of story.pages) { for (const k of ['id', 'section', 'title', 'lead', 'art', 'point']) assert.equal(typeof p[k], 'string'); if (p.mount) assert.equal(typeof p.previewArt, 'string'); }
assert.equal(story.back.href, '../../prerequisites/matrix-math.html');

// 模擬 vs 封閉公式：naive 2N³、tiled 2N³/T、每元素 N/T 次、共享讀取 2N³、FLOP 2N³、AI = T/4
for (const N of [4, 6, 8, 12, 32]) {
  const n = trNaive(N);
  assert.equal(n.reads, 2 * N ** 3); assert.equal(n.flops, 2 * N ** 3);
  assert.ok(n.a.flat().every(v => v === N) && n.b.flat().every(v => v === N));
  for (let T = 1; T <= N; T++) {
    if (N % T) { assert.throws(() => trTiled(N, T)); continue; }
    const s = trTiled(N, T);
    assert.equal(s.reads, 2 * N ** 3 / T);
    assert.ok(s.a.flat().every(v => v === N / T) && s.b.flat().every(v => v === N / T));
    assert.equal(s.sharedReads, 2 * N ** 3); assert.equal(s.flops, 2 * N ** 3);
    assert.equal(s.phases.length, (N / T) ** 3); assert.equal(s.sharedBytes, 8 * T * T);
    assert.equal(trAI(s), T / 4);
  }
  assert.equal(trTiled(N, 1).reads, n.reads);   // T = 1 等於 naive
  assert.equal(trTiled(N, N).reads, 2 * N * N);  // T = N 碰到下限
}
// naive 部分累積：每算一格 +2N
for (let k = 0; k <= 16; k++) assert.equal(trNaive(4, k).reads, 8 * k);

// 預測一（N=6、T=3）答案與誤答
assert.equal(trNaive(6).reads, 432); assert.equal(trTiled(6, 3).reads, 144); assert.equal(trTiled(6, 3).a[0][0], 2);
assert.equal(432 / 9, 48); assert.equal(trTiled(6, 6).reads, 72);

// roofline：教學參數、屋脊點、預測二
assert.equal(S.trPeak, 10); assert.equal(S.trBW, 2);
assert.deepEqual([1, 2, 4, 8, 16, 32].map(T => trRoof(T / 4)), [0.5, 1, 2, 4, 8, 10]);
assert.equal(trRoof(1, 10, 4) / trRoof(1), 2);  // 甲 2 倍
assert.equal(trRoof(8, 10, 4) / trRoof(8), 1);  // 乙不變
// 座標：log-log，每 ×2 距離相同；屋脊點在斜線與平頂交點
assert.ok(Math.abs((S.trX(2) - S.trX(1)) - (S.trX(8) - S.trX(4))) < 1e-9);
assert.ok(Math.abs(S.trX(1 / 8)) < 1e-9 && Math.abs(S.trX(32) - 100) < 1e-9);
assert.ok(Math.abs(S.trY(32)) < 1e-9 && Math.abs(S.trY(0.25) - 100) < 1e-9);

// 視圖：長條寬度與模擬數字一致（同一尺度 2N³）
{ const html = S.trTiledView(8, 4); assert.match(html, /width:25%/); assert.match(html, /全域讀取 <b>256<\/b>/); assert.match(html, /left:12\.5%/); }
{ const html = S.trNaiveView(16); assert.match(html, /<b>128<\/b>/); assert.match(html, /width:100%/); assert.match(html, /left:25%/); }
{ const html = S.trRoofView(32); assert.match(html, /可達 <b>10<\/b>/); assert.match(html, /受算力限制/); assert.match(S.trRoofView(4), /受頻寬限制/); }
for (const p of story.pages) assert.doesNotMatch(p.art + (p.previewArt ?? ''), /id="/); // 無固定 ID

// mount：事件掛上、狀態保留、清理全數移除
const listeners = new Set();
const el = (extra = {}) => ({value: '', dataset: {}, setAttribute() {}, textContent: '', innerHTML: '', focus() {},
  addEventListener(k, f) { listeners.add(this); (this.ev ??= {})[k] = f; }, removeEventListener(k, f) { assert.equal(this.ev[k], f); delete this.ev[k]; if (!Object.keys(this.ev).length) listeners.delete(this); },
  querySelectorAll: () => [], querySelector: () => null, ...extra});
{ const input = el(), out = el(), label = el(), state = {};
  const root = {querySelector: s => ({'[data-k]': input, '[data-naive-output]': out, '[data-k-label]': label})[s]};
  let clean = S.mountNaive(root, state); assert.match(out.innerHTML, /已算 6 \/ 16/);
  input.value = '16'; input.ev.input(); assert.match(out.innerHTML, /4 倍/);
  clean(); assert.equal(listeners.size, 0); clean = S.mountNaive(root, state); assert.equal(input.value, 16); clean(); }
{ const box = el(), out = el(), state = {};
  const root = {querySelector: s => ({'[data-tile-controls]': box, '[data-tile-output]': out})[s]};
  const clean = S.mountTiled(root, state); assert.match(out.innerHTML, /N = 4、T = 2/);
  box.ev.click({target: {dataset: {n: '8'}}}); assert.match(out.innerHTML, /N = 8、T = 2/);
  box.ev.click({target: {dataset: {t: '8'}}}); assert.match(out.innerHTML, /全域讀取 <b>128<\/b>/);
  box.ev.click({target: {dataset: {n: '4'}}}); assert.equal(state.T, 2); // 8 不整除 4 → 回到 2
  clean(); assert.equal(listeners.size, 0); }
{ const box = el(), out = el(), state = {};
  const root = {querySelector: s => ({'[data-roof-controls]': box, '[data-roof-output]': out})[s]};
  const clean = S.mountRoof(root, state); assert.match(out.innerHTML, /T = 4 → 算術強度 1 /);
  box.ev.click({target: {dataset: {t: '32'}}}); assert.match(out.innerHTML, /受算力限制/); clean(); assert.equal(listeners.size, 0); }

// 題目：最後一頁是題目；答案只在回饋
assert.ok(story.pages.at(-1).question);
const qs = story.pages.filter(p => p.question); assert.equal(qs.length, 2);
assert.doesNotMatch(qs[0].art + qs[0].point + qs[0].lead, /144|432/);
assert.doesNotMatch(qs[1].art + qs[1].point + qs[1].lead, /2 倍|不變，|4 TFLOP/);
console.log('PASS: story contract, naive 2N³ / tiled 2N³/T per-element simulation, AI = T/4, roofline & predictions, mounts and cleanup');
