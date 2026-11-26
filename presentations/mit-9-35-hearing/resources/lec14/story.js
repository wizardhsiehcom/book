const story = lesson(14);
const [observation, checkpoint] = story.pages;
const section = observation.section;
Object.assign(observation, {
  "art": "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"橘色矩形遮住灰圓右側的邊緣\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"277\" cy=\"79\" r=\"48\" fill=\"#a29d87\"/><rect x=\"289\" y=\"17\" width=\"91\" height=\"98\" fill=\"#ae532e\"/></svg><figcaption>沿著灰圓邊緣走，到橘色直邊時，圓弧中斷了。哪一塊看起來在前面？</figcaption></figure>",
  "detail": "<a target=\"_blank\" href=\"../../resources/course/31ef37ac76305c94207d0d4c6e3e21a4_MIT9_35s09_rec01_depth_cues.pdf#page=3\">MIT 9.35（2009），深度線索習題課，PDF 第 3 頁</a>。 依講義問題自製。"
});
checkpoint.detail = "<a target=\"_blank\" href=\"../../resources/course/31ef37ac76305c94207d0d4c6e3e21a4_MIT9_35s09_rec01_depth_cues.pdf#page=3\">MIT 9.35（2009），深度線索習題課，PDF 第 3 頁</a>。" + checkpoint.detail;

story.pages = [
  observation,
  {
    section,
    id: "relative-size",
    title: "照片裡較小的圓盤，一定比較遠嗎？",
    art: "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"兩個不同視角大小的圓\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"180\" cy=\"72\" r=\"40\" fill=\"#a35432\"/><circle cx=\"423\" cy=\"72\" r=\"20\" fill=\"#a35432\"/><text x=\"180\" y=\"137\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">影像直徑 2 格</text><text x=\"423\" y=\"137\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">影像直徑 1 格</text></svg><figcaption>若知道兩個圓盤實際一樣大、正對你，在透視投影下，較小影像對應較遠的圓盤。</figcaption></figure>",
    point: "如果圓盤本來就一大一小，即使放在同樣遠的地方，也可能拍出這張圖。要用影像大小判斷遠近，得先知道實物的大小關係。",
    detail: "補充教材：<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=gaZTffZYyrg&amp;t=1380s\">Josh McDermott，MIT 9.35（2024），第 15 講 23:00–23:59</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec15_1080p_mp4/\">官方逐字稿</a>。 圓盤為自編。",
    lead: ""
  },
  {
    section,
    id: "order-scale",
    title: "看得出誰在前面，也能看出相隔幾公尺嗎？",
    art: "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"三層紙片彼此遮擋\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"157\" y=\"50\" width=\"100\" height=\"70\" fill=\"#918e82\"/><rect x=\"224\" y=\"36\" width=\"100\" height=\"70\" fill=\"#c9b485\"/><rect x=\"290\" y=\"22\" width=\"100\" height=\"70\" fill=\"#ac5630\"/><text x=\"167\" y=\"140\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">灰</text><text x=\"279\" y=\"140\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">沙色</text><text x=\"386\" y=\"140\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">橘</text></svg><figcaption>指出每一處輪廓中斷的位置，再由前往後排出橘、沙色、灰。</figcaption></figure><details data-key=\"reveal\"><summary>能從遮擋算出層距嗎？</summary><p>只要投影輪廓和前後序相同，靠得很近的紙片與隔得很遠的布景都能產生這張圖。</p></details>",
    point: "同一張照片可能提供可靠的前後序，卻無法決定以公尺表示的間隔。",
    detail: "<a target=\"_blank\" href=\"../../resources/course/31ef37ac76305c94207d0d4c6e3e21a4_MIT9_35s09_rec01_depth_cues.pdf#page=3\">MIT 9.35（2009），深度線索習題課，PDF 第 3 頁</a>。 疊片範例為自編。",
    lead: ""
  },
  checkpoint
];

