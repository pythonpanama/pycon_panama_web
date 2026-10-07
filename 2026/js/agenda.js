/* Navegación y fichas de detalle de la agenda. */

document.addEventListener('DOMContentLoaded', function () {
  const dayTabs = Array.from(document.querySelectorAll('[data-agenda-day]'));
  const dialog = document.getElementById('agenda-detail-dialog');
  const detailTitle = document.getElementById('agenda-detail-title');
  const detailTopic = document.getElementById('agenda-detail-topic');
  const detailDescription = document.getElementById('agenda-detail-description');
  const detailSpeaker = document.getElementById('agenda-detail-speaker');
  const detailMeta = document.getElementById('agenda-detail-meta');
  /* Campos opcionales por perfil: role, org, country, photo (ruta o lista de rutas) y links.
     Lo que no exista simplemente no se muestra. */
  const speakerProfiles = {
    abdel: { name: 'Abdel Martínez', bio: '', links: [] },
    http3: { name: 'Stuti Jain y Palak Jain', org: 'Adobe · HSBC', bio: 'Stuti Jain es SDE II en Adobe y ha presentado en PyCon Indonesia y PyCon Korea. Palak Jain es ingeniera de software en HSBC, con experiencia en sistemas backend y aplicaciones distribuidas con Python; también ha presentado en PyCon Indonesia y PyCon Korea.', photo: ['img/conferencistas/Stuti Jain.png', 'img/conferencistas/Palak Jain.png'], links: [{ label: 'Stuti Jain en LinkedIn', url: 'https://linkedin.com/in/stuti-jain-98630a197' }, { label: 'Palak Jain en LinkedIn', url: 'https://linkedin.com/in/palak-jain-980622145' }] },
    uv: { name: 'David Jonathan Sol Llaven', role: 'Cloud Architect', org: 'Caylent', bio: 'Cloud Architect en Caylent; ayuda a organizar PythonCDMX y Ajolotes en la Nube (AWS).', photo: 'img/conferencistas/DavidSolCaylent.png', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/soldavidcloud' }] },
    pypi: { name: 'Renzo Caceres Rossi', role: 'Especialista en R y Python', bio: 'Especialista en R y Python, creador de más de 30 librerías en R y 10 en Python para ciencia de datos. Ha sido ponente en PyDay Chile 2022 y PyCon Bolivia 2022.', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/andrescaceresrossi' }] },
    'ai-ready': { name: 'Valery C. Briz', role: 'Senior Data Engineer', org: 'Mitek Systems', bio: 'Senior Data Engineer en Mitek Systems, con más de 10 años de experiencia. Excoorganizadora de PyLadies Madrid y PyLadies CDMX, fundadora de Python Guatemala e instructora en OpenWebinars.', photo: 'img/conferencistas/ValeriaCalderonBriz.png', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/valerybriz' }] },
    streamlit: { name: 'Maria Clara Sanchez de Mira', role: 'Backend Software Engineer', org: 'CI&T', bio: 'Ingeniera de Computación con más de 4 años de experiencia en Python. Backend Software Engineer en CI&T y estudiante de maestría en Ciencias de la Computación, enfocada en sistemas distribuidos y concurrencia.', photo: 'img/conferencistas/MaríaClaraSanchez.png', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/maasanchez' }, { label: 'Sitio web', url: 'https://maria-sanchez.netlify.app' }] },
    'educacion-ia': { name: 'Juan Camilo Infante', role: 'Fundador y product manager técnico', bio: 'Especializado en Machine Learning, con 11 años de experiencia como fundador y product manager técnico. Ha trabajado con clientes como Naciones Unidas y Unicef.', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/juan-camilo-infante' }] },
    gil: { name: 'Alberto Castillo', role: 'Líder de infraestructura', bio: 'Más de 8 años de experiencia en desarrollo e infraestructura. Lidera infraestructura en una empresa de tecnología y forma parte de FLOSSPA desde 2016.', links: [{ label: 'Sitio web', url: 'https://www.betoissues.com' }] },
    async: { name: 'Andres Vasquez', role: 'Software Engineer en IA y Machine Learning', bio: 'Software Engineer especializado en Inteligencia Artificial, Machine Learning y Deep Learning, con foco en arquitectura backend, integración de LLM y sistemas escalables.', links: [{ label: 'LinkedIn', url: 'https://co.linkedin.com/in/andresvasquez-softwareengineerai' }] },
    corporativo: { name: 'Ivan Lopez Raudales', role: 'Líder regional de Business Intelligence y Analítica Estratégica', bio: 'Líder regional de Business Intelligence y Analítica Estratégica, MBA de INCAE Business School. Desarrolló pipelines regionales de datos con Python y APIs en Samsung Latinoamérica.', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/ivanlopezraudales' }] },
    robotica: { name: 'Luis Meron', role: 'Estudiante de Ingeniería Electrónica y Telecomunicaciones', org: 'Universidad Tecnológica de Panamá', bio: 'Estudiante de Ingeniería Electrónica y Telecomunicaciones en la Universidad Tecnológica de Panamá.', links: [] },
    django: { name: 'Jair Manuel Poveda Frago', role: 'Socio fundador', org: 'Cohesive DataOps y Cooltimedia', bio: 'Ingeniero en Sistemas Computacionales, con más de una década liderando proyectos de software e ingeniería de datos. Socio fundador de Cohesive DataOps y Cooltimedia en Panamá.', photo: 'img/conferencistas/JairManuelPoveda.png', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/jairpoveda' }] },
    carlos: { name: 'Carlos Alarcón', bio: '', links: [] },
    odoo: { name: 'Yudith Recio Milanés', role: 'Desarrolladora de software y consultora', org: 'Solvixer', bio: 'Desarrolladora de software y consultora en Solvixer. Cuenta con 15 años de experiencia con Python y el framework Odoo.', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/yudithrecio0503' }] },
    'pydantic-ai': { name: 'Ricardo Tovar', role: 'Cofundador y Technical Lead', org: 'MART Automations', bio: 'Desarrollador enfocado en AI Engineering, cofundador y Technical Lead en MART Automations. Especializado en agentes autónomos y arquitecturas backend con FastAPI.', links: [{ label: 'GitHub', url: 'https://github.com/rtovardev' }, { label: 'LinkedIn', url: 'https://linkedin.com/in/ricardotovar-ai' }] },
    'gerardo-vilcamiza': { name: 'Gerardo Vilcamiza', role: 'Senior AI Engineer · Fundador de Python Lima', bio: 'Ingeniero Mecatrónico y magíster en Inteligencia Artificial Embebida. Senior AI Engineer en banca y seguros, docente en la Universidad de Buenos Aires e investigador en el Laboratorio de Sistemas Embebidos. Community Lead y fundador de Python Lima.', photo: 'img/conferencistas/GerardoVilcamiza.png', links: [] }
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

  const linkIcons = [
    ['linkedin', 'fa-brands fa-linkedin-in'],
    ['github', 'fa-brands fa-github'],
    ['instagram', 'fa-brands fa-instagram'],
    ['twitter.com', 'fa-brands fa-twitter'],
    ['x.com', 'fa-brands fa-twitter']
  ];

  /* Hora de inicio y fin a partir del datetime y la duración que ya trae el HTML. */
  function formatTimeBlock(block) {
    const time = block.querySelector('time');
    const period = block.querySelector('span');
    const duration = block.querySelector('small');
    const match = time && time.getAttribute('datetime').match(/T(\d{2}):(\d{2})/);
    const minutes = duration ? parseInt(duration.textContent, 10) : NaN;
    if (!match || !period || Number.isNaN(minutes)) return;
    const start = Number(match[1]) * 60 + Number(match[2]);
    const end = start + minutes;
    const clock = function (value) { return ((Math.floor(value / 60) + 11) % 12 + 1) + ':' + String(value % 60).padStart(2, '0'); };
    const meridiem = function (value) { return Math.floor(value / 60) >= 12 ? 'p. m.' : 'a. m.'; };
    const sameMeridiem = meridiem(start) === meridiem(end);
    time.textContent = clock(start);
    period.textContent = '– ' + clock(end);
    duration.textContent = (sameMeridiem ? meridiem(start) : meridiem(start) + ' – ' + meridiem(end)) + ' · ' + minutes + ' min';
    block.dataset.label = sameMeridiem
      ? clock(start) + ' – ' + clock(end) + ' ' + meridiem(end)
      : clock(start) + ' ' + meridiem(start) + ' – ' + clock(end) + ' ' + meridiem(end);
  }

  function profileSubtitle(profile) {
    return [profile.role, profile.org, profile.country].filter(Boolean).join(' · ');
  }

  function createAvatars(profile) {
    const group = document.createElement('span');
    const photos = [].concat(profile.photo || []);
    group.className = 'speaker-avatars';
    group.setAttribute('aria-hidden', 'true');
    profile.name.split(' y ').forEach(function (name, index) {
      let avatar;
      if (photos[index]) {
        avatar = document.createElement('img');
        avatar.src = photos[index];
        avatar.alt = '';
        avatar.loading = 'lazy';
        avatar.decoding = 'async';
      } else {
        avatar = document.createElement('span');
        avatar.textContent = name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (word) { return word[0]; }).join('').toUpperCase();
      }
      avatar.classList.add('speaker-avatar');
      group.append(avatar);
    });
    return group;
  }

  function createSpeakerBlock(profile) {
    const block = document.createElement('div');
    const text = document.createElement('div');
    const name = document.createElement('p');
    const subtitle = profileSubtitle(profile);
    block.className = 'session-person';
    name.className = 'session-speaker';
    name.textContent = profile.name;
    text.append(name);
    if (subtitle) {
      const role = document.createElement('p');
      role.className = 'session-role';
      role.textContent = subtitle;
      text.append(role);
    }
    block.append(createAvatars(profile), text);
    return block;
  }

  function createMeta(topic) {
    if (!topic || topic.startsWith('Próximamente')) return null;
    const meta = document.createElement('p');
    const tag = document.createElement('span');
    meta.className = 'session-meta';
    tag.className = 'session-tag';
    tag.textContent = topic;
    meta.append(tag);
    return meta;
  }

  function openDetail(title, topic, description, showSpeaker, profile, when) {
    detailTitle.textContent = title;
    detailTopic.textContent = topic && !topic.startsWith('Próximamente') ? topic : '';
    detailTopic.hidden = !detailTopic.textContent;
    detailMeta.textContent = when || '';
    detailMeta.hidden = !when;
    detailDescription.replaceChildren();
    if (description && !description.startsWith('Próximamente')) {
      const paragraph = document.createElement('p');
      paragraph.textContent = description;
      detailDescription.append(paragraph);
    }
    detailDescription.hidden = !detailDescription.childElementCount;
    detailSpeaker.replaceChildren();
    detailSpeaker.hidden = !(showSpeaker && profile);
    if (showSpeaker && profile) {
      const label = document.createElement('h3');
      const card = createSpeakerBlock(profile);
      label.className = 'agenda-dialog-label';
      label.textContent = profile.name.includes(' y ') ? 'Conferencistas' : 'Conferencista';
      card.classList.add('speaker-profile');
      detailSpeaker.append(label, card);
      if (profile.bio) {
        const bio = document.createElement('p');
        bio.className = 'speaker-profile-bio';
        bio.textContent = profile.bio;
        detailSpeaker.append(bio);
      }
      appendProfileLinks(detailSpeaker, profile.links);
    }
    dialog.showModal();
  }

  function appendProfileLinks(container, links) {
    if (!links || !links.length) return;
    const linkList = document.createElement('div');
    linkList.className = 'agenda-speaker-links';
    links.forEach(function (link) {
      const anchor = document.createElement('a');
      const icon = document.createElement('i');
      const known = linkIcons.find(function (entry) { return link.url.includes(entry[0]); });
      anchor.href = link.url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.setAttribute('aria-label', link.label);
      anchor.title = link.label;
      icon.className = known ? known[1] : 'fa-solid fa-globe';
      icon.setAttribute('aria-hidden', 'true');
      anchor.append(icon);
      anchor.addEventListener('click', function (event) { event.stopPropagation(); });
      linkList.append(anchor);
    });
    container.append(linkList);
  }

  document.querySelectorAll('.agenda-list .agenda-time').forEach(formatTimeBlock);

  talks.forEach(function (item) {
    const sessionId = item.dataset.sessionId;
    const profile = speakerProfiles[sessionId];
    const title = item.querySelector('.session-title').textContent.trim();
    const track = item.querySelector('.agenda-track');
    const topic = track.textContent.trim();
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

    const meta = createMeta(topic);
    if (profile) track.before(createSpeakerBlock(profile));
    if (meta) track.replaceWith(meta); else track.remove();

    const agendaCard = item.querySelector('.session-card');
    const dayLabel = item.closest('[data-agenda-panel]').querySelector('h2').textContent.trim();
    const when = dayLabel + ' · ' + item.querySelector('.agenda-time').dataset.label;
    agendaCard.tabIndex = 0;
    agendaCard.setAttribute('role', 'button');
    agendaCard.setAttribute('aria-label', 'Ver detalles de la sesión: ' + title);
    agendaCard.addEventListener('click', function () { openDetail(title, topic, description, true, profile, when); });
    agendaCard.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDetail(title, topic, description, true, profile, when);
      }
    });
  });

  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close();
  });

  addDayFilterControls();
  setDayFilter('all');
});