---
name: docker-packager
description: >-
  Empaquetado profesional de aplicaciones de escritorio (.exe con PyInstaller)
  y contenedores Docker ligeros. Úsala al compilar ejecutables de Python o
  crear/optimizar archivos Dockerfile y docker-compose.
---

# Docker & Desktop Packager (.exe y Contenedores)

Resuelve rutas de archivos rotas al compilar un `.exe` con PyInstaller y evita contenedores Docker pesados o lentos de compilar.

## 1. Empaquetado de Apps de Escritorio `.exe` (PyInstaller)

### Manejo Seguro de Rutas con `sys._MEIPASS`
Cuando PyInstaller empaqueta una app (especialmente con `--onefile`), descomprime los recursos estáticos (iconos, imágenes, plantillas, certificados) en una carpeta temporal cuya ruta se almacena en `sys._MEIPASS`.
- **Nunca uses rutas relativas directas** como `open("assets/logo.png")` para recursos empaquetados.
- **Usa siempre esta función helper estándar**:
  ```python
  import os
  import sys

  def resource_path(relative_path: str) -> str:
      """Obtiene la ruta absoluta al recurso, compatible con dev y con PyInstaller (.exe)."""
      base_path = getattr(sys, "_MEIPASS", os.path.abspath("."))
      return os.path.join(base_path, relative_path)
  ```
- **Datos de escritura (SQLite, logs, configuración del usuario)**: No escribas archivos modificables dentro de `sys._MEIPASS` (se borra al cerrar el `.exe`). Guárdalos junto al ejecutable (`os.path.dirname(sys.executable)` si `getattr(sys, 'frozen', False)`) o en `os.getenv("APPDATA")`.

## 2. Contenedores Docker Ligeros y Rápidos

### Reglas de Optimización de `Dockerfile`
1. **Imagen Base Ligera**: Usa `python:3.12-slim` (o multi-stage builds) en lugar de imágenes completas pesadas.
2. **Variables de Entorno de Python**:
   ```dockerfile
   ENV PYTHONDONTWRITEBYTECODE=1 \
       PYTHONUNBUFFERED=1 \
       PIP_NO_CACHE_DIR=1 \
       PIP_DISABLE_PIP_VERSION_CHECK=1
   ```
3. **Orden de Capas Optimizado para Caché**:
   - Copia **primero** únicamente `requirements.txt` (o `pyproject.toml`) y ejecuta `pip install`.
   - Copia el resto del código fuente (`COPY . .`) **después** de instalar dependencias, para que cambiar una línea de código no obligue a reinstalar todos los paquetes.
4. **Archivo `.dockerignore` Obligatorio**: Excluye siempre `.git`, `.venv`, `venv`, `__pycache__`, `*.pyc`, `.env`, `node_modules`, `dist` y `build`.
