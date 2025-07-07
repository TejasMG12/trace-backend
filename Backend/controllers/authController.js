const Officer = require('../models/Officer');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const officer = await Officer.findOne({ email });
    if (!officer) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await officer.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    officer.lastLogin = new Date();
    await officer.save();

    const token = jwt.sign({ id: officer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    logger.info(`Officer logged in: ${email}`);
    res.json({ token, officer: { id: officer._id, name: officer.name, role: officer.role, email: officer.email } });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, badgeId, role, email, password } = req.body;
    const existingOfficer = await Officer.findOne({ $or: [{ email }, { badgeId }] });
    if (existingOfficer) return res.status(400).json({ message: 'Email or badge ID already exists' });

    const officer = new Officer({ name, badgeId, role, email, passwordHash: password });
    await officer.save();

    const token = jwt.sign({ id: officer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    logger.info(`Officer registered: ${email} by ${req.officer.email}`);
    res.status(201).json({ token, officer: { id: officer._id, name, role, email } });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};