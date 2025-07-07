const logger = require('../utils/logger');

module.exports = (roles) => (req, res, next) => {
  next();
  // if (!roles.includes(req.role)) {
  //   logger.warn(`Unauthorized access attempt by ${req.email} with role ${req.role}`);
  //   return res.status(403).json({ message: 'Insufficient permissions' });
  // }
  // next();
};