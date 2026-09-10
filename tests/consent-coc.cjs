const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('2026/js/supabase-config.js', 'utf8');
function setup(sdk = false) {
  const writes = [];
  const context = { window: {}, console: { log() {}, error() {}, warn() {} }, fetch: async (_, options) => {
    writes.push(JSON.parse(options.body));
    assert.equal(options.headers.Prefer, 'return=minimal');
    return { ok: true };
  }};
  if (sdk) context.window.supabase = { createClient: () => ({ from: () => ({ insert: async payload => {
    writes.push(Array.isArray(payload) ? payload[0] : payload);
    return { error: null };
  }}) }) };
  vm.createContext(context); vm.runInContext(source, context);
  return { api: context.window.PyConSupabase, writes };
}
for (const method of ['registrarAsistente', 'registrarSpeaker']) {
  const base = {
    nombre: 'Prueba', email: 'test@example.invalid', dias: ['Viernes 23'],
    consent_privacy: true, consent_publication: true
  };
  test(`${method}: rechaza consentimiento ambiguo sin escribir`, async () => {
    for (const value of [undefined, null, false, 'false', 'true', '0', 1, {}, []]) {
      const { api, writes } = setup();
      const result = await api[method]({ ...base, consent_coc: value });
      assert.equal(result.success, false); assert.equal(writes.length, 0);
    }
  });
  for (const sdk of [false, true]) test(`${method}: persiste aceptación, versión y fecha por ${sdk ? 'SDK' : 'REST'}`, async () => {
    const { api, writes } = setup(sdk);
    const result = await api[method]({ ...base, consent_coc: true });
    assert.equal(result.success, true); assert.equal(writes.length, 1);
    assert.equal(writes[0].consent_coc, true);
    assert.equal(writes[0].consent_coc_version, api.COC_VERSION);
    assert.ok(Number.isFinite(Date.parse(writes[0].consent_coc_at)));
    assert.match(fs.readFileSync('2026/codigo_conducta.html', 'utf8'), new RegExp(`Versión ${api.COC_VERSION.replace('.', '\\.')}`));
  });
}

test('registrarAsistente: exige día, modalidad del jueves y privacidad sin escribir', async () => {
  const valid = {
    nombre: 'Prueba', email: 'test@example.invalid', dias: ['Jueves 22'],
    modalidad_jueves: 'Presencial', consent_coc: true, consent_privacy: true
  };
  for (const change of [
    { dias: [] },
    { dias: ['Día inventado'] },
    { modalidad_jueves: '' },
    { modalidad_jueves: 'Otra' },
    { consent_privacy: false }
  ]) {
    const { api, writes } = setup();
    const result = await api.registrarAsistente({ ...valid, ...change });
    assert.equal(result.success, false);
    assert.equal(writes.length, 0);
  }
});

test('registrarAsistente: guarda modalidad, accesibilidad y consentimiento de privacidad', async () => {
  const { api, writes } = setup();
  const result = await api.registrarAsistente({
    nombre: 'Prueba', email: 'test@example.invalid', rol: 'Profesional',
    dias: ['Jueves 22', 'Viernes 23'], modalidad_jueves: 'Google Meet',
    expectativas: 'Aprender sobre Python', accesibilidad: 'Intérprete de señas',
    consent_coc: true, consent_privacy: true
  });
  assert.equal(result.success, true);
  assert.equal(writes.length, 1);
  assert.equal(writes[0].dias, 'Jueves 22, Viernes 23');
  assert.equal(writes[0].thursday_mode, 'Google Meet');
  assert.equal(writes[0].accessibility, 'Intérprete de señas');
  assert.equal(writes[0].consent_privacy, true);
  assert.equal(writes[0].consent_privacy_version, api.PRIVACY_VERSION);
  assert.ok(Number.isFinite(Date.parse(writes[0].consent_privacy_at)));
  assert.equal(Object.hasOwn(writes[0], 'consent_photos'), false);
  assert.match(
    fs.readFileSync('2026/privacidad.html', 'utf8'),
    new RegExp(`Versión ${api.PRIVACY_VERSION.replace('.', '\\.')}`)
  );
});

test('registrarAsistente: no guarda modalidad cuando solo asiste el viernes', async () => {
  const { api, writes } = setup();
  const result = await api.registrarAsistente({
    nombre: 'Prueba', email: 'test@example.invalid', dias: ['Viernes 23'],
    modalidad_jueves: 'Presencial', consent_coc: true, consent_privacy: true
  });
  assert.equal(result.success, true);
  assert.equal(writes[0].thursday_mode, null);
});

test('registrarAsistente: usa el esquema anterior solo ante columnas ausentes', async () => {
  const writes = [];
  const context = {
    window: {},
    console: { log() {}, error() {}, warn() {} },
    fetch: async (_, options) => {
      const payload = JSON.parse(options.body);
      writes.push(payload);
      if (writes.length === 1) {
        return {
          ok: false,
          status: 400,
          text: async () => JSON.stringify({
            code: 'PGRST204',
            message: "Could not find the 'thursday_mode' column in the schema cache"
          })
        };
      }
      return { ok: true };
    }
  };
  vm.createContext(context);
  vm.runInContext(source, context);

  const result = await context.window.PyConSupabase.registrarAsistente({
    nombre: 'Prueba', email: 'test@example.invalid', dias: ['Jueves 22'],
    modalidad_jueves: 'Google Meet', accesibilidad: 'No necesito ajustes',
    consent_coc: true, consent_privacy: true
  });

  assert.equal(result.success, true);
  assert.equal(result.legacySchema, true);
  assert.equal(writes.length, 2);
  assert.equal(writes[0].thursday_mode, 'Google Meet');
  assert.equal(writes[0].consent_privacy, true);
  assert.equal(writes[1].dias, 'Jueves 22 (Google Meet)');
  assert.equal(writes[1].consent_photos, true);
  assert.equal(writes[1].accessibility, 'No necesito ajustes');
  assert.equal(Object.hasOwn(writes[1], 'thursday_mode'), false);
  assert.equal(Object.hasOwn(writes[1], 'consent_privacy'), false);
});

test('registrarAsistente: no usa fallback ante un rechazo distinto', async () => {
  let requests = 0;
  const context = {
    window: {},
    console: { log() {}, error() {}, warn() {} },
    fetch: async () => {
      requests += 1;
      return {
        ok: false,
        status: 400,
        text: async () => JSON.stringify({ code: '23514', message: 'check violation' })
      };
    }
  };
  vm.createContext(context);
  vm.runInContext(source, context);

  const result = await context.window.PyConSupabase.registrarAsistente({
    nombre: 'Prueba', email: 'test@example.invalid', dias: ['Viernes 23'],
    consent_coc: true, consent_privacy: true
  });

  assert.equal(result.success, false);
  assert.equal(requests, 1);
});

test('registrarVoluntariado: exige consentimiento, roles y disponibilidad sin escribir', async () => {
  const valid = {
    nombre: 'Prueba', email: 'test@example.invalid', roles: ['registro'],
    availability: ['jueves'], experiencia: 'Experiencia comunitaria', motivacion: 'Quiero apoyar',
    accesibilidad: 'No necesito ajustes', consent_coc: true, consent_privacy: true
  };
  for (const change of [
    { consent_coc: false }, { consent_privacy: false }, { roles: [] }, { availability: [] },
    { experiencia: '' }, { motivacion: '' }, { accesibilidad: '' }
  ]) {
    const { api, writes } = setup();
    const result = await api.registrarVoluntariado({ ...valid, ...change });
    assert.equal(result.success, false);
    assert.equal(writes.length, 0);
  }
});

test('registrarVoluntariado: envía una postulación centralizada y consentimientos', async () => {
  const { api, writes } = setup();
  const result = await api.registrarVoluntariado({
    nombre: 'Prueba', email: 'test@example.invalid', telefono: '', ciudad: 'Panamá',
    provincia: 'Panamá', roles: ['registro', 'logistica'], availability: ['jueves', 'viernes'],
    experiencia: 'Eventos comunitarios', motivacion: 'Quiero apoyar', accesibilidad: 'No necesito ajustes',
    consent_coc: true, consent_privacy: true
  });
  assert.equal(result.success, true);
  assert.equal(writes.length, 1);
  const submission = writes[0].p_submission;
  assert.equal(submission.initiative, 'pycon_panama');
  assert.equal(submission.edition, '2026');
  assert.equal(submission.source_site, 'pycon.pa');
  assert.deepEqual(submission.roles, ['registro', 'logistica']);
  assert.equal(submission.consent_privacy, true);
  assert.equal(submission.consent_privacy_version, api.PRIVACY_VERSION);
  assert.equal(submission.consent_coc, true);
  assert.equal(submission.consent_coc_version, api.COC_VERSION);
  assert.ok(Number.isFinite(Date.parse(submission.consent_privacy_at)));
  assert.ok(Number.isFinite(Date.parse(submission.consent_coc_at)));
  assert.match(fs.readFileSync('2026/privacidad.html', 'utf8'), new RegExp(`Versión ${api.PRIVACY_VERSION.replace('.', '\\.')}`));
});
