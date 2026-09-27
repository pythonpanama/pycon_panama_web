/** Días calendario en Panamá; no representa una hora de publicación. */
(function () {
    'use strict';

    const panamaDate = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Panama', year: 'numeric', month: '2-digit', day: '2-digit'
    });

    function countdownMessage(publicationDate, now = new Date()) {
        const [year, month, day] = publicationDate.split('-').map(Number);
        const parts = Object.fromEntries(panamaDate.formatToParts(now).map(part => [part.type, part.value]));
        // UTC sirve solo para restar fechas civiles, no fija una hora del evento.
        const today = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
        const remaining = (Date.UTC(year, month - 1, day) - today) / 86400000;
        if (remaining > 1) return `Faltan ${remaining} días para publicar la agenda`;
        if (remaining === 1) return 'Falta 1 día para publicar la agenda';
        if (remaining === 0) return 'La agenda se publica hoy';
        return 'Agenda pendiente de publicación';
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { countdownMessage };
    }

    if (typeof document === 'undefined') return;
    const countdown = document.getElementById('agenda-countdown');
    const date = document.getElementById('agenda-publication-date');
    if (!countdown || !date) return;

    function update() {
        const message = countdownMessage(date.getAttribute('datetime'));
        if (countdown.textContent !== message) countdown.textContent = message;
    }
    update();
    // Cubre pestañas abiertas durante el cambio de día, sin anuncios en vivo.
    window.setInterval(update, 60000);
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) update();
    });
})();
