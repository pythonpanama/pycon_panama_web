## Proxy local de desarrollo para Supabase

Este proxy es **solo para desarrollo local**. Usa una clave `SERVICE_ROLE_KEY`, que el navegador y Netlify nunca deben recibir. Escucha exclusivamente en `127.0.0.1` y restringe tanto los orígenes como las tablas permitidas.

No lo publiques, no lo despliegues en Netlify y no copies su `.env` a ningún sistema de control de versiones.

1. Copia `.env.example` a `.env` y define `SUPABASE_URL`, `SERVICE_ROLE_KEY`, `ALLOWED_ORIGINS` y `ALLOWED_TABLES`. La lista de tablas debe coincidir con el esquema real de Supabase.
2. Instala las dependencias:

```bash
cd local_server
npm install
```

3. Inicia el servidor:

```bash
npm start
```

4. Comprueba que está disponible solo localmente:

```bash
curl http://127.0.0.1:9000/_/health
```

5. Úsalo únicamente desde un formulario local que envíe JSON con `table` y `payload` a `http://127.0.0.1:9000/submit`.

El sitio público actual se conecta con la clave anónima de Supabase mediante `2026/js/env.js`; este proxy no forma parte de su despliegue. Antes de cualquier cambio, valida que las políticas RLS y los nombres de tabla del proyecto de Supabase son los correctos.
