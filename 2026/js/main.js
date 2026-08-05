document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const submenuLinks = document.querySelectorAll('.nav-item-has-children > a');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      const isOpened = navMenu.classList.toggle('opened');
      navToggle.setAttribute('aria-expanded', String(isOpened));
    });
  }

  submenuLinks.forEach(function(link) {
    const parentItem = link.parentElement;
    const submenu = parentItem.querySelector('.submenu');

    link.addEventListener('click', function(event) {
      if (!window.matchMedia('(max-width: 720px)').matches) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const wasOpen = parentItem.classList.contains('open');

      document.querySelectorAll('.nav-item-has-children.open').forEach(function(otherItem) {
        otherItem.classList.remove('open');
        const otherLink = otherItem.querySelector(':scope > a');
        const otherSubmenu = otherItem.querySelector('.submenu');
        if (otherLink) {
          otherLink.setAttribute('aria-expanded', 'false');
        }
        if (otherSubmenu) {
          otherSubmenu.style.display = 'none';
        }
      });

      const isOpen = !wasOpen;
      if (isOpen) {
        parentItem.classList.add('open');
        link.setAttribute('aria-expanded', 'true');
        if (submenu) {
          submenu.style.display = 'block';
        }
      } else {
        parentItem.classList.remove('open');
        link.setAttribute('aria-expanded', 'false');
        if (submenu) {
          submenu.style.display = 'none';
        }
      }
    });
  });
});
