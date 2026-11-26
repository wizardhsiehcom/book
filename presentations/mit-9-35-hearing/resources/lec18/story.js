const story = lesson(18);
const section = story.pages[0].section;
const check = story.pages.pop();
const anatomy = '<a target="_blank" href="https://www.nidcd.nih.gov/health/how-do-we-hear">NIH/NIDCD，How Do We Hear?</a>';
const mitVideo = '<a target="_blank" href="https://www.youtube.com/watch?v=IPJC8loEmd4&t=425s">Josh McDermott，MIT 9.35（2024），第 1 講 07:05–07:55</a>';
const earPath = courseDir + '../lec18/ear.jpg';
story.pages[0].art = '<figure data-key="anatomy" style="text-align:center;margin:0"><a target="_blank" href="'+earPath+'"><img src="'+earPath+'" style="max-width:100%;max-height:40vh" alt="耳道通向鼓膜，三塊聽小骨位在鼓膜與螺旋形耳蝸之間；聽神經從耳蝸通向腦部。"></a><figcaption>沿著耳道依序找三處：<b>粉紅色的鼓膜 → 三塊聽小骨 → 右側紫色、像蝸牛的耳蝸</b>。點圖可放大。</figcaption></figure>';
story.pages[0].detail = '原圖與構造說明：'+anatomy+'，步驟 1–4。';
story.pages.push({
 id:'change-carrier',section,title:'同一聲敲門，在鼓膜和聽神經上量到什麼？',lead:'',
 art:'<div class="course-pair" data-key="carriers"><div><strong>鼓膜</strong>隨時間前後移動</div><div><strong>聽神經</strong>隨時間傳送神經脈衝</div></div>',
 point:'耳道裡的氣壓變化使鼓膜振動。耳蝸把從中耳傳來的機械運動轉成電訊號，聽神經再把訊息送往腦。聽出「有人在敲門」還要解讀這些訊號。',detail:'原課以鼓膜位移描述輸入。'+mitVideo+'；'+anatomy+'，步驟 5–6。',instruction:'先問在每個位置要用什麼單位或儀器觀察。'
},{
 id:'transduction',section,title:'耳蝸裡的振動，在哪一步變成電訊號？',lead:'看耳蝸裡一個毛細胞的頂端。',
 art:'<ol data-key="chain"><li>行進波使基底膜位移。</li><li>毛細胞頂端的纖毛束發生偏轉。</li><li>纖毛束朝開啟通道的方向彎曲時，<strong>離子通道打開</strong>。離子流動，細胞電位隨之改變。</li></ol>',
 point:'從纖毛彎曲到細胞電位改變，就是這裡的感覺轉導：毛細胞把機械運動轉成電訊號。',detail:anatomy+'，步驟 4–6。',instruction:'從每個動詞判斷目前追蹤的是運動還是電位。'
},check);
check.detail += '　'+anatomy+'，步驟 5。';
