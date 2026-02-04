const sequelize = require('../config/database');
const User = require('./User');
const Campaign = require('./Campaign');
const Donation = require('./Donation');

// Định nghĩa quan hệ
User.hasMany(Campaign, { foreignKey: 'creatorId', as: 'campaigns' });
Campaign.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

Campaign.hasMany(Donation, { foreignKey: 'campaignId', as: 'donations' });
Donation.belongsTo(Campaign, { foreignKey: 'campaignId', as: 'campaign' });

User.hasMany(Donation, { foreignKey: 'donorId', as: 'donations' });
Donation.belongsTo(User, { foreignKey: 'donorId', as: 'donor' });

// Sync database
const syncDatabase = async () => {
  try {
    // await sequelize.sync();
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully');
  } catch (error) {
    console.error('❌ Error syncing database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Campaign,
  Donation,
  syncDatabase
};
