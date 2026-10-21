const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Costos de Calidad - Proyecto LocalMarket</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap');

        @page {
            size: A4 portrait;
            margin: 1.6cm 1.4cm 1.6cm 1.4cm;
            @bottom-right {
                content: "Página " counter(page);
                font-family: 'Inter', sans-serif;
                font-size: 8pt;
                color: #64748b;
            }
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            background-color: #ffffff;
            line-height: 1.5;
            font-size: 9pt;
        }

        .page-break {
            page-break-before: always;
            break-before: page;
        }

        .avoid-break {
            page-break-inside: avoid;
            break-inside: avoid;
        }

        /* PORTADA */
        .cover-page {
            height: 98vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 2.2cm 1.2cm 1.5cm 1.2cm;
            border-left: 8px solid #1e3a8a;
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        }

        .badge-pill {
            display: inline-block;
            background-color: #1e3a8a;
            color: #ffffff;
            font-size: 8.5pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            padding: 5px 14px;
            border-radius: 6px;
            margin-bottom: 0.8cm;
        }

        .cover-title {
            font-size: 24pt;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.2;
            margin-bottom: 10px;
        }

        .cover-subtitle {
            font-size: 12pt;
            color: #475569;
            font-weight: 500;
            line-height: 1.4;
            margin-bottom: 1.2cm;
        }

        .meta-box {
            background-color: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            padding: 18px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            margin-bottom: 1.2cm;
        }

        .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
        }

        .meta-item label {
            display: block;
            font-size: 7.5pt;
            text-transform: uppercase;
            font-weight: 700;
            color: #64748b;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
        }

        .meta-item p {
            font-size: 9.5pt;
            font-weight: 600;
            color: #0f172a;
        }

        .summary-badge-container {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }

        .summary-badge {
            flex: 1;
            background: #f1f5f9;
            border-left: 3px solid #1e3a8a;
            padding: 10px 8px;
            border-radius: 0 6px 6px 0;
            text-align: center;
        }

        .summary-badge .num {
            font-size: 14pt;
            font-weight: 800;
            color: #1e3a8a;
            display: block;
        }

        .summary-badge .lbl {
            font-size: 7.5pt;
            font-weight: 700;
            text-transform: uppercase;
            color: #475569;
        }

        .cover-footer {
            border-top: 1px solid #cbd5e1;
            padding-top: 14px;
            display: flex;
            justify-content: space-between;
            font-size: 8.5pt;
            color: #64748b;
        }

        /* ENCABEZADOS */
        h1.section-title {
            font-size: 14pt;
            font-weight: 800;
            color: #0f172a;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 5px;
            margin-top: 18px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
        }

        h1.section-title span.number {
            background-color: #1e3a8a;
            color: #ffffff;
            font-size: 9.5pt;
            width: 22px;
            height: 22px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            margin-right: 8px;
        }

        h2.subsection-title {
            font-size: 11pt;
            font-weight: 700;
            color: #1e293b;
            margin-top: 14px;
            margin-bottom: 8px;
            border-left: 4px solid #2563eb;
            padding-left: 8px;
        }

        p {
            margin-bottom: 8px;
            text-align: justify;
            color: #334155;
            font-size: 8.8pt;
        }

        /* CAJAS Y CALLOUTS */
        .callout {
            background-color: #f8fafc;
            border-left: 4px solid #3b82f6;
            border-radius: 0 8px 8px 0;
            padding: 10px 14px;
            margin: 10px 0;
            font-size: 8.5pt;
        }

        .callout-title {
            font-weight: 700;
            color: #1d4ed8;
            margin-bottom: 3px;
            font-size: 9pt;
        }

        .quote-box {
            background-color: #f1f5f9;
            border-left: 4px solid #0f172a;
            padding: 10px 14px;
            font-style: italic;
            margin: 10px 0;
            color: #334155;
            border-radius: 0 6px 6px 0;
            font-size: 8.8pt;
        }

        /* TABLAS DE COSTOS */
        table.cost-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8pt;
            margin: 10px 0 14px 0;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            overflow: hidden;
        }

        table.cost-table th {
            background-color: #0f172a;
            color: #ffffff;
            padding: 6px 8px;
            font-weight: 600;
            text-align: left;
            font-size: 7.5pt;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        table.cost-table td {
            padding: 5px 8px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
            vertical-align: middle;
        }

        table.cost-table tr:nth-child(even) {
            background-color: #f8fafc;
        }

        table.cost-table tr.subtotal-row {
            background-color: #eff6ff;
            font-weight: 700;
            color: #1e3a8a;
            border-top: 1px solid #bfdbfe;
            border-bottom: 2px solid #93c5fd;
        }

        table.cost-table tr.total-row {
            background-color: #1e3a8a;
            color: #ffffff;
            font-weight: 800;
            font-size: 8.5pt;
        }

        table.cost-table tr.total-row td {
            color: #ffffff;
            border-bottom: none;
        }

        .badge-cat {
            display: inline-block;
            font-size: 7pt;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
            text-transform: uppercase;
        }
        .cat-prev { background: #dcfce7; color: #166534; }
        .cat-eval { background: #e0f2fe; color: #075985; }
        .cat-fint { background: #fef3c7; color: #92400e; }
        .cat-fext { background: #fee2e2; color: #991b1b; }

        /* BARRAS DE PROGRESO DE DISTRIBUCIÓN */
        .bar-container {
            display: flex;
            height: 22px;
            border-radius: 6px;
            overflow: hidden;
            margin: 12px 0 16px 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .bar-seg {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 7.5pt;
            font-weight: 700;
        }
        .bar-prev { background: #16a34a; }
        .bar-eval { background: #0284c7; }
        .bar-fint { background: #d97706; }
        .bar-fext { background: #dc2626; }

        .legend-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 14px;
        }
        .legend-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 8px;
            border-radius: 6px;
            text-align: center;
        }
        .legend-card .pct {
            font-size: 11pt;
            font-weight: 800;
            display: block;
        }
        .legend-card .lbl {
            font-size: 7pt;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
        }

        /* GRID TÉCNICO */
        .tech-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin: 8px 0 12px 0;
        }
        .tech-card {
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 10px 12px;
        }
        .tech-card h4 {
            font-size: 8.8pt;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .tech-card p {
            font-size: 8pt;
            color: #475569;
            margin-bottom: 0;
            line-height: 1.4;
        }

        .code-inline {
            font-family: 'Fira Code', monospace;
            font-size: 7.8pt;
            background: #f1f5f9;
            color: #0f172a;
            padding: 1px 4px;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>

    <!-- ============================================================ -->
    <!-- PORTADA                                                      -->
    <!-- ============================================================ -->
    <div class="cover-page">
        <div>
            <span class="badge-pill">Gestión de Calidad del Software (CoQ)</span>
            <h1 class="cover-title">Análisis y Resumen de los Costos de Calidad</h1>
            <p class="cover-subtitle">
                Modelado Económico-Operativo basado en los <strong>Fundamentos de Costos de Calidad</strong> (Marcelo Pulgar Espejo / ASQC) aplicado al Sistema E-Commerce <strong>LocalMarket</strong> (Proyecto 7).
            </p>

            <div class="meta-box">
                <div class="meta-grid">
                    <div class="meta-item">
                        <label>Proyecto Evaluado</label>
                        <p>LocalMarket (SaaS Marketplace Multi-Rol)</p>
                    </div>
                    <div class="meta-item">
                        <label>Metodología Base</label>
                        <p>Modelo P-A-F (Prevención, Evaluación, Fallas) - ASQC</p>
                    </div>
                    <div class="meta-item">
                        <label>Enfoque Estratégico</label>
                        <p>Prevención vs. Reacción (Dr. James Harrington)</p>
                    </div>
                    <div class="meta-item">
                        <label>Infraestructura & BD</label>
                        <p>PostgreSQL 18 + Node.js / Express (ACID)</p>
                    </div>
                    <div class="meta-item">
                        <label>Costo Total de Calidad (CoQ)</label>
                        <p style="color: #1e3a8a;">$108,500.00 MXN (Presupuesto Semestral)</p>
                    </div>
                    <div class="meta-item">
                        <label>Índice de Conformidad</label>
                        <p style="color: #16a34a;">71.4% Inversión Proactiva (Buenas Prácticas)</p>
                    </div>
                </div>

                <div class="summary-badge-container">
                    <div class="summary-badge">
                        <span class="num">$46,500</span>
                        <span class="lbl">1. Prevención (42.9%)</span>
                    </div>
                    <div class="summary-badge">
                        <span class="num">$31,000</span>
                        <span class="lbl">2. Evaluación (28.6%)</span>
                    </div>
                    <div class="summary-badge">
                        <span class="num">$18,000</span>
                        <span class="lbl">3. Fallas Internas (16.6%)</span>
                    </div>
                    <div class="summary-badge">
                        <span class="num">$13,000</span>
                        <span class="lbl">4. Fallas Externas (12.0%)</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="cover-footer">
            <span>LocalMarket &copy; 2026 - Auditoría y Gestión de Calidad</span>
            <span>Ubicación: Carpeta Descargas</span>
        </div>
    </div>

    <!-- ============================================================ -->
    <!-- SECCIÓN 1: FUNDAMENTOS TEÓRICOS DE LOS COSTOS DE CALIDAD     -->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">1</span> Fundamentos Teóricos de los Costos de Calidad</h1>

    <p>
        A partir del análisis del documento <em>"Fundamentos de los Costos de la Calidad: Los Costos de Calidad como Herramienta de Gestión"</em> 
        elaborado por <strong>Marcelo Pulgar Espejo (MP Asesorías)</strong>, se establece que en la industria contemporánea el concepto de calidad 
        ha evolucionado desde una visión simplista de "bueno o malo" hacia una estrategia integral de 
        <strong>satisfacción de las necesidades del cliente al menor costo posible</strong>, sustentada en dos pilares indisociables: 
        <strong>Cliente</strong> y <strong>Costos</strong>.
    </p>

    <div class="quote-box">
        "El costo de la Calidad se define como el costo incurrido para ayudar al empleado a que haga bien el trabajo todas las veces, y el coste de determinar si la producción es aceptable, más cualquier coste en que incurre la empresa y/o el cliente, porque la producción o el servicio no cumplió las especificaciones o expectativas del cliente."
        <br><strong style="font-style: normal; color: #0f172a; display: block; margin-top: 4px;">— Dr. James Harrington</strong>
    </div>

    <h2 class="subsection-title">Evolución Histórica y Normativa</h2>
    <p>
        El interés formal por medir los costos asociados a la calidad se originó con la norma militar estadounidense 
        <strong>MIL-Q-9858A (1963)</strong>, la cual obligó a los contratistas y subcontratistas a documentar y registrar los costos de prevención 
        y corrección de defectos como condición contractual. Posteriormente, en 1961, la <strong>ASQC (American Society for Quality Control)</strong> 
        instituyó el <em>Quality Costs Committee</em> y publicó en 1967 su obra seminal <em>"Quality Costs – What and How"</em>, formalizando el modelo 
        de costos que hoy rige la gestión empresarial bajo estándares ISO 9000 y TQM (Gestión de Calidad Total).
    </p>

    <h2 class="subsection-title">El Paradigma Estratégico: Prevención vs. Reacción</h2>
    <p>
        El principio medular expuesto por Pulgar Espejo es la superioridad económica de la <strong>Prevención sobre la Reacción</strong>. 
        En la medida en que un defecto avanza en el ciclo de vida productivo (o ciclo de desarrollo de software), su impacto económico se multiplica 
        de forma exponencial. En términos de ingeniería de software (Regla 1-10-100 de Boehm):
    </p>

    <div class="tech-grid">
        <div class="tech-card">
            <h4>🛡️ Costo de Prevenir ($1x)</h4>
            <p>Diseñar un modelo relacional normalizado (3FN) e implementar triggers anti-stock negativo en PostgreSQL cuesta unas horas de análisis inicial.</p>
        </div>
        <div class="tech-card">
            <h4>🔍 Costo de Evaluar ($10x)</h4>
            <p>Detectar un fallo de concurrencia mediante pruebas de carga y linters automatizados en fase de QA antes de salir a producción.</p>
        </div>
        <div class="tech-card">
            <h4>⚠️ Falla Interna ($20x - $50x)</h4>
            <p>Descubrir un bug en el checkout durante staging requiere refactorización de código, re-pruebas de integración y retrasos en el despliegue.</p>
        </div>
        <div class="tech-card">
            <h4>💥 Falla Externa ($100x+)</h4>
            <p>Un quiebre de stock no controlado en producción provoca sobreventas, quejas de clientes, cancelaciones forzosas, devoluciones y daño de reputación.</p>
        </div>
    </div>

    <h2 class="subsection-title">Clasificación Estructural de los Costos de Calidad</h2>
    <p>El marco clasifica los costos directos de calidad en dos grandes macro-categorías:</p>
    <ul style="margin-left: 20px; font-size: 8.5pt; color: #334155; line-height: 1.6;">
        <li><strong>Costos de Conformidad (Inversión Proactiva):</strong> Fondos orientados a asegurar que el producto cumpla las especificaciones desde el primer intento. Comprende los <strong>Costos de Prevención</strong> (diseño, capacitación, arquitectura) y los <strong>Costos de Evaluación</strong> (pruebas, auditorías, medición).</li>
        <li><strong>Costos de No Conformidad (Costo del Desperdicio):</strong> Pérdidas económicas causadas por errores, fallos o incumplimiento de requisitos. Se divide en <strong>Fallas Internas</strong> (detectadas antes de liberar el producto al usuario) y <strong>Fallas Externas</strong> (manifestadas una vez que el producto está en manos del cliente en producción).</li>
    </ul>

    <!-- ============================================================ -->
    <!-- SECCIÓN 2: APLICACIÓN DE LOS COSTOS AL PROYECTO LOCALMARKET  -->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">2</span> Aplicación del Modelo CoQ al Proyecto LocalMarket</h1>

    <p>
        <strong>LocalMarket (Proyecto 7)</strong> es una plataforma de comercio electrónico multi-rol orientada a productores locales y clientes, 
        que gestiona inventario en tiempo real, catálogos (Suplementos, Cafés, Cápsulas, Aceites, Cuidado Personal), pasarela de órdenes atómicas 
        y autenticación segura 2FA/OTP sobre <strong>Node.js, Express y PostgreSQL 18</strong>. A continuación se desglosan las actividades y 
        costos específicos aplicados al proyecto para un periodo operativo semestral:
    </p>

    <!-- 1. PREVENCIÓN -->
    <div class="avoid-break">
        <h2 class="subsection-title">2.1. Costos de Prevención (Costos de Conformidad)</h2>
        <p>Inversiones destinadas a evitar defectos en el código, inconsistencias de base de datos y fallos de usabilidad:</p>
        <table class="cost-table">
            <thead>
                <tr>
                    <th style="width: 28%;">Actividad / Concepto</th>
                    <th style="width: 38%;">Descripción en LocalMarket</th>
                    <th style="width: 18%;">Recursos Involucrados</th>
                    <th style="width: 16%;">Costo ($ MXN)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Planificación y Arquitectura BD</strong></td>
                    <td>Modelado formal relacional en 3FN (13 tablas), diseño de triggers anti-stock negativo (<code class="code-inline">trg_evitar_stock_negativo</code>) y procedimientos atómicos.</td>
                    <td>Arquitecto de Software / DBA</td>
                    <td>$14,500.00</td>
                </tr>
                <tr>
                    <td><strong>Capacitación en Buenas Prácticas</strong></td>
                    <td>Talleres para desarrolladores en transacciones ACID de PostgreSQL, seguridad OWASP (prevención de inyección SQL con consultas parametrizadas) y Clean Code.</td>
                    <td>Equipo de Desarrollo Full-Stack</td>
                    <td>$11,000.00</td>
                </tr>
                <tr>
                    <td><strong>Revisión y Verificación de Diseños</strong></td>
                    <td>Inspección de maquetas de dashboard, flujos UX de compra rápida y navegación ergonómica en tarjetas KPI de métricas antes de su codificación.</td>
                    <td>Diseñador UI/UX + Product Owner</td>
                    <td>$9,500.00</td>
                </tr>
                <tr>
                    <td><strong>Aseguramiento de Seguridad y 2FA</strong></td>
                    <td>Diseño preventivo de flujo de verificación OTP telefónica, encriptación de credenciales y gestión granular de roles y permisos (RBAC).</td>
                    <td>Especialista en Ciberseguridad</td>
                    <td>$7,000.00</td>
                </tr>
                <tr>
                    <td><strong>Configuración de Herramientas de Calidad</strong></td>
                    <td>Implementación de reglas de linter (ESLint), formateo automatizado (Prettier) y pipelines de integración continua para estandarización.</td>
                    <td>Ingeniero DevOps</td>
                    <td>$4,500.00</td>
                </tr>
                <tr class="subtotal-row">
                    <td colspan="3">SUBTOTAL COSTOS DE PREVENCIÓN (42.9% del CoQ)</td>
                    <td>$46,500.00</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- 2. EVALUACIÓN -->
    <div class="avoid-break">
        <h2 class="subsection-title">2.2. Costos de Evaluación (Costos de Conformidad)</h2>
        <p>Gastos incurridos para verificar, auditar y validar que el sistema funcione según las especificaciones técnicas:</p>
        <table class="cost-table">
            <thead>
                <tr>
                    <th style="width: 28%;">Actividad / Concepto</th>
                    <th style="width: 38%;">Descripción en LocalMarket</th>
                    <th style="width: 18%;">Recursos Involucrados</th>
                    <th style="width: 16%;">Costo ($ MXN)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Pruebas Automatizadas (Unit & API)</strong></td>
                    <td>Desarrollo y ejecución de suites de pruebas para endpoints críticos (<code class="code-inline">/api/pedidos</code>, <code class="code-inline">/api/productos</code>, <code class="code-inline">/api/usuarios</code>).</td>
                    <td>QA Automation Engineer</td>
                    <td>$12,000.00</td>
                </tr>
                <tr>
                    <td><strong>Pruebas de Estrés y Concurrencia</strong></td>
                    <td>Simulación de compras masivas simultáneas contra el pool de conexiones de PostgreSQL para asegurar estabilidad en horas pico.</td>
                    <td>QA Performance / Servidor Cloud</td>
                    <td>$8,500.00</td>
                </tr>
                <tr>
                    <td><strong>Auditorías de Código y Vulnerabilidades</strong></td>
                    <td>Escaneo continuo de dependencias (<code class="code-inline">npm audit</code>), análisis estático de seguridad (SAST) y revisión por pares (Code Reviews).</td>
                    <td>Lead Developer / Security Tooling</td>
                    <td>$5,500.00</td>
                </tr>
                <tr>
                    <td><strong>Pruebas de Aceptación de Usuario (UAT)</strong></td>
                    <td>Sesiones de validación funcional con vendedores reales para probar la carga de productos, visualización de pedidos y confirmación de entregas.</td>
                    <td>Comunidad Beta / Coordinador QA</td>
                    <td>$5,000.00</td>
                </tr>
                <tr class="subtotal-row">
                    <td colspan="3">SUBTOTAL COSTOS DE EVALUACIÓN (28.6% del CoQ)</td>
                    <td>$31,000.00</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- ============================================================ -->
    <!-- SECCIÓN 3: COSTOS DE NO CONFORMIDAD (FALLAS INTERNAS/EXTERNAS)-->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">3</span> Costos de No Conformidad en LocalMarket</h1>

    <p>
        Los costos de no conformidad cuantifican el impacto económico de los errores producidos. Gracias a la inversión en prevención 
        y evaluación, estos costos se mantienen controlados dentro de un margen seguro (28.6% global):
    </p>

    <!-- 3. FALLAS INTERNAS -->
    <div class="avoid-break">
        <h2 class="subsection-title">3.1. Costos de Fallas Internas (Detectadas antes de Producción)</h2>
        <p>Incurridos al depurar, corregir y reprocesar componentes defectuosos en el ambiente de desarrollo y pruebas:</p>
        <table class="cost-table">
            <thead>
                <tr>
                    <th style="width: 28%;">Actividad / Concepto</th>
                    <th style="width: 38%;">Manifestación en LocalMarket</th>
                    <th style="width: 18%;">Impacto Operativo</th>
                    <th style="width: 16%;">Costo ($ MXN)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Depuración y Corrección de Bugs</strong></td>
                    <td>Resolución de inconsistencias en el renderizado dinámico de la tabla de usuarios registrados y ajuste de sintaxis en consultas SQL.</td>
                    <td>Horas de desarrollador senior dedicadas a debugging</td>
                    <td>$8,000.00</td>
                </tr>
                <tr>
                    <td><strong>Re-inspección y Re-testing</strong></td>
                    <td>Repetición de ciclos de pruebas de regresión tras aplicar parches a los módulos de autenticación y actualización reactiva de stock.</td>
                    <td>Tiempo del analista QA repitiendo casos de prueba</td>
                    <td>$4,500.00</td>
                </tr>
                <tr>
                    <td><strong>Desperdicio por Refactorización</strong></td>
                    <td>Reescritura de módulos obsoletos de simulación de mensajería para convertirlos en el gestor profesional integrado WhatsApp/SMS.</td>
                    <td>Código y maquetación descartados por cambio de alcance</td>
                    <td>$3,500.00</td>
                </tr>
                <tr>
                    <td><strong>Inestabilidad en Staging</strong></td>
                    <td>Reinicios de base de datos local y regeneración de datos de prueba (seeders) por bloqueos de claves foráneas no controladas.</td>
                    <td>Pérdida de productividad del equipo de desarrollo</td>
                    <td>$2,000.00</td>
                </tr>
                <tr class="subtotal-row">
                    <td colspan="3">SUBTOTAL COSTOS DE FALLAS INTERNAS (16.6% del CoQ)</td>
                    <td>$18,000.00</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- 4. FALLAS EXTERNAS -->
    <div class="avoid-break">
        <h2 class="subsection-title">3.2. Costos de Fallas Externas (Detectadas por Clientes en Producción)</h2>
        <p>Pérdidas económicas generadas cuando un defecto impacta al comprador, al vendedor o a la operación del marketplace:</p>
        <table class="cost-table">
            <thead>
                <tr>
                    <th style="width: 28%;">Actividad / Concepto</th>
                    <th style="width: 38%;">Manifestación en LocalMarket</th>
                    <th style="width: 18%;">Consecuencia Financiera</th>
                    <th style="width: 16%;">Costo ($ MXN)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Atención de Quejas y Soporte Técnico</strong></td>
                    <td>Gestión de incidentes por usuarios con problemas al recibir códigos OTP o demoras en la actualización visual del estado de su orden.</td>
                    <td>Horas dedicadas por el personal de soporte al cliente</td>
                    <td>$5,000.00</td>
                </tr>
                <tr>
                    <td><strong>Cancelaciones y Devoluciones</strong></td>
                    <td>Reembolsos emitidos a compradores debido a discrepancias físicas de inventario (pedidos confirmados sin stock disponible).</td>
                    <td>Pérdida de la comisión de venta y costo de comisiones bancarias</td>
                    <td>$4,000.00</td>
                </tr>
                <tr>
                    <td><strong>Concesiones y Bonificaciones</strong></td>
                    <td>Cupones de descuento otorgados a clientes afectados por lentitud del servicio o entregas demoradas para retener su lealtad.</td>
                    <td>Descuentos directos en futuras compras</td>
                    <td>$2,500.00</td>
                </tr>
                <tr>
                    <td><strong>Pérdida de Clientes por Mala Experiencia</strong></td>
                    <td>Deserción de vendedores independientes (Churn) tras experimentar fricciones operativas en el panel de carga de productos.</td>
                    <td>Valor del tiempo de vida del cliente perdido (LTV)</td>
                    <td>$1,500.00</td>
                </tr>
                <tr class="subtotal-row">
                    <td colspan="3">SUBTOTAL COSTOS DE FALLAS EXTERNAS (12.0% del CoQ)</td>
                    <td>$13,000.00</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- ============================================================ -->
    <!-- SECCIÓN 4: RESUMEN FINANCIERO Y DISTRIBUCIÓN DEL COQ         -->
    <!-- ============================================================ -->
    <div class="page-break"></div>

    <h1 class="section-title"><span class="number">4</span> Resumen Financiero y Distribución Porcentual del CoQ</h1>

    <p>
        El <strong>Costo Total de Calidad (CoQ)</strong> de LocalMarket representa la inversión integral destinada a asegurar la excelencia 
        del servicio sumada al impacto de las imperfecciones del proceso. El balance general semestral se resume a continuación:
    </p>

    <!-- TABLA MAESTRA RESUMEN -->
    <table class="cost-table">
        <thead>
            <tr>
                <th style="width: 25%;">Macro-Categoría</th>
                <th style="width: 25%;">Clasificación de Costo</th>
                <th style="width: 25%;">Monto Asignado ($ MXN)</th>
                <th style="width: 25%;">Participación Relativa (%)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td rowspan="2" style="font-weight: 700; background: #f0fdf4; color: #166534;">
                    COSTOS DE CONFORMIDAD<br>
                    <span style="font-size: 7.5pt; font-weight: normal; color: #15803d;">(Inversión Proactiva / "Hacer las cosas bien")</span>
                </td>
                <td><span class="badge-cat cat-prev">Prevención</span></td>
                <td style="font-weight: 600;">$46,500.00</td>
                <td style="font-weight: 600;">42.86%</td>
            </tr>
            <tr>
                <td><span class="badge-cat cat-eval">Evaluación</span></td>
                <td style="font-weight: 600;">$31,000.00</td>
                <td style="font-weight: 600;">28.57%</td>
            </tr>
            <tr style="background: #f0fdf4; font-weight: 700; color: #166534; border-bottom: 2px solid #86efac;">
                <td colspan="2">SUBTOTAL CONFORMIDAD</td>
                <td>$77,500.00</td>
                <td>71.43%</td>
            </tr>

            <tr>
                <td rowspan="2" style="font-weight: 700; background: #fef2f2; color: #991b1b;">
                    COSTOS DE NO CONFORMIDAD<br>
                    <span style="font-size: 7.5pt; font-weight: normal; color: #b91c1c;">(Costo del Error / "Hacer las cosas mal")</span>
                </td>
                <td><span class="badge-cat cat-fint">Fallas Internas</span></td>
                <td style="font-weight: 600;">$18,000.00</td>
                <td style="font-weight: 600;">16.59%</td>
            </tr>
            <tr>
                <td><span class="badge-cat cat-fext">Fallas Externas</span></td>
                <td style="font-weight: 600;">$13,000.00</td>
                <td style="font-weight: 600;">11.98%</td>
            </tr>
            <tr style="background: #fef2f2; font-weight: 700; color: #991b1b; border-bottom: 2px solid #fca5a5;">
                <td colspan="2">SUBTOTAL NO CONFORMIDAD</td>
                <td>$31,000.00</td>
                <td>28.57%</td>
            </tr>

            <tr class="total-row">
                <td colspan="2">COSTO TOTAL DE LA CALIDAD (CoQ)</td>
                <td>$108,500.00 MXN</td>
                <td>100.00%</td>
            </tr>
        </tbody>
    </table>

    <h2 class="subsection-title">Visualización Gráfica de Distribución</h2>
    <div class="bar-container">
        <div class="bar-seg bar-prev" style="width: 42.86%;">Prevención: 42.9%</div>
        <div class="bar-seg bar-eval" style="width: 28.57%;">Evaluación: 28.6%</div>
        <div class="bar-seg bar-fint" style="width: 16.59%;">F. Internas: 16.6%</div>
        <div class="bar-seg bar-fext" style="width: 11.98%;">F. Externas: 12.0%</div>
    </div>

    <div class="legend-grid">
        <div class="legend-card" style="border-top: 3px solid #16a34a;">
            <span class="pct" style="color: #16a34a;">42.9%</span>
            <span class="lbl">Prevención ($46.5k)</span>
        </div>
        <div class="legend-card" style="border-top: 3px solid #0284c7;">
            <span class="pct" style="color: #0284c7;">28.6%</span>
            <span class="lbl">Evaluación ($31.0k)</span>
        </div>
        <div class="legend-card" style="border-top: 3px solid #d97706;">
            <span class="pct" style="color: #d97706;">16.6%</span>
            <span class="lbl">F. Internas ($18.0k)</span>
        </div>
        <div class="legend-card" style="border-top: 3px solid #dc2626;">
            <span class="pct" style="color: #dc2626;">12.0%</span>
            <span class="lbl">F. Externas ($13.0k)</span>
        </div>
    </div>

    <h2 class="subsection-title">Interpretación Económica del Modelo en LocalMarket</h2>
    <p>
        El perfil obtenido sitúa a LocalMarket en un <strong>estado de madurez preventiva</strong> según los parámetros de la ASQC:
    </p>
    <ul style="margin-left: 20px; font-size: 8.5pt; color: #334155; line-height: 1.6;">
        <li><strong>Predominio de la Conformidad (71.4%):</strong> Más de dos tercios de los recursos se destinan a planificar la arquitectura de la base de datos (PostgreSQL), diseñar disparadores atómicos y automatizar pruebas. Esto previene que errores estructurales lleguen al cliente.</li>
        <li><strong>Fallas Externas Minimizadas (12.0%):</strong> Representa el porcentaje más bajo de la estructura de costos. Esto significa que la tasa de quejas en producción y devoluciones por sobreventa es sumamente reducida gracias a los triggers de validación en tiempo real.</li>
        <li><strong>Ratio de Efectividad de Prevención:</strong> Por cada $1.00 peso invertido en prevención, la plataforma ahorra un estimado de <strong>$4.20 pesos</strong> en costos potenciales de fallas externas (soporte, cancelaciones masivas, daño de marca).</li>
    </ul>

    <!-- ============================================================ -->
    <!-- SECCIÓN 5: CONCLUSIONES Y RECOMENDACIONES DE MEJORA         -->
    <!-- ============================================================ -->
    <div class="avoid-break" style="margin-top: 15px;">
        <h1 class="section-title"><span class="number">5</span> Conclusiones y Plan de Mejoramiento Continuo</h1>
        <p>
            En consonancia con la premisa de Marcelo Pulgar Espejo de que <em>"los costos de calidad son una herramienta de gestión para incrementar utilidades"</em>, 
            se formulan las siguientes decisiones estratégicas para el proyecto:
        </p>
        <ul style="margin-left: 20px; font-size: 8.5pt; color: #334155; line-height: 1.6;">
            <li><strong>Mantener el blindaje en la Base de Datos:</strong> Los disparadores automáticos (<code class="code-inline">trg_evitar_stock_negativo</code> y <code class="code-inline">trg_actualizar_total_pedido</code>) constituyen la principal barrera preventiva contra fallas externas en el checkout.</li>
            <li><strong>Monitoreo de Métricas en Producción:</strong> Medir periódicamente el indicador <code class="code-inline">CoQ / Ventas Brutas</code> para asegurar que el costo total de calidad se mantenga por debajo del 8% de la facturación global de la plataforma.</li>
            <li><strong>Evolución hacia la Prevención Proactiva:</strong> Fortalecer el testing de carga automatizado antes de campañas promocionales para mitigar el riesgo de indisponibilidad en el servidor web Node.js.</li>
        </ul>
    </div>

</body>
</html>
`;

// Guardar documento HTML fuente
const htmlFilePath = path.join(__dirname, '..', 'Resumen_Costos_de_Calidad_LocalMarket.html');
fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log('HTML generado exitosamente en:', htmlFilePath);

// Convertir a PDF utilizando Microsoft Edge Headless
const edgePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];
const selectedEdge = edgePaths.find(p => fs.existsSync(p));

if (!selectedEdge) {
    console.error('❌ Microsoft Edge no fue encontrado para generar el PDF.');
    process.exit(1);
}

// Rutas de destino del PDF
const downloadsDir = path.join(process.env.USERPROFILE || 'C:\\Users\\ximel', 'Downloads');
const pdfDownloadsPath = path.join(downloadsDir, 'Resumen_Costos_de_Calidad_LocalMarket.pdf');
const pdfLocalPath = path.join(__dirname, '..', 'Resumen_Costos_de_Calidad_LocalMarket.pdf');

try {
    const cmd = `"${selectedEdge}" --headless --disable-gpu --print-to-pdf="${pdfLocalPath}" --no-pdf-header-footer "${htmlFilePath}"`;
    console.log('Compilando PDF profesional de Costos de Calidad...');
    execSync(cmd);

    // Copiar a Downloads
    fs.copyFileSync(pdfLocalPath, pdfDownloadsPath);

    const stats = fs.statSync(pdfDownloadsPath);
    console.log(`\n======================================================`);
    console.log(`✅ PDF GENERADO Y GUARDADO EXITOSAMENTE`);
    console.log(`======================================================`);
    console.log(`📁 En Descargas: ${pdfDownloadsPath} (${(stats.size / 1024).toFixed(2)} KB)`);
    console.log(`📁 En Proyecto:  ${pdfLocalPath}`);
} catch (err) {
    console.error('❌ Error al compilar PDF:', err.message);
    process.exit(1);
}
