'use strict';

// ponytail: 固定 ASCII 教學串流；若加入非 ASCII 內容，改以 TextEncoder 的 bytes 建模。
const tcpStream = 'HELLO\nWORLD\n';
const tcpCuts = { mixed: [2, 6, 4], whole: [12], single: Array(12).fill(1) };
function tcpReceive(pending, chunk, eof = false) {
  const messages = (pending + chunk).split('\n');
  const tail = messages.pop();
  return { messages, pending: tail, truncated: eof && tail.length > 0 };
}
function tcpSnapshot(cuts, step) {
  let count = 0, pending = '', latest = '';
  const messages = [];
  for (const size of cuts.slice(0, step)) {
    latest = tcpStream.slice(count, count + size);
    const result = tcpReceive(pending, latest);
    messages.push(...result.messages);
    pending = result.pending;
    count += latest.length;
  }
  return { count, pending, latest, messages };
}

// 圖解只使用本檔維護的可信 ASCII 範例，不接受讀者輸入或遠端內容。
// 一格一 byte，讓切段大小可數；格子對輔助技術隱藏，改讀同一段文字。
const tcpToken = (text, kind = '') => `<span class="tcp-token ${kind}"><span class="tcp-sr">${text.replaceAll('\n', '↵（換行）')}</span>${[...text].map(c => c === '\n' ? '<span class="tcp-byte tcp-end" aria-hidden="true">↵</span>' : `<span class="tcp-byte" aria-hidden="true">${c}</span>`).join('')}</span>`;
const tcpRow = (label, content) => `<div class="tcp-row"><div class="tcp-label">${label}</div><div class="tcp-items">${content}</div></div>`;
const tcpEmpty = text => `<span class="tcp-empty">${text}</span>`;
const tcpReceived = (latest, pending, messages, prior = '') =>
  (prior ? tcpRow('原本保留', tcpToken(prior, 'tcp-wait')) : '') +
  tcpRow('這次收到', latest ? tcpToken(latest) : tcpEmpty('尚未接收')) +
  tcpRow('緩衝區留下', pending ? tcpToken(pending, 'tcp-wait') : tcpEmpty('空的')) +
  tcpRow('已完成訊息', messages.length ? messages.map(m => tcpToken(m, 'tcp-done')).join('') : tcpEmpty('還沒有完整的一筆'));

const story = {
  title: '一句話，怎樣才算收齊？',
  label: '逐步解說 / TCP 串流與訊息邊界',
  back: { href: '../../08-tcp-stream.html', label: '返回第 08 章' },
  pages: [
    {
      id: 'tcp-call-boundaries', section: '01 / 從章節的問題開始',
      title: '送了 40 bytes，怎麼只收到 11？',
      lead: '連線還開著。送端的 send 回傳 40，接收端第一次 recv 卻只拿到 11 bytes。這筆資料算收完了嗎？',
      art: '<div class="tcp-pair"><div class="tcp-card"><span class="tcp-caption">送端 · 本次 send</span><strong class="tcp-number">40 <small>bytes</small></strong><p>本端呼叫回報的數量</p></div><div class="tcp-card"><span class="tcp-caption">接收端 · 首次 recv</span><strong class="tcp-number">11 <small>bytes</small></strong><p>這次實際交給接收程式的數量</p></div></div><p class="tcp-note">其餘資料在哪裡？只憑這兩個數字，還無法判定。</p>',
      point: '一次呼叫結束，還不足以證明一筆訊息收齊。',
      detail: '40／11 是教學情境，不是實測紀錄。send 成功也不證明對端應用已讀取或完成工作。<a href="https://docs.python.org/3.13/howto/sockets.html#using-a-socket">來源：Python Socket HOWTO</a>。',
    },
    {
      id: 'tcp-sender-view', section: '02 / 換一組看得清楚的資料',
      title: '你想交給對方兩筆文字',
      lead: '先把 40／11 放一旁，換成 HELLO 與 WORLD。它們在送端各自是一筆；這一輪，還沒有加入任何分隔符。',
      art: tcpRow('送端的兩筆', tcpToken('HELLO') + tcpToken('WORLD', 'tcp-second')) + '<div class="tcp-rule"></div>' + tcpRow('串流中的內容', tcpToken('HELLOWORLD')),
      point: '送端原本的兩筆資料，不會自動變成接收端可辨認的兩筆。',
      detail: '這一輪是 10 個 ASCII bytes。兩個方塊是作者標記；TCP 不保留每次 send 的訊息邊界。<a href="https://www.rfc-editor.org/rfc/rfc9293.html#section-3.7">來源：RFC 9293 §3.7</a>。',
    },
    {
      id: 'tcp-predict', section: '03 / 站到接收端想一想',
      title: '只有 HE，能確定收齊了嗎？',
      lead: '假設第一次只拿到 HE。接收程式事先不知道內容，也不知道每筆有多長；它只能看眼前的資料。',
      art: tcpRow('目前拿到', tcpToken('HE', 'tcp-wait')),
      question: {
        prompt: '接收程式能直接把 HE 當成完整的一筆嗎？', hideFuturePreviews: true,
        choices: [
          { value: 'yes', label: '可以，這次 recv 已經結束', feedback: 'recv 結束只說明這次拿到 HE。後面仍可能接著 LLO；還缺辨認訊息邊界的約定。' },
          { value: 'unknown', label: '還不能，缺少邊界約定', feedback: '對。HE 可能是一整筆，也可能是開頭；只看這次接收，無法判定。' },
        ],
      },
      point: '接收程式不能靠我們事先知道的答案，猜一筆資料在哪裡結束。',
    },
    {
      id: 'tcp-cross-boundary', section: '04 / 下一段也沒有答案',
      title: '下一次，連第二筆的開頭也來了',
      lead: '接著收到 LLOWO。把它接在 HE 後面，得到 HELLOWO；這串內容本身仍沒有畫出兩筆之間的界線。',
      art: tcpRow('原本保留', tcpToken('HE', 'tcp-wait')) + tcpRow('這次收到', tcpToken('LLOWO')) + '<div class="tcp-rule"></div>' + tcpRow('接起來', tcpToken('HELLOWO', 'tcp-wait')),
      point: '一次接收可以跨過原本兩筆的交界；多收一段，也不會自動得到邊界。',
      detail: '這裡刻意用相同顏色：接收端拿到的 bytes 沒有作者替兩筆文字加上的色標。',
    },
    {
      id: 'tcp-framing', section: '05 / 重新開始，補一個約定',
      title: '雙方約好：看到 ↵，這筆才結束',
      lead: '重新傳一次，這回每筆後面都加一個換行 byte。接收端也事先知道：找到換行，才能取出前面的文字。',
      art: tcpRow('第一筆', tcpToken('HELLO\n')) + tcpRow('第二筆', tcpToken('WORLD\n', 'tcp-second')) + '<p class="tcp-note">5 ＋ 1 ＋ 5 ＋ 1 ＝ 12 bytes<br>↵ 代表一個換行 byte，真的會跟著資料一起傳。</p>',
      point: '訊息定界（framing）是雙方約定的規則；這次選擇換行。',
      detail: '本例限定 ASCII，且正文不含換行。其他內容需要跳脫規則或不同定界方式；TCP 本身不會加入 ↵。',
    },
    {
      id: 'tcp-keep-tail', section: '06 / 收到前 2 bytes',
      title: 'HE 先留下，現在還不能交出',
      lead: '加上約定後，第一次仍可能只收到 HE。尚未遇到換行，就把它留在緩衝區（buffer），等下一段接上。',
      art: tcpReceived('HE', 'HE', []),
      point: '緩衝區保存還沒收齊的尾巴；這次讀完，不急著解析成一筆。',
      detail: '這些切段是教學模型中的可能結果，不是實際 recv 的固定大小。',
    },
    {
      id: 'tcp-extract-one', section: '07 / 再收到 6 bytes',
      title: '取出 HELLO，把 WO 留下',
      lead: '新來的是 LLO↵WO。接上原本的 HE，第一個換行出現了：取出 HELLO，保留後面的 WO。',
      art: tcpReceived('LLO\nWO', 'WO', ['HELLO'], 'HE'),
      point: '同一次收到的內容，可以同時包含一筆的結尾與下一筆的開頭。',
      detail: '換行用來定界，這個模型交出的訊息不包含換行。WO 不能丟掉，也不能併進 HELLO。',
    },
    {
      id: 'tcp-extract-two', section: '08 / 最後收到 4 bytes',
      title: 'RLD↵ 接上來，WORLD 也完整了',
      lead: '把 RLD↵ 接在 WO 後面，再找到一次換行。兩筆都已取出，緩衝區現在是空的。',
      art: tcpReceived('RLD\n', '', ['HELLO', 'WORLD'], 'WO'),
      point: '三次接收，組回兩筆訊息。接收次數不必等於訊息數。',
      detail: '2 ＋ 6 ＋ 4 ＝ 12 bytes。緩衝區清空不表示連線關閉；同一連線仍可傳下一筆。',
    },
    {
      id: 'tcp-try-cuts', section: '09 / 換你操作',
      title: '切法改了，還能組回同樣兩筆嗎？',
      lead: '選一種切法，逐段餵入同一串 HELLO↵WORLD↵。先猜何時會取出第一筆，再按「接收下一段」。',
      art: '<div class="tcp-controls"><label>模型切段 <select data-tcp-cuts><option value="mixed">2 → 6 → 4 bytes</option><option value="whole">全部一次：12 bytes</option><option value="single">每段 1 byte</option></select></label><button data-tcp-next>接收下一段</button><button data-tcp-reset>重設</button></div><p class="tcp-meter" data-tcp-meter role="status"></p><div class="tcp-board" data-tcp-board></div>',
      previewArt: tcpReceived('LLO\nWO', 'WO', ['HELLO'], 'HE'),
      point: '切段決定何時拿到資料；完整訊息的邊界仍由換行約定決定。',
      detail: '這是解析模型，沒有呼叫真 TCP。選項不控制真實網路；recv(bufsize) 的 bufsize 是上限，實際可能更少。切換切法會從頭開始。',
      mount(root, state) {
        state.mode ??= 'mixed'; state.step ??= 0;
        const select = root.querySelector('[data-tcp-cuts]');
        const next = root.querySelector('[data-tcp-next]');
        const reset = root.querySelector('[data-tcp-reset]');
        const render = () => {
          const cuts = tcpCuts[state.mode];
          const snapshot = tcpSnapshot(cuts, state.step);
          select.value = state.mode;
          next.disabled = state.step >= cuts.length;
          root.querySelector('[data-tcp-meter]').textContent = `已接收 ${snapshot.count} / 12 bytes · ${state.step} 次接收 · ${snapshot.messages.length} 筆完整訊息 · 尾巴 ${snapshot.pending.length} bytes`;
          const prior = state.step ? tcpSnapshot(cuts, state.step - 1).pending : '';
          root.querySelector('[data-tcp-board]').innerHTML = tcpReceived(snapshot.latest, snapshot.pending, snapshot.messages, prior);
        };
        const advance = () => { state.step = Math.min(state.step + 1, tcpCuts[state.mode].length); render(); };
        const restart = () => { state.step = 0; render(); };
        const change = () => { if (Object.hasOwn(tcpCuts, select.value)) { state.mode = select.value; restart(); } };
        next.addEventListener('click', advance);
        reset.addEventListener('click', restart);
        select.addEventListener('change', change);
        render();
        return () => {
          next.removeEventListener('click', advance);
          reset.removeEventListener('click', restart);
          select.removeEventListener('change', change);
        };
      },
    },
    {
      id: 'tcp-eof', section: '10 / 同樣的尾巴，不同的結局',
      title: 'WO 還在等，連線卻先結束了',
      lead: '回到只取出 HELLO、留下 WO 的時刻。接下來是繼續等資料，還是判定截斷，要看接收方向是否已結束。',
      art: '<div class="tcp-pair"><div class="tcp-card"><span class="tcp-caption">尚未收到 EOF</span>' + tcpToken('WO', 'tcp-wait') + '<h2>保留，等待後續資料</h2><p>還沒找到換行；依應用的等待期限繼續接收。</p></div><div class="tcp-card tcp-error"><span class="tcp-caption">收到 EOF</span>' + tcpToken('WO', 'tcp-wait') + '<h2>截斷，不能交出 WO</h2><p>不再有後續 bytes，這筆卻仍缺換行。</p></div></div>',
      point: 'EOF 說明接收方向結束；訊息是否完整，仍要按契約檢查。',
      detail: 'TCP socket 以正數 bufsize 呼叫 recv，回傳空 bytes（Python 的 b\'\'）代表此方向的 EOF；不含 recv(0)。另一方向可能仍可傳送。<a href="https://www.rfc-editor.org/rfc/rfc9293.html#section-3.6">來源：RFC 9293 §3.6</a>。',
    },
    {
      id: 'tcp-back-to-book', section: '11 / 用新切法自查',
      title: '先收 5 bytes，再收 2 bytes，留下什麼？',
      lead: '仍用 HELLO↵WORLD↵ 與換行定界。這次先收到 HELLO，再收到 ↵W；先推導已完成區與緩衝區。',
      question: {prompt:'這兩次接收之後，哪些可以交出？',hideFuturePreviews:true,choices:[{value:'tail',label:'交出 HELLO，留下 W',feedback:'對。第 6 byte 的換行結束第一筆，第 7 byte 的 W 屬於下一筆。尚未收到的 ORLD↵ 不能提前交出；收齊 HELLO 也不證明業務已完成。'},{value:'whole',label:'交出 HELLO 與 W，緩衝區清空',feedback:'W 後面尚無換行，不能當完整訊息交出。只能交出 HELLO，並保留 W 等後續資料。'}]},
      art: '<div class="tcp-pair"><div class="tcp-card"><span class="tcp-caption">本故事 · 換行定界</span>' + tcpToken('HELLO\n') + '<p>找到 ↵，取出前面的文字。</p></div><div class="tcp-card"><span class="tcp-caption">第 09 章 · 長度前綴</span><div class="tcp-frame"><span>4 byte 長度</span><span>UTF-8 JSON 正文</span></div><p>先讀長度，再收齊正文並驗證；正文上限 64 bytes。</p></div></div><p class="tcp-note">收齊 bytes → 通過訊息契約 → 業務處理 → 應用回覆<br>每一步都需要自己的證據。</p>',
      point: '收齊訊息，也還不能直接說「圖已判完、資料已入庫」。TCP ACK 同樣不是業務回條。',
      detail: '<a href="../../08-tcp-stream.html">返回第 08 章</a> · <a href="../../09-message-contract.html">閱讀第 09 章：訊息契約</a> · <a href="../../labs.html">前往 L05 實驗入口</a><br>傳輸與應用完成的界線：<a href="https://www.rfc-editor.org/rfc/rfc9293.html#section-3.9.1.2">RFC 9293 §3.9.1.2</a>。',
    },
  ],
};
