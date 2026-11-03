/**
 * Encuestas de satisfacción de PyCon Panamá 2026 (asistentes, personas
 * registradas que no asistieron, voluntariado y equipo organizador). Un solo
 * script para las cuatro páginas: cada formulario
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

  // Primera pregunta obligatoria sin responder dentro de scope (el formulario
  // completo o una sola parte).
  function firstMissing(scope) {
    for (const group of scope.querySelectorAll('fieldset[data-required-group]')) {
      if (!group.querySelector('input:checked')) return group;
    }
    const invalid = scope.querySelector(':invalid');
    return invalid ? invalid.closest('fieldset') || invalid : null;
  }

  function missingMessage(missing) {
    const legend = missing.querySelector(':scope > legend');
    const question = legend ? legend.textContent.replace(/\*.*$/, '').trim() : '';
    return question ? 'Falta responder: ' + question : 'Revisa las preguntas obligatorias (*).';
  }

  // --- Una parte a la vez ---------------------------------------------------
  // Cada <section class="survey-block"> es un paso. Sin JavaScript se ven
  // todas juntas (y tampoco se podría enviar), así que esto solo ordena la
  // lectura: arriba un índice de partes y abajo «Anterior» / «Siguiente».
  const blocks = Array.from(form.querySelectorAll('.survey-block'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const steps = blocks.length > 1 ? buildSteps() : null;

  function makeButton(className, icon, label, iconFirst) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    const i = document.createElement('i');
    i.className = 'fa-solid ' + icon;
    i.setAttribute('aria-hidden', 'true');
    const span = document.createElement('span');
    span.textContent = label;
    if (iconFirst) btn.append(i, ' ', span); else btn.append(span, ' ', i);
    return btn;
  }

  function buildSteps() {
    const list = document.createElement('ol');
    list.className = 'survey-steps';
    list.setAttribute('aria-label', 'Partes de la encuesta');
    const items = blocks.map((block, n) => {
      const title = block.querySelector('h2');
      title.tabIndex = -1;
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'survey-step';
      const num = document.createElement('span');
      num.className = 'survey-step-num';
      num.setAttribute('aria-hidden', 'true');
      num.textContent = String(n + 1);
      const label = document.createElement('span');
      label.className = 'survey-step-label';
      label.textContent = title.textContent;
      btn.append(num, label);
      btn.setAttribute('aria-label', `Parte ${n + 1} de ${blocks.length}: ${title.textContent}`);
      btn.addEventListener('click', () => {
        // Hacia atrás siempre; hacia adelante solo si esta parte está completa.
        if (n > state.current) {
          const missing = firstMissing(blocks[state.current]);
          if (missing) { showError(missingMessage(missing), missing); return; }
        }
        showStep(n, true);
      });
      li.append(btn);
      list.append(li);
      return { li, btn };
    });
    form.insertBefore(list, blocks[0]);

    const nav = document.createElement('div');
    nav.className = 'survey-nav';
    const prev = makeButton('btn-survey btn-survey--ghost', 'fa-arrow-left', 'Anterior', true);
    const next = makeButton('btn-survey', 'fa-arrow-right', 'Siguiente', false);
    prev.addEventListener('click', () => showStep(state.current - 1, true));
    next.addEventListener('click', goNext);
    btnSubmit.before(nav);
    nav.append(prev, next, btnSubmit);

    const state = { list, items, prev, next, current: 0, reached: 0 };
    return state;
  }

  function showStep(index, moveFocus) {
    steps.current = index;
    steps.reached = Math.max(steps.reached, index);
    const last = index === blocks.length - 1;
    blocks.forEach((block, n) => { block.hidden = n !== index; });
    steps.items.forEach(({ li, btn }, n) => {
      li.classList.toggle('is-current', n === index);
      li.classList.toggle('is-visited', n !== index && n <= steps.reached);
      // Se puede saltar a cualquier parte ya vista y a la siguiente (que valida antes).
      btn.disabled = n > Math.max(steps.reached, index + 1);
      if (n === index) btn.setAttribute('aria-current', 'step'); else btn.removeAttribute('aria-current');
    });
    steps.prev.hidden = index === 0;
    steps.next.hidden = last;
    btnSubmit.hidden = !last;
    statusMessage.className = 'status-message';
    statusMessage.textContent = '';
    if (moveFocus) {
      steps.list.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      blocks[index].querySelector('h2').focus({ preventScroll: true });
    }
  }

  function goNext() {
    const missing = firstMissing(blocks[steps.current]);
    if (missing) {
      showError(missingMessage(missing), missing);
      return;
    }
    showStep(steps.current + 1, true);
  }

  if (steps) showStep(0, false);

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (btnSubmit.disabled) return;

    // Enter en una parte intermedia avanza, no envía.
    if (steps && steps.current < blocks.length - 1) {
      goNext();
      return;
    }

    const missing = firstMissing(form);
    if (missing) {
      if (steps) {
        const index = blocks.findIndex(block => block.contains(missing));
        if (index !== -1 && index !== steps.current) showStep(index, false);
      }
      showError(missingMessage(missing), missing);
      return;
    }

    const respuestas = collect();
    // La encuesta de no asistentes no tiene estas dos preguntas: van como null.
    const satisfaccion = 'satisfaccion' in respuestas ? Number(respuestas.satisfaccion) : null;
    const recomendacion = 'recomendacion' in respuestas ? Number(respuestas.recomendacion) : null;
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
