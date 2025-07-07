const mongoose = require('mongoose');

const SuspectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  aliases: [String],
  username: { type: String, index: true },
  phone: { type: String, index: true },
  dob: Date,
  platforms: [String],
  groupMemberships: { type: [String], default: [] },
  locationHistory: { type: [String], default: [] },
  riskScore: { type: Number, default: 0, index: true },
  status: { type: String, enum: ['active', 'closed', 'underwatch'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  proof: { type: [String], default: [] }, // Added for suspicious messages/media
  request_id: { type: String, index: true } // Added for request identifier
});

// Ensure groupMemberships and proof arrays do not contain duplicates
SuspectSchema.pre('save', function (next) {
  this.groupMemberships = [...new Set(this.groupMemberships)];
  this.proof = [...new Set(this.proof)];
  next();
});

module.exports = mongoose.model('Suspect', SuspectSchema);