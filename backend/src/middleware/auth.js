import jwt from 'jsonwebtoken';

const COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'lib_token';

export function auth(required = true) {
  return (req, res, next) => {
    const token = req.cookies?.[COOKIE_NAME] || null;

    if (!token) {
      if (required) return res.status(401).json({ message: 'Unauthorized' });
      req.user = null;
      return next();
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
      req.user = payload; // { id, role, name }
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}
