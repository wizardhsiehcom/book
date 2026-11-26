const story = lesson(13);
const [observation, checkpoint] = story.pages;
const section = observation.section;
Object.assign(observation, {
  "art": "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"熟悉化後同時展示熟悉與新影像\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"150\" y=\"63\" font-family=\"sans-serif\" font-size=\"22\" text-anchor=\"middle\">先反覆看 A</text><text x=\"307\" y=\"63\" font-family=\"sans-serif\" font-size=\"26\" text-anchor=\"middle\">→</text><text x=\"455\" y=\"63\" font-family=\"sans-serif\" font-size=\"22\" text-anchor=\"middle\">再並排看 A 與 B</text><text x=\"300\" y=\"120\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">比較同一時段內，兩張圖各獲得多少注視。</text></svg><figcaption>臉以外的線索也改變時，較長的注視就可能有多種解釋。</figcaption></figure>",
  "detail": "補充研究：<a target=\"_blank\" href=\"https://pubmed.ncbi.nlm.nih.gov/12016317/#abstract\">Pascalis、de Haan 與 Nelson（2002），原始研究摘要，方法與結果段</a>。 色彩控制題為自編。"
});
checkpoint.detail = "補充研究：<a target=\"_blank\" href=\"https://pubmed.ncbi.nlm.nih.gov/12016317/#abstract\">Pascalis、de Haan 與 Nelson（2002），原始研究摘要，方法與結果段</a>。" + checkpoint.detail;

story.pages = [
  observation,
  {
    section,
    id: "ages",
    title: "同樣看兩張猴臉，哪個年齡組顯出辨別能力？",
    art: "<figure data-key=\"visual\"><table class=\"study-age-results\"><caption>看過一張臉後，換一張同物種的新臉，受試者有沒有表現出辨別能力？</caption><thead><tr><th scope=\"col\">年齡</th><th scope=\"col\">人臉</th><th scope=\"col\">猴臉</th></tr></thead><tbody><tr><th scope=\"row\">6 個月</th><td>有辨別證據</td><td>有辨別證據</td></tr><tr><th scope=\"row\">9 個月與成人</th><td>有辨別證據</td><td><strong>這次未測得辨別證據</strong></td></tr></tbody></table></figure>",
    point: "這次測試裡，辨別人臉和猴臉的結果隨年齡而變，支持臉孔辨別會逐漸專化。某一組沒有特別注視新臉，只能說這次沒測出差異；換個條件仍可能辨別得出來。",
    detail: "補充研究：<a target=\"_blank\" href=\"https://pubmed.ncbi.nlm.nih.gov/12016317/#abstract\">Pascalis、de Haan 與 Nelson（2002），原始研究摘要，方法與結果段</a>。",
    lead: ""
  },
  {
    section,
    id: "metamers",
    title: "控制照片色彩時，要分開看光譜和知覺",
    art: "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"不同光譜可以得到相同的三錐體反應\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"145\" y=\"50\" font-family=\"sans-serif\" font-size=\"22\" text-anchor=\"middle\">光譜 A</text><text x=\"145\" y=\"100\" font-family=\"sans-serif\" font-size=\"22\" text-anchor=\"middle\">光譜 B</text><line x1=\"202\" y1=\"46\" x2=\"310\" y2=\"70\" stroke=\"#36342f\" stroke-width=\"5\" stroke-linecap=\"round\"/><line x1=\"202\" y1=\"96\" x2=\"310\" y2=\"70\" stroke=\"#36342f\" stroke-width=\"5\" stroke-linecap=\"round\"/><text x=\"442\" y=\"78\" font-family=\"sans-serif\" font-size=\"21\" text-anchor=\"middle\">同一組 L、M、S 反應</text></svg><figcaption>L、M、S 是三類對長、中、短波長較敏感的視錐細胞。在相同觀看條件下，兩種光譜若引起同一組反應，就可能看起來同色，這叫同色異譜。</figcaption></figure>",
    point: "設計比較臉形的實驗時，固定螢幕、照明與顏色設定，能減少額外辨別線索。此頁為色彩原理的延伸練習。",
    detail: "補充教材：<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=uv2vYLFCgX0&amp;t=4200s\">Josh McDermott，MIT 9.35（2024），第 12 講 1:10:00–1:11:59</a> · <a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-perception-spring-2024/resources/mit9_35s24_lec12_1080p_mp4/\">官方逐字稿</a>。",
    lead: ""
  },
  checkpoint
];

