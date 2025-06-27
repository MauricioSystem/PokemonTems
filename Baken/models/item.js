const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  nombre: DataTypes.STRING,
  imagen: DataTypes.STRING
});

module.exports = Item;
