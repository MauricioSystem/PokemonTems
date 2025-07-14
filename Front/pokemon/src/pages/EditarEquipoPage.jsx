import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import '../styles/CrearEquipoPage.scss';
import PokemonSlot from '../components/PokemonSlot';
import BuscadorPokemon from '../components/BuscadorPokemon';

export default function EditarEquipoPage() {
  const { id } = useParams();
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [pokemonsDisponibles, setPokemonsDisponibles] = useState([]);
  const [tiposNaturaleza, setTiposNaturaleza] = useState([]);
  const [items, setItems] = useState([]);
  const [poderes, setPoderes] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [miEquipo, setMiEquipo] = useState([]);
  const [mostrarSeleccion, setMostrarSeleccion] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pokeRes, natRes, itemRes, poderRes, tiposRes, equipoRes] = await Promise.all([
          api.get('/pokemon'),
          api.get('/naturalezas'),
          api.get('/items'),
          api.get('/poderes'),
          api.get('/tipos'),
          api.get('/equipos', { headers: { Authorization: token } })
        ]);

        setPokemonsDisponibles(pokeRes.data);
        setTiposNaturaleza(natRes.data);
        setItems(itemRes.data);
        setPoderes(poderRes.data);
        setTipos(tiposRes.data);

        const equipo = equipoRes.data.find(e => e.id === parseInt(id));
        if (!equipo) {
          alert('Equipo no encontrado');
          navigate('/');
          return;
        }

        setNombreEquipo(equipo.nombre);

        const equipoMapeado = equipo.pokemons.map(p => {
          const tipoObj = tiposRes.data.find(t => t.id === p.tipoId);
          return {
            ...p,
            tipo: tipoObj ? tipoObj.nombre : 'Desconocido',
            evHp: p.evHp ?? 0,
            evAtk: p.evAtk ?? 0,
            evDef: p.evDef ?? 0,
            evSpAtk: p.evSpAtk ?? 0,
            evSpDef: p.evSpDef ?? 0,
            evSpeed: p.evSpeed ?? 0,
            ivHp: p.ivHp ?? 0,
            ivAtk: p.ivAtk ?? 0,
            ivDef: p.ivDef ?? 0,
            ivSpAtk: p.ivSpAtk ?? 0,
            ivSpDef: p.ivSpDef ?? 0,
            ivSpeed: p.ivSpeed ?? 0,
            poder1Id: p.poder1Id ?? p.poder1?.id ?? '',
            poder2Id: p.poder2Id ?? p.poder2?.id ?? '',
            poder3Id: p.poder3Id ?? p.poder3?.id ?? ''
          };
        });

        setMiEquipo(equipoMapeado);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, [id, token, navigate]);

  const agregarPokemon = (pokemon) => {
    if (miEquipo.length >= 6) return alert('Máximo 6 Pokémon por equipo');

    const tipoObj = tipos.find(t => t.id === pokemon.tipoId);
    const tipoNombre = tipoObj ? tipoObj.nombre : 'Desconocido';

    setMiEquipo([...miEquipo, {
      id: pokemon.id,
      nombre: pokemon.nombre,
      imagen: pokemon.imagen,
      tipoId: pokemon.tipoId,
      tipo: tipoNombre,
      poderU: pokemon.poderU,
      poder1Id: '',
      poder2Id: '',
      poder3Id: '',
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
    updated[index][field] = field === "nombre" ? value : Number(value);
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
      await api.put(`/equipos/${id}`, {
        nombre: nombreEquipo,
        pokemons: miEquipo
      }, {
        headers: { Authorization: token }
      });

      alert('Equipo editado correctamente');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Error al editar el equipo');
    }
  };

  return (
    <div className="crear-equipo-container">
      <h2>Editar Equipo Pokémon</h2>
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

        {/* ✅ Buscador de Pokémon por nombre */}
        <div className="buscador-pokemon-section">
          <h4>Buscar Pokémon por nombre</h4>
          <BuscadorPokemon onSeleccionar={agregarPokemon} />
        </div>

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

        <button type="submit" className="guardar-equipo-btn">Guardar Cambios</button>
      </form>
    </div>
  );
}
