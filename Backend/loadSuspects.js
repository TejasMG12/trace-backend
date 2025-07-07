require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises;

// Define the Suspect Schema
const SuspectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  aliases: [String],
  username: { type: String, index: true },
  phone: { type: String, index: true },
  dob: Date,
  platforms: [String],
  groupMemberships: { type: [String], default: [] },
  locationHistory: { type: [String], default: [] },
  riskScore: { type: Number, default: 0, index: true },
  status: { type: String, enum: ['active', 'closed', 'underwatch'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  proof: { type: [String], default: [] },
  request_id: { type: String, index: true }
});

// Ensure groupMemberships and proof arrays do not contain duplicates
SuspectSchema.pre('save', function (next) {
  this.groupMemberships = [...new Set(this.groupMemberships)];
  this.proof = [...new Set(this.proof)];
  next();
});

// Create the Suspect model
const Suspect = mongoose.model('Suspect', SuspectSchema);

async function loadSuspects() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Read the suspect.json file
    const data = await fs.readFile('suspect.json', 'utf8');
    const suspects = JSON.parse(data);

    // Insert suspects into the database
    const result = await Suspect.insertMany(suspects);
    console.log(`Successfully inserted ${result.length} suspects`);

    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the function
loadSuspects();