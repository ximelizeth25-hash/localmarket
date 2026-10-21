---
name: xlsx-pdf-pro
description: >-
  Generación de reportes profesionales en Excel (.xlsx con openpyxl) y
  documentos PDF estructurados listos para entrega ejecutiva. Úsala siempre que
  exportes hojas de cálculo, reportes financieros, inventarios o PDFs.
---

# XLSX & PDF Pro (Reportes en Excel y PDF para Entrega)

Prohibido entregar hojas de cálculo sin formato (texto plano desalineado, columnas cortadas o sumas estáticas) o PDFs mal paginados.

## 1. Estándar Ejecutivo en Excel (`openpyxl`)

Cuando generes archivos `.xlsx` con `openpyxl`, aplica siempre estas reglas:

1. **Encabezados con Color y Contraste**:
   - Aplica relleno sólido corporativo (`PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid")`), fuente blanca en negrita (`Font(name="Calibri", size=11, bold=True, color="FFFFFF")`), alineación centrada/izquierda y fija la fila superior (`ws.freeze_panes = "A2"`).
2. **Bordes y Filas Alternadas (Zebra Striping)**:
   - Aplica bordes delgados sutiles (`Side(style="thin", color="CBD5E1")`) en las celdas de datos y un color de fondo suave alternado en filas pares (`#F8FAFC`) para facilitar la lectura.
3. **Formato Numérico y de Moneda Explícito**:
   - Moneda / precios / importes: `cell.number_format = '$#,##0.00'`
   - Cantidades enteras: `cell.number_format = '#,##0'`
   - Porcentajes: `cell.number_format = '0.00%'`
   - Fechas: `cell.number_format = 'YYYY-MM-DD'`
4. **Fórmulas Reales de Excel (No Valores Estáticos)**:
   - En las filas de totales o resúmenes, inserta **fórmulas reales de Excel** como `=SUM(D2:D50)` o `=AVERAGE(D2:D50)` en lugar de escribir el número calculado en Python, aplicando estilo de fila de total (negrita y borde superior delgado + borde inferior doble `double`).
5. **Auto-ajuste de Ancho de Columnas**:
   - Recorre todas las columnas al finalizar y ajusta `ws.column_dimensions[col_letter].width = max(max_len + 4, 12)` para que ningún encabezado ni cifra aparezca cortado con `###`.

## 2. Documentos PDF Estructurados
- **Jerarquía y Portada/Encabezado**: Incluye título del reporte, fecha de generación, metadatos clave y numeración de páginas (`Página X de Y`).
- **Paginación Limpia**:
  - Repite automáticamente el encabezado de las tablas cuando una tabla se divida entre dos páginas (`repeatRows=1` en ReportLab o `thead { display: table-header-group; }` en HTML-to-PDF).
  - Evita títulos huérfanos al final de una página (`keepWithNext = True` / `page-break-after: avoid`).
  - Alinea las columnas numéricas a la derecha con fuente tabular y las columnas de texto a la izquierda.
