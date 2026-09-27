        const form = document.getElementById('registroForm');
        const statusMessage = document.getElementById('statusMessage');
        const btnSubmit = document.getElementById('btnSubmit');
        const dayInputs = Array.from(document.querySelectorAll('input[name="dias"]'));
        const diaJueves = document.getElementById('dia_jueves');
        const modalidadJuevesField = document.getElementById('modalidadJuevesField');
        const modalidadJuevesInputs = Array.from(document.querySelectorAll('input[name="modalidad_jueves"]'));

        function syncAttendanceFields() {
            const hasSelectedDay = dayInputs.some(option => option.checked);
            dayInputs[0].setCustomValidity(hasSelectedDay ? '' : 'Selecciona al menos un día.');

            modalidadJuevesField.hidden = !diaJueves.checked;
            modalidadJuevesInputs.forEach(option => {
                option.required = diaJueves.checked;
                if (!diaJueves.checked) option.checked = false;
            });
        }

        dayInputs.forEach(option => option.addEventListener('change', syncAttendanceFields));
        syncAttendanceFields();

        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            syncAttendanceFields();

            if (!form.checkValidity()) {
                statusMessage.className = 'status-message error';
                if (!dayInputs.some(option => option.checked)) {
                    statusMessage.textContent = 'Selecciona al menos un día para asistir.';
                } else if (diaJueves.checked && !modalidadJuevesInputs.some(option => option.checked)) {
                    statusMessage.textContent = 'Indica cómo participarás el jueves 22.';
                } else if (!document.getElementById('consent_coc').checked) {
                    statusMessage.textContent = 'Para registrarte tienes que aceptar el Código de Conducta.';
                } else if (!document.getElementById('consent_privacy').checked) {
                    statusMessage.textContent = 'Para registrarte tienes que aceptar el Aviso de Privacidad.';
                } else {
                    statusMessage.textContent = 'Revisa los campos obligatorios del formulario.';
                }
                form.reportValidity();
                return;
            }

            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Enviando registro...';
            statusMessage.className = 'status-message';
            statusMessage.textContent = 'Procesando tu registro...';

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const organizacion = document.getElementById('organizacion') ? document.getElementById('organizacion').value.trim() : '';
            const rol = document.getElementById('rol').value;
            const dias = dayInputs.filter(option => option.checked).map(option => option.value);
            const modalidad_jueves = modalidadJuevesInputs.find(option => option.checked)?.value || '';
            const expectativas = document.getElementById('expectativas').value.trim();
            const accesibilidad = document.getElementById('accesibilidad').value.trim();
            const consent_privacy = document.getElementById('consent_privacy').checked;
            const consent_coc = document.getElementById('consent_coc').checked;

            const datos = { nombre, email, telefono, organizacion, rol, dias, modalidad_jueves, expectativas, accesibilidad, consent_privacy, consent_coc };

            try {
                const res = await PyConSupabase.registrarAsistente(datos);

                if (res.success) {
                    statusMessage.className = 'status-message success';
                    statusMessage.textContent = `¡Gracias, ${nombre}! Recibimos tu registro para ${dias.join(' y ')}. Te enviaremos una confirmación por correo.`;
                    form.reset();
                    syncAttendanceFields();
                } else {
                    statusMessage.className = 'status-message error';
                    statusMessage.textContent = res.friendlyMessage || 'Ocurrió un inconveniente al procesar tu registro. Por favor intenta de nuevo.';
                }
            } catch (err) {
                statusMessage.className = 'status-message error';
                statusMessage.textContent = 'Error de conexión. Por favor intenta de nuevo.';
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.textContent = 'Enviar registro';
            }
        });
