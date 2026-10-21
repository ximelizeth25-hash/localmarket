const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const getBase64 = (filePath) => {
    if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        const ext = path.extname(filePath).replace('.', '');
        return `data:image/${ext};base64,${fileBuffer.toString('base64')}`;
    }
    return '';
};

// Cargar todas las imágenes requeridas en Base64
const imgDiagramaERD = getBase64(path.join(__dirname, '..', 'diagrama_bd_proyecto7.png'));
const imgUbicacionPgAdmin = getBase64(path.join(__dirname, '..', 'captura_pgadmin_ubicacion.png'));
const imgProcsPgAdmin = getBase64(path.join(__dirname, '..', 'captura_pgadmin_procs_triggers.png'));
const imgProductosPgAdmin = getBase64(path.join(__dirname, '..', 'captura_pgadmin_tabla_productos.png'));
const imgUsuariosPgAdmin = getBase64(path.join(__dirname, '..', 'captura_pgadmin_tabla_usuarios.png'));
const imgFrontend = getBase64(path.join(__dirname, '..', 'captura_dashboard_frontend.png'));
const imgBackend = getBase64(path.join(__dirname, '..', 'captura_backend_codigo.png'));
const imgBackendServer = getBase64(path.join(__dirname, '..', 'captura_backend_server_db.png'));
const imgFrontendJs = getBase64(path.join(__dirname, '..', 'captura_frontend_codigo_js.png'));
const imgAlgoritmos = getBase64(path.join(__dirname, '..', 'diagrama_algoritmos_analisis.png'));

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Informe de Avances y Bitácora de Unidad - LocalMarket</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap');

        @page {
            size: A4 portrait;
            margin: 1.4cm 1.2cm 1.4cm 1.2cm;
            @bottom-right {
                content: "Página " counter(page);
                font-family: 'Inter', sans-serif;
                font-size: 8pt;
                color: #64748b;
            }
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            background-color: #ffffff;
            line-height: 1.45;
            font-size: 8.6pt;
        }

        .page-break {
            page-break-before: always;
            break-before: page;
        }

        .avoid-break {
            page-break-inside: avoid;
            break-inside: avoid;
        }

        /* PORTADA LIMPIA Y PROFESIONAL */
        .cover-page {
            height: 96vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 3cm 1.5cm 2cm 1.5cm;
            border-left: 8px solid #1e3a8a;
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        }

        .badge-pill {
            display: inline-block;
            background-color: #1e3a8a;
            color: #ffffff;
            font-size: 8.5pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            padding: 6px 16px;
            border-radius: 6px;
            margin-bottom: 1.2cm;
        }

        .cover-title {
            font-size: 26pt;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.2;
            margin-bottom: 14px;
        }

        .cover-subtitle {
            font-size: 13pt;
            color: #475569;
            font-weight: 500;
            line-height: 1.5;
            margin-bottom: 2cm;
        }

        .cover-features {
            border-left: 3px solid #2563eb;
            padding-left: 16px;
            margin-bottom: 2cm;
        }

        .cover-features p {
            font-size: 10pt;
            color: #334155;
            margin-bottom: 8px;
            line-height: 1.6;
        }

        .cover-features strong {
            color: #0f172a;
        }

        .cover-footer {
            border-top: 1px solid #cbd5e1;
            padding-top: 14px;
            display: flex;
            justify-content: space-between;
            font-size: 8.5pt;
            color: #64748b;
        }

        /* ENCABEZADOS DE SECCIONES */
        h1.section-title {
            font-size: 13pt;
            font-weight: 800;
            color: #0f172a;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 4px;
            margin-top: 16px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }

        h1.section-title span.number {
            background-color: #1e3a8a;
            color: #ffffff;
            font-size: 9pt;
            width: 22px;
            height: 22px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            margin-right: 8px;
        }

        h2.subsection-title {
            font-size: 10.2pt;
            font-weight: 700;
            color: #1e293b;
            margin-top: 12px;
            margin-bottom: 6px;
            border-left: 4px solid #2563eb;
            padding-left: 8px;
        }

        p {
            margin-bottom: 7px;
            text-align: justify;
            color: #334155;
            font-size: 8.5pt;
        }

        .callout {
            background-color: #f8fafc;
            border-left: 4px solid #3b82f6;
            border-radius: 0 8px 8px 0;
            padding: 8px 12px;
            margin: 8px 0;
            font-size: 8.2pt;
        }

        .callout-title {
            font-weight: 700;
            color: #1d4ed8;
            margin-bottom: 2px;
            font-size: 8.6pt;
        }

        table.data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 7.6pt;
            margin: 6px 0 10px 0;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            overflow: hidden;
        }

        table.data-table th {
            background-color: #0f172a;
            color: #ffffff;
            padding: 5px 6px;
            font-weight: 600;
            text-align: left;
            font-size: 7.2pt;
            text-transform: uppercase;
        }

        table.data-table td {
            padding: 4px 6px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
            vertical-align: middle;
        }

        table.data-table tr:nth-child(even) {
            background-color: #f8fafc;
        }

        table.data-table tr.subtotal-row {
            background-color: #eff6ff;
            font-weight: 700;
            color: #1e3a8a;
            border-top: 1px solid #bfdbfe;
        }

        table.data-table tr.total-row {
            background-color: #1e3a8a;
            color: #ffffff;
            font-weight: 800;
        }

        table.data-table tr.total-row td {
            color: #ffffff;
            border-bottom: none;
        }

        .code-inline {
            font-family: 'Fira Code', monospace;
            font-size: 7.6pt;
            background: #f1f5f9;
            color: #0f172a;
            padding: 1px 4px;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
        }

        /* CONTENEDORES DE IMÁGENES */
        .img-container {
            text-align: center;
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 6px;
            margin: 8px 0 12px 0;
        }

        .img-container img {
            max-width: 100%;
            height: auto;
            max-height: 380px;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .img-caption {
            font-size: 7.5pt;
            color: #475569;
            font-style: italic;
            margin-top: 4px;
            font-weight: 500;
        }

        .timeline-item {
            border-left: 3px solid #2563eb;
            padding-left: 10px;
            margin-bottom: 8px;
            position: relative;
        }
        .timeline-item::before {
            content: '';
            position: absolute;
            left: -5.5px;
            top: 2px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #2563eb;
        }
        .timeline-header {
            font-weight: 700;
            color: #0f172a;
            font-size: 8.3pt;
        }
        .timeline-date {
            font-size: 7pt;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
        }
        .timeline-body {
            font-size: 7.8pt;
            color: #334155;
            margin-top: 2px;
        }
    </style>
</head>
<body>

    <!-- ============================================================ -->
    <!-- PORTADA ELEGANTE (SIN RECUADROS SOBRECARGADOS)               -->
    <!-- ============================================================ -->
    <div class="cover-page">
        <div>
            <span class="badge-pill">Informe Técnico Integral</span>
            <h1 class="cover-title">Informe de Avances y Bitácora General de la Unidad</h1>
            <p class="cover-subtitle">
                Plataforma SaaS E-Commerce <strong>LocalMarket</strong> (Proyecto 7)
            </p>

            <div class="cover-features">
                <p><strong>• Sistema Gestor de Base de Datos:</strong> PostgreSQL 18 (Transaccional ACID / PL-pgSQL)</p>
                <p><strong>• Stack de Desarrollo:</strong> Node.js, Express.js, JavaScript Moderno (ES6+) y Tailwind CSS</p>
                <p><strong>• Métrica de Dimensionamiento:</strong> 125 PFNA | 141.25 PFA (Metodología IFPUG / Albrecht)</p>
                <p><strong>• Presupuesto Optimizado del Proyecto:</strong> $55,000.00 MXN (Costos Directos e Indirectos)</p>
                <p><strong>• Estado del Entregable:</strong> 100% Desarrollado, Compilado y Verificado en Servidor Local</p>
            </div>
        </div>

        <div class="cover-footer">
            <span>LocalMarket &copy; 2026 - Gestión y Calidad de Software</span>
            <span>Entregable: Carpeta Descargas</span>
        </div>
    </div>

    <!-- ============================================================ -->
    <!-- BITÁCORA GENERAL DE LA UNIDAD                                -->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">B</span> Bitácora Cronológica de la Unidad (Registro de Actividades)</h1>

    <p>
        Registro cronológico de los avances metodológicos y de codificación ejecutados a lo largo de los sprints del proyecto:
    </p>

    <div class="timeline-item">
        <div class="timeline-date">Sprint 1 | Semanas 1 y 2</div>
        <div class="timeline-header">Relevamiento de Requisitos, Análisis del Negocio y Diseño de Base de Datos</div>
        <div class="timeline-body">
            Definición de roles de usuario (Administrador, Vendedor, Cliente). Normalización relacional en Tercera Forma Normal (3FN) 
            conformando 13 tablas en PostgreSQL. Definición de claves primarias, foráneas y restricciones de integridad.
        </div>
    </div>

    <div class="timeline-item">
        <div class="timeline-date">Sprint 2 | Semana 3</div>
        <div class="timeline-header">Métricas de Software: Análisis de Puntos de Función No Ajustados y Ajustados</div>
        <div class="timeline-body">
            Aplicación de la metodología IFPUG / Albrecht: Clasificación de 9 Entradas Externas (EI), 3 Salidas Externas (EO), 
            5 Consultas (EQ), 7 Archivos Lógicos Internos (ILF) y 2 Archivos de Interfaz Externa (EIF) obteniendo 125 PFNA. 
            Determinación de los 14 factores de ajuste y cálculo de 141.25 PFA ajustados.
        </div>
    </div>

    <div class="timeline-item">
        <div class="timeline-date">Sprint 3 | Semana 4</div>
        <div class="timeline-header">Ingeniería Económica: Presupuestación de Costos Directos, Indirectos y de Calidad</div>
        <div class="timeline-body">
            Estructuración presupuestal austera y realista para una plataforma local: Costos Directos ($38,000.00 MXN) correspondientes a 
            desarrollo Full-Stack, base de datos y QA; y Costos Indirectos ($17,000.00 MXN) de servicios, depreciación y contingencias.
        </div>
    </div>

    <div class="timeline-item">
        <div class="timeline-date">Sprint 4 | Semanas 5 y 6</div>
        <div class="timeline-header">Construcción y Verificación del Backend (Node.js + Express + PostgreSQL)</div>
        <div class="timeline-body">
            Programación de enrutadores modulares en <code class="code-inline">routes/</code> para usuarios, catálogo, pedidos transaccionales 
            y verificación 2FA/OTP. Configuración de Connection Pooling seguro y consultas parametrizadas ($1, $2) contra inyección SQL.
        </div>
    </div>

    <div class="timeline-item">
        <div class="timeline-date">Sprint 5 | Semanas 7 y 8</div>
        <div class="timeline-header">Construcción y Refinamiento del Frontend (Dashboard Reactivo y UI Ergonómica)</div>
        <div class="timeline-body">
            Desarrollo en <code class="code-inline">public/dashboard.html</code> y <code class="code-inline">public/dashboard.js</code>: 
            Tarjetas KPI interactivas operando como botones navegables, simplificación a 5 categorías comerciales exactas, limpieza total de 
            formularios numéricos (sin ceros residuales) e integración del Gestor de Mensajería WhatsApp & SMS.
        </div>
    </div>

    <div class="timeline-item">
        <div class="timeline-date">Sprint 6 | Semanas 9 y 10</div>
        <div class="timeline-header">Implementación de Algoritmos de Análisis y Objetos Avanzados en BD</div>
        <div class="timeline-body">
            Compilación en PostgreSQL de 5 Vistas, 5 Procedimientos Almacenados atómicos, 5 Triggers de inventario y 5 Funciones de negocio. 
            Validación de algoritmos de margen comercial, balance de utilidad y mitigación de fuerza bruta en 2FA.
        </div>
    </div>

    <!-- ============================================================ -->
    <!-- SECCIÓN 1: DISEÑO DE LA BASE DE DATOS (CON 5 CAPTURAS)       -->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">1</span> Diseño de la Base de Datos</h1>

    <p>
        La arquitectura de datos de <strong>LocalMarket (proyecto7)</strong> está construida sobre <strong>PostgreSQL 18</strong>, 
        empleando un modelo relacional en <strong>Tercera Forma Normal (3FN)</strong> con cumplimiento estricto de propiedades 
        <strong>ACID</strong>. El esquema integra 13 tablas organizadas lógicamente para garantizar la consistencia en ventas concurrentes.
    </p>

    <h2 class="subsection-title">Captura 1: Esquema Entidad-Relación (ERD de 13 Tablas)</h2>
    <div class="img-container">
        <img src="${imgDiagramaERD}" alt="Diagrama Entidad-Relación LocalMarket">
        <div class="img-caption">Figura 1. Modelo Entidad-Relación de las 13 tablas relacionales implementadas en la base de datos "proyecto7".</div>
    </div>

    <h2 class="subsection-title">Captura 2: Evidencia del Árbol de Objetos en pgAdmin 4</h2>
    <p>
        Estructura de almacenamiento activa en pgAdmin 4 en el esquema <code class="code-inline">public</code> de <code class="code-inline">proyecto7</code>, 
        evidenciando las carpetas de Views, Procedures, Functions y Triggers:
    </p>
    <div class="img-container">
        <img src="${imgUbicacionPgAdmin}" alt="Árbol de Objetos en pgAdmin 4">
        <div class="img-caption">Figura 2. Explorador de Objetos de pgAdmin 4 mostrando la estructura de Vistas, Procedimientos, Funciones y Triggers.</div>
    </div>

    <h2 class="subsection-title">Captura 3: Consulta Real de la Tabla PRODUCTOS en pgAdmin 4</h2>
    <p>
        Verificación de datos persistidos de inventario, precios de venta, costos unitarios y categorías en la tabla <code class="code-inline">productos</code>:
    </p>
    <div class="img-container">
        <img src="${imgProductosPgAdmin}" alt="Consulta Tabla Productos en pgAdmin 4">
        <div class="img-caption">Figura 3. Consulta SELECT en pgAdmin 4 evidenciando los registros de inventario físico, precios y costos de adquisición.</div>
    </div>

    <h2 class="subsection-title">Captura 4: Consulta Real de la Tabla USUARIOS y ROLES en pgAdmin 4</h2>
    <p>
        Persistencia de cuentas de usuario, asignación de roles (Administrador, Vendedor, Cliente) y estatus de verificación 2FA (OTP):
    </p>
    <div class="img-container">
        <img src="${imgUsuariosPgAdmin}" alt="Consulta Tabla Usuarios en pgAdmin 4">
        <div class="img-caption">Figura 4. Consulta multi-tabla en pgAdmin 4 mostrando las cuentas de usuario registradas y su validación OTP.</div>
    </div>

    <h2 class="subsection-title">Captura 5: Consola Transaccional y Ejecución de Procedimientos Atómicos</h2>
    <p>
        Invocación de procedimientos almacenados en la consola SQL de pgAdmin 4 con activación reactiva de triggers de inventario:
    </p>
    <div class="img-container">
        <img src="${imgProcsPgAdmin}" alt="Ejecución Transaccional en pgAdmin 4">
        <div class="img-caption">Figura 5. Consola SQL de pgAdmin 4 evidenciando la deducción de existencias y disparo de triggers automáticos.</div>
    </div>

    <h2 class="subsection-title">Resumen de Tablas y Objetos de Base de Datos</h2>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 25%;">Categoría de Objetos</th>
                <th style="width: 15%;">Cantidad</th>
                <th style="width: 60%;">Elementos Implementados en PostgreSQL 18</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Tablas Principales</strong></td>
                <td>13 tablas</td>
                <td><code>roles</code>, <code>permisos</code>, <code>roles_permisos</code>, <code>usuarios</code>, <code>verificaciones_otp</code>, <code>direcciones_entrega</code>, <code>categorias</code>, <code>productos</code>, <code>metodos_pago</code>, <code>costos_fijos</code>, <code>preguntas_producto</code>, <code>pedidos_ventas</code>, <code>detalle_venta</code>.</td>
            </tr>
            <tr>
                <td><strong>Vistas (Views)</strong></td>
                <td>5 vistas</td>
                <td><code>vw_catalogo_productos_detallado</code>, <code>vw_resumen_pedidos_ventas</code>, <code>vw_alerta_stock_critico</code>, <code>vw_metricas_vendedores</code>, <code>vw_balance_financiero_tienda</code>.</td>
            </tr>
            <tr>
                <td><strong>Procedimientos</strong></td>
                <td>5 SP</td>
                <td><code>sp_procesar_venta</code> (atómico), <code>sp_crear_pedido</code>, <code>sp_actualizar_estado_pedido</code>, <code>sp_reabastecer_stock</code>, <code>sp_depurar_intentos_otp</code>.</td>
            </tr>
            <tr>
                <td><strong>Triggers</strong></td>
                <td>5 triggers</td>
                <td><code>trg_evitar_stock_negativo</code>, <code>trg_actualizar_total_pedido</code>, <code>trg_normalizar_correo_usuario</code>, <code>trg_validar_precios_coherentes</code>, <code>trg_auditar_agotamiento_stock</code>.</td>
            </tr>
            <tr>
                <td><strong>Funciones</strong></td>
                <td>5 funciones</td>
                <td><code>fn_validar_stock_disponible</code>, <code>fn_calcular_subtotal_producto</code>, <code>fn_calcular_margen_ganancia</code>, <code>fn_total_ventas_vendedor</code>, <code>fn_consultar_pedidos_cliente</code>.</td>
            </tr>
        </tbody>
    </table>

    <!-- ============================================================ -->
    <!-- SECCIÓN 2: PUNTOS DE FUNCIÓN (LIMPIA SIN FÓRMULAS RAW)       -->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">2</span> Puntos de Función (Métrica IFPUG / Albrecht)</h1>

    <p>
        Siguiendo los lineamientos del estándar internacional <strong>IFPUG / Albrecht</strong>, se cuantificó el tamaño funcional 
        del producto de software evaluando transacciones y archivos lógicos para determinar los Puntos de Función No Ajustados (PFNA) 
        y Ajustados (PFA):
    </p>

    <h2 class="subsection-title">2.1. Matriz de Componentes No Ajustados (PFNA)</h2>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 25%;">Tipo de Componente</th>
                <th style="width: 35%;">Descripción en el Proyecto</th>
                <th style="width: 15%;">Cantidad</th>
                <th style="width: 15%;">Complejidad</th>
                <th style="width: 10%;">PF</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Entradas Externas (EI)</strong></td>
                <td>Altas, bajas y modificaciones de Alumnos/Usuarios, Pagos, Materias/Productos, Cursa/Pedidos, Becas, Discapacidad y Estados.</td>
                <td>9 transacciones</td>
                <td>Media / Baja</td>
                <td><strong>31</strong></td>
            </tr>
            <tr>
                <td><strong>Salidas Externas (EO)</strong></td>
                <td>Reportes con cálculos matemáticos derivados: Estado de Cuenta y Saldos, Carga Académica con Costos, Informe Estadístico / Balance de Ventas.</td>
                <td>3 reportes</td>
                <td>Alta / Media</td>
                <td><strong>19</strong></td>
            </tr>
            <tr>
                <td><strong>Consultas Externas (EQ)</strong></td>
                <td>Búsquedas directas: Consulta por Matrícula/ID, Catálogo de Materias, Historial de Pagos, Padrón de Becados, Padrón Especial.</td>
                <td>5 consultas</td>
                <td>Baja / Media</td>
                <td><strong>16</strong></td>
            </tr>
            <tr>
                <td><strong>Archivos Lógicos Internos (ILF)</strong></td>
                <td>Tablas relacionales base mantenidas en la base de datos (7 tablas base con RET y DET definidos).</td>
                <td>7 archivos BD</td>
                <td>Baja (7 c/u)</td>
                <td><strong>49</strong></td>
            </tr>
            <tr>
                <td><strong>Archivos de Interfaz Externa (EIF)</strong></td>
                <td>Servicios externos de validación y catálogos oficiales (Validación RENAPO y Catálogo Escolar SEJ/DGB).</td>
                <td>2 interfaces</td>
                <td>Baja (5 c/u)</td>
                <td><strong>10</strong></td>
            </tr>
            <tr class="subtotal-row">
                <td colspan="4">TOTAL PUNTOS DE FUNCIÓN NO AJUSTADOS (PFNA)</td>
                <td><strong>125 PF</strong></td>
            </tr>
        </tbody>
    </table>

    <h2 class="subsection-title">2.2. Resultados del Ajuste de Complejidad</h2>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 35%;">Métrica Evaluada</th>
                <th style="width: 25%;">Valor Obtenido</th>
                <th style="width: 40%;">Interpretación Técnica</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Puntos de Función No Ajustados (PFNA)</strong></td>
                <td><strong>125 PF</strong></td>
                <td>Volumen funcional base de entradas, salidas, consultas y archivos.</td>
            </tr>
            <tr>
                <td><strong>Sumatoria de los 14 Factores (GSC)</strong></td>
                <td><strong>48 puntos</strong></td>
                <td>Influencia técnica de rendimiento, transaccionalidad y entorno web.</td>
            </tr>
            <tr>
                <td><strong>Factor de Ajuste de Complejidad (CAF)</strong></td>
                <td><strong>1.13</strong></td>
                <td>Coeficiente de ponderación ambiental (+13% de complejidad).</td>
            </tr>
            <tr class="subtotal-row">
                <td><strong>TOTAL PUNTOS DE FUNCIÓN AJUSTADOS (PFA)</strong></td>
                <td><strong>141.25 PFA</strong></td>
                <td>Tamaño funcional final ajustado del producto de software.</td>
            </tr>
        </tbody>
    </table>

    <!-- ============================================================ -->
    <!-- SECCIÓN 3: COSTOS DIRECTOS E INDIRECTOS                      -->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">3</span> Costos Indirectos y Costos Directos</h1>

    <p>
        El presupuesto financiero del proyecto fue dimensionado bajo un <strong>enfoque austero, eficiente y realista</strong> 
        para un desarrollo de software de escala local/emprendimiento, situándose en un monto total de <strong>$55,000.00 MXN</strong>:
    </p>

    <h2 class="subsection-title">3.1. Desglose de Costos Directos ($38,000.00 MXN / 69.09%)</h2>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 32%;">Rubro de Costo Directo</th>
                <th style="width: 42%;">Alcance en el Proyecto LocalMarket</th>
                <th style="width: 13%;">Monto ($ MXN)</th>
                <th style="width: 13%;">% Incidencia</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Desarrollo Full-Stack (Node.js/JS)</strong></td>
                <td>Programación de controladores REST, endpoints y componentes frontend reactivos (1.5 meses dedicados).</td>
                <td>$18,500.00</td>
                <td>33.64%</td>
            </tr>
            <tr>
                <td><strong>Ingeniería de Base de Datos PostgreSQL</strong></td>
                <td>Diseño normalizado 3FN (13 tablas), triggers anti-stock negativo, procedimientos atómicos y vistas optimizadas.</td>
                <td>$8,000.00</td>
                <td>14.55%</td>
            </tr>
            <tr>
                <td><strong>Aseguramiento de Calidad y Pruebas</strong></td>
                <td>Desarrollo y ejecución de pruebas unitarias, de integración y pruebas de carga concurrente de pedidos.</td>
                <td>$6,000.00</td>
                <td>10.91%</td>
            </tr>
            <tr>
                <td><strong>Diseño UI/UX y Ergonomía del Dashboard</strong></td>
                <td>Maquetación responsiva, navegación interactiva por tarjetas KPI y estandarización visual.</td>
                <td>$3,500.00</td>
                <td>6.36%</td>
            </tr>
            <tr>
                <td><strong>Insumos Directos y Pasarela OTP</strong></td>
                <td>Créditos para envío de tokens de verificación por SMS/WhatsApp y librerías de producción.</td>
                <td>$2,000.00</td>
                <td>3.64%</td>
            </tr>
            <tr class="subtotal-row">
                <td colspan="2">SUBTOTAL COSTOS DIRECTOS</td>
                <td>$38,000.00</td>
                <td>69.09%</td>
            </tr>
        </tbody>
    </table>

    <h2 class="subsection-title">3.2. Desglose de Costos Indirectos ($17,000.00 MXN / 30.91%)</h2>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 32%;">Rubro de Costo Indirecto</th>
                <th style="width: 42%;">Alcance en el Proyecto LocalMarket</th>
                <th style="width: 13%;">Monto ($ MXN)</th>
                <th style="width: 13%;">% Incidencia</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Servicios de Infraestructura y Staging</strong></td>
                <td>Consumo de energía eléctrica, internet de banda ancha de alta velocidad y servidor de pruebas staging.</td>
                <td>$5,500.00</td>
                <td>10.00%</td>
            </tr>
            <tr>
                <td><strong>Gestión, Documentación y Repositorios</strong></td>
                <td>Seguimiento de sprints ágiles, administración de ramas en GitHub y redacción de manuales técnicos.</td>
                <td>$4,000.00</td>
                <td>7.27%</td>
            </tr>
            <tr>
                <td><strong>Fondo de Contingencias y Retrabajos (CoQ)</strong></td>
                <td>Reserva para depuración imprevista de bugs y horas de soporte técnico en etapa de lanzamiento.</td>
                <td>$4,000.00</td>
                <td>7.27%</td>
            </tr>
            <tr>
                <td><strong>Depreciación de Equipo de Cómputo</strong></td>
                <td>Amortización del desgaste de computadoras portátiles y periféricos utilizados durante el proyecto.</td>
                <td>$3,500.00</td>
                <td>6.36%</td>
            </tr>
            <tr class="subtotal-row">
                <td colspan="2">SUBTOTAL COSTOS INDIRECTOS</td>
                <td>$17,000.00</td>
                <td>30.91%</td>
            </tr>
        </tbody>
    </table>

    <h2 class="subsection-title">3.3. Cuadro Resumen Presupuestal Consolidado</h2>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 45%;">Categoría Financiera</th>
                <th style="width: 25%;">Presupuesto ($ MXN)</th>
                <th style="width: 30%;">Proporción Relativa (%)</th>
            </tr>
        </thead>
        <tbody>
            <tr style="background: #f0fdf4;">
                <td><strong>COSTOS DIRECTOS</strong> (Mano de obra, BD, QA, UI/UX, Insumos)</td>
                <td><strong>$38,000.00 MXN</strong></td>
                <td><strong>69.09%</strong></td>
            </tr>
            <tr style="background: #fef2f2;">
                <td><strong>COSTOS INDIRECTOS</strong> (Infraestructura, Gestión, Contingencias, Depreciación)</td>
                <td><strong>$17,000.00 MXN</strong></td>
                <td><strong>30.91%</strong></td>
            </tr>
            <tr class="total-row">
                <td>PRESUPUESTO TOTAL DEL PROYECTO</td>
                <td>$55,000.00 MXN</td>
                <td>100.00%</td>
            </tr>
        </tbody>
    </table>

    <!-- ============================================================ -->
    <!-- SECCIÓN 4: AVANCES DE CODIFICACIÓN (CON 4 CAPTURAS)          -->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">4</span> Avances de Codificación del Proyecto (Backend y Frontend)</h1>

    <p>
        La solución tecnológica está construida con JavaScript moderno tanto en el servidor como en el cliente, logrando 
        un stack Full-Stack integrado, reactivo y de alta velocidad:
    </p>

    <h2 class="subsection-title">Captura 6: Frontend - Dashboard Operativo con Tarjetas KPI y Formularios Limpios</h2>
    <p>
        Interfaz de usuario en <code class="code-inline">public/dashboard.html</code> mostrando las tarjetas KPI superiores como botones interactivos, 
        el menú de categorías depurado a 5 opciones y el formulario numérico limpio:
    </p>
    <div class="img-container">
        <img src="${imgFrontend}" alt="Captura del Frontend Dashboard LocalMarket">
        <div class="img-caption">Figura 6. Dashboard interactivo: Tarjetas KPI navegables, catálogo con 5 categorías y formulario sin ceros predefinidos.</div>
    </div>

    <h2 class="subsection-title">Captura 7: Backend - Controlador de Productos en VS Code</h2>
    <p>
        Implementación del controlador REST <code class="code-inline">routes/productos.js</code> con cálculo de márgenes comerciales y consultas parametrizadas:
    </p>
    <div class="img-container">
        <img src="${imgBackend}" alt="Captura del Código Backend en VS Code">
        <div class="img-caption">Figura 7. Editor de código VS Code mostrando la arquitectura en routes/ y la lógica de negocio de productos.</div>
    </div>

    <h2 class="subsection-title">Captura 8: Backend - Configuración del Pool de PostgreSQL y Servidor Central</h2>
    <p>
        Configuración de <code class="code-inline">db.js</code> con la clase <code class="code-inline">Pool</code> de node-postgres y <code class="code-inline">server.js</code> con el enrutamiento HTTP:
    </p>
    <div class="img-container">
        <img src="${imgBackendServer}" alt="Captura de db.js y server.js en VS Code">
        <div class="img-caption">Figura 8. Código de db.js (Pool de Conexiones a PostgreSQL) y server.js (Servidor central Express).</div>
    </div>

    <h2 class="subsection-title">Captura 9: Frontend - Lógica de Navegación y Carga Asíncrona en dashboard.js</h2>
    <p>
        Código fuente de <code class="code-inline">public/dashboard.js</code> con los listeners de clic de las tarjetas KPI y la función reactiva <code class="code-inline">cargarUsuarios()</code>:
    </p>
    <div class="img-container">
        <img src="${imgFrontendJs}" alt="Captura de dashboard.js en VS Code">
        <div class="img-caption">Figura 9. Implementación de eventos de navegación dinámica en tarjetas KPI y carga asíncrona de datos en JavaScript.</div>
    </div>

    <!-- ============================================================ -->
    <!-- SECCIÓN 5: ALGORITMOS DE ANÁLISIS (CON DIAGRAMA VISUAL)      -->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">5</span> Algoritmos de Análisis Implementados</h1>

    <p>
        El sistema cuenta con 5 algoritmos diseñados para la gestión analítica, control de inventarios, finanzas y seguridad transaccional:
    </p>

    <h2 class="subsection-title">Captura 10: Diagrama de Flujo y Ejecución de los Algoritmos Clave</h2>
    <p>
        El siguiente esquema visual modela la secuencia lógica de ejecución de la transacción atómica de venta, la alerta de stock crítico 
        y la mitigación de fuerza bruta en autenticación OTP:
    </p>

    <div class="img-container">
        <img src="${imgAlgoritmos}" alt="Diagrama de Flujo de los Algoritmos de Análisis">
        <div class="img-caption">Figura 10. Diagrama de flujo de los algoritmos de análisis: 1) Venta ACID, 2) Stock Crítico y 3) Mitigación de Fuerza Bruta en 2FA.</div>
    </div>

    <h2 class="subsection-title">Especificación de los 5 Algoritmos</h2>
    <div class="callout">
        <div class="callout-title">1. Algoritmo Transaccional Atómico de Venta (ACID):</div>
        Verifica existencias disponibles con bloqueo condicional. Si <code class="code-inline">stock >= cantidad</code>, calcula el subtotal, inserta en <code class="code-inline">detalle_venta</code>, descuenta unidades de <code class="code-inline">productos</code> y actualiza el total en <code class="code-inline">pedidos_ventas</code> de forma atómica.
    </div>

    <div class="callout">
        <div class="callout-title">2. Algoritmo de Cálculo de Margen de Ganancia Comercial:</div>
        Evalúa el porcentaje de rentabilidad sobre el precio de venta evitando divisiones entre cero:
        <strong>Margen (%) = ROUND(((Precio - Costo) / Precio) * 100, 2)</strong>
    </div>

    <div class="callout">
        <div class="callout-title">3. Algoritmo de Balance Financiero y Utilidad Neta:</div>
        Computa el rendimiento global integrando las ventas brutas acumuladas, el costo de mercancía vendida (COGS) y deduciendo los costos fijos declarados por el vendedor:
        <strong>Utilidad Neta = (Ventas Brutas - COGS) - Costos Fijos</strong>
    </div>

    <div class="callout">
        <div class="callout-title">4. Algoritmo de Alerta de Reorden y Detección de Stock Crítico:</div>
        Identifica artículos con existencias &le; 5 unidades. Computa las piezas necesarias para alcanzar el inventario base $(20 - \text{stock})$ y calcula el presupuesto estimado de resurtido: <strong>Costo Reorden = (20 - stock) * Costo Unitario</strong>.
    </div>

    <div class="callout">
        <div class="callout-title">5. Algoritmo Criptográfico de Validación OTP y Mitigación de Fuerza Bruta:</div>
        Genera token pseudoaleatorio de 6 dígitos con ventana de caducidad de 15 minutos. Gestiona un contador incremental de fallos en <code class="code-inline">verificaciones_otp</code> y activa el bloqueo preventivo temporal de la cuenta si se alcanzan 3 intentos fallidos consecutivos.
    </div>

</body>
</html>
`;

// Guardar documento HTML fuente
const htmlFilePath = path.join(__dirname, '..', 'Informe_Avances_Bitacora_Unidad.html');
fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log('HTML v2 generado exitosamente en:', htmlFilePath);

// Convertir a PDF utilizando Microsoft Edge Headless
const edgePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];
const selectedEdge = edgePaths.find(p => fs.existsSync(p));

if (!selectedEdge) {
    console.error('❌ Microsoft Edge no fue encontrado para generar el PDF.');
    process.exit(1);
}

// Rutas de destino del PDF
const downloadsDir = path.join(process.env.USERPROFILE || 'C:\\Users\\ximel', 'Downloads');
const pdfDownloadsPath = path.join(downloadsDir, 'Informe_Avances_Bitacora_Unidad.pdf');
const pdfLocalPath = path.join(__dirname, '..', 'Informe_Avances_Bitacora_Unidad.pdf');

try {
    const cmd = `"${selectedEdge}" --headless --disable-gpu --print-to-pdf="${pdfLocalPath}" --no-pdf-header-footer "${htmlFilePath}"`;
    console.log('Compilando PDF v2 con 10 capturas y sin bloques eliminados...');
    execSync(cmd);

    // Copiar a Downloads
    fs.copyFileSync(pdfLocalPath, pdfDownloadsPath);

    const stats = fs.statSync(pdfDownloadsPath);
    console.log(`\n======================================================`);
    console.log(`✅ PDF v2 MODIFICADO Y GUARDADO EXITOSAMENTE`);
    console.log(`======================================================`);
    console.log(`📁 En Descargas: ${pdfDownloadsPath} (${(stats.size / 1024).toFixed(2)} KB)`);
    console.log(`📁 En Proyecto:  ${pdfLocalPath}`);
} catch (err) {
    console.error('❌ Error al compilar PDF v2:', err.message);
    process.exit(1);
}
