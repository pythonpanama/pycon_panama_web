const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ENCUESTAS = {
  'asistentes-csgiiz': 'asistentes',
  'voluntariado-qpntig': 'voluntariado',
  'equipo-ml38re': 'equipo'
};

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : file.endsWith('.html') ? [file] : [];
  });
}

for (const [slug, audiencia] of Object.entries(ENCUESTAS)) {
  const file = `2026/encuestas/${slug}/index.html`;
  const page = fs.readFileSync(file, 'utf8');

  test(`${slug}: no se indexa y usa su URL canónica`, () => {
    assert.match(page, /<meta name="robots" content="noindex, nofollow">/);
    assert.match(page, new RegExp(`rel="canonical" href="https://pycon\\.pa/2026/encuestas/${slug}/"`));
  });

  test(`${slug}: es anónima y envía la audiencia correcta`, () => {
    assert.match(page, new RegExp(`id="surveyForm"[^>]+data-audiencia="${audiencia}"`));
    assert.doesNotMatch(page, /name="(?:nombre|email|telefono|correo)"/);
    assert.doesNotMatch(page, /type="email"|autocomplete="(?:name|email|tel)"/);
    assert.match(page, /input type="radio" name="satisfaccion" value="1" required/);
    assert.match(page, /input type="radio" name="recomendacion" value="0" required/);
    assert.equal((page.match(/name="recomendacion"/g) || []).length, 11);
    assert.match(page, /data-cierre="2026-12-01T00:00:00-05:00"/);
    assert.match(page, /id="encuestaCerrada"[^>]*hidden/);
    assert.match(page, new RegExp(`<body class="encuesta tema-${audiencia}">`));
    assert.match(page, /src="\.\.\/\.\.\/js\/encuestas\.js\?v=\d+"/);
  });

  test(`${slug}: los nombres de campo cumplen la validación del servidor`, () => {
    const names = new Set([...page.matchAll(/<(?:input|textarea|select)[^>]*\sname="([^"]+)"/g)].map(m => m[1]));
    for (const name of names) assert.match(name, /^[a-z_]{1,40}$/, name);
    assert.ok(names.size <= 62);
  });
}

test('ninguna página pública enlaza las encuestas ni las anuncia', () => {
  for (const file of htmlFiles('2026').filter(f => !f.includes(`${path.sep}encuestas${path.sep}`))) {
    assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /encuestas\//, file);
  }
  assert.doesNotMatch(fs.readFileSync('sitemap.xml', 'utf8'), /encuestas/);
  assert.doesNotMatch(fs.readFileSync('robots.txt', 'utf8'), /encuestas/);
});

test('Netlify marca las encuestas como no indexables', () => {
  const config = fs.readFileSync('netlify.toml', 'utf8');
  assert.match(config, /for = "\/2026\/encuestas\/\*"\s*\[headers\.values\]\s*X-Robots-Tag = "noindex, nofollow"/);
});
