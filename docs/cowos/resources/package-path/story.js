// 結構示意；固定材料與路徑，不按比例，也不模擬電氣行為。
const packageVariants = {
  S: {title: 'CoWoS-S · 矽中介板', layer: '矽中介板', note: '晶片間的細密布線位於矽中介板上；中介板 TSV 提供穿過矽、往下連接的通道。'},
  R: {title: 'CoWoS-R · RDL 中介層', layer: 'RDL 中介層', note: '以聚合物與銅布線構成 RDL 中介層，取代整片矽中介板；下方仍有獨立的封裝基板。'},
  L: {title: 'CoWoS-L · RDL + 局部矽互連', layer: 'RDL 中介層', note: '在 RDL 中介層中整合局部矽互連 LSI，於需要細密晶片間互連的位置使用矽；不是把整片中介層換回矽。'},
};
// 剖面各列由上而下：晶片、微凸塊、中介層、C4、封裝基板、BGA 焊球、板端。
// 材料用少量暖色與紋理區分；朱紅只畫目前要追的那條路徑。
const packageLegend = {
  S: '<span class="pkg-key pkg-key-si">矽</span><span class="pkg-key pkg-key-sub">有機封裝基板</span>',
  R: '<span class="pkg-key pkg-key-rdl">RDL（聚合物＋銅）</span><span class="pkg-key pkg-key-sub">有機封裝基板</span>',
  L: '<span class="pkg-key pkg-key-rdl">RDL（聚合物＋銅）</span><span class="pkg-key pkg-key-si">矽</span><span class="pkg-key pkg-key-sub">有機封裝基板</span>',
};
function packageSection(variant = 'S', path = 'none') {
  const v = packageVariants[variant];
  const vias = variant === 'S' ? '<span class="pkg-via pkg-via-main" aria-hidden="true"></span>' + '<span class="pkg-via" aria-hidden="true"></span>'.repeat(4) + '<span class="pkg-tsv-tag" aria-hidden="true">TSV</span>' : '';
  const pathKey = path === 'none' ? '' : `<span class="pkg-key pkg-key-path">${path === 'across' ? '晶片間：沿中介板布線' : '往下：TSV → C4 → 基板 → 焊球'}</span>`;
  return `<div class="pkg-section pkg-${variant} pkg-path-${path}" role="img" aria-label="${v.title}剖面：GPU 與 HBM 並排，下接${v.layer}${variant === 'L' ? '與局部矽互連' : ''}，再接封裝基板。${path === 'across' ? '強調 GPU 經中介板布線到 HBM 的橫向路徑。' : path === 'down' ? '強調 CoWoS-S 穿過中介板 TSV 往下接基板的路徑。' : ''}結構示意，不按比例。">
    <div class="pkg-chips"><div class="pkg-gpu">GPU</div><div class="pkg-hbm"><b>HBM</b><span>DRAM 堆疊</span><i class="pkg-hbm-base"></i></div></div>
    <div class="pkg-contacts" aria-hidden="true"><span class="pkg-bumps"></span><span class="pkg-row-tag">微凸塊</span><span class="pkg-bumps"></span></div>
    <div class="pkg-interposer"><span class="pkg-wiring" aria-hidden="true"></span>${vias}${variant === 'L' ? '<span class="pkg-bridge">局部矽 LSI</span>' : ''}<span class="pkg-layer-name">${v.layer}</span><span class="pkg-route" aria-hidden="true"></span></div>
    <div class="pkg-lower-contacts" aria-hidden="true"><span class="pkg-dots"></span><span class="pkg-row-tag">C4 凸塊</span></div>
    <div class="pkg-substrate">封裝基板</div>
    <div class="pkg-balls" aria-hidden="true"><span class="pkg-dots"></span><span class="pkg-row-tag">BGA 焊球</span></div>
    <div class="pkg-board">主機板／板端</div>
    <div class="pkg-legend" aria-hidden="true">${packageLegend[variant]}${pathKey}<span class="pkg-scale">結構示意 · 不按比例</span></div>
  </div>`;
}
function mountPackage(root, state) {
  state.variant ??= 'S';
  const buttons = [...root.querySelectorAll('[data-variant]')];
  const output = root.querySelector('[data-package]');
  const render = () => {
    const v = packageVariants[state.variant];
    output.innerHTML = `<h2 class="pkg-title">${v.title}</h2>${packageSection(state.variant)}<p class="pkg-note">${v.note}</p>`;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.variant === state.variant)));
  };
  const select = event => { state.variant = event.currentTarget.dataset.variant; render(); };
  buttons.forEach(button => button.addEventListener('click', select)); render();
  return () => buttons.forEach(button => button.removeEventListener('click', select));
}
const packageSource = '<a href="https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm">TSMC：CoWoS 技術說明</a>';
const story = {
  title: 'GPU 到 HBM 經過哪些層？', label: 'CoWoS / 03–07 · 封裝剖面',
  back: {href: '../../03-silicon-interposer-2d5.html', label: '返回第 03 章'},
  pages: [
    {id: 'whole-package', section: '01 / 先看位置', title: 'GPU 與 HBM，先在同一個封裝裡相遇',
      lead: 'GPU 需要讀寫旁邊的 HBM。它們之間的連接，藏在晶片下方的中介層。',
      art: packageSection(), point: '上方是晶片，中間是互連結構，下方是封裝基板；主機板還在封裝之外。',
      detail: '先以 CoWoS-S 為例。圖中各一顆 GPU、HBM 只為說明位置；尺寸、厚度、凸塊與線數均不按比例。省略散熱蓋、填充材料及多數線路。'},
    {id: 'three-layers', section: '02 / 拆成三層', title: '中介板和封裝基板，分工不同',
      lead: '同樣都能布線，位置與連接尺度卻不一樣。先記住這三層。',
      art: '<div class="pkg-stack"><section class="pkg-layer"><span class="pkg-swatch pkg-swatch-die" aria-hidden="true"></span><div><span class="pkg-kicker">上層 · GPU 與 HBM</span><h2>運算與記憶體</h2><p>晶片端接點向下，經細間距微凸塊連到中介板。</p></div></section><section class="pkg-layer"><span class="pkg-swatch pkg-swatch-si" aria-hidden="true"></span><div><span class="pkg-kicker">中層 · CoWoS-S 矽中介板</span><h2>細密的晶片間互連</h2><p>上表面的金屬布線連接旁邊的晶片；TSV 提供穿過矽的垂直通道。</p></div></section><section class="pkg-layer"><span class="pkg-swatch pkg-swatch-sub" aria-hidden="true"></span><div><span class="pkg-kicker">下層 · 有機封裝基板</span><h2>供電與對外連接</h2><p>經 C4 凸塊承接上方組件，再經 BGA 焊球連到板端。</p></div></section></div>',
      point: '看到「中介層」時，不要把它和下面的封裝基板合成同一塊。', detail: packageSource},
    {id: 'across', section: '03 / 沿著資料走', title: 'GPU 到 HBM，主要看橫向互連',
      lead: '從 GPU 接點下來，沿中介板上的金屬布線到 HBM 接點，再向上接進記憶體。',
      art: packageSection('S', 'across') + '<div class="pkg-route-text"><strong>GPU 接點</strong><span>↔</span><strong>中介板布線</strong><span>↔</span><strong>HBM 接點</strong></div>',
      point: '這條同封裝的互連，不需要先繞到主機板。',
      detail: '朱紅線只代表一條示意路徑；實際是大量訊號線，並有電源與接地。箭頭表示連接方向，沒有模擬傳輸時序。'},
    {id: 'down', section: '04 / 再看另一個方向', title: '穿過矽的 TSV，連的是下方',
      lead: '若要從上方組件接往封裝基板，CoWoS-S 使用穿過矽中介板的 TSV。',
      art: packageSection('S', 'down') + '<div class="pkg-route-text"><strong>中介板 TSV</strong><span>↓</span><strong>C4 接合</strong><span>↓</span><strong>封裝基板</strong><span>↓</span><strong>BGA／板端</strong></div>',
      point: '橫向連 GPU 與 HBM，縱向接往基板；兩者不是同一段路。',
      detail: '朱紅線示意 S 中介板內一條 TSV，經 C4 凸塊、基板到焊球；圓點標示經過的凸塊與焊球，位置為示意、不按比例。R／L 的中介層不同，不能直接套用這張整片矽剖面。'},
    {id: 'hbm-stack', section: '05 / 放大 HBM', title: 'HBM 裡面，還有另一組 TSV',
      lead: 'HBM 把 DRAM 晶片往上堆。堆疊內的垂直互連，與剛才穿過中介板的 TSV 位於不同地方。',
      art: '<div class="pkg-hbm-detail" role="img" aria-label="HBM 示意：三層 DRAM 與底部 die，堆疊內 TSV 沿垂直方向連接；底部接往中介層。"><div class="pkg-dram">DRAM</div><div class="pkg-dram">DRAM</div><div class="pkg-dram">DRAM</div><div class="pkg-base">底部 die</div><span class="pkg-hbm-via" aria-hidden="true"></span></div><div class="pkg-hbm-foot" aria-hidden="true"><span class="pkg-bumps"></span><span class="pkg-hbm-ip">中介層</span></div><p class="pkg-note">圖中直線：堆疊內垂直互連（含 TSV）；層間接合省略。下方接點再連到 CoWoS 中介層。</p>',
      point: 'HBM 內部是垂直堆疊；整顆 HBM 又能與 GPU 並排整合。',
      detail: '三層只為示意，不代表任何 HBM 世代規格。CoWoS 是整合 HBM 的方案之一，HBM 並不限定只能使用 CoWoS。<a href="https://news.skhynix.com/en/semiconductor-back-end-process-episode-4-packages-part-2/">SK hynix：HBM 堆疊與 2.5D 封裝</a>。'},
    {id: 'predict-route', section: '06 / 想一想', title: 'GPU 讀 HBM，是否都先經過主機板？',
      lead: '封裝基板與主機板明明就在下面，為什麼剛才的朱紅線沒有經過它們？',
      art: '<div class="pkg-pair"><section class="pkg-card"><span class="pkg-caption">路徑一 · 橫向</span><h2>同封裝互連</h2><p>GPU ↔ 中介板布線 ↔ HBM</p></section><section class="pkg-card"><span class="pkg-caption">路徑二 · 往下</span><h2>對外連接</h2><p>上方組件 ↔ 封裝基板 ↔ 板端</p></section></div>',
      point: '先辨認路徑的兩個端點，再看它經過哪一層。',
      question: {prompt: '哪個解讀符合剛才的 CoWoS-S 剖面？', hideFuturePreviews: true, choices: [
        {value: 'board', label: '所有 HBM 資料都先下到主機板', feedback: '再看第 03 頁：GPU–HBM 的細密互連沿中介板布線，沒有先繞到主機板。'},
        {value: 'local', label: 'GPU–HBM 可在中介板上互連', feedback: '對。同封裝的 GPU–HBM 路徑與往外接基板的路徑，要分開辨認。'},
      ]}},
    {id: 'variants', section: '07 / 保持位置，換中間那層', title: 'S、R、L 的差異，從中介層看',
      lead: '切換版本。上方晶片與下方封裝基板位置固定，比較中間用了什麼互連結構。',
      art: '<div class="pkg-controls" role="group" aria-label="選擇 CoWoS 變體"><button data-variant="S" aria-pressed="true">CoWoS-S</button><button data-variant="R" aria-pressed="false">CoWoS-R</button><button data-variant="L" aria-pressed="false">CoWoS-L</button></div><div data-package class="pkg-output" role="status" aria-live="polite"></div>',
      previewArt: '<div class="pkg-controls pkg-controls-preview"><span class="pkg-chip-btn pkg-on">CoWoS-S</span><span class="pkg-chip-btn">CoWoS-R</span><span class="pkg-chip-btn">CoWoS-L</span></div><div class="pkg-output">' + packageSection('S') + '</div>',
      point: 'RDL 是再分佈布線；RDL 中介層和底下的封裝基板仍是兩個結構。',
      detail: 'S 也有金屬布線；R 的名稱並不表示只有 R 才有 RDL。圖省略 R／L 的詳細垂直連接及選配結構。' + packageSource, mount: mountPackage},
    {id: 'local-silicon', section: '08 / 看懂局部', title: 'L 把細密矽互連，放在需要的位置',
      lead: 'LSI 位於需要高密度晶片間連接的局部區域，與較大範圍的 RDL 中介層一起工作。',
      art: packageSection('L') + '<div class="pkg-pair"><section class="pkg-card"><span class="pkg-caption">矽 · 局部</span><h2>局部 LSI</h2><p>承接需要細密布線的晶片間連接。</p></section><section class="pkg-card"><span class="pkg-caption">RDL · 大範圍</span><h2>較大範圍的 RDL</h2><p>提供其餘布線與整合空間。</p></section></div>',
      point: '「局部矽」描述矽互連的位置；不代表封裝裡只有一座橋。',
      detail: '本圖只畫一個連接區域。實際 LSI 數量、大小、配置及垂直通道依設計而定；不能由示意圖推出成本、良率或面積上限。' + packageSource},
    {id: 'read-cross-section', section: '09 / 回到章節', title: '不看架構代號，你能認出這張剖面嗎？',
      lead: '一張新剖面：GPU 與 HBM 並排，中間是 RDL，只有晶片交界附近放置局部矽。先從結構推斷，再定位 HBM 內部的 TSV。',
      art: packageSection('L').replaceAll(packageVariants.L.title, '待辨認的架構'),
      point: '先找材料與位置，再推斷架構；同名 TSV 仍須辨認它穿過哪一塊矽。',
      question: {prompt:'此結構對應哪種架構？HBM 內部 TSV 在哪裡？',hideFuturePreviews:true,choices:[
        {value:'local',label:'L；HBM 的 DRAM 堆疊內',feedback:'對。RDL 加局部矽互連對應 L。HBM 內部 TSV 連接堆疊中的晶片；不能把它和 S 中介板的 TSV 當成同一段路。'},
        {value:'silicon',label:'S；HBM 與 GPU 之間的中介板內',feedback:'S 使用矽中介板；題目是 RDL 加局部矽，所以是 L。HBM 內部 TSV 位於記憶體堆疊，並非兩顆晶片之間的中介板。'}]},
      detail: '<a href="../../03-silicon-interposer-2d5.html">第 03 章：矽中介板</a> · <a href="../../06-cowos-r-l.html">第 06 章：R／L</a> · <a href="../../07-hbm-integration.html">第 07 章：HBM</a>。結構來源：' + packageSource},
  ],
};
