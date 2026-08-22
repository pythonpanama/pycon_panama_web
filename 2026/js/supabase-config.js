/**
 * PyCon Panamá 2026 - Integración con Supabase
 * Este módulo gestiona la conexión a la base de datos de Supabase
 * para el registro de asistentes y postulaciones de speakers.
 */

// Credenciales oficiales de Supabase (PyCon Panamá 2026)
var DEFAULT_SUPABASE_URL = 'https://wfiyucykjoohdiazlqbz.supabase.co';
var DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_wlIN6gMmG_pVr-h-MAaLOw_jUyW4pmB';

function getSupabaseUrl() {
  if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) {
    return window.SUPABASE_CONFIG.url;
  }
  return window.SUPABASE_URL || DEFAULT_SUPABASE_URL;
}

function getSupabaseAnonKey() {
  if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) {
    return window.SUPABASE_CONFIG.anonKey;
  }
  return window.SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
}

/**
 * Inicializa o recupera el cliente de Supabase
 */
var _supabaseClientInstance = null;

function getSupabaseClient() {
  if (typeof window.supabase === 'undefined') {
    console.error('❌ Supabase SDK no ha sido cargado. Verifica la etiqueta <script src=".../supabase-js@2"></script>');
    return null;
  }

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!_supabaseClientInstance) {
    try {
      _supabaseClientInstance = window.supabase.createClient(url, key);
      console.log('✅ Conectado a Supabase:', url);
    } catch (err) {
      console.error('❌ Error al inicializar createClient de Supabase:', err);
      return null;
    }
  }

  return _supabaseClientInstance;
}

/**
 * Normaliza y diagnostica los errores devueltos por Supabase
 */
function parseSupabaseError(error) {
  if (!error) return 'Error desconocido en Supabase.';
  
  const msg = error.message || String(error);
  const code = error.code || '';
  
  if (code === '42501' || msg.includes('row-level security')) {
    return 'Error de permisos RLS: Asegúrate de permitir inserciones públicas (INSERT) en Supabase.';
  }

  if (code === 'PGRST301' || msg.includes('does not exist') || msg.includes('relation')) {
    return 'La tabla no existe en Supabase. Revisa las tablas public.registrations y public.speakers.';
  }

  if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
    return 'Error de red o conexión al servidor de Supabase (' + getSupabaseUrl() + ').';
  }

  return 'Error Supabase [' + (code || 'ERR') + ']: ' + msg;
}

/**
 * Registra a un asistente a la PyCon Panamá 2026
 * Tabla objetivo: public.registrations
 * @param {Object} datos - Objeto con { nombre, email, telefono, rol, organizacion, expectativas, consent_photos }
 */
async function registrarAsistente(datos) {
  const client = getSupabaseClient();
  if (!client) {
    const errorMsg = 'No se pudo inicializar el cliente de Supabase (SDK JS no disponible).';
    return { success: false, error: new Error(errorMsg), friendlyMessage: errorMsg };
  }

  try {
    const payload = {
      name: datos.nombre,
      email: datos.email,
      phone: datos.telefono || null,
      role: datos.rol || null,
      organization: datos.organizacion || null,
      accessibility: datos.expectativas || datos.asistencia || null,
      consent_photos: datos.consent_photos !== undefined ? Boolean(datos.consent_photos) : true,
      created_at: new Date().toISOString()
    };

    const { data, error } = await client
      .from('registrations')
      .insert([payload])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error al registrar asistente en Supabase (registrations):', err);
    return { success: false, error: err, friendlyMessage: parseSupabaseError(err) };
  }
}

/**
 * Registra una propuesta de charla de Speaker para la PyCon Panamá 2026
 * Tabla objetivo: public.speakers
 * @param {Object} datos - Objeto con { nombre, email, organizacion, bio, titulo_propuesta, descripcion_propuesta, duracion, idioma, redes_sociales, consent_publication }
 */
async function registrarSpeaker(datos) {
  const client = getSupabaseClient();
  if (!client) {
    const errorMsg = 'No se pudo inicializar el cliente de Supabase (SDK JS no disponible).';
    return { success: false, error: new Error(errorMsg), friendlyMessage: errorMsg };
  }

  try {
    const payload = {
      name: datos.nombre,
      email: datos.email,
      affiliation: datos.organizacion || datos.affiliation || null,
      bio: datos.bio || null,
      title: datos.titulo_propuesta,
      abstract: datos.descripcion_propuesta,
      duration: datos.duracion ? parseInt(datos.duracion) : 30,
      language: datos.idioma || 'Español',
      links: datos.redes_sociales || datos.links || null,
      consent_publication: datos.consent_publication !== undefined ? Boolean(datos.consent_publication) : true,
      created_at: new Date().toISOString()
    };

    const { data, error } = await client
      .from('speakers')
      .insert([payload])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error al registrar speaker en Supabase (speakers):', err);
    return { success: false, error: err, friendlyMessage: parseSupabaseError(err) };
  }
}

// Configuración global del usuario si está definida
window.SUPABASE_CONFIG = {
  url: getSupabaseUrl(),
  anonKey: getSupabaseAnonKey()
};

// Exportar funciones globalmente
window.PyConSupabase = {
  getSupabaseClient,
  registrarAsistente,
  registrarSpeaker,
  parseSupabaseError,
  getSupabaseUrl,
  getSupabaseAnonKey
};
