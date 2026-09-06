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
   `payload` debe ser un objeto plano. Para `registrations` y `speakers` el proxy comprueba, antes de llamar a Supabase,
   que solo lleguen las columnas conocidas, con el tipo esperado y con los campos obligatorios presentes; cualquier otra
   propiedad se rechaza con `400`. Si añades una columna al esquema, actualiza `TABLE_SCHEMAS` en `index.js`.

El sitio público actual se conecta con la clave anónima de Supabase mediante `2026/js/env.js`; este proxy no forma parte de su despliegue. Antes de cualquier cambio, valida que las políticas RLS y los nombres de tabla del proyecto de Supabase son los correctos.

### Aceptación del Código de Conducta (#107)

Los envíos a `registrations` y `speakers` requieren `consent_coc: true`,
`consent_coc_version` (texto no vacío) y `consent_coc_at` (fecha válida).
Antes de desplegar los formularios, aplicar como administrador la migración local
`docs-internas/referencia/supabase/107_aceptacion_codigo_conducta.sql`.
Ese archivo está excluido de Git y del sitio publicado; debe transferirse por la
vía administrativa privada. Añade columnas sin atribuir aceptación a registros
históricos ni cambiar permisos o políticas RLS.

Verificar tipos de columnas y conteos antes y después, y probar ambos formularios
con una base aislada antes del despliegue. La migración preparada no implica que
ya esté aplicada en producción. Mantener `COC_VERSION` sincronizada con el Código
publicado: actualmente `1.0`; cambiarla al publicar una nueva versión del texto.

Pruebas de consentimiento desde la raíz: `node --test tests/consent-coc.cjs`.
