const mongoose = require('mongoose');

const MessageLogSchema = new mongoose.Schema({
  suspectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Suspect', required: true },
  platform: { type: String, required: true },
  direction: { type: String, enum: ['incoming', 'outgoing'], required: true },
  text: String,
  timestamp: { type: Date, default: Date.now },
  flagged: { type: Boolean, default: false },
  flagReason: String,
});

module.exports = mongoose.model('MessageLog', MessageLogSchema);