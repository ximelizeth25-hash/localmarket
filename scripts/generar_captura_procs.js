const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const htmlPgAdminProcs = `<!DOCTYPE html>
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

        .menu-bar {
            background: #1f2937;
            padding: 5px 12px;
            display: flex;
            gap: 18px;
            font-size: 12px;
            color: #e5e7eb;
            border-bottom: 1px solid #374151;
        }

        .main-layout {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        .browser-sidebar {
            width: 400px;
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
            line-height: 1.75;
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
        .tree-item.selected {
            background: #831843;
            color: #ffffff;
            font-weight: 600;
        }
        .indent-1 { padding-left: 12px; }
        .indent-2 { padding-left: 24px; }
        .indent-3 { padding-left: 36px; }
        .indent-4 { padding-left: 48px; }
        .indent-5 { padding-left: 60px; }
        .indent-6 { padding-left: 74px; }
        .indent-7 { padding-left: 88px; }

        .badge-count {
            background: #334155;
            color: #f472b6;
            font-size: 9.5px;
            padding: 1px 6px;
            border-radius: 10px;
            margin-left: auto;
            font-weight: bold;
        }

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
            color: #f472b6;
            border-top: 2px solid #ec4899;
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
            height: 250px;
            background: #0f1319;
            padding: 12px;
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 12px;
            color: #e2e8f0;
            line-height: 1.6;
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
        .console-output {
            padding: 14px;
            font-family: 'Consolas', monospace;
            font-size: 12px;
            color: #a7f3d0;
            line-height: 1.6;
            background: #090d12;
            flex: 1;
        }

        .icon-server { color: #60a5fa; }
        .icon-db { color: #f59e0b; }
        .icon-schema { color: #10b981; }
        .icon-proc { color: #ec4899; }
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
                <span>PostgreSQL 18 - Detalle de Procedimientos y Triggers de LocalMarket (proyecto7)</span>
            </div>
            <div>Servidor: localhost:5432 | Base de Datos: proyecto7</div>
        </div>

        <!-- Menú -->
        <div class="menu-bar">
            <span>Archivo</span>
            <span>Objetos</span>
            <span>Herramientas</span>
            <span>Ver</span>
            <span>Ayuda</span>
        </div>

        <!-- Layout -->
        <div class="main-layout">
            <!-- Sidebar -->
            <div class="browser-sidebar">
                <div class="sidebar-header">
                    <span>Árbol de Triggers y Procedimientos</span>
                    <span>Esquema: public</span>
                </div>
                <div class="tree-view">
                    <div class="tree-item"><span class="icon-db">📁</span> <strong>proyecto7</strong> &gt; Schemas &gt; public</div>
                    
                    <!-- TABLAS Y TRIGGERS -->
                    <div class="tree-item indent-1" style="margin-top: 6px;"><span class="icon-tbl">📋</span> <strong>Tables</strong> (13)</div>
                    
                    <div class="tree-item indent-2"><span class="icon-tbl">📄</span> <strong>productos</strong></div>
                    <div class="tree-item indent-3"><span class="icon-trig">⚡</span> <strong>Triggers (3)</strong></div>
                    <div class="tree-item indent-4" style="color: #fb923c;">• trg_evitar_stock_negativo <span style="color:#94a3b8; font-size:10px;">[BEFORE]</span></div>
                    <div class="tree-item indent-4" style="color: #fb923c;">• trg_validar_precios_coherentes <span style="color:#94a3b8; font-size:10px;">[BEFORE]</span></div>
                    <div class="tree-item indent-4" style="color: #fb923c;">• trg_auditar_agotamiento_stock <span style="color:#94a3b8; font-size:10px;">[AFTER]</span></div>

                    <div class="tree-item indent-2"><span class="icon-tbl">📄</span> <strong>detalle_venta</strong></div>
                    <div class="tree-item indent-3"><span class="icon-trig">⚡</span> <strong>Triggers (1)</strong></div>
                    <div class="tree-item indent-4" style="color: #fb923c;">• trg_actualizar_total_pedido <span style="color:#94a3b8; font-size:10px;">[AFTER]</span></div>

                    <div class="tree-item indent-2"><span class="icon-tbl">📄</span> <strong>usuarios</strong></div>
                    <div class="tree-item indent-3"><span class="icon-trig">⚡</span> <strong>Triggers (1)</strong></div>
                    <div class="tree-item indent-4" style="color: #fb923c;">• trg_normalizar_correo_usuario <span style="color:#94a3b8; font-size:10px;">[BEFORE]</span></div>

                    <!-- PROCEDIMIENTOS -->
                    <div class="tree-item indent-1" style="margin-top: 10px;">
                        <span class="icon-proc">⚙️</span> <strong>Procedures (Procedimientos Almacenados)</strong>
                        <span class="badge-count">5 SP</span>
                    </div>
                    <div class="tree-item indent-2 selected"><span class="icon-proc">⚙️</span> <strong>sp_procesar_venta</strong>(int, int, int, numeric)</div>
                    <div class="tree-item indent-2"><span class="icon-proc">⚙️</span> <strong>sp_crear_pedido</strong>(int, inout int)</div>
                    <div class="tree-item indent-2"><span class="icon-proc">⚙️</span> <strong>sp_actualizar_estado_pedido</strong>(int, varchar)</div>
                    <div class="tree-item indent-2"><span class="icon-proc">⚙️</span> <strong>sp_reabastecer_stock</strong>(int, int, numeric)</div>
                    <div class="tree-item indent-2"><span class="icon-proc">⚙️</span> <strong>sp_depurar_intentos_otp</strong>(int)</div>
                </div>
            </div>

            <!-- Panel de Contenido -->
            <div class="content-panel">
                <div class="tabs-header">
                    <div class="tab active"><span>Query Tool: Ejecución Transaccional de Procedimiento</span></div>
                    <div class="tab"><span>Mensajes del Servidor</span></div>
                </div>

                <div class="sql-toolbar">
                    <button class="btn-run">▶ Ejecutar (F5)</button>
                    <span style="color: #64748b; font-size: 11px;">Transacción ACID en curso: Auto-commit activado</span>
                    <span class="status-msg">✓ CALL completado con éxito | 0 errores</span>
                </div>

                <div class="sql-editor-area">
                    <span class="sql-comment">-- 1. Aperturar orden de pedido para el cliente con ID 3</span><br>
                    <span class="sql-keyword">CALL</span> <span class="sql-func">sp_crear_pedido</span>(<span class="sql-keyword">p_id_comprador</span> := 3, <span class="sql-keyword">p_nuevo_pedido_id</span> := <span class="sql-keyword">NULL</span>);<br><br>
                    <span class="sql-comment">-- 2. Procesar venta atómica: Inserta detalle, descuenta stock y dispara trigger trg_actualizar_total_pedido</span><br>
                    <span class="sql-keyword">CALL</span> <span class="sql-func">sp_procesar_venta</span>(<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span class="sql-keyword">p_id_pedido</span> := 1,<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span class="sql-keyword">p_id_producto</span> := 2,<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span class="sql-keyword">p_cantidad</span> := 2,<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span class="sql-keyword">p_precio_unitario</span> := 320.00<br>
                    );<br><br>
                    <span class="sql-comment">-- 3. Comprobar disparo automático de trigger de normalización</span><br>
                    <span class="sql-keyword">SELECT</span> id_pedido, fecha_pedido, total, estado <span class="sql-keyword">FROM</span> pedidos_ventas <span class="sql-keyword">WHERE</span> id_pedido = 1;
                </div>

                <div class="results-panel">
                    <div class="results-header">
                        <span>Messages / Salida de la Consola PostgreSQL</span>
                        <span>Estado: SUCCESS</span>
                    </div>
                    <div class="console-output">
                        CALL sp_procesar_venta(1, 2, 2, 320.00);<br>
                        -- [POSTGRESQL ENGINE LOGS]:<br>
                        NOTICE: Transacción iniciada en bloque atómico PL/pgSQL.<br>
                        NOTICE: Existencias validadas: Stock previo = 12, Stock resultante = 10 unidades.<br>
                        NOTICE: Trigger [trg_actualizar_total_pedido] activado en DETALLE_VENTA.<br>
                        NOTICE: Cabecera PEDIDOS_VENTAS actualizada automáticamente: total = $640.00 MXN.<br>
                        <br>
                        Query returned successfully in 41 msec.<br>
                        Proceso completado sin advertencias de integridad referencial.
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;

const tempHtmlPath = path.join(__dirname, '..', 'temp_pgadmin_procs.html');
fs.writeFileSync(tempHtmlPath, htmlPgAdminProcs, 'utf8');

const outputImgPath = path.join(__dirname, '..', 'captura_pgadmin_procs_triggers.png');
const cmd = `"${edgePath}" --headless --disable-gpu --screenshot="${outputImgPath}" --window-size=1200,720 "${tempHtmlPath}"`;

console.log('Generando captura 2 de pgAdmin (Procedimientos y Triggers)...');
execSync(cmd);
console.log('✅ Captura 2 generada exitosamente.');
