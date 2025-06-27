const db = require('../models');
const Item = db.Item;

// createItem ahora solo extrae req.file.path
const createItem = async (req, res) => {
  try {
    const { nombre } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const item = await Item.create({ nombre, imagen });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear item' });
  }
};

// ... los demás métodos sin cambios
const getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error al listar items' });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar item' });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar item' });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });
    await item.destroy();
    res.json({ message: 'Item eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar item' });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem
};
