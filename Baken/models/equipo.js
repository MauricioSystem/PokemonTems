const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Equipo = sequelize.define('Equipo', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  usuarioId: {  // clave foránea a usuario
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = Equipo;
