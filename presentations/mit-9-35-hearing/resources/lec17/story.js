const story = lesson(17);
const [observation, checkpoint] = story.pages;
const section = observation.section;
Object.assign(observation, {
  "title": "先聽兩個音：哪個聽起來比較亮？",
  "art": "<div data-key=\"sound\"><label>A　純音 <audio aria-label=\"A 純音\" controls preload=\"none\" style=\"width:min(100%,18rem);vertical-align:middle\" src=\"../../resources/lec17/a.wav\"></audio></label><br><label>B　複合音 <audio aria-label=\"B 複合音\" controls preload=\"none\" style=\"width:min(100%,18rem);vertical-align:middle\" src=\"../../resources/lec17/b.wav\"></audio></label></div>",
  "lead": "依序播放 A、B。先哼它們的音高，再形容兩者音色。",
  "previewArt": "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"兩個基頻相同的合成音，B 多出第二與第三諧波\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"99\" y1=\"101\" x2=\"99\" y2=\"33\" stroke=\"#635e55\" stroke-width=\"6\" stroke-linecap=\"round\"/><line x1=\"385\" y1=\"101\" x2=\"385\" y2=\"33\" stroke=\"#635e55\" stroke-width=\"6\" stroke-linecap=\"round\"/><line x1=\"430\" y1=\"101\" x2=\"430\" y2=\"69\" stroke=\"#a4512f\" stroke-width=\"6\" stroke-linecap=\"round\"/><line x1=\"475\" y1=\"101\" x2=\"475\" y2=\"84\" stroke=\"#a4512f\" stroke-width=\"6\" stroke-linecap=\"round\"/><text x=\"104\" y=\"135\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">A：220 Hz</text><text x=\"433\" y=\"135\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">B：220、440、660 Hz</text></svg><figcaption>橘線是 B 額外的諧波。兩段音都以 220 Hz 為基頻，使用相同的起音和收音時間。線高以各自基頻振幅為基準。</figcaption></figure>",
  "point": "兩段是自製的合成音。即使音高接近，聲音也能有不同的質感。下一頁查看改了哪些頻率。",
  "detail": "<a target=\"_blank\" href=\"../../resources/hearing/hearing.pdf#page=36\">Kimo Johnson，《Hearing》，MIT 9.35（2009），PDF 第 36 頁</a>。 合成音為教學示例。"
});
checkpoint.detail = "<a target=\"_blank\" href=\"../../resources/hearing/hearing.pdf#page=36\">Kimo Johnson，《Hearing》，MIT 9.35（2009），PDF 第 36 頁</a>。" + checkpoint.detail;
observation.mount = root => {
  const players = root.querySelectorAll("audio");
  return () => players.forEach(player => player.pause());
};
story.pages = [
  observation,
  {
    section,
    id: "spectrum",
    title: "兩個音都有 220 Hz，為什麼聽起來不一樣？",
    art: "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"兩個基頻相同的合成音，B 多出第二與第三諧波\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"99\" y1=\"101\" x2=\"99\" y2=\"33\" stroke=\"#635e55\" stroke-width=\"6\" stroke-linecap=\"round\"/><line x1=\"385\" y1=\"101\" x2=\"385\" y2=\"33\" stroke=\"#635e55\" stroke-width=\"6\" stroke-linecap=\"round\"/><line x1=\"430\" y1=\"101\" x2=\"430\" y2=\"69\" stroke=\"#a4512f\" stroke-width=\"6\" stroke-linecap=\"round\"/><line x1=\"475\" y1=\"101\" x2=\"475\" y2=\"84\" stroke=\"#a4512f\" stroke-width=\"6\" stroke-linecap=\"round\"/><text x=\"104\" y=\"135\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">A：220 Hz</text><text x=\"433\" y=\"135\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">B：220、440、660 Hz</text></svg><figcaption>橘線是 B 額外的諧波。兩段音都以 220 Hz 為基頻，使用相同的起音和收音時間。線高以各自基頻振幅為基準。</figcaption></figure>",
    point: "A 只有基頻 220 Hz。B 還有它的兩倍和三倍頻率（第二、第三諧波），所以音色可以不同。真實樂器的音色還和音怎麼開始、怎麼變弱有關。",
    detail: "<a target=\"_blank\" href=\"../../resources/hearing/hearing.pdf#page=36\">Kimo Johnson，《Hearing》，MIT 9.35（2009），PDF 第 36 頁</a>。",
    lead: ""
  },
  {
    section,
    id: "vowels",
    title: "維持同一個音高，從「啊」慢慢改成「衣」",
    art: "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"聲源經聲道改變頻譜包絡\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"142\" y=\"59\" font-family=\"sans-serif\" font-size=\"23\" text-anchor=\"middle\">聲帶振動</text><text x=\"302\" y=\"59\" font-family=\"sans-serif\" font-size=\"27\" text-anchor=\"middle\">→</text><text x=\"448\" y=\"59\" font-family=\"sans-serif\" font-size=\"23\" text-anchor=\"middle\">聲道形狀改變</text><text x=\"300\" y=\"119\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">嘴形改變時，聲道較強化的頻帶也會移動。</text></svg><figcaption>試著維持音高轉換母音。頻譜包絡上被強化的峰稱為共振峰。</figcaption></figure>",
    point: "聲帶提供一列諧波。聲道像濾波器，會讓其中某些頻段更突出。因此即使你維持同一個音高，聽者仍能分出「啊」和「衣」。",
    detail: "補充教材：<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=A9j5TFfysoU&amp;t=2760s\">Josh McDermott，MIT 9.35（2024），第 6 講 46:00–47:59</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec06_1080p_mp4/\">官方逐字稿</a>。",
    lead: ""
  },
  checkpoint
];


addCourseNarration(story.pages);
