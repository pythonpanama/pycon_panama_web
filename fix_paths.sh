#!/bin/bash

# Carpeta donde está tu sitio 2025
TARGET_DIR="./2025"

# Prefijo que necesitas agregar a las rutas
BASE_PATH="/2025"

# Archivos que quieres modificar (todos los .html)
FILES=$(find "$TARGET_DIR" -type f -name "*.html")

echo "Reescribiendo rutas en archivos HTML dentro de $TARGET_DIR ..."

for FILE in $FILES; do
  echo "Procesando: $FILE"

  # Reemplazar rutas absolutas comunes por la versión con prefijo
  sed -i \
    -e "s|href=\"/|href=\"${BASE_PATH}/|g" \
    -e "s|src=\"/|src=\"${BASE_PATH}/|g" \
    -e "s|url(\"/|url(\"${BASE_PATH}/|g" \
    "$FILE"

  # Eliminar bloque Built with Reflex completo
  find "$TARGET_DIR" -type f -name "*.html" -exec \
  sed -i '/Built with Reflex/{N;d;}' {} \;
done

echo "✅ Rutas actualizadas con prefijo $BASE_PATH en todos los HTML."

echo "🔧 Reescribiendo rutas en archivos CSS dentro de $TARGET_DIR ..."

# Reemplazar url('/...') en archivos CSS
find "$TARGET_DIR" -type f -name "*.css" | while read FILE; do
  echo "Procesando CSS: $FILE"
  sed -i \
    -e "s|url('/|url('${BASE_PATH}/|g" \
    -e "s|url(\"/|url(\"${BASE_PATH}/|g" \
    "$FILE"
done

echo "✅ Todas las rutas fueron actualizadas con prefijo $BASE_PATH."
