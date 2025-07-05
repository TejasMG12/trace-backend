const BotSession = require('../models/BotSession');
const Suspect = require('../models/Suspect');
const logger = require('../utils/logger');

exports.startBot = async (req, res) => {
  try {
    const { suspectId, initialPrompt, persona, maxTurns } = req.body;
    const suspect = await Suspect.findById(suspectId);
    if (!suspect) return res.status(404).json({ message: 'Suspect not found' });

    const botSession = new BotSession({
      suspectId,
      botPersona: persona,
      conversation: [{ from: 'bot', text: initialPrompt }],
    });
    await botSession.save();

    logger.info(`Bot started for suspect ${suspectId} by ${req.officer.email}`);
    res.json({ botId: botSession._id, status: 'started', startTime: botSession.startedAt });
  } catch (error) {
    logger.error('Error starting bot:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const botSession = await BotSession.findById(req.params.botId).lean();
    if (!botSession) return res.status(404).json({ message: 'Bot session not found' });

    res.json({
      botId: botSession._id,
      conversation: botSession.conversation,
      flaggedTurns: botSession.flaggedTurns,
    });
  } catch (error) {
    logger.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.stopBot = async (req, res) => {
  try {
    const botSession = await BotSession.findById(req.params.botId);
    if (!botSession) return res.status(404).json({ message: 'Bot session not found' });

    botSession.endedAt = new Date();
    await botSession.save();

    logger.info(`Bot stopped for session ${req.params.botId} by ${req.officer.email}`);
    res.json({ message: 'Bot session stopped' });
  } catch (error) {
    logger.error('Error stopping bot:', error);
    res.status(500).json({ message: 'Server error' });
  }
};