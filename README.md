# 🛒 LocalMarket - Plataforma Web Progresiva (PWA) de Comercio Local

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

LocalMarket es una solución integral de comercio local diseñada bajo una arquitectura moderna de **Progressive Web App (PWA)**, backend modular en **Node.js/Express** y base de datos relacional robusta en **PostgreSQL**. Permite la interacción ágil y segura entre administradores, comerciantes locales y clientes.

---

## 🚀 Características Principales

### 📱 1. Arquitectura PWA (Progressive Web App)
- **Instalable:** Se instala como aplicación nativa en Windows, macOS, Android e iOS con soporte para icono adaptable (maskable) y pantalla de bienvenida.
- **Soporte Offline Completo:** Mediante el Service Worker (`public/sw.js`), precarga el *App Shell* y recursos críticos, permitiendo navegar por el catálogo y dashboard sin conexión a internet.
- **Página de Contingencia Offline (`public/offline.html`):** Interfaz amigable con reconexión automática y detección de estado de red en tiempo real.
- **Web App Manifest (`public/manifest.json`):** Configuración estándar de tema, orientación, accesos directos (*shortcuts*) y metadatos de aplicación.

### 🔐 2. Autenticación y Control de Acceso (RBAC)
- Inicio de sesión con validación criptográfica y soporte para múltiples roles: **Administrador**, **Vendedor** y **Cliente**.
- Módulo de verificación de dos factores mediante **Códigos OTP de 6 dígitos** con control de bloqueos por intentos fallidos.
- Panel de gestión de usuarios con acciones dinámicas: **Edición**, **Suspensión** y **Baja**.

### 📦 3. Catálogo, Inventario y Ventas
- Gestión de productos con categorías, precios y niveles de stock.
- Alerta visual dinámica de **Stock Bajo** en el encabezado principal con contador en tiempo real.
- Registro de compras y pedidos con persistencia transaccional.

### 🗄️ 4. Base de Datos Avanzada en PostgreSQL
- Esquema relacional optimizado (`BD.sql`).
- Implementación de al menos:
  - **5 Vistas** para reportes consolidados y métricas operativas.
  - **5 Procedimientos Almacenados** para transacciones seguras de ventas y stock.
  - **5 Triggers** para auditoría y validación de reglas de negocio.
  - **5 Funciones** para cálculos y formateo de datos.

---

## 📂 Estructura del Proyecto

```text
proyecto7/
├── public/                     # Frontend y recursos de la PWA
│   ├── icons/                  # Iconografía PWA (192x192, 512x512, maskable, SVG)
│   ├── dashboard.html          # Panel de administración interactivo
│   ├── dashboard.js            # Lógica cliente del dashboard y persistencia reactiva
│   ├── index.html              # Pantalla de inicio de sesión y acceso
│   ├── offline.html            # Pantalla de contingencia fuera de línea
│   ├── manifest.json           # Manifiesto oficial PWA
│   ├── pwa.js                  # Registro del Service Worker y capturador de instalación
│   ├── sw.js                   # Service Worker (Caché Stale-While-Revalidate y Network-First)
│   └── styles.css              # Estilos personalizados y animaciones
├── routes/                     # Rutas modulares del API REST
│   ├── admin.js
│   ├── categorias.js
│   ├── costos_fijos.js
│   ├── detalle_venta.js
│   ├── direcciones.js
│   ├── metodos_pago.js
│   ├── otp.js
│   ├── pedidos_ventas.js
│   ├── permisos.js
│   ├── preguntas_producto.js
│   ├── productos.js
│   ├── roles.js
│   ├── roles_permisos.js
│   └── usuarios.js
├── scripts/                    # Scripts auxiliares y herramientas de desarrollo
│   └── render_icons.ps1        # Generador de alta fidelidad para iconos PWA
├── BD.sql                      # Script SQL DDL/DML completo con objetos PostgreSQL
├── db.js                       # Conector y pool de conexiones PostgreSQL (pg)
├── server.js                   # Servidor central Express y cabeceras PWA
├── .env.example                # Plantilla de variables de entorno
├── .gitignore                  # Exclusión estricta de credenciales y dependencias
└── package.json                # Metadatos del proyecto y dependencias
```

---

## 🛠️ Instalación y Configuración

### 1. Prerrequisitos
- [Node.js](https://nodejs.org/) v18 o superior.
- [PostgreSQL](https://www.postgresql.org/) v14 o superior.

### 2. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd proyecto7
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto tomando como base `.env.example`:
```ini
PORT=3000
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
DB_NAME=proyecto7
```

### 5. Cargar la base de datos
Ejecuta el script SQL en PostgreSQL (vía psql o pgAdmin):
```bash
psql -U postgres -d proyecto7 -f BD.sql
```

### 6. Iniciar el servidor
```bash
npm start
# O directamente:
node server.js
```
El servidor estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 📲 Cómo Probar e Instalar la PWA

1. Abre el navegador Google Chrome o Microsoft Edge y visita:
   ```
   http://localhost:3000/dashboard.html
   ```
2. Observarás en la barra de direcciones o en el encabezado el botón **"Instalar App"** / icono de instalación.
3. Haz clic en **Instalar** para añadir LocalMarket como aplicación de escritorio o acceso directo móvil.
4. Para simular el modo fuera de línea:
   - Abre las Herramientas de Desarrollador (`F12`) > pestaña **Network** (Red) > selecciona **Offline**.
   - Recarga la página o interactúa con el dashboard para verificar la persistencia y la respuesta del Service Worker.

---

## 👥 Cuentas de Acceso de Prueba

| Usuario / Correo | Contraseña | Rol Asignado |
| :--- | :--- | :--- |
| `admin@localmarket.com` | `1234` o `123` | **Administrador** |
| `ar230111983@arandas.tecmm.edu.mx` (Gisela) | `4321` o `1234` | **Vendedor** |

---

## 📄 Licencia
Este proyecto fue desarrollado con fines académicos y profesionales. Todos los derechos reservados.
