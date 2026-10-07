const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const home = fs.readFileSync('2026/index.html', 'utf8');
const about = fs.readFileSync('2026/about.html', 'utf8');
const venues = fs.readFileSync('2026/sedes.html', 'utf8');
const styles = fs.readFileSync('2026/css/style.css', 'utf8');
const allPages = [home, about, venues];

test('Inicio y Acerca de muestran tarjetas visuales con iconos', () => {
  const homeCards = home.match(/<a class="card card--link"[\s\S]*?<\/a>/g) || [];
  const aboutCards = about.match(/<article class="card">[\s\S]*?<\/article>/g) || [];

  assert.equal(homeCards.length, 7);
  assert.ok(homeCards.every((card) => card.includes('home-card-icon') && card.includes('home-card-arrow')));
  assert.equal(aboutCards.length, 6);
  assert.ok(aboutCards.every((card) => card.includes('home-card-icon')));
  assert.match(styles, /\.feature-card-grid \.card:hover[\s\S]*?translateY\(-5px\)/);
});

test('cada tarjeta usa un icono distinto entre Inicio, Acerca de y Sedes', () => {
  const icons = allPages.flatMap((page) =>
    Array.from(page.matchAll(/<span class="home-card-icon"[\s\S]*?<i class="([^"]+)"/g), ([, icon]) => icon)
  );

  assert.equal(new Set(icons).size, icons.length);
});

test('Sedes incluye mapas incrustados y enlaces para abrirlos', () => {
  const maps = Array.from(venues.matchAll(/<iframe[\s\S]*?<\/iframe>/g), ([frame]) => frame);

  assert.equal(maps.length, 2);
  assert.match(maps[0], /title="Mapa de Universidad del Istmo, Sede Panamá"/);
  assert.match(maps[1], /title="Mapa de Universidad del Istmo, Sede Metromall"/);
  assert.ok(maps.every((map) => map.includes('loading="lazy"') && map.includes('output=embed')));
  assert.equal((venues.match(/aria-label="Ver la Sede .*? en Google Maps/g) || []).length, 2);
  assert.match(styles, /\.venue-map iframe[\s\S]*?width: 100%;[\s\S]*?height: 100%/);
});
