const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Vui lòng nhập tiêu đề chiến dịch'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Vui lòng nhập mô tả chiến dịch'
      }
    }
  },
  image: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  goalAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Số tiền mục tiêu phải lớn hơn 0'
      }
    }
  },
  currentAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Số tiền hiện tại phải lớn hơn hoặc bằng 0'
      }
    }
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  category: {
    type: DataTypes.ENUM('education', 'health', 'disaster', 'poverty', 'environment', 'other'),
    defaultValue: 'other'
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled'),
    defaultValue: 'active'
  },
  startDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  blockchainTxHash: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  contractAddress: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  onChainId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'campaigns',
  timestamps: true
});

module.exports = Campaign;
