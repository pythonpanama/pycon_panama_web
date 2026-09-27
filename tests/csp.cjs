const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function pages(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? pages(file) : file.endsWith('.html') ? [file] : [];
  });
}

test('la edición cubierta por CSP no contiene ejecución ni estilos en línea', () => {
  for (const file of pages('2026')) {
    const html = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(html, /<script(?:\s[^>]*)?>(?!\s*<\/script>)/i, file);
    assert.doesNotMatch(html, /<style(?:\s[^>]*)?>/i, file);
    assert.doesNotMatch(html, /\s(?:style|on\w+)\s*=/i, file);
  }
});

test('la CSP de Netlify bloquea código en línea y limita recursos activos', () => {
  const config = fs.readFileSync('netlify.toml', 'utf8');
  const block = config.match(/\[\[headers\]\]\s*for = "\/2026\/\*"([\s\S]*?)(?=\n\[\[headers\]\]|$)/)?.[1];
  assert.ok(block);
  assert.match(block, /Content-Security-Policy = /);
  assert.match(block, /script-src 'self' https:\/\/cdn\.jsdelivr\.net/);
  assert.match(block, /connect-src 'self' https:\/\/\*\.supabase\.co/);
  assert.match(block, /object-src 'none'/);
  assert.match(block, /frame-ancestors 'self'/);
  assert.doesNotMatch(block, /unsafe-inline|unsafe-eval|Report-Only/);
});
