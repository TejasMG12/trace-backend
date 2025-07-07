const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const logger = require('./utils/logger');

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-TRACE-OFFICER-ID']
}));

app.use(express.json());

// Routes
app.use('/suspects', require('./routes/suspects'));
app.use('/osint', require('./routes/osint'));
app.use('/reports', require('./routes/reports'));
app.use('/bot', require('./routes/bot'));
app.use('/legal', require('./routes/legal'));
app.use('/auth', require('./routes/auth')); 
// app.use('/fir', require('./routes/fir'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('MongoDB connected'))
  .catch((err) => logger.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));