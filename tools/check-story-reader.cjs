const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const templateDir = path.resolve(__dirname, '../templates/visual-story');
const templateHTML = fs.readFileSync(path.join(templateDir, 'index.html'), 'utf8');
const required = {
  'story-label': 'span', 'story-back': 'a', page: 'main', index: 'details',
  pin: 'button', 'index-list': 'div', position: 'span', progress: 'progress',
  prev: 'button', next: 'button',
};

// 僅解析作者維護的範本標記，不模擬瀏覽器排版或實作通用 HTML parser。
function declaredNodes(html) {
  const nodes = new Map();
  for (const match of html.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<([a-z][\w-]*)\b[^>]*\sid=["']([^"']+)["'][^>]*>/gi)) {
    assert.ok(!nodes.has(match[2]), `重複 id：${match[2]}`);
    nodes.set(match[2], { tagName: match[1].toUpperCase(), focus() {}, matches() { return false; }, setAttribute(key, value) { this[key] = value; } });
  }
  return nodes;
}

function exercise(html) {
  const nodes = declaredNodes(html);
  for (const [id, tag] of Object.entries(required)) {
    assert.equal(nodes.get(id)?.tagName, tag.toUpperCase(), `缺少或錯置外殼節點：${id}`);
  }
  assert.match(html, /<details\b[^>]*id="index"[^>]*>\s*<summary>/);
  const listeners = new Map(), output = {};
  const interactiveButton = {
    addEventListener(event, handler) { listeners.set(event, handler); },
    removeEventListener(event, handler) { assert.equal(listeners.get(event), handler); listeners.delete(event); },
  };
  const page = nodes.get('page');
  let markup = '', dynamicIds = [], answers = [];
  Object.defineProperty(page, 'innerHTML', {
    get() { return markup; },
    set(value) {
      dynamicIds.forEach(id => nodes.delete(id));
      markup = value;
      const dynamic = declaredNodes(value);
      dynamicIds = [...dynamic.keys()];
      for (const [id, node] of dynamic) {
        assert.ok(!nodes.has(id), `動態內容重複 id：${id}`);
        nodes.set(id, node);
      }
      answers = [...value.matchAll(/<button\b[^>]*data-answer="([^"]+)"/g)]
        .map(match => ({ dataset: { answer: match[1] } }));
    },
  });
  page.querySelector = selector => {
    if (selector === '[data-result]' && markup.includes('data-result')) return output;
    if (selector === '[data-advance]' && markup.includes('data-advance')) return interactiveButton;
    return null;
  };
  const document = {
    getElementById(id) { return nodes.get(id) ?? null; },
    querySelectorAll(selector) { return selector === '#page [data-answer]' ? answers : []; },
    addEventListener() {},
  };
  const context = vm.createContext({ document, window: { scrollTo() {} } });
  for (const link of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    assert.ok(fs.existsSync(path.resolve(templateDir, link[1])), link[1]);
  }
  for (const script of html.matchAll(/<script src="([^"]+)"/g)) {
    vm.runInContext(fs.readFileSync(path.resolve(templateDir, script[1]), 'utf8'), context);
  }
  assert.equal(document.getElementById('not-in-template'), null);
  assert.equal(nodes.get('progress').max, 3);
  assert.equal(nodes.get('position').textContent, '1 / 3');
  assert.equal(nodes.get('prev').disabled, true);
  nodes.get('index').onpointerenter({pointerType:'mouse'});
  assert.equal(nodes.get('index').open, true);
  nodes.get('index').onpointerleave({pointerType:'mouse'});
  assert.equal(nodes.get('index').open, false);
  nodes.get('index').onclick({preventDefault(){}, target:{closest(){return {};}}});
  assert.equal(nodes.get('pin')['aria-pressed'], 'true');
  nodes.get('index').onpointerleave({pointerType:'mouse'});
  assert.equal(nodes.get('index').open, true);
  nodes.get('index-list').onclick({target:{closest(){return {dataset:{page:'1'}};}}});
  assert.equal(nodes.get('position').textContent, '2 / 3');
  assert.equal(nodes.get('index').open, true);
  nodes.get('pin').onclick();
  nodes.get('index').onpointerleave({pointerType:'mouse'});
  assert.equal(nodes.get('index').open, false);
  assert.match(nodes.get('next').innerHTML, /看看接下來/);
  assert.equal(answers.length, 2);
  answers.find(button => button.dataset.answer === 'steps').onclick();
  assert.match(nodes.get('feedback').textContent, /省略的變化/);
  nodes.get('next').onclick();
  assert.equal(nodes.has('feedback'), false, '離頁後不保留假的 feedback 節點');
  assert.equal(listeners.size, 1);
  assert.equal(output.textContent, '先觀察現象');
  listeners.get('click')();
  assert.equal(output.textContent, '補上造成變化的原因');
  assert.ok(!nodes.get('index-list').innerHTML.includes('data-advance'));
  nodes.get('prev').onclick();
  assert.equal(listeners.size, 0);
  assert.match(nodes.get('feedback').textContent, /省略的變化/);
  nodes.get('next').onclick();
  assert.equal(output.textContent, '補上造成變化的原因');
  nodes.get('next').onclick();
  assert.equal(listeners.size, 0);
  assert.equal(nodes.get('position').textContent, '1 / 3');
}

exercise(templateHTML);
for (const id of Object.keys(required)) {
  assert.throws(() => exercise(templateHTML.replace(`id="${id}"`, '')), /缺少或錯置外殼節點/);
}
assert.throws(() => exercise(templateHTML.replace('id="page"', 'data-id="page"')), /缺少或錯置外殼節點：page/);
assert.throws(() => exercise(templateHTML.replace(/<main\b[^>]*>[\s\S]*?<\/main>/, '')), /缺少或錯置外殼節點：page/);
assert.throws(() => exercise(templateHTML.replace('</body>', '<div id="page"></div></body>')), /重複 id/);
console.log('PASS: actual template IDs, missing-shell regressions, navigation, pin, quiz clicks, mount/cleanup/state (DOM stub; not visual QA)');
