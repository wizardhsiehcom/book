// 執行：node tools/check-eclipse-background.cjs（無額外依賴）
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');

const source = readFileSync(join(__dirname, '../js/eclipse-background.js'), 'utf8');
const homepage = readFileSync(join(__dirname, '../index.html'), 'utf8');
assert.match(homepage, /href="css\/eclipse-background\.css"/);
assert.match(homepage, /src="js\/eclipse-background\.js"/);
assert.match(homepage, /class="eclipse-background" aria-hidden="true"/);
assert.doesNotMatch(homepage, /(?:src|href)="[^"]*playground/);

function create(saved) {
  const listeners = { document: {}, window: {} };
  const background = { dataset: {} };
  const buttons = ['animated', 'static', 'off'].map(mode => ({
    dataset: { backgroundChoice: mode },
    classList: { toggle(name, value) { assert.equal(name, 'active'); this.active = value; } },
    setAttribute(name, value) { assert.equal(name, 'aria-pressed'); this.pressed = value; },
    addEventListener(name, handler) { assert.equal(name, 'click'); this.click = handler; },
  }));
  const document = {
    hidden: false,
    body: { dataset: {} },
    querySelector(selector) { assert.equal(selector, '.eclipse-background'); return background; },
    querySelectorAll(selector) { assert.equal(selector, '[data-background-choice]'); return buttons; },
    addEventListener(name, handler) { listeners.document[name] = handler; },
  };
  let stored;
  runInNewContext(source, {
    document,
    window: { addEventListener(name, handler) { listeners.window[name] = handler; } },
    readPreference(key, fallback) { assert.equal(key, 'bookBackground'); return saved ?? fallback; },
    savePreference(key, value) { assert.equal(key, 'bookBackground'); stored = value; },
  });
  function check(mode) {
    assert.equal(document.body.dataset.background, mode);
    assert.equal(stored, mode);
    buttons.forEach(button => {
      const expected = button.dataset.backgroundChoice === mode;
      assert.equal(button.pressed, expected);
      assert.equal(button.classList.active, expected);
    });
  }
  return { document, background, buttons, listeners, check };
}
for (const saved of [undefined, 'invalid', 'animated', 'static', 'off']) {
  const setup = create(saved);
  setup.check(['static', 'off'].includes(saved) ? saved : 'animated');
  setup.buttons.forEach(button => { button.click(); setup.check(button.dataset.backgroundChoice); });
}
const setup = create();
assert.equal(setup.background.dataset.suspended, 'false');
setup.document.hidden = true;
setup.listeners.document.visibilitychange();
assert.equal(setup.background.dataset.suspended, 'true');
setup.document.hidden = false;
setup.listeners.document.visibilitychange();
assert.equal(setup.background.dataset.suspended, 'false');
setup.listeners.window.pagehide();
assert.equal(setup.background.dataset.suspended, 'true');
setup.listeners.window.pageshow();
assert.equal(setup.background.dataset.suspended, 'false');
console.log('PASS：首頁背景接線、預設與偏好、三種模式、隱藏暫停與返回恢復');
