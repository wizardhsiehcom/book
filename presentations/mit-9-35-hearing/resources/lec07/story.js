const story = lesson(7);
const section = story.pages[0].section;
const overview = story.pages[0];
const originalCheck = story.pages.pop();
const sourceOne = "同課號補充教材：Josh McDermott，MIT 9.35（2024 春季版），<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=7cEAX5gqd7o&amp;t=1865s\">第 17 講 31:05–32:34</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec17_1080p_mp4/\">The Generic Viewpoint Assumption; Object Recognition，官方逐字稿</a>。 中文圖解與觀察提示依原理自編。";
const sourceTwo = "同課號補充教材：Josh McDermott，MIT 9.35（2024 春季版），<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=7cEAX5gqd7o&amp;t=1960s\">第 17 講 32:40–34:31</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec17_1080p_mp4/\">The Generic Viewpoint Assumption; Object Recognition，官方逐字稿</a>。 中文圖解與練習依原理自編。";
overview.detail += ' ' + sourceOne;
overview.art = "<figure class=\"course-pair\" data-key=\"cup\"><div><i aria-hidden=\"true\" style=\"display:block;width:5em;height:1em;border:3px solid currentColor;border-radius:50%;margin:1.55em auto\"></i><strong>接近側視：杯口窄</strong></div><div><i aria-hidden=\"true\" style=\"display:block;width:4em;height:4em;border:3px solid currentColor;border-radius:50%;margin:.05em auto\"></i><strong>正上方：杯口圓</strong></div></figure>";
originalCheck.detail = sourceOne + ' ' + originalCheck.detail;

story.pages.push(
  {
    id: 'mechanism', section, title: "同一雙鞋可以拍成許多不同影像",
    lead: "講者先展示同一雙鞋在不同條件下的影像，再展示外形不同、都叫鞋的物件。",
    art: "<figure data-key=\"comparison\" class=\"course-pair\"><div><strong>同一雙鞋 → 多種角度</strong></div><div><strong>不同的鞋 → 同一類別</strong></div></figure>",
    point: "看原片的兩組照片。第一組問「還是同一雙嗎？」光線、位置和角度都可能改變。第二組問「這些都是鞋嗎？」即使款式不同，仍可能屬於同一類。",
    detail: sourceOne, instruction: '依圖中條件，先預測再讀解釋。'
  },
  {
    id: 'worked', section, title: "把「認得形狀」和「找得到位置」拆成兩種任務", lead: '',
    art: "<figure data-key=\"comparison\" class=\"course-pair\"><div><strong>先看形狀 → 選匹配形狀</strong></div><div><strong>先看地標 → 選靠近地標的物件</strong></div></figure>",
    point: "課堂比較兩組猴子。牠們的大腦受損部位不同。顳葉受損時形狀辨別較困難；頂葉受損時地標位置判斷較困難。兩種作業幫助區分辨識與空間判斷。",
    detail: sourceTwo, instruction: '將兩種條件逐項對照。'
  },
  {
    id: 'transfer', section, title: "若同一張杯子照片總是出現在左邊，答對能證明辨識杯子嗎？", lead: '', art: '',
    question: {prompt: '先預測，再核對原因。', choices: [
      {value: 'prediction', label: "還要打散位置再測", feedback: "位置提供了另一條答題捷徑。固定物體身分而改變位置，才能檢查辨識是否容許平移。"},
      {value: 'alternative', label: "左邊選對就足以證明", feedback: "位置提供了另一條答題捷徑。固定物體身分而改變位置，才能檢查辨識是否容許平移。"}
    ]},
    point: '', detail: sourceTwo, instruction: '說出你的預測依賴哪個前提。'
  },
  originalCheck
);

addCourseNarration(story.pages);
