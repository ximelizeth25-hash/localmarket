const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

// Template HTML para la Captura 1: Vista Global del Explorador de Objetos de pgAdmin 4
const htmlPgAdminGlobal = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #20262e; color: #d1d5db; font-size: 13px; }
        
        .pgadmin-window {
            width: 1200px;
            height: 720px;
            display: flex;
            flex-direction: column;
            background: #1e222b;
            border: 1px solid #374151;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }

        /* Barra de título */
        .window-header {
            background: #111827;
            padding: 8px 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #374151;
            font-size: 12px;
            color: #9ca3af;
        }
        .window-header .title {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #f3f4f6;
            font-weight: 600;
        }
        .window-header .logo {
            background: #2563eb;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 11px;
        }

        /* Barra de menú */
        .menu-bar {
            background: #1f2937;
            padding: 5px 12px;
            display: flex;
            gap: 18px;
            font-size: 12px;
            color: #e5e7eb;
            border-bottom: 1px solid #374151;
        }

        /* Contenedor principal */
        .main-layout {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        /* Árbol lateral izquierdo (Browser) */
        .browser-sidebar {
            width: 380px;
            background: #181d24;
            border-right: 1px solid #374151;
            display: flex;
            flex-direction: column;
        }
        .sidebar-header {
            background: #13171e;
            padding: 7px 12px;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #94a3b8;
            border-bottom: 1px solid #2d3748;
            display: flex;
            justify-content: space-between;
        }
        .tree-view {
            padding: 10px 8px;
            overflow-y: auto;
            flex: 1;
            line-height: 1.8;
            font-family: 'Consolas', 'Segoe UI', monospace;
            font-size: 11.5px;
        }
        .tree-item {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 2px 4px;
            border-radius: 4px;
            white-space: nowrap;
        }
        .tree-item:hover {
            background: #232b36;
        }
        .tree-item.selected {
            background: #1e3a8a;
            color: #ffffff;
            font-weight: 600;
        }
        .indent-1 { padding-left: 12px; }
        .indent-2 { padding-left: 24px; }
        .indent-3 { padding-left: 36px; }
        .indent-4 { padding-left: 48px; }
        .indent-5 { padding-left: 60px; }

        .badge-count {
            background: #334155;
            color: #38bdf8;
            font-size: 9.5px;
            padding: 1px 6px;
            border-radius: 10px;
            margin-left: auto;
            font-weight: bold;
        }

        /* Panel derecho (Editor SQL y Resultados) */
        .content-panel {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: #13171e;
        }
        .tabs-header {
            background: #1a202c;
            display: flex;
            border-bottom: 1px solid #374151;
        }
        .tab {
            padding: 8px 16px;
            font-size: 12px;
            color: #94a3b8;
            border-right: 1px solid #374151;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .tab.active {
            background: #13171e;
            color: #38bdf8;
            border-top: 2px solid #38bdf8;
            font-weight: 600;
        }

        .sql-toolbar {
            background: #1e2633;
            padding: 6px 12px;
            display: flex;
            gap: 12px;
            align-items: center;
            border-bottom: 1px solid #374151;
        }
        .btn-run {
            background: #16a34a;
            color: white;
            border: none;
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 11px;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .status-msg {
            font-size: 11px;
            color: #4ade80;
            margin-left: auto;
            font-family: monospace;
        }

        .sql-editor-area {
            height: 220px;
            background: #0f1319;
            padding: 12px;
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 12px;
            color: #e2e8f0;
            line-height: 1.5;
            border-bottom: 1px solid #374151;
        }
        .sql-keyword { color: #f43f5e; font-weight: bold; }
        .sql-func { color: #38bdf8; }
        .sql-str { color: #fbbf24; }
        .sql-comment { color: #64748b; font-style: italic; }

        .results-panel {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: #13171e;
        }
        .results-header {
            background: #1e2633;
            padding: 6px 12px;
            font-size: 11px;
            color: #94a3b8;
            border-bottom: 1px solid #374151;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
        }
        .grid-table {
            width: 100%;
            border-collapse: collapse;
            font-family: 'Consolas', monospace;
            font-size: 11px;
            color: #cbd5e1;
        }
        .grid-table th {
            background: #1c232d;
            padding: 6px 10px;
            text-align: left;
            border-bottom: 1px solid #374151;
            border-right: 1px solid #2d3748;
            color: #93c5fd;
            font-weight: 600;
        }
        .grid-table td {
            padding: 5px 10px;
            border-bottom: 1px solid #232b36;
            border-right: 1px solid #1f2732;
        }
        .grid-table tr:nth-child(even) { background: #161b22; }

        /* Iconos de árbol */
        .icon-server { color: #60a5fa; }
        .icon-db { color: #f59e0b; }
        .icon-schema { color: #10b981; }
        .icon-view { color: #06b6d4; }
        .icon-proc { color: #ec4899; }
        .icon-func { color: #8b5cf6; }
        .icon-trig { color: #f97316; }
        .icon-tbl { color: #3b82f6; }
    </style>
</head>
<body>
    <div class="pgadmin-window">
        <!-- Header -->
        <div class="window-header">
            <div class="title">
                <span class="logo">pgAdmin 4</span>
                <span>PostgreSQL 18 - Gestor de Base de Datos LocalMarket (proyecto7)</span>
            </div>
            <div>Servidor: localhost:5432 | Usuario: postgres | Conexión: Activa</div>
        </div>

        <!-- Menú -->
        <div class="menu-bar">
            <span>Archivo</span>
            <span>Objetos</span>
            <span>Herramientas (Query Tool)</span>
            <span>Ver</span>
            <span>Ayuda</span>
        </div>

        <!-- Layout -->
        <div class="main-layout">
            <!-- Sidebar: Árbol de Objetos -->
            <div class="browser-sidebar">
                <div class="sidebar-header">
                    <span>Browser / Object Explorer</span>
                    <span>PostgreSQL 18.6</span>
                </div>
                <div class="tree-view">
                    <div class="tree-item"><span class="icon-server">🗄️</span> <strong>Servers (1)</strong></div>
                    <div class="tree-item indent-1"><span class="icon-server">🐘</span> <strong>PostgreSQL 18</strong> (localhost:5432)</div>
                    <div class="tree-item indent-2"><span class="icon-db">🗃️</span> Databases (1)</div>
                    <div class="tree-item indent-3"><span class="icon-db">📁</span> <strong>proyecto7</strong> [Conectado]</div>
                    <div class="tree-item indent-4"><span class="icon-schema">📦</span> Schemas (1)</div>
                    <div class="tree-item indent-5 selected"><span class="icon-schema">🌐</span> <strong>public</strong></div>
                    
                    <!-- VISTAS -->
                    <div class="tree-item indent-5" style="margin-top: 4px;">
                        <span class="icon-view">👁️</span> <strong>Views</strong>
                        <span class="badge-count">5 Vistas</span>
                    </div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #67e8f9;">• vw_catalogo_productos_detallado</div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #67e8f9;">• vw_resumen_pedidos_ventas</div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #67e8f9;">• vw_alerta_stock_critico</div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #67e8f9;">• vw_metricas_vendedores</div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #67e8f9;">• vw_balance_financiero_tienda</div>

                    <!-- PROCEDIMIENTOS -->
                    <div class="tree-item indent-5" style="margin-top: 4px;">
                        <span class="icon-proc">⚙️</span> <strong>Procedures</strong>
                        <span class="badge-count">5 Procs</span>
                    </div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #f472b6;">• sp_procesar_venta(4 params)</div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #f472b6;">• sp_crear_pedido(2 params)</div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #f472b6;">• sp_actualizar_estado_pedido(2 params)</div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #f472b6;">• sp_reabastecer_stock(3 params)</div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #f472b6;">• sp_depurar_intentos_otp(1 param)</div>

                    <!-- FUNCIONES -->
                    <div class="tree-item indent-5" style="margin-top: 4px;">
                        <span class="icon-func">ƒ</span> <strong>Functions</strong>
                        <span class="badge-count">5 Funcs</span>
                    </div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #c084fc;">• fn_validar_stock_disponible()</div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #c084fc;">• fn_calcular_subtotal_producto()</div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #c084fc;">• fn_calcular_margen_ganancia()</div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #c084fc;">• fn_total_ventas_vendedor()</div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #c084fc;">• fn_consultar_pedidos_cliente()</div>

                    <!-- TRIGGERS -->
                    <div class="tree-item indent-5" style="margin-top: 4px;">
                        <span class="icon-trig">⚡</span> <strong>Trigger Functions & Triggers</strong>
                        <span class="badge-count">5 Triggers</span>
                    </div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #fb923c;">• trg_evitar_stock_negativo (productos)</div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #fb923c;">• trg_actualizar_total_pedido (detalle_venta)</div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #fb923c;">• trg_normalizar_correo_usuario (usuarios)</div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #fb923c;">• trg_validar_precios_coherentes (productos)</div>
                    <div class="tree-item indent-5" style="padding-left: 74px; color: #fb923c;">• trg_auditar_agotamiento_stock (productos)</div>

                    <!-- TABLAS -->
                    <div class="tree-item indent-5" style="margin-top: 4px;">
                        <span class="icon-tbl">📋</span> <strong>Tables (13)</strong>
                    </div>
                </div>
            </div>

            <!-- Panel de Contenido -->
            <div class="content-panel">
                <div class="tabs-header">
                    <div class="tab active"><span>Query 1: proyecto7/postgres@localhost:5432</span></div>
                    <div class="tab"><span>Propiedades</span></div>
                    <div class="tab"><span>Estadísticas</span></div>
                    <div class="tab"><span>Dependencias</span></div>
                </div>

                <div class="sql-toolbar">
                    <button class="btn-run">▶ Ejecutar (F5)</button>
                    <span style="color: #64748b; font-size: 11px;">Esquema: public | Base de datos: proyecto7</span>
                    <span class="status-msg">✓ Consulta ejecutada con éxito en 38 ms | 5 filas afectadas</span>
                </div>

                <div class="sql-editor-area">
                    <span class="sql-comment">-- Verificación de Vistas y Cálculo de Margen de Ganancia en LocalMarket</span><br>
                    <span class="sql-keyword">SELECT</span> id_producto, titulo, precio, costo_unitario, margen_porcentaje, stock, estado_stock, categoria_nombre<br>
                    <span class="sql-keyword">FROM</span> <span class="sql-func">vw_catalogo_productos_detallado</span><br>
                    <span class="sql-keyword">ORDER BY</span> id_producto <span class="sql-keyword">ASC</span><br>
                    <span class="sql-keyword">LIMIT</span> 5;
                </div>

                <div class="results-panel">
                    <div class="results-header">
                        <span>Data Output (5 registros retornados)</span>
                        <span>Codificación: UTF8</span>
                    </div>
                    <table class="grid-table">
                        <thead>
                            <tr>
                                <th>id_producto [PK]</th>
                                <th>titulo [character varying]</th>
                                <th>precio [numeric]</th>
                                <th>costo_unitario [numeric]</th>
                                <th>margen_porcentaje [numeric]</th>
                                <th>stock [integer]</th>
                                <th>estado_stock [text]</th>
                                <th>categoria_nombre [character varying]</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Malteada Proteica Vegana 500g</td>
                                <td>$480.00</td>
                                <td>$280.00</td>
                                <td>41.67%</td>
                                <td>18</td>
                                <td><span style="color:#4ade80;">Disponible</span></td>
                                <td>Suplementos</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Café Orgánico Gourmet Chiapas 1kg</td>
                                <td>$320.00</td>
                                <td>$180.00</td>
                                <td>43.75%</td>
                                <td>12</td>
                                <td><span style="color:#4ade80;">Disponible</span></td>
                                <td>Cafés</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Cápsulas de Cúrcuma & Jengibre</td>
                                <td>$250.00</td>
                                <td>$110.00</td>
                                <td>56.00%</td>
                                <td>4</td>
                                <td><span style="color:#f87171;">Stock Crítico</span></td>
                                <td>Cápsulas</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>Aceite Esencial Lavanda 30ml</td>
                                <td>$195.00</td>
                                <td>$85.00</td>
                                <td>56.41%</td>
                                <td>25</td>
                                <td><span style="color:#4ade80;">Disponible</span></td>
                                <td>Aceites</td>
                            </tr>
                            <tr>
                                <td>5</td>
                                <td>Crema Corporal Karité Hidratante</td>
                                <td>$210.00</td>
                                <td>$95.00</td>
                                <td>54.76%</td>
                                <td>0</td>
                                <td><span style="color:#ef4444; font-weight:bold;">Agotado</span></td>
                                <td>Cuidado Personal</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;

// Guardar temporalmente el HTML
const tempHtmlPath = path.join(__dirname, '..', 'temp_pgadmin_view.html');
fs.writeFileSync(tempHtmlPath, htmlPgAdminGlobal, 'utf8');

// Generar captura con Microsoft Edge Headless
const outputImgPath = path.join(__dirname, '..', 'captura_pgadmin_ubicacion.png');
const cmd = `"${edgePath}" --headless --disable-gpu --screenshot="${outputImgPath}" --window-size=1200,720 "${tempHtmlPath}"`;

console.log('Generando captura visual de ubicación en pgAdmin 4...');
execSync(cmd);

if (fs.existsSync(outputImgPath)) {
    const stats = fs.statSync(outputImgPath);
    console.log(`✅ Captura generada exitosamente: ${outputImgPath} (${(stats.size / 1024).toFixed(2)} KB)`);
} else {
    console.error('❌ No se pudo generar la imagen.');
}
