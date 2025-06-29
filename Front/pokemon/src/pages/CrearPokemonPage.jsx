import { useState, useEffect } from 'react';
import api from '../api/api';
import '../styles/CrearPokemonPage.scss';

export default function CrearPokemonPage() {
  const [nombre, setNombre] = useState('');
  const [hp, setHp] = useState('');
  const [attack, setAttack] = useState('');
  const [defense, setDefense] = useState('');
  const [spAtk, setSpAtk] = useState('');
  const [spDef, setSpDef] = useState('');
  const [speed, setSpeed] = useState('');
  const [imagen, setImagen] = useState(null);
  const [tipos, setTipos] = useState([]);
  const [poderesUnicos, setPoderesUnicos] = useState([]);
  const [tipoId, setTipoId] = useState('');
  const [poderU, setPoderU] = useState('');
  const [editId, setEditId] = useState(null);
  const [pokemonList, setPokemonList] = useState([]);

  const validarStat = (value) => {
    const num = Number(value);
    return Number.isInteger(num) && num >= 0 && num <= 100;
  };

  const cargarDatos = async () => {
    try {
      const [tiposRes, poderesRes, pokesRes] = await Promise.all([
        api.get('/tipos'),
        api.get('/poderes?esUnico=true'),
        api.get('/pokemon')
      ]);
      setTipos(tiposRes.data);
      setPoderesUnicos(poderesRes.data);
      setPokemonList(pokesRes.data);
    } catch (error) {
      console.error('Error cargando datos', error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const resetForm = () => {
    setNombre('');
    setHp('');
    setAttack('');
    setDefense('');
    setSpAtk('');
    setSpDef('');
    setSpeed('');
    setTipoId('');
    setPoderU('');
    setImagen(null);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipoId || !poderU) {
      alert('Debes seleccionar un tipo y un poder único');
      return;
    }

    if (
      !nombre.trim() ||
      !validarStat(hp) || !validarStat(attack) ||
      !validarStat(defense) || !validarStat(spAtk) ||
      !validarStat(spDef) || !validarStat(speed)
    ) {
      alert('Todos los campos deben estar completos y los stats entre 0 y 100');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('hp', hp);
      formData.append('attack', attack);
      formData.append('defense', defense);
      formData.append('spAtk', spAtk);
      formData.append('spDef', spDef);
      formData.append('speed', speed);
      formData.append('tipoId', tipoId);
      formData.append('poderU', poderU);
      if (imagen) formData.append('imagen', imagen);

      if (editId) {
        await api.put(`/pokemon/${editId}`, formData, {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Pokémon actualizado');
      } else {
        await api.post('/pokemon', formData, {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Pokémon creado');
      }

      resetForm();
      cargarDatos();
    } catch (error) {
      console.error(error);
      alert('Error al guardar el Pokémon');
    }
  };

  const handleEditar = (poke) => {
    setEditId(poke.id);
    setNombre(poke.nombre);
    setHp(poke.hp);
    setAttack(poke.attack);
    setDefense(poke.defense);
    setSpAtk(poke.spAtk);
    setSpDef(poke.spDef);
    setSpeed(poke.speed);
    setTipoId(poke.tipoId);
    setPoderU(poke.poderU);
    setImagen(null);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este Pokémon?')) return;
    try {
      await api.delete(`/pokemon/${id}`);
      alert('Eliminado');
      cargarDatos();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar Pokémon');
    }
  };

return (
  <div className="pokemon-crear-page">
    <div className="crear-pokemon-container">
      <h2>{editId ? 'Editar Pokémon' : 'Crear nuevo Pokémon'}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <select value={tipoId} onChange={(e) => setTipoId(e.target.value)} required>
          <option value="">Selecciona un tipo</option>
          {tipos.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
          ))}
        </select>

        <select value={poderU} onChange={(e) => setPoderU(e.target.value)} required>
          <option value="">Selecciona un poder único</option>
          {poderesUnicos.map((poder) => (
            <option key={poder.id} value={poder.nombre}>{poder.nombre}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="HP (0-100)"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Ataque (0-100)"
          value={attack}
          onChange={(e) => setAttack(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Defensa (0-100)"
          value={defense}
          onChange={(e) => setDefense(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Sp. Atk (0-100)"
          value={spAtk}
          onChange={(e) => setSpAtk(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Sp. Def (0-100)"
          value={spDef}
          onChange={(e) => setSpDef(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Velocidad (0-100)"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          required
        />
        <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files[0])}/>
        <button type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
      </form>
    </div>

    <div className="lista-pokemones">
      <h3>Pokémon existentes</h3>
      <ul>
        {pokemonList.map((poke) => (
          <li key={poke.id}>
            <span>{poke.nombre}</span>
            <button onClick={() => handleEditar(poke)}>Editar</button>
            <button className="eliminar" onClick={() => handleEliminar(poke.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

}
