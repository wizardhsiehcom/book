const story=lesson(22);
const [intro,check]=story.pages;
const paper='https://web.eecs.umich.edu/~stellayu/teach/2023action/papers/1987klatzkyHandMovements.pdf';
const source=(page,label)=>'<a target="_blank" href="'+paper+'#page='+page+'">Lederman 與 Klatzky（1987），'+label+'</a>';
intro.detail=source(5,'第 345–346 頁，表 1 與圖 1')+'。鑰匙情境為自編。';
const section=intro.section;
const choose={id:'texture',section,title:'同樣是布料，找紋理和找軟硬要換手勢',lead:'想像面前有兩塊外觀相同的布墊。只能閉眼用手，依序做兩個判斷。',
 art:'<div data-key="moves"><details><summary>找出表面較粗的布墊：你的手怎麼動？</summary><p>用指腹橫向滑過表面，比較滑動中皮膚收到的細小變化。</p></details><details><summary>找出較硬的布墊：你的手怎麼動？</summary><p>垂直按下並放鬆，體會相似施力下物體怎麼變形。</p></details></div>',
 point:'研究者把這些可辨認的手部動作稱作探索程序。比較粗糙程度時，用指腹滑；比較軟硬時，用相近的力道按。',detail:'自編練習；動作與屬性的對應依 '+source(4,'第 345–346 頁，表 1 與圖 1')+'。'};
const evidence={id:'method',section,title:'常用一個手勢，是否表示那個手勢真的有用？',lead:'',
 art:'<div class="course-pair" data-key="experiments"><div><strong>實驗 1</strong><p>指定要配對的屬性，觀察受試者自發採用什麼動作。</p></div><div><strong>實驗 2</strong><p>限制可用的探索動作，再測各種屬性的配對表現。</p></div></div>',
 point:'實驗 1 看人自然會選哪個手勢。實驗 2 限制手勢，再看哪些特性變得難以辨認。描邊時也可能摸到材質，一個動作能提供好幾種線索。',detail:source(1,'摘要、實驗 1 與實驗 2')+'。對照為中文整理。'};
check.detail+='　'+source(5,'圖 1，沿輪廓探索');
story.pages=[intro,choose,evidence,check];

addCourseNarration(story.pages);
