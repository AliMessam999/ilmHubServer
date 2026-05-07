const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No authorization header' });
    
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedData?.id;
    req.userRole = decodedData?.role;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalid or expired. Please login again.', error: error.message });
  }
};

const adminOnly = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: `Access denied: Admin only. Your role is: '${req.userRole}'` });
  }
  next();
};

module.exports = { auth, adminOnly };
