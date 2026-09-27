        const btnCopiar = document.getElementById('btnCopiarPlantilla');
        const plantilla = document.getElementById('plantillaCorreo');
        const copiarStatus = document.getElementById('copiarStatus');

        btnCopiar.addEventListener('click', async function () {
            try {
                await navigator.clipboard.writeText(plantilla.value);
                copiarStatus.className = 'status-message success';
                copiarStatus.textContent = 'Plantilla copiada. Ya puedes pegarla en tu correo.';
            } catch (err) {
                plantilla.removeAttribute('readonly');
                plantilla.focus();
                plantilla.select();
                copiarStatus.className = 'status-message error';
                copiarStatus.textContent = 'No pudimos copiarla automáticamente. Está seleccionada: usa Ctrl+C o Cmd+C.';
            }
        });
