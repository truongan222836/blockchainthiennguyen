const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Tạo thư mục data nếu chưa tồn tại
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Tạo database file trong thư mục server/data
const dbPath = path.join(dataDir, 'charity.db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false
  }
});

module.exports = sequelize;
