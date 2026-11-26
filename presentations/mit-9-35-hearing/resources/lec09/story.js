const story = lesson(9);
const section = story.pages[0].section;
const overview = story.pages[0];
const originalCheck = story.pages.pop();
const sourceOne = "MIT 9.35（2009 春季），<a target=\"_blank\" href=\"../../resources/lec08/437dd07a9704edc1720be308ef042dfb_MIT9_35s09_pset02.pdf#page=6\">作業 2，第 3a–3b 題，PDF 第 6 頁</a>。 中文圖解與觀察提示依原理自編。";
const sourceTwo = "MIT 9.35（2009 春季），<a target=\"_blank\" href=\"../../resources/lec09/8e71c597449d6a8164ddb1cc2a7bcc2e_MIT9_35s09_pset03.pdf#page=2\">作業 3，第 1a–1b 題，PDF 第 2–3 頁</a>。 中文圖解與練習依原理自編。";
overview.detail += ' ' + sourceOne;
originalCheck.detail = sourceOne + ' ' + originalCheck.detail;

story.pages.push(
  {
    id: 'mechanism', section, title: "同一張條紋卡拿遠，為什麼每度視角的週期數會增加？",
    lead: "卡上印著固定數量的條紋。觀察距離改變，這些條紋在視野中占的角度也會改變。",
    art: "<figure data-key=\"cycles\" style=\"margin:0 auto;text-align:center\"><div style=\"width:80%;height:1.8em;margin:.3em auto;background:repeating-linear-gradient(90deg,#444 0 6.25%,#ddd 6.25% 12.5%)\"></div><div>8 個週期占 4° → 每度 2 個週期</div><div style=\"width:40%;height:1.8em;margin:.6em auto .3em;background:repeating-linear-gradient(90deg,#444 0 6.25%,#ddd 6.25% 12.5%)\"></div><div>8 個週期占 2° → 每度 4 個週期</div></figure>",
    point: "數字為自編示例。卡上的 8 個週期沒有變。拿遠後，卡片在視野裡從 4° 縮到 2°，所以每度視角的週期數加倍；卡上每公分的週期數仍然一樣。",
    detail: sourceOne, instruction: '依圖中條件，先預測再讀解釋。'
  },
  {
    id: 'worked', section, title: "保留頻率的強弱，為何還可能看不出原圖？", lead: '',
    art: "<figure data-key=\"comparison\" class=\"course-pair\"><div><strong>振幅：該成分有多強</strong></div><div><strong>相位：波峰和波谷落在哪裡</strong></div></figure>",
    point: "原作業讓同學保留照片各頻率的振幅、換掉相位，再重建影像。每個頻率的強弱都保留，但不同成分在何處對齊會改變，邊界的位置也會受到影響。",
    detail: sourceTwo, instruction: '將兩種條件逐項對照。'
  },
  {
    id: 'transfer', section, title: "黑白條紋整幅向右平移半個週期，哪一項改變？", lead: '', art: '',
    question: {prompt: '先預測，再核對原因。', choices: [
      {value: 'prediction', label: "相位改變，頻率保持相同", feedback: "每段距離的週期數不變；峰值與谷值的位置整體平移，所以改變的是相位。"},
      {value: 'alternative', label: "頻率加倍，相位保持相同", feedback: "每段距離的週期數不變；峰值與谷值的位置整體平移，所以改變的是相位。"}
    ]},
    point: '', detail: sourceTwo, instruction: '說出你的預測依賴哪個前提。'
  },
  originalCheck
);

const hdrDir = document.currentScript.getAttribute('src').replace(/[^/]*$/, '');
const hdrViews = [
  ['whole','全景','2.5–97.5%','先找電視和窗戶。電視靠左下，窗戶在右側。'],
  ['room','室內電視','0.5–55%','電視機身和左側架子浮現；窗外大部分亮度都映成白色。'],
  ['window','窗外建物','75–98.5%','窗外建物與樹影清楚了；電視周邊的暗部現在接近黑色。']
];
const hdrSource = '<a target="_blank" href="https://ocw.mit.edu/courses/9-35-sensation-and-perception-spring-2009/7090482bd6caf15d6e59643b62e8bb72_MIT9_35s09_pset04.pdf#page=2">MIT 9.35（2009），作業 4，題 1a–1b</a>。影像取自附件 mdr_im.mat；三種顯示依 viewim.m 的百分位裁切與線性映射預先算好。';
const hdrPic = '<img src="'+hdrDir+'whole.jpg" alt="室內全景，左下有電視，右邊是亮窗。" style="max-width:100%;height:clamp(210px,38vh,430px);object-fit:contain">';
story.pages.splice(-1,0,{
  id:'hdr-room', section, title:'同一張照片，能看清電視，也能看清窗外嗎？', lead:'',
  art:'<figure data-key="hdr" style="margin:0;text-align:center">'+hdrPic+'<figcaption aria-live="polite">'+hdrViews[0][3]+'</figcaption><label>顯示範圍　<select>'+hdrViews.map(([key,label,q])=>'<option value="'+key+'">'+label+'（'+q+'）</option>').join('')+'</select></label></figure>',
  previewArt:'<figure data-key="photo" style="text-align:center">'+hdrPic+'<figcaption>左側暗部與右側亮窗共用同一段顯示範圍。</figcaption></figure>',
  point:'選單中的百分比是原始影像所有有限通道值的百分位。下界以下映成黑，上界以上映成白，中間均勻拉開。三次都用同一次量測，因此可以直接比較哪裡失去細節。',
  detail:hdrSource, instruction:'先看全景，再在兩個局部條件間切換。',
  mount(root,state){
    const fig=root.querySelector('[data-key="hdr"]'), select=fig.querySelector('select');
    function show(){
      const [key,label,,caption]=hdrViews[select.selectedIndex];
      const img=fig.querySelector('img');
      img.src=hdrDir+key+'.jpg'; img.alt=label+'。'+caption;
      fig.querySelector('figcaption').textContent=caption;
      state.view=key;
    }
    select.value=state.view || 'whole'; show(); select.addEventListener('change',show);
    return ()=>select.removeEventListener('change',show);
  }
},{
  id:'hdr-transfer',section,title:'電視旁的灰紙顯成黑色，能斷定紙本來就黑嗎？',lead:'你選了「窗外建物」。同學看著電視旁的一片黑，認為那張紙幾乎不反光。',
  art:'',question:{prompt:'哪個判斷有這張影像的證據支持？',choices:[
    {value:'clipped',label:'先查暗部是否被裁切，再考慮灰紙受到的照明',feedback:'對。許多不同的低值都被映成同一個黑色。回到室內設定可能找回細節；即使讀到原始亮度，也還需要照明線索才能估計反射比例。'},
    {value:'black',label:'畫面既然是黑色，換顯示範圍也無法看到細節',feedback:'可以回上一頁試一次。改用室內設定後，電視旁的物件會浮現。黑色可能來自顯示端裁切，物體實際反射多少還要考慮照明。'}]},
  point:'',detail:hdrSource+' 灰紙情境為自編。 <a href="../lec01/index.html#illumination">回看第 1 講的白紙與灰紙算例</a>',instruction:'把顯示讀值、原始光量與表面反射比例分開。'
});
