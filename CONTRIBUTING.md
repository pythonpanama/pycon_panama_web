# Contribuir al sitio de PyCon Panamá

Última actualización: 27 de septiembre de 2026.

Este repositorio mantiene el sitio público de PyCon Panamá. La edición activa es `2026/`; `2025/` y `2024/` se conservan como archivo y solo admiten correcciones puntuales.

## Abrir un issue

Busca primero si el problema ya está reportado. Elige una plantilla de **error en el sitio**, **cambio de contenido** o **mejora técnica** y completa sus apartados con la página o archivo afectado, el motivo y el resultado esperado. Para contenido del evento, aporta una fuente pública e indica si falta confirmación de la organización.

Las consultas del evento que no correspondan al sitio se atienden en [pyconpanama@gmail.com](mailto:pyconpanama@gmail.com).

## Preparar un cambio

1. Sigue el [inicio rápido](README.md#inicio-rápido) para servir el sitio desde la raíz.
2. Crea una rama desde `main` actualizado, con un nombre descriptivo y un único propósito.
3. Aplica las indicaciones de [Cambiar el sitio](README.md#cambiar-el-sitio) y [Contribuir](README.md#contribuir). Mantén pequeños los commits y explica el motivo del cambio.
4. Conserva fuera del repositorio los datos privados, credenciales y SQL internos: Netlify publica la raíz completa. Publica únicamente información del evento confirmada por la organización.

## Validar y abrir un PR

Ejecuta desde la raíz, con Python 3 y Node.js disponibles:

```bash
python3 scripts/validate_site.py
node --test tests/*.cjs
git diff --check
```

Node.js se usa para las pruebas; el sitio estático no requiere compilación. Consulta [Validar antes de proponer cambios](README.md#validar-antes-de-proponer-cambios) para las comprobaciones HTTP, visuales en escritorio y móvil, y de enlaces externos. Si no tienes red, usa `python3 scripts/validate_site.py --skip-external` y declara esa limitación.

Abre el PR hacia `main`, completa la plantilla e incluye el issue, las páginas o archivos afectados y los resultados. Explica cualquier fallo o comprobación que no aplique. Revisa el preview de Netlify cuando esté disponible.

## Revisión y publicación

[CODEOWNERS](.github/CODEOWNERS) identifica a quien revisa `2026/`, `netlify.toml`, `scripts/` y `.github/`. GitHub utiliza el archivo de la rama de destino para solicitar revisiones; comenzará a hacerlo cuando este archivo se integre en `main`.

CODEOWNERS no impone por sí solo una aprobación obligatoria: esa exigencia se configura en las reglas de protección de la rama con **Require review from Code Owners**. Consulta la [documentación de GitHub](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners). La integración y la verificación de producción siguen el flujo de [Despliegue](README.md#despliegue).

Respeta el [Código de Conducta](2026/codigo_conducta.html) en todas las interacciones del proyecto.
