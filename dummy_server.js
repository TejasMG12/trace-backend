const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Initialize Express app
const app = express();
app.use(express.json());

// Mock JWT secret
const JWT_SECRET = 'mock_jwt_secret';

// Mock officer data for authentication (with hashed passwords)
const mockOfficers = [
  {
    id: 'officer_293',
    name: 'Inspector R. Joshi',
    role: 'inspector',
    email: 'joshi@trace.in',
    passwordHash: bcrypt.hashSync('Password@123', 10),
  },
  {
    id: 'officer_294',
    name: 'Admin A. Sharma',
    role: 'admin',
    email: 'sharma@trace.in',
    passwordHash: bcrypt.hashSync('Password@123', 10),
  },
  {
    id: 'officer_295',
    name: 'Analyst S. Gupta',
    role: 'analyst',
    email: 'gupta@trace.in',
    passwordHash: bcrypt.hashSync('Password@123', 10),
  },
];

// Middleware to simulate JWT authentication
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const officer = mockOfficers.find((o) => o.id === decoded.id);
    if (!officer) return res.status(401).json({ message: 'Invalid token' });
    req.officer = officer;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Middleware to simulate role-based access control
const role = (roles) => (req, res, next) => {
  if (!roles.includes(req.officer.role)) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }
  next();
};

// Middleware for input validation
const validate = (req, res, next) => {
  const { email, password, name, badgeId, role: roleInput } = req.body;
  if (req.path === '/auth/login') {
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  } else if (req.path === '/auth/register') {
    if (!name || !badgeId || !roleInput || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!['admin', 'inspector', 'analyst'].includes(roleInput)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  next();
};
// Mock suspect data
const mockSuspects = [
  {
    _id: 'sus123',
    name: 'Ajay Singh',
    aliases: ['@rajx', 'Aj_S'],
    username: '@rajx',
    phone: '+919876543210',
    dob: new Date('1999-08-12'),
    platforms: ['telegram', 'instagram'],
    groupMemberships: ['Group A', 'DarkBazaar'],
    locationHistory: ['Mumbai', 'Navi Mumbai'],
    riskScore: 87,
    status: 'active',
    createdAt: new Date('2025-07-03T21:20:00Z'),
  },
];

// Mock message log data
const mockMessageLogs = [
  {
    suspectId: 'sus123',
    platform: 'telegram',
    direction: 'outgoing',
    text: 'Need some stuff for party night.',
    timestamp: new Date('2025-07-03T22:00:00Z'),
    flagged: true,
    flagReason: 'Potential drug inquiry',
  },
];

// Mock bot session data
const mockBotSessions = [
  {
    _id: 'bot456',
    suspectId: 'sus123',
    botPersona: 'college buyer',
    conversation: [
      { from: 'bot', text: 'Hi, is this Raj from Borivali?', timestamp: new Date('2025-07-04T22:00:00Z') },
      { from: 'suspect', text: "Who's asking?", timestamp: new Date('2025-07-04T22:01:00Z') },
      { from: 'bot', text: 'Need some stuff for party night.', timestamp: new Date('2025-07-04T22:02:00Z') },
    ],
    flaggedTurns: [{ turnIndex: 3, reason: 'Potential drug inquiry' }],
    startedAt: new Date('2025-07-04T22:00:00Z'),
    endedAt: null,
  },
];

// Mock legal draft data
const mockLegalDrafts = [
  {
    suspectId: 'sus123',
    description: 'Suspect was caught with 30g MDMA near railway station, said he was selling it.',
    suggestedSections: [
      { code: 'NDPS 21', description: 'Punishment for possession of manufactured drugs' },
      { code: 'NDPS 22', description: 'Punishment for sale of synthetic drugs' },
    ],
    draftSummary: 'On 3rd July, suspect Ajay Singh was caught with 30g MDMA with intent to sell...',
    firPdfUrl: 'https://trace.ai/fir/draft_fir_sus123.pdf',
    createdAt: new Date('2025-07-04T23:00:00Z'),
  },
];

// Mock report data
const mockReports = [
  {
    suspectId: 'sus123',
    reportType: 'summary',
    fileUrl: 'https://trace.ai/reports/sus123_case_july04.pdf',
    generatedBy: 'Inspector R. Joshi',
    generatedAt: new Date('2025-07-04T23:05:00Z'),
  },
];

// API Endpoints

// Authentication Routes
app.post('/auth/login', validate, async (req, res) => {
  const { email, password } = req.body;
  const officer = mockOfficers.find((o) => o.email === email);
  if (!officer) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, officer.passwordHash);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: officer.id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, officer: { id: officer.id, name: officer.name, role: officer.role, email: officer.email } });
});

app.post('/auth/register', auth, role(['admin']), validate, async (req, res) => {
  const { name, badgeId, role: roleInput, email, password } = req.body;
  if (mockOfficers.find((o) => o.email === email || o.badgeId === badgeId)) {
    return res.status(400).json({ message: 'Email or badge ID already exists' });
  }

  const newOfficer = {
    id: `officer_${Math.floor(Math.random() * 10000)}`,
    name,
    badgeId,
    role: roleInput,
    email,
    passwordHash: await bcrypt.hash(password, 10),
  };
  mockOfficers.push(newOfficer);

  const token = jwt.sign({ id: newOfficer.id }, JWT_SECRET, { expiresIn: '1h' });
  res.status(201).json({ token, officer: { id: newOfficer.id, name, role: newOfficer.role, email } });
});

// GET /suspects
app.get('/suspects', auth, role(['admin', 'inspector', 'analyst']), (req, res) => {
  const { page = 1, limit = 20, riskLevel, platform } = req.query;
  let filteredSuspects = mockSuspects;

  if (riskLevel) {
    filteredSuspects = filteredSuspects.filter((s) => (riskLevel === 'high' ? s.riskScore >= 70 : s.riskScore < 70));
  }
  if (platform) {
    filteredSuspects = filteredSuspects.filter((s) => s.platforms.includes(platform));
  }

  const start = (page - 1) * limit;
  const paginatedSuspects = filteredSuspects.slice(start, start + parseInt(limit));

  res.json({
    data: paginatedSuspects.map((s) => ({
      id: s._id,
      name: s.name,
      aliases: s.aliases,
      riskScore: s.riskScore,
      platforms: s.platforms,
      lastSeen: s.createdAt,
      status: s.status,
    })),
    meta: { page: parseInt(page), limit: parseInt(limit), total: filteredSuspects.length },
  });
});

// GET /suspects/:id
app.get('/suspects/:id', auth, role(['admin', 'inspector', 'analyst']), (req, res) => {
  const suspect = mockSuspects.find((s) => s._id === req.params.id);
  if (!suspect) return res.status(404).json({ message: 'Suspect not found' });

  const messageSummary = {
    totalMessages: mockMessageLogs.filter((m) => m.suspectId === suspect._id).length,
    suspiciousMessages: mockMessageLogs.filter((m) => m.suspectId === suspect._id && m.flagged).length,
  };

  res.json({
    id: suspect._id,
    name: suspect.name,
    dob: suspect.dob,
    aliases: suspect.aliases,
    phone: suspect.phone,
    platforms: suspect.platforms,
    groupMemberships: suspect.groupMemberships,
    messageSummary,
    riskScore: suspect.riskScore,
    locationHistory: suspect.locationHistory,
    mediaLinks: [{ type: 'image', url: 'https://cdn.trace/suspects/sus123/img1.jpg' }],
  });
});

// POST /suspects
app.post('/suspects', auth, role(['admin', 'inspector']), (req, res) => {
  const { name, platform, username, aliases, phone } = req.body;
  if (!name || !platform) return res.status(400).json({ message: 'Name and platform are required' });

  const newSuspect = {
    _id: `sus${Math.floor(Math.random() * 10000)}`,
    name,
    aliases: aliases || [],
    username,
    phone,
    platforms: [platform],
    groupMemberships: [],
    locationHistory: [],
    riskScore: 0,
    status: 'active',
    createdAt: new Date(),
  };
  mockSuspects.push(newSuspect);

  res.status(201).json({ id: newSuspect._id, message: 'Suspect created successfully' });
});

// POST /osint/profile
app.post('/osint/profile', auth, role(['admin', 'inspector', 'analyst']), (req, res) => {
  const { query, platforms } = req.body;
  if (!query || !platforms) return res.status(400).json({ message: 'Query and platforms are required' });

  res.json({
    summary: `User '${query}' active in 3 groups linked to drug slang...`,
    relatedProfiles: ['Aj_S', '@r4jj'],
    extractedEntities: {
      locations: ['Mumbai', 'Borivali'],
      contacts: ['@dealer_x', '@buyer123'],
    },
    riskScore: 78,
    recommendation: 'Flag for deeper investigation',
  });
});

// POST /reports/generate
app.post('/reports/generate', auth, role(['admin', 'inspector']), (req, res) => {
  const { suspectId, includeMessages, includeLegalSections, format } = req.body;
  if (!suspectId || !['pdf', 'docx'].includes(format)) {
    return res.status(400).json({ message: 'Invalid suspect ID or format' });
  }

  const suspect = mockSuspects.find((s) => s._id === suspectId);
  if (!suspect) return res.status(404).json({ message: 'Suspect not found' });

  const report = {
    suspectId,
    reportType: 'summary',
    fileUrl: `https://trace.ai/reports/${suspectId}_case_${new Date().toISOString().split('T')[0]}.pdf`,
    generatedBy: req.officer.name,
    generatedAt: new Date(),
  };
  mockReports.push(report);

  res.json({ reportUrl: report.fileUrl, generatedAt: report.generatedAt });
});

// POST /bot/start
app.post('/bot/start', auth, role(['admin', 'inspector']), (req, res) => {
  const { suspectId, initialPrompt, persona, maxTurns } = req.body;
  if (!suspectId || !initialPrompt || !persona) {
    return res.status(400).json({ message: 'Suspect ID, initial prompt, and persona are required' });
  }

  const suspect = mockSuspects.find((s) => s._id === suspectId);
  if (!suspect) return res.status(404).json({ message: 'Suspect not found' });

  const botSession = {
    _id: `bot${Math.floor(Math.random() * 10000)}`,
    suspectId,
    botPersona: persona,
    conversation: [{ from: 'bot', text: initialPrompt, timestamp: new Date() }],
    flaggedTurns: [],
    startedAt: new Date(),
    endedAt: null,
  };
  mockBotSessions.push(botSession);

  res.json({ botId: botSession._id, status: 'started', startTime: botSession.startedAt });
});

// GET /bot/conversation/:botId
app.get('/bot/conversation/:botId', auth, role(['admin', 'inspector', 'analyst']), (req, res) => {
  const botSession = mockBotSessions.find((b) => b._id === req.params.botId);
  if (!botSession) return res.status(404).json({ message: 'Bot session not found' });

  res.json({
    botId: botSession._id,
    conversation: botSession.conversation,
    flaggedTurns: botSession.flaggedTurns,
  });
});

// DELETE /bot/:botId
app.delete('/bot/:botId', auth, role(['admin', 'inspector']), (req, res) => {
  const botSession = mockBotSessions.find((b) => b._id === req.params.botId);
  if (!botSession) return res.status(404).json({ message: 'Bot session not found' });

  botSession.endedAt = new Date();
  res.json({ message: 'Bot session stopped' });
});

// POST /legal/assist
app.post('/legal/assist', auth, role(['admin', 'inspector']), (req, res) => {
  const { description, includeDraft } = req.body;
  if (!description) return res.status(400).json({ message: 'Description is required' });

  const legalDraft = {
    description,
    suggestedSections: [
      { code: 'NDPS 21', description: 'Punishment for possession of manufactured drugs' },
      { code: 'NDPS 22', description: 'Punishment for sale of synthetic drugs' },
    ],
    draftSummary: includeDraft ? `Draft based on: ${description}` : null,
  };
  mockLegalDrafts.push(legalDraft);

  res.json({
    suggestedSections: legalDraft.suggestedSections,
    draftSummary: legalDraft.draftSummary,
  });
});

// POST /legal/fir
app.post('/legal/fir', auth, role(['admin', 'inspector']), (req, res) => {
  const { suspectId, incidentDate, location, evidence, officerName } = req.body;
  if (!suspectId || !incidentDate || !location) {
    return res.status(400).json({ message: 'Suspect ID, incident date, and location are required' });
  }

  const suspect = mockSuspects.find((s) => s._id === suspectId);
  if (!suspect) return res.status(404).json({ message: 'Suspect not found' });

  const firDocument = `https://trace.ai/fir/draft_fir_${suspectId}.pdf`;
  mockLegalDrafts.push({ suspectId, firPdfUrl: firDocument });

  res.json({ firDocument, status: 'generated' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Mock server running on port ${PORT}`));
