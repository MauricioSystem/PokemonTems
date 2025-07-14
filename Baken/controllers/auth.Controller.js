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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'esAdmin']
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

const toggleAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    user.esAdmin = !user.esAdmin;
    await user.save();

    res.json({ message: 'Rol actualizado correctamente', esAdmin: user.esAdmin });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar rol' });
  }
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  const {nuevaPassword} = req.body;
  if (!nuevaPassword) {
    return res.status(400).json({ error: 'Nueva contraseña es requerida' });
  }
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  }catch (error) {
    res.status(500).json({ error: 'Error al actualizar contraseña' });
  }

};

module.exports = {
  register,
  login,
  getAllUsers,
  toggleAdmin,
  changePassword
};

