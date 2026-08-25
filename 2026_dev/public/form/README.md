Instrucciones rápidas para integrar con Supabase

1. En Supabase crea un proyecto y añade dos tablas: `speakers` y `registrations` con columnas que coincidan con los campos del formulario (por ejemplo: name, email, affiliation, bio, title, abstract, duration, language, links, consent para speakers; name, email, organization, role, diet, accessibility, phone, consent_photos para registrations).
2. Habilita CORS para tu dominio en Supabase.
3. Copia `config.example.js` a `config.js` y rellena `url` y `anonKey`.
4. Despliega la carpeta `public/` en tu host (Netlify/Vercel/Netlify Functions). Las páginas estarán disponibles en `/form/speaker.html` y `/form/registro.html`.
5. Verifica en Supabase que los inserts funcionan; revisa la tabla y los registros.

Notas de seguridad: el `anonKey` es la clave pública pensada para operaciones cliente (inserciones públicas). Para acciones sensibles, crea endpoints server-side.
