const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const page = fs.readFileSync('2026/agenda.html', 'utf8');
const script = fs.readFileSync('2026/js/agenda.js', 'utf8');
const styles = fs.readFileSync('2026/css/style.css', 'utf8');

test('la agenda incluye las dos jornadas y excluye la propuesta individual retirada', () => {
  assert.match(page, /data-agenda-panel="jueves"/);
  assert.match(page, /data-agenda-panel="viernes"/);
  assert.equal((page.match(/data-session-id="/g) || []).length, 14);
  assert.doesNotMatch(page, /data-session-id="grpc"|Beyond Hello World/);
  assert.doesNotMatch(script, /duckdb|Gerardo Enrique Nunez/);
  assert.match(page, /Jornada híbrida/);
});

test('las vistas Agenda y Sesiones comparten filtro y fichas completas', () => {
  assert.match(page, /data-view-tab="agenda"/);
  assert.match(page, /data-view-tab="sesiones"/);
  assert.doesNotMatch(page, /data-view-tab="conferencistas"/);
  assert.match(page, /agenda-detail-dialog/);
  assert.match(script, /Ver detalles de/);
  assert.match(script, /setDayFilter\('all'\)/);
  assert.match(script, /data-agenda-filter-day/);
  assert.match(script, /sessionCard\.addEventListener\('click'/);
  assert.match(script, /openSessionView\(sessionId, day, title, topic, description, profile\)/);
  assert.match(script, /openDetail\(title, topic, description, true, profile\)/);
  assert.match(script, /nameLabel\.textContent = 'Nombre'/);
  assert.match(script, /bioLabel\.textContent = 'Biografía'/);
  assert.match(script, /fa-linkedin-in/);
  assert.match(script, /fa-github/);
  assert.match(script, /setTime\(fridayEvents\[4\], 14, 45, 'p\. m\.', 15/);
  assert.match(script, /'gerardo-vilcaminaza': \[14, 5, 'p\. m\.', 40\]/);
  assert.match(script, /Keynote de Carlos Alarcón/);
  assert.match(script, /Keynote de Abdel Martínez/);
  assert.match(script, /Computer Vision en la nueva era del GenAI/);
  assert.match(script, /selectedDay === tab\.dataset\.agendaDay \? 'all'/);
  assert.match(script, /const movedToThursday = \['corporativo', 'ai-ready'\]/);
  assert.match(script, /'carlos', 'viernes', 11, 35, 35/);
  assert.match(script, /'abdel', 'jueves', 9, 5, 35/);
  assert.match(script, /setTime\(fridayEvents\[1\], 10, 50, 'a\. m\.', 10/);
  assert.match(script, /setTime\(fridayEvents\[2\], 12, 45, 'p\. m\.', 45/);
  assert.match(script, /setTime\(thursdayEvents\[1\], 10, 40, 'a\. m\.', 10/);
  assert.match(script, /setTime\(thursdayEvents\[2\], 12, 10, 'p\. m\.', 45/);
  assert.match(script, /fridayEvents\[3\]\.remove\(\)/);
  assert.match(script, /Cierre del Evento/);
});

test('no quedan controles de búsqueda, favoritos ni niveles', () => {
  assert.doesNotMatch(page, /agenda-search|agenda-favorites-toggle|agenda-level|agenda-results/);
  assert.doesNotMatch(script, /favoriteKey|agenda-search|agenda-level/);
  assert.match(page, /Redes y protocolos/);
  assert.match(page, /IA y agentes/);
});

test('el cronograma usa variables de la paleta y tipografía del sitio', () => {
  assert.match(styles, /\.agenda-time[\s\S]*?var\(--color-navy\)/);
  assert.match(styles, /\.agenda-day-tab[\s\S]*?var\(--accent\)/);
  assert.match(page, /css\/variables\.css/);
  assert.match(page, /family=Montserrat/);
});

test('todos los menús principales de 2026 enlazan a la agenda', () => {
  const pages = fs.readdirSync('2026').filter((name) => name.endsWith('.html'))
    .map((name) => ['2026/' + name, fs.readFileSync('2026/' + name, 'utf8')]);
  pages.push(['2026/voluntariado/index.html', fs.readFileSync('2026/voluntariado/index.html', 'utf8')]);
  assert.equal(pages.length, 12);
  pages.forEach(([file, content]) => {
    const navigation = content.match(/<nav id="nav-menu"[\s\S]*?<\/nav>/);
    assert.ok(navigation, file + ' tiene menú principal');
    assert.match(navigation[0], /href="(?:\.\.\/)?agenda\.html"/, file + ' enlaza a Agenda');
  });
});