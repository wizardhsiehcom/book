const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
// 範本不是 TCP 的複製品：三頁、不同題目、互動生命週期。
const templateNodes = new Map();
const listeners = new Map();
const output = {};
const interactiveButton = {
  addEventListener(event, handler) { listeners.set(event, handler); },
  removeEventListener(event, handler) { assert.equal(listeners.get(event), handler); listeners.delete(event); },
};
const templateDocument = {
  querySelectorAll() { return []; }, addEventListener() {},
  getElementById(id) {
    if (!templateNodes.has(id)) templateNodes.set(id, {
      focus() {}, matches() { return false; }, setAttribute(key, value) { this[key] = value; },
      querySelector(selector) { return selector === '[data-result]' ? output : interactiveButton; },
    });
    return templateNodes.get(id);
  },
};
const templateContext = vm.createContext({ document: templateDocument, window: { scrollTo() {} } });
const templateHTML = fs.readFileSync(`${__dirname}/../templates/visual-story/index.html`, 'utf8');
for (const link of templateHTML.matchAll(/(?:href|src)="([^"#]+)"/g)) {
  assert.ok(fs.existsSync(path.resolve(__dirname, '../templates/visual-story', link[1])), link[1]);
}
for (const script of templateHTML.matchAll(/<script src="([^"]+)"/g)) {
  vm.runInContext(fs.readFileSync(path.resolve(__dirname, '../templates/visual-story', script[1]), 'utf8'), templateContext);
}
assert.equal(templateNodes.get('progress').max, 3);
assert.equal(templateNodes.get('position').textContent, '1 / 3');
templateNodes.get('index').onpointerenter({pointerType:'mouse'});
assert.equal(templateNodes.get('index').open, true);
templateNodes.get('index').onpointerleave({pointerType:'mouse'});
assert.equal(templateNodes.get('index').open, false);
templateNodes.get('index').onclick({preventDefault(){}, target:{closest(){return {};}}});
assert.equal(templateNodes.get('pin')['aria-pressed'], 'true');
templateNodes.get('index').onpointerleave({pointerType:'mouse'});
assert.equal(templateNodes.get('index').open, true);
templateNodes.get('index-list').onclick({target:{closest(){return {dataset:{page:'1'}};}}});
assert.equal(templateNodes.get('position').textContent, '2 / 3');
assert.equal(templateNodes.get('index').open, true);
templateNodes.get('pin').onclick();
templateNodes.get('index').onpointerleave({pointerType:'mouse'});
assert.equal(templateNodes.get('index').open, false);
vm.runInContext('move(-1)', templateContext);
vm.runInContext('move(1)', templateContext);
assert.match(templateNodes.get('next').innerHTML, /看看接下來/);
vm.runInContext("answers.set('predict', 'steps'); feedback()", templateContext);
assert.match(templateNodes.get('feedback').textContent, /省略的變化/);
vm.runInContext('move(1)', templateContext);
assert.equal(listeners.size, 1);
assert.equal(output.textContent, '先觀察現象');
listeners.get('click')();
assert.equal(output.textContent, '補上造成變化的原因');
assert.ok(!templateNodes.get('index-list').innerHTML.includes('data-advance'));
vm.runInContext('move(-1)', templateContext);
assert.equal(listeners.size, 0);
vm.runInContext('move(1)', templateContext);
assert.equal(output.textContent, '補上造成變化的原因');
vm.runInContext('move(1)', templateContext);
assert.equal(listeners.size, 0);
assert.equal(templateNodes.get('position').textContent, '1 / 3');
console.log('PASS: template 3 pages; navigation, pin, quizzes, links, mount/cleanup/state (DOM stub; not visual QA)');
