// 計數模型：C = A × B，三者都是 N×N、FP32（每元素 4 bytes），一個執行緒算一個 C 元素。
// 只數「全域記憶體（HBM）讀取次數」：不含 L1/L2 快取、合併存取、bank conflict、同步成本；
// 累加值放暫存器、不計；C 的寫回 N² 次兩種寫法相同，另外列出，不算進算術強度。
// 頁面上的次數、格子深淺、長條長度、算術強度與 roofline 點位都由下面三個函式算出。
const trBytes = 4;
const trGrid = N => Array.from({length: N}, () => Array(N).fill(0));

// naive：依列優先順序算前 upto 個 C 元素，每個 (i, j, k) 直接從全域記憶體讀 A[i][k]、B[k][j]。
function trNaive(N, upto = N * N) {
  const a = trGrid(N), b = trGrid(N); let reads = 0, flops = 0;
  for (let c = 0; c < upto; c++) {
    const i = Math.floor(c / N), j = c % N;
    for (let k = 0; k < N; k++) { a[i][k]++; b[k][j]++; reads += 2; flops += 2; }
  }
  return {N, T: 1, a, b, reads, flops, sharedReads: 0};
}

// tiled：T×T 的 block 算 C 的一塊，分 N/T 階段。每階段 block 內每個執行緒各搬 A、B 一個元素進共享記憶體，
// 再各自從共享記憶體讀 T 對運算元做乘加（CUDA C++ Programming Guide §3.2.4 的分塊法）。
function trTiled(N, T) {
  if (N % T) throw new Error('T 必須整除 N');
  const a = trGrid(N), b = trGrid(N), phases = []; let reads = 0, sharedReads = 0, flops = 0;
  for (let bi = 0; bi < N / T; bi++) for (let bj = 0; bj < N / T; bj++) for (let p = 0; p < N / T; p++) {
    for (let r = 0; r < T; r++) for (let c = 0; c < T; c++) { a[bi * T + r][p * T + c]++; b[p * T + r][bj * T + c]++; reads += 2; }
    for (let r = 0; r < T; r++) for (let c = 0; c < T; c++) for (let k = 0; k < T; k++) { sharedReads += 2; flops += 2; }
    phases.push({bi, bj, p});
  }
  return {N, T, a, b, reads, flops, sharedReads, phases, sharedBytes: 2 * T * T * trBytes};
}
const trAI = s => s.flops / (s.reads * trBytes); // FLOP ÷ 全域讀取位元組

// roofline 參數是教學假設，不對應任何 GPU：峰值 10 TFLOP/s、頻寬 2 TB/s。
const trPeak = 10, trBW = 2;
const trRoof = (ai, peak = trPeak, bw = trBW) => Math.min(peak, bw * ai); // TB/s × FLOP/byte = TFLOP/s

const trNum = n => Math.round(n).toLocaleString('en-US');
const trFmt = n => Number(n.toFixed(3)).toString();

// 矩陣格子：cell(i, j) 回傳 {n: 顯示文字, lv: 0–1 深淺, cls}；T > 1 時畫 tile 邊界。
function trMat(name, N, cell, T = 0, note = '') {
  let cells = '';
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const {n = '', lv = 0, cls = ''} = cell(i, j);
    const edge = T > 1 ? `${(j + 1) % T === 0 && j < N - 1 ? ' trs-er' : ''}${(i + 1) % T === 0 && i < N - 1 ? ' trs-eb' : ''}` : '';
    cells += `<i class="${cls}${edge}${lv > 0.55 ? ' trs-dark' : ''}" style="--lv:${lv.toFixed(3)}">${n}</i>`;
  }
  return `<div class="trs-mat"><b>${name}</b><div class="trs-grid trs-n${N}" style="--n:${N}">${cells}</div>${note ? `<small>${note}</small>` : ''}</div>`;
}
const trOp = s => `<span class="trs-op" aria-hidden="true">${s}</span>`;
const trKeyShade = max => `<p class="trs-key"><span><i class="trs-sw-shade"></i>格內數字 = 該元素從全域記憶體被讀幾次；顏色越深越多（滿色 = ${max} 次）</span></p>`;

// 長條：同一頁共用 scale；floor 是「每個元素只讀一次」的下限 2N²。
const trBar = (label, v, scale, cls, floor) => `<div class="trs-bar-row"><span class="trs-bar-label">${label}</span><span class="trs-bar"><i class="${cls}" style="width:${v / scale * 100}%"></i>${floor ? `<em style="left:${floor / scale * 100}%"></em>` : ''}</span><span class="trs-bar-val">${trNum(v)}</span></div>`;

// 01：C[1][2] 需要 A 第 1 列與 B 第 2 行
const trOpen = (() => {
  const N = 4, i = 1, j = 2;
  const A = trMat('A', N, (r, c) => r === i ? {cls: 'trs-hit', n: `a${c}`} : {});
  const B = trMat('B', N, (r, c) => c === j ? {cls: 'trs-hit', n: `b${r}`} : {});
  const C = trMat('C', N, (r, c) => r === i && c === j ? {cls: 'trs-cur', n: '?'} : {});
  return `<figure class="trs-fig"><div class="trs-mats">${A}${trOp('×')}${B}${trOp('=')}${C}</div>
    <p class="trs-eq">C[1][2] = a0·b0 + a1·b1 + a2·b2 + a3·b3</p>
    <dl class="trs-params"><div><dt>要讀的數</dt><dd>A 一列 4 個 ＋ B 一行 4 個 = 8 個</dd></div><div><dt>要做的運算</dt><dd>4 次乘法 ＋ 4 次加法 = 8 FLOP</dd></div><div><dt>整個 C（16 格）</dt><dd>2N³ = 128 FLOP</dd></div></dl>
    <figcaption>N = 4 的方陣。列、行從 0 起算。一次乘加記作 2 FLOP。</figcaption></figure>`;
})();

// 02：層次（只用章節內容，不列頻寬數字）
const trLayers = `<figure class="trs-fig"><div class="trs-layers">
  <div class="trs-layer"><b>計算單元</b><span>每次乘加需要兩個運算元</span></div>
  <div class="trs-arrow" aria-hidden="true">↑</div>
  <div class="trs-layer trs-layer-near"><b>Shared Memory（SM 內）</b><span>快、容量小；同一個 block 的執行緒共用；程式用 <code>__shared__</code> 手動放資料</span></div>
  <div class="trs-arrow" aria-hidden="true">↑ 一次載入 tile</div>
  <div class="trs-layer trs-layer-far"><b>HBM 全域記憶體</b><span>容量大，矩陣 A、B、C 都放在這裡；離計算單元最遠、最慢</span></div></div>
  <figcaption>依章節「記憶體層次結構」與「矩陣運算基礎」整理；中間的 L2 快取與暫存器省略。本篇不列各層頻寬數字。</figcaption></figure>`;

// 03：naive 逐格累積
function trNaiveView(k) {
  const N = 4, s = trNaive(N, k), cur = k - 1, ci = Math.floor(cur / N), cj = cur % N;
  const A = trMat('A', N, (r, c) => ({n: s.a[r][c], lv: s.a[r][c] / N, cls: k && r === ci ? 'trs-hit' : ''}));
  const B = trMat('B', N, (r, c) => ({n: s.b[r][c], lv: s.b[r][c] / N, cls: k && c === cj ? 'trs-hit' : ''}));
  const C = trMat('C', N, (r, c) => { const id = r * N + c; return id === cur ? {cls: 'trs-cur', n: '✓'} : id < cur ? {cls: 'trs-done', n: '✓'} : {}; });
  const scale = 2 * N ** 3, floor = 2 * N * N;
  return `<p class="trs-verdict">已算 ${k} / 16 格 · 全域讀取 <b>${trNum(s.reads)}</b> 次${k === 16 ? ' = 每個元素只讀一次（32）的 4 倍' : ''}</p>
    <figure class="trs-fig" role="img" aria-label="已算完 ${k} 個 C 元素；A 與 B 的每個元素被讀取次數：A ${s.a.map(r => r.join(',')).join('；')}；B ${s.b.map(r => r.join(',')).join('；')}；全域讀取共 ${s.reads} 次">
    <div class="trs-mats">${A}${trOp('×')}${B}${trOp('=')}${C}</div>${trKeyShade(N)}
    <div class="trs-bars">${trBar('全域讀取', s.reads, scale, 'trs-b-global', floor)}</div>
    <p class="trs-key"><span><i class="trs-sw-global"></i>naive 的全域讀取，滿格 = 2N³ = ${scale}</span><span><i class="trs-sw-floor"></i>每個元素只讀一次的下限 2N² = ${floor}</span></p>
    <figcaption>框線是正在算的那一格用到的 A 列與 B 行。每算一格就讀 2N = 8 次，不管那些數字之前讀過沒有。</figcaption></figure>`;
}
function mountNaive(root, state) {
  state.k ??= 6;
  const input = root.querySelector('[data-k]'), out = root.querySelector('[data-naive-output]'), label = root.querySelector('[data-k-label]');
  const render = () => { input.value = state.k; label.textContent = `已算完的 C 元素：${state.k} / 16`; input.setAttribute('aria-valuetext', `${state.k} 個`); out.innerHTML = trNaiveView(state.k); };
  const onInput = () => { state.k = Number(input.value); render(); };
  input.addEventListener('input', onInput); render();
  return () => input.removeEventListener('input', onInput);
}

// 04：C 同一列共用 A 同一列
const trReuse = (() => {
  const N = 4, s = trNaive(N);
  const C = trMat('C 第 1 列', N, (r, c) => r === 1 ? {cls: 'trs-cur', n: `C${c}`} : {});
  const A = trMat('A 第 1 列被讀幾次', N, (r, c) => r === 1 ? {cls: 'trs-hit', n: s.a[r][c], lv: s.a[r][c] / N} : {});
  return `<figure class="trs-fig"><div class="trs-mats">${C}${trOp('←')}${A}</div>
    <p class="trs-note">C 第 1 列的 4 格，每一格都要 A 第 1 列的全部 4 個數。naive 寫法讓每一格各自去 HBM 拿，A 第 1 列就被搬了 4 次；B 的每一行同理，被 C 同一行的 4 格各搬一次。</p>
    <figcaption>章節：「矩陣 A 的每一列會被重複使用 n 次」。重用是運算本身的性質；會不會「重複搬」，取決於寫法。</figcaption></figure>`;
})();

// 05：block (0,0) 分兩階段（N = 4、T = 2），位置由模擬的 phases 產生
const trPhaseFig = (() => {
  const N = 4, T = 2, s = trTiled(N, T);
  const inTile = (r, c, R, Cc) => Math.floor(r / T) === R && Math.floor(c / T) === Cc;
  const steps = s.phases.filter(x => x.bi === 0 && x.bj === 0).map(({bi, bj, p}) => {
    const A = trMat('A', N, (r, c) => inTile(r, c, bi, p) ? {cls: 'trs-hit', n: '載'} : {}, T);
    const B = trMat('B', N, (r, c) => inTile(r, c, p, bj) ? {cls: 'trs-hit', n: '載'} : {}, T);
    const C = trMat('C', N, (r, c) => inTile(r, c, bi, bj) ? {cls: 'trs-cur', n: '+'} : {}, T);
    return `<section><h3>階段 ${p + 1}：搬 A、B 各一塊 ${T}×${T}</h3><div class="trs-mats trs-mats-sm">${A}${trOp('×')}${B}${trOp('→')}${C}</div></section>`;
  }).join('');
  return `<figure class="trs-fig"><div class="trs-steps">${steps}</div>
    <ol class="trs-howto"><li>block 的 ${T * T} 個執行緒各搬 A、B 一個元素進共享記憶體（共 ${2 * T * T} 次全域讀取）。</li><li>等全部搬完，每個執行緒從共享記憶體讀 ${T} 對數，把乘加結果累加在自己的暫存器。</li><li>換下一塊，重複 N/T = ${N / T} 次；C 的這塊就算完了。</li></ol>
    <figcaption>C 被切成 ${(N / T) ** 2} 塊，每塊一個 block，共 ${s.phases.length} 個「block × 階段」。「載」= 這一階段從 HBM 搬進共享記憶體的元素。分塊法取自 CUDA C++ Programming Guide §3.2.4（教學補充）。</figcaption></figure>`;
})();

// 06：換 T、N
const trNs = [4, 8], trTs = N => [1, 2, 4, 8].filter(t => t <= N);
function trTiledView(N, T) {
  const s = trTiled(N, T), naive = 2 * N ** 3, floor = 2 * N * N;
  const cell = g => (r, c) => ({n: g[r][c], lv: g[r][c] / N});
  return `<p class="trs-verdict">N = ${N}、T = ${T}：每個元素從 HBM 讀 <b>${N / T}</b> 次 · 全域讀取 <b>${trNum(s.reads)}</b> 次（naive 的 1/${T}）· 算術強度 <b>${trFmt(trAI(s))}</b> FLOP/byte</p>
    <figure class="trs-fig" role="img" aria-label="N ${N}、tile ${T}：A、B 每個元素各被讀 ${N / T} 次；全域讀取 ${s.reads} 次，naive ${naive} 次；共享記憶體讀取 ${s.sharedReads} 次">
    <div class="trs-mats">${trMat('A', N, cell(s.a), T)}${trMat('B', N, cell(s.b), T)}</div>${trKeyShade(N)}
    <div class="trs-bars">${trBar('naive 全域讀取', naive, naive, 'trs-b-naive', floor)}${trBar(`T = ${T} 全域讀取`, s.reads, naive, 'trs-b-global', floor)}${trBar('共享記憶體讀取', s.sharedReads, naive, 'trs-b-shared')}</div>
    <p class="trs-key"><span><i class="trs-sw-global"></i>從 HBM 讀</span><span><i class="trs-sw-shared"></i>從共享記憶體讀</span><span><i class="trs-sw-floor"></i>下限 2N² = ${floor}</span><span>滿格 = 2N³ = ${trNum(naive)}</span></p>
    <dl class="trs-params"><div><dt>乘加運算</dt><dd>${trNum(s.flops)} FLOP（和 naive 一樣）</dd></div><div><dt>每個 block 的共享記憶體</dt><dd>2 × T² × 4 bytes = ${trNum(s.sharedBytes)} bytes</dd></div></dl>
    <figcaption>粗線是 tile 邊界。T = 1 等於沒有重用，數字和 naive 相同；T = N 時每個元素只讀一次，碰到下限。</figcaption></figure>`;
}
function mountTiled(root, state) {
  state.N ??= 4; state.T ??= 2;
  const box = root.querySelector('[data-tile-controls]'), out = root.querySelector('[data-tile-output]');
  const render = () => {
    box.innerHTML = `<div class="trs-buttons" role="group" aria-label="矩陣大小">${trNs.map(n => `<button type="button" data-n="${n}" aria-pressed="${n === state.N}">N = ${n}</button>`).join('')}</div><div class="trs-buttons" role="group" aria-label="tile 大小">${trTs(state.N).map(t => `<button type="button" data-t="${t}" aria-pressed="${t === state.T}">T = ${t}</button>`).join('')}</div>`;
    out.innerHTML = trTiledView(state.N, state.T);
  };
  const click = e => {
    const d = e.target.dataset ?? {};
    if (d.n) { state.N = Number(d.n); if (state.N % state.T) state.T = 2; }
    else if (d.t) state.T = Number(d.t);
    else return;
    render(); box.querySelector(`[data-${d.n ? 'n' : 't'}="${d.n ?? d.t}"]`)?.focus();
  };
  box.addEventListener('click', click); render();
  return () => box.removeEventListener('click', click);
}

// 08：算術強度（N = 32 實際模擬）
const trAITable = (() => {
  const N = 32, max = 8;
  const rows = [1, 2, 4, 8, 16, 32].map(T => { const s = trTiled(N, T), ai = trAI(s);
    return `<div class="trs-ai-row"><span>T = ${T}</span><span>${trNum(s.reads)}</span><span>${N / T}</span><span class="trs-bar"><i class="trs-b-ai" style="width:${ai / max * 100}%"></i></span><b>${trFmt(ai)}</b></div>`; }).join('');
  return `<figure class="trs-fig"><p class="trs-eq">算術強度 = 2N³ FLOP ÷ (2N³/T 次 × 4 bytes) = T / 4</p>
    <div class="trs-ai" role="table" aria-label="N 32 時各 tile 大小的全域讀取次數與算術強度"><div class="trs-ai-row trs-ai-head"><span>tile</span><span>全域讀取</span><span>每元素讀幾次</span><span>算術強度（滿格 ${max}）</span><b>FLOP/byte</b></div>${rows}</div>
    <figcaption>N = 32、FP32，由同一個計數模型逐元素模擬。N 會消掉：算術強度只看 T。本篇的算術強度只算讀取位元組，C 的寫回不計。</figcaption></figure>`;
})();

// 09：roofline（log-log；座標與數字同一函式）
const trXr = [-3, 5], trYr = [-2, 5]; // log2：x 1/8–32 FLOP/byte，y 0.25–32 TFLOP/s
const trX = ai => (Math.log2(ai) - trXr[0]) / (trXr[1] - trXr[0]) * 100;
const trY = p => 100 - (Math.log2(p) - trYr[0]) / (trYr[1] - trYr[0]) * 100;
const trRoofTs = [1, 2, 4, 8, 16, 32];
function trRoofView(T) {
  const ai = T / 4, p = trRoof(ai), ridge = trPeak / trBW, lo = 2 ** trXr[0], hi = 2 ** trXr[1];
  const bound = trBW * ai >= trPeak ? '受算力限制：已頂到峰值，再提高重用也不會更快' : `受頻寬限制：可達效能 = 頻寬 × 算術強度 = ${trBW} × ${trFmt(ai)}`;
  const dots = trRoofTs.map(t => { const a = t / 4; return `<i class="trs-dot${t === T ? ' trs-dot-cur' : ''}" style="left:${trX(a)}%;top:${trY(trRoof(a))}%"><span>T=${t}</span></i>`; }).join('');
  const xt = [-3, -2, -1, 0, 1, 2, 3, 4, 5].map(e => `<span style="left:${trX(2 ** e)}%">${e < 0 ? `1/${2 ** -e}` : 2 ** e}</span>`).join('');
  const yt = [-2, -1, 0, 1, 2, 3, 4, 5].map(e => `<span style="top:${trY(2 ** e)}%">${2 ** e}</span>`).join('');
  return `<p class="trs-verdict">T = ${T} → 算術強度 ${trFmt(ai)} FLOP/byte → 可達 <b>${trFmt(p)}</b> TFLOP/s。${bound}。</p>
  <figure class="trs-fig" role="img" aria-label="roofline：峰值 ${trPeak} TFLOP/s、頻寬 ${trBW} TB/s、屋脊點 ${ridge} FLOP/byte；目前 T ${T}，算術強度 ${trFmt(ai)}，可達 ${trFmt(p)} TFLOP/s">
  <div class="trs-roof-wrap"><span class="trs-ylab">縱軸：可達效能（TFLOP/s）</span><div class="trs-roof"><div class="trs-yt">${yt}</div>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <line x1="${trX(ridge)}" y1="0" x2="${trX(ridge)}" y2="100" class="trs-ridge" vector-effect="non-scaling-stroke"/>
      <line x1="${trX(ai)}" y1="100" x2="${trX(ai)}" y2="${trY(p)}" class="trs-drop" vector-effect="non-scaling-stroke"/>
      <polyline points="${trX(lo)},${trY(trRoof(lo))} ${trX(ridge)},${trY(trPeak)} ${trX(hi)},${trY(trRoof(hi))}" class="trs-roofline" vector-effect="non-scaling-stroke"/></svg>
    <em class="trs-rl trs-rl-bw">頻寬斜線 ${trBW} TB/s × 強度</em><em class="trs-rl trs-rl-peak" style="top:${trY(trPeak)}%">峰值 ${trPeak} TFLOP/s</em><em class="trs-rl trs-rl-ridge" style="left:${trX(ridge)}%">屋脊點 ${trFmt(ridge)}</em>
    ${dots}<div class="trs-xt">${xt}</div></div></div>
  <p class="trs-xlab">算術強度 FLOP/byte（兩軸都是對數刻度，每格 ×2）</p>
  <figcaption>峰值 ${trPeak} TFLOP/s、頻寬 ${trBW} TB/s 是<b>教學假設</b>，不對應任何 GPU；屋脊點（虛線）= 峰值 ÷ 頻寬 = ${trFmt(ridge)} FLOP/byte。可達效能 = min(峰值, 頻寬 × 算術強度)，出自 Williams、Waterman、Patterson 的 roofline 模型（教學補充）。這是上限，不是實測。</figcaption></figure>`;
}
function mountRoof(root, state) {
  state.T ??= 4;
  const box = root.querySelector('[data-roof-controls]'), out = root.querySelector('[data-roof-output]');
  const render = () => { box.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.t) === state.T))); out.innerHTML = trRoofView(state.T); };
  const click = e => { const t = Number(e.target.dataset?.t); if (t) { state.T = t; render(); } };
  box.addEventListener('click', click); render();
  return () => box.removeEventListener('click', click);
}
const trRoofButtons = T => `<div class="trs-buttons" data-roof-controls role="group" aria-label="tile 大小">${trRoofTs.map(t => `<button type="button" data-t="${t}" aria-pressed="${t === T}">T = ${t}</button>`).join('')}</div>`;

const trParam = rows => `<dl class="trs-params">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
const trBack = '../../prerequisites/matrix-math.html';

const story = {
  title: '同一筆資料，要從 HBM 搬幾次？', label: 'GPU / 矩陣運算基礎：資料重用',
  back: {href: trBack, label: '返回「矩陣運算基礎」'},
  pages: [
    {id: 'open', section: '01 / 開場', title: '算一個 C 元素，要讀一整列和一整行',
      lead: 'C = A × B。C 的每一格是 A 的一列和 B 的一行做點積：乘法和加法都很便宜，但這些數字得先從記憶體送到計算單元。',
      art: trOpen,
      point: '每一格 C 需要 2N 個數、做 2N 次運算；本篇要數的是那 2N 個數從哪裡來、搬了幾次。'},
    {id: 'layers', section: '02 / 距離', title: '資料在遠處，計算在近處',
      lead: '矩陣放在 HBM。章節提到 SM 內有一塊小而快的 Shared Memory，可以由程式決定要把什麼先搬進來。',
      art: trLayers,
      point: '同一個運算元，從 HBM 拿和從 Shared Memory 拿，代價不同；能不能少跑遠路，看資料會不會被重複用到。'},
    {id: 'naive', section: '03 / 操作', title: '每一格各自去 HBM 拿，同一個數被搬好幾次',
      lead: '最直接的寫法：每個執行緒負責一格 C，自己從 HBM 讀 A 的一列與 B 的一行。拉動滑桿，看 16 格算完時每個元素被讀了幾次。',
      art: `<div class="trs-live"><label class="trs-control"><span data-k-label>已算完的 C 元素：6 / 16</span><input type="range" data-k min="0" max="16" step="1" value="6"></label><div data-naive-output></div></div>`,
      previewArt: `<div class="trs-live">${trNaiveView(16)}</div>`,
      mount: mountNaive,
      point: '算完時 A、B 的每個元素都被讀了 N = 4 次；總讀取 2N³ = 128，是「每個數只讀一次」的 4 倍。',
      detail: '本篇只數全域記憶體讀取，不含快取。真實 GPU 上相鄰執行緒的讀取常被 L1/L2 快取接住，實際 HBM 流量會低於 2N³；這裡的 naive 數字是「完全沒有重用」的情形。'},
    {id: 'reuse', section: '04 / 重用', title: '重複讀的，其實是可以共用的',
      lead: '看 C 的同一列：四格用的是 A 的同一列。這就是章節說的「資料重用」，運算本身就有，只是 naive 寫法沒有利用。',
      art: trReuse,
      point: '重用機會固定存在：A 的每一列被 C 同列的 N 格需要，B 的每一行被 C 同行的 N 格需要。'},
    {id: 'tiles', section: '05 / tiling', title: '先把一塊搬進共享記憶體，大家一起用',
      lead: '把 C 切成 T×T 的塊，每塊交給一個 block。block 分階段把 A、B 各一塊搬進 Shared Memory，之後所有執行緒都從 Shared Memory 讀。',
      art: trPhaseFig,
      point: '搬進來的每個 A 元素，會被 block 內同一列的 T 個執行緒使用；所以同一個數從 HBM 搬的次數，從 N 次降成 N/T 次。'},
    {id: 'tiled', section: '06 / 操作', title: 'tile 放大 T 倍，HBM 讀取就少 T 倍',
      lead: '選矩陣大小 N 和 tile 大小 T。格子裡的數字和長條都由同一個逐元素模擬算出，長條和 naive 用同一個尺度。',
      art: `<div class="trs-live"><div class="trs-control-row" data-tile-controls></div><div data-tile-output></div></div>`,
      previewArt: `<div class="trs-live">${trTiledView(4, 2)}</div>`,
      mount: mountTiled,
      point: '全域讀取 = 2N³ / T；運算次數與共享記憶體讀取都不變，改變的只有「從多遠的地方拿」。',
      detail: '與 CUDA C++ Programming Guide §3.2.4 一致：分塊後 A 只從全域記憶體讀 (B 的寬 / block_size) 次。tile 不能無限放大：共享記憶體容量與每個 block 的執行緒數都有上限，本篇不建模。'},
    {id: 'predict-count', section: '07 / 預測', title: '換一個沒看過的尺寸',
      lead: '新情況：N = 6、T = 3，前面的操作頁沒有這組。先想每個 A 元素會從 HBM 被讀幾次，再乘回總數。',
      art: `<figure class="trs-fig">${trParam([['矩陣', 'A、B、C 都是 6 × 6'], ['tile', '3 × 3，C 切成 4 塊'], ['每塊的階段數', '6 / 3 = 2'], ['只數', 'A、B 從全域記憶體的讀取次數']])}<figcaption>和第 06 頁同一個模型。</figcaption></figure>`,
      point: '先問：一個 A 元素會被幾個 block、在幾個階段搬進來？',
      question: {prompt: '全域讀取一共幾次？', hideFuturePreviews: true, choices: [
        {value: 'r144', label: '144 次', feedback: '對。naive 是 2 × 6³ = 432；T = 3 時每個元素只被 6 / 3 = 2 個 block 各搬一次，2 × 36 個元素 × 2 次 = 144 = 432 / 3。'},
        {value: 'r48', label: '48 次', feedback: '這是 432 / 9，把 tile 面積 T² 當成省下的倍數。一個搬進來的 A 元素只被 block 內同一列的 T 個執行緒用到，所以只省 T = 3 倍：432 / 3 = 144。'},
        {value: 'r72', label: '72 次', feedback: '72 = 2 × 6² 是每個元素只讀一次的下限，要 T = N = 6 才碰得到。T = 3 時每個 A 元素仍要被 2 個 block 各搬一次：144 次。'},
        {value: 'r432', label: '432 次', feedback: '432 是 naive 的 2N³。tiling 不減少運算，但減少從 HBM 搬的次數：每個元素從 6 次降到 2 次，總數 144。'}]}},
    {id: 'intensity', section: '08 / 算術強度', title: '每搬 1 byte，能做幾次運算？',
      lead: '運算量 2N³ 不變，搬運量隨 T 下降。兩者相除就是算術強度（FLOP/byte）：它描述一段程式有多「吃」記憶體頻寬。',
      art: trAITable,
      point: 'FP32 下 naive 只有 0.25 FLOP/byte；tile 放大 T 倍，算術強度也放大 T 倍。',
      detail: '算術強度的定義與 roofline 模型是教學補充（Williams, Waterman & Patterson, Communications of the ACM 52(4), 2009）；原文稱 operational intensity，並以快取之後的 DRAM 流量計算。'},
    {id: 'roofline', section: '09 / 操作', title: '算術強度決定你撞到哪一面牆',
      lead: '一台機器有兩個上限：記憶體每秒能送多少 byte、計算單元每秒能做多少 FLOP。選一個 T，看它落在斜線還是平頂上。',
      art: `<div class="trs-live">${trRoofButtons(4)}<div data-roof-output></div></div>`,
      previewArt: `<div class="trs-live">${trRoofView(4)}</div>`,
      mount: mountRoof,
      point: '屋脊點左邊，效能跟著算術強度一起漲，瓶頸是頻寬；右邊被峰值壓平，瓶頸變成計算。',
      detail: '章節把「矩陣乘法」列為 Compute Bound 的例子；在這個模型裡，那只在重用夠多（算術強度過屋脊點）時成立。T = 1 的 naive 寫法落在斜線最左端。'},
    {id: 'bounds', section: '10 / 邊界', title: '這個模型沒算的',
      lead: '計數模型只為了看清「重複搬運」與「重用」的差別。真實 kernel 還有很多因素。',
      art: `<figure class="trs-fig"><div class="trs-compare"><section><h3>本篇納入</h3><ul class="trs-list"><li>每個元素從 HBM 讀幾次（逐元素模擬）</li><li>共享記憶體讀取次數與每 block 用量</li><li>算術強度 = FLOP ÷ 讀取位元組</li><li>roofline 上限（教學假設參數）</li></ul></section><section><h3>本篇未納入</h3><ul class="trs-list"><li><b>L1／L2 快取</b>naive 的重複讀取有一部分會被快取接住</li><li><b>合併存取</b>記憶體以整段傳輸，讀取「次數」不等於傳輸量</li><li><b>bank conflict、同步</b>共享記憶體也有自己的衝突與等待</li><li><b>暫存器分塊</b>每個執行緒算多格 C，可再提高算術強度</li><li><b>容量上限</b>共享記憶體與執行緒數限制 T 的大小</li><li><b>C 的寫回</b>N² 次，兩種寫法相同</li></ul></section></div><figcaption>「暫存器分塊」屬教學補充，本篇不示範。所有結論都是上限與趨勢，不是任何 GPU 的實測效能。</figcaption></figure>`,
      point: '模型刻意簡化，但保留了機制：重用把搬運從 N 次降成 N/T 次，算術強度因此上升。'},
    {id: 'predict-roof', section: '11 / 預測', title: '頻寬加倍，誰會變快？',
      lead: '新情況：換一台假想機器，峰值不變、頻寬從 2 TB/s 加倍到 4 TB/s。前面的 roofline 沒有這台。先用 min(峰值, 頻寬 × 算術強度) 推。',
      art: `<figure class="trs-fig">${trParam([['峰值', '10 TFLOP/s（不變）'], ['頻寬', '2 TB/s → 4 TB/s'], ['kernel 甲', 'T = 4，算術強度 1 FLOP/byte'], ['kernel 乙', 'T = 32，算術強度 8 FLOP/byte']])}<figcaption>和第 09 頁同一個模型；參數都是教學假設。</figcaption></figure>`,
      point: '先問：兩個 kernel 在舊機器上各落在屋脊點的哪一邊？',
      question: {prompt: '兩個 kernel 的可達效能各變幾倍？', hideFuturePreviews: true, choices: [
        {value: 'both2', label: '都變 2 倍', feedback: '只有落在斜線上的會跟著頻寬走。甲：2 × 1 = 2 → 4 × 1 = 4 TFLOP/s，2 倍。乙：2 × 8 = 16 已被峰值壓成 10，頻寬加倍後 4 × 8 = 32 仍是 10，不變。'},
        {value: 'a2b1', label: '甲 2 倍，乙不變', feedback: '對。甲在屋脊點（舊機 5 FLOP/byte）左邊，受頻寬限制：2 → 4 TFLOP/s。乙原本就頂到峰值 10 TFLOP/s，頻寬再高也沒用。新機屋脊點移到 2.5，甲仍在左邊。'},
        {value: 'a1b2', label: '甲不變，乙 2 倍', feedback: '反了。乙的算術強度高，舊機就已頂到峰值 10 TFLOP/s；甲 1 FLOP/byte 才是被頻寬卡住的那個：2 → 4 TFLOP/s。'},
        {value: 'none', label: '都不變，峰值沒變', feedback: '峰值只壓住乙。甲 1 FLOP/byte 在舊機只有 2 × 1 = 2 TFLOP/s，離峰值很遠；頻寬加倍後變 4，快了 2 倍。'}]},
      detail: `<a href="${trBack}">回到章節「矩陣運算基礎」</a> · roofline 參數是教學假設；讀取次數只含全域記憶體讀取，不含快取。`},
  ],
};
