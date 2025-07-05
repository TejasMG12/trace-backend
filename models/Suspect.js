const mongoose = require('mongoose');

const SuspectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  aliases: [String],
  username: { type: String, index: true },
  phone: { type: String, index: true },
  dob: Date,
  platforms: [String],
  groupMemberships: [String],
  locationHistory: [String],
  riskScore: { type: Number, default: 0, index: true },
  status: { type: String, enum: ['active', 'closed', 'underwatch'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Suspect', SuspectSchema);