const story=lesson(23);
const [intro,check]=story.pages;
const lecture=(s,t)=>'<a target="_blank" href="https://www.youtube.com/watch?v=Mre84EsXY_Y&t='+s+'s">Josh McDermott，MIT 9.35（2024），第 23 講 '+t+'</a>';
const section=intro.section;
intro.detail=lecture(1499,'24:59–25:35');
const transfer={id:'nostrils',section,title:'只讓左鼻孔適應，右鼻孔還聞得到原來那麼濃嗎？',lead:'先估兩側的氣味強度。讓左側持續接觸同一種氣味後，再分別用左右鼻孔測同樣濃度。',
 art:'<div class="course-pair" data-key="comparison"><div><strong>左側測試</strong><p>接觸過氣味的那一側</p></div><div><strong>右側測試</strong><p>未直接接受適應刺激的一側</p></div></div><details data-key="result"><summary>先預測，再看講師讀圖</summary><p>相較於適應前，兩側都覺得氣味變弱。接觸過的那側下降更多。這是主觀強度評分，並非分子濃度的變化。</p></details>',
 point:'右鼻孔也覺得變淡，表示適應可能有一部分來自兩側共用的處理過程。左鼻孔變淡得更多，表示可能還有只影響一側的過程。',detail:lecture(1742,'29:02–30:54')+'。此頁為課堂圖的定性整理。'};
const leakage={id:'leakage',section,title:'學生追問：如果氣味飄到了另一個鼻孔呢？',lead:'實驗假設右鼻孔沒有直接聞到氣味。如果氣味分子隨呼氣離開左側，又從右側吸進去，這個假設就不成立。',
 art:'<div data-key="alternative"><p><strong>左側供氣 → 呼出 → 右側吸入？</strong></p><p>這條替代路徑也可能讓右側的強度評分下降。</p></div>',
 point:'跨側效應支持共享處理的可能性。要進一步判斷，得分開控制兩側氣流，或監測測試側是否接觸到刺激。',detail:lecture(1850,'30:50–31:28')+'。隔離與監測是依學生質疑延伸的實驗設計。'};
check.detail+='　'+lecture(1499,'24:59–25:35')+'。濃度控制題為自編。';
story.pages=[intro,transfer,leakage,check];

addCourseNarration(story.pages);
