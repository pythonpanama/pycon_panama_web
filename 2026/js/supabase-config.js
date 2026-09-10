/**
 * PyCon Panamá 2026 - Integración con Base de Datos (Supabase REST API)
 * Este módulo gestiona la conexión para asistentes, ponentes y voluntariado.
 * Incluye envío nativo REST fetch y SDK para máxima compatibilidad en navegadores.
 */

// Debe coincidir con la versión publicada en codigo_conducta.html.
var COC_VERSION = '1.1';
var PRIVACY_VERSION = '1.1';

var DEFAULT_SUPABASE_URL = 'https://wfiyucykjoohdiazlqbz.supabase.co';
var DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_wlIN6gMmG_pVr-h-MAaLOw_jUyW4pmB';

// Cuando no se sabe si la escritura se confirmó, no se reintenta sola: pedimos
// verificación humana para no crear un registro duplicado.
var MENSAJE_RESULTADO_DESCONOCIDO = 'No pudimos confirmar si tu envío quedó guardado. Escríbenos a pyconpanama@gmail.com antes de intentarlo otra vez para no duplicar tu registro.';

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
 * El consentimiento solo cuenta como otorgado cuando llega el booleano true.
 * Boolean() convertiría en afirmativos valores como "false", "0" o "no", y un
 * campo ausente nunca debe registrarse como autorización concedida.
 */
function consentimientoOtorgado(valor) {
  return valor === true;
}

/**
 * Distingue un rechazo definitivo del servidor de un resultado desconocido.
 * PostgREST acompaña sus rechazos con un código de error, así que la fila no
 * llegó a escribirse y reintentar es seguro. Sin código (fallo de red o de
 * transporte) el INSERT pudo haberse confirmado igualmente: repetirlo
 * duplicaría el registro, por lo que se detiene el envío.
 */
function servidorRechazoDefinitivamente(error) {
  return Boolean(error) && typeof error.code === 'string' && error.code.trim() !== '';
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
    const responseError = new Error(`HTTP ${response.status}: ${errorText}`);
    try {
      const parsedError = JSON.parse(errorText);
      responseError.code = parsedError.code;
    } catch (_) {
      // Una respuesta que no sea JSON conserva el mensaje HTTP completo.
    }
    throw responseError;
  }

  return null;
}

function faltanColumnasRegistro(error) {
  const message = String(error && error.message ? error.message : error || '');
  return Boolean(error) && (
    error.code === 'PGRST204' ||
    error.code === '42703' ||
    (
      /(thursday_mode|consent_privacy)/.test(message) &&
      /(does not exist|schema cache|could not find)/i.test(message)
    )
  );
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

  // El formulario exige marcar la casilla; aquí se comprueba de nuevo para que
  // ningún otro consumidor del módulo pueda guardar un consentimiento supuesto.
  if (!consentimientoOtorgado(datos.consent_coc)) {
    return { success: false, friendlyMessage: 'Debes aceptar el Código de Conducta antes de enviar el formulario.' };
  }

  if (!consentimientoOtorgado(datos.consent_privacy)) {
    return {
      success: false,
      friendlyMessage: 'Debes aceptar el Aviso de Privacidad antes de enviar el formulario.'
    };
  }

  const allowedDays = ['Jueves 22', 'Viernes 23'];
  if (!Array.isArray(datos.dias) || datos.dias.length === 0 ||
      datos.dias.some(day => !allowedDays.includes(day))) {
    return { success: false, friendlyMessage: 'Selecciona al menos un día válido para asistir.' };
  }

  const attendsThursday = datos.dias.includes('Jueves 22');
  const allowedThursdayModes = ['Presencial', 'Google Meet'];
  if (attendsThursday && !allowedThursdayModes.includes(datos.modalidad_jueves)) {
    return { success: false, friendlyMessage: 'Indica cómo participarás el jueves 22.' };
  }

  const consentTimestamp = new Date().toISOString();
  const createdAt = new Date().toISOString();
  const payload = {
    name: datos.nombre,
    email: datos.email,
    phone: datos.telefono || null,
    role: datos.rol || null,
    organization: datos.organizacion || null,
    dias: datos.dias.join(', '),
    thursday_mode: attendsThursday ? datos.modalidad_jueves : null,
    expectativas: datos.expectativas || null,
    accessibility: datos.accesibilidad || null,
    consent_privacy: true,
    consent_privacy_version: PRIVACY_VERSION,
    consent_privacy_at: consentTimestamp,
    consent_coc: true,
    consent_coc_version: COC_VERSION,
    consent_coc_at: consentTimestamp,
    created_at: createdAt
  };

  // Compatibilidad temporal hasta que Supabase tenga las columnas del esquema
  // nuevo. Solo se usa cuando PostgREST confirma que faltan esas columnas, un
  // rechazo definitivo que garantiza que `payload` no llegó a insertarse.
  const legacyPayload = {
    name: datos.nombre,
    email: datos.email,
    phone: datos.telefono || null,
    role: datos.rol || null,
    organization: datos.organizacion || null,
    dias: datos.dias.map(day => day === 'Jueves 22'
      ? 'Jueves 22 (' + datos.modalidad_jueves + ')'
      : day).join(', '),
    expectativas: datos.expectativas || null,
    accessibility: datos.accesibilidad || null,
    consent_photos: true,
    consent_coc: true,
    consent_coc_version: COC_VERSION,
    consent_coc_at: consentTimestamp,
    created_at: createdAt
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
      if (faltanColumnasRegistro(error)) {
        await postToSupabaseRest('registrations', legacyPayload);
        console.warn('Registro guardado con el esquema anterior; falta aplicar la migración de asistentes.');
        return { success: true, legacySchema: true };
      }
      if (!servidorRechazoDefinitivamente(error)) {
        console.error('❌ Resultado desconocido al registrar asistente; no se reintenta:', error);
        return { success: false, error, friendlyMessage: MENSAJE_RESULTADO_DESCONOCIDO };
      }
      console.warn('⚠️ El servidor rechazó el INSERT del SDK, intentando envío directo REST API...', error);
    } catch (e) {
      // Una excepción deja el resultado en el aire: el INSERT pudo confirmarse.
      console.error('❌ Excepción en el SDK al registrar asistente; no se reintenta:', e);
      return { success: false, error: e, friendlyMessage: MENSAJE_RESULTADO_DESCONOCIDO };
    }
  }

  // Fallback seguro: Envío HTTP REST directo, sin reintentos posteriores
  try {
    await postToSupabaseRest('registrations', payload);
    console.log('✅ Registro de asistente guardado');
    return { success: true };
  } catch (err) {
    if (faltanColumnasRegistro(err)) {
      try {
        await postToSupabaseRest('registrations', legacyPayload);
        console.warn('Registro guardado con el esquema anterior; falta aplicar la migración de asistentes.');
        return { success: true, legacySchema: true };
      } catch (legacyError) {
        err = legacyError;
      }
    }
    console.error('❌ Error al registrar asistente:', err);
    return {
      success: false,
      error: err,
      friendlyMessage: 'Ocurrió un error al guardar tu registro. Vuelve a intentarlo en unos minutos o escríbenos a pyconpanama@gmail.com.'
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

  if (!consentimientoOtorgado(datos.consent_coc)) {
    return { success: false, friendlyMessage: 'Debes aceptar el Código de Conducta antes de enviar el formulario.' };
  }

  if (!consentimientoOtorgado(datos.consent_publication)) {
    return {
      success: false,
      friendlyMessage: 'Necesitamos tu autorización explícita para publicar la propuesta antes de enviarla.'
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
    consent_publication: true,
    consent_coc: true,
    consent_coc_version: COC_VERSION,
    consent_coc_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  };

  console.log('📤 Enviando propuesta a public.speakers');

  // Intentar primero vía SDK Supabase si está disponible
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    try {
      const client = window.supabase.createClient(url, key);
      const { error } = await client.from('speakers').insert([payload]);
      if (!error) {
        console.log('✅ Propuesta de ponente guardada');
        return { success: true };
      }
      if (!servidorRechazoDefinitivamente(error)) {
        console.error('❌ Resultado desconocido al registrar la propuesta; no se reintenta:', error);
        return { success: false, error, friendlyMessage: MENSAJE_RESULTADO_DESCONOCIDO };
      }
      console.warn('⚠️ El servidor rechazó el INSERT del SDK, intentando envío directo REST API...', error);
    } catch (e) {
      console.error('❌ Excepción en el SDK al registrar la propuesta; no se reintenta:', e);
      return { success: false, error: e, friendlyMessage: MENSAJE_RESULTADO_DESCONOCIDO };
    }
  }

  // Fallback seguro: Envío HTTP REST directo, sin reintentos posteriores
  try {
    await postToSupabaseRest('speakers', payload);
    console.log('✅ Propuesta de ponente guardada');
    return { success: true };
  } catch (err) {
    console.error('❌ Error al registrar ponente:', err);
    return {
      success: false,
      error: err,
      friendlyMessage: 'Ocurrió un error al enviar tu propuesta. Vuelve a intentarlo en unos minutos o escríbenos a pyconpanama@gmail.com.'
    };
  }
}

/**
 * Registra una postulación de voluntariado mediante una función transaccional.
 * Las tablas centrales no se exponen directamente a los roles del navegador.
 */
async function registrarVoluntariado(datos) {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    return {
      success: false,
      friendlyMessage: 'Error de configuración: faltan las credenciales de conexión.'
    };
  }

  if (!consentimientoOtorgado(datos.consent_coc)) {
    return { success: false, friendlyMessage: 'Debes aceptar el Código de Conducta antes de enviar el formulario.' };
  }
  if (!consentimientoOtorgado(datos.consent_privacy)) {
    return { success: false, friendlyMessage: 'Debes aceptar el Aviso de Privacidad antes de enviar el formulario.' };
  }
  if (!Array.isArray(datos.roles) || datos.roles.length === 0) {
    return { success: false, friendlyMessage: 'Selecciona al menos un área en la que deseas colaborar.' };
  }
  if (!Array.isArray(datos.availability) || datos.availability.length === 0) {
    return { success: false, friendlyMessage: 'Selecciona al menos un momento en el que puedas colaborar.' };
  }
  if (!datos.experiencia || datos.experiencia.trim().length < 5) {
    return { success: false, friendlyMessage: 'Describe brevemente tu experiencia o habilidades relevantes.' };
  }
  if (!datos.motivacion || datos.motivacion.trim().length < 5) {
    return { success: false, friendlyMessage: 'Cuéntanos brevemente por qué deseas apoyar PyCon Panamá.' };
  }
  if (!datos.accesibilidad || datos.accesibilidad.trim().length < 2) {
    return { success: false, friendlyMessage: 'Indica si necesitas algún ajuste para colaborar.' };
  }

  const payload = {
    p_submission: {
      name: datos.nombre,
      email: datos.email,
      phone: datos.telefono || null,
      city: datos.ciudad || null,
      province: datos.provincia || null,
      initiative: 'pycon_panama',
      edition: '2026',
      source_site: 'pycon.pa',
      roles: datos.roles,
      availability: datos.availability,
      experience: datos.experiencia || null,
      motivation: datos.motivacion || null,
      accessibility: datos.accesibilidad || null,
      consent_privacy: true,
      consent_privacy_version: PRIVACY_VERSION,
      consent_privacy_at: new Date().toISOString(),
      consent_coc: true,
      consent_coc_version: COC_VERSION,
      consent_coc_at: new Date().toISOString()
    }
  };

  try {
    await postToSupabaseRest('rpc/submit_pycon_2026_volunteer_application', payload);
    return { success: true };
  } catch (err) {
    console.error('Error al registrar voluntariado:', err);
    return {
      success: false,
      error: err,
      friendlyMessage: 'No pudimos guardar tu postulación. Inténtalo nuevamente en unos minutos o escríbenos a pyconpanama@gmail.com.'
    };
  }
}

// Exportar funciones globalmente
window.PyConSupabase = {
  COC_VERSION,
  PRIVACY_VERSION,
  registrarAsistente,
  registrarSpeaker,
  registrarVoluntariado,
  postToSupabaseRest
};
