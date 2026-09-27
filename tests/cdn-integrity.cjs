const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : file.endsWith('.html') ? [file] : [];
  });
}

test('los recursos CDN usan versiones exactas, SRI y CORS coherentes', () => {
  const hashes = new Map();
  const sdkPages = [];
  for (const file of htmlFiles('2026')) {
    const html = fs.readFileSync(file, 'utf8');
    let fontAwesome = 0;
    for (const [tag] of html.matchAll(/<(?:script|link)\b[^>]*>/g)) {
      const attrs = Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
      const url = attrs.src || attrs.href || '';
      if (!url.includes('cdn.jsdelivr.net/npm/@supabase/') && !url.includes('cdnjs.cloudflare.com/ajax/libs/font-awesome/')) continue;
      assert.equal(attrs.crossorigin, 'anonymous', file);
      assert.match(attrs.integrity || '', /^sha384-[A-Za-z0-9+/]{64}$/, file);
      if (url.includes('@supabase/')) {
        assert.match(url, /^https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@\d+\.\d+\.\d+\/dist\/umd\/supabase(?:\.min)?\.js$/, file);
        sdkPages.push(file);
      } else {
        assert.match(url, /^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/\d+\.\d+\.\d+\/css\/all\.min\.css$/, file);
        fontAwesome++;
      }
      if (hashes.has(url)) assert.equal(attrs.integrity, hashes.get(url), file);
      hashes.set(url, attrs.integrity);
    }
    assert.equal(fontAwesome, 1, file);
  }
  assert.deepEqual(sdkPages.sort(), ['2026/ponentes.html', '2026/registro.html', '2026/voluntariado/index.html']);
  assert.equal(hashes.size, 2, 'Todas las páginas deben usar la misma versión de cada recurso');
});
