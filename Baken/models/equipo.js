const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Equipo = sequelize.define('Equipo', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  usuarioId: {  
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = Equipo;
