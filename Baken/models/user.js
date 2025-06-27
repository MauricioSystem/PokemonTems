const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  authToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  esAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = User;
