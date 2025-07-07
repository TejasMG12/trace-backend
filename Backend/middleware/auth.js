const jwt = require('jsonwebtoken');
const Officer = require('../models/Officer');
const logger = require('../utils/logger');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const officer = await Officer.findById(decoded.id);
    if (!officer) return res.status(401).json({ message: 'Invalid token' });

    req.officer = officer;
    next();
  } catch (error) {
    logger.error('Auth error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};