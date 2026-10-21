-- =======================================================================
-- SCRIPT COMPLETO DE OBJETOS AVANZADOS DE BASE DE DATOS: PostgreSQL 18
-- Base de datos: proyecto7 (LocalMarket)
-- Componentes: 5 Vistas, 5 Procedimientos, 5 Triggers y 5 Funciones
-- =======================================================================

-- -----------------------------------------------------------------------
-- SECCIÓN 1: VISTAS (VIEWS) - 5 VISTAS
-- -----------------------------------------------------------------------

-- 1. Vista de Catálogo Comercial Detallado con Margen de Ganancia
CREATE OR REPLACE VIEW vw_catalogo_productos_detallado AS
SELECT 
    p.id_producto,
    p.titulo,
    p.descripcion,
    p.precio,
    p.costo_unitario,
    ROUND(((p.precio - p.costo_unitario) / NULLIF(p.precio, 0)) * 100, 2) AS margen_porcentaje,
    p.stock,
    CASE 
        WHEN p.stock = 0 THEN 'Agotado'
        WHEN p.stock <= 5 THEN 'Stock Crítico'
        ELSE 'Disponible'
    END AS estado_stock,
    COALESCE(c.nombre, 'Sin categoría') AS categoria_nombre,
    COALESCE(u.nombre, 'Vendedor Principal') AS vendedor_nombre
FROM productos p
LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
LEFT JOIN usuarios u ON p.id_vendedor = u.id_usuario;

-- 2. Vista de Resumen de Pedidos y Ventas Consolidadas
CREATE OR REPLACE VIEW vw_resumen_pedidos_ventas AS
SELECT 
    pv.id_pedido,
    pv.fecha_pedido,
    pv.total,
    pv.estado,
    COALESCE(u.nombre, 'Cliente Mostrador') AS comprador_nombre,
    COALESCE(u.correo, 'N/D') AS comprador_correo,
    COUNT(dv.id_detalle) AS total_articulos,
    COALESCE(SUM(dv.cantidad), 0) AS unidades_totales
FROM pedidos_ventas pv
LEFT JOIN usuarios u ON pv.id_comprador = u.id_usuario
LEFT JOIN detalle_venta dv ON pv.id_pedido = dv.id_pedido
GROUP BY pv.id_pedido, pv.fecha_pedido, pv.total, pv.estado, u.nombre, u.correo;

-- 3. Vista de Alerta de Stock Crítico y Costo de Reorden
CREATE OR REPLACE VIEW vw_alerta_stock_critico AS
SELECT 
    p.id_producto,
    p.titulo,
    p.stock,
    p.costo_unitario,
    COALESCE(c.nombre, 'General') AS categoria_nombre,
    (20 - p.stock) AS unidades_sugeridas_reorden,
    ROUND(((20 - p.stock) * p.costo_unitario), 2) AS costo_estimado_resurtido
FROM productos p
LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
WHERE p.stock <= 5;

-- 4. Vista de Métricas de Rendimiento por Vendedor
CREATE OR REPLACE VIEW vw_metricas_vendedores AS
SELECT 
    u.id_usuario AS id_vendedor,
    u.nombre AS vendedor_nombre,
    u.correo AS vendedor_correo,
    COUNT(DISTINCT p.id_producto) AS total_productos_catalogo,
    COALESCE(SUM(p.stock), 0) AS stock_total_almacenado,
    COALESCE(SUM(dv.subtotal), 0) AS facturacion_bruta_total,
    COUNT(DISTINCT dv.id_pedido) AS pedidos_atendidos
FROM usuarios u
LEFT JOIN productos p ON u.id_usuario = p.id_vendedor
LEFT JOIN detalle_venta dv ON p.id_producto = dv.id_producto
WHERE u.id_rol = 2 OR u.id_rol = 1 -- Vendedor o Administrador
GROUP BY u.id_usuario, u.nombre, u.correo;

-- 5. Vista de Balance Financiero y Estimación de Utilidades
CREATE OR REPLACE VIEW vw_balance_financiero_tienda AS
SELECT 
    COALESCE(SUM(dv.subtotal), 0) AS ventas_totales_brutas,
    COALESCE(SUM(dv.cantidad * p.costo_unitario), 0) AS costo_mercancia_vendida,
    COALESCE(SUM(dv.subtotal), 0) - COALESCE(SUM(dv.cantidad * p.costo_unitario), 0) AS utilidad_bruta,
    (SELECT COALESCE(SUM(monto), 0) FROM costos_fijos) AS total_costos_fijos,
    (COALESCE(SUM(dv.subtotal), 0) - COALESCE(SUM(dv.cantidad * p.costo_unitario), 0)) - (SELECT COALESCE(SUM(monto), 0) FROM costos_fijos) AS utilidad_neta_estimada
FROM detalle_venta dv
JOIN productos p ON dv.id_producto = p.id_producto;


-- -----------------------------------------------------------------------
-- SECCIÓN 2: FUNCIONES (FUNCTIONS) - 5 FUNCIONES
-- -----------------------------------------------------------------------

-- 1. Función para validar disponibilidad de stock antes de una compra
CREATE OR REPLACE FUNCTION fn_validar_stock_disponible(p_id_producto INT, p_cantidad INT)
RETURNS BOOLEAN AS $$
DECLARE
    v_stock INT;
BEGIN
    SELECT stock INTO v_stock FROM productos WHERE id_producto = p_id_producto;
    IF v_stock IS NULL THEN
        RETURN FALSE;
    END IF;
    RETURN v_stock >= p_cantidad;
END;
$$ LANGUAGE plpgsql;

-- 2. Función escalar para calcular el subtotal monetario de un producto
CREATE OR REPLACE FUNCTION fn_calcular_subtotal_producto(p_id_producto INT, p_cantidad INT)
RETURNS NUMERIC AS $$
DECLARE
    v_precio NUMERIC;
BEGIN
    SELECT precio INTO v_precio FROM productos WHERE id_producto = p_id_producto;
    IF v_precio IS NULL THEN
        RETURN 0.00;
    END IF;
    RETURN ROUND(v_precio * p_cantidad, 2);
END;
$$ LANGUAGE plpgsql;

-- 3. Función de cálculo de margen de ganancia porcentual
CREATE OR REPLACE FUNCTION fn_calcular_margen_ganancia(p_precio NUMERIC, p_costo NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
    IF p_precio IS NULL OR p_precio <= 0 THEN
        RETURN 0.00;
    END IF;
    RETURN ROUND(((p_precio - COALESCE(p_costo, 0)) / p_precio) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- 4. Función para obtener total de ventas acumuladas por vendedor
CREATE OR REPLACE FUNCTION fn_total_ventas_vendedor(p_id_vendedor INT)
RETURNS NUMERIC AS $$
DECLARE
    v_total NUMERIC;
BEGIN
    SELECT COALESCE(SUM(dv.subtotal), 0) INTO v_total
    FROM detalle_venta dv
    JOIN productos p ON dv.id_producto = p.id_producto
    WHERE p.id_vendedor = p_id_vendedor;
    
    RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- 5. Función de tabla para consultar el historial de pedidos de un cliente
CREATE OR REPLACE FUNCTION fn_consultar_pedidos_cliente(p_id_comprador INT)
RETURNS TABLE (
    id_pedido INT,
    fecha_pedido DATE,
    total NUMERIC,
    estado VARCHAR,
    articulos_distintos BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pv.id_pedido,
        pv.fecha_pedido,
        pv.total,
        pv.estado,
        COUNT(dv.id_detalle) AS articulos_distintos
    FROM pedidos_ventas pv
    LEFT JOIN detalle_venta dv ON pv.id_pedido = dv.id_pedido
    WHERE pv.id_comprador = p_id_comprador
    GROUP BY pv.id_pedido, pv.fecha_pedido, pv.total, pv.estado
    ORDER BY pv.fecha_pedido DESC;
END;
$$ LANGUAGE plpgsql;


-- -----------------------------------------------------------------------
-- SECCIÓN 3: PROCEDIMIENTOS ALMACENADOS (STORED PROCEDURES) - 5 PROCEDIMIENTOS
-- -----------------------------------------------------------------------

-- 1. Procedimiento para procesar venta de forma atómica
CREATE OR REPLACE PROCEDURE sp_procesar_venta(
    p_id_pedido INT,
    p_id_producto INT,
    p_cantidad INT,
    p_precio_unitario NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_subtotal NUMERIC;
    v_stock_actual INT;
BEGIN
    -- Validar existencias
    SELECT stock INTO v_stock_actual FROM productos WHERE id_producto = p_id_producto;
    IF v_stock_actual IS NULL OR v_stock_actual < p_cantidad THEN
        RAISE EXCEPTION 'Stock insuficiente para el producto ID % (Disponible: %, Solicitado: %)', 
            p_id_producto, COALESCE(v_stock_actual, 0), p_cantidad;
    END IF;

    v_subtotal := ROUND(p_cantidad * p_precio_unitario, 2);
    
    -- Insertar renglón de detalle
    INSERT INTO detalle_venta (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
    VALUES (p_id_pedido, p_id_producto, p_cantidad, p_precio_unitario, v_subtotal);
    
    -- Descontar existencias del inventario
    UPDATE productos
    SET stock = stock - p_cantidad
    WHERE id_producto = p_id_producto;

    -- Actualizar cabecera de pedido
    UPDATE pedidos_ventas
    SET total = (SELECT COALESCE(SUM(subtotal), 0) FROM detalle_venta WHERE id_pedido = p_id_pedido)
    WHERE id_pedido = p_id_pedido;
END;
$$;

-- 2. Procedimiento para aperturar una orden de pedido
CREATE OR REPLACE PROCEDURE sp_crear_pedido(
    p_id_comprador INT,
    INOUT p_nuevo_pedido_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO pedidos_ventas (id_comprador, fecha_pedido, total, estado)
    VALUES (p_id_comprador, CURRENT_DATE, 0.00, 'pendiente')
    RETURNING id_pedido INTO p_nuevo_pedido_id;
END;
$$;

-- 3. Procedimiento para actualizar el estado del pedido con reposición de inventario en cancelación
CREATE OR REPLACE PROCEDURE sp_actualizar_estado_pedido(
    p_id_pedido INT,
    p_nuevo_estado VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    r_item RECORD;
BEGIN
    -- Si el estado se cambia a cancelado, devolver existencias al catálogo
    IF LOWER(p_nuevo_estado) = 'cancelado' THEN
        FOR r_item IN SELECT id_producto, cantidad FROM detalle_venta WHERE id_pedido = p_id_pedido LOOP
            UPDATE productos
            SET stock = stock + r_item.cantidad
            WHERE id_producto = r_item.id_producto;
        END LOOP;
    END IF;

    -- Actualizar el estado
    UPDATE pedidos_ventas
    SET estado = p_nuevo_estado
    WHERE id_pedido = p_id_pedido;
END;
$$;

-- 4. Procedimiento para reabastecer stock y opcionalmente actualizar costo unitario
CREATE OR REPLACE PROCEDURE sp_reabastecer_stock(
    p_id_producto INT,
    p_cantidad_ingreso INT,
    p_nuevo_costo NUMERIC DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_cantidad_ingreso <= 0 THEN
        RAISE EXCEPTION 'La cantidad de reabastecimiento debe ser mayor a 0';
    END IF;

    UPDATE productos
    SET stock = stock + p_cantidad_ingreso,
        costo_unitario = CASE 
            WHEN p_nuevo_costo IS NOT NULL AND p_nuevo_costo > 0 THEN p_nuevo_costo 
            ELSE costo_unitario 
        END
    WHERE id_producto = p_id_producto;
END;
$$;

-- 5. Procedimiento para depurar intentos de OTP de seguridad
CREATE OR REPLACE PROCEDURE sp_depurar_intentos_otp(
    p_id_usuario INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_id_usuario IS NOT NULL THEN
        UPDATE verificaciones_otp
        SET intentos_fallidos = 0
        WHERE id_usuario = p_id_usuario;
    ELSE
        UPDATE verificaciones_otp
        SET intentos_fallidos = 0;
    END IF;
END;
$$;


-- -----------------------------------------------------------------------
-- SECCIÓN 4: TRIGGERS (DISPARADORES) - 5 TRIGGERS Y FUNCIONES DESENCADENADORAS
-- -----------------------------------------------------------------------

-- Trigger 1: Evitar stock negativo en productos
CREATE OR REPLACE FUNCTION fn_trg_evitar_stock_negativo()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock < 0 THEN
        RAISE EXCEPTION 'Restricción de inventario violada: El stock del producto % no puede ser negativo (valor ingresado: %)', NEW.titulo, NEW.stock;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_evitar_stock_negativo ON productos;
CREATE TRIGGER trg_evitar_stock_negativo
BEFORE INSERT OR UPDATE OF stock ON productos
FOR EACH ROW
EXECUTE FUNCTION fn_trg_evitar_stock_negativo();


-- Trigger 2: Recalcular total del pedido al alterar detalle_venta
CREATE OR REPLACE FUNCTION fn_trg_actualizar_total_pedido()
RETURNS TRIGGER AS $$
DECLARE
    v_pedido_id INT;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_pedido_id := OLD.id_pedido;
    ELSE
        v_pedido_id := NEW.id_pedido;
    END IF;

    UPDATE pedidos_ventas
    SET total = (SELECT COALESCE(SUM(subtotal), 0) FROM detalle_venta WHERE id_pedido = v_pedido_id)
    WHERE id_pedido = v_pedido_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_actualizar_total_pedido ON detalle_venta;
CREATE TRIGGER trg_actualizar_total_pedido
AFTER INSERT OR UPDATE OR DELETE ON detalle_venta
FOR EACH ROW
EXECUTE FUNCTION fn_trg_actualizar_total_pedido();


-- Trigger 3: Normalizar y limpiar correo electrónico de usuarios
CREATE OR REPLACE FUNCTION fn_trg_normalizar_correo_usuario()
RETURNS TRIGGER AS $$
BEGIN
    NEW.correo := LOWER(TRIM(NEW.correo));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_normalizar_correo_usuario ON usuarios;
CREATE TRIGGER trg_normalizar_correo_usuario
BEFORE INSERT OR UPDATE OF correo ON usuarios
FOR EACH ROW
EXECUTE FUNCTION fn_trg_normalizar_correo_usuario();


-- Trigger 4: Validar coherencia comercial de precios (precio >= costo_unitario)
CREATE OR REPLACE FUNCTION fn_trg_validar_precios_coherentes()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.precio < 0 THEN
        RAISE EXCEPTION 'El precio de venta no puede ser negativo: %', NEW.precio;
    END IF;
    
    IF NEW.costo_unitario IS NOT NULL AND NEW.precio < NEW.costo_unitario THEN
        RAISE EXCEPTION 'Alerta comercial: El precio ($%) no puede ser inferior al costo unitario ($%) en el producto %', 
            NEW.precio, NEW.costo_unitario, NEW.titulo;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validar_precios_coherentes ON productos;
CREATE TRIGGER trg_validar_precios_coherentes
BEFORE INSERT OR UPDATE OF precio, costo_unitario ON productos
FOR EACH ROW
EXECUTE FUNCTION fn_trg_validar_precios_coherentes();


-- Trigger 5: Auditoría y alerta de agotamiento de stock
CREATE OR REPLACE FUNCTION fn_trg_auditar_agotamiento_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.stock > 0 AND NEW.stock = 0 THEN
        RAISE NOTICE 'ALERTA DE AGOTAMIENTO: El producto ID % (%) ha llegado a existencia cero.', 
            NEW.id_producto, NEW.titulo;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auditar_agotamiento_stock ON productos;
CREATE TRIGGER trg_auditar_agotamiento_stock
AFTER UPDATE OF stock ON productos
FOR EACH ROW
EXECUTE FUNCTION fn_trg_auditar_agotamiento_stock();
