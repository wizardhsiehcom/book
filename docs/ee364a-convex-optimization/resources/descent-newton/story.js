// 所有等高線、路徑與數字都在本檔由同一組函數物件（f、∇f、∇²f）與實際執行的演算法算出，沒有手繪路徑。
// 等高線用 marching squares 在同一個 f 上取樣；等高線圖的 x、y 同比例。

// ---------- 函數 ----------
const gdnQuad = k => ({f: x => 0.5 * (x[0] * x[0] + k * x[1] * x[1]), g: x => [x[0], k * x[1]], H: () => [[1, 0], [0, k]], pstar: 0, xstar: [0, 0], m: Math.min(1, k)});
// B&V (9.20) 的三個指數項取 log（log-sum-exp）：最小點與等高線形狀和 (9.20) 相同。教學選擇，見 sources。
const gdnA = [[1, 3], [1, -3], [-1, 0]];
const gdnLse = {
  f: x => Math.log(gdnA.reduce((s, a) => s + Math.exp(a[0] * x[0] + a[1] * x[1] - 0.1), 0)),
  g: x => { const p = gdnProb(x); return [0, 1].map(i => gdnA.reduce((s, a, j) => s + p[j] * a[i], 0)); },
  H: x => { const p = gdnProb(x), m = [0, 1].map(i => gdnA.reduce((s, a, j) => s + p[j] * a[i], 0));
    return [0, 1].map(i => [0, 1].map(k => gdnA.reduce((s, a, j) => s + p[j] * a[i] * a[k], 0) - m[i] * m[k])); },
  pstar: Math.log(2 * Math.SQRT2) - 0.1, xstar: [-Math.LN2 / 2, 0]};
function gdnProb(x) { const e = gdnA.map(a => Math.exp(a[0] * x[0] + a[1] * x[1] - 0.1)), s = e[0] + e[1] + e[2]; return e.map(v => v / s); }
// 換座標 x = T y，T = diag(1, 1/k)：y₂ = k·x₂。g(y) = f(Ty)，∇g = T∇f，∇²g = T∇²f T。
const gdnScaled = (fn, k) => ({
  f: y => fn.f([y[0], y[1] / k]),
  g: y => { const g = fn.g([y[0], y[1] / k]); return [g[0], g[1] / k]; },
  H: y => { const H = fn.H([y[0], y[1] / k]); return [[H[0][0], H[0][1] / k], [H[1][0] / k, H[1][1] / k / k]]; },
  pstar: fn.pstar, xstar: [fn.xstar[0], fn.xstar[1] * k]});

// ---------- 演算法 ----------
const gdnDot = (a, b) => a[0] * b[0] + a[1] * b[1];
const gdnSolve = (H, g) => { const d = H[0][0] * H[1][1] - H[0][1] * H[1][0]; return [-(H[1][1] * g[0] - H[0][1] * g[1]) / d, -(H[0][0] * g[1] - H[1][0] * g[0]) / d]; };
// 回溯線搜尋（第 13 章）：t = 1 起；f(x + tΔx) > f(x) + α t ∇fᵀΔx 就 t := βt。回傳每次試的 t。
function gdnBacktrack(fn, x, dx, alpha, beta) {
  const f0 = fn.f(x), slope = gdnDot(fn.g(x), dx), trials = [];
  for (let t = 1; ; t *= beta) {
    const phi = fn.f([x[0] + t * dx[0], x[1] + t * dx[1]]), rhs = f0 + alpha * t * slope, ok = phi <= rhs;
    trials.push({t, phi, rhs, ok});
    if (ok || trials.length > 80) return {t, trials};
  }
}
// dir：'gd'（Δx = −∇f）或 'newton'（解 HΔx = −∇f）；ls：'bt' 回溯或 'exact'（只用於二次函數：t = −∇fᵀΔx / ΔxᵀHΔx）。
// 每個迭代點記錄 f、f − p*、‖∇f‖、λ² = −∇fᵀΔx_nt（牛頓遞減量平方）與所用的 t；先檢查停止再走下一步。
function gdnRun(fn, x0, {dir, ls = 'bt', alpha = 0.1, beta = 0.7, stop, max = 3000}) {
  let x = x0.slice(); const it = [];
  for (;;) {
    const g = fn.g(x), H = fn.H(x), f = fn.f(x), nt = gdnSolve(H, g);
    const rec = {x, f, gap: f - fn.pstar, gnorm: Math.hypot(g[0], g[1]), lam2: -gdnDot(g, nt)};
    it.push(rec);
    if (stop(rec) || it.length > max) return it;
    const dx = dir === 'newton' ? nt : [-g[0], -g[1]];
    if (ls === 'exact') { const Hd = [H[0][0] * dx[0] + H[0][1] * dx[1], H[1][0] * dx[0] + H[1][1] * dx[1]]; rec.t = -gdnDot(g, dx) / gdnDot(dx, Hd); }
    else { const b = gdnBacktrack(fn, x, dx, alpha, beta); rec.t = b.t; rec.tries = b.trials.length; }
    x = [x[0] + rec.t * dx[0], x[1] + rec.t * dx[1]];
  }
}
const gdnGradStop = eps => r => r.gnorm <= eps;
const gdnLamStop = eps => r => r.lam2 / 2 <= eps;
const gdnGapStop = eps => r => r.gap <= eps;
const gdnSteps = it => it.length - 1;

// ---------- 數字格式 ----------
const gdnSup = s => s.replace(/[-0-9]/g, c => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(c)]);
function gdnSci(v, d = 1) {
  if (v === 0) return '0';
  if (Math.abs(v) >= 0.01 && Math.abs(v) < 1000) return gdnFmt(v, Math.abs(v) < 0.1 ? 3 : 2);
  const e = Math.floor(Math.log10(Math.abs(v))), m = v / 10 ** e;
  return `${m.toFixed(d)}×10${gdnSup(String(e))}`.replace('-', '−');
}
const gdnFmt = (v, d = 2) => Number(v.toFixed(d)).toString().replace('-', '−');
const gdnPt = x => `(${gdnFmt(x[0])}, ${gdnFmt(x[1])})`;

// ---------- 等高線（marching squares） ----------
function gdnContours(f, win, levels, n = 90) {
  const [xa, xb, ya, yb] = win, h = Math.min(xb - xa, yb - ya) / n, nx = Math.ceil((xb - xa) / h), ny = Math.ceil((yb - ya) / h);
  const hx = (xb - xa) / nx, hy = (yb - ya) / ny, V = [];
  for (let j = 0; j <= ny; j++) { const row = []; for (let i = 0; i <= nx; i++) row.push(f([xa + i * hx, ya + j * hy])); V.push(row); }
  return levels.map(L => {
    const segs = [];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const c = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]], pts = [];
      for (let e = 0; e < 4; e++) {
        const [i0, j0] = c[e], [i1, j1] = c[(e + 1) % 4], v0 = V[j0][i0] - L, v1 = V[j1][i1] - L;
        if ((v0 < 0) !== (v1 < 0)) { const s = v0 / (v0 - v1); pts.push([xa + (i0 + s * (i1 - i0)) * hx, ya + (j0 + s * (j1 - j0)) * hy]); }
      }
      for (let p = 0; p + 1 < pts.length; p += 2) segs.push([pts[p], pts[p + 1]]);
    }
    return {level: L, segs};
  });
}

// ---------- 等比例等高線圖 ----------
// SVG 使用資料座標（x 右、y 上翻轉），外框 aspect-ratio = 視窗寬 / 高，所以 1 單位在兩軸等長。
const gdnR = v => Math.round(v * 1000) / 1000;
function gdnPlot({fn, win, levels, step = 1, paths = [], arrows = [], guides = [], maxH = 340, label, keys = ''}) {
  const [xa, xb, ya, yb] = win, W = xb - xa, H = yb - ya, X = x => gdnR(x - xa), Y = y => gdnR(yb - y);
  const P = p => `${X(p[0])} ${Y(p[1])}`;
  let grid = '';
  for (let v = Math.ceil(xa / step) * step; v <= xb + 1e-9; v += step) grid += `M${X(v)} 0V${gdnR(H)}`;
  for (let v = Math.ceil(ya / step) * step; v <= yb + 1e-9; v += step) grid += `M0 ${Y(v)}H${gdnR(W)}`;
  const cont = gdnContours(fn.f, win, levels).map(c => c.segs.map(([a, b]) => `M${P(a)}L${P(b)}`).join('')).join('');
  const starts = paths.filter(p => p.start !== false).map(p => `<path d="M${P(p.pts[0])}h0" class="gdn-start" vector-effect="non-scaling-stroke"/><path d="M${P(p.pts[0])}h0" class="gdn-start-in" vector-effect="non-scaling-stroke"/>`).join('');
  const lines = paths.map(p => `<polyline points="${p.pts.map(P).join(' ')}" class="gdn-path ${p.cls || ''}" vector-effect="non-scaling-stroke"/><path d="${p.pts.map(q => `M${P(q)}h0`).join('')}" class="gdn-dots ${p.cls || ''}" vector-effect="non-scaling-stroke"/>`).join('');
  const heads = arrows.map(({from, to, cls = ''}) => {
    const dx = to[0] - from[0], dy = to[1] - from[1], L = Math.hypot(dx, dy), s = W * 0.035, ux = dx / L, uy = dy / L;
    const b = [to[0] - ux * s, to[1] - uy * s], w = s * 0.45;
    return `<line x1="${X(from[0])}" y1="${Y(from[1])}" x2="${X(b[0])}" y2="${Y(b[1])}" class="gdn-arrow ${cls}" vector-effect="non-scaling-stroke"/><polygon points="${P(to)} ${P([b[0] - uy * w, b[1] + ux * w])} ${P([b[0] + uy * w, b[1] - ux * w])}" class="gdn-head ${cls}"/>`;
  }).join('');
  const guide = guides.map(({from, to}) => `<line x1="${X(from[0])}" y1="${Y(from[1])}" x2="${X(to[0])}" y2="${Y(to[1])}" class="gdn-guide" vector-effect="non-scaling-stroke"/>`).join('');
  const m = fn.xstar, cross = m[0] >= xa && m[0] <= xb && m[1] >= ya && m[1] <= yb ? `<path d="M${P(m)}h0" class="gdn-min" vector-effect="non-scaling-stroke"/>` : '';
  const tick = (v, axis) => axis === 'x' ? `<span class="gdn-tx${v === xb ? ' gdn-tx-end' : ''}" style="left:${(v - xa) / W * 100}%">${gdnFmt(v)}</span>` : `<span class="gdn-ty" style="top:${(yb - v) / H * 100}%">${gdnFmt(v)}</span>`;
  return `<figure class="gdn-plotfig"><div class="gdn-plotwrap" style="width:min(100%, ${Math.round(maxH * W / H)}px)"><div class="gdn-plot" role="img" aria-label="${label}" style="aspect-ratio:${gdnR(W)} / ${gdnR(H)}">
    <svg viewBox="0 0 ${gdnR(W)} ${gdnR(H)}" preserveAspectRatio="none" aria-hidden="true"><path d="${grid}" class="gdn-grid" vector-effect="non-scaling-stroke"/><path d="${cont}" class="gdn-cont" vector-effect="non-scaling-stroke"/>${guide}${lines}${heads}${cross}${starts}</svg>
    ${tick(xa, 'x')}${tick(xb, 'x')}${tick(ya, 'y')}${tick(yb, 'y')}<span class="gdn-ax gdn-ax1">x₁</span><span class="gdn-ax gdn-ax2">x₂</span></div></div>
    <p class="gdn-key"><span><i class="gdn-sw-cont"></i>等高線</span><span><i class="gdn-sw-min"></i>最小點</span><span><i class="gdn-sw-start"></i>起點</span>${keys}<span>格線間距 ${step}，兩軸等比例</span></p></figure>`;
}

// ---------- 半對數圖：f − p* 對迭代次數 ----------
function gdnSemilog(series, {lo = 1e-12, hi = 1e2, kmax, label}) {
  const L = v => Math.log10(Math.max(v, lo)), Y = v => gdnR((Math.log10(hi) - L(v)) / (Math.log10(hi) - Math.log10(lo)) * 60), K = k => gdnR(k / kmax * 100);
  let grid = '', ticks = '';
  const dec = Math.log10(hi) - Math.log10(lo), every = dec > 10 ? 4 : 2;
  for (let e = Math.log10(lo); e <= Math.log10(hi); e += every) { const y = Y(10 ** e); grid += `M0 ${y}H100`; ticks += `<span class="gdn-ly" style="top:${y / 60 * 100}%">10${gdnSup(String(e))}</span>`; }
  const body = series.map(s => `<polyline points="${s.vals.map((v, k) => `${K(k)},${Y(v)}`).join(' ')}" class="gdn-sl ${s.cls || ''}" vector-effect="non-scaling-stroke"/>${s.dots === false ? '' : `<path d="${s.vals.map((v, k) => `M${K(k)} ${Y(v)}h0`).join('')}" class="gdn-dots ${s.cls || ''}" vector-effect="non-scaling-stroke"/>`}`).join('');
  return `<div class="gdn-semi" role="img" aria-label="${label}"><div class="gdn-semibox"><svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true"><path d="${grid}" class="gdn-grid" vector-effect="non-scaling-stroke"/>${body}</svg>${ticks}<span class="gdn-lx" style="left:0">0</span><span class="gdn-lx" style="left:100%">${kmax}</span></div><p class="gdn-scale">縱軸 f − p*（對數刻度），橫軸迭代次數 k。</p></div>`;
}

// 表格：每個儲存格帶上欄名（data-h），窄版改成「欄名在上、數值在下」的兩欄排列。
function gdnLabelTable(html) {
  return html.replace(/<div class="gdn-table[^"]*" role="table"[^>]*>[\s\S]*?<\/div><\/div>(?=\s*<(?:p|\/section|figcaption))/g, t => {
    const heads = [...t.matchAll(/<span role="columnheader">(.*?)<\/span>/g)].map(m => m[1]);
    return t.replace(/<div role="row" class="gdn-tr(?! gdn-th)[^"]*">[\s\S]*?<\/div>/g, row => { let j = 0; return row.replace(/<span role="cell">/g, () => `<span role="cell" data-h="${heads[j++]}">`); });
  });
}
const gdnRange = (attr, label, min, max, step, value) => `<label class="gdn-control"><span data-label-for="${attr}">${label}</span><input type="range" data-${attr} min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
const gdnButtons = (attr, items, cur) => `<div class="gdn-buttons" data-${attr}-box>${items.map(([v, n]) => `<button type="button" data-${attr}="${v}" aria-pressed="${v === cur}">${n}</button>`).join('')}</div>`;

// ---------- 02 等高線與負梯度 ----------
const gdnX0 = [4, 1];
function gdnGradView(k) {
  const fn = gdnQuad(k), g = fn.g(gdnX0), L = Math.hypot(...g), s = 2.6 / L, to = [gdnX0[0] - g[0] * s, gdnX0[1] - g[1] * s];
  const ang = Math.acos(gdnDot([-g[0], -g[1]], [-gdnX0[0], -gdnX0[1]]) / L / Math.hypot(...gdnX0)) * 180 / Math.PI;
  const f0 = fn.f(gdnX0);
  return {ang, html: `<section><h3>κ = ${k}：${k === 1 ? '圓碗' : '橢圓碗'}</h3>${gdnPlot({fn, win: [-4.5, 4.5, -4.5, 4.5], levels: [0.06, 0.2, 0.45, 1, 1.7, 2.6].map(q => q * f0), guides: [{from: gdnX0, to: [0, 0]}], paths: [{pts: [gdnX0]}], arrows: [{from: gdnX0, to, cls: 'gdn-acc'}], maxH: 300,
    label: `f = ½(x₁² + ${k}x₂²) 的等高線；點 (4, 1) 的負梯度方向與指向最小點的方向夾 ${gdnFmt(ang, 1)} 度`})}<p class="gdn-verdict">負梯度與「指向最小點」夾 <b>${gdnFmt(ang, 1)}°</b></p></section>`};
}

// ---------- 03 回溯線搜尋 ----------
const gdnBtFn = gdnQuad(4), gdnBtDx = gdnBtFn.g(gdnX0).map(v => -v);
function gdnBtView(alpha, beta) {
  const {t, trials} = gdnBacktrack(gdnBtFn, gdnX0, gdnBtDx, alpha, beta);
  const f0 = gdnBtFn.f(gdnX0), slope = gdnDot(gdnBtFn.g(gdnX0), gdnBtDx), phi = s => gdnBtFn.f([gdnX0[0] + s * gdnBtDx[0], gdnX0[1] + s * gdnBtDx[1]]);
  const YM = 20, X = s => gdnR(s * 100), Y = v => gdnR((YM - v) / YM * 60);
  const curve = Array.from({length: 101}, (_, i) => `${X(i / 100)},${Y(phi(i / 100))}`).join(' ');
  let ok = '', run = null;
  for (let i = 0; i <= 200; i++) { const s = i / 200, good = phi(s) <= f0 + alpha * s * slope; if (good && run === null) run = s; if ((!good || i === 200) && run !== null) { ok += `<rect x="${X(run)}" y="0" width="${X((good ? s : s - 0.005) - run)}" height="60" class="gdn-okband"/>`; run = null; } }
  const marks = trials.map(r => `<line x1="${X(r.t)}" y1="0" x2="${X(r.t)}" y2="60" class="gdn-try${r.ok ? ' gdn-acc' : ''}" vector-effect="non-scaling-stroke"/><path d="M${X(r.t)} ${Y(Math.min(r.phi, YM))}h0" class="gdn-dots${r.ok ? ' gdn-acc' : ''}" vector-effect="non-scaling-stroke"/>`).join('');
  const rows = trials.map(r => `<li class="${r.ok ? 'gdn-good' : ''}"><b>t = ${gdnFmt(r.t, 3)}</b><span>f(x + tΔx) = ${gdnFmt(r.phi)}，門檻 ${gdnFmt(r.rhs)}</span><em>${r.ok ? '接受' : '太高，t := βt'}</em></li>`).join('');
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(s => `<span class="gdn-lx" style="left:${s * 100}%">${s}</span>`).join('') + [0, 10, 20].map(v => `<span class="gdn-ly" style="top:${(YM - v) / YM * 100}%">${v}</span>`).join('');
  return `<p class="gdn-verdict">試了 ${trials.length} 次，接受 <b>t = ${gdnFmt(t, 3)}</b>：f 從 ${gdnFmt(f0)} 降到 ${gdnFmt(phi(t))}。</p>
  <div class="gdn-bt"><div class="gdn-semi" role="img" aria-label="沿射線的 f(x + tΔx)、切線與 α 線；試過的 t：${trials.map(r => `${gdnFmt(r.t, 3)}${r.ok ? '接受' : '拒絕'}`).join('、')}"><div class="gdn-semibox"><svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">${ok}
    <line x1="0" y1="${Y(f0)}" x2="100" y2="${Y(f0 + slope)}" class="gdn-tan" vector-effect="non-scaling-stroke"/><line x1="0" y1="${Y(f0)}" x2="100" y2="${Y(f0 + alpha * slope)}" class="gdn-aline" vector-effect="non-scaling-stroke"/>
    <polyline points="${curve}" class="gdn-phi" vector-effect="non-scaling-stroke"/>${marks}</svg>${ticks}</div>
    <p class="gdn-key"><span><i class="gdn-sw-phi"></i>f(x + tΔx)</span><span><i class="gdn-sw-aline"></i>α 線 f(x) + αt∇fᵀΔx</span><span><i class="gdn-sw-tan"></i>切線（α = 1）</span><span><i class="gdn-sw-ok"></i>滿足充分下降</span></p>
    <p class="gdn-scale">橫軸 t（0 到 1），縱軸 f，0 到 ${YM}；曲線超出上緣處被截斷。</p></div>
  <ol class="gdn-trials">${rows}</ol></div>`;
}
function mountBacktrack(root, state) {
  state.alpha ??= 0.1; state.beta ??= 0.7;
  const a = root.querySelector('[data-alpha]'), b = root.querySelector('[data-beta]'), out = root.querySelector('[data-bt-output]');
  const render = () => {
    a.value = state.alpha; b.value = state.beta;
    const la = `α = ${gdnFmt(state.alpha)}`, lb = `β = ${gdnFmt(state.beta)}`;
    root.querySelector('[data-label-for="alpha"]').textContent = la; root.querySelector('[data-label-for="beta"]').textContent = lb;
    a.setAttribute('aria-valuetext', la); b.setAttribute('aria-valuetext', lb);
    out.innerHTML = gdnBtView(state.alpha, state.beta);
  };
  const input = () => { state.alpha = Number(a.value); state.beta = Number(b.value); render(); };
  a.addEventListener('input', input); b.addEventListener('input', input); render();
  return () => { a.removeEventListener('input', input); b.removeEventListener('input', input); };
}

// ---------- 04 條件數 ----------
const gdnKappas = [1, 2, 4, 8, 16, 32, 64], gdnEps = 1e-3;
const gdnKRun = k => gdnRun(gdnQuad(k), gdnX0, {dir: 'gd', stop: gdnGradStop(gdnEps)});
const gdnKRuns = Object.fromEntries(gdnKappas.map(k => [k, gdnKRun(k)]));
function gdnKappaWin(k) { const ext = Math.sqrt(2 * gdnQuad(k).f(gdnX0) / k), h = Math.min(4.5, Math.ceil(Math.max(1.2, ext * 1.1) * 2) / 2); return [-4.5, 4.5, -h, h]; }
function gdnKappaView(k) {
  const it = gdnKRuns[k], fn = gdnQuad(k), f0 = fn.f(gdnX0), n = gdnSteps(it), max = Math.max(...gdnKappas.map(q => gdnSteps(gdnKRuns[q])));
  const bars = gdnKappas.map(q => { const s = gdnSteps(gdnKRuns[q]); return `<div class="gdn-bar${q === k ? ' gdn-cur' : ''}"><span>κ = ${q}</span><span class="gdn-bartrack"><i style="width:${Math.max(s / max * 100, 0.6)}%"></i></span><b>${s}</b></div>`; }).join('');
  return `<p class="gdn-verdict">κ = ${k}：<b>${n} 步</b>${n <= 3 ? '就' : '才'}達到 ‖∇f‖ ≤ 10⁻³。${k === 1 ? '等高線是圓，負梯度直指中心。' : '路徑在谷兩側來回。'}</p>
  <div class="gdn-two"><section>${gdnPlot({fn, win: gdnKappaWin(k), levels: [2, 1, 0.5, 0.25, 0.12, 0.06, 0.03, 0.012].map(q => q * f0), paths: [{pts: it.map(r => r.x)}], maxH: 320,
    label: `κ = ${k} 的等高線與回溯梯度下降路徑，從 (4, 1) 出發，${n} 步`, keys: '<span><i class="gdn-sw-path"></i>梯度下降路徑</span>'})}</section>
  <section><h3>各 κ 的步數（同起點、同 α β）</h3><div class="gdn-bars">${bars}</div><p class="gdn-scale">長度按步數，滿格 ${max} 步。</p>
  <h3>收斂：半對數圖</h3>${gdnSemilog([{vals: it.map(r => r.gap), dots: n < 60}], {lo: 1e-8, hi: 1e2, kmax: Math.max(n, 1), label: `κ = ${k}：f − p* 從 ${gdnSci(it[0].gap)} 降到 ${gdnSci(it[n].gap)}`})}</section></div>`;
}
function mountKappa(root, state) {
  state.i ??= 3;
  const r = root.querySelector('[data-kappa]'), out = root.querySelector('[data-kappa-output]');
  const render = () => { r.value = state.i; const k = gdnKappas[state.i], t = `條件數 κ = ${k}`; root.querySelector('[data-label-for="kappa"]').textContent = t; r.setAttribute('aria-valuetext', t); out.innerHTML = gdnKappaView(k); };
  const input = () => { state.i = Number(r.value); render(); };
  r.addEventListener('input', input); render();
  return () => r.removeEventListener('input', input);
}

// ---------- 05 精確線搜尋與鋸齒（B&V §9.3.2 的二次例：γ = 10、起點 (γ, 1)） ----------
const gdnZk = 10, gdnZRun = gdnRun(gdnQuad(gdnZk), [gdnZk, 1], {dir: 'gd', ls: 'exact', stop: () => false, max: 7});
const gdnZAngles = gdnZRun.slice(0, 6).map((r, i) => { const a = gdnZRun[i + 1].x, b = gdnZRun[i + 2].x, u = [a[0] - r.x[0], a[1] - r.x[1]], v = [b[0] - a[0], b[1] - a[1]]; return Math.acos(gdnDot(u, v) / Math.hypot(...u) / Math.hypot(...v)) * 180 / Math.PI; });
const gdnZRatio = gdnZRun[1].f / gdnZRun[0].f;
const gdnZigzag = `<figure class="gdn-fig">${gdnPlot({fn: gdnQuad(gdnZk), win: [-11, 11, -3.8, 3.8], step: 2, levels: gdnZRun.slice(0, 7).map(r => r.f), paths: [{pts: gdnZRun.map(r => r.x)}], maxH: 300,
  label: `κ = 10、精確線搜尋、從 (10, 1) 出發的前 7 步；每個落點都畫出通過它的等高線，相鄰兩步夾 ${gdnFmt(gdnZAngles[0], 1)} 度`, keys: '<span><i class="gdn-sw-path"></i>精確線搜尋的梯度下降</span>'})}
  <dl class="gdn-params"><div><dt>相鄰兩步的夾角</dt><dd>${gdnZAngles.map(a => gdnFmt(a, 1) + '°').join('、')}</dd></div><div><dt>每步 f 變成原來的</dt><dd>${gdnFmt(gdnZRatio, 3)} 倍（閉式解 ((κ−1)/(κ+1))² = (9/11)² = ${gdnFmt((9 / 11) ** 2, 3)}）</dd></div></dl>
  <figcaption>f = ½(x₁² + 10x₂²)。這張圖的等高線刻意取成各迭代點的函數值，所以每個落點都在一條等高線上。視窗 x₁ −11 到 11、x₂ −3.8 到 3.8，等比例。</figcaption></figure>`;

// ---------- 06 停止準則 ----------
const gdnSRun = gdnKRuns[8], gdnSm = gdnQuad(8).m;
const gdnSRows = [...new Set([0, 5, 10, 20, 30, gdnSteps(gdnSRun) - 1, gdnSteps(gdnSRun)])].filter(k => k >= 0 && k < gdnSRun.length);
const gdnStop = gdnLabelTable(`<figure class="gdn-fig"><div class="gdn-two"><section>${gdnSemilog([{vals: gdnSRun.map(r => r.gnorm ** 2 / (2 * gdnSm)), cls: 'gdn-bound', dots: false}, {vals: gdnSRun.map(r => r.gap)}], {lo: 1e-10, hi: 1e3, kmax: gdnSteps(gdnSRun), label: '上界 ‖∇f‖²/(2m) 與實際 f − p* 對迭代次數；上界全程在實際值上方'})}
  <p class="gdn-key"><span><i class="gdn-sw-bound"></i>上界 ‖∇f‖²/(2m)</span><span><i class="gdn-sw-path"></i>實際 f − p*</span></p></section>
  <section><div class="gdn-table" role="table" aria-label="停止準則表"><div role="row" class="gdn-tr gdn-th"><span role="columnheader">k</span><span role="columnheader">‖∇f‖</span><span role="columnheader">上界</span><span role="columnheader">實際 f − p*</span></div>
  ${gdnSRows.map(k => { const r = gdnSRun[k], last = k === gdnSteps(gdnSRun); return `<div role="row" class="gdn-tr${last ? ' gdn-cur' : ''}"><span role="cell">${k}</span><span role="cell">${gdnSci(r.gnorm)}</span><span role="cell">${gdnSci(r.gnorm ** 2 / (2 * gdnSm))}</span><span role="cell">${gdnSci(r.gap)}</span></div>`; }).join('')}</div>
  <p class="gdn-scale">末列：‖∇f‖ ≤ 10⁻³，停止。</p></section></div>
  <figcaption>第 04 頁 κ = 8 的同一次執行（回溯，α = 0.1、β = 0.7）。f = ½(x₁² + 8x₂²) 的 Hessian 特徵值是 1 與 8，所以 m = 1。</figcaption></figure>`);

// ---------- 07 牛頓步（二次函數） ----------
const gdnNq = gdnQuad(8), gdnNqG = gdnNq.g(gdnX0), gdnNqStep = gdnSolve(gdnNq.H(), gdnNqG), gdnNqRun = gdnRun(gdnNq, gdnX0, {dir: 'newton', stop: gdnLamStop(1e-10)});
const gdnNqLen = Math.hypot(...gdnNqStep), gdnNqGd = gdnNqG.map(v => -v / Math.hypot(...gdnNqG) * gdnNqLen);
const gdnNewtonQuad = `<figure class="gdn-fig"><div class="gdn-two"><section>${gdnPlot({fn: gdnNq, win: [-4.5, 4.5, -3, 3], paths: [{pts: [gdnX0]}], levels: [2, 1, 0.5, 0.25, 0.1, 0.03].map(q => q * gdnNq.f(gdnX0)).concat(gdnNq.f(gdnX0)),
  arrows: [{from: gdnX0, to: [gdnX0[0] + gdnNqGd[0], gdnX0[1] + gdnNqGd[1]], cls: 'gdn-muted'}, {from: gdnX0, to: gdnNqRun[1].x, cls: 'gdn-acc'}], maxH: 260,
  label: 'κ = 8 的等高線上，從 (4, 1) 出發：負梯度方向偏離最小點；牛頓步直接落在最小點', keys: '<span><i class="gdn-sw-acc"></i>牛頓步（t = 1）</span><span><i class="gdn-sw-muted"></i>負梯度方向（長度取成相同）</span>'})}</section>
  <section>${`<dl class="gdn-params"><div><dt>梯度 g</dt><dd>(${gdnNqG.join(', ')})</dd></div><div><dt>Hessian H</dt><dd>diag(1, 8)</dd></div><div><dt>解 HΔx = −g</dt><dd>Δx = ${gdnPt(gdnNqStep)}</dd></div><div><dt>x + Δx</dt><dd>${gdnPt(gdnNqRun[1].x)}，就是最小點</dd></div><div><dt>λ²/2</dt><dd>${gdnFmt(gdnNqRun[0].lam2 / 2)}，等於 f(x) − p* = ${gdnFmt(gdnNqRun[0].gap)}</dd></div></dl>`}</section></div>
  <figcaption>牛頓步把 x₂ 方向的梯度除以該方向的曲率 8，x₁ 方向除以 1；兩個方向的「太陡」「太緩」就被抵銷。λ² = −∇fᵀΔx 是牛頓遞減量的平方（教學補充：B&V §9.5.1）；二次函數的二次模型就是自己，所以 λ²/2 恰等於 f − p*。</figcaption></figure>`;

// ---------- 08 非二次函數：阻尼與二次收斂 ----------
const gdnLseWin = [-3.2, 3.2, -1.7, 1.7], gdnLseLevels = [0.03, 0.12, 0.3, 0.6, 1, 1.6, 2.4, 3.4, 4.6].map(q => gdnLse.pstar + q);
const gdnStarts = {A: [-1, 1], B: [2, -1], C: [-2.5, 0.5]};
const gdnPRuns = Object.fromEntries(Object.entries(gdnStarts).map(([k, x]) => [k, gdnRun(gdnLse, x, {dir: 'newton', stop: gdnLamStop(1e-10)})]));
function gdnPhaseView(key) {
  const it = gdnPRuns[key], n = gdnSteps(it), damped = it.filter(r => r.t !== undefined && r.t < 1).length;
  const rows = it.map((r, k) => `<div role="row" class="gdn-tr${r.t !== undefined && r.t < 1 ? ' gdn-damp' : ''}"><span role="cell">${k}</span><span role="cell">${r.t === undefined ? '停止' : gdnFmt(r.t, 3)}</span><span role="cell">${gdnSci(r.gap)}</span><span role="cell">${gdnSci(r.lam2 / 2)}</span><span role="cell">${r.gap > 0 ? gdnFmt(-Math.log10(r.gap), 1) : '—'}</span></div>`).join('');
  return gdnLabelTable(`<p class="gdn-verdict">起點 ${gdnPt(gdnStarts[key])}：共 ${n} 步；前 <b>${damped} 步 t &lt; 1</b>（阻尼），之後每步 t = 1。</p>
  <div class="gdn-two"><section>${gdnPlot({fn: gdnLse, win: gdnLseWin, step: 1, levels: gdnLseLevels, paths: [{pts: it.map(r => r.x), cls: 'gdn-acc'}], maxH: 300,
    label: `log-sum-exp 函數的等高線與牛頓法路徑，從 ${gdnPt(gdnStarts[key])} 出發，${n} 步`, keys: '<span><i class="gdn-sw-acc"></i>牛頓法路徑</span>'})}
    ${gdnSemilog([{vals: it.map(r => r.gap), cls: 'gdn-acc'}], {lo: 1e-16, hi: 1e1, kmax: n, label: `f − p* 從 ${gdnSci(it[0].gap)} 降到 ${gdnSci(it[n].gap)}`})}</section>
  <section><div class="gdn-table gdn-table5" role="table" aria-label="牛頓法每步數值"><div role="row" class="gdn-tr gdn-th"><span role="columnheader">k</span><span role="columnheader">t</span><span role="columnheader">f − p*</span><span role="columnheader">λ²/2</span><span role="columnheader">−log₁₀(f−p*)</span></div>${rows}</div>
  <p class="gdn-scale">淺底列是阻尼步。最後一欄約是「正確的小數位數」；t = 1 之後大約每步翻倍。</p></section></div>`);
}
function mountPhases(root, state) {
  state.s ??= 'B';
  const box = root.querySelector('[data-start-box]'), out = root.querySelector('[data-phase-output]');
  const render = () => { box.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.start === state.s))); out.innerHTML = gdnPhaseView(state.s); };
  const click = e => { const s = e.target.closest?.('[data-start]')?.dataset.start ?? e.target.dataset?.start; if (s && gdnStarts[s]) { state.s = s; render(); } };
  box.addEventListener('click', click); render();
  return () => box.removeEventListener('click', click);
}
const gdnStartButtons = cur => gdnButtons('start', Object.entries(gdnStarts).map(([k, x]) => [k, `起點 ${k} ${gdnPt(x)}`]), cur);

// ---------- 10 仿射不變：y₂ = k·x₂ ----------
const gdnScales = [[1 / 3, '⅓'], [0.5, '½'], [1, '1'], [2, '2'], [3, '3']], gdnAx0 = [-1, 1], gdnGapEps = 1e-6;
const gdnARuns = gdnScales.map(([k]) => { const fn = gdnScaled(gdnLse, k), y0 = [gdnAx0[0], gdnAx0[1] * k];
  return {k, fn, gd: gdnRun(fn, y0, {dir: 'gd', stop: gdnGapStop(gdnGapEps)}), nt: gdnRun(fn, y0, {dir: 'newton', stop: gdnGapStop(gdnGapEps)})}; });
const gdnCond = H => { const tr = H[0][0] + H[1][1], d = Math.sqrt((H[0][0] - H[1][1]) ** 2 + 4 * H[0][1] * H[1][0]); return (tr + d) / (tr - d); };
const gdnBack = (pts, k) => pts.map(r => [r.x[0], r.x[1] / k]);
const gdnARef = gdnBack(gdnARuns[2].nt, 1);
const gdnANewtonDiff = Math.max(...gdnARuns.flatMap(a => gdnBack(a.nt, a.k).map((p, i) => Math.hypot(p[0] - gdnARef[i][0], p[1] - gdnARef[i][1]))));
const gdnABox = (() => { const pts = gdnARuns.flatMap(a => [...gdnBack(a.gd, a.k), ...gdnBack(a.nt, a.k)]); const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const lo = v => Math.floor((v - 0.15) * 4) / 4, hi = v => Math.ceil((v + 0.15) * 4) / 4; return [lo(Math.min(...xs)), hi(Math.max(...xs)), lo(Math.min(...ys)), hi(Math.max(...ys))]; })();
function gdnAffineView(i) {
  const a = gdnARuns[i], [xa, xb, ya, yb] = gdnABox, win = [xa, xb, ya * a.k, yb * a.k];
  const rows = gdnARuns.map((r, j) => `<div role="row" class="gdn-tr${j === i ? ' gdn-cur' : ''}"><span role="cell">k = ${gdnScales[j][1]}</span><span role="cell">${gdnFmt(gdnCond(r.fn.H(r.fn.xstar)), 1)}</span><span role="cell">${gdnSteps(r.gd)}</span><span role="cell">${gdnSteps(r.nt)}</span></div>`).join('');
  return gdnLabelTable(`<p class="gdn-verdict">k = ${gdnScales[i][1]}：梯度下降 <b>${gdnSteps(a.gd)} 步</b>，牛頓法 <b>${gdnSteps(a.nt)} 步</b>。</p>
  <div class="gdn-two"><section>${gdnPlot({fn: a.fn, win, step: a.k >= 2 ? 1 : 0.5, levels: gdnLseLevels, paths: [{pts: a.gd.map(r => r.x)}, {pts: a.nt.map(r => r.x), cls: 'gdn-acc'}], maxH: 300,
    label: `在 y 座標（y₂ = ${gdnFmt(a.k)}·x₂）執行：梯度下降 ${gdnSteps(a.gd)} 步、牛頓法 ${gdnSteps(a.nt)} 步`, keys: '<span><i class="gdn-sw-path"></i>梯度下降</span><span><i class="gdn-sw-acc"></i>牛頓法</span>'}).replace('>x₁<', '>y₁<').replace('>x₂<', '>y₂<')}</section>
  <section><h3>同一個起點、五種座標</h3><div class="gdn-table gdn-table4" role="table" aria-label="各伸縮倍數下谷底條件數與兩種方法的步數"><div role="row" class="gdn-tr gdn-th"><span role="columnheader">y₂ = k·x₂</span><span role="columnheader">谷底 κ</span><span role="columnheader">梯度下降</span><span role="columnheader">牛頓法</span></div>${rows}</div>
  <p class="gdn-scale">谷底 κ：y 座標裡最小點處 Hessian 的條件數。把牛頓法在五種座標的迭代點換回 x，彼此最大差 ${gdnSci(gdnANewtonDiff)}（浮點誤差）。梯度下降換回 x 後路徑各不相同。</p></section></div>`);
}
function mountAffine(root, state) {
  state.i ??= 2;
  const r = root.querySelector('[data-scale]'), out = root.querySelector('[data-affine-output]');
  const render = () => { r.value = state.i; const t = `縱向伸縮 y₂ = ${gdnScales[state.i][1]}·x₂`; root.querySelector('[data-label-for="scale"]').textContent = t; r.setAttribute('aria-valuetext', t); out.innerHTML = gdnAffineView(state.i); };
  const input = () => { state.i = Number(r.value); render(); };
  r.addEventListener('input', input); render();
  return () => r.removeEventListener('input', input);
}

// ---------- 預測題的答案（由同一組程式算出，只放進回饋） ----------
const gdnQ1 = gdnARuns[0], gdnQ1Base = gdnARuns[2];
const gdnAxisK = 100, gdnAxisX0 = [4, 0];
const gdnQ2 = {gd: gdnSteps(gdnRun(gdnQuad(gdnAxisK), gdnAxisX0, {dir: 'gd', stop: gdnGradStop(gdnEps)})), nt: gdnSteps(gdnRun(gdnQuad(gdnAxisK), gdnAxisX0, {dir: 'newton', stop: gdnGradStop(gdnEps)}))};

const gdnParam = rows => `<dl class="gdn-params">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
const gdnCh13 = '../../13-numerical-linear-algebra-and-unconstrained-minimization.html', gdnCh14 = '../../14-newtons-method.html';

const gdnLoop = `<figure class="gdn-fig"><ol class="gdn-loop">
  <li><b>1 選方向 Δx</b>要求 ∇f(x)ᵀΔx &lt; 0（下降方向）</li>
  <li><b>2 選步長 t</b>線搜尋：精確，或回溯</li>
  <li><b>3 更新</b>x := x + tΔx</li>
  <li><b>4 停止？</b>‖∇f(x)‖₂ ≤ ε 就停；否則回到 1</li></ol>
  <div class="gdn-compare"><section><h3>梯度下降</h3><p class="gdn-eq">Δx = −∇f(x)</p><p class="gdn-note">只用一階資訊。</p></section><section><h3>牛頓法</h3><p class="gdn-eq">∇²f(x) Δx = −∇f(x)</p><p class="gdn-note">多用 Hessian（曲率），每步要解一個線性方程組。</p></section></div>
  <figcaption>兩者走同一個迴圈，只換第 1 步。後面每張路徑圖都是這個迴圈真正跑出來的迭代點。</figcaption></figure>`;

const gdnCost = gdnLabelTable(`<figure class="gdn-fig"><div class="gdn-table gdn-table3" role="table" aria-label="每步成本對照"><div role="row" class="gdn-tr gdn-th"><span role="columnheader">每一步要做的事</span><span role="columnheader">梯度下降</span><span role="columnheader">牛頓法</span></div>
  <div role="row" class="gdn-tr"><span role="cell">算梯度 ∇f</span><span role="cell">要</span><span role="cell">要</span></div>
  <div role="row" class="gdn-tr"><span role="cell">算 Hessian 並解 HΔx = −g</span><span role="cell">不用</span><span role="cell">要：稠密時 O(n³)</span></div>
  <div role="row" class="gdn-tr"><span role="cell">Hessian 帶狀或對角加稀疏</span><span role="cell">—</span><span role="cell">可降到 O(n)</span></div></div>
  <figcaption>本篇 n = 2，解 2×2 方程組幾乎免費，看不到這筆成本。第 14 章：變數間只有局部交互作用時，Hessian 常是帶狀或稀疏，求解牛頓步可到線性時間；完全無結構的稠密 Hessian 才是硬傷。</figcaption></figure>`);

const story = {
  title: '梯度下降與牛頓法的路徑', label: 'EE364a / 13–14 無約束最小化與牛頓法',
  back: {href: gdnCh13, label: '返回第 13 講'},
  pages: [
    {id: 'loop', section: '01 / 迴圈', title: '下降法只回答三件事：往哪走、走多遠、何時停',
      lead: '要最小化平滑凸函數 f，除非有解析解，就從一點出發反覆 x := x + tΔx。梯度下降與牛頓法的差別只在方向 Δx。',
      art: gdnLoop,
      point: '方向決定路徑的形狀，線搜尋決定每步的長度，停止準則決定何時收工。'},
    {id: 'contour', section: '02 / 等高線', title: '負梯度垂直等高線，不一定指向谷底',
      lead: '同一點 (4, 1)，兩個碗：f = ½(x₁² + κx₂²)，κ = 1 與 κ = 8。箭頭是負梯度方向，虛線指向最小點。',
      art: `<figure class="gdn-fig"><div class="gdn-compare gdn-compare-plots">${gdnGradView(1).html}${gdnGradView(8).html}</div><figcaption>兩張圖視窗都是 −4.5 到 4.5、等比例；箭頭只表示方向，長度固定。κ 是 Hessian 最大與最小特徵值的比，也就是等高線長短軸比的平方。</figcaption></figure>`,
      point: '負梯度垂直於通過該點的等高線。圓形等高線上它指向中心；狹長等高線上它偏向陡的方向，偏離最小點。'},
    {id: 'backtrack', section: '03 / 操作', title: '回溯線搜尋：從 t = 1 試起，降得不夠就乘 β',
      lead: '方向定了，沿射線看 f(x + tΔx)。接受 t 的條件是低於 α 線：f(x + tΔx) ≤ f(x) + αt∇fᵀΔx。拉 α、β，看試了哪些 t。',
      art: `<div class="gdn-live"><div class="gdn-controls">${gdnRange('alpha', 'α = 0.1', 0.05, 0.45, 0.05, 0.1)}${gdnRange('beta', 'β = 0.7', 0.2, 0.9, 0.1, 0.7)}</div><div data-bt-output></div></div>`,
      previewArt: `<div class="gdn-live">${gdnBtView(0.1, 0.7)}</div>`,
      mount: mountBacktrack,
      point: 'α 線比切線平緩，所以夠小的 t 一定會被接受；α 越大要求越嚴、β 越小每次縮得越狠。',
      detail: '例子：f = ½(x₁² + 4x₂²)，x = (4, 1)，Δx = −∇f = (−4, −4)。第 13 章給的範圍是 α ∈ (0, 0.5)、β ∈ (0, 1)；後面各頁都用 α = 0.1、β = 0.7（與 B&V 第 9 章範例相同）。'},
    {id: 'kappa', section: '04 / 操作', title: 'κ 變大，等高線變扁，梯度下降的步數變多',
      lead: '同一個起點 (4, 1)、同一組回溯參數，只改條件數 κ。停止準則是第 13 章的 ‖∇f‖₂ ≤ ε，ε = 10⁻³。',
      art: `<div class="gdn-live"><div class="gdn-controls gdn-controls1">${gdnRange('kappa', '條件數 κ = 8', 0, gdnKappas.length - 1, 1, 3)}</div><div data-kappa-output></div></div>`,
      previewArt: `<div class="gdn-live">${gdnKappaView(8)}</div>`,
      mount: mountKappa,
      point: 'κ = 1 一步到底；κ 越大，路徑越常在狹谷兩壁之間來回，步數跟著增加。半對數圖近似直線，就是線性收斂。',
      detail: '步數比較只在同一起點、同一組 α、β 下成立；換起點，步數會變。滑桿是 κ = 1, 2, 4, …, 64。'},
    {id: 'zigzag', section: '05 / 鋸齒', title: '精確線搜尋停在與等高線相切處，所以下一步轉 90°',
      lead: '沿射線走到 f 最小的地方時，射線剛好與那裡的等高線相切；下一步的負梯度垂直於那條等高線，也就垂直於上一步。',
      art: gdnZigzag,
      point: '在狹長的碗裡，互相垂直的短步只能慢慢鋸進谷底。',
      detail: '教學補充：相鄰兩步垂直來自精確線搜尋的最佳性 d/dt f(x + tΔx) = ∇f(x⁺)ᵀΔx = 0。這個例子與閉式解取自 B&V §9.3.2（p. 469–470）；第 13 章只說「圓形等高線加精確線搜尋一步到底」。'},
    {id: 'stop', section: '06 / 停止', title: '梯度小，為什麼就代表離最佳值近？',
      lead: '最佳值 p* 通常不知道，只能看梯度。若 f 強凸（∇²f ⪰ mI），就有 f(x) − p* ≤ ‖∇f(x)‖²/(2m)。',
      art: gdnStop,
      point: '上界全程在實際誤差上方：‖∇f‖ ≤ 10⁻³ 時，保證 f − p* ≤ 5×10⁻⁷。',
      detail: '這個保證需要知道 m；m 太小時上界就很寬鬆。'},
    {id: 'newton-quad', section: '07 / 牛頓步', title: '牛頓步用曲率修正方向，二次函數一步到底',
      lead: '牛頓步是局部二次模型的最小點：解 ∇²f(x) Δx = −∇f(x)。對二次函數，二次模型就是 f 本身。',
      art: gdnNewtonQuad,
      point: '牛頓步也是「用 Hessian 量距離」時的最速下降方向；度量和等高線形狀對齊，就不再偏向陡的方向。',
      detail: '第 14 章列了牛頓步的三種詮釋：二次近似的極小值、最佳性條件 ∇f = 0 的線性化、Hessian 度量下的最速下降。'},
    {id: 'phases', section: '08 / 操作', title: '非二次函數：先阻尼幾步，靠近後有效位數約每步翻倍',
      lead: '換成非二次函數，二次模型只在附近準。離得遠時整步會走過頭，回溯把 t 縮小；靠近後 t = 1 被接受。選一個起點。',
      art: `<div class="gdn-live">${gdnStartButtons('B')}<div data-phase-output></div></div>`,
      previewArt: `<div class="gdn-live">${gdnPhaseView('B')}</div>`,
      mount: mountPhases,
      point: '兩個階段都看得到：阻尼步（t < 1）穩定地降 f；全步階段 f − p* 大約每步平方一次，半對數圖向下彎。',
      detail: 'f(x) = log(exp(x₁ + 3x₂ − 0.1) + exp(x₁ − 3x₂ − 0.1) + exp(−x₁ − 0.1))：B&V (9.20) 的三項取 log，最小點與等高線形狀相同。取 log 是教學選擇：(9.20) 本身在這組 α、β 下從我們試過的所有起點都直接 t = 1，看不到阻尼階段。停止準則 λ²/2 ≤ 10⁻¹⁰（B&V Algorithm 9.5）。'},
    {id: 'predict-scale', section: '09 / 預測', title: '把縱軸壓成三分之一，兩種方法的步數會怎樣？',
      lead: '同一個函數、同一個起點 (−1, 1)。現在換變數 y₂ = x₂ / 3，在 y 座標裡從頭執行兩種方法；等高線在 y 座標裡被壓扁了。',
      art: `<figure class="gdn-fig">${gdnParam([['函數', '第 08 頁的 log-sum-exp'], ['換座標', 'y₁ = x₁，y₂ = x₂ / 3'], ['起點', 'x = (−1, 1)，即 y = (−1, ⅓)'], ['兩種方法', '回溯 α = 0.1、β = 0.7'], ['停止', 'f − p* ≤ 10⁻⁶（與座標無關）']])}<figcaption>下一頁可以自己拉伸縮倍數驗證。</figcaption></figure>`,
      point: '先想：兩種方法的搜尋方向各自由哪些量算出來？換座標時這些量怎麼變？',
      question: {prompt: '和原座標（k = 1）比，步數會怎樣？', hideFuturePreviews: true, choices: [
        {value: 'gd-only', label: '梯度下降改變，牛頓法不變', feedback: `對。y 座標裡的梯度是 T∇f，換回 x 等於用 TTᵀ∇f 當方向，所以路徑跟著變：梯度下降 ${gdnSteps(gdnQ1Base.gd)} → ${gdnSteps(gdnQ1.gd)} 步。牛頓步在 y 座標解出的 Δy 換回 x 恰是原本的牛頓步，回溯條件的數值也相同，所以迭代點一一對應：${gdnSteps(gdnQ1Base.nt)} → ${gdnSteps(gdnQ1.nt)} 步。`},
        {value: 'both', label: '兩者都改變', feedback: `牛頓法不變：${gdnSteps(gdnQ1Base.nt)} → ${gdnSteps(gdnQ1.nt)} 步。它解 HΔx = −g，換座標時 H 與 g 一起變換，解出來的 Δy 換回 x 就是原本的 Δx。會變的只有梯度下降（${gdnSteps(gdnQ1Base.gd)} → ${gdnSteps(gdnQ1.gd)} 步）。`},
        {value: 'neither', label: '兩者都不變，因為函數沒變', feedback: `函數值沒變，但梯度下降的方向依賴座標：y 座標的負梯度換回 x 是 −TTᵀ∇f，不是 −∇f。所以梯度下降 ${gdnSteps(gdnQ1Base.gd)} → ${gdnSteps(gdnQ1.gd)} 步；只有牛頓法維持 ${gdnSteps(gdnQ1.nt)} 步。`}]}},
    {id: 'affine', section: '10 / 操作', title: '換座標，牛頓法的路徑不變，梯度下降的會變',
      lead: '令 y₂ = k·x₂，在 y 座標裡執行兩種方法；圖畫在 y 座標（等比例），所以等高線跟著被拉長或壓扁。',
      art: `<div class="gdn-live"><div class="gdn-controls gdn-controls1">${gdnRange('scale', '縱向伸縮 y₂ = 1·x₂', 0, gdnScales.length - 1, 1, 2)}</div><div data-affine-output></div></div>`,
      previewArt: `<div class="gdn-live">${gdnAffineView(2)}</div>`,
      mount: mountAffine,
      point: `牛頓法仿射不變：步數與換回原座標的迭代點都不隨 k 改變。梯度下降的步數跟著等高線形狀變（本例 ${Math.min(...gdnARuns.map(a => gdnSteps(a.gd)))} 到 ${Math.max(...gdnARuns.map(a => gdnSteps(a.gd)))} 步），谷底 κ 接近 1 時最快、最大時最慢。`,
      detail: '為了只比較路徑，這頁兩法都用 f − p* ≤ 10⁻⁶ 停止（p* 已先算出；實務上未知）。第 14 章的停止量 λ² 本身也是仿射不變的，‖∇f‖ 則不是。'},
    {id: 'cost', section: '11 / 代價', title: '牛頓法步數少，但每一步要解一個線性方程組',
      lead: '比較步數之前要記得每步的工作量不同。牛頓步的成本取決於 Hessian 的結構。',
      art: gdnCost,
      point: '步數少不等於一定更快；能否便宜地解 HΔx = −g，取決於能不能利用 Hessian 的結構。',
      detail: '本篇不比較實際執行時間。'},
    {id: 'predict-axis', section: '12 / 預測', title: '很扁的碗、起點在長軸上：各要幾步？',
      lead: '新情境：條件數 κ = 100，比第 04 頁的任何設定都扁。但起點剛好落在長軸上。',
      art: `<figure class="gdn-fig">${gdnParam([['函數', 'f = ½(x₁² + 100x₂²)'], ['起點', '(4, 0)'], ['梯度下降', '回溯 α = 0.1、β = 0.7'], ['牛頓法', '同樣的回溯'], ['停止', '‖∇f‖₂ ≤ 10⁻³（和第 04 頁相同）']])}<figcaption>先在腦中畫出這一點的等高線與負梯度方向，再判斷 t = 1 會不會被接受。</figcaption></figure>`,
      point: '先想：從 (4, 0) 出發，負梯度指向哪裡？t = 1 會落在哪？',
      question: {prompt: '兩種方法各需要幾步？', hideFuturePreviews: true, choices: [
        {value: 'gd-many', label: '梯度下降比第 04 頁 κ = 64 還多步，牛頓法 1 步', feedback: `這裡沒有鋸齒。起點 (4, 0) 的梯度是 (4, 0)，負梯度正好指向最小點（夾角 0°）。t = 1 走到 (0, 0)，f 從 8 降到 0，低於 α 線 8 − 0.1·16 = 6.4，直接接受。程式實跑：梯度下降 ${gdnQ2.gd} 步、牛頓法 ${gdnQ2.nt} 步。`},
        {value: 'both-one', label: '兩者都 1 步', feedback: `對。在軸上，等高線的法線方向通過中心，負梯度直指最小點；t = 1 走到 (0, 0)，f 從 8 降到 0 ≤ 6.4（α 線），被接受。牛頓法在二次函數上本來就一步。程式實跑：梯度下降 ${gdnQ2.gd} 步、牛頓法 ${gdnQ2.nt} 步。κ 大只在負梯度偏離最小點時才造成鋸齒。`},
        {value: 'newton-more', label: '梯度下降 1 步，牛頓法要好幾步', feedback: `牛頓法在二次函數上 t = 1 一步就落在最小點（第 07 頁）。這題梯度下降也剛好 1 步，因為負梯度直指最小點。程式實跑：梯度下降 ${gdnQ2.gd} 步、牛頓法 ${gdnQ2.nt} 步。`}]},
      detail: `<a href="${gdnCh13}">第 13 講：無約束最小化</a> · <a href="${gdnCh14}">第 14 講：牛頓法</a> · 教學補充來源：Boyd & Vandenberghe, Convex Optimization, 第 9 章。`},
  ],
};
