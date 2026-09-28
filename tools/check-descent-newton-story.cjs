// EE364a 梯度下降與牛頓法視覺解說：模型與資料契約檢查（非瀏覽器視覺驗收）。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync('docs/ee364a-convex-optimization/resources/descent-newton/story.js', 'utf8') + `
globalThis.subject = {story, gdnQuad, gdnLse, gdnScaled, gdnRun, gdnBacktrack, gdnContours, gdnGradStop, gdnLamStop, gdnGapStop, gdnSteps, gdnKappas, gdnKRuns, gdnX0, gdnEps,
  gdnZRun, gdnZAngles, gdnPRuns, gdnStarts, gdnLseWin, gdnARuns, gdnANewtonDiff, gdnABox, gdnCond, gdnQ1, gdnQ1Base, gdnQ2, gdnKappaWin,
  mountBacktrack, mountKappa, mountPhases, mountAffine};`, context);
const S = context.subject;
const close = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${a} ≠ ${b}`);

// 資料契約
const {story} = S;
assert.equal(new Set(story.pages.map(p => p.id)).size, story.pages.length);
for (const p of story.pages) { for (const k of ['id', 'section', 'title', 'lead', 'art', 'point']) assert.equal(typeof p[k], 'string', `${p.id}.${k}`); if (p.mount) assert.equal(typeof p.previewArt, 'string'); }
assert.equal(story.back.href, '../../13-numerical-linear-algebra-and-unconstrained-minimization.html');
for (const p of story.pages) assert.doesNotMatch(p.art + (p.previewArt ?? ''), /\sid="/, `${p.id} 不放固定 id`);

// 函數本身：梯度與 Hessian 與有限差分一致；log-sum-exp 的最小點與 p*
const fd = (fn, x, h = 1e-6) => [0, 1].map(i => { const a = x.slice(), b = x.slice(); a[i] += h; b[i] -= h; return (fn.f(a) - fn.f(b)) / (2 * h); });
for (const fn of [S.gdnQuad(8), S.gdnLse, S.gdnScaled(S.gdnLse, 1 / 3)]) for (const x of [[0.3, -0.2], [-1, 1], [2, -1]]) {
  const g = fn.g(x), n = fd(fn, x); g.forEach((v, i) => close(v, n[i], 1e-5));
  const H = fn.H(x); for (let i = 0; i < 2; i++) { const a = x.slice(), b = x.slice(); a[i] += 1e-6; b[i] -= 1e-6; const col = fn.g(a).map((v, j) => (v - fn.g(b)[j]) / 2e-6); col.forEach((v, j) => close(H[j][i], v, 1e-4)); }
}
S.gdnLse.g(S.gdnLse.xstar).forEach(v => close(v, 0, 1e-12));
close(S.gdnLse.f(S.gdnLse.xstar), S.gdnLse.pstar, 1e-12);

// 等高線：每個線段端點都落在指定的函數值上（同一個 f 畫圖）
for (const [fn, win, levels] of [[S.gdnQuad(8), [-4.5, 4.5, -2, 2], [1, 5, 12]], [S.gdnLse, S.gdnLseWin, [S.gdnLse.pstar + 0.3, S.gdnLse.pstar + 2]]]) {
  for (const c of S.gdnContours(fn.f, win, levels)) { assert.ok(c.segs.length > 10); for (const [a] of c.segs) assert.ok(Math.abs(fn.f(a) - c.level) < 0.02 * Math.max(1, c.level), `等高線點偏離 ${fn.f(a)} vs ${c.level}`); }
}

// 有線搜尋時，每一步函數值不增；每個回溯接受點滿足充分下降
const allRuns = [...Object.values(S.gdnKRuns), ...Object.values(S.gdnPRuns), ...S.gdnARuns.flatMap(a => [a.gd, a.nt]), S.gdnZRun];
for (const it of allRuns) for (let k = 1; k < it.length; k++) assert.ok(it[k].f <= it[k - 1].f + 1e-15, '函數值不可上升');

// 回溯：第 03 頁的例子（f = ½(x₁² + 4x₂²)，x = (4, 1)）t = 1 被拒、0.7 被接受；接受條件確實成立
{ const fn = S.gdnQuad(4), dx = fn.g([4, 1]).map(v => -v), b = S.gdnBacktrack(fn, [4, 1], dx, 0.1, 0.7);
  assert.equal(JSON.stringify(b.trials.map(r => r.ok)), "[false,true]"); close(b.t, 0.7);
  for (const r of b.trials) assert.equal(r.ok, fn.f([4 + r.t * dx[0], 1 + r.t * dx[1]]) <= 10 + 0.1 * r.t * -32);
  for (const [a, be] of [[0.05, 0.2], [0.45, 0.9], [0.3, 0.5]]) { const q = S.gdnBacktrack(fn, [4, 1], dx, a, be); assert.ok(q.trials.at(-1).ok); assert.ok(q.trials.slice(0, -1).every(r => !r.ok)); } }

// 停止準則：最後一點滿足、前一點不滿足
for (const it of Object.values(S.gdnKRuns)) { assert.ok(it.at(-1).gnorm <= S.gdnEps); if (it.length > 1) assert.ok(it.at(-2).gnorm > S.gdnEps); }
for (const it of Object.values(S.gdnPRuns)) { assert.ok(it.at(-1).lam2 / 2 <= 1e-10); assert.ok(it.at(-2).lam2 / 2 > 1e-10); }
for (const a of S.gdnARuns) for (const it of [a.gd, a.nt]) { assert.ok(it.at(-1).gap <= 1e-6); assert.ok(it.at(-2).gap > 1e-6); }

// 條件數增加 → 梯度下降（回溯，同起點 (4, 1)）步數嚴格增加；κ = 1 一步
const counts = S.gdnKappas.map(k => S.gdnSteps(S.gdnKRuns[k]));
assert.equal(counts.join(), "1,10,17,38,78,143,278");
for (let i = 1; i < counts.length; i++) assert.ok(counts[i] > counts[i - 1]);
// 路徑都在畫圖視窗內
for (const k of S.gdnKappas) { const [xa, xb, ya, yb] = S.gdnKappaWin(k); for (const r of S.gdnKRuns[k]) assert.ok(r.x[0] >= xa && r.x[0] <= xb && r.x[1] >= ya && r.x[1] <= yb, `κ=${k} 路徑出界`); }

// 二次函數上牛頓法一步到最小值（任意 κ、任意起點）
for (const k of [1, 8, 64, 100]) for (const x0 of [[4, 1], [-3, 2], [0.1, -5]]) { const it = S.gdnRun(S.gdnQuad(k), x0, {dir: 'newton', stop: S.gdnLamStop(1e-12)}); assert.equal(S.gdnSteps(it), 1); assert.equal(it[0].t, 1); it[1].x.forEach(v => close(v, 0, 1e-12)); close(it[0].lam2 / 2, it[0].gap); }

// 精確線搜尋：B&V §9.3.2 閉式解（γ = 10、起點 (γ, 1)）；相鄰兩步垂直
const g = 10, r = (g - 1) / (g + 1);
S.gdnZRun.forEach((it, k) => { close(it.x[0], g * r ** k, 1e-9); close(it.x[1], (-r) ** k, 1e-9); close(it.f, r ** (2 * k) * S.gdnZRun[0].f, 1e-9); });
for (const a of S.gdnZAngles) close(a, 90, 1e-9);
// 圓形等高線 + 精確線搜尋：一步
assert.equal(S.gdnSteps(S.gdnRun(S.gdnQuad(1), [3, -2], {dir: 'gd', ls: 'exact', stop: S.gdnGradStop(1e-9)})), 1);

// 強凸上界 f − p* ≤ ‖∇f‖²/(2m)（第 06 頁）
for (const k of S.gdnKappas) for (const it of S.gdnKRuns[k]) assert.ok(it.gap <= it.gnorm ** 2 / (2 * S.gdnQuad(k).m) + 1e-15);

// 非二次：每個起點都先有 t < 1，之後全為 t = 1，且全步階段誤差近似平方下降
for (const [key, it] of Object.entries(S.gdnPRuns)) {
  const ts = it.slice(0, -1).map(x => x.t), first = ts.indexOf(1);
  assert.ok(first > 0, `${key} 需要阻尼步`); assert.ok(ts.slice(first).every(t => t === 1), `${key} 全步後不再阻尼`);
  const tail = it.slice(first).map(x => x.gap).filter(v => v > 1e-14);
  for (let i = 1; i < tail.length; i++) if (tail[i - 1] < 0.05) assert.ok(tail[i] <= 2 * tail[i - 1] ** 2, `${key} 二次收斂 ${tail[i - 1]} → ${tail[i]}`);
  const [xa, xb, ya, yb] = S.gdnLseWin; for (const p of it) assert.ok(p.x[0] >= xa && p.x[0] <= xb && p.x[1] >= ya && p.x[1] <= yb, `${key} 路徑出界`);
}

// 仿射不變：牛頓步數相同、換回 x 後迭代點重合；梯度下降步數不同
const nt = S.gdnARuns.map(a => S.gdnSteps(a.nt)), gd = S.gdnARuns.map(a => S.gdnSteps(a.gd));
assert.equal(new Set(nt).size, 1); assert.ok(S.gdnANewtonDiff < 1e-9); assert.ok(new Set(gd).size >= 3);
// 最快的伸縮是谷底 κ 最小者，最慢的是 κ 最大者（第 10 頁的敘述）
const conds = S.gdnARuns.map(a => S.gdnCond(a.fn.H(a.fn.xstar)));
assert.equal(gd.indexOf(Math.min(...gd)), conds.indexOf(Math.min(...conds))); assert.equal(gd.indexOf(Math.max(...gd)), conds.indexOf(Math.max(...conds)));

// 題目：第 09 頁 k = ⅓ → 梯度下降改變、牛頓不變；第 12 頁 κ = 100、起點 (4, 0) → 兩者 1 步
assert.equal(S.gdnQ1.k, 1 / 3); assert.notEqual(S.gdnSteps(S.gdnQ1.gd), S.gdnSteps(S.gdnQ1Base.gd)); assert.equal(S.gdnSteps(S.gdnQ1.nt), S.gdnSteps(S.gdnQ1Base.nt));
assert.equal(JSON.stringify(S.gdnQ2), JSON.stringify({gd: 1, nt: 1}));
const q9 = story.pages.find(p => p.id === 'predict-scale'), q12 = story.pages.at(-1);
assert.equal(q12.id, 'predict-axis'); assert.ok(q12.question && q9.question);
assert.match(q9.question.choices.find(c => c.value === 'gd-only').feedback, /^對。/); assert.match(q12.question.choices.find(c => c.value === 'both-one').feedback, /^對。/);
for (const p of [q9, q12]) assert.doesNotMatch(p.art + p.point + p.lead + p.title, /1 步|114|仿射不變|不變/, `${p.id} 答案只在回饋`);
// 預測題的新情境沒有在前面的互動中示範過
assert.ok(!S.gdnKappas.includes(100));

// mount：事件掛上、狀態保留、清理全數移除
const listeners = new Set();
const el = (extra = {}) => ({value: '', dataset: {}, setAttribute() {}, textContent: '', innerHTML: '',
  addEventListener(k, f) { listeners.add(this); (this.ev ??= {})[k] = f; }, removeEventListener(k, f) { assert.equal(this.ev[k], f); delete this.ev[k]; if (!Object.keys(this.ev).length) listeners.delete(this); },
  querySelectorAll: () => [], ...extra});
{ const a = el(), b = el(), out = el(), label = el(), state = {};
  const root = {querySelector: s => ({'[data-alpha]': a, '[data-beta]': b, '[data-bt-output]': out})[s] ?? label};
  let clean = mountBt(); function mountBt() { return S.mountBacktrack(root, state); }
  assert.match(out.innerHTML, /接受 <b>t = 0\.7<\/b>/);
  a.value = '0.45'; b.value = '0.5'; a.ev.input(); assert.equal(state.alpha, 0.45); assert.match(out.innerHTML, /試了/);
  clean(); assert.equal(listeners.size, 0); clean = mountBt(); assert.equal(a.value, 0.45); clean(); }
{ const r = el(), out = el(), label = el(), state = {};
  const root = {querySelector: s => ({'[data-kappa]': r, '[data-kappa-output]': out})[s] ?? label};
  const clean = S.mountKappa(root, state); assert.match(out.innerHTML, /38 步/);
  r.value = '6'; r.ev.input(); assert.match(out.innerHTML, /κ = 64：<b>278 步/); clean(); assert.equal(listeners.size, 0); }
{ const box = el(), out = el(), state = {};
  const root = {querySelector: s => ({'[data-start-box]': box, '[data-phase-output]': out})[s]};
  const clean = S.mountPhases(root, state); assert.match(out.innerHTML, /前 <b>5 步 t &lt; 1/);
  box.ev.click({target: {dataset: {start: 'C'}}}); assert.equal(state.s, 'C'); assert.match(out.innerHTML, /前 <b>2 步/); clean(); assert.equal(listeners.size, 0); }
{ const r = el(), out = el(), label = el(), state = {};
  const root = {querySelector: s => ({'[data-scale]': r, '[data-affine-output]': out})[s] ?? label};
  const clean = S.mountAffine(root, state); assert.match(out.innerHTML, /梯度下降 <b>15 步<\/b>，牛頓法 <b>6 步/);
  r.value = '0'; r.ev.input(); assert.match(out.innerHTML, /梯度下降 <b>114 步<\/b>，牛頓法 <b>6 步/); clean(); assert.equal(listeners.size, 0); }

console.log(`PASS: contract, contours on f, monotone f, backtracking, stopping, κ→GD steps ${counts.join('/')}, Newton 1 step on quadratics, B&V closed form, 90° zigzag, strong-convexity bound, damped→quadratic phases, affine invariance, two predictions, mounts and cleanup`);
