const story=lesson(25);
const [intro,check]=story.pages;
const speech='<a target="_blank" href="https://doi.org/10.1121/1.1907309">Sumby 與 Pollack（1954），第 212–215 頁，噪音中的語音辨識實驗</a>';
const flash='<a target="_blank" href="https://bicr.atr.jp/~kmtn/pdf/shamsKamitaniShimojoNat00.pdf">Shams、Kamitani 與 Shimojo（2000），第 788 頁，圖 1</a>';
const section=intro.section;
intro.detail='補充原始研究：'+speech+'。教材中的固定音軌示例為自編。';
const timeline={id:'flashes',section,title:'耳朵收到兩聲，眼睛會多「看」到一下嗎？',lead:'原研究讓參與者報告閃光次數。先從左到右數出有幾次閃光、幾聲嗶，再展開研究結果。',
 art:'<figure data-key="sequence"><table style="margin:auto;text-align:center"><caption>刺激排列示意，時間從左到右</caption><thead><tr><th></th><th>第一個時刻</th><th>緊接的時刻</th></tr></thead><tbody><tr><th>光</th><td>● 閃</td><td>沒有閃光</td></tr><tr><th>聲</th><td>♪ 嗶</td><td>♪ 嗶</td></tr></tbody></table><details><summary>原研究觀察到什麼？</summary><p>一次閃光配上兩聲相近的嗶聲，有人會報告看見兩次閃光。效果隨條件與觀察者而變。</p></details></figure>',
 point:'研究者保持閃光相同，只改嗶聲的組合。人們報告看見的次數卻跟著變，顯示我們判斷短時間內發生了幾件事時，聽覺和視覺可以互相影響。',detail:'補充原始研究：'+flash+'。圖只表示事件數及順序。'};
const controls={id:'timing',section,title:'如果第二聲晚一點響，還會多看見一次閃光嗎？',lead:'假設有人總是照聽到的聲音數回答。固定一次閃光、兩聲嗶，改變第二聲的出現時間。',
 art:'<div class="course-pair" data-key="timing"><div><strong>時間接近</strong><p>第一聲　第二聲</p></div><div><strong>時間分開</strong><p>第一聲　⋯⋯　第二聲</p></div></div><details data-key="outcome"><summary>若錯覺隨間隔拉大而減弱呢？</summary><p>兩個條件都聽見兩聲，單純數聲音的策略預測相同回答。時間接近才較容易多報閃光，支持感官結合受時間限制。</p></details>',
 point:'解讀跨感官效應時，要同時記下每種刺激的內容、兩者的時間關係，以及受試者被要求判斷的感官。',detail:'補充原始研究：'+flash+'，圖 1b 與其後的時間間隔測試。'};
check.detail+='　'+speech+'。同步控制為自編遷移題。';
story.pages=[intro,timeline,controls,check];
