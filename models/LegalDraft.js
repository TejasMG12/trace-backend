const mongoose = require('mongoose');

const LegalDraftSchema = new mongoose.Schema({
  suspectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Suspect', required: true },
  description: String,
  suggestedSections: [
    {
      code: String,
      description: String,
    },
  ],
  draftSummary: String,
  firPdfUrl: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LegalDraft', LegalDraftSchema);