const mongoose = require('mongoose');

const OfficerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  badgeId: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'inspector', 'analyst'], default: 'inspector' },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  lastLogin: Date,
});

module.exports = mongoose.model('Officer', OfficerSchema);