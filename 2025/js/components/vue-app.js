// Vue 3: mejoras progresivas. Solo se monta donde hay nodos presentes.
(() => {
  const { createApp, ref, onMounted } = (window.Vue || {});
  if (!createApp) return; // Vue no cargó

  // Contador regresivo para la fecha del evento (ej. 2025-10-15)
  const countdownRoot = document.getElementById('countdown');
  if (countdownRoot) {
    const target = new Date('2025-10-15T09:00:00-05:00');
    createApp({
      setup() {
        const remaining = ref('');
        const tick = () => {
          const now = new Date();
          const diff = Math.max(0, target - now);
          const d = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const m = Math.floor((diff / (1000 * 60)) % 60);
          const s = Math.floor((diff / 1000) % 60);
          remaining.value = `${d}d ${h}h ${m}m ${s}s`;
        };
        let id;
        onMounted(() => {
          tick();
          id = setInterval(tick, 1000);
          // Limpieza al desmontar
          window.addEventListener('beforeunload', () => clearInterval(id));
        });
        return { remaining };
      },
      template: `
        <div class="mt-3" aria-live="polite">
          <span class="badge badge-primary p-2">Comienza en: {{ remaining }}</span>
        </div>
      `,
    }).mount('#countdown');
  }
})();

