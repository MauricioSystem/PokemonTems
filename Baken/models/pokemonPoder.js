const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PokemonPoder = sequelize.define('PokemonPoder', {}, { timestamps: false });

module.exports = PokemonPoder;
