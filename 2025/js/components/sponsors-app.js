// Vue 3 Sponsors: grilla con filtros y efectos
(() => {
  const { createApp, ref, computed, onMounted } = (window.Vue || {});
  if (!createApp) return;

  const mountNode = document.getElementById('sponsorsApp');
  if (!mountNode) return;

  const SPONSORS = [
    { name: 'JB Beam', logo: 'img/sponsors/jb_beam.png', url: 'https://www.jetbrains.com/', tier: 'Visionary' },
    { name: 'PyLadies', logo: 'img/sponsors/Pyladies.png', url: 'https://pyladies.com/', tier: 'Community' },
    { name: 'Python Software Foundation', logo: 'img/sponsors/PSF.png', url: 'https://www.python.org/psf-landing/', tier: 'Strategic' },
    { name: 'SoftD3v', logo: 'img/sponsors/SoftD3v.png', url: 'https://softd3v.com/', tier: 'Collaborator' },
  ];

  createApp({
    setup() {
      const tiers = ref(['Todos', 'Strategic', 'Visionary', 'Collaborator', 'Community']);
      const selected = ref('Todos');
      const sponsors = ref(SPONSORS);
      const filtered = computed(() => selected.value === 'Todos'
        ? sponsors.value
        : sponsors.value.filter(s => s.tier === selected.value));

      // Pequeña animación de aparición
      const ready = ref(false);
      onMounted(() => setTimeout(() => { ready.value = true; }, 50));

      return { tiers, selected, filtered, ready };
    },
    template: `
      <div class="s-grid" :class="{ 's-grid-ready': ready }">
        <div class="s-filters d-flex justify-content-center flex-wrap mb-4">
          <button
            v-for="t in tiers"
            :key="t"
            class="btn btn-sm mx-1 my-1"
            :class="selected === t ? 'btn-primary' : 'btn-outline-primary'"
            @click="selected = t"
            type="button"
            aria-pressed="selected === t">
            {{ t }}
          </button>
        </div>

        <div class="row">
          <div v-for="s in filtered" :key="s.name" class="col-6 col-sm-6 col-md-4 col-lg-3 mb-4">
            <a :href="s.url" class="s-card d-block" target="_blank" rel="noopener noreferrer" :aria-label="s.name">
              <div class="s-card-inner">
                <img :src="s.logo" class="s-logo" :alt="'Sponsor: ' + s.name" loading="lazy">
              </div>
              <div class="s-meta text-center mt-2">
                <span class="badge badge-light">{{ s.tier }}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    `,
  }).mount('#sponsorsApp');
})();

