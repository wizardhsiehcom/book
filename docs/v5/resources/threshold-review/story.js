// 固定合成集合；每個 count 都代表互不重複的受檢單位，不是公司測試資料。
const reviewBins = [
  [5, 0, 22], [15, 0, 20], [25, 0, 16], [35, 1, 12], [45, 1, 8],
  [55, 1, 5], [65, 1, 3], [75, 2, 2], [85, 2, 1], [95, 2, 1],
];
// 工時假設：每小時送入與 reviewBins 同分布的一批；所有長度都由以下常數與計數推導。
const reviewMinutesEach = 2, reviewCapacity = 60;
const reviewTotal = reviewBins.reduce((s, [, d, g]) => s + d + g, 0);
const reviewScale = reviewTotal * reviewMinutesEach; // 全部送複判時的分鐘數，作為共同滿格
const reviewBinMax = Math.max(...reviewBins.flatMap(([, d, g]) => [d, g]));
function reviewCounts(threshold) {
  const counts = {tp: 0, fp: 0, fn: 0, tn: 0};
  for (const [score, defects, good] of reviewBins) {
    counts[score >= threshold ? 'tp' : 'fn'] += defects;
    counts[score >= threshold ? 'fp' : 'tn'] += good;
  }
  return counts;
}
function reviewRatio(n, d) { return d ? `${n} / ${d} = ${Number((n / d * 100).toFixed(2))}%` : `${n} / 0：無定義`; }
function reviewLoad(threshold) {
  const {tp, fp} = reviewCounts(threshold);
  const candidates = tp + fp;
  return {candidates, minutes: candidates * reviewMinutesEach, excess: Math.max(0, candidates - reviewCapacity / reviewMinutesEach)};
}
const reviewPct = (n, d) => `${Number((n / d * 100).toFixed(3))}%`;
// 分流條：flex 直接用個數（basis 0、無間距），寬度與個數成正比；0 個就不畫。
function reviewSeg(cls, n, name) { return n ? `<span class="rev-seg ${cls}" style="flex:${n} 1 0" data-count="${n}" title="${name} ${n}"></span>` : ''; }
const reviewKey = '<p class="rev-key"><span><i class="rev-sw rev-sw-defect"></i>缺陷（參考判定）</span><span><i class="rev-sw rev-sw-good"></i>良好</span><span><i class="rev-sw rev-sw-review"></i>送複判</span></p>';
function reviewStrip(t) {
  const c = reviewCounts(t), review = c.tp + c.fp, pass = c.fn + c.tn;
  return `<div class="rev-strip-wrap" data-review-strip role="img" aria-label="${reviewTotal} 個單位：送複判 ${review}（真缺陷 ${c.tp}、良好 ${c.fp}），放行 ${pass}（漏檢 ${c.fn}、良好 ${c.tn}）；長度按個數">`
    + `<div class="rev-strip">${reviewSeg('rev-defect', c.tp, '送複判・真缺陷')}${reviewSeg('rev-good', c.fp, '送複判・良好')}${reviewSeg('rev-defect rev-pass', c.fn, '放行・漏檢')}${reviewSeg('rev-good rev-pass', c.tn, '放行・良好')}</div>`
    + `<div class="rev-route-bar">${review ? `<span class="rev-route-review" style="flex:${review} 1 0" data-count="${review}"></span>` : ''}${pass ? `<span class="rev-route-pass" style="flex:${pass} 1 0" data-count="${pass}"></span>` : ''}</div></div>`;
}
function reviewPopulation() {
  const c = reviewCounts(0), defects = c.tp, good = c.fp;
  return `<figure class="rev-fig"><p class="rev-total"><b>${reviewTotal} 個受檢單位</b><span>每個只算一次</span></p>`
    + `<div class="rev-strip" role="img" aria-label="${defects} 個缺陷、${good} 個良好；長度按個數">${reviewSeg('rev-defect', defects, '缺陷')}${reviewSeg('rev-good', good, '良好')}</div>`
    + `<div class="rev-branches"><div class="rev-node"><b><i class="rev-sw rev-sw-defect"></i>${defects} 個有缺陷</b><span>參考判定為缺陷</span></div><div class="rev-node"><b><i class="rev-sw rev-sw-good"></i>${good} 個良好</b><span>參考判定為良好</span></div></div>`
    + `<figcaption>橫條按個數畫成 ${defects} : ${good}；下方兩格等寬只為放文字。沒有未知或遺失資料。</figcaption></figure>`;
}
// 分數帶：同一尺度（最多 reviewBinMax 個）畫良好向左、缺陷向右；門檻線切在第一個送複判的分數之前。
function reviewBands(threshold) {
  let cut = false;
  const bar = (cls, n) => `<span class="rev-hbar ${cls}"><i style="--r:${n / reviewBinMax}"></i><b>${n}</b></span>`;
  const rows = reviewBins.map(([score, d, g]) => {
    const inReview = score >= threshold;
    const line = inReview && !cut ? (cut = true, `<div class="rev-cut"><span>門檻 ${threshold}：以下各列分數 ≥ ${threshold}，送複判</span></div>`) : '';
    return `${line}<div class="rev-band${inReview ? ' rev-in' : ''}"><strong>${score}</strong>${bar('rev-good', g)}${bar('rev-defect', d)}<span class="rev-route">${inReview ? '複判' : '放行'}</span></div>`;
  }).join('');
  return `<div class="rev-bands" aria-label="各分數的良好與缺陷個數"><div class="rev-band rev-band-head"><span>分數</span><span>← 良好</span><span>缺陷 →</span><span>分流</span></div>${rows}<p class="rev-scale">長條長度按個數，兩側同一尺度（滿格 ${reviewBinMax} 個）。</p></div>`;
}
function reviewMeter(t) {
  const {minutes} = reviewLoad(t), within = Math.min(minutes, reviewCapacity), over = minutes - within;
  return `<div class="rev-meter-wrap" data-review-meter><div class="rev-meter" role="img" aria-label="每小時需求 ${minutes} 分鐘；容量 ${reviewCapacity} 分鐘；滿格 ${reviewScale} 分鐘">`
    + `<span class="rev-meter-in" style="width:${reviewPct(within, reviewScale)}" data-minutes="${within}"></span>${over ? `<span class="rev-meter-over" style="width:${reviewPct(over, reviewScale)}" data-minutes="${over}"></span>` : ''}`
    + `<i class="rev-cap" style="left:${reviewPct(reviewCapacity, reviewScale)}"></i></div>`
    + `<div class="rev-axis" aria-hidden="true"><span>0</span><span class="rev-axis-cap" style="left:${reviewPct(reviewCapacity, reviewScale)}">容量 ${reviewCapacity}</span><span>${reviewScale} 分鐘</span></div></div>`;
}
function reviewLive(threshold, cls = 'rev-live') {
  const w = reviewLoad(threshold), c = reviewCounts(threshold);
  return `<section class="rev-livebox ${cls}${w.excess ? ' rev-over' : ''}">${reviewStrip(threshold)}${reviewKey}`
    + `<p class="rev-split-text"><span><b>送複判 ${w.candidates}</b>：真缺陷 ${c.tp}、良好 ${c.fp}</span><span>放行 ${c.fn + c.tn}：漏檢 ${c.fn}、良好 ${c.tn}</span></p>`
    + `<p class="rev-load"><strong>${w.candidates} 候選／小時 → ${w.minutes} 分鐘／小時</strong><span>每候選 ${reviewMinutesEach} 分鐘</span></p>${reviewMeter(threshold)}`
    + `<p class="rev-verdict">${w.excess ? `超出容量 ${w.excess} 候選／小時。` : '總需求未超出容量。'}</p></section>`;
}
function reviewSplit(t) {
  const c = reviewCounts(t);
  return `<figure class="rev-fig"><p class="rev-total"><b>${reviewTotal} 個受檢單位</b><span>分數 ≥ ${t} 送複判，其餘放行</span></p>${reviewStrip(t)}${reviewKey}`
    + `<div class="rev-branches"><div class="rev-node rev-node-review"><b>送複判 ${c.tp + c.fp}</b><span>TP：真缺陷 <strong>${c.tp}</strong></span><span>FP：良好 <strong>${c.fp}</strong></span></div>`
    + `<div class="rev-node"><b>直接放行 ${c.fn + c.tn}</b><span>FN：漏過缺陷 <strong>${c.fn}</strong></span><span>TN：良好 <strong>${c.tn}</strong></span></div></div>`
    + `<figcaption>上條按個數排成 TP、FP、FN、TN；朱紅底線是送複判的範圍。下方兩格等寬只為放文字。</figcaption></figure>`;
}
function reviewMatrix(t) {
  const c = reviewCounts(t);
  return `<div class="rev-branches"><div class="rev-node rev-node-review"><b>送複判 ${c.tp + c.fp}</b><span>TP：真缺陷 <strong>${c.tp}</strong></span><span>FP：良好 <strong>${c.fp}</strong></span></div><div class="rev-node"><b>直接放行 ${c.fn + c.tn}</b><span>FN：漏過缺陷 <strong>${c.fn}</strong></span><span>TN：良好 <strong>${c.tn}</strong></span></div></div>`;
}
function reviewShift(from, to) {
  // left = 門檻 / 100，width = (100 − 門檻) / 100；新門檻的軌道把新增的 [to, from) 另以朱紅標出。
  const span = (a, b, cls = '') => `<span class="${cls}" style="left:${reviewPct(a, 100)};width:${reviewPct(b - a, 100)}"></span>`;
  const track = (t, added) => `<div class="rev-track">${span(Math.max(t, from), 100)}${added ? span(to, from, 'rev-added') : ''}</div>`;
  const ticks = `<div class="rev-ticks" aria-hidden="true">${reviewBins.map(([s]) => `<i class="${s >= to && s < from ? 'rev-tick-new' : ''}" style="left:${reviewPct(s, 100)}">${s}</i>`).join('')}</div>`;
  return `<figure class="rev-fig"><p class="rev-kicker">分數軸 0–100；刻度是十個固定分數帶</p>${ticks}`
    + `<div class="rev-range"><p><b>原門檻 ${from}</b>${from}–100 送複判</p>${track(from, false)}</div>`
    + `<div class="rev-range rev-range-new"><p><b>新門檻 ${to}</b>${to}–100 送複判</p>${track(to, true)}</div>`
    + `<figcaption>色段含左端（分數 = 門檻也送複判）。朱紅是新進入複判範圍的區段與分數帶；灰段兩次相同，每個單位的分數本身沒有改變。</figcaption></figure>`;
}
function mountReview(root, state) {
  state.threshold ??= 60;
  const slider = root.querySelector('[data-threshold]');
  const output = root.querySelector('[data-review-output]');
  const label = root.querySelector('[data-threshold-label]');
  const render = () => {
    slider.value = state.threshold;
    label.textContent = `門檻 ${state.threshold}：分數 ≥ ${state.threshold} 送複判`;
    slider.setAttribute('aria-valuetext', `門檻 ${state.threshold}，分數大於等於門檻送複判`);
    output.innerHTML = reviewLive(state.threshold) + `<details><summary>展開四格與各分數計數</summary>${reviewMatrix(state.threshold)}${reviewBands(state.threshold)}</details>`;
  };
  const change = () => { state.threshold = Number(slider.value); render(); };
  slider.addEventListener('input', change); render();
  return () => slider.removeEventListener('input', change);
}
function reviewMetrics(t) {
  const c = reviewCounts(t);
  const row = (q, n, d) => `<div class="rev-metric"><dt>${q}</dt><dd><span class="rev-ratio" role="img" aria-label="${reviewRatio(n, d)}">${d ? `<i style="width:${reviewPct(n, d)}"></i>` : ''}</span>${reviewRatio(n, d)}</dd></div>`;
  return `<section class="rev-col"><h3>門檻 ${t}</h3><dl class="rev-metrics">${row('召回率：全部真缺陷中找到多少', c.tp, c.tp + c.fn)}${row('假警報率：全部良好中攔下多少', c.fp, c.fp + c.tn)}${row('精確率：候選中多少是真缺陷', c.tp, c.tp + c.fp)}${row('放行品中多少有缺陷', c.fn, c.fn + c.tn)}</dl></section>`;
}
function reviewWork(t) {
  const w = reviewLoad(t);
  return `<section class="rev-col${w.excess ? ' rev-over' : ''}"><h3>門檻 ${t}</h3><p class="rev-number">${w.minutes}<small> 分鐘需求／小時</small></p><p class="rev-sub">${w.candidates} 候選 × ${reviewMinutesEach} 分鐘</p>${reviewMeter(t)}<p class="rev-verdict">${w.excess ? `持續輸入下，每小時至少累積 ${w.excess} 個未判候選。` : '總工作量低於容量；仍可能因批次到達而等待。'}</p></section>`;
}
const story = {
  title: '門檻更敏感，為什麼複判更忙？', label: '倍利 V5 / 品質、分流與負荷',
  back: {href: '../../04-defects-and-quality.html', label: '返回第 04 章'},
  pages: [
    {id:'fixed-population', section:'01 / 先固定同一批', title:'100 個受檢單位，始終是這 100 個',
      lead:'我們替每個單位打一次異常分數，再決定是否送複判。先固定集合，才看得出門檻改了什麼。',
      art:reviewPopulation(),
      point:'參考判定用來事後評估；分流時，系統只看分數與門檻。',
      detail:'全部數字是自建教學資料，不是倍利測試結果，也不是第 04 章的 10,000 個算例。假設參考判定可信；真實驗收需另列爭議與未知。'},
    {id:'score-overlap', section:'02 / 分數會重疊', title:'分數高，比較可疑；仍可能是良好',
      lead:'每列是一個固定分數，數字是個數。良好與缺陷會拿到相同分數，所以門檻無法完美切開兩群。',
      art:reviewBands(60), point:'分數是排序用的教學量尺；95 不表示有 95% 機率是缺陷。',
      detail:'表內良好／缺陷是參考標籤，數字為個數；長條長度與個數成正比，兩側共用同一尺度。<a href="https://scikit-learn.org/stable/modules/calibration.html">scikit-learn：機率校準</a>。'},
    {id:'routing-rule', section:'03 / 寫清楚規則', title:'分數 ≥ 60，先送複判',
      lead:'門檻相等也送複判；低於門檻在本模型中直接放行。這一步還沒有決定報廢誰。',
      art:reviewSplit(60), point:'14 個候選中有 7 個良好；它們是假警報，尚不能算成最終誤殺。',
      detail:'TP／FP 是此分流步驟的真／假陽性，FN／TN 是假／真陰性。複判正確率與最終處置未納入本模型。'},
    {id:'predict-lower', section:'04 / 先猜再調', title:'門檻從 60 降到 30，誰也跟著進來？',
      lead:'原本 35、45、55 分的單位都會從放行轉成複判；已送複判的高分單位仍留下。',
      art:reviewShift(60, 30),
      point:'降低門檻只擴大這個固定集合的候選範圍，不會修改原分數。',
      question:{prompt:'新增的候選包含哪些單位？',hideFuturePreviews:true,choices:[
        {value:'defects-only',label:'只有原本漏過的真缺陷',feedback:'看分數帶：35、45、55 分同時有良好單位，它們也會一起進來。'},
        {value:'both',label:'真缺陷與良好單位都有',feedback:'對。多找到 3 個真缺陷，也增加 25 個良好候選。下一頁可親手驗算。'},
      ]}},
    {id:'change-threshold', section:'05 / 親手分流', title:'只改門檻，看同一批如何移動',
      lead:'拖動滑桿，同時看分流與工時。假設每小時 100 個同分布單位、每候選 2 分鐘，一人容量 60 分鐘／小時。',
      art:'<label class="rev-control"><span data-threshold-label>門檻 60</span><input data-threshold type="range" min="0" max="100" step="5" value="60" aria-label="異常分數門檻"></label><div data-review-output class="rev-output" role="status" aria-live="polite"></div>',
      previewArt:`<p class="rev-control-static"><span>門檻 60：分數 ≥ 60 送複判</span></p><div class="rev-output">${reviewLive(60, 'rev-live-preview')}</div>`, mount:mountReview,
      point:'同一批固定分數下，降低門檻使漏檢不增加、假警報不減少；中間可能有不變的區段。',
      detail:'這是單一分數門檻的確定性模型；不代表更換演算法、recipe 或樣本後也會得到相同曲線。離頁再返回保留選值。'},
    {id:'denominators', section:'06 / 分母不能省略', title:'「找到多少」與「候選多準」，問的是兩件事',
      lead:'以下固定比較門檻 60 與 30，不跟隨上一頁滑桿。召回率上升，不保證候選精確率也上升。',
      art:`<figure class="rev-fig"><p class="rev-kicker">同一批 100 個單位，只改門檻；每條比例都以自己的分母為滿格</p><div class="rev-compare">${reviewMetrics(60)}${reviewMetrics(30)}</div></figure>`,
      point:'門檻 30 找到全部 10 個缺陷，卻送出 42 個候選；候選中只有約 23.81% 是真缺陷。',
      detail:'漏檢率另以 FN / 10 計，分別為 30% 與 0%；不能與「放行品中的缺陷比例」混用。本批零漏檢不證明未來零漏檢。<a href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html">scikit-learn：門檻、precision 與 recall</a>。'},
    {id:'review-capacity', section:'07 / 沿流程算負荷', title:'候選多了，後端能接住嗎？',
      lead:'假設每小時持續送入同樣分布的 100 個單位，每候選判讀 2 分鐘；一人每小時提供 60 分鐘純判讀。',
      art:`<figure class="rev-fig"><p class="rev-kicker">每小時 ${reviewTotal} 個同分布單位 · 每候選 ${reviewMinutesEach} 分鐘</p><div class="rev-compare">${reviewWork(60)}${reviewWork(30)}</div><figcaption>兩條同以 ${reviewScale} 分鐘（全部送複判）為滿格；直線是一人容量 ${reviewCapacity} 分鐘，超出部分以朱紅標示。</figcaption></figure>`,
      point:'門檻 30 需要 84 分鐘／小時；理想容量只有 30 個候選／小時，持續輸入 42 個就會累積。',
      detail:'此為工作量算術，不是排隊時間模擬。尚未計搬送、開圖、抽查、補拍與休息，難例也可能花更久；現場可用容量通常更小。'},
    {id:'adc-routing', section:'08 / 再接 ADC', title:'自動分類之後，還要保留人工與待查路徑',
      lead:'前面的模型把所有候選交給人工。若加入 ADC，就多了一個需要獨立驗證的分流步驟。',
      art:'<figure class="rev-fig"><div class="rev-flow"><div class="rev-node"><b>候選送入 ADC</b></div><div class="rev-arrow" aria-hidden="true">↓</div><div class="rev-node rev-decision"><b>影像、座標與版本完整，且符合已驗證條件嗎？</b></div><div class="rev-branches"><div><div class="rev-arrow">是 ↓</div><div class="rev-node"><b>依批准規則自動處理</b><span>保留抽查，定期重驗</span></div></div><div><div class="rev-arrow">否 ↓</div><div class="rev-node rev-node-review"><b>缺圖、陌生或低信心</b><span>人工／補充檢查；不能直接當良品</span></div></div></div></div><figcaption>兩條路都還要人力：抽查與維護在左，難例在右。本圖不含比例。</figcaption></figure>',
      point:'自動處理比例不等於人力節省比例；剩下的難例、抽查與維護仍需工時。',
      detail:'這是第 08 章的教學流程，沒有假設倍利已提供所有分支或放行權限。本篇不模擬 ADC 的錯誤與最終報廢；端到端品質需要另驗。'},
    {id:'joint-acceptance', section:'09 / 回到共同驗收', title:'換成門檻 50，先算後端的負荷',
      lead:'仍是每小時 100 個同分布單位，每候選 2 分鐘。門檻改成 50，哪些分數會送複判？先加總再判斷。',
      art:reviewBands(50),
      point:'以候選總數乘每候選工時，再與可用容量比較。',
      question:{prompt:'門檻 50 的每小時需求是多少？一人容量能否承接總工作量？',hideFuturePreviews:true,choices:[
        {value:'fits',label:'20 個候選、40 分鐘，未超出容量',feedback:'對。55–95 分共 6+4+4+3+3=20 個候選；20×2=40 分鐘，低於 60。仍不保證沒有等待或未來沒有漏檢。'},
        {value:'overflow',label:'40 個候選、80 分鐘，超出容量',feedback:'先加總個數：55–95 分共 20 個候選。每個 2 分鐘，所以是 40 分鐘／小時；個數和分鐘不能混用。'}]},
      detail:'<a href="../../04-defects-and-quality.html">第 04 章：品質分母</a> · <a href="../../08-adc-and-human-review.html">第 08 章：ADC 與人工</a> · <a href="../../13-throughput-and-acceptance.html">第 13 章：產能與驗收</a>。所有算例為教學自建。'},
  ],
};
