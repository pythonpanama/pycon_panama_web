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
    console.warn('⚠️ Credenciales no configuradas. Revisa 2026/js/env.js');
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
 * Tabla: public.registrations
 * Campos: name, email, organization, role, accessibility, phone, consent_photos
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
    // Formatear accesibilidad compilando días y expectativas
    const extraAccessibility = [];
    if (datos.dias && datos.dias.length) {
      extraAccessibility.push('Días de asistencia: ' + (Array.isArray(datos.dias) ? datos.dias.join(', ') : datos.dias));
    }
    if (datos.expectativas) {
      extraAccessibility.push('Expectativas: ' + datos.expectativas);
    }

    const payload = {
      name: datos.nombre,
      email: datos.email,
      phone: datos.telefono || null,
      role: datos.rol || null,
      organization: datos.organizacion || null,
      accessibility: extraAccessibility.length ? extraAccessibility.join(' | ') : null,
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
    console.error('❌ Error en registro de asistente (registrations):', err);
    return { 
      success: false, 
      error: err, 
      friendlyMessage: 'Ocurrió un inconveniente al procesar tu registro. Por favor intenta de nuevo en unos minutos.' 
    };
  }
}

/**
 * Registra una propuesta de charla de Speaker para la PyCon Panamá 2026
 * Tabla: public.speakers
 * Campos: name, email, affiliation, bio, title, abstract, duration, language, links, consent_publication
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
    // Formatear abstract incluyendo nivel y modalidad elegida
    const metadata = [];
    if (datos.nivel) metadata.push('Nivel: ' + datos.nivel);
    if (datos.modalidad) metadata.push('Modalidad: ' + datos.modalidad);

    const formattedAbstract = metadata.length 
      ? '[' + metadata.join(' | ') + ']\n\n' + datos.descripcion_propuesta
      : datos.descripcion_propuesta;

    // Formatear bio incluyendo teléfono si fue provisto
    const formattedBio = datos.telefono 
      ? (datos.bio ? datos.bio + ' (Tel: ' + datos.telefono + ')' : 'Tel: ' + datos.telefono)
      : (datos.bio || null);

    const payload = {
      name: datos.nombre,
      email: datos.email,
      affiliation: datos.organizacion || datos.affiliation || null,
      bio: formattedBio,
      title: datos.titulo_propuesta,
      abstract: formattedAbstract,
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
    console.error('❌ Error en registro de speaker (speakers):', err);
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
