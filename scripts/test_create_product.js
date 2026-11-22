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
    console.log('--- 1. CREAR PRODUCTO EN SUPLEMENTOS ---');
    const p1 = await post('/api/productos', {
        id_vendedor: 1,
        titulo: 'Proteína Isolatada Test',
        categoria_nombre: 'Suplementos',
        id_categoria: 'Suplementos',
        precio: 450.00,
        costo_unitario: 250.00,
        stock: 12,
        descripcion: 'Proteína aislada de suero de leche de alta pureza'
    });
    console.log('P1 Response:', p1.status, p1.body);

    console.log('\n--- 2. CREAR PRODUCTO EN FRUTAS Y VERDURAS ---');
    const p2 = await post('/api/productos', {
        id_vendedor: 1,
        titulo: 'Aguacates Hass Orgánicos 1kg',
        categoria_nombre: 'Frutas y Verduras',
        id_categoria: 'Frutas y Verduras',
        precio: 85.00,
        costo_unitario: 45.00,
        stock: 20,
        descripcion: 'Aguacates de exportación cultivados sin agroquímicos'
    });
    console.log('P2 Response:', p2.status, p2.body);

    console.log('\n--- 3. CONSULTAR GET /api/productos ---');
    const list = await get('/api/productos');
    console.log('Total productos:', list.body.data.length);
    console.log('Primeros 4 productos:');
    list.body.data.slice(0, 4).forEach(p => {
        console.log(`- #${p.id_producto}: ${p.titulo} | Cat: ${p.categoria_nombre} (id: ${p.id_categoria}) | Stock: ${p.stock}`);
    });
}

run().catch(console.error);
