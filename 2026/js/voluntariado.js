(function () {
  'use strict';

  const form = document.getElementById('volunteerForm');
  const statusMessage = document.getElementById('statusMessage');
  const btnSubmit = document.getElementById('btnSubmit');
  const checkedValues = name => Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map(input => input.value);
  const value = id => document.getElementById(id).value.trim();

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const roles = checkedValues('roles');
    const availability = checkedValues('availability');

    if (!form.checkValidity() || roles.length === 0 || availability.length === 0) {
      statusMessage.className = 'status-message error';
      if (roles.length === 0) {
        statusMessage.textContent = 'Selecciona al menos un área en la que deseas colaborar.';
        document.getElementById('roles-group').scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (availability.length === 0) {
        statusMessage.textContent = 'Selecciona al menos un momento en el que puedas colaborar.';
        document.getElementById('availability-group').scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        statusMessage.textContent = 'Revisa los campos obligatorios del formulario.';
        form.reportValidity();
      }
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Enviando postulación...';
    statusMessage.className = 'status-message';
    statusMessage.textContent = 'Procesando tu postulación...';
    const datos = {
      nombre: value('nombre'),
      email: value('email'),
      telefono: value('telefono'),
      ciudad: value('ciudad'),
      provincia: value('provincia'),
      roles,
      availability,
      experiencia: value('experiencia'),
      motivacion: value('motivacion'),
      accesibilidad: value('accesibilidad'),
      consent_coc: document.getElementById('consent_coc').checked,
      consent_privacy: document.getElementById('consent_privacy').checked
    };

    try {
      const result = await window.PyConSupabase.registrarVoluntariado(datos);
      if (result.success) {
        statusMessage.className = 'status-message success';
        statusMessage.textContent = `¡Gracias, ${datos.nombre}! Recibimos tu postulación. El equipo te contactará para confirmar disponibilidad y funciones.`;
        form.reset();
      } else {
        statusMessage.className = 'status-message error';
        statusMessage.textContent = result.friendlyMessage;
      }
    } catch (error) {
      statusMessage.className = 'status-message error';
      statusMessage.textContent = 'Error de conexión. Inténtalo nuevamente en unos minutos.';
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Enviar postulación';
    }
  });
})();
