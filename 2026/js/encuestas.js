/**
 * Encuestas de satisfacción de PyCon Panamá 2026 (asistentes, voluntariado y
 * equipo organizador). Un solo script para las tres páginas: cada formulario
 * declara su audiencia en data-audiencia.
 *
 * Las encuestas son anónimas. Las respuestas se envían a la función
 * submit_pycon_2026_encuesta de Supabase; la tabla no es accesible desde el
 * navegador. Las calificaciones de los aspectos usan el prefijo cal_.
 */
(function () {
  'use strict';

  const form = document.getElementById('surveyForm');
  if (!form) return;

  const audiencia = form.dataset.audiencia;
  const version = form.dataset.version;
  const statusMessage = document.getElementById('statusMessage');
  const btnSubmit = document.getElementById('btnSubmit');
  const thanks = document.getElementById('surveyThanks');
  const sentNote = document.getElementById('yaEnviada');
  const storageKey = 'pycon2026-encuesta-' + audiencia;
  const btnLabel = btnSubmit.querySelector('span') || btnSubmit;
  const submitLabel = btnLabel.textContent;
  const progress = document.getElementById('progreso');
  const progressText = document.getElementById('progresoTexto');
  const progressBox = document.getElementById('surveyProgress');

  // Pasada la fecha de cierre se oculta el formulario. La base rechaza los
  // envíos por su cuenta; esto solo evita que alguien responda en vano.
  const cierre = Date.parse(form.dataset.cierre || '');
  if (!Number.isNaN(cierre) && Date.now() >= cierre) {
    form.hidden = true;
    if (progressBox) progressBox.hidden = true;
    document.querySelector('.survey-intro').hidden = true;
    document.getElementById('encuestaCerrada').hidden = false;
    return;
  }

  // Avance: cada pregunta, fila de la cuadrícula o campo abierto cuenta como
  // una respuesta posible; la cuadrícula completa no cuenta por sí sola.
  const questions = Array.from(form.querySelectorAll('.survey-question:not(.survey-grid), .survey-row'));
  const isAnswered = q => Boolean(q.querySelector('input:checked')) ||
    Array.from(q.querySelectorAll('textarea')).some(t => t.value.trim() !== '');

  function updateProgress() {
    if (!progress) return;
    const total = questions.length;
    const answered = questions.filter(isAnswered).length;
    progress.max = total;
    progress.value = answered;
    progressText.textContent = answered === 0
      ? 'Empieza cuando quieras'
      : answered === total ? '¡Todo respondido!' : `${answered} de ${total} respondidas`;
  }

  form.addEventListener('change', updateProgress);
  form.addEventListener('input', updateProgress);
  updateProgress();

  // Solo es un recordatorio por dispositivo: el almacenamiento puede no existir.
  try {
    if (localStorage.getItem(storageKey) === '1') sentNote.hidden = false;
  } catch (_) { /* sin almacenamiento disponible */ }

  function collect() {
    const respuestas = {};
    for (const el of form.elements) {
      if (!el.name || el.disabled) continue;
      if (el.type === 'radio') {
        if (el.checked) respuestas[el.name] = el.value;
      } else if (el.type === 'checkbox') {
        if (el.checked) (respuestas[el.name] = respuestas[el.name] || []).push(el.value);
      } else if (el.value.trim()) {
        respuestas[el.name] = el.value.trim();
      }
    }
    return respuestas;
  }

  function showError(message, focusTarget) {
    statusMessage.className = 'status-message error';
    statusMessage.textContent = message;
    if (focusTarget) {
      focusTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const first = focusTarget.querySelector('input');
      if (first) first.focus({ preventScroll: true });
    }
  }

  function firstMissing() {
    for (const group of form.querySelectorAll('fieldset[data-required-group]')) {
      if (!group.querySelector('input:checked')) return group;
    }
    const invalid = form.querySelector(':invalid');
    return invalid ? invalid.closest('fieldset') || invalid : null;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (btnSubmit.disabled) return;

    const missing = firstMissing();
    if (missing) {
      const legend = missing.querySelector(':scope > legend');
      const question = legend ? legend.textContent.replace(/\*.*$/, '').trim() : '';
      showError(question ? 'Falta responder: ' + question : 'Revisa las preguntas obligatorias (*).', missing);
      return;
    }

    const respuestas = collect();
    const satisfaccion = Number(respuestas.satisfaccion);
    const recomendacion = Number(respuestas.recomendacion);
    delete respuestas.satisfaccion;
    delete respuestas.recomendacion;

    btnSubmit.disabled = true;
    btnLabel.textContent = 'Enviando…';
    statusMessage.className = 'status-message';
    statusMessage.textContent = 'Enviando tus respuestas…';

    try {
      await window.PyConSupabase.postToSupabaseRest('rpc/submit_pycon_2026_encuesta', {
        p_envio: { audiencia, version, satisfaccion, recomendacion, respuestas }
      });
      try { localStorage.setItem(storageKey, '1'); } catch (_) { /* opcional */ }
      form.hidden = true;
      sentNote.hidden = true;
      document.querySelector('.survey-intro').hidden = true;
      if (progressBox) progressBox.hidden = true;
      thanks.hidden = false;
      thanks.focus();
    } catch (error) {
      console.error('Error al enviar la encuesta:', error);
      // Con código, el servidor la rechazó y no se guardó nada. Sin código no
      // sabemos si llegó; como es anónima, un duplicado ocasional es aceptable.
      showError(error && error.code
        ? 'No pudimos guardar tus respuestas. Revisa el formulario e inténtalo de nuevo.'
        : 'No pudimos enviar tus respuestas. Revisa tu conexión e inténtalo de nuevo en unos minutos.');
      btnSubmit.disabled = false;
      btnLabel.textContent = submitLabel;
    }
  });
})();
