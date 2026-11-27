const story = lesson(11);
const [observation, checkpoint] = story.pages;
const section = observation.section;
Object.assign(observation, {
  "title": "你挑出最像的五張臉，和電腦挑的一樣嗎？",
  "lead": "2009 年作業 5 請學生先用肉眼排相似臉，再比較程式的排名。",
  "art": "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"兩種排序方式\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"148\" y=\"57\" font-family=\"sans-serif\" font-size=\"23\" text-anchor=\"middle\">看臉後挑出</text><text x=\"148\" y=\"92\" font-family=\"sans-serif\" font-size=\"23\" text-anchor=\"middle\">最像的五個人</text><text x=\"300\" y=\"79\" font-family=\"sans-serif\" font-size=\"27\" text-anchor=\"middle\">↔</text><text x=\"462\" y=\"57\" font-family=\"sans-serif\" font-size=\"23\" text-anchor=\"middle\">逐像素計算</text><text x=\"462\" y=\"92\" font-family=\"sans-serif\" font-size=\"23\" text-anchor=\"middle\">取距離最小的五人</text></svg><figcaption>兩種排序使用同一批照片；先做人的排序，再揭示程式結果。</figcaption></figure>",
  "point": "若名次不同，先檢查程式究竟對哪些影像差異敏感。",
  "detail": "<a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-sensation-and-perception-spring-2009/6b86c399b2f30817b955ebfb40945c32_MIT9_35s09_pset05.pdf#page=2\">MIT 9.35（2009），作業 5，第 1–5 題，PDF 第 2 頁</a>。"
});
checkpoint.detail = "<a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-sensation-and-perception-spring-2009/6b86c399b2f30817b955ebfb40945c32_MIT9_35s09_pset05.pdf#page=2\">MIT 9.35（2009），作業 5，第 1–5 題，PDF 第 2 頁</a>。" + checkpoint.detail;
checkpoint.title="把臉照左右平移一格，像素距離為何可能大增？";
checkpoint.question={prompt:"影像仍是同一人，哪個機制能解釋排名改變？",choices:[{value:"position",label:"同一格像素對到了臉的不同部位",feedback:"原先對著眼角的位置可能改對到皮膚。作業刻意控制姿勢與尺寸，正是為了減少這類差異。"},{value:"identity",label:"平移改變了真實身分",feedback:"身分維持相同。改變的是像素對應，因此排名可以改變。"}]};

story.pages = [
  observation,
  {
    section,
    id: "distance",
    title: "只改亮度，能讓同一張圖的像素距離變大嗎？",
    art: "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"兩張二乘二影像，每格亮度都增加十\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"100\" y=\"25\" width=\"30\" height=\"30\" fill=\"rgb(50,50,50)\"/><rect x=\"132\" y=\"25\" width=\"30\" height=\"30\" fill=\"rgb(150,150,150)\"/><rect x=\"100\" y=\"57\" width=\"30\" height=\"30\" fill=\"rgb(50,50,50)\"/><rect x=\"132\" y=\"57\" width=\"30\" height=\"30\" fill=\"rgb(150,150,150)\"/><rect x=\"400\" y=\"25\" width=\"30\" height=\"30\" fill=\"rgb(60,60,60)\"/><rect x=\"432\" y=\"25\" width=\"30\" height=\"30\" fill=\"rgb(160,160,160)\"/><rect x=\"400\" y=\"57\" width=\"30\" height=\"30\" fill=\"rgb(60,60,60)\"/><rect x=\"432\" y=\"57\" width=\"30\" height=\"30\" fill=\"rgb(160,160,160)\"/><text x=\"130\" y=\"131\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">原圖：50、150 交替</text><text x=\"432\" y=\"131\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">每格加 10</text></svg><figcaption>教學小圖只剩四個像素。兩張圖的明暗排列完全相同。</figcaption></figure><details data-key=\"reveal\"><summary>算出距離</summary><p>四個位置各差 10，平方後相加為 400，開平方根得 20。若拿原圖跟自己比，結果為 0。</p></details>",
    point: "把相同位置的亮度差平方、加總，再開平方根，得到的就是歐氏距離。臉形不變，只要整張圖變亮，這個數也會變大。",
    detail: "<a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-sensation-and-perception-spring-2009/6b86c399b2f30817b955ebfb40945c32_MIT9_35s09_pset05.pdf#page=2\">MIT 9.35（2009），作業 5，第 1–5 題，PDF 第 2 頁</a>。 四格數值為自編。",
    lead: ""
  },
  {
    section,
    id: "testset",
    title: "模型是否認得同一個人，要用另一張照片檢驗",
    art: "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"註冊照片與未見過的測試照片分開\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"150\" y=\"69\" font-family=\"sans-serif\" font-size=\"21\" text-anchor=\"middle\">註冊：每人一張</text><text x=\"306\" y=\"69\" font-family=\"sans-serif\" font-size=\"24\" text-anchor=\"middle\">→</text><text x=\"461\" y=\"69\" font-family=\"sans-serif\" font-size=\"21\" text-anchor=\"middle\">測試：另一次拍攝</text><text x=\"303\" y=\"119\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">用測試照找最近的註冊照，核對兩張的身分。</text></svg><figcaption>若測試照同時出現在註冊庫，它會以零距離找到自己。</figcaption></figure>",
    point: "更換光線、表情或姿勢可檢驗模型的適用範圍。要找出哪一項造成誤判，一次改一項並保留對照。",
    detail: "<a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-sensation-and-perception-spring-2009/6b86c399b2f30817b955ebfb40945c32_MIT9_35s09_pset05.pdf#page=3\">MIT 9.35（2009），作業 5，第 6 題，PDF 第 3 頁</a>。",
    lead: ""
  },
  checkpoint
];

const faceSheet = document.currentScript.getAttribute('src').replace(/story\.js$/, 'faces.png');
function portrait(id) {
  const index = id - 1;
  return '<span role="img" aria-label="照片 '+id+'" style="display:inline-block;vertical-align:middle;width:46px;height:56px;background-image:url('+faceSheet+');background-size:368px 280px;background-position:-'+(index%8*46)+'px -'+(Math.floor(index/8)*56)+'px"></span>';
}
const rawRank = [24,12,2,15,17];
const adjustedRank = [24,12,11,27,8];
const gallery = Array.from({length:39},(_,i)=>'<button type="button" data-face="'+(i+2)+'" aria-pressed="false">'+portrait(i+2)+'<br>'+ (i+2)+'</button>').join('');
const faceCredit = observation.detail+' 圖像來自 ORL Database of Faces（AT&amp;T Laboratories Cambridge），使用 MIT 附件 orlFaces.mat；排名由原始灰階矩陣計算。';
story.pages.splice(1,0,{
 id:'rank-faces',section,title:'你覺得誰最像 1 號？',lead:'依相似程度點五張照片，最像的先選。再點一次可取消。',
 art:'<div data-key="experiment" style="width:min(100%,48rem)"><p>'+portrait(1)+'　參考臉 1 號</p><div style="display:flex;flex-wrap:wrap;gap:3px;max-height:32vh;overflow:auto" aria-label="候選照片">'+gallery+'</div><p aria-live="polite" data-picks></p><button type="button" data-reveal>比較我的排名與像素排名</button><div aria-live="polite" data-result></div></div>',
 previewArt:'<p data-key="target">'+portrait(1)+'　參考臉 1 號，與其餘 39 張比較。</p>',point:'',detail:faceCredit,instruction:'請先自行排序，再揭曉結果。',
 mount(root,state){
  const panel=root.querySelector('[data-key="experiment"]');
  state.picks ??= [];
  function draw(){
   for(const b of panel.querySelectorAll('[data-face]')){
    const picked=state.picks.includes(Number(b.dataset.face));
    b.setAttribute('aria-pressed',String(picked)); b.style.outline=picked?'2px solid currentColor':'';
    b.disabled=!picked && state.picks.length===5;
   }
   panel.querySelector('[data-picks]').textContent='你的順序（'+state.picks.length+'/5）　'+state.picks.join(' → ');
   panel.querySelector('[data-reveal]').disabled=state.picks.length!==5;
   panel.querySelector('[data-result]').textContent=state.revealed?'原始像素距離　'+rawRank.join(' → ')+'。前五名與你重疊 '+state.picks.filter(i=>rawRank.includes(i)).length+' 張。':'';
  }
  function click(e){
   const b=e.target.closest('button');
   if(!b)return;
   if(b.hasAttribute('data-face')){
    const i=Number(b.dataset.face);
    state.picks=state.picks.includes(i)?state.picks.filter(n=>n!==i):[...state.picks,i];
    state.revealed=false;
   }else if(b.hasAttribute('data-reveal'))state.revealed=true;
   draw();
  }
  draw();panel.addEventListener('click',click);return ()=>panel.removeEventListener('click',click);
 }
},{
 id:'normalize-faces',section,title:'照片相同，換一種距離算法，哪幾個名次會留下？',lead:'依原作業第 5 題，每張照片先減自己的平均亮度，再除以自己的樣本變異數，最後重算歐氏距離。',
 art:'<div data-key="ranks"><p>原始灰階　'+rawRank.map(i=>portrait(i)+' '+i).join('　')+'</p><details><summary>揭曉調整後的前五名</summary><p>調整後　'+adjustedRank.map(i=>portrait(i)+' '+i).join('　')+'</p><p>24、12 號仍居前兩名，其餘三席都換了。每張影像的整體亮度與像素值的分散程度，都會影響兩種算法的比較。</p></details></div>',
 point:'這是 1 號和其他人的相似度排序。要測能否認出同一人，還需要同一人的另一張照片。',detail:faceCredit,instruction:'先預測第一名是否會換，再展開對照。'
});

addCourseNarration(story.pages);
