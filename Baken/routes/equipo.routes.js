const express = require('express');
const router = express.Router();
const {
  crearEquipo,
  getEquiposUsuario,
  eliminarEquipo,
  editarEquipo 
} = require('../controllers/equipo.controller');
const authMiddleware = require('../middleware/authMiddleware');


router.use(authMiddleware);

router.post('/', crearEquipo);
router.get('/', getEquiposUsuario);
router.put('/:id', editarEquipo); 
router.delete('/:id', eliminarEquipo);

module.exports = router;
