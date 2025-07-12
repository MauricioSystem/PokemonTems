const db = require('../models');
const Equipo = db.Equipo;
const Pokemon = db.Pokemon;

const crearEquipo = async (req, res) => {
  const usuarioId = req.user?.id;
  const { nombre, pokemons } = req.body;

  if (!nombre || !Array.isArray(pokemons) || pokemons.length < 1 || pokemons.length > 6) {
    return res.status(400).json({ error: 'Nombre del equipo y entre 1 a 6 Pokémon son requeridos' });
  }

  try {
    const nuevoEquipo = await Equipo.create({ nombre, usuarioId });

    for (const pokeData of pokemons) {
      const original = await Pokemon.findByPk(pokeData.id);
      if (!original) continue;

      const totalEV = [
        pokeData.evHp, pokeData.evAtk, pokeData.evDef,
        pokeData.evSpAtk, pokeData.evSpDef, pokeData.evSpeed
      ].reduce((a, b) => a + (b || 0), 0);
      if (totalEV > 508) {
        return res.status(400).json({ error: `Los EVs del Pokémon ${original.nombre} superan el límite de 508` });
      }

      const iv = (stat) => {
        const v = pokeData[stat];
        return v == null ? Math.floor(Math.random() * 32) : Math.max(0, Math.min(31, v));
      };

      await Pokemon.create({
        nombre: pokeData.nombre || original.nombre,
        imagen: original.imagen,
        tipoId: original.tipoId,
        poderU: original.poderU,
        poder1: original.poder1,
        poder2: original.poder2,
        poder3: original.poder3,
        hp: original.hp,
        attack: original.attack,
        defense: original.defense,
        spAtk: original.spAtk,
        spDef: original.spDef,
        speed: original.speed,
        naturalezaId: pokeData.naturalezaId || null,
        itemId: pokeData.itemId || null,
        evHp: pokeData.evHp || 0,
        evAtk: pokeData.evAtk || 0,
        evDef: pokeData.evDef || 0,
        evSpAtk: pokeData.evSpAtk || 0,
        evSpDef: pokeData.evSpDef || 0,
        evSpeed: pokeData.evSpeed || 0,
        ivHp: iv('ivHp'),
        ivAtk: iv('ivAtk'),
        ivDef: iv('ivDef'),
        ivSpAtk: iv('ivSpAtk'),
        ivSpDef: iv('ivSpDef'),
        ivSpeed: iv('ivSpeed'),
        equipoId: nuevoEquipo.id
      });
    }

    res.status(201).json({ mensaje: 'Equipo creado correctamente', equipo: nuevoEquipo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el equipo' });
  }
};

const getEquiposUsuario = async (req, res) => {
  const usuarioId = req.user?.id;

  try {
    const equipos = await db.Equipo.findAll({
      where: { usuarioId },
      include: [{
        model: db.Pokemon,
        as: 'pokemons' 
      }]
    });

    res.json(equipos);
  } catch (error) {
    console.error('Error al obtener los equipos:', error);
    res.status(500).json({ error: 'Error al obtener los equipos' });
  }
};


const eliminarEquipo = async (req, res) => {
  const equipoId = req.params.id;
  const usuarioId = req.user?.id;

  try {
    const equipo = await Equipo.findOne({ where: { id: equipoId, usuarioId } });
    if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' });

    await Pokemon.destroy({ where: { equipoId } });
    await equipo.destroy();

    res.json({ mensaje: 'Equipo eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el equipo' });
  }
};

const editarEquipo = async (req, res) => {
  const usuarioId = req.user?.id;
  const equipoId = req.params.id;
  const { nombre, pokemons } = req.body;

  if (!nombre || !Array.isArray(pokemons) || pokemons.length < 1 || pokemons.length > 6) {
    return res.status(400).json({ error: 'Nombre y entre 1 a 6 Pokémon son requeridos' });
  }

  try {
    const equipo = await Equipo.findOne({ where: { id: equipoId, usuarioId } });
    if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' });

    equipo.nombre = nombre;
    await equipo.save();

    await Pokemon.destroy({ where: { equipoId } });

    for (const pokeData of pokemons) {
      await Pokemon.create({
        nombre: pokeData.nombre,
        imagen: pokeData.imagen,
        tipoId: pokeData.tipoId,
        poderU: pokeData.poderU,
        poder1: pokeData.poder1,
        poder2: pokeData.poder2,
        poder3: pokeData.poder3,
        hp: pokeData.hp,
        attack: pokeData.attack,
        defense: pokeData.defense,
        spAtk: pokeData.spAtk,
        spDef: pokeData.spDef,
        speed: pokeData.speed,
        naturalezaId: pokeData.naturalezaId || null,
        itemId: pokeData.itemId || null,
        evHp: pokeData.evHp || 0,
        evAtk: pokeData.evAtk || 0,
        evDef: pokeData.evDef || 0,
        evSpAtk: pokeData.evSpAtk || 0,
        evSpDef: pokeData.evSpDef || 0,
        evSpeed: pokeData.evSpeed || 0,
        ivHp: pokeData.ivHp || 0,
        ivAtk: pokeData.ivAtk || 0,
        ivDef: pokeData.ivDef || 0,
        ivSpAtk: pokeData.ivSpAtk || 0,
        ivSpDef: pokeData.ivSpDef || 0,
        ivSpeed: pokeData.ivSpeed || 0,
        equipoId: equipo.id
      });
    }

    res.json({ mensaje: 'Equipo actualizado correctamente' });
  } catch (error) {
    console.error('Error al editar el equipo:', error);
    res.status(500).json({ error: 'Error al editar el equipo' });
  }
};



 
module.exports = {
  crearEquipo,
  getEquiposUsuario,
  eliminarEquipo,
  editarEquipo
};
