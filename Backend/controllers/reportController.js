const Report = require('../models/Report');
const Suspect = require('../models/Suspect');
const logger = require('../utils/logger');
const { generatePdf } = require('../utils/pdfGenerator');

exports.generateReport = async (req, res) => {
  try {
    const { suspectId, includeMessages, includeLegalSections, format } = req.body;
    const suspect = await Suspect.findById(suspectId);
    if (!suspect) return res.status(404).json({ message: 'Suspect not found' });

    // Placeholder: Generate report content
    const reportContent = {
      suspect: suspect,
      messages: includeMessages ? await MessageLog.find({ suspectId }) : [],
      legalSections: includeLegalSections ? ['NDPS 21', 'NDPS 22'] : [],
    };

    const fileUrl = await generatePdf(reportContent, format, suspectId);
    const report = new Report({
      suspectId,
      reportType: 'summary',
      fileUrl,
      generatedBy: req.officer.name,
    });
    await report.save();

    logger.info(`Report generated for suspect ${suspectId} by ${req.officer.email}`);
    res.json({ reportUrl: fileUrl, generatedAt: report.generatedAt });
  } catch (error) {
    logger.error('Error generating report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};