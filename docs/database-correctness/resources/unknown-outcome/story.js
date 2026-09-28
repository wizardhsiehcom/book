// 固定情境快照；教學事件順序，不是 SQL 引擎或網路模擬。
const outcomeScenarios = {
  committed: {label: '提交後，成功回覆遺失', frames: [
    ['結果未知', 'X 已提交；1 筆判定，版本 1', '客戶端只看到連線中斷。資料庫已保存 X → 80 分。'],
    ['等待原 ID 的結果', '核對 X 與完整意圖；仍 1 筆判定', '新連線送出原 X；程序找到操作紀錄，先比較五個意圖欄位。'],
    ['已提交：X → 80 分／版本 1', '仍 1 筆判定，版本 1', '回傳已保存的當次結果；不新增判定。'],
  ]},
  rolledback: {label: '提交前斷線，伺服器已完成回滾', frames: [
    ['結果未知', '原交易已回滾；0 筆判定，版本 0', '此回滾是情境給定的伺服器事實；客戶端尚無證據。'],
    ['等待原 ID 的結果', '無 X；版本 0 符合原意圖', '原 ID 重入取得鎖後，確認沒有 X，條件更新符合 expected_version = 0。'],
    ['已提交：X → 80 分／版本 1', '首次提交；1 筆判定，版本 1', '判定、目前指標及 X 的操作結果一起提交；成功回覆送達。'],
  ]},
  pending: {label: '原交易未結束，重送等待逾時', frames: [
    ['結果未知', '原交易仍未結束；尚無終局', '連線診斷不足以證明伺服器已結束工作。'],
    ['等待原 ID 的結果', '原交易持鎖；重送等待', '同 ID 的第二次呼叫需要與原執行協調，不能自行宣告成功。'],
    ['仍未知：操作 X 待查核', '原交易結局未取得；重送等待逾時', '停止本次自動等待，保留原 ID 與意圖。逾時不代表原交易回滾。'],
  ]},
  changed: {label: '原交易回滾後，另一操作已改版', frames: [
    ['結果未知', 'X 已回滾；Y 已提交 90 分／版本 1', 'Y 是另一個明確授權的新意圖；本情境目前有 1 筆判定。'],
    ['等待原 ID 的結果', '無 X；目前版本 1 不符合原本的 0', '原 X 仍帶 expected_version = 0，不能把它偷偷改成 1。'],
    ['版本衝突：本次 X 未寫入', '仍只有 Y；1 筆判定，版本 1', '程序回報明確衝突。重新讀取後是否建立新意圖，須重新決定。'],
  ]},
};
// 對照：左欄是客戶端證據，右欄是教學用全知視角；key 標出本頁要盯住的一側。
function outcomePair(client, database, key = 'client') {
  return `<div class="outcome-pair"><section class="outcome-card outcome-client${key === 'client' ? ' outcome-key' : ''}"><span class="outcome-label">客戶端掌握的證據</span><h2>${client}</h2></section><section class="outcome-card outcome-omniscient${key === 'database' ? ' outcome-key' : ''}"><span class="outcome-label">資料庫實際狀態 · 全知視角</span><h2>${database}</h2></section></div>`;
}
// 時序圖：每列一次交換，依 客戶端 → 訊息 → 伺服器 的欄位排列；列是先後階段，不代表等長時間。
// 訊息種類：r 往伺服器、l 回到客戶端、lost 回覆遺失、cut 連線中斷；k 標出客戶端的關鍵狀態。
const outcomeEvents = {
  committed: [{c: '送出 X', m: ['r', '請求 X'], s: '提交 X，保存 80 分'}, {c: '只看到連線中斷', k: 1, m: ['lost', '成功回覆遺失'], s: '送出成功回覆；仍保留 X 的結果'}],
  rolledback: [{c: '送出 X', m: ['r', '請求 X'], s: '開始原交易'}, {c: '只看到連線中斷', k: 1, m: ['cut', '提交前連線中斷'], s: '終止並完成回滾'}],
  pending: [{c: '送出 X', m: ['r', '請求 X'], s: '開始原交易，持有鎖'}, {c: '只看到連線中斷', k: 1, m: ['cut', '連線中斷'], s: '原交易仍未結束'}],
  changed: [{c: '送出 X', m: ['cut', '請求後連線中斷'], s: '原交易回滾'}, {c: '尚不知道 Y 的結果', k: 1, s: '另一操作 Y 提交 90 分／版本 1'}],
};
const outcomeArrow = {r: '往伺服器', l: '回到客戶端', lost: '回覆未送達', cut: '連線中斷'};
function outcomeSequence(rows, caption = '↓ 時間向下（各列不按時長比例）') {
  const message = m => m ? `<div class="outcome-msg outcome-${m[0]}"><span>${m[1]}</span><i class="outcome-line" aria-hidden="true"></i><span class="outcome-sr">（${outcomeArrow[m[0]]}）</span></div>` : '<div class="outcome-msg outcome-none"></div>';
  return `<div class="outcome-timeline"><p class="outcome-caption">${caption}</p><div class="outcome-seq"><div class="outcome-row outcome-head"><strong>客戶端</strong><span></span><strong>伺服器 · 全知視角</strong></div>${rows.map((r, i) => `<div class="outcome-row"><span class="outcome-c${r.k ? ' outcome-key' : ''}"><small>${i + 1}</small>${r.c}</span>${message(r.m)}<span class="outcome-s">${r.s}</span></div>`).join('')}</div></div>`;
}
function outcomeTimeline(scenario, step) {
  const rows = [...outcomeEvents[scenario]], final = outcomeScenarios[scenario].frames[2];
  if (step >= 1) rows.push({c: '新連線', m: ['r', '原 X ＋完整意圖'], s: scenario === 'pending' ? '等鎖 ⋯ 原交易尚未結束' : '取得協調機會，查 X 與原版本'});
  if (step >= 2) rows.push(scenario === 'pending' ? {c: '等待逾時；仍未知', k: 1, s: final[1]} : {c: final[0], k: 1, m: ['l', '回覆送達'], s: final[1]});
  return outcomeSequence(rows);
}
function mountOutcome(root, state) {
  state.scenario ??= 'committed'; state.step ??= 0;
  const select = root.querySelector('[data-scenario]');
  const next = root.querySelector('[data-advance]');
  const reset = root.querySelector('[data-reset]');
  const result = root.querySelector('[data-result]');
  const render = () => {
    select.value = state.scenario;
    const [client, , note] = outcomeScenarios[state.scenario].frames[state.step];
    result.innerHTML = `<p class="outcome-note"><strong>${outcomeScenarios[state.scenario].label}</strong></p>` + `<p class="outcome-note"><strong>目前客戶端：${client}</strong></p>` + outcomeTimeline(state.scenario,state.step) + `<p class="outcome-note">${note}</p><p class="outcome-step">${['1 / 3 · 故障後', '2 / 3 · 原 ID 重送', '3 / 3 · 本次恢復結果'][state.step]}</p>`;
    next.disabled = state.step === 2;
  };
  const advance = () => { if (state.step < 2) state.step++; render(); };
  const restart = () => { state.step = 0; render(); };
  const change = () => { state.scenario = select.value; restart(); };
  next.addEventListener('click', advance); reset.addEventListener('click', restart); select.addEventListener('change', change);
  render();
  return () => { next.removeEventListener('click', advance); reset.removeEventListener('click', restart); select.removeEventListener('change', change); };
}
const outcomeIntent = '<div class="outcome-intent"><span class="outcome-label">送出前先持久化 · 同一筆紀錄</span><strong>operation ID：X</strong><dl><div><dt>defect_id</dt><dd>2</dd></div><div class="outcome-key"><dt>expected_version</dt><dd>0</dd></div><div><dt>score</dt><dd>80</dd></div><div><dt>model_version</dt><dd>m1</dd></div><div><dt>operator_name</dt><dd>lin</dd></div></dl></div>';
const story = {
  title: '沒收到回覆，可以再按一次嗎？',
  label: '資料庫與資料正確性 / 15–16 · 重送與未知',
  back: {href: '../../16-unknown-outcome.html', label: '返回第 16 章'},
  pages: [
    {id: 'lost-reply', section: '01 / 同一個錯誤', title: '沒有成功回覆，還不能說沒有寫入',
      lead: '操作 X 要把缺陷 2 判為 80 分。畫面顯示「連線中斷」，操作人員準備再按一次。',
      art: outcomePair('結果未知', '？只看客戶端錯誤，無法判定'),
      point: '「未知」描述客戶端掌握的證據，不是資料庫的第三種提交結果。',
      detail: '以下採本書 ApplyJudgment 的受控情境。X 是 operation UUID 的簡稱；不是正在連線的資料庫。'},
    {id: 'two-timelines', section: '02 / 兩條路，同一個畫面', title: '已提交和已回滾，都可能留下連線錯誤',
      lead: '觀察者知道這兩條完整時間線；客戶端只看見末端的錯誤。',
      art: `<div class="outcome-pair outcome-seqpair"><section class="outcome-card"><span class="outcome-label">A · 已提交</span>${outcomeSequence(outcomeEvents.committed, '↓ 時間向下')}</section><section class="outcome-card"><span class="outcome-label">B · 伺服器已完成回滾</span>${outcomeSequence(outcomeEvents.rolledback, '↓ 時間向下')}</section></div><p class="outcome-caption">兩條時間線的第 2 列左欄相同：客戶端只收到「連線中斷」。</p>`,
      point: '錯誤訊息相同，不代表資料庫的結果相同。',
      detail: 'B 明確包含「伺服器已完成回滾」這個事實；不能把任何斷線直接畫成回滾。<a href="https://learn.microsoft.com/en-us/ef/core/miscellaneous/connection-resiliency#transaction-commit-failure-and-the-idempotency-issue">Microsoft：提交失聯與冪等問題</a>。'},
    {id: 'not-found', section: '03 / 先預測', title: '新連線查不到 X，就能換新 ID 嗎？',
      lead: '你查到零筆操作紀錄，但還不知道原交易是否結束、查詢是否讀到最新資料。',
      art: outcomePair('查詢結果：0 筆', '原執行可能還沒結束', 'database'),
      point: '查不到是一次觀察；它本身不足以證明原操作從未提交。',
      question: {prompt: '此時可以直接建立新 ID 重送嗎？', hideFuturePreviews: true, choices: [
        {value: 'new', label: '可以，零筆就代表沒做過', feedback: '不能這樣推論。原交易可能未結束，或查到較舊的快照／延遲副本；操作紀錄也可能已被清理。'},
        {value: 'keep', label: '保留原 ID 與意圖，繼續查核', feedback: '對。確認權威資料庫與紀錄保留條件，按原 ID 協調重試；沒有結論時仍保留未知。'},
      ]}},
    {id: 'same-intent', section: '04 / 先保存，再送出', title: '重送的是同一個意圖，連版本也不換',
      lead: '第一次送出前，把 X 和下列五欄一起持久化。重啟後也要找回這一份。',
      art: outcomeIntent,
      point: '同 ID、同意圖才是重送。同 ID 改任何欄位，程序回報衝突。',
      detail: 'expected_version 也是意圖的一部分。操作者在正式系統應來自已驗證身分；本書文字採精確 UTF-16 位元組比較。<a href="../../15-operation-identity.html">完整契約見第 15 章</a>。'},
    {id: 'coordinate', section: '05 / 在同一程序裡判斷', title: '先協調同 ID 的執行，再決定回傳或寫入',
      lead: '程序在交易裡鎖住 X 的列或不存在的鍵範圍；第二次執行可能先等待。',
      art: '<div class="outcome-flow"><div class="outcome-node">新連線送出原 X ＋完整意圖</div><div class="outcome-arrow" aria-hidden="true">↓</div><div class="outcome-node">程序在交易裡鎖住 X 的列或鍵範圍</div><div class="outcome-arrow" aria-hidden="true">↓</div><div class="outcome-node outcome-decision">原執行留下了什麼？</div><div class="outcome-branches"><div><p class="outcome-arrow">已保存 X，且完整意圖相同 ↓</p><div class="outcome-node">回傳 X 的舊結果，不新增判定。</div></div><div><p class="outcome-arrow">原交易回滾，沒有 X ↓</p><div class="outcome-node">原 expected_version 仍符合，才首次提交；不符合就回衝突。</div></div><div><p class="outcome-arrow">原交易尚未結束 ↓</p><div class="outcome-node outcome-key">等待協調；等待逾時，仍需查核原操作。</div></div></div></div>',

      point: '安全重送依賴這份程序契約與操作紀錄，不是 ID 自己帶來的能力。',
      detail: '假設同一權威資料庫、同一程序、操作紀錄仍保留且權限正確。鎖仍可能等待或死鎖。<a href="../../examples/05-apply.sql">ApplyJudgment 原始 SQL</a>。'},
    {id: 'try-fault', section: '06 / 改故障時點', title: '同樣送回 X，四種起點會走到哪裡？',
      lead: '選一個已知的伺服器情境，逐步比較兩側。右欄是教學全知視角，客戶端不會自動知道它。',
      art: `<div class="outcome-controls"><label>故障情境 <select data-scenario>${Object.entries(outcomeScenarios).map(([key,s])=>`<option value="${key}">${s.label}</option>`).join('')}</select></label><button data-advance>推進一步</button><button data-reset>重設情境</button></div><div class="outcome-result" data-result role="status" aria-live="polite"></div>`,
      previewArt: outcomePair('未知 → 查核或重送 → 有證據的結論', '已提交／已回滾／仍未結束'),
      point: '重送保留 X 的身分；能否完成，仍取決於已保存結果、版本條件及等待結果。',
      detail: '前三種情境無其他寫入；第四種明示另一操作 Y 已提交。成功情境假設恢復回覆送達。這是固定事件快照，不是 SQL 或網路故障測試。', mount: mountOutcome},
    {id: 'new-id', section: '07 / 兩道不同的保護', title: '換 ID 不一定重複；連版本也改才更危險',
      lead: '假設 X 已提交 80 分，現在版本是 1；除此以外沒有其他寫入。',
      art: '<div class="outcome-pair"><section class="outcome-card"><span class="outcome-label">錯把重送換成新 ID Z</span><h2>Z + 原版本 0</h2><p>找不到 Z，進入新操作路徑；目前版本 1 ≠ 0，版本檢查拒絕寫入。</p><p class="outcome-number">1 <small>筆判定（不變）</small></p></section><section class="outcome-card outcome-warning"><span class="outcome-label">又擅自把版本改成最新</span><h2>Z + 新版本 1</h2><p>程序視為新意圖，版本條件符合；可能再新增一次相同分數的判定。</p><p class="outcome-number">2 <small>筆判定（重複）</small></p></section></div>',

      point: '操作 ID 辨認同一次意圖；expected_version 保護使用者原本看到的版本。',
      detail: '若使用者重新讀取後明確決定重判，才是合法的新意圖、新 ID；不要讓自動重試替他做這個決定。'},
    {id: 'old-result', section: '08 / 當時與現在', title: '重送 X 回 80 分，目前卻可以是 90 分',
      lead: 'X 先成功，另一個新意圖 Y 後來合法重判。現在 X 再次送達。',
      art: '<div class="outcome-ledger"><div><b>①</b><strong>X：80 分 → J1／版本 1</strong><span>保存 X 的當次結果。</span></div><div><b>②</b><strong>Y：90 分 → J2／版本 2</strong><span>Y 基於版本 1；目前指標更新到 J2。</span></div></div>' + outcomePair('③ 原 X 重送：回 80 分／版本 1', '目前仍 90 分／版本 2；共 2 筆判定', 'none'),
      point: '回傳舊操作結果，不是把目前資料改回舊值。',
      detail: '<a href="../../examples/06-operation-checks.sql">本書順序重送檢查</a>分別檢查操作結果、歷史筆數與目前指標。'},
    {id: 'reconcile', section: '09 / 留下可恢復的線索', title: '等了 10 秒仍逾時，現在能說失敗嗎？',
      lead: '你保留原 X 與完整意圖重送，等鎖 10 秒後逾時；仍沒有取得原交易的終局。下一步如何記錄？10 秒只是本題的等待預算。',
      art: '<div class="outcome-pair"><section class="outcome-card"><span class="outcome-label">已知</span><h2>原 ID 重送；本次等鎖逾時。</h2></section><section class="outcome-card outcome-key"><span class="outcome-label">尚無證據</span><h2>原交易是否提交或回滾。</h2></section></div>',
      point: '把等待結果與原操作的終局分開，再決定需要保留哪些恢復線索。',
      question:{prompt:'哪個處理符合目前的證據？',hideFuturePreviews:true,choices:[
        {value:'unknown',label:'保留 X 與未知，進入待查核',feedback:'對。10 秒結束的是本次等待，不是原交易的生命週期。保留 X、完整意圖及診斷，之後查核；不能自動換 ID 或修改版本。'},
        {value:'failed',label:'標成已回滾，換新 ID 重送',feedback:'等鎖逾時無法證明原交易已回滾。換新 ID 會失去原操作身分；應保留 X 與未知，查核原執行。'}]},
      detail: '<a href="../../15-operation-identity.html">第 15 章：操作身分</a> · <a href="../../16-unknown-outcome.html">第 16 章：結果未知</a> · <a href="../../labs.html#l06">L06：真實故障實驗</a>。此故事未執行資料庫測試；外部通知還需另看 <a href="../../17-outbox.html">Outbox</a>。'},
  ],
};
