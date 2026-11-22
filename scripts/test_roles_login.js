const http = require('http');

function post(path, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        }, (res) => {
            let resData = '';
            res.on('data', chunk => resData += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(resData) });
                } catch (e) {
                    resolve({ status: res.statusCode, raw: resData });
                }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

function get(path) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET'
        }, (res) => {
            let resData = '';
            res.on('data', chunk => resData += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(resData) });
                } catch (e) {
                    resolve({ status: res.statusCode, raw: resData });
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function run() {
    console.log('--- 1. TEST LOGIN ADMINISTRADOR ---');
    const adminRes = await post('/api/login', {
        tipo_acceso: 'Administrador',
        identificador: 'admin@localmarket.com',
        password: '1234'
    });
    console.log('Admin Status:', adminRes.status, adminRes.body);

    console.log('\n--- 2. TEST LOGIN SOCIO (N° 1) ---');
    const socioRes = await post('/api/login', {
        tipo_acceso: 'Socio',
        identificador: '1',
        password: '4321'
    });
    console.log('Socio Status:', socioRes.status, socioRes.body);

    console.log('\n--- 3. TEST LOGIN CLIENTE (N° Socio 1) ---');
    const clienteRes = await post('/api/login', {
        tipo_acceso: 'Cliente',
        identificador: '1'
    });
    console.log('Cliente Status:', clienteRes.status, clienteRes.body);

    console.log('\n--- 4. TEST CREAR PEDIDO CON SOCIO DE ATENCION ---');
    const pedidoRes = await post('/api/pedidos_ventas', {
        id_comprador: 1,
        id_producto: 1,
        producto_titulo: 'Miel Pura de Abeja 500g',
        cantidad: 2,
        total: 190.00,
        direccion_entrega: 'Calle Reforma #100',
        comprador_nombre: 'Prueba Cliente',
        comprador_telefono: '3471046625',
        numero_socio_atencion: 1
    });
    console.log('Pedido Status:', pedidoRes.status, pedidoRes.body);

    console.log('\n--- 5. TEST GET PEDIDOS FILTRADOS POR SOCIO ---');
    const pedidosSocio = await get('/api/pedidos_ventas?numero_socio=1');
    console.log('Pedidos Socio Count:', pedidosSocio.body.data ? pedidosSocio.body.data.length : 0);
}

run().catch(console.error);
