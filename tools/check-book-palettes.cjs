const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
const css = read('docs/assets/book-palette.css');
const configs = fs.readdirSync(path.join(root, 'configs')).filter(name => name.endsWith('.yml'));
assert.ok(configs.length > 0);

for (const name of configs) {
  const config = read(`configs/${name}`);
  const palette = config.match(/^  palette:\n.*?(?=^  [a-z_]|^[a-z_]|(?![\s\S]))/ms);
  assert.ok(palette, `${name}: missing palette`);
  const entries = palette[0].split('    - media:').slice(1);
  assert.equal(entries.length, 2, `${name}: requires a dark/light pair`);
  const schemes = [];
  for (const entry of entries) {
    const scheme = entry.match(/^\s+scheme: (\w+)$/m)?.[1];
    schemes.push(scheme);
    assert.match(entry, /^\s+primary: custom$/m, name);
    assert.match(entry, /^\s+accent: custom$/m, name);
    assert.ok(entry.includes(scheme === 'slate' ? '(prefers-color-scheme: dark)' : '(prefers-color-scheme: light)'), name);
    assert.ok(entry.includes(scheme === 'slate' ? 'material/weather-sunny' : 'material/weather-night'), name);
    assert.ok(entry.includes(scheme === 'slate' ? '切換為和紙朱印（淺色）' : '切換為墨朱（深色）'), name);
  }
  assert.deepEqual(schemes.sort(), ['default', 'slate'], name);
  const extraCss = config.match(/^extra_css:\n.*?(?=^[a-z_]|(?![\s\S]))/ms)?.[0];
  assert.ok(extraCss, `${name}: missing extra_css`);
  assert.equal(extraCss.split('assets/book-palette.css').length - 1, 1, name);
  if (extraCss.includes('assets/custom.css')) {
    assert.ok(extraCss.indexOf('assets/custom.css') < extraCss.indexOf('assets/book-palette.css'), name);
  }
  assert.ok(!extraCss.includes('playground'), name);
}

function luminance(hex) {
  const channels = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255);
  const linear = channels.map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return linear.reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
}

function contrast(first, second) {
  const [low, high] = [luminance(first), luminance(second)].sort((a, b) => a - b);
  return (high + .05) / (low + .05);
}

for (const scheme of ['slate', 'default']) {
  const block = css.match(new RegExp(`\\[data-md-color-scheme="${scheme}"\\] \\{([^}]+)\\}`))?.[1];
  assert.ok(block, scheme);
  const tokens = Object.fromEntries([...block.matchAll(/--book-([\w-]+): (#[0-9a-f]{6});/g)]
    .map(match => [match[1], match[2]]));
  assert.equal(tokens.bg, scheme === 'slate' ? '#141413' : '#f2ede3');
  const pairs = [
    ...['text', 'muted', 'accent'].flatMap(fg => ['bg', 'surface'].map(bg => [fg, bg])),
    ...['text', 'muted', 'keyword', 'string', 'number', 'gold'].map(fg => [fg, 'code']),
  ];
  for (const [fg, bg] of pairs) {
    assert.ok(tokens[fg] && tokens[bg], `${scheme}: missing ${fg}/${bg}`);
    assert.ok(contrast(tokens[fg], tokens[bg]) >= 4.5, `${scheme}: ${fg}/${bg} must reach 4.5:1`);
  }
}
assert.ok(contrast('#e58a83', '#141413') >= 4.5, 'Footer links stay readable in light mode');
assert.match(read('sync-assets.sh'), /cp "\$src_assets\/book-palette\.css" "\$target\/book-palette\.css"/);
assert.ok(!css.includes('playground') && !css.includes('templates/'), 'No preview runtime dependencies');
console.log(`PASS: ${configs.length} palette pairs, shared asset wiring, saved scheme IDs, text/code contrast`);
