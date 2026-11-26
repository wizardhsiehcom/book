const story = lesson(20);
const [intro, check] = story.pages;
const source = pages => '<a target="_blank" href="'+courseDir+files[20][0]+'#page='+pages.split('–')[0]+'">Kimo Johnson，MIT 9.35（2009），《Auditory Scene Analysis》PDF 第 '+pages+' 頁</a>';
const dir = document.currentScript.getAttribute('src').replace(/[^/]*$/, '');
intro.detail = source('9–11');
intro.art = '<figure data-key="pattern" style="text-align:center"><strong style="font-size:clamp(1.3rem,4vw,2.4rem)">低　高　低　·　低　高　低　·</strong><figcaption>從左往右看。圓點是等長的休止，這四拍反覆播放。</figcaption></figure>';
const hear = {
  id:'near-far', section:intro.section, title:'同樣的節奏，把高音從 495 Hz 升到 880 Hz，聽感怎麼變？', lead:'先播放 A，再播放 B。第一遍跟著整組節奏；第二遍只跟著高音。',
  art:'<div data-key="players" class="course-pair">'+[['A：440 與 495 Hz','near'],['B：440 與 880 Hz','far']].map(([label,file])=>'<div><strong>'+label+'</strong><audio aria-label="'+label+'" style="max-width:100%" controls src="'+dir+file+'.wav"></audio></div>').join('')+'</div>',
  previewArt:intro.art, point:'B 的高音離低音更遠，可能更容易單獨追成一條規律的聲流。聽感也可能在兩種組織方式間切換。',
  detail:'兩段皆為本簡報合成示範，保持速度、響度設定與時值相同；概念依 '+source('9–11'),
  mount(root){const players=[...root.querySelectorAll('audio')];const pauseOther=event=>players.filter(p=>p!==event.target).forEach(p=>p.pause());players.forEach(p=>p.addEventListener('play',pauseOther));return ()=>players.forEach(p=>{p.removeEventListener('play',pauseOther);p.pause();});}
};
const groupPage = {id:'onsets',section:intro.section,title:'同時起音，也是來自同一個物體的線索',lead:'把耳朵的問題改成：兩個頻率成分，應合成一個音色，還是分給兩個聲源？',
 art:'<figure data-key="onsets" style="text-align:center"><pre style="display:inline-block;text-align:left;font-size:clamp(.9rem,2vw,1.4rem)">時間 →       起音\n低頻成分     ┃━━━━━━\n高頻成分     ┃━━━━━━</pre><figcaption>兩列的起點對齊。把其中一列延後，兩列就少了一個共同線索。</figcaption></figure>',
 point:'同時開始、頻率又有諧波關係的成分，可能聽成同一個音色。前後出現的音，則可能因為音高接近而聽成同一串。',detail:'同步起音示意圖依 '+source('3–4')+' 自繪。'};
check.detail += '　'+source('10–11');
story.pages = [intro,hear,groupPage,check];
