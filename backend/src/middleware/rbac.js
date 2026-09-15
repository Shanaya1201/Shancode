/**
 * Role-Based Access Control (RBAC) Middleware
 * Enforces role hierarchies: admin > moderator > student
 */
export function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const userRole = req.user.role || 'student';
    if (userRole === 'admin') {
      return next(); // Admin has universal access
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: requires one of the following roles: [${allowedRoles.join(', ')}]`
      });
    }

    next();
  };
}

export const requireAdmin = requireRoles('admin');
export const requireModerator = requireRoles('admin', 'moderator');
