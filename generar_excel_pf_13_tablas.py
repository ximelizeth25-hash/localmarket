"""
Script Profesional de Metricas de Software: Analisis Exhaustivo de Puntos de Funcion (IFPUG / Albrecht)
Generacion del Libro Excel Completo basado en la plantilla oficial 'PuntosDeFuncion.DOC'
Mapeo de las 13 TABLAS REALES de la Base de Datos LocalMarket:
1. usuarios
2. roles
3. verificaciones_otp
4. categorias
5. productos
6. imagenes_producto
7. carrito
8. detalle_carrito
9. pedidos
10. detalle_pedidos
11. notificaciones
12. bitacora_seguridad
13. control_suspensiones
"""

import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def crear_libro_puntos_de_funcion():
    wb = openpyxl.Workbook()
    # Remover hoja por defecto
    default_sheet = wb.active
    wb.remove(default_sheet)

    # =========================================================================
    # PALETA DE ESTILOS PROFESIONALES (Azul Marino #1F4E78, Totales Verdes #E2F0D9)
    # =========================================================================
    COLOR_AZUL_HDR = "1F4E78"       # Azul corporativo solicitado
    COLOR_AZUL_SUB = "2F5597"       # Azul secundario para subsecciones
    COLOR_AZUL_LIGHT = "D9E1F2"     # Azul suave para subtotales
    COLOR_AZUL_ACCENT = "41719C"    # Azul intermedio
    COLOR_VERDE_TOT = "E2F0D9"      # Verde pastel para totales
    COLOR_VERDE_TEXT = "1E4620"     # Verde oscuro para texto de totales
    COLOR_VERDE_ACCENT = "385723"   # Verde fuerte para bordes de total
    COLOR_ZEBRA = "F9FAFB"          # Fondo alterno suave
    COLOR_BORDER = "D9D9D9"         # Borde gris sutil
    COLOR_CARD_BG = "F2F5F9"        # Fondo para tarjetas KPI

    font_title = Font(name="Calibri", size=14, bold=True, color="FFFFFF")
    font_subtitle = Font(name="Calibri", size=10, italic=True, color="404040")
    font_section = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    font_subsection = Font(name="Calibri", size=10, bold=True, color="FFFFFF")
    font_tbl_header = Font(name="Calibri", size=10, bold=True, color="FFFFFF")
    font_data = Font(name="Calibri", size=10, color="000000")
    font_data_bold = Font(name="Calibri", size=10, bold=True, color="000000")
    font_subtotal = Font(name="Calibri", size=10, bold=True, color="1F4E78")
    font_total_green = Font(name="Calibri", size=11, bold=True, color=COLOR_VERDE_TEXT)
    font_kpi_val = Font(name="Calibri", size=18, bold=True, color="1F4E78")
    font_kpi_lbl = Font(name="Calibri", size=9, bold=True, color="595959")

    fill_title = PatternFill(start_color=COLOR_AZUL_HDR, end_color=COLOR_AZUL_HDR, fill_type="solid")
    fill_section = PatternFill(start_color=COLOR_AZUL_SUB, end_color=COLOR_AZUL_SUB, fill_type="solid")
    fill_subsection = PatternFill(start_color=COLOR_AZUL_ACCENT, end_color=COLOR_AZUL_ACCENT, fill_type="solid")
    fill_tbl_header = PatternFill(start_color=COLOR_AZUL_HDR, end_color=COLOR_AZUL_HDR, fill_type="solid")
    fill_subtotal = PatternFill(start_color=COLOR_AZUL_LIGHT, end_color=COLOR_AZUL_LIGHT, fill_type="solid")
    fill_total_green = PatternFill(start_color=COLOR_VERDE_TOT, end_color=COLOR_VERDE_TOT, fill_type="solid")
    fill_zebra = PatternFill(start_color=COLOR_ZEBRA, end_color=COLOR_ZEBRA, fill_type="solid")
    fill_card = PatternFill(start_color=COLOR_CARD_BG, end_color=COLOR_CARD_BG, fill_type="solid")

    thin_border = Side(style="thin", color=COLOR_BORDER)
    border_cell = Border(left=thin_border, right=thin_border, top=thin_border, bottom=thin_border)
    
    border_subtotal = Border(
        top=Side(style="thin", color="1F4E78"),
        bottom=Side(style="double", color="1F4E78"),
        left=thin_border,
        right=thin_border
    )

    border_total_green = Border(
        top=Side(style="thin", color=COLOR_VERDE_ACCENT),
        bottom=Side(style="double", color=COLOR_VERDE_ACCENT),
        left=thin_border,
        right=thin_border
    )

    border_card = Border(
        top=Side(style="medium", color=COLOR_AZUL_HDR),
        bottom=Side(style="thin", color=COLOR_BORDER),
        left=Side(style="thin", color=COLOR_BORDER),
        right=Side(style="thin", color=COLOR_BORDER)
    )

    # =========================================================================
    # HOJA 1: RESUMEN EJECUTIVO (Dashboard KPI y Metadatos del Sistema)
    # =========================================================================
    ws_kpi = wb.create_sheet(title="Resumen Ejecutivo")
    ws_kpi.views.sheetView[0].showGridLines = True

    # Encabezado Principal
    ws_kpi.merge_cells("A1:G1")
    t0 = ws_kpi["A1"]
    t0.value = "LOCALMARKET PWA - INFORME EJECUTIVO DE METRICAS DE SOFTWARE"
    t0.font = font_title
    t0.fill = fill_title
    t0.alignment = Alignment(horizontal="center", vertical="center")
    ws_kpi.row_dimensions[1].height = 36

    ws_kpi.merge_cells("A2:G2")
    s0 = ws_kpi["A2"]
    s0.value = "Estimacion de Tamano Funcional mediante Analisis de Puntos de Funcion (IFPUG / Modelo de Albrecht)"
    s0.font = font_subtitle
    s0.alignment = Alignment(horizontal="center", vertical="center")
    ws_kpi.row_dimensions[2].height = 20

    # Tarjetas KPI Superiores (Fila 4 a 6)
    kpis = [
        ("TABLAS DE BD ANALIZADAS", "13 Tablas", "Modelo Relacional Completo", 1, 2),
        ("TOTAL TRANSACCIONES", "100 Funciones", "EI, EO, EQ, ILF y EIF", 3, 4),
        ("TOTAL PFNA (NO AJUSTADOS)", "='Consolidado PFNA'!H18", "Puntos Funcionales Brutos", 5, 5),
        ("FACTOR DE AJUSTE (CAF)", "='PF Ajustados'!B26", "14 Factores de Albrecht", 6, 6),
        ("TOTAL PFA (AJUSTADOS)", "='PF Ajustados'!B27", "Tamano Funcional Final", 7, 7)
    ]

    for title, val, note, c_start, c_end in kpis:
        # Titulo KPI
        ws_kpi.merge_cells(start_row=4, start_column=c_start, end_row=4, end_column=c_end)
        c_t = ws_kpi.cell(row=4, column=c_start, value=title)
        c_t.font = font_kpi_lbl
        c_t.fill = fill_card
        c_t.alignment = Alignment(horizontal="center", vertical="center")
        
        # Valor KPI
        ws_kpi.merge_cells(start_row=5, start_column=c_start, end_row=5, end_column=c_end)
        c_v = ws_kpi.cell(row=5, column=c_start, value=val)
        c_v.font = font_kpi_val
        c_v.fill = fill_card
        c_v.alignment = Alignment(horizontal="center", vertical="center")
        if val.startswith("="):
            c_v.number_format = "0.00"

        # Nota KPI
        ws_kpi.merge_cells(start_row=6, start_column=c_start, end_row=6, end_column=c_end)
        c_n = ws_kpi.cell(row=6, column=c_start, value=note)
        c_n.font = Font(name="Calibri", size=8, italic=True, color="7F7F7F")
        c_n.fill = fill_card
        c_n.alignment = Alignment(horizontal="center", vertical="center")

        # Bordes para la tarjeta
        for r in range(4, 7):
            for col in range(c_start, c_end + 1):
                ws_kpi.cell(row=r, column=col).border = border_cell

    ws_kpi.row_dimensions[4].height = 18
    ws_kpi.row_dimensions[5].height = 30
    ws_kpi.row_dimensions[6].height = 16

    # Ficha Tecnica del Proyecto
    r_k = 8
    ws_kpi.merge_cells(start_row=r_k, start_column=1, end_row=r_k, end_column=7)
    sec_ft = ws_kpi.cell(row=r_k, column=1, value="1. FICHA TECNICA DEL SISTEMA ANALIZADO")
    sec_ft.font = font_section
    sec_ft.fill = fill_section
    sec_ft.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_kpi.row_dimensions[r_k].height = 24
    r_k += 1

    ft_items = [
        ("Sistema / Software", "LocalMarket - Plataforma Web Progresiva (PWA) de Comercio Local"),
        ("Arquitectura del Sistema", "Node.js, Express, PostgreSQL 18, Service Workers PWA, CSS/Tailwind UI"),
        ("Ambito de Metricas", "13 Tablas Principales de la Base de Datos Relacional y sus Interacciones"),
        ("Metodologia Aplicada", "Metricas de Puntos de Funcion (IFPUG FPA Release 4.3 / Modelo de Ajuste de Albrecht)"),
        ("Documento Base de Referencia", "Plantilla oficial estandarizada 'PuntosDeFuncion.DOC'"),
        ("Objetivo del Estudio", "Cuantificar el tamano funcional del software, evaluar la complejidad tecnica y estimar el esfuerzo de desarrollo")
    ]

    for item, desc in ft_items:
        ws_kpi.cell(row=r_k, column=1, value=item).font = font_data_bold
        ws_kpi.cell(row=r_k, column=1).border = border_cell
        ws_kpi.merge_cells(start_row=r_k, start_column=2, end_row=r_k, end_column=7)
        c_desc = ws_kpi.cell(row=r_k, column=2, value=desc)
        c_desc.font = font_data
        c_desc.border = border_cell
        for col in range(3, 8):
            ws_kpi.cell(row=r_k, column=col).border = border_cell
        ws_kpi.row_dimensions[r_k].height = 20
        r_k += 1

    r_k += 1

    # Tabla Resumen de Puntos Funcionales por Tipo de Componente
    ws_kpi.merge_cells(start_row=r_k, start_column=1, end_row=r_k, end_column=7)
    sec_comp = ws_kpi.cell(row=r_k, column=1, value="2. DISTRIBUCION DEL TAMANO FUNCIONAL POR TIPO DE COMPONENTE")
    sec_comp.font = font_section
    sec_comp.fill = fill_section
    sec_comp.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_kpi.row_dimensions[r_k].height = 24
    r_k += 1

    comp_headers = ["Tipo de Componente Funcional", "Sigla", "Descripcion Operativa", "Total Elementos", "Puntos PFNA", "% del Sistema", "Complejidad Predominante"]
    for c_i, h in enumerate(comp_headers, 1):
        c = ws_kpi.cell(row=r_k, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_tbl_header
        c.alignment = Alignment(horizontal="center", vertical="center")
        c.border = border_cell
    ws_kpi.row_dimensions[r_k].height = 22
    r_k += 1

    comp_rows = [
        ("Entradas Externas", "EI", "Transacciones de altas, bajas y modificaciones en tablas", 39, "='Consolidado PFNA'!C18", "=E18/'Consolidado PFNA'!H18", "Bajo - Medio (3-4 PF)"),
        ("Salidas Externas", "EO", "Informes y reportes con calculos derivados y formulas", 16, "='Consolidado PFNA'!D18", "=E19/'Consolidado PFNA'!H18", "Medio (5 PF)"),
        ("Peticiones / Consultas", "EQ", "Consultas directas sin calculos derivados y filtros", 19, "='Consolidado PFNA'!E18", "=E20/'Consolidado PFNA'!H18", "Bajo - Medio (3-4 PF)"),
        ("Archivos Logicos Internos", "ILF", "Las 13 tablas relacionales mantenidas por el sistema", 13, "='Consolidado PFNA'!F18", "=E21/'Consolidado PFNA'!H18", "Bajo (7 PF)"),
        ("Archivos de Interfaz Externa", "EIF", "Servicios externos (Stripe, WhatsApp, SAT, CDN, FCM)", 13, "='Consolidado PFNA'!G18", "=E22/'Consolidado PFNA'!H18", "Bajo (5 PF)")
    ]

    start_comp_r = r_k
    for r_data in comp_rows:
        for c_i, val in enumerate(r_data, 1):
            cell = ws_kpi.cell(row=r_k, column=c_i, value=val)
            cell.font = font_data_bold if c_i in [1, 2] else font_data
            cell.border = border_cell
            if c_i in [1, 3]:
                cell.alignment = Alignment(horizontal="left", vertical="center")
            elif c_i == 6:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                cell.number_format = "0.0%"
            elif c_i == 5:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                cell.number_format = "#,##0"
            else:
                cell.alignment = Alignment(horizontal="center", vertical="center")
        ws_kpi.row_dimensions[r_k].height = 20
        r_k += 1
    end_comp_r = r_k - 1

    # Fila Total Componentes
    ws_kpi.merge_cells(start_row=r_k, start_column=1, end_row=r_k, end_column=3)
    t_comp_lbl = ws_kpi.cell(row=r_k, column=1, value="TOTAL GENERAL DE COMPONENTES FUNCIONALES (PFNA):")
    t_comp_lbl.font = font_total_green
    t_comp_lbl.fill = fill_total_green
    t_comp_lbl.alignment = Alignment(horizontal="right", vertical="center")
    t_comp_lbl.border = border_total_green
    for col in range(2, 4):
        ws_kpi.cell(row=r_k, column=col).border = border_total_green
        ws_kpi.cell(row=r_k, column=col).fill = fill_total_green

    c_tot_elem = ws_kpi.cell(row=r_k, column=4, value=f"=SUM(D{start_comp_r}:D{end_comp_r})")
    c_tot_elem.font = font_total_green
    c_tot_elem.fill = fill_total_green
    c_tot_elem.alignment = Alignment(horizontal="center", vertical="center")
    c_tot_elem.border = border_total_green

    c_tot_pf = ws_kpi.cell(row=r_k, column=5, value=f"=SUM(E{start_comp_r}:E{end_comp_r})")
    c_tot_pf.font = font_total_green
    c_tot_pf.fill = fill_total_green
    c_tot_pf.alignment = Alignment(horizontal="center", vertical="center")
    c_tot_pf.border = border_total_green
    c_tot_pf.number_format = "#,##0"

    c_tot_pct = ws_kpi.cell(row=r_k, column=6, value=f"=SUM(F{start_comp_r}:F{end_comp_r})")
    c_tot_pct.font = font_total_green
    c_tot_pct.fill = fill_total_green
    c_tot_pct.alignment = Alignment(horizontal="center", vertical="center")
    c_tot_pct.border = border_total_green
    c_tot_pct.number_format = "0.0%"

    c_tot_note = ws_kpi.cell(row=r_k, column=7, value="100% Cobertura de BD")
    c_tot_note.font = font_total_green
    c_tot_note.fill = fill_total_green
    c_tot_note.alignment = Alignment(horizontal="center", vertical="center")
    c_tot_note.border = border_total_green
    ws_kpi.row_dimensions[r_k].height = 24

    # Anchos de columna en Hoja Resumen
    col_w_kpi = {1: 28, 2: 12, 3: 45, 4: 16, 5: 18, 6: 16, 7: 28}
    for c_idx, width in col_w_kpi.items():
        ws_kpi.column_dimensions[get_column_letter(c_idx)].width = width

    # =========================================================================
    # HOJA 2: MATRICES DE REFERENCIA (Plantilla Oficial 'PuntosDeFuncion.DOC')
    # =========================================================================
    ws_mat = wb.create_sheet(title="Matrices de Referencia")
    ws_mat.views.sheetView[0].showGridLines = True

    # Encabezado
    ws_mat.merge_cells("A1:G1")
    t1 = ws_mat["A1"]
    t1.value = "MATRICES OFICIALES DE COMPLEJIDAD Y VALORACION (IFPUG / ALBRECHT)"
    t1.font = font_title
    t1.fill = fill_title
    t1.alignment = Alignment(horizontal="center", vertical="center")
    ws_mat.row_dimensions[1].height = 36

    ws_mat.merge_cells("A2:G2")
    s1 = ws_mat["A2"]
    s1.value = "Reglas de ponderacion y tablas de referencia estandarizadas de 'PuntosDeFuncion.DOC'"
    s1.font = font_subtitle
    s1.alignment = Alignment(horizontal="center", vertical="center")
    ws_mat.row_dimensions[2].height = 20

    row_m = 4

    # Definiciones Fundamentales
    ws_mat.merge_cells(start_row=row_m, start_column=1, end_row=row_m, end_column=7)
    sec_def = ws_mat.cell(row=row_m, column=1, value="1. DEFINICIONES OPERATIVAS DEL MODELO")
    sec_def.font = font_section
    sec_def.fill = fill_section
    sec_def.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_mat.row_dimensions[row_m].height = 24
    row_m += 1

    defs_data = [
        ("Entrada (EI)", "Transacciones elementales relacionadas con agregar (altas), eliminar (bajas fisicas o logicas) y modificar datos en las tablas."),
        ("Salida (EO)", "Consultas o generacion de informes que involucran calculos derivados (como aquellos matematicos, totales prorrateados, balances)."),
        ("Peticion (EQ)", "Consultas directas o generacion de reportes sin calculos matematicos derivados (como listados de catalogos y busquedas)."),
        ("Archivos Internos (ILF)", "Archivos logicos o tablas que son mantenidos y alterados directamente por el propio sistema (usuarios, productos, pedidos...)."),
        ("Archivos Externos (EIF)", "Archivos referenciados solo para consulta por el sistema pero mantenidos por sistemas externos (Stripe, WhatsApp, SAT...).")
    ]

    for item, desc in defs_data:
        ws_mat.cell(row=row_m, column=1, value=item).font = font_data_bold
        ws_mat.cell(row=row_m, column=1).border = border_cell
        ws_mat.cell(row=row_m, column=1).alignment = Alignment(horizontal="left", vertical="center")
        
        ws_mat.merge_cells(start_row=row_m, start_column=2, end_row=row_m, end_column=7)
        c_desc = ws_mat.cell(row=row_m, column=2, value=desc)
        c_desc.font = font_data
        c_desc.border = border_cell
        c_desc.alignment = Alignment(horizontal="left", vertical="center")
        for col in range(3, 8):
            ws_mat.cell(row=row_m, column=col).border = border_cell
        ws_mat.row_dimensions[row_m].height = 20
        row_m += 1

    row_m += 1

    # Tabla 1: Matriz para Entradas
    ws_mat.merge_cells(start_row=row_m, start_column=1, end_row=row_m, end_column=7)
    sec_t1 = ws_mat.cell(row=row_m, column=1, value="TABLA 1. MATRIZ DE COMPLEJIDAD PARA ENTRADAS EXTERNAS (EI)")
    sec_t1.font = font_section
    sec_t1.fill = fill_section
    sec_t1.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_mat.row_dimensions[row_m].height = 24
    row_m += 1

    t1_headers = ["Archivos Referenciados (FTR)", "1 - 4 Elementos (DET)", "5 - 15 Elementos (DET)", "16 o mas Elementos (DET)"]
    for c_i, h in enumerate(t1_headers, 1):
        cell_h = ws_mat.cell(row=row_m, column=c_i, value=h)
        cell_h.font = font_tbl_header
        cell_h.fill = fill_tbl_header
        cell_h.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell_h.border = border_cell
    ws_mat.row_dimensions[row_m].height = 22
    row_m += 1

    t1_rows = [
        ["Menos de 2 (< 2 FTR)", "Bajo", "Bajo", "Medio"],
        ["2 FTR", "Bajo", "Medio", "Alto"],
        ["Mas de 2 (> 2 FTR)", "Medio", "Alto", "Alto"]
    ]
    for r in t1_rows:
        for c_i, val in enumerate(r, 1):
            cell = ws_mat.cell(row=row_m, column=c_i, value=val)
            cell.font = font_data_bold if c_i == 1 else font_data
            cell.alignment = Alignment(horizontal="left" if c_i == 1 else "center", vertical="center")
            cell.border = border_cell
        ws_mat.row_dimensions[row_m].height = 19
        row_m += 1

    row_m += 1

    # Tabla 2: Matriz para Salidas y Peticiones
    ws_mat.merge_cells(start_row=row_m, start_column=1, end_row=row_m, end_column=7)
    sec_t2 = ws_mat.cell(row=row_m, column=1, value="TABLA 2. MATRIZ DE COMPLEJIDAD PARA SALIDAS (EO) Y PETICIONES (EQ)")
    sec_t2.font = font_section
    sec_t2.fill = fill_section
    sec_t2.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_mat.row_dimensions[row_m].height = 24
    row_m += 1

    t2_headers = ["Archivos Referenciados (FTR)", "1 - 5 Elementos (DET)", "6 - 19 Elementos (DET)", "20 o mas Elementos (DET)"]
    for c_i, h in enumerate(t2_headers, 1):
        cell_h = ws_mat.cell(row=row_m, column=c_i, value=h)
        cell_h.font = font_tbl_header
        cell_h.fill = fill_tbl_header
        cell_h.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell_h.border = border_cell
    ws_mat.row_dimensions[row_m].height = 22
    row_m += 1

    t2_rows = [
        ["Menos que 2 (< 2 FTR)", "Bajo", "Bajo", "Medio"],
        ["2 - 3 FTR", "Bajo", "Medio", "Alto"],
        ["Mas de 3 (> 3 FTR)", "Medio", "Alto", "Alto"]
    ]
    for r in t2_rows:
        for c_i, val in enumerate(r, 1):
            cell = ws_mat.cell(row=row_m, column=c_i, value=val)
            cell.font = font_data_bold if c_i == 1 else font_data
            cell.alignment = Alignment(horizontal="left" if c_i == 1 else "center", vertical="center")
            cell.border = border_cell
        ws_mat.row_dimensions[row_m].height = 19
        row_m += 1

    row_m += 1

    # Tabla 3: Matriz para Archivos Internos y Externos
    ws_mat.merge_cells(start_row=row_m, start_column=1, end_row=row_m, end_column=7)
    sec_t3 = ws_mat.cell(row=row_m, column=1, value="TABLA 3. MATRIZ DE COMPLEJIDAD PARA ARCHIVOS INTERNOS (ILF) Y EXTERNOS (EIF)")
    sec_t3.font = font_section
    sec_t3.fill = fill_section
    sec_t3.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_mat.row_dimensions[row_m].height = 24
    row_m += 1

    t3_headers = ["Tipos de Registro (RET)", "1 - 19 Elementos (DET)", "20 - 50 Elementos (DET)", "51 o mas Elementos (DET)"]
    for c_i, h in enumerate(t3_headers, 1):
        cell_h = ws_mat.cell(row=row_m, column=c_i, value=h)
        cell_h.font = font_tbl_header
        cell_h.fill = fill_tbl_header
        cell_h.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell_h.border = border_cell
    ws_mat.row_dimensions[row_m].height = 22
    row_m += 1

    t3_rows = [
        ["Menos de 2 (1 RET)", "Bajo", "Bajo", "Medio"],
        ["2 - 5 RET", "Bajo", "Medio", "Alto"],
        ["Mas de 5 (> 5 RET)", "Medio", "Alto", "Alto"]
    ]
    for r in t3_rows:
        for c_i, val in enumerate(r, 1):
            cell = ws_mat.cell(row=row_m, column=c_i, value=val)
            cell.font = font_data_bold if c_i == 1 else font_data
            cell.alignment = Alignment(horizontal="left" if c_i == 1 else "center", vertical="center")
            cell.border = border_cell
        ws_mat.row_dimensions[row_m].height = 19
        row_m += 1

    row_m += 1

    # Tabla 4: Ponderacion Oficial de Puntos de Funcion
    ws_mat.merge_cells(start_row=row_m, start_column=1, end_row=row_m, end_column=7)
    sec_t4 = ws_mat.cell(row=row_m, column=1, value="TABLA 4. TABLA DE PONDERACION OFICIAL DE PUNTOS DE FUNCION NO AJUSTADOS")
    sec_t4.font = font_section
    sec_t4.fill = fill_section
    sec_t4.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_mat.row_dimensions[row_m].height = 24
    row_m += 1

    t4_headers = ["Componente Funcional", "Bajo", "Medio", "Alto"]
    for c_i, h in enumerate(t4_headers, 1):
        cell_h = ws_mat.cell(row=row_m, column=c_i, value=h)
        cell_h.font = font_tbl_header
        cell_h.fill = fill_tbl_header
        cell_h.alignment = Alignment(horizontal="center", vertical="center")
        cell_h.border = border_cell
    ws_mat.row_dimensions[row_m].height = 22
    row_m += 1

    t4_rows = [
        ["Entradas Externas (EI)", 3, 4, 6],
        ["Salidas Externas (EO)", 4, 5, 7],
        ["Peticiones / Consultas (EQ)", 3, 4, 6],
        ["Archivos Logicos Internos (ILF)", 7, 10, 15],
        ["Archivos de Interfaz Externa (EIF)", 5, 7, 10]
    ]
    for r in t4_rows:
        for c_i, val in enumerate(r, 1):
            cell = ws_mat.cell(row=row_m, column=c_i, value=val)
            cell.font = font_data_bold if c_i == 1 else font_data
            cell.alignment = Alignment(horizontal="left" if c_i == 1 else "center", vertical="center")
            cell.border = border_cell
        ws_mat.row_dimensions[row_m].height = 19
        row_m += 1

    row_m += 1

    # Escala de Albrecht (0 a 5)
    ws_mat.merge_cells(start_row=row_m, start_column=1, end_row=row_m, end_column=7)
    sec_esc = ws_mat.cell(row=row_m, column=1, value="5. ESCALA DE GRADOS DE INFLUENCIA DE ALBRECHT (0 A 5)")
    sec_esc.font = font_section
    sec_esc.fill = fill_section
    sec_esc.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_mat.row_dimensions[row_m].height = 24
    row_m += 1

    esc_headers = ["Nivel", "Significado", "Criterio de Evaluacion"]
    ws_mat.cell(row=row_m, column=1, value="Nivel").font = font_tbl_header
    ws_mat.cell(row=row_m, column=1).fill = fill_tbl_header
    ws_mat.cell(row=row_m, column=1).alignment = Alignment(horizontal="center", vertical="center")
    ws_mat.cell(row=row_m, column=1).border = border_cell

    ws_mat.cell(row=row_m, column=2, value="Significado").font = font_tbl_header
    ws_mat.cell(row=row_m, column=2).fill = fill_tbl_header
    ws_mat.cell(row=row_m, column=2).alignment = Alignment(horizontal="center", vertical="center")
    ws_mat.cell(row=row_m, column=2).border = border_cell

    ws_mat.merge_cells(start_row=row_m, start_column=3, end_row=row_m, end_column=7)
    c_crit = ws_mat.cell(row=row_m, column=3, value="Criterio de Evaluacion")
    c_crit.font = font_tbl_header
    c_crit.fill = fill_tbl_header
    c_crit.alignment = Alignment(horizontal="center", vertical="center")
    for col in range(3, 8):
        ws_mat.cell(row=row_m, column=col).border = border_cell
    ws_mat.row_dimensions[row_m].height = 22
    row_m += 1

    escala_data = [
        (0, "Sin influencia", "La caracteristica no esta presente en el sistema o no influye en absoluto."),
        (1, "Incidental", "La caracteristica tiene una influencia minima en el desarrollo del sistema."),
        (2, "Moderado", "La caracteristica tiene una influencia menor o moderada en el diseno."),
        (3, "Medio", "La caracteristica tiene una influencia tipica o promedio en la aplicacion."),
        (4, "Significativo", "La caracteristica es un requerimiento fuerte y clave en el sistema."),
        (5, "Esencial", "La caracteristica es critica e indispensable; el sistema no funciona sin ella.")
    ]

    for niv, sig, crit in escala_data:
        ws_mat.cell(row=row_m, column=1, value=niv).font = font_data_bold
        ws_mat.cell(row=row_m, column=1).alignment = Alignment(horizontal="center", vertical="center")
        ws_mat.cell(row=row_m, column=1).border = border_cell

        ws_mat.cell(row=row_m, column=2, value=sig).font = font_data_bold
        ws_mat.cell(row=row_m, column=2).alignment = Alignment(horizontal="left", vertical="center")
        ws_mat.cell(row=row_m, column=2).border = border_cell

        ws_mat.merge_cells(start_row=row_m, start_column=3, end_row=row_m, end_column=7)
        c_cr = ws_mat.cell(row=row_m, column=3, value=crit)
        c_cr.font = font_data
        c_cr.alignment = Alignment(horizontal="left", vertical="center")
        for col in range(3, 8):
            ws_mat.cell(row=row_m, column=col).border = border_cell
        ws_mat.row_dimensions[row_m].height = 19
        row_m += 1

    # Autoajuste de anchos para Hoja 2
    col_w_m = {1: 32, 2: 26, 3: 26, 4: 26, 5: 16, 6: 16, 7: 16}
    for c_idx, width in col_w_m.items():
        ws_mat.column_dimensions[get_column_letter(c_idx)].width = width

    # =========================================================================
    # HOJA 3: DESGLOSE POR TABLA (13 TABLAS - 5 TABLAS POR CADA TABLA DE BD)
    # =========================================================================
    ws_desglose = wb.create_sheet(title="Desglose por Tabla (13 Tablas)")
    ws_desglose.views.sheetView[0].showGridLines = True

    # Encabezado Principal
    ws_desglose.merge_cells("A1:F1")
    t_d = ws_desglose["A1"]
    t_d.value = "DESGLOSE COMPLETO DE PUNTOS DE FUNCION NO AJUSTADOS (PFNA) - 13 TABLAS BD"
    t_d.font = font_title
    t_d.fill = fill_title
    t_d.alignment = Alignment(horizontal="center", vertical="center")
    ws_desglose.row_dimensions[1].height = 36

    ws_desglose.merge_cells("A2:F2")
    s_d = ws_desglose["A2"]
    s_d.value = "Especificacion individual de las 5 Tablas del documento de referencia por cada entidad de la BD LocalMarket"
    s_d.font = font_subtitle
    s_d.alignment = Alignment(horizontal="center", vertical="center")
    ws_desglose.row_dimensions[2].height = 20

    row_d = 4

    # Estructura de datos completa para las 13 tablas
    # Cada tabla contiene: nombre, descripcion_entidad, ei_list, eo_list, eq_list, ilf_list, eif_list
    tablas_definiciones = [
        # 1. USUARIOS
        {
            "id": 1,
            "nombre": "usuarios",
            "titulo": "TABLA 1: USUARIOS (Cuentas, Perfiles y Autenticacion)",
            "ei": [
                [1, "Registro de Nuevo Usuario (Alta en Plataforma)", "2 (usuarios, roles)", "9 (id_rol, nombre, correo, pass, tel...)", "Medio", 4],
                [2, "Actualizacion de Perfil de Usuario (Modificacion)", "1 (usuarios)", "6 (nombre, telefono, foto, correo...)", "Bajo", 3],
                [3, "Baja / Suspension de Cuenta de Usuario", "2 (usuarios, control_suspensiones)", "2 (id_usuario, estado_cuenta)", "Bajo", 3]
            ],
            "eo": [
                [1, "Reporte de Actividad y Comisiones por Usuario (Calculo de ventas brutas, retenciones y saldo neto)", "3 (usuarios, pedidos, detalle_pedidos)", "8 (id_usuario, nombre, total_ventas, comision_pct, saldo_favor...)", "Medio", 5],
                [2, "Resumen Financiero y Balance de Credito en Plataforma (Calculo de compras totales y limite)", "2 (usuarios, pedidos)", "6 (id_usuario, total_compras, saldo_disponible, credito_usado...)", "Medio", 5]
            ],
            "eq": [
                [1, "Consulta de Usuario por ID / Correo (Autenticacion y login)", "2 (usuarios, roles)", "6 (id_usuario, nombre, correo, nombre_rol, estado...)", "Medio", 4],
                [2, "Listado de Usuarios Registrados en Panel de Control", "2 (usuarios, roles)", "5 (id_usuario, nombre, correo, telefono, rol)", "Bajo", 3]
            ],
            "ilf": [
                [1, "Tabla: usuarios (Entidad maestra de cuentas, seguridad y perfiles)", "1 (Registro Usuario)", "10 (id_usuario, id_rol, nombre, correo, contrasena, tel, foto, otp, estado, fecha)", "Bajo", 7]
            ],
            "eif": [
                [1, "Servicio Externo de Validacion de Identidad y SMS (Twilio / Carrier API)", "1 (Registro de Telefono)", "4 (telefono, country_code, carrier_status, valid)", "Bajo", 5]
            ]
        },

        # 2. ROLES
        {
            "id": 2,
            "nombre": "roles",
            "titulo": "TABLA 2: ROLES (Control de Acceso Basado en Roles - RBAC)",
            "ei": [
                [1, "Crear Nuevo Rol de Sistema (Alta)", "1 (roles)", "3 (id_rol, nombre_rol, descripcion)", "Bajo", 3],
                [2, "Modificar Privilegios de Rol (Edicion)", "2 (roles, roles_permisos)", "3 (nombre_rol, descripcion, permisos)", "Bajo", 3],
                [3, "Desactivar / Eliminar Rol no Asignado (Baja)", "2 (roles, usuarios)", "1 (id_rol)", "Bajo", 3]
            ],
            "eo": [
                [1, "Matriz de Cobertura y Auditoria de Permisos RBAC (Calculo porcentual de cobertura de modulos)", "2 (roles, roles_permisos)", "6 (nombre_rol, total_permisos, permisos_activos, cobertura_pct...)", "Medio", 5]
            ],
            "eq": [
                [1, "Catalogo de Roles de Usuario Disponibles", "1 (roles)", "3 (id_rol, nombre_rol, descripcion)", "Bajo", 3],
                [2, "Consulta de Rol y Permisos de Usuario en Sesion", "2 (roles, usuarios)", "4 (id_usuario, nombre, id_rol, nombre_rol)", "Bajo", 3]
            ],
            "ilf": [
                [1, "Tabla: roles (Catalogo de perfiles de seguridad: Admin, Vendedor, Cliente)", "1 (Registro Rol)", "4 (id_rol, nombre_rol, descripcion, fecha_creacion)", "Bajo", 7]
            ],
            "eif": [
                [1, "Directorio Activo Externo / OAuth 2.0 Provider (Google Identity Services)", "1 (Token Claim)", "4 (sub_id, email, role_claim, expiration)", "Bajo", 5]
            ]
        },

        # 3. VERIFICACIONES_OTP
        {
            "id": 3,
            "nombre": "verificaciones_otp",
            "titulo": "TABLA 3: VERIFICACIONES_OTP (Seguridad 2FA y Tokens Temporales)",
            "ei": [
                [1, "Generar Codigo OTP de Verificacion (Alta de Token)", "2 (verificaciones_otp, usuarios)", "4 (id_usuario, codigo_otp, expiracion, intentos)", "Bajo", 3],
                [2, "Validar Codigo OTP e Incrementar Fallos (Modificacion)", "2 (verificaciones_otp, usuarios)", "4 (id_usuario, codigo_otp, intentos_fallidos, bloqueado)", "Bajo", 3],
                [3, "Invalidar / Purgar Tokens Expirados (Baja)", "1 (verificaciones_otp)", "2 (id_otp, expiracion)", "Bajo", 3]
            ],
            "eo": [
                [1, "Metrica de Tasa de Exito de Autenticacion 2FA (Calculo de ratio de validacion y tiempo medio)", "2 (verificaciones_otp, usuarios)", "6 (total_solicitados, total_validados, tasa_exito_pct, tiempo_seg...)", "Medio", 5]
            ],
            "eq": [
                [1, "Consulta de Estatus de Bloqueo OTP por Usuario", "2 (verificaciones_otp, usuarios)", "4 (id_usuario, intentos_fallidos, bloqueado_hasta, activo)", "Bajo", 3]
            ],
            "ilf": [
                [1, "Tabla: verificaciones_otp (Almacen transaccional de claves temporales de 2FA)", "1 (Registro OTP)", "6 (id_otp, id_usuario, codigo_otp, intentos_fallidos, bloqueado_hasta, expiracion)", "Bajo", 7]
            ],
            "eif": [
                [1, "API Externa de Mensajeria Instantanea OTP (WhatsApp Cloud API / Meta Graph)", "1 (Mensaje OTP)", "5 (message_id, recipient, status, delivery_ts, cost)", "Bajo", 5]
            ]
        },

        # 4. CATEGORIAS
        {
            "id": 4,
            "nombre": "categorias",
            "titulo": "TABLA 4: CATEGORIAS (Familias y Segmentos Comerciales)",
            "ei": [
                [1, "Registrar Nueva Categoria Comercial (Alta)", "1 (categorias)", "4 (id_categoria, nombre, descripcion, estado)", "Bajo", 3],
                [2, "Actualizar Datos y Estado de Categoria (Modificacion)", "1 (categorias)", "4 (nombre, descripcion, estado, icono)", "Bajo", 3],
                [3, "Desactivar Categoria sin Productos (Baja)", "2 (categorias, productos)", "2 (id_categoria, estado)", "Bajo", 3]
            ],
            "eo": [
                [1, "Analisis de Rendimiento y Volumen por Categoria (Calculo de facturacion agregada y rotacion)", "3 (categorias, productos, pedidos)", "7 (id_categoria, nombre, total_productos, ventas_pesos, rotacion_pct...)", "Medio", 5]
            ],
            "eq": [
                [1, "Catalogo de Categorias Activas para el Menu de Navegacion", "1 (categorias)", "4 (id_categoria, nombre, descripcion, estado)", "Bajo", 3],
                [2, "Consulta de Categoria por Identificador / Slug", "1 (categorias)", "3 (id_categoria, nombre, descripcion)", "Bajo", 3]
            ],
            "ilf": [
                [1, "Tabla: categorias (Catalogo maestro de clasificacion comercial del catalogo)", "1 (Registro Categoria)", "5 (id_categoria, nombre, descripcion, estado, fecha_creacion)", "Bajo", 7]
            ],
            "eif": [
                [1, "Clasificador Estandar de Productos y Servicios (Catalogo SAT / UNSPSC)", "1 (Clave SAT)", "4 (clave_prod_serv, descripcion_sat, categoria_eq, iva_aplica)", "Bajo", 5]
            ]
        },

        # 5. PRODUCTOS
        {
            "id": 5,
            "nombre": "productos",
            "titulo": "TABLA 5: PRODUCTOS (Catalogo Comercial, Inventarios y Precios)",
            "ei": [
                [1, "Publicar Nuevo Producto en Catalogo (Alta)", "2 (productos, categorias)", "9 (id_vendedor, id_categoria, titulo, desc, precio, costo, stock, estado...)", "Medio", 4],
                [2, "Actualizar Precios, Costos y Stock (Modificacion)", "2 (productos, categorias)", "8 (titulo, desc, precio, costo_unitario, stock, estado...)", "Medio", 4],
                [3, "Suspender / Dar de Baja Publicacion de Producto", "2 (productos, control_suspensiones)", "2 (id_producto, estado_publicacion)", "Bajo", 3]
            ],
            "eo": [
                [1, "Reporte de Margen de Ganancia y Rentabilidad (Calculo de margen bruto [(precio-costo)/precio]*100 y utilidad)", "2 (productos, categorias)", "8 (id_producto, titulo, precio, costo_unitario, utilidad, margen_pct, valor_stock...)", "Medio", 5],
                [2, "Balance de Stock Critico y Costo de Reorden (Calculo de reposicion y dias de inventario)", "2 (productos, detalle_pedidos)", "7 (id_producto, titulo, stock_actual, consumo_diario, dias_cobertura, costo_reorden...)", "Medio", 5]
            ],
            "eq": [
                [1, "Busqueda de Productos con Filtros Dinamicos (texto, categoria, precio)", "2 (productos, categorias)", "7 (id_producto, titulo, descripcion, precio, stock, categoria, vendedor)", "Medio", 4],
                [2, "Ficha Tecnica Detallada de Producto", "2 (productos, usuarios)", "8 (id_producto, titulo, descripcion, precio, stock, estado, vendedor, fecha)", "Medio", 4]
            ],
            "ilf": [
                [1, "Tabla: productos (Almacen maestro de publicaciones, inventarios y tarifas comerciales)", "1 (Registro Producto)", "10 (id_producto, id_vendedor, id_categoria, titulo, desc, precio, costo, stock, estado, fecha)", "Bajo", 7]
            ],
            "eif": [
                [1, "Servicio de Almacenamiento en la Nube CDN (Cloudinary / AWS S3 API)", "1 (Activo CDN)", "5 (asset_id, secure_url, bytes_size, format, created_at)", "Bajo", 5]
            ]
        },

        # 6. IMAGENES_PRODUCTO
        {
            "id": 6,
            "nombre": "imagenes_producto",
            "titulo": "TABLA 6: IMAGENES_PRODUCTO (Galeria Multimedia y Activos Visuales)",
            "ei": [
                [1, "Subir Imagen de Producto a Galeria (Alta)", "2 (imagenes_producto, productos)", "4 (id_producto, url_imagen, orden, fecha)", "Bajo", 3],
                [2, "Reordenar Galeria y Cambiar Imagen Principal (Modificacion)", "1 (imagenes_producto)", "3 (id_imagen, orden, es_portada)", "Bajo", 3],
                [3, "Eliminar Imagen de Galeria (Baja)", "1 (imagenes_producto)", "2 (id_imagen, url_imagen)", "Bajo", 3]
            ],
            "eo": [
                [1, "Auditoria y Balance de Optimizacion de Medios (Calculo de megabytes totales y tasa de compresion WebP)", "2 (imagenes_producto, productos)", "6 (total_imagenes, tamano_original_mb, tamano_comprimido, ahorro_pct, costo_cdn...)", "Medio", 5]
            ],
            "eq": [
                [1, "Consulta de Galeria de Fotos de un Producto", "1 (imagenes_producto)", "4 (id_imagen, id_producto, url_imagen, orden)", "Bajo", 3]
            ],
            "ilf": [
                [1, "Tabla: imagenes_producto (Registro de referencias multimedia y display visual)", "1 (Registro Imagen)", "5 (id_imagen, id_producto, url_imagen, orden, fecha_subida)", "Bajo", 7]
            ],
            "eif": [
                [1, "API Externa de Procesamiento y Compresion Dinamica (Imgix / Sharp CDN)", "1 (Transformacion)", "4 (image_url, transform_params, output_format, ratio)", "Bajo", 5]
            ]
        },

        # 7. CARRITO
        {
            "id": 7,
            "nombre": "carrito",
            "titulo": "TABLA 7: CARRITO (Sesiones de Compra y Estado del Comprador)",
            "ei": [
                [1, "Inicializar Carrito de Compras (Alta de Sesion)", "2 (carrito, usuarios)", "4 (id_usuario, sesion_token, fecha, activo)", "Bajo", 3],
                [2, "Asociar Carrito Anonimo a Usuario Logueado (Modificacion)", "2 (carrito, usuarios)", "3 (id_usuario, sesion_token, fecha_actualizacion)", "Bajo", 3],
                [3, "Vaciar / Descartar Carrito Activo (Baja)", "2 (carrito, detalle_carrito)", "2 (id_carrito, activo)", "Bajo", 3]
            ],
            "eo": [
                [1, "Calculo de Tasa de Abandono de Carritos (Calculo de ratio carritos creados vs cerrados y valor en riesgo)", "3 (carrito, detalle_carrito, productos)", "7 (carritos_creados, carritos_cerrados, tasa_abandono_pct, monto_medio, valor_riesgo...)", "Medio", 5]
            ],
            "eq": [
                [1, "Consulta de Estado del Carrito por Token / ID de Usuario", "1 (carrito)", "4 (id_carrito, id_usuario, fecha_actualizacion, activo)", "Bajo", 3]
            ],
            "ilf": [
                [1, "Tabla: carrito (Almacen de cabeceras de sesiones de compra activas e historicas)", "1 (Registro Carrito)", "6 (id_carrito, id_usuario, sesion_token, fecha_creacion, fecha_actualizacion, activo)", "Bajo", 7]
            ],
            "eif": [
                [1, "Servicio de Analitica de Comercio Electronico (Google Analytics 4 / E-commerce Protocol)", "1 (Evento Analitico)", "5 (client_id, event_name, cart_value, items_count, timestamp)", "Bajo", 5]
            ]
        },

        # 8. DETALLE_CARRITO
        {
            "id": 8,
            "nombre": "detalle_carrito",
            "titulo": "TABLA 8: DETALLE_CARRITO (Partidas y Renglones de Compra Temporal)",
            "ei": [
                [1, "Agregar Producto al Carrito (Alta de Renglon)", "3 (detalle_carrito, carrito, productos)", "5 (id_carrito, id_producto, cantidad, precio, subtotal)", "Medio", 4],
                [2, "Actualizar Cantidad de Unidades en Carrito (Modificacion)", "3 (detalle_carrito, carrito, productos)", "4 (id_detalle, cantidad, precio_unitario, subtotal)", "Bajo", 3],
                [3, "Eliminar Item del Carrito de Compra (Baja)", "1 (detalle_carrito)", "2 (id_detalle_carrito, id_carrito)", "Bajo", 3]
            ],
            "eo": [
                [1, "Liquidacion Preliminar de Carrito (Calculo dinamico de SUM(precio*cant), IVA 16% y envio)", "3 (detalle_carrito, carrito, productos)", "8 (subtotal_sin_iva, monto_iva, costo_envio, total_estimado, ahorro_promociones...)", "Medio", 5]
            ],
            "eq": [
                [1, "Listado de Renglones del Carrito Actual con Titulos y Precios", "2 (detalle_carrito, productos)", "6 (id_detalle, id_producto, titulo, cantidad, precio, subtotal)", "Medio", 4]
            ],
            "ilf": [
                [1, "Tabla: detalle_carrito (Entidad de partidas individuales registradas en el carrito)", "1 (Registro Detalle)", "6 (id_detalle_carrito, id_carrito, id_producto, cantidad, precio_unitario, subtotal)", "Bajo", 7]
            ],
            "eif": [
                [1, "API de Cotizacion Geografica de Envios (Skydropx / 99 Minutos API)", "1 (Cotizacion Envio)", "5 (origin_zip, dest_zip, weight_kg, carrier_rate, delivery_days)", "Bajo", 5]
            ]
        },

        # 9. PEDIDOS
        {
            "id": 9,
            "nombre": "pedidos",
            "titulo": "TABLA 9: PEDIDOS (Transacciones Formales de Venta y Contratos)",
            "ei": [
                [1, "Generar Pedido de Compra Formal (Alta / Checkout)", "3 (pedidos, usuarios, direcciones_entrega)", "8 (id_vendedor, id_comprador, id_direccion, id_metodo, subtotal, total, estado...)", "Alto", 6],
                [2, "Actualizar Estado de Pedido y Despacho (Modificacion de Estatus)", "2 (pedidos, notificaciones)", "3 (id_pedido, estado_pedido, estado_pago)", "Bajo", 3],
                [3, "Cancelar / Revertir Orden de Compra (Baja / Devolucion)", "3 (pedidos, productos, detalle_pedidos)", "3 (id_pedido, estado_pedido, motivo_cancelacion)", "Medio", 4]
            ],
            "eo": [
                [1, "Reporte Financiero de Facturacion y Liquidacion a Vendedores (Calculo de ventas brutas, comision 5% y neto)", "3 (pedidos, detalle_pedidos, usuarios)", "9 (id_vendedor, total_bruto, retencion_sat, comision_plataforma, saldo_neto, pedidos_count...)", "Medio", 5],
                [2, "Estado de Cuenta Mensual de Comprador (Calculo de compras totales, ticket promedio y ahorro)", "2 (pedidos, usuarios)", "7 (id_comprador, total_pedidos, total_gastado, ticket_promedio, ahorro_obtenido...)", "Medio", 5]
            ],
            "eq": [
                [1, "Consulta de Orden de Compra por Numero de Pedido", "3 (pedidos, usuarios, metodos_pago)", "8 (id_pedido, fecha_pedido, comprador, vendedor, monto_total, estado_pedido, estado_pago...)", "Medio", 4],
                [2, "Historial Cronologico de Pedidos por Usuario (Mis Compras / Mis Ventas)", "2 (pedidos, usuarios)", "6 (id_pedido, fecha_pedido, total, estado_pedido, estado_pago, total_articulos)", "Medio", 4]
            ],
            "ilf": [
                [1, "Tabla: pedidos (Registro maestro transaccional de ordenes comerciales y estados de pago)", "1 (Registro Pedido)", "10 (id_pedido, id_vendedor, id_comprador, id_dir, id_metodo, subtotal, total, est_ped, est_pago, fecha)", "Bajo", 7]
            ],
            "eif": [
                [1, "Pasarela de Pagos Seguros en Linea (Stripe / Mercado Pago / SPEI Banxico)", "1 (Intencion de Pago)", "6 (payment_intent_id, amount_cents, currency, status, payment_type, fee)", "Bajo", 5]
            ]
        },

        # 10. DETALLE_PEDIDOS
        {
            "id": 10,
            "nombre": "detalle_pedidos",
            "titulo": "TABLA 10: DETALLE_PEDIDOS (Partidas Comerciales y Costo de Venta)",
            "ei": [
                [1, "Insertar Partidas de Pedido Cerrado (Alta de Renglones)", "3 (detalle_pedidos, pedidos, productos)", "6 (id_pedido, id_producto, cantidad, precio, costo_unitario, subtotal)", "Alto", 6],
                [2, "Ajustar Cantidades por Devolucion Parcial (Modificacion)", "3 (detalle_pedidos, pedidos, productos)", "4 (id_detalle, cantidad, subtotal, motivo)", "Bajo", 3],
                [3, "Cancelar Renglon de Pedido no Disponible (Baja)", "2 (detalle_pedidos, pedidos)", "2 (id_detalle, id_pedido)", "Bajo", 3]
            ],
            "eo": [
                [1, "Conciliacion de Costo de Ventas (COGS) y Margen Real (Calculo de SUM(costo*cant), utilidad bruta y margen neto)", "3 (detalle_pedidos, pedidos, productos)", "8 (id_pedido, id_producto, cantidad, ingreso_bruto, costo_total_cogs, utilidad_bruta, margen_pct...)", "Medio", 5]
            ],
            "eq": [
                [1, "Consulta de Renglones y Partidas de una Orden Especifica", "2 (detalle_pedidos, productos)", "6 (id_detalle, id_producto, titulo_prod, cantidad, precio_unitario, subtotal)", "Medio", 4]
            ],
            "ilf": [
                [1, "Tabla: detalle_pedidos (Registro individual de aranceles, cantidades e items por orden)", "1 (Registro Detalle)", "8 (id_detalle, id_pedido, id_producto, cantidad, precio, costo, subtotal, notificacion)", "Bajo", 7]
            ],
            "eif": [
                [1, "Servicio de Timbrado Fiscal CFDI 4.0 (PAC Autorizado SAT)", "1 (Comprobante Fiscal)", "6 (uuid_fiscal, rfc_emisor, rfc_receptor, total_impuestos, sello_digital, fecha)", "Bajo", 5]
            ]
        },

        # 11. NOTIFICACIONES
        {
            "id": 11,
            "nombre": "notificaciones",
            "titulo": "TABLA 11: NOTIFICACIONES (Alertas Operativas y Mensajeria)",
            "ei": [
                [1, "Encolar Nueva Notificacion Push / WhatsApp (Alta)", "2 (notificaciones, usuarios)", "6 (id_usuario, telefono, mensaje, tipo_alerta, canal, fecha)", "Medio", 4],
                [2, "Marcar Notificacion como Leida / Procesada (Modificacion)", "1 (notificaciones)", "3 (id_notificacion, estado_lectura, fecha)", "Bajo", 3],
                [3, "Purgar Historial de Notificaciones Antiguas (Baja)", "1 (notificaciones)", "2 (id_notificacion, fecha_envio)", "Bajo", 3]
            ],
            "eo": [
                [1, "Metrica de Rendimiento de Mensajeria (Calculo de tasa de apertura [(leidas/enviadas)*100] y costo por canal)", "2 (notificaciones, usuarios)", "7 (total_enviadas, total_leidas, tasa_apertura_pct, tiempo_medio_min, costo_total...)", "Medio", 5]
            ],
            "eq": [
                [1, "Bandeja de Notificaciones Activas del Usuario (Campana In-App)", "1 (notificaciones)", "5 (id_notificacion, mensaje, tipo_alerta, leida, fecha_envio)", "Bajo", 3]
            ],
            "ilf": [
                [1, "Tabla: notificaciones (Registro transaccional de alertas operativas, pedidos y avisos)", "1 (Registro Notificacion)", "7 (id_notificacion, id_usuario, telefono, mensaje, tipo, canal, fecha)", "Bajo", 7]
            ],
            "eif": [
                [1, "Servicio de Notificaciones Push Web (Firebase Cloud Messaging - FCM API)", "1 (Mensaje Push)", "5 (fcm_id, device_token, priority, delivery_status, error_code)", "Bajo", 5]
            ]
        },

        # 12. BITACORA_SEGURIDAD
        {
            "id": 12,
            "nombre": "bitacora_seguridad",
            "titulo": "TABLA 12: BITACORA_SEGURIDAD (Auditoria Informatica y Ciberseguridad)",
            "ei": [
                [1, "Registrar Evento de Seguridad y Acceso (Alta de Log)", "2 (bitacora_seguridad, usuarios)", "6 (id_usuario, ip_origen, accion, intentos, user_agent, fecha)", "Medio", 4],
                [2, "Actualizar Estado de Bloqueo de IP Sospechosa (Modificacion)", "1 (bitacora_seguridad)", "4 (id_bitacora, intentos_bloqueo, ip_bloqueada, motivo)", "Bajo", 3],
                [3, "Purgar Registros Fuera de Retencion Legal (Baja)", "1 (bitacora_seguridad)", "2 (id_bitacora, fecha)", "Bajo", 3]
            ],
            "eo": [
                [1, "Indice Heuristico de Amenazas e Intentos de Intrusion (Calculo de ataques por hora, tasa de IP hostiles y bloqueos)", "2 (bitacora_seguridad, usuarios)", "8 (total_eventos, ips_bloqueadas, ataques_fuerza_bruta, eventos_por_hora, indice_amenaza...)", "Medio", 5]
            ],
            "eq": [
                [1, "Consulta de Historial de Eventos de Seguridad y Accesos Sospechosos", "2 (bitacora_seguridad, usuarios)", "6 (id_bitacora, usuario_nombre, ip_origen, accion, intentos, fecha)", "Medio", 4]
            ],
            "ilf": [
                [1, "Tabla: bitacora_seguridad (Almacen inmutable de eventos de auditoria y seguridad)", "1 (Registro Auditoria)", "6 (id_bitacora, id_usuario, ip_origen, accion, intentos_bloqueo, fecha)", "Bajo", 7]
            ],
            "eif": [
                [1, "Base de Datos de Inteligencia de Amenazas y GeoIP (MaxMind GeoIP2 / AbuseIPDB)", "1 (Reporte IP)", "5 (ip_address, country_iso, threat_score, is_vpn, reports_count)", "Bajo", 5]
            ]
        },

        # 13. CONTROL_SUSPENSIONES
        {
            "id": 13,
            "nombre": "control_suspensiones",
            "titulo": "TABLA 13: CONTROL_SUSPENSIONES (Moderacion y Sanciones Disciplinarias)",
            "ei": [
                [1, "Registrar Suspension de Cuenta o Producto (Alta de Sancion)", "3 (control_suspensiones, usuarios, productos)", "7 (id_entidad, tipo, motivo, suspendido_por, fecha_sus, reactivacion, estado)", "Alto", 6],
                [2, "Modificar Dictamen o Prorrogar Sancion (Modificacion)", "2 (control_suspensiones, usuarios)", "5 (id_suspension, motivo, fecha_reactivacion, estado, notas)", "Medio", 4],
                [3, "Reactivar Entidad y Levantar Suspension (Baja de Sancion)", "3 (control_suspensiones, usuarios, productos)", "3 (id_suspension, estado, fecha_reactivacion)", "Bajo", 3]
            ],
            "eo": [
                [1, "Balance de Cumplimiento y Sanciones Disciplinarias (Calculo de tasa de reincidencia [(reincidentes/total)*100] y dias promedio)", "3 (control_suspensiones, usuarios, productos)", "7 (total_suspensiones, cuentas_sancionadas, productos_retirados, reincidencia_pct, dias_promedio...)", "Medio", 5]
            ],
            "eq": [
                [1, "Consulta de Expediente de Sancion por Entidad (Usuario o Producto)", "2 (control_suspensiones, usuarios)", "6 (id_suspension, id_entidad, tipo_entidad, motivo, admin, estado)", "Medio", 4],
                [2, "Padron General de Cuentas y Publicaciones Suspendidas", "2 (control_suspensiones, usuarios)", "5 (id_suspension, tipo_entidad, motivo, fecha_suspension, estado)", "Bajo", 3]
            ],
            "ilf": [
                [1, "Tabla: control_suspensiones (Registro formal de medidas disciplinarias y moderacion de contenido)", "1 (Registro Sancion)", "7 (id_suspension, id_entidad, tipo, motivo, suspendido_por, fecha, estado)", "Bajo", 7]
            ],
            "eif": [
                [1, "Padron Externo de Cumplimiento Normativo y Listas Negras (OFAC / Buro Antifraude)", "1 (Entidad Listada)", "5 (entity_id, risk_level, sanction_category, jurisdiction, compliance_status)", "Bajo", 5]
            ]
        }
    ]

    # Diccionario para almacenar las referencias de celdas de subtotales de cada tabla
    # clave: table_id -> dict con celdas de 'ei', 'eo', 'eq', 'ilf', 'eif', 'total_tabla'
    referencias_tablas = {}
    totales_tablas_rows = []

    for t_def in tablas_definiciones:
        t_id = t_def["id"]
        t_nom = t_def["nombre"]
        t_tit = t_def["titulo"]
        referencias_tablas[t_id] = {}

        # Banner de la Tabla Principal
        ws_desglose.merge_cells(start_row=row_d, start_column=1, end_row=row_d, end_column=6)
        banner = ws_desglose.cell(row=row_d, column=1, value=t_tit.upper())
        banner.font = font_title
        banner.fill = fill_title
        banner.alignment = Alignment(horizontal="left", vertical="center", indent=1)
        ws_desglose.row_dimensions[row_d].height = 28
        row_d += 1

        # Funcion auxiliar para renderizar cada una de las 5 tablas solicitadas
        def render_subtabla(codigo_sub, titulo_sub, cabeceras, filas_datos):
            nonlocal row_d
            # Header Subtabla
            ws_desglose.merge_cells(start_row=row_d, start_column=1, end_row=row_d, end_column=6)
            sec = ws_desglose.cell(row=row_d, column=1, value=f"{titulo_sub} - Tabla: {t_nom}")
            sec.font = font_subsection
            sec.fill = fill_subsection
            sec.alignment = Alignment(horizontal="left", vertical="center", indent=1)
            ws_desglose.row_dimensions[row_d].height = 22
            row_d += 1

            # Cabeceras
            for c_i, h in enumerate(cabeceras, 1):
                c = ws_desglose.cell(row=row_d, column=c_i, value=h)
                c.font = font_tbl_header
                c.fill = fill_tbl_header
                c.alignment = Alignment(horizontal="center", vertical="center")
                c.border = border_cell
            ws_desglose.row_dimensions[row_d].height = 22
            row_d += 1

            start_r = row_d
            for idx, r_item in enumerate(filas_datos):
                is_even = (idx % 2 == 1)
                for c_i, val in enumerate(r_item, 1):
                    cell = ws_desglose.cell(row=row_d, column=c_i, value=val)
                    cell.font = font_data
                    cell.border = border_cell
                    if is_even:
                        cell.fill = fill_zebra
                    
                    if c_i == 1:
                        cell.alignment = Alignment(horizontal="center", vertical="center")
                    elif c_i == 2:
                        cell.alignment = Alignment(horizontal="left", vertical="center")
                    elif c_i == 6:
                        cell.alignment = Alignment(horizontal="center", vertical="center")
                        cell.font = font_data_bold
                    else:
                        cell.alignment = Alignment(horizontal="center", vertical="center")
                ws_desglose.row_dimensions[row_d].height = 20
                row_d += 1
            end_r = row_d - 1

            # Subtotal de la Subtabla
            ws_desglose.merge_cells(start_row=row_d, start_column=1, end_row=row_d, end_column=5)
            lbl_sub = ws_desglose.cell(row=row_d, column=1, value=f"Subtotal {codigo_sub} ({t_nom}):")
            lbl_sub.font = font_subtotal
            lbl_sub.fill = fill_subtotal
            lbl_sub.alignment = Alignment(horizontal="right", vertical="center")
            lbl_sub.border = border_subtotal

            for col in range(2, 6):
                ws_desglose.cell(row=row_d, column=col).border = border_subtotal
                ws_desglose.cell(row=row_d, column=col).fill = fill_subtotal

            c_sub_val = ws_desglose.cell(row=row_d, column=6)
            c_sub_val.value = f"=SUM(F{start_r}:F{end_r})"
            c_sub_val.font = font_subtotal
            c_sub_val.fill = fill_subtotal
            c_sub_val.alignment = Alignment(horizontal="center", vertical="center")
            c_sub_val.border = border_subtotal
            ws_desglose.row_dimensions[row_d].height = 21

            referencias_tablas[t_id][codigo_sub.lower()] = f"F{row_d}"
            row_d += 1

        # 1. Tabla 1: Entradas (EI)
        render_subtabla("EI", "Tabla 1. Entradas (EI)",
                        ["Num.", "Entrada / Transaccion", "Archivos referidos (FTR)", "Elementos de datos (DET)", "Nivel", "Valor"],
                        t_def["ei"])

        # 2. Tabla 2: Salidas (EO)
        render_subtabla("EO", "Tabla 2. Salidas (EO)",
                        ["Num.", "Salida (Reporte con Calculos)", "Archivos referidos (FTR)", "Elementos de datos (DET)", "Nivel", "Valor"],
                        t_def["eo"])

        # 3. Tabla 3: Peticiones (EQ)
        render_subtabla("EQ", "Tabla 3. Peticiones (EQ)",
                        ["Num.", "Peticion (Consulta Directa)", "Archivos referidos (FTR)", "Elementos de datos (DET)", "Nivel", "Valor"],
                        t_def["eq"])

        # 4. Tabla 4: Archivos Internos (ILF)
        render_subtabla("ILF", "Tabla 4. Archivos Internos (ILF)",
                        ["Num.", "Archivo / Tabla Interna", "Elementos de registro (RET)", "Elementos de datos (DET)", "Nivel", "Valor"],
                        t_def["ilf"])

        # 5. Tabla 5: Archivos Externos (EIF)
        render_subtabla("EIF", "Tabla 5. Archivos Externos (EIF)",
                        ["Num.", "Archivo / Interfaz Externa", "Elementos de registro (RET)", "Elementos de datos (DET)", "Nivel", "Valor"],
                        t_def["eif"])

        # TOTAL DE LA TABLA (Suma de los 5 subtotales)
        ws_desglose.merge_cells(start_row=row_d, start_column=1, end_row=row_d, end_column=5)
        lbl_tot_t = ws_desglose.cell(row=row_d, column=1, value=f"TOTAL PUNTOS DE FUNCION TABLA {t_id}: {t_nom.upper()}:")
        lbl_tot_t.font = font_total_green
        lbl_tot_t.fill = fill_total_green
        lbl_tot_t.alignment = Alignment(horizontal="right", vertical="center")
        lbl_tot_t.border = border_total_green

        for col in range(2, 6):
            ws_desglose.cell(row=row_d, column=col).border = border_total_green
            ws_desglose.cell(row=row_d, column=col).fill = fill_total_green

        formula_tot_t = f"={referencias_tablas[t_id]['ei']}+{referencias_tablas[t_id]['eo']}+{referencias_tablas[t_id]['eq']}+{referencias_tablas[t_id]['ilf']}+{referencias_tablas[t_id]['eif']}"
        val_tot_t = ws_desglose.cell(row=row_d, column=6)
        val_tot_t.value = formula_tot_t
        val_tot_t.font = font_total_green
        val_tot_t.fill = fill_total_green
        val_tot_t.alignment = Alignment(horizontal="center", vertical="center")
        val_tot_t.border = border_total_green
        ws_desglose.row_dimensions[row_d].height = 24

        referencias_tablas[t_id]["total_tabla"] = f"F{row_d}"
        totales_tablas_rows.append(f"F{row_d}")
        row_d += 2

    # GRAN TOTAL DE PUNTOS DE FUNCION NO AJUSTADOS (PFNA) AL PIE DE LA HOJA
    ws_desglose.merge_cells(start_row=row_d, start_column=1, end_row=row_d, end_column=5)
    lbl_gran_tot = ws_desglose.cell(row=row_d, column=1, value="GRAN TOTAL GENERAL DE PUNTOS DE FUNCION NO AJUSTADOS (13 TABLAS BD):")
    lbl_gran_tot.font = font_total_green
    lbl_gran_tot.fill = fill_total_green
    lbl_gran_tot.alignment = Alignment(horizontal="right", vertical="center")
    lbl_gran_tot.border = border_total_green

    for col in range(2, 6):
        ws_desglose.cell(row=row_d, column=col).border = border_total_green
        ws_desglose.cell(row=row_d, column=col).fill = fill_total_green

    formula_gran_tot = "=" + "+".join(totales_tablas_rows)
    val_gran_tot = ws_desglose.cell(row=row_d, column=6)
    val_gran_tot.value = formula_gran_tot
    val_gran_tot.font = font_total_green
    val_gran_tot.fill = fill_total_green
    val_gran_tot.alignment = Alignment(horizontal="center", vertical="center")
    val_gran_tot.border = border_total_green
    ws_desglose.row_dimensions[row_d].height = 28
    row_gran_total_pfna_desglose = row_d

    # Anchos de columna en Hoja Desglose
    col_w_desglose = {1: 10, 2: 48, 3: 24, 4: 38, 5: 14, 6: 18}
    for c_idx, width in col_w_desglose.items():
        ws_desglose.column_dimensions[get_column_letter(c_idx)].width = width

    # =========================================================================
    # HOJA 4: CONSOLIDADO PFNA (Matriz Resumen de las 13 Tablas)
    # =========================================================================
    ws_con = wb.create_sheet(title="Consolidado PFNA")
    ws_con.views.sheetView[0].showGridLines = True

    # Encabezado Principal
    ws_con.merge_cells("A1:I1")
    t_c = ws_con["A1"]
    t_c.value = "MATRIZ CONSOLIDADA DE PUNTOS DE FUNCION NO AJUSTADOS (PFNA) - 13 TABLAS"
    t_c.font = font_title
    t_c.fill = fill_title
    t_c.alignment = Alignment(horizontal="center", vertical="center")
    ws_con.row_dimensions[1].height = 36

    ws_con.merge_cells("A2:I2")
    s_c = ws_con["A2"]
    s_c.value = "Resumen ejecutivo por componente funcional (EI, EO, EQ, ILF, EIF) y peso porcentual de cada tabla"
    s_c.font = font_subtitle
    s_c.alignment = Alignment(horizontal="center", vertical="center")
    ws_con.row_dimensions[2].height = 20

    row_c = 4

    headers_con = [
        "Num.",
        "Tabla de Base de Datos",
        "Entradas (EI)",
        "Salidas (EO)",
        "Peticiones (EQ)",
        "Archivos Int. (ILF)",
        "Archivos Ext. (EIF)",
        "Total PFNA Tabla",
        "% Participacion"
    ]

    for c_i, h in enumerate(headers_con, 1):
        c = ws_con.cell(row=row_c, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_tbl_header
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = border_cell
    ws_con.row_dimensions[row_c].height = 26
    row_c += 1

    start_con_r = row_c
    for t_def in tablas_definiciones:
        t_id = t_def["id"]
        t_nom = t_def["nombre"]
        refs = referencias_tablas[t_id]
        is_even = (t_id % 2 == 0)

        ws_con.cell(row=row_c, column=1, value=t_id)
        ws_con.cell(row=row_c, column=2, value=f"Tabla: {t_nom}")
        
        # Enlaces con formulas a la hoja 'Desglose por Tabla (13 Tablas)'
        ws_con.cell(row=row_c, column=3, value=f"='Desglose por Tabla (13 Tablas)'!{refs['ei']}")
        ws_con.cell(row=row_c, column=4, value=f"='Desglose por Tabla (13 Tablas)'!{refs['eo']}")
        ws_con.cell(row=row_c, column=5, value=f"='Desglose por Tabla (13 Tablas)'!{refs['eq']}")
        ws_con.cell(row=row_c, column=6, value=f"='Desglose por Tabla (13 Tablas)'!{refs['ilf']}")
        ws_con.cell(row=row_c, column=7, value=f"='Desglose por Tabla (13 Tablas)'!{refs['eif']}")
        ws_con.cell(row=row_c, column=8, value=f"=SUM(C{row_c}:G{row_c})")
        # El porcentaje se calculara contra la fila de total (que estara en row_c = start_con_r + 13)
        row_tot_con = start_con_r + 13
        ws_con.cell(row=row_c, column=9, value=f"=H{row_c}/H{row_tot_con}")

        for col in range(1, 10):
            cell = ws_con.cell(row=row_c, column=col)
            cell.font = font_data_bold if col in [1, 2, 8] else font_data
            cell.border = border_cell
            if is_even:
                cell.fill = fill_zebra
            
            if col == 1:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            elif col == 2:
                cell.alignment = Alignment(horizontal="left", vertical="center")
            elif col == 9:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                cell.number_format = "0.0%"
            else:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                cell.number_format = "#,##0"

        ws_con.row_dimensions[row_c].height = 20
        row_c += 1
    end_con_r = row_c - 1

    # Fila de Totales Generales en Consolidado
    ws_con.merge_cells(start_row=row_c, start_column=1, end_row=row_c, end_column=2)
    tot_con_lbl = ws_con.cell(row=row_c, column=1, value="TOTALES GENERALES CONSOLIDADOS (PFNA):")
    tot_con_lbl.font = font_total_green
    tot_con_lbl.fill = fill_total_green
    tot_con_lbl.alignment = Alignment(horizontal="right", vertical="center")
    tot_con_lbl.border = border_total_green

    for col in range(2, 3):
        ws_con.cell(row=row_c, column=col).border = border_total_green
        ws_con.cell(row=row_c, column=col).fill = fill_total_green

    for col, letter in [(3, 'C'), (4, 'D'), (5, 'E'), (6, 'F'), (7, 'G'), (8, 'H')]:
        c_tot = ws_con.cell(row=row_c, column=col, value=f"=SUM({letter}{start_con_r}:{letter}{end_con_r})")
        c_tot.font = font_total_green
        c_tot.fill = fill_total_green
        c_tot.alignment = Alignment(horizontal="center", vertical="center")
        c_tot.border = border_total_green
        c_tot.number_format = "#,##0"

    c_tot_pct = ws_con.cell(row=row_c, column=9, value=f"=SUM(I{start_con_r}:I{end_con_r})")
    c_tot_pct.font = font_total_green
    c_tot_pct.fill = fill_total_green
    c_tot_pct.alignment = Alignment(horizontal="center", vertical="center")
    c_tot_pct.border = border_total_green
    c_tot_pct.number_format = "0.0%"
    ws_con.row_dimensions[row_c].height = 26
    row_total_pfna_consolidado = row_c

    # Anchos de columna en Hoja Consolidado
    col_w_con = {1: 8, 2: 30, 3: 16, 4: 16, 5: 16, 6: 18, 7: 18, 8: 20, 9: 16}
    for c_idx, width in col_w_con.items():
        ws_con.column_dimensions[get_column_letter(c_idx)].width = width

    # =========================================================================
    # HOJA 5: PUNTOS DE FUNCION AJUSTADOS (PFA) - 14 FACTORES DE ALBRECHT
    # =========================================================================
    ws_pfa = wb.create_sheet(title="PF Ajustados")
    ws_pfa.views.sheetView[0].showGridLines = True

    # Encabezado Principal
    ws_pfa.merge_cells("A1:E1")
    t3 = ws_pfa["A1"]
    t3.value = "CALCULO DE PUNTOS DE FUNCION AJUSTADOS (PFA) - MODELO DE ALBRECHT"
    t3.font = font_title
    t3.fill = fill_title
    t3.alignment = Alignment(horizontal="center", vertical="center")
    ws_pfa.row_dimensions[1].height = 36

    ws_pfa.merge_cells("A2:E2")
    s3 = ws_pfa["A2"]
    s3.value = "Evaluacion de los 14 Factores de Ajuste (GSC) | Formula Oficial: PFA = PFNA * [ 0.65 + 0.01 * SUMA(Fi) ]"
    s3.font = font_subtitle
    s3.alignment = Alignment(horizontal="center", vertical="center")
    ws_pfa.row_dimensions[2].height = 20

    row_a = 4

    # Cabeceras de los 14 Factores
    headers_gsc = ["Num.", "Caracteristica General del Sistema (GSC / Albrecht)", "Nivel de Influencia (0 - 5)", "Puntaje (Fi)", "Justificacion Tecnica Exhaustiva en LocalMarket"]
    for c_i, h in enumerate(headers_gsc, 1):
        cell_h = ws_pfa.cell(row=row_a, column=c_i, value=h)
        cell_h.font = font_tbl_header
        cell_h.fill = fill_tbl_header
        cell_h.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell_h.border = border_cell
    ws_pfa.row_dimensions[row_a].height = 24
    row_a += 1

    factores_albrecht_localmarket = [
        ["F1", "1. Comunicacion de datos", "4 - Significativo", 4, "Arquitectura cliente-servidor PWA con endpoints REST HTTPS, WebSockets para notificaciones y APIs externas (WhatsApp, Stripe)."],
        ["F2", "2. Procesamiento distribuido", "3 - Moderado", 3, "Procesamiento distribuido entre cliente (Service Workers, renderizado dinamico en dashboard.js) y servidor Node.js/PostgreSQL."],
        ["F3", "3. Rendimiento y performance", "4 - Significativo", 4, "Tiempos de respuesta criticos en catalogo comercial, sincronizacion offline PWA y confirmacion de compras en tiempo real."],
        ["F4", "4. Configuracion del equipamiento fuertemente utilizada", "3 - Moderado", 3, "Operacion continua en entorno Node.js / PostgreSQL con optimizacion de pool de conexiones (pg.Pool) y gestion de memoria."],
        ["F5", "5. Volumen de transacciones", "4 - Significativo", 4, "Picos intensivos de transacciones comerciales concurrentes durante horarios comerciales, liquidacion de carritos y consultas."],
        ["F6", "6. Entrada de datos interactiva en linea", "5 - Esencial", 5, "El 100% de las operaciones de registro, gestion de catalogo, cotizacion, pago y moderacion se ejecuta interactivamente."],
        ["F7", "7. Eficiencia del usuario final (Multiples pantallas)", "4 - Significativo", 4, "Panel de control multifuncional desacoplado con pestanas dinamicas (Auth, Catalogo, Pedidos, Notificaciones, Bitacora, Control)."],
        ["F8", "8. Actualizacion interactiva de archivos maestros", "4 - Significativo", 4, "Las tablas maestras (usuarios, productos, pedidos, stock) se actualizan en tiempo real con transacciones ACID en PostgreSQL."],
        ["F9", "9. Complejidad logica de transacciones / procesamiento", "4 - Significativo", 4, "Logica compleja de control de acceso RBAC, verificacion OTP con temporizador, calculo de comisiones y politicas de suspension."],
        ["F10", "10. Complejidad del procesamiento interno", "3 - Moderado", 3, "Calculo de margenes brutos, prorrateo de envios, conciliacion contable de ventas y algoritmos criptograficos (bcrypt, tokens)."],
        ["F11", "11. Reusabilidad del codigo", "4 - Significativo", 4, "Arquitectura modular profesional en Express (controllers, routes, middlewares RBAC) y componentes JS desacoplados y reusables."],
        ["F12", "12. Facilidad de instalacion y conversion", "4 - Significativo", 4, "Estructura lista con npm start, migraciones SQL DDL/DML automatizadas y compatibilidad PWA instalable con 1 clic en movil/PC."],
        ["F13", "13. Multiples instalaciones en diferentes organizaciones", "4 - Significativo", 4, "Disenado para ser replicable como marketplace local en diferentes municipios, camaras de comercio o ferias de productores."],
        ["F14", "14. Facilidad de cambios y mantenimiento", "4 - Significativo", 4, "Codigo estructurado y comentado, variables de entorno desacopladas (.env), alta cohesion y bajo acoplamiento arquitectonico."]
    ]

    start_gsc_r = row_a
    for idx, r_data in enumerate(factores_albrecht_localmarket):
        is_even = (idx % 2 == 1)
        for c_i, val in enumerate(r_data, 1):
            cell = ws_pfa.cell(row=row_a, column=c_i, value=val)
            cell.font = font_data
            cell.border = border_cell
            if is_even:
                cell.fill = fill_zebra
            
            if c_i == 1:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            elif c_i in [2, 5]:
                cell.alignment = Alignment(horizontal="left", vertical="center")
            else:
                cell.alignment = Alignment(horizontal="center", vertical="center")
        ws_pfa.row_dimensions[row_a].height = 20
        row_a += 1
    end_gsc_r = row_a - 1

    # Fila de Suma de Factores (SUMA(Fi))
    ws_pfa.merge_cells(start_row=row_a, start_column=1, end_row=row_a, end_column=3)
    lbl_sum_fi = ws_pfa.cell(row=row_a, column=1, value="SUMATORIA TOTAL DE FACTORES GENERALES DE COMPLEJIDAD (SUMA(Fi)):")
    lbl_sum_fi.font = font_subtotal
    lbl_sum_fi.fill = fill_subtotal
    lbl_sum_fi.alignment = Alignment(horizontal="right", vertical="center")
    lbl_sum_fi.border = border_subtotal

    for col in range(2, 4):
        ws_pfa.cell(row=row_a, column=col).border = border_subtotal
        ws_pfa.cell(row=row_a, column=col).fill = fill_subtotal

    val_sum_fi = ws_pfa.cell(row=row_a, column=4)
    val_sum_fi.value = f"=SUM(D{start_gsc_r}:D{end_gsc_r})"
    val_sum_fi.font = font_subtotal
    val_sum_fi.fill = fill_subtotal
    val_sum_fi.alignment = Alignment(horizontal="center", vertical="center")
    val_sum_fi.border = border_subtotal

    lbl_rango = ws_pfa.cell(row=row_a, column=5, value="Rango teorico: 0 a 70 puntos maximos")
    lbl_rango.font = Font(name="Calibri", size=9, italic=True, color="595959")
    lbl_rango.fill = fill_subtotal
    lbl_rango.alignment = Alignment(horizontal="center", vertical="center")
    lbl_rango.border = border_subtotal
    ws_pfa.row_dimensions[row_a].height = 22
    row_sum_fi = row_a
    row_a += 3

    # =========================================================================
    # CUADRO RESUMEN OFICIAL DE CALCULO DE PFA (Con totales verdes y formulas)
    # =========================================================================
    ws_pfa.merge_cells(start_row=row_a, start_column=1, end_row=row_a, end_column=5)
    t_res = ws_pfa.cell(row=row_a, column=1, value="CUADRO RESUMEN DE CALCULO DE PUNTOS DE FUNCION AJUSTADOS (PFA)")
    t_res.font = font_section
    t_res.fill = fill_section
    t_res.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_pfa.row_dimensions[row_a].height = 24
    row_a += 1

    headers_summary = ["Parametro / Metrica", "Valor", "Formula de Calculo", "Descripcion e Interpretacion Tecnica"]
    ws_pfa.cell(row=row_a, column=1, value="Parametro / Metrica").font = font_tbl_header
    ws_pfa.cell(row=row_a, column=1).fill = fill_tbl_header
    ws_pfa.cell(row=row_a, column=1).alignment = Alignment(horizontal="center", vertical="center")
    ws_pfa.cell(row=row_a, column=1).border = border_cell

    ws_pfa.cell(row=row_a, column=2, value="Valor").font = font_tbl_header
    ws_pfa.cell(row=row_a, column=2).fill = fill_tbl_header
    ws_pfa.cell(row=row_a, column=2).alignment = Alignment(horizontal="center", vertical="center")
    ws_pfa.cell(row=row_a, column=2).border = border_cell

    ws_pfa.cell(row=row_a, column=3, value="Formula de Calculo").font = font_tbl_header
    ws_pfa.cell(row=row_a, column=3).fill = fill_tbl_header
    ws_pfa.cell(row=row_a, column=3).alignment = Alignment(horizontal="center", vertical="center")
    ws_pfa.cell(row=row_a, column=3).border = border_cell

    ws_pfa.merge_cells(start_row=row_a, start_column=4, end_row=row_a, end_column=5)
    c_desc_h = ws_pfa.cell(row=row_a, column=4, value="Descripcion e Interpretacion Tecnica")
    c_desc_h.font = font_tbl_header
    c_desc_h.fill = fill_tbl_header
    c_desc_h.alignment = Alignment(horizontal="center", vertical="center")
    for col in range(4, 6):
        ws_pfa.cell(row=row_a, column=col).border = border_cell
    ws_pfa.row_dimensions[row_a].height = 22
    row_a += 1

    # Fila 1: PFNA
    ws_pfa.cell(row=row_a, column=1, value="Total PF No Ajustados (PFNA)").font = font_data_bold
    ws_pfa.cell(row=row_a, column=1).border = border_cell
    c_val_pfna = ws_pfa.cell(row=row_a, column=2, value="='Consolidado PFNA'!H18")
    c_val_pfna.font = font_data_bold
    c_val_pfna.border = border_cell
    c_val_pfna.alignment = Alignment(horizontal="center", vertical="center")
    c_val_pfna.number_format = "#,##0"
    ws_pfa.cell(row=row_a, column=3, value="='Consolidado PFNA'!H18").font = font_data
    ws_pfa.cell(row=row_a, column=3).border = border_cell
    ws_pfa.cell(row=row_a, column=3).alignment = Alignment(horizontal="center", vertical="center")
    ws_pfa.merge_cells(start_row=row_a, start_column=4, end_row=row_a, end_column=5)
    c_desc_pfna = ws_pfa.cell(row=row_a, column=4, value="Tamano funcional elemental no ajustado de las 13 tablas de la base de datos.")
    c_desc_pfna.font = font_data
    c_desc_pfna.border = border_cell
    for col in range(4, 6):
        ws_pfa.cell(row=row_a, column=col).border = border_cell
    ws_pfa.row_dimensions[row_a].height = 20
    row_pfna_val = row_a
    row_a += 1

    # Fila 2: SUM(Fi)
    ws_pfa.cell(row=row_a, column=1, value="Suma Factores de Complejidad (SUMA(Fi))").font = font_data_bold
    ws_pfa.cell(row=row_a, column=1).border = border_cell
    c_val_sumfi = ws_pfa.cell(row=row_a, column=2, value=f"=D{row_sum_fi}")
    c_val_sumfi.font = font_data_bold
    c_val_sumfi.border = border_cell
    c_val_sumfi.alignment = Alignment(horizontal="center", vertical="center")
    ws_pfa.cell(row=row_a, column=3, value=f"=SUM(D{start_gsc_r}:D{end_gsc_r})").font = font_data
    ws_pfa.cell(row=row_a, column=3).border = border_cell
    ws_pfa.cell(row=row_a, column=3).alignment = Alignment(horizontal="center", vertical="center")
    ws_pfa.merge_cells(start_row=row_a, start_column=4, end_row=row_a, end_column=5)
    c_desc_sfi = ws_pfa.cell(row=row_a, column=4, value="Grado de influencia acumulado de las 14 caracteristicas generales del sistema.")
    c_desc_sfi.font = font_data
    c_desc_sfi.border = border_cell
    for col in range(4, 6):
        ws_pfa.cell(row=row_a, column=col).border = border_cell
    ws_pfa.row_dimensions[row_a].height = 20
    row_sumfi_val = row_a
    row_a += 1

    # Fila 3: Factor de Ajuste (CAF)
    ws_pfa.cell(row=row_a, column=1, value="Factor de Ajuste de Complejidad (CAF)").font = font_data_bold
    ws_pfa.cell(row=row_a, column=1).border = border_cell
    c_val_caf = ws_pfa.cell(row=row_a, column=2, value=f"=0.65+(0.01*B{row_sumfi_val})")
    c_val_caf.font = font_data_bold
    c_val_caf.border = border_cell
    c_val_caf.alignment = Alignment(horizontal="center", vertical="center")
    c_val_caf.number_format = "0.00"
    ws_pfa.cell(row=row_a, column=3, value=f"=0.65 + 0.01 * B{row_sumfi_val}").font = font_data
    ws_pfa.cell(row=row_a, column=3).border = border_cell
    ws_pfa.cell(row=row_a, column=3).alignment = Alignment(horizontal="center", vertical="center")
    ws_pfa.merge_cells(start_row=row_a, start_column=4, end_row=row_a, end_column=5)
    c_desc_caf = ws_pfa.cell(row=row_a, column=4, value="Factor multiplicador (CAF) entre 0.65 y 1.35 segun el estandar de Albrecht.")
    c_desc_caf.font = font_data
    c_desc_caf.border = border_cell
    for col in range(4, 6):
        ws_pfa.cell(row=row_a, column=col).border = border_cell
    ws_pfa.row_dimensions[row_a].height = 20
    row_caf_val = row_a
    row_a += 1

    # Fila 4: TOTAL PFA (VERDE TOTALES)
    ws_pfa.cell(row=row_a, column=1, value="TOTAL PUNTOS DE FUNCION AJUSTADOS (PFA)").font = font_total_green
    ws_pfa.cell(row=row_a, column=1).fill = fill_total_green
    ws_pfa.cell(row=row_a, column=1).border = border_total_green
    
    c_val_pfa = ws_pfa.cell(row=row_a, column=2, value=f"=B{row_pfna_val}*B{row_caf_val}")
    c_val_pfa.font = font_total_green
    c_val_pfa.fill = fill_total_green
    c_val_pfa.border = border_total_green
    c_val_pfa.alignment = Alignment(horizontal="center", vertical="center")
    c_val_pfa.number_format = "0.00"

    ws_pfa.cell(row=row_a, column=3, value=f"=B{row_pfna_val} * B{row_caf_val}").font = font_total_green
    ws_pfa.cell(row=row_a, column=3).fill = fill_total_green
    ws_pfa.cell(row=row_a, column=3).border = border_total_green
    ws_pfa.cell(row=row_a, column=3).alignment = Alignment(horizontal="center", vertical="center")

    ws_pfa.merge_cells(start_row=row_a, start_column=4, end_row=row_a, end_column=5)
    c_desc_pfa = ws_pfa.cell(row=row_a, column=4, value="Tamano de software definitivo ajustado por complejidad para estimacion de esfuerzo y costos.")
    c_desc_pfa.font = font_total_green
    c_desc_pfa.fill = fill_total_green
    c_desc_pfa.border = border_total_green
    for col in range(4, 6):
        ws_pfa.cell(row=row_a, column=col).border = border_total_green
        ws_pfa.cell(row=row_a, column=col).fill = fill_total_green
    ws_pfa.row_dimensions[row_a].height = 28
    row_pfa_total = row_a
    row_a += 3

    # =========================================================================
    # SECCION COMPLEMENTARIA: ESTIMACION DE ESFUERZO, COSTO Y LINEAS DE CODIGO
    # =========================================================================
    ws_pfa.merge_cells(start_row=row_a, start_column=1, end_row=row_a, end_column=5)
    t_est = ws_pfa.cell(row=row_a, column=1, value="ESTIMACIONES DERIVADAS DE INGENIERIA DE SOFTWARE (BENCHMARKS COCOMO / QSM)")
    t_est.font = font_section
    t_est.fill = fill_section
    t_est.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_pfa.row_dimensions[row_a].height = 24
    row_a += 1

    headers_est = ["Metrica Derivada", "Valor Estimado", "Unidad de Medida", "Base de Referencia / Productividad"]
    ws_pfa.cell(row=row_a, column=1, value="Metrica Derivada").font = font_tbl_header
    ws_pfa.cell(row=row_a, column=1).fill = fill_tbl_header
    ws_pfa.cell(row=row_a, column=1).alignment = Alignment(horizontal="center", vertical="center")
    ws_pfa.cell(row=row_a, column=1).border = border_cell

    ws_pfa.cell(row=row_a, column=2, value="Valor Estimado").font = font_tbl_header
    ws_pfa.cell(row=row_a, column=2).fill = fill_tbl_header
    ws_pfa.cell(row=row_a, column=2).alignment = Alignment(horizontal="center", vertical="center")
    ws_pfa.cell(row=row_a, column=2).border = border_cell

    ws_pfa.cell(row=row_a, column=3, value="Unidad").font = font_tbl_header
    ws_pfa.cell(row=row_a, column=3).fill = fill_tbl_header
    ws_pfa.cell(row=row_a, column=3).alignment = Alignment(horizontal="center", vertical="center")
    ws_pfa.cell(row=row_a, column=3).border = border_cell

    ws_pfa.merge_cells(start_row=row_a, start_column=4, end_row=row_a, end_column=5)
    c_ref_h = ws_pfa.cell(row=row_a, column=4, value="Base de Referencia y Metodologia")
    c_ref_h.font = font_tbl_header
    c_ref_h.fill = fill_tbl_header
    c_ref_h.alignment = Alignment(horizontal="center", vertical="center")
    for col in range(4, 6):
        ws_pfa.cell(row=row_a, column=col).border = border_cell
    ws_pfa.row_dimensions[row_a].height = 22
    row_a += 1

    est_data = [
        ("Lineas de Codigo Fuente (KLOC) Equivalentes", f"=B{row_pfa_total}*53", "LOC (Lineas)", "Factor de conversion de 53 LOC/PF para JavaScript / Node.js y SQL (QSM)."),
        ("Esfuerzo de Desarrollo Estimado (Horas-Hombre)", f"=B{row_pfa_total}*8", "Horas-Hombre", "Tasa de productividad promedio de la industria de 8 horas por Punto de Funcion."),
        ("Esfuerzo de Desarrollo en Meses-Hombre", f"=(B{row_pfa_total}*8)/160", "Meses-Hombre", "Jornada laboral de 160 horas efectivas de desarrollo al mes."),
        ("Duracion Estimada del Proyecto (Meses)", f"=2.5*((B{row_pfa_total}*8)/160)^0.33", "Meses Calendario", "Ecuacion de duracion de COCOMO II con equipo optimo de 3 a 4 ingenieros."),
        ("Tamano del Equipo Recomendado", f"=((B{row_pfa_total}*8)/160)/(2.5*((B{row_pfa_total}*8)/160)^0.33)", "Desarrolladores", "Ratio entre Meses-Hombre totales y duracion optima del calendario.")
    ]

    for m_lbl, m_val, m_uni, m_desc in est_data:
        ws_pfa.cell(row=row_a, column=1, value=m_lbl).font = font_data_bold
        ws_pfa.cell(row=row_a, column=1).border = border_cell
        
        c_v = ws_pfa.cell(row=row_a, column=2, value=m_val)
        c_v.font = font_data_bold
        c_v.border = border_cell
        c_v.alignment = Alignment(horizontal="center", vertical="center")
        c_v.number_format = "#,##0.0"

        c_u = ws_pfa.cell(row=row_a, column=3, value=m_uni)
        c_u.font = font_data
        c_u.border = border_cell
        c_u.alignment = Alignment(horizontal="center", vertical="center")

        ws_pfa.merge_cells(start_row=row_a, start_column=4, end_row=row_a, end_column=5)
        c_d = ws_pfa.cell(row=row_a, column=4, value=m_desc)
        c_d.font = font_data
        c_d.border = border_cell
        for col in range(4, 6):
            ws_pfa.cell(row=row_a, column=col).border = border_cell
        ws_pfa.row_dimensions[row_a].height = 20
        row_a += 1

    # Anchos de columna en Hoja PFA
    col_w_a = {1: 8, 2: 44, 3: 25, 4: 16, 5: 65}
    for c_idx, width in col_w_a.items():
        ws_pfa.column_dimensions[get_column_letter(c_idx)].width = width

    # =========================================================================
    # GUARDAR EL LIBRO EN CARPETA DE DESCARGAS Y PROYECTO
    # =========================================================================
    ruta_downloads = os.path.join(os.path.expanduser("~"), "Downloads", "Puntos_de_Funcion_LocalMarket_13_Tablas_Completo.xlsx")
    ruta_proyecto = os.path.join(os.getcwd(), "Puntos_de_Funcion_LocalMarket_13_Tablas_Completo.xlsx")

    wb.save(ruta_downloads)
    wb.save(ruta_proyecto)

    print(f"[OK] Archivo Excel guardado exitosamente en:")
    print(f"  1. Downloads: {ruta_downloads}")
    print(f"  2. Proyecto:  {ruta_proyecto}")

if __name__ == "__main__":
    crear_libro_puntos_de_funcion()
