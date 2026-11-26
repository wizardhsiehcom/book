const dir = document.currentScript.getAttribute('src').replace(/[^/]*$/, '');
const credit = '聲音取自 <a target="_blank" href="https://ocw.mit.edu/courses/9-35-sensation-and-perception-spring-2009/pages/problem-sets/">MIT OCW 9.35，作業 6（2009）</a>。聲譜圖由原音檔繪製。';
const lecture = page => '<a target="_blank" href="'+dir+'hearing.pdf#page='+page+'">Kimo Johnson，《Hearing》，MIT OCW 9.35（2009），PDF 第 '+page+' 頁</a>';
function example(id, label, title, x, y, caption) {
  const figure = `<figure class="hearing-figure"><div class="hearing-chart"><img src="${dir}${id}.png" alt="${label}的聲譜圖；讀圖位置見下方圖說"><span aria-hidden="true" class="hearing-pin" style="left:${x}%;top:${y}%">↓</span></div><figcaption>${caption}</figcaption></figure>`;
  return {id, section:'聆聽與讀圖', title, lead:'',
    art:'<div data-key="exercise"><audio controls aria-label="'+label+'" src="'+dir+id+'.wav"></audio>'+figure+'</div>',
    previewArt:figure, detail:credit, point:'', instruction:'播放後可拖回箭頭標示的時刻重聽。',
    mount(root){const player=root.querySelector('audio');return ()=>player.pause();}};
}
const story = {sequence:courseSequence,back:{href:home,label:'回課程地圖'},title:'耳朵怎麼分開不同頻率？',label:'MIT 9.35｜第 19 講選讀',pages:[
  deck.cover({title:'耳朵怎麼分開不同頻率？',meta:'MIT 9.35・聽覺選讀',instruction:'從一段聲音開始。'}),
  example('e1','錄音 A','錄音 A：第 2.3 秒，哪一段高頻變亮了？',52,24,'先播放錄音 A。圖上從左到右是時間，越往上頻率越高。重聽 2.3 秒前後，沿箭頭看約 4,000 Hz 的區域先變亮、再變暗。'),
  example('s1','錄音 B','錄音 B：第 1.42 秒，有幾條亮帶同時出現？',62.5,55,'在第 1.42 秒沿箭頭往下看。約 3,000 Hz 的細帶下方，還有其他亮帶；它們在同一時間出現。'),
  {id:'cochlea',section:'耳蝸',title:'聲音越低，振動最強的位置越靠近耳蝸頂端',lead:'',
   art:'<figure data-key="map" class="hearing-map"><div class="hearing-ends"><span>底部</span><span>頂端</span></div><div class="hearing-line"><b>● 1,600 Hz</b><b>● 100 Hz</b></div><figcaption>把耳蝸沿基底膜攤開。沿線從底部看到頂端。1,600 Hz 和 100 Hz 的標記是各自振動最強的位置；圖上的間距只作示意。</figcaption></figure>',
   point:'低音和高音都能讓基底膜振動，峰值落在哪裡提供了頻率線索。',detail:'依 MIT 原圖重繪位置關係。'+lecture(4),instruction:'先找 1,600 Hz，再往頂端找 100 Hz。'},
  {id:'masking',section:'自我檢查',title:'強音的頻率靠近弱音時，弱音會更難聽見嗎？',lead:'',
   art:'<figure class="hearing-map" data-key="tones"><div class="hearing-ends"><span>低頻</span><span>高頻</span></div><div class="hearing-tones"><span>強音　→</span><b>弱音</b></div><figcaption>弱音的頻率與音量固定，只把強音的頻率往右移近。</figcaption></figure>',
   question:{prompt:'預測弱音會怎樣，再核對原因。',choices:[
     {value:'harder',label:'更難察覺',feedback:'通常會更難。強音越接近弱音，越可能落入同一聽覺濾波器的通帶，弱音需要更大聲才聽得見。'},
     {value:'same',label:'一樣容易察覺',feedback:'弱音本身沒有改變，但察覺它的門檻會變。附近的強音可以遮蔽弱音。'}]},point:'',detail:'情境改編自 '+lecture(10),instruction:'先預測，再讀回饋。'}
]};


const harmonicRows = '<table data-key="harmonics" class="course-harmonics"><caption>兩段聲音各有哪些頻率？</caption><thead><tr><th scope="col">錄音</th><th scope="col">200 Hz</th><th scope="col">400 Hz</th><th scope="col">600 Hz</th><th scope="col">800 Hz</th></tr></thead><tbody><tr><th scope="row">A</th><td>有</td><td>有</td><td>有</td><td>有</td></tr><tr><th scope="row">B</th><td><strong>移除</strong></td><td>有</td><td>有</td><td>有</td></tr></tbody></table>';
story.pages.push({
 id:'missing-fundamental',section:'從頻譜到音高',title:'拿掉最低的頻率，音高會立刻高一個八度嗎？',lead:'依序聽 A、B，跟著各哼一聲：你哼的音有明顯跳高嗎？再聽一次，比較音色。',
 art:harmonicRows+'<div data-key="samples">'+['included','removed'].map((name,i)=>'<label>'+['A　含 200 Hz','B　移除 200 Hz'][i]+'<audio controls preload="none" aria-label="'+name+'" src="'+dir+'fundamental-'+name+'.wav"></audio></label>').join('')+'</div>',
 previewArt:harmonicRows,point:'B 的成分仍是 200 Hz 的整數倍，合成波形每 5 毫秒重複。即使頻譜上缺了 200 Hz，聽者仍可能聽到接近它的音高。',
 detail:'音檔為自製正弦波合成示範。概念取自 '+lecture(28),instruction:'把音量調到舒適程度，比較音色與音高兩個判斷。',
 mount(root){const players=Array.from(root.querySelectorAll("audio"));const solo=e=>players.filter(p=>p!==e.target).forEach(p=>p.pause());players.forEach(p=>p.addEventListener("play",solo));return ()=>players.forEach(p=>{p.removeEventListener("play",solo);p.pause()});}
},{
 id:'localize',section:'聲源定位',title:'兩耳同時收到聲音，聲源一定在正前方嗎？',lead:'',
 art:'<figure class="hearing-map" data-key="positions"><div class="hearing-ends"><b>正前方　0°</b><b>正後方　180°</b></div><figcaption>假設聲源在正中線上，距離左右耳一樣遠。從聲源各畫一條線到左耳和右耳。先比較兩條線的長度，再判斷聲音會不會同時到達。</figcaption></figure>',
 question:{prompt:'只拿到「雙耳時間差為零」這筆資訊，可以選出哪個位置？',choices:[{value:'front',label:'正前方',feedback:'前方符合，但後方也符合。講義圖中 0° 與 180° 都標為 0 微秒。'},{value:'both',label:'兩者都可能',feedback:'是。時間差限制了可能方向，但單靠這個值無法分清前後。'}]},
 point:'',detail:'依原圖兩端條件改編。'+lecture(20)+'　<a href="../lec20/index.html">下一講：聽覺場景分析</a>',instruction:'用聲音走到兩耳的路徑，解釋何以會有兩個答案。'
});
