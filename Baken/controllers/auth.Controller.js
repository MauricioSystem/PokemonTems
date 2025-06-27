const { User } = require('../models');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const authToken = uuidv4();

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      authToken,
      esAdmin: false
    });

    res.status(201).json({
      id: user.id,              
      token: authToken,
      username: user.username,
      esAdmin: user.esAdmin
    });
  } catch (err) {
    res.status(400).json({ error: 'El usuario ya existe o los datos son inválidos' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const newToken = uuidv4();
    user.authToken = newToken;
    await user.save();

    res.json({
      id: user.id,              
      token: newToken,
      username: user.username,
      esAdmin: user.esAdmin
    });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { register, login };
