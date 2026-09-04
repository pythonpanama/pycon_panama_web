/**
 * PyCon Panamá 2026 - Integración con Base de Datos (Supabase REST API)
 * Este módulo gestiona la conexión para el registro de asistentes y speakers.
 * Incluye envío nativo REST fetch y SDK para máxima compatibilidad en navegadores.
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

/**
 * Función de envío directo HTTP REST API hacia Supabase (Fail-Safe)
 */
async function postToSupabaseRest(table, payload) {
  const url = getSupabaseUrl() + '/rest/v1/' + table;
  const key = getSupabaseAnonKey();

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json',
      // El navegador no debe recibir una copia del registro que acaba de crear.
      // Además de minimizar datos expuestos, esto permite que RLS bloquee SELECT.
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return null;
}

/**
 * Registra a un asistente a la PyCon Panamá 2026
 * Tabla: public.registrations
 */
async function registrarAsistente(datos) {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    return {
      success: false,
      friendlyMessage: 'Error de configuración: Faltan las credenciales de conexión.'
    };
  }

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
    dias: Array.isArray(datos.dias) ? datos.dias.join(', ') : (datos.dias || null),
    expectativas: datos.expectativas || null,
    accessibility: extraAccessibility.length ? extraAccessibility.join(' | ') : null,
    consent_photos: datos.consent_photos !== undefined ? Boolean(datos.consent_photos) : true,
    created_at: new Date().toISOString()
  };

  console.log('📤 Enviando registro de asistente a public.registrations');

  // Intentar primero vía SDK Supabase si está disponible
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    try {
      const client = window.supabase.createClient(url, key);
      const { error } = await client.from('registrations').insert([payload]);
      if (!error) {
        console.log('✅ Registro de asistente guardado');
        return { success: true };
      }
      if (error) console.warn('⚠️ SDK falló, intentando envío directo REST API...', error);
    } catch (e) {
      console.warn('⚠️ Excepción en SDK, intentando envío directo REST API...', e);
    }
  }

  // Fallback seguro: Envío HTTP REST directo
  try {
    await postToSupabaseRest('registrations', payload);
    console.log('✅ Registro de asistente guardado');
    return { success: true };
  } catch (err) {
    console.error('❌ Error al registrar asistente:', err);
    return {
      success: false,
      error: err,
      friendlyMessage: 'Ocurrió un error al guardar tu registro: ' + (err.message || String(err))
    };
  }
}

/**
 * Registra una propuesta de charla de Speaker para la PyCon Panamá 2026
 * Tabla: public.speakers
 */
async function registrarSpeaker(datos) {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    return {
      success: false,
      friendlyMessage: 'Error de configuración: Faltan las credenciales de conexión.'
    };
  }

  const metadata = [];
  if (datos.nivel) metadata.push('Nivel: ' + datos.nivel);
  if (datos.modalidad) metadata.push('Modalidad: ' + datos.modalidad);

  const formattedAbstract = metadata.length
    ? '[' + metadata.join(' | ') + ']\n\n' + datos.descripcion_propuesta
    : datos.descripcion_propuesta;

  const payload = {
    name: datos.nombre,
    email: datos.email,
    phone: datos.telefono || null,
    affiliation: datos.organizacion || datos.affiliation || null,
    // El teléfono se conserva únicamente en su columna propia; no se duplica en la biografía.
    bio: datos.bio || null,
    title: datos.titulo_propuesta,
    abstract: formattedAbstract,
    nivel: datos.nivel || null,
    modalidad: datos.modalidad || null,
    duration: datos.duracion ? parseInt(datos.duracion) : 30,
    language: datos.idioma || 'Español',
    links: datos.redes_sociales || datos.links || null,
    consent_publication: datos.consent_publication !== undefined ? Boolean(datos.consent_publication) : true,
    created_at: new Date().toISOString()
  };

  console.log('📤 Enviando propuesta a public.speakers');

  // Intentar primero vía SDK Supabase si está disponible
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    try {
      const client = window.supabase.createClient(url, key);
      const { error } = await client.from('speakers').insert([payload]);
      if (!error) {
        console.log('✅ Propuesta de speaker guardada');
        return { success: true };
      }
      if (error) console.warn('⚠️ SDK falló, intentando envío directo REST API...', error);
    } catch (e) {
      console.warn('⚠️ Excepción en SDK, intentando envío directo REST API...', e);
    }
  }

  // Fallback seguro: Envío HTTP REST directo
  try {
    await postToSupabaseRest('speakers', payload);
    console.log('✅ Propuesta de speaker guardada');
    return { success: true };
  } catch (err) {
    console.error('❌ Error al registrar speaker:', err);
    return {
      success: false,
      error: err,
      friendlyMessage: 'Ocurrió un error al enviar tu propuesta: ' + (err.message || String(err))
    };
  }
}

// Exportar funciones globalmente
window.PyConSupabase = {
  registrarAsistente,
  registrarSpeaker,
  postToSupabaseRest
};
