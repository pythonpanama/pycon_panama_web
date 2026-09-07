const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const page = fs.readFileSync('2026/voluntariado/index.html', 'utf8');

test('la página usa la URL pública acordada y metadatos propios', () => {
  assert.match(page, /<title>Voluntariado - PyCon Panamá 2026<\/title>/);
  assert.match(page, /rel="canonical" href="https:\/\/pycon\.pa\/2026\/voluntariado\/"/);
  assert.match(page, /property="og:url" content="https:\/\/pycon\.pa\/2026\/voluntariado\/"/);
});

test('el formulario recoge funciones, disponibilidad y consentimientos explícitos', () => {
  assert.match(page, /id="volunteerForm"/);
  assert.equal((page.match(/name="roles"/g) || []).length, 3);
  for (const group of ['Operaciones y logística', 'Programa y experiencia', 'Comunicación y alianzas']) {
    assert.match(page, new RegExp(group));
  }
  assert.ok((page.match(/name="availability"/g) || []).length >= 4);
  assert.match(page, /id="consent_coc"[^>]+required/);
  assert.match(page, /id="consent_privacy"[^>]+required/);
  assert.match(page, /src="\.\.\/js\/voluntariado\.js"/);
});

test('todas las páginas principales enlazan el voluntariado', () => {
  const pages = fs.readdirSync('2026')
    .filter(name => name.endsWith('.html'))
    .map(name => path.join('2026', name));
  for (const filename of pages) {
    assert.match(fs.readFileSync(filename, 'utf8'), /href="voluntariado\/"/, filename);
  }
});

test('el aviso de privacidad describe el tratamiento de voluntariado', () => {
  const privacy = fs.readFileSync('2026/privacidad.html', 'utf8');
  assert.match(privacy, /Postulación de voluntariado/);
  assert.match(privacy, /versión y fecha de aceptación/);
});
