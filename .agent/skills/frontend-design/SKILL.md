---
name: frontend-design
description: >-
  Dirección de Arte y diseño frontend (Oficial de Anthropic). Úsala al diseñar
  nuevas páginas, aplicaciones web, componentes visuales o textos de interfaz
  para planificar paletas deliberadas, tipografías con carácter y microcopy en
  voz activa.
---

# Frontend Design (Art Director Workflow)

Actúa como **Director de Arte y Diseñador de Producto Senior** antes de escribir código de interfaz. Evita interfaces planas sin personalidad y textos de relleno sin sentido.

## 1. Planificación de Paleta Deliberada (4 a 6 Colores)
Antes de maquetar, define explícitamente en variables CSS (`:root`) o configuración de tema una paleta cohesiva de **4 a 6 colores deliberados**:
1. **Superficie Base (Background)**: Neutro con matiz sutil (ej. piedra cálida, pizarra profunda o marfil limpio, evitando `#000000` o `#ffffff` puros sin contexto).
2. **Superficie Elevada (Cards / Panels)**: Tono ligeramente diferenciado para jerarquía espacial.
3. **Texto Primario**: Alto contraste legible (WCAG AA/AAA).
4. **Texto Secundario / Muted**: Tono medio armónico con la superficie base.
5. **Color de Acento Primario**: Un único color protagonista con intención semántica y de marca.
6. **Acento Secundario / Estados**: Variación controlada para estados activos, bordes destacados o indicadores.

## 2. Tipografías con Carácter según la Temática
- No recurras por defecto a `Arial` o `Roboto` sin pensarlo.
- Selecciona una combinación tipográfica con personalidad acorde al dominio del proyecto:
  - **Editorial / Lujo / Cultura**: Serif expresiva en títulos (`Playfair Display`, `Instrument Serif`, `Newsreader`) + Sans geométrica limpia en cuerpo (`Plus Jakarta Sans`, `Inter`).
  - **SaaS Técnico / Finanzas / DevTools**: Sans de ingeniería precisa (`Geist`, `Inter`, `Space Grotesk`) + Monospace técnica (`JetBrains Mono`, `Geist Mono`) para datos, IDs y cifras.
  - **Comercio / Producto Moderno**: Sans cálida y humanista (`DM Sans`, `Outfit`, `Satoshi`).

## 3. Redacción UX (Microcopy) en Voz Activa
- **Prohibido usar texto de relleno sin sentido** (`Lorem ipsum`, `Texto de prueba`, `Item 1, Item 2`). Redacta contenido realista del dominio.
- **Voz activa orientada al beneficio del usuario final** en botones, etiquetas, estados vacíos y mensajes de confirmación:
  - Usa `"Guardar cambios"`, `"Crear cuenta gratis"`, `"Exportar reporte en PDF"`, `"Eliminar proyecto"` en vez de verbos vagos como `"Enviar"`, `"Submit"`, `"OK"` o `"Aceptar"`.
  - En estados vacíos o de error, explica qué ocurrió y ofrece la acción inmediata para resolverlo.
