const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const page = fs.readFileSync('2026/registro.html', 'utf8');

test('el registro exige al menos un día y modalidad cuando corresponde', () => {
  assert.match(page, /id="dia_jueves"[^>]+value="Jueves 22"/);
  assert.match(page, /id="dia_viernes"[^>]+value="Viernes 23"/);
  assert.match(page, /name="modalidad_jueves" value="Presencial"/);
  assert.match(page, /name="modalidad_jueves" value="Google Meet"/);
  assert.match(page, /setCustomValidity\(hasSelectedDay/);
  assert.match(page, /option\.required = diaJueves\.checked/);
});

test('el registro recoge accesibilidad y consentimiento de privacidad explícito', () => {
  assert.match(page, /id="accesibilidad"[^>]+maxlength="500"/);
  assert.match(page, /No incluyas diagnósticos ni información médica/);
  assert.match(page, /id="consent_privacy"[^>]+required/);
  assert.doesNotMatch(page, /id="consent_photos"/);
});

test('el aviso de privacidad coincide con los datos del registro', () => {
  const privacy = fs.readFileSync('2026/privacidad.html', 'utf8');
  assert.match(privacy, /días de asistencia/);
  assert.match(privacy, /presencialmente o por Google Meet/);
  assert.match(privacy, /ajuste de accesibilidad/);
  assert.match(privacy, /versión y fecha en que aceptaste/);
  assert.match(privacy, /Versión 1\.1/);
});
