const db = require('../models');
const Naturaleza = db.Naturaleza;

const createNaturaleza = async (req, res) => {
  try {
    const naturaleza = await Naturaleza.create(req.body);
    res.status(201).json(naturaleza);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear naturaleza' });
  }
};

const getAllNaturalezas = async (req, res) => {
  try {
    const naturalezas = await Naturaleza.findAll();
    res.json(naturalezas);
  } catch (err) {
    res.status(500).json({ error: 'Error al listar naturalezas' });
  }
};

const getNaturalezaById = async (req, res) => {
  try {
    const naturaleza = await Naturaleza.findByPk(req.params.id);
    if (!naturaleza) return res.status(404).json({ error: 'Naturaleza no encontrada' });
    res.json(naturaleza);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar naturaleza' });
  }
};

const updateNaturaleza = async (req, res) => {
  try {
    const naturaleza = await Naturaleza.findByPk(req.params.id);
    if (!naturaleza) return res.status(404).json({ error: 'Naturaleza no encontrada' });
    await naturaleza.update(req.body);
    res.json(naturaleza);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar naturaleza' });
  }
};

const deleteNaturaleza = async (req, res) => {
  try {
    const naturaleza = await Naturaleza.findByPk(req.params.id);
    if (!naturaleza) return res.status(404).json({ error: 'Naturaleza no encontrada' });
    await naturaleza.destroy();
    res.json({ message: 'Naturaleza eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar naturaleza' });
  }
};

module.exports = {
  createNaturaleza,
  getAllNaturalezas,
  getNaturalezaById,
  updateNaturaleza,
  deleteNaturaleza
};
