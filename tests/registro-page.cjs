const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const page = fs.readFileSync('2026/registro.html', 'utf8');
const pageScript = fs.readFileSync('2026/js/registro.js', 'utf8');

test('el registro exige al menos un día y modalidad cuando corresponde', () => {
  assert.match(page, /id="dia_jueves"[^>]+value="Jueves 22"/);
  assert.match(page, /id="dia_viernes"[^>]+value="Viernes 23"/);
  assert.match(page, /name="modalidad_jueves" value="Presencial"/);
  assert.match(page, /name="modalidad_jueves" value="Google Meet"/);
  assert.match(page, /src="js\/registro\.js"/);
  assert.match(pageScript, /setCustomValidity\(hasSelectedDay/);
  assert.match(pageScript, /option\.required = diaJueves\.checked/);
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
  assert.match(privacy, /Versión 1\.2/);
});

test('el registro incluye honeypot oculto y Turnstile', () => {
  assert.match(page, /class="campo-trampa" aria-hidden="true"/);
  assert.match(page, /id="sitio_web"[^>]+tabindex="-1"[^>]+autocomplete="off"/);
  assert.match(page, /id="turnstileWidget"/);
  assert.match(page, /src="https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js\?render=explicit&amp;onload=pyconTurnstileListo"/);
  assert.match(pageScript, /action: 'registro'/);
  assert.match(pageScript, /appearance: 'interaction-only'/);
  assert.match(pageScript, /renovarTurnstile\(\)/);
  const config = fs.readFileSync('netlify.toml', 'utf8');
  assert.match(config, /script-src[^;]*https:\/\/challenges\.cloudflare\.com/);
  assert.match(config, /frame-src https:\/\/challenges\.cloudflare\.com/);
});
