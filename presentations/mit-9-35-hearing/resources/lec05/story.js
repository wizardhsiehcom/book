const story = lesson(5);
const section = story.pages[0].section;
const overview = story.pages[0];
const originalCheck = story.pages.pop();
const sourceOne = "同課號補充教材：Josh McDermott，MIT 9.35（2024 春季版），<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=BxpmcOO2YqQ&amp;t=3360s\">第 8 講 56:00–57:55</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec08_1080p_mp4/\">The Eye and the Retina (cont’d)，官方逐字稿</a>。 中文圖解與觀察提示依原理自編。";
const sourceTwo = "MIT 9.35（2009 春季），<a target=\"_blank\" href=\"../../resources/lec08/437dd07a9704edc1720be308ef042dfb_MIT9_35s09_pset02.pdf#page=6\">作業 2，第 3a、3c、3d 題，PDF 第 6 頁</a>。 中文圖解與練習依原理自編。";
overview.detail += ' ' + sourceOne;
originalCheck.detail = sourceOne + ' ' + originalCheck.detail;

story.pages.push(
  {
    id: 'mechanism', section, title: "把圓形輸入排成一直線，怎麼做出方向偏好？",
    lead: "看三個取樣中心。哪個方向的亮條能同時覆蓋它們？",
    art: "<figure data-key=\"aligned\" class=\"course-pair\"><div><div aria-hidden=\"true\" style=\"color:#333;padding:.2em;letter-spacing:.25em;font-size:1.7em;background:linear-gradient(transparent 35%,#e6a47c 35% 65%,transparent 65%)\">●●●</div><strong>橫條穿過全部中心</strong></div><div><div aria-hidden=\"true\" style=\"color:#333;padding:.2em;letter-spacing:.25em;font-size:1.7em;background:linear-gradient(90deg,transparent 47%,#e6a47c 47% 53%,transparent 53%)\">●●●</div><strong>直條只穿過中間</strong></div></figure>",
    point: "Hubel 和 Wiesel 提出一個模型：外側膝狀體（LGN）中，感受野中心排成一列的細胞，把訊號送到同一個初級視覺皮質（V1）細胞。圖中橫條能同時照亮較多興奮區。",
    detail: sourceOne, instruction: '依圖中條件，先預測再讀解釋。'
  },
  {
    id: 'worked', section, title: "同一張圖用多個方向的濾波器看", lead: '',
    art: "<figure data-key=\"comparison\" class=\"course-pair\"><div><strong>垂直邊　│　│　│</strong></div><div><strong>斜向邊　／　／　／</strong></div></figure>",
    point: "原作業讓條紋從中心向外逐漸變淡（乘上高斯包絡），做成 Gabor 濾波器。把它轉到不同角度，比較輸出，就能找出圖上哪些地方的邊緣和它同方向。",
    detail: sourceTwo, instruction: '將兩種條件逐項對照。'
  },
  {
    id: 'transfer', section, title: "若要分辨是方向偏好，還是位置沒對準，應怎麼測？", lead: '', art: '',
    question: {prompt: '先預測，再核對原因。', choices: [
      {value: 'prediction', label: "在同一位置系統地旋轉條紋", feedback: "維持位置、頻率與對比，方向成為主要改變的條件。"},
      {value: 'alternative', label: "每換方向也移到不同視野位置", feedback: "維持位置、頻率與對比，方向成為主要改變的條件。"}
    ]},
    point: '', detail: sourceTwo, instruction: '說出你的預測依賴哪個前提。'
  },
  originalCheck
);

addCourseNarration(story.pages);
