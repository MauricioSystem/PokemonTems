const sequelize = require('../config/database');

const User = require('./user');
const Equipo = require('./equipo');
const Pokemon = require('./pokemon');
const Tipo = require('./tipo');
const Item = require('./item');
const Naturaleza = require('./naturaleza');
const Poder = require('./poder');
const PokemonPoder = require('./pokemonPoder');

User.hasMany(Equipo, { foreignKey: 'usuarioId' });
Equipo.belongsTo(User, { foreignKey: 'usuarioId' });

Equipo.hasMany(Pokemon, { foreignKey: 'equipoId', as: 'pokemons' });
Pokemon.belongsTo(Equipo, { foreignKey: 'equipoId', as: 'equipo' });


Tipo.hasMany(Pokemon, { foreignKey: 'tipoId' });
Pokemon.belongsTo(Tipo, { foreignKey: 'tipoId' });


Naturaleza.hasMany(Pokemon, { foreignKey: 'naturalezaId' });
Pokemon.belongsTo(Naturaleza, { foreignKey: 'naturalezaId' });


Item.hasMany(Pokemon, { foreignKey: 'itemId' });
Pokemon.belongsTo(Item, { foreignKey: 'itemId' });


Poder.hasOne(Pokemon, { as: 'pokemonUnico', foreignKey: 'poderUnicoId' });
Pokemon.belongsTo(Poder, { as: 'poderUnico', foreignKey: 'poderUnicoId' });

Pokemon.belongsToMany(Poder, { through: PokemonPoder, as: 'poderesGenericos' });
Poder.belongsToMany(Pokemon, { through: PokemonPoder, as: 'pokemonsConPoder' });


const initModels = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida');
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados');
  } catch (error) {
    console.error('Error al inicializar modelos:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Equipo,
  Pokemon,
  Tipo,
  Item,
  Naturaleza,
  Poder,
  PokemonPoder,
  initModels,
};
