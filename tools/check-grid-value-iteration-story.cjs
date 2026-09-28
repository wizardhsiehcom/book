// 格子世界價值迭代故事的模型檢查：手算小例、獨立實作比對、固定點、策略穩定輪次、γ／滑動方向、預測題答案、mount 清理。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync('docs/cs234-reinforcement-learning/resources/grid-value-iteration/story.js', 'utf8')
  + '\nglobalThis.subject={story,gviRun,gviGet,gviModel,gviQ,gviTrans,gviInPlace,gviBackup,gviEps,mountRounds,mountVariants};', context);
const S = context.subject, {story} = S;
const close = (a, b, tol = 1e-9, msg) => assert.ok(Math.abs(a - b) <= tol, msg ?? `${a} ≉ ${b}`);

// 合約
assert.equal(new Set(story.pages.map(p => p.id)).size, story.pages.length);
for (const p of story.pages) { for (const k of ['id', 'section', 'title', 'lead', 'art', 'point']) assert.equal(typeof p[k], 'string'); if (p.mount) assert.equal(typeof p.previewArt, 'string'); }
assert.equal(story.back.href, '../../02-tabular-mdp.html');

// ---- 獨立實作（不呼叫故事的函式）：4×3、撞牆留下、R 只看 s、滑動 p/2 兩側 ----
function indep({gamma = 0.9, slip = 0, reward = {}} = {}) {
  const R = {4: 10, 9: 1, 8: -10, ...reward}, D = {U: [-1, 0], D: [1, 0], L: [0, -1], R: [0, 1]}, side = {U: 'LR', D: 'LR', L: 'UD', R: 'UD'};
  const go = (s, a) => { const r = Math.floor((s - 1) / 4) + D[a][0], c = (s - 1) % 4 + D[a][1]; return r < 0 || r > 2 || c < 0 || c > 3 ? s : r * 4 + c + 1; };
  const P = (s, a) => [[go(s, a), 1 - slip], [go(s, side[a][0]), slip / 2], [go(s, side[a][1]), slip / 2]];
  const q = (V, s, a) => (R[s] || 0) + gamma * P(s, a).reduce((t, [n, p]) => t + p * V[n - 1], 0);
  return {R, P, q, gamma};
}
function indepVI(o, V0 = Array(12).fill(0), eps = 0.01) {
  const M = indep(o); let V = V0.slice(), k = 0;
  for (;;) { const nV = V.map((_, i) => Math.max(...'UDLR'.split('').map(a => M.q(V, i + 1, a)))); k++; const d = Math.max(...nV.map((v, i) => Math.abs(v - V[i]))); V = nV; if (d < eps) return {V, k, M}; }
}
function solvePolicy(M, pi) { // 解析解 (I − γP^π) V = R^π，高斯消去
  const A = Array.from({length: 12}, (_, i) => { const row = Array(13).fill(0); row[i] = 1; for (const [n, p] of M.P(i + 1, pi[i][0])) row[n - 1] -= M.gamma * p; row[12] = M.R[i + 1] || 0; return row; });
  for (let c = 0; c < 12; c++) { const piv = A.findIndex((r, i) => i >= c && Math.abs(r[c]) > 1e-12); [A[c], A[piv]] = [A[piv], A[c]]; for (let r = 0; r < 12; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let j = c; j <= 12; j++) A[r][j] -= f * A[c][j]; } }
  return A.map((r, i) => r[12] / r[i]);
}

// 手算：V¹ = R；第 2 輪幾格；第 4、5 輪的 s10（第 02 頁、第 05 頁）
const base = S.gviGet({}), H = base.hist;
assert.deepEqual([...H[1].V], [0, 0, 0, 10, 0, 0, 0, -10, 1, 0, 0, 0]);
assert.ok(H[1].pi.every(p => p === 'UDLR'));
close(H[2].V[2], 9); close(H[2].V[3], 19); close(H[2].V[7], -1); close(H[2].V[8], 1.9); // s3、s4、s8、s9
close(H[4].V[9], 0.9 * 1 + 0.81 * 1 + 0.729 * 1); assert.equal(H[4].pi[9], 'L'); // 只剩 4 步：走向 +1
close(H[5].V[9], 0.9 ** 4 * 10); assert.equal(H[5].pi[9], 'UR'); // 只剩 5 步：+10 拿得到

// 與獨立實作逐輪一致（同步）
{ const M = indep(); let V = Array(12).fill(0);
  for (let k = 1; k <= base.K; k++) { V = V.map((_, i) => Math.max(...'UDLR'.split('').map(a => M.q(V, i + 1, a)))); V.forEach((v, i) => close(v, H[k].V[i], 1e-9, `round ${k} s${i + 1}`)); } }

// 固定點：K、策略穩定輪次、Bellman 殘差、解析解、起點無關、就地更新同點
assert.equal(base.K, 67); assert.equal(base.stable, 6); assert.equal(indepVI({}).k, 67);
for (let k = 6; k <= base.K; k++) assert.equal(H[k].pi.join(), H[6].pi.join());
assert.notEqual(H[5].pi.join(), H[6].pi.join());
for (let k = 2; k <= base.K; k++) assert.ok(H[k].d <= 0.9 * H[k - 1].d + 1e-9); // γ 壓縮
const Vs = H.at(-1).V, pis = H.at(-1).pi;
{ const exact = solvePolicy(indep(), pis); close(exact[3], 100, 1e-9); close(exact[8], 1 + 0.9 ** 5 * 100, 1e-9); close(exact[7], -10 + 90, 1e-9); close(exact[11], 72, 1e-9);
  exact.forEach((v, i) => close(Vs[i], v, 0.01 * 0.9 / 0.1 + 1e-9, `V^K vs 解析解 s${i + 1}`)); }
{ const r = S.gviRun({}, Array(12).fill(50)); r.hist.at(-1).V.forEach((v, i) => close(v, Vs[i], 0.2)); assert.equal(r.hist.at(-1).pi.join(), pis.join()); }
{ const m = S.gviModel({}); let V = Array(12).fill(0); for (let i = 0; i < 300; i++) V = S.gviInPlace(m, V); const exact = solvePolicy(indep(), pis); V.forEach((v, i) => close(v, exact[i], 1e-6)); }
{ const inp = S.gviInPlace(S.gviModel({}), H[1].V); close(inp[2], 9); close(inp[6], 8.1); close(H[2].V[6], 0); } // 第 03 頁
// 第 05 頁轉向輪次
assert.deepEqual(['s11', 's10', 's9'].map(n => H.findIndex((h, k) => k > 1 && h.pi[+n.slice(1) - 1] !== 'L' && h.pi[+n.slice(1) - 1] !== 'DL' && H[k - 1].pi[+n.slice(1) - 1].length < 4 && ![...h.pi[+n.slice(1) - 1]].some(a => H[k - 1].pi[+n.slice(1) - 1].includes(a)))), [4, 5, 6]);
assert.equal(pis[8], 'UR'); assert.equal(pis[11], 'U'); assert.equal(pis[3], 'UR'); // 基準：s9 離開、s12 穿過泥沼、s4 平手

// γ 與滑動的方向（第 07 頁文字）
const g5 = S.gviGet({gamma: 0.5, slip: 0}).hist.at(-1), sl = S.gviGet({gamma: 0.9, slip: 0.2}).hist.at(-1);
assert.equal(g5.pi[11], 'L'); assert.equal(g5.pi[8], 'DL'); // s12 繞開泥沼、s9 留下
assert.equal(sl.pi[3], 'U'); // s4 不再選「右」
sl.V.forEach((v, i) => assert.ok(v < Vs[i], `滑動應降低 s${i + 1}`));
{ const r = indepVI({slip: 0.2}).V; r.forEach((v, i) => close(v, sl.V[i], 1e-9)); }

// 預測題：R(s9) = 8
{ const r = S.gviGet({reward: {9: 8}}), p = r.hist.at(-1).pi, V = r.hist.at(-1).V;
  assert.equal(p[8], 'DL'); assert.equal(p[9], 'L'); assert.ok(!p[10].includes('L'));
  const M = indep({reward: {9: 8}}), ex = solvePolicy(M, p); close(ex[8], 80, 1e-9); close(ex[9], 72, 1e-9); close(0.9 * ex[5], 0.9 ** 4 * 100, 1e-9); close(8 + 0.9 ** 5 * 100, 67.049, 1e-9);
  V.forEach((v, i) => close(v, ex[i], 0.1)); }

// 答案只在回饋
for (const p of story.pages.filter(p => p.question)) assert.doesNotMatch(p.art + p.point + p.lead + (p.previewArt || ''), /67\.05|65\.61|= 80|留在原地；/);
assert.ok(story.pages.at(-1).question);

// 圖上數字與模型一致：第 04 頁預覽（第 5 輪、s10）
{ const pv = story.pages.find(p => p.id === 'rounds').previewArt; assert.match(pv, /V<sup>5<\/sup>\(s10\) = <b>6\.56<\/b>/); assert.match(pv, /0 \+ 0\.9 × 7\.29/); }

// mount：事件掛上、狀態保留、清理全數移除
const listeners = new Set();
const el = (extra = {}) => ({value: '', dataset: {}, disabled: false, setAttribute() {}, textContent: '', innerHTML: '',
  addEventListener(k, f) { listeners.add(this); (this.ev ??= {})[k] = f; }, removeEventListener(k, f) { assert.equal(this.ev[k], f); delete this.ev[k]; if (!Object.keys(this.ev).length) listeners.delete(this); },
  querySelectorAll: () => [], querySelector: () => el(), ...extra});
const btn = ds => ({dataset: ds, closest: () => ({dataset: ds})});
{ const bar = el(), out = el(), range = el(), label = el(); const state = {};
  const root = {querySelector: s => ({'[data-rounds-output]': out, '[data-round-buttons]': bar, '[data-round]': range, '[data-round-label]': label})[s]};
  let clean = S.mountRounds(root, state); assert.match(out.innerHTML, /第 0 輪/);
  bar.ev.click({target: btn({step: '1'})}); bar.ev.click({target: btn({step: '1'})}); assert.equal(state.k, 2);
  bar.ev.click({target: btn({go: 'end'})}); assert.equal(state.k, 67); bar.ev.click({target: btn({step: '1'})}); assert.equal(state.k, 67);
  range.value = '5'; range.ev.input(); assert.match(out.innerHTML, /V<sup>5<\/sup>\(s10\) = <b>6\.56/);
  out.ev.click({target: {closest: () => ({dataset: {cell: '12'}})}}); assert.equal(state.s, 12); assert.match(out.innerHTML, /\(s12\)/);
  clean(); assert.equal(listeners.size, 0); clean = S.mountRounds(root, state); assert.equal(range.value, 5); clean(); assert.equal(listeners.size, 0); }
{ const box = el(), out = el(); const state = {};
  const root = {querySelector: s => ({'[data-variants]': box, '[data-variant-output]': out})[s]};
  const clean = S.mountVariants(root, state); assert.match(out.innerHTML, /基準設定/);
  box.ev.click({target: btn({key: 'gamma', val: '0.5'})}); assert.match(out.innerHTML, /s12：上 → 左/);
  box.ev.click({target: btn({key: 'gamma', val: '0.9'})}); box.ev.click({target: btn({key: 'slip', val: '0.2'})}); assert.match(out.innerHTML, /s4：上／右 → 上/);
  clean(); assert.equal(listeners.size, 0); }

console.log(`PASS: contract, hand rounds, indep sync VI, fixed point (K=${base.K}, policy stable at ${base.stable}), analytic V^π, V0/in-place invariance, γ/slip directions, predict answer, mounts`);
