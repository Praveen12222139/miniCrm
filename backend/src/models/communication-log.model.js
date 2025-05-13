const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommunicationLog = sequelize.define('CommunicationLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  campaignId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'failed'),
    defaultValue: 'pending'
  },
  vendorMessageId: {
    type: DataTypes.STRING
  },
  errorMessage: {
    type: DataTypes.TEXT
  },
  sentAt: {
    type: DataTypes.DATE
  }
});

module.exports = CommunicationLog;
