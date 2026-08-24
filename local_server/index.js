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
  if (typeof table !== 'string' || !allowedTables.has(table) || !payload || Array.isArray(payload)) {
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
