# PyCon Panamá — sitio web oficial

[![Sitio en producción](https://img.shields.io/badge/sitio-pycon.pa-3776AB?logo=googlechrome&logoColor=white)](https://pycon.pa/)
[![Edición activa](https://img.shields.io/badge/edici%C3%B3n-2026-FFD343?logo=python&logoColor=1f2937)](2026/)
[![Validación del sitio](https://github.com/pythonpanama/pycon_panama_web/actions/workflows/site-validation.yml/badge.svg)](https://github.com/pythonpanama/pycon_panama_web/actions/workflows/site-validation.yml)

Este repositorio contiene el sitio público de [PyCon Panamá](https://pycon.pa/), la conferencia de la comunidad [Python Panamá](https://pythonpanama.org). Es un sitio estático: cada edición se conserva en su propia carpeta y Netlify publica la raíz del repositorio.

**Producción:** [pycon.pa](https://pycon.pa/) · **Edición activa:** [2026](2026/) · **Contacto:** [pyconpanama@gmail.com](mailto:pyconpanama@gmail.com)

## Índice

- [Inicio rápido](#inicio-rápido)
- [Estructura y alcance](#estructura-y-alcance)
- [Cambiar el sitio](#cambiar-el-sitio)
- [Validar antes de proponer cambios](#validar-antes-de-proponer-cambios)
- [Despliegue](#despliegue)
- [Contribuir](#contribuir)
- [Documentación y contacto](#documentación-y-contacto)

## Inicio rápido

La edición activa no requiere Node.js, dependencias ni proceso de compilación; basta con Python 3 para servir los archivos localmente.

```bash
git clone https://github.com/pythonpanama/pycon_panama_web.git
cd pycon_panama_web
python3 -m http.server 8000
```

Abre [http://localhost:8000/2026/](http://localhost:8000/2026/).

Sirve desde la **raíz** del repositorio, no desde `2026/`: así las rutas absolutas, el favicon y las URLs de cada edición se comportan como en producción. Para detener el servidor, usa `Ctrl+C`.

## Estructura y alcance

| Ruta | Uso | ¿Se edita normalmente? |
| --- | --- | --- |
| [`2026/`](2026/) | Edición pública activa: HTML, CSS y JavaScript sin framework. | Sí |
| [`2027/`](2027/) | Export generado de una edición futura. | No, salvo regeneración deliberada |
| [`2025/`](2025/) y [`2024/`](2024/) | Ediciones archivadas. | No, excepto correcciones puntuales |
| [`2026_dev/`](2026_dev/README.md) | Prototipo independiente en Reflex; no se despliega desde aquí. | Solo si se trabaja en el prototipo |
| [`local_server/`](local_server/README.md) | Proxy opcional, limitado a `127.0.0.1`, para pruebas locales con Supabase. Usa una clave privilegiada. | Solo para desarrollo local; jamás se publica |
| [`netlify.toml`](netlify.toml) | Publicación, redirección de `/` a `/2026/` y cabeceras HTTP. | Con revisión cuidadosa |

Otros archivos de la raíz cumplen funciones de publicación: `404.html`, `robots.txt`, `sitemap.xml` y `favicon.ico`.

Este repositorio contiene solo el sitio. Todo lo que se versiona aquí se publica: `netlify.toml` despliega la raíz completa, así que no añadas al control de versiones archivos que no deban ser públicos ni los enlaces desde las páginas. La información pública se mantiene en las páginas de la edición correspondiente.

El repositorio no contiene submódulos: trabaja siempre en esta raíz. Así se evita editar una copia anidada y desactualizada del sitio.

## Cambiar el sitio

1. Crea una rama desde `main` y delimita el cambio a una edición o propósito claro.
2. Para contenido de 2026, modifica los archivos de [`2026/`](2026/). Conserva la estructura semántica y los estilos compartidos en `2026/css/`.
3. Si cambias navegación, aplícala en **todas** las páginas públicas de `2026/`: `index.html`, `about.html`, `agenda.html`, `sedes.html`, `codigo_conducta.html`, `patrocinadores.html`, `faq.html`, `registro.html` y `speaker.html`.
4. Si agregas una página pública, parte de una existente para mantener `lang`, `viewport`, favicon, hojas de estilo, `canonical`, metadatos Open Graph y el enlace al Código de Conducta. Añade además la URL a `sitemap.xml` y la navegación donde corresponda.
5. Mantén las fechas, sede, precios, CFP y beneficios como “por anunciar” hasta contar con confirmación pública. No publiques notas operativas, datos personales ni decisiones pendientes.

### Patrocinadores

La lista vive en [`2026/patrocinadores.html`](2026/patrocinadores.html) como HTML plano, sin fuente de datos aparte: el orden de los niveles y de las marcas dentro de cada nivel es el que aprueba el Comité Organizador, y se lee tal cual en el archivo. El procedimiento completo —dónde va el logo, qué formato, cómo se escribe el `alt`, cómo se marca una marca acordada pero aún sin anuncio y cómo se retira una— está en un comentario al inicio de la sección, junto a la plantilla que se copia.

> [!WARNING]
> Aquí solo entra lo que el Comité Organizador confirmó por escrito. Una negociación avanzada no es una confirmación, y publicar una marca sin autorización es un problema legal, no un detalle de diseño. Para lo acordado sin anuncio público está la variante `.sponsor-card--pending`, que reserva el espacio sin mostrar logo ni nombre.

Los logos van en `2026/img/patrocinadores/`, en SVG cuando exista y en PNG con fondo transparente cuando no. Al retirar un patrocinador, borra también su archivo.

### Prototipo Reflex

El prototipo de `2026_dev/` tiene su propio ciclo de desarrollo y dependencias:

```bash
cd 2026_dev
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
reflex run
```

Consulta [su README](2026_dev/README.md) antes de modificarlo. Un cambio en el prototipo no cambia por sí mismo el sitio estático publicado.

## Validar antes de proponer cambios

La edición estática no requiere compilación. El validador incluido comprueba enlaces locales, fragmentos, metadatos sociales, URLs canónicas, el sitemap, marcadores de conflicto y las URLs HTTP(S) únicas de terceros. Antes de abrir un Pull Request, ejecuta:

```bash
# 1. Comprueba la integridad del sitio público, incluidos enlaces externos.
python3 scripts/validate_site.py

# 2. Evita errores de espacios y líneas finales.
git diff --check

# 3. Confirma que el servidor responde para la edición publicada.
python3 -m http.server 8000
# En otra terminal:
curl -I http://localhost:8000/2026/
```

Si el validador reporta un enlace externo caído:

1. Ábrelo en el navegador. Si no carga, corrige o retira el `href`/`src`.
2. Las URLs de `pycon.pa` se resuelven contra archivos del repositorio, no contra producción, para no romper PRs de páginas nuevas.
3. Instagram, Facebook, LinkedIn, Meetup y pylatam.org están excluidos a propósito: bloquean rastreadores de CI o no responden a tiempo desde GitHub Actions. Si otro host se comporta igual, añádelo a `SKIP_EXTERNAL_HOSTS` en `scripts/validate_site.py` con un comentario que justifique la exclusión.
4. Sin red: `python3 scripts/validate_site.py --skip-external`.

Después, revisa en el navegador la página afectada en escritorio y móvil: navegación, enlaces, imágenes, contraste, foco de teclado y diseño con zoom. Si cambias contenido o rutas, verifica también `sitemap.xml`, el `canonical` y las tarjetas sociales (`og:*`).

Antes de enviar cambios, revisa el alcance exacto:

```bash
git status --short
git diff --check
git diff -- 2026/ netlify.toml sitemap.xml robots.txt
```

## Despliegue

Netlify publica la raíz del repositorio (`publish = "."`) según [`netlify.toml`](netlify.toml). La configuración redirige `/` a `/2026/` y define cabeceras de seguridad para el sitio.

El flujo esperado es:

1. Abrir un Pull Request con una descripción breve, la página o edición afectada y cómo se validó.
2. Revisar el preview de Netlify si está disponible para el repositorio.
3. Integrar en `main` tras la revisión correspondiente; Netlify realiza la publicación configurada.
4. Confirmar en producción la ruta modificada y, si aplica, la redirección raíz.

No modifiques `netlify.toml` para cambiar la edición activa ni para publicar rutas adicionales sin una decisión explícita del equipo organizador.

## Contribuir

Las contribuciones son bienvenidas, especialmente correcciones de contenido, accesibilidad, enlaces y mantenimiento del sitio.

- Usa una rama con un nombre descriptivo y commits pequeños que expliquen el cambio.
- No mezcles una mejora de la edición activa con cambios generados, archivos locales o correcciones de una edición archivada.
- Escribe la documentación en Markdown con formato completo: encabezados jerárquicos, tablas para lo que tenga fecha o responsable, avisos `> [!NOTE]` y `> [!WARNING]`, bloques de código con el lenguaje declarado y enlaces relativos con texto descriptivo. Sella la fecha de última actualización en cada documento que edites.
- Respeta el [Código de Conducta](2026/codigo_conducta.html) en toda interacción del proyecto.
- No hay una licencia general declarada en la raíz del repositorio. Consulta al equipo antes de reutilizar contenido o recursos fuera de este proyecto.

## Documentación y contacto

- [Edición 2026](2026/): sitio actualmente publicado.
- [Prototipo Reflex 2026](2026_dev/README.md): aplicación experimental, fuera del despliegue estático.
- [Python Panamá](https://pythonpanama.org) · [Instagram](https://www.instagram.com/pythonpanama/) · [Facebook](https://www.facebook.com/profile.php?id=100078380970388) · [LinkedIn](https://linkedin.com/company/pythonpanama) · [Meetup](https://www.meetup.com/python-panama/)

Para consultas sobre PyCon Panamá, escribe a [pyconpanama@gmail.com](mailto:pyconpanama@gmail.com).
