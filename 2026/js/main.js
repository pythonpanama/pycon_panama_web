/* Navegación del sitio — PyCon Panamá 2026
   Menú desplegable en celular, submenús y estado accesible (aria-*). */

document.addEventListener('DOMContentLoaded', function () {
  // Debe coincidir con el corte de navegación de css/responsive.css
  const MOBILE_QUERY = window.matchMedia('(max-width: 768px)');

  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const submenuToggles = document.querySelectorAll('.submenu-toggle');

  /* --- Estado ----------------------------------------------------------- */

  function closeSubmenus(except) {
    submenuToggles.forEach(function (toggle) {
      const item = toggle.closest('.nav-item-has-children');
      if (!item || item === except) return;

      item.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  // En el menú de celular, el grupo que contiene la página actual se muestra
  // desplegado. En escritorio no: al cargar taparía el contenido.
  function syncCurrentSubmenu() {
    const current = document.querySelector('.submenu a[aria-current="page"]');
    if (!current) return;

    const item = current.closest('.nav-item-has-children');
    const toggle = item && item.querySelector('.submenu-toggle');
    if (!item || !toggle) return;

    const shouldOpen = MOBILE_QUERY.matches;
    item.classList.toggle('open', shouldOpen);
    toggle.setAttribute('aria-expanded', String(shouldOpen));
  }

  function setMenuOpen(isOpen) {
    if (!navToggle || !navMenu) return;

    navMenu.classList.toggle('opened', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');

    if (isOpen) {
      syncCurrentSubmenu();
    } else {
      closeSubmenus();
    }
  }

  /* --- Eventos ---------------------------------------------------------- */

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      setMenuOpen(!navMenu.classList.contains('opened'));
    });
  }

  submenuToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      const item = toggle.closest('.nav-item-has-children');
      if (!item) return;

      const isOpen = !item.classList.contains('open');
      closeSubmenus(item);
      item.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  });

  document.addEventListener('click', function (event) {
    // El botón del menú gobierna el panel completo, no los grupos que contiene:
    // si cerrara los submenús, el grupo de la página actual se plegaría al abrir.
    const insideGroup = event.target.closest('.nav-item-has-children');
    const isMenuButton = navToggle && navToggle.contains(event.target);

    if (!insideGroup && !isMenuButton) {
      closeSubmenus();
    }

    if (navMenu && navToggle && !event.target.closest('.header-inner')) {
      setMenuOpen(false);
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;

    closeSubmenus();
    setMenuOpen(false);
    if (navToggle) navToggle.focus();
  });

  // Al navegar desde el menú de celular, el panel se cierra solo
  document.querySelectorAll('.site-nav a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (MOBILE_QUERY.matches) setMenuOpen(false);
    });
  });

  // Al cruzar el corte, el panel cambia de naturaleza: se reinicia su estado
  MOBILE_QUERY.addEventListener('change', function (event) {
    if (!event.matches) setMenuOpen(false);
    syncCurrentSubmenu();
  });

  /* --- Estado inicial --------------------------------------------------- */

  syncCurrentSubmenu();
});
