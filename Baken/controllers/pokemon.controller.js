const db = require('../models');
const Pokemon = db.Pokemon;
const path = require('path');
const { Op } = require('sequelize');


const createPokemon = async (req, res) => {
  try {
    const data = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const nuevoPokemon = await Pokemon.create({ ...data, imagen });
    res.status(201).json(nuevoPokemon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el Pokémon', detalle: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const pokemons = await Pokemon.findAll({ where: { equipoId: null } });
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los Pokémon' });
  }
};

const getById = async (req, res) => {
  try {
    const pokemon = await Pokemon.findByPk(req.params.id);
    if (!pokemon) return res.status(404).json({ error: 'Pokémon no encontrado' });
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el Pokémon' });
  }
};


const updatePokemon = async (req, res) => {
  try {
    const pokemon = await Pokemon.findByPk(req.params.id);
    if (!pokemon) return res.status(404).json({ error: 'Pokémon no encontrado' });

    const data = req.body;
    if (req.file) data.imagen = `/uploads/${req.file.filename}`;

    await pokemon.update(data);
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el Pokémon' });
  }
};

const deletePokemon = async (req, res) => {
  try {
    const pokemon = await Pokemon.findByPk(req.params.id);
    if (!pokemon) return res.status(404).json({ error: 'Pokémon no encontrado' });

    await pokemon.destroy();
    res.json({ mensaje: 'Pokémon eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el Pokémon' });
  }
};

const searchByName = async (req, res) => {
  try {
    let nombre = req.query.nombre;
    if (!nombre) {
      return res.status(400).json({ error: 'Parámetro "nombre" requerido' });
    }

    nombre = nombre.replace(/\s+/g, '').toLowerCase();

    const pokemons = await Pokemon.findAll({
      where: {
        equipoId: null
      }
    });
    const filtrados = pokemons.filter(p =>
      p.nombre.replace(/\s+/g, '').toLowerCase().includes(nombre)
    )


    res.json(filtrados);
  } catch (error) {
    console.error('Error en búsqueda por nombre:', error);
    res.status(500).json({ error: 'Error al buscar Pokémon', detalle: error.message });
  }
};


module.exports = {
  createPokemon,
  getAll,
  getById,
  updatePokemon,
  deletePokemon,
  searchByName
};
