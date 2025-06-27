const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  const user = await User.findOne({ where: { authToken: token } });

  if (!user) return res.status(403).json({ error: 'Token inválido' });

  req.user = user; 
  req.token = token;
  req.userId = user.id;
  next();
};

module.exports = authenticateToken;
