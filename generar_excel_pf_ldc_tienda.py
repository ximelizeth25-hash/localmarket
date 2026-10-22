"""
Script Profesional de Metricas de Software: Analisis de Puntos de Funcion (IFPUG / Albrecht) y LDC (PHP = 67)
Basado en el 'Diagrama E-R Tienda en Linea' y la plantilla estandarizada 'PuntosDeFuncion.DOC'

Entidades del Diagrama E-R:
1. CLIENTES (id_cliente, nombre, email, telefono, direccion)
2. PEDIDOS (id_pedido, fecha_pedido, total)
3. CATEGORIAS (id_categoria, nombre, descripcion)
4. PRODUCTOS (id_producto, nombre, precio, stock, id_categoria)
5. DETALLE_PEDIDOS (id_detalle, id_pedido, id_producto, cantidad, precio_unitario)

Reglas de Negocio Especificadas:
- Cada tabla se opera mediante un CRUD completo (Create/EI, Read/EQ, Update/EI, Delete/EI, ILF).
- Se tienen 3 reportes sacando informacion a PDF (Salidas Externas / EO con calculos matematicos derivados).
- Factor de conversion oficial a Lineas de Codigo: LDC PHP = 67 LDC/PF.
"""

import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def generar_excel_tienda_en_linea():
    wb = openpyxl.Workbook()
    # Eliminar hoja inicial por defecto
    wb.remove(wb.active)

    # =========================================================================
    # PALETA DE ESTILOS PROFESIONALES (Azul Marino #1F4E78, Verde Totales #E2F0D9)
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
    font_kpi_val = Font(name="Calibri", size=17, bold=True, color="1F4E78")
    font_kpi_lbl = Font(name="Calibri", size=8.5, bold=True, color="595959")

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

    # =========================================================================
    # HOJA 1: RESUMEN EJECUTIVO Y LDC (DASHBOARD KPI)
    # =========================================================================
    ws_kpi = wb.create_sheet(title="Resumen Ejecutivo y LDC")
    ws_kpi.views.sheetView[0].showGridLines = True

    # Titulo Principal
    ws_kpi.merge_cells("A1:G1")
    t0 = ws_kpi["A1"]
    t0.value = "TIENDA EN LINEA - ANALISIS DE PUNTOS DE FUNCION (IFPUG) Y LINEAS DE CODIGO (LDC)"
    t0.font = font_title
    t0.fill = fill_title
    t0.alignment = Alignment(horizontal="center", vertical="center")
    ws_kpi.row_dimensions[1].height = 36

    ws_kpi.merge_cells("A2:G2")
    s0 = ws_kpi["A2"]
    s0.value = "Modelo E-R: 5 Tablas con CRUD Completo | 3 Reportes PDF | Metrica de Conversion: PHP = 67 LDC/PF"
    s0.font = font_subtitle
    s0.alignment = Alignment(horizontal="center", vertical="center")
    ws_kpi.row_dimensions[2].height = 20

    # Tarjetas KPI Superiores (Filas 4 a 6)
    kpis = [
        ("TABLAS DEL MODELO E-R", "5 Tablas", "Clientes, Pedidos, Detalle, Prod, Cat", 1, 1),
        ("OPERACIONES CRUD", "20 Operaciones", "Altas, Bajas, Modificaciones y Consultas", 2, 2),
        ("REPORTES PDF (EO)", "3 Reportes", "Ventas, Factura y Stock Valorizado", 3, 3),
        ("TOTAL PFNA (BRUTOS)", "='Consolidado PFNA y LDC'!H13", "Puntos Funcionales Base", 4, 4),
        ("TOTAL PFA (AJUSTADOS)", "='PF Ajustados y LDC'!B25", "Con 14 Factores de Albrecht", 5, 5),
        ("METRICA PHP", "67 LDC / PF", "Factor Estandar QSM para PHP", 6, 6),
        ("TOTAL LDC ESTIMADAS", "='PF Ajustados'!B30", "Lineas de Codigo PHP Finales", 7, 7)
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
        if str(val).startswith("="):
            c_v.number_format = "#,##0.0"

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
    sec_ft = ws_kpi.cell(row=r_k, column=1, value="1. ESPECIFICACION TECNICA DEL SISTEMA TIENDA EN LINEA")
    sec_ft.font = font_section
    sec_ft.fill = fill_section
    sec_ft.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_kpi.row_dimensions[r_k].height = 24
    r_k += 1

    ft_items = [
        ("Sistema de Software", "Tienda en Linea (E-Commerce Web con Arquitectura PHP / MySQL)"),
        ("Diagrama Entidad-Relacion", "5 Entidades Principales: CLIENTES, PEDIDOS, CATEGORIAS, PRODUCTOS, DETALLE_PEDIDOS"),
        ("Regla Operativa CRUD", "Cada una de las 5 tablas implementa Crear (Alta), Leer (Consulta), Actualizar (Modificar) y Eliminar (Baja)"),
        ("Emision de Documentos PDF", "3 Reportes Ejecutivos en PDF con calculos derivados: Ventas por Periodo, Factura de Pedido, Inventario"),
        ("Metrica de Lenguaje (LDC)", "Factor de conversion oficial de la industria para PHP: 67 Lineas de Codigo por Punto de Funcion (QSM Benchmark)"),
        ("Metodologia de Estimacion", "Analisis de Puntos de Funcion no Ajustados (PFNA) y Ajustados (PFA) segun Modelo Albrecht / IFPUG Release 4.3")
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

    # Tabla Resumen de Puntos Funcionales y Lineas de Codigo (LDC)
    ws_kpi.merge_cells(start_row=r_k, start_column=1, end_row=r_k, end_column=7)
    sec_comp = ws_kpi.cell(row=r_k, column=1, value="2. DISTRIBUCION DE TAMANO FUNCIONAL (PF) Y LINEAS DE CODIGO PHP (LDC = 67)")
    sec_comp.font = font_section
    sec_comp.fill = fill_section
    sec_comp.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_kpi.row_dimensions[r_k].height = 24
    r_k += 1

    comp_headers = ["Tipo de Componente", "Sigla", "Operaciones / Elementos", "Puntos PFNA", "% Sistema", "LDC PHP (67 LDC/PF)", "KLOC (Miles de Lineas)"]
    for c_i, h in enumerate(comp_headers, 1):
        c = ws_kpi.cell(row=r_k, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_tbl_header
        c.alignment = Alignment(horizontal="center", vertical="center")
        c.border = border_cell
    ws_kpi.row_dimensions[r_k].height = 22
    r_k += 1

    comp_rows = [
        ("Entradas Externas (CRUD)", "EI", "15 Transacciones (3 por cada una de las 5 tablas: Alta, Modificar, Baja)", "='Consolidado PFNA y LDC'!C13", "=D18/'Consolidado PFNA y LDC'!H13", "=D18*67", "=F18/1000"),
        ("Salidas Externas (Reportes PDF)", "EO", "3 Reportes en PDF con calculos derivados (Ventas, Factura, Stock)", "='Consolidado PFNA y LDC'!D13", "=D19/'Consolidado PFNA y LDC'!H13", "=D19*67", "=F19/1000"),
        ("Peticiones / Consultas (CRUD)", "EQ", "5 Consultas directas de lectura/filtro (1 por cada tabla del CRUD)", "='Consolidado PFNA y LDC'!E13", "=D20/'Consolidado PFNA y LDC'!H13", "=D20*67", "=F20/1000"),
        ("Archivos Logicos Internos", "ILF", "5 Tablas del modelo E-R (Clientes, Pedidos, Detalle, Productos, Cat)", "='Consolidado PFNA y LDC'!F13", "=D21/'Consolidado PFNA y LDC'!H13", "=D21*67", "=F21/1000"),
        ("Archivos de Interfaz Externa", "EIF", "2 Interfaces externas (Pasarela de Pagos Stripe/PayPal y Motor PDF)", "='Consolidado PFNA y LDC'!G13", "=D22/'Consolidado PFNA y LDC'!H13", "=D22*67", "=F22/1000")
    ]

    start_comp_r = r_k
    for r_data in comp_rows:
        for c_i, val in enumerate(r_data, 1):
            cell = ws_kpi.cell(row=r_k, column=c_i, value=val)
            cell.font = font_data_bold if c_i in [1, 2] else font_data
            cell.border = border_cell
            if c_i == 1:
                cell.alignment = Alignment(horizontal="left", vertical="center")
            elif c_i == 3:
                cell.alignment = Alignment(horizontal="left", vertical="center")
            elif c_i in [4, 6]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                cell.number_format = "#,##0"
            elif c_i == 5:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                cell.number_format = "0.0%"
            elif c_i == 7:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                cell.number_format = "0.00"
            else:
                cell.alignment = Alignment(horizontal="center", vertical="center")
        ws_kpi.row_dimensions[r_k].height = 20
        r_k += 1
    end_comp_r = r_k - 1

    # Fila Total Componentes
    ws_kpi.merge_cells(start_row=r_k, start_column=1, end_row=r_k, end_column=3)
    t_comp_lbl = ws_kpi.cell(row=r_k, column=1, value="TOTAL GENERAL SISTEMA TIENDA EN LINEA (PFNA / LDC PHP):")
    t_comp_lbl.font = font_total_green
    t_comp_lbl.fill = fill_total_green
    t_comp_lbl.alignment = Alignment(horizontal="right", vertical="center")
    t_comp_lbl.border = border_total_green
    for col in range(2, 4):
        ws_kpi.cell(row=r_k, column=col).border = border_total_green
        ws_kpi.cell(row=r_k, column=col).fill = fill_total_green

    c_tot_pf = ws_kpi.cell(row=r_k, column=4, value=f"=SUM(D{start_comp_r}:D{end_comp_r})")
    c_tot_pf.font = font_total_green
    c_tot_pf.fill = fill_total_green
    c_tot_pf.alignment = Alignment(horizontal="center", vertical="center")
    c_tot_pf.border = border_total_green
    c_tot_pf.number_format = "#,##0"

    c_tot_pct = ws_kpi.cell(row=r_k, column=5, value=f"=SUM(E{start_comp_r}:E{end_comp_r})")
    c_tot_pct.font = font_total_green
    c_tot_pct.fill = fill_total_green
    c_tot_pct.alignment = Alignment(horizontal="center", vertical="center")
    c_tot_pct.border = border_total_green
    c_tot_pct.number_format = "0.0%"

    c_tot_ldc = ws_kpi.cell(row=r_k, column=6, value=f"=SUM(F{start_comp_r}:F{end_comp_r})")
    c_tot_ldc.font = font_total_green
    c_tot_ldc.fill = fill_total_green
    c_tot_ldc.alignment = Alignment(horizontal="center", vertical="center")
    c_tot_ldc.border = border_total_green
    c_tot_ldc.number_format = "#,##0"

    c_tot_kloc = ws_kpi.cell(row=r_k, column=7, value=f"=SUM(G{start_comp_r}:G{end_comp_r})")
    c_tot_kloc.font = font_total_green
    c_tot_kloc.fill = fill_total_green
    c_tot_kloc.alignment = Alignment(horizontal="center", vertical="center")
    c_tot_kloc.border = border_total_green
    c_tot_kloc.number_format = "0.00"
    ws_kpi.row_dimensions[r_k].height = 24

    col_w_kpi = {1: 26, 2: 10, 3: 50, 4: 16, 5: 14, 6: 22, 7: 24}
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

    # Definiciones
    ws_mat.merge_cells(start_row=row_m, start_column=1, end_row=row_m, end_column=7)
    sec_def = ws_mat.cell(row=row_m, column=1, value="1. DEFINICIONES OPERATIVAS DEL MODELO")
    sec_def.font = font_section
    sec_def.fill = fill_section
    sec_def.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_mat.row_dimensions[row_m].height = 24
    row_m += 1

    defs_data = [
        ("Entrada (EI)", "Transacciones elementales relacionadas con agregar (altas), eliminar (bajas) y modificar datos en las tablas CRUD."),
        ("Salida (EO)", "Consultas o generacion de reportes que involucran calculos derivados (como informes PDF de ventas, facturas con IVA o inventario)."),
        ("Peticion (EQ)", "Consultas directas o generacion de listados que no involucran calculos derivados (consultas y vistas CRUD de clientes o productos)."),
        ("Archivos Internos (ILF)", "Archivos logicos o tablas maestras que son mantenidas y alteradas directamente por el propio sistema (las 5 tablas de la BD)."),
        ("Archivos Externos (EIF)", "Archivos o servicios externos referenciados solo para consulta pero mantenidos externamente (Pasarela Stripe y Motor PDF).")
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

    # Tabla 1: EI
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

    # Tabla 2: EO / EQ
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

    # Tabla 3: ILF / EIF
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

    # Tabla 4: Ponderacion Oficial PF
    ws_mat.merge_cells(start_row=row_m, start_column=1, end_row=row_m, end_column=7)
    sec_t4 = ws_mat.cell(row=row_m, column=1, value="TABLA 4. TABLA OFICIAL DE PONDERACION DE PUNTOS DE FUNCION NO AJUSTADOS")
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

    col_w_m = {1: 32, 2: 26, 3: 26, 4: 26, 5: 16, 6: 16, 7: 16}
    for c_idx, width in col_w_m.items():
        ws_mat.column_dimensions[get_column_letter(c_idx)].width = width

    # =========================================================================
    # HOJA 3: DESGLOSE POR TABLA (CRUD COMPLETO Y 3 REPORTES PDF)
    # =========================================================================
    ws_desglose = wb.create_sheet(title="Desglose por Tabla (CRUD y PDF)")
    ws_desglose.views.sheetView[0].showGridLines = True

    # Encabezado Principal
    ws_desglose.merge_cells("A1:F1")
    t_d = ws_desglose["A1"]
    t_d.value = "DESGLOSE DE PUNTOS DE FUNCION NO AJUSTADOS (PFNA) - TIENDA EN LINEA"
    t_d.font = font_title
    t_d.fill = fill_title
    t_d.alignment = Alignment(horizontal="center", vertical="center")
    ws_desglose.row_dimensions[1].height = 36

    ws_desglose.merge_cells("A2:F2")
    s_d = ws_desglose["A2"]
    s_d.value = "Mapeo de CRUD para las 5 Tablas del Diagrama E-R, 3 Reportes PDF e Interfaces Externas"
    s_d.font = font_subtitle
    s_d.alignment = Alignment(horizontal="center", vertical="center")
    ws_desglose.row_dimensions[2].height = 20

    row_d = 4

    # Definiciones de las 5 tablas con CRUD completo
    tablas_er = [
        {
            "id": 1,
            "nombre": "CLIENTES",
            "titulo": "TABLA 1: CLIENTES (id_cliente, nombre, email, telefono, direccion)",
            "ei": [
                [1, "Alta de Cliente (Create / Registro)", "1 (CLIENTES)", "5 (id_cliente, nombre, email, tel, dir)", "Bajo", 3],
                [2, "Modificar Datos de Cliente (Update / Perfil)", "1 (CLIENTES)", "5 (nombre, email, tel, direccion)", "Bajo", 3],
                [3, "Baja de Cliente (Delete / Eliminar)", "2 (CLIENTES, PEDIDOS)", "1 (id_cliente)", "Bajo", 3]
            ],
            "eq": [
                [1, "Consulta / Busqueda de Cliente por ID o Email (Read)", "1 (CLIENTES)", "5 (id_cliente, nombre, email, telefono, direccion)", "Bajo", 3]
            ],
            "ilf": [
                [1, "Tabla: CLIENTES (Entidad maestra de compradores y datos de envio)", "1 (Registro Cliente)", "5 (id_cliente, nombre, email, telefono, direccion)", "Bajo", 7]
            ]
        },
        {
            "id": 2,
            "nombre": "CATEGORIAS",
            "titulo": "TABLA 2: CATEGORIAS (id_categoria, nombre, descripcion)",
            "ei": [
                [1, "Alta de Categoria (Create / Nueva Familia)", "1 (CATEGORIAS)", "3 (id_categoria, nombre, descripcion)", "Bajo", 3],
                [2, "Modificar Categoria (Update / Editar)", "1 (CATEGORIAS)", "3 (nombre, descripcion)", "Bajo", 3],
                [3, "Baja de Categoria (Delete / Desactivar)", "2 (CATEGORIAS, PRODUCTOS)", "1 (id_categoria)", "Bajo", 3]
            ],
            "eq": [
                [1, "Consulta / Listado de Categorias Activas (Read)", "1 (CATEGORIAS)", "3 (id_categoria, nombre, descripcion)", "Bajo", 3]
            ],
            "ilf": [
                [1, "Tabla: CATEGORIAS (Catalogo maestro de clasificacion de productos)", "1 (Registro Categoria)", "3 (id_categoria, nombre, descripcion)", "Bajo", 7]
            ]
        },
        {
            "id": 3,
            "nombre": "PRODUCTOS",
            "titulo": "TABLA 3: PRODUCTOS (id_producto, nombre, precio, stock, id_categoria)",
            "ei": [
                [1, "Alta de Producto (Create / Publicar)", "2 (PRODUCTOS, CATEGORIAS)", "5 (id_prod, nombre, precio, stock, id_cat)", "Medio", 4],
                [2, "Modificar Producto y Precios (Update / Editar)", "2 (PRODUCTOS, CATEGORIAS)", "5 (nombre, precio, stock, id_cat)", "Medio", 4],
                [3, "Baja de Producto (Delete / Retirar)", "2 (PRODUCTOS, DETALLE_PEDIDOS)", "1 (id_producto)", "Bajo", 3]
            ],
            "eq": [
                [1, "Consulta de Catalogo y Ficha de Producto (Read)", "2 (PRODUCTOS, CATEGORIAS)", "5 (id_producto, nombre, precio, stock, categoria)", "Bajo", 3]
            ],
            "ilf": [
                [1, "Tabla: PRODUCTOS (Almacen maestro de articulos, tarifas e inventario)", "1 (Registro Producto)", "5 (id_producto, nombre, precio, stock, id_categoria)", "Bajo", 7]
            ]
        },
        {
            "id": 4,
            "nombre": "PEDIDOS",
            "titulo": "TABLA 4: PEDIDOS (id_pedido, fecha_pedido, total, id_cliente)",
            "ei": [
                [1, "Crear Pedido de Venta (Create / Alta Orden)", "2 (PEDIDOS, CLIENTES)", "4 (id_pedido, fecha_pedido, total, id_cliente)", "Bajo", 3],
                [2, "Modificar Estado de Pedido (Update / Despacho)", "2 (PEDIDOS, CLIENTES)", "3 (id_pedido, estado, fecha)", "Bajo", 3],
                [3, "Cancelar / Eliminar Pedido (Delete / Baja)", "2 (PEDIDOS, DETALLE_PEDIDOS)", "2 (id_pedido, motivo)", "Bajo", 3]
            ],
            "eq": [
                [1, "Consulta de Pedido por Numero de Orden (Read)", "2 (PEDIDOS, CLIENTES)", "4 (id_pedido, fecha_pedido, total, cliente)", "Bajo", 3]
            ],
            "ilf": [
                [1, "Tabla: PEDIDOS (Registro maestro de transacciones de compraventa)", "1 (Registro Pedido)", "4 (id_pedido, fecha_pedido, total, id_cliente)", "Bajo", 7]
            ]
        },
        {
            "id": 5,
            "nombre": "DETALLE_PEDIDOS",
            "titulo": "TABLA 5: DETALLE_PEDIDOS (id_detalle, id_pedido, id_producto, cantidad, precio_unitario)",
            "ei": [
                [1, "Agregar Partida de Pedido (Create / Alta Renglon)", "3 (DETALLE_PEDIDOS, PEDIDOS, PRODUCTOS)", "5 (id_pedido, id_prod, cant, precio, subtotal)", "Alto", 6],
                [2, "Ajustar Cantidad de Producto en Pedido (Update)", "3 (DETALLE_PEDIDOS, PEDIDOS, PRODUCTOS)", "4 (id_detalle, cantidad, precio, subtotal)", "Medio", 4],
                [3, "Eliminar Partida de Pedido (Delete / Baja Renglon)", "2 (DETALLE_PEDIDOS, PEDIDOS)", "2 (id_detalle, id_pedido)", "Bajo", 3]
            ],
            "eq": [
                [1, "Consulta de Renglones de un Pedido Especifico (Read)", "2 (DETALLE_PEDIDOS, PRODUCTOS)", "5 (id_detalle, id_producto, nombre_prod, cantidad, precio)", "Bajo", 3]
            ],
            "ilf": [
                [1, "Tabla: DETALLE_PEDIDOS (Entidad de relacion que detalla productos y cantidades)", "1 (Registro Detalle)", "5 (id_detalle, id_pedido, id_producto, cantidad, precio_unitario)", "Bajo", 7]
            ]
        }
    ]

    refs_crud = {}
    totales_tablas_crud_rows = []

    def render_bloque(codigo_sub, titulo_sub, cabeceras, filas_datos, id_ref):
        nonlocal row_d
        ws_desglose.merge_cells(start_row=row_d, start_column=1, end_row=row_d, end_column=6)
        sec = ws_desglose.cell(row=row_d, column=1, value=titulo_sub)
        sec.font = font_subsection
        sec.fill = fill_subsection
        sec.alignment = Alignment(horizontal="left", vertical="center", indent=1)
        ws_desglose.row_dimensions[row_d].height = 22
        row_d += 1

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

        # Subtotal
        ws_desglose.merge_cells(start_row=row_d, start_column=1, end_row=row_d, end_column=5)
        lbl_sub = ws_desglose.cell(row=row_d, column=1, value=f"Subtotal {codigo_sub}:")
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

        refs_crud[id_ref] = f"F{row_d}"
        row_d += 1

    # Renderizar las 5 tablas del CRUD
    for t_data in tablas_er:
        t_id = t_data["id"]
        t_nom = t_data["nombre"]
        t_tit = t_data["titulo"]

        # Banner de la Tabla E-R
        ws_desglose.merge_cells(start_row=row_d, start_column=1, end_row=row_d, end_column=6)
        banner = ws_desglose.cell(row=row_d, column=1, value=t_tit.upper())
        banner.font = font_title
        banner.fill = fill_title
        banner.alignment = Alignment(horizontal="left", vertical="center", indent=1)
        ws_desglose.row_dimensions[row_d].height = 28
        row_d += 1

        # 1. Entradas (EI) del CRUD: Alta, Modificar, Baja
        render_bloque("EI", f"Entradas CRUD (EI) - {t_nom}",
                      ["Num.", "Transaccion CRUD", "Archivos referidos (FTR)", "Elementos de datos (DET)", "Nivel", "Valor"],
                      t_data["ei"], f"t{t_id}_ei")

        # 2. Peticiones (EQ) del CRUD: Consulta
        render_bloque("EQ", f"Consulta CRUD (EQ) - {t_nom}",
                      ["Num.", "Peticion / Consulta", "Archivos referidos (FTR)", "Elementos de datos (DET)", "Nivel", "Valor"],
                      t_data["eq"], f"t{t_id}_eq")

        # 3. Archivo Interno (ILF): La tabla en BD
        render_bloque("ILF", f"Archivo Logico Interno (ILF) - {t_nom}",
                      ["Num.", "Tabla en Base de Datos", "Elementos de registro (RET)", "Elementos de datos (DET)", "Nivel", "Valor"],
                      t_data["ilf"], f"t{t_id}_ilf")

        # TOTAL TABLA
        ws_desglose.merge_cells(start_row=row_d, start_column=1, end_row=row_d, end_column=5)
        lbl_tot_t = ws_desglose.cell(row=row_d, column=1, value=f"TOTAL PUNTOS DE FUNCION TABLA {t_nom}:")
        lbl_tot_t.font = font_total_green
        lbl_tot_t.fill = fill_total_green
        lbl_tot_t.alignment = Alignment(horizontal="right", vertical="center")
        lbl_tot_t.border = border_total_green

        for col in range(2, 6):
            ws_desglose.cell(row=row_d, column=col).border = border_total_green
            ws_desglose.cell(row=row_d, column=col).fill = fill_total_green

        f_tot_t = f"={refs_crud[f't{t_id}_ei']}+{refs_crud[f't{t_id}_eq']}+{refs_crud[f't{t_id}_ilf']}"
        v_tot_t = ws_desglose.cell(row=row_d, column=6, value=f_tot_t)
        v_tot_t.font = font_total_green
        v_tot_t.fill = fill_total_green
        v_tot_t.alignment = Alignment(horizontal="center", vertical="center")
        v_tot_t.border = border_total_green
        ws_desglose.row_dimensions[row_d].height = 24

        refs_crud[f"t{t_id}_total"] = f"F{row_d}"
        totales_tablas_crud_rows.append(f"F{row_d}")
        row_d += 2

    # =========================================================================
    # SECCION ESPECIAL: LOS 3 REPORTES SACANDO INFORMACION A PDF (EO)
    # =========================================================================
    ws_desglose.merge_cells(start_row=row_d, start_column=1, end_row=row_d, end_column=6)
    banner_pdf = ws_desglose.cell(row=row_d, column=1, value="SECCION ESPECIAL: 3 REPORTES SACANDO INFORMACION A PDF (SALIDAS / EO)")
    banner_pdf.font = font_title
    banner_pdf.fill = fill_title
    banner_pdf.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_desglose.row_dimensions[row_d].height = 28
    row_d += 1

    reportes_pdf_data = [
        [1, "Reporte PDF 1: Ventas por Periodo y Clientes (Calculo de ventas brutas, IVA 16% y ticket promedio)", "3 (PEDIDOS, CLIENTES, DETALLE_PEDIDOS)", "7 (id_pedido, fecha, cliente, subtotal, iva, total, promedio)", "Medio", 5],
        [2, "Reporte PDF 2: Factura / Comprobante Detallado de Pedido (Calculo de cantidad*precio, subtotales e impuestos)", "3 (PEDIDOS, DETALLE_PEDIDOS, PRODUCTOS)", "8 (id_pedido, fecha, cliente, producto, cant, p_unit, subtotal, total)", "Medio", 5],
        [3, "Reporte PDF 3: Inventario Valorizado y Stock Critico (Calculo de SUM(stock*precio) por categoria y % participacion)", "2 (PRODUCTOS, CATEGORIAS)", "7 (categoria, producto, stock, precio, valor_stock, pct_inv, alerta)", "Medio", 5]
    ]

    render_bloque("EO (PDF)", "Salidas Externas (EO) - 3 Reportes en Formato PDF con Calculos Derivados",
                  ["Num.", "Reporte PDF / Calculo Derivado", "Archivos referidos (FTR)", "Elementos de datos (DET)", "Nivel", "Valor"],
                  reportes_pdf_data, "reportes_pdf")
    totales_tablas_crud_rows.append(refs_crud["reportes_pdf"])
    row_d += 1

    # =========================================================================
    # SECCION ESPECIAL: ARCHIVOS DE INTERFAZ EXTERNA (EIF)
    # =========================================================================
    ws_desglose.merge_cells(start_row=row_d, start_column=1, end_row=row_d, end_column=6)
    banner_eif = ws_desglose.cell(row=row_d, column=1, value="SECCION ESPECIAL: ARCHIVOS DE INTERFAZ EXTERNA (EIF)")
    banner_eif.font = font_title
    banner_eif.fill = fill_title
    banner_eif.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_desglose.row_dimensions[row_d].height = 28
    row_d += 1

    eif_data = [
        [1, "Pasarela de Pagos Externa (Stripe / PayPal API para procesamiento de cobros)", "1 (Registro Transaccion)", "5 (trans_id, amount, currency, status, fee)", "Bajo", 5],
        [2, "Motor Externo de Renderizado y Emision PDF (Libreria FPDF / TCPDF en PHP)", "1 (Documento PDF)", "4 (doc_id, page_count, format, file_bytes)", "Bajo", 5]
    ]

    render_bloque("EIF", "Archivos de Interfaz Externa (EIF) - Servicios Integrados en PHP",
                  ["Num.", "Interfaz / Servicio Externo", "Elementos de registro (RET)", "Elementos de datos (DET)", "Nivel", "Valor"],
                  eif_data, "interfaces_eif")
    totales_tablas_crud_rows.append(refs_crud["interfaces_eif"])
    row_d += 1

    # GRAN TOTAL DE PUNTOS DE FUNCION NO AJUSTADOS (PFNA)
    ws_desglose.merge_cells(start_row=row_d, start_column=1, end_row=row_d, end_column=5)
    lbl_gran_tot = ws_desglose.cell(row=row_d, column=1, value="GRAN TOTAL GENERAL DE PUNTOS DE FUNCION NO AJUSTADOS (PFNA):")
    lbl_gran_tot.font = font_total_green
    lbl_gran_tot.fill = fill_total_green
    lbl_gran_tot.alignment = Alignment(horizontal="right", vertical="center")
    lbl_gran_tot.border = border_total_green

    for col in range(2, 6):
        ws_desglose.cell(row=row_d, column=col).border = border_total_green
        ws_desglose.cell(row=row_d, column=col).fill = fill_total_green

    formula_gran_tot = "=" + "+".join(totales_tablas_crud_rows)
    val_gran_tot = ws_desglose.cell(row=row_d, column=6, value=formula_gran_tot)
    val_gran_tot.font = font_total_green
    val_gran_tot.fill = fill_total_green
    val_gran_tot.alignment = Alignment(horizontal="center", vertical="center")
    val_gran_tot.border = border_total_green
    ws_desglose.row_dimensions[row_d].height = 28
    refs_crud["gran_total_pfna"] = f"F{row_d}"

    col_w_desglose = {1: 10, 2: 48, 3: 24, 4: 38, 5: 14, 6: 18}
    for c_idx, width in col_w_desglose.items():
        ws_desglose.column_dimensions[get_column_letter(c_idx)].width = width

    # =========================================================================
    # HOJA 4: CONSOLIDADO PFNA Y LDC (PHP = 67 LDC/PF)
    # =========================================================================
    ws_con = wb.create_sheet(title="Consolidado PFNA y LDC")
    ws_con.views.sheetView[0].showGridLines = True

    # Encabezado Principal
    ws_con.merge_cells("A1:K1")
    t_c = ws_con["A1"]
    t_c.value = "MATRIZ CONSOLIDADA DE PUNTOS DE FUNCION NO AJUSTADOS (PFNA) Y LDC (PHP = 67)"
    t_c.font = font_title
    t_c.fill = fill_title
    t_c.alignment = Alignment(horizontal="center", vertical="center")
    ws_con.row_dimensions[1].height = 36

    ws_con.merge_cells("A2:K2")
    s_c = ws_con["A2"]
    s_c.value = "Consolidado por Tabla y Componente | Factor de Conversion: 67 Lineas de Codigo por Punto de Funcion"
    s_c.font = font_subtitle
    s_c.alignment = Alignment(horizontal="center", vertical="center")
    ws_con.row_dimensions[2].height = 20

    row_c = 4

    headers_con = [
        "Num.",
        "Modulo / Entidad E-R",
        "Entradas (EI)",
        "Salidas (EO)",
        "Peticiones (EQ)",
        "Archivos Int. (ILF)",
        "Archivos Ext. (EIF)",
        "Total PFNA",
        "% Sistema",
        "LDC PHP (67 LDC/PF)",
        "KLOC (Miles LDC)"
    ]

    for c_i, h in enumerate(headers_con, 1):
        c = ws_con.cell(row=row_c, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_tbl_header
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = border_cell
    ws_con.row_dimensions[row_c].height = 26
    row_c += 1

    # Filas de las 5 tablas + Reportes PDF + EIF
    filas_con_data = [
        (1, "Tabla: CLIENTES (CRUD)", f"='Desglose por Tabla (CRUD y PDF)'!{refs_crud['t1_ei']}", 0, f"='Desglose por Tabla (CRUD y PDF)'!{refs_crud['t1_eq']}", f"='Desglose por Tabla (CRUD y PDF)'!{refs_crud['t1_ilf']}", 0),
        (2, "Tabla: CATEGORIAS (CRUD)", f"='Desglose por Tabla (CRUD y PDF)'!{refs_crud['t2_ei']}", 0, f"='Desglose por Tabla (CRUD y PDF)'!{refs_crud['t2_eq']}", f"='Desglose por Tabla (CRUD y PDF)'!{refs_crud['t2_ilf']}", 0),
        (3, "Tabla: PRODUCTOS (CRUD)", f"='Desglose por Tabla (CRUD y PDF)'!{refs_crud['t3_ei']}", 0, f"='Desglose por Tabla (CRUD y PDF)'!{refs_crud['t3_eq']}", f"='Desglose por Tabla (CRUD y PDF)'!{refs_crud['t3_ilf']}", 0),
        (4, "Tabla: PEDIDOS (CRUD)", f"='Desglose por Tabla (CRUD y PDF)'!{refs_crud['t4_ei']}", 0, f"='Desglose por Tabla (CRUD y PDF)'!{refs_crud['t4_eq']}", f"='Desglose por Tabla (CRUD y PDF)'!{refs_crud['t4_ilf']}", 0),
        (5, "Tabla: DETALLE_PEDIDOS (CRUD)", f"='Desglose por Tabla (CRUD y PDF)'!{refs_crud['t5_ei']}", 0, f"='Desglose por Tabla (CRUD y PDF)'!{refs_crud['t5_eq']}", f"='Desglose por Tabla (CRUD y PDF)'!{refs_crud['t5_ilf']}", 0),
        (6, "Reportes en Formato PDF (3 Informes)", 0, f"='Desglose por Tabla (CRUD y PDF)'!{refs_crud['reportes_pdf']}", 0, 0, 0),
        (7, "Interfaces Externas (Stripe y PDF)", 0, 0, 0, 0, f"='Desglose por Tabla (CRUD y PDF)'!{refs_crud['interfaces_eif']}")
    ]

    start_con_r = row_c
    row_tot_con = start_con_r + len(filas_con_data)

    for idx, (n_i, nom_mod, v_ei, v_eo, v_eq, v_ilf, v_eif) in enumerate(filas_con_data, 1):
        is_even = (idx % 2 == 0)
        ws_con.cell(row=row_c, column=1, value=n_i)
        ws_con.cell(row=row_c, column=2, value=nom_mod)
        ws_con.cell(row=row_c, column=3, value=v_ei)
        ws_con.cell(row=row_c, column=4, value=v_eo)
        ws_con.cell(row=row_c, column=5, value=v_eq)
        ws_con.cell(row=row_c, column=6, value=v_ilf)
        ws_con.cell(row=row_c, column=7, value=v_eif)
        ws_con.cell(row=row_c, column=8, value=f"=SUM(C{row_c}:G{row_c})")
        ws_con.cell(row=row_c, column=9, value=f"=H{row_c}/H{row_tot_con}")
        ws_con.cell(row=row_c, column=10, value=f"=H{row_c}*67")
        ws_con.cell(row=row_c, column=11, value=f"=J{row_c}/1000")

        for col in range(1, 12):
            cell = ws_con.cell(row=row_c, column=col)
            cell.font = font_data_bold if col in [1, 2, 8, 10] else font_data
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
            elif col == 11:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                cell.number_format = "0.00"
            else:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                cell.number_format = "#,##0"

        ws_con.row_dimensions[row_c].height = 20
        row_c += 1
    end_con_r = row_c - 1

    # Fila de Totales en Consolidado
    ws_con.merge_cells(start_row=row_c, start_column=1, end_row=row_c, end_column=2)
    tot_con_lbl = ws_con.cell(row=row_c, column=1, value="TOTALES GENERALES CONSOLIDADOS (PFNA / LDC PHP):")
    tot_con_lbl.font = font_total_green
    tot_con_lbl.fill = fill_total_green
    tot_con_lbl.alignment = Alignment(horizontal="right", vertical="center")
    tot_con_lbl.border = border_total_green

    for col in range(2, 3):
        ws_con.cell(row=row_c, column=col).border = border_total_green
        ws_con.cell(row=row_c, column=col).fill = fill_total_green

    for col, letter in [(3, 'C'), (4, 'D'), (5, 'E'), (6, 'F'), (7, 'G'), (8, 'H'), (10, 'J')]:
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

    c_tot_kloc = ws_con.cell(row=row_c, column=11, value=f"=SUM(K{start_con_r}:K{end_con_r})")
    c_tot_kloc.font = font_total_green
    c_tot_kloc.fill = fill_total_green
    c_tot_kloc.alignment = Alignment(horizontal="center", vertical="center")
    c_tot_kloc.border = border_total_green
    c_tot_kloc.number_format = "0.00"
    ws_con.row_dimensions[row_c].height = 26

    col_w_con = {1: 8, 2: 32, 3: 15, 4: 15, 5: 15, 6: 18, 7: 18, 8: 18, 9: 14, 10: 20, 11: 18}
    for c_idx, width in col_w_con.items():
        ws_con.column_dimensions[get_column_letter(c_idx)].width = width

    # =========================================================================
    # HOJA 5: PUNTOS DE FUNCION AJUSTADOS (PFA) Y ESTIMACION LDC
    # =========================================================================
    ws_pfa = wb.create_sheet(title="PF Ajustados y LDC")
    ws_pfa.views.sheetView[0].showGridLines = True

    # Encabezado Principal
    ws_pfa.merge_cells("A1:E1")
    t3 = ws_pfa["A1"]
    t3.value = "CALCULO DE PUNTOS DE FUNCION AJUSTADOS (PFA) Y LDC EN PHP"
    t3.font = font_title
    t3.fill = fill_title
    t3.alignment = Alignment(horizontal="center", vertical="center")
    ws_pfa.row_dimensions[1].height = 36

    ws_pfa.merge_cells("A2:E2")
    s3 = ws_pfa["A2"]
    s3.value = "Evaluacion de 14 Factores de Albrecht | Formula: PFA = PFNA * [ 0.65 + 0.01 * SUMA(Fi) ] | LDC PHP = 67"
    s3.font = font_subtitle
    s3.alignment = Alignment(horizontal="center", vertical="center")
    ws_pfa.row_dimensions[2].height = 20

    row_a = 4

    headers_gsc = ["Num.", "Caracteristica General del Sistema (Albrecht / GSC)", "Nivel (0 - 5)", "Puntaje (Fi)", "Justificacion Tecnica en el Sistema Tienda en Linea PHP"]
    for c_i, h in enumerate(headers_gsc, 1):
        cell_h = ws_pfa.cell(row=row_a, column=c_i, value=h)
        cell_h.font = font_tbl_header
        cell_h.fill = fill_tbl_header
        cell_h.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell_h.border = border_cell
    ws_pfa.row_dimensions[row_a].height = 24
    row_a += 1

    factores_tienda = [
        ["F1", "1. Comunicacion de datos", "4 - Significativo", 4, "Arquitectura web cliente-servidor con peticiones HTTP/HTTPS, endpoints REST y generacion de reportes PDF descargables."],
        ["F2", "2. Procesamiento distribuido", "3 - Moderado", 3, "Procesamiento dividido entre front-end (validaciones interactivas) y back-end en PHP conectado al motor MySQL."],
        ["F3", "3. Rendimiento y performance", "3 - Moderado", 3, "Tiempos de respuesta estandar para e-commerce en navegacion de productos, carrito y generacion agil de PDFs."],
        ["F4", "4. Configuracion del equipamiento fuertemente utilizada", "3 - Moderado", 3, "Entorno de hosting Apache/Nginx con servidor PHP-FPM y optimizacion de consultas SQL con indices."],
        ["F5", "5. Volumen de transacciones", "3 - Moderado", 3, "Volumen tipico de comercio electronico local con picos de ordenes de compra y emision de comprobantes."],
        ["F6", "6. Entrada de datos interactiva en linea", "5 - Esencial", 5, "El 100% de las transacciones CRUD de clientes, pedidos, categorias y productos se captura interactivamente."],
        ["F7", "7. Eficiencia del usuario final (Multiples pantallas)", "4 - Significativo", 4, "Vistas modulares para gestion de catalogo, administracion de clientes, partidas de pedidos y visor de PDFs."],
        ["F8", "8. Actualizacion interactiva de archivos maestros", "4 - Significativo", 4, "Descuento inmediato de stock en tabla PRODUCTOS e insercion sincronizada en DETALLE_PEDIDOS y PEDIDOS."],
        ["F9", "9. Complejidad logica de transacciones", "3 - Moderado", 3, "Validacion de stock disponible, calculo de subtotales, prorrateo de IVA (16%) y emision de facturas PDF."],
        ["F10", "10. Complejidad del procesamiento interno", "3 - Moderado", 3, "Calculo de totales monetarios, formato de moneda, maquetacion vectorial de celdas y tablas en libreria PDF."],
        ["F11", "11. Reusabilidad del codigo", "3 - Moderado", 3, "Diseno modular en PHP (clases/modelos para cada tabla, controladores CRUD y clase utilitaria FPDF/TCPDF)."],
        ["F12", "12. Facilidad de instalacion y conversion", "3 - Moderado", 3, "Scripts SQL DDL de creacion de tablas, facil despliegue en servidor LAMP/XAMPP y configuracion de conexion."],
        ["F13", "13. Multiples instalaciones en diferentes organizaciones", "3 - Moderado", 3, "Estructura parametrizable para ser implementada en diferentes tiendas o comercios con minimo cambio."],
        ["F14", "14. Facilidad de cambios y mantenimiento", "4 - Significativo", 4, "Codigo estructurado en PHP con separacion de logica de datos, vistas CRUD y plantillas de reportes PDF."]
    ]

    start_gsc_r = row_a
    for idx, r_data in enumerate(factores_tienda):
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

    # Suma de Factores
    ws_pfa.merge_cells(start_row=row_a, start_column=1, end_row=row_a, end_column=3)
    lbl_sum_fi = ws_pfa.cell(row=row_a, column=1, value="SUMATORIA TOTAL DE FACTORES DE COMPLEJIDAD (SUMA(Fi)):")
    lbl_sum_fi.font = font_subtotal
    lbl_sum_fi.fill = fill_subtotal
    lbl_sum_fi.alignment = Alignment(horizontal="right", vertical="center")
    lbl_sum_fi.border = border_subtotal

    for col in range(2, 4):
        ws_pfa.cell(row=row_a, column=col).border = border_subtotal
        ws_pfa.cell(row=row_a, column=col).fill = fill_subtotal

    val_sum_fi = ws_pfa.cell(row=row_a, column=4, value=f"=SUM(D{start_gsc_r}:D{end_gsc_r})")
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

    # Cuadro Resumen de PFA y LDC
    ws_pfa.merge_cells(start_row=row_a, start_column=1, end_row=row_a, end_column=5)
    t_res = ws_pfa.cell(row=row_a, column=1, value="CUADRO RESUMEN DE PUNTOS DE FUNCION AJUSTADOS (PFA) Y LDC EN PHP")
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
    c_val_pfna = ws_pfa.cell(row=row_a, column=2, value="='Consolidado PFNA y LDC'!H13")
    c_val_pfna.font = font_data_bold
    c_val_pfna.border = border_cell
    c_val_pfna.alignment = Alignment(horizontal="center", vertical="center")
    c_val_pfna.number_format = "#,##0"
    ws_pfa.cell(row=row_a, column=3, value="='Consolidado PFNA y LDC'!H13").font = font_data
    ws_pfa.cell(row=row_a, column=3).border = border_cell
    ws_pfa.cell(row=row_a, column=3).alignment = Alignment(horizontal="center", vertical="center")
    ws_pfa.merge_cells(start_row=row_a, start_column=4, end_row=row_a, end_column=5)
    c_desc_pfna = ws_pfa.cell(row=row_a, column=4, value="Tamano funcional no ajustado del sistema (5 tablas CRUD, 3 PDF y 2 EIF).")
    c_desc_pfna.font = font_data
    c_desc_pfna.border = border_cell
    for col in range(4, 6):
        ws_pfa.cell(row=row_a, column=col).border = border_cell
    ws_pfa.row_dimensions[row_a].height = 20
    row_pfna_val = row_a
    row_a += 1

    # Fila 2: SUM(Fi)
    ws_pfa.cell(row=row_a, column=1, value="Suma Factores Complejidad (SUMA(Fi))").font = font_data_bold
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

    # Fila 3: CAF
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
    c_desc_caf = ws_pfa.cell(row=row_a, column=4, value="Factor multiplicador de complejidad segun formula oficial de Albrecht.")
    c_desc_caf.font = font_data
    c_desc_caf.border = border_cell
    for col in range(4, 6):
        ws_pfa.cell(row=row_a, column=col).border = border_cell
    ws_pfa.row_dimensions[row_a].height = 20
    row_caf_val = row_a
    row_a += 1

    # Fila 4: TOTAL PFA
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
    c_desc_pfa = ws_pfa.cell(row=row_a, column=4, value="Tamano funcional definitivo ajustado del sistema Tienda en Linea.")
    c_desc_pfa.font = font_total_green
    c_desc_pfa.fill = fill_total_green
    c_desc_pfa.border = border_total_green
    for col in range(4, 6):
        ws_pfa.cell(row=row_a, column=col).border = border_total_green
        ws_pfa.cell(row=row_a, column=col).fill = fill_total_green
    ws_pfa.row_dimensions[row_a].height = 28
    row_pfa_total = row_a
    row_a += 2

    # SECCION LDC (PHP = 67)
    ws_pfa.merge_cells(start_row=row_a, start_column=1, end_row=row_a, end_column=5)
    t_ldc = ws_pfa.cell(row=row_a, column=1, value="CONVERSION A LINEAS DE CODIGO (LDC) EN LENGUAJE PHP (LCD PHP = 67)")
    t_ldc.font = font_section
    t_ldc.fill = fill_section
    t_ldc.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_pfa.row_dimensions[row_a].height = 24
    row_a += 1

    headers_ldc = ["Metrica de Codigo y Productividad", "Valor Estimado", "Unidad de Medida", "Base Metodologica / Benchmark QSM"]
    ws_pfa.cell(row=row_a, column=1, value="Metrica de Codigo y Productividad").font = font_tbl_header
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
    c_m_h = ws_pfa.cell(row=row_a, column=4, value="Base Metodologica y Referencia Tecnica")
    c_m_h.font = font_tbl_header
    c_m_h.fill = fill_tbl_header
    c_m_h.alignment = Alignment(horizontal="center", vertical="center")
    for col in range(4, 6):
        ws_pfa.cell(row=row_a, column=col).border = border_cell
    ws_pfa.row_dimensions[row_a].height = 22
    row_a += 1

    ldc_rows = [
        ("Factor de Conversion de Lenguaje (PHP)", 67, "LDC / PF", "Factor oficial estandarizado de la industria para PHP (Quantitative Software Management - QSM)."),
        ("Lineas de Codigo Base No Ajustadas (LDC_PFNA)", f"=B{row_pfna_val}*67", "Lineas (LDC)", "Calculo directo del tamano en lineas: PFNA * 67 LDC/PF."),
        ("TOTAL LINEAS DE CODIGO AJUSTADAS (LDC_PFA)", f"=B{row_pfa_total}*67", "Lineas (LDC)", "Total definitivo de lineas de codigo estimadas en PHP ajustadas por complejidad: PFA * 67."),
        ("KLOC Equivalentes (Miles de Lineas de Codigo)", f"=(B{row_pfa_total}*67)/1000", "KLOC", "Miles de lineas de codigo fuente necesarias para construir la aplicacion PHP."),
        ("Esfuerzo de Desarrollo Estimado (Horas-Hombre)", f"=B{row_pfa_total}*6.5", "Horas-Hombre", "Productividad promedio en PHP para CRUD y reportes PDF: ~6.5 horas por Punto de Funcion."),
        ("Esfuerzo de Desarrollo en Meses-Hombre", f"=(B{row_pfa_total}*6.5)/160", "Meses-Hombre", "Jornada laboral estandar de 160 horas de desarrollo al mes."),
        ("Duracion Estimada del Proyecto (Meses)", f"=2.5*((B{row_pfa_total}*6.5)/160)^0.33", "Meses Calendario", "Ecuacion de tiempo calendario COCOMO II con equipo de 2 a 3 desarrolladores.")
    ]

    for m_lbl, m_val, m_uni, m_desc in ldc_rows:
        is_highlight = "TOTAL LINEAS DE CODIGO" in m_lbl
        ws_pfa.cell(row=row_a, column=1, value=m_lbl).font = font_total_green if is_highlight else font_data_bold
        ws_pfa.cell(row=row_a, column=1).border = border_total_green if is_highlight else border_cell
        if is_highlight:
            ws_pfa.cell(row=row_a, column=1).fill = fill_total_green

        c_v = ws_pfa.cell(row=row_a, column=2, value=m_val)
        c_v.font = font_total_green if is_highlight else font_data_bold
        c_v.border = border_total_green if is_highlight else border_cell
        c_v.alignment = Alignment(horizontal="center", vertical="center")
        if is_highlight:
            c_v.fill = fill_total_green
        if isinstance(m_val, str) and ("KLOC" in m_lbl or "Meses" in m_lbl):
            c_v.number_format = "#,##0.0"
        elif isinstance(m_val, str) and "67" in m_val:
            c_v.number_format = "#,##0"

        c_u = ws_pfa.cell(row=row_a, column=3, value=m_uni)
        c_u.font = font_total_green if is_highlight else font_data
        c_u.border = border_total_green if is_highlight else border_cell
        c_u.alignment = Alignment(horizontal="center", vertical="center")
        if is_highlight:
            c_u.fill = fill_total_green

        ws_pfa.merge_cells(start_row=row_a, start_column=4, end_row=row_a, end_column=5)
        c_d = ws_pfa.cell(row=row_a, column=4, value=m_desc)
        c_d.font = font_total_green if is_highlight else font_data
        c_d.border = border_total_green if is_highlight else border_cell
        if is_highlight:
            c_d.fill = fill_total_green
        for col in range(4, 6):
            ws_pfa.cell(row=row_a, column=col).border = border_total_green if is_highlight else border_cell
            if is_highlight:
                ws_pfa.cell(row=row_a, column=col).fill = fill_total_green
        ws_pfa.row_dimensions[row_a].height = 24 if is_highlight else 20
        row_a += 1

    col_w_a = {1: 8, 2: 44, 3: 25, 4: 16, 5: 65}
    for c_idx, width in col_w_a.items():
        ws_pfa.column_dimensions[get_column_letter(c_idx)].width = width

    # =========================================================================
    # GUARDAR LIBRO EN DESCARGAS Y EN EL PROYECTO
    # =========================================================================
    nombre_archivo = "Puntos_de_Funcion_y_LDC_Tienda_en_Linea.xlsx"
    ruta_downloads = os.path.join(os.path.expanduser("~"), "Downloads", nombre_archivo)
    ruta_proyecto = os.path.join(os.getcwd(), nombre_archivo)

    wb.save(ruta_downloads)
    wb.save(ruta_proyecto)

    print(f"[OK] Archivo Excel generado exitosamente en:")
    print(f"  1. Descargas: {ruta_downloads}")
    print(f"  2. Proyecto:  {ruta_proyecto}")

if __name__ == "__main__":
    generar_excel_tienda_en_linea()
