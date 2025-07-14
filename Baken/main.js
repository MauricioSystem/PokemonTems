require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initModels } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 


app.use('/api/auth', require('./routes/auth.Routes'));
app.use('/api/equipos', require('./routes/equipo.routes'));
app.use('/api/pokemon', require('./routes/pokemon.routes'));
app.use('/api/poderes', require('./routes/poder.routes'));
app.use('/api/items', require('./routes/item.routes'));
app.use('/api/tipos', require('./routes/tipo.routes'));
app.use('/api/naturalezas', require('./routes/naturaleza.routes'));




initModels().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
  });
});
