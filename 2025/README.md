# Reflex App 🚀

Este proyecto utiliza **Reflex**, un framework moderno para construir aplicaciones web full-stack en Python de manera sencilla.

## 📦 Requisitos

- Python 3.8 o superior  
  Puedes descargarlo aquí: [https://www.python.org/downloads/](https://www.python.org/downloads/)  
  **Nota para Windows:** Se recomienda marcar la opción "Add Python to PATH" durante la instalación.

- pip (viene incluido con Python)  
- Git 
---

## 🔧 Instalación

### 1. Clonar este repositorio
    git clone https://github.com/pythonpanama/pycon_panama_web.git
    cd pycon_panama_web/2025

2. Crea y activa un entorno virtual

En Linux / macOS
    python3 -m venv .venv
    source .venv/bin/activate

En Windows (PowerShell)
    py -m venv .venv
    .\.venv\Scripts\Activate.ps1

En Windows (CMD)
    py -m venv .venv
    .\.venv\Scripts\activate.bat

3. Instalar dependencias
    pip install -r requirements.txt

4. Ejecuta la aplicación en modo desarrollo
reflex run

## 🚀 Cómo usar Reflex
1. Inicializa el proyecto (si aún no lo has hecho)

reflex init nombre_proyecto
cd nombre_proyecto

2. Ejecuta la aplicación en modo desarrollo
reflex run

Esto abrirá la aplicación en tu navegador en http://localhost:3000.

## 📁 Estructura del proyecto
```plaintext
├── assets/                     # Archivos estáticos (imágenes, CSS, JS)
│   ├── js/
│   ├── bootstrap.min.css
│   ├── styles.css
│   └── ...
│
├── my_first_page/             # Módulo principal de la app
│   ├── components/            # Componentes reutilizables
│   ├── styles/                # Archivos de estilo personalizados
│   ├── views/                 # Vistas o páginas
│   ├── __init__.py
│   ├── constants.py           # Constantes globales
│   └── my_first_page.py       # Archivo principal del frontend
│
├── public/                    # Archivos públicos (usualmente para deploy)
│
├── .states/                   # Estado persistente de Reflex
├── .web/                      # Archivos generados para la versión web
├── .venv/                     # Entorno virtual (no incluir en Git)
├── .gitignore
├── requirements.txt           # Dependencias del proyecto
├── rxconfig.py                # Configuración de Reflex
└── pyrightconfig.json         # Configuración opcional para Pyright (linter)
```

## 📚 Recursos
https://reflex.dev/
