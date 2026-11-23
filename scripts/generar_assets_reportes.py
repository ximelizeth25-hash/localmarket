#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador de Recursos Visuales y Capturas de Implementación
para la Documentación del Módulo de Reportes de LocalMarket.
"""

import os
import sys
import subprocess
from pathlib import Path
from PIL import Image

WORKSPACE_DIR = Path(__file__).resolve().parent.parent
ASSETS_DIR = WORKSPACE_DIR / "scripts" / "assets_reportes"
EDGE_EXE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

ASSETS_DIR.mkdir(parents=True, exist_ok=True)

def run_edge_screenshot(url_or_path, output_png, width=1400, height=2100, wait_ms=4500):
    cmd = [
        EDGE_EXE,
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        f"--window-size={width},{height}",
        f"--virtual-time-budget={wait_ms}",
        f"--screenshot={str(output_png)}",
        str(url_or_path)
    ]
    print(f"📸 Capturando [{width}x{height}]: {output_png.name}...")
    subprocess.run(cmd, check=True)
    if output_png.exists():
        print(f"   ✅ Guardado ({output_png.stat().st_size:,} bytes)")
    else:
        print(f"   ❌ Error: No se creó {output_png.name}")

def capture_live_dashboard():
    dashboard_full = ASSETS_DIR / "dashboard_live_full.png"
    run_edge_screenshot(
        "http://localhost:3000/dashboard.html?tab=mod_admin",
        dashboard_full,
        width=1400,
        height=2100,
        wait_ms=5000
    )

    if not dashboard_full.exists():
        print("❌ No se pudo capturar el dashboard en vivo.")
        return

    full_img = Image.open(dashboard_full)
    w, h = full_img.size
    print(f"🖼️ Imagen base completa: {w}x{h}")

    # 1. FIG 1: Header + Sidebar + Título + 4 KPIs + Barra de herramientas
    fig1 = full_img.crop((0, 0, 1400, 390))
    fig1_path = ASSETS_DIR / "fig1_ui_dashboard_header_kpis.png"
    fig1.save(fig1_path)
    print(f"   ✅ Fig 1 generada: {fig1_path.name} {fig1.size}")

    # 2. FIG 2: Detalle de las 4 Tarjetas KPI
    fig2 = full_img.crop((260, 60, 1370, 210))
    fig2_path = ASSETS_DIR / "fig2_ui_kpis_cards.png"
    fig2.save(fig2_path)
    print(f"   ✅ Fig 2 generada: {fig2_path.name} {fig2.size}")

    # 3. FIG 3: Reporte 1 (Ventas Semanales) y Reporte 2 (Ingresos por Categoría)
    fig3 = full_img.crop((260, 270, 1370, 920))
    fig3_path = ASSETS_DIR / "fig3_ui_graficas_semanal_categoria.png"
    fig3.save(fig3_path)
    print(f"   ✅ Fig 3 generada: {fig3_path.name} {fig3.size}")

    # 4. FIG 4: Reporte 3 (Rendimiento por Socio) y Reporte 4 (Estado de Pedidos e Inventario Crítico)
    fig4 = full_img.crop((260, 930, 1370, 1580))
    fig4_path = ASSETS_DIR / "fig4_ui_graficas_socios_inventario.png"
    fig4.save(fig4_path)
    print(f"   ✅ Fig 4 generada: {fig4_path.name} {fig4.size}")

def generate_architecture_card():
    html_file = ASSETS_DIR / "arch_card.html"
    png_file = ASSETS_DIR / "fig5_arquitectura_cadena_sql.png"

    html_content = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #0F172A;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    padding: 24px;
    color: #F8FAFC;
    width: 1200px;
    height: 600px;
  }
  .window {
    background: #1E293B;
    border-radius: 14px;
    border: 1px solid #334155;
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .titlebar {
    background: #0F172A;
    padding: 12px 18px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #334155;
  }
  .dots { display: flex; gap: 8px; margin-right: 16px; }
  .dot { width: 12px; height: 12px; border-radius: 50%; }
  .dot-red { background: #EF4444; }
  .dot-yellow { background: #F59E0B; }
  .dot-green { background: #10B981; }
  .window-title {
    font-size: 13px;
    font-weight: 600;
    color: #94A3B8;
    letter-spacing: 0.5px;
  }
  .content {
    padding: 24px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .header-desc {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }
  .header-desc h2 {
    font-size: 17px;
    color: #38BDF8;
    font-weight: 700;
  }
  .badge {
    background: #1B4332;
    color: #52B788;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    border: 1px solid #2D6A4F;
  }
  .tiers-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 18px;
  }
  .tier-card {
    background: #0F172A;
    border-radius: 10px;
    border: 1px solid #334155;
    padding: 16px;
    position: relative;
  }
  .tier-card.admin { border-top: 4px solid #10B981; }
  .tier-card.socio { border-top: 4px solid #38BDF8; }
  .tier-card.cliente { border-top: 4px solid #F59E0B; }
  .tier-title {
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
  }
  .tier-card.admin .tier-title { color: #10B981; }
  .tier-card.socio .tier-title { color: #38BDF8; }
  .tier-card.cliente .tier-title { color: #F59E0B; }
  .tier-role { font-size: 11px; color: #94A3B8; margin-bottom: 8px; }
  .tier-metric {
    background: rgba(255,255,255,0.04);
    border-radius: 6px;
    padding: 8px;
    font-size: 11.5px;
    line-height: 1.4;
    color: #CBD5E1;
    margin-bottom: 8px;
  }
  .tier-metric strong { color: #FFFFFF; }
  .tier-sql {
    font-family: "Courier New", monospace;
    font-size: 10px;
    color: #A5B4FC;
    background: #020617;
    padding: 6px 8px;
    border-radius: 4px;
    border: 1px solid #1E293B;
  }
  .flow-banner {
    background: linear-gradient(90deg, rgba(16,185,129,0.15) 0%, rgba(56,189,248,0.15) 50%, rgba(245,158,11,0.15) 100%);
    border: 1px dashed #475569;
    border-radius: 8px;
    padding: 12px 18px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 11.5px;
    color: #E2E8F0;
  }
  .flow-step { display: flex; align-items: center; gap: 8px; font-weight: 600; }
  .flow-arrow { color: #94A3B8; font-size: 16px; font-weight: bold; }
  .db-badge {
    background: #334155;
    padding: 3px 8px;
    border-radius: 4px;
    color: #38BDF8;
    font-family: monospace;
    font-size: 10.5px;
  }
</style>
</head>
<body>
<div class="window">
  <div class="titlebar">
    <div class="dots">
      <div class="dot dot-red"></div>
      <div class="dot dot-yellow"></div>
      <div class="dot dot-green"></div>
    </div>
    <div class="window-title">Arquitectura de Cadena de Suministro y Aislamiento en PostgreSQL — LocalMarket PWA</div>
  </div>
  <div class="content">
    <div class="header-desc">
      <h2>Flujo Relacional y Segmentación de Datos por Nivel Operativo</h2>
      <span class="badge">PostgreSQL 15+ &bull; RBAC Estricto</span>
    </div>
    <div class="tiers-grid">
      <div class="tier-card admin">
        <div class="tier-title"><span>Nivel 1: Administrador</span> <span>id_rol = 1</span></div>
        <div class="tier-role">Central de Abasto &bull; Surtidor Mayorista</div>
        <div class="tier-metric">
          &bull; <strong>Ingresos:</strong> $1,000.00 MXN (Ventas a Socios)<br/>
          &bull; <strong>Pedidos:</strong> 1 orden de surtido (#8 Gisela)<br/>
          &bull; <strong>Menú Compra:</strong> Oculto (Solo suministra)
        </div>
        <div class="tier-sql">WHERE pv.estado != 'Cancelado'<br/>&nbsp;&nbsp;AND u.id_rol = 2</div>
      </div>
      <div class="tier-card socio">
        <div class="tier-title"><span>Nivel 2: Socios</span> <span>id_rol = 2</span></div>
        <div class="tier-role">Distribuidor Retailer &bull; Venta Minorista</div>
        <div class="tier-metric">
          &bull; <strong>Gisela (#1):</strong> $150.00 MXN a Diana Laura<br/>
          &bull; <strong>Ximena (#2):</strong> $0.00 MXN (En registro)<br/>
          &bull; <strong>Compras propias:</strong> Surtido al Admin (#8)
        </div>
        <div class="tier-sql">WHERE pv.numero_socio_atencion = $1<br/>&nbsp;&nbsp;AND u.id_rol = 3</div>
      </div>
      <div class="tier-card cliente">
        <div class="tier-title"><span>Nivel 3: Clientes</span> <span>id_rol = 3</span></div>
        <div class="tier-role">Consumidor Final &bull; Comprador Directo</div>
        <div class="tier-metric">
          &bull; <strong>Diana Laura (#9):</strong> Pedido #10 ($150.00)<br/>
          &bull; <strong>Reportes:</strong> Sin acceso (Bloqueo 403)<br/>
          &bull; <strong>Historial:</strong> Solo compras propias
        </div>
        <div class="tier-sql">WHERE pv.id_comprador = $1<br/>&nbsp;&nbsp;AND u.id_rol = 3</div>
      </div>
    </div>
    <div class="flow-banner">
      <div class="flow-step"><span class="db-badge">POSTGRESQL</span> PEDIDOS_VENTAS + USUARIOS</div>
      <div class="flow-arrow">&rarr;</div>
      <div class="flow-step"><span class="db-badge">EXPRESS API</span> /api/reportes?rol=&usuario_id=</div>
      <div class="flow-arrow">&rarr;</div>
      <div class="flow-step"><span class="db-badge">CHART.JS</span> 4 Gráficas + 4 Tarjetas KPI</div>
      <div class="flow-arrow">&rarr;</div>
      <div class="flow-step"><span class="db-badge">SERVICE WORKER</span> localmarket-v30</div>
    </div>
  </div>
</div>
</body>
</html>"""

    html_file.write_text(html_content, encoding="utf-8")
    run_edge_screenshot(f"file:///{html_file.resolve().as_posix()}", png_file, width=1200, height=600, wait_ms=1000)

def generate_backend_controller_card():
    html_file = ASSETS_DIR / "code_backend.html"
    png_file = ASSETS_DIR / "fig6_backend_controller_code.png"

    html_content = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #020617;
    font-family: "Cascadia Code", "Fira Code", Consolas, "Courier New", monospace;
    padding: 20px;
    color: #E2E8F0;
    width: 1200px;
    height: 600px;
  }
  .window {
    background: #0B1120;
    border-radius: 12px;
    border: 1px solid #1E293B;
    box-shadow: 0 15px 35px rgba(0,0,0,0.6);
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .titlebar {
    background: #020617;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #1E293B;
  }
  .dots { display: flex; gap: 8px; margin-right: 14px; }
  .dot { width: 11px; height: 11px; border-radius: 50%; }
  .dot-red { background: #EF4444; }
  .dot-yellow { background: #F59E0B; }
  .dot-green { background: #10B981; }
  .window-title {
    font-size: 12px;
    color: #94A3B8;
    font-family: sans-serif;
  }
  .code-area {
    padding: 16px 20px;
    flex: 1;
    overflow: hidden;
    font-size: 12.5px;
    line-height: 1.45;
  }
  .keyword { color: #C084FC; font-weight: bold; }
  .func { color: #60A5FA; }
  .variable { color: #F1F5F9; }
  .string { color: #34D399; }
  .comment { color: #64748B; font-style: italic; }
  .sql-kw { color: #F472B6; font-weight: bold; }
  .num { color: #F59E0B; }
  .line-num { color: #475569; display: inline-block; width: 32px; user-select: none; }
</style>
</head>
<body>
<div class="window">
  <div class="titlebar">
    <div class="dots">
      <div class="dot dot-red"></div>
      <div class="dot dot-yellow"></div>
      <div class="dot dot-green"></div>
    </div>
    <div class="window-title">controllers/admin.controller.js — getMetricas(req, res, next) &bull; PostgreSQL Data Provider</div>
  </div>
  <div class="code-area">
<div><span class="line-num"> 9</span><span class="keyword">async function</span> <span class="func">getMetricas</span>(req, res, next) {</div>
<div><span class="line-num">10</span>  <span class="keyword">try</span> {</div>
<div><span class="line-num">11</span>    <span class="keyword">const</span> rolParam = (req.query.rol || req.headers[<span class="string">'x-user-role'</span>] || <span class="string">''</span>).toLowerCase();</div>
<div><span class="line-num">12</span>    <span class="keyword">const</span> userId = parseInt(req.query.usuario_id || req.headers[<span class="string">'x-user-id'</span>]);</div>
<div><span class="line-num">13</span>    <span class="keyword">const</span> isAdmin = rolParam.includes(<span class="string">'admin'</span>) || (!rolParam && !userId);</div>
<div><span class="line-num">14</span>    <span class="keyword">const</span> isSocio = !isAdmin && (rolParam.includes(<span class="string">'socio'</span>) || rolParam === <span class="string">'2'</span>);</div>
<div><span class="line-num">15</span></div>
<div><span class="line-num">16</span>    <span class="comment">// 🔒 SEGMENTACIÓN ESTRICTA: SI ES SOCIO, COMPUTA ÚNICAMENTE SUS CLIENTES Y VENTAS PROPIAS</span></div>
<div><span class="line-num">17</span>    <span class="keyword">if</span> (isSocio) {</div>
<div><span class="line-num">18</span>      <span class="keyword">const</span> pedRes = <span class="keyword">await</span> db.query(`</div>
<div><span class="line-num">19</span>        <span class="sql-kw">SELECT</span> <span class="func">COUNT</span>(*) <span class="sql-kw">as</span> count, <span class="func">COALESCE</span>(<span class="func">SUM</span>(pv.total), <span class="num">0</span>) <span class="sql-kw">as</span> total_sum</div>
<div><span class="line-num">20</span>        <span class="sql-kw">FROM</span> PEDIDOS_VENTAS pv <span class="sql-kw">JOIN</span> USUARIOS u <span class="sql-kw">ON</span> pv.id_comprador = u.id_usuario</div>
<div><span class="line-num">21</span>        <span class="sql-kw">WHERE</span> pv.estado != <span class="string">'Cancelado'</span> <span class="sql-kw">AND</span> pv.numero_socio_atencion = $1 <span class="sql-kw">AND</span> u.id_rol = <span class="num">3</span>`, [numSocio]);</div>
<div><span class="line-num">22</span>      totalPedidos = <span class="func">parseInt</span>(pedRes.rows[<span class="num">0</span>].count) || <span class="num">0</span>;</div>
<div><span class="line-num">23</span>      ingresosTotales = <span class="func">parseFloat</span>(pedRes.rows[<span class="num">0</span>].total_sum) || <span class="num">0</span>;</div>
<div><span class="line-num">24</span>    } <span class="keyword">else</span> {</div>
<div><span class="line-num">25</span>      <span class="comment">// 👑 MODO ADMINISTRADOR: CALCULA VENTAS MAYORISTAS DE SURTIDO A SOCIOS (u.id_rol = 2)</span></div>
<div><span class="line-num">26</span>      <span class="keyword">const</span> pedAdminRes = <span class="keyword">await</span> db.query(`</div>
<div><span class="line-num">27</span>        <span class="sql-kw">SELECT</span> <span class="func">COUNT</span>(*) <span class="sql-kw">as</span> count, <span class="func">COALESCE</span>(<span class="func">SUM</span>(pv.total), <span class="num">0</span>) <span class="sql-kw">as</span> total_sum</div>
<div><span class="line-num">28</span>        <span class="sql-kw">FROM</span> PEDIDOS_VENTAS pv <span class="sql-kw">JOIN</span> USUARIOS u <span class="sql-kw">ON</span> pv.id_comprador = u.id_usuario</div>
<div><span class="line-num">29</span>        <span class="sql-kw">WHERE</span> pv.estado != <span class="string">'Cancelado'</span> <span class="sql-kw">AND</span> u.id_rol = <span class="num">2</span>`);</div>
<div><span class="line-num">30</span>      totalPedidos = <span class="func">parseInt</span>(pedAdminRes.rows[<span class="num">0</span>].count) || <span class="num">0</span>;</div>
<div><span class="line-num">31</span>      ingresosTotales = <span class="func">parseFloat</span>(pedAdminRes.rows[<span class="num">0</span>].total_sum) || <span class="num">0</span>;</div>
<div><span class="line-num">32</span>    }</div>
  </div>
</div>
</body>
</html>"""

    html_file.write_text(html_content, encoding="utf-8")
    run_edge_screenshot(f"file:///{html_file.resolve().as_posix()}", png_file, width=1200, height=600, wait_ms=1000)

def generate_frontend_dashboard_card():
    html_file = ASSETS_DIR / "code_frontend.html"
    png_file = ASSETS_DIR / "fig7_frontend_dashboard_code.png"

    html_content = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #020617;
    font-family: "Cascadia Code", "Fira Code", Consolas, "Courier New", monospace;
    padding: 20px;
    color: #E2E8F0;
    width: 1200px;
    height: 600px;
  }
  .window {
    background: #0B1120;
    border-radius: 12px;
    border: 1px solid #1E293B;
    box-shadow: 0 15px 35px rgba(0,0,0,0.6);
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .titlebar {
    background: #020617;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #1E293B;
  }
  .dots { display: flex; gap: 8px; margin-right: 14px; }
  .dot { width: 11px; height: 11px; border-radius: 50%; }
  .dot-red { background: #EF4444; }
  .dot-yellow { background: #F59E0B; }
  .dot-green { background: #10B981; }
  .window-title {
    font-size: 12px;
    color: #94A3B8;
    font-family: sans-serif;
  }
  .code-area {
    padding: 16px 20px;
    flex: 1;
    overflow: hidden;
    font-size: 12.5px;
    line-height: 1.45;
  }
  .keyword { color: #C084FC; font-weight: bold; }
  .func { color: #60A5FA; }
  .variable { color: #F1F5F9; }
  .string { color: #34D399; }
  .comment { color: #64748B; font-style: italic; }
  .num { color: #F59E0B; }
  .line-num { color: #475569; display: inline-block; width: 32px; user-select: none; }
</style>
</head>
<body>
<div class="window">
  <div class="titlebar">
    <div class="dots">
      <div class="dot dot-red"></div>
      <div class="dot dot-yellow"></div>
      <div class="dot dot-green"></div>
    </div>
    <div class="window-title">public/js/dashboard.js — fetchAdminMetrics() &bull; Integración Reactiva Chart.js</div>
  </div>
  <div class="code-area">
<div><span class="line-num"> 1</span><span class="keyword">async function</span> <span class="func">fetchAdminMetrics</span>() {</div>
<div><span class="line-num"> 2</span>  <span class="keyword">try</span> {</div>
<div><span class="line-num"> 3</span>    <span class="comment">// 🚀 1. Parámetros de sesión del usuario logueado</span></div>
<div><span class="line-num"> 4</span>    <span class="keyword">const</span> rol = encodeURIComponent(currentUser.nombre_rol || currentUser.rol || <span class="string">'Administrador'</span>);</div>
<div><span class="line-num"> 5</span>    <span class="keyword">const</span> userId = currentUser.id_usuario || <span class="num">1</span>;</div>
<div><span class="line-num"> 6</span>    <span class="keyword">const</span> url = <span class="string">`/api/reportes?rol=${rol}&usuario_id=${userId}`</span>;</div>
<div><span class="line-num"> 7</span></div>
<div><span class="line-num"> 8</span>    <span class="keyword">const</span> res = <span class="keyword">await</span> <span class="func">fetch</span>(url, { headers: { <span class="string">'x-user-role'</span>: rol, <span class="string">'x-user-id'</span>: userId } });</div>
<div><span class="line-num"> 9</span>    <span class="keyword">const</span> json = <span class="keyword">await</span> res.<span class="func">json</span>();</div>
<div><span class="line-num">10</span>    <span class="keyword">const</span> data = json.data;</div>
<div><span class="line-num">11</span></div>
<div><span class="line-num">12</span>    <span class="comment">// 📊 2. Inyección de valores en Tarjetas KPI</span></div>
<div><span class="line-num">13</span>    document.<span class="func">getElementById</span>(<span class="string">'kpiUsuarios'</span>).textContent = data.totalUsuarios;</div>
<div><span class="line-num">14</span>    document.<span class="func">getElementById</span>(<span class="string">'kpiProductos'</span>).textContent = data.totalProductos;</div>
<div><span class="line-num">15</span>    document.<span class="func">getElementById</span>(<span class="string">'kpiPedidos'</span>).textContent = data.totalPedidos;</div>
<div><span class="line-num">16</span>    document.<span class="func">getElementById</span>(<span class="string">'kpiIngresos'</span>).textContent = <span class="string">`$${parseFloat(data.ingresosTotales).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`</span>;</div>
<div><span class="line-num">17</span></div>
<div><span class="line-num">18</span>    <span class="comment">// 📈 3. Destrucción de instancias previas e inicialización de 4 Gráficas Chart.js</span></div>
<div><span class="line-num">19</span>    <span class="func">destroyExecutiveCharts</span>();</div>
<div><span class="line-num">20</span>    <span class="func">initExecutiveCharts</span>(data);</div>
<div><span class="line-num">21</span>  } <span class="keyword">catch</span> (err) { console.error(<span class="string">'Error cargando métricas:'</span>, err); }</div>
<div><span class="line-num">22</span>}</div>
  </div>
</div>
</body>
</html>"""

    html_file.write_text(html_content, encoding="utf-8")
    run_edge_screenshot(f"file:///{html_file.resolve().as_posix()}", png_file, width=1200, height=600, wait_ms=1000)

if __name__ == '__main__':
    print("🚀 Iniciando generación de capturas e imágenes de implementación...")
    capture_live_dashboard()
    generate_architecture_card()
    generate_backend_controller_card()
    generate_frontend_dashboard_card()
    print("✨ Todos los recursos visuales han sido generados exitosamente.")
