// 所有數字都是教學假設，不是大立光的良率、成本或公差。
// 光學只用幾何離焦：物在無窮遠、小離焦時模糊圈直徑 c = |Δz| / N；不含繞射與鏡頭像差，不是 MTF。
const asyN = 2, asySpec = 2, asyZMax = 12, asyPx = 8; // f/2、規格 c ≤ 2 µm、側視圖 ±12 µm、模糊圈 1 µm = 8 px
const asyFields = [[-1, '左緣'], [-0.5, '左半'], [0, '中心'], [0.5, '右半'], [1, '右緣']];
const asyFmt = n => Number(n.toFixed(2)).toString().replace('-', '−');
// dz：整體焦點偏移；edge：右緣比中心多出的焦點偏移（左緣相反），單位 µm。
const asyBlur = (dz, edge, x) => Math.abs(dz + x * edge) / asyN;

function asyFocusView(dz, edge) {
  const X = x => 50 + x * 40, Y = z => 50 - z / asyZMax * 45;
  const zAt = x => Math.max(-asyZMax, Math.min(asyZMax, dz + x * edge));
  const drops = asyFields.map(([x]) => {
    const bad = asyBlur(dz, edge, x) > asySpec;
    return `<line x1="${X(x)}" y1="50" x2="${X(x)}" y2="${Y(zAt(x))}" class="asy-gap${bad ? ' asy-bad' : ''}" vector-effect="non-scaling-stroke"/>`;
  }).join('');
  const cells = asyFields.map(([x, name]) => {
    const c = asyBlur(dz, edge, x), bad = c > asySpec;
    return `<div class="asy-field${bad ? ' asy-bad' : ''}"><span class="asy-ring" style="--d:${asySpec * asyPx}px"><i style="--d:${Math.max(c * asyPx, 3)}px"></i></span><b>${name}</b><span>${asyFmt(c)} µm</span><em>${bad ? '超出規格' : '通過'}</em></div>`;
  }).join('');
  const label = asyFields.map(([x, n]) => `${n} ${asyFmt(asyBlur(dz, edge, x))} µm`).join('，');
  return `<figure class="asy-focus" role="img" aria-label="整體焦點偏移 ${asyFmt(dz)} µm、邊緣焦點差 ${asyFmt(edge)} µm；各場點模糊圈直徑：${label}；規格 ${asySpec} µm">
    <div class="asy-plot"><span class="asy-tick asy-top">+${asyZMax} µm</span><span class="asy-tick asy-mid">0</span><span class="asy-tick asy-bot">−${asyZMax} µm</span>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="50" x2="100" y2="50" class="asy-sensor" vector-effect="non-scaling-stroke"/>${drops}<line x1="0" y1="${Y(dz - 1.25 * edge)}" x2="100" y2="${Y(dz + 1.25 * edge)}" class="asy-best" vector-effect="non-scaling-stroke"/></svg></div>
    <p class="asy-key"><span><i class="asy-sw-sensor"></i>感測面</span><span><i class="asy-sw-best"></i>最佳焦點面</span><span>直線長 = 各場點離焦量</span></p>
    <div class="asy-fields">${cells}</div>
    <figcaption>上：側視，縱向放大（±${asyZMax} µm 畫滿高度），橫向是像高 ±3 mm。下：模糊圈直徑按同一比例畫（1 µm = ${asyPx} px），虛線圈是規格 ${asySpec} µm。只含幾何離焦 c = |Δz| / N（N = ${asyN}），不含繞射與鏡頭像差，不是 MTF。</figcaption></figure>`;
}
const asyPresets = {spacing: [5, 0, '只有間距誤差'], tilt: [0, 5, '只有像面傾斜'], zero: [0, 0, '歸零']};
function mountFocus(root, state) {
  state.dz ??= 5; state.edge ??= 0;
  const dz = root.querySelector('[data-dz]'), edge = root.querySelector('[data-edge]'), out = root.querySelector('[data-focus-output]'), btns = root.querySelector('[data-presets]');
  const render = () => {
    dz.value = state.dz; edge.value = state.edge;
    root.querySelector('[data-dz-label]').textContent = `整體焦點偏移 Δz = ${asyFmt(state.dz)} µm`;
    root.querySelector('[data-edge-label]').textContent = `邊緣焦點差 e = ${asyFmt(state.edge)} µm`;
    dz.setAttribute('aria-valuetext', `${asyFmt(state.dz)} 微米`); edge.setAttribute('aria-valuetext', `${asyFmt(state.edge)} 微米`);
    const fails = asyFields.filter(([x]) => asyBlur(state.dz, state.edge, x) > asySpec).map(([, n]) => n);
    const shape = state.edge === 0 ? (state.dz === 0 ? '全場對焦。' : '左右完全對稱：全場一起變差，中心也不例外。') : '左右不對稱：一側離焦變大，另一側變小。';
    out.innerHTML = asyFocusView(state.dz, state.edge) + `<p class="asy-verdict">${shape}${fails.length ? `超出規格：${fails.join('、')}。` : '五個場點都在規格內。'}</p>`;
  };
  const input = () => { state.dz = Number(dz.value); state.edge = Number(edge.value); render(); };
  const preset = e => { const p = asyPresets[e.target.dataset.preset]; if (p) { [state.dz, state.edge] = p; render(); } };
  dz.addEventListener('input', input); edge.addEventListener('input', input); btns.addEventListener('click', preset); render();
  return () => { dz.removeEventListener('input', input); edge.removeEventListener('input', input); btns.removeEventListener('click', preset); };
}
const asyRange = (labelAttr, inputAttr, label, min, max, step, value) => `<label class="asy-control"><span ${labelAttr}>${label}</span><input type="range" ${inputAttr} min="${min}" max="${max}" step="${step}" value="${value}"></label>`;

// 配對：誤差以「對像側焦點的貢獻（µm）」表示，線性相加、敏感度相同（教學假設）。
const asyA = [5, -4, 1, 5, -2, 4], asyB = [4, 1, -5, 5, 2, -4], asyPartSpec = 6, asySysSpec = 6;
function asyPairs(mode) {
  const a = asyA.map((e, i) => ({id: `A${i + 1}`, e})), b = asyB.map((e, i) => ({id: `B${i + 1}`, e}));
  if (mode === 'match') { a.sort((p, q) => p.e - q.e); b.sort((p, q) => q.e - p.e); } // ponytail: 兩列反向排序；此例已全數通過，一般最佳配對需另解
  return a.map((p, i) => ({a: p, b: b[i], sum: p.e + b[i].e, pass: Math.abs(p.e + b[i].e) <= asySysSpec}));
}
function asyPairView(mode) {
  const pairs = asyPairs(mode), ok = pairs.filter(p => p.pass).length, R = 12, P = v => `${(v + R) / (2 * R) * 100}%`;
  const rows = pairs.map(({a, b, sum, pass}) => {
    const seg = (from, to, cls) => `<i class="${cls}" style="left:${P(Math.min(from, to))};width:${Math.abs(to - from) / (2 * R) * 100}%"></i>`;
    return `<div class="asy-pair${pass ? '' : ' asy-bad'}"><span class="asy-pair-name">${a.id} ${asyFmt(a.e)} ＋ ${b.id} ${asyFmt(b.e)}</span><span class="asy-track">${seg(0, a.e, 'asy-seg-a')}${seg(a.e, sum, 'asy-seg-b')}<b style="left:${P(sum)}"></b></span><span class="asy-pair-sum">＝ ${asyFmt(sum)}${pass ? '' : ' 超出'}</span></div>`;
  }).join('');
  return `<figure class="asy-pairs" role="img" aria-label="${mode === 'match' ? '互補配對' : '依生產順序配對'}：${pairs.map(p => `${p.a.id}+${p.b.id}=${p.sum}`).join('，')}；${ok}/6 組通過">
    <p class="asy-big"><b>${ok} / 6</b> 組通過系統規格</p>
    <div class="asy-pair asy-pair-head"><span class="asy-pair-name">A 片 ＋ B 片（µm）</span><span class="asy-track asy-axis"><i style="left:${P(-asySysSpec)};width:${asySysSpec / R * 100}%"></i><em style="left:${P(-asySysSpec)}">−${asySysSpec}</em><em style="left:50%">0</em><em style="left:${P(asySysSpec)}">+${asySysSpec}</em></span><span class="asy-pair-sum">合計</span></div>${rows}
    <p class="asy-key"><span><i class="asy-sw-a"></i>A 片誤差</span><span><i class="asy-sw-b"></i>接著加上 B 片</span><span><i class="asy-sw-band"></i>系統規格 ±${asySysSpec}</span></p>
    <figcaption>軸 −${R} 到 +${R} µm。12 片全都符合單片規格 |e| ≤ ${asyPartSpec}；誤差線性相加、兩片位敏感度相同是教學假設，真實配對要先量測並做敏感度分析。</figcaption></figure>`;
}
function mountPair(root, state) {
  state.mode ??= 'order';
  const box = root.querySelector('[data-pair-modes]'), out = root.querySelector('[data-pair-output]');
  const render = () => { out.innerHTML = asyPairView(state.mode); box.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === state.mode))); };
  const click = e => { if (e.target.dataset.mode) { state.mode = e.target.dataset.mode; render(); } };
  box.addEventListener('click', click); render();
  return () => box.removeEventListener('click', click);
}
const asyModeButtons = mode => `<div class="asy-buttons" data-pair-modes><button type="button" data-mode="order" aria-pressed="${mode === 'order'}">依生產順序</button><button type="button" data-mode="match" aria-pressed="${mode === 'match'}">互補配對</button></div>`;

// 成本：兩站、無重工；件數取整數。與章節 cost_per_good 相同。
const asyBase = {N: 10000, y1: 0.94, y2: 0.90, mat: 85, asm: 30, opt: 12, fixed: 400000};
function asyCost(p = {}) {
  const m = {...asyBase, ...p}, stage1 = Math.round(m.N * m.y1), good = Math.round(stage1 * m.y2);
  const parts = {mat: m.mat * m.N, asm: m.asm * m.N, opt: m.opt * stage1, fixed: m.fixed};
  const total = parts.mat + parts.asm + parts.opt + parts.fixed;
  return {...m, stage1, good, parts, total, K: total / good};
}
const asyNum = n => Math.round(n).toLocaleString('en-US');
const asyScenarios = {base: ['基準', {}], A: ['A 組裝良率 0.97', {y1: 0.97}], B: ['B 光學要求變嚴 0.82', {y2: 0.82}], C: ['C 固定成本 550,000', {fixed: 550000}]};
const asyCostScale = 2100000; // 所有滑桿極值下的總成本上限 2,070,000，取整作共同滿格
function asyFlow(c) {
  const w = n => `${n / c.N * 100}%`;
  const row = (name, n, note, scrap) => `<div class="asy-flow-row"><span class="asy-flow-name">${name}</span><span class="asy-flow-bar"><i style="width:${w(n)}"></i>${scrap ? `<s style="width:${w(scrap)}"></s>` : ''}</span><span class="asy-flow-note"><b>${asyNum(n)}</b>${note}</span></div>`;
  return `<div class="asy-flow" role="img" aria-label="投入 ${asyNum(c.N)} 套，組裝站通過 ${asyNum(c.stage1)}、報廢 ${asyNum(c.N - c.stage1)}；光學驗收通過 ${asyNum(c.good)}、報廢 ${asyNum(c.stage1 - c.good)}">`
    + row('投入', c.N, ' 套：付材料與組裝')
    + row('過組裝站', c.stage1, ` 套：再付光學驗收（報廢 ${asyNum(c.N - c.stage1)}）`, c.N - c.stage1)
    + row('合格交付', c.good, ` 套：唯一能賣的（再報廢 ${asyNum(c.stage1 - c.good)}）`, c.stage1 - c.good)
    + `<p class="asy-scale">長度按套數，滿格 ${asyNum(c.N)} 套；虛線段是該站判退、費用已付。</p></div>`;
}
function asyCostBar(c) {
  const seg = (k, name) => `<i class="asy-c-${k}" style="width:${c.parts[k] / asyCostScale * 100}%" title="${name} ${asyNum(c.parts[k])}"></i>`;
  return `<div class="asy-costbar" role="img" aria-label="總成本 ${asyNum(c.total)} 元：材料 ${asyNum(c.parts.mat)}、組裝 ${asyNum(c.parts.asm)}、光學驗收 ${asyNum(c.parts.opt)}、固定 ${asyNum(c.parts.fixed)}">${seg('mat', '材料')}${seg('asm', '組裝')}${seg('opt', '光學驗收')}${seg('fixed', '固定成本')}</div>`
    + `<p class="asy-key"><span><i class="asy-c-mat"></i>材料 85×投入</span><span><i class="asy-c-asm"></i>組裝 30×投入</span><span><i class="asy-c-opt"></i>驗收 12×過組裝站</span><span><i class="asy-c-fixed"></i>固定成本</span></p>`
    + `<p class="asy-scale">長度按金額，共同滿格 ${asyNum(asyCostScale)} 元。</p>`;
}
function asyCostView(p) {
  const c = asyCost(p), b = asyCost(), d = c.total - b.total, dk = c.K - b.K;
  const sign = n => n > 0 ? `＋${asyNum(n)}` : n < 0 ? `−${asyNum(-n)}` : '不變';
  return `<div class="asy-costview"><section><h3>套數怎麼流</h3>${asyFlow(c)}</section>
    <section><h3>錢花在哪</h3>${asyCostBar(c)}<dl class="asy-sum"><div><dt>總成本</dt><dd>${asyNum(c.total)} 元<small>比基準 ${sign(d)}</small></dd></div><div><dt>合格交付</dt><dd>${asyNum(c.good)} 套<small>比基準 ${sign(c.good - b.good)}</small></dd></div><div class="asy-k"><dt>合格單位成本 K</dt><dd>${c.K.toFixed(2)} 元／套<small>比基準 ${dk ? (dk > 0 ? '＋' : '−') + Math.abs(dk).toFixed(2) : '不變'}；單套變動成本只有 127</small></dd></div></dl></section></div>`;
}
function mountCost(root, state) {
  state.p ??= {};
  const ins = [...root.querySelectorAll('[data-cost]')], box = root.querySelector('[data-scenarios]'), out = root.querySelector('[data-cost-output]');
  const render = () => {
    const c = asyCost(state.p);
    for (const el of ins) {
      const k = el.dataset.cost; el.value = c[k];
      const text = k === 'fixed' ? `固定成本 F = ${asyNum(c.fixed)} 元` : `${k === 'y1' ? '組裝站通過率 y₁' : '光學驗收通過率 y₂'} = ${c[k].toFixed(2)}`;
      root.querySelector(`[data-cost-label="${k}"]`).textContent = text; el.setAttribute('aria-valuetext', text);
    }
    box.querySelectorAll('button').forEach(btn => btn.setAttribute('aria-pressed', String(JSON.stringify(asyScenarios[btn.dataset.scenario][1]) === JSON.stringify(state.p))));
    out.innerHTML = asyCostView(state.p);
  };
  const input = e => { state.p = {...state.p, [e.target.dataset.cost]: Number(e.target.value)}; for (const k of Object.keys(state.p)) if (state.p[k] === asyBase[k]) delete state.p[k]; render(); };
  const pick = e => { const s = asyScenarios[e.target.dataset.scenario]; if (s) { state.p = {...s[1]}; render(); } };
  ins.forEach(el => el.addEventListener('input', input)); box.addEventListener('click', pick); render();
  return () => { ins.forEach(el => el.removeEventListener('input', input)); box.removeEventListener('click', pick); };
}
const asyCostControls = `<div class="asy-buttons" data-scenarios>${Object.entries(asyScenarios).map(([k, [n]]) => `<button type="button" data-scenario="${k}" aria-pressed="${k === 'base'}">${n}</button>`).join('')}</div>
  <div class="asy-controls">${asyRange('data-cost-label="y1"', 'data-cost="y1"', '組裝站通過率 y₁ = 0.94', 0.8, 1, 0.01, 0.94)}${asyRange('data-cost-label="y2"', 'data-cost="y2"', '光學驗收通過率 y₂ = 0.90', 0.7, 1, 0.01, 0.9)}${asyRange('data-cost-label="fixed"', 'data-cost="fixed"', '固定成本 F = 400,000 元', 200000, 800000, 50000, 400000)}</div>`;

// 靜態圖：鏡筒剖面（結構示意，不按比例）
const asyBarrel = `<figure class="asy-fig"><svg class="asy-barrel" viewBox="0 0 640 300" role="img" aria-label="鏡筒剖面示意：鏡筒包住五片鏡片，片與片之間有間隔環，前端有壓環；光軸水平穿過中心。結構示意，不按比例。">
  <line x1="20" y1="150" x2="620" y2="150" class="asy-axis-line"/>
  <path d="M60 40 H600 V70 H90 V110 H60 Z M60 190 H90 V230 H600 V260 H60 Z" class="asy-barrel-wall"/>
  <g class="asy-lens"><path d="M130 78 Q150 150 130 222 H150 Q160 150 150 78 Z"/><path d="M215 78 Q200 150 215 222 H240 Q255 150 240 78 Z"/><path d="M310 78 Q325 150 310 222 H330 Q320 150 330 78 Z"/><path d="M405 78 Q390 150 405 222 H425 Q445 150 425 78 Z"/><path d="M505 78 Q520 150 505 222 H530 Q515 150 530 78 Z"/></g>
  <g class="asy-spacer"><rect x="152" y="70" width="62" height="12"/><rect x="152" y="218" width="62" height="12"/><rect x="242" y="70" width="66" height="12"/><rect x="242" y="218" width="66" height="12"/><rect x="332" y="70" width="72" height="12"/><rect x="332" y="218" width="72" height="12"/><rect x="427" y="70" width="76" height="12"/><rect x="427" y="218" width="76" height="12"/></g>
  <rect x="96" y="70" width="30" height="40" class="asy-retainer"/><rect x="96" y="190" width="30" height="40" class="asy-retainer"/>
  <g class="asy-num"><circle cx="330" cy="18" r="15"/><text x="330" y="25">1</text><circle cx="275" cy="112" r="15"/><text x="275" y="119">2</text><circle cx="111" cy="150" r="15"/><text x="111" y="157">3</text></g>
  <path d="M330 34 V40" class="asy-lead"/><path d="M275 97 V82" class="asy-lead"/>
</svg>
<ol class="asy-legend"><li><b>鏡筒</b>所有鏡片共同的定位基準；同軸度誤差 → 整體偏心、傾斜</li><li><b>間隔環</b>維持相鄰兩片的空氣間距；厚度與平行度誤差 → 間距、傾斜</li><li><b>壓環</b>軸向鎖固；施力不均 → 傾斜</li><li><b>五片鏡片</b>（淺色曲面）各自已通過單片檢驗</li></ol>
<figcaption>結構示意 · 不按比例。遮光片與膠材省略。真實手機鏡頭常是 5–8 片。</figcaption></figure>`;

// 三種自由度：同一個基準軸，誤差刻意放大
const asyDofSvg = (moved, ghost) => `<svg viewBox="0 0 200 150" aria-hidden="true"><line x1="10" y1="75" x2="190" y2="75" class="asy-axis-line"/><path d="${ghost}" class="asy-ghost"/><path d="${moved}" class="asy-moved"/></svg>`;
const asyLensPath = (cx, cy, rot = 0) => { const pts = [[-8, -50], [8, -50], [14, 0], [8, 50], [-8, 50], [-14, 0]]; const r = rot * Math.PI / 180; const t = ([x, y]) => [cx + x * Math.cos(r) - y * Math.sin(r), cy + x * Math.sin(r) + y * Math.cos(r)].map(v => v.toFixed(1)).join(' '); return `M${t(pts[0])} L${t(pts[1])} Q${t(pts[2])} ${t(pts[3])} L${t(pts[4])} Q${t(pts[5])} ${t(pts[0])} Z`; };
const asyDof = `<figure class="asy-fig"><div class="asy-dof">
  <section><h3>偏心 δ</h3>${asyDofSvg(asyLensPath(100, 57), asyLensPath(100, 75))}<p>光軸橫向平移</p></section>
  <section><h3>傾斜 θ</h3>${asyDofSvg(asyLensPath(100, 75, 16), asyLensPath(100, 75))}<p>繞垂直光軸的軸轉動</p></section>
  <section><h3>間距 Δd</h3>${asyDofSvg(asyLensPath(128, 75), asyLensPath(100, 75))}<p>沿光軸前後移動</p></section></div>
  <p class="asy-key"><span><i class="asy-sw-ghost"></i>設計位置</span><span><i class="asy-sw-moved"></i>實際位置</span><span><i class="asy-sw-axis"></i>機械基準軸</span></p>
  <figcaption>誤差刻意放大，不按比例：真實公差是微米等級，照比例畫會看不見。</figcaption></figure>`;

// 光錐：焦點不在感測面時，光錐在感測面截出圓
const asyCone = `<figure class="asy-fig"><div class="asy-cone-wrap"><svg class="asy-cone" viewBox="0 0 600 260" role="img" aria-label="光錐幾何：光束從鏡頭匯聚到焦點，感測面在焦點後方 Δz，光錐在感測面截出直徑 c 的圓；c = Δz / N。">
  <line x1="20" y1="130" x2="590" y2="130" class="asy-axis-line"/>
  <path d="M60 30 Q80 130 60 230 H80 Q100 130 80 30 Z" class="asy-lens-fill"/>
  <path d="M80 30 L420 130 L560 171 M80 230 L420 130 L560 89" class="asy-ray"/>
  <line x1="420" y1="20" x2="420" y2="240" class="asy-plane-ghost"/><line x1="520" y1="20" x2="520" y2="240" class="asy-plane"/>
  <line x1="520" y1="100" x2="520" y2="160" class="asy-c"/>
  <path d="M420 212 H520" class="asy-dim"/><path d="M420 204 V220 M520 204 V220" class="asy-dim"/>
  <text x="470" y="244" class="asy-t">Δz</text><text x="538" y="138" class="asy-t asy-t-accent">c</text>
  <text x="420" y="16" class="asy-t asy-t-small">焦點</text><text x="520" y="16" class="asy-t asy-t-small">感測面</text><text x="70" y="256" class="asy-t asy-t-small">鏡頭</text>
</svg>
<div class="asy-formula"><p>光錐的張角由 f 數 N 決定：N 越小，錐越胖。</p><p class="asy-eq">c = |Δz| / N</p><p>例：N = ${asyN}、Δz = 4 µm → c = 2 µm。</p><p>焦點在感測面前或後都一樣，只看距離。</p></div></div>
<figcaption>幾何光學近似：物在無窮遠、小離焦。只管「光錐被截多大」，不含繞射與鏡頭像差，所以不是 MTF。Δz 被放大畫。</figcaption></figure>`;

const asyParam = rows => `<dl class="asy-params">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
const asyBack = '../../06-assembly-yield-cost.html';

const story = {
  title: '每片合格，組起來為什麼失敗？', label: '大立光 / 06 組裝良率與合格成本',
  back: {href: asyBack, label: '返回第 06 章'},
  pages: [
    {id: 'open', section: '01 / 開場', title: '零件全過，成品卻掉一成',
      lead: '鏡片檢驗站逐項量測，每一項合格率都在九成五以上。同一批鏡片組成鏡頭，送到光學驗收，卻約每十顆退一顆。',
      art: `<figure class="asy-fig"><div class="asy-compare"><section><h3>零件站：對自己的圖面</h3><ul class="asy-checks"><li>面形誤差<span>全數在公差內</span></li><li>中心厚度<span>全數在公差內</span></li><li>單片偏心<span>全數在公差內</span></li></ul><p class="asy-note">判定對象：每片鏡片</p></section><section><h3>成品站：對成像規格</h3><div class="asy-dots" aria-label="十顆鏡頭，一顆被判退">${'<i></i>'.repeat(9)}<i class="asy-bad"></i></div><p class="asy-note">判定對象：疊起來的整顆鏡頭</p></section></div><figcaption>示意情境，數字不是任何公司的良率。</figcaption></figure>`,
      point: '零件規格與系統規格是兩套判定條件；零件合格不蘊含成品合格。',
      detail: '「一成」是章節開場的想像情境。本篇所有數字都是教學假設。'},
    {id: 'barrel', section: '02 / 結構', title: '鏡片自己沒錯，錯的是它們的相對位置',
      lead: '鏡頭廠交付的組件：鏡片疊進鏡筒，用間隔環撐開距離，最後用壓環鎖住。每片的位置由這些零件共同決定。',
      art: asyBarrel,
      point: '面形、中頻紋路、粗糙度之外，還有第四類誤差：零件彼此的相對位置。',
      detail: '本篇的「組裝良率」只指鏡頭廠這一段，不含模組廠把鏡頭對到感測器的主動對準。'},
    {id: 'dof', section: '03 / 三種自由度', title: '位置可以偏三種方向',
      lead: '理想狀態下，每片的光軸都與鏡筒機械軸重合、片間距離等於設計值。實際上三者都會偏。',
      art: asyDof,
      point: '偏心是橫移，傾斜是轉動，間距是沿軸移動；三者在影像上的徵狀不同。'},
    {id: 'cone', section: '04 / 量尺', title: '焦點離感測面多遠，模糊圈就多大',
      lead: '要比較徵狀，先要一把量尺。這裡只用最基本的幾何：光匯聚成錐，感測面若不在錐尖，就截到一個圓。',
      art: asyCone,
      point: '模糊圈直徑 c = |Δz| / N：只看各場點的離焦距離。',
      detail: '依焦深公式 t = 2Nc（小放大率），單側離焦 Δz 對應 c = Δz/N。N = 2 是教學假設，接近手機主鏡頭的常見量級。'},
    {id: 'focus', section: '05 / 操作', title: '間距誤差全場一起糊，傾斜只糊一邊',
      lead: '直接設定像側的兩個量：整體焦點偏移 Δz，以及右緣比中心多偏多少 e（左緣相反）。規格：五個場點的模糊圈都 ≤ 2 µm。',
      art: `<div class="asy-live"><div class="asy-buttons" data-presets>${Object.entries(asyPresets).map(([k, [, , n]]) => `<button type="button" data-preset="${k}">${n}</button>`).join('')}</div><div class="asy-controls">${asyRange('data-dz-label', 'data-dz', '整體焦點偏移 Δz = 5 µm', -8, 8, 0.5, 5)}${asyRange('data-edge-label', 'data-edge', '邊緣焦點差 e = 0 µm', -8, 8, 0.5, 0)}</div><div data-focus-output></div></div>`,
      previewArt: `<div class="asy-live">${asyFocusView(5, 0)}</div>`,
      mount: mountFocus,
      point: '間距誤差主要讓焦點整體移動，五個場點一起變差；像面傾斜讓一側變差、另一側變好。',
      detail: '輸入是像側的量。元件 Δd 或 θ 會造成多大的 Δz、e，要靠該設計的敏感度分析，本篇不假裝換算。'},
    {id: 'decenter', section: '06 / 限制', title: '偏心畫不進這把量尺',
      lead: '上一頁只有離焦。偏心的主要後果是彗差等像差在各視場不對稱，不是單純的焦點前後移動。',
      art: `<figure class="asy-fig"><div class="asy-table" role="table" aria-label="誤差、主要徵狀與本篇能否畫出"><div role="row" class="asy-tr asy-th"><span role="columnheader">誤差</span><span role="columnheader">影像上的典型徵狀</span><span role="columnheader">本篇的量尺</span></div><div role="row" class="asy-tr"><span role="cell">空氣間距 Δd</span><span role="cell">最佳焦點整體偏移，全場<b>對稱</b>變差</span><span role="cell">可畫：整體 Δz</span></div><div role="row" class="asy-tr"><span role="cell">傾斜 θ</span><span role="cell">焦面傾斜，對角方向<b>不對稱</b></span><span role="cell">可畫：以像面傾斜 e 近似</span></div><div role="row" class="asy-tr asy-tr-limit"><span role="cell">偏心 δ</span><span role="cell">彗差在各視場<b>不對稱</b>，單邊 MTF 下降</span><span role="cell">畫不出：需要像差模型</span></div></div><figcaption>「對稱傾向間距、不對稱傾向偏心或傾斜」是章節標明的教學經驗法則。面形、材料應力、測試靶或感測面傾斜也可能造成不對稱，要用獨立量測確認。</figcaption></figure>`,
      point: '不對稱只是線索：先確認量測基準，再做多場點離焦掃描與偏心量測，不能單憑一張圖確診。'},
    {id: 'predict-focus', section: '07 / 預測', title: '整體偏移加上傾斜，哪邊會超出？',
      lead: '新情況：焦點整體偏移，同時像面傾斜。先用 c = |Δz + x·e| / N 算左緣（x = −1）、中心、右緣（x = +1）。',
      art: `<figure class="asy-fig">${asyParam([['f 數 N', '2'], ['整體焦點偏移 Δz', '+2 µm'], ['邊緣焦點差 e', '+3 µm（右緣再多 3，左緣少 3）'], ['規格', '每個場點 c ≤ 2 µm']])}<figcaption>和第 05 頁同一個模型；這組數字前面沒有示範過。</figcaption></figure>`,
      point: '先算三個場點的離焦距離，再除以 N。',
      question: {prompt: '哪些場點超出規格？', hideFuturePreviews: true, choices: [
        {value: 'right', label: '只有右緣超出', feedback: '對。左緣 |2 − 3| / 2 = 0.5 µm，中心 2 / 2 = 1 µm，右緣 |2 + 3| / 2 = 2.5 µm。傾斜抵銷了左邊的整體偏移，所以左緣反而比中心清楚。'},
        {value: 'both', label: '左右兩緣都超出，中心通過', feedback: '傾斜是一邊加、一邊減。左緣 |2 − 3| / 2 = 0.5 µm，比中心還小；只有右緣 5 / 2 = 2.5 µm 超出。'},
        {value: 'none', label: '全部通過', feedback: '右緣的離焦是 2 + 3 = 5 µm，c = 5 / 2 = 2.5 µm，超過 2 µm。只看中心的 1 µm 會漏掉邊緣。'}]}},
    {id: 'chain', section: '08 / 累積', title: '誤差沿組裝順序疊起來，而且互相牽動',
      lead: '三種來源的誤差匯進同一條公差鏈。前一片的偏心可能牽動後一片；換一種堆疊方式，系統誤差分布就不同。',
      art: `<figure class="asy-fig"><div class="asy-chain"><div class="asy-srcs"><div class="asy-node"><b>單片</b>面形、中心厚、單片偏心</div><div class="asy-node"><b>機構</b>鏡筒同軸度、間隔環厚度與平行度</div><div class="asy-node"><b>製程</b>壓環施力不均、膠材固化收縮</div></div><div class="asy-arrow" aria-hidden="true">↓</div><div class="asy-node asy-node-key"><b>公差鏈疊加</b>依實際組裝順序耦合</div><div class="asy-arrow" aria-hidden="true">↓</div><div class="asy-outs"><div class="asy-node"><b>殘留偏心、傾斜</b>→ 不對稱徵狀</div><div class="asy-node"><b>空氣間距偏差</b>→ 對稱徵狀</div></div><div class="asy-arrow" aria-hidden="true">↓</div><div class="asy-node">光學驗收判定</div></div><figcaption>只表示因果方向，不表示各路徑權重；權重取決於具體設計。</figcaption></figure>`,
      point: '做蒙地卡羅公差分析時，要依實際組裝順序配置每片的傾斜與偏心，否則系統誤差分布會算錯。'},
    {id: 'power', section: '09 / 防混淆', title: '為什麼不能用 0.98⁷ 當鏡頭良率',
      lead: '看到 7P 鏡頭、單片良率 0.98，很容易算 0.98⁷ ≈ 0.868。這個算法藏了三個假設，而且方向可能兩邊都錯。',
      art: `<figure class="asy-fig"><div class="asy-compare"><section><h3>天真算法</h3><p class="asy-eq">0.98⁷ ≈ 0.868</p><ul class="asy-checks asy-plain"><li>各片獨立</li><li>只有鏡片會錯</li><li>組裝時不能挑、不能補</li></ul></section><section><h3>缺的三項資訊</h3><ul class="asy-checks asy-plain"><li><b>批次相關</b>同一模仁的鏡片帶同方向系統誤差；對結果的方向不定</li><li><b>配對</b>把誤差互補的零件配成一組，可以高於乘冪</li><li><b>組裝本身與補償</b>鏡筒、間隔環、膠材會多出失效；對準能補回一部分</li></ul></section></div><figcaption>這三項是廠商的核心 know-how，通常不公開。本篇不估任何公司的鏡頭良率。</figcaption></figure>`,
      point: '片數次方缺了相關結構、配對規則與補償能力；下一頁用同一批零件看配對的效果。'},
    {id: 'pair', section: '10 / 操作', title: '同一批合格零件，換個配法就多組出兩顆',
      lead: 'A、B 兩個片位各 6 片，全部符合單片規格。誤差以「對焦點的貢獻」表示，兩片相加就是這顆鏡頭的誤差。切換兩種配法。',
      art: `<div class="asy-live">${asyModeButtons('order')}<div data-pair-output></div></div>`,
      previewArt: `<div class="asy-live">${asyPairView('order')}</div>`,
      mount: mountPair,
      point: '依生產順序配對，同方向的兩片疊在一起而超出；互補配對讓誤差互相抵消，6 組全過。',
      detail: '互補配對要先量測每一片，並用敏感度分析確認誤差真的能抵消，這些量測本身有成本。反向排序只是本例可行的配法。選擇性組裝見 Levin & Kachurin, J. Opt. Technol. 88(4), 178 (2021)。'},
    {id: 'flow', section: '11 / 成本', title: '成本在「嘗試」時發生，價值只在「通過」時產生',
      lead: '兩站、無重工：投入 10,000 套，組裝站通過 0.94，光學驗收通過 0.90。光學驗收的分母是已過組裝站的套數。',
      art: `<figure class="asy-fig">${asyFlow(asyCost())}<figcaption>被判退的 1,540 套已付過材料與組裝費，其中 940 套連光學驗收費也付了。它們的成本不會消失，要由 8,460 套合格品吸收。</figcaption></figure>`,
      point: '每一站按「進入該站的套數」計費；合格單位成本 K = 總成本 ÷ 合格交付。',
      detail: 'y₁ × y₂ 是條件機率鏈：y₂ 的分母是過組裝站的套數，不需要假設兩站獨立。'},
    {id: 'cost', section: '12 / 操作', title: '良率變好，總成本卻可能上升',
      lead: '先點「A 組裝良率 0.97」，看總成本和 K 各往哪走；再試 B、C，或自己拉滑桿。',
      art: `<div class="asy-live">${asyCostControls}<div data-cost-output></div></div>`,
      previewArt: `<div class="asy-live">${asyCostView({})}</div>`,
      mount: mountCost,
      point: 'A：更多套活到光學驗收站，多付 3,600 元，但合格品增加得更多，K 仍下降。良率改善靠的是分母。',
      detail: '基準 196.55、A 190.88、B 215.72、C 214.28 元／套，與章節表 06-6 相同。三個情境各只改一個變數，不能把差額相加。'},
    {id: 'bounds', section: '13 / 邊界', title: '模型刻意沒算的，以及能對大立光說的',
      lead: '這個模型只為了看清分母。它排除了很多真實產線的東西；公司公開資料也不含任何良率或成本。',
      art: `<figure class="asy-fig"><div class="asy-compare"><section><h3>模型排除</h3><ul class="asy-checks asy-plain"><li>跨批變動與配對成本</li><li>重工：退了就報廢</li><li>產能瓶頸與排隊</li><li>主動對準的補償能力</li><li>資金成本、罰則、售後退回</li></ul></section><section><h3>與大立光</h3><ul class="asy-checks asy-plain"><li><b>可確認</b>114 年報列出 5P 到 8P 多種片數的手機鏡頭「開發成功」</li><li><b>合理推論</b>多片堆疊都得處理公差鏈、配對與對準</li><li><b>不能推</b>它的良率、成本、配對策略；毛利率也不能反推良率</li></ul></section></div><figcaption>「開發成功」是公司自陳，不是量產或客戶採用的證據。客戶在年報中僅以代號揭露。</figcaption></figure>`,
      point: '同一套機制適用於所有多片鏡頭廠；數字只能靠揭露或量測，不能從本模型倒推。'},
    {id: 'predict-cost', section: '14 / 預測', title: '改善末站良率，總成本會怎麼變？',
      lead: '回到基準。這次不動組裝站，改把光學驗收通過率 y₂ 從 0.90 提到 0.93。先別拉滑桿，用分母推。',
      art: `<figure class="asy-fig">${asyParam([['投入 N', '10,000 套'], ['組裝站 y₁', '0.94（不變）'], ['光學驗收 y₂', '0.90 → 0.93'], ['單價', '材料 85、組裝 30（按投入）；驗收 12（按過組裝站）'], ['固定成本', '400,000 元']])}<figcaption>和第 12 頁同一個模型；情境 A 改的是 y₁，這裡改的是 y₂。</figcaption></figure>`,
      point: '先問：哪一站的計價套數會變？',
      question: {prompt: '總成本與合格單位成本 K 會怎麼變？', hideFuturePreviews: true, choices: [
        {value: 'same', label: '總成本不變，K 下降', feedback: '對。兩站的計價套數（投入 10,000、過組裝站 9,400）都沒變，總成本仍是 1,662,800 元；合格交付 9,400 × 0.93 = 8,742 套，K ≈ 190.21 元／套。它只增加分母，不增加分子；這個結論依賴本模型的單價結構。'},
        {value: 'up', label: '總成本上升，K 下降', feedback: '這是情境 A 的樣子：y₁ 變好，更多套進入下一站而多付驗收費。y₂ 是最後一站，改善它不會讓任何一站處理更多套，總成本不變；K = 1,662,800 ÷ 8,742 ≈ 190.21。'},
        {value: 'down', label: '總成本下降，K 下降', feedback: '被判退的 940 套已經付過全部費用；少判退不會退錢。總成本仍是 1,662,800 元，K 下降只因合格交付變成 8,742 套。'}]},
      detail: `<a href="${asyBack}">第 06 章：組裝良率與合格成本</a> · 所有數字為教學假設，不是大立光的價格、良率或成本。`},
  ],
};
