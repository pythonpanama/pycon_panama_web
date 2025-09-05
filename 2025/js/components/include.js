document.addEventListener('DOMContentLoaded', () => {
  const map = {
    header: 'partials/header.html',
    footer: 'partials/footer.html',
    backtotop: 'partials/back_to_top.html',
    scripts: 'partials/scripts.html',
  };

  const loadScriptsFromHTML = async (html) => {
    // Crear un contenedor para parsear sin inyectar directamente
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const scripts = Array.from(tmp.querySelectorAll('script'));
    // Cargar en orden secuencial
    for (const s of scripts) {
      await new Promise((resolve, reject) => {
        const tag = document.createElement('script');
        // Copiar atributos relevantes (src, defer) sin usar innerHTML directo
        for (const { name, value } of Array.from(s.attributes)) {
          tag.setAttribute(name, value);
        }
        // Asegurar ejecución en orden; evitamos async por defecto
        tag.async = false;
        if (s.src) {
          tag.onload = () => resolve();
          tag.onerror = () => reject(new Error(`Falló carga de ${s.src}`));
          document.body.appendChild(tag);
        } else {
          tag.textContent = s.textContent || '';
          document.body.appendChild(tag);
          resolve();
        }
      }).catch((e) => console.warn('Script include error:', e));
    }
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
        if (key === 'scripts') {
          // No incrustar scripts vía innerHTML; cargarlos correctamente en orden
          await loadScriptsFromHTML(html);
          return;
        }
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
