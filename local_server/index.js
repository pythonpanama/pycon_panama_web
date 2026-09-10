const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 9000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedTables = new Set(
  (process.env.ALLOWED_TABLES || '')
    .split(',')
    .map((table) => table.trim())
    .filter(Boolean)
);

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !allowedOrigins.length || !allowedTables.size) {
  throw new Error(
    'Missing required local_server configuration. Copy .env.example to .env and set every value.'
  );
}

try {
  new URL(SUPABASE_URL);
} catch {
  throw new Error('SUPABASE_URL must be a valid URL.');
}

// Esquema por tabla. El proxy habla con Supabase usando la clave de servicio,
// que ignora RLS, así que no delega la validación aguas abajo: solo deja pasar
// las propiedades conocidas y con el tipo esperado. Las tablas que no estén
// aquí quedan sujetas a las reglas genéricas de plainObject/valores escalares.
const TABLE_SCHEMAS = {
  registrations: {
    required: [
      'name', 'email', 'dias',
      'consent_privacy', 'consent_privacy_version', 'consent_privacy_at',
      'consent_coc', 'consent_coc_version', 'consent_coc_at'
    ],
    fields: {
      name: 'string',
      email: 'string',
      phone: 'string',
      role: 'string',
      organization: 'string',
      dias: 'string',
      thursday_mode: 'string',
      expectativas: 'string',
      accessibility: 'string',
      consent_privacy: 'boolean',
      consent_privacy_version: 'string',
      consent_privacy_at: 'string',
      consent_coc: 'boolean',
      consent_coc_version: 'string',
      consent_coc_at: 'string',
      created_at: 'string'
    }
  },
  speakers: {
    required: [
      'name', 'email', 'title', 'abstract',
      'consent_privacy', 'consent_privacy_version', 'consent_privacy_at',
      'consent_coc', 'consent_coc_version', 'consent_coc_at'
    ],
    fields: {
      name: 'string',
      email: 'string',
      phone: 'string',
      affiliation: 'string',
      bio: 'string',
      title: 'string',
      abstract: 'string',
      nivel: 'string',
      modalidad: 'string',
      duration: 'number',
      language: 'string',
      links: 'string',
      consent_privacy: 'boolean',
      consent_privacy_version: 'string',
      consent_privacy_at: 'string',
      consent_coc: 'boolean',
      consent_coc_version: 'string',
      consent_coc_at: 'string',
      created_at: 'string'
    }
  }
};

const MAX_KEYS = 40;
const MAX_STRING_LENGTH = 5000;
const KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]{0,62}$/;

// Un JSON como "invalid-string", 42 o [] no es un registro: se rechaza antes de
// llegar al servicio privilegiado. Solo se aceptan objetos planos, sin
// prototipo ajeno, para que no viajen __proto__ ni claves heredadas.
function isPlainObject(value) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasValidType(value, expected) {
  if (value === null) {
    return true;
  }
  if (expected === 'string') {
    return typeof value === 'string' && value.length <= MAX_STRING_LENGTH;
  }
  if (expected === 'number') {
    return typeof value === 'number' && Number.isFinite(value);
  }
  if (expected === 'boolean') {
    return typeof value === 'boolean';
  }
  return false;
}

function isAllowedScalar(value) {
  return (
    value === null ||
    typeof value === 'boolean' ||
    (typeof value === 'number' && Number.isFinite(value)) ||
    (typeof value === 'string' && value.length <= MAX_STRING_LENGTH)
  );
}

function validatePayload(table, payload) {
  if (!isPlainObject(payload)) {
    return 'Payload must be a plain object.';
  }

  const keys = Object.keys(payload);
  if (!keys.length) {
    return 'Payload must not be empty.';
  }
  if (keys.length > MAX_KEYS) {
    return 'Payload has too many properties.';
  }
  if (!keys.every((key) => KEY_PATTERN.test(key))) {
    return 'Payload contains an invalid property name.';
  }

  const schema = TABLE_SCHEMAS[table];
  if (!schema) {
    return keys.every((key) => isAllowedScalar(payload[key]))
      ? null
      : 'Payload values must be strings, numbers, booleans or null.';
  }

  const missing = schema.required.find(
    (field) => payload[field] === undefined || payload[field] === null || payload[field] === ''
  );
  if (missing) {
    return `Missing required property: ${missing}.`;
  }

  const invalid = keys.find(
    (key) => !schema.fields[key] || !hasValidType(payload[key], schema.fields[key])
  );
  if (invalid) {
    return `Invalid property: ${invalid}.`;
  }

  if (payload.consent_coc !== true || !payload.consent_coc_version.trim() ||
      !Number.isFinite(Date.parse(payload.consent_coc_at))) {
    return 'Explicit Code of Conduct consent, version and valid timestamp are required.';
  }

  // registrations y speakers guardan el consentimiento de privacidad (Ley 81)
  // con su versión y fecha; ninguno debe llegar al servicio privilegiado sin él.
  if (payload.consent_privacy !== true || !payload.consent_privacy_version.trim() ||
      !Number.isFinite(Date.parse(payload.consent_privacy_at))) {
    return 'Explicit privacy consent, version and valid timestamp are required.';
  }

  if (table === 'registrations') {
    const allowedDays = ['Jueves 22', 'Viernes 23', 'Jueves 22, Viernes 23'];
    const allowedThursdayModes = ['Presencial', 'Google Meet'];
    const attendsThursday = payload.dias.includes('Jueves 22');

    if (!allowedDays.includes(payload.dias) ||
        (attendsThursday && !allowedThursdayModes.includes(payload.thursday_mode)) ||
        (!attendsThursday && payload.thursday_mode !== null)) {
      return 'Valid attendance days and Thursday mode are required.';
    }
  }

  return null;
}

app.disable('x-powered-by');
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    const error = new Error('Origin not allowed.');
    error.status = 403;
    return callback(error);
  },
  methods: ['POST'],
  optionsSuccessStatus: 204
}));
app.use(express.json({ limit: '64kb', type: 'application/json' }));
app.use((error, req, res, next) => {
  if (error.status === 403) {
    return res.status(403).json({ error: 'Origin not allowed.' });
  }
  return next(error);
});

app.get('/_/health', (req, res) => res.json({ ok: true }));

app.post('/submit', async (req, res) => {
  const { table, payload } = req.body || {};
  if (typeof table !== 'string' || !allowedTables.has(table)) {
    return res.status(400).json({ error: 'Invalid submission.' });
  }

  const validationError = validatePayload(table, payload);
  if (validationError) {
    console.warn('Rejected submission:', validationError);
    return res.status(400).json({ error: 'Invalid submission.' });
  }

  try {
    const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${table}`;
    await axios.post(url, [payload], {
      headers: {
        'Content-Type': 'application/json',
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        Prefer: 'return=minimal'
      },
      timeout: 15000
    });
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Submission failed:', err.response?.status || err.code || 'unknown error');
    return res.status(502).json({ error: 'Unable to submit at this time.' });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`local_server listening on http://127.0.0.1:${PORT}`);
});
