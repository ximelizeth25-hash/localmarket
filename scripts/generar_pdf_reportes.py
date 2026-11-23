#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador de Documentación Oficial en PDF: Módulo de Reportes de LocalMarket
Alineado con el estándar de entrega ejecutiva xlsx-pdf-pro e incorporando
evidencias visuales de implementación en Frontend, Backend y Base de Datos.
"""

import os
import sys
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    KeepTogether, HRFlowable, Image, PageBreak
)
from reportlab.pdfgen import canvas

WORKSPACE_DIR = Path(__file__).resolve().parent.parent
ASSETS_DIR = WORKSPACE_DIR / "scripts" / "assets_reportes"

class NumberedCanvas(canvas.Canvas):
    """
    Canvas de doble pasada para calcular y mostrar el número total de páginas (Página X de Y),
    encabezados corporativos y líneas de separación ejecutivas.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Encabezado corporativo (a partir de la página 2)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#1B4332"))
            self.drawString(54, 752, "LOCALMARKET PWA — DOCUMENTACIÓN TÉCNICA Y DE ARQUITECTURA")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawRightString(558, 752, "Módulo 9: Creación de Reportes | Evidencias Visuales")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.6)
            self.line(54, 746, 558, 746)

        # Pie de página corporativo (en todas las páginas)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.6)
        self.line(54, 46, 558, 46)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(54, 33, "LocalMarket PWA — Sistema Integral de Comercio Local y Cadena de Suministro")
        page_str = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(558, 33, page_str)
        
        self.restoreState()


def create_image_figure_card(image_path, width, height, fig_num, title, source_desc, caption_style, c_border, c_bg):
    """Crea una tarjeta ejecutiva que encuadra la imagen con borde y pie de figura formal."""
    if not Path(image_path).exists():
        return Paragraph(f"[Imagen no encontrada: {image_path}]", caption_style)
    
    img = Image(str(image_path), width=width, height=height)
    caption_text = f"<b>Figura {fig_num}:</b> {title} — <font color='#64748B'><i>{source_desc}</i></font>"
    p_caption = Paragraph(caption_text, caption_style)
    
    t = Table([[img], [p_caption]], colWidths=[width + 8])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_bg),
        ('BOX', (0,0), (-1,-1), 0.8, c_border),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,0), 3),
        ('BOTTOMPADDING', (0,0), (-1,0), 2),
        ('TOPPADDING', (0,1), (-1,1), 3),
        ('BOTTOMPADDING', (0,1), (-1,1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    return t


def create_reports_documentation_pdf(output_paths):
    # Paleta de colores corporativa LocalMarket
    C_PRIMARY = colors.HexColor("#1B4332")     # Verde bosque oscuro
    C_SECONDARY = colors.HexColor("#2D6A4F")   # Verde esmeralda profundo
    C_ACCENT = colors.HexColor("#52B788")      # Verde menta acento
    C_LIGHT_BG = colors.HexColor("#F8FAFC")    # Fondo suave alternado
    C_CALLOUT_BG = colors.HexColor("#EBF5EE")  # Fondo verde menta claro para cajas
    C_TEXT = colors.HexColor("#1E293B")        # Gris pizarra oscuro
    C_MUTED = colors.HexColor("#64748B")       # Gris secundario
    C_BORDER = colors.HexColor("#CBD5E1")      # Borde tenue
    C_CODE_BG = colors.HexColor("#0F172A")     # Fondo oscuro código
    C_CODE_TXT = colors.HexColor("#E2E8F0")    # Texto claro código

    styles = getSampleStyleSheet()

    # Modificar estilos estándar
    styles['Normal'].textColor = C_TEXT
    styles['Normal'].fontSize = 8.5
    styles['Normal'].leading = 11.5

    # Estilos personalizados
    doc_title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=19,
        textColor=C_PRIMARY,
        spaceAfter=3
    )

    doc_subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=C_MUTED,
        spaceAfter=6
    )

    h1_style = ParagraphStyle(
        'CustomH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=14.5,
        textColor=C_PRIMARY,
        spaceBefore=6,
        spaceAfter=3,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'CustomH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12.5,
        textColor=C_SECONDARY,
        spaceBefore=5,
        spaceAfter=2,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=11.2,
        textColor=C_TEXT,
        spaceAfter=3.5
    )

    bullet_style = ParagraphStyle(
        'CustomBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.0,
        leading=11.0,
        textColor=C_TEXT,
        leftIndent=10,
        spaceAfter=2
    )

    code_style = ParagraphStyle(
        'CustomCode',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.2,
        leading=9.2,
        textColor=C_CODE_TXT,
        spaceBefore=1,
        spaceAfter=2
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.0,
        leading=10.8,
        textColor=C_PRIMARY
    )

    th_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10,
        textColor=colors.white,
        alignment=0
    )

    td_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.6,
        leading=9.8,
        textColor=C_TEXT,
        alignment=0
    )

    caption_style = ParagraphStyle(
        'FigureCaption',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.2,
        leading=9.2,
        textColor=C_PRIMARY,
        alignment=1
    )

    story = []

    # =========================================================================
    # PÁGINA 1: PORTADA EJECUTIVA, METADATOS Y RESUMEN DE NEGOCIO
    # =========================================================================
    story.append(Paragraph("DOCUMENTACIÓN TÉCNICA Y DE ARQUITECTURA", doc_subtitle_style))
    story.append(Paragraph("MÓDULO DE REPORTES Y ANALÍTICA EJECUTIVA", doc_title_style))
    story.append(Paragraph("LocalMarket PWA — Sistema de Comercio Local y Cadena de Suministro (Admin &rarr; Socios &rarr; Clientes)", doc_subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.8, color=C_PRIMARY, spaceBefore=2, spaceAfter=8))

    # Ficha de Metadatos
    meta_data = [
        [
            Paragraph("<b>Proyecto:</b> LocalMarket (PWA / Node.js)", td_style),
            Paragraph("<b>Módulo:</b> Módulo 9 (Reportes Ejecutivos)", td_style),
            Paragraph("<b>Fecha:</b> 22 de Noviembre de 2026", td_style)
        ],
        [
            Paragraph("<b>Base de Datos:</b> PostgreSQL 15+", td_style),
            Paragraph("<b>Motor Visual:</b> Chart.js v4 + Tailwind CSS", td_style),
            Paragraph("<b>Service Worker:</b> localmarket-v30 (PWA)", td_style)
        ],
        [
            Paragraph("<b>Arquitectura:</b> RESTful API + RBAC Aislado", td_style),
            Paragraph("<b>Cadena:</b> Admin &rarr; Socios &rarr; Clientes", td_style),
            Paragraph("<b>Estado:</b> Producción / Verificado", td_style)
        ]
    ]
    t_meta = Table(meta_data, colWidths=[170, 170, 164])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 0.7, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 8))

    story.append(Paragraph("1. Resumen Ejecutivo y Propósito del Módulo", h1_style))
    story.append(Paragraph(
        "El <b>Módulo de Métricas y Reportes Ejecutivos</b> centraliza la inteligencia de negocios y proporciona analítica gerencial "
        "en tiempo real en <b>LocalMarket</b>. El sistema opera respaldado en cómputo relacional dentro de la base de datos "
        "<b>PostgreSQL</b> mediante agregaciones SQL optimizadas, erradicando fallbacks estáticos y discrepancias de cálculo.",
        body_style
    ))
    story.append(Paragraph(
        "Resuelve cuatro pilares operativos: <b>(1) Aislamiento estricto de información por rol</b> bajo la cadena de suministro, "
        "<b>(2) Visualización reactiva</b> de 4 reportes interactivos mediante Chart.js, <b>(3) Monitoreo de inventario crítico</b> (&le; 5 piezas) "
        "para reposición temprana, y <b>(4) Exportación ejecutiva</b> a formato tabular CSV (con UTF-8 BOM) y diálogo directo de impresión en PDF.",
        body_style
    ))
    story.append(Spacer(1, 5))

    # Caja de Principio Clave
    box_data = [[
        Paragraph(
            "<b>Principio de Integridad y Aislamiento de Datos:</b> Cada rol visualiza exclusivamente los pedidos y cifras financieras "
            "que le corresponden según su jerarquía en la cadena de distribución. El Administrador supervisa el surtido mayorista hacia los "
            "Socios; cada Socio analiza sus ventas minoristas a sus Clientes asignados y sus órdenes de compra central; y los Clientes "
            "mantienen privadas sus compras sin acceso a paneles administrativos.",
            callout_style
        )
    ]]
    t_box = Table(box_data, colWidths=[504])
    t_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_CALLOUT_BG),
        ('BOX', (0,0), (-1,-1), 0.9, C_SECONDARY),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_box)
    story.append(Spacer(1, 8))

    # EVIDENCIA VISUAL FIGURA 1: Encabezado + Tarjetas KPI en Producción
    card_fig1 = create_image_figure_card(
        ASSETS_DIR / "fig1_ui_dashboard_header_kpis.png",
        width=496,
        height=138,
        fig_num="1",
        title="Panel Superior de Reportes Ejecutivos y Tarjetas KPI en Producción",
        source_desc="public/dashboard.html & public/js/dashboard.js (Vista Administrador)",
        caption_style=caption_style,
        c_border=C_BORDER,
        c_bg=colors.white
    )
    story.append(card_fig1)

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 2: MODELO DE CADENA DE SUMINISTRO Y ARQUITECTURA DE AISLAMIENTO
    # =========================================================================
    story.append(Paragraph("2. Modelo de Cadena de Suministro y Reglas por Rol", h1_style))
    story.append(Paragraph(
        "El sistema organiza los flujos comerciales en un modelo jerárquico de tres niveles: "
        "<b>Administrador (Central Mayorista) &rarr; Socios (Distribuidores / Retailers) &rarr; Clientes (Consumidores Finales)</b>.",
        body_style
    ))

    t_roles_data = [
        [Paragraph("Rol / Nivel", th_style), Paragraph("Posición en Cadena", th_style), Paragraph("Cálculo en Reportes", th_style), Paragraph("Visibilidad en Pedidos", th_style)],
        [
            Paragraph("<b>Administrador</b><br/>(id_rol = 1)", td_style),
            Paragraph("Mayorista / Central de Abasto", td_style),
            Paragraph("Ventas de surtido a Socios (<code>u.id_rol = 2</code>). Suma ingresos mayoristas sin cancelaciones.", td_style),
            Paragraph("Órdenes de surtido de Socios. Acciones: <i>En camino</i>, <i>Entregado</i>, <i>Anular</i>.", td_style)
        ],
        [
            Paragraph("<b>Socio</b><br/>(id_rol = 2)", td_style),
            Paragraph("Distribuidor / Retailer Local", td_style),
            Paragraph("Ventas minoristas a sus Clientes (<code>numero_socio_atencion = numSocio AND u.id_rol = 3</code>).", td_style),
            Paragraph("1) Pedidos hechos por sus Clientes asignados.<br/>2) Sus compras de surtido al Admin. Bloquea otros socios.", td_style)
        ],
        [
            Paragraph("<b>Cliente</b><br/>(id_rol = 3)", td_style),
            Paragraph("Consumidor Final", td_style),
            Paragraph("Sin acceso a Reportes ni analítica gerencial (Bloqueo HTTP 403).", td_style),
            Paragraph("Únicamente ve sus propios pedidos de compra (<code>comprador_id = usuario_id</code>).", td_style)
        ]
    ]
    t_roles = Table(t_roles_data, colWidths=[84, 105, 160, 155])
    t_roles.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('ALIGN', (0,0), (-1,0), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT_BG]),
        ('BOX', (0,0), (-1,-1), 0.7, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_roles)
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>Ajuste de Navegación del Administrador:</b>", h2_style))
    story.append(Paragraph(
        "Debido a que el Administrador únicamente suministra a los Socios y no actúa como comprador final, "
        "el botón de menú <b>Compra</b> (<code>data-target='mod_detalle'</code>) se oculta automáticamente en la barra lateral "
        "mediante <code>applyRoleRestrictions()</code> (<code>style.display = 'none'</code>). Si por cualquier flujo se intenta "
        "acceder a la pestaña de Compra, el enrutador frontend redirige automáticamente al <b>Catálogo</b>.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # EVIDENCIA VISUAL FIGURA 2: Diagrama de Arquitectura de la Cadena de Suministro
    card_fig2 = create_image_figure_card(
        ASSETS_DIR / "fig5_arquitectura_cadena_sql.png",
        width=496,
        height=248,
        fig_num="2",
        title="Arquitectura de Cadena de Suministro y Aislamiento en PostgreSQL",
        source_desc="Modelado Relacional RBAC: Central de Abasto &rarr; Red de Socios &rarr; Consumidor",
        caption_style=caption_style,
        c_border=C_BORDER,
        c_bg=colors.white
    )
    story.append(card_fig2)

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 3: COMPONENTES DEL DASHBOARD (PARTE 1: KPIS Y REPORTES 1 Y 2)
    # =========================================================================
    story.append(Paragraph("3. Componentes del Dashboard de Reportes (Chart.js)", h1_style))
    story.append(Paragraph(
        "La interfaz del módulo (ubicada en <code>public/dashboard.html</code> y gestionada reactivamente en <code>public/js/dashboard.js</code>) "
        "despliega las 4 Tarjetas KPI superiores y un panel con 4 gráficos analíticos avanzados con renderizado canvas:",
        body_style
    ))

    t_kpis_data = [
        [Paragraph("Tarjeta KPI", th_style), Paragraph("Identificador DOM", th_style), Paragraph("Rol Administrador", th_style), Paragraph("Rol Socio", th_style)],
        [
            Paragraph("<b>KPI 1: Base Usuarios</b>", td_style),
            Paragraph("<code>#kpiUsuarios</code>", td_style),
            Paragraph("Etiqueta: <b>Usuarios</b> (Total general cuentas).", td_style),
            Paragraph("Etiqueta: <b>Clientes</b> (Clientes asignados a este socio).", td_style)
        ],
        [
            Paragraph("<b>KPI 2: Catálogo Activo</b>", td_style),
            Paragraph("<code>#kpiProductos</code>", td_style),
            Paragraph("Etiqueta: <b>Productos</b> (Catálogo general tienda).", td_style),
            Paragraph("Etiqueta: <b>Productos</b> (Artículos con <code>id_vendedor = userId</code>).", td_style)
        ],
        [
            Paragraph("<b>KPI 3: Pedidos Cerrados</b>", td_style),
            Paragraph("<code>#kpiPedidos</code>", td_style),
            Paragraph("Órdenes surtido Socios libres de cancelación.", td_style),
            Paragraph("Ventas minoristas a Clientes libres de cancelación.", td_style)
        ],
        [
            Paragraph("<b>KPI 4: Ingresos Totales</b>", td_style),
            Paragraph("<code>#kpiIngresos</code>", td_style),
            Paragraph("Total facturado por ventas mayoristas (<code>$#,##0.00 MXN</code>).", td_style),
            Paragraph("Total recaudado por ventas a Clientes (<code>$#,##0.00 MXN</code>).", td_style)
        ]
    ]
    t_kpis = Table(t_kpis_data, colWidths=[96, 94, 154, 160])
    t_kpis.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_SECONDARY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT_BG]),
        ('BOX', (0,0), (-1,-1), 0.7, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_kpis)
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>Detalle de Reportes Analíticos 1 y 2:</b>", h2_style))
    story.append(Paragraph(
        "<b>Reporte 1 — Ventas Semanales y Tendencia (Línea / Área):</b> Grafica el flujo diario de facturación (Lunes a Domingo) "
        "con una curva spline en color corporativo <code>#1B4332</code>, e incorpora en el eje derecho Y1 una serie discontinua con los pedidos cerrados.",
        bullet_style
    ))
    story.append(Paragraph(
        "<b>Reporte 2 — Ingresos por Categoría (Barras Verticales):</b> Agrupa la facturación por departamento (Suplementos, Cafés, Cápsulas, Aceites, "
        "Cuidado Personal) con paleta degradada y cabecera de resumen con el porcentaje que aporta la categoría dominante.",
        bullet_style
    ))
    story.append(Spacer(1, 6))

    # EVIDENCIA VISUAL FIGURA 3: Gráficas 1 y 2 en Producción
    card_fig3 = create_image_figure_card(
        ASSETS_DIR / "fig3_ui_graficas_semanal_categoria.png",
        width=496,
        height=288,
        fig_num="3",
        title="Implementación en Producción: Gráficas de Ventas Semanales y Categorías",
        source_desc="Chart.js v4 & Canvas HTML5 (Datos reales PostgreSQL: Cápsulas $890 MXN, Cuidado Personal $300 MXN)",
        caption_style=caption_style,
        c_border=C_BORDER,
        c_bg=colors.white
    )
    story.append(card_fig3)

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 4: COMPONENTES DEL DASHBOARD (PARTE 2) Y EXPORTACIÓN
    # =========================================================================
    story.append(Paragraph("<b>Detalle de Reportes Analíticos 3 y 4:</b>", h2_style))
    story.append(Paragraph(
        "<b>Reporte 3 — Rendimiento por Socio / Ventas (Barras Horizontales):</b> Para el Administrador despliega un ranking comparativo de "
        "pedidos y facturación por Socio registrado (Gisela #1 con $1,000.00 MXN, Ximena #2 en alta). Para el Socio, segmenta automáticamente "
        "para ilustrar exclusivamente su propio desempeño minorista.",
        bullet_style
    ))
    story.append(Paragraph(
        "<b>Reporte 4 — Estado de Pedidos e Inventario Crítico (Gráfico Dona + Tabla):</b> Proporción de órdenes (<i>Entregado</i>: <code>#1B4332</code>, "
        "<i>En camino</i>: <code>#2D6A4F</code>, <i>Pendiente</i>: <code>#52B788</code>, <i>Cancelado</i>: <code>#EF4444</code>) con dona central al 62%. "
        "A su lado, integra una tabla en tiempo real con artículos con stock &le; 5 unidades para prevenir desabasto.",
        bullet_style
    ))
    story.append(Spacer(1, 6))

    # EVIDENCIA VISUAL FIGURA 4: Gráficas 3 y 4 en Producción
    card_fig4 = create_image_figure_card(
        ASSETS_DIR / "fig4_ui_graficas_socios_inventario.png",
        width=496,
        height=288,
        fig_num="4",
        title="Implementación en Producción: Rendimiento de Socios y Stock Crítico",
        source_desc="Chart.js Horizontal Bars + Doughnut + Tabla Reactiva (Grapecaps: 1 u, Liberfit: 5 u, Jabón: 5 u)",
        caption_style=caption_style,
        c_border=C_BORDER,
        c_bg=colors.white
    )
    story.append(card_fig4)
    story.append(Spacer(1, 8))

    story.append(Paragraph("6. Exportación de Datos e Impresión Ejecutiva", h1_style))
    story.append(Paragraph(
        "El módulo incorpora dos herramientas de auditoría y descarga accesibles en la barra superior derecha:",
        body_style
    ))
    story.append(Paragraph(
        "<b>1. Descarga Tabular CSV (<code>#btnExportarTodoCSV</code>):</b> "
        "Genera un archivo delimitado por comas con las métricas de KPIs, histórico semanal por día, categorías e inventario crítico. "
        "Para garantizar compatibilidad nativa con Microsoft Excel en Windows y evitar corrupción tipográfica en acentos o eñes, "
        "se codifica antecediendo el caracter BOM UTF-8 (<code>\\uFEFF</code>).",
        bullet_style
    ))
    story.append(Paragraph(
        "<b>2. Diálogo de Impresión y Guardado en PDF (<code>#btnImprimirReportes</code>):</b> "
        "Ejecuta <code>window.print()</code> gobernado por reglas <code>@media print</code> en CSS que ocultan barras de navegación, "
        "fondos decorativos y botones flotantes, forzando la renderización completa de las cuatro gráficas.",
        bullet_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 5: ARQUITECTURA BACKEND Y CONSULTAS SQL EN POSTGRESQL
    # =========================================================================
    story.append(Paragraph("4. Arquitectura de Backend y Consultas SQL (PostgreSQL)", h1_style))
    story.append(Paragraph(
        "El backend en Node.js/Express canaliza las consultas a través de <code>controllers/admin.controller.js</code> en la función "
        "<code>getMetricas(req, res, next)</code>. La lógica extrae el rol de sesión y ejecuta consultas relacionales parametrizadas:",
        body_style
    ))

    # Tabla de Endpoints
    t_end_data = [
        [Paragraph("Endpoint RESTful", th_style), Paragraph("Método", th_style), Paragraph("Parámetros Soportados", th_style), Paragraph("Controlador Asociado", th_style)],
        [
            Paragraph("<code>/api/reportes</code>", td_style),
            Paragraph("<b>GET</b>", td_style),
            Paragraph("<code>rol</code>, <code>usuario_id</code>, <code>numero_socio</code> (Query / Headers)", td_style),
            Paragraph("<code>adminController.getMetricas</code>", td_style)
        ],
        [
            Paragraph("<code>/api/admin/metricas</code>", td_style),
            Paragraph("<b>GET</b>", td_style),
            Paragraph("<code>rol</code>, <code>usuario_id</code>, <code>numero_socio</code> (Alias compatibilidad)", td_style),
            Paragraph("<code>adminController.getMetricas</code>", td_style)
        ],
        [
            Paragraph("<code>/api/pedidos</code>", td_style),
            Paragraph("<b>GET</b>", td_style),
            Paragraph("<code>rol</code>, <code>usuario_id</code>, <code>numero_socio</code> (Filtro por nivel)", td_style),
            Paragraph("<code>pedidosController.getAllPedidos</code>", td_style)
        ]
    ]
    t_end = Table(t_end_data, colWidths=[110, 48, 196, 150])
    t_end.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT_BG]),
        ('BOX', (0,0), (-1,-1), 0.7, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_end)
    story.append(Spacer(1, 6))

    # EVIDENCIA VISUAL FIGURA 5: Código Backend del Controlador
    card_fig5 = create_image_figure_card(
        ASSETS_DIR / "fig6_backend_controller_code.png",
        width=496,
        height=248,
        fig_num="5",
        title="Implementación del Controlador Backend con RBAC y Consultas Parametrizadas",
        source_desc="controllers/admin.controller.js — Lógica de agregación SQL segmentada por rol",
        caption_style=caption_style,
        c_border=C_BORDER,
        c_bg=colors.white
    )
    story.append(card_fig5)
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>Agrupación Temporal con ISO DOW en PostgreSQL:</b>", h2_style))
    story.append(Paragraph(
        "Para calcular la serie de Ventas Semanales sin importar la zona horaria del cliente, se utiliza "
        "<code>EXTRACT(ISODOW FROM pv.fecha_pedido)</code> (donde Lunes = 1 y Domingo = 7), asegurando correspondencia con el arreglo "
        "de días en frontend sin retrasos por desfase UTC:",
        body_style
    ))

    code_sql_extract = """SELECT EXTRACT(ISODOW FROM pv.fecha_pedido) as num_dia, COUNT(*) as pedidos, COALESCE(SUM(pv.total), 0) as ingresos
FROM PEDIDOS_VENTAS pv JOIN USUARIOS u ON pv.id_comprador = u.id_usuario
WHERE pv.estado != 'Cancelado' AND pv.numero_socio_atencion = $1 AND u.id_rol = 3
GROUP BY num_dia ORDER BY num_dia ASC;"""
    t_sql = Table([[Paragraph(f"<pre>{code_sql_extract}</pre>", code_style)]], colWidths=[504])
    t_sql.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_CODE_BG),
        ('BOX', (0,0), (-1,-1), 0.8, C_SECONDARY),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_sql)

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 6: INTEGRACIÓN FRONTEND, MATRIZ DE PRUEBAS Y CIERRE
    # =========================================================================
    story.append(Paragraph("5. Integración Frontend y Ciclo de Vida de Gráficas", h1_style))
    story.append(Paragraph(
        "En <code>public/js/dashboard.js</code>, la función <code>fetchAdminMetrics()</code> gestiona la inyección de cifras en los "
        "elementos del DOM y la instanciación de Chart.js previniendo fugas de memoria con <code>destroyExecutiveCharts()</code>:",
        body_style
    ))

    # EVIDENCIA VISUAL FIGURA 6: Código Frontend
    card_fig6 = create_image_figure_card(
        ASSETS_DIR / "fig7_frontend_dashboard_code.png",
        width=496,
        height=210,
        fig_num="6",
        title="Integración Frontend: Petición Asíncrona, Inyección DOM y Renderizado Chart.js",
        source_desc="public/js/dashboard.js — fetchAdminMetrics(), destroyExecutiveCharts() & initExecutiveCharts()",
        caption_style=caption_style,
        c_border=C_BORDER,
        c_bg=colors.white
    )
    story.append(card_fig6)
    story.append(Spacer(1, 6))

    story.append(Paragraph("7. Matriz de Verificación y Pruebas Reales en Base de Datos", h1_style))

    t_tests_data = [
        [Paragraph("Caso de Prueba", th_style), Paragraph("Usuario Autenticado", th_style), Paragraph("Resultado Esperado", th_style), Paragraph("Estado", th_style)],
        [
            Paragraph("Reportes Admin", td_style),
            Paragraph("Administrador Alfredo<br/>(id: 1, rol: Admin)", td_style),
            Paragraph("Total Pedidos: 1 (surtido Gisela). Ingresos: $1,000.00 MXN. Módulo Compra oculto.", td_style),
            Paragraph("<font color='#195618'><b>Aprobado</b></font>", td_style)
        ],
        [
            Paragraph("Reportes Socio", td_style),
            Paragraph("Gisela<br/>(id: 2, rol: Socio, #1)", td_style),
            Paragraph("Total Clientes: 1 (Diana Laura). Pedidos ventas: 1. Ingresos: $150.00 MXN. Excluye pedido #12 de Alfredo.", td_style),
            Paragraph("<font color='#195618'><b>Aprobado</b></font>", td_style)
        ],
        [
            Paragraph("Historial Pedidos Socio", td_style),
            Paragraph("Gisela<br/>(id: 2, rol: Socio, #1)", td_style),
            Paragraph("Ve orden #8 (surtido Admin) y #10 (despacho Diana Laura). Bloquea #12 de Alfredo.", td_style),
            Paragraph("<font color='#195618'><b>Aprobado</b></font>", td_style)
        ],
        [
            Paragraph("Historial Cliente", td_style),
            Paragraph("Diana Laura<br/>(id: 9, rol: Cliente)", td_style),
            Paragraph("Únicamente ve la orden #10 por $150.00 MXN. Bloqueo 403 a reportes.", td_style),
            Paragraph("<font color='#195618'><b>Aprobado</b></font>", td_style)
        ],
        [
            Paragraph("Prevención Fugas", td_style),
            Paragraph("Navegación entre pestañas", td_style),
            Paragraph("Destrucción limpia de canvas previos antes de redibujar sin parpadeos.", td_style),
            Paragraph("<font color='#195618'><b>Aprobado</b></font>", td_style)
        ]
    ]
    t_tests = Table(t_tests_data, colWidths=[100, 110, 234, 60])
    t_tests.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT_BG]),
        ('BOX', (0,0), (-1,-1), 0.7, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_tests)
    story.append(Spacer(1, 6))

    story.append(Paragraph("8. Conclusiones y Mantenimiento Futuro", h1_style))
    story.append(Paragraph(
        "La integración del <b>Módulo de Creación de Reportes</b> en LocalMarket garantiza exactitud financiera total "
        "con agregación directa en PostgreSQL, privacidad comercial absoluta bajo RBAC jerárquico y alta resiliencia operativa "
        "sincronizada con el Service Worker (<code>localmarket-v30</code>).",
        body_style
    ))
    story.append(Spacer(1, 6))

    # Firma de Cierre Documental
    firma_data = [
        [
            Paragraph("<b>Elaborado por:</b><br/>Desarrollador Full-Stack Senior", td_style),
            Paragraph("<b>Supervisión:</b><br/>Arquitectura de Software LocalMarket", td_style),
            Paragraph("<b>Estado del Entregable:</b><br/><font color='#195618'><b>Aprobado para Auditoría</b></font>", td_style)
        ]
    ]
    t_firma = Table(firma_data, colWidths=[168, 168, 168])
    t_firma.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 0.9, C_PRIMARY),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_firma)

    import shutil
    # Construir PDF en la primera ruta y copiar a las subsiguientes (doc.build consume la lista story)
    primary_path = Path(output_paths[0])
    primary_path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(primary_path),
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"✅ PDF generado exitosamente en: {primary_path}")

    for path in output_paths[1:]:
        p = Path(path)
        p.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(primary_path, p)
        print(f"✅ PDF replicado exitosamente en: {p}")

if __name__ == '__main__':
    downloads_dir = Path.home() / 'Downloads'
    workspace_dir = Path(__file__).resolve().parent.parent

    target_downloads = downloads_dir / 'Documentacion_Creacion_Reportes_LocalMarket.pdf'
    target_workspace = workspace_dir / 'Documentacion_Creacion_Reportes_LocalMarket.pdf'

    create_reports_documentation_pdf([target_downloads, target_workspace])
