const story = lesson(12);
const [observation, checkpoint] = story.pages;
const section = observation.section;
Object.assign(observation, {
  title: "隔著窄窗看一條水平邊，能判斷它有沒有往右移嗎？",
  "art": "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"長邊在小窗中只有上下位置可見\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"45\" y=\"20\" width=\"215\" height=\"94\" fill=\"#aaa396\"/><rect x=\"340\" y=\"20\" width=\"215\" height=\"94\" fill=\"#aaa396\"/><line x1=\"46\" y1=\"62\" x2=\"259\" y2=\"62\" stroke=\"#36342f\" stroke-width=\"5\" stroke-linecap=\"round\"/><line x1=\"341\" y1=\"86\" x2=\"554\" y2=\"86\" stroke=\"#36342f\" stroke-width=\"5\" stroke-linecap=\"round\"/><text x=\"152\" y=\"141\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">第一刻</text><text x=\"448\" y=\"141\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">下一刻</text></svg><figcaption>兩個時刻都看不見端點。你知道邊緣下移了，但看得出它是否也往右嗎？</figcaption></figure>",
  "detail": "補充教材：<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=ReKjU4ZUAjg&amp;t=1080s\">Josh McDermott，MIT 9.35（2024），第 14 講 18:00–19:59</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec14_1080p_mp4/\">官方逐字稿</a>。 圖為自編。"
});
checkpoint.detail = "補充教材：<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=ReKjU4ZUAjg&amp;t=1080s\">Josh McDermott，MIT 9.35（2024），第 14 講 18:00–19:59</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec14_1080p_mp4/\">官方逐字稿</a>。" + checkpoint.detail;

story.pages = [
  observation,
  {
    section,
    id: "endpoint",
    title: "把窗打開，端點多提供了哪一個方向的資訊？",
    art: "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"兩種不同位移共享相同垂直分量\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"60\" y1=\"36\" x2=\"205\" y2=\"36\" stroke=\"#837c71\" stroke-width=\"5\" stroke-linecap=\"round\"/><line x1=\"60\" y1=\"70\" x2=\"205\" y2=\"70\" stroke=\"#b54f28\" stroke-width=\"5\" stroke-linecap=\"round\"/><line x1=\"343\" y1=\"36\" x2=\"488\" y2=\"36\" stroke=\"#837c71\" stroke-width=\"5\" stroke-linecap=\"round\"/><line x1=\"373\" y1=\"70\" x2=\"518\" y2=\"70\" stroke=\"#b54f28\" stroke-width=\"5\" stroke-linecap=\"round\"/><text x=\"131\" y=\"126\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">A：只往下</text><text x=\"445\" y=\"126\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">B：往右也往下</text></svg><figcaption>從灰線的端點看到橘線的端點。A 和 B 都往下移了一樣多；只有 B 的端點還往右移。</figcaption></figure>",
    point: "只露出直邊時，好幾種速度都能產生同一個畫面。露出端點後，就能分別量出它往下和往右移了多少。",
    detail: "補充教材：<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=ReKjU4ZUAjg&amp;t=1080s\">Josh McDermott，MIT 9.35（2024），第 14 講 18:00–19:59</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec14_1080p_mp4/\">官方逐字稿</a>。",
    lead: ""
  },
  {
    section,
    id: "eye-motion",
    title: "視網膜上的位置變了，物體一定移動了嗎？",
    art: "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"物體動與眼睛動都改變投影\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"150\" y=\"59\" font-family=\"sans-serif\" font-size=\"22\" text-anchor=\"middle\">眼睛不動</text><text x=\"150\" y=\"93\" font-family=\"sans-serif\" font-size=\"22\" text-anchor=\"middle\">物體向左</text><text x=\"450\" y=\"59\" font-family=\"sans-serif\" font-size=\"22\" text-anchor=\"middle\">物體不動</text><text x=\"450\" y=\"93\" font-family=\"sans-serif\" font-size=\"22\" text-anchor=\"middle\">視線向右</text></svg><figcaption>兩個條件下，物體在視野中的方向都向左改變。</figcaption></figure>",
    point: "要從影像位移推回世界中的運動，還需考慮觀察者的眼睛與頭部是否移動。",
    detail: "<a target=\"_blank\" href=\"../../resources/course/f54376b82b97dad2ff4de546d138bc0f_MIT9_35s09_rec03_motion.pdf#page=9\">MIT 9.35（2009），運動知覺習題課，PDF 第 9 頁</a>。",
    lead: ""
  },
  checkpoint
];


