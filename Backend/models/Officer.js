const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const OfficerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  badgeId: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'inspector', 'analyst'], default: 'inspector' },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  lastLogin: Date,
});

// Hash password before saving
OfficerSchema.pre('save', async function (next) {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
  next();
});

// Method to compare passwords
OfficerSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('Officer', OfficerSchema);