const story = lesson(4);
const section = story.pages[0].section;
const overview = story.pages[0];
const originalCheck = story.pages.pop();
const sourceOne = "同課號補充教材：Josh McDermott，MIT 9.35（2024 春季版），<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=BxpmcOO2YqQ&amp;t=790s\">第 8 講 13:10–14:10</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec08_1080p_mp4/\">The Eye and the Retina (cont’d)，官方逐字稿</a>。 中文圖解與觀察提示依原理自編。";
const sourceTwo = "MIT 9.35（2009 春季），<a target=\"_blank\" href=\"../../resources/course/086d219123b0de7af3a6d32d9a335f7c_MIT9_35s09_rec02_eye_and_retina.pdf#page=20\">Eye and Retina，第 20 頁</a>。 中文圖解與練習依原理自編。";
overview.detail += ' ' + sourceOne;
originalCheck.detail = sourceOne + ' ' + originalCheck.detail;

story.pages.push(
  {
    id: 'mechanism', section, title: "同一個亮點照在中央或周圍，細胞的放電會一樣嗎？",
    lead: "感受野是光照後會影響某個細胞反應的區域。圖中是一個亮中心型神經節細胞的感受野。",
    art: "<figure data-key=\"field\" style=\"margin:0 auto;text-align:center\"><span role=\"img\" aria-label=\"橘色中央為興奮區，藍灰環圈為抑制區\" style=\"display:block;width:6em;height:6em;border-radius:50%;margin:0 auto;background:radial-gradient(circle,#cd7952 0 32%,#627281 33% 68%,transparent 69%)\"></span><figcaption>中心受光促進放電　／　環圈受光抑制放電</figcaption></figure>",
    point: "光點從中心移到周圍，對放電的影響可以反過來。亮中心型（ON）偏好中央變亮，暗中心型（OFF）偏好中央變暗。",
    detail: sourceOne, instruction: '依圖中條件，先預測再讀解釋。'
  },
  {
    id: 'worked', section, title: "中心和周圍一起亮起，為什麼算出來是 0？", lead: '',
    art: "<figure data-key=\"comparison\" class=\"course-pair\"><div><strong>只亮中心　4 − 0 = 4</strong></div><div><strong>兩處同亮　4 − 4 = 0</strong></div></figure>",
    point: "數字是自編的等權重模型。0 表示放電和原來一樣多。細胞原本就可能自己放電。",
    detail: sourceTwo, instruction: '將兩種條件逐項對照。'
  },
  {
    id: 'transfer', section, title: "只讓周圍變亮，模型輸出為負，該怎麼讀？", lead: '', art: '',
    question: {prompt: '先預測，再核對原因。', choices: [
      {value: 'alternative', label: "每秒發出負數個脈衝", feedback: "負值描述相對基線的改變；真實脈衝計數最低為零。"},
      {value: 'prediction', label: "放電可能低於原有基線", feedback: "負值描述相對基線的改變；真實脈衝計數最低為零。"}
    ]},
    point: '', detail: sourceTwo, instruction: '說出你的預測依賴哪個前提。'
  },
  originalCheck
);

addCourseNarration(story.pages);
