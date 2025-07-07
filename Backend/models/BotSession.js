const mongoose = require('mongoose');

const BotSessionSchema = new mongoose.Schema({
  suspectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Suspect', required: true },
  botPersona: String,
  conversation: [
    {
      from: { type: String, enum: ['bot', 'suspect'], required: true },
      text: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  flaggedTurns: [
    {
      turnIndex: Number,
      reason: String,
    },
  ],
  startedAt: { type: Date, default: Date.now },
  endedAt: Date,
});

module.exports = mongoose.model('BotSession', BotSessionSchema);