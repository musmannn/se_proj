import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'mtr_secret');
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, data: null, message: 'Invalid token' });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, data: null, message: 'Admin access required' });
  }
  return next();
}

export function requireCustomer(req, res, next) {
  if (!req.user || req.user.role !== 'customer') {
    return res.status(403).json({ success: false, data: null, message: 'Customer access required' });
  }
  return next();
}
