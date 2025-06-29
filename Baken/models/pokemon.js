const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pokemon = sequelize.define('Pokemon', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imagen: DataTypes.STRING,
  tipoId: DataTypes.INTEGER,
  naturalezaId: DataTypes.INTEGER,
  itemId: DataTypes.INTEGER,
  hp: DataTypes.INTEGER,
  attack: DataTypes.INTEGER,
  defense: DataTypes.INTEGER,
  spAtk: DataTypes.INTEGER,
  spDef: DataTypes.INTEGER,
  speed: DataTypes.INTEGER,
  evHp: DataTypes.INTEGER,
  evAtk: DataTypes.INTEGER,
  evDef: DataTypes.INTEGER,
  evSpAtk: DataTypes.INTEGER,
  evSpDef: DataTypes.INTEGER,
  evSpeed: DataTypes.INTEGER,
  ivHp: DataTypes.INTEGER,
  ivAtk: DataTypes.INTEGER,
  ivDef: DataTypes.INTEGER,
  ivSpAtk: DataTypes.INTEGER,
  ivSpDef: DataTypes.INTEGER,
  ivSpeed: DataTypes.INTEGER,
  poderU: DataTypes.STRING,
  poder1: DataTypes.STRING,
  poder2: DataTypes.STRING,
  poder3: DataTypes.STRING,
  equipoId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});


Pokemon.associate = (models) => {
  Pokemon.belongsTo(models.Equipo, {
    foreignKey: 'equipoId',
    as: 'equipo'
  });
};

module.exports = Pokemon;
