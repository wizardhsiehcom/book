// 刺激用 sRGB 像素值（0–255），不是物理亮度。兩塊灰與橋一律用 sgGray，這是全篇唯一定義處。
const sgGray = '#808080', sgGrayValue = 128;
const sgDark = 32, sgLight = 224, sgWhite = 255;
const sgHex = v => `#${Math.round(v).toString(16).padStart(2, '0').repeat(3)}`;
const sgFmt = n => (n > 0 ? '＋' : '') + String(n).replace('-', '−');

// 刺激：兩格並排、中間無縫。left/right 為背景像素值，null 表示移除背景。
function sgScene({left = sgDark, right = sgLight, bridge = false, rf = false, patch = false} = {}) {
  const panel = (v, side) => `<div class="sg-panel${v === null ? ' sg-off' : ''}"${v === null ? '' : ` style="background:${sgHex(v)}"`}>${patch && side === 'left' ? `<span class="sg-patch" style="background:${sgHex(sgWhite)}"></span>` : ''}<span class="sg-target" style="background:${sgGray}"></span>${rf ? '<span class="sg-rf-c"></span><span class="sg-rf-s"></span>' : ''}</div>`;
  const name = v => v === null ? '背景已移除' : `背景 ${v}`;
  return `<div class="sg-scene-wrap"><div class="sg-scene">${panel(left, 'left')}${panel(right, 'right')}${bridge ? `<span class="sg-bridge" style="background:${sgGray}"></span>` : ''}</div><div class="sg-names"><span>${name(left)}</span><span>${name(right)}</span></div></div>`;
}

// 頁 02：三種觀看模式
const sgModes = {
  original: ['原圖', {}, '原圖：兩塊灰各在自己的背景上。'],
  remove: ['移除背景', {left: null, right: null}, '背景移除：兩塊灰放在同一張紙上，周圍相同。若現在看起來一樣，先前的差異來自背景，不是灰塊本身。'],
  bridge: ['接上橋', {bridge: true}, '接上橋：中間這條和兩塊灰是同一個顏色值，從左到右沒有接縫。橋在兩種背景上的段落也可能看起來不同，那是同一個效果。'],
};
function sgRevealView(mode) {
  const [, opts, text] = sgModes[mode];
  return `<p class="sg-verdict">${text}</p>${sgScene(opts)}<p class="sg-chip"><i style="background:${sgGray}"></i>兩塊灰${mode === 'bridge' ? '與橋' : ''}的填色：${sgGray}（像素值 ${sgGrayValue}），三種模式都沒有改動。</p>`;
}
function mountReveal(root, state) {
  state.mode ??= 'original';
  const box = root.querySelector('[data-sg-modes]'), out = root.querySelector('[data-sg-reveal]');
  const render = () => { out.innerHTML = sgRevealView(state.mode); box.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === state.mode))); };
  const click = e => { const m = e.target.closest?.('button')?.dataset.mode ?? e.target.dataset?.mode; if (sgModes[m]) { state.mode = m; render(); } };
  box.addEventListener('click', click); render();
  return () => box.removeEventListener('click', click);
}

// 頁 03：Hering 的中心-周圍比較，以「中心 − 周圍」像素值差示意（不是放電模型）。
const sgCS = surround => sgGrayValue - surround;
const sgAxis = 128;
function sgSurroundView(left) {
  const bar = (name, bg) => {
    const d = sgCS(bg), w = Math.abs(d) / sgAxis * 50;
    return `<div class="sg-bar"><span class="sg-bar-name">${name}：${sgGrayValue} − ${bg}</span><span class="sg-track"><i style="${d >= 0 ? 'left:50%' : `left:${50 - w}%`};width:${w}%"></i></span><b class="sg-bar-val">${sgFmt(d)}</b></div>`;
  };
  const same = left === sgLight;
  const text = same ? `兩格背景都是 ${sgLight}：左右像素完全相同，兩個差值也相同（${sgFmt(sgCS(sgLight))}）。`
    : `左背景比右背景暗 ${sgLight - left}：左邊的「中心 − 周圍」比右邊大 ${sgCS(left) - sgCS(sgLight)}。依 Hering 的解釋，比較訊號較大的一側看起來較亮。`;
  return `<p class="sg-verdict">${text}</p><div class="sg-split">${sgScene({left, rf: true})}<figure class="sg-bars" role="img" aria-label="中心減周圍：左 ${sgCS(left)}，右 ${sgCS(sgLight)}">
    <div class="sg-bar sg-bar-head"><span class="sg-bar-name">中心 − 周圍（像素值）</span><span class="sg-track sg-axis"><em style="left:0">−${sgAxis}</em><em style="left:50%">0</em><em style="left:100%">＋${sgAxis}</em></span><span></span></div>
    ${bar('左', left)}${bar('右', sgLight)}
    <figcaption>實線圈＝中心，虛線圈＝周圍。差值直接用像素值相減，只示意方向，不是神經元放電模型，也沒有真實感受野大小。</figcaption></figure></div>`;
}
function mountSurround(root, state) {
  state.left ??= sgDark;
  const input = root.querySelector('[data-sg-left]'), label = root.querySelector('[data-sg-left-label]'), out = root.querySelector('[data-sg-surround]');
  const render = () => {
    input.value = state.left; label.textContent = `左背景像素值 ${state.left}（右背景固定 ${sgLight}）`;
    input.setAttribute('aria-valuetext', `左背景 ${state.left}`); out.innerHTML = sgSurroundView(state.left);
  };
  const change = () => { state.left = Number(input.value); render(); };
  input.addEventListener('input', change); render();
  return () => input.removeEventListener('input', change);
}

// 頁 04：Helmholtz，R = L ÷ I；示意數字。
const sgL = 0.3, sgGuess = {left: 0.5, right: 1.0};
const sgR = (L, I) => L / I;
function sgInferView() {
  const col = (name, I, why) => {
    const R = sgR(sgL, I), row = (k, v, cls = '') => `<div class="sg-row${cls}"><span>${k}</span><span class="sg-len"><i style="width:${v * 100}%"></i></span><b>${v.toFixed(1)}</b></div>`;
    return `<section><h3>${name}</h3>${row('進眼亮度 L', sgL)}${row('猜的光照 I', I)}<p class="sg-why">${why}</p>${row('反射率 R = L ÷ I', R, ' sg-row-r')}</section>`;
  };
  return `<figure class="sg-fig"><div class="sg-compare">${col('暗背景中的灰塊', sgGuess.left, '暗背景 → 當成陰影 → I 猜得小')}${col('亮背景中的灰塊', sgGuess.right, '亮背景 → 當成強光 → I 猜得大')}</div>
    <figcaption>長條以 0–1 為滿格，同一比例。L、I 是示意數字，只表達方向；兩邊 L 相同，因為兩塊灰是同一個顏色值。</figcaption></figure>`;
}

// 頁 06、08：光照框架內最亮者當作白（章節的錨定規則）。
const sgAnchor = values => Math.max(...values);
function sgScale(name, items) {
  const top = sgAnchor(items.map(([, v]) => v)), fill = (v, target) => target ? sgGray : sgHex(v);
  const marks = items.map(([, v, target]) => `<span class="sg-mark" style="left:${v / 255 * 100}%"><i style="background:${fill(v, target)}"></i></span>`).join('');
  const legend = [...items].sort((a, b) => a[1] - b[1]).map(([k, v, target]) => `<span class="${target ? 'sg-leg-target' : ''}"><i style="background:${fill(v, target)}"></i>${k} ${v}${v === top ? '<b>（最亮 → 當作白）</b>' : ''}</span>`).join('');
  return `<div class="sg-frame"><h3>${name}</h3><div class="sg-scale">${marks}<b class="sg-anchor" style="left:${top / 255 * 100}%">當作白</b></div><div class="sg-ends"><span>0</span><span>255</span></div><p class="sg-legend">${legend}</p></div>`;
}
const sgTarget = (items, anchorText) => {
  const top = sgAnchor(items.map(([, v]) => v));
  return top === sgGrayValue ? `灰塊就是框架內最亮的 → 錨點本身，${anchorText}` : `框架內最亮的是 ${top} → 灰塊比錨點暗，${anchorText}`;
};
const sgFrames = {left: [['背景', sgDark], ['灰塊', sgGrayValue, true]], right: [['背景', sgLight], ['灰塊', sgGrayValue, true]]};
function sgAnchorView() {
  return `<figure class="sg-fig"><div class="sg-frames">${sgScale('左框架（暗背景）', sgFrames.left)}<p class="sg-read">${sgTarget(sgFrames.left, '往白的方向評')}</p>${sgScale('右框架（亮背景）', sgFrames.right)}<p class="sg-read">${sgTarget(sgFrames.right, '評為比白暗')}</p></div>
    <figcaption>刻度是像素值 0–255，只表達順序。灰塊標記的填色就是 ${sgGray}。「左右各一個框架」是讀這張圖的假設：經典圖只有兩塊背景，框架線索很弱。</figcaption></figure>`;
}

const sgBack = '../../12-lightness-and-color.html';
const sgList = (h, items) => `<section><h3>${h}</h3><ul class="sg-list">${items.map(([b, t]) => `<li><b>${b}</b>${t}</li>`).join('')}</ul></section>`;

const story = {
  title: '同一灰色，為何看起來不同？', label: 'MIT 9.35 / 12 亮度知覺與顏色知覺',
  back: {href: sgBack, label: '返回第 12 章'},
  pages: [
    {id: 'judge', section: '01 / 先看', title: '哪一塊中間的灰色比較亮？',
      lead: '先別往下讀。左邊的方塊放在暗背景上，右邊的放在亮背景上。直接看中間的兩塊方塊。',
      art: sgScene(),
      question: {prompt: '哪一塊中間的方塊看起來比較亮？', hideFuturePreviews: true, choices: [
        {value: 'left', label: '左邊（暗背景上）的較亮', feedback: '章節描述的正是這個方向：暗背景中的看起來較亮，亮背景中的看起來較暗。下一頁核對兩塊的實際顏色值。'},
        {value: 'right', label: '右邊（亮背景上）的較亮', feedback: '這和章節描述的方向相反。你的螢幕、亮度設定、觀看距離，或你正盯著邊緣比較，都可能影響看到的結果。下一頁核對兩塊的實際顏色值。'},
        {value: 'same', label: '看起來差不多', feedback: '這也合理：課堂上提到這個經典版本的效果本來就不大，且隨螢幕、亮度設定與觀看距離而不同。章節描述的方向是暗背景中的較亮。下一頁核對兩塊的實際顏色值。'}]},
      point: '先記下你的判斷，下一頁再核對。',
      detail: '沒有標準答案要背：這一頁問的是你看到什麼，而看到多少差異因人、因螢幕而異。'},
    {id: 'reveal', section: '02 / 揭曉', title: '兩塊是同一個顏色值',
      lead: '兩塊灰由同一個常數填色。切換模式：移除背景，或在兩塊之間接一條同色的橋，自己看。',
      art: `<div class="sg-live"><div class="sg-buttons" data-sg-modes>${Object.entries(sgModes).map(([k, [n]]) => `<button type="button" data-mode="${k}" aria-pressed="false">${n}</button>`).join('')}</div><div class="sg-out" data-sg-reveal></div></div>`,
      previewArt: `<div class="sg-live"><div class="sg-out">${sgRevealView('bridge')}</div></div>`,
      mount: mountReveal,
      point: '灰塊本身從頭到尾沒有變，改變的只有它的周圍。看起來的明暗不等於顏色值。',
      detail: `像素值不是物理亮度：螢幕把 ${sgGray} 轉成實際的光，這個轉換隨螢幕與亮度設定而不同；但兩塊經過的是同一個轉換，所以進眼的亮度仍然相同。章節用實體表面說「反射率完全相同」，在螢幕上對應的是顏色值相同。`},
    {id: 'surround', section: '03 / 解釋一：Hering', title: '只改背景，中心與周圍的差就變了',
      lead: `Hering 認為這是神經機制的結果：視網膜與外側膝狀體有「中心-周圍」感受野，會比較落在中心與落在周圍的光。拖動左背景；灰塊的值始終是 ${sgGrayValue}。`,
      art: `<div class="sg-live"><label class="sg-control"><span data-sg-left-label>左背景像素值 ${sgDark}（右背景固定 ${sgLight}）</span><input type="range" data-sg-left min="${sgDark}" max="${sgLight}" step="8" value="${sgDark}"></label><div data-sg-surround></div></div>`,
      previewArt: `<div class="sg-live">${sgSurroundView(sgDark)}</div>`,
      mount: mountSurround,
      point: '灰塊不動，改的只有周圍；「中心 − 周圍」的比較因此改變。背景越暗，這個差值越大。',
      detail: '拉到 224 時，左右兩格完全相同，這是本頁的對照條件。中心-周圍感受野見第 07–09 章。'},
    {id: 'inference', section: '04 / 解釋二：Helmholtz', title: '把暗背景當成陰影，就會推出較白的表面',
      lead: 'Helmholtz 認為這是無意識推論：大腦用 L = I × R 解釋場景，把亮背景當成光照強、暗背景當成陰影。進眼的亮度 L 相同時，推出的反射率 R = L ÷ I 就不同。',
      art: sgInferView(),
      point: '同樣的 L，猜的光照越弱，推出的反射率越高，表面看起來越白。',
      detail: 'L = I × R 與「明度是對反射率的知覺」見第 11 章。'},
    {id: 'levels', section: '05 / 兩種解釋', title: '生理或推論？兩者不互斥',
      lead: '十九世紀兩派爭論激烈：一方說同時對比是生理的，一方說是心理的。章節引用的現代觀點認為，它們描述的是不同層次。',
      art: `<figure class="sg-fig"><div class="sg-compare">${sgList('Hering：神經機制', [['層次', '生理：早期視覺的濾波'], ['怎麼運作', '中心-周圍感受野比較中心與周圍的光'], ['暗背景中的灰塊', '比較訊號較大 → 較亮']])}${sgList('Helmholtz：無意識推論', [['層次', '心理：對場景的推論'], ['怎麼運作', '把背景當光照線索，解 L = I × R'], ['暗背景中的灰塊', '光照猜得弱 → 反射率推得高 → 較白']])}</div><p class="sg-join">兩者預測同一個方向。推論總要由神經實作；早期的中心-周圍濾波可以是推論的一部分。</p></figure>`,
      point: '大腦的「推論」本質上透過底層的神經濾波來實現，兩種解釋回答的是不同層次的問題。',
      detail: '章節以 David Marr 的多層次分析說明：同一現象可以在計算、演算法與神經實作等層次各有解釋。'},
    {id: 'anchor', section: '06 / 光照框架', title: '每個框架裡，最亮的當作白',
      lead: '章節說，大腦會用陰影邊界的半影、T 型或 X 型接點等局部線索，把畫面分成幾個光照框架，在各框架內把最高亮度當作白、最低當作黑，再評估其他表面。假設左右兩半各是一個框架：',
      art: sgAnchorView(),
      point: '同一個 128，在左框架是最亮的，在右框架比最亮的暗；錨點不同，評出的明度就不同。',
      detail: '課堂補充（章節正文未寫）：經典兩塊背景圖的框架線索很弱，課堂上指出這版效果不大；加入清楚光照邊界的版本（如 snake illusion）差異大得多，見 E. H. Adelson (2000), “Lightness perception and lightness illusions”。錨定規則的完整理論見 A. Gilchrist et al. (1999), Psychological Review 106(4)。'},
    {id: 'limits', section: '07 / 邊界', title: '效果多強，取決於你怎麼看',
      lead: '前面沒有說「你一定看到」。同一份檔案在不同條件下，進到眼睛的刺激就不同。',
      art: `<figure class="sg-fig"><div class="sg-compare">${sgList('會改變強弱的觀看條件', [['螢幕與亮度設定', '同一個像素值，不同螢幕發出的光不同'], ['環境光', '螢幕外的整體亮度改變'], ['觀看距離', '灰塊與背景在視網膜上的大小（視角）改變']])}${sgList('本篇不宣稱', [['每個人都看到', '看到多少差異因人而異，也可能很小'], ['差異有多大', '沒有量測，也不給數字'], ['哪個解釋才對', 'Hering 與 Helmholtz 回答不同層次']])}</div><figcaption>教學補充：這些條件改變的是進眼的刺激；它們讓效果變強或變弱的方向，本篇沒有量測，不下結論。</figcaption></figure>`,
      point: '本篇核對的是「兩塊顏色值相同」，不是「你一定看到多少差異」。',
      detail: '若想比較，可在同一螢幕上改變距離或亮度，回到第 01 頁再看一次；這是自我觀察，不是實驗。'},
    {id: 'predict', section: '08 / 預測', title: '左框架多一塊白，灰塊會怎樣？',
      lead: `和第 01 頁相同，只在左邊暗背景的角落加一塊白（像素值 ${sgWhite}）。白塊不碰灰塊，灰塊仍是 ${sgGray}。`,
      art: sgScene({patch: true}),
      question: {prompt: '依第 06 頁「框架內最亮的當作白」的規則，左邊灰塊會怎麼變？', hideFuturePreviews: true, choices: [
        {value: 'darker', label: '看起來變暗一些，左右差異變小', feedback: `依錨定規則：左框架原本最亮的是灰塊（${sgGrayValue}），現在換成白塊（${sgWhite}）。灰塊不再是錨點，被評為比白暗，所以預測左灰塊變暗、和右灰塊的差異變小。這是規則的預測；白塊是否被歸入同一框架、差異多大，取決於圖形與觀看條件。`},
        {value: 'lighter', label: '看起來更亮，左右差異變大', feedback: `白塊比灰塊亮，它會取代灰塊成為「當作白」的錨點，不會把灰塊往白推。依規則，左灰塊應變暗、左右差異變小。`},
        {value: 'same', label: '不變：白塊沒有碰到灰塊', feedback: '若只看緊鄰灰塊的一圈周圍（第 03 頁那種比較），白塊在圈外，確實預期幾乎不變。但錨定規則看的是整個框架中最亮的東西：白塊進來後，灰塊不再是最亮的，規則預測它變暗、左右差異變小。兩種看法在這裡給出不同預測。'}]},
      point: '先寫下你的預測與理由，再選答案。',
      detail: `<a href="${sgBack}">第 12 章：亮度知覺與顏色知覺</a> · 刺激顏色值是本篇設定；錨定規則出自章節第 3 節。`},
  ],
};
