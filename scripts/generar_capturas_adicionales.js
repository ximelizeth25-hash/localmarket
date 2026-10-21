const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

// 1. Captura del Dashboard Frontend
const htmlDashboardPath = path.join(__dirname, '..', 'public', 'dashboard.html');
const outDashboardPng = path.join(__dirname, '..', 'captura_dashboard_frontend.png');

try {
    const cmd1 = `"${edgePath}" --headless --disable-gpu --screenshot="${outDashboardPng}" --window-size=1280,900 "${htmlDashboardPath}"`;
    execSync(cmd1);
    console.log('✅ Captura Dashboard Frontend generada:', outDashboardPng);
} catch (e) {
    console.error('Error generando captura dashboard:', e.message);
}

// 2. HTML y Captura para Backend (Visual Studio Code / Estructura de Rutas y Código)
const htmlBackend = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #1e1e1e; color: #cccccc; font-size: 13px; }
        .vscode-window { width: 1200px; height: 700px; display: flex; flex-direction: column; border: 1px solid #333333; }
        
        .titlebar { background: #323233; padding: 6px 14px; font-size: 12px; color: #cccccc; display: flex; justify-content: space-between; border-bottom: 1px solid #252526; }
        .main-body { display: flex; flex: 1; overflow: hidden; }
        
        .activity-bar { width: 48px; background: #333333; display: flex; flex-direction: column; align-items: center; padding: 10px 0; gap: 15px; font-size: 18px; color: #858585; }
        .activity-bar .active { color: #ffffff; border-left: 2px solid #ffffff; width: 100%; text-align: center; }

        .sidebar { width: 260px; background: #252526; border-right: 1px solid #1e1e1e; font-size: 12px; }
        .sidebar-title { padding: 8px 12px; font-weight: bold; text-transform: uppercase; font-size: 11px; color: #bbbbbb; }
        .file-tree { padding: 4px 0; line-height: 1.8; font-family: 'Consolas', monospace; }
        .tree-item { padding: 2px 14px; display: flex; align-items: center; gap: 6px; }
        .tree-item:hover { background: #2a2d2e; }
        .tree-item.selected { background: #37373d; color: #ffffff; }

        .editor { flex: 1; display: flex; flex-direction: column; background: #1e1e1e; }
        .tabs { background: #252526; display: flex; border-bottom: 1px solid #1e1e1e; }
        .tab { padding: 8px 14px; font-size: 12px; color: #969696; display: flex; align-items: center; gap: 8px; border-right: 1px solid #1e1e1e; }
        .tab.active { background: #1e1e1e; color: #ffffff; border-top: 1px solid #007acc; }

        .code-area { flex: 1; padding: 14px; font-family: 'Fira Code', 'Consolas', monospace; font-size: 12px; line-height: 1.6; color: #d4d4d4; }
        .kwd { color: #c586c0; font-weight: bold; }
        .fn { color: #dcdcaa; }
        .str { color: #ce9178; }
        .var { color: #9cdcfe; }
        .comment { color: #6a9955; font-style: italic; }
        .sql { color: #4ec9b0; }
    </style>
</head>
<body>
    <div class="vscode-window">
        <div class="titlebar">
            <span>Visual Studio Code — routes/productos.js - proyecto7 (LocalMarket Backend)</span>
            <span>Node.js v20.x | Express.js 4.x | PostgreSQL 18</span>
        </div>
        <div class="main-body">
            <div class="activity-bar">
                <div class="active">📁</div>
                <div>🔍</div>
                <div>⚡</div>
                <div>📦</div>
            </div>
            <div class="sidebar">
                <div class="sidebar-title">Explorador: proyecto7</div>
                <div class="file-tree">
                    <div class="tree-item">📁 public/</div>
                    <div class="tree-item" style="padding-left: 26px;">📄 dashboard.html</div>
                    <div class="tree-item" style="padding-left: 26px;">📄 dashboard.js</div>
                    <div class="tree-item">📁 routes/</div>
                    <div class="tree-item" style="padding-left: 26px;">📄 admin.js</div>
                    <div class="tree-item" style="padding-left: 26px;">📄 detalle_venta.js</div>
                    <div class="tree-item" style="padding-left: 26px;">📄 otp.js</div>
                    <div class="tree-item" style="padding-left: 26px;">📄 pedidos_ventas.js</div>
                    <div class="tree-item selected" style="padding-left: 26px;">📄 productos.js</div>
                    <div class="tree-item" style="padding-left: 26px;">📄 usuarios.js</div>
                    <div class="tree-item">📁 scripts/</div>
                    <div class="tree-item" style="padding-left: 26px;">📄 objetos_bd.sql</div>
                    <div class="tree-item">📄 db.js (Pool PostgreSQL)</div>
                    <div class="tree-item">📄 server.js (API Central)</div>
                    <div class="tree-item">📄 package.json</div>
                </div>
            </div>
            <div class="editor">
                <div class="tabs">
                    <div class="tab active"><span>JS</span> productos.js</div>
                    <div class="tab"><span>JS</span> usuarios.js</div>
                    <div class="tab"><span>JS</span> pedidos_ventas.js</div>
                    <div class="tab"><span>JS</span> db.js</div>
                </div>
                <div class="code-area">
                    <span class="comment">// Controlador REST para Gestión Comercial de Productos y Catálogo</span><br>
                    <span class="kwd">const</span> <span class="var">express</span> = <span class="fn">require</span>(<span class="str">'express'</span>);<br>
                    <span class="kwd">const</span> <span class="var">router</span> = <span class="var">express</span>.<span class="fn">Router</span>();<br>
                    <span class="kwd">const</span> <span class="var">db</span> = <span class="fn">require</span>(<span class="str">'../db'</span>);<br><br>
                    <span class="comment">// GET /api/productos - Obtener catálogo enriquecido con categoría y margen calculado</span><br>
                    <span class="var">router</span>.<span class="fn">get</span>(<span class="str">'/'</span>, <span class="kwd">async</span> (<span class="var">req</span>, <span class="var">res</span>) => {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span class="kwd">try</span> {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kwd">const</span> <span class="var">query</span> = <span class="str">\`SELECT p.id_producto, p.titulo, p.descripcion, p.precio, p.costo_unitario, p.stock,<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ROUND(((p.precio - p.costo_unitario)/p.precio)*100, 2) AS margen_porcentaje,<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.nombre as categoria_nombre, u.nombre as vendedor_nombre<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FROM productos p<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LEFT JOIN categorias c ON p.id_categoria = c.id_categoria<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LEFT JOIN usuarios u ON p.id_vendedor = u.id_usuario<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ORDER BY p.id_producto ASC\`</span>;<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kwd">const</span> <span class="var">result</span> = <span class="kwd">await</span> <span class="var">db</span>.<span class="fn">query</span>(<span class="var">query</span>);<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="var">res</span>.<span class="fn">status</span>(<span class="str">200</span>).<span class="fn">json</span>({ <span class="var">success</span>: <span class="kwd">true</span>, <span class="var">data</span>: <span class="var">result</span>.<span class="var">rows</span> });<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;} <span class="kwd">catch</span> (<span class="var">error</span>) {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="var">res</span>.<span class="fn">status</span>(<span class="str">500</span>).<span class="fn">json</span>({ <span class="var">success</span>: <span class="kwd">false</span>, <span class="var">error</span>: <span class="var">error</span>.<span class="var">message</span> });<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;}<br>
                    });<br><br>
                    <span class="var">module</span>.<span class="var">exports</span> = <span class="var">router</span>;
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

const tempBackendHtml = path.join(__dirname, '..', 'temp_backend.html');
fs.writeFileSync(tempBackendHtml, htmlBackend, 'utf8');
const outBackendPng = path.join(__dirname, '..', 'captura_backend_codigo.png');

try {
    const cmd2 = `"${edgePath}" --headless --disable-gpu --screenshot="${outBackendPng}" --window-size=1200,700 "${tempBackendHtml}"`;
    execSync(cmd2);
    console.log('✅ Captura Backend Código generada:', outBackendPng);
    fs.unlinkSync(tempBackendHtml);
} catch (e) {
    console.error('Error generando captura backend:', e.message);
}

// 3. Diagrama de Flujo para Algoritmos de Análisis
const htmlAlgoritmos = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #f8fafc; padding: 25px; }
        
        .diagram-container { width: 1150px; background: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 25px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        .main-title { text-align: center; font-size: 20px; font-weight: 800; color: #38bdf8; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }

        .algo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .algo-card { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; }
        .algo-card-title { font-size: 13px; font-weight: 700; color: #38bdf8; border-bottom: 2px solid #2563eb; padding-bottom: 6px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }

        .step-box { background: #1e293b; border: 1px solid #475569; border-radius: 6px; padding: 10px; margin-bottom: 8px; font-size: 11px; line-height: 1.4; }
        .step-num { display: inline-block; background: #2563eb; color: white; border-radius: 50%; width: 18px; height: 18px; text-align: center; line-height: 18px; font-size: 10px; font-weight: bold; margin-right: 6px; }
        .step-cond { background: #78350f; border-color: #d97706; color: #fef3c7; }
        .step-act { background: #064e3b; border-color: #059669; color: #d1fae5; }
        .step-err { background: #7f1d1d; border-color: #dc2626; color: #fee2e2; }

        .arrow-down { text-align: center; color: #64748b; font-size: 14px; margin: 2px 0 6px 0; }
    </style>
</head>
<body>
    <div class="diagram-container">
        <div class="main-title">Arquitectura de Ejecución de Algoritmos de Análisis (LocalMarket)</div>
        <div class="algo-grid">
            
            <!-- ALGO 1: VENTA ACID -->
            <div class="algo-card">
                <div class="algo-card-title"><span>🛒</span> 1. Transacción Atómica de Venta</div>
                <div class="step-box"><span class="step-num">1</span> <strong>Petición Checkout:</strong> Cliente envía <code>id_pedido, id_producto, cantidad</code>.</div>
                <div class="arrow-down">▼</div>
                <div class="step-box step-cond"><span class="step-num">2</span> <strong>Validación de Existencia:</strong> <code>IF stock >= cantidad</code> en tabla <code>productos</code>.</div>
                <div class="arrow-down">▼</div>
                <div class="step-box step-act"><span class="step-num">3</span> <strong>Ejecución Atómica:</strong> Inserta en <code>detalle_venta</code> y resta stock de <code>productos</code>.</div>
                <div class="arrow-down">▼</div>
                <div class="step-box step-act"><span class="step-num">4</span> <strong>Trigger Reactivo:</strong> <code>trg_actualizar_total_pedido</code> recalcula total de orden.</div>
            </div>

            <!-- ALGO 2: ALERTA STOCK Y REORDEN -->
            <div class="algo-card">
                <div class="algo-card-title"><span>⚠️</span> 2. Detección de Stock Crítico y Reorden</div>
                <div class="step-box"><span class="step-num">1</span> <strong>Monitoreo Automático:</strong> Vista <code>vw_alerta_stock_critico</code> evalúa <code>stock <= 5</code>.</div>
                <div class="arrow-down">▼</div>
                <div class="step-box step-cond"><span class="step-num">2</span> <strong>Cálculo de Déficit:</strong> <code>unidades_a_pedir = 20 - stock</code>.</div>
                <div class="arrow-down">▼</div>
                <div class="step-box step-act"><span class="step-num">3</span> <strong>Presupuesto Reorden:</strong> <code>costo_reorden = unidades * costo_unitario</code>.</div>
                <div class="arrow-down">▼</div>
                <div class="step-box step-err"><span class="step-num">4</span> <strong>Disparador Trigger:</strong> Emite aviso formal <code>trg_auditar_agotamiento_stock</code> si stock = 0.</div>
            </div>

            <!-- ALGO 3: OTP 2FA MITIGACIÓN -->
            <div class="algo-card">
                <div class="algo-card-title"><span>🔐</span> 3. Mitigación de Fuerza Bruta en OTP</div>
                <div class="step-box"><span class="step-num">1</span> <strong>Entrada de Token:</strong> Usuario ingresa token de 6 dígitos.</div>
                <div class="arrow-down">▼</div>
                <div class="step-box step-cond"><span class="step-num">2</span> <strong>Verificación Umbral:</strong> <code>IF intentos_fallidos >= 3</code> en tabla <code>verificaciones_otp</code>.</div>
                <div class="arrow-down">▼</div>
                <div class="step-box step-err"><span class="step-num">3</span> <strong>Bloqueo Inmediato:</strong> Suspende autenticación y activa periodo de enfriamiento.</div>
                <div class="arrow-down">▼</div>
                <div class="step-box step-act"><span class="step-num">4</span> <strong>Éxito Criptográfico:</strong> Token coincide &rarr; Marca <code>otp_verificado = true</code> y resetea a 0.</div>
            </div>

        </div>
    </div>
</body>
</html>`;

const tempAlgoHtml = path.join(__dirname, '..', 'temp_algoritmos.html');
fs.writeFileSync(tempAlgoHtml, htmlAlgoritmos, 'utf8');
const outAlgoPng = path.join(__dirname, '..', 'diagrama_algoritmos_analisis.png');

try {
    const cmd3 = `"${edgePath}" --headless --disable-gpu --screenshot="${outAlgoPng}" --window-size=1200,600 "${tempAlgoHtml}"`;
    execSync(cmd3);
    console.log('✅ Diagrama Algoritmos de Análisis generado:', outAlgoPng);
    fs.unlinkSync(tempAlgoHtml);
} catch (e) {
    console.error('Error generando diagrama algoritmos:', e.message);
}
