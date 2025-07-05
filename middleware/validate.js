const { body, validationResult } = require('express-validator');

const suspect = [
  body('name').notEmpty().withMessage('Name is required'),
  body('platform').isIn(['telegram', 'instagram']).withMessage('Invalid platform'),
  body('username').optional().notEmpty().withMessage('Username cannot be empty'),
  body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number'),
];

const osint = [
  body('query').notEmpty().withMessage('Query is required'),
  body('platforms').isArray().withMessage('Platforms must be an array'),
];

const report = [
  body('suspectId').isMongoId().withMessage('Invalid suspect ID'),
  body('includeMessages').isBoolean().withMessage('IncludeMessages must be boolean'),
  body('format').isIn(['pdf', 'docx']).withMessage('Invalid format'),
];

const botStart = [
  body('suspectId').isMongoId().withMessage('Invalid suspect ID'),
  body('initialPrompt').notEmpty().withMessage('Initial prompt is required'),
  body('persona').notEmpty().withMessage('Persona is required'),
];

const legalAssist = [
  body('description').notEmpty().withMessage('Description is required'),
  body('includeDraft').isBoolean().withMessage('IncludeDraft must be boolean'),
];

const fir = [
  body('suspectId').isMongoId().withMessage('Invalid suspect ID'),
  body('incidentDate').isISO8601().withMessage('Invalid date format'),
  body('location').notEmpty().withMessage('Location is required'),
];

const login = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const register = [
  body('name').notEmpty().withMessage('Name is required'),
  body('badgeId').notEmpty().withMessage('Badge ID is required'),
  body('role').isIn(['admin', 'inspector', 'analyst']).withMessage('Invalid role'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { suspect, osint, report, botStart, legalAssist, fir, login, register, validate };