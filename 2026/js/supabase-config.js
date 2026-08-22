/**
 * PyCon Panamá 2026 - Integración con Supabase
 * Este módulo gestiona la conexión a la base de datos de Supabase
 * para el registro de asistentes y postulaciones de speakers.
 */

// Configuración por defecto. Puedes ingresar tus credenciales reales aquí
// o asignarlas globalmente como window.SUPABASE_URL y window.SUPABASE_ANON_KEY
var DEFAULT_SUPABASE_URL = 'https://tu-proyecto.supabase.co';
var DEFAULT_SUPABASE_ANON_KEY = 'tu-anon-key-aqui';

function getSupabaseUrl() {
  return window.SUPABASE_URL || DEFAULT_SUPABASE_URL;
}

function getSupabaseAnonKey() {
  return window.SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
}

/**
 * Verifica si las credenciales actuales son placeholders
 */
function isPlaceholderConfig() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return !url || !key || url.includes('tu-proyecto') || key.includes('tu-anon-key');
}

/**
 * Obtiene o crea la instancia del cliente Supabase
 */
function getSupabaseClient() {
  if (typeof window.supabase === 'undefined') {
    console.error('❌ Supabase SDK no ha sido cargado. Verifica la etiqueta <script src=".../supabase-js@2"></script>');
    return null;
  }

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (isPlaceholderConfig()) {
    console.warn('⚠️ Se están usando credenciales placeholder de Supabase. Configura SUPABASE_URL y SUPABASE_ANON_KEY en js/supabase-config.js');
  }

  try {
    return window.supabase.createClient(url, key);
  } catch (err) {
    console.error('❌ Error al inicializar createClient de Supabase:', err);
    return null;
  }
}

/**
 * Normaliza y diagnostica los errores devueltos por Supabase
 */
function parseSupabaseError(error) {
  if (!error) return 'Error desconocido en Supabase.';
  
  const msg = error.message || String(error);
  const code = error.code || '';

  if (isPlaceholderConfig()) {
    return 'Falta configurar credenciales: Reemplaza SUPABASE_URL y SUPABASE_ANON_KEY en 2026/js/supabase-config.js con las de tu proyecto en Supabase.';
  }
  
  if (code === '42501' || msg.includes('row-level security')) {
    return 'Error de permisos RLS: Ejecuta el script SQL en 2026/supabase_schema.sql en tu consola de Supabase para permitir inserciones públicas.';
  }

  if (code === 'PGRST301' || msg.includes('does not exist') || msg.includes('relation')) {
    return 'La tabla no existe en Supabase: Ejecuta el script 2026/supabase_schema.sql en el SQL Editor de tu proyecto Supabase.';
  }

  if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
    return 'Error de conexión a internet o la URL de Supabase es inválida (' + getSupabaseUrl() + ').';
  }

  return 'Error de Supabase [' + (code || 'ERR') + ']: ' + msg;
}

/**
 * Registra a un asistente a la PyCon Panamá 2026
 * @param {Object} datos - Objeto con { nombre, email, telefono, rol, dias, expectativas }
 */
async function registrarAsistente(datos) {
  if (isPlaceholderConfig()) {
    const errorMsg = 'Configura SUPABASE_URL y SUPABASE_ANON_KEY en 2026/js/supabase-config.js con tu URL y anon/public key de Supabase.';
    console.error('❌', errorMsg);
    return { success: false, error: new Error(errorMsg), friendlyMessage: errorMsg };
  }

  const client = getSupabaseClient();
  if (!client) {
    const errorMsg = 'No se pudo cargar el cliente de Supabase (SDK JS no disponible).';
    return { success: false, error: new Error(errorMsg), friendlyMessage: errorMsg };
  }

  try {
    const payload = {
      nombre: datos.nombre,
      email: datos.email,
      telefono: datos.telefono || null,
      rol: datos.rol || null,
      dias: Array.isArray(datos.dias) ? datos.dias.join(', ') : (datos.dias || ''),
      expectativas: datos.expectativas || null,
      creado_en: new Date().toISOString()
    };

    const { data, error } = await client
      .from('asistentes_2026')
      .insert([payload])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error al registrar asistente en Supabase:', err);
    return { success: false, error: err, friendlyMessage: parseSupabaseError(err) };
  }
}

/**
 * Registra una propuesta de charla de Speaker para la PyCon Panamá 2026
 * @param {Object} datos - Objeto con los datos del speaker y su propuesta
 */
async function registrarSpeaker(datos) {
  if (isPlaceholderConfig()) {
    const errorMsg = 'Configura SUPABASE_URL y SUPABASE_ANON_KEY en 2026/js/supabase-config.js con tu URL y anon/public key de Supabase.';
    console.error('❌', errorMsg);
    return { success: false, error: new Error(errorMsg), friendlyMessage: errorMsg };
  }

  const client = getSupabaseClient();
  if (!client) {
    const errorMsg = 'No se pudo cargar el cliente de Supabase (SDK JS no disponible).';
    return { success: false, error: new Error(errorMsg), friendlyMessage: errorMsg };
  }

  try {
    const payload = {
      nombre: datos.nombre,
      email: datos.email,
      telefono: datos.telefono || null,
      organizacion: datos.organizacion || null,
      bio: datos.bio || null,
      titulo_propuesta: datos.titulo_propuesta,
      descripcion_propuesta: datos.descripcion_propuesta,
      nivel: datos.nivel || 'Todos',
      modalidad: datos.modalidad || 'Indiferente',
      redes_sociales: datos.redes_sociales || null,
      creado_en: new Date().toISOString()
    };

    const { data, error } = await client
      .from('speakers_2026')
      .insert([payload])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error al registrar speaker en Supabase:', err);
    return { success: false, error: err, friendlyMessage: parseSupabaseError(err) };
  }
}

// Exportar globalmente
window.PyConSupabase = {
  getSupabaseClient,
  registrarAsistente,
  registrarSpeaker,
  parseSupabaseError,
  isPlaceholderConfig,
  getSupabaseUrl,
  getSupabaseAnonKey
};
