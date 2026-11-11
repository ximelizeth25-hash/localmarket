const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CAPTURES_DIR = path.join(__dirname, '..', 'temp_capturas');
if (!fs.existsSync(CAPTURES_DIR)) {
    fs.mkdirSync(CAPTURES_DIR, { recursive: true });
}

const MODULES = [
    {
        filename: '01_login.png',
        url: 'http://localhost:3000/index.html',
        title: 'Inicio de Sesión y Acceso Seguro',
        action: null
    },
    {
        filename: '02_auth_usuarios.png',
        url: 'http://localhost:3000/dashboard.html?tab=mod_auth',
        title: 'Módulo 1: Autenticación y Gestión de Usuarios',
        action: null
    },
    {
        filename: '03_perfil.png',
        url: 'http://localhost:3000/dashboard.html?tab=mod_perfil',
        title: 'Módulo 2: Perfil de Usuario y Sesión Activa',
        action: null
    },
    {
        filename: '04_publicar_producto.png',
        url: 'http://localhost:3000/dashboard.html?tab=mod_publicar',
        title: 'Módulo 3: Publicación y Gestión de Productos',
        action: null
    },
    {
        filename: '05_catalogo.png',
        url: 'http://localhost:3000/dashboard.html?tab=mod_catalogo',
        title: 'Módulo 4: Catálogo de Productos y Filtros',
        action: null
    },
    {
        filename: '06_detalle_compra.png',
        url: 'http://localhost:3000/dashboard.html?tab=mod_catalogo',
        title: 'Módulo 5: Detalle de Producto y Carrito de Compra',
        action: async (send) => {
            // Esperar que carguen las tarjetas del catálogo y hacer clic en ver detalle
            await new Promise(r => setTimeout(r, 1200));
            await send('Runtime.evaluate', {
                expression: `(() => {
                    const btn = document.querySelector('.btn-ver-detalle') || document.querySelector('.btn-comprar-cat');
                    if (btn) {
                        btn.click();
                        return true;
                    }
                    if (window.switchTab) window.switchTab('mod_detalle');
                    return false;
                })()`
            });
            await new Promise(r => setTimeout(r, 800));
        }
    },
    {
        filename: '07_pedidos.png',
        url: 'http://localhost:3000/dashboard.html?tab=mod_pedidos',
        title: 'Módulo 6: Gestión y Seguimiento de Pedidos',
        action: null
    },
    {
        filename: '08_notificaciones.png',
        url: 'http://localhost:3000/dashboard.html?tab=mod_notificaciones',
        title: 'Módulo 7: Notificaciones en Tiempo Real',
        action: null
    },
    {
        filename: '09_seguridad_otp.png',
        url: 'http://localhost:3000/dashboard.html?tab=mod_seguridad',
        title: 'Módulo 8: Seguridad, Control de Bloqueos y OTP',
        action: null
    },
    {
        filename: '10_metricas_admin.png',
        url: 'http://localhost:3000/dashboard.html?tab=mod_admin',
        title: 'Módulo 9: Métricas Ejecutivas y Estadísticas',
        action: null
    },
    {
        filename: '11_control_rbac.png',
        url: 'http://localhost:3000/dashboard.html?tab=mod_moderacion',
        title: 'Módulo 10: Control RBAC y Moderación',
        action: null
    }
];

async function captureAll() {
    console.log('Iniciando captura automatizada de interfaces...');
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const chromeProc = spawn(chromePath, [
        '--headless=new',
        '--remote-debugging-port=9222',
        '--disable-gpu',
        '--window-size=1440,900',
        '--no-first-run',
        '--no-default-browser-check',
        'about:blank'
    ]);

    await new Promise(r => setTimeout(r, 1500));

    try {
        const listRes = await fetch('http://127.0.0.1:9222/json');
        const listData = await listRes.json();
        let target = listData.find(t => t.type === 'page');
        if (!target) {
            const newRes = await fetch('http://127.0.0.1:9222/json/new', { method: 'PUT' });
            target = await newRes.json();
        }

        const ws = new WebSocket(target.webSocketDebuggerUrl);
        let msgId = 1;
        const callbacks = new Map();

        function send(method, params = {}) {
            const id = msgId++;
            return new Promise((res, rej) => {
                callbacks.set(id, { res, rej });
                ws.send(JSON.stringify({ id, method, params }));
            });
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.id && callbacks.has(data.id)) {
                const { res, rej } = callbacks.get(data.id);
                callbacks.delete(data.id);
                if (data.error) rej(data.error);
                else res(data.result);
            }
        };

        await new Promise((resolve, reject) => {
            ws.onopen = resolve;
            ws.onerror = reject;
        });

        await send('Page.enable');
        await send('Runtime.enable');

        // Configurar usuario administrador en localStorage primero
        await send('Page.navigate', { url: 'http://localhost:3000/dashboard.html' });
        await new Promise(r => setTimeout(r, 1200));
        await send('Runtime.evaluate', {
            expression: `(() => {
                localStorage.setItem('currentUser', JSON.stringify({
                    id_usuario: 1,
                    id_rol: 1,
                    nombre: 'Administrador',
                    correo: 'admin@localmarket.com',
                    nombre_rol: 'Administrador',
                    foto_perfil: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160'
                }));
            })()`
        });

        for (const item of MODULES) {
            console.log(`Capturando: ${item.title} -> ${item.filename}`);
            await send('Page.navigate', { url: item.url });
            await new Promise(r => setTimeout(r, 1600));

            if (item.action) {
                await item.action(send);
            }

            // Capturar pantalla completa de la ventana
            const screenshot = await send('Page.captureScreenshot', {
                format: 'png',
                clip: {
                    x: 0,
                    y: 0,
                    width: 1440,
                    height: 900,
                    scale: 1
                }
            });

            const filePath = path.join(CAPTURES_DIR, item.filename);
            fs.writeFileSync(filePath, Buffer.from(screenshot.data, 'base64'));
            console.log(`✅ Guardado: ${filePath} (${fs.statSync(filePath).size} bytes)`);
        }

        ws.close();
        console.log('✨ Todas las capturas se generaron exitosamente.');

    } finally {
        chromeProc.kill();
    }
}

captureAll().catch(err => {
    console.error('Error durante la captura:', err);
    process.exit(1);
});
