const story=lesson(24);
const [intro,check]=story.pages;
const source=(p,t)=>'<a target="_blank" href="'+courseDir+files[24][0]+'#page='+p+'">MIT 9.35（2009），《Taste》PDF '+t+'</a>';
const section=intro.section;
intro.detail=source(3,'第 3–4 頁')+'。水果情境為自編。';
const route={id:'routes',section,title:'吃水果時，甜味和果香分別在哪裡被感覺到？',lead:'拿一口水果作例子，跟著兩條路徑走到各自的感覺器官。',
 art:'<figure data-key="routes"><p><strong>糖溶在唾液裡</strong>　→　接觸味蕾中的味覺受器細胞</p><p><strong>揮發成分進入空氣</strong>　→　經口腔後方向上　→　鼻腔嗅覺黏膜</p><figcaption>留意味道分岔的地方：糖接觸舌頭上的味蕾，香氣分子從口腔後方進入鼻腔。第二條路徑叫鼻後嗅覺，所以你可能覺得香氣來自嘴裡。</figcaption></figure>',
 point:'把感覺出現的位置和分子抵達的器官分開看，就能解釋為何鼻腔通氣會影響食物的風味。',detail:'中文路徑圖依 '+source(3,'第 3–4 頁（圖 14.1）')+' 與 '+source(7,'第 7 頁')+' 自繪。'};
const test={id:'juice',section,title:'糖變多，為什麼連「果香」的評分都可能上升？',lead:'講義指出，增加甜感有時也會加強人對果香的感受。兩種評分可以彼此影響。',
 art:'<div class="course-pair" data-key="juice"><div><strong>樣品 A</strong><p>固定果香，較少糖</p></div><div><strong>樣品 B</strong><p>相同果香，較多糖</p></div></div><details data-key="interpret"><summary>若 B 的果香評分較高，怎麼解讀？</summary><p>在香氣刺激確實相等的前提下，糖量也可能影響果香評分。這個結果本身不能證明 B 有更多香氣分子。</p></details>',
 point:'比較兩種配方時，請受試者分開評甜度和果香，並確保到達鼻腔的香氣刺激相同。',detail:source(6,'第 6 頁')+'。A／B 配方與判讀題為自編。'};
check.detail+='　'+source(6,'第 6 頁')+'。控制變項題為自編。';
story.pages=[intro,route,test,check];

addCourseNarration(story.pages);
