// 首頁只列部分書籍是允許的；錯誤路徑與重複登錄則阻擋建置。
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

function validate(books, configs, docs) {
  const errors = [], warnings = [], seen = new Set();
  if (!Array.isArray(books)) return { errors: ['BOOKS 必須是陣列'], warnings };
  for (const [index, book] of books.entries()) {
    const href = book?.href;
    const match = typeof href === 'string' && href.match(/^book\/([a-z0-9]+(?:[-_][a-z0-9]+)*)\/html\/index\.html$/);
    if (!match) { errors.push(`第 ${index + 1} 張卡片路徑無效：${String(href)}`); continue; }
    const name = match[1];
    if (seen.has(name)) errors.push(`重複登錄：${name}`);
    seen.add(name);
    if (!configs.has(name)) errors.push(`卡片沒有對應 config：${name}`);
    if (!docs.has(name)) errors.push(`卡片沒有對應 docs 目錄：${name}`);
  }
  for (const name of configs) {
    if (!seen.has(name)) warnings.push(`未列於首頁（允許）：${name}`);
  }
  return { errors, warnings };
}

if (process.argv.includes('--self-test')) {
  const configs = new Set(['demo', 'draft']), docs = new Set(['demo', 'draft']);
  const card = { href: 'book/demo/html/index.html' };
  const result = validate([card], configs, docs);
  assert.equal(result.errors.length, 0);
  assert.deepEqual(result.warnings, ['未列於首頁（允許）：draft']);
  assert.match(validate([card, card], configs, docs).errors.join(), /重複/);
  assert.match(validate([card], new Set(), docs).errors.join(), /config/);
  assert.match(validate([card], configs, new Set()).errors.join(), /docs/);
  for (const href of ['../index.html', 'https://example.com', 'book/../html/index.html', '', null]) {
    assert.match(validate([{ href }], configs, docs).errors.join(), /路徑無效/);
  }
  assert.match(validate({}, configs, docs).errors.join(), /陣列/);
  assert.equal(validate([{ href: 'book/dl_practice/html/index.html' }], new Set(['dl_practice']), new Set(['dl_practice'])).errors.length, 0);
  console.log('PASS: registry errors vs allowed homepage omissions');
} else {
  const root = path.resolve(__dirname, '..');
  const configs = new Set(fs.readdirSync(path.join(root, 'configs')).filter(name => name.endsWith('.yml')).map(name => name.slice(0, -4)));
  const docs = new Set(fs.readdirSync(path.join(root, 'docs'), { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name));
  // 僅執行 repo 作者維護的本地 JS，不接受外部資料；這不是不可信程式碼沙箱。
  const books = vm.runInNewContext(fs.readFileSync(path.join(root, 'js/books-data.js'), 'utf8') + '\nBOOKS;', {}, { timeout: 1000 });
  const { errors, warnings } = validate(books, configs, docs);
  warnings.forEach(message => console.warn(`WARN: ${message}`));
  errors.forEach(message => console.error(`ERROR: ${message}`));
  if (errors.length) process.exitCode = 1;
  else console.log(`PASS: ${books.length} 張卡片的路徑、config 與 docs 對應有效`);
}
