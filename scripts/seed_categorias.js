const db = require('../config/db');

async function run() {
    const catsToAdd = [
        'Suplementos',
        'Cafés',
        'Cápsulas',
        'Aceites',
        'Cuidado Personal'
    ];

    for (const cat of catsToAdd) {
        const check = await db.query('SELECT id_categoria, nombre FROM CATEGORIAS WHERE LOWER(nombre) = LOWER($1)', [cat]);
        if (check.rows.length === 0) {
            const ins = await db.query('INSERT INTO CATEGORIAS (nombre, descripcion) VALUES ($1, $2) RETURNING id_categoria', [cat, 'Categoría ' + cat]);
            console.log(`Insertada: ${cat} (id: ${ins.rows[0].id_categoria})`);
        } else {
            console.log(`Existe: ${cat} (id: ${check.rows[0].id_categoria})`);
        }
    }

    // Actualizar productos existentes que se llamen 'Malteada' o 'Relife' a 'Suplementos'
    const suplem = await db.query("SELECT id_categoria FROM CATEGORIAS WHERE nombre = 'Suplementos' LIMIT 1");
    if (suplem.rows.length > 0) {
        const suplemId = suplem.rows[0].id_categoria;
        await db.query("UPDATE PRODUCTOS SET id_categoria = $1 WHERE titulo ILIKE '%malteada%' OR titulo ILIKE '%relife%'", [suplemId]);
        console.log(`Actualizados productos Malteada/Relife a categoría Suplementos (id: ${suplemId})`);
    }

    const all = await db.query('SELECT * FROM CATEGORIAS ORDER BY id_categoria');
    console.log('Categorías en BD:', all.rows);
    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
