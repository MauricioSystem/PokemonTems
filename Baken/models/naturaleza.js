const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Naturaleza = sequelize.define('Naturaleza', {
  nombre: DataTypes.STRING,
  afectaStatPos: DataTypes.STRING, 
  afectaStatNeg: DataTypes.STRING  
});

module.exports = Naturaleza;
