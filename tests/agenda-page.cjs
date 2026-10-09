const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const page = fs.readFileSync('2026/agenda.html', 'utf8');
const script = fs.readFileSync('2026/js/agenda.js', 'utf8');
const styles = fs.readFileSync('2026/css/style.css', 'utf8');

test('la agenda incluye las dos jornadas y excluye la propuesta individual retirada', () => {
  assert.match(page, /data-agenda-panel="jueves"/);
  assert.match(page, /data-agenda-panel="viernes"/);
  assert.equal((page.match(/data-session-id="/g) || []).length, 17);
  assert.doesNotMatch(page, /data-session-id="grpc"|Beyond Hello World/);
  assert.match(page, /Jornada híbrida/);
});

test('la agenda es una sola vista con filtro por día y ficha de detalle', () => {
  assert.doesNotMatch(page, /data-view-tab|panel-sesiones|data-session-list/);
  assert.doesNotMatch(script, /openSessionView|setTab\(|data-agenda-filter-day/);
  assert.match(page, /agenda-detail-dialog/);
  assert.match(script, /Ver detalles de la sesión/);
  assert.match(script, /setDayFilter\('all'\)/);
  assert.match(script, /agendaCard\.addEventListener\('click', function \(\) \{ openDetail\(/);
  assert.match(script, /openDetail\(title, topic, description, true, profile, when\)/);
  assert.match(script, /createSpeakerBlock\(profile\)/);
  assert.match(script, /speaker-profile-bio/);
  assert.doesNotMatch(script, /'Nombre: '|nameLabel/);
  assert.match(script, /fa-linkedin-in/);
  assert.match(script, /fa-github/);
  assert.match(page, /Computer Vision en la nueva era del GenAI/);
  assert.match(page, /data-session-id="duckdb"[\s\S]*?Keisa Ávila/);
  assert.match(page, /data-session-id="duckdb"[\s\S]*?Información por confirmar/);
  assert.match(script, /odoo: \{ name: 'Yudith Recio Milanés', role: 'Directora y Fundadora de Solvixer \| Consultora Empresarial \| ERP Odoo'/);
  assert.match(script, /duckdb: \{ name: 'Keisa Ávila', role: 'Información por confirmar'/);
  assert.match(script, /function createCountryFlag\(profile\)/);
  assert.match(script, /flag\.src = 'img\/flags\/' \+ profile\.countryCode\.toLowerCase\(\) \+ '\.svg'/);
  assert.match(script, /flag\.alt = 'Bandera de ' \+ profile\.country/);
  assert.match(script, /name\.append\(nameText\);\s*if \(flag\) name\.append\(flag\)/);
  assert.match(styles, /\.session-speaker\s*\{[^}]*display:\s*flex;[^}]*align-items:\s*center;/);
  assert.match(script, /countryCode: 'PA'/);
  const profiles = script.split('const speakerProfiles = {')[1].split('\n  };')[0];
  assert.equal((profiles.match(/countryCode:/g) || []).length, 16);
  assert.match(profiles, /'educacion-ia': \{[^}]*name: 'Juan Camilo Infante'[^}]*bio:/);
  assert.doesNotMatch(profiles.match(/'educacion-ia': \{[^}]*\}/)[0], /country|countryCode/);
  [
    /http3: \{[^}]*countryCode: 'IN'/,
    /uv: \{[^}]*countryCode: 'MX'/,
    /pypi: \{[^}]*countryCode: 'PE'/,
    /'ai-ready': \{[^}]*countryCode: 'MX'/,
    /streamlit: \{[^}]*countryCode: 'BR'/,
    /carlos: \{[^}]*countryCode: 'CO'/,
    /'gerardo-vilcamiza': \{[^}]*countryCode: 'PE'/
  ].forEach((nationality) => assert.match(profiles, nationality));
  assert.match(script, /selectedDay === tab\.dataset\.agendaDay \? 'all'/);
});

test('las fotos de conferencistas aparecen en la agenda y en sus biografías', () => {
  const photos = [
    'img/conferencistas/Stuti Jain.png',
    'img/conferencistas/Palak Jain.png',
    'img/conferencistas/DavidSolCaylent.png',
    'img/conferencistas/ValeriaCalderonBriz.png',
    'img/conferencistas/MaríaClaraSanchez.png',
    'img/conferencistas/JairManuelPoveda.png',
    'img/conferencistas/GerardoVilcamiza.png',
    'img/conferencistas/Carlos Alarcon.png',
    'img/conferencistas/LuisMeron.png',
    'img/conferencistas/RENZOCACERESROSSI.png',
    'img/conferencistas/Ricardo Tovar.png',
    'img/conferencistas/YudithRecio.png'
  ];
  photos.forEach((photo) => {
    assert.ok(fs.existsSync('2026/' + photo), 'existe la foto ' + photo);
    assert.ok(script.includes(photo), 'el perfil usa la foto ' + photo);
  });
  assert.match(script, /photo: \['img\/conferencistas\/Stuti Jain\.png', 'img\/conferencistas\/Palak Jain\.png'\]/);
  assert.match(script, /createAvatars\(profile\)/);
  assert.match(script, /speaker-profile-bio/);
});

test('las banderas nacionales se cargan desde SVG locales', () => {
  ['br', 'co', 'in', 'mx', 'pa', 'pe'].forEach((country) => {
    assert.ok(fs.existsSync('2026/img/flags/' + country + '.svg'), 'existe la bandera ' + country);
  });
  assert.ok(fs.existsSync('2026/img/flags/LICENSE'), 'se incluye la licencia de las banderas');
});

test('el horario oficial vive en el HTML y el script no lo reescribe', () => {
  const horario = (dia) => {
    const panel = page.match(new RegExp('data-agenda-panel="' + dia + '"[\\s\\S]*?</ol>'))[0];
    return Array.from(panel.matchAll(/<li class="agenda-item([^>]*)>[\s\S]*?datetime="[^T]+T(\d\d:\d\d)[\s\S]*?<small>(\d+) min/g))
      .map(([, atributos, hora, duracion]) => ((atributos.match(/data-session-id="([^"]+)"/) || [])[1] || '·') + ' ' + hora + ' ' + duracion);
  };
  assert.deepEqual(horario('jueves'), [
    '· 09:00 10', 'http3 09:10 30', 'pypi 09:43 30', 'streamlit 10:16 30', '· 10:46 20',
    'uv 11:09 30', 'educacion-ia 11:42 30', 'ai-ready 12:15 30', '· 12:45 10'
  ]);
  assert.deepEqual(horario('viernes'), [
    '· 09:00 15', 'abdel 09:15 40', 'robotica 09:58 25', 'async 10:26 25', 'pydantic-ai 10:54 25',
    'gil 11:22 25', 'carlos 11:50 25', '· 12:20 45', 'django 13:08 25', 'odoo 13:36 25',
    'corporativo 14:04 25', 'duckdb 14:32 25', 'gerardo-vilcamiza 15:00 40', '· 15:40 20'
  ]);
  assert.doesNotMatch(script, /setTime|movedToThursday|addReservedTalk/);
  assert.doesNotMatch(page + script, /Vilcaminaza/i);
});

test('no quedan controles de búsqueda, favoritos ni niveles', () => {
  assert.doesNotMatch(page, /agenda-search|agenda-favorites-toggle|agenda-level|agenda-results/);
  assert.doesNotMatch(script, /favoriteKey|agenda-search|agenda-level/);
  assert.match(page, /Redes y protocolos/);
  assert.match(page, /IA y agentes/);
});

test('el cronograma usa variables de la paleta y tipografía del sitio', () => {
  assert.match(styles, /\.speaker-avatar[\s\S]*?object-fit: cover/);
  assert.match(styles, /\.agenda-day-tab[\s\S]*?var\(--color-navy\)/);
  assert.match(styles, /\.agenda-session[\s\S]*?var\(--accent-soft\)/);
  assert.match(page, /css\/variables\.css/);
  assert.match(page, /family=Montserrat/);
});

test('todos los menús principales de 2026 enlazan a la agenda', () => {
  const pages = fs.readdirSync('2026').filter((name) => name.endsWith('.html'))
    .map((name) => ['2026/' + name, fs.readFileSync('2026/' + name, 'utf8')]);
  pages.push(['2026/voluntariado/index.html', fs.readFileSync('2026/voluntariado/index.html', 'utf8')]);
  assert.equal(pages.length, 13);
  pages.forEach(([file, content]) => {
    const navigation = content.match(/<nav id="nav-menu"[\s\S]*?<\/nav>/);
    assert.ok(navigation, file + ' tiene menú principal');
    assert.match(navigation[0], /href="(?:\.\.\/)?agenda\.html"/, file + ' enlaza a Agenda');
  });
});