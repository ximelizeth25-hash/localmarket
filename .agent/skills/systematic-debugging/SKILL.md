---
name: systematic-debugging
description: >-
  Metodología estricta y quirúrgica de solución de errores y bugs. Úsala siempre
  que aparezca un error, excepción, fallo en tests o comportamiento inesperado
  antes de modificar cualquier archivo.
---

# Systematic Debugging (Metodología Estricta de Solución de Errores)

**Regla de Oro**: Queda **estrictamente prohibido modificar código a ciegas**, "adivinar" cambiando 4 archivos a la vez, romper funcionalidad que ya servía o quemar tokens probando parches al azar.

## Protocolo Obligatorio en 4 Pasos

### Paso 1: Aislar el Traceback y el Síntoma Exacto
- Lee el mensaje de error completo, la pila de llamadas (traceback/stack trace), el archivo exacto y el número de línea donde se origina el fallo.
- Distingue entre la línea donde explota el error y la línea donde se originó el estado inválido.

### Paso 2: Rastrear el Dato (Data Flow Tracing)
- Sigue el recorrido de la variable, payload o estado desde su entrada (request, archivo, base de datos, evento UI) hasta el punto exacto del fallo.
- Verifica tipos de datos, valores `null`/`None`/`undefined`, llaves faltantes o condiciones de carrera leyendo únicamente las funciones involucradas.

### Paso 3: Plantear UNA Sola Hipótesis Verificable
- Formula explícitamente **una única hipótesis** basada en la evidencia recolectada:
  > *"El error ocurre porque `X` recibe `None` cuando `Y` no encuentra el registro en la línea `Z`."*
- Si necesitas confirmar la hipótesis, ejecuta una verificación mínima (test puntual, comando de inspección o lectura de línea) antes de tocar el código de producción.

### Paso 4: Corrección Quirúrgica
- Aplica el cambio **únicamente en las líneas exactas** que resuelven la causa raíz.
- No refactorices código no relacionado ni alteres archivos adicionales "por si acaso".
- Verifica inmediatamente que el error desapareció y que el flujo adyacente sigue funcionando.
