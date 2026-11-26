const story = lesson(21);
const [intro,check] = story.pages;
const lecture = (s,t) => '<a target="_blank" href="https://www.youtube.com/watch?v=llVlVvk3KS0&t='+s+'s">Josh McDermott，MIT 9.35（2024），第 22 講 '+t+'</a>';
intro.detail = lecture(2743,'45:43–47:05');
const section=intro.section;
const fields={id:'fields',section,title:'同一個觸點，神經纖維能告訴你多少位置資訊？',lead:'',
 art:'<figure data-key="fields" class="course-pair"><div><strong>小感受野</strong><span style="font-size:2em" aria-hidden="true">◯ ◯ ◯</span><p>各纖維接收較窄的皮膚區域</p></div><div><strong>大感受野</strong><span style="font-size:2em" aria-hidden="true">⬭</span><p>一條纖維可對較大片區域反應</p></div></figure>',
 point:'感受野是會影響一條纖維放電的皮膚區域。小感受野配合密集取樣，有利於分辨位置。要讀出細節，還要比較多條纖維的活動。',detail:'感受野示意圖為自編。 '+lecture(2220,'37:00–37:54')+' · '+lecture(2340,'39:00–39:55')};
const watch={id:'measure',section,title:'指尖和前臂，要隔多遠才摸得出是兩點？',lead:'先看片段中的指尖，再看前臂。留意老師何時拉開兩點，以及志願者何時從「一點」改答「兩點」。',
 art:'<div data-key="trials" class="course-pair"><div><strong>指尖</strong>'+lecture(2914,'48:34 起')+'</div><div><strong>前臂</strong>'+lecture(2955,'49:15 起')+'</div></div>',
 point:'測兩個部位時，老師都混著給一點或兩點，請志願者回答摸到幾點。在前臂，要把兩點拉開一些才比較分得出來。每個人剛好能分辨的間距，要多測幾次才能估計。',detail:'依官方英文逐字稿 '+lecture(2880,'48:00–50:24')+' 整理。'};
check.detail+='　'+lecture(2743,'45:43–47:05')+'。控制變項題為自編。';
story.pages=[intro,fields,watch,check];
