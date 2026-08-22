/**
 * PyCon Panamá 2026 - Integración con Base de Datos
 * Este módulo gestiona la conexión para el registro de asistentes y speakers.
 */

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

var _supabaseClientInstance = null;

function getSupabaseClient() {
  if (typeof window.supabase === 'undefined') {
    console.error('❌ Supabase SDK JS no disponible.');
    return null;
  }

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!_supabaseClientInstance) {
    try {
      _supabaseClientInstance = window.supabase.createClient(url, key);
      console.log('✅ Cliente Supabase listo:', url);
    } catch (err) {
      console.error('❌ Error al inicializar Supabase:', err);
      return null;
    }
  }

  return _supabaseClientInstance;
}

/**
 * Registra a un asistente a la PyCon Panamá 2026
 * Tabla: public.registrations
 */
async function registrarAsistente(datos) {
  const client = getSupabaseClient();
  if (!client) {
    return { 
      success: false, 
      friendlyMessage: 'Error de cliente: No se pudo conectar con Supabase SDK (verifica conexión a internet).' 
    };
  }

  try {
    const payload = {
      name: datos.nombre,
      email: datos.email,
      phone: datos.telefono || null,
      role: datos.rol || null,
      organization: datos.organizacion || null,
      dias: Array.isArray(datos.dias) ? datos.dias.join(', ') : (datos.dias || null),
      expectativas: datos.expectativas || null,
      accessibility: datos.expectativas || null,
      consent_photos: datos.consent_photos !== undefined ? Boolean(datos.consent_photos) : true,
      created_at: new Date().toISOString()
    };

    console.log('📤 Enviando registro a Supabase (public.registrations):', payload);

    const { data, error } = await client
      .from('registrations')
      .insert([payload])
      .select();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      throw error;
    }

    console.log('✅ Registro insertado exitosamente:', data);
    return { success: true, data };
  } catch (err) {
    console.error('❌ Error al registrar asistente:', err);
    return { 
      success: false, 
      error: err, 
      friendlyMessage: 'Error en Supabase [' + (err.code || 'ERR') + ']: ' + (err.message || String(err)) 
    };
  }
}

/**
 * Registra una propuesta de charla de Speaker para la PyCon Panamá 2026
 * Tabla: public.speakers
 */
async function registrarSpeaker(datos) {
  const client = getSupabaseClient();
  if (!client) {
    return { 
      success: false, 
      friendlyMessage: 'Error de cliente: No se pudo conectar con Supabase SDK (verifica conexión a internet).' 
    };
  }

  try {
    const payload = {
      name: datos.nombre,
      email: datos.email,
      phone: datos.telefono || null,
      affiliation: datos.organizacion || datos.affiliation || null,
      bio: datos.bio || null,
      title: datos.titulo_propuesta,
      abstract: datos.descripcion_propuesta,
      nivel: datos.nivel || null,
      modalidad: datos.modalidad || null,
      duration: datos.duracion ? parseInt(datos.duracion) : 30,
      language: datos.idioma || 'Español',
      links: datos.redes_sociales || datos.links || null,
      consent_publication: datos.consent_publication !== undefined ? Boolean(datos.consent_publication) : true,
      created_at: new Date().toISOString()
    };

    console.log('📤 Enviando speaker a Supabase (public.speakers):', payload);

    const { data, error } = await client
      .from('speakers')
      .insert([payload])
      .select();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      throw error;
    }

    console.log('✅ Speaker insertado exitosamente:', data);
    return { success: true, data };
  } catch (err) {
    console.error('❌ Error al registrar speaker:', err);
    return { 
      success: false, 
      error: err, 
      friendlyMessage: 'Error en Supabase [' + (err.code || 'ERR') + ']: ' + (err.message || String(err)) 
    };
  }
}

// Exportar funciones globalmente
window.PyConSupabase = {
  getSupabaseClient,
  registrarAsistente,
  registrarSpeaker
};
