// PyCon Panamá 2026 - Mantenimiento

document.addEventListener('DOMContentLoaded', function() {
  const redirectMenu = document.getElementById('redirect-menu');
  const goBtn = document.getElementById('go-btn');

  // Redirigir al hacer clic en el botón
  goBtn.addEventListener('click', function() {
    const selectedUrl = redirectMenu.value;
    if (selectedUrl) {
      window.location.href = selectedUrl;
    }
  });

  // Permitir redirigir con Enter en el select
  redirectMenu.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      goBtn.click();
    }
  });
});
