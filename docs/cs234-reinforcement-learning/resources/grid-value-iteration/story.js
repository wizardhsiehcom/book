// 格子世界是教學補充，仿第 1、2 章的 Mars Rover（一小一大兩個獎勵、撞邊界留在原地）；不是課堂上的例子。
// 圖上所有價值與箭頭都由下面真正執行的價值迭代算出，不手填。
// 更新方式：同步。V^{k+1}(s) = max_a [R(s,a) + γ Σ P(s'|s,a) V^k(s')]，每輪另開新陣列，只讀上一輪（第 2 章 V^{k+1} = B V^k）。
const gviW = 4, gviH = 3, gviN = gviW * gviH, gviEps = 0.01, gviTie = 1e-9;
const gviActs = [['U', '上', '↑', -1, 0], ['D', '下', '↓', 1, 0], ['L', '左', '←', 0, -1], ['R', '右', '→', 0, 1]];
const gviAct = Object.fromEntries(gviActs.map(([k, name, sym, dr, dc]) => [k, {k, name, sym, dr, dc}]));
const gviPerp = {U: ['L', 'R'], D: ['L', 'R'], L: ['U', 'D'], R: ['U', 'D']};
const gviBase = {gamma: 0.9, slip: 0, reward: {4: 10, 9: 1, 8: -10}};
const gviTag = {4: '+10', 9: '+1', 8: '−10'};
const gviTagLong = {...gviTag, 8: '−10 泥沼'};
const gviModel = (o = {}) => ({gamma: o.gamma ?? gviBase.gamma, slip: o.slip ?? gviBase.slip, reward: {...gviBase.reward, ...(o.reward || {})}});
const gviR = (m, s) => m.reward[s] || 0; // R(s,a) 只看 s，與 a 無關
function gviMove(s, a) { // 撞邊界留在原地
  const i = s - 1, r = Math.floor(i / gviW) + gviAct[a].dr, c = i % gviW + gviAct[a].dc;
  return r < 0 || r >= gviH || c < 0 || c >= gviW ? s : r * gviW + c + 1;
}
// P(·|s,a)：1 − p 走向 a，各 p/2 滑向兩個垂直方向；落點相同的機率合併。
function gviTrans(m, s, a) {
  const out = new Map(), add = (t, q) => { if (q > 0) out.set(t, (out.get(t) || 0) + q); };
  add(gviMove(s, a), 1 - m.slip); for (const b of gviPerp[a]) add(gviMove(s, b), m.slip / 2);
  return [...out];
}
const gviQ = (m, V, s, a) => gviR(m, s) + m.gamma * gviTrans(m, s, a).reduce((sum, [t, q]) => sum + q * V[t - 1], 0);
function gviBackup(m, V) { // 一輪同步備份：新陣列只讀舊的 V
  const next = [], pi = [];
  for (let s = 1; s <= gviN; s++) {
    const q = gviActs.map(([a]) => gviQ(m, V, s, a)), best = Math.max(...q);
    next.push(best); pi.push(gviActs.filter((_, i) => q[i] > best - gviTie).map(([a]) => a).join(''));
  }
  return {V: next, pi};
}
function gviInPlace(m, V) { // 對照用：就地更新，由 s1 掃到 s12，後面的格子讀到前面剛寫入的新值
  const W = V.slice();
  for (let s = 1; s <= gviN; s++) W[s - 1] = Math.max(...gviActs.map(([a]) => gviQ(m, W, s, a)));
  return W;
}
function gviRun(o = {}, V0 = Array(gviN).fill(0), maxK = 2000) {
  const m = gviModel(o), hist = [{V: V0.slice(), pi: null, d: null}];
  for (let k = 1; k <= maxK; k++) {
    const {V, pi} = gviBackup(m, hist[k - 1].V);
    hist.push({V, pi, d: Math.max(...V.map((v, i) => Math.abs(v - hist[k - 1].V[i])))});
    if (hist[k].d < gviEps) break;
  }
  let stable = 1; for (let k = 2; k < hist.length; k++) if (hist[k].pi.join() !== hist[k - 1].pi.join()) stable = k;
  return {m, hist, K: hist.length - 1, stable};
}
const gviMemo = new Map();
const gviGet = (o = {}) => { const key = JSON.stringify(o); if (!gviMemo.has(key)) gviMemo.set(key, gviRun(o)); return gviMemo.get(key); };
// 箭頭「轉向」：上一輪有方向（不是四向平手）而且新方向和舊方向完全不重疊。
const gviTurned = (prev, cur) => prev && prev.length < 4 && ![...cur].some(a => prev.includes(a));

const gviF = n => { const t = (Math.abs(n) < 0.005 ? 0 : n).toFixed(2); return t.replace('-', '−'); };
const gviP = q => Number(q.toFixed(3)).toString();
const gviArrows = pi => !pi ? '' : pi.length === 4 ? '<span class="gvi-tie">四向平手</span>' : [...pi].map(a => `<i class="gvi-ar gvi-ar-${a}"></i>`).join('');
const gviPiText = pi => !pi ? '無' : pi.length === 4 ? '四向平手' : [...pi].map(a => gviAct[a].name).join('／');
// 格子：底色深淺 = V（負值不上色），scale 為滿格值。
function gviGrid(V, pi, {sel = 0, marks = new Set(), near = new Set(), scale = 100, button = false, tags = true, long = false, cls = ''} = {}) {
  const cells = Array.from({length: gviN}, (_, i) => {
    const s = i + 1, tag = tags && gviTag[s] ? `<em class="gvi-tag">${(long ? gviTagLong : gviTag)[s]}</em>` : '';
    const v = V ? `<b class="gvi-v">${gviF(V[i])}</b>` : '', shade = V ? Math.max(0, Math.min(1, V[i] / scale)) : 0;
    const c = `gvi-cell${s === sel ? ' gvi-sel' : ''}${marks.has(s) ? ' gvi-mark' : ''}${near.has(s) ? ' gvi-near' : ''}`;
    const label = `s${s}${gviTag[s] ? `（獎勵 ${gviTagLong[s]}）` : ''}${V ? `，V = ${gviF(V[i])}` : ''}${pi ? `，箭頭 ${gviPiText(pi[i])}` : ''}`;
    const inner = `<span class="gvi-id">s${s}</span>${tag}${v}${gviArrows(pi && pi[i])}`;
    return button ? `<button type="button" class="${c}" style="--v:${shade}" data-cell="${s}" aria-pressed="${s === sel}" aria-label="${label}">${inner}</button>`
      : `<div class="${c}" style="--v:${shade}" role="listitem" aria-label="${label}">${inner}</div>`;
  }).join('');
  return `<div class="gvi-grid ${cls}"${button ? ' role="group" aria-label="點一格看它的備份算式"' : ' role="list"'}>${cells}</div>`;
}
const gviKey = scale => `<p class="gvi-key"><span><i class="gvi-sw-shade"></i>底色越深 V 越大（滿格 ${gviF(scale).replace('.00', '')}；負值不上色）</span><span><i class="gvi-sw-arrow"></i>箭頭 = 取到 max 的動作，平手全畫</span></p>`;

// 單格備份展開：第 k 輪的 V^k(s) 只用第 k−1 輪的值。
function gviBackupView(run, k, s) {
  const {m, hist} = run;
  if (k === 0) return `<div class="gvi-backup"><p class="gvi-eqhead">第 0 輪：V⁰(s) = 0，每一格都是。還沒有備份，也還沒有箭頭。</p></div>`;
  const prev = hist[k - 1].V, pi = hist[k].pi[s - 1];
  const rows = gviActs.map(([a, name, sym]) => {
    const tr = gviTrans(m, s, a), q = gviQ(m, prev, s, a), best = pi.includes(a);
    const where = tr.map(([t, p]) => `${t === s ? `s${t}（撞牆留下）` : `s${t}`}${tr.length > 1 || p !== 1 ? ` ${gviP(p)}` : ''}`).join('、');
    const sum = tr.length === 1 && tr[0][1] === 1 ? gviF(prev[tr[0][0] - 1]) : `(${tr.map(([t, p]) => `${gviP(p)}×${gviF(prev[t - 1])}`).join(' + ')})`;
    return `<div class="gvi-row${best ? ' gvi-best' : ''}"><span class="gvi-act">${sym} ${name}</span><span class="gvi-to">到 ${where}</span><span class="gvi-calc">${gviF(gviR(m, s))} + ${m.gamma} × ${sum}</span><span class="gvi-q">= ${gviF(q)}${best ? '<small>取 max</small>' : ''}</span></div>`;
  }).join('');
  return `<div class="gvi-backup"><p class="gvi-eqhead">V<sup>${k}</sup>(s${s}) = max<sub>a</sub> [ R(s${s},a) + γ Σ P(s′|s${s},a) V<sup>${k - 1}</sup>(s′) ]</p>
    <p class="gvi-eqnote">R(s${s},a) = ${gviF(gviR(m, s))}（四個動作都一樣）；γ = ${m.gamma}；${m.slip ? `滑動 p = ${m.slip}` : '不滑動：P 只有一個落點、機率 1'}；括號裡的數字都是上一輪 V<sup>${k - 1}</sup>。</p>
    <div class="gvi-rows">${rows}</div>
    <p class="gvi-result">V<sup>${k}</sup>(s${s}) = <b>${gviF(hist[k].V[s - 1])}</b>，箭頭：${gviPiText(pi)}</p></div>`;
}
const gviNeighbors = s => new Set(gviActs.map(([a]) => gviMove(s, a)));

// 第 04 頁：逐輪前進／後退，點格子看備份
function gviRoundsView(k, s) {
  const run = gviGet(), h = run.hist[k];
  const turned = k > 1 ? h.pi.map((p, i) => gviTurned(run.hist[k - 1].pi[i], p) ? i + 1 : 0).filter(Boolean) : [];
  const status = k === 0 ? '第 0 輪：按「下一輪」做第一次備份。' : `第 ${k} 輪 · 最大變化 Δ<sub>${k}</sub> = ${gviF(h.d)}${turned.length ? ` · 轉向：${turned.map(x => `s${x}`).join('、')}` : ''}${k === run.K ? ` · 已小於 ε = ${gviEps}，停止` : ''}`;
  return `<p class="gvi-verdict gvi-r-verdict">${status}</p><div class="gvi-r-grid">${gviGrid(h.V, h.pi, {sel: s, marks: new Set(turned), near: k ? gviNeighbors(s) : new Set(), button: true})}</div><div class="gvi-r-backup">${gviBackupView(run, k, s)}</div><div class="gvi-r-key">${gviKey(100)}<p class="gvi-key"><span><i class="gvi-sw-sel"></i>選中的格子</span><span><i class="gvi-sw-near"></i>它的備份會讀到的格子</span><span><i class="gvi-sw-mark"></i>這一輪箭頭轉向</span></p></div>`;
}
function mountRounds(root, state) {
  const run = gviGet(); state.k ??= 0; state.s ??= 10;
  const out = root.querySelector('[data-rounds-output]'), bar = root.querySelector('[data-round-buttons]'), range = root.querySelector('[data-round]'), label = root.querySelector('[data-round-label]');
  const render = () => {
    range.value = state.k; label.textContent = `第 ${state.k} 輪（共 ${run.K} 輪收斂）`; range.setAttribute('aria-valuetext', `第 ${state.k} 輪`);
    bar.querySelector('[data-step="-1"]').disabled = state.k === 0; bar.querySelector('[data-step="1"]').disabled = state.k === run.K;
    out.innerHTML = gviRoundsView(state.k, state.s);
  };
  const click = e => { const b = e.target.closest('button'); if (!b) return; const st = b.dataset.step, go = b.dataset.go; if (st) state.k = Math.max(0, Math.min(run.K, state.k + Number(st))); if (go) state.k = go === 'end' ? run.K : Number(go); render(); };
  const pick = e => { const b = e.target.closest('[data-cell]'); if (b) { state.s = Number(b.dataset.cell); render(); out.querySelector(`[data-cell="${state.s}"]`)?.focus?.(); } };
  const input = () => { state.k = Number(range.value); render(); };
  bar.addEventListener('click', click); out.addEventListener('click', pick); range.addEventListener('input', input); render();
  return () => { bar.removeEventListener('click', click); out.removeEventListener('click', pick); range.removeEventListener('input', input); };
}
const gviRoundControls = () => { const K = gviGet().K; return `<div class="gvi-r-ctrl"><div class="gvi-buttons" data-round-buttons><button type="button" data-go="0">回到第 0 輪</button><button type="button" data-step="-1">← 上一輪</button><button type="button" data-step="1">下一輪 →</button><button type="button" data-go="end">跳到收斂</button></div><label class="gvi-control"><span data-round-label>第 0 輪</span><input type="range" data-round min="0" max="${K}" step="1" value="0"></label></div>`; };

// 第 07 頁：改 γ、加滑動，看固定點
const gviVariants = {gamma: [[0.9, 'γ = 0.9'], [0.5, 'γ = 0.5']], slip: [[0, '不滑動'], [0.2, '滑動 p = 0.2']]};
const gviDiff = o => { const a = gviGet().hist.at(-1).pi, b = gviGet(o).hist.at(-1).pi; return b.map((p, i) => p !== a[i] ? i + 1 : 0).filter(Boolean); };
function gviVariantView(o) {
  const run = gviGet(o), base = gviGet(), last = run.hist.at(-1), diff = gviDiff(o), isBase = o.gamma === 0.9 && o.slip === 0, scale = 10 / (1 - o.gamma);
  const lines = diff.map(s => `s${s}：${gviPiText(base.hist.at(-1).pi[s - 1])} → ${gviPiText(last.pi[s - 1])}`).join('；');
  const verdict = isBase ? '這是基準設定。' : diff.length ? `和基準比，箭頭不同的格子 — ${lines}。` : '箭頭和基準完全相同。';
  return `<p class="gvi-verdict">${verdict}第 ${run.stable} 輪後策略不再變，第 ${run.K} 輪 Δ < ${gviEps}。</p>
    <div class="gvi-pair"><section><h3>${o.gamma === 0.9 && o.slip === 0 ? '基準' : '這組設定'}：γ = ${o.gamma}、${o.slip ? `滑動 p = ${o.slip}` : '不滑動'}</h3>${gviGrid(last.V, last.pi, {marks: new Set(diff), scale})}${gviKey(scale)}</section>
    ${isBase ? '' : `<section class="gvi-ref"><h3>基準：γ = 0.9、不滑動</h3>${gviGrid(base.hist.at(-1).V, base.hist.at(-1).pi, {scale: 100})}</section>`}</div>
    <p class="gvi-key"><span><i class="gvi-sw-mark"></i>箭頭和基準不同</span><span>兩張圖底色滿格不同（10 / (1 − γ)），比較箭頭，不比深淺</span></p>`;
}
function mountVariants(root, state) {
  state.o ??= {gamma: 0.9, slip: 0};
  const box = root.querySelector('[data-variants]'), out = root.querySelector('[data-variant-output]');
  const render = () => { box.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(state.o[b.dataset.key] === Number(b.dataset.val)))); out.innerHTML = gviVariantView(state.o); };
  const click = e => { const b = e.target.closest('button'); if (b && b.dataset.key) { state.o = {...state.o, [b.dataset.key]: Number(b.dataset.val)}; render(); } };
  box.addEventListener('click', click); render();
  return () => box.removeEventListener('click', click);
}
const gviVariantControls = `<div class="gvi-groups" data-variants>${Object.entries(gviVariants).map(([key, opts]) => `<div class="gvi-buttons" role="group" aria-label="${key === 'gamma' ? '折扣 γ' : '滑動機率'}">${opts.map(([v, n]) => `<button type="button" data-key="${key}" data-val="${v}" aria-pressed="${gviBase[key] === v}">${n}</button>`).join('')}</div>`).join('')}</div>`;

// 靜態圖
const gviSetup = `<figure class="gvi-fig"><div class="gvi-split">${gviGrid(null, null, {cls: 'gvi-map', long: true})}
  <dl class="gvi-params"><div><dt>S 狀態</dt><dd>12 格 s1 … s12，由左上逐列編號</dd></div><div><dt>A 動作</dt><dd>上、下、左、右</dd></div><div><dt>P 轉移</dt><dd>往選的方向走一格，機率 1；撞到邊界就留在原地</dd></div><div><dt>R(s,a) 獎勵</dt><dd>在 s4 拿 +10、在 s9 拿 +1、在 s8 扣 10，其他 0；與動作無關</dd></div><div><dt>γ 折扣</dt><dd>0.9</dd></div></dl></div>
  <figcaption>沒有終止格：待在 s4 每一步都再拿 +10，所以它的價值會接近 10 / (1 − 0.9) = 100。泥沼 s8 走得出來，只是待一步扣一步。格子世界是仿 Mars Rover 的教學補充。</figcaption></figure>`;

function gviBackupFig() {
  const run = gviGet(), k = 5, s = 10;
  return `<figure class="gvi-fig"><div class="gvi-split"><section><h3>上一輪 V<sup>${k - 1}</sup></h3>${gviGrid(run.hist[k - 1].V, null, {sel: s, near: gviNeighbors(s)})}</section>${gviBackupView(run, k, s)}</div>
    <figcaption>左圖只有數字：這就是算式括號裡讀到的值。s10 往下撞牆，所以「下」讀的是自己的舊值。</figcaption></figure>`;
}
function gviSyncFig() {
  const run = gviGet(), V1 = run.hist[1].V, sync = run.hist[2].V, inplace = gviInPlace(run.m, V1);
  const diff = new Set(sync.map((v, i) => Math.abs(v - inplace[i]) > 1e-9 ? i + 1 : 0).filter(Boolean));
  return `<figure class="gvi-fig"><div class="gvi-three"><section><h3>第 1 輪 V¹</h3>${gviGrid(V1, null, {sel: 3})}</section><section><h3>同步：V² 只讀 V¹</h3>${gviGrid(sync, null, {sel: 7})}<p class="gvi-note">s7 往上讀 V¹(s3) = ${gviF(V1[2])}，V²(s7) = ${gviF(sync[6])}</p></section><section><h3>就地：邊算邊覆寫</h3>${gviGrid(inplace, null, {marks: diff, sel: 7})}<p class="gvi-note">s3 已先改成 ${gviF(inplace[2])}，s7 讀到它 → ${gviF(inplace[6])}</p></section></div>
    <p class="gvi-key"><span><i class="gvi-sw-sel"></i>正在說明的格子</span><span><b class="gvi-sw-text">8.10</b>朱紅數字：就地版和同步版不同（${diff.size} 格）</span></p>
    <figcaption>就地版依 s1 → s12 的順序掃，後面的格子會讀到前面剛寫入的值，所以同一輪的數字不一樣；兩種都收斂到同一個固定點。本篇之後全部用同步。就地更新是教學補充（Sutton & Barto §4.1）。</figcaption></figure>`;
}
function gviFlipFig() {
  const run = gviGet(), ks = [3, 4, 5, 6], s = 10;
  const panels = ks.map(k => { const t = new Set(run.hist[k].pi.map((p, i) => gviTurned(run.hist[k - 1].pi[i], p) ? i + 1 : 0).filter(Boolean)); return `<section><h3>第 ${k} 輪${t.size ? `：${[...t].map(x => `s${x}`).join('、')} 轉向` : ''}</h3>${gviGrid(run.hist[k].V, run.hist[k].pi, {marks: t, tags: false, cls: 'gvi-small'})}</section>`; }).join('');
  const q = k => Object.fromEntries(gviActs.map(([a]) => [a, gviQ(run.m, run.hist[k - 1].V, s, a)]));
  const q4 = q(4), q5 = q(5);
  return `<figure class="gvi-fig"><div class="gvi-four">${panels}</div>
    <div class="gvi-table" role="table" aria-label="s10 在第 4 與第 5 輪各動作的值"><div role="row" class="gvi-tr gvi-th"><span role="columnheader">s10 的備份</span><span role="columnheader">← 左（往 +1）</span><span role="columnheader">↑ 上 / → 右（往 +10）</span></div>
      <div role="row" class="gvi-tr"><span role="cell">第 4 輪：只剩 4 步</span><span role="cell"><b>${gviF(q4.L)}</b></span><span role="cell">${gviF(q4.U)}（+10 在 4 步外，拿不到）</span></div>
      <div role="row" class="gvi-tr"><span role="cell">第 5 輪：只剩 5 步</span><span role="cell">${gviF(q5.L)}</span><span role="cell"><b>${gviF(q5.U)}</b> = 0.9⁴ × 10</span></div></div>
    <p class="gvi-key"><span><i class="gvi-sw-mark"></i>這一輪轉向：新箭頭和上一輪完全不重疊</span></p>
    <figcaption>從 s10 走到 s4 要 4 步，第 5 步才開始領 +10；所以只剩 4 步時那條路一文不值。數字都來自同一次同步價值迭代。</figcaption></figure>`;
}
function gviConvergeFig() {
  const run = gviGet(), ds = run.hist.slice(1).map(h => h.d), K = run.K;
  const X = k => 80 + (k - 1) / (K - 1) * 500, Y = d => 20 + (1 - Math.log10(d)) / 4 * 200; // 縱軸 10 到 0.001（對數）
  const path = ds.map((d, i) => `${i ? 'L' : 'M'}${X(i + 1).toFixed(1)} ${Y(d).toFixed(1)}`).join(' ');
  const yt = [10, 1, 0.1, 0.01, 0.001].map(v => `<line x1="80" x2="580" y1="${Y(v)}" y2="${Y(v)}" class="gvi-grid-line"/><text x="72" y="${Y(v) + 5}" class="gvi-t gvi-t-end">${v}</text>`).join('');
  const xt = [1, 10, 20, 30, 40, 50, 60, K].filter((v, i, a) => a.indexOf(v) === i && (v === K || K - v > 4)).map(v => `<text x="${X(v)}" y="244" class="gvi-t${v === 1 || v === K ? '' : ' gvi-t-minor'}">${v}</text>`).join('');
  return `<figure class="gvi-fig"><svg class="gvi-chart" viewBox="0 0 600 262" role="img" aria-label="每輪最大變化量 Δ_k 對數圖：第 1 輪 ${gviF(ds[0])}，每輪乘 ${run.m.gamma}，第 ${run.stable} 輪後策略不變，第 ${K} 輪 Δ = ${ds[K - 1].toFixed(4)} 小於 ε = ${gviEps}">
      ${yt}${xt}<line x1="80" x2="580" y1="${Y(gviEps)}" y2="${Y(gviEps)}" class="gvi-eps"/><text x="${X(30)}" y="${Y(gviEps) - 8}" class="gvi-t gvi-t-accent">ε = ${gviEps}</text>
      <line x1="${X(run.stable)}" x2="${X(run.stable)}" y1="20" y2="220" class="gvi-stable"/><text x="${X(run.stable) + 6}" y="206" class="gvi-t gvi-t-start">第 ${run.stable} 輪後策略不變</text>
      <path d="${path}" class="gvi-line"/><circle cx="${X(K)}" cy="${Y(ds[K - 1])}" r="5" class="gvi-dot"/><text x="${X(K) - 8}" y="${Y(ds[K - 1]) + 22}" class="gvi-t gvi-t-end">第 ${K} 輪停止</text>
      <text x="330" y="260" class="gvi-t gvi-t-small gvi-t-minor">輪次 k</text></svg>
    <dl class="gvi-params"><div><dt>Δ<sub>k</sub></dt><dd>max<sub>s</sub> |V<sup>k</sup>(s) − V<sup>k−1</sup>(s)|，縱軸取對數</dd></div><div><dt>每輪縮小</dt><dd>Δ<sub>k+1</sub> ≤ γ Δ<sub>k</sub>：Δ₂ / Δ₁ = ${(ds[1] / ds[0]).toFixed(2)}，Δ₃ / Δ₂ = ${(ds[2] / ds[1]).toFixed(2)}</dd></div><div><dt>停止時</dt><dd>V<sup>${K}</sup>(s4) = ${run.hist[K].V[3].toFixed(3)}，真正的 V*(s4) = 100</dd></div></dl>
    <figcaption>本例每輪恰好乘 0.9，是因為 s4 每多一步就多拿 10 × 0.9<sup>k</sup>；一般情況只保證「至多」乘 γ。</figcaption></figure>`;
}
const gviBounds = `<figure class="gvi-fig"><div class="gvi-table gvi-table-2" role="table" aria-label="本篇的設定與章節的其他路徑"><div role="row" class="gvi-tr gvi-th"><span role="columnheader">本篇的設定</span><span role="columnheader">換了會怎樣／章節哪裡談</span></div>
  <div role="row" class="gvi-tr"><span role="cell">P、R 都已知，可以對每個 s′ 取期望</span><span role="cell">只有經驗軌跡時，用取樣代替期望：MC、TD（第 3 章）</span></div>
  <div role="row" class="gvi-tr"><span role="cell">備份裡有 max：價值迭代</span><span role="cell">固定一個策略 π、拿掉 max，就是策略評估；也能直接解 V<sup>π</sup> = (I − γP<sup>π</sup>)<sup>−1</sup>R<sup>π</sup>（§2.3）</span></div>
  <div role="row" class="gvi-tr"><span role="cell">每輪只看一步，策略可能來回改</span><span role="cell">策略迭代：每輪把 π 評估到底再貪婪改進，保證單調改進（§2.4）</span></div>
  <div role="row" class="gvi-tr"><span role="cell">同步更新、ε = ${gviEps} 停止</span><span role="cell">就地更新中間值不同、固定點相同；ε 越小，輪數越多</span></div>
  <div role="row" class="gvi-tr"><span role="cell">12 格可以列成表</span><span role="cell">狀態多到存不下時要函數逼近（第 4 章）</span></div></div>
  <figcaption>格子、獎勵、γ、滑動機率與 ε 都是教學補充；章節只給一般式與 Mars Rover。</figcaption></figure>`;
const gviParam = rows => `<dl class="gvi-params">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
const gviBack = '../../02-tabular-mdp.html';

const story = {
  title: '格子世界的價值迭代', label: 'CS234 / 02 表格型 MDP 規劃',
  back: {href: gviBack, label: '返回第 2 章'},
  pages: [
    {id: 'setup', section: '01 / 模型', title: '十二格、四個動作、三個有獎勵的格子',
      lead: '規劃問題的前提是模型全部已知。先把這個格子世界的 S、A、P、R、γ 一次寫清楚，後面每個數字都從這五項算出。',
      art: gviSetup,
      point: '價值迭代要算的是：從每一格出發、照最好的方式走，期望折扣回報是多少，以及每格該往哪走。',
      detail: '仿第 1 章 Mars Rover：一個小獎勵（+1）、一個大獎勵（+10），撞邊界的動作失敗、留在原地。格子版是本篇的教學補充。'},
    {id: 'backup', section: '02 / 一次備份', title: '一格的新值，只看鄰居的舊值',
      lead: '最佳貝爾曼備份對每個動作算「這一步的獎勵 + γ × 下一格的舊價值」，四個動作取最大。以 s10 在第 5 輪為例，全部數字展開。',
      art: gviBackupFig(),
      point: '一次備份 = 對每個動作把 R 和 γ × 期望的舊 V 加起來，再取 max；取到 max 的動作就是這一格的箭頭。',
      detail: '章節 §2.5：V<sup>k+1</sup>(s) = max<sub>a</sub> [R(s,a) + γ Σ P(s′|s,a) V<sup>k</sup>(s′)]。「上」和「右」同樣是 6.56，平手時兩個箭頭都畫。'},
    {id: 'sync', section: '03 / 同步', title: '同一輪的所有格子都讀上一輪',
      lead: 'V<sup>k+1</sup> = B V<sup>k</sup> 的意思是：新的一整張表，全部由舊的那張算出。另一種寫法是算完一格就覆寫，後面的格子會讀到新值。',
      art: gviSyncFig(),
      point: '本篇一律同步：第 k 輪的每一格只讀第 k − 1 輪。所以你在下一頁往回翻一輪，就能對到算式裡的每個數字。',
      detail: '就地版與同步版收斂到同一個 V*（檢查腳本實際跑過）；本篇不比較哪個較快。'},
    {id: 'rounds', section: '04 / 操作', title: '一輪一輪往前走，點任一格看它怎麼算',
      lead: '從第 0 輪開始按「下一輪」。s10 已選好；也可以點別的格子。算式裡的舊值，就是往回一輪時圖上那一格的數字。',
      art: `<div class="gvi-live"><div class="gvi-rounds">${gviRoundControls()}<div class="gvi-r-out" data-rounds-output></div></div></div>`,
      previewArt: `<div class="gvi-live"><div class="gvi-rounds"><div class="gvi-r-out">${gviRoundsView(5, 10)}</div></div></div>`,
      mount: mountRounds,
      point: '數字從 s4 和 s9 兩個獎勵格往外擴散，每輪多走一格；箭頭跟著最新的最大值走。',
      detail: '第 1 輪 V¹ = R，四個動作都一樣，所以全部「四向平手」。箭頭取自這一輪備份裡的 argmax，也就是章節取出策略的式子套在上一輪的 V。'},
    {id: 'flip', section: '05 / 策略變化', title: '遠處的 +10，要走幾輪才傳得到',
      lead: '章節 §2.6：從 V⁰ = 0 開始，V<sup>k</sup> 是「只能走 k 步」時的最佳回報。步數不夠，遠處的獎勵就算不進來，箭頭會先指向近處的 +1。',
      art: gviFlipFig(),
      point: '可走的步數每多一步，+10 的影響就往外推一格；推到的格子，箭頭從 +1 轉向 +10。最後連 s9 自己都離開 +1。',
      detail: '這就是章節說價值迭代「不保證策略單調改進」的樣子：中間的策略是針對不同步數的最佳解。'},
    {id: 'converge', section: '06 / 收斂', title: '策略早就不動，價值還在收斂',
      lead: '每輪最大的變化量 Δ<sub>k</sub> 會一直縮小，因為備份算子是 γ 壓縮。本篇在 Δ<sub>k</sub> < ε = 0.01 時停止。',
      art: gviConvergeFig(),
      point: '第 6 輪後箭頭已經不會再變，但價值要到第 67 輪變化才小於 0.01：停止條件看的是價值，不是策略。',
      detail: '章節 §2.5 的壓縮映射定理保證固定點唯一，且與起點 V⁰ 無關；檢查腳本另外從 V⁰ = 50 出發，得到同一個 V*，也用解析解 (I − γP<sup>π</sup>)<sup>−1</sup>R<sup>π</sup> 核對。'},
    {id: 'variants', section: '07 / 操作', title: '改 γ、加滑動，哪些箭頭會變',
      lead: '先點「γ = 0.5」，看 s12 和 s9；再回到 0.9、點「滑動 p = 0.2」，看 s4。圖是 Δ < 0.01 停止時的價值與箭頭。',
      art: `<div class="gvi-live">${gviVariantControls}<div data-variant-output></div></div>`,
      previewArt: `<div class="gvi-live">${gviVariantView({gamma: 0.9, slip: 0})}</div>`,
      mount: mountVariants,
      point: 'γ 變小，遠處打折更重：s12 寧可繞路也不穿過泥沼，s9 留在 +1。加上滑動，s4 往右撞牆有 0.1 會滑進泥沼，只剩「上」。',
      detail: '滑動：以 1 − p 走向選的方向，各 p/2 滑向兩個垂直方向（仿 Russell & Norvig 的 4×3 世界，教學補充）。所有格子的價值都因滑動而降低。'},
    {id: 'bounds', section: '08 / 邊界', title: '這個例子刻意固定了什麼',
      lead: '本篇只示範「模型已知、狀態可列表」時的價值迭代。每一項設定換掉，都對應章節或後面章節的另一條路。',
      art: gviBounds,
      point: '價值迭代的核心只有一件事：用上一輪的表，對每一格做一次含 max 的貝爾曼備份，直到表不再明顯改變。'},
    {id: 'predict', section: '09 / 預測', title: '把 +1 改成 +8，s9 和 s10 往哪走？',
      lead: '新情況：只改 s9 的獎勵，其他照基準（γ = 0.9、不滑動）。先別急著算整張表，用「γ<sup>距離</sup> × 目的地的價值」比較兩條路。',
      art: `<figure class="gvi-fig">${gviParam([['R(s9, a)', '+1 → +8（其他格不變）'], ['R(s4, a)', '+10，V*(s4) = 10 / (1 − 0.9) = 100'], ['s9 到 s4', '最短 5 步'], ['γ、滑動', '0.9、不滑動']])}<figcaption>和第 07 頁同一個模型；改獎勵在前面沒有示範過。</figcaption></figure>`,
      point: '先問 s9：一直留下，和走 5 步去 s4，哪個大？再問 s10。',
      question: {prompt: '收斂後，s9 和 s10 的箭頭是？', hideFuturePreviews: true, choices: [
        {value: 'both-away', label: '兩格都還是走向 s4', feedback: '+8 每步都領，留下的價值是 8 / (1 − 0.9) = 80，比 8 + 0.9⁵ × 100 ≈ 67.05 大，s9 不會離開；s10 往左得 72，也比往 s4 的 65.61 大。'},
        {value: 'stay-left', label: 's9 留在原地；s10 往左走向 s9', feedback: '對。s9 留下：每步 +8，V = 8 / (1 − 0.9) = 80；離開走到 s4：8 + 0.9⁵ × 100 ≈ 67.05。s10 往左：0.9 × 80 = 72；往上或往右去 s4：0.9 × 0.9³ × 100 ≈ 65.61。再遠一格的 s11 就改回走向 s4（0.9 × 81 ≈ 72.9 > 0.81 × 80 = 64.8）。'},
        {value: 'stay-away', label: 's9 留在原地；s10 仍走向 s4', feedback: 's9 的價值變成 80，s10 往左一步就能拿到 0.9 × 80 = 72，比走 4 步去 s4 的 0.9⁴ × 100 ≈ 65.61 大，所以 s10 也轉向 s9。要到 s11 才改回走向 s4。'}]},
      detail: `<a href="${gviBack}">第 2 章：表格型 MDP 規劃</a> · 格子、獎勵與參數都是教學補充；答案由檢查腳本以同一模型重算。`},
  ],
};
