const story = lesson(2);
const section = story.pages[0].section;
const overview = story.pages[0];
const originalCheck = story.pages.pop();
const sourceOne = "同課號補充教材：Josh McDermott，MIT 9.35（2024 春季版），<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=pTe0A8ZOAGk&amp;t=1800s\">第 3 講 30:00–31:35</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec03_1080p_mp4/\">Sound Localization, Pitch, Timbre, and Loudness / Psychophysical Methods，官方逐字稿</a>。 中文圖解與觀察提示依原理自編。";
const sourceTwo = "同課號補充教材：Josh McDermott，MIT 9.35（2024 春季版），<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=pTe0A8ZOAGk&amp;t=2100s\">第 3 講 35:00–36:45</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec03_1080p_mp4/\">Sound Localization, Pitch, Timbre, and Loudness / Psychophysical Methods，官方逐字稿</a>。 中文圖解與練習依原理自編。";
overview.detail += ' ' + sourceOne;
originalCheck.detail = sourceOne + ' ' + originalCheck.detail;

story.pages.push(
  {
    id: 'mechanism', section, title: "兩個時段都有雜訊，哪一段比較像有閃光？",
    lead: "每回合只有一個時段有閃光。觀察者根據兩段引起的反應強弱來猜。",
    art: "<figure data-key=\"responses\" style=\"margin:0 auto;max-width:25em\"><div>時段甲 <meter min=\"0\" max=\"8\" value=\"3\">3</meter>　3</div><div>時段乙 <meter min=\"0\" max=\"8\" value=\"5\">5</meter>　5</div><figcaption>比較同一回合的兩個讀值：甲是 3，乙是 5。單位為教學示意。</figcaption></figure>",
    point: "這一次會選乙。如果雜訊使甲的反應比乙大，就會選錯。重複測試的答對率才有意義。",
    detail: sourceOne, instruction: '依圖中條件，先預測再讀解釋。'
  },
  {
    id: 'worked', section, title: "連續答對兩次就調弱，答錯一次就調強", lead: '',
    art: "<figure data-key=\"comparison\" class=\"course-pair\"><div><strong>8 → 7</strong>連續答對兩次，強度降一階</div><div><strong>7 → 8</strong>接著答錯一次，強度升一階</div></figure>",
    point: "這個階梯法把後續測試集中在較難分辨的強度。圖中起始強度為 8，每階相差 1，數字是教學示例。",
    detail: sourceTwo, instruction: '將兩種條件逐項對照。'
  },
  {
    id: 'transfer', section, title: "接著只答對一次，要立刻降到 7 嗎？", lead: '', art: '',
    question: {prompt: '先預測，再核對原因。', choices: [
      {value: 'alternative', label: "只要答對一次就降低", feedback: "要連續答對兩次才會從 8 降到 7。只答對一次時維持 8；答錯一次就提高一階。"},
      {value: 'prediction', label: "維持 8，等連續第二次答對", feedback: "要連續答對兩次才會從 8 降到 7。只答對一次時維持 8；答錯一次就提高一階。"}
    ]},
    point: '', detail: sourceTwo, instruction: '說出你的預測依賴哪個前提。'
  },
  originalCheck
);
