const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  suspectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Suspect', required: true },
  reportType: { type: String, enum: ['summary', 'fir', 'chargesheet'], required: true },
  fileUrl: { type: String, required: true },
  generatedBy: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', ReportSchema);