/**
 * PyCon Panamá 2026 - Integración con Supabase
 * Este módulo gestiona la conexión a la base de datos de Supabase
 * para el registro de asistentes y postulaciones de speakers.
 */

// Reemplaza estos valores con las credenciales de tu proyecto de Supabase
// (Project Settings -> API -> Project URL & anon/public key)
const SUPABASE_URL = window.SUPABASE_URL || 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'tu-anon-key-aqui';

// Inicialización del cliente Supabase
let supabase = null;

function getSupabaseClient() {
  if (!supabase) {
    if (typeof window.supabase === 'undefined') {
      console.error('❌ Supabase SDK no ha sido cargado. Asegúrate de incluir la librería desde CDN.');
      return null;
    }
    if (SUPABASE_URL.includes('tu-proyecto') || SUPABASE_ANON_KEY.includes('tu-anon-key')) {
      console.warn('⚠️ Se están usando credenciales placeholder de Supabase. Recuerda configurar SUPABASE_URL y SUPABASE_ANON_KEY en js/supabase-config.js');
    }
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabase;
}

/**
 * Registra a un asistente a la PyCon Panamá 2026
 * @param {Object} datos - Objeto con { nombre, email, telefono, rol, dias, expectativas }
 * @returns {Promise<{success: boolean, data: any, error: any}>}
 */
async function registrarAsistente(datos) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: new Error('Cliente Supabase no disponible') };
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
    return { success: false, error: err };
  }
}

/**
 * Registra una propuesta de charla de Speaker para la PyCon Panamá 2026
 * @param {Object} datos - Objeto con los datos del speaker y su propuesta
 * @returns {Promise<{success: boolean, data: any, error: any}>}
 */
async function registrarSpeaker(datos) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: new Error('Cliente Supabase no disponible') };
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
    return { success: false, error: err };
  }
}

// Exportar globalmente
window.PyConSupabase = {
  getSupabaseClient,
  registrarAsistente,
  registrarSpeaker,
  SUPABASE_URL,
  SUPABASE_ANON_KEY
};
