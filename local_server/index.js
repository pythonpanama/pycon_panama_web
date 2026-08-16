const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 9000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY;

if(!SUPABASE_URL || !SERVICE_ROLE_KEY){
  console.warn('Warning: SUPABASE_URL or SERVICE_ROLE_KEY not set in environment. See .env.example');
}

app.get('/_/health', (req, res) => res.json({ ok: true }));

app.post('/submit', async (req, res) => {
  const { table, payload } = req.body || {};
  if(!table || !payload) return res.status(400).json({ error: 'table and payload required' });
  try{
    const url = `${SUPABASE_URL.replace(/\/$/,'')}/rest/v1/${table}`;
    const body = Array.isArray(payload) ? payload : [payload];
    const r = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation'
      },
      timeout: 15000
    });
    return res.status(r.status).json(r.data);
  }catch(err){
    const status = err.response ? err.response.status : 500;
    const data = err.response ? err.response.data : { message: err.message };
    return res.status(status).json({ error: data });
  }
});

app.listen(PORT, () => console.log(`local_server listening on http://localhost:${PORT}`));
