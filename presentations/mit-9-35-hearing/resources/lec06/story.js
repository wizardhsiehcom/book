const story = lesson(6);
const section = story.pages[0].section;
const overview = story.pages[0];
const originalCheck = story.pages.pop();
const sourceOne = "同課號補充教材：Josh McDermott，MIT 9.35（2024 春季版），<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=-I6-wJuPXk4&amp;t=1200s\">第 10 講 20:00–20:59</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec10_1080p_mp4/\">Mid-Level Vision，官方逐字稿</a>。 中文圖解與觀察提示依原理自編。";
const sourceTwo = "同課號補充教材：Josh McDermott，MIT 9.35（2024 春季版），<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=-I6-wJuPXk4&amp;t=1260s\">第 10 講 21:00–22:49</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec10_1080p_mp4/\">Mid-Level Vision，官方逐字稿</a>。 中文圖解與練習依原理自編。";
overview.detail += ' ' + sourceOne;
originalCheck.detail = sourceOne + ' ' + originalCheck.detail;

story.pages.push(
  {
    id: 'mechanism', section, title: "靠得近的點，也剛好是同一種圓點嗎？",
    lead: "",
    art: "<figure data-key=\"group\" style=\"margin:.5em auto;text-align:center\"><div style=\"font-size:clamp(1.6em,4vw,2.8em)\">●●　○○　●●</div><div style=\"font-size:clamp(1.6em,4vw,2.8em)\">●○　●○　●○</div><figcaption>先看哪兩點靠得近，再找哪些點同樣是空心或實心。上排兩種分法一致；下排會分出不同組。</figcaption></figure>",
    point: "鄰近和相似都能促成分組。當兩者支持不同切法，圖像可能有不只一種合理分法。",
    detail: sourceOne, instruction: '依圖中條件，先預測再讀解釋。'
  },
  {
    id: 'worked', section, title: "為什麼把近點看成一組？可以問兩個不同的問題", lead: '',
    art: "<figure data-key=\"comparison\" class=\"course-pair\"><div><strong>環境有什麼規律？</strong>靠得近的點，更可能來自同一個物體。</div><div><strong>大腦可能怎麼做？</strong>相鄰的神經元可能會增強彼此的反應。</div></figure>",
    point: "第一句提出環境中的規律，第二句提出可能的神經實作。從一張點陣看到分組，還不足以辨別究竟由哪個神經迴路完成。",
    detail: sourceTwo, instruction: '將兩種條件逐項對照。'
  },
  {
    id: 'transfer', section, title: "若想單獨檢驗「共同運動」是否能分組，怎麼比較？", lead: '', art: '',
    question: {prompt: '先預測，再核對原因。', choices: [
      {value: 'alternative', label: "同時讓一起移動的點改為相同顏色", feedback: "讓顏色和起始圖形保持相同，只改哪些點一起移動。這樣才能檢驗共同運動這條分組線索（共同命運）。"},
      {value: 'prediction', label: "固定起始圖形與顏色，只改哪些點一起移動", feedback: "讓顏色和起始圖形保持相同，只改哪些點一起移動。這樣才能檢驗共同運動這條分組線索（共同命運）。"}
    ]},
    point: '', detail: sourceTwo, instruction: '說出你的預測依賴哪個前提。'
  },
  originalCheck
);

addCourseNarration(story.pages);
