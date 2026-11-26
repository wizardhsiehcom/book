const story = lesson(8);
const section = story.pages[0].section;
const overview = story.pages[0];
const originalCheck = story.pages.pop();
const sourceOne = "MIT 9.35（2009 春季），<a target=\"_blank\" href=\"../../resources/lec08/437dd07a9704edc1720be308ef042dfb_MIT9_35s09_pset02.pdf#page=4\">作業 2，第 2a 題，PDF 第 4 頁</a>。 中文圖解與觀察提示依原理自編。";
const sourceTwo = "同課號補充教材：Josh McDermott，MIT 9.35（2024 春季版），<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=BxpmcOO2YqQ&amp;t=960s\">第 8 講 16:00–17:53</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec08_1080p_mp4/\">The Eye and the Retina (cont’d)，官方逐字稿</a>。 中文圖解與練習依原理自編。";
overview.detail += ' ' + sourceOne;
originalCheck.detail = sourceOne + ' ' + originalCheck.detail;

story.pages.push(
  {
    id: 'mechanism', section, title: "兩個位置的亮度怎麼合成一個輸出？",
    lead: "作業把每個像素的亮度乘上它在感受野中的權重。把二維感受野縮成兩格，就能手算。",
    art: "<figure data-key=\"products\" style=\"margin:0 auto;max-width:24em\"><table style=\"width:100%;text-align:center\"><thead><tr><th scope=\"col\">位置</th><th scope=\"col\">亮度</th><th scope=\"col\">權重</th><th scope=\"col\">乘積</th></tr></thead><tbody><tr><th scope=\"row\">左格</th><td>3</td><td>＋2</td><td>＋6</td></tr><tr><th scope=\"row\">右格</th><td>2</td><td>−1</td><td>−2</td></tr></tbody></table><figcaption>先看最右欄：左格加 6，右格減 2，合起來是 <b>4</b>。</figcaption></figure>",
    point: "模型輸出為 2 × 3 − 1 × 2 = 4。較亮的像素若落在負權重區，整體輸出反而下降。這是教學算例。",
    detail: sourceOne, instruction: '依圖中條件，先預測再讀解釋。'
  },
  {
    id: 'worked', section, title: "兩幅小圖單獨算與一起算，答案會相同嗎？", lead: '',
    art: "<figure data-key=\"comparison\" class=\"course-pair\"><div><strong>A = [3, 0] → 6</strong></div><div><strong>B = [0, 2] → −2</strong></div></figure>",
    point: "輸入相加為 [3, 2]，輸出 4，正好等於 6 加上 −2。兩種算法用同一組權重，結果都是 4。這個例子符合疊加。",
    detail: sourceTwo, instruction: '將兩種條件逐項對照。'
  },
  {
    id: 'transfer', section, title: "如果將每次輸出中的負值截成零，還能先算 A、B 再相加嗎？", lead: '', art: '',
    question: {prompt: '先預測，再核對原因。', choices: [
      {value: 'alternative', label: "可以；權重沒有改變", feedback: "加上截斷後，B 的 −2 先變成零，分開計算已經失去抵銷量。這顯示非線性步驟的順序會改變結果。"},
      {value: 'prediction', label: "不能；分開算為 6，一起算為 4", feedback: "加上截斷後，B 的 −2 先變成零，分開計算已經失去抵銷量。這顯示非線性步驟的順序會改變結果。"}
    ]},
    point: '', detail: sourceTwo, instruction: '說出你的預測依賴哪個前提。'
  },
  originalCheck
);
