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


  const validarStat = (value) => {
    const num = Number(value);
    return Number.isInteger(num) && num >= 0 && num <= 100;
  };

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const res = await api.get('/tipos');
        setTipos(res.data);
      } catch (error) {
        console.error('Error cargando tipos', error);
      }
    };

    const fetchPoderesUnicos = async () => {
      try {
        const res = await api.get('/poderes?esUnico=true');
        setPoderesUnicos(res.data);
      } catch (error) {
        console.error('Error cargando poderes únicos', error);
      }
    };

    fetchTipos();
    fetchPoderesUnicos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipoId) {
      alert('Debes seleccionar un tipo');
      return;
    }
    if (!poderU) {
      alert('Debes seleccionar un poder único');
      return;
    }
    if (
      !nombre.trim() ||
      !validarStat(hp) ||
      !validarStat(attack) ||
      !validarStat(defense) ||
      !validarStat(spAtk) ||
      !validarStat(spDef) ||
      !validarStat(speed)
    ) {
      alert('Por favor, ingresa un nombre válido y stats entre 0 y 100.');
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

      await api.post('/pokemon', formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Pokémon creado con éxito!');
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
    } catch (error) {
      console.error(error);
      alert('Error al crear Pokémon');
    }
  };

  return (
    <div className="crear-pokemon-container">
      <h2>Crear nuevo Pokémon</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <select
          value={tipoId}
          onChange={(e) => setTipoId(e.target.value)}
          required
        >
          <option value="">Selecciona un tipo</option>
          {tipos.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </option>
          ))}
        </select>

        <select
          value={poderU}
          onChange={(e) => setPoderU(e.target.value)}
          required
        >
          <option value="">Selecciona un poder único</option>
          {poderesUnicos.map((poder) => (
            <option key={poder.id} value={poder.nombre}>
              {poder.nombre}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="HP (0-100)"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          min="0"
          max="100"
          required
        />
        <input
          type="number"
          placeholder="Ataque (0-100)"
          value={attack}
          onChange={(e) => setAttack(e.target.value)}
          min="0"
          max="100"
          required
        />
        <input
          type="number"
          placeholder="Defensa (0-100)"
          value={defense}
          onChange={(e) => setDefense(e.target.value)}
          min="0"
          max="100"
          required
        />
        <input
          type="number"
          placeholder="Sp. Atk (0-100)"
          value={spAtk}
          onChange={(e) => setSpAtk(e.target.value)}
          min="0"
          max="100"
          required
        />
        <input
          type="number"
          placeholder="Sp. Def (0-100)"
          value={spDef}
          onChange={(e) => setSpDef(e.target.value)}
          min="0"
          max="100"
          required
        />
        <input
          type="number"
          placeholder="Velocidad (0-100)"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          min="0"
          max="100"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
        />

        <button type="submit">Crear</button>
      </form>
    </div>
  );
}
