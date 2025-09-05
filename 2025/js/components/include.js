document.addEventListener('DOMContentLoaded', () => {
  const map = {
    header: 'partials/header.html',
    footer: 'partials/footer.html',
  };

  document.querySelectorAll('[data-include]')
    .forEach(async (el) => {
      const key = el.getAttribute('data-include');
      const src = map[key];
      if (!src) return;
      try {
        const res = await fetch(src, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        el.innerHTML = html;
        // Marcar enlace activo en el header según la URL actual
        if (key === 'header') {
          const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
          const links = el.querySelectorAll('.navbar-nav .nav-link');
          links.forEach(a => a.classList.remove('active'));
          for (const a of links) {
            const href = (a.getAttribute('href') || '').toLowerCase();
            if ((current === '' && href === 'index.html') || href === current) {
              a.classList.add('active');
              break;
            }
          }
        }
      } catch (e) {
        console.warn(`No se pudo cargar el include '${key}' desde ${src}:`, e);
      }
    });
});
