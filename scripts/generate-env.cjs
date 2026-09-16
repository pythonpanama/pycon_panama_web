#!/usr/bin/env node
/**
 * PyCon Panamá 2026 — Generación de credenciales para el build
 *
 * `2026/js/env.js` está en .gitignore: las credenciales no viven en el repo.
 * En Netlify, este script lo genera a partir de las variables de entorno del
 * proyecto. En local, se copia `2026/js/env.example.js` a mano.
 *
 * Uso: node scripts/generate-env.cjs   (es el build command de netlify.toml)
 *
 * La clave publicable de Supabase es pública por diseño —viaja al navegador de
 * cada visitante— y está protegida por las políticas RLS de la base, no por el
 * secreto. Lo que nunca debe entrar aquí es la service_role key.
 */

const fs = require('fs');
const path = require('path');

// Netlify expone PYCON_SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY; los otros
// nombres son alias tolerados para no romper entornos ya configurados.
const url =
  process.env.PYCON_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  '';

const anonKey =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.PYCON_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  '';

const outputPath = path.join(__dirname, '..', '2026', 'js', 'env.js');

const contents = `/**
 * PyCon Panamá 2026 — Credenciales del cliente
 * Archivo generado por scripts/generate-env.cjs durante el build. No editar a
 * mano ni commitear: los cambios se pierden en el siguiente despliegue.
 */
window.SUPABASE_CONFIG = {
  url: ${JSON.stringify(url)},
  anonKey: ${JSON.stringify(anonKey)}
};
`;

fs.writeFileSync(outputPath, contents, 'utf8');

if (!url || !anonKey) {
  // Sin credenciales fallan los formularios de registro, pero el resto del
  // sitio —incluido el Código de Conducta y su canal de reporte— tiene que
  // publicarse igual. Se avisa fuerte y el build continúa.
  const faltantes = [
    !url && 'PYCON_SUPABASE_URL',
    !anonKey && 'SUPABASE_PUBLISHABLE_KEY',
  ].filter(Boolean);

  console.warn('');
  console.warn('⚠️  ATENCIÓN: faltan variables de entorno: ' + faltantes.join(', '));
  console.warn('⚠️  El sitio se publica, pero los formularios de registro y de');
  console.warn('⚠️  speakers NO van a guardar nada. Configúralas en Netlify:');
  console.warn('⚠️  Site configuration → Environment variables.');
  console.warn('');
} else {
  console.log('✓ 2026/js/env.js generado para ' + url);
}
