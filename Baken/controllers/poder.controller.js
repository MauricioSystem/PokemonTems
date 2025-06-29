const db = require('../models');
const Poder = db.Poder;


const createPoder = async (req, res) => {
  try {
    const poder = await Poder.create(req.body);
    res.status(201).json(poder);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el poder' });
  }
};


const getAll = async (req, res) => {
  try {
    const poderes = await Poder.findAll();
    res.json(poderes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener poderes' });
  }
};


const getById = async (req, res) => {
  try {
    const poder = await Poder.findByPk(req.params.id);
    if (!poder) return res.status(404).json({ error: 'Poder no encontrado' });
    res.json(poder);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el poder' });
  }
};

const updatePoder = async (req, res) => {
  try {
    const poder = await Poder.findByPk(req.params.id);
    if (!poder) return res.status(404).json({ error: 'Poder no encontrado' });

    await poder.update(req.body);
    res.json(poder);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el poder' });
  }
};


const deletePoder = async (req, res) => {
  try {
    const poder = await Poder.findByPk(req.params.id);
    if (!poder) return res.status(404).json({ error: 'Poder no encontrado' });

    await poder.destroy();
    res.json({ mensaje: 'Poder eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el poder' });
  }
};

module.exports = {
  createPoder,
  getAll,
  getById,
  updatePoder,
  deletePoder,
};
