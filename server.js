const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('./utils/logger');

dotenv.config();

const app = express();
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