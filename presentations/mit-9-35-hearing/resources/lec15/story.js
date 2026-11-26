const story = lesson(15);
const [observation, checkpoint] = story.pages;
const section = observation.section;
Object.assign(observation, {
  "art": "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"固定遠方視標比較兩眼投影\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"55\" y=\"44\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">左眼</text><text x=\"55\" y=\"102\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">右眼</text><line x1=\"125\" y1=\"40\" x2=\"500\" y2=\"40\" stroke=\"#8f8779\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"125\" y1=\"99\" x2=\"500\" y2=\"99\" stroke=\"#8f8779\" stroke-width=\"2\" stroke-linecap=\"round\"/><circle cx=\"255\" cy=\"40\" r=\"9\" fill=\"#af4f2e\"/><circle cx=\"225\" cy=\"99\" r=\"9\" fill=\"#af4f2e\"/><rect x=\"410\" y=\"33\" width=\"14\" height=\"14\" fill=\"#354b53\"/><rect x=\"410\" y=\"92\" width=\"14\" height=\"14\" fill=\"#354b53\"/></svg><figcaption>方形是注視點。分別量出每一列圓點到方形的水平距離，再比較兩列。</figcaption></figure>",
  "detail": "補充教材：<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=ZF7oiSWipB0&amp;t=1740s\">Josh McDermott，MIT 9.35（2024），第 16 講 29:00–31:59</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec16_1080p_mp4/\">官方逐字稿</a>。 位置為示意。"
});
checkpoint.detail = "補充教材：<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=ZF7oiSWipB0&amp;t=1740s\">Josh McDermott，MIT 9.35（2024），第 16 講 29:00–31:59</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec16_1080p_mp4/\">官方逐字稿</a>。" + checkpoint.detail;

story.pages = [
  observation,
  {
    section,
    id: "correspondence",
    title: "算視差前，先確定兩眼配到同一個點",
    art: "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"兩列重複的點讓配對有多個候選\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"57\" y=\"47\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">左眼</text><text x=\"57\" y=\"108\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">右眼</text><circle cx=\"160\" cy=\"40\" r=\"7\" fill=\"#575449\"/><circle cx=\"172\" cy=\"100\" r=\"7\" fill=\"#575449\"/><circle cx=\"230\" cy=\"40\" r=\"7\" fill=\"#575449\"/><circle cx=\"242\" cy=\"100\" r=\"7\" fill=\"#575449\"/><circle cx=\"300\" cy=\"40\" r=\"7\" fill=\"#575449\"/><circle cx=\"312\" cy=\"100\" r=\"7\" fill=\"#575449\"/><circle cx=\"370\" cy=\"40\" r=\"7\" fill=\"#575449\"/><circle cx=\"382\" cy=\"100\" r=\"7\" fill=\"#575449\"/><circle cx=\"440\" cy=\"40\" r=\"7\" fill=\"#575449\"/><circle cx=\"452\" cy=\"100\" r=\"7\" fill=\"#575449\"/><line x1=\"230\" y1=\"49\" x2=\"242\" y2=\"91\" stroke=\"#a3512d\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"230\" y1=\"49\" x2=\"312\" y2=\"91\" stroke=\"#b8afa0\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg><figcaption>試著配對左眼第二點。重複花紋讓相鄰位置也像候選答案。</figcaption></figure>",
    point: "這裡的雙眼視差，是同一點在左右眼影像裡相差的水平距離。若把左眼的一點配到右眼的另一點，即使量得很準，也會算錯深度。",
    detail: "補充教材：<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=ZF7oiSWipB0&amp;t=2700s\">Josh McDermott，MIT 9.35（2024），第 16 講 45:00–46:59</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec16_1080p_mp4/\">官方逐字稿</a>。",
    lead: ""
  },
  {
    section,
    id: "random-dots",
    title: "沒有畫出方框，深度仍能把一塊區域分出來",
    art: "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"隨機點立體圖生成流程\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"134\" y=\"64\" font-family=\"sans-serif\" font-size=\"20\" text-anchor=\"middle\">一張隨機點圖</text><text x=\"290\" y=\"64\" font-family=\"sans-serif\" font-size=\"25\" text-anchor=\"middle\">→</text><text x=\"447\" y=\"64\" font-family=\"sans-serif\" font-size=\"20\" text-anchor=\"middle\">將局部點群側移</text><text x=\"300\" y=\"120\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">兩眼各呈現一張，偏移只發生在選定區域。</text></svg><figcaption>在能順利融合的觀看條件下，局部區域因相對視差而浮出或退後。</figcaption></figure>",
    point: "Julesz 的示範顯示，只要配對左右眼看到的點群，就可能看出前後深度，即使單眼看不到清楚的物體輪廓。",
    detail: "補充教材：<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=ZF7oiSWipB0&amp;t=2700s\">Josh McDermott，MIT 9.35（2024），第 16 講 45:00–46:59</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec16_1080p_mp4/\">官方逐字稿</a>。",
    lead: ""
  },
  checkpoint
];

