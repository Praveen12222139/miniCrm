const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Segment = sequelize.define('Segment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  rules: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Segment rules in JSON format'
  },
  lastAudienceSize: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Segment;
