import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../styles/CrearEquipoPage.scss';
import PokemonSlot from '../components/PokemonSlot';

export default function CrearEquipoPage() {
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [pokemonsDisponibles, setPokemonsDisponibles] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tiposNaturaleza, setTiposNaturaleza] = useState([]);
  const [items, setItems] = useState([]);
  const [poderes, setPoderes] = useState([]);
  const [miEquipo, setMiEquipo] = useState([]);
  const [mostrarSeleccion, setMostrarSeleccion] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pokeRes, natRes, itemRes, poderRes, tiposRes] = await Promise.all([
          api.get('/pokemon'),
          api.get('/naturalezas'),
          api.get('/items'),
          api.get('/poderes'),
          api.get('/tipos')
        ]);
        setPokemonsDisponibles(pokeRes.data);
        setTiposNaturaleza(natRes.data);
        setItems(itemRes.data);
        setTipos(tiposRes.data);
        setPoderes(poderRes.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    fetchData();
  }, []);

  const agregarPokemon = (pokemon) => {
    if (miEquipo.length >= 6) return alert('Máximo 6 Pokémon por equipo');

    const tipoObj = tipos.find(t => t.id === pokemon.tipoId);
    const tipoNombre = tipoObj ? tipoObj.nombre : 'Desconocido';

    setMiEquipo([...miEquipo, {
      id: pokemon.id,
      nombre: pokemon.nombre,
      imagen: pokemon.imagen,
      tipoId: pokemon.tipoId,
      tipo: tipoNombre, // ✅ Agregado
      poderU: pokemon.poderU,
      poder1: pokemon.poder1,
      poder2: pokemon.poder2,
      poder3: pokemon.poder3,
      hp: pokemon.hp,
      attack: pokemon.attack,
      defense: pokemon.defense,
      spAtk: pokemon.spAtk,
      spDef: pokemon.spDef,
      speed: pokemon.speed,
      evHp: 0, evAtk: 0, evDef: 0, evSpAtk: 0, evSpDef: 0, evSpeed: 0,
      ivHp: 0, ivAtk: 0, ivDef: 0, ivSpAtk: 0, ivSpDef: 0, ivSpeed: 0,
      naturalezaId: null,
      itemId: null
    }]);
  };

  const eliminarPokemon = (index) => {
    const nuevoEquipo = [...miEquipo];
    nuevoEquipo.splice(index, 1);
    setMiEquipo(nuevoEquipo);
  };

  const actualizarStat = (index, field, value) => {
    const updated = [...miEquipo];
    updated[index][field] = Number(value);
    setMiEquipo(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const p of miEquipo) {
      const totalEVs = p.evHp + p.evAtk + p.evDef + p.evSpAtk + p.evSpDef + p.evSpeed;
      if (totalEVs > 508) return alert(`EVs totales exceden 508 para ${p.nombre}`);

      const ivs = [p.ivHp, p.ivAtk, p.ivDef, p.ivSpAtk, p.ivSpDef, p.ivSpeed];
      if (ivs.some(v => v < 0 || v > 31)) return alert(`IVs inválidos para ${p.nombre}`);
    }

    try {
      await api.post('/equipos', {
        nombre: nombreEquipo,
        pokemons: miEquipo
      }, {
        headers: { Authorization: token }
      });
      alert('Equipo creado con éxito');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Error al guardar equipo');
    }
  };

  return (
    <div className="crear-equipo-container">
      <h2>Crear Equipo Pokémon</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del equipo"
          value={nombreEquipo}
          onChange={(e) => setNombreEquipo(e.target.value)}
          required
        />

        <button
          type="button"
          className="toggle-seleccion"
          onClick={() => setMostrarSeleccion(!mostrarSeleccion)}
        >
          {mostrarSeleccion ? 'Ocultar Pokémon Disponibles' : 'Seleccionar Pokémon'}
        </button>

        {mostrarSeleccion && (
          <div className="seleccion-pokemon">
            {pokemonsDisponibles.map(p => (
              <div key={p.id} className="pokemon-card" onClick={() => agregarPokemon(p)}>
                <img
                  src={p.imagen.startsWith('http') ? p.imagen : `http://localhost:3000${p.imagen}`}
                  alt={p.nombre}
                />
                <p>{p.nombre}</p>
              </div>
            ))}
          </div>
        )}

        <h3>Mi equipo</h3>
        <div className="slots-grid">
          {miEquipo.map((poke, index) => (
            <PokemonSlot
              key={index}
              poke={poke}
              index={index}
              tiposNaturaleza={tiposNaturaleza}
              items={items}
              actualizarStat={actualizarStat}
              eliminarPokemon={eliminarPokemon}
              poderes={poderes}
            />
          ))}
        </div>

        <button type="submit" className="guardar-equipo-btn">Guardar Equipo</button>
      </form>
    </div>
  );
}
