const story = lesson(10);
const [observation, checkpoint] = story.pages;
const section = observation.section;
Object.assign(observation, {
  "art": "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"一條水平線被中央長方形遮住\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"110\" y1=\"68\" x2=\"490\" y2=\"68\" stroke=\"#36342f\" stroke-width=\"5\" stroke-linecap=\"round\"/><rect x=\"260\" y=\"8\" width=\"80\" height=\"118\" fill=\"#c28965\"/><text x=\"300\" y=\"145\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">遮住中段，兩側線段仍共線</text></svg><figcaption>先看右段與左段指向何處。你會把它們接起來嗎？</figcaption></figure>",
  "detail": "補充教材：<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=-I6-wJuPXk4&amp;t=1552s\">Josh McDermott，MIT 9.35（2024），第 10 講 25:52–26:46</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec10_1080p_mp4/\">官方逐字稿</a>。 遮擋圖為自編。"
});
checkpoint.detail = "補充教材：<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=-I6-wJuPXk4&amp;t=1552s\">Josh McDermott，MIT 9.35（2024），第 10 講 25:52–26:46</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec10_1080p_mp4/\">官方逐字稿</a>。" + checkpoint.detail;

story.pages = [
  observation,
  {
    section,
    id: "rotate",
    title: "只轉動右段，還像是同一根桿嗎？",
    art: "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"遮擋右方改成斜線\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"110\" y1=\"68\" x2=\"260\" y2=\"68\" stroke=\"#36342f\" stroke-width=\"5\" stroke-linecap=\"round\"/><line x1=\"340\" y1=\"68\" x2=\"467\" y2=\"20\" stroke=\"#36342f\" stroke-width=\"5\" stroke-linecap=\"round\"/><rect x=\"260\" y=\"8\" width=\"80\" height=\"118\" fill=\"#c28965\"/><text x=\"300\" y=\"145\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">只轉右段，遮擋位置不變</text></svg><figcaption>沿著左段往右延伸，再沿右段往左延伸。兩段還是碰到柱子，但延長線接不起來了。</figcaption></figure>",
    point: "兩段線越容易平順地接起來，我們越傾向把它們看成同一條輪廓。這叫「良好延續」。",
    detail: "補充教材：<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=-I6-wJuPXk4&amp;t=1552s\">Josh McDermott，MIT 9.35（2024），第 10 講 25:52–26:46</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec10_1080p_mp4/\">官方逐字稿</a>。",
    lead: ""
  },
  {
    section,
    id: "alternatives",
    title: "兩根分開的短桿，也能產生第一頁的圖像",
    art: "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"隱藏區可藏一根或兩根桿\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"30\" y1=\"63\" x2=\"270\" y2=\"63\" stroke=\"#36342f\" stroke-width=\"5\" stroke-linecap=\"round\"/><line x1=\"330\" y1=\"63\" x2=\"411\" y2=\"63\" stroke=\"#36342f\" stroke-width=\"5\" stroke-linecap=\"round\"/><line x1=\"454\" y1=\"63\" x2=\"570\" y2=\"63\" stroke=\"#36342f\" stroke-width=\"5\" stroke-linecap=\"round\"/><text x=\"150\" y=\"124\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">假說 A：一根長桿</text><text x=\"453\" y=\"124\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">假說 B：兩根短桿</text></svg><figcaption>把兩種假說中間各蓋住一段，外面都可能只剩兩端。</figcaption></figure><details data-key=\"reveal\"><summary>什麼觀察能區分兩種假說？</summary><p>移開遮擋物，看不可見區內有沒有間隙。保持遮擋只增加觀察時間，通常無法補回被遮掉的證據。</p></details>",
    point: "圖像支持某種連法，並不保證那就是物體的真實構造。",
    detail: "補充教材：<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=-I6-wJuPXk4&amp;t=1552s\">Josh McDermott，MIT 9.35（2024），第 10 講 25:52–26:46</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec10_1080p_mp4/\">官方逐字稿</a>。 兩種假說是自編推理題。",
    lead: ""
  },
  checkpoint
];
