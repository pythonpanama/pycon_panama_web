# PyCon Panamá — Web oficial

Repositorio de la web oficial de PyCon Panamá. Es un sitio estático: cada edición vive en su propia carpeta y se publica desde la raíz del repo.

**Sitio en producción:** [pyconpanama.org](https://pyconpanama.org) (redirige a `/2026/`)

Documentación relacionada: [prototipo Reflex 2026](2026_dev/README.md).

## Estructura

| Carpeta | Descripción |
| --- | --- |
| `2026/` | **Edición activa.** HTML + CSS + JS estáticos. Aquí se trabaja. |
| `2027/` | Sitio generado (export de Next.js). No editar a mano. |
| `2025/` | Edición 2025, archivada. |
| `2024/` | Edición 2024, archivada. |
| `2026_dev/` | Prototipo en [Reflex](https://reflex.dev) (Python). No se despliega. |

Archivos en la raíz:

- `netlify.toml` — configuración de despliegue, redirecciones y cabeceras.
- `404.html` — página de error del sitio.
- `robots.txt` / `sitemap.xml` — SEO.
- `favicon.ico` — icono del sitio.
- `fix_paths.sh` — utilidad para prefijar rutas absolutas al archivar una edición.

## Desarrollo local

La edición activa (`2026/`) es HTML plano, no necesita build:

```bash
python3 -m http.server 8000
# abre http://localhost:8000/2026/
```

Sirve desde la **raíz** del repo, no desde `2026/`, para que las rutas absolutas (`/2026/...`, `/favicon.ico`) se resuelvan igual que en producción.

### Prototipo Reflex (`2026_dev/`)

```bash
cd 2026_dev
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
reflex run
```

## Despliegue

Automático en Netlify al hacer merge a `main`. Publica la raíz del repo (`publish = "."`), así que todas las ediciones quedan accesibles por su ruta.

## Cómo contribuir

1. Crea una rama desde `main`.
2. Haz los cambios en la carpeta de la edición correspondiente.
3. Verifica localmente con el servidor de arriba.
4. Abre un Pull Request.

### Al agregar una página nueva a `2026/`

- Copia el `<head>` de una página existente (favicon, `canonical`, `og:url`, hojas de estilo).
- Agrega el enlace al menú de navegación en **todas** las páginas.
- Añade la URL a `sitemap.xml`.

## Comunidad

- Web: [pythonpanama.org](https://pythonpanama.org)
- [Instagram](https://www.instagram.com/pythonpanama/) · [Facebook](https://www.facebook.com/profile.php?id=100078380970388) · [LinkedIn](https://linkedin.com/company/pythonpanama) · [Meetup](https://www.meetup.com/python-panama/)
