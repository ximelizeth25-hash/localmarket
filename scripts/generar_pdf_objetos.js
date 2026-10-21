const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Leer imágenes y convertirlas a Base64 para incrustación directa
const getBase64 = (filePath) => {
    if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        const ext = path.extname(filePath).replace('.', '');
        return `data:image/${ext};base64,${fileBuffer.toString('base64')}`;
    }
    return '';
};

const imgUbicacionGlobal = getBase64(path.join(__dirname, '..', 'captura_pgadmin_ubicacion.png'));
const imgProcsTriggers = getBase64(path.join(__dirname, '..', 'captura_pgadmin_procs_triggers.png'));
const imgDiagramaERD = getBase64(path.join(__dirname, '..', 'diagrama_bd_proyecto7.png'));

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Diseño de Objetos de Base de Datos - LocalMarket</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap');

        @page {
            size: A4 portrait;
            margin: 1.6cm 1.4cm 1.6cm 1.4cm;
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
            line-height: 1.5;
            font-size: 9.5pt;
        }

        .page-break {
            page-break-before: always;
            break-before: page;
        }

        .avoid-break {
            page-break-inside: avoid;
            break-inside: avoid;
        }

        /* PORTADA */
        .cover-page {
            height: 98vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 2.2cm 1.2cm 1.5cm 1.2cm;
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
            padding: 5px 14px;
            border-radius: 6px;
            margin-bottom: 1cm;
        }

        .cover-title {
            font-size: 25pt;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.2;
            margin-bottom: 12px;
        }

        .cover-subtitle {
            font-size: 13pt;
            color: #475569;
            font-weight: 500;
            line-height: 1.4;
            margin-bottom: 1.5cm;
        }

        .meta-box {
            background-color: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            margin-bottom: 1.5cm;
        }

        .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .meta-item label {
            display: block;
            font-size: 8pt;
            text-transform: uppercase;
            font-weight: 700;
            color: #64748b;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
        }

        .meta-item p {
            font-size: 10pt;
            font-weight: 600;
            color: #0f172a;
        }

        .summary-badge-container {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }

        .summary-badge {
            flex: 1;
            background: #f1f5f9;
            border-left: 3px solid #2563eb;
            padding: 10px;
            border-radius: 0 6px 6px 0;
            text-align: center;
        }

        .summary-badge .num {
            font-size: 16pt;
            font-weight: 800;
            color: #1e3a8a;
            display: block;
        }

        .summary-badge .lbl {
            font-size: 7.5pt;
            font-weight: 700;
            text-transform: uppercase;
            color: #475569;
        }

        .cover-footer {
            border-top: 1px solid #cbd5e1;
            padding-top: 14px;
            display: flex;
            justify-content: space-between;
            font-size: 8.5pt;
            color: #64748b;
        }

        /* SECCIONES Y ENCABEZADOS */
        h1.section-title {
            font-size: 15pt;
            font-weight: 800;
            color: #0f172a;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 6px;
            margin-top: 20px;
            margin-bottom: 14px;
            display: flex;
            align-items: center;
        }

        h1.section-title span.number {
            background-color: #1e3a8a;
            color: #ffffff;
            font-size: 10pt;
            width: 24px;
            height: 24px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            margin-right: 10px;
        }

        h2.subsection-title {
            font-size: 11.5pt;
            font-weight: 700;
            color: #1e293b;
            margin-top: 14px;
            margin-bottom: 8px;
            border-left: 4px solid #2563eb;
            padding-left: 8px;
        }

        h3.object-title {
            font-size: 10.5pt;
            font-weight: 700;
            color: #0f172a;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #0284c7;
            padding: 8px 12px;
            margin-top: 14px;
            margin-bottom: 8px;
            border-radius: 0 6px 6px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        p {
            margin-bottom: 8px;
            text-align: justify;
            color: #334155;
            font-size: 9pt;
        }

        /* CAJAS Y TABLAS */
        .callout {
            background-color: #f8fafc;
            border-left: 4px solid #3b82f6;
            border-radius: 0 8px 8px 0;
            padding: 10px 14px;
            margin: 10px 0;
            font-size: 8.5pt;
        }

        .callout-title {
            font-weight: 700;
            color: #1d4ed8;
            margin-bottom: 3px;
            font-size: 9pt;
        }

        .param-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8pt;
            margin: 8px 0;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
        }

        .param-table th {
            background-color: #1e293b;
            color: #ffffff;
            padding: 5px 8px;
            font-weight: 600;
            text-align: left;
            font-size: 7.5pt;
            text-transform: uppercase;
        }

        .param-table td {
            padding: 5px 8px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
            vertical-align: middle;
        }

        .param-table tr:nth-child(even) {
            background-color: #f8fafc;
        }

        /* CÓDIGO SQL */
        pre.sql-code {
            background-color: #0f172a;
            color: #f8fafc;
            padding: 10px 12px;
            border-radius: 6px;
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 7.6pt;
            line-height: 1.45;
            margin: 6px 0 10px 0;
            border-left: 3px solid #38bdf8;
            overflow-x: auto;
            white-space: pre-wrap;
            word-break: break-word;
        }

        .code-inline {
            font-family: 'Fira Code', monospace;
            font-size: 8pt;
            background: #f1f5f9;
            color: #0f172a;
            padding: 1px 4px;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
        }

        /* IMÁGENES Y DIAGRAMAS */
        .img-container {
            text-align: center;
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 8px;
            margin: 10px 0 14px 0;
        }

        .img-container img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        }

        .img-caption {
            font-size: 8pt;
            color: #64748b;
            font-style: italic;
            margin-top: 5px;
        }

        .hierarchy-box {
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 10px;
            font-family: 'Consolas', monospace;
            font-size: 8.5pt;
            color: #0f172a;
            line-height: 1.6;
            margin: 8px 0;
        }

        .tag-badge {
            font-size: 7pt;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
            text-transform: uppercase;
        }
        .tag-view { background: #cffafe; color: #0891b2; }
        .tag-proc { background: #fce7f3; color: #db2777; }
        .tag-trig { background: #ffedd5; color: #ea580c; }
        .tag-func { background: #ede9fe; color: #7c3aed; }
    </style>
</head>
<body>

    <!-- ============================================================ -->
    <!-- PORTADA                                                      -->
    <!-- ============================================================ -->
    <div class="cover-page">
        <div>
            <span class="badge-pill">Diseño e Implementación de Base de Datos</span>
            <h1 class="cover-title">Diseño de Objetos Avanzados de Base de Datos</h1>
            <p class="cover-subtitle">
                Especificación Técnica y Evidencia de Implementación de <strong>5 Vistas, 5 Procedimientos, 5 Triggers y 5 Funciones</strong> en PostgreSQL para el Proyecto <strong>LocalMarket</strong>.
            </p>

            <div class="meta-box">
                <div class="meta-grid">
                    <div class="meta-item">
                        <label>Sistema Gestor (SGBD)</label>
                        <p>PostgreSQL 18 (Motor PL/pgSQL)</p>
                    </div>
                    <div class="meta-item">
                        <label>Base de Datos & Esquema</label>
                        <p>proyecto7 / public (localhost:5432)</p>
                    </div>
                    <div class="meta-item">
                        <label>Herramienta de Administración</label>
                        <p>pgAdmin 4 (v8+ / Object Explorer)</p>
                    </div>
                    <div class="meta-item">
                        <label>Arquitectura del Proyecto</label>
                        <p>E-Commerce Multi-Rol (13 Tablas ACID)</p>
                    </div>
                    <div class="meta-item">
                        <label>Estado de Objetos en BD</label>
                        <p style="color: #16a34a;">✓ 100% Compilados y Verificados</p>
                    </div>
                    <div class="meta-item">
                        <label>Versión del Entregable</label>
                        <p>Versión 2.0 (Final - Proyecto Integrador)</p>
                    </div>
                </div>

                <div class="summary-badge-container">
                    <div class="summary-badge">
                        <span class="num">5</span>
                        <span class="lbl">Vistas (Views)</span>
                    </div>
                    <div class="summary-badge">
                        <span class="num">5</span>
                        <span class="lbl">Procedimientos (Procedures)</span>
                    </div>
                    <div class="summary-badge">
                        <span class="num">5</span>
                        <span class="lbl">Triggers & Disparadores</span>
                    </div>
                    <div class="summary-badge">
                        <span class="num">5</span>
                        <span class="lbl">Funciones (Functions)</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="cover-footer">
            <span>LocalMarket &copy; 2026 - Control Escolar e Ingeniería de Software</span>
            <span>Ubicación de Salida: Carpeta Descargas</span>
        </div>
    </div>

    <!-- ============================================================ -->
    <!-- SECCIÓN 1: UBICACIÓN DE OBJETOS EN PGADMIN Y POSTGRESQL      -->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">1</span> Ubicación Física y Jerárquica en PostgreSQL / pgAdmin 4</h1>

    <p>
        En el Sistema Gestor de Base de Datos <strong>PostgreSQL 18</strong>, todos los objetos de persistencia y lógica procedimental 
        están organizados bajo una jerarquía modular basada en catálogos y esquemas (namespaces). Para el proyecto 
        <strong>LocalMarket (proyecto7)</strong>, los 20 objetos diseñados están alojados en el esquema predeterminado 
        <code class="code-inline">public</code>.
    </p>

    <div class="callout">
        <div class="callout-title">Jerarquía de Almacenamiento en el Árbol de pgAdmin 4:</div>
        <strong>Servidor:</strong> Servers &gt; PostgreSQL 18 (localhost:5432)<br>
        <strong>Base de Datos:</strong> Databases &gt; <code>proyecto7</code> &gt; Schemas &gt; <code>public</code><br>
        <strong>Subárboles Específicos:</strong>
        <ul style="margin-left: 20px; margin-top: 4px;">
            <li><strong>Vistas:</strong> <code class="code-inline">public &gt; Views</code> (5 vistas creadas)</li>
            <li><strong>Procedimientos Almacenados:</strong> <code class="code-inline">public &gt; Procedures</code> (5 procedimientos con sintaxis <code class="code-inline">CALL</code>)</li>
            <li><strong>Funciones de Negocio:</strong> <code class="code-inline">public &gt; Functions</code> (5 funciones escalares y de tabla)</li>
            <li><strong>Funciones de Disparador:</strong> <code class="code-inline">public &gt; Trigger Functions</code> (5 funciones que retornan <code class="code-inline">TRIGGER</code>)</li>
            <li><strong>Disparadores en Tablas:</strong> <code class="code-inline">public &gt; Tables &gt; [productos, detalle_venta, usuarios] &gt; Triggers</code></li>
        </ul>
    </div>

    <h2 class="subsection-title">Evidencia Visual 1: Árbol de Objetos en pgAdmin 4 y Query Tool</h2>
    <p>
        La siguiente captura de pantalla de <strong>pgAdmin 4</strong> demuestra la existencia real de los objetos en el navegador lateral 
        (Object Explorer) y la ejecución de la vista de catálogo en el Query Tool conectado a la base de datos <code class="code-inline">proyecto7</code>:
    </p>

    <div class="img-container">
        <img src="${imgUbicacionGlobal}" alt="Árbol de Objetos en pgAdmin 4">
        <div class="img-caption">Figura 1. Captura de pantalla de pgAdmin 4 mostrando el árbol jerárquico de Views, Procedures, Functions y Triggers en el esquema "public" de "proyecto7".</div>
    </div>

    <h2 class="subsection-title">Evidencia Visual 2: Procedimientos Almacenados y Consola Transaccional</h2>
    <p>
        En la consola interactiva se aprecia la invocación del procedimiento atómico <code class="code-inline">sp_procesar_venta()</code>, 
        el cual dispara el trigger de actualización de importes y descuenta las existencias sin bloqueos:
    </p>

    <div class="img-container">
        <img src="${imgProcsTriggers}" alt="Ejecución de Procedimientos y Disparadores en pgAdmin 4">
        <div class="img-caption">Figura 2. Ejecución y logs transaccionales en pgAdmin 4 evidenciando la sincronización de inventario y triggers automáticos.</div>
    </div>

    <!-- ============================================================ -->
    <!-- SECCIÓN 2: DISEÑO DE LAS 5 VISTAS (VIEWS)                    -->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">2</span> Diseño de las 5 Vistas (Views)</h1>

    <p>
        Las vistas permiten encapsular consultas analíticas complejas con múltiples uniones (<code class="code-inline">JOIN</code>), 
        simplificando la capa de backend y optimizando el tiempo de respuesta del catálogo y paneles gerenciales.
    </p>

    <!-- Vista 1 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>1. Vista: <code class="code-inline">vw_catalogo_productos_detallado</code></span>
            <span class="tag-badge tag-view">Vista de Catálogo</span>
        </div>
        <p><strong>Propósito:</strong> Despliega el catálogo de productos enriquecido con el nombre de su categoría, nombre del vendedor, estado de inventario y el cálculo del porcentaje de margen de ganancia.</p>
        <table class="param-table">
            <thead>
                <tr><th>Campo Proyectado</th><th>Tipo de Dato</th><th>Cálculo / Origen</th><th>Descripción</th></tr>
            </thead>
            <tbody>
                <tr><td><code>id_producto</code></td><td>INT</td><td><code>productos.id_producto</code></td><td>Clave única del producto.</td></tr>
                <tr><td><code>titulo, descripcion</code></td><td>VARCHAR/TEXT</td><td><code>productos</code></td><td>Ficha técnica descriptiva.</td></tr>
                <tr><td><code>precio, costo_unitario</code></td><td>NUMERIC(12,2)</td><td><code>productos</code></td><td>Valores monetarios base.</td></tr>
                <tr><td><code>margen_porcentaje</code></td><td>NUMERIC</td><td><code>ROUND(((precio - costo)/precio)*100, 2)</code></td><td>Margen bruto porcentual.</td></tr>
                <tr><td><code>estado_stock</code></td><td>TEXT</td><td><code>CASE WHEN stock=0...</code></td><td>Etiqueta ('Agotado', 'Stock Crítico', 'Disponible').</td></tr>
                <tr><td><code>categoria_nombre</code></td><td>VARCHAR</td><td><code>categorias.nombre</code></td><td>Nombre textual de la categoría.</td></tr>
                <tr><td><code>vendedor_nombre</code></td><td>VARCHAR</td><td><code>usuarios.nombre</code></td><td>Vendedor propietario del producto.</td></tr>
            </tbody>
        </table>
        <pre class="sql-code">CREATE OR REPLACE VIEW vw_catalogo_productos_detallado AS
SELECT 
    p.id_producto, p.titulo, p.descripcion, p.precio, p.costo_unitario,
    ROUND(((p.precio - p.costo_unitario) / NULLIF(p.precio, 0)) * 100, 2) AS margen_porcentaje,
    p.stock,
    CASE 
        WHEN p.stock = 0 THEN 'Agotado'
        WHEN p.stock <= 5 THEN 'Stock Crítico'
        ELSE 'Disponible'
    END AS estado_stock,
    COALESCE(c.nombre, 'Sin categoría') AS categoria_nombre,
    COALESCE(u.nombre, 'Vendedor Principal') AS vendedor_nombre
FROM productos p
LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
LEFT JOIN usuarios u ON p.id_vendedor = u.id_usuario;</pre>
    </div>

    <!-- Vista 2 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>2. Vista: <code class="code-inline">vw_resumen_pedidos_ventas</code></span>
            <span class="tag-badge tag-view">Vista de Ventas</span>
        </div>
        <p><strong>Propósito:</strong> Consolida las órdenes de compra con la sumatoria de ítems, cantidad total de piezas adquiridas y datos de contacto del cliente para el panel de despachos.</p>
        <pre class="sql-code">CREATE OR REPLACE VIEW vw_resumen_pedidos_ventas AS
SELECT 
    pv.id_pedido, pv.fecha_pedido, pv.total, pv.estado,
    COALESCE(u.nombre, 'Cliente Mostrador') AS comprador_nombre,
    COALESCE(u.correo, 'N/D') AS comprador_correo,
    COUNT(dv.id_detalle) AS total_articulos,
    COALESCE(SUM(dv.cantidad), 0) AS unidades_totales
FROM pedidos_ventas pv
LEFT JOIN usuarios u ON pv.id_comprador = u.id_usuario
LEFT JOIN detalle_venta dv ON pv.id_pedido = dv.id_pedido
GROUP BY pv.id_pedido, pv.fecha_pedido, pv.total, pv.estado, u.nombre, u.correo;</pre>
    </div>

    <!-- Vista 3 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>3. Vista: <code class="code-inline">vw_alerta_stock_critico</code></span>
            <span class="tag-badge tag-view">Vista de Reabastecimiento</span>
        </div>
        <p><strong>Propósito:</strong> Filtra automáticamente los artículos que han alcanzado el umbral de reorden (&le; 5 unidades) y calcula el presupuesto de capital requerido para resurtirlos a 20 unidades.</p>
        <pre class="sql-code">CREATE OR REPLACE VIEW vw_alerta_stock_critico AS
SELECT 
    p.id_producto, p.titulo, p.stock, p.costo_unitario,
    COALESCE(c.nombre, 'General') AS categoria_nombre,
    (20 - p.stock) AS unidades_sugeridas_reorden,
    ROUND(((20 - p.stock) * p.costo_unitario), 2) AS costo_estimado_resurtido
FROM productos p
LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
WHERE p.stock <= 5;</pre>
    </div>

    <!-- Vista 4 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>4. Vista: <code class="code-inline">vw_metricas_vendedores</code></span>
            <span class="tag-badge tag-view">Vista Analítica KPI</span>
        </div>
        <p><strong>Propósito:</strong> Tablero de rendimiento comercial por vendedor que totaliza catálogo activo, existencias globales en bodega, facturación bruta acumulada y pedidos completados.</p>
        <pre class="sql-code">CREATE OR REPLACE VIEW vw_metricas_vendedores AS
SELECT 
    u.id_usuario AS id_vendedor, u.nombre AS vendedor_nombre, u.correo AS vendedor_correo,
    COUNT(DISTINCT p.id_producto) AS total_productos_catalogo,
    COALESCE(SUM(p.stock), 0) AS stock_total_almacenado,
    COALESCE(SUM(dv.subtotal), 0) AS facturacion_bruta_total,
    COUNT(DISTINCT dv.id_pedido) AS pedidos_atendidos
FROM usuarios u
LEFT JOIN productos p ON u.id_usuario = p.id_vendedor
LEFT JOIN detalle_venta dv ON p.id_producto = dv.id_producto
WHERE u.id_rol = 2 OR u.id_rol = 1
GROUP BY u.id_usuario, u.nombre, u.correo;</pre>
    </div>

    <!-- Vista 5 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>5. Vista: <code class="code-inline">vw_balance_financiero_tienda</code></span>
            <span class="tag-badge tag-view">Vista Financiera</span>
        </div>
        <p><strong>Propósito:</strong> Computa el estado financiero global contrastando ventas brutas, costo de mercancía vendida (COGS), utilidad bruta y deduciendo costos fijos de operación.</p>
        <pre class="sql-code">CREATE OR REPLACE VIEW vw_balance_financiero_tienda AS
SELECT 
    COALESCE(SUM(dv.subtotal), 0) AS ventas_totales_brutas,
    COALESCE(SUM(dv.cantidad * p.costo_unitario), 0) AS costo_mercancia_vendida,
    COALESCE(SUM(dv.subtotal), 0) - COALESCE(SUM(dv.cantidad * p.costo_unitario), 0) AS utilidad_bruta,
    (SELECT COALESCE(SUM(monto), 0) FROM costos_fijos) AS total_costos_fijos,
    (COALESCE(SUM(dv.subtotal), 0) - COALESCE(SUM(dv.cantidad * p.costo_unitario), 0)) - (SELECT COALESCE(SUM(monto), 0) FROM costos_fijos) AS utilidad_neta_estimada
FROM detalle_venta dv
JOIN productos p ON dv.id_producto = p.id_producto;</pre>
    </div>

    <!-- ============================================================ -->
    <!-- SECCIÓN 3: DISEÑO DE LOS 5 PROCEDIMIENTOS ALMACENADOS        -->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">3</span> Diseño de los 5 Procedimientos Almacenados (Procedures)</h1>

    <p>
        Los procedimientos almacenados en PostgreSQL se ejecutan con la instrucción <code class="code-inline">CALL</code> y 
        permiten manejar transacciones autónomas (<code class="code-inline">COMMIT</code>/<code class="code-inline">ROLLBACK</code>), 
        garantizando la atomicidad en operaciones de facturación e inventario.
    </p>

    <!-- Proc 1 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>1. Procedimiento: <code class="code-inline">sp_procesar_venta</code></span>
            <span class="tag-badge tag-proc">Transaccional ACID</span>
        </div>
        <p><strong>Propósito:</strong> Registra una venta garantizando que haya stock disponible, calcula el subtotal, inserta el renglón en <code class="code-inline">DETALLE_VENTA</code>, descuenta existencias en <code class="code-inline">PRODUCTOS</code> y actualiza el total en <code class="code-inline">PEDIDOS_VENTAS</code>.</p>
        <table class="param-table">
            <thead><tr><th>Parámetro</th><th>Modo</th><th>Tipo</th><th>Descripción</th></tr></thead>
            <tbody>
                <tr><td><code>p_id_pedido</code></td><td>IN</td><td>INT</td><td>ID de la orden de pedido cabecera.</td></tr>
                <tr><td><code>p_id_producto</code></td><td>IN</td><td>INT</td><td>ID del artículo adquirido.</td></tr>
                <tr><td><code>p_cantidad</code></td><td>IN</td><td>INT</td><td>Unidades físicas compradas.</td></tr>
                <tr><td><code>p_precio_unitario</code></td><td>IN</td><td>NUMERIC</td><td>Precio pactado en la transacción.</td></tr>
            </tbody>
        </table>
        <pre class="sql-code">CREATE OR REPLACE PROCEDURE sp_procesar_venta(
    p_id_pedido INT,
    p_id_producto INT,
    p_cantidad INT,
    p_precio_unitario NUMERIC
)
LANGUAGE plpgsql AS $$
DECLARE
    v_subtotal NUMERIC;
    v_stock_actual INT;
BEGIN
    SELECT stock INTO v_stock_actual FROM productos WHERE id_producto = p_id_producto;
    IF v_stock_actual IS NULL OR v_stock_actual < p_cantidad THEN
        RAISE EXCEPTION 'Stock insuficiente para el producto ID % (Disponible: %, Solicitado: %)', 
            p_id_producto, COALESCE(v_stock_actual, 0), p_cantidad;
    END IF;

    v_subtotal := ROUND(p_cantidad * p_precio_unitario, 2);
    
    INSERT INTO detalle_venta (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
    VALUES (p_id_pedido, p_id_producto, p_cantidad, p_precio_unitario, v_subtotal);
    
    UPDATE productos SET stock = stock - p_cantidad WHERE id_producto = p_id_producto;

    UPDATE pedidos_ventas
    SET total = (SELECT COALESCE(SUM(subtotal), 0) FROM detalle_venta WHERE id_pedido = p_id_pedido)
    WHERE id_pedido = p_id_pedido;
END;
$$;</pre>
    </div>

    <!-- Proc 2 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>2. Procedimiento: <code class="code-inline">sp_crear_pedido</code></span>
            <span class="tag-badge tag-proc">Gestión de Pedidos</span>
        </div>
        <p><strong>Propósito:</strong> Inicializa una nueva cabecera de pedido para un cliente determinado con fecha actual, total en $0.00 y estado inicial 'pendiente', devolviendo el ID autogenerado en un parámetro <code class="code-inline">INOUT</code>.</p>
        <pre class="sql-code">CREATE OR REPLACE PROCEDURE sp_crear_pedido(
    p_id_comprador INT,
    INOUT p_nuevo_pedido_id INT DEFAULT NULL
)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO pedidos_ventas (id_comprador, fecha_pedido, total, estado)
    VALUES (p_id_comprador, CURRENT_DATE, 0.00, 'pendiente')
    RETURNING id_pedido INTO p_nuevo_pedido_id;
END;
$$;</pre>
    </div>

    <!-- Proc 3 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>3. Procedimiento: <code class="code-inline">sp_actualizar_estado_pedido</code></span>
            <span class="tag-badge tag-proc">Control de Ciclo de Vida</span>
        </div>
        <p><strong>Propósito:</strong> Modifica el estatus de un pedido. En caso de cancelarse ('cancelado'), itera mediante un cursor sobre los renglones del pedido y restituye íntegramente las existencias al inventario de productos.</p>
        <pre class="sql-code">CREATE OR REPLACE PROCEDURE sp_actualizar_estado_pedido(
    p_id_pedido INT,
    p_nuevo_estado VARCHAR
)
LANGUAGE plpgsql AS $$
DECLARE
    r_item RECORD;
BEGIN
    IF LOWER(p_nuevo_estado) = 'cancelado' THEN
        FOR r_item IN SELECT id_producto, cantidad FROM detalle_venta WHERE id_pedido = p_id_pedido LOOP
            UPDATE productos
            SET stock = stock + r_item.cantidad
            WHERE id_producto = r_item.id_producto;
        END LOOP;
    END IF;

    UPDATE pedidos_ventas SET estado = p_nuevo_estado WHERE id_pedido = p_id_pedido;
END;
$$;</pre>
    </div>

    <!-- Proc 4 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>4. Procedimiento: <code class="code-inline">sp_reabastecer_stock</code></span>
            <span class="tag-badge tag-proc">Logística / Bodega</span>
        </div>
        <p><strong>Propósito:</strong> Permite ingresar lotes de reposición al almacén, incrementando el stock físico y actualizando opcionalmente el costo de compra unitario si se negocia un nuevo precio con el proveedor.</p>
        <pre class="sql-code">CREATE OR REPLACE PROCEDURE sp_reabastecer_stock(
    p_id_producto INT,
    p_cantidad_ingreso INT,
    p_nuevo_costo NUMERIC DEFAULT NULL
)
LANGUAGE plpgsql AS $$
BEGIN
    IF p_cantidad_ingreso <= 0 THEN
        RAISE EXCEPTION 'La cantidad de reabastecimiento debe ser mayor a 0.';
    END IF;

    UPDATE productos
    SET stock = stock + p_cantidad_ingreso,
        costo_unitario = CASE 
            WHEN p_nuevo_costo IS NOT NULL AND p_nuevo_costo > 0 THEN p_nuevo_costo 
            ELSE costo_unitario 
        END
    WHERE id_producto = p_id_producto;
END;
$$;</pre>
    </div>

    <!-- Proc 5 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>5. Procedimiento: <code class="code-inline">sp_depurar_intentos_otp</code></span>
            <span class="tag-badge tag-proc">Seguridad / 2FA</span>
        </div>
        <p><strong>Propósito:</strong> Restablece el contador de intentos fallidos de autenticación de dos factores (OTP) para rehabilitar cuentas temporalmente suspendidas tras el periodo de enfriamiento.</p>
        <pre class="sql-code">CREATE OR REPLACE PROCEDURE sp_depurar_intentos_otp(
    p_id_usuario INT DEFAULT NULL
)
LANGUAGE plpgsql AS $$
BEGIN
    IF p_id_usuario IS NOT NULL THEN
        UPDATE verificaciones_otp SET intentos_fallidos = 0 WHERE id_usuario = p_id_usuario;
    ELSE
        UPDATE verificaciones_otp SET intentos_fallidos = 0;
    END IF;
END;
$$;</pre>
    </div>

    <!-- ============================================================ -->
    <!-- SECCIÓN 4: DISEÑO DE LOS 5 TRIGGERS Y FUNCIONES             -->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">4</span> Diseño de los 5 Triggers (Disparadores) y Funciones Asociadas</h1>

    <p>
        Los disparadores garantizan el cumplimiento inquebrantable de las reglas de negocio e integridad referencial 
        directamente en el motor de base de datos, con independencia del cliente o framework que realice la petición.
    </p>

    <!-- Trigger 1 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>1. Trigger: <code class="code-inline">trg_evitar_stock_negativo</code> (Tabla: <code class="code-inline">productos</code>)</span>
            <span class="tag-badge tag-trig">Integridad de Stock</span>
        </div>
        <p><strong>Momento:</strong> <code class="code-inline">BEFORE INSERT OR UPDATE OF stock</code> | <strong>Nivel:</strong> <code class="code-inline">FOR EACH ROW</code></p>
        <p><strong>Propósito:</strong> Bloquea con <code class="code-inline">RAISE EXCEPTION</code> cualquier transacción que intente dejar el inventario en valores menores a cero.</p>
        <pre class="sql-code">CREATE OR REPLACE FUNCTION fn_trg_evitar_stock_negativo()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock < 0 THEN
        RAISE EXCEPTION 'Restricción de inventario violada: El stock del producto % no puede ser negativo (valor ingresado: %)', NEW.titulo, NEW.stock;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_evitar_stock_negativo
BEFORE INSERT OR UPDATE OF stock ON productos
FOR EACH ROW
EXECUTE FUNCTION fn_trg_evitar_stock_negativo();</pre>
    </div>

    <!-- Trigger 2 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>2. Trigger: <code class="code-inline">trg_actualizar_total_pedido</code> (Tabla: <code class="code-inline">detalle_venta</code>)</span>
            <span class="tag-badge tag-trig">Sincronización Automática</span>
        </div>
        <p><strong>Momento:</strong> <code class="code-inline">AFTER INSERT OR UPDATE OR DELETE</code> | <strong>Nivel:</strong> <code class="code-inline">FOR EACH ROW</code></p>
        <p><strong>Propósito:</strong> Recalcula de manera reactiva la columna <code class="code-inline">total</code> en la cabecera del pedido tras añadir, editar o remover renglones de compra.</p>
        <pre class="sql-code">CREATE OR REPLACE FUNCTION fn_trg_actualizar_total_pedido()
RETURNS TRIGGER AS $$
DECLARE
    v_pedido_id INT;
BEGIN
    v_pedido_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.id_pedido ELSE NEW.id_pedido END;

    UPDATE pedidos_ventas
    SET total = (SELECT COALESCE(SUM(subtotal), 0) FROM detalle_venta WHERE id_pedido = v_pedido_id)
    WHERE id_pedido = v_pedido_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_total_pedido
AFTER INSERT OR UPDATE OR DELETE ON detalle_venta
FOR EACH ROW
EXECUTE FUNCTION fn_trg_actualizar_total_pedido();</pre>
    </div>

    <!-- Trigger 3 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>3. Trigger: <code class="code-inline">trg_normalizar_correo_usuario</code> (Tabla: <code class="code-inline">usuarios</code>)</span>
            <span class="tag-badge tag-trig">Calidad de Datos</span>
        </div>
        <p><strong>Momento:</strong> <code class="code-inline">BEFORE INSERT OR UPDATE OF correo</code> | <strong>Nivel:</strong> <code class="code-inline">FOR EACH ROW</code></p>
        <p><strong>Propósito:</strong> Sanitiza las direcciones de correo electrónico convirtiéndolas a minúsculas y removiendo espacios accidentales antes del guardado persistente.</p>
        <pre class="sql-code">CREATE OR REPLACE FUNCTION fn_trg_normalizar_correo_usuario()
RETURNS TRIGGER AS $$
BEGIN
    NEW.correo := LOWER(TRIM(NEW.correo));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_normalizar_correo_usuario
BEFORE INSERT OR UPDATE OF correo ON usuarios
FOR EACH ROW
EXECUTE FUNCTION fn_trg_normalizar_correo_usuario();</pre>
    </div>

    <!-- Trigger 4 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>4. Trigger: <code class="code-inline">trg_validar_precios_coherentes</code> (Tabla: <code class="code-inline">productos</code>)</span>
            <span class="tag-badge tag-trig">Regla Comercial</span>
        </div>
        <p><strong>Momento:</strong> <code class="code-inline">BEFORE INSERT OR UPDATE OF precio, costo_unitario</code> | <strong>Nivel:</strong> <code class="code-inline">FOR EACH ROW</code></p>
        <p><strong>Propósito:</strong> Protege la rentabilidad impidiendo que un producto sea registrado con precio negativo o con precio de venta inferior a su costo de adquisición.</p>
        <pre class="sql-code">CREATE OR REPLACE FUNCTION fn_trg_validar_precios_coherentes()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.precio < 0 THEN
        RAISE EXCEPTION 'El precio de venta no puede ser negativo: %', NEW.precio;
    END IF;
    
    IF NEW.costo_unitario IS NOT NULL AND NEW.precio < NEW.costo_unitario THEN
        RAISE EXCEPTION 'Alerta comercial: El precio ($%) no puede ser inferior al costo unitario ($%) en el producto %', 
            NEW.precio, NEW.costo_unitario, NEW.titulo;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_precios_coherentes
BEFORE INSERT OR UPDATE OF precio, costo_unitario ON productos
FOR EACH ROW
EXECUTE FUNCTION fn_trg_validar_precios_coherentes();</pre>
    </div>

    <!-- Trigger 5 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>5. Trigger: <code class="code-inline">trg_auditar_agotamiento_stock</code> (Tabla: <code class="code-inline">productos</code>)</span>
            <span class="tag-badge tag-trig">Monitoreo / Notificación</span>
        </div>
        <p><strong>Momento:</strong> <code class="code-inline">AFTER UPDATE OF stock</code> | <strong>Nivel:</strong> <code class="code-inline">FOR EACH ROW</code></p>
        <p><strong>Propósito:</strong> Detecta el instante exacto en que un producto agota sus existencias (transición de stock &gt; 0 a 0) emitiendo una notificación formal para el reabastecimiento.</p>
        <pre class="sql-code">CREATE OR REPLACE FUNCTION fn_trg_auditar_agotamiento_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.stock > 0 AND NEW.stock = 0 THEN
        RAISE NOTICE 'ALERTA DE AGOTAMIENTO: El producto ID % (%) ha llegado a existencia cero.', 
            NEW.id_producto, NEW.titulo;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auditar_agotamiento_stock
AFTER UPDATE OF stock ON productos
FOR EACH ROW
EXECUTE FUNCTION fn_trg_auditar_agotamiento_stock();</pre>
    </div>

    <!-- ============================================================ -->
    <!-- SECCIÓN 5: DISEÑO DE LAS 5 FUNCIONES (FUNCTIONS)             -->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">5</span> Diseño de las 5 Funciones (Functions)</h1>

    <p>
        A diferencia de los procedimientos, las funciones en PL/pgSQL retornan un valor determinista (escalar o conjunto de registros) 
        y pueden ser embebidas directamente dentro de sentencias <code class="code-inline">SELECT</code>, cláusulas <code class="code-inline">WHERE</code> y filtros.
    </p>

    <!-- Función 1 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>1. Función: <code class="code-inline">fn_validar_stock_disponible(INT, INT)</code></span>
            <span class="tag-badge tag-func">Función Booleana</span>
        </div>
        <p><strong>Retorno:</strong> <code class="code-inline">BOOLEAN</code> | <strong>Parámetros:</strong> <code class="code-inline">p_id_producto INT, p_cantidad INT</code></p>
        <p><strong>Propósito:</strong> Determina de forma rápida si el inventario puede cubrir un pedido previo a abrir transacciones pesadas.</p>
        <pre class="sql-code">CREATE OR REPLACE FUNCTION fn_validar_stock_disponible(p_id_producto INT, p_cantidad INT)
RETURNS BOOLEAN AS $$
DECLARE
    v_stock INT;
BEGIN
    SELECT stock INTO v_stock FROM productos WHERE id_producto = p_id_producto;
    IF v_stock IS NULL THEN RETURN FALSE; END IF;
    RETURN v_stock >= p_cantidad;
END;
$$ LANGUAGE plpgsql;</pre>
    </div>

    <!-- Función 2 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>2. Función: <code class="code-inline">fn_calcular_subtotal_producto(INT, INT)</code></span>
            <span class="tag-badge tag-func">Función Escalar Monetaria</span>
        </div>
        <p><strong>Retorno:</strong> <code class="code-inline">NUMERIC</code> | <strong>Parámetros:</strong> <code class="code-inline">p_id_producto INT, p_cantidad INT</code></p>
        <p><strong>Propósito:</strong> Obtiene el precio vigente de catálogo y calcula el importe monetario correspondiente a la cantidad solicitada.</p>
        <pre class="sql-code">CREATE OR REPLACE FUNCTION fn_calcular_subtotal_producto(p_id_producto INT, p_cantidad INT)
RETURNS NUMERIC AS $$
DECLARE
    v_precio NUMERIC;
BEGIN
    SELECT precio INTO v_precio FROM productos WHERE id_producto = p_id_producto;
    IF v_precio IS NULL THEN RETURN 0.00; END IF;
    RETURN ROUND(v_precio * p_cantidad, 2);
END;
$$ LANGUAGE plpgsql;</pre>
    </div>

    <!-- Función 3 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>3. Función: <code class="code-inline">fn_calcular_margen_ganancia(NUMERIC, NUMERIC)</code></span>
            <span class="tag-badge tag-func">Función Matemática</span>
        </div>
        <p><strong>Retorno:</strong> <code class="code-inline">NUMERIC</code> | <strong>Parámetros:</strong> <code class="code-inline">p_precio NUMERIC, p_costo NUMERIC</code></p>
        <p><strong>Propósito:</strong> Evalúa la tasa porcentual de ganancia bruta sobre el precio de venta evitando divisiones entre cero.</p>
        <pre class="sql-code">CREATE OR REPLACE FUNCTION fn_calcular_margen_ganancia(p_precio NUMERIC, p_costo NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
    IF p_precio IS NULL OR p_precio <= 0 THEN RETURN 0.00; END IF;
    RETURN ROUND(((p_precio - COALESCE(p_costo, 0)) / p_precio) * 100, 2);
END;
$$ LANGUAGE plpgsql;</pre>
    </div>

    <!-- Función 4 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>4. Función: <code class="code-inline">fn_total_ventas_vendedor(INT)</code></span>
            <span class="tag-badge tag-func">Función de Agregación</span>
        </div>
        <p><strong>Retorno:</strong> <code class="code-inline">NUMERIC</code> | <strong>Parámetros:</strong> <code class="code-inline">p_id_vendedor INT</code></p>
        <p><strong>Propósito:</strong> Calcula el acumulado histórico de ventas liquidadas para liquidaciones o comisiones de un vendedor específico.</p>
        <pre class="sql-code">CREATE OR REPLACE FUNCTION fn_total_ventas_vendedor(p_id_vendedor INT)
RETURNS NUMERIC AS $$
DECLARE
    v_total NUMERIC;
BEGIN
    SELECT COALESCE(SUM(dv.subtotal), 0) INTO v_total
    FROM detalle_venta dv
    JOIN productos p ON dv.id_producto = p.id_producto
    WHERE p.id_vendedor = p_id_vendedor;
    
    RETURN v_total;
END;
$$ LANGUAGE plpgsql;</pre>
    </div>

    <!-- Función 5 -->
    <div class="avoid-break">
        <div class="object-title">
            <span>5. Función: <code class="code-inline">fn_consultar_pedidos_cliente(INT)</code></span>
            <span class="tag-badge tag-func">Función de Conjunto / Tabla</span>
        </div>
        <p><strong>Retorno:</strong> <code class="code-inline">TABLE(id_pedido INT, fecha_pedido DATE, total NUMERIC, estado VARCHAR, articulos_distintos BIGINT)</code></p>
        <p><strong>Propósito:</strong> Retorna el historial estructurado de compras de un usuario para su perfil o la aplicación móvil.</p>
        <pre class="sql-code">CREATE OR REPLACE FUNCTION fn_consultar_pedidos_cliente(p_id_comprador INT)
RETURNS TABLE (
    id_pedido INT,
    fecha_pedido DATE,
    total NUMERIC,
    estado VARCHAR,
    articulos_distintos BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pv.id_pedido, pv.fecha_pedido, pv.total, pv.estado,
        COUNT(dv.id_detalle) AS articulos_distintos
    FROM pedidos_ventas pv
    LEFT JOIN detalle_venta dv ON pv.id_pedido = dv.id_pedido
    WHERE pv.id_comprador = p_id_comprador
    GROUP BY pv.id_pedido, pv.fecha_pedido, pv.total, pv.estado
    ORDER BY pv.fecha_pedido DESC;
END;
$$ LANGUAGE plpgsql;</pre>
    </div>

    <!-- ============================================================ -->
    <!-- SECCIÓN 6: MATRIZ DE TRAZABILIDAD Y MODELO ERD               -->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">6</span> Matriz de Trazabilidad y Modelo Entidad-Relación</h1>

    <p>
        La siguiente matriz de impacto ilustra la relación bidireccional entre las tablas principales del modelo relacional de 
        LocalMarket y los objetos avanzados implementados:
    </p>

    <table class="param-table">
        <thead>
            <tr>
                <th style="width: 25%;">Tabla del Sistema</th>
                <th style="width: 25%;">Vistas Vinculadas</th>
                <th style="width: 25%;">Procedimientos</th>
                <th style="width: 25%;">Triggers & Funciones</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>PRODUCTOS</strong></td>
                <td><code>vw_catalogo_productos_detallado</code><br><code>vw_alerta_stock_critico</code></td>
                <td><code>sp_procesar_venta</code><br><code>sp_reabastecer_stock</code></td>
                <td><code>trg_evitar_stock_negativo</code><br><code>trg_validar_precios_coherentes</code><br><code>trg_auditar_agotamiento_stock</code></td>
            </tr>
            <tr>
                <td><strong>PEDIDOS_VENTAS</strong></td>
                <td><code>vw_resumen_pedidos_ventas</code></td>
                <td><code>sp_crear_pedido</code><br><code>sp_actualizar_estado_pedido</code></td>
                <td>Actualizada reactivamente por <code>trg_actualizar_total_pedido</code></td>
            </tr>
            <tr>
                <td><strong>DETALLE_VENTA</strong></td>
                <td><code>vw_resumen_pedidos_ventas</code><br><code>vw_balance_financiero_tienda</code></td>
                <td><code>sp_procesar_venta</code></td>
                <td><code>trg_actualizar_total_pedido</code><br><code>fn_calcular_subtotal_producto</code></td>
            </tr>
            <tr>
                <td><strong>USUARIOS</strong></td>
                <td><code>vw_metricas_vendedores</code></td>
                <td><code>sp_crear_pedido</code></td>
                <td><code>trg_normalizar_correo_usuario</code><br><code>fn_total_ventas_vendedor</code></td>
            </tr>
            <tr>
                <td><strong>VERIFICACIONES_OTP</strong></td>
                <td>Auditoría interna de seguridad</td>
                <td><code>sp_depurar_intentos_otp</code></td>
                <td>Control de tokens de doble factor</td>
            </tr>
        </tbody>
    </table>

    <h2 class="subsection-title">Diagrama Entidad-Relación de Soporte</h2>
    <div class="img-container">
        <img src="${imgDiagramaERD}" alt="Diagrama ERD LocalMarket">
        <div class="img-caption">Figura 3. Esquema Entidad-Relación (13 tablas) base para la implementación de los objetos en PostgreSQL.</div>
    </div>

    <!-- ============================================================ -->
    <!-- SECCIÓN 7: CONCLUSIÓN Y RESUMEN TÉCNICO                      -->
    <!-- ============================================================ -->
    <div class="avoid-break" style="margin-top: 15px;">
        <h1 class="section-title"><span class="number">7</span> Conclusiones y Validación en Entorno de Producción</h1>
        <p>
            La incorporación de estas <strong>5 vistas, 5 procedimientos, 5 triggers y 5 funciones</strong> eleva la base de datos de 
            <strong>LocalMarket</strong> a un estándar profesional de nivel empresarial:
        </p>
        <ul style="margin-left: 20px; font-size: 8.5pt; color: #334155; line-height: 1.6;">
            <li><strong>Desacoplamiento y Rendimiento:</strong> La lógica de descuento de inventario, cálculo de subtotales y validación de correos se procesa en microsegundos dentro del propio motor C/C++ de PostgreSQL, aligerando la carga del servidor Node.js.</li>
            <li><strong>Blindaje Transaccional:</strong> Los triggers impiden estados inconsistentes como stocks negativos o márgenes comerciales negativos sin importar si la inserción proviene de la API REST, de un script externo o de una consulta manual.</li>
            <li><strong>Código Fuente Disponible:</strong> El script SQL unificado se encuentra archivado en el proyecto como <code class="code-inline">scripts/objetos_bd.sql</code>, listo para despliegues automatizados mediante CI/CD.</li>
        </ul>
    </div>

</body>
</html>
`;

// Guardar documento HTML
const htmlFilePath = path.join(__dirname, '..', 'Diseno_Objetos_BD_LocalMarket.html');
fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log('HTML generado exitosamente en:', htmlFilePath);

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
const pdfDownloadsPath = path.join(downloadsDir, 'Diseno_Objetos_BD_LocalMarket.pdf');
const pdfLocalPath = path.join(__dirname, '..', 'Diseno_Objetos_BD_LocalMarket.pdf');

try {
    const cmdLocal = `"${selectedEdge}" --headless --disable-gpu --print-to-pdf="${pdfLocalPath}" --no-pdf-header-footer "${htmlFilePath}"`;
    console.log('Compilando PDF profesional...');
    execSync(cmdLocal);

    // Copiar a Downloads
    fs.copyFileSync(pdfLocalPath, pdfDownloadsPath);

    const stats = fs.statSync(pdfDownloadsPath);
    console.log(`\n======================================================`);
    console.log(`✅ PDF GENERADO Y GUARDADO EXITOSAMENTE`);
    console.log(`======================================================`);
    console.log(`📁 En Descargas: ${pdfDownloadsPath} (${(stats.size / 1024).toFixed(2)} KB)`);
    console.log(`📁 En Proyecto:  ${pdfLocalPath}`);
} catch (err) {
    console.error('❌ Error al compilar PDF:', err.message);
    process.exit(1);
}
