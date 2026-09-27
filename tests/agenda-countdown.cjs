const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { countdownMessage } = require('../2026/js/agenda-countdown.js');
const html = fs.readFileSync('2026/agenda.html', 'utf8');
const publicationDate = html.match(/id="agenda-publication-date" datetime="([^"]+)"/)[1];

for (const [instant, expected] of [
  ['2026-09-27T17:00:00Z', 'Faltan 5 días para publicar la agenda'],
  ['2026-10-01T04:59:59Z', 'Faltan 2 días para publicar la agenda'],
  ['2026-10-01T05:00:00Z', 'Falta 1 día para publicar la agenda'],
  ['2026-10-02T04:59:59Z', 'Falta 1 día para publicar la agenda'],
  ['2026-10-02T05:00:00Z', 'La agenda se publica hoy'],
  ['2026-10-03T04:59:59Z', 'La agenda se publica hoy'],
  ['2026-10-03T05:00:00Z', 'Agenda pendiente de publicación'],
  ['2027-01-01T12:00:00Z', 'Agenda pendiente de publicación']
]) test(`agenda: ${instant} en Panamá`, () => {
  assert.equal(countdownMessage(publicationDate, new Date(instant)), expected);
});

test('resta fechas calendario, incluso entre meses, sin redondear horas', () => {
  assert.equal(countdownMessage('2028-03-01', new Date('2028-02-29T23:59:00-05:00')), 'Falta 1 día para publicar la agenda');
});

test('la fecha sigue visible sin JavaScript y no hay anuncios en vivo', () => {
  assert.match(html, /datetime="2026-10-02">viernes 2 de octubre de 2026<\/time>/);
  assert.match(html, /id="agenda-countdown"[^>]*aria-live="off">La hora de publicación está por confirmar\./);
});

test('actualiza al cambiar el día y al volver a la pestaña, sin reescribir el mismo texto', () => {
  let instant = '2026-10-02T04:59:59Z';
  let value = '';
  let writes = 0;
  let interval;
  let onVisibility;
  const counter = { get textContent() { return value; }, set textContent(next) { value = next; writes++; } };
  const context = {
    Intl,
    Date: class extends Date { constructor() { super(instant); } },
    document: {
      hidden: false,
      getElementById: id => id === 'agenda-countdown' ? counter : { getAttribute: () => publicationDate },
      addEventListener: (event, callback) => { assert.equal(event, 'visibilitychange'); onVisibility = callback; }
    },
    window: { setInterval: (callback, delay) => { assert.equal(delay, 60000); interval = callback; } }
  };
  vm.runInNewContext(fs.readFileSync('2026/js/agenda-countdown.js', 'utf8'), context);
  assert.equal(value, 'Falta 1 día para publicar la agenda');
  interval();
  assert.equal(writes, 1);
  instant = '2026-10-02T05:00:00Z';
  interval();
  assert.equal(value, 'La agenda se publica hoy');
  instant = '2026-10-03T05:00:00Z';
  onVisibility();
  assert.equal(value, 'Agenda pendiente de publicación');
});
