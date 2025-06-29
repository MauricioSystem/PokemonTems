const express = require('express');
const { register, login,getAllUsers, toggleAdmin  } = require('../controllers/auth.Controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/all', authMiddleware, getAllUsers);
router.put('/:id/toggle-admin', authMiddleware, toggleAdmin);

module.exports = router;
