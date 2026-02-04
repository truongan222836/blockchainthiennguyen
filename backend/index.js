const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize, syncDatabase, Campaign } = require('./models');
const syncFromBlockchain = require('./scripts/syncFromChain');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Database connection
const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to SQLite database');
    await syncDatabase();

    // Tự động đồng bộ từ Blockchain nếu database trống
    const campaignCount = await Campaign.count();
    if (campaignCount === 0) {
      console.log('⚠️ Database is empty. Auto-syncing from Blockchain...');
      await syncFromBlockchain();
    }

  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
};

connectDatabase();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
