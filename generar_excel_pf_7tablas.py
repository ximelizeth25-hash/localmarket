"""
Generador de Hoja de Cálculo: Análisis de Puntos de Función (IFPUG / Albrecht)
Sistema de Gestión Académica (7 Tablas de Base de Datos)
Tablas: Alumno, Estado, Pago, Materia, Cursa, Becado, Discapacitado
"""

import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def crear_archivo_puntos_de_funcion():
    wb = openpyxl.Workbook()
    # Remover hoja por defecto
    default_sheet = wb.active

    # Paleta de Estilos Profesionales
    font_title = Font(name="Calibri", size=15, bold=True, color="FFFFFF")
    font_sec_hdr = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    font_tbl_hdr = Font(name="Calibri", size=10, bold=True, color="FFFFFF")
    font_subtotal = Font(name="Calibri", size=10, bold=True, color="1E3A8A")
    font_total = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    font_data = Font(name="Calibri", size=10, color="000000")
    font_kpi_num = Font(name="Calibri", size=16, bold=True, color="1E3A8A")

    fill_title = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
    fill_sec_hdr = PatternFill(start_color="1D4ED8", end_color="1D4ED8", fill_type="solid")
    fill_tbl_hdr = PatternFill(start_color="3B82F6", end_color="3B82F6", fill_type="solid")
    fill_subtotal = PatternFill(start_color="DBEAFE", end_color="DBEAFE", fill_type="solid")
    fill_total = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
    fill_zebra = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")

    thin_border_side = Side(style="thin", color="CBD5E1")
    border_data = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    border_subtotal = Border(
        top=Side(style="thin", color="94A3B8"),
        bottom=Side(style="double", color="1E3A8A"),
        left=thin_border_side,
        right=thin_border_side
    )
    border_total = Border(
        top=Side(style="medium", color="1E3A8A"),
        bottom=Side(style="double", color="1E3A8A"),
        left=thin_border_side,
        right=thin_border_side
    )

    # =========================================================================
    # HOJA 1: PF No Ajustados (PFNA)
    # =========================================================================
    ws1 = wb.create_sheet(title="PF No Ajustados")
    ws1.views.sheetView[0].showGridLines = True

    # Encabezado Principal
    ws1.merge_cells("A1:G1")
    title_cell = ws1["A1"]
    title_cell.value = "ANÁLISIS DE PUNTOS DE FUNCIÓN NO AJUSTADOS (PFNA) - IFPUG / ALBRECHT"
    title_cell.font = font_title
    title_cell.fill = fill_title
    title_cell.alignment = Alignment(horizontal="center", vertical="center")
    ws1.row_dimensions[1].height = 40

    ws1.merge_cells("A2:G2")
    sub_cell = ws1["A2"]
    sub_cell.value = "Sistema de Gestión Académica (7 Tablas BD) | Métrica Funcional de Software"
    sub_cell.font = Font(name="Calibri", size=11, italic=True, color="475569")
    sub_cell.alignment = Alignment(horizontal="center", vertical="center")
    ws1.row_dimensions[2].height = 22

    current_row = 4
    subtotal_rows_pfna = []

    def agregar_seccion_pfna(titulo, cabeceras, datos, desc_col3, desc_col4):
        nonlocal current_row
        # Header de Sección
        ws1.merge_cells(start_row=current_row, start_column=1, end_row=current_row, end_column=7)
        sec_cell = ws1.cell(row=current_row, column=1, value=titulo)
        sec_cell.font = font_sec_hdr
        sec_cell.fill = fill_sec_hdr
        sec_cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
        ws1.row_dimensions[current_row].height = 25
        current_row += 1

        # Cabeceras de Tabla
        for c_idx, h in enumerate(cabeceras, 1):
            c = ws1.cell(row=current_row, column=c_idx, value=h)
            c.font = font_tbl_hdr
            c.fill = fill_tbl_hdr
            c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
            c.border = border_data
        ws1.row_dimensions[current_row].height = 24
        header_row = current_row
        current_row += 1

        start_data_row = current_row
        for r_idx, row_data in enumerate(datos):
            is_even = (r_idx % 2 == 1)
            for c_idx, val in enumerate(row_data, 1):
                c = ws1.cell(row=current_row, column=c_idx, value=val)
                c.font = font_data
                c.border = border_data
                if is_even:
                    c.fill = fill_zebra
                
                # Alineación
                if c_idx in [1, 2]:
                    c.alignment = Alignment(horizontal="left", vertical="center")
                else:
                    c.alignment = Alignment(horizontal="center", vertical="center")
            ws1.row_dimensions[current_row].height = 20
            current_row += 1
        end_data_row = current_row - 1

        # Fila de Subtotal con fórmula Excel
        ws1.merge_cells(start_row=current_row, start_column=1, end_row=current_row, end_column=6)
        sub_lbl = ws1.cell(row=current_row, column=1, value=f"SUBTOTAL {titulo.split(' - ')[0]}:")
        sub_lbl.font = font_subtotal
        sub_lbl.fill = fill_subtotal
        sub_lbl.alignment = Alignment(horizontal="right", vertical="center")
        sub_lbl.border = border_subtotal

        # Aplicar borde a celdas mergeadas
        for col in range(2, 7):
            ws1.cell(row=current_row, column=col).border = border_subtotal
            ws1.cell(row=current_row, column=col).fill = fill_subtotal

        sub_val = ws1.cell(row=current_row, column=7)
        sub_val.value = f"=SUM(G{start_data_row}:G{end_data_row})"
        sub_val.font = font_subtotal
        sub_val.fill = fill_subtotal
        sub_val.alignment = Alignment(horizontal="center", vertical="center")
        sub_val.border = border_subtotal
        ws1.row_dimensions[current_row].height = 22

        subtotal_rows_pfna.append(current_row)
        current_row += 2

    # 1. ENTRADAS EXTERNAS (EI)
    datos_ei = [
        ["Registrar Alumno", "Alta de nuevo estudiante en Alumno con validación de Estado", "2 (Alumno, Estado)", "7 (Matrícula...Fecha_Nac)", "Medio", 1, 4],
        ["Modificar Alumno", "Actualización de datos generales del estudiante", "1 (Alumno)", "6 (Nombre, Apellidos, Sexo...)", "Medio", 1, 4],
        ["Eliminar Alumno", "Baja o desactivación lógica de estudiante", "1 (Alumno)", "1 (Matrícula)", "Bajo", 1, 3],
        ["Registrar Pago", "Captura de pago de colegiatura/materia en tabla Pago", "2 (Pago, Alumno)", "4 (Número_Pago, Fecha, Concepto, Monto)", "Medio", 1, 4],
        ["Registrar Materia", "Alta de nueva asignatura en catálogo Materia", "1 (Materia)", "3 (Clave_Materia, Nombre, Costo)", "Bajo", 1, 3],
        ["Asignar Cursa", "Inscripción académica de estudiante a materia (Cursa)", "2 (Cursa, Materia)", "3 (Matrícula, Clave_Materia, Fecha)", "Medio", 1, 4],
        ["Registrar Becado", "Asignación de beneficio económico y porcentaje en Becado", "2 (Becado, Alumno)", "3 (Matrícula, %_Descuento, Motivo)", "Bajo", 1, 3],
        ["Registrar Discapacitado", "Registro de condición especial y aparato ortopédico", "2 (Discapacitado, Alumno)", "3 (Matrícula, Descripción, Aparato)", "Bajo", 1, 3],
        ["Registrar Estado", "Alta de entidad federativa en catálogo Estado", "1 (Estado)", "2 (Clave_Estado, Nombre_Estado)", "Bajo", 1, 3],
    ]
    agregar_seccion_pfna("1. ENTRADAS EXTERNAS (EI / External Inputs)", 
                         ["Componente Funcional", "Descripción del Proceso Elemental", "Archivos Ref. (FTR)", "Campos (DET)", "Complejidad", "Total Ops", "Puntos de Función"],
                         datos_ei, "FTR", "DET")

    # 2. SALIDAS EXTERNAS (EO)
    datos_eo = [
        ["Estado de Cuenta y Saldos", "Cálculo de montos de materias inscritas vs pagos y descuentos de beca", "4 (Alumno, Pago, Cursa, Becado)", "8 (Matrícula, Nombre, Total, Saldo...)", "Alto", 1, 7],
        ["Carga Académica con Costos", "Reporte de materias cursadas con costos calculados y descuentos", "3 (Cursa, Materia, Becado)", "7 (Matrícula, Materias, Costo_Total...)", "Alto", 1, 7],
        ["Informe Estadístico de Becas", "Resumen de montos subsidiados e impacto porcentual por motivo", "2 (Becado, Pago)", "5 (Motivo, Alumnos, Descuento_Prom...)", "Medio", 1, 5],
    ]
    agregar_seccion_pfna("2. SALIDAS EXTERNAS (EO / External Outputs - Con Cálculos Matemáticos)", 
                         ["Componente Funcional", "Descripción del Proceso / Cálculo Derivado", "Archivos Ref. (FTR)", "Campos (DET)", "Complejidad", "Total Ops", "Puntos de Función"],
                         datos_eo, "FTR", "DET")

    # 3. CONSULTAS EXTERNAS (EQ)
    datos_eq = [
        ["Consulta de Alumno por Matrícula", "Búsqueda directa del perfil de estudiante y estado de procedencia", "2 (Alumno, Estado)", "7 (Matrícula, Nombre, Estado...)", "Medio", 1, 4],
        ["Catálogo de Materias", "Listado directo de materias y costos sin cálculos matemáticos", "1 (Materia)", "3 (Clave_Materia, Nombre, Costo)", "Bajo", 1, 3],
        ["Historial de Pagos de Alumno", "Listado cronológico de recibos emitidos por estudiante", "2 (Pago, Alumno)", "4 (Número_Pago, Fecha, Concepto, Monto)", "Bajo", 1, 3],
        ["Padrón de Alumnos Becados", "Consulta directa de alumnos con beca asignada y motivo", "2 (Becado, Alumno)", "4 (Matrícula, Nombre, %_Beca, Motivo)", "Bajo", 1, 3],
        ["Padrón de Alumnos Discapacitados", "Consulta directa de requerimientos y aparatos ortopédicos", "2 (Discapacitado, Alumno)", "4 (Matrícula, Nombre, Discapacidad, Aparato)", "Bajo", 1, 3],
    ]
    agregar_seccion_pfna("3. CONSULTAS EXTERNAS (EQ / External Queries - Sin Cálculos Derivados)", 
                         ["Componente Funcional", "Descripción de la Consulta Directa", "Archivos Ref. (FTR)", "Campos (DET)", "Complejidad", "Total Ops", "Puntos de Función"],
                         datos_eq, "FTR", "DET")

    # 4. ARCHIVOS LÓGICOS INTERNOS (ILF)
    datos_ilf = [
        ["Tabla: Alumno", "Almacena los datos maestros y de identidad del estudiante", "1 (Registro Alumno)", "7 (Matrícula, Clave_Estado, Nombre, Ap_Pat, Ap_Mat, Sexo, Fecha_Nac)", "Bajo", 1, 7],
        ["Tabla: Estado", "Catálogo maestro de estados de la república mexicana", "1 (Registro Estado)", "2 (Clave_Estado, Nombre_Estado)", "Bajo", 1, 7],
        ["Tabla: Pago", "Registro transaccional de pagos de cuotas y conceptos escolares", "1 (Registro Pago)", "4 (Número_Pago, Fecha, Concepto, Monto)", "Bajo", 1, 7],
        ["Tabla: Materia", "Catálogo de asignaturas impartidas y costos por crédito/materia", "1 (Registro Materia)", "3 (Clave_Materia, Nombre_Materia, Costo)", "Bajo", 1, 7],
        ["Tabla: Cursa", "Entidad de relación muchos a muchos de inscripciones académicas", "1 (Registro Cursa)", "3 (Matrícula, Clave_Materia, Fecha)", "Bajo", 1, 7],
        ["Tabla: Becado", "Entidad de soporte que almacena asignación de becas y porcentajes", "1 (Registro Becado)", "3 (Matrícula, Porcentaje_descuento, Motivo_beca)", "Bajo", 1, 7],
        ["Tabla: Discapacitado", "Entidad de soporte para registro de necesidades especiales de apoyo", "1 (Registro Discapacitado)", "3 (Matrícula, Descripción_discapacidad, Aparato_ortopédico)", "Bajo", 1, 7],
    ]
    agregar_seccion_pfna("4. ARCHIVOS LÓGICOS INTERNOS (ILF / Internal Logical Files - 7 Tablas BD)", 
                         ["Tabla de Base de Datos", "Propósito Funcional en el Sistema", "Registros (RET)", "Campos de la Tabla (DET)", "Complejidad", "Total Ops", "Puntos de Función"],
                         datos_ilf, "RET", "DET")

    # 5. ARCHIVOS DE INTERFAZ EXTERNA (EIF)
    datos_eif = [
        ["Validación Ciudadana / CURP (RENAPO)", "Servicio externo de validación de identidad ciudadana y estado", "1 (Ciudadano)", "4 (CURP, Nombre, Estado, Estatus)", "Bajo", 1, 5],
        ["Catálogo Escolar Oficial (SEJ / DGB)", "Servicio externo para homologación de claves y programas académicos", "1 (Plan Oficial)", "3 (Clave_Oficial, Nombre, Validez)", "Bajo", 1, 5],
    ]
    agregar_seccion_pfna("5. ARCHIVOS DE INTERFAZ EXTERNA (EIF / External Interface Files)", 
                         ["Servicio / Interfaz Externa", "Propósito de Homologación e Integración", "Registros (RET)", "Campos Validados (DET)", "Complejidad", "Total Ops", "Puntos de Función"],
                         datos_eif, "RET", "DET")

    # TOTAL GENERAL PFNA
    ws1.merge_cells(start_row=current_row, start_column=1, end_row=current_row, end_column=6)
    tot_lbl = ws1.cell(row=current_row, column=1, value="TOTAL GENERAL DE PUNTOS DE FUNCIÓN NO AJUSTADOS (PFNA):")
    tot_lbl.font = font_total
    tot_lbl.fill = fill_total
    tot_lbl.alignment = Alignment(horizontal="right", vertical="center")
    tot_lbl.border = border_total

    for col in range(2, 7):
        ws1.cell(row=current_row, column=col).border = border_total
        ws1.cell(row=current_row, column=col).fill = fill_total

    sub_formula = "+".join([f"G{r}" for r in subtotal_rows_pfna])
    tot_val = ws1.cell(row=current_row, column=7)
    tot_val.value = f"={sub_formula}"
    tot_val.font = font_total
    tot_val.fill = fill_total
    tot_val.alignment = Alignment(horizontal="center", vertical="center")
    tot_val.border = border_total
    ws1.row_dimensions[current_row].height = 28

    # Autoajuste de anchos en hoja 1
    col_widths_ws1 = {1: 34, 2: 44, 3: 20, 4: 28, 5: 16, 6: 12, 7: 18}
    for col_idx, width in col_widths_ws1.items():
        ws1.column_dimensions[get_column_letter(col_idx)].width = width

    # =========================================================================
    # HOJA 2: PF Ajustados (14 Factores de Albrecht GSC)
    # =========================================================================
    ws2 = wb.create_sheet(title="PF Ajustados")
    ws2.views.sheetView[0].showGridLines = True

    # Encabezado Principal
    ws2.merge_cells("A1:E1")
    t2 = ws2["A1"]
    t2.value = "EVALUACIÓN DE FACTORES GENERALES DEL SISTEMA (GSC) Y PUNTOS DE FUNCIÓN AJUSTADOS (PFA)"
    t2.font = font_title
    t2.fill = fill_title
    t2.alignment = Alignment(horizontal="center", vertical="center")
    ws2.row_dimensions[1].height = 40

    ws2.merge_cells("A2:E2")
    s2 = ws2["A2"]
    s2.value = "Modelo de Ajuste de Albrecht: PFA = PFNA * [0.65 + 0.01 * SUM(Fi)]"
    s2.font = Font(name="Calibri", size=11, italic=True, color="475569")
    s2.alignment = Alignment(horizontal="center", vertical="center")
    ws2.row_dimensions[2].height = 22

    # Tabla de 14 Factores
    headers_gsc = ["N° Factor", "Factor General del Sistema (GSC)", "Nivel de Influencia (0 - 5)", "Puntaje Asignado (Fi)", "Justificación Técnica en el Sistema"]
    r2 = 4
    for c_idx, h in enumerate(headers_gsc, 1):
        c = ws2.cell(row=r2, column=c_idx, value=h)
        c.font = font_tbl_hdr
        c.fill = fill_tbl_hdr
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = border_data
    ws2.row_dimensions[r2].height = 25
    r2 += 1

    factores_gsc = [
        ["F1", "Comunicación de datos", "4 - Influencia Significativa", 4, "Arquitectura cliente-servidor REST con comunicación cifrada HTTPS hacia la base de datos PostgreSQL."],
        ["F2", "Funciones distribuidas", "3 - Influencia Moderada", 3, "Procesamiento y validación distribuida de catálogos y persistencia centralizada de datos."],
        ["F3", "Rendimiento y performance", "4 - Influencia Significativa", 4, "Tiempos de respuesta estrictos en cobros de caja, inscripciones concurrentes y consultas de kardex."],
        ["F4", "Configuración del equipamiento", "3 - Influencia Moderada", 3, "Entorno de ejecución optimizado en infraestructura local y cloud escalable."],
        ["F5", "Volumen de transacciones", "4 - Influencia Significativa", 4, "Picos de alta concurrencia durante periodos de inscripción semestral y pago de colegiaturas."],
        ["F6", "Entrada de datos en línea", "5 - Fuerte Influencia", 5, "El 100% de las capturas de alumnos, becas, discapacidades y pagos se realiza vía interfaz web interactiva."],
        ["F7", "Eficiencia del usuario final", "4 - Influencia Significativa", 4, "Formularios diseñados con atajos, validaciones reactivas y diseño ergonómico de navegación."],
        ["F8", "Actualización en línea", "4 - Influencia Significativa", 4, "Las tablas críticas (Alumno, Pago, Cursa) se actualizan en tiempo real mediante transacciones ACID."],
        ["F9", "Complejidad del procesamiento", "3 - Influencia Moderada", 3, "Cálculo de deducciones, asignación condicional de becas y validaciones de integridad referencial."],
        ["F10", "Reusabilidad del código", "3 - Influencia Moderada", 3, "Componentes modulares de backend (ORM/Queries) y librerías reutilizables en frontend."],
        ["F11", "Facilidad de instalación", "3 - Influencia Moderada", 3, "Despliegue automatizado con migraciones de base de datos y scripts de inicialización."],
        ["F12", "Facilidad de operación", "4 - Influencia Significativa", 4, "Procedimientos integrados de respaldos automáticos, auditoría y recuperación ante caídas."],
        ["F13", "Localizaciones múltiples", "4 - Influencia Significativa", 4, "Acceso multi-campus e interoperabilidad entre sedes educativas y áreas de control escolar."],
        ["F14", "Facilidad de cambio / Mantenimiento", "4 - Influencia Significativa", 4, "Estructura modular de base de datos que permite añadir tablas de grupos, horarios y kardex fácilmente."],
    ]

    start_gsc_row = r2
    for r_idx, row_data in enumerate(factores_gsc):
        is_even = (r_idx % 2 == 1)
        for c_idx, val in enumerate(row_data, 1):
            c = ws2.cell(row=r2, column=c_idx, value=val)
            c.font = font_data
            c.border = border_data
            if is_even:
                c.fill = fill_zebra
            
            if c_idx == 1:
                c.alignment = Alignment(horizontal="center", vertical="center")
            elif c_idx in [2, 5]:
                c.alignment = Alignment(horizontal="left", vertical="center")
            else:
                c.alignment = Alignment(horizontal="center", vertical="center")
        ws2.row_dimensions[r2].height = 22
        r2 += 1
    end_gsc_row = r2 - 1

    # Subtotal GSC
    ws2.merge_cells(start_row=r2, start_column=1, end_row=r2, end_column=3)
    lbl_sum_gsc = ws2.cell(row=r2, column=1, value="SUMATORIA DE LOS 14 FACTORES (SUM(Fi)):")
    lbl_sum_gsc.font = font_subtotal
    lbl_sum_gsc.fill = fill_subtotal
    lbl_sum_gsc.alignment = Alignment(horizontal="right", vertical="center")
    lbl_sum_gsc.border = border_subtotal

    for col in range(2, 4):
        ws2.cell(row=r2, column=col).border = border_subtotal
        ws2.cell(row=r2, column=col).fill = fill_subtotal

    val_sum_gsc = ws2.cell(row=r2, column=4)
    val_sum_gsc.value = f"=SUM(D{start_gsc_row}:D{end_gsc_row})"
    val_sum_gsc.font = font_subtotal
    val_sum_gsc.fill = fill_subtotal
    val_sum_gsc.alignment = Alignment(horizontal="center", vertical="center")
    val_sum_gsc.border = border_subtotal

    c5_empty = ws2.cell(row=r2, column=5, value="Rango posible: 0 a 70 puntos")
    c5_empty.font = Font(name="Calibri", size=9, italic=True, color="64748B")
    c5_empty.fill = fill_subtotal
    c5_empty.alignment = Alignment(horizontal="center", vertical="center")
    c5_empty.border = border_subtotal
    ws2.row_dimensions[r2].height = 24
    row_sum_gsc = r2
    r2 += 3

    # =========================================================================
    # TABLA RESUMEN DE PUNTOS DE FUNCIÓN AJUSTADOS
    # =========================================================================
    ws2.merge_cells(start_row=r2, start_column=1, end_row=r2, end_column=5)
    t_res = ws2.cell(row=r2, column=1, value="CUADRO RESUMEN DE CÁLCULO DE PUNTOS DE FUNCIÓN AJUSTADOS (PFA)")
    t_res.font = font_sec_hdr
    t_res.fill = fill_sec_hdr
    t_res.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws2.row_dimensions[r2].height = 25
    r2 += 1

    headers_res = ["Métrica / Parámetro", "Valor Obtenido", "Fórmula Aplicada", "Descripción Técnica"]
    ws2.cell(row=r2, column=1, value="Métrica / Parámetro").font = font_tbl_hdr
    ws2.cell(row=r2, column=1).fill = fill_tbl_hdr
    ws2.cell(row=r2, column=1).alignment = Alignment(horizontal="center", vertical="center")
    ws2.cell(row=r2, column=1).border = border_data

    ws2.cell(row=r2, column=2, value="Valor").font = font_tbl_hdr
    ws2.cell(row=r2, column=2).fill = fill_tbl_hdr
    ws2.cell(row=r2, column=2).alignment = Alignment(horizontal="center", vertical="center")
    ws2.cell(row=r2, column=2).border = border_data

    ws2.cell(row=r2, column=3, value="Fórmula de Cálculo").font = font_tbl_hdr
    ws2.cell(row=r2, column=3).fill = fill_tbl_hdr
    ws2.cell(row=r2, column=3).alignment = Alignment(horizontal="center", vertical="center")
    ws2.cell(row=r2, column=3).border = border_data

    ws2.merge_cells(start_row=r2, start_column=4, end_row=r2, end_column=5)
    c_desc = ws2.cell(row=r2, column=4, value="Descripción e Interpretación")
    c_desc.font = font_tbl_hdr
    c_desc.fill = fill_tbl_hdr
    c_desc.alignment = Alignment(horizontal="center", vertical="center")
    c_desc.border = border_data
    ws2.cell(row=r2, column=5).border = border_data
    ws2.row_dimensions[r2].height = 24
    r2 += 1

    # Fila 1: PFNA
    ws2.cell(row=r2, column=1, value="Puntos de Función No Ajustados (PFNA)").border = border_data
    ws2.cell(row=r2, column=1).font = font_data
    c_pfna_val = ws2.cell(row=r2, column=2, value="='PF No Ajustados'!G51")
    c_pfna_val.border = border_data
    c_pfna_val.font = font_subtotal
    c_pfna_val.alignment = Alignment(horizontal="center", vertical="center")
    ws2.cell(row=r2, column=3, value="SUM(EI) + SUM(EO) + SUM(EQ) + SUM(ILF) + SUM(EIF)").border = border_data
    ws2.cell(row=r2, column=3).font = font_data
    ws2.cell(row=r2, column=3).alignment = Alignment(horizontal="center", vertical="center")
    ws2.merge_cells(start_row=r2, start_column=4, end_row=r2, end_column=5)
    ws2.cell(row=r2, column=4, value="Funcionalidad pura del software derivada del modelo de 7 tablas de la BD.").border = border_data
    ws2.cell(row=r2, column=5).border = border_data
    ws2.cell(row=r2, column=4).font = font_data
    ws2.row_dimensions[r2].height = 22
    row_pfna = r2
    r2 += 1

    # Fila 2: Factor de Ajuste (VAF / CAF)
    ws2.cell(row=r2, column=1, value="Factor de Ajuste de Complejidad (CAF)").border = border_data
    ws2.cell(row=r2, column=1).font = font_data
    c_caf_val = ws2.cell(row=r2, column=2, value=f"=0.65 + 0.01 * D{row_sum_gsc}")
    c_caf_val.border = border_data
    c_caf_val.font = font_subtotal
    c_caf_val.alignment = Alignment(horizontal="center", vertical="center")
    c_caf_val.number_format = "0.00"
    ws2.cell(row=r2, column=3, value=f"=0.65 + 0.01 * SUM(Fi)").border = border_data
    ws2.cell(row=r2, column=3).font = font_data
    ws2.cell(row=r2, column=3).alignment = Alignment(horizontal="center", vertical="center")
    ws2.merge_cells(start_row=r2, start_column=4, end_row=r2, end_column=5)
    ws2.cell(row=r2, column=4, value="Factor que pondera el entorno técnico y operativo del sistema (±35%).").border = border_data
    ws2.cell(row=r2, column=5).border = border_data
    ws2.cell(row=r2, column=4).font = font_data
    ws2.row_dimensions[r2].height = 22
    row_caf = r2
    r2 += 1

    # Fila 3: TOTAL PFA
    c_pfa_lbl = ws2.cell(row=r2, column=1, value="TOTAL PUNTOS DE FUNCIÓN AJUSTADOS (PFA)")
    c_pfa_lbl.border = border_total
    c_pfa_lbl.font = font_total
    c_pfa_lbl.fill = fill_total
    
    c_pfa_val = ws2.cell(row=r2, column=2, value=f"=B{row_pfna} * B{row_caf}")
    c_pfa_val.border = border_total
    c_pfa_val.font = font_total
    c_pfa_val.fill = fill_total
    c_pfa_val.alignment = Alignment(horizontal="center", vertical="center")
    c_pfa_val.number_format = "#,##0.00"

    c_pfa_fml = ws2.cell(row=r2, column=3, value=f"=PFNA * CAF")
    c_pfa_fml.border = border_total
    c_pfa_fml.font = font_total
    c_pfa_fml.fill = fill_total
    c_pfa_fml.alignment = Alignment(horizontal="center", vertical="center")

    ws2.merge_cells(start_row=r2, start_column=4, end_row=r2, end_column=5)
    c_pfa_desc = ws2.cell(row=r2, column=4, value="Tamaño final ajustado del producto de software para estimación de esfuerzo.")
    c_pfa_desc.border = border_total
    c_pfa_desc.font = font_total
    c_pfa_desc.fill = fill_total
    ws2.cell(row=r2, column=5).border = border_total
    ws2.cell(row=r2, column=5).fill = fill_total
    ws2.row_dimensions[r2].height = 28

    # Autoajuste de anchos en hoja 2
    col_widths_ws2 = {1: 14, 2: 36, 3: 26, 4: 22, 5: 65}
    for col_idx, width in col_widths_ws2.items():
        ws2.column_dimensions[get_column_letter(col_idx)].width = width

    # Eliminar hoja default
    if "Sheet" in wb.sheetnames:
        wb.remove(wb["Sheet"])

    # Guardar archivo en Downloads y en el proyecto
    downloads_dir = os.path.join(os.path.expanduser("~"), "Downloads")
    filepath_downloads = os.path.join(downloads_dir, "Puntos_de_Funcion_LocalMarket.xlsx")
    filepath_local = os.path.join(os.getcwd(), "Puntos_de_Funcion_LocalMarket.xlsx")

    wb.save(filepath_downloads)
    wb.save(filepath_local)
    print(f"Archivo guardado exitosamente en: {filepath_downloads}")
    print(f"Copia de respaldo en: {filepath_local}")

if __name__ == "__main__":
    crear_archivo_puntos_de_funcion()
