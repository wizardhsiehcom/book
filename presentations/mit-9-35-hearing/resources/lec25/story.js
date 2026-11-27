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

story.pages.push({
  id:'station', section:'結課練習', title:'月台太吵，看見站務員的嘴形能幫你聽清楚嗎？',
  lead:'你設計了兩段播報。A 的聲音較小，也看不到臉；B 的聲音較大，畫面裡有同步嘴形。B 的站名辨識率較高。',
  art:'<div class="course-pair" data-key="conditions"><div><strong>A</strong><p>較小聲・遮住嘴形</p></div><div><strong>B</strong><p>較大聲・看得到嘴形</p></div></div>',
  question:{prompt:'要估計嘴形的幫助，你會怎麼重做比較？',choices:[
    {value:'repeat',label:'沿用 A、B，多收幾輪回答',feedback:'多做幾輪能減少隨機波動，但音量和嘴形仍一起變，你無法判斷是哪一項幫了忙。'},
    {value:'match',label:'兩組用相同的語音與噪音，只改嘴形是否可見',feedback:'這樣才能單獨比較嘴形。用多段播報，把每一段分配到兩種條件，並平衡順序，避免剛聽過站名就猜中。'}]},
  point:'',detail:'自編情境，研究背景：'+speech+'。<a href="../lec19/index.html#masking">複習聲音遮蔽</a>。',instruction:'指出原先同時改變的兩個條件。'
},{
  id:'station-result',section:'結課練習',title:'噪音越強，看嘴形的幫助也越大嗎？',
  lead:'以下是自編的示例資料。每格都有 100 次站名辨識，表中是答對次數。',
  art:'<table data-key="results" style="margin:auto;text-align:center;border-spacing:1em .45em"><caption>同一批播報，兩種背景噪音</caption><thead><tr><th>噪音</th><th>看不到嘴形</th><th>看得到嘴形</th></tr></thead><tbody><tr><th>較弱</th><td>90</td><td>95</td></tr><tr><th>較強</th><td>50</td><td>70</td></tr></tbody></table>',
  question:{prompt:'單看這批資料，哪個說法最精確？',choices:[
    {value:'gains',label:'在兩個已測條件，嘴形帶來的差距分別是 5 和 20 個百分點',feedback:'對。要比較嘴形的貢獻，就在同一列相減。低噪音時起點已達 90%，最多只能再增加 10 個百分點。'},
    {value:'always',label:'只要再增加噪音，嘴形的幫助一定會繼續上升',feedback:'表中只有兩種噪音。它能描述這兩個條件，無法預測更強噪音。要檢驗趨勢，需要增加噪音等級並重複測量。'}]},
  point:'',detail:'數字為練習設定；實驗背景見 '+speech+'。<a href="../lec02/index.html">複習心理物理測量</a>。',instruction:'先在每一列相減，再比較兩個差值。'
},{
  id:'station-design',section:'結課練習',title:'若是嘴形與聲音的時間對齊在起作用，你預測什麼？',
  lead:'請先用三句話作答：你打算只改哪一件事？要記錄什麼？哪種結果會讓你改變原本的解釋？',
  art:'<details data-key="answer"><summary>寫下預測後，比對一個可執行的設計</summary><p>保留同一批帶噪播報與同一段嘴形影片，只平移影音之間的時間差。平衡材料與順序，記錄每種延遲下站名答對的比例。</p><p>若時間對齊有幫助，我預測同步條件比明顯錯開時答得好。若多次測量仍很接近，我會下修對時間對齊的解釋，也會檢查題目是否太容易或太難。</p></details>',
  point:'完成的判準：能說出一個控制條件、一個可比較的結果，以及一種會使你修正解釋的觀察。',
  detail:'自編研究設計。<a href="#timing">回看跨感官時間線索</a>　<a href="../../index.html#map">回到 25 講課程地圖</a>',instruction:'先用自己的話回答，再展開。'
});

addCourseNarration(story.pages);
