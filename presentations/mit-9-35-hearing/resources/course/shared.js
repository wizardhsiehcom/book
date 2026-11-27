const courseBase='https://ocw.mit.edu/courses/9-35-sensation-and-perception-spring-2009/pages/';
const courseDir=document.currentScript.getAttribute('src').replace(/[^/]*$/,'');
const home=courseDir+'../../index.html#map';
const groups=['從刺激到神經訊號','從局部線索到物體','辨認、深度與注意','聲音如何成為聽覺','身體、化學與跨感官'];
const group=n=>n<=5?0:n<=10?1:n<=16?2:n<=20?3:4;
const branch=n=>'lec'+String(n).padStart(2,'0');
const courseSequence = [
  { href: courseDir + '../../index.html', label: '課程地圖' },
  ...lectures.map(d => ({ href: courseDir + '../../branches/' + branch(d.n) + '/index.html', label: '第 ' + d.n + ' 講・' + d.name, group: groups[group(d.n)] }))
];
const files={
4:['4296c1ad40c401365885bbf2c9f25dad_MIT9_35s09_lec03_retina.pdf','原講義：視網膜'],
12:['f54376b82b97dad2ff4de546d138bc0f_MIT9_35s09_rec03_motion.pdf','習題課：運動知覺'],
14:['31ef37ac76305c94207d0d4c6e3e21a4_MIT9_35s09_rec01_depth_cues.pdf','習題課：深度線索'],
20:['3b5d1b394e863c388802f38cbb2742f2_MIT9_35s09_lec01_auditory.pdf','原講義：聽覺場景分析'],
24:['761bb872070b78e6c680e2816eeea7ab_MIT9_35s09_lec04_taste.pdf','原講義：味覺']};
function pair(d){
  const marks={1:['gray dark','gray light'],2:['flash faint','flash'],3:['stripes fine','stripes fine blur'],4:['center','center surround'],5:['stripes tilt','stripes reverse'],9:['stripes','stripes fine'],11:['eyes','eyes wide'],14:['occlusion','occlusion shifted'],15:['parallax','parallax shifted'],21:['dots','dots']};
  return '<figure class="course-pair" data-key="comparison">'+[d.a,d.b].map((v,i)=>'<div>'+(marks[d.n]?'<i aria-hidden="true" class="sample '+marks[d.n][i]+'"></i>':'')+'<strong>'+v+'</strong></div>').join('')+(d.cue ? '<figcaption>'+d.cue+'</figcaption>' : '')+'</figure>';
}
function lesson(n){
 const d=lectures[n-1],section='第 '+n+' 講・'+d.name;
 const ref=files[n]?'<a target="_blank" href="'+courseDir+files[n][0]+'">'+files[n][1]+'</a>':'<a target="_blank" href="'+courseBase+'readings/">MIT 主題閱讀清單</a>';
 const detail='依 <a target="_blank" href="'+courseBase+'lecture-notes/">MIT 9.35（2009）講次表</a> 編排。中文情境與題目為自編。 '+ref;
 const correct={value:'reason',label:d.yes,feedback:d.answer},other={value:'other',label:d.no,feedback:'再看一次對照。'+d.answer};
 return {sequence:courseSequence,title:section,label:'MIT 9.35｜'+section,back:{href:home,label:'回課程地圖'},pages:[
 {id:'observe',section,title:d.title,lead:'',art:pair(d),point:d.why,detail,instruction:'先看兩個條件，再讀下方解釋。'},
 {id:'check',section,title:d.q,lead:'',art:'',question:{prompt:'選一個答案，再看理由。',choices:n%2?[correct,other]:[other,correct]},point:'',detail:'<a href="'+home+'">回課程地圖</a>'+(n<25?'　<a href="../'+branch(n+1)+'/index.html">下一講：'+lectures[n].name+'</a>':''),instruction:'用自己的話解釋所選答案。'}]};
}

function addCourseNarration(pages) {
  const fragment = html => {
    const template = document.createElement('template');
    template.innerHTML = html || '';
    return template.content;
  };
  const plain = html => fragment(html).textContent.trim();
  const sentence = value => value && (/[。！？!?]$/.test(value) ? value : value + '。');
  for (const page of pages) {
    const art = fragment(page.art);
    const lines = [], steps = [];
    function say(words, target) {
      if (!words) return;
      const at = 1 + lines.join('').split(/[。！？!?；;]/).filter(Boolean).length;
      if (target) steps.push({at, clear:true}, {at, box:target});
      lines.push(sentence(words));
    }
    say(plain(page.title));
    say(plain(page.lead));
    if (page.question) {
      page.question.choices.forEach((choice, i) => {
        say('第' + ['一','二','三','四'][i] + '個說法，' + plain(choice.label),
            '[data-answer="' + choice.value + '"]');
      });
      say('選出你的答案，再看看回饋能不能解釋你的觀察。');
    } else if (page.id === 'map') {
      say('想從剛才的灰塊開始，就選第一講。想先用耳朵做實驗，可以直接到第十九講。', 'a[href*="lec19"]');
    } else if (page.id === 'cover') {
      say('等一下會聽到兩段錄音。每聽到一次變化，就到圖上找同一個時刻。', '[data-key="title"]');
    } else {
      const conditions = art.querySelectorAll('.course-pair > div > strong');
      if (conditions.length === 2) {
        conditions.forEach((el,i) => say((i ? '再看，' : '先看，') + el.textContent,
          '.course-pair > div:nth-of-type(' + (i+1) + ') > strong'));
      }
      const caption = art.querySelector('figcaption');
      const target = ['.hearing-pin','figcaption','summary','input','button','th','strong','[data-key]'].find(s => art.querySelector(s));
      if (caption) say(caption.textContent, target);
      else if (!conditions.length) say(plain(page.instruction) || '先觀察畫面中的條件，再預測結果。', target);
      say(plain(page.point));
    }
    if (steps.length) steps.push({at:lines.join('').split(/[。！？!?；;]/).filter(Boolean).length, clear:true});
    // Keep the last highlight visible if it begins on the final sentence.
    if (steps.length >= 2 && steps.at(-2).at === steps.at(-1).at) steps.pop();
    page.speech = lines.join('');
    page.record = steps;
    if (page.question) page.instruction = (page.instruction || '') + ' 依序指出各選項，等學習者說出理由，再讓他作答。';
  }
}