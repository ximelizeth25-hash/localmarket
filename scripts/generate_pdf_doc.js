const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const imagePath = path.join(__dirname, '..', 'diagrama_bd_proyecto7.png');
let imageBase64 = '';
if (fs.existsSync(imagePath)) {
    const imgBuffer = fs.readFileSync(imagePath);
    imageBase64 = `data:image/png;base64,${imgBuffer.toString('base64')}`;
}

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Documento de Arquitectura y Base de Datos - Proyecto 7</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;600&display=swap');

        @page {
            size: A4 portrait;
            margin: 1.8cm 1.5cm 1.8cm 1.5cm;
            @bottom-right {
                content: counter(page);
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
            line-height: 1.55;
            font-size: 10pt;
        }

        /* Utilidades de salto de página */
        .page-break {
            page-break-before: always;
            break-before: page;
        }

        .avoid-break {
            page-break-inside: avoid;
            break-inside: avoid;
        }

        /* Portada */
        .cover-page {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 2.5cm 1cm 1.5cm 1cm;
            border-left: 8px solid #0f172a;
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        }

        .cover-header {
            margin-bottom: 2cm;
        }

        .badge-category {
            display: inline-block;
            background-color: #0ea5e9;
            color: #ffffff;
            font-size: 9pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            padding: 6px 14px;
            border-radius: 6px;
            margin-bottom: 1.2cm;
        }

        .cover-title {
            font-size: 26pt;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.2;
            margin-bottom: 12px;
        }

        .cover-subtitle {
            font-size: 14pt;
            color: #64748b;
            font-weight: 500;
            line-height: 1.4;
        }

        .cover-meta {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            margin-bottom: 2cm;
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
            color: #94a3b8;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
        }

        .meta-item p {
            font-size: 10.5pt;
            font-weight: 600;
            color: #1e293b;
        }

        .cover-footer {
            border-top: 1px solid #cbd5e1;
            padding-top: 14px;
            display: flex;
            justify-content: space-between;
            font-size: 8.5pt;
            color: #64748b;
        }

        /* Encabezados de secciones */
        h1.section-title {
            font-size: 16pt;
            font-weight: 800;
            color: #0f172a;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 6px;
            margin-top: 24px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
        }

        h1.section-title span.number {
            background-color: #0f172a;
            color: #ffffff;
            font-size: 11pt;
            width: 24px;
            height: 24px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            margin-right: 10px;
        }

        h2.subsection-title {
            font-size: 12pt;
            font-weight: 700;
            color: #1e293b;
            margin-top: 16px;
            margin-bottom: 10px;
            border-left: 4px solid #0ea5e9;
            padding-left: 8px;
        }

        h3.table-heading {
            font-size: 10.5pt;
            font-weight: 700;
            color: #0f172a;
            margin-top: 14px;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        p {
            margin-bottom: 10px;
            text-align: justify;
            color: #334155;
        }

        /* Cajas de Información y Callouts */
        .callout {
            background-color: #f8fafc;
            border-left: 4px solid #3b82f6;
            border-radius: 0 8px 8px 0;
            padding: 12px 16px;
            margin: 12px 0;
            font-size: 9pt;
        }

        .callout-title {
            font-weight: 700;
            color: #1d4ed8;
            margin-bottom: 4px;
            font-size: 9.5pt;
        }

        .tech-box {
            background-color: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 14px;
            margin-bottom: 14px;
        }

        .tech-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-top: 10px;
        }

        .tech-card {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px 12px;
        }

        .tech-card h4 {
            font-size: 9.5pt;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 4px;
        }

        .tech-card p {
            font-size: 8.5pt;
            color: #64748b;
            margin-bottom: 0;
            text-align: left;
        }

        /* Tablas de Datos */
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8pt;
            margin-bottom: 14px;
            background-color: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            overflow: hidden;
        }

        table.data-table th {
            background-color: #0f172a;
            color: #ffffff;
            text-align: left;
            padding: 6px 8px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            font-size: 7.5pt;
        }

        table.data-table td {
            padding: 5px 8px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
            vertical-align: middle;
        }

        table.data-table tr:nth-child(even) {
            background-color: #f8fafc;
        }

        table.data-table tr:last-child td {
            border-bottom: none;
        }

        /* Badges para Tipos de Llaves */
        .badge-pk {
            background-color: #dbeafe;
            color: #1e40af;
            font-weight: 700;
            font-size: 7pt;
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid #93c5fd;
            display: inline-block;
        }

        .badge-fk {
            background-color: #fef3c7;
            color: #92400e;
            font-weight: 700;
            font-size: 7pt;
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid #fde68a;
            display: inline-block;
        }

        .badge-nn {
            background-color: #fee2e2;
            color: #991b1b;
            font-weight: 700;
            font-size: 7pt;
            padding: 2px 5px;
            border-radius: 4px;
            display: inline-block;
        }

        .code-font {
            font-family: 'Fira Code', monospace;
            font-size: 7.8pt;
            color: #0f172a;
            font-weight: 600;
        }

        /* Bloques de Código */
        pre.sql-block {
            background-color: #0f172a;
            color: #f8fafc;
            padding: 10px 14px;
            border-radius: 6px;
            font-family: 'Fira Code', monospace;
            font-size: 7.5pt;
            line-height: 1.45;
            margin: 8px 0 12px 0;
            overflow-x: auto;
            border-left: 4px solid #0ea5e9;
        }

        /* Imagen del Diagrama */
        .diagram-container {
            text-align: center;
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 10px;
            margin: 12px 0 16px 0;
        }

        .diagram-container img {
            max-width: 100%;
            height: auto;
            max-height: 480px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        }

        .diagram-caption {
            font-size: 8pt;
            color: #64748b;
            font-style: italic;
            margin-top: 6px;
        }

        /* Lista de Viñetas */
        ul.custom-list {
            margin-left: 18px;
            margin-bottom: 12px;
            font-size: 9pt;
            color: #334155;
        }

        ul.custom-list li {
            margin-bottom: 4px;
        }

        /* Matriz de Roles */
        table.matrix-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8pt;
            margin: 10px 0;
        }

        table.matrix-table th, table.matrix-table td {
            border: 1px solid #cbd5e1;
            padding: 6px 10px;
            text-align: center;
        }

        table.matrix-table th {
            background-color: #1e293b;
            color: #ffffff;
        }

        table.matrix-table td:first-child {
            text-align: left;
            font-weight: 600;
        }

        .check-yes { color: #16a34a; font-weight: bold; font-size: 10pt; }
        .check-no { color: #dc2626; font-weight: bold; font-size: 10pt; }
    </style>
</head>
<body>

    <!-- ============================================================ -->
    <!-- PORTADA DEL DOCUMENTO                                        -->
    <!-- ============================================================ -->
    <div class="cover-page">
        <div class="cover-header">
            <span class="badge-category">Especificación de Arquitectura de Datos</span>
            <h1 class="cover-title">Modelado y Diseño de Base de Datos Relacional</h1>
            <p class="cover-subtitle">Plataforma E-Commerce Multi-Rol y Gestión SaaS "LocalMarket" (Proyecto 7)</p>
        </div>

        <div class="cover-meta">
            <div class="meta-grid">
                <div class="meta-item">
                    <label>Sistema Gestor de Base de Datos</label>
                    <p>PostgreSQL 15 / 16 (Relacional - ACID)</p>
                </div>
                <div class="meta-item">
                    <label>Lenguaje & Entorno de Backend</label>
                    <p>JavaScript Moderno (ES6+) / Node.js & Express</p>
                </div>
                <div class="meta-item">
                    <label>Base de Datos & Conexión</label>
                    <p>proyecto7 en localhost:5432 (Driver pg)</p>
                </div>
                <div class="meta-item">
                    <label>Arquitectura de Seguridad</label>
                    <p>RBAC Granular + Validación OTP 2FA</p>
                </div>
                <div class="meta-item">
                    <label>Total de Entidades</label>
                    <p>13 Tablas Normalizadas (3FN)</p>
                </div>
                <div class="meta-item">
                    <label>Versión del Documento</label>
                    <p>v2.0 (Producción / Verificado)</p>
                </div>
            </div>
        </div>

        <div class="cover-footer">
            <span>LocalMarket SaaS &copy; 2026 - Documentación Técnica Oficial</span>
            <span>Fecha de Emisión: Octubre 2026</span>
        </div>
    </div>

    <!-- ============================================================ -->
    <!-- SECCIÓN 1: INTRODUCCIÓN Y GESTOR DE BASE DE DATOS (POSTGRESQL)-->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">1</span> Descripción y Justificación del Gestor de Base de Datos</h1>

    <p>
        Para la implementación y persistencia del sistema <strong>LocalMarket (Proyecto 7)</strong>, se ha seleccionado 
        <strong>PostgreSQL</strong> como Sistema Gestor de Base de Datos Relacional Orientado a Objetos (ORDBMS). 
        PostgreSQL es ampliamente reconocido en la industria por su robustez, estricto cumplimiento de estándares SQL, 
        integridad referencial avanzada y capacidad de soportar cargas transaccionales complejas de comercio electrónico.
    </p>

    <div class="callout">
        <div class="callout-title">Ficha Técnica del SGBD:</div>
        <strong>Motor:</strong> PostgreSQL versión 15 / 16 | <strong>Dialecto:</strong> PL/pgSQL | <strong>Base de Datos:</strong> proyecto7 | <strong>Puerto por defecto:</strong> 5432
    </div>

    <h2 class="subsection-title">Justificación de la Elección de PostgreSQL</h2>

    <div class="tech-grid">
        <div class="tech-card">
            <h4>1. Cumplimiento Estricto de Propiedades ACID</h4>
            <p>
                Garantiza <em>Atomicidad, Consistencia, Aislamiento y Durabilidad</em> en todas las operaciones críticas. 
                Al procesar una compra directa, la generación del pedido, la inserción del detalle y la reducción del inventario 
                se ejecutan en una sola transacción sin inconsistencias.
            </p>
        </div>
        <div class="tech-card">
            <h4>2. Control de Concurrencia Multiversión (MVCC)</h4>
            <p>
                Permite que múltiples clientes consulten el catálogo de productos y lean métricas concurrentemente sin 
                bloquear las escrituras o actualizaciones de inventario efectuadas por los vendedores.
            </p>
        </div>
        <div class="tech-card">
            <h4>3. Programabilidad Avanzada (PL/pgSQL)</h4>
            <p>
                Soporte nativo para <strong>Triggers</strong> (disparadores para evitar stock negativo), 
                <strong>Funciones Almacenadas</strong> (validación de disponibilidad) y <strong>Vistas</strong> 
                optimizadas para reportes gerenciales.
            </p>
        </div>
        <div class="tech-card">
            <h4>4. Integridad Referencial y Tipado Fuerte</h4>
            <p>
                Validaciones estrictas de claves foráneas con reglas de eliminación/actualización en cascada o restricción, 
                tipos de datos precisos para valores monetarios (<code class="code-font">numeric(12,2)</code>) y timestamps sin desfase.
            </p>
        </div>
    </div>

    <!-- ============================================================ -->
    <!-- SECCIÓN 2: LENGUAJE DE PROGRAMACIÓN Y STACK TECNOLÓGICO     -->
    <!-- ============================================================ -->
    <h1 class="section-title"><span class="number">2</span> Descripción y Justificación del Lenguaje de Programación</h1>

    <p>
        El ecosistema de desarrollo de LocalMarket está construido sobre una arquitectura <strong>Full-Stack JavaScript</strong>, 
        utilizando <strong>Node.js</strong> en el servidor y <strong>JavaScript Moderno (ES6+)</strong> en el cliente, comunicados mediante una API RESTful en formato JSON.
    </p>

    <div class="tech-box">
        <h3 style="font-size: 10pt; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Arquitectura Tecnológica del Stack:</h3>
        <ul class="custom-list">
            <li><strong>Entorno de Ejecución Backend:</strong> Node.js (V8 Engine) - E/S Asíncrona no bloqueante basada en eventos.</li>
            <li><strong>Framework Web HTTP:</strong> Express.js - Enrutamiento modular por dominios de negocio (<code class="code-font">routes/</code>).</li>
            <li><strong>Controlador de Conexión a BD:</strong> Driver <code class="code-font">pg</code> (node-postgres) con <em>Connection Pooling</em> parametrizado para evitar inyecciones SQL.</li>
            <li><strong>Frontend & UI:</strong> HTML5 Semántico, Tailwind CSS (diseño responsivo de alto rendimiento), Vanilla JS reactivo.</li>
        </ul>
    </div>

    <h2 class="subsection-title">Ventajas de la Integración Node.js + PostgreSQL</h2>
    <ul class="custom-list">
        <li><strong>Unificación de Lenguaje:</strong> Permite compartir esquemas de validación (expresiones regulares de correo electrónico, validación de 10 dígitos telefónicos) entre frontend y backend sin duplicidad.</li>
        <li><strong>Pool de Conexiones Optimizado:</strong> La clase <code class="code-font">Pool</code> de <code class="code-font">pg</code> administra eficientemente las conexiones abiertas hacia PostgreSQL, reutilizándolas y evitando el costo de inicialización por cada petición.</li>
        <li><strong>Consultas Parametrizadas:</strong> Todas las consultas SQL implementan sintaxis con marcadores de posición (<code class="code-font">$1, $2, $3</code>), mitigando al 100% ataques de inyección SQL.</li>
    </ul>

    <!-- ============================================================ -->
    <!-- SECCIÓN 3: DIAGRAMA ENTIDAD-RELACIÓN (ERD) GENERAL          -->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">3</span> Diagrama Entidad-Relación (ERD) General</h1>

    <p>
        El esquema relacional de <strong>LocalMarket</strong> está compuesto por <strong>13 entidades</strong> normalizadas en 
        Tercera Forma Normal (3FN), garantizando la no redundancia de datos y una relación lógica coherente entre los 
        módulos de Autenticación, Catálogo, Transacciones, Seguridad y Moderación.
    </p>

    <div class="diagram-container">
        ${imageBase64 ? `<img src="${imageBase64}" alt="Diagrama Entidad-Relación LocalMarket">` : '<p style="color: #64748b;">[Diagrama ERD no disponible]</p>'}
        <div class="diagram-caption">Figura 1. Modelo Entidad-Relación (ERD) de la base de datos "proyecto7" implementada en PostgreSQL.</div>
    </div>

    <h2 class="subsection-title">Módulos Funcionales del Modelo de Datos</h2>
    <div class="tech-grid">
        <div class="tech-card">
            <h4>A. Usuarios, Roles y Seguridad</h4>
            <p><code class="code-font">ROLES</code>, <code class="code-font">PERMISOS</code>, <code class="code-font">ROLES_PERMISOS</code>, <code class="code-font">USUARIOS</code>, <code class="code-font">VERIFICACIONES_OTP_SEGURIDAD</code>, <code class="code-font">DIRECCIONES_ENTREGA</code>.</p>
        </div>
        <div class="tech-card">
            <h4>B. Catálogo, Productos y Preguntas</h4>
            <p><code class="code-font">CATEGORIAS</code>, <code class="code-font">PRODUCTOS</code>, <code class="code-font">PREGUNTAS_PRODUCTO</code>.</p>
        </div>
        <div class="tech-card">
            <h4>C. Ventas, Pedidos y Cobros</h4>
            <p><code class="code-font">METODOS_PAGO</code>, <code class="code-font">PEDIDOS_VENTAS</code>, <code class="code-font">DETALLE_VENTA</code>.</p>
        </div>
        <div class="tech-card">
            <h4>D. Finanzas y Control Operativo</h4>
            <p><code class="code-font">COSTOS_FIJOS</code> (gestión de egresos del vendedor para balance financiero).</p>
        </div>
    </div>

    <!-- ============================================================ -->
    <!-- SECCIÓN 4: DICCIONARIO DE DATOS DETALLADO (13 TABLAS)        -->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">4</span> Diccionario de Datos Detallado</h1>

    <!-- 1. ROLES -->
    <div class="avoid-break">
        <h3 class="table-heading">
            <span>1. Tabla: <code class="code-font" style="color: #0284c7; font-size: 10pt;">ROLES</code></span>
            <span style="font-size: 8pt; color: #64748b; font-weight: normal;">Catálogo de roles del sistema (RBAC)</span>
        </h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 22%;">Campo</th>
                    <th style="width: 22%;">Tipo de Dato</th>
                    <th style="width: 14%;">Restricción</th>
                    <th style="width: 18%;">Default</th>
                    <th style="width: 24%;">Descripción</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code class="code-font">id_rol</code></td>
                    <td><span class="code-font">SERIAL / INT</span></td>
                    <td><span class="badge-pk">PK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>Autoincremental</td>
                    <td>Identificador único del rol.</td>
                </tr>
                <tr>
                    <td><code class="code-font">nombre_rol</code></td>
                    <td><span class="code-font">VARCHAR(100)</span></td>
                    <td><span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Nombre del rol (Admin, Vendedor, Cliente).</td>
                </tr>
                <tr>
                    <td><code class="code-font">descripcion</code></td>
                    <td><span class="code-font">VARCHAR(255)</span></td>
                    <td>NULL</td>
                    <td>-</td>
                    <td>Descripción de responsabilidades del rol.</td>
                </tr>
                <tr>
                    <td><code class="code-font">fecha_creacion</code></td>
                    <td><span class="code-font">TIMESTAMP</span></td>
                    <td>NULL</td>
                    <td><code class="code-font">CURRENT_TIMESTAMP</code></td>
                    <td>Fecha y hora de alta del registro.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- 2. PERMISOS -->
    <div class="avoid-break">
        <h3 class="table-heading">
            <span>2. Tabla: <code class="code-font" style="color: #0284c7; font-size: 10pt;">PERMISOS</code></span>
            <span style="font-size: 8pt; color: #64748b; font-weight: normal;">Catálogo de acciones y privilegios modulares</span>
        </h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 22%;">Campo</th>
                    <th style="width: 22%;">Tipo de Dato</th>
                    <th style="width: 14%;">Restricción</th>
                    <th style="width: 18%;">Default</th>
                    <th style="width: 24%;">Descripción</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code class="code-font">id_permiso</code></td>
                    <td><span class="code-font">SERIAL / INT</span></td>
                    <td><span class="badge-pk">PK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>Autoincremental</td>
                    <td>Identificador único del permiso.</td>
                </tr>
                <tr>
                    <td><code class="code-font">nombre_permiso</code></td>
                    <td><span class="code-font">VARCHAR(100)</span></td>
                    <td><span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Clave textual del privilegio.</td>
                </tr>
                <tr>
                    <td><code class="code-font">descripcion</code></td>
                    <td><span class="code-font">VARCHAR(255)</span></td>
                    <td>NULL</td>
                    <td>-</td>
                    <td>Detalle del alcance del permiso.</td>
                </tr>
                <tr>
                    <td><code class="code-font">modulo</code></td>
                    <td><span class="code-font">VARCHAR(100)</span></td>
                    <td>NULL</td>
                    <td>-</td>
                    <td>Módulo asociado (Productos, Pedidos, etc.).</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- 3. ROLES_PERMISOS -->
    <div class="avoid-break">
        <h3 class="table-heading">
            <span>3. Tabla: <code class="code-font" style="color: #0284c7; font-size: 10pt;">ROLES_PERMISOS</code></span>
            <span style="font-size: 8pt; color: #64748b; font-weight: normal;">Tabla pivote muchos-a-muchos (M:N) Roles y Permisos</span>
        </h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 22%;">Campo</th>
                    <th style="width: 22%;">Tipo de Dato</th>
                    <th style="width: 14%;">Restricción</th>
                    <th style="width: 18%;">Default</th>
                    <th style="width: 24%;">Descripción</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code class="code-font">id_rol</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td><span class="badge-pk">PK</span> <span class="badge-fk">FK</span></td>
                    <td>-</td>
                    <td>Referencia a <code class="code-font">ROLES(id_rol)</code>.</td>
                </tr>
                <tr>
                    <td><code class="code-font">id_permiso</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td><span class="badge-pk">PK</span> <span class="badge-fk">FK</span></td>
                    <td>-</td>
                    <td>Referencia a <code class="code-font">PERMISOS(id_permiso)</code>.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- 4. USUARIOS -->
    <div class="avoid-break">
        <h3 class="table-heading">
            <span>4. Tabla: <code class="code-font" style="color: #0284c7; font-size: 10pt;">USUARIOS</code></span>
            <span style="font-size: 8pt; color: #64748b; font-weight: normal;">Entidad central de cuentas de usuario</span>
        </h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 22%;">Campo</th>
                    <th style="width: 22%;">Tipo de Dato</th>
                    <th style="width: 14%;">Restricción</th>
                    <th style="width: 18%;">Default</th>
                    <th style="width: 24%;">Descripción</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code class="code-font">id_usuario</code></td>
                    <td><span class="code-font">SERIAL / INT</span></td>
                    <td><span class="badge-pk">PK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>Autoincremental</td>
                    <td>Identificador único del usuario.</td>
                </tr>
                <tr>
                    <td><code class="code-font">id_rol</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td><span class="badge-fk">FK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>3 (Cliente)</td>
                    <td>Referencia a <code class="code-font">ROLES(id_rol)</code>.</td>
                </tr>
                <tr>
                    <td><code class="code-font">nombre</code></td>
                    <td><span class="code-font">VARCHAR(150)</span></td>
                    <td><span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Nombre completo del usuario.</td>
                </tr>
                <tr>
                    <td><code class="code-font">correo</code></td>
                    <td><span class="code-font">VARCHAR(150)</span></td>
                    <td><span class="badge-nn">NOT NULL</span> UNIQUE</td>
                    <td>-</td>
                    <td>Email institucional / personal único.</td>
                </tr>
                <tr>
                    <td><code class="code-font">contrasena</code></td>
                    <td><span class="code-font">VARCHAR(255)</span></td>
                    <td><span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Hash / clave de acceso.</td>
                </tr>
                <tr>
                    <td><code class="code-font">telefono</code></td>
                    <td><span class="code-font">VARCHAR(20)</span></td>
                    <td>NULL</td>
                    <td>'5500000000'</td>
                    <td>Teléfono a 10 dígitos para WhatsApp/SMS.</td>
                </tr>
                <tr>
                    <td><code class="code-font">foto_perfil</code></td>
                    <td><span class="code-font">TEXT / VARCHAR</span></td>
                    <td>NULL</td>
                    <td>URL Default</td>
                    <td>Foto de avatar en base64 o URL.</td>
                </tr>
                <tr>
                    <td><code class="code-font">telefono_verificado</code></td>
                    <td><span class="code-font">BOOLEAN</span></td>
                    <td>NULL</td>
                    <td>false</td>
                    <td>Indicador de verificación 2FA.</td>
                </tr>
                <tr>
                    <td><code class="code-font">estado_cuenta</code></td>
                    <td><span class="code-font">VARCHAR(30)</span></td>
                    <td>NULL</td>
                    <td>'activo'</td>
                    <td>Estado operativo (activo, suspendido).</td>
                </tr>
                <tr>
                    <td><code class="code-font">fecha_registro</code></td>
                    <td><span class="code-font">TIMESTAMP</span></td>
                    <td>NULL</td>
                    <td><code class="code-font">CURRENT_TIMESTAMP</code></td>
                    <td>Timestamp de creación de la cuenta.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- 5. VERIFICACIONES_OTP_SEGURIDAD -->
    <div class="avoid-break">
        <h3 class="table-heading">
            <span>5. Tabla: <code class="code-font" style="color: #0284c7; font-size: 10pt;">VERIFICACIONES_OTP_SEGURIDAD</code></span>
            <span style="font-size: 8pt; color: #64748b; font-weight: normal;">Módulo de doble factor (2FA) y bloqueo por fuerza bruta</span>
        </h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 22%;">Campo</th>
                    <th style="width: 22%;">Tipo de Dato</th>
                    <th style="width: 14%;">Restricción</th>
                    <th style="width: 18%;">Default</th>
                    <th style="width: 24%;">Descripción</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code class="code-font">id_otp</code></td>
                    <td><span class="code-font">SERIAL / INT</span></td>
                    <td><span class="badge-pk">PK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>Autoincremental</td>
                    <td>ID de la transacción OTP.</td>
                </tr>
                <tr>
                    <td><code class="code-font">id_usuario</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td><span class="badge-fk">FK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Referencia a <code class="code-font">USUARIOS(id_usuario)</code>.</td>
                </tr>
                <tr>
                    <td><code class="code-font">codigo_otp</code></td>
                    <td><span class="code-font">VARCHAR(10)</span></td>
                    <td><span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Token numérico temporal de 6 dígitos.</td>
                </tr>
                <tr>
                    <td><code class="code-font">intentos_fallidos</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td>NULL</td>
                    <td>0</td>
                    <td>Contador de fallos (límite: 3).</td>
                </tr>
                <tr>
                    <td><code class="code-font">bloqueado_hasta</code></td>
                    <td><span class="code-font">TIMESTAMP</span></td>
                    <td>NULL</td>
                    <td>-</td>
                    <td>Fin de bloqueo temporal (10 min).</td>
                </tr>
                <tr>
                    <td><code class="code-font">fecha_expiracion</code></td>
                    <td><span class="code-font">TIMESTAMP</span></td>
                    <td>NULL</td>
                    <td>-</td>
                    <td>Vigencia del código OTP.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- 6. DIRECCIONES_ENTREGA -->
    <div class="avoid-break">
        <h3 class="table-heading">
            <span>6. Tabla: <code class="code-font" style="color: #0284c7; font-size: 10pt;">DIRECCIONES_ENTREGA</code></span>
            <span style="font-size: 8pt; color: #64748b; font-weight: normal;">Libreta de domicilios de entrega por cliente</span>
        </h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 22%;">Campo</th>
                    <th style="width: 22%;">Tipo de Dato</th>
                    <th style="width: 14%;">Restricción</th>
                    <th style="width: 18%;">Default</th>
                    <th style="width: 24%;">Descripción</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code class="code-font">id_direccion</code></td>
                    <td><span class="code-font">SERIAL / INT</span></td>
                    <td><span class="badge-pk">PK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>Autoincremental</td>
                    <td>Identificador único del domicilio.</td>
                </tr>
                <tr>
                    <td><code class="code-font">id_usuario</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td><span class="badge-fk">FK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Referencia a <code class="code-font">USUARIOS(id_usuario)</code>.</td>
                </tr>
                <tr>
                    <td><code class="code-font">alias</code></td>
                    <td><span class="code-font">VARCHAR(50)</span></td>
                    <td>NULL</td>
                    <td>-</td>
                    <td>Alias (Casa, Oficina, Taller).</td>
                </tr>
                <tr>
                    <td><code class="code-font">calle_numero</code></td>
                    <td><span class="code-font">VARCHAR(255)</span></td>
                    <td><span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Calle, número exterior e interior.</td>
                </tr>
                <tr>
                    <td><code class="code-font">colonia</code></td>
                    <td><span class="code-font">VARCHAR(100)</span></td>
                    <td>NULL</td>
                    <td>-</td>
                    <td>Colonia / Fraccionamiento.</td>
                </tr>
                <tr>
                    <td><code class="code-font">referencias</code></td>
                    <td><span class="code-font">VARCHAR(255)</span></td>
                    <td>NULL</td>
                    <td>-</td>
                    <td>Indicaciones de entrega.</td>
                </tr>
                <tr>
                    <td><code class="code-font">es_principal</code></td>
                    <td><span class="code-font">BOOLEAN</span></td>
                    <td>NULL</td>
                    <td>false</td>
                    <td>Bandera de domicilio predeterminado.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- 7. CATEGORIAS -->
    <div class="avoid-break">
        <h3 class="table-heading">
            <span>7. Tabla: <code class="code-font" style="color: #0284c7; font-size: 10pt;">CATEGORIAS</code></span>
            <span style="font-size: 8pt; color: #64748b; font-weight: normal;">Clasificación de productos naturistas y artesanales</span>
        </h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 22%;">Campo</th>
                    <th style="width: 22%;">Tipo de Dato</th>
                    <th style="width: 14%;">Restricción</th>
                    <th style="width: 18%;">Default</th>
                    <th style="width: 24%;">Descripción</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code class="code-font">id_categoria</code></td>
                    <td><span class="code-font">SERIAL / INT</span></td>
                    <td><span class="badge-pk">PK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>Autoincremental</td>
                    <td>Identificador de la categoría.</td>
                </tr>
                <tr>
                    <td><code class="code-font">nombre</code></td>
                    <td><span class="code-font">VARCHAR(100)</span></td>
                    <td><span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Suplementos, Cafés, Cápsulas, etc.</td>
                </tr>
                <tr>
                    <td><code class="code-font">descripcion</code></td>
                    <td><span class="code-font">VARCHAR(255)</span></td>
                    <td>NULL</td>
                    <td>-</td>
                    <td>Descripción de la línea de productos.</td>
                </tr>
                <tr>
                    <td><code class="code-font">estado</code></td>
                    <td><span class="code-font">BOOLEAN</span></td>
                    <td>NULL</td>
                    <td>true</td>
                    <td>Categoría activa / inactiva.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- 8. PRODUCTOS -->
    <div class="avoid-break">
        <h3 class="table-heading">
            <span>8. Tabla: <code class="code-font" style="color: #0284c7; font-size: 10pt;">PRODUCTOS</code></span>
            <span style="font-size: 8pt; color: #64748b; font-weight: normal;">Inventario y catálogo de publicaciones</span>
        </h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 22%;">Campo</th>
                    <th style="width: 22%;">Tipo de Dato</th>
                    <th style="width: 14%;">Restricción</th>
                    <th style="width: 18%;">Default</th>
                    <th style="width: 24%;">Descripción</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code class="code-font">id_producto</code></td>
                    <td><span class="code-font">SERIAL / INT</span></td>
                    <td><span class="badge-pk">PK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>Autoincremental</td>
                    <td>Identificador único del producto.</td>
                </tr>
                <tr>
                    <td><code class="code-font">id_vendedor</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td><span class="badge-fk">FK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Referencia a <code class="code-font">USUARIOS(id_usuario)</code>.</td>
                </tr>
                <tr>
                    <td><code class="code-font">id_categoria</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td><span class="badge-fk">FK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Referencia a <code class="code-font">CATEGORIAS(id_categoria)</code>.</td>
                </tr>
                <tr>
                    <td><code class="code-font">titulo</code></td>
                    <td><span class="code-font">VARCHAR(150)</span></td>
                    <td><span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Nombre comercial del producto.</td>
                </tr>
                <tr>
                    <td><code class="code-font">descripcion</code></td>
                    <td><span class="code-font">TEXT</span></td>
                    <td>NULL</td>
                    <td>-</td>
                    <td>Ficha técnica y descripción.</td>
                </tr>
                <tr>
                    <td><code class="code-font">precio</code></td>
                    <td><span class="code-font">NUMERIC(12,2)</span></td>
                    <td><span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Precio público en MXN.</td>
                </tr>
                <tr>
                    <td><code class="code-font">costo_unitario</code></td>
                    <td><span class="code-font">NUMERIC(12,2)</span></td>
                    <td>NULL</td>
                    <td>0.00</td>
                    <td>Costo base para cálculo de margen.</td>
                </tr>
                <tr>
                    <td><code class="code-font">stock</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td><span class="badge-nn">NOT NULL</span></td>
                    <td>0</td>
                    <td>Existencias disponibles (Control trigger).</td>
                </tr>
                <tr>
                    <td><code class="code-font">imagen_1, 2, 3</code></td>
                    <td><span class="code-font">TEXT / VARCHAR</span></td>
                    <td>NULL</td>
                    <td>-</td>
                    <td>Imágenes del producto en base64 o URL.</td>
                </tr>
                <tr>
                    <td><code class="code-font">estado_publicacion</code></td>
                    <td><span class="code-font">VARCHAR(30)</span></td>
                    <td>NULL</td>
                    <td>'activo'</td>
                    <td>Estado (activo, pausado, moderado).</td>
                </tr>
                <tr>
                    <td><code class="code-font">fecha_publicacion</code></td>
                    <td><span class="code-font">TIMESTAMP</span></td>
                    <td>NULL</td>
                    <td><code class="code-font">CURRENT_TIMESTAMP</code></td>
                    <td>Fecha de registro en catálogo.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- 9. METODOS_PAGO -->
    <div class="avoid-break">
        <h3 class="table-heading">
            <span>9. Tabla: <code class="code-font" style="color: #0284c7; font-size: 10pt;">METODOS_PAGO</code></span>
            <span style="font-size: 8pt; color: #64748b; font-weight: normal;">Formas de pago aceptadas (Contra Entrega, Transferencia)</span>
        </h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 22%;">Campo</th>
                    <th style="width: 22%;">Tipo de Dato</th>
                    <th style="width: 14%;">Restricción</th>
                    <th style="width: 18%;">Default</th>
                    <th style="width: 24%;">Descripción</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code class="code-font">id_metodo_pago</code></td>
                    <td><span class="code-font">SERIAL / INT</span></td>
                    <td><span class="badge-pk">PK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>Autoincremental</td>
                    <td>Identificador del método de pago.</td>
                </tr>
                <tr>
                    <td><code class="code-font">nombre</code></td>
                    <td><span class="code-font">VARCHAR(100)</span></td>
                    <td><span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Contra entrega, Tarjeta, Transferencia.</td>
                </tr>
                <tr>
                    <td><code class="code-font">descripcion</code></td>
                    <td><span class="code-font">VARCHAR(255)</span></td>
                    <td>NULL</td>
                    <td>-</td>
                    <td>Instrucciones de liquidación.</td>
                </tr>
                <tr>
                    <td><code class="code-font">activo</code></td>
                    <td><span class="code-font">BOOLEAN</span></td>
                    <td>NULL</td>
                    <td>true</td>
                    <td>Habilitado para compras en línea.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- 10. COSTOS_FIJOS -->
    <div class="avoid-break">
        <h3 class="table-heading">
            <span>10. Tabla: <code class="code-font" style="color: #0284c7; font-size: 10pt;">COSTOS_FIJOS</code></span>
            <span style="font-size: 8pt; color: #64748b; font-weight: normal;">Egresos fijos del negocio para reportes de utilidad</span>
        </h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 22%;">Campo</th>
                    <th style="width: 22%;">Tipo de Dato</th>
                    <th style="width: 14%;">Restricción</th>
                    <th style="width: 18%;">Default</th>
                    <th style="width: 24%;">Descripción</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code class="code-font">id_costo_fijo</code></td>
                    <td><span class="code-font">SERIAL / INT</span></td>
                    <td><span class="badge-pk">PK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>Autoincremental</td>
                    <td>Identificador del registro de costo.</td>
                </tr>
                <tr>
                    <td><code class="code-font">id_vendedor</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td><span class="badge-fk">FK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Referencia a <code class="code-font">USUARIOS(id_usuario)</code>.</td>
                </tr>
                <tr>
                    <td><code class="code-font">concepto</code></td>
                    <td><span class="code-font">VARCHAR(150)</span></td>
                    <td><span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Concepto (Renta, Luz, Internet, Empaque).</td>
                </tr>
                <tr>
                    <td><code class="code-font">monto</code></td>
                    <td><span class="code-font">NUMERIC(12,2)</span></td>
                    <td><span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Monto monetario del gasto.</td>
                </tr>
                <tr>
                    <td><code class="code-font">periodo_mes / anio</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td>NULL</td>
                    <td>-</td>
                    <td>Mes (1-12) y año del ejercicio contable.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- 11. PREGUNTAS_PRODUCTO -->
    <div class="avoid-break">
        <h3 class="table-heading">
            <span>11. Tabla: <code class="code-font" style="color: #0284c7; font-size: 10pt;">PREGUNTAS_PRODUCTO</code></span>
            <span style="font-size: 8pt; color: #64748b; font-weight: normal;">Interacción y dudas entre Comprador y Vendedor</span>
        </h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 22%;">Campo</th>
                    <th style="width: 22%;">Tipo de Dato</th>
                    <th style="width: 14%;">Restricción</th>
                    <th style="width: 18%;">Default</th>
                    <th style="width: 24%;">Descripción</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code class="code-font">id_pregunta</code></td>
                    <td><span class="code-font">SERIAL / INT</span></td>
                    <td><span class="badge-pk">PK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>Autoincremental</td>
                    <td>ID de la pregunta realizada.</td>
                </tr>
                <tr>
                    <td><code class="code-font">id_producto</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td><span class="badge-fk">FK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Referencia a <code class="code-font">PRODUCTOS(id_producto)</code>.</td>
                </tr>
                <tr>
                    <td><code class="code-font">id_comprador</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td><span class="badge-fk">FK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Referencia a <code class="code-font">USUARIOS(id_usuario)</code>.</td>
                </tr>
                <tr>
                    <td><code class="code-font">pregunta</code></td>
                    <td><span class="code-font">TEXT</span></td>
                    <td><span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Texto de la consulta del cliente.</td>
                </tr>
                <tr>
                    <td><code class="code-font">respuesta</code></td>
                    <td><span class="code-font">TEXT</span></td>
                    <td>NULL</td>
                    <td>-</td>
                    <td>Respuesta pública del vendedor.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- 12. PEDIDOS_VENTAS -->
    <div class="avoid-break">
        <h3 class="table-heading">
            <span>12. Tabla: <code class="code-font" style="color: #0284c7; font-size: 10pt;">PEDIDOS_VENTAS</code></span>
            <span style="font-size: 8pt; color: #64748b; font-weight: normal;">Cabecera de transacciones comerciales</span>
        </h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 22%;">Campo</th>
                    <th style="width: 22%;">Tipo de Dato</th>
                    <th style="width: 14%;">Restricción</th>
                    <th style="width: 18%;">Default</th>
                    <th style="width: 24%;">Descripción</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code class="code-font">id_pedido</code></td>
                    <td><span class="code-font">SERIAL / INT</span></td>
                    <td><span class="badge-pk">PK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>Autoincremental</td>
                    <td>Folio único del pedido.</td>
                </tr>
                <tr>
                    <td><code class="code-font">id_vendedor</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td><span class="badge-fk">FK</span></td>
                    <td>1</td>
                    <td>Vendedor asignado a la orden.</td>
                </tr>
                <tr>
                    <td><code class="code-font">id_comprador</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td><span class="badge-fk">FK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Cliente que realiza la compra.</td>
                </tr>
                <tr>
                    <td><code class="code-font">id_direccion</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td><span class="badge-fk">FK</span></td>
                    <td>1</td>
                    <td>Domicilio de entrega asignado.</td>
                </tr>
                <tr>
                    <td><code class="code-font">id_metodo_pago</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td><span class="badge-fk">FK</span></td>
                    <td>1</td>
                    <td>Método seleccionado.</td>
                </tr>
                <tr>
                    <td><code class="code-font">subtotal</code></td>
                    <td><span class="code-font">NUMERIC(12,2)</span></td>
                    <td>NULL</td>
                    <td>0.00</td>
                    <td>Subtotal sin impuestos / envío.</td>
                </tr>
                <tr>
                    <td><code class="code-font">monto_total</code></td>
                    <td><span class="code-font">NUMERIC(12,2)</span></td>
                    <td><span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Monto final a cobrar en MXN.</td>
                </tr>
                <tr>
                    <td><code class="code-font">estado_pedido</code></td>
                    <td><span class="code-font">VARCHAR(30)</span></td>
                    <td>NULL</td>
                    <td>'Pendiente'</td>
                    <td>Pendiente, En camino, Completado, Cancelado.</td>
                </tr>
                <tr>
                    <td><code class="code-font">estado_pago</code></td>
                    <td><span class="code-font">VARCHAR(30)</span></td>
                    <td>NULL</td>
                    <td>'Pendiente'</td>
                    <td>Pendiente, Liquidado, Reembolsado.</td>
                </tr>
                <tr>
                    <td><code class="code-font">fecha_pedido</code></td>
                    <td><span class="code-font">TIMESTAMP</span></td>
                    <td>NULL</td>
                    <td><code class="code-font">CURRENT_TIMESTAMP</code></td>
                    <td>Timestamp exacto de la transacción.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- 13. DETALLE_VENTA -->
    <div class="avoid-break">
        <h3 class="table-heading">
            <span>13. Tabla: <code class="code-font" style="color: #0284c7; font-size: 10pt;">DETALLE_VENTA</code></span>
            <span style="font-size: 8pt; color: #64748b; font-weight: normal;">Renglones individuales de cada pedido (Items)</span>
        </h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 22%;">Campo</th>
                    <th style="width: 22%;">Tipo de Dato</th>
                    <th style="width: 14%;">Restricción</th>
                    <th style="width: 18%;">Default</th>
                    <th style="width: 24%;">Descripción</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code class="code-font">id_detalle</code></td>
                    <td><span class="code-font">SERIAL / INT</span></td>
                    <td><span class="badge-pk">PK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>Autoincremental</td>
                    <td>ID del renglón de venta.</td>
                </tr>
                <tr>
                    <td><code class="code-font">id_pedido</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td><span class="badge-fk">FK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Referencia a <code class="code-font">PEDIDOS_VENTAS(id_pedido)</code>.</td>
                </tr>
                <tr>
                    <td><code class="code-font">id_producto</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td><span class="badge-fk">FK</span> <span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Referencia a <code class="code-font">PRODUCTOS(id_producto)</code>.</td>
                </tr>
                <tr>
                    <td><code class="code-font">cantidad</code></td>
                    <td><span class="code-font">INTEGER</span></td>
                    <td><span class="badge-nn">NOT NULL</span></td>
                    <td>1</td>
                    <td>Unidades compradas de este producto.</td>
                </tr>
                <tr>
                    <td><code class="code-font">precio_unitario</code></td>
                    <td><span class="code-font">NUMERIC(12,2)</span></td>
                    <td><span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Precio congelado al momento de la venta.</td>
                </tr>
                <tr>
                    <td><code class="code-font">costo_unitario</code></td>
                    <td><span class="code-font">NUMERIC(12,2)</span></td>
                    <td>NULL</td>
                    <td>0.00</td>
                    <td>Costo unitario para análisis de ganancia.</td>
                </tr>
                <tr>
                    <td><code class="code-font">subtotal_item</code></td>
                    <td><span class="code-font">NUMERIC(12,2)</span></td>
                    <td><span class="badge-nn">NOT NULL</span></td>
                    <td>-</td>
                    <td>Cálculo: <code class="code-font">cantidad * precio_unitario</code>.</td>
                </tr>
                <tr>
                    <td><code class="code-font">notificacion_enviada</code></td>
                    <td><span class="code-font">BOOLEAN</span></td>
                    <td>NULL</td>
                    <td>false</td>
                    <td>Bandera de alerta enviada por WhatsApp.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- ============================================================ -->
    <!-- SECCIÓN 5: OBJETOS AVANZADOS DE BASE DE DATOS (PROGRAMABILIDAD)-->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">5</span> Objetos Avanzados de Base de Datos (PL/pgSQL)</h1>

    <p>
        Para garantizar la máxima eficiencia en la capa de datos y evitar cálculos repetitivos en el servidor Node.js, 
        se han programado directamente en el motor PostgreSQL las siguientes <strong>Vistas</strong>, <strong>Funciones</strong>, 
        <strong>Procedimientos Almacenados</strong> y <strong>Triggers</strong>:
    </p>

    <h2 class="subsection-title">1. Vistas Optimizadas (Views)</h2>
    <pre class="sql-block">-- Vista para Catálogo y Búsqueda con nombres legibles
CREATE OR REPLACE VIEW vw_productos_detallados AS
SELECT p.id_producto, p.titulo, p.descripcion, p.precio, p.costo_unitario, p.stock, 
       p.imagen_1, p.imagen_2, p.imagen_3,
       COALESCE(c.nombre, 'Sin categoría') AS categoria_nombre, 
       COALESCE(u.nombre, 'Vendedor Principal') AS vendedor_nombre
FROM PRODUCTOS p
LEFT JOIN CATEGORIAS c ON p.id_categoria = c.id_categoria
LEFT JOIN USUARIOS u ON p.id_vendedor = u.id_usuario;

-- Vista de Alerta de Stock Bajo (Nivel de Reorden <= 5)
CREATE OR REPLACE VIEW vw_productos_stock_bajo AS 
SELECT p.id_producto, p.titulo, p.id_categoria, p.stock, 
       COALESCE(c.nombre, 'General') AS categoria_nombre
FROM PRODUCTOS p
LEFT JOIN CATEGORIAS c ON p.id_categoria = c.id_categoria
WHERE p.stock <= 5;</pre>

    <h2 class="subsection-title">2. Funciones y Procedimientos Almacenados (Stored Procedures)</h2>
    <pre class="sql-block">-- Función: Validar existencia suficiente antes de compra
CREATE OR REPLACE FUNCTION fn_validar_stock_disponible(p_id_producto INT, p_cantidad INT)
RETURNS BOOLEAN AS $$
DECLARE
    v_stock INT;
BEGIN
    SELECT stock INTO v_stock FROM PRODUCTOS WHERE id_producto = p_id_producto;
    RETURN (v_stock >= p_cantidad);
END;
$$ LANGUAGE plpgsql;

-- Procedimiento: Procesar venta atómica y descontar inventario
CREATE OR REPLACE PROCEDURE sp_procesar_venta(
    p_id_pedido INT, p_id_producto INT, p_cantidad INT, p_precio_unitario NUMERIC
)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO DETALLE_VENTA (id_pedido, id_producto, cantidad, precio_unitario, subtotal_item)
    VALUES (p_id_pedido, p_id_producto, p_cantidad, p_precio_unitario, (p_cantidad * p_precio_unitario));
    
    UPDATE PRODUCTOS SET stock = stock - p_cantidad WHERE id_producto = p_id_producto;
END;
$$;</pre>

    <h2 class="subsection-title">3. Triggers de Integridad (Disparadores)</h2>
    <pre class="sql-block">-- Trigger para evitar inventarios negativos
CREATE OR REPLACE FUNCTION trg_fn_auditar_producto()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock < 0 THEN
        RAISE EXCEPTION 'Error de Integridad: El stock del producto no puede ser negativo.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auditoria_productos
BEFORE UPDATE ON PRODUCTOS
FOR EACH ROW EXECUTE FUNCTION trg_fn_auditar_producto();</pre>

    <!-- ============================================================ -->
    <!-- SECCIÓN 6: MATRIZ DE CONTROL DE ACCESO (RBAC)                -->
    <!-- ============================================================ -->
    <h1 class="section-title"><span class="number">6</span> Matriz de Control de Acceso por Roles (RBAC)</h1>

    <table class="matrix-table">
        <thead>
            <tr>
                <th>Módulo del Sistema</th>
                <th>Administrador (ID 1)</th>
                <th>Vendedor (ID 2)</th>
                <th>Cliente (ID 3)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1. Autenticación & Usuarios</td>
                <td><span class="check-yes">✔ Total</span></td>
                <td><span class="check-no">✕ Denegado</span></td>
                <td><span class="check-no">✕ Denegado</span></td>
            </tr>
            <tr>
                <td>2. Perfil de Usuario</td>
                <td><span class="check-yes">✔ Total</span></td>
                <td><span class="check-yes">✔ Total</span></td>
                <td><span class="check-yes">✔ Total</span></td>
            </tr>
            <tr>
                <td>3. Publicación / Edición de Productos</td>
                <td><span class="check-yes">✔ Total</span></td>
                <td><span class="check-yes">✔ Total</span></td>
                <td><span class="check-no">✕ Denegado</span></td>
            </tr>
            <tr>
                <td>4. Catálogo Público</td>
                <td><span class="check-yes">✔ Total</span></td>
                <td><span class="check-yes">✔ Total</span></td>
                <td><span class="check-yes">✔ Lectura / Compra</span></td>
            </tr>
            <tr>
                <td>5. Compra Directa & Detalle</td>
                <td><span class="check-yes">✔ Total</span></td>
                <td><span class="check-yes">✔ Total</span></td>
                <td><span class="check-yes">✔ Total</span></td>
            </tr>
            <tr>
                <td>6. Historial de Pedidos y Ventas</td>
                <td><span class="check-yes">✔ Ver Todos & Cambiar Estado</span></td>
                <td><span class="check-yes">✔ Ver Todos & Cambiar Estado</span></td>
                <td><span class="check-yes">✔ Ver Compras Propias</span></td>
            </tr>
            <tr>
                <td>7. Notificaciones WhatsApp / SMS</td>
                <td><span class="check-yes">✔ Total</span></td>
                <td><span class="check-yes">✔ Total</span></td>
                <td><span class="check-no">✕ Denegado</span></td>
            </tr>
            <tr>
                <td>8. Control de Seguridad OTP</td>
                <td><span class="check-yes">✔ Total (Desbloqueo)</span></td>
                <td><span class="check-no">✕ Denegado</span></td>
                <td><span class="check-no">✕ Denegado</span></td>
            </tr>
            <tr>
                <td>9. Métricas & Analítica Financiera</td>
                <td><span class="check-yes">✔ Total</span></td>
                <td><span class="check-no">✕ Denegado</span></td>
                <td><span class="check-no">✕ Denegado</span></td>
            </tr>
            <tr>
                <td>10. Control y Moderación</td>
                <td><span class="check-yes">✔ Total (Bajas / Suspensiones)</span></td>
                <td><span class="check-no">✕ Denegado</span></td>
                <td><span class="check-no">✕ Denegado</span></td>
            </tr>
        </tbody>
    </table>

    <!-- ============================================================ -->
    <!-- SECCIÓN 7: CONCLUSIÓN Y BUENAS PRÁCTICAS                     -->
    <!-- ============================================================ -->
    <h1 class="section-title"><span class="number">7</span> Conclusiones y Consideraciones de Operación</h1>

    <p>
        El diseño e implementación de la base de datos para <strong>LocalMarket (Proyecto 7)</strong> cumple rigurosamente con los 
        más altos estándares de la ingeniería de software:
    </p>
    <ul class="custom-list">
        <li><strong>Seguridad y Resiliencia:</strong> Esquema blindado contra inyecciones SQL mediante consultas preparadas en el driver <code class="code-font">pg</code>, con autenticación en dos factores (OTP) y moderación de cuentas.</li>
        <li><strong>Escalabilidad:</strong> La separación clara entre cabeceras de ventas (<code class="code-font">PEDIDOS_VENTAS</code>) e ítems (<code class="code-font">DETALLE_VENTA</code>) permite registrar miles de transacciones diarias sin degradación de velocidad.</li>
        <li><strong>Consistencia y Automatización:</strong> Los disparadores y vistas garantizan que la información consultada por la capa de presentación refleje en tiempo real el inventario físico disponible.</li>
    </ul>

</body>
</html>
`;

const htmlFilePath = path.join(__dirname, '..', 'Documento_BD_Proyecto7.html');
fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log('HTML Document generated at:', htmlFilePath);

// Convert to PDF using headless Edge
const pdfFilePath = path.join(__dirname, '..', 'Documento_BD_Proyecto7.pdf');
const edgePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let selectedEdge = edgePaths.find(p => fs.existsSync(p));
if (!selectedEdge) {
    console.error('Microsoft Edge not found.');
    process.exit(1);
}

try {
    const cmd = `"${selectedEdge}" --headless --disable-gpu --print-to-pdf="${pdfFilePath}" --no-pdf-header-footer "${htmlFilePath}"`;
    console.log('Running:', cmd);
    execSync(cmd);
    if (fs.existsSync(pdfFilePath)) {
        const stats = fs.statSync(pdfFilePath);
        console.log(`✅ PDF successfully generated! File: ${pdfFilePath} (${(stats.size / 1024).toFixed(2)} KB)`);
    } else {
        console.error('PDF file was not created.');
    }
} catch (err) {
    console.error('Error generating PDF:', err.message);
}
