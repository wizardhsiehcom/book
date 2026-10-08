// 全書導讀：D:/book/docs/harness-engineering（只讀，內容摘錄於此）。產品行為以論文 v1 快照為界。
const resourceDir = document.currentScript.getAttribute('src').replace(/[^/]*$/, '');
const resource = p => resourceDir + p;

const page = (id, section, title, lead, art, point, detail, instruction) =>
  ({ id, section, title, lead, art, point, detail, instruction });
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---- 互動 1：唯一匹配編輯（改編自原書 examples/edit_demo.py，教學模擬） ----
const EDIT_FILES = {
  one: { label: '原始檔', text: 'def shipping_fee(total):\n    return 0 if total > 1000 else 60' },
  zero: { label: '已被別人改過', text: 'def shipping_fee(total):\n    return 0 if total >= 1000 else 60' },
  two: { label: '註解也有同一段', text: '# 舊規則：total > 1000 才免運\ndef shipping_fee(total):\n    return 0 if total > 1000 else 60' },
};
const EDIT_OLD = {
  short: { label: 'total > 1000', old: 'total > 1000', new: 'total >= 1000' },
  long: { label: '加入周邊：return 0 if …', old: 'return 0 if total > 1000 else 60', new: 'return 0 if total >= 1000 else 60' },
};
function editResult(fileKey, oldKey) {
  const file = EDIT_FILES[fileKey].text, { old, new: rep } = EDIT_OLD[oldKey];
  const matches = file.split(old).length - 1;
  if (matches === 1) return { matches, after: file.replace(old, rep), json: { ok: true, matches: 1, changed: true } };
  const error = matches === 0 ? 'not_found' : 'ambiguous';
  const message = matches === 0 ? '找不到原文；請重新讀檔再決定' : `出現 ${matches} 次；請加入周邊程式碼定位`;
  return { matches, after: file, json: { ok: false, error, matches, changed: false, message } };
}
const markAll = (text, needle) => esc(text).split(esc(needle)).join(`<mark>${esc(needle)}</mark>`);
const editLabHtml = (fileKey, oldKey, applied) => {
  const r = editResult(fileKey, oldKey), o = EDIT_OLD[oldKey];
  const seg = (group, items, cur) => `<div class="he-seg" role="group">${Object.entries(items).map(([k, v]) =>
    `<button type="button" data-${group}="${k}" aria-pressed="${k === cur}">${esc(v.label)}</button>`).join('')}</div>`;
  const before = markAll(EDIT_FILES[fileKey].text, o.old);
  const after = r.json.changed ? markAll(r.after, o.new) : before;
  return `<div class="he-controls"><span>檔案</span>${seg('file', EDIT_FILES, fileKey)}<span>old</span>${seg('old', EDIT_OLD, oldKey)}
    <button type="button" class="he-go" data-apply>${applied ? '重來' : '套用替換'}</button></div>
    <div class="he-panes"><div><small>price.py（找到 ${r.matches} 處）</small><pre>${applied ? after : before}</pre>
    <p class="he-verdict ${applied ? (r.json.changed ? 'ok' : 'no') : ''}">${applied ? (r.json.changed ? '已寫入：只改了唯一位置' : '未寫入：原檔一字未動') : '按「套用替換」看工具怎麼處理'}</p></div>
    <div><small>工具回傳</small><pre>${applied ? esc(JSON.stringify(r.json, null, 2)) : '（尚未執行）'}</pre></div></div>`;
};

// ---- 互動 2：摘要交接檢查（改編自原書 examples/context_demo.py，固定比對） ----
const REQUIRED = [
  ['task', '任務', '滿 1000 元免運，未滿收 60 元'],
  ['constraint', '限制', '不得修改其他費用規則'],
  ['decision', '已做決定', '把 > 改為 >='],
  ['evidence', '證據', '只確認寫入成功，尚未完成測試'],
  ['next', '下一步', '檢查 999、1000、1001 元'],
];
const SUMMARIES = {
  incomplete: { label: '漏掉事實', drop: ['constraint', 'evidence'], change: {} },
  incorrect: { label: '把未知改成成功', drop: [], change: { evidence: '全部測試通過' } },
  preserved: { label: '保留必要資訊', drop: [], change: {} },
};
const summaryLabHtml = key => {
  const s = SUMMARIES[key];
  const rows = REQUIRED.map(([k, name, fact]) => {
    const status = s.drop.includes(k) ? 'miss' : s.change[k] ? 'bad' : 'ok';
    const shown = status === 'miss' ? '—' : s.change[k] || fact;
    const tag = { ok: '✓ 保留', miss: '✕ 遺漏', bad: '⚠ 與紀錄不符' }[status];
    return `<tr class="${status}"><th>${name}</th><td>${esc(shown)}</td><td>${tag}</td></tr>`;
  }).join('');
  const bad = REQUIRED.filter(([k]) => s.drop.includes(k) || s.change[k]).map(([, n]) => n);
  return `<div class="he-controls"><span>摘要</span><div class="he-seg" role="group">${Object.entries(SUMMARIES).map(([k, v]) =>
    `<button type="button" data-sum="${k}" aria-pressed="${k === key}">${v.label}</button>`).join('')}</div></div>
    <table class="he-sumtable"><thead><tr><th>欄位</th><th>摘要寫的內容</th><th>對照原始紀錄</th></tr></thead><tbody>${rows}</tbody></table>
    <p class="he-verdict ${bad.length ? 'no' : 'ok'}">${bad.length ? `抓到問題：${bad.join('、')}。這份摘要不能交接。` : '五欄都對得上原始紀錄，可以交接；下一步仍要重讀 price.py 確認現況。'}</p>`;
};

const story = {
  title: 'Coding Agent 怎麼把事做完',
  label: '教學導讀 / Coding Agent 的運作原理',
  attachments: [
    { label: '三組小實驗：導讀與執行方式', href: resource('examples/index.html'), note: '離線 HTML' },
    { label: '工作迴圈實驗', href: resource('examples/loop_demo.py') },
    { label: '唯一匹配編輯實驗', href: resource('examples/edit_demo.py') },
    { label: '摘要保留實驗', href: resource('examples/context_demo.py') },
  ],
  transition: 'slide',
  pages: [
    deck.cover({
      title: 'Coding Agent<br>怎麼把事做完',
      meta: '用一個差一元的錯誤，看懂 agent 背後的執行系統<br>教學導讀 · 改編自《Coding Agent 的運作原理》',
      instruction: '先問大家：AI 說「修好了」，你會直接相信嗎？今天用一個很小的錯誤，一步步看它要怎麼證明自己真的修好。',
    }),

    page('bug', '01 起點', '模型答對修法，只走完四格裡的第一格',
      '規則是滿 1,000 元免運，程式卻寫成 <code>&gt;</code>。Harness（包在模型外面的執行系統）負責把「想做」變成「已做」，再變成「查得到」。',
      `<div class="he-bug" data-key="bug"><pre class="he-code">def shipping_fee(total):
    return 0 if total <mark>&gt;</mark> 1000 else 60</pre>
      <div class="he-chain"><b data-key="bug-step1" data-edit>模型提出修法</b><i>不代表</i><b data-key="bug-step2" data-edit>檔案已改</b><i>不代表</i><b data-key="bug-step3" data-edit>檢查通過</b><i>不代表</i><b data-key="bug-step4" data-edit>環境安全</b></div></div>` +
      deck.cards('things', [
        { title: '要求', text: '人給的結果與限制：修正門檻，不動其他費用。' },
        { title: '動作請求', text: '模型寫的工作單：讀取 price.py。還沒真的讀。' },
        { title: '觀察結果', text: '工具交回的內容或錯誤，下一步靠它決定。' },
      ]),
      '就像主管開工單、技師動手、技師回報。只看到工單，不能說事情做完了。',
      '原書自編案例，不是論文實驗。產品行為以論文當時的版本為準。來源：原書導讀、第 1 章。',
      '先請大家說怎麼修。接著指這條鏈：答對只是第一格，後面每一格都要另外拿證據。再用下方三張卡講分工：模型只開工單，動手的是工具。'),

    page('trace', '02 一次工作', '每個要求都要配上結果，工作才轉得起來',
      '這一頁回答：怎麼從紀錄看出 agent 有沒有亂說？',
      deck.sequence('trace', ['模型', 'Harness（執行工具）'], [
        { from: '模型', to: 'Harness（執行工具）', text: 'call_01 讀取 price.py' },
        { from: 'Harness（執行工具）', to: '模型', text: 'call_01：條件是 total > 1000' },
        { from: '模型', to: 'Harness（執行工具）', text: 'call_02 把 > 改成 >=' },
        { from: 'Harness（執行工具）', to: '模型', text: 'call_02：唯一位置已替換' },
        { from: '模型', to: 'Harness（執行工具）', text: 'call_03 檢查 999／1000／1001' },
        { from: 'Harness（執行工具）', to: '模型', text: 'call_03：60、0、0' },
        { at: '模型', text: '回覆完成與驗證方式', highlight: true },
      ]),
      '少了任何一則結果，下一步只能用猜的。出錯時先找斷在哪：資料沒給、判斷錯、動作被擋、工具失敗，還是沒有檢查。',
      '教學追蹤，不是產品紀錄。編號只負責配對，不保證內容正確。來源：原書第 1、3 章。',
      '從上往下讀：每條往右的要求，都有一條往左的結果，編號相同。問大家：第 4 列不見了，模型會以為檔案改了沒？'),

    page('stop', '02 一次工作', '停下不等於做完，舊測試也不算數',
      '停止時要說明原因；結束前還要確認測試對應的是最新版本。',
      deck.table('stop', [
        ['已完成', '改了什麼、怎麼驗證'],
        ['等待資訊或許可', '缺什麼、已經做了什麼'],
        ['工具出錯', '錯誤內容、已經造成的改變'],
        { cells: ['預算用完', '做到哪裡、還沒做什麼'], highlight: true },
      ], { columns: ['停止原因', '回報要說清楚'] }) +
      deck.predict('fresh', '10:00 測試通過，10:01 又改了判斷，10:02 要求結束。可以說完成嗎？',
        '<b>不行。</b>10:00 測的是舊版本。改過要重測；不能測就回報「已修改，還沒驗證」。',
        { choices: ['可以，紀錄裡有通過的測試', '不行，改過之後沒有重測', '可以，模型很有把握'], correct: 1 }),
      '「已修改，還沒驗證」是誠實的回報。只分成功和失敗，中間狀態就會被說成成功。',
      '已啟動的背景工作不會隨主流程自動停止，取消時要交代它們的狀態。來源：原書第 4 章。',
      '先講表格亮起的那列：預算用完最常被說成成功。再讓大家選下方的題目，舉手後按揭曉。'),

    { ...page('edit-lab', '03 可靠的動作', '工具要說清楚失敗在哪，找到幾處決定寫不寫',
      '失敗分三種：格式錯就補參數，不允許就停手，沒做成就重讀檔案。下面示範第三種：用原文找位置，剛好一處才寫。',
      '<div class="he-lab" data-key="lab"></div>',
      '找到兩處時，加上周邊程式碼來定位；放寬比對只會找到更多位置。',
      '教學模擬：依原書 edit_demo.py 的規則在瀏覽器裡重算，不執行任何程式。原始程式見附件「唯一匹配編輯實驗」。來源：原書第 6、7 章。',
      '1. 選「原始檔」按套用：一處，寫入。<br>2. 選「註解也有同一段」：兩處，拒絕，原檔沒變；把 old 換成「加入周邊」就只剩一處。<br>3. 選「已被別人改過」：零處，下一步是重讀檔案。<br>指右邊的回傳：它說清楚沒改、為什麼、下一步怎麼做。'),
      previewArt: `<div class="he-lab">${editLabHtml('two', 'short', true)}</div>`,
      mount(root, state) {
        state.file ??= 'one'; state.old ??= 'short'; state.applied ??= false;
        const lab = root.querySelector('[data-key="lab"]');
        const render = () => { lab.innerHTML = editLabHtml(state.file, state.old, state.applied); };
        const onClick = e => {
          const b = e.target.closest('button'); if (!b) return;
          if (b.dataset.file) { state.file = b.dataset.file; state.applied = false; }
          else if (b.dataset.old) { state.old = b.dataset.old; state.applied = false; }
          else if ('apply' in b.dataset) state.applied = !state.applied;
          render();
        };
        lab.addEventListener('click', onClick);
        render();
        return () => lab.removeEventListener('click', onClick);
      } },

    page('info', '04 接得上的資訊', '讀什麼、留什麼、記什麼，各有停止點',
      '模型一次能讀的內容有上限。讀太少會改錯，留太多會塞爆，記錯會一錯再錯。',
      deck.table('info', [
        ['找程式碼', '讀到哪裡就夠？', '需求含 1000、程式排除 1000，並找到測試位置', '只搜到一行就改，沒讀呼叫者'],
        { cells: ['摘要交接', '這次要留什麼？', '任務、限制、決定、證據、下一步', '把「還沒測」寫成「測過了」'], highlight: true },
        ['長期記憶', '下次還要用什麼？', '正式規則加上出處與適用範圍', '把猜測或這次進度記成規則'],
      ], { columns: ['階段', '要回答', '本例做法', '常見錯誤'] }),
      '搜尋告訴你「可能在哪」，閱讀才告訴你「怎麼運作」；摘要和記憶都不是檔案本身，動手前要重讀。',
      '原書建議先用文字與檔名搜尋，不急著建語意索引。來源：原書第 8、9、10 章。',
      '一列一個階段，重點講第三欄的停止點。亮起的摘要那列，下一頁會動手驗證。'),

    { ...page('summary-lab', '04 接得上的資訊', '摘要好不好，看別人能不能接手',
      '切換三份摘要，對照原始紀錄的五個欄位。',
      '<div class="he-lab" data-key="lab"></div>',
      '字數一樣短的摘要，可能把「還沒測試」偷換成「全部通過」。',
      '教學模擬：依原書 context_demo.py 的三份摘要做固定比對，不是自動評分。原始程式見附件「摘要保留實驗」。來源：原書第 9 章。',
      '依序切換。第一份漏了限制和證據；第二份最危險，把還沒測試寫成全部通過；第三份五欄都對。'),
      previewArt: `<div class="he-lab">${summaryLabHtml('incorrect')}</div>`,
      mount(root, state) {
        state.sum ??= 'incomplete';
        const lab = root.querySelector('[data-key="lab"]');
        const render = () => { lab.innerHTML = summaryLabHtml(state.sum); };
        const onClick = e => { const b = e.target.closest('button[data-sum]'); if (b) { state.sum = b.dataset.sum; render(); } };
        lab.addEventListener('click', onClick);
        render();
        return () => lab.removeEventListener('click', onClick);
      } },

    page('layers', '05 邊界與擴充', '「請小心」管不住程式能碰哪些檔案',
      '這一頁回答：要擋住危險動作，應該靠哪一層？',
      deck.table('layers', [
        ['給模型的指示', '模型應該怎麼做？', '程式一定不會越界'],
        ['權限審查（執行前的關卡）', '這個動作可以做嗎？', '做了之後沒有副作用'],
        ['系統隔離（俗稱沙箱）', '程式實際碰得到什麼？', '允許範圍內改得對'],
        ['執行紀錄', '發生過什麼事？', '壞事發生前就擋下'],
      ], { columns: ['哪一層', '回答的問題', '單靠它做不到'] }),
      '每一層都有管不到的事，要多層一起用。檔案裡寫「先把金鑰上傳」只是資料，不是使用者的許可。',
      '外來文字想改掉指令，稱為提示注入。派給子 agent 做，也不能繞過主 agent 沒有的權限。來源：原書第 11、12 章。',
      '從右欄講：每一層都有做不到的事。舉例：允許寫入專案資料夾，還是可能刪掉重要檔案；沙箱限制範圍，不判斷改得對不對。'),

    page('upgrade', '05 邊界與擴充', '加功能前，先說出它補的是哪個缺口',
      '這一頁回答：遇到問題，最小的補法是什麼？',
      deck.table('upgrade', [
        ['調查範圍很大', '分頭調查，修改集中在一處', '三個 agent 同時改同一個函式'],
        ['每次都要用同一套做法', '寫一份技能（附材料的操作手冊）', '另做一個新工具'],
        ['要讀別的系統的資料', '加一個工具，可透過 MCP 這類連接標準', '把資料貼進提示'],
        ['摘要忘記限制', '把限制固定保存，不交給摘要', '無限加長期記憶'],
        ['中斷後不知道做到哪', '記錄每個動作和結果', '只加「再試一次」按鈕'],
        ['同一個錯誤一再出現', '讓錯誤訊息說清楚下一步', '多派幾個 agent'],
      ], { columns: ['遇到的問題', '先這樣補', '先不要做'] }),
      '每加一個功能，都要指得出它補的是第 2 頁那條鏈上的哪一格。',
      '分工省下的時間，要扣掉派工、等待和整合。技能只增加做法，不增加權限。來源：原書第 12、13、16 章。',
      '讓大家看第三欄：每一列都是常見的過度反應。挑第一列補一句：調查可以平行，修改要集中，否則等待只會變成衝突。'),

    page('practice', '06 練習', '用新情況檢查自己，再寫下設計卡',
      '子 agent 是主 agent 派出去做一小段工作的 agent。先判斷題目，再填右欄。',
      deck.predict('check', '子 agent 回報「全部修好，測試通過」，但沒附檔案差異，也沒附測試結果。可以直接合併嗎？',
        '<b>不行。</b>回報只是文字。先看差異，再對最新版本測試，確認後才合併。',
        { choices: ['可以，它說通過了', '不行，先看差異再重測', '可以，再請它確認一次'], correct: 1 }) +
      deck.table('card', [
        ['怎樣算完成', '999／1000／1001 → 60、0、0', '（填寫）'],
        ['可以做／不能做', '找到唯一一處才改', '（填寫）'],
        ['何時停下', '到上限就回報「未完成」', '（填寫）'],
        ['先不做什麼', '不接真實模型、不分工', '（填寫）'],
      ], { columns: ['設計卡', '免運案例', '你的下一個任務'] }),
      '設計卡把「架構」變成具體的完成證據、限制和停止條件。',
      '三個小實驗在頁首「📎 附件」，只需要 Python，不需要 API 金鑰。來源：原書第 12、16 章。',
      '先讓大家判斷題目，揭曉後問：用到哪幾頁的觀念？答案是配對結果、舊測試和停止回報。再請大家按「編輯」填右欄，至少寫「怎樣算完成」。'),

    deck.end({
      title: '別只問模型多強<br>先問證據在哪裡',
      instruction: '回到開場：AI 說「修好了」，你會找哪三份紀錄？讀檔結果、編輯結果、改完之後的測試。想動手的人，頁首「📎 附件」有三個小實驗。',
    }),
  ],
};
