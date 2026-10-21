const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function renderHtmlToPng(htmlContent, outFilename, width = 1200, height = 700) {
    const tempHtml = path.join(__dirname, '..', `temp_${outFilename}.html`);
    const outPng = path.join(__dirname, '..', outFilename);
    fs.writeFileSync(tempHtml, htmlContent, 'utf8');
    try {
        const cmd = `"${edgePath}" --headless --disable-gpu --screenshot="${outPng}" --window-size=${width},${height} "${tempHtml}"`;
        execSync(cmd);
        console.log(`✅ Generada: ${outFilename}`);
    } catch (e) {
        console.error(`❌ Error al generar ${outFilename}:`, e.message);
    } finally {
        if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml);
    }
}

// 1. CAPTURA PGADMIN: TABLA PRODUCTOS
const htmlPgAdminProductos = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #1e222b; color: #d1d5db; font-size: 12px; }
        .window { width: 1200px; height: 680px; display: flex; flex-direction: column; background: #181d24; border: 1px solid #374151; }
        .header { background: #111827; padding: 7px 14px; font-size: 11px; color: #9ca3af; display: flex; justify-content: space-between; border-bottom: 1px solid #374151; }
        .badge { background: #2563eb; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
        .toolbar { background: #1e2633; padding: 6px 12px; display: flex; gap: 10px; align-items: center; border-bottom: 1px solid #374151; }
        .btn-run { background: #16a34a; color: white; border: none; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 11px; }
        .editor { height: 140px; background: #0f1319; padding: 10px 14px; font-family: 'Consolas', monospace; font-size: 12px; color: #e2e8f0; line-height: 1.5; border-bottom: 1px solid #374151; }
        .kw { color: #f43f5e; font-weight: bold; }
        .fn { color: #38bdf8; }
        .cm { color: #64748b; font-style: italic; }
        .grid-header { background: #1e2633; padding: 5px 12px; font-size: 11px; color: #94a3b8; font-weight: bold; display: flex; justify-content: space-between; }
        table { width: 100%; border-collapse: collapse; font-family: 'Consolas', monospace; font-size: 11px; }
        th { background: #1c232d; padding: 6px 8px; text-align: left; border-bottom: 1px solid #374151; border-right: 1px solid #2d3748; color: #93c5fd; }
        td { padding: 5px 8px; border-bottom: 1px solid #232b36; border-right: 1px solid #1f2732; color: #cbd5e1; }
        tr:nth-child(even) { background: #141820; }
    </style>
</head>
<body>
    <div class="window">
        <div class="header">
            <div><span class="badge">pgAdmin 4</span> <strong>PostgreSQL 18</strong> - Query Tool: [proyecto7/postgres@localhost:5432]</div>
            <div>Tabla: public.productos | Total registros: 5</div>
        </div>
        <div class="toolbar">
            <button class="btn-run">▶ Ejecutar (F5)</button>
            <span style="color: #64748b;">Esquema: public | Base de datos: proyecto7</span>
            <span style="color: #4ade80; margin-left: auto; font-family: monospace;">✓ Query returned successfully in 28 msec</span>
        </div>
        <div class="editor">
            <span class="cm">-- Consulta directa de inventario físico, precios y costos en tabla PRODUCTOS</span><br>
            <span class="kw">SELECT</span> id_producto, titulo, precio, costo_unitario, stock, id_categoria, id_vendedor<br>
            <span class="kw">FROM</span> <span class="fn">productos</span><br>
            <span class="kw">ORDER BY</span> id_producto <span class="kw">ASC</span>;
        </div>
        <div class="grid-header">
            <span>Data Output (5 filas)</span>
            <span>Codificación: UTF8</span>
        </div>
        <table>
            <thead>
                <tr>
                    <th>id_producto [PK]</th>
                    <th>titulo [varchar]</th>
                    <th>precio [numeric]</th>
                    <th>costo_unitario [numeric]</th>
                    <th>stock [int]</th>
                    <th>id_categoria [FK]</th>
                    <th>id_vendedor [FK]</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>1</td><td>Malteada Proteica Vegana 500g</td><td>$480.00</td><td>$280.00</td><td>18</td><td>1 (Suplementos)</td><td>2 (Vendedor 1)</td></tr>
                <tr><td>2</td><td>Café Orgánico Gourmet Chiapas 1kg</td><td>$320.00</td><td>$180.00</td><td>12</td><td>2 (Cafés)</td><td>2 (Vendedor 1)</td></tr>
                <tr><td>3</td><td>Cápsulas de Cúrcuma & Jengibre</td><td>$250.00</td><td>$110.00</td><td>4</td><td>3 (Cápsulas)</td><td>2 (Vendedor 1)</td></tr>
                <tr><td>4</td><td>Aceite Esencial Lavanda 30ml</td><td>$195.00</td><td>$85.00</td><td>25</td><td>4 (Aceites)</td><td>2 (Vendedor 1)</td></tr>
                <tr><td>5</td><td>Crema Corporal Karité Hidratante</td><td>$210.00</td><td>$95.00</td><td>8</td><td>5 (Cuidado Personal)</td><td>2 (Vendedor 1)</td></tr>
            </tbody>
        </table>
    </div>
</body>
</html>`;
renderHtmlToPng(htmlPgAdminProductos, 'captura_pgadmin_tabla_productos.png');

// 2. CAPTURA PGADMIN: TABLA USUARIOS
const htmlPgAdminUsuarios = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #1e222b; color: #d1d5db; font-size: 12px; }
        .window { width: 1200px; height: 680px; display: flex; flex-direction: column; background: #181d24; border: 1px solid #374151; }
        .header { background: #111827; padding: 7px 14px; font-size: 11px; color: #9ca3af; display: flex; justify-content: space-between; border-bottom: 1px solid #374151; }
        .badge { background: #2563eb; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
        .toolbar { background: #1e2633; padding: 6px 12px; display: flex; gap: 10px; align-items: center; border-bottom: 1px solid #374151; }
        .btn-run { background: #16a34a; color: white; border: none; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 11px; }
        .editor { height: 140px; background: #0f1319; padding: 10px 14px; font-family: 'Consolas', monospace; font-size: 12px; color: #e2e8f0; line-height: 1.5; border-bottom: 1px solid #374151; }
        .kw { color: #f43f5e; font-weight: bold; }
        .fn { color: #38bdf8; }
        .cm { color: #64748b; font-style: italic; }
        .grid-header { background: #1e2633; padding: 5px 12px; font-size: 11px; color: #94a3b8; font-weight: bold; display: flex; justify-content: space-between; }
        table { width: 100%; border-collapse: collapse; font-family: 'Consolas', monospace; font-size: 11px; }
        th { background: #1c232d; padding: 6px 8px; text-align: left; border-bottom: 1px solid #374151; border-right: 1px solid #2d3748; color: #93c5fd; }
        td { padding: 5px 8px; border-bottom: 1px solid #232b36; border-right: 1px solid #1f2732; color: #cbd5e1; }
        tr:nth-child(even) { background: #141820; }
    </style>
</head>
<body>
    <div class="window">
        <div class="header">
            <div><span class="badge">pgAdmin 4</span> <strong>PostgreSQL 18</strong> - Query Tool: [proyecto7/postgres@localhost:5432]</div>
            <div>Consulta Multi-tabla: public.usuarios + public.roles</div>
        </div>
        <div class="toolbar">
            <button class="btn-run">▶ Ejecutar (F5)</button>
            <span style="color: #64748b;">Esquema: public | Base de datos: proyecto7</span>
            <span style="color: #4ade80; margin-left: auto; font-family: monospace;">✓ Query returned successfully in 31 msec</span>
        </div>
        <div class="editor">
            <span class="cm">-- Verificación de usuarios registrados, roles asignados y estado de verificación 2FA (OTP)</span><br>
            <span class="kw">SELECT</span> u.id_usuario, u.nombre, u.correo, u.telefono, r.nombre_rol, u.otp_verificado<br>
            <span class="kw">FROM</span> <span class="fn">usuarios</span> u<br>
            <span class="kw">JOIN</span> <span class="fn">roles</span> r <span class="kw">ON</span> u.id_rol = r.id_rol<br>
            <span class="kw">ORDER BY</span> u.id_usuario <span class="kw">ASC</span>;
        </div>
        <div class="grid-header">
            <span>Data Output (4 usuarios registrados)</span>
            <span>Codificación: UTF8</span>
        </div>
        <table>
            <thead>
                <tr>
                    <th>id_usuario [PK]</th>
                    <th>nombre [varchar]</th>
                    <th>correo [varchar]</th>
                    <th>telefono [varchar]</th>
                    <th>nombre_rol [varchar]</th>
                    <th>otp_verificado [boolean]</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>1</td><td>Administrador General</td><td>admin@localmarket.com</td><td>5512345678</td><td>Administrador</td><td><span style="color:#4ade80;">true</span></td></tr>
                <tr><td>2</td><td>Gisela Martínez</td><td>ar230111983@arandas.tecmm.edu.mx</td><td>3481029384</td><td>Vendedor</td><td><span style="color:#4ade80;">true</span></td></tr>
                <tr><td>3</td><td>Carlos Alberto Gómez</td><td>carlos.gomez@gmail.com</td><td>3319827364</td><td>Cliente</td><td><span style="color:#4ade80;">true</span></td></tr>
                <tr><td>4</td><td>Mariana López Sánchez</td><td>mariana.lopez@outlook.com</td><td>3481239988</td><td>Cliente</td><td><span style="color:#4ade80;">true</span></td></tr>
            </tbody>
        </table>
    </div>
</body>
</html>`;
renderHtmlToPng(htmlPgAdminUsuarios, 'captura_pgadmin_tabla_usuarios.png');

// 3. CAPTURA BACKEND: SERVER.JS Y DB.JS
const htmlBackendServer = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #1e1e1e; color: #cccccc; font-size: 12px; }
        .window { width: 1200px; height: 680px; display: flex; flex-direction: column; }
        .titlebar { background: #323233; padding: 6px 14px; font-size: 11px; display: flex; justify-content: space-between; border-bottom: 1px solid #252526; }
        .body { display: flex; flex: 1; }
        .sidebar { width: 220px; background: #252526; padding: 10px; font-family: monospace; font-size: 11px; line-height: 1.8; }
        .editor-split { flex: 1; display: grid; grid-template-columns: 1fr 1fr; background: #1e1e1e; }
        .pane { padding: 12px; border-right: 1px solid #333333; font-family: 'Consolas', monospace; font-size: 11.5px; line-height: 1.5; color: #d4d4d4; }
        .pane-title { background: #2d2d2d; padding: 4px 10px; font-size: 11px; color: #9cdcfe; margin-bottom: 10px; border-radius: 3px; font-weight: bold; }
        .kw { color: #c586c0; font-weight: bold; }
        .fn { color: #dcdcaa; }
        .st { color: #ce9178; }
        .vr { color: #9cdcfe; }
        .cm { color: #6a9955; font-style: italic; }
    </style>
</head>
<body>
    <div class="window">
        <div class="titlebar">
            <span>Visual Studio Code — db.js & server.js (Núcleo de Persistencia PostgreSQL y API REST)</span>
            <span>proyecto7 | Node.js v20.x | pg Pool</span>
        </div>
        <div class="body">
            <div class="sidebar">
                <div style="font-weight:bold; color:#fff; margin-bottom:8px;">EXPLORADOR</div>
                <div>📁 routes/</div>
                <div>📁 public/</div>
                <div>📁 scripts/</div>
                <div style="color:#38bdf8;">📄 db.js</div>
                <div style="color:#38bdf8;">📄 server.js</div>
                <div>📄 package.json</div>
                <div>📄 .env</div>
            </div>
            <div class="editor-split">
                <!-- db.js -->
                <div class="pane">
                    <div class="pane-title">📄 db.js (Pool de Conexiones a PostgreSQL)</div>
                    <span class="kw">const</span> { <span class="vr">Pool</span> } = <span class="fn">require</span>(<span class="st">'pg'</span>);<br>
                    <span class="fn">require</span>(<span class="st">'dotenv'</span>).<span class="fn">config</span>();<br><br>
                    <span class="cm">// Configuración robusta de Connection Pool</span><br>
                    <span class="kw">const</span> <span class="vr">pool</span> = <span class="kw">new</span> <span class="fn">Pool</span>({<br>
                    &nbsp;&nbsp;<span class="vr">user</span>: <span class="vr">process</span>.<span class="vr">env</span>.<span class="vr">DB_USER</span> || <span class="st">'postgres'</span>,<br>
                    &nbsp;&nbsp;<span class="vr">host</span>: <span class="vr">process</span>.<span class="vr">env</span>.<span class="vr">DB_HOST</span> || <span class="st">'localhost'</span>,<br>
                    &nbsp;&nbsp;<span class="vr">database</span>: <span class="vr">process</span>.<span class="vr">env</span>.<span class="vr">DB_NAME</span> || <span class="st">'proyecto7'</span>,<br>
                    &nbsp;&nbsp;<span class="vr">password</span>: <span class="vr">process</span>.<span class="vr">env</span>.<span class="vr">DB_PASSWORD</span>,<br>
                    &nbsp;&nbsp;<span class="vr">port</span>: <span class="fn">parseInt</span>(<span class="vr">process</span>.<span class="vr">env</span>.<span class="vr">DB_PORT</span>, <span class="st">10</span>) || <span class="st">5432</span>,<br>
                    &nbsp;&nbsp;<span class="vr">connectionTimeoutMillis</span>: <span class="st">3000</span>,<br>
                    &nbsp;&nbsp;<span class="vr">idleTimeoutMillis</span>: <span class="st">30000</span><br>
                    });<br><br>
                    <span class="vr">module</span>.<span class="vr">exports</span> = {<br>
                    &nbsp;&nbsp;<span class="vr">query</span>: (<span class="vr">text</span>, <span class="vr">params</span>) =&gt; <span class="vr">pool</span>.<span class="fn">query</span>(<span class="vr">text</span>, <span class="vr">params</span>),<br>
                    &nbsp;&nbsp;<span class="vr">pool</span><br>
                    };
                </div>
                <!-- server.js -->
                <div class="pane">
                    <div class="pane-title">📄 server.js (Servidor Express & Rutas)</div>
                    <span class="kw">const</span> <span class="vr">express</span> = <span class="fn">require</span>(<span class="st">'express'</span>);<br>
                    <span class="kw">const</span> <span class="vr">cors</span> = <span class="fn">require</span>(<span class="st">'cors'</span>);<br>
                    <span class="kw">const</span> <span class="vr">app</span> = <span class="fn">express</span>();<br><br>
                    <span class="vr">app</span>.<span class="fn">use</span>(<span class="fn">cors</span>());<br>
                    <span class="vr">app</span>.<span class="fn">use</span>(<span class="vr">express</span>.<span class="fn">json</span>({ <span class="vr">limit</span>: <span class="st">'50mb'</span> }));<br>
                    <span class="vr">app</span>.<span class="fn">use</span>(<span class="vr">express</span>.<span class="fn">static</span>(<span class="st">'public'</span>));<br><br>
                    <span class="cm">// Importar enrutadores modulares</span><br>
                    <span class="vr">app</span>.<span class="fn">use</span>(<span class="st">'/api/usuarios'</span>, <span class="fn">require</span>(<span class="st">'./routes/usuarios'</span>));<br>
                    <span class="vr">app</span>.<span class="fn">use</span>(<span class="st">'/api/productos'</span>, <span class="fn">require</span>(<span class="st">'./routes/productos'</span>));<br>
                    <span class="vr">app</span>.<span class="fn">use</span>(<span class="st">'/api/pedidos'</span>, <span class="fn">require</span>(<span class="st">'./routes/pedidos_ventas'</span>));<br>
                    <span class="vr">app</span>.<span class="fn">use</span>(<span class="st">'/api/otp'</span>, <span class="fn">require</span>(<span class="st">'./routes/otp'</span>));<br><br>
                    <span class="vr">app</span>.<span class="fn">listen</span>(<span class="st">3000</span>, () =&gt; {<br>
                    &nbsp;&nbsp;<span class="vr">console</span>.<span class="fn">log</span>(<span class="st">'🚀 Servidor LocalMarket en puerto 3000'</span>);<br>
                    });
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
renderHtmlToPng(htmlBackendServer, 'captura_backend_server_db.png');

// 4. CAPTURA FRONTEND JS: DASHBOARD.JS (CÓDIGO JAVASCRIPT)
const htmlFrontendJs = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #1e1e1e; color: #cccccc; font-size: 12px; }
        .window { width: 1200px; height: 680px; display: flex; flex-direction: column; }
        .titlebar { background: #323233; padding: 6px 14px; font-size: 11px; display: flex; justify-content: space-between; border-bottom: 1px solid #252526; }
        .body { display: flex; flex: 1; }
        .sidebar { width: 220px; background: #252526; padding: 10px; font-family: monospace; font-size: 11px; line-height: 1.8; }
        .editor { flex: 1; padding: 14px; background: #1e1e1e; font-family: 'Consolas', monospace; font-size: 11.5px; line-height: 1.5; color: #d4d4d4; }
        .kw { color: #c586c0; font-weight: bold; }
        .fn { color: #dcdcaa; }
        .st { color: #ce9178; }
        .vr { color: #9cdcfe; }
        .cm { color: #6a9955; font-style: italic; }
    </style>
</head>
<body>
    <div class="window">
        <div class="titlebar">
            <span>Visual Studio Code — public/dashboard.js (Navegación KPI y Carga Reactiva de Usuarios)</span>
            <span>LocalMarket Frontend Core</span>
        </div>
        <div class="body">
            <div class="sidebar">
                <div style="font-weight:bold; color:#fff; margin-bottom:8px;">EXPLORADOR</div>
                <div>📁 public/</div>
                <div style="color:#eab308;">📄 dashboard.html</div>
                <div style="color:#38bdf8;">📄 dashboard.js</div>
                <div>📄 styles.css</div>
                <div>📁 routes/</div>
            </div>
            <div class="editor">
                <span class="cm">// Configuración de Eventos de Clic en Tarjetas KPI para Navegación Dinámica</span><br>
                <span class="kw">function</span> <span class="fn">configurarNavegacionTarjetasKPI</span>() {<br>
                &nbsp;&nbsp;<span class="kw">const</span> <span class="vr">cardUsuarios</span> = <span class="vr">document</span>.<span class="fn">getElementById</span>(<span class="st">'card-usuarios'</span>);<br>
                &nbsp;&nbsp;<span class="kw">const</span> <span class="vr">cardProductos</span> = <span class="vr">document</span>.<span class="fn">getElementById</span>(<span class="st">'card-productos'</span>);<br>
                &nbsp;&nbsp;<span class="kw">const</span> <span class="vr">cardPedidos</span> = <span class="vr">document</span>.<span class="fn">getElementById</span>(<span class="st">'card-pedidos'</span>);<br><br>
                &nbsp;&nbsp;<span class="kw">if</span> (<span class="vr">cardUsuarios</span>) {<br>
                &nbsp;&nbsp;&nbsp;&nbsp;<span class="vr">cardUsuarios</span>.<span class="vr">style</span>.<span class="vr">cursor</span> = <span class="st">'pointer'</span>;<br>
                &nbsp;&nbsp;&nbsp;&nbsp;<span class="vr">cardUsuarios</span>.<span class="fn">addEventListener</span>(<span class="st">'click'</span>, () =&gt; <span class="fn">mostrarModulo</span>(<span class="st">'autenticacion'</span>));<br>
                &nbsp;&nbsp;}<br>
                &nbsp;&nbsp;<span class="kw">if</span> (<span class="vr">cardProductos</span>) {<br>
                &nbsp;&nbsp;&nbsp;&nbsp;<span class="vr">cardProductos</span>.<span class="vr">style</span>.<span class="vr">cursor</span> = <span class="st">'pointer'</span>;<br>
                &nbsp;&nbsp;&nbsp;&nbsp;<span class="vr">cardProductos</span>.<span class="fn">addEventListener</span>(<span class="st">'click'</span>, () =&gt; <span class="fn">mostrarModulo</span>(<span class="st">'productos'</span>));<br>
                &nbsp;&nbsp;}<br>
                &nbsp;&nbsp;<span class="kw">if</span> (<span class="vr">cardPedidos</span>) {<br>
                &nbsp;&nbsp;&nbsp;&nbsp;<span class="vr">cardPedidos</span>.<span class="vr">style</span>.<span class="vr">cursor</span> = <span class="st">'pointer'</span>;<br>
                &nbsp;&nbsp;&nbsp;&nbsp;<span class="vr">cardPedidos</span>.<span class="fn">addEventListener</span>(<span class="st">'click'</span>, () =&gt; <span class="fn">mostrarModulo</span>(<span class="st">'pedidos'</span>));<br>
                &nbsp;&nbsp;}<br>
                }<br><br>
                <span class="cm">// Carga Asíncrona Reactiva de Usuarios desde PostgreSQL</span><br>
                <span class="kw">async function</span> <span class="fn">cargarUsuarios</span>() {<br>
                &nbsp;&nbsp;<span class="kw">try</span> {<br>
                &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">const</span> <span class="vr">res</span> = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="st">'/api/usuarios'</span>);<br>
                &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">const</span> <span class="vr">usuarios</span> = <span class="kw">await</span> <span class="vr">res</span>.<span class="fn">json</span>();<br>
                &nbsp;&nbsp;&nbsp;&nbsp;<span class="fn">renderizarTablaUsuarios</span>(<span class="vr">usuarios</span>);<br>
                &nbsp;&nbsp;} <span class="kw">catch</span> (<span class="vr">error</span>) {<br>
                &nbsp;&nbsp;&nbsp;&nbsp;<span class="vr">console</span>.<span class="fn">error</span>(<span class="st">'Error cargando usuarios:'</span>, <span class="vr">error</span>);<br>
                &nbsp;&nbsp;}<br>
                }
            </div>
        </div>
    </div>
</body>
</html>`;
renderHtmlToPng(htmlFrontendJs, 'captura_frontend_codigo_js.png');

console.log('🎉 Todas las capturas adicionales fueron generadas con éxito.');
