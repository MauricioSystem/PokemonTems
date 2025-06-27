const express = require('express');
const router = express.Router();
const {
  createTipo,
  getAllTipos,
  getTipoById,
  updateTipo,
  deleteTipo
} = require('../controllers/tipo.controller');

router.post('/', createTipo);
router.get('/', getAllTipos);
router.get('/:id', getTipoById);
router.put('/:id', updateTipo);
router.delete('/:id', deleteTipo);

module.exports = router;
