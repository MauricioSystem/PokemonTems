const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Naturaleza = sequelize.define('Naturaleza', {
  nombre: DataTypes.STRING,
  afectaStatPos: DataTypes.STRING, // Ejemplo: 'attack'
  afectaStatNeg: DataTypes.STRING  // Ejemplo: 'defense'
});

module.exports = Naturaleza;
