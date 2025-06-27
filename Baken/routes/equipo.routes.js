const express = require('express');
const router = express.Router();
const {
  crearEquipo,
  getEquiposUsuario,
  eliminarEquipo
} = require('../controllers/equipo.controller');
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear equipo
router.post('/', crearEquipo);

// Obtener equipos del usuario
router.get('/', getEquiposUsuario);

// Eliminar equipo por ID
router.delete('/:id', eliminarEquipo);  // <--- RUTA NUEVA

module.exports = router;
