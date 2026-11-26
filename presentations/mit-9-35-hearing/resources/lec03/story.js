const story = lesson(3);
const section = story.pages[0].section;
const overview = story.pages[0];
const originalCheck = story.pages.pop();
const sourceOne = "同課號補充教材：Josh McDermott，MIT 9.35（2024 春季版），<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=piG9-U9loXo&amp;t=130s\">第 7 講 02:10–02:54</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec07_1080p_mp4/\">The Eye and Retina，官方逐字稿</a>。 中文圖解與觀察提示依原理自編。";
const sourceTwo = "同課號補充教材：Josh McDermott，MIT 9.35（2024 春季版），<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=piG9-U9loXo&amp;t=130s\">第 7 講 02:10–02:54</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec07_1080p_mp4/\">The Eye and Retina，官方逐字稿</a>。 中文圖解與練習依原理自編。";
overview.detail += ' ' + sourceOne;
originalCheck.detail = sourceOne + ' ' + originalCheck.detail;

story.pages.push(
  {
    id: 'mechanism', section, title: "光從眼前的亮點進來，影像會落在哪裡？",
    lead: "",
    art: "<figure data-key=\"comparison\" class=\"course-pair\"><div><strong>角膜 → 瞳孔 → 水晶體</strong>光穿過瞳孔。虹膜改變瞳孔大小，調節進光量。</div><div><strong>→ 視網膜</strong>角膜和水晶體使光折射，在眼底形成影像。</div></figure>",
    point: "視網膜先接到亮暗分布的影像，接下來才把光轉成神經訊號。",
    detail: sourceOne, instruction: '依圖中條件，先預測再讀解釋。'
  },
  {
    id: 'worked', section, title: "焦點移開，兩個亮點怎麼變成一片？", lead: '',
    art: "<figure class=\"course-pair\" data-key=\"spots\"><div><i aria-hidden=\"true\" style=\"display:block;height:5rem;background:radial-gradient(circle at calc(50% - 12px) 50%,#c76741 0 5px,transparent 6px),radial-gradient(circle at calc(50% + 12px) 50%,#c76741 0 5px,transparent 6px)\"></i><strong>合焦：兩點分開</strong></div><div><i aria-hidden=\"true\" style=\"display:block;height:5rem;background:radial-gradient(circle at calc(50% - 12px) 50%,#c76741 0 8px,transparent 28px),radial-gradient(circle at calc(50% + 12px) 50%,#c76741 0 8px,transparent 28px)\"></i><strong>離焦：光團重疊</strong></div></figure>",
    point: "兩個亮點的中心沒有移動。離焦時，每一團光都散得更開，中間的暗縫就變淺了。圖中簡化了實際成像過程。",
    detail: sourceTwo, instruction: '將兩種條件逐項對照。'
  },
  {
    id: 'transfer', section, title: "把失焦照片整體調亮，原先混合的兩團光會重新分開嗎？", lead: '', art: '',
    question: {prompt: '先預測，再核對原因。', choices: [
      {value: 'prediction', label: "整體變亮，仍然混在一起", feedback: "整體加亮會一起放大亮部與暗部；前後兩點在空間上重疊的程度沒有因此改變。"},
      {value: 'alternative', label: "只要夠亮就能恢復分離", feedback: "整體加亮會一起放大亮部與暗部；前後兩點在空間上重疊的程度沒有因此改變。"}
    ]},
    point: '', detail: sourceTwo, instruction: '說出你的預測依賴哪個前提。'
  },
  originalCheck
);
