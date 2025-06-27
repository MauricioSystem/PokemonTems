const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tipo = sequelize.define('Tipo', {
  nombre: DataTypes.STRING
});

module.exports = Tipo;
