const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Donation = sequelize.define('Donation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  campaignId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'campaigns',
      key: 'id'
    }
  },
  donorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Số tiền phải lớn hơn 0'
      }
    }
  },
  message: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  txHash: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  blockNumber: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'failed'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'donations',
  timestamps: true
});

module.exports = Donation;
