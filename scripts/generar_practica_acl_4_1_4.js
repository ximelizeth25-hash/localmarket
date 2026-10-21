const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    AlignmentType,
    ShadingType,
    VerticalAlign,
    Header,
    Footer,
    PageNumber
} = require('docx');

// ============================================================================
// 1. GENERAR DOCUMENTO WORD (.DOCX) IDÉNTICO AL FORMATO CISCO NETACAD
// ============================================================================
async function crearWordDocx(outputPaths) {
    const borderThin = { style: BorderStyle.SINGLE, size: 4, color: "595959" };
    const tableBorders = {
        top: borderThin,
        bottom: borderThin,
        left: borderThin,
        right: borderThin,
        insideHorizontal: borderThin,
        insideVertical: borderThin
    };

    const crearCeldaHeader = (texto, widthPct) => new TableCell({
        width: { size: widthPct, type: WidthType.PERCENTAGE },
        shading: { fill: "D9E2F3", type: ShadingType.CLEAR, color: "auto" },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: texto, bold: true, font: "Arial", size: 19, color: "000000" })]
            })
        ]
    });

    const crearCeldaDatos = (texto, widthPct, rowSpan = 1) => new TableCell({
        width: { size: widthPct, type: WidthType.PERCENTAGE },
        rowSpan: rowSpan,
        verticalAlign: VerticalAlign.TOP,
        margins: { top: 70, bottom: 70, left: 120, right: 120 },
        children: [
            new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [new TextRun({ text: texto, font: "Arial", size: 19, color: "000000" })]
            })
        ]
    });

    const pEspacio = (after = 120) => new Paragraph({ spacing: { after } });

    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: "Arial",
                        size: 20, // 10pt
                        color: "000000"
                    }
                }
            }
        },
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: 1134,    // ~2 cm
                        right: 1134,  // ~2 cm
                        bottom: 1134, // ~2 cm
                        left: 1134    // ~2 cm
                    }
                }
            },
            headers: {
                default: new Header({
                    children: [
                        new Paragraph({
                            border: { bottom: { color: "000000", space: 4, style: BorderStyle.SINGLE, size: 12 } },
                            spacing: { after: 160 },
                            children: [
                                new TextRun({ text: "Packet Tracer: demostración de listas de control de acceso", bold: true, font: "Arial", size: 18 })
                            ]
                        })
                    ]
                })
            },
            footers: {
                default: new Footer({
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [
                                new TextRun({
                                    text: "© 2013 - aa Cisco y/o sus filiales. Todos los derechos reservados. Información pública de Cisco\t\tPágina ",
                                    font: "Arial",
                                    size: 16,
                                    color: "333333"
                                }),
                                new TextRun({
                                    children: [PageNumber.CURRENT],
                                    bold: true,
                                    font: "Arial",
                                    size: 16
                                }),
                                new TextRun({
                                    text: " de ",
                                    font: "Arial",
                                    size: 16
                                }),
                                new TextRun({
                                    children: [PageNumber.TOTAL_PAGES],
                                    bold: true,
                                    font: "Arial",
                                    size: 16
                                })
                            ]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({ text: "www.netacad.com", font: "Arial", size: 16, color: "0088CC" })
                            ]
                        })
                    ]
                })
            },
            children: [
                // ENCABEZADO CISCO NETWORKING ACADEMY
                new Paragraph({
                    spacing: { after: 60 },
                    children: [
                        new TextRun({ text: "CISCO ", bold: true, font: "Arial", size: 28, color: "0096D6" }),
                        new TextRun({ text: "Networking Academy", font: "Arial", size: 28, color: "333333" })
                    ]
                }),

                // TÍTULO PRINCIPAL
                new Paragraph({
                    spacing: { before: 120, after: 160 },
                    children: [
                        new TextRun({ text: "Packet Tracer: demostración de listas de control de acceso", bold: true, font: "Arial", size: 30 })
                    ]
                }),

                // OBJETIVOS
                new Paragraph({
                    spacing: { before: 80, after: 100 },
                    children: [new TextRun({ text: "Objetivos", bold: true, font: "Arial", size: 26 })]
                }),
                new Paragraph({
                    indent: { left: 360 },
                    spacing: { after: 80 },
                    children: [new TextRun({ text: "Parte 1: verificar la conectividad local y probar la lista de control de acceso", bold: true, font: "Arial", size: 19 })]
                }),
                new Paragraph({
                    indent: { left: 360 },
                    spacing: { after: 200 },
                    children: [new TextRun({ text: "Parte 2: eliminar la lista de control de acceso y repetir la prueba", bold: true, font: "Arial", size: 19 })]
                }),

                // ASPECTOS BÁSICOS
                new Paragraph({
                    spacing: { before: 80, after: 100 },
                    children: [new TextRun({ text: "Aspectos básicos", bold: true, font: "Arial", size: 26 })]
                }),
                new Paragraph({
                    indent: { left: 360 },
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: "En esta actividad, observará cómo se puede utilizar una lista de control de acceso (ACL) para evitar que un ping llegue a hosts en redes remotas. Después de eliminar la ACL de la configuración, los pings se realizarán correctamente.",
                            font: "Arial",
                            size: 19
                        })
                    ]
                }),

                // TABLA DE ASIGNACIÓN DE DIRECCIONES
                new Paragraph({
                    spacing: { before: 80, after: 120 },
                    children: [new TextRun({ text: "Tabla de asignación de direcciones", bold: true, font: "Arial", size: 24 })]
                }),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: tableBorders,
                    rows: [
                        new TableRow({
                            children: [
                                crearCeldaHeader("Dispositivo", 28),
                                crearCeldaHeader("Interfaz", 29),
                                crearCeldaHeader("Dirección IP / Prefijo", 43)
                            ]
                        }),
                        new TableRow({ children: [crearCeldaDatos("R1", 28, 3), crearCeldaDatos("G0/0", 29), crearCeldaDatos("192.168.10.1/24", 43)] }),
                        new TableRow({ children: [crearCeldaDatos("G0/1", 29), crearCeldaDatos("192.168.11.1/24", 43)] }),
                        new TableRow({ children: [crearCeldaDatos("S0/0/0", 29), crearCeldaDatos("10.1.1.1/30", 43)] }),
                        new TableRow({ children: [crearCeldaDatos("R2", 28, 2), crearCeldaDatos("S0/0/0", 29), crearCeldaDatos("10.10.1.2/30", 43)] }),
                        new TableRow({ children: [crearCeldaDatos("S0/0/1", 29), crearCeldaDatos("10.10.1.5/30", 43)] }),
                        new TableRow({ children: [crearCeldaDatos("R3", 28, 3), crearCeldaDatos("G0/0", 29), crearCeldaDatos("192.168.30.1/24", 43)] }),
                        new TableRow({ children: [crearCeldaDatos("G0/1", 29), crearCeldaDatos("192.168.31.1/24", 43)] }),
                        new TableRow({ children: [crearCeldaDatos("S0/0/1", 29), crearCeldaDatos("10.10.1.6/24", 43)] }),
                        new TableRow({ children: [crearCeldaDatos("PC1", 28), crearCeldaDatos("NIC", 29), crearCeldaDatos("192.168.10.10/24", 43)] }),
                        new TableRow({ children: [crearCeldaDatos("PC2", 28), crearCeldaDatos("NIC", 29), crearCeldaDatos("192.168.10.11/24", 43)] }),
                        new TableRow({ children: [crearCeldaDatos("PC3", 28), crearCeldaDatos("NIC", 29), crearCeldaDatos("192.168.11.10/24", 43)] }),
                        new TableRow({ children: [crearCeldaDatos("PC4", 28), crearCeldaDatos("NIC", 29), crearCeldaDatos("192.168.30.12/24", 43)] }),
                        new TableRow({ children: [crearCeldaDatos("Servidor DNS", 28), crearCeldaDatos("NIC", 29), crearCeldaDatos("192.168.31.12/24", 43)] })
                    ]
                }),

                // INSTRUCCIONES
                new Paragraph({
                    spacing: { before: 240, after: 140 },
                    children: [new TextRun({ text: "Instrucciones", bold: true, font: "Arial", size: 24 })]
                }),
                new Paragraph({
                    spacing: { before: 80, after: 120 },
                    children: [new TextRun({ text: "Parte 1: verificar la conectividad local y probar la lista de control de acceso", bold: true, font: "Arial", size: 22 })]
                }),
                new Paragraph({
                    spacing: { before: 60, after: 100 },
                    children: [new TextRun({ text: "Paso 1: hacer ping a los dispositivos de la red local para verificar la conectividad.", bold: true, font: "Arial", size: 20 })]
                }),
                new Paragraph({
                    indent: { left: 360 },
                    spacing: { after: 80 },
                    children: [
                        new TextRun({ text: "a.   Desde el símbolo del sistema de la ", font: "Arial", size: 19 }),
                        new TextRun({ text: "PC1", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: ", haga ping a la ", font: "Arial", size: 19 }),
                        new TextRun({ text: "PC2", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: " (192.168.10.11).", font: "Arial", size: 19 })
                    ]
                }),
                new Paragraph({
                    indent: { left: 360 },
                    spacing: { after: 120 },
                    children: [
                        new TextRun({ text: "b.   Desde el símbolo del sistema de la ", font: "Arial", size: 19 }),
                        new TextRun({ text: "PC1", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: ", haga ping a la ", font: "Arial", size: 19 }),
                        new TextRun({ text: "PC3", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: " (192.168.11.10).", font: "Arial", size: 19 })
                    ]
                }),
                new Paragraph({
                    indent: { left: 720 },
                    spacing: { after: 80 },
                    children: [new TextRun({ text: "¿Por qué se realizaron de forma correcta los pings?", font: "Arial", size: 19 })]
                }),
                // RESPUESTA 1 EN ROJO
                new Paragraph({
                    indent: { left: 720 },
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: "Respuesta: Los pings se realizaron de forma correcta porque las capas 1 a 3 funcionan adecuadamente y no existe ninguna lista de control de acceso (ACL) aplicada en las interfaces locales (GigabitEthernet0/0 y GigabitEthernet0/1 de R1) que filtre o bloquee el tráfico entre la red 192.168.10.0/24 y la red 192.168.11.0/24.",
                            bold: true,
                            font: "Arial",
                            size: 19,
                            color: "FF0000"
                        })
                    ]
                }),

                // PASO 2 PARTE 1
                new Paragraph({
                    spacing: { before: 120, after: 100 },
                    children: [new TextRun({ text: "Paso 2: hacer ping a los dispositivos en las redes remotas para probar la funcionalidad de la ACL.", bold: true, font: "Arial", size: 20 })]
                }),
                new Paragraph({
                    indent: { left: 360 },
                    spacing: { after: 80 },
                    children: [
                        new TextRun({ text: "a.   Desde el símbolo del sistema de la ", font: "Arial", size: 19 }),
                        new TextRun({ text: "PC1", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: ", haga ping a la ", font: "Arial", size: 19 }),
                        new TextRun({ text: "PC4", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: " (192.168.30.12).", font: "Arial", size: 19 })
                    ]
                }),
                new Paragraph({
                    indent: { left: 360 },
                    spacing: { after: 120 },
                    children: [
                        new TextRun({ text: "b.   Desde el símbolo del sistema de la ", font: "Arial", size: 19 }),
                        new TextRun({ text: "PC1", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: ", haga ping al ", font: "Arial", size: 19 }),
                        new TextRun({ text: "servidor DNS", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: " (192.168.31.12).", font: "Arial", size: 19 })
                    ]
                }),
                new Paragraph({
                    indent: { left: 720 },
                    spacing: { after: 80 },
                    children: [
                        new TextRun({ text: "¿Por qué fallaron los pings? (", font: "Arial", size: 19 }),
                        new TextRun({ text: "pista:", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: " utilice el modo de simulación o vea las configuraciones del router para investigar).", font: "Arial", size: 19 })
                    ]
                }),
                // RESPUESTA 2 EN ROJO
                new Paragraph({
                    indent: { left: 720 },
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: "Respuesta: Los pings fallaron (mostrando 'Destination host unreachable' desde 192.168.10.1) porque el router R1 tiene configurada y aplicada la lista de control de acceso estándar 11 (ACL 11), cuya primera sentencia (deny 192.168.10.0 0.0.0.255) bloquea todos los paquetes que se originan en la red 192.168.10.0/24 cuando intentan salir por la interfaz Serial0/0/0 hacia las redes remotas.",
                            bold: true,
                            font: "Arial",
                            size: 19,
                            color: "FF0000"
                        })
                    ]
                }),

                // PARTE 2
                new Paragraph({
                    spacing: { before: 160, after: 120 },
                    children: [new TextRun({ text: "Parte 2: eliminar la ACL y repetir la prueba", bold: true, font: "Arial", size: 22 })]
                }),
                new Paragraph({
                    spacing: { before: 60, after: 100 },
                    children: [new TextRun({ text: "Paso 1: utilizar el comando show para investigar la configuración de la ACL.", bold: true, font: "Arial", size: 20 })]
                }),
                new Paragraph({
                    indent: { left: 360 },
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: "a.   Desplácese hasta R1 CLI. Utilice los comandos ", font: "Arial", size: 19 }),
                        new TextRun({ text: "show run", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: " y ", font: "Arial", size: 19 }),
                        new TextRun({ text: "show access-lists", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: " para ver las ACL configuradas actualmente. Para obtener una vista rápida de las ACL vigentes, utilice ", font: "Arial", size: 19 }),
                        new TextRun({ text: "show access-lists", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: ". Introduzca el comando ", font: "Arial", size: 19 }),
                        new TextRun({ text: "show access-lists", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: " seguido de un espacio y un signo de interrogación (?) para ver las opciones disponibles:", font: "Arial", size: 19 })
                    ]
                }),
                new Paragraph({
                    indent: { left: 720 },
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: "R1# ", font: "Courier New", size: 18 }),
                        new TextRun({ text: "show access-lists ?\n", bold: true, font: "Courier New", size: 18 }),
                        new TextRun({ text: "  <1-199>  ACL number\n  WORD     ACL name\n  <cr>", font: "Courier New", size: 18 })
                    ]
                }),
                new Paragraph({
                    indent: { left: 720 },
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: "Si conoce el número o el nombre de la ACL, puede filtrar aún más el resultado del comando ", font: "Arial", size: 19 }),
                        new TextRun({ text: "show", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: ". Sin embargo, el ", font: "Arial", size: 19 }),
                        new TextRun({ text: "R1", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: " tiene solo una ACL, por lo que basta con el comando ", font: "Arial", size: 19 }),
                        new TextRun({ text: "show access-lists", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: ".", font: "Arial", size: 19 })
                    ]
                }),
                new Paragraph({
                    indent: { left: 720 },
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: "R1#", font: "Courier New", size: 18 }),
                        new TextRun({ text: "show access-lists\n", bold: true, font: "Courier New", size: 18 }),
                        new TextRun({ text: "Standard IP access list 11\n   10 deny 192.168.10.0 0.0.0.255\n   20 permit any", font: "Courier New", size: 18 })
                    ]
                }),
                new Paragraph({
                    indent: { left: 720 },
                    spacing: { after: 120 },
                    children: [
                        new TextRun({ text: "La primera línea de la ACL impide cualquier paquete que se origine en la red ", font: "Arial", size: 19 }),
                        new TextRun({ text: "192.168.10.0/24", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: " lo que incluye los ecos del protocolo de mensajería de control de Internet (ICMP) (solicitudes de ping). La segunda línea de la ACL permite que todo el resto del tráfico ", font: "Arial", size: 19 }),
                        new TextRun({ text: "ip", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: " de cualquier origen atraviese el router.", font: "Arial", size: 19 })
                    ]
                }),
                new Paragraph({
                    indent: { left: 360 },
                    spacing: { after: 100 },
                    children: [
                        new TextRun({
                            text: "b.   Para que una ACL tenga efecto en el funcionamiento del router, debe aplicarse a una interfaz en una dirección específica. En esta situación, la ACL se utiliza para filtrar el tráfico que sale de una interfaz. Por lo tanto, todo el tráfico que sale de la interfaz especificada de R1 se examinará contra la ACL 11.",
                            font: "Arial",
                            size: 19
                        })
                    ]
                }),
                new Paragraph({
                    indent: { left: 720 },
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: "Aunque pueda ver la información de IP con el comando ", font: "Arial", size: 19 }),
                        new TextRun({ text: "show ip interface", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: ", en algunos casos puede ser más eficaz utilizar solo el comando ", font: "Arial", size: 19 }),
                        new TextRun({ text: "show run", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: ". Para obtener una lista completa de interfaces a las que se puede aplicar la ACL y la lista de todas las ACL configuradas, utilice el siguiente comando:", font: "Arial", size: 19 })
                    ]
                }),
                new Paragraph({
                    indent: { left: 720 },
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: "R1# ", font: "Courier New", size: 18 }),
                        new TextRun({ text: "show run | include interface|access\n", bold: true, font: "Courier New", size: 18 }),
                        new TextRun({
                            text: "interface GigabitEthernet0/0\ninterface GigabitEthernet0/1\ninterface Serial0/0/0\n ip access-group 11 out\ninterface Serial0/0/1\ninterface Vlan1\naccess-list 11 deny 192.168.10.0 0.0.0.255\naccess-list 11 permit any",
                            font: "Courier New",
                            size: 18
                        })
                    ]
                }),
                new Paragraph({
                    indent: { left: 720 },
                    spacing: { after: 140 },
                    children: [
                        new TextRun({
                            text: "El segundo símbolo de tubería '|' crea una condición OR que coincide con 'interfaz' O 'acceso'. Es importante que no se incluyan espacios en la condición OR. Utilice uno o ambos comandos para buscar información sobre la ACL.",
                            font: "Arial",
                            size: 19
                        })
                    ]
                }),
                new Paragraph({
                    indent: { left: 720 },
                    spacing: { after: 80 },
                    children: [new TextRun({ text: "¿A qué interfaz y en qué dirección se aplica la ACL?", font: "Arial", size: 19 })]
                }),
                // RESPUESTA 3 EN ROJO
                new Paragraph({
                    indent: { left: 720 },
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: "Respuesta: La ACL 11 se aplica a la interfaz Serial0/0/0 (s0/0/0) en dirección de salida (out / saliente), mediante el comando 'ip access-group 11 out'.",
                            bold: true,
                            font: "Arial",
                            size: 19,
                            color: "FF0000"
                        })
                    ]
                }),

                // PASO 2 PARTE 2
                new Paragraph({
                    spacing: { before: 120, after: 100 },
                    children: [new TextRun({ text: "Paso 2: eliminar la lista de acceso 11 de la configuración.", bold: true, font: "Arial", size: 20 })]
                }),
                new Paragraph({
                    indent: { left: 360 },
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: "Es posible eliminar las ACL de la configuración por medio de la emisión del comando ", font: "Arial", size: 19 }),
                        new TextRun({ text: "no access-list ", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: "[número de ACL]", italics: true, font: "Arial", size: 19 }),
                        new TextRun({ text: ". El comando ", font: "Arial", size: 19 }),
                        new TextRun({ text: "no access-list", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: " cuando se usa sin argumentos elimina todas las ACL configuradas en el router. El comando ", font: "Arial", size: 19 }),
                        new TextRun({ text: "no access-list ", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: "[número de ACL]", italics: true, font: "Arial", size: 19 }),
                        new TextRun({ text: " solo elimina una ACL específica. La eliminación de una ACL de un enrutador no elimina la ACL de la interfaz. El comando que aplica la ACL a la interfaz debe eliminarse por separado.", font: "Arial", size: 19 })
                    ]
                }),
                new Paragraph({
                    indent: { left: 360 },
                    spacing: { after: 80 },
                    children: [
                        new TextRun({ text: "a.   En la interfaz Serial0/0/0, quiten la lista de acceso 11 aplicada antes a la interfaz como filtro ", font: "Arial", size: 19 }),
                        new TextRun({ text: "saliente", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: ":", font: "Arial", size: 19 })
                    ]
                }),
                new Paragraph({
                    indent: { left: 720 },
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: "R1(config)# ", font: "Courier New", size: 18 }),
                        new TextRun({ text: "interface s0/0/0\n", bold: true, font: "Courier New", size: 18 }),
                        new TextRun({ text: "R1(config-if)# ", font: "Courier New", size: 18 }),
                        new TextRun({ text: "no ip access-group 11 out", bold: true, font: "Courier New", size: 18 })
                    ]
                }),
                new Paragraph({
                    indent: { left: 360 },
                    spacing: { after: 80 },
                    children: [
                        new TextRun({ text: "b.   En el modo de configuración global, elimine la ACL por medio del siguiente comando:", font: "Arial", size: 19 })
                    ]
                }),
                new Paragraph({
                    indent: { left: 720 },
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: "R1(config)# ", font: "Courier New", size: 18 }),
                        new TextRun({ text: "no access-list 11", bold: true, font: "Courier New", size: 18 })
                    ]
                }),
                new Paragraph({
                    indent: { left: 360 },
                    spacing: { after: 80 },
                    children: [
                        new TextRun({ text: "c.   Verifique que la ", font: "Arial", size: 19 }),
                        new TextRun({ text: "PC1", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: " ahora pueda hacer ping al ", font: "Arial", size: 19 }),
                        new TextRun({ text: "servidor DNS", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: " y a la ", font: "Arial", size: 19 }),
                        new TextRun({ text: "PC4", bold: true, font: "Arial", size: 19 }),
                        new TextRun({ text: ".", font: "Arial", size: 19 })
                    ]
                }),
                // VERIFICACIÓN FINAL EN ROJO
                new Paragraph({
                    indent: { left: 720 },
                    spacing: { after: 160 },
                    children: [
                        new TextRun({
                            text: "Verificación realizada: Una vez eliminada la ACL 11 y su aplicación en la interfaz Serial0/0/0 (out) de R1, los comandos 'ping 192.168.30.12' (PC4) y 'ping 192.168.31.12' (Servidor DNS) ejecutados desde el símbolo del sistema de la PC1 tienen éxito al 100%.",
                            bold: true,
                            font: "Arial",
                            size: 19,
                            color: "FF0000"
                        })
                    ]
                })
            ]
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    for (const outPath of outputPaths) {
        fs.writeFileSync(outPath, buffer);
    }
}

// ============================================================================
// 2. GENERAR HTML Y COMPILAR PDF IDÉNTICO AL DOCUMENTO WORD DE CISCO NETACAD
// ============================================================================
function crearHtmlWordCisco() {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>4.1.4 Packet Tracer: demostración de listas de control de acceso</title>
    <style>
        @page {
            size: letter portrait;
            margin: 0;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 9.8pt;
            line-height: 1.32;
            color: #000000;
            background: #ffffff;
        }
        .page {
            width: 8.5in;
            height: 11in;
            padding: 0.72in 0.78in 0.65in 0.78in;
            position: relative;
            page-break-after: always;
            break-after: page;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .page:last-child {
            page-break-after: auto;
            break-after: auto;
        }
        /* Header de páginas 2 y 3 estilo Word Cisco */
        .running-header {
            font-size: 9.5pt;
            font-weight: bold;
            padding-bottom: 5px;
            border-bottom: 2.2px solid #000000;
            margin-bottom: 18px;
        }
        /* Logo Cisco Networking Academy en Página 1 */
        .cisco-logo-wrap {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 18px;
        }
        .cisco-bars {
            display: flex;
            align-items: center;
            gap: 4px;
            height: 28px;
        }
        .bar {
            width: 3.5px;
            background-color: #0096d6;
            border-radius: 2px;
        }
        .b1 { height: 7px; }
        .b2 { height: 14px; }
        .b3 { height: 24px; }
        .cisco-text-block {
            display: flex;
            flex-direction: column;
        }
        .cisco-brand-row {
            display: flex;
            align-items: baseline;
            gap: 10px;
        }
        .cisco-word {
            font-weight: 900;
            font-size: 16pt;
            letter-spacing: 2px;
            color: #0096d6;
        }
        .netacad-word {
            font-weight: 300;
            font-size: 17pt;
            color: #222222;
            line-height: 1.05;
        }

        h1.doc-title {
            font-size: 15.5pt;
            font-weight: bold;
            margin-bottom: 10px;
        }
        h2.sec-title {
            font-size: 13pt;
            font-weight: bold;
            margin-top: 10px;
            margin-bottom: 7px;
        }
        h3.subsec-title {
            font-size: 11.2pt;
            font-weight: bold;
            margin-top: 10px;
            margin-bottom: 7px;
        }
        h4.step-title {
            font-size: 10pt;
            font-weight: bold;
            margin-top: 8px;
            margin-bottom: 6px;
        }
        .indent-1 {
            margin-left: 24px;
            margin-bottom: 6px;
        }
        .indent-2 {
            margin-left: 48px;
            margin-bottom: 6px;
        }
        .step-item {
            display: flex;
            margin-left: 24px;
            margin-bottom: 6px;
        }
        .step-letter {
            width: 24px;
            flex-shrink: 0;
        }
        .step-body {
            flex: 1;
        }

        /* Tabla Word Cisco */
        table.addr-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
            margin-bottom: 14px;
            font-size: 9.3pt;
        }
        table.addr-table th {
            background-color: #d9e2f3;
            border: 1px solid #444444;
            padding: 5px 8px;
            text-align: center;
            font-weight: bold;
        }
        table.addr-table td {
            border: 1px solid #444444;
            padding: 4px 8px;
            vertical-align: top;
        }

        /* Comandos CLI */
        .cli-block {
            font-family: "Courier New", Courier, monospace;
            font-size: 9.2pt;
            line-height: 1.28;
            margin-left: 48px;
            margin-top: 5px;
            margin-bottom: 8px;
            white-space: pre;
        }

        /* Respuestas en color ROJO estilo Word */
        .respuesta-roja {
            color: #ff0000;
            font-weight: bold;
            margin-left: 48px;
            margin-top: 4px;
            margin-bottom: 10px;
            line-height: 1.36;
        }

        /* Pie de página idéntico a Cisco NetAcad */
        .footer {
            font-size: 7.8pt;
            color: #111111;
            width: 100%;
            margin-top: auto;
            padding-top: 8px;
        }
        .footer-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .footer-link {
            text-align: center;
            color: #0088cc;
            margin-top: 1px;
            margin-left: 140px;
        }
    </style>
</head>
<body>

    <!-- ==================== PÁGINA 1 ==================== -->
    <div class="page">
        <div class="content">
            <div style="display:flex; align-items:flex-start; gap:14px; margin-bottom:14px;">
                <div style="display:flex; flex-direction:column; align-items:center;">
                    <div class="cisco-bars">
                        <div class="bar b1"></div><div class="bar b2"></div><div class="bar b3"></div><div class="bar b2"></div><div class="bar b1"></div><div class="bar b2"></div><div class="bar b3"></div><div class="bar b2"></div><div class="bar b1"></div>
                    </div>
                    <div class="cisco-word" style="margin-top:3px;">CISCO.</div>
                </div>
                <div class="netacad-word" style="margin-top:1px;">
                    Networking<br>Academy
                </div>
            </div>

            <h1 class="doc-title">Packet Tracer: demostración de listas de control de acceso</h1>

            <h2 class="sec-title">Objetivos</h2>
            <p class="indent-1"><strong>Parte 1: verificar la conectividad local y probar la lista de control de acceso</strong></p>
            <p class="indent-1" style="margin-bottom:12px;"><strong>Parte 2: eliminar la lista de control de acceso y repetir la prueba</strong></p>

            <h2 class="sec-title">Aspectos básicos</h2>
            <p class="indent-1" style="margin-bottom:12px;">
                En esta actividad, observará cómo se puede utilizar una lista de control de acceso (ACL) para evitar que un ping llegue a hosts en redes remotas. Después de eliminar la ACL de la configuración, los pings se realizarán correctamente.
            </p>

            <h2 class="sec-title">Tabla de asignación de direcciones</h2>
            <table class="addr-table">
                <thead>
                    <tr>
                        <th style="width:28%;">Dispositivo</th>
                        <th style="width:29%;">Interfaz</th>
                        <th style="width:43%;">Dirección IP / Prefijo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td rowspan="3">R1</td>
                        <td>G0/0</td>
                        <td>192.168.10.1/24</td>
                    </tr>
                    <tr>
                        <td>G0/1</td>
                        <td>192.168.11.1/24</td>
                    </tr>
                    <tr>
                        <td>S0/0/0</td>
                        <td>10.1.1.1/30</td>
                    </tr>
                    <tr>
                        <td rowspan="2">R2</td>
                        <td>S0/0/0</td>
                        <td>10.10.1.2/30</td>
                    </tr>
                    <tr>
                        <td>S0/0/1</td>
                        <td>10.10.1.5/30</td>
                    </tr>
                    <tr>
                        <td rowspan="3">R3</td>
                        <td>G0/0</td>
                        <td>192.168.30.1/24</td>
                    </tr>
                    <tr>
                        <td>G0/1</td>
                        <td>192.168.31.1/24</td>
                    </tr>
                    <tr>
                        <td>S0/0/1</td>
                        <td>10.10.1.6/24</td>
                    </tr>
                    <tr>
                        <td>PC1</td>
                        <td>NIC</td>
                        <td>192.168.10.10/24</td>
                    </tr>
                    <tr>
                        <td>PC2</td>
                        <td>NIC</td>
                        <td>192.168.10.11/24</td>
                    </tr>
                    <tr>
                        <td>PC3</td>
                        <td>NIC</td>
                        <td>192.168.11.10/24</td>
                    </tr>
                    <tr>
                        <td>PC4</td>
                        <td>NIC</td>
                        <td>192.168.30.12/24</td>
                    </tr>
                    <tr>
                        <td>Servidor DNS</td>
                        <td>NIC</td>
                        <td>192.168.31.12/24</td>
                    </tr>
                </tbody>
            </table>

            <h2 class="sec-title">Instrucciones</h2>
            <h3 class="subsec-title">Parte 1: verificar la conectividad local y probar la lista de control de acceso</h3>
            <h4 class="step-title">Paso 1: hacer ping a los dispositivos de la red local para verificar la conectividad.</h4>

            <div class="step-item">
                <div class="step-letter">a.</div>
                <div class="step-body">Desde el símbolo del sistema de la <strong>PC1</strong>, haga ping a la <strong>PC2</strong>.</div>
            </div>
            <div class="step-item">
                <div class="step-letter">b.</div>
                <div class="step-body">Desde el símbolo del sistema de la <strong>PC1</strong>, haga ping a la <strong>PC3</strong>.</div>
            </div>

            <p class="indent-2" style="margin-top:6px;">¿Por qué se realizaron de forma correcta los pings?</p>
            <p class="respuesta-roja">
                Porque las capas 1 a 3 son completamente funcionales y no existe ninguna política ni lista de control de acceso (ACL) que filtre o bloquee los paquetes ICMP entre las redes locales (192.168.10.0/24 y 192.168.11.0/24). El tráfico entre PC1 y PC2 permanece dentro de la misma LAN y el tráfico entre PC1 y PC3 solo atraviesa las interfaces GigabitEthernet0/0 y GigabitEthernet0/1 de R1, las cuales no tienen ninguna ACL aplicada.
            </p>
        </div>

        <div class="footer">
            <div class="footer-top">
                <span>© 2013 - aa Cisco y/o sus filiales. Todos los derechos reservados. Información pública de Cisco</span>
                <span>Página <strong>1</strong> de <strong>3</strong></span>
            </div>
            <div class="footer-link">www.netacad.com</div>
        </div>
    </div>

    <!-- ==================== PÁGINA 2 ==================== -->
    <div class="page">
        <div class="content">
            <div class="running-header">Packet Tracer: demostración de listas de control de acceso</div>

            <h4 class="step-title">Paso 2: hacer ping a los dispositivos en las redes remotas para probar la funcionalidad de la ACL.</h4>

            <div class="step-item">
                <div class="step-letter">a.</div>
                <div class="step-body">Desde el símbolo del sistema de la <strong>PC1</strong>, haga ping a la <strong>PC4</strong>.</div>
            </div>
            <div class="step-item">
                <div class="step-letter">b.</div>
                <div class="step-body">Desde el símbolo del sistema de la <strong>PC1</strong>, haga ping al <strong>servidor DNS</strong>.</div>
            </div>

            <p class="indent-2" style="margin-top:6px;">
                ¿Por qué fallaron los pings? (<strong>pista:</strong> utilice el modo de simulación o vea las configuraciones del router para investigar).
            </p>
            <p class="respuesta-roja">
                Los pings fallaron (mostrando el mensaje "Destination host unreachable" desde 192.168.10.1) porque el router R1 está configurado con una lista de control de acceso estándar (ACL 11) aplicada en la interfaz de salida Serial0/0/0, cuya primera instrucción (deny 192.168.10.0 0.0.0.255) bloquea e impide que cualquier paquete originado en la red 192.168.10.0/24 salga hacia las redes remotas.
            </p>

            <h3 class="subsec-title" style="margin-top:16px;">Parte 2: eliminar la ACL y repetir la prueba</h3>
            <h4 class="step-title">Paso 1: utilizar el comando show para investigar la configuración de la ACL.</h4>

            <div class="step-item">
                <div class="step-letter">a.</div>
                <div class="step-body">
                    Desplácese hasta R1 CLI. Utilice los comandos <strong>show run</strong> y <strong>show access-lists</strong> para ver las ACL configuradas actualmente. Para obtener una vista rápida de las ACL vigentes, utilice <strong>show access-lists</strong>. Introduzca el comando <strong>show access-lists</strong> seguido de un espacio y un signo de interrogación (?) para ver las opciones disponibles:
                </div>
            </div>

            <div class="cli-block">R1# <strong>show access-lists ?</strong>
  &lt;1-199&gt;  ACL number
  WORD     ACL name
  &lt;cr&gt;</div>

            <p class="indent-2">
                Si conoce el número o el nombre de la ACL, puede filtrar aún más el resultado del comando <strong>show</strong>. Sin embargo, el <strong>R1</strong> tiene solo una ACL, por lo que basta con el comando <strong>show access-lists</strong>.
            </p>

            <div class="cli-block">R1#<strong>show access-lists</strong>
Standard IP access list 11
   10 deny 192.168.10.0 0.0.0.255
   20 permit any</div>

            <p class="indent-2">
                La primera línea de la ACL impide cualquier paquete que se origine en la red <strong>192.168.10.0/24</strong> lo que incluye los ecos del protocolo de mensajería de control de Internet (ICMP) (solicitudes de ping). La segunda línea de la ACL permite que todo el resto del tráfico <strong>ip</strong> de cualquier origen atraviese el router.
            </p>

            <div class="step-item" style="margin-top:8px;">
                <div class="step-letter">b.</div>
                <div class="step-body">
                    Para que una ACL tenga efecto en el funcionamiento del router, debe aplicarse a una interfaz en una dirección específica. En esta situación, la ACL se utiliza para filtrar el tráfico que sale de una interfaz. Por lo tanto, todo el tráfico que sale de la interfaz especificada de R1 se examinará contra la ACL 11.
                </div>
            </div>

            <p class="indent-2">
                Aunque pueda ver la información de IP con el comando <strong>show ip interface</strong>, en algunos casos puede ser más eficaz utilizar solo el comando <strong>show run</strong>. Para obtener una lista completa de interfaces a las que se puede aplicar la ACL y la lista de todas las ACL configuradas, utilice el siguiente comando:
            </p>

            <div class="cli-block">R1# <strong>show run | include interface|access</strong>
interface GigabitEthernet0/0
interface GigabitEthernet0/1
interface Serial0/0/0
 ip access-group 11 out
interface Serial0/0/1
interface Vlan1
access-list 11 deny 192.168.10.0 0.0.0.255
access-list 11 permit any</div>

            <p class="indent-2">
                El segundo símbolo de tubería '|' crea una condición OR que coincide con 'interfaz' O 'acceso'. Es importante que no se incluyan espacios en la condición OR. Utilice uno o ambos comandos para buscar información sobre la ACL.
            </p>
        </div>

        <div class="footer">
            <div class="footer-top">
                <span>© 2013 - aa Cisco y/o sus filiales. Todos los derechos reservados. Información pública de Cisco</span>
                <span>Página <strong>2</strong> de <strong>3</strong></span>
            </div>
            <div class="footer-link">www.netacad.com</div>
        </div>
    </div>

    <!-- ==================== PÁGINA 3 ==================== -->
    <div class="page">
        <div class="content">
            <div class="running-header">Packet Tracer: demostración de listas de control de acceso</div>

            <p class="indent-2" style="margin-top:6px;">¿A qué interfaz y en qué dirección se aplica la ACL?</p>
            <p class="respuesta-roja">
                La ACL 11 se aplica a la interfaz Serial0/0/0 (s0/0/0) en dirección de salida (out / saliente), mediante el comando "ip access-group 11 out".
            </p>

            <h4 class="step-title" style="margin-top:18px;">Paso 2: eliminar la lista de acceso 11 de la configuración.</h4>
            <p class="indent-1" style="margin-bottom:10px;">
                Es posible eliminar las ACL de la configuración por medio de la emisión del comando <strong>no access-list</strong> <em>[número de ACL]</em>. El comando <strong>no access-list</strong> cuando se usa sin argumentos elimina todas las ACL configuradas en el router. El comando <strong>no access-list</strong> <em>[número de ACL]</em> solo elimina una ACL específica. La eliminación de una ACL de un enrutador no elimina la ACL de la interfaz. El comando que aplica la ACL a la interfaz debe eliminarse por separado.
            </p>

            <div class="step-item">
                <div class="step-letter">a.</div>
                <div class="step-body">En la interfaz Serial0/0/0, quiten la lista de acceso 11 aplicada antes a la interfaz como filtro <strong>saliente</strong>:</div>
            </div>
            <div class="cli-block">R1(config)# <strong>interface s0/0/0</strong>
R1(config-if)# <strong>no ip access-group 11 out</strong></div>

            <div class="step-item" style="margin-top:8px;">
                <div class="step-letter">b.</div>
                <div class="step-body">En el modo de configuración global, elimine la ACL por medio del siguiente comando:</div>
            </div>
            <div class="cli-block">R1(config)# <strong>no access-list 11</strong></div>

            <div class="step-item" style="margin-top:8px;">
                <div class="step-letter">c.</div>
                <div class="step-body">Verifique que la <strong>PC1</strong> ahora pueda hacer ping al <strong>servidor DNS</strong> y a la <strong>PC4</strong>.</div>
            </div>

            <p class="respuesta-roja" style="margin-top:8px;">
                Verificación completada: Después de ejecutar los comandos en R1 para quitar el filtro de salida en Serial0/0/0 ("no ip access-group 11 out") y eliminar la ACL ("no access-list 11"), los pings desde la PC1 hacia la PC4 (ping 192.168.30.12) y hacia el Servidor DNS (ping 192.168.31.12) se realizan correctamente sin pérdida de paquetes.
            </p>
        </div>

        <div class="footer">
            <div class="footer-top">
                <span>© 2013 - aa Cisco y/o sus filiales. Todos los derechos reservados. Información pública de Cisco</span>
                <span>Página <strong>3</strong> de <strong>3</strong></span>
            </div>
            <div class="footer-link">www.netacad.com</div>
        </div>
    </div>

</body>
</html>`;
}

async function main() {
    const projectDir = path.join(__dirname, '..');
    const downloadsDir = path.join(process.env.USERPROFILE || 'C:\\Users\\ximel', 'Downloads');

    const baseName = '4.1.4_Packet_Tracer_Demostracion_ACL_Respuestas';

    const docxProjectPath = path.join(projectDir, `${baseName}.docx`);
    const docxDownloadsPath = path.join(downloadsDir, `${baseName}.docx`);

    const htmlProjectPath = path.join(projectDir, `${baseName}.html`);
    const pdfProjectPath = path.join(projectDir, `${baseName}.pdf`);
    const pdfDownloadsPath = path.join(downloadsDir, `${baseName}.pdf`);

    console.log('1. Generando archivo Word (.docx)...');
    await crearWordDocx([docxProjectPath, docxDownloadsPath]);
    console.log('   ✅ Word guardado en:', docxDownloadsPath);

    console.log('2. Generando archivo PDF con formato Word de Cisco NetAcad...');
    const html = crearHtmlWordCisco();
    fs.writeFileSync(htmlProjectPath, html, 'utf8');

    const edgePaths = [
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
    ];
    const selectedEdge = edgePaths.find(p => fs.existsSync(p));
    if (!selectedEdge) {
        throw new Error('No se encontró Microsoft Edge para compilar el PDF.');
    }

    const cmd = `"${selectedEdge}" --headless --disable-gpu --print-to-pdf="${pdfProjectPath}" --no-pdf-header-footer "${htmlProjectPath}"`;
    execSync(cmd);
    fs.copyFileSync(pdfProjectPath, pdfDownloadsPath);
    console.log('   ✅ PDF guardado en:', pdfDownloadsPath);
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
