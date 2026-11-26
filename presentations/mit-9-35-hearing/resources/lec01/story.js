const story = lesson(1);
const originalCheck = story.pages.pop();
const video = 'https://www.youtube.com/watch?v=IPJC8loEmd4&t=';
const sourcePage = 'https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec01_1080p_mp4/';
function cite(seconds, span) {
  return '補充教材：Josh McDermott，MIT 9.35《Perception》（2024 春季版），' +
    '<a target="_blank" href="'+video+seconds+'s">第 1 講 '+span+'</a> · <a target="_blank" href="'+sourcePage+'">官方影片與英文逐字稿</a>。';
}
const first = story.pages[0];
const squares = first.art;
first.art = '<div data-key="experiment">'+squares+'<button type="button" aria-pressed="false">把兩邊背景調成相同</button></div>';
first.previewArt = squares;
first.mount = root => {
  const box = root.querySelector('[data-key="experiment"]');
  const button = box.querySelector('button');
  const toggle = () => {
    const matched = button.getAttribute('aria-pressed') !== 'true';
    for (const sample of box.querySelectorAll('.sample')) sample.style.backgroundColor = matched ? '#555' : '';
    button.setAttribute('aria-pressed', String(matched));
    button.textContent = matched ? '恢復深淺背景' : '把兩邊背景調成相同';
  };
  button.addEventListener('click', toggle);
  return () => button.removeEventListener('click', toggle);
};
first.point = '中央灰塊的像素值始終相同。如果換了背景，你覺得它變亮或變暗，這種現象叫同時對比。';
first.detail = cite(2689,'44:49–45:00')+' 操作圖為依原理自製。';
const section = first.section;
story.pages.push({
  id:'illumination', section, title:'暗處的白紙和亮處的灰紙，能反射一樣多的光嗎？', lead:'',
  art:'<figure data-key="light"><div class="course-pair"><div><strong>白紙 × 較暗的光</strong>反射比例 0.8 × 照明 1</div><div><strong>灰紙 × 較亮的光</strong>反射比例 0.4 × 照明 2</div></div><figcaption>分別算兩個乘積：0.8 × 1 和 0.4 × 2 都是 <b>0.8</b>。這組數字是教學示意，假設光線均勻、觀看角度固定。</figcaption></figure>',
  point:'眼睛收到的是反射回來的光。要判斷紙本身有多白，還需要估計照在紙上的光有多強。這解釋了為什麼只量一點光，答案可能不只一個。',
  detail:cite(2400,'40:00–40:48'),instruction:'先遮住其中一邊，各算一次，再比較結果。'
},{
  id:'scene',section,title:'聽一段錄音，你能從中猜出哪些事？',lead:'先打開原片聽課堂示範；暫停後，寫下一個你聽到的事件，以及一個你對場所的猜測。',
  art:'<div data-key="listen"><a target="_blank" href="'+video+'345s">▶ 從 05:45 聽課堂錄音</a><details><summary>對照課堂上的回答</summary><p>有人聽到背景聲，有人指出有人在問問題。對「幾個人在說話」的回答並不一致，另有學生猜是在餐廳。餐廳是聽者提出的解釋，錄音地點在這段對話中沒有獲得證實。</p></details></div>',
  point:'到達鼓膜的是隨時間起伏的壓力。人數、問句和場所，是聽者從這段訊號推回去的可能原因。',
  detail:cite(360,'06:00–07:31'),instruction:'先聽，再展開學生回答。離線時可直接用文字案例。'
},{
  id:'transfer',section,title:'同一個讀值，怎麼分辨是燈變暗，還是換了紙？',lead:'相機固定曝光，桌中央的讀值下降了。你能再做一次觀察。',
  art:'',question:{prompt:'哪個觀察比較能區分這兩種解釋？',choices:[
    {value:'center',label:'重讀一次中央像素',feedback:'這能檢查讀值是否穩定，但同一個較低讀值，仍可能由燈變暗或紙的反射比例下降造成。'},
    {value:'reference',label:'看同一盞燈下、一直沒換的參考灰卡',feedback:'若灰卡也跟著變暗，支持照明改變；若灰卡穩定而紙變暗，支持紙本身改變。這個判斷假設兩者照明一致、沒有新增局部陰影。'}]},
  point:'',detail:cite(2400,'40:00–40:48')+' 灰卡題為自編延伸。',instruction:'用兩種可能原因各自預測灰卡會怎樣。'
},originalCheck);
