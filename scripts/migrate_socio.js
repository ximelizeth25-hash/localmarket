const db = require('../config/db');

async function migrate() {
    console.log('--- Iniciando Migración PostgreSQL (Socio & Pedidos) ---');

    // 1. Columnas en usuarios
    await db.query(`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS numero_socio INTEGER UNIQUE;`);
    console.log('✅ Columna numero_socio agregada/verificada en usuarios.');

    // 2. Columnas en pedidos y pedidos_ventas
    await db.query(`ALTER TABLE pedidos_ventas ADD COLUMN IF NOT EXISTS numero_socio_atencion INTEGER;`);
    await db.query(`CREATE TABLE IF NOT EXISTS pedidos (LIKE pedidos_ventas INCLUDING ALL);`);
    await db.query(`ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS numero_socio_atencion INTEGER;`);
    console.log('✅ Columna numero_socio_atencion agregada/verificada en pedidos y pedidos_ventas.');

    // 3. Verificar si existe columna 'rol' en usuarios
    const uCols = await db.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'usuarios'
    `);
    const colNames = uCols.rows.map(r => r.column_name);
    console.log('Columnas actuales en usuarios:', colNames);

    if (colNames.includes('rol')) {
        await db.query(`UPDATE usuarios SET rol = 'Socio' WHERE rol = 'Vendedor';`);
        console.log('✅ Registros actualizados de Vendedor a Socio en columna rol.');
    }

    // 4. Actualizar tabla roles
    await db.query(`
        UPDATE roles 
        SET nombre_rol = 'Socio', descripcion = 'Socio productor / atención a clientes'
        WHERE nombre_rol = 'Vendedor' OR id_rol = 2;
    `);
    console.log('✅ Tabla roles actualizada a Socio.');

    // 5. Asignar numero_socio = 1 a Gisela (id_usuario 2) si no lo tiene
    const socioRes = await db.query(`
        SELECT u.id_usuario, u.nombre, u.numero_socio
        FROM usuarios u
        WHERE u.id_rol = 2 OR u.id_usuario = 2
    `);
    for (const s of socioRes.rows) {
        if (!s.numero_socio) {
            await db.query(`UPDATE usuarios SET numero_socio = 1, estado_cuenta = 'activo' WHERE id_usuario = $1`, [s.id_usuario]);
            console.log(`✅ Socio ${s.nombre} asignado con numero_socio: #1 y activado.`);
        }
    }

    // 6. Reportar usuarios y roles
    const users = await db.query(`
        SELECT u.id_usuario, u.nombre, u.correo, u.numero_socio, r.nombre_rol, u.estado_cuenta, u.telefono
        FROM usuarios u
        LEFT JOIN roles r ON u.id_rol = r.id_rol
    `);
    console.log('Usuarios en base de datos:', users.rows);

    const rolesFinales = await db.query(`SELECT * FROM roles`);
    console.log('Roles en base de datos:', rolesFinales.rows);

    console.log('--- Migración completada con éxito ---');
    process.exit(0);
}

migrate().catch(e => {
    console.error('Error en migración:', e);
    process.exit(1);
});
