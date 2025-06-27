const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Poder = sequelize.define('Poder', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  esUnico: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  pokemonBase: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Poder;
