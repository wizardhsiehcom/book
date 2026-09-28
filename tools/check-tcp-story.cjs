// 正式故事的模型與掛載檢查；瀏覽器視覺驗收另記。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../docs/systems-network-foundations/resources/tcp-stream/story.js'), 'utf8');
const context = vm.createContext({});
vm.runInContext(source, context);
const { tcpReceive, tcpSnapshot, tcpStream, story } = vm.runInContext('({tcpReceive, tcpSnapshot, tcpStream, story})', context);
const plain = value => JSON.parse(JSON.stringify(value));

// 12 bytes 的 11 個間隙，各自切／不切，共 2048 種。
for (let mask = 0; mask < 2 ** (tcpStream.length - 1); mask++) {
  let start = 0, pending = '';
  const messages = [];
  for (let i = 1; i <= tcpStream.length; i++) {
    if (i === tcpStream.length || mask & (1 << (i - 1))) {
      const result = tcpReceive(pending, tcpStream.slice(start, i));
      messages.push(...result.messages);
      pending = result.pending;
      start = i;
      const prefix = tcpStream.slice(0, i).split('\n');
      assert.equal(pending, prefix.pop());
      assert.deepEqual(messages, prefix);
    }
  }
  assert.deepEqual(messages, ['HELLO', 'WORLD']);
  assert.equal(pending, '');
}
assert.deepEqual(plain(tcpSnapshot([2, 6, 4], 2)), {count:8, pending:'WO', latest:'LLO\nWO', messages:['HELLO']});
assert.deepEqual(plain(tcpReceive('WO', '', true)), {messages:[], pending:'WO', truncated:true});
assert.equal(tcpReceive('WO', '').truncated, false);
assert.equal(tcpReceive('', '', true).truncated, false);
assert.deepEqual(plain(tcpReceive('WO', 'RLD\n', true)), {messages:['WORLD'], pending:'', truncated:false});

// 測正式 mount 的按鈕、切法切換、重設、返回狀態與事件清理。
const nodes = new Map();
for (const name of ['cuts','next','reset','meter','board']) {
  const listeners = new Map();
  nodes.set(`[data-tcp-${name}]`, {
    listeners,
    addEventListener(event, fn) { assert.ok(!listeners.has(event)); listeners.set(event, fn); },
    removeEventListener(event, fn) { assert.equal(listeners.get(event), fn); listeners.delete(event); },
  });
}
const root = {querySelector(selector) { assert.ok(nodes.has(selector)); return nodes.get(selector); }};
const node = name => nodes.get(`[data-tcp-${name}]`);
const fire = (name, event = 'click') => node(name).listeners.get(event)();
const page = story.pages.find(p => p.id === 'tcp-try-cuts'), state = {};
assert.ok(page.previewArt && !/data-tcp-|<select|<button/.test(page.previewArt));
let cleanup = page.mount(root, state);
fire('next'); fire('next');
assert.match(node('meter').textContent, /8 \/ 12 bytes · 2 次接收 · 1 筆完整訊息 · 尾巴 2 bytes/);
assert.match(node('board').innerHTML, /WO/);
cleanup();
assert.ok([...nodes.values()].every(n => n.listeners.size === 0));
cleanup = page.mount(root, state);
assert.match(node('meter').textContent, /8 \/ 12 bytes/);
fire('next'); assert.equal(node('next').disabled, true);
fire('reset'); assert.equal(node('next').disabled, false);
assert.match(node('meter').textContent, /0 \/ 12 bytes/);
for (const mode of ['whole', 'single']) {
  node('cuts').value = mode; fire('cuts', 'change');
  assert.equal(state.step, 0);
  for (let i = 0; i < (mode === 'whole' ? 1 : 12); i++) fire('next');
  assert.equal(node('next').disabled, true);
  assert.match(node('meter').textContent, /2 筆完整訊息 · 尾巴 0 bytes/);
}
cleanup();
assert.ok([...nodes.values()].every(n => n.listeners.size === 0));
assert.equal(new Set(story.pages.map(p => p.id)).size, story.pages.length);
console.log('PASS: 2048 chunk partitions, tails, EOF, live mount/reset/restore/cleanup (not browser QA)');

assert.deepEqual(plain(tcpSnapshot([5,2,5],2)),{count:7,pending:'W',latest:'\nW',messages:['HELLO']});assert(story.pages.at(-1).question);
