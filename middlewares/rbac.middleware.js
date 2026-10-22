/**
 * Middleware de Control de Acceso Basado en Roles (RBAC)
 */

function requireRole(allowedRoles = []) {
    return (req, res, next) => {
        // En entornos sin JWT, se valida el rol recibido en cabeceras o cuerpo
        const userRole = (req.headers['x-user-role'] || req.body.user_role || 'cliente').toLowerCase();
        
        const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());
        
        if (normalizedAllowed.includes('all') || normalizedAllowed.includes(userRole) || userRole === 'admin' || userRole === 'administrador') {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: `Acceso denegado: Se requiere rol [${allowedRoles.join(', ')}]. Tu rol actual es: ${userRole}`
        });
    };
}

module.exports = {
    requireRole
};
