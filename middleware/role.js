const logger = require('../utils/logger');

module.exports = (roles) => (req, res, next) => {
  if (!roles.includes(req.officer.role)) {
    logger.warn(`Unauthorized access attempt by ${req.officer.email} with role ${req.officer.role}`);
    return res.status(403).json({ message: 'Insufficient permissions' });
  }
  next();
};