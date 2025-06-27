const db = require('../models');
const Tipo = db.Tipo;

const createTipo = async (req, res) => {
  try {
    const tipo = await Tipo.create(req.body);
    res.status(201).json(tipo);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear tipo' });
  }
};

const getAllTipos = async (req, res) => {
  try {
    const tipos = await Tipo.findAll();
    res.json(tipos);
  } catch (err) {
    res.status(500).json({ error: 'Error al listar tipos' });
  }
};

const getTipoById = async (req, res) => {
  try {
    const tipo = await Tipo.findByPk(req.params.id);
    if (!tipo) return res.status(404).json({ error: 'Tipo no encontrado' });
    res.json(tipo);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar tipo' });
  }
};

const updateTipo = async (req, res) => {
  try {
    const tipo = await Tipo.findByPk(req.params.id);
    if (!tipo) return res.status(404).json({ error: 'Tipo no encontrado' });
    await tipo.update(req.body);
    res.json(tipo);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar tipo' });
  }
};

const deleteTipo = async (req, res) => {
  try {
    const tipo = await Tipo.findByPk(req.params.id);
    if (!tipo) return res.status(404).json({ error: 'Tipo no encontrado' });
    await tipo.destroy();
    res.json({ message: 'Tipo eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar tipo' });
  }
};

module.exports = {
  createTipo,
  getAllTipos,
  getTipoById,
  updateTipo,
  deleteTipo
};
