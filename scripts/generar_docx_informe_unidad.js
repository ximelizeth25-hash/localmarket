const fs = require('fs');
const path = require('path');
const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    AlignmentType,
    ShadingType
} = require('docx');

async function generarDocx() {
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: "Calibri",
                        size: 22, // 11pt
                        color: "1E293B"
                    }
                }
            }
        },
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: 1440, // 1 pulgada
                        right: 1440,
                        bottom: 1440,
                        left: 1440
                    }
                }
            },
            children: [
                // PORTADA / ENCABEZADO
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: "INFORME DE AVANCES Y BITÁCORA DE UNIDAD",
                            bold: true,
                            size: 36, // 18pt
                            color: "1E3A8A"
                        })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                    children: [
                        new TextRun({
                            text: "Proyecto Final Integrador: Plataforma SaaS E-Commerce LocalMarket (Proyecto 7)",
                            italics: true,
                            size: 24, // 12pt
                            color: "475569"
                        })
                    ]
                }),

                // METADATA
                new Paragraph({
                    spacing: { after: 200 },
                    children: [
                        new TextRun({ text: "• Motor de Base de Datos: ", bold: true }),
                        new TextRun("PostgreSQL 18 (Relacional ACID / Dialecto PL/pgSQL)\n"),
                        new TextRun({ text: "• Stack Tecnológico: ", bold: true }),
                        new TextRun("Node.js, Express.js, JavaScript ES6+, HTML5 & Tailwind CSS\n"),
                        new TextRun({ text: "• Métrica Funcional: ", bold: true }),
                        new TextRun("125 PFNA | 141.25 PFA (Metodología IFPUG / Albrecht)\n"),
                        new TextRun({ text: "• Presupuesto Evaluado: ", bold: true }),
                        new TextRun("$189,500.00 MXN (Costos Directos e Indirectos)\n"),
                        new TextRun({ text: "• Estado de la Unidad: ", bold: true }),
                        new TextRun("100% Desarrollado, Compilado y Operativo en Producción Local")
                    ]
                }),

                // SECCIÓN BITÁCORA
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 300, after: 150 },
                    children: [
                        new TextRun({ text: "BITÁCORA GENERAL DE LA UNIDAD", bold: true, color: "1E3A8A" })
                    ]
                }),
                new Paragraph({
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: "• Sprint 1 (Semanas 1-2): ", bold: true, color: "1D4ED8" }),
                        new TextRun("Levantamiento de requisitos y modelado de la base de datos en 3FN conformando 13 tablas en PostgreSQL.")
                    ]
                }),
                new Paragraph({
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: "• Sprint 2 (Semana 3): ", bold: true, color: "1D4ED8" }),
                        new TextRun("Análisis de Puntos de Función (IFPUG/Albrecht): 125 PFNA, 14 factores GSC (48) y 141.25 PFA ajustados.")
                    ]
                }),
                new Paragraph({
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: "• Sprint 3 (Semana 4): ", bold: true, color: "1D4ED8" }),
                        new TextRun("Presupuestación de Costos Directos ($132,000 MXN), Indirectos ($57,500 MXN) y Costos de Calidad (CoQ).")
                    ]
                }),
                new Paragraph({
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: "• Sprint 4 (Semanas 5-6): ", bold: true, color: "1D4ED8" }),
                        new TextRun("Programación del Backend con Node.js/Express, pool de conexiones PostgreSQL y controladores modulares en routes/.")
                    ]
                }),
                new Paragraph({
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: "• Sprint 5 (Semanas 7-8): ", bold: true, color: "1D4ED8" }),
                        new TextRun("Construcción del Frontend (dashboard reactivo, simplificación de categorías, limpieza de inputs y tarjetas KPI).")
                    ]
                }),
                new Paragraph({
                    spacing: { after: 300 },
                    children: [
                        new TextRun({ text: "• Sprint 6 (Semanas 9-10): ", bold: true, color: "1D4ED8" }),
                        new TextRun("Implementación de Algoritmos de Análisis, 5 vistas, 5 procedimientos, 5 triggers y 5 funciones en PL/pgSQL.")
                    ]
                }),

                // SECCIÓN 1: DISEÑO DE LA BASE DE DATOS
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 300, after: 150 },
                    children: [
                        new TextRun({ text: "1. DISEÑO DE LA BASE DE DATOS", bold: true, color: "1E3A8A" })
                    ]
                }),
                new Paragraph({
                    spacing: { after: 150 },
                    children: [
                        new TextRun("La base de datos proyecto7 está implementada en PostgreSQL 18 con 13 tablas relacionales en Tercera Forma Normal (3FN), garantizando el cumplimiento de propiedades ACID:")
                    ]
                }),
                new Paragraph({
                    spacing: { after: 100 },
                    children: [
                        new TextRun("1. ROLES: Catálogo de perfiles (id_rol, nombre_rol, descripcion).\n"),
                        new TextRun("2. PERMISOS: Catálogo de privilegios por módulo (id_permiso, nombre_permiso, modulo).\n"),
                        new TextRun("3. ROLES_PERMISOS: Tabla pivote M:N para control de acceso RBAC.\n"),
                        new TextRun("4. USUARIOS: Entidad central de cuentas (id_usuario, id_rol, nombre, correo, contrasena, telefono, foto_perfil, otp_verificado).\n"),
                        new TextRun("5. VERIFICACIONES_OTP: Tokens 2FA temporales y control de intentos fallidos.\n"),
                        new TextRun("6. DIRECCIONES_ENTREGA: Libreta de domicilios de entrega por cliente.\n"),
                        new TextRun("7. CATEGORIAS: Catálogo maestro (Suplementos, Cafés, Cápsulas, Aceites, Cuidado Personal).\n"),
                        new TextRun("8. PRODUCTOS: Catálogo comercial (id_producto, id_vendedor, id_categoria, titulo, descripcion, precio, costo_unitario, stock, imagenes).\n"),
                        new TextRun("9. METODOS_PAGO: Opciones de liquidación (Contra entrega, Transferencia SPEI).\n"),
                        new TextRun("10. COSTOS_FIJOS: Registro de costos operativos para balance de utilidades.\n"),
                        new TextRun("11. PREGUNTAS_PRODUCTO: Interacción pre-compra de preguntas y respuestas públicas.\n"),
                        new TextRun("12. PEDIDOS_VENTAS: Cabecera transaccional (id_pedido, id_comprador, fecha_pedido, total, estado).\n"),
                        new TextRun("13. DETALLE_VENTA: Renglones de venta con precios congelados y cantidades adquiridas.")
                    ]
                }),
                new Paragraph({
                    spacing: { before: 150, after: 100 },
                    children: [
                        new TextRun({ text: "Objetos Avanzados de BD Compilados:\n", bold: true }),
                        new TextRun("• 5 Vistas: vw_catalogo_productos_detallado, vw_resumen_pedidos_ventas, vw_alerta_stock_critico, vw_metricas_vendedores, vw_balance_financiero_tienda.\n"),
                        new TextRun("• 5 Procedimientos Almacenados: sp_procesar_venta (atómico), sp_crear_pedido, sp_actualizar_estado_pedido, sp_reabastecer_stock, sp_depurar_intentos_otp.\n"),
                        new TextRun("• 5 Triggers: trg_evitar_stock_negativo, trg_actualizar_total_pedido, trg_normalizar_correo_usuario, trg_validar_precios_coherentes, trg_auditar_agotamiento_stock.\n"),
                        new TextRun("• 5 Funciones: fn_validar_stock_disponible, fn_calcular_subtotal_producto, fn_calcular_margen_ganancia, fn_total_ventas_vendedor, fn_consultar_pedidos_cliente.")
                    ]
                }),

                // SECCIÓN 2: PUNTOS DE FUNCIÓN
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 300, after: 150 },
                    children: [
                        new TextRun({ text: "2. PUNTOS DE FUNCIÓN (IFPUG / ALBRECHT)", bold: true, color: "1E3A8A" })
                    ]
                }),
                new Paragraph({
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: "• Entradas Externas (EI): ", bold: true }),
                        new TextRun("9 transacciones (Altas, bajas y modificaciones) = 31 PF\n"),
                        new TextRun({ text: "• Salidas Externas (EO): ", bold: true }),
                        new TextRun("3 reportes con cálculos derivados = 19 PF\n"),
                        new TextRun({ text: "• Consultas Externas (EQ): ", bold: true }),
                        new TextRun("5 consultas directas sin cálculos = 16 PF\n"),
                        new TextRun({ text: "• Archivos Lógicos Internos (ILF): ", bold: true }),
                        new TextRun("7 tablas de base de datos = 49 PF\n"),
                        new TextRun({ text: "• Archivos de Interfaz Externa (EIF): ", bold: true }),
                        new TextRun("2 servicios externos de validación = 10 PF\n"),
                        new TextRun({ text: "Total No Ajustado (PFNA): ", bold: true, color: "1E3A8A" }),
                        new TextRun({ text: "125 PF\n", bold: true, color: "1E3A8A" }),
                        new TextRun({ text: "Factores Generales de Albrecht (14 GSC): ", bold: true }),
                        new TextRun("SUM(Fi) = 48 puntos\n"),
                        new TextRun({ text: "Factor de Ajuste de Complejidad (CAF): ", bold: true }),
                        new TextRun("0.65 + (0.01 * 48) = 1.13\n"),
                        new TextRun({ text: "TOTAL PUNTOS DE FUNCIÓN AJUSTADOS (PFA): ", bold: true, color: "1E3A8A" }),
                        new TextRun({ text: "125 * 1.13 = 141.25 PFA", bold: true, color: "1E3A8A" })
                    ]
                }),

                // SECCIÓN 3: COSTOS DIRECTOS E INDIRECTOS
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 300, after: 150 },
                    children: [
                        new TextRun({ text: "3. COSTOS INDIRECTOS Y COSTOS DIRECTOS", bold: true, color: "1E3A8A" })
                    ]
                }),
                new Paragraph({
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: "A. Costos Directos ($132,000.00 MXN / 69.66%):\n", bold: true, color: "166534" }),
                        new TextRun("• Mano de obra de desarrollo Full-Stack: $68,000.00 MXN\n"),
                        new TextRun("• Modelado e ingeniería de Base de Datos PostgreSQL: $24,000.00 MXN\n"),
                        new TextRun("• Aseguramiento de Calidad y Pruebas Automatizadas: $20,000.00 MXN\n"),
                        new TextRun("• Diseño UI/UX y Ergonomía del Dashboard: $12,000.00 MXN\n"),
                        new TextRun("• Insumos y pasarelas de mensajería (SMS/WhatsApp): $8,000.00 MXN\n\n"),
                        new TextRun({ text: "B. Costos Indirectos ($57,500.00 MXN / 30.34%):\n", bold: true, color: "991B1B" }),
                        new TextRun("• Servicios e Infraestructura (Energía, Internet IP Fija, Staging): $16,500.00 MXN\n"),
                        new TextRun("• Gestión, Coordinación Ágil y Control de Versiones: $15,000.00 MXN\n"),
                        new TextRun("• Depreciación de Estaciones de Trabajo y Equipamiento: $11,000.00 MXN\n"),
                        new TextRun("• Fondo de Contingencias y Costos de Calidad (CoQ): $15,000.00 MXN\n\n"),
                        new TextRun({ text: "PRESUPUESTO TOTAL DEL PROYECTO: ", bold: true, color: "1E3A8A" }),
                        new TextRun({ text: "$189,500.00 MXN (100%)", bold: true, color: "1E3A8A" })
                    ]
                }),

                // SECCIÓN 4: AVANCES DE CODIFICACIÓN
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 300, after: 150 },
                    children: [
                        new TextRun({ text: "4. AVANCES DE CODIFICACIÓN DEL PROYECTO (BACKEND Y FRONTEND)", bold: true, color: "1E3A8A" })
                    ]
                }),
                new Paragraph({
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: "Backend (Node.js & Express.js):\n", bold: true }),
                        new TextRun("• Enrutadores modulares en routes/: usuarios.js, productos.js, pedidos_ventas.js, detalle_venta.js, otp.js, costos_fijos.js.\n"),
                        new TextRun("• Capa de datos en db.js con Connection Pooling de pg y consultas parametrizadas ($1, $2) contra inyección SQL.\n"),
                        new TextRun("• Servidor central server.js con CORS, soporte JSON de 50MB y rutas estáticas.\n\n"),
                        new TextRun({ text: "Frontend (HTML5, Tailwind CSS y Vanilla JS):\n", bold: true }),
                        new TextRun("• Menú desplegable de categorías depurado a 5 opciones de una sola palabra (Suplementos, Cafés, Cápsulas, Aceites, Cuidado Personal).\n"),
                        new TextRun("• Cajas numéricas de precio, costo y stock 100% limpias, sin ceros predefinidos ni placeholders residuales.\n"),
                        new TextRun("• Tarjetas KPI de métricas superiores configuradas como botones interactivos con navegación dinámica a sus módulos.\n"),
                        new TextRun("• Gestor de Mensajería WhatsApp & SMS integrado profesionalmente (sin terminología de simulador).\n"),
                        new TextRun("• Tabla de usuarios registrados con renderizado dinámico e invocación reactiva a cargarUsuarios().")
                    ]
                }),

                // SECCIÓN 5: ALGORITMOS DE ANÁLISIS
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 300, after: 150 },
                    children: [
                        new TextRun({ text: "5. ALGORITMOS DE ANÁLISIS", bold: true, color: "1E3A8A" })
                    ]
                }),
                new Paragraph({
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: "1. Algoritmo Transaccional Atómico de Venta (ACID): ", bold: true }),
                        new TextRun("Valida existencias físicas en productos, calcula subtotales, inserta el registro en detalle_venta y descuenta stock automáticamente sin bloqueos.\n\n"),
                        new TextRun({ text: "2. Algoritmo de Margen de Utilidad Comercial: ", bold: true }),
                        new TextRun("Fórmula matemática ((precio - costo) / precio) * 100 con protección ante divisiones por cero.\n\n"),
                        new TextRun({ text: "3. Algoritmo de Balance Financiero y Utilidad Neta: ", bold: true }),
                        new TextRun("Calcula Ventas Brutas - Costo de Mercancía Vendida (COGS) - Costos Fijos = Utilidad Neta del Marketplace.\n\n"),
                        new TextRun({ text: "4. Algoritmo de Alerta de Reorden y Detección de Stock Crítico: ", bold: true }),
                        new TextRun("Monitorea productos con existencias <= 5 unidades y calcula el presupuesto estimado para resurtir a 20 unidades.\n\n"),
                        new TextRun({ text: "5. Algoritmo de Mitigación de Fuerza Bruta en OTP (2FA): ", bold: true }),
                        new TextRun("Genera token de 6 dígitos con 15 minutos de vigencia, acumula intentos fallidos y bloquea preventivamente al tercer fallo consecutivo.")
                    ]
                })
            ]
        }]
    });

    const downloadsDir = path.join(process.env.USERPROFILE || 'C:\\Users\\ximel', 'Downloads');
    const docxDownloadsPath = path.join(downloadsDir, 'Informe_Avances_Bitacora_Unidad.docx');
    const docxLocalPath = path.join(__dirname, '..', 'Informe_Avances_Bitacora_Unidad.docx');

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(docxDownloadsPath, buffer);
    fs.writeFileSync(docxLocalPath, buffer);

    console.log(`✅ Archivo Word DOCX generado exitosamente en: ${docxDownloadsPath}`);
    console.log(`📁 Copia local en: ${docxLocalPath}`);
}

generarDocx().catch(err => {
    console.error("Error generando DOCX:", err);
    process.exit(1);
});
