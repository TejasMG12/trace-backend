const Suspect = require('../models/Suspect');
const MessageLog = require('../models/MessageLog');
const logger = require('../utils/logger');

exports.getSuspects = async (req, res) => {
  try {
    const { page = 1, limit = 20, riskLevel, platform } = req.query;
    const query = {};
    if (riskLevel) query.riskScore = riskLevel === 'high' ? { $gte: 70 } : { $lt: 70 };
    if (platform) query.platforms = platform;

    const suspects = await Suspect.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('name aliases riskScore platforms status createdAt');

    const total = await Suspect.countDocuments(query);

    res.json({
      data: suspects,
      meta: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (error) {
    logger.error('Error fetching suspects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSuspectById = async (req, res) => {
  try {
    const suspect = await Suspect.findById(req.params.id).lean();
    if (!suspect) return res.status(404).json({ message: 'Suspect not found' });

    const messageSummary = await MessageLog.aggregate([
      { $match: { suspectId: suspect._id } },
      { $group: { _id: null, totalMessages: { $sum: 1 }, suspiciousMessages: { $sum: { $cond: ['$flagged', 1, 0] } } } },
    ]);

    res.json({
      ...suspect,
      messageSummary: messageSummary[0] || { totalMessages: 0, suspiciousMessages: 0 },
      mediaLinks: [], // Placeholder for media links
    });
  } catch (error) {
    logger.error('Error fetching suspect:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createSuspect = async (req, res) => {
  try {
    const suspect = new Suspect(req.body);
    await suspect.save();
    logger.info(`Suspect created by ${req.officer.email}: ${suspect._id}`);
    res.status(201).json({ id: suspect._id, message: 'Suspect created successfully' });
  } catch (error) {
    logger.error('Error creating suspect:', error);
    res.status(500).json({ message: 'Server error' });
  }
};