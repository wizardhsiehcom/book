const story = lesson(11);
const [observation, checkpoint] = story.pages;
const section = observation.section;
Object.assign(observation, {
  "title": "你挑出最像的五張臉，和電腦挑的一樣嗎？",
  "lead": "2009 年作業 5 請學生先用肉眼排相似臉，再比較程式的排名。",
  "art": "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"兩種排序方式\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"148\" y=\"57\" font-family=\"sans-serif\" font-size=\"23\" text-anchor=\"middle\">看臉後挑出</text><text x=\"148\" y=\"92\" font-family=\"sans-serif\" font-size=\"23\" text-anchor=\"middle\">最像的五個人</text><text x=\"300\" y=\"79\" font-family=\"sans-serif\" font-size=\"27\" text-anchor=\"middle\">↔</text><text x=\"462\" y=\"57\" font-family=\"sans-serif\" font-size=\"23\" text-anchor=\"middle\">逐像素計算</text><text x=\"462\" y=\"92\" font-family=\"sans-serif\" font-size=\"23\" text-anchor=\"middle\">取距離最小的五人</text></svg><figcaption>兩種排序使用同一批照片；先做人的排序，再揭示程式結果。</figcaption></figure>",
  "point": "若名次不同，先檢查程式究竟對哪些影像差異敏感。",
  "detail": "<a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-sensation-and-perception-spring-2009/6b86c399b2f30817b955ebfb40945c32_MIT9_35s09_pset05.pdf#page=2\">MIT 9.35（2009），作業 5，第 1–5 題，PDF 第 2 頁</a>。"
});
checkpoint.detail = "<a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-sensation-and-perception-spring-2009/6b86c399b2f30817b955ebfb40945c32_MIT9_35s09_pset05.pdf#page=2\">MIT 9.35（2009），作業 5，第 1–5 題，PDF 第 2 頁</a>。" + checkpoint.detail;
checkpoint.title="把臉照左右平移一格，像素距離為何可能大增？";
checkpoint.question={prompt:"影像仍是同一人，哪個機制能解釋排名改變？",choices:[{value:"position",label:"同一格像素對到了臉的不同部位",feedback:"原先對著眼角的位置可能改對到皮膚。作業刻意控制姿勢與尺寸，正是為了減少這類差異。"},{value:"identity",label:"平移改變了真實身分",feedback:"身分維持相同。改變的是像素對應，因此排名可以改變。"}]};

story.pages = [
  observation,
  {
    section,
    id: "distance",
    title: "只改亮度，能讓同一張圖的像素距離變大嗎？",
    art: "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"兩張二乘二影像，每格亮度都增加十\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"100\" y=\"25\" width=\"30\" height=\"30\" fill=\"rgb(50,50,50)\"/><rect x=\"132\" y=\"25\" width=\"30\" height=\"30\" fill=\"rgb(150,150,150)\"/><rect x=\"100\" y=\"57\" width=\"30\" height=\"30\" fill=\"rgb(50,50,50)\"/><rect x=\"132\" y=\"57\" width=\"30\" height=\"30\" fill=\"rgb(150,150,150)\"/><rect x=\"400\" y=\"25\" width=\"30\" height=\"30\" fill=\"rgb(60,60,60)\"/><rect x=\"432\" y=\"25\" width=\"30\" height=\"30\" fill=\"rgb(160,160,160)\"/><rect x=\"400\" y=\"57\" width=\"30\" height=\"30\" fill=\"rgb(60,60,60)\"/><rect x=\"432\" y=\"57\" width=\"30\" height=\"30\" fill=\"rgb(160,160,160)\"/><text x=\"130\" y=\"131\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">原圖：50、150 交替</text><text x=\"432\" y=\"131\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">每格加 10</text></svg><figcaption>教學小圖只剩四個像素。兩張圖的明暗排列完全相同。</figcaption></figure><details data-key=\"reveal\"><summary>算出距離</summary><p>四個位置各差 10，平方後相加為 400，開平方根得 20。若拿原圖跟自己比，結果為 0。</p></details>",
    point: "把相同位置的亮度差平方、加總，再開平方根，得到的就是歐氏距離。臉形不變，只要整張圖變亮，這個數也會變大。",
    detail: "<a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-sensation-and-perception-spring-2009/6b86c399b2f30817b955ebfb40945c32_MIT9_35s09_pset05.pdf#page=2\">MIT 9.35（2009），作業 5，第 1–5 題，PDF 第 2 頁</a>。 四格數值為自編。",
    lead: ""
  },
  {
    section,
    id: "testset",
    title: "模型是否認得同一個人，要用另一張照片檢驗",
    art: "<figure data-key=\"visual\" style=\"margin:.5em auto;max-width:44rem\"><svg role=\"img\" aria-label=\"註冊照片與未見過的測試照片分開\" viewBox=\"0 0 600 152\" style=\"width:100%;max-height:25vh;display:block;background:#f4efe6;color:#292721;border-radius:.35rem\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"150\" y=\"69\" font-family=\"sans-serif\" font-size=\"21\" text-anchor=\"middle\">註冊：每人一張</text><text x=\"306\" y=\"69\" font-family=\"sans-serif\" font-size=\"24\" text-anchor=\"middle\">→</text><text x=\"461\" y=\"69\" font-family=\"sans-serif\" font-size=\"21\" text-anchor=\"middle\">測試：另一次拍攝</text><text x=\"303\" y=\"119\" font-family=\"sans-serif\" font-size=\"17\" text-anchor=\"middle\">用測試照找最近的註冊照，核對兩張的身分。</text></svg><figcaption>若測試照同時出現在註冊庫，它會以零距離找到自己。</figcaption></figure>",
    point: "更換光線、表情或姿勢可檢驗模型的適用範圍。要找出哪一項造成誤判，一次改一項並保留對照。",
    detail: "<a target=\"_blank\" href=\"https://ocw.mit.edu/courses/9-35-sensation-and-perception-spring-2009/6b86c399b2f30817b955ebfb40945c32_MIT9_35s09_pset05.pdf#page=3\">MIT 9.35（2009），作業 5，第 6 題，PDF 第 3 頁</a>。",
    lead: ""
  },
  checkpoint
];
