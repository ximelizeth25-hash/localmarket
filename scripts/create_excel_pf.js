const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function buildExcel() {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Ingeniería de Software - Métricas de Software';
    workbook.lastModifiedBy = 'LocalMarket';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Paleta de colores profesionales
    const darkBlueHeaderFill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E3A8A' } // Azul oscuro elegante
    };
    const tableHeaderFill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0F172A' } // Slate 900
    };
    const subtotalFill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2E8F0' } // Gris suave
    };
    const totalBoxFill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDBEAFE' } // Azul claro suave
    };

    const headerFont = {
        name: 'Segoe UI',
        size: 9.5,
        bold: true,
        color: { argb: 'FFFFFFFF' }
    };
    const titleFont = {
        name: 'Segoe UI',
        size: 13,
        bold: true,
        color: { argb: 'FF0F172A' }
    };
    const regularFont = {
        name: 'Segoe UI',
        size: 9,
        color: { argb: 'FF1E293B' }
    };
    const boldFont = {
        name: 'Segoe UI',
        size: 9,
        bold: true,
        color: { argb: 'FF0F172A' }
    };

    const thinBorder = {
        top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    };

    // ==========================================
    // HOJA 1: PUNTOS DE FUNCIÓN NO AJUSTADOS (PFNA)
    // ==========================================
    const ws1 = workbook.addWorksheet('PF No Ajustados', {
        views: [{ showGridLines: true }]
    });

    ws1.columns = [
        { key: 'col1', width: 8 },
        { key: 'col2', width: 38 },
        { key: 'col3', width: 28 },
        { key: 'col4', width: 14 },
        { key: 'col5', width: 12 },
        { key: 'col6', width: 12 }
    ];

    // Título Principal
    ws1.mergeCells('A1:F1');
    ws1.getCell('A1').value = 'ANÁLISIS DE PUNTOS DE FUNCIÓN NO AJUSTADOS (PFNA)';
    ws1.getCell('A1').font = titleFont;
    ws1.getCell('A1').alignment = { vertical: 'middle', horizontal: 'left' };
    ws1.getRow(1).height = 25;

    ws1.mergeCells('A2:F2');
    ws1.getCell('A2').value = 'Base de Datos de 7 Tablas: Alumno, Estado, Pago, Materia, Cursa, Becado, Discapacitado | Metodología IFPUG / Albrecht';
    ws1.getCell('A2').font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FF64748B' } };
    ws1.getRow(2).height = 18;

    let currentRow = 4;

    function renderComponentTable(title, headers, rowsData, subtotalLabel) {
        // Título de la sección
        ws1.mergeCells(`A${currentRow}:F${currentRow}`);
        ws1.getCell(`A${currentRow}`).value = title;
        ws1.getCell(`A${currentRow}`).font = { name: 'Segoe UI', size: 10.5, bold: true, color: { argb: 'FF1E3A8A' } };
        currentRow++;

        // Encabezados
        const headerRowIndex = currentRow;
        const hRow = ws1.getRow(headerRowIndex);
        hRow.values = headers;
        hRow.height = 20;
        for (let col = 1; col <= 6; col++) {
            const cell = hRow.getCell(col);
            cell.fill = darkBlueHeaderFill;
            cell.font = headerFont;
            cell.alignment = { vertical: 'middle', horizontal: col === 1 || col >= 4 ? 'center' : 'left' };
            cell.border = thinBorder;
        }
        currentRow++;

        const startDataRow = currentRow;
        rowsData.forEach((r, idx) => {
            const row = ws1.getRow(currentRow);
            row.values = [idx + 1, r[0], r[1], r[2], r[3], r[4]];
            row.height = 18;
            for (let col = 1; col <= 6; col++) {
                const cell = row.getCell(col);
                cell.font = regularFont;
                cell.border = thinBorder;
                cell.alignment = { vertical: 'middle', horizontal: col === 1 || col >= 4 ? 'center' : 'left' };
                if (idx % 2 === 1) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
                }
            }
            currentRow++;
        });
        const endDataRow = currentRow - 1;

        // Fila de Subtotal
        const subRowIndex = currentRow;
        const subRow = ws1.getRow(subRowIndex);
        ws1.mergeCells(`A${subRowIndex}:E${subRowIndex}`);
        ws1.getCell(`A${subRowIndex}`).value = subtotalLabel;
        ws1.getCell(`A${subRowIndex}`).font = boldFont;
        ws1.getCell(`A${subRowIndex}`).alignment = { vertical: 'middle', horizontal: 'right' };

        const subtotalCell = ws1.getCell(`F${subRowIndex}`);
        subtotalCell.value = { formula: `SUM(F${startDataRow}:F${endDataRow})` };
        subtotalCell.font = boldFont;
        subtotalCell.alignment = { vertical: 'middle', horizontal: 'center' };

        for (let col = 1; col <= 6; col++) {
            const cell = subRow.getCell(col);
            cell.fill = subtotalFill;
            cell.border = thinBorder;
        }
        subRow.height = 20;
        currentRow += 2; // Espacio entre tablas

        return `F${subRowIndex}`;
    }

    // 1. Entradas (EI)
    const subtotalEI_Cell = renderComponentTable(
        '1. ENTRADAS EXTERNAS (EI) - Transacciones que agregan, modifican o eliminan datos',
        ['Núm.', 'Entrada (Transacción)', 'Archivos referidos (FTR)', 'Elementos datos (DET)', 'Nivel', 'Valor'],
        [
            ['Registrar Alumno (Alta)', '2 (Alumno, Estado)', 7, 'Medio', 4],
            ['Modificar Alumno', '2 (Alumno, Estado)', 7, 'Medio', 4],
            ['Eliminar Alumno (Baja)', '1 (Alumno)', 2, 'Bajo', 3],
            ['Registrar Pago', '2 (Pago, Alumno)', 5, 'Medio', 4],
            ['Registrar Materia', '1 (Materia)', 3, 'Bajo', 3],
            ['Asignar Cursa (Inscripción)', '3 (Cursa, Alumno, Materia)', 3, 'Medio', 4],
            ['Registrar Becado', '2 (Becado, Alumno)', 3, 'Bajo', 3],
            ['Registrar Discapacitado', '2 (Discapacitado, Alumno)', 3, 'Bajo', 3],
            ['Registrar Estado', '1 (Estado)', 2, 'Bajo', 3]
        ],
        'Subtotal Entradas (EI)'
    );

    // 2. Salidas (EO)
    const subtotalEO_Cell = renderComponentTable(
        '2. SALIDAS EXTERNAS (EO) - Reportes e informes con cálculos derivados',
        ['Núm.', 'Salida (Informe calculado)', 'Archivos referidos (FTR)', 'Elementos datos (DET)', 'Nivel', 'Valor'],
        [
            ['Estado de Cuenta y Saldos (Cargos - Becas - Pagos)', '4 (Alumno, Pago, Cursa, Becado)', 8, 'Alto', 7],
            ['Carga Académica con Costos y Descuento', '4 (Alumno, Cursa, Materia, Becado)', 7, 'Alto', 7],
            ['Informe Estadístico de Becas y Descuentos %', '3 (Becado, Alumno, Materia)', 6, 'Medio', 5]
        ],
        'Subtotal Salidas (EO)'
    );

    // 3. Peticiones (EQ)
    const subtotalEQ_Cell = renderComponentTable(
        '3. PETICIONES EXTERNAS (EQ) - Consultas directas sin cálculos matemáticos',
        ['Núm.', 'Petición (Consulta / Listado)', 'Archivos referidos (FTR)', 'Elementos datos (DET)', 'Nivel', 'Valor'],
        [
            ['Consulta de Alumno por Matrícula (Ficha)', '2 (Alumno, Estado)', 8, 'Medio', 4],
            ['Catálogo de Materias', '1 (Materia)', 3, 'Bajo', 3],
            ['Historial de Pagos de Alumno', '2 (Pago, Alumno)', 5, 'Bajo', 3],
            ['Listado de Alumnos Becados', '2 (Becado, Alumno)', 5, 'Bajo', 3],
            ['Listado de Alumnos Discapacitados', '2 (Discapacitado, Alumno)', 5, 'Bajo', 3]
        ],
        'Subtotal Peticiones (EQ)'
    );

    // 4. Archivos Internos (ILF)
    const subtotalILF_Cell = renderComponentTable(
        '4. ARCHIVOS LÓGICOS INTERNOS (ILF) - Tablas alteradas por el sistema',
        ['Núm.', 'Archivo Interno (Tabla)', 'Elementos registro (RET)', 'Elementos datos (DET)', 'Nivel', 'Valor'],
        [
            ['Alumno', 1, 7, 'Bajo', 7],
            ['Estado', 1, 2, 'Bajo', 7],
            ['Pago', 1, 4, 'Bajo', 7],
            ['Materia', 1, 3, 'Bajo', 7],
            ['Cursa', 1, 3, 'Bajo', 7],
            ['Becado', 1, 3, 'Bajo', 7],
            ['Discapacitado', 1, 3, 'Bajo', 7]
        ],
        'Subtotal Archivos Internos (ILF)'
    );

    // 5. Archivos Externos (EIF)
    const subtotalEIF_Cell = renderComponentTable(
        '5. ARCHIVOS DE INTERFAZ EXTERNA (EIF) - Tablas / Servicios consultados de solo lectura',
        ['Núm.', 'Archivo Externo (Servicio)', 'Elementos registro (RET)', 'Elementos datos (DET)', 'Nivel', 'Valor'],
        [
            ['Validación Ciudadana / CURP (RENAPO)', 1, 5, 'Bajo', 5],
            ['Catálogo Escolar Oficial (SEJ / DGB)', 1, 4, 'Bajo', 5]
        ],
        'Subtotal Archivos Externos (EIF)'
    );

    // Resumen Total de PFNA
    ws1.mergeCells(`A${currentRow}:E${currentRow}`);
    ws1.getCell(`A${currentRow}`).value = 'TOTAL PUNTOS DE FUNCIÓN NO AJUSTADOS (PFNA)';
    ws1.getCell(`A${currentRow}`).font = { name: 'Segoe UI', size: 10.5, bold: true, color: { argb: 'FF1E3A8A' } };
    ws1.getCell(`A${currentRow}`).alignment = { vertical: 'middle', horizontal: 'right' };

    const totalPFNA_Cell = ws1.getCell(`F${currentRow}`);
    totalPFNA_Cell.value = { formula: `${subtotalEI_Cell}+${subtotalEO_Cell}+${subtotalEQ_Cell}+${subtotalILF_Cell}+${subtotalEIF_Cell}` };
    totalPFNA_Cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF1E3A8A' } };
    totalPFNA_Cell.alignment = { vertical: 'middle', horizontal: 'center' };

    for (let col = 1; col <= 6; col++) {
        const cell = ws1.getRow(currentRow).getCell(col);
        cell.fill = totalBoxFill;
        cell.border = {
            top: { style: 'medium', color: { argb: 'FF1E3A8A' } },
            bottom: { style: 'double', color: { argb: 'FF1E3A8A' } },
            left: { style: 'medium', color: { argb: 'FF1E3A8A' } },
            right: { style: 'medium', color: { argb: 'FF1E3A8A' } }
        };
    }
    ws1.getRow(currentRow).height = 24;

    // ==========================================
    // HOJA 2: PUNTOS DE FUNCIÓN AJUSTADOS (PFA)
    // ==========================================
    const ws2 = workbook.addWorksheet('PF Ajustados', {
        views: [{ showGridLines: true }]
    });

    ws2.columns = [
        { key: 'c1', width: 6 },
        { key: 'c2', width: 60 },
        { key: 'c3', width: 18 },
        { key: 'c4', width: 12 }
    ];

    ws2.mergeCells('A1:D1');
    ws2.getCell('A1').value = 'FACTORES DE AJUSTE DE COMPLEJIDAD (GSC - ALBRECHT)';
    ws2.getCell('A1').font = titleFont;
    ws2.getCell('A1').alignment = { vertical: 'middle', horizontal: 'left' };
    ws2.getRow(1).height = 25;

    ws2.mergeCells('A2:D2');
    ws2.getCell('A2').value = 'Escala de 0 a 5: 0=Sin influencia, 1=Incidental, 2=Moderado, 3=Medio, 4=Significativo, 5=Esencial';
    ws2.getCell('A2').font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FF64748B' } };
    ws2.getRow(2).height = 18;

    // Encabezados
    const gscHeaders = ['Núm.', 'Pregunta / Característica General del Sistema', 'Grado de Influencia', 'Valor (Fi)'];
    const gscHRow = ws2.getRow(4);
    gscHRow.values = gscHeaders;
    gscHRow.height = 20;
    for (let c = 1; c <= 4; c++) {
        const cell = gscHRow.getCell(c);
        cell.fill = darkBlueHeaderFill;
        cell.font = headerFont;
        cell.border = thinBorder;
        cell.alignment = { vertical: 'middle', horizontal: c === 1 || c >= 3 ? 'center' : 'left' };
    }

    const gscData = [
        ['¿Requiere el sistema copias de seguridad y de recuperación fiables?', 'Significativo', 4],
        ['¿Se requieren comunicaciones de datos?', 'Significativo', 4],
        ['¿Existen funciones de procesamiento distribuido?', 'Medio', 3],
        ['¿Es crítico el rendimiento?', 'Medio', 3],
        ['¿Será ejecutado el sistema en un entorno operativo existente y fuertemente utilizado?', 'Medio', 3],
        ['¿Requiere el sistema entrada de datos interactiva?', 'Esencial', 5],
        ['¿Requiere entrada de datos interactiva que las transacciones se lleven a cabo sobre múltiples pantallas?', 'Significativo', 4],
        ['¿Se actualizan los archivos maestros de forma interactiva?', 'Significativo', 4],
        ['¿Son complejas las entradas, las salidas, los archivos o las peticiones?', 'Medio', 3],
        ['¿Es complejo el procesamiento interno?', 'Medio', 3],
        ['¿Se ha diseñado el código para ser reutilizable?', 'Significativo', 4],
        ['¿Están incluidas en el diseño la conversión y la instalación?', 'Moderado', 2],
        ['¿Se ha diseñado el sistema para soportar múltiples instalaciones en diferentes organizaciones?', 'Moderado', 2],
        ['¿Se ha diseñado la aplicación para facilitar los cambios y para ser fácilmente utilizada por el usuario?', 'Significativo', 4]
    ];

    let gscRowIdx = 5;
    gscData.forEach((item, idx) => {
        const row = ws2.getRow(gscRowIdx);
        row.values = [idx + 1, item[0], item[1], item[2]];
        row.height = 18;
        for (let c = 1; c <= 4; c++) {
            const cell = row.getCell(c);
            cell.font = regularFont;
            cell.border = thinBorder;
            cell.alignment = { vertical: 'middle', horizontal: c === 1 || c >= 3 ? 'center' : 'left' };
            if (idx % 2 === 1) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
            }
        }
        gscRowIdx++;
    });

    // Fila Total SUMA(Fi)
    const sumGscRow = gscRowIdx;
    ws2.mergeCells(`A${sumGscRow}:C${sumGscRow}`);
    ws2.getCell(`A${sumGscRow}`).value = 'Total Grados de Influencia SUMA(Fi)';
    ws2.getCell(`A${sumGscRow}`).font = boldFont;
    ws2.getCell(`A${sumGscRow}`).alignment = { vertical: 'middle', horizontal: 'right' };

    const sumGscCell = ws2.getCell(`D${sumGscRow}`);
    sumGscCell.value = { formula: `SUM(D5:D${sumGscRow - 1})` };
    sumGscCell.font = boldFont;
    sumGscCell.alignment = { vertical: 'middle', horizontal: 'center' };

    for (let c = 1; c <= 4; c++) {
        const cell = ws2.getRow(sumGscRow).getCell(c);
        cell.fill = subtotalFill;
        cell.border = thinBorder;
    }
    ws2.getRow(sumGscRow).height = 20;

    // Sección de Cálculo Final de PFA
    let calcRow = sumGscRow + 3;
    ws2.mergeCells(`A${calcRow}:D${calcRow}`);
    ws2.getCell(`A${calcRow}`).value = 'CÁLCULO DE LA ECUACIÓN DE PUNTOS DE FUNCIÓN AJUSTADOS (PFA)';
    ws2.getCell(`A${calcRow}`).font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF1E3A8A' } };
    calcRow++;

    // Fórmulas y valores
    const pfaCalcs = [
        ['Puntos de Función No Ajustados (PFNA)', `'PF No Ajustados'!F${currentRow}`, 'PF'],
        ['Suma de Factores de Ajuste SUMA(Fi)', `D${sumGscRow}`, 'Puntos GSC'],
        ['Factor de Ajuste de Complejidad (CAF = 0.65 + 0.01 * SUMA(Fi))', `0.65+0.01*D${sumGscRow}`, 'Coeficiente'],
        ['PUNTOS DE FUNCIÓN AJUSTADOS (PFA = PFNA * CAF)', `'PF No Ajustados'!F${currentRow}*(0.65+0.01*D${sumGscRow})`, 'PFA']
    ];

    pfaCalcs.forEach((item, idx) => {
        const row = ws2.getRow(calcRow);
        row.height = 22;
        ws2.mergeCells(`A${calcRow}:B${calcRow}`);
        ws2.getCell(`A${calcRow}`).value = item[0];
        ws2.getCell(`A${calcRow}`).font = idx === 3 ? { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF1E3A8A' } } : boldFont;
        ws2.getCell(`A${calcRow}`).alignment = { vertical: 'middle', horizontal: 'left' };

        const valCell = ws2.getCell(`C${calcRow}`);
        valCell.value = { formula: item[1] };
        valCell.font = idx === 3 ? { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF1E3A8A' } } : boldFont;
        valCell.alignment = { vertical: 'middle', horizontal: 'center' };
        if (idx === 2 || idx === 3) {
            valCell.numFmt = '0.00';
        }

        const unitCell = ws2.getCell(`D${calcRow}`);
        unitCell.value = item[2];
        unitCell.font = regularFont;
        unitCell.alignment = { vertical: 'middle', horizontal: 'center' };

        for (let c = 1; c <= 4; c++) {
            const cell = row.getCell(c);
            cell.border = thinBorder;
            if (idx === 3) {
                cell.fill = totalBoxFill;
                cell.border = {
                    top: { style: 'medium', color: { argb: 'FF1E3A8A' } },
                    bottom: { style: 'double', color: { argb: 'FF1E3A8A' } },
                    left: { style: 'medium', color: { argb: 'FF1E3A8A' } },
                    right: { style: 'medium', color: { argb: 'FF1E3A8A' } }
                };
            } else {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
            }
        }
        calcRow++;
    });

    // Guardar en la carpeta actual y en Downloads
    const localFilePath = path.join(__dirname, '..', 'Puntos_de_Funcion_LocalMarket.xlsx');
    await workbook.xlsx.writeFile(localFilePath);
    console.log('✅ Archivo Excel generado localmente en:', localFilePath);

    const downloadsDir = path.join(process.env.USERPROFILE || 'C:\\Users\\ximel', 'Downloads');
    const downloadsFilePath = path.join(downloadsDir, 'Puntos_de_Funcion_LocalMarket.xlsx');
    await workbook.xlsx.writeFile(downloadsFilePath);
    console.log('✅ Archivo Excel copiado a Descargas en:', downloadsFilePath);
}

buildExcel().catch(err => {
    console.error('Error al generar Excel:', err);
    process.exit(1);
});
