---
name: claude-ui
description: >-
  Super Skill fusionada (Claude + Tailwind UI-Skills) para diseño de interfaces
  refinado estilo Linear, Stripe o Vercel. Úsala siempre que crees o modifiques
  interfaces web, componentes UI, dashboards o estilos con CSS/Tailwind para
  evitar el diseño genérico de IA.
---

# Claude UI (Linear / Stripe / Vercel Aesthetic)

Guía estricta de ingeniería de diseño para evitar el "diseño genérico de IA" y producir interfaces con acabado de producto de primer nivel (Linear, Stripe, Vercel, Raycast).

## 1. Qué Evitar Estrictamente (Anti-Patrones de IA)
- **Prohibidos los fondos morados/rosas/cian en degradado** sin propósito (`bg-gradient-to-r from-purple-500 to-pink-500`).
- **Prohibidos los botones azules gigantes** desproporcionados o con sombras brillantes irreales.
- **Prohibidas las tarjetas flotando con sombras toscas y pesadas** (`shadow-xl`, `shadow-2xl` sobre fondos grises planos).

## 2. Reglas de Diseño Refinado

### Jerarquía Tipográfica Estricta y Micro-interacciones
- **Títulos y encabezados**: Usa `tracking-tight` (`letter-spacing: -0.025em`), pesos semibold/medium (`font-semibold` o `font-medium`) y alto contraste.
- **Jerarquía de texto**: Diferencia claramente entre texto primario (`text-zinc-900` / `dark:text-zinc-100`), secundario (`text-zinc-600` / `dark:text-zinc-400`) y metadatos sutiles (`text-zinc-400` / `dark:text-zinc-500`).
- **Micro-interacciones suaves**: Transiciones rápidas y precisas (`transition-all duration-150 ease-out`), estados de foco accesibles (`focus-visible:ring-2 focus-visible:ring-zinc-400/50`) y feedback táctil en botones (`active:scale-[0.98]`).

### Bordes Sutiles en vez de Sombras Pesadas
- Delimita superficies mediante **bordes de 1px sutiles** en lugar de sombras borrosas:
  - Modo oscuro: `border border-white/10` (con hover `hover:border-white/20`) sobre fondos `bg-zinc-900/60` o `bg-zinc-950`.
  - Modo claro: `border border-zinc-200/80` (con hover `hover:border-zinc-300`) sobre fondos `bg-white` o `bg-zinc-50/50`.
- Si usas sombra, limítala a `shadow-xs` o `shadow-sm` muy controlada.

### Números y Precios Tabulares (`tabular-nums`)
- **Obligatorio** en tablas, precios, métricas de dashboards, contadores, temporizadores y listas financieras:
  - Aplica la clase `tabular-nums` (`font-variant-numeric: tabular-nums;`) para que todos los dígitos ocupen el mismo ancho horizontal y las columnas queden perfectamente alineadas.

### Radios Concéntricos Armónicos
- Cuando un elemento con borde redondeado está dentro de una tarjeta o contenedor con padding, calcula el radio interno de forma concéntrica:
  $$\text{Radio Exterior} = \text{Radio Interior} + \text{Padding}$$
- **Ejemplo práctico**:
  - Contenedor externo: `rounded-2xl` (`16px`) con `p-2` (`8px`).
  - Elemento interno (imagen, botón, sub-tarjeta): `rounded-lg` (`8px`).
  - Esto evita esquinas pellizcadas o visualmente desalineadas.
