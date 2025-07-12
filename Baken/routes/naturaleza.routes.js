const express = require('express');
const router = express.Router();
const {createNaturaleza,getAllNaturalezas,getNaturalezaById,updateNaturaleza, deleteNaturaleza} = require('../controllers/naturaleza.controller');

router.post('/', createNaturaleza);
router.get('/', getAllNaturalezas);
router.get('/:id', getNaturalezaById);
router.put('/:id', updateNaturaleza);
router.delete('/:id', deleteNaturaleza);

module.exports = router;
