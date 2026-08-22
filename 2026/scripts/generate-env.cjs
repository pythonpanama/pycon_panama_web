const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.PYCON_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');

  console.error(
    'PYCON_SUPABASE_URL:',
    supabaseUrl ? '✅ configurada' : '❌ faltante'
  );

  console.error(
    'SUPABASE_PUBLISHABLE_KEY:',
    supabaseKey ? '✅ configurada' : '❌ faltante'
  );

  process.exit(1);
}

const envContent = `window.SUPABASE_CONFIG = {
  url: ${JSON.stringify(supabaseUrl)},
  anonKey: ${JSON.stringify(supabaseKey)}
};
`;

const outputPath = path.join(
  process.cwd(),
  '2026',
  'js',
  'env.js'
);

fs.mkdirSync(path.dirname(outputPath), {
  recursive: true
});

fs.writeFileSync(outputPath, envContent, 'utf8');

console.log('✅ env.js generado correctamente');