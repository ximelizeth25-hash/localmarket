---
name: git-pro-workflow
description: >-
  Flujo de trabajo profesional con Git: Conventional Commits, commits atómicos
  y prevención de subida de credenciales o archivos basura. Úsala siempre que
  ejecutes git add, git commit, configures .gitignore o gestiones ramas.
---

# Git Pro Workflow (Control de Versiones Profesional)

Garantiza un historial de Git limpio, auditable y seguro en todos los proyectos.

## 1. Conventional Commits Obligatorios
- **Prohibidos los mensajes de commit genéricos** como `"arreglos de hoy"`, `"update"`, `"cambios"`, `"fix bug"` o `"wip"`.
- Usa siempre el estándar **Conventional Commits**:
  ```text
  <tipo>(<alcance-opcional>): <descripción concisa en imperativo>
  ```
- **Tipos permitidos**:
  - `feat:` Nueva funcionalidad para el usuario.
  - `fix:` Corrección de un bug o error.
  - `refactor:` Mejora de estructura de código sin cambiar comportamiento externo.
  - `docs:` Cambios exclusivos en documentación (`README.md`, comentarios, guías).
  - `style:` Formato, estilos UI/CSS o linting sin cambios de lógica.
  - `perf:` Optimización de rendimiento o consultas.
  - `test:` Adición o corrección de pruebas automatizadas.
  - `chore:` / `build:` Configuración de herramientas, dependencias o scripts de compilación.

## 2. Commits Atómicos
- Cada commit debe representar **un único cambio lógico y puntual** que deje el proyecto funcionando.
- No mezcles en un mismo commit una refactorización de base de datos, un cambio de diseño CSS y una corrección de un bug distinto; sepáralos en commits atómicos individuales.

## 3. Prevención Estricta de Archivos Basura y Credenciales
- Antes de hacer `git add` o `git commit`, revisa siempre `git status` y verifica que exista un `.gitignore` adecuado.
- **Jamás subas al repositorio**:
  - Variables de entorno y secretos: `.env`, `.env.*`, `*.pem`, `*.key`, `credentials.json`, tokens o API keys hardcodeadas.
  - Dependencias y entornos virtuales: `node_modules/`, `.venv/`, `venv/`, `env/`.
  - Cachés y compilados: `__pycache__/`, `*.pyc`, `.pytest_cache/`, `dist/`, `build/`, `*.spec`, `.next/`.
  - Archivos temporales, logs o bases de datos locales: `*.log`, `*.sqlite3`, `*.db-wal`, `*.db-shm`, `.DS_Store`, `Thumbs.db`.
