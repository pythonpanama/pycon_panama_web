/* Navegación y fichas de detalle de la agenda. */

document.addEventListener('DOMContentLoaded', function () {
  const viewTabs = Array.from(document.querySelectorAll('[data-view-tab]'));
  const viewPanels = Array.from(document.querySelectorAll('[data-view-panel]')).filter(function (panel) {
    return panel.id !== 'panel-conferencistas';
  });
  const dayTabs = Array.from(document.querySelectorAll('[data-agenda-day]'));
  const dialog = document.getElementById('agenda-detail-dialog');
  const detailTitle = document.getElementById('agenda-detail-title');
  const detailTopic = document.getElementById('agenda-detail-topic');
  const detailDescription = document.getElementById('agenda-detail-description');
  const detailSpeaker = document.getElementById('agenda-detail-speaker');
  const speakerPanel = document.getElementById('panel-conferencistas');
  if (speakerPanel) speakerPanel.remove();
  const speakerProfiles = {
    abdel: { name: 'Abdel Martínez', bio: 'Ponente de PyCon Panamá.', links: [] },
    http3: { name: 'Stuti Jain y Palak Jain', bio: 'Stuti Jain es SDE II en Adobe y ha presentado en PyCon Indonesia y PyCon Korea. Palak Jain es ingeniera de software en HSBC, con experiencia en sistemas backend y aplicaciones distribuidas con Python; también ha presentado en PyCon Indonesia y PyCon Korea.', links: [{ label: 'Stuti Jain en LinkedIn', url: 'https://linkedin.com/in/stuti-jain-98630a197' }, { label: 'Palak Jain en LinkedIn', url: 'https://linkedin.com/in/palak-jain-980622145' }] },
    uv: { name: 'David Jonathan Sol Llaven', bio: 'Cloud Architect en Caylent; ayuda a organizar PythonCDMX y Ajolotes en la Nube (AWS).', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/soldavidcloud' }] },
    pypi: { name: 'Renzo Caceres Rossi', bio: 'Especialista en R y Python, creador de más de 30 librerías en R y 10 en Python para ciencia de datos. Ha sido ponente en PyDay Chile 2022 y PyCon Bolivia 2022.', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/andrescaceresrossi' }] },
    'ai-ready': { name: 'Valery C. Briz', bio: 'Senior Data Engineer en Mitek Systems, con más de 10 años de experiencia. Excoorganizadora de PyLadies Madrid y PyLadies CDMX, fundadora de Python Guatemala e instructora en OpenWebinars.', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/valerybriz' }] },
    streamlit: { name: 'Maria Clara Sanchez de Mira', bio: 'Ingeniera de Computación con más de 4 años de experiencia en Python. Backend Software Engineer en CI&T y estudiante de maestría en Ciencias de la Computación, enfocada en sistemas distribuidos y concurrencia.', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/maasanchez' }, { label: 'Sitio web', url: 'https://maria-sanchez.netlify.app' }] },
    'educacion-ia': { name: 'Juan Camilo Infante', bio: 'Especializado en Machine Learning, con 11 años de experiencia como fundador y product manager técnico. Ha trabajado con clientes como Naciones Unidas y Unicef.', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/juan-camilo-infante' }] },
    gil: { name: 'Alberto Castillo', bio: 'Más de 8 años de experiencia en desarrollo e infraestructura. Lidera infraestructura en una empresa de tecnología y forma parte de FLOSSPA desde 2016.', links: [{ label: 'Sitio web', url: 'https://www.betoissues.com' }] },
    async: { name: 'Andres Vasquez', bio: 'Software Engineer especializado en Inteligencia Artificial, Machine Learning y Deep Learning, con foco en arquitectura backend, integración de LLM y sistemas escalables.', links: [{ label: 'LinkedIn', url: 'https://co.linkedin.com/in/andresvasquez-softwareengineerai' }] },
    corporativo: { name: 'Ivan Lopez Raudales', bio: 'Líder regional de Business Intelligence y Analítica Estratégica, MBA de INCAE Business School. Desarrolló pipelines regionales de datos con Python y APIs en Samsung Latinoamérica.', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/ivanlopezraudales' }] },
    robotica: { name: 'Luis Meron', bio: 'Estudiante de Ingeniería Electrónica y Telecomunicaciones en la Universidad Tecnológica de Panamá.', links: [] },
    django: { name: 'Jair Manuel Poveda Frago', bio: 'Ingeniero en Sistemas Computacionales, con más de una década liderando proyectos de software e ingeniería de datos. Socio fundador de Cohesive DataOps y Cooltimedia en Panamá.', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/jairpoveda' }] },
    carlos: { name: 'Carlos Alarcón', bio: 'Ponente de PyCon Panamá.', links: [] },
    odoo: { name: 'Yudith Recio Milanés', bio: 'Desarrolladora de software y consultora en Solvixer. Cuenta con 15 años de experiencia con Python y el framework Odoo.', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/yudithrecio0503' }] },
    'pydantic-ai': { name: 'Ricardo Tovar', bio: 'Desarrollador enfocado en AI Engineering, cofundador y Technical Lead en MART Automations. Especializado en agentes autónomos y arquitecturas backend con FastAPI.', links: [{ label: 'GitHub', url: 'https://github.com/rtovardev' }, { label: 'LinkedIn', url: 'https://linkedin.com/in/ricardotovar-ai' }] },
    'gerardo-vilcamiza': { name: 'Gerardo Vilcamiza', bio: 'Ingeniero Mecatrónico y magíster en Inteligencia Artificial Embebida. Senior AI Engineer en banca y seguros, docente en la Universidad de Buenos Aires e investigador en el Laboratorio de Sistemas Embebidos. Community Lead y fundador de Python Lima.', links: [] }
  };

  const sessionDetails = {
    http3: ['How Python Speaks HTTP/3', 'Redes y protocolos'],
    uv: ['uv: la mejor noticia en Python de los últimos años', 'Herramientas de desarrollo', 'Por qué uv simplifica la configuración del entorno y la administración de paquetes, con trucos para usuarios nuevos y avanzados.'],
    pypi: ['De la idea al PyPI: el camino para enseñar a crear librerías de Python en Latinoamérica', 'Empaquetado y educación'],
    streamlit: ['Monitoreando los datos que entrenan la IA con Streamlit', 'Datos e IA'],
    'educacion-ia': ['Usando Python, modelos LLM open source, STT, TTS y Design Thinking humano para optimizar mis labores en educación', 'IA aplicada a la educación'],
    gil: ['Ocho núcleos y usas uno: el GIL ya no es obligatorio', 'Rendimiento y concurrencia'],
    async: ['Cómo entender async / await sin usar async / await', 'Rendimiento y concurrencia'],
    corporativo: ['Más allá del código: casos reales de Python para transformar operaciones corporativas', 'Automatización empresarial'],
    robotica: ['Python y Robótica', 'Robótica'],
    django: ['De cero a producción en Django: arquitectura MVT, migraciones y Wagtail CMS bajo el estándar “No Doc, No Deploy”', 'Desarrollo web'],
    'ai-ready': ['AI-Ready Data (por qué no hay IA sin una estrategia de datos)', 'Datos e IA'],
    odoo: ['De junior a productivo: automatizando el desarrollo de módulos Odoo con Python y Claude', 'IA aplicada al desarrollo'],
    'pydantic-ai': ['Agentes de IA con Pydantic AI: de cero a producción con menos magia y más ingeniería', 'IA y agentes']
  };
  Object.keys(sessionDetails).forEach(function (id) {
    const item = document.querySelector('[data-session-id="' + id + '"]');
    const [title, topic, summary] = sessionDetails[id];
    item.querySelector('.session-title').textContent = title;
    item.querySelector('.agenda-track').textContent = topic;
    if (summary) item.querySelector('.agenda-abstract p').textContent = summary;
  });

  let talks = Array.from(document.querySelectorAll('.agenda-item[data-session-id]'));
  talks.forEach(function (item) {
    const profile = speakerProfiles[item.dataset.sessionId];
    if (profile) item.querySelector('.session-speaker').textContent = profile.name;
  });

  document.querySelectorAll('#panel-jueves .agenda-item--event .session-title').forEach(function (heading) {
    heading.textContent = heading.textContent.replace(/virtual/gi, 'híbrida');
  });

  function setTab(tabs, panels, dataKey, value) {
    tabs.forEach(function (tab) {
      const selected = tab.dataset[dataKey] === value;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(function (panel) {
      const panelKey = dataKey === 'viewTab' ? 'viewPanel' : 'agendaPanel';
      panel.hidden = panel.dataset[panelKey] !== value;
    });
  }

  let selectedDay = 'all';

  function setDayFilter(day) {
    selectedDay = day;
    dayTabs.forEach(function (tab) {
      const selected = tab.dataset.agendaDay === day;
      tab.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('[data-agenda-panel]').forEach(function (panel) {
      panel.hidden = day !== 'all' && panel.dataset.agendaPanel !== day;
    });
    document.querySelectorAll('[data-agenda-filter-day]').forEach(function (group) {
      group.hidden = day !== 'all' && group.dataset.agendaFilterDay !== day;
    });
  }

  function addTabKeyboard(tabs, panels, dataKey) {
    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        setTab(tabs, panels, dataKey, tab.dataset[dataKey]);
      });
      tab.addEventListener('keydown', function (event) {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0
          : event.key === 'End' ? tabs.length - 1
            : (index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
        tabs[next].focus();
        setTab(tabs, panels, dataKey, tabs[next].dataset[dataKey]);
      });
    });
  }

  function addDayFilterControls() {
    dayTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        setDayFilter(selectedDay === tab.dataset.agendaDay ? 'all' : tab.dataset.agendaDay);
      });
      tab.addEventListener('keydown', function (event) {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const tabsInGroup = Array.from(tab.closest('.agenda-day-tabs').querySelectorAll('[data-agenda-day]'));
        const index = tabsInGroup.indexOf(tab);
        const next = event.key === 'Home' ? 0
          : event.key === 'End' ? tabsInGroup.length - 1
            : (index + (event.key === 'ArrowRight' ? 1 : tabsInGroup.length - 1)) % tabsInGroup.length;
        tabsInGroup[next].focus();
        setDayFilter(tabsInGroup[next].dataset.agendaDay);
      });
    });
  }

  function openDetail(title, topic, description, showSpeaker, profile) {
    detailTitle.textContent = title;
    detailTopic.textContent = topic;
    detailDescription.replaceChildren();
    if (description) {
      const paragraph = document.createElement('p');
      paragraph.textContent = description;
      detailDescription.append(paragraph);
    }
    detailDescription.hidden = !description;
    detailSpeaker.hidden = !showSpeaker;
    if (showSpeaker && profile) {
      const fields = detailSpeaker.querySelector('.agenda-speaker-fields');
      fields.replaceChildren();
      const nameLabel = document.createElement('strong');
      const name = document.createElement('p');
      const bioLabel = document.createElement('strong');
      const bio = document.createElement('p');
      nameLabel.textContent = 'Nombre';
      name.textContent = profile.name;
      bioLabel.textContent = 'Biografía';
      bio.textContent = profile.bio;
      fields.append(nameLabel, name, bioLabel, bio);
      appendProfileLinks(fields, profile.links);
    }
    dialog.showModal();
  }

  function appendProfileLinks(container, links) {
    if (!links || !links.length) return;
    const linkLabel = document.createElement('strong');
    const linkList = document.createElement('div');
    linkLabel.textContent = 'Enlaces';
    linkList.className = 'agenda-speaker-links';
    links.forEach(function (link) {
      const anchor = document.createElement('a');
      const icon = document.createElement('i');
      anchor.href = link.url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.setAttribute('aria-label', link.label);
      anchor.title = link.label;
      icon.className = link.url.includes('linkedin') ? 'fa-brands fa-linkedin-in'
        : link.url.includes('github') ? 'fa-brands fa-github'
          : 'fa-solid fa-globe';
      icon.setAttribute('aria-hidden', 'true');
      anchor.append(icon);
      anchor.addEventListener('click', function (event) { event.stopPropagation(); });
      linkList.append(anchor);
    });
    container.append(linkLabel, linkList);
  }

  function openSessionView(sessionId, day, title, topic, description, profile) {
    setTab(viewTabs, viewPanels, 'viewTab', 'sesiones');
    setDayFilter(day);
    const entry = document.querySelector('[data-session-entry="' + sessionId + '"]');
    if (!entry) return;
    entry.scrollIntoView({ block: 'center', behavior: 'smooth' });
    entry.querySelector('.session-card').focus({ preventScroll: true });
    openDetail(title, topic, description, true, profile);
  }

  talks.forEach(function (item) {
    const sessionId = item.dataset.sessionId;
    const title = item.querySelector('.session-title').textContent.trim();
    const topic = item.querySelector('.agenda-track').textContent.trim();
    const summary = item.querySelector('.agenda-abstract');
    const description = summary
      ? Array.from(summary.querySelectorAll('p:not(.session-bio)')).map(function (paragraph) { return paragraph.textContent.trim(); }).join('\n\n')
      : '';
    if (summary) summary.remove();

    item.querySelectorAll('.agenda-favorite, .session-speaker').forEach(function (element) {
      element.remove();
    });
    const keynoteNames = {
      abdel: 'Keynote de apertura',
      carlos: 'Conferencia invitada',
      'gerardo-vilcamiza': 'Keynote de cierre'
    };
    const keynoteBadge = item.querySelector('.agenda-session-top .session-badge');
    if (keynoteBadge && keynoteNames[sessionId]) {
      keynoteBadge.textContent = keynoteNames[sessionId];
      item.querySelector('.session-card').classList.add('session-keynote');
    } else if (keynoteBadge) {
      keynoteBadge.remove();
    }

    const agendaCard = item.querySelector('.session-card');
    agendaCard.tabIndex = 0;
    agendaCard.setAttribute('role', 'button');
    agendaCard.setAttribute('aria-label', 'Ver detalles de esta sesión en la pestaña Sesiones: ' + title);
    const day = item.closest('[data-agenda-panel]').dataset.agendaPanel;
    agendaCard.addEventListener('click', function () { openSessionView(sessionId, day, title, topic, description, profile); });
    agendaCard.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openSessionView(sessionId, day, title, topic, description, profile);
      }
    });

    const profile = speakerProfiles[sessionId];
    const list = document.querySelector('[data-session-list="' + day + '"]');
    const row = document.createElement('li');
    const sessionCard = document.createElement('article');
    const sessionTime = item.querySelector('.agenda-time').cloneNode(true);
    const sessionInfo = document.createElement('div');
    const buttonTitle = document.createElement('h3');
    const sessionSpeaker = document.createElement('p');
    const sessionDescription = document.createElement('p');
    row.className = 'agenda-item';
    row.dataset.sessionEntry = sessionId;
    sessionCard.className = 'session-card';
    sessionInfo.className = 'agenda-session';
    sessionSpeaker.className = 'session-speaker';
    buttonTitle.className = 'session-title';
    buttonTitle.textContent = title;
    sessionSpeaker.textContent = 'Nombre: ' + (profile ? profile.name : 'Próximamente');
    sessionDescription.className = 'agenda-session-directory-topic';
    sessionDescription.textContent = description || 'Próximamente...';
    sessionInfo.append(buttonTitle, sessionDescription, sessionSpeaker);
    sessionCard.append(sessionTime, sessionInfo);
    sessionCard.tabIndex = 0;
    sessionCard.setAttribute('role', 'group');
    sessionCard.setAttribute('aria-label', 'Abrir detalles de la sesión: ' + title);
    row.append(sessionCard);
    sessionCard.addEventListener('click', function () { openDetail(title, topic, description, true, profile); });
    sessionCard.addEventListener('keydown', function (event) {
      if (event.target.closest('a')) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDetail(title, topic, description, true, profile);
      }
    });
    list.append(row);
  });

  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close();
  });

  addTabKeyboard(viewTabs, viewPanels, 'viewTab');
  addDayFilterControls();
  setTab(viewTabs, viewPanels, 'viewTab', 'agenda');
  setDayFilter('all');
});