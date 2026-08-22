/**
 * PyCon Panamá 2026 - Integración con Base de Datos
 * Este módulo gestiona la conexión para el registro de asistentes y speakers.
 * Las credenciales se leen desde window.SUPABASE_CONFIG (definidas en env.js)
 */

function getSupabaseUrl() {
  if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) {
    return window.SUPABASE_CONFIG.url;
  }
  return window.SUPABASE_URL || '';
}

function getSupabaseAnonKey() {
  if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) {
    return window.SUPABASE_CONFIG.anonKey;
  }
  return window.SUPABASE_ANON_KEY || '';
}

var _supabaseClientInstance = null;

function getSupabaseClient() {
  if (typeof window.supabase === 'undefined') {
    console.error('❌ SDK no disponible.');
    return null;
  }

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key || url.includes('tu-proyecto')) {
    console.warn('⚠️ Credenciales no configuradas. Crea 2026/js/env.js basándote en env.example.js');
  }

  if (!_supabaseClientInstance) {
    try {
      _supabaseClientInstance = window.supabase.createClient(url, key);
    } catch (err) {
      console.error('❌ Error al crear cliente:', err);
      return null;
    }
  }

  return _supabaseClientInstance;
}

/**
 * Registra a un asistente a la PyCon Panamá 2026
 * @param {Object} datos - Objeto con los datos del registro
 */
async function registrarAsistente(datos) {
  const client = getSupabaseClient();
  if (!client) {
    console.error('❌ Cliente no disponible.');
    return { 
      success: false, 
      friendlyMessage: 'No se pudo procesar tu solicitud en este momento. Por favor intenta más tarde.' 
    };
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
    console.error('❌ Error en registro de asistente:', err);
    return { 
      success: false, 
      error: err, 
      friendlyMessage: 'Ocurrió un inconveniente al procesar tu registro. Por favor intenta de nuevo en unos minutos.' 
    };
  }
}

/**
 * Registra una propuesta de charla de Speaker para la PyCon Panamá 2026
 * @param {Object} datos - Objeto con los datos del speaker
 */
async function registrarSpeaker(datos) {
  const client = getSupabaseClient();
  if (!client) {
    console.error('❌ Cliente no disponible.');
    return { 
      success: false, 
      friendlyMessage: 'No se pudo procesar tu solicitud en este momento. Por favor intenta más tarde.' 
    };
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
    console.error('❌ Error en registro de speaker:', err);
    return { 
      success: false, 
      error: err, 
      friendlyMessage: 'Ocurrió un inconveniente al enviar tu propuesta. Por favor intenta de nuevo en unos minutos.' 
    };
  }
}

// Exportar funciones globalmente
window.PyConSupabase = {
  getSupabaseClient,
  registrarAsistente,
  registrarSpeaker
};
