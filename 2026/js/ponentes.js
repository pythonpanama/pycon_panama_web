        const form = document.getElementById('speakerForm');
        const statusMessage = document.getElementById('statusMessage');
        const btnSubmit = document.getElementById('btnSubmit');

        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            if (btnSubmit.disabled) return;

            if (!form.checkValidity()) {
                statusMessage.className = 'status-message error';
                // Si lo único que falta es la casilla del Código de Conducta, se dice;
                // si falta algo más, el mensaje genérico y reportValidity() lleva el
                // foco al primer campo con problema.
                if (!document.getElementById('consent_coc').checked) {
                    statusMessage.textContent = 'Para enviar tu propuesta tienes que aceptar el Código de Conducta.';
                } else if (!document.getElementById('consent_privacy').checked) {
                    statusMessage.textContent = 'Para enviar tu propuesta tienes que aceptar el Aviso de Privacidad.';
                } else {
                    statusMessage.textContent = 'Revisa los campos obligatorios del formulario.';
                }
                form.reportValidity();
                return;
            }

            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Enviando propuesta...';
            statusMessage.className = 'status-message';
            statusMessage.textContent = 'Procesando tu propuesta...';

            const datos = {
                nombre: document.getElementById('nombre').value.trim(),
                email: document.getElementById('email').value.trim(),
                telefono: document.getElementById('telefono').value.trim(),
                organizacion: document.getElementById('organizacion').value.trim(),
                bio: document.getElementById('bio').value.trim(),
                titulo_propuesta: document.getElementById('titulo_propuesta').value.trim(),
                descripcion_propuesta: document.getElementById('descripcion_propuesta').value.trim(),
                nivel: document.getElementById('nivel').value,
                modalidad: document.getElementById('modalidad').value,
                redes_sociales: document.getElementById('redes_sociales').value.trim(),
                consent_privacy: document.getElementById('consent_privacy').checked,
                consent_coc: document.getElementById('consent_coc').checked
            };

            try {
                const res = await PyConSupabase.registrarSpeaker(datos);

                if (res.success) {
                    statusMessage.className = 'status-message success';
                    statusMessage.textContent = `¡Gracias, ${datos.nombre}! Tu propuesta "${datos.titulo_propuesta}" ha sido registrada exitosamente para PyCon Panamá 2026.`;
                    form.reset();
                } else {
                    statusMessage.className = 'status-message error';
                    statusMessage.textContent = res.friendlyMessage || 'Ocurrió un inconveniente al enviar tu propuesta. Por favor intenta de nuevo.';
                }
            } catch (err) {
                statusMessage.className = 'status-message error';
                statusMessage.textContent = 'Error de conexión. Por favor intenta de nuevo.';
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.textContent = 'Enviar propuesta de ponencia';
            }
        });
