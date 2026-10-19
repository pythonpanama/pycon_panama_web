/* Navegación y fichas de detalle de la agenda. */

document.addEventListener('DOMContentLoaded', function () {
  const dayTabs = Array.from(document.querySelectorAll('[data-agenda-day]'));
  const dialog = document.getElementById('agenda-detail-dialog');
  const detailTitle = document.getElementById('agenda-detail-title');
  const detailTopic = document.getElementById('agenda-detail-topic');
  const detailDescription = document.getElementById('agenda-detail-description');
  const detailSpeaker = document.getElementById('agenda-detail-speaker');
  const detailMeta = document.getElementById('agenda-detail-meta');
  const photoDialog = document.getElementById('agenda-photo-dialog');
  const photoDialogImage = document.getElementById('agenda-photo-dialog-image');
  /* Campos opcionales por perfil: role, org, country y countryCode (valor o lista), photo (ruta o lista de rutas),
     photoPosition (posición del encuadre), y links.
     Lo que no exista simplemente no se muestra. */
  const speakerProfiles = {
    abdel: { name: 'Abdel Gadiel Martínez Lassonde', role: 'Director de Soluciones y Servicios Tecnológicos', org: 'Solusoft, S.A.', country: 'Panamá', countryCode: 'PA', bio: 'Abdel Gadiel Martínez Lassonde es Director de Soluciones y Servicios Tecnológicos en Solusoft, empresa panameña de servicios de ingeniería de datos con más de 30 años de trayectoria. Lidera equipos de consultores que dan soporte a clientes de banca, gobierno, salud, retail y telecomunicaciones, y es el arquitecto principal de Holos, la plataforma de observabilidad de Solusoft. Tiene amplia experiencia como DBA, ingeniero DevOps y arquitecto cloud, y cuenta con múltiples certificaciones en todas estas tecnologías. Es vicepresidente de la Fundación de Tecnologías Libres de Panamá y docente en la Universidad Interamericana de Panamá, UNICyT y CEAGRO AIP, donde comparte su experiencia con nuevas generaciones de profesionales.', photo: 'img/conferencistas/AbdelMartinez.webp', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/abdelgmartinezl' }, { label: 'Sitio web', url: 'https://www.solusoft.com' }, { label: 'Holos', url: 'https://www.holosmonitor.com' }] },
    http3: { name: 'Stuti Jain y Palak Jain', org: 'Adobe · HSBC', country: 'India', countryCode: 'IN', bio: 'Stuti Jain es SDE II en Adobe y ha presentado en PyCon Indonesia y PyCon Korea. Palak Jain es ingeniera de software en HSBC, con experiencia en sistemas backend y aplicaciones distribuidas con Python; también ha presentado en PyCon Indonesia y PyCon Korea.', photo: ['img/conferencistas/Stuti Jain.webp', 'img/conferencistas/Palak Jain.webp'], links: [{ label: 'Stuti Jain en LinkedIn', url: 'https://linkedin.com/in/stuti-jain-98630a197' }, { label: 'Palak Jain en LinkedIn', url: 'https://linkedin.com/in/palak-jain-980622145' }] },
    uv: { name: 'David Jonathan Sol Llaven', role: 'Cloud Architect', org: 'Caylent', country: 'México', countryCode: 'MX', bio: 'Cloud Architect en Caylent; ayuda a organizar PythonCDMX y Ajolotes en la Nube (AWS).', photo: 'img/conferencistas/DavidSolCaylent.webp', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/soldavidcloud' }] },
    pypi: { name: 'Renzo Caceres Rossi', role: 'Especialista en R y Python', country: 'Perú', countryCode: 'PE', bio: 'Especialista en R y Python, creador de más de 30 librerías en R y 10 en Python para ciencia de datos. Ha sido ponente en PyDay Chile 2022 y PyCon Bolivia 2022.', photo: 'img/conferencistas/RENZOCACERESROSSI.webp', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/andrescaceresrossi' }] },
    'ai-ready': { name: 'Valery C. Briz', role: 'Senior Data Engineer', org: 'Mitek Systems', country: 'Guatemala', countryCode: 'GT', bio: 'Senior Data Engineer en Mitek Systems, con más de 10 años de experiencia. Excoorganizadora de PyLadies Madrid y PyLadies CDMX, fundadora de Python Guatemala e instructora en OpenWebinars.', photo: 'img/conferencistas/ValeriaCalderonBriz.webp', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/valerybriz' }] },
    streamlit: { name: 'Maria Clara Sanchez de Mira', role: 'Ingeniera de software backend', org: 'CI&T', country: 'Brasil', countryCode: 'BR', bio: 'Soy ingeniera informática con más de 4 años de experiencia en desarrollo de software, trabajando principalmente con Python. Actualmente, me desempeño como ingeniera de software backend en CI&T, atendiendo a un cliente del sector financiero. Estoy cursando una maestría en Ciencias de la Computación en el ICMC-USP, con enfoque en sistemas distribuidos y programación concurrente.', photo: 'img/conferencistas/MaríaClaraSanchez.webp', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/maasanchez' }, { label: 'Sitio web', url: 'https://maria-sanchez.netlify.app' }] },
    'educacion-ia': { name: 'Juan Camilo Infante', role: 'Educador, cofundador de Perspektiva 360 y Truvadur', country: ['Colombia', 'Costa Rica'], countryCode: ['CO', 'CR'], bio: 'Educador, apasionado por cómo la tecnología puede solucionar los problemas del mundo. Cofundó Perspektiva 360, empresa de software que durante 11 años creó productos para clientes como el Programa de las Naciones Unidas para el Desarrollo (PNUD) y UNICEF. Hoy construye productos de IA por voz con Python en Truvadur, como Bjørn, un tutor de idiomas por voz en Telegram. Ingeniero industrial de la Universidad de los Andes, MSc en Technology-based Entrepreneurship de KTH Royal Institute of Technology (Suecia) y Machine Learning Specialization de DeepLearning.AI. Fellow de la Young Leaders of the Americas Initiative (YLAI) y becario del Swedish Institute (SISGP).', photo: 'img/conferencistas/JuanCamiloInfante.webp', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/juan-camilo-infante' }, { label: 'Sitio web', url: 'https://www.truvadur.com' }] },
    corporativo: { name: 'Ivan Lopez Raudales', role: 'Líder regional de Business Intelligence y Analítica Estratégica', country: 'Panamá', countryCode: 'PA', photo: 'img/conferencistas/Ivan Lopez.webp', bio: 'Líder regional de Business Intelligence y Analítica Estratégica, MBA de INCAE Business School. Desarrolló pipelines regionales de datos con Python y APIs en Samsung Latinoamérica.', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/ivanlopezraudales' }] },
    robotica: { name: 'Luis Meron', role: 'Estudiante de Ingeniería Electrónica y Telecomunicaciones', org: 'Universidad Tecnológica de Panamá', country: 'Panamá', countryCode: 'PA', bio: 'Estudiante de Ingeniería Electrónica y Telecomunicaciones en la Universidad Tecnológica de Panamá.', photo: 'img/conferencistas/LuisMeron.webp', links: [] },
    django: { name: 'Jair Manuel Poveda Frago', role: 'Socio fundador', org: 'Cohesive DataOps y Cooltimedia', country: 'Panamá', countryCode: 'PA', bio: 'Ingeniero en Sistemas Computacionales, con más de una década liderando proyectos de software e ingeniería de datos. Socio fundador de Cohesive DataOps y Cooltimedia en Panamá.', photo: 'img/conferencistas/JairManuelPoveda.webp', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/jairpoveda' }] },
    carlos: { name: 'Carlos Alarcón', country: 'Colombia', countryCode: 'CO', bio: 'Carlos Andrés Alarcón es un profesional especializado en inteligencia artificial, ciencia de datos y transformación digital, además de creador de contenido educativo sobre IA en YouTube. Ha sido reconocido como Microsoft Most Valuable Professional (MVP) y Google Developer Expert (GDE) en inteligencia artificial y machine learning, distinciones que reflejan su trayectoria y contribuciones a la comunidad tecnológica. Anteriormente, se desempeñó como Director de la Escuela de Inteligencia Artificial en Platzi, donde lideró iniciativas de formación, innovación y adopción de tecnologías de IA. Actualmente, es CTO y cofundador de Quix, una startup que transforma la capacitación corporativa mediante inteligencia artificial y experiencias de aprendizaje conversacionales. También participa como conferencista y consultor, ayudando a organizaciones y profesionales a comprender y aprovechar el potencial de la IA.', photo: 'img/conferencistas/Carlos Alarcon.webp', links: [] },
    odoo: { name: 'Yudith Recio Milanés', role: 'Directora y Fundadora de Solvixer | Consultora Empresarial | ERP Odoo', country: 'Panamá', countryCode: 'PA', bio: 'Cuenta con 15 años de experiencia con Python y el framework Odoo.', photo: 'img/conferencistas/YudithRecio.webp', links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/yudithrecio0503' }] },
    'keisa-cloud': { name: 'Keisa Ávila', role: 'Licenciada en Informática · Máster en Inteligencia Artificial para el Negocio', country: 'Panamá', countryCode: 'PA', bio: 'Keisa Ávila es licenciada en Informática y cuenta con un máster en Inteligencia Artificial para el Negocio. Tiene más de 15 años de experiencia en inteligencia de negocios y ha participado en proyectos de integración, migración y análisis de datos en sectores como banca, telecomunicaciones, aerolíneas y retail. Su experiencia abarca inteligencia de negocios, ingeniería de datos, diseño de arquitecturas de Data Lake e integración y migración de datos hacia la nube. Actualmente trabaja en proyectos corporativos de inteligencia artificial, incluyendo asistentes conversacionales para consultar datos y agentes de voz para automatizar procesos de negocio. Combina tecnologías como SQL Server, Python, Spark, AWS y Databricks para desarrollar soluciones de datos, analítica e IA aplicada al negocio. Es autora del libro Data Storytelling y conferencista en comunidades tecnológicas, donde comparte conocimientos sobre datos e inteligencia artificial aplicada al negocio. Es fundadora de la comunidad EllasTech y forma parte de las comunidades de Power BI Panamá y AWS Panamá.', photo: 'img/conferencistas/Keisa_Avila.webp', links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/keisa/' }, { label: 'Sitio web', url: 'https://keisaavila.net/' }] },
    'pydantic-ai': { name: 'Ricardo Tovar', role: 'Cofundador y Technical Lead', org: 'MART Automations', country: 'Panamá', countryCode: 'PA', bio: 'Desarrollador enfocado en AI Engineering, cofundador y Technical Lead en MART Automations. Especializado en agentes autónomos y arquitecturas backend con FastAPI.', photo: 'img/conferencistas/Ricardo Tovar.webp', links: [{ label: 'GitHub', url: 'https://github.com/rtovardev' }, { label: 'LinkedIn', url: 'https://linkedin.com/in/ricardotovar-ai' }] },
    'gerardo-vilcamiza': { name: 'Gerardo Vilcamiza', role: 'Senior AI Engineer · Fundador de Python Lima', country: 'Perú', countryCode: 'PE', bio: 'Ingeniero Mecatrónico y magíster en Inteligencia Artificial Embebida. Senior AI Engineer en banca y seguros, docente en la Universidad de Buenos Aires e investigador en el Laboratorio de Sistemas Embebidos. Community Lead y fundador de Python Lima.', photo: 'img/conferencistas/GerardoVilcamiza.webp', links: [] }
  };

  const sessionDetails = {
    http3: ['How Python Speaks HTTP/3', 'Redes y protocolos'],
    uv: ['uv: la mejor noticia en Python de los últimos años', 'Herramientas de desarrollo', 'Por qué uv simplifica la configuración del entorno y la administración de paquetes, con trucos para usuarios nuevos y avanzados.'],
    pypi: ['De la idea al PyPI: el camino para enseñar a crear librerías de Python en Latinoamérica', 'Empaquetado y educación'],
    streamlit: ['Monitoreando los datos que entrenan la IA con Streamlit', 'Datos e IA'],
    'educacion-ia': ['Usando Python, modelos LLM open source, STT, TTS y Design Thinking humano para optimizar mis labores en educación', 'IA aplicada a la educación', 'Como docente, la carga administrativa me saturaba y me quitaba tiempo para conectar con mis estudiantes y pensar en la mejor forma de explicar. Perdía horas cada semana en correos y mensajes de muchos canales de comunicación. Construí Marimba, un asistente en Python con modelos open source, voz a texto (STT) y texto a voz (TTS). Marimba prioriza mis tareas, redacta correos, resume reuniones, guarda clases y consulta mis documentos con RAG. Contaré cómo lo diseñé con Design Thinking, empezando por el problema con empatía hacia la labor docente y las buenas prácticas de lo que he aprendido en mi uso diario de la herramienta.'],
    corporativo: ['Más allá del código: casos reales de Python para transformar operaciones corporativas', 'Automatización empresarial'],
    robotica: ['Python y Robótica', 'Robótica'],
    django: ['De cero a producción en Django: arquitectura MVT, migraciones y Wagtail CMS bajo el estándar “No Doc, No Deploy”', 'Desarrollo web'],
    'ai-ready': ['AI-Ready Data (por qué no hay IA sin una estrategia de datos)', 'Datos e IA'],
    odoo: ['De junior a productivo: automatizando el desarrollo de módulos Odoo con Python y Claude', 'IA aplicada al desarrollo'],
    'keisa-cloud': ['Tus datos no van a subir solos: llévalos a la nube con Python y PySpark', 'Ingeniería de datos', 'Tus datos están en archivos CSV y en un servidor SQL Server, pero necesitas llevarlos a la nube. ¿Por dónde empezar? En esta charla exploraremos cómo utilizar Python para conectarnos a SQL Server on-premise, extraer datos mediante consultas e incorporar archivos CSV para almacenarlos en Amazon S3. También abordaremos cómo PySpark permite transformar y combinar grandes volúmenes de datos para prepararlos para su análisis. A través de ejemplos de código, conoceremos los componentes de este flujo y las principales consideraciones para implementarlo: conexión, extracción, almacenamiento y transformación. También explicaremos por qué una carga exitosa no garantiza que los datos estén listos para analizarlos.'],
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
    return [profile.role, profile.org, [].concat(profile.country || []).join(' y ')].filter(Boolean).join(' · ');
  }

  function createAvatars(profile, zoomable) {
    const group = document.createElement('span');
    const photos = [].concat(profile.photo || []);
    group.className = 'speaker-avatars';
    if (!zoomable) group.setAttribute('aria-hidden', 'true');
    profile.name.split(' y ').forEach(function (name, index) {
      let avatar;
      if (photos[index]) {
        avatar = document.createElement('img');
        avatar.src = photos[index];
        avatar.alt = '';
        avatar.loading = 'lazy';
        avatar.decoding = 'async';
        if (profile.photoPosition) avatar.style.objectPosition = profile.photoPosition;
        if (zoomable) {
          const trigger = document.createElement('button');
          trigger.type = 'button';
          trigger.className = 'speaker-avatar-trigger';
          trigger.setAttribute('aria-label', 'Ampliar foto de ' + name);
          trigger.append(avatar);
          trigger.addEventListener('click', function () {
            photoDialogImage.src = avatar.src;
            photoDialogImage.alt = 'Foto ampliada de ' + name;
            photoDialog.showModal();
          });
          group.append(trigger);
          return;
        }
      } else {
        avatar = document.createElement('span');
        avatar.textContent = name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (word) { return word[0]; }).join('').toUpperCase();
      }
      avatar.classList.add('speaker-avatar');
      group.append(avatar);
    });
    return group;
  }

  function createCountryFlags(profile) {
    const countries = [].concat(profile.country || []);
    const codes = [].concat(profile.countryCode || []);
    return countries.map(function (country, index) {
      const code = codes[index];
      if (!/^[A-Z]{2}$/.test(code || '')) return null;
      const flag = document.createElement('img');
      flag.className = 'speaker-flag';
      flag.src = 'img/flags/' + code.toLowerCase() + '.svg';
      flag.width = 20;
      flag.height = 15;
      flag.alt = 'Bandera de ' + country;
      flag.loading = 'lazy';
      flag.decoding = 'async';
      return flag;
    }).filter(Boolean);
  }

  function createSpeakerBlock(profile, zoomable) {
    const block = document.createElement('div');
    const text = document.createElement('div');
    const name = document.createElement('p');
    const nameText = document.createElement('span');
    const subtitle = profileSubtitle(profile);
    block.className = 'session-person';
    name.className = 'session-speaker';
    nameText.className = 'session-speaker-name';
    nameText.textContent = profile.name;
    name.append(nameText, ...createCountryFlags(profile));
    text.append(name);
    if (subtitle) {
      const role = document.createElement('p');
      role.className = 'session-role';
      role.textContent = subtitle;
      text.append(role);
    }
    block.append(createAvatars(profile, zoomable), text);
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
      const card = createSpeakerBlock(profile, true);
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

  photoDialog.addEventListener('click', function (event) {
    if (event.target === photoDialog) photoDialog.close();
  });

  addDayFilterControls();
  setDayFilter('all');
});