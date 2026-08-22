Local proxy to forward form submissions to Supabase using SERVICE_ROLE_KEY

1. Copy `.env.example` to `.env` and set `SUPABASE_URL` and `SERVICE_ROLE_KEY`.
2. Install dependencies:

```bash
cd local_server
npm install
```

3. Start server:

```bash
npm start
```

4. In your form `config.js`, set:

```javascript
window.SUPABASE_CONFIG = {
  secureEndpoint: 'http://localhost:9000/submit'
};
```

Now browser posts go to the local proxy and the proxy uses the `service_role` key to insert into Supabase.
