---
name: token-saver-plan
description: >-
  Ahorro extremo de tokens, lectura selectiva de archivos y ediciones
  quirúrgicas por bloque. Aplica estos principios para optimizar el uso de
  contexto, evitar lecturas innecesarias y generar respuestas concisas.
---

# Token Saver Plan (Ahorro Extremo de Tokens)

Optimiza al máximo el consumo de contexto, velocidad de ejecución y cuota de mensajes sin sacrificar precisión técnica.

## 1. Prohibido Leer Archivos Gigantes Completos sin Necesidad
- **No leas archivos completos de 500+ líneas** si solo necesitas inspeccionar o modificar una función o bloque puntual.
- Usa primero herramientas de búsqueda (`grep` / búsqueda de símbolos) para identificar el número de línea exacto y luego lee únicamente el rango necesario (`StartLine` y `EndLine` con un margen de ~20-40 líneas).

## 2. Reemplazos Quirúrgicos por Bloque
- **Prioriza siempre ediciones por bloque (`edit_file`)** sobre reescribir archivos enteros (`write_file`).
- Solo usa `write_file` cuando crees un archivo desde cero o cuando más del 80% del archivo corto cambie por completo.

## 3. Respuestas Concisas y Directas al Grano
- Evita introducciones largas, resúmenes redundantes o repetir bloques enteros de código en el chat que el usuario ya tiene en su editor.
- Explica de forma breve qué se hizo, enlaza los archivos/líneas modificadas y presenta solo la información accionable.
