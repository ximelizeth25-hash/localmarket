/**
 * Middleware Centralizado de Manejo de Errores
 * Estandariza respuestas HTTP (400, 401, 403, 404, 500)
 */

function errorHandler(err, req, res, next) {
    console.error('💥 [Server Error]:', err.stack || err.message || err);

    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
        path: req.originalUrl,
        timestamp: new Date().toISOString()
    });
}

function notFoundHandler(req, res, next) {
    res.status(404).json({
        success: false,
        status: 404,
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
}

module.exports = {
    errorHandler,
    notFoundHandler
};
