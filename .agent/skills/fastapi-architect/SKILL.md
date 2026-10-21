---
name: fastapi-architect
description: >-
  Arquitectura limpia de backend en Python con FastAPI, Pydantic v2 y bases de
  datos SQL (SQLite/PostgreSQL). Úsala al crear, estructurar o optimizar APIs
  en Python y consultas de base de datos.
---

# FastAPI Architect (Backend Limpio en Python, FastAPI & SQL)

Evita que el código termine amontonado en un solo `main.py` gigante, con sintaxis obsoleta o con cuellos de botella en la base de datos.

## 1. Separación Estricta en Capas
Estructura el proyecto separando responsabilidades claramente:
- **`routers/` (Capa HTTP)**: Define endpoints (`APIRouter`), códigos de estado (`status_code`), inyección de dependencias (`Depends`) y manejo de `HTTPException`. **No pongas consultas SQL complejas ni lógica de negocio aquí.**
- **`schemas/` (Capa de Validación)**: Define contratos de entrada/salida (DTOs).
- **`services/` (Capa de Lógica de Negocio)**: Funciones o clases puras de dominio que orquestan reglas de negocio y transacciones.
- **`models/` y `database.py` (Capa de Persistencia)**: Modelos ORM / esquemas SQL y gestión de sesiones/conexiones.
- **`main.py` (Punto de Entrada Limpio)**: Solo inicializa la app FastAPI, middlewares (CORS), ciclo de vida (`lifespan`) y monta los routers (`app.include_router(...)`).

## 2. Exigencia de Pydantic v2 Moderno
- **Usa exclusivamente sintaxis de Pydantic v2**:
  - Configuración de modelos: `model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)` (prohibido usar `class Config: orm_mode = True`).
  - Serialización y validación: `.model_dump()`, `.model_validate()` (prohibido `.dict()` o `.from_orm()`).
  - Validadores: `@field_validator("campo")` y `@model_validator(mode="after")` (prohibido `@validator` de v1).
  - Restricciones con `Field(..., min_length=1, ge=0)`.

## 3. Optimización de SQLite / PostgreSQL
- **Modo WAL obligatorio en SQLite**: Al abrir la conexión o inicializar el engine de SQLite, ejecuta siempre:
  ```sql
  PRAGMA journal_mode=WAL;
  PRAGMA synchronous=NORMAL;
  PRAGMA foreign_keys=ON;
  PRAGMA busy_timeout=5000;
  ```
  Esto evita errores de base de datos bloqueada (`OperationalError: database is locked`) en lecturas/escrituras concurrentes.
- **Prevención de Consultas Lentas**:
  - Define índices (`INDEX`) en llaves foráneas y columnas usadas en cláusulas `WHERE` u `ORDER BY`.
  - Evita el problema `N+1` usando `selectinload` / `joinedload` o `JOIN` explícitos.
  - Cierra o libera siempre las sesiones mediante generadores con `yield` y bloques `try...finally` (o context managers).
