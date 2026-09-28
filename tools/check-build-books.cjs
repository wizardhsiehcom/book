// 執行真正的建置入口，僅將資產同步與 MkDocs 換成隔離替身。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'book-build-check-'));
function write(file, content) {
  const target = path.join(temp, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}
function run() {
  return spawnSync('bash', ['build-books.sh'], { cwd: temp, encoding: 'utf8', env: { ...process.env, PATH: `${temp}/bin:${process.env.PATH}` } });
}
try {
  write('build-books.sh', fs.readFileSync(path.join(root, 'build-books.sh')));
  write('tools/check-books.cjs', fs.readFileSync(path.join(root, 'tools/check-books.cjs')));
  write('sync-assets.sh', '#!/usr/bin/env bash\nexit 0\n');
  write('configs/demo.yml', 'site_name: Demo\n');
  write('docs/demo/index.md', '# Demo\n');
  write('js/books-data.js', 'const CATEGORIES = ["甲"]; const BOOKS = [{href:"book/demo/html/index.html", category:"甲"}];');
  write('overrides/main.html', 'old theme');
  write('uv.lock', 'old toolchain');
  write('bin/uv', `#!/usr/bin/env node
const fs = require('node:fs');
fs.mkdirSync('book/demo/html', {recursive:true});
fs.writeFileSync('book/demo/html/index.html', fs.readFileSync('overrides/main.html', 'utf8') + fs.readFileSync('uv.lock', 'utf8'));
if (fs.existsSync('fail-build')) process.exit(2);
`);
  fs.chmodSync(path.join(temp, 'bin/uv'), 0o755);
  assert.equal(run().status, 0);
  write('overrides/main.html', 'new theme');
  const rebuild = run();
  assert.equal(rebuild.status, 0, rebuild.stderr);
  const output = path.join(temp, 'book/demo/html/index.html');
  assert.match(fs.readFileSync(output, 'utf8'), /new theme/, '共用版型變更不可被快取跳過');
  write('uv.lock', 'new toolchain');
  assert.equal(run().status, 0);
  assert.match(fs.readFileSync(output, 'utf8'), /new toolchain/);
  assert.ok(!fs.existsSync(path.join(temp, 'book/demo/.build-hash')), '不再產生成功 stamp');
  write('fail-build', '');
  assert.notEqual(run().status, 0, '建置失敗必須向呼叫端傳回失敗');
  assert.ok(!fs.existsSync(path.join(temp, 'book/demo/.build-hash')));
  fs.unlinkSync(path.join(temp, 'fail-build'));
  write('book/demo/.build-hash', 'legacy stamp');
  write('overrides/main.html', 'latest theme');
  assert.equal(run().status, 0);
  assert.match(fs.readFileSync(output, 'utf8'), /latest theme/);
  assert.equal(fs.readFileSync(path.join(temp, 'book/demo/.build-hash'), 'utf8'), 'legacy stamp');
  write('js/books-data.js', 'const BOOKS = [{href:"bad"}];');
  const invalid = run();
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stderr, /路徑無效/);
  assert.ok(!invalid.stdout.includes('Building demo'), '登錄錯誤須在建置前阻擋');
  console.log('PASS: shared inputs rebuild, failures propagate, no success stamp, registry gates build');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
