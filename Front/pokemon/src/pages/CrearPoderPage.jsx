import { useState, useEffect } from 'react';
import api from '../api/api';
import '../styles/CrearPoderPage.scss';

export default function CrearPoderPage() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [esUnico, setEsUnico] = useState(false);
  const [pokemonBase, setPokemonBase] = useState('');
  const [setPokemons] = useState([]);

  const [nombreItem, setNombreItem] = useState('');
  const [imagenItem, setImagenItem] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await api.get('/pokemon');
        setPokemons(res.data);
      } catch (error) {
        console.error('Error al cargar Pokémon:', error);
      }
    };
    if (esUnico) {
      fetchPokemons();
    }
  }, [esUnico, setPokemons]);

  const handlePoderSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert('El nombre del poder es obligatorio');
      return;
    }

    if (esUnico && !pokemonBase) {
      alert('Selecciona un Pokémon base para el poder único');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/poderes',
        { nombre, descripcion, esUnico, pokemonBase: esUnico ? pokemonBase : null },
        {
          headers: { Authorization: token }
        }
      );
      alert('Poder creado con éxito!');
      setNombre('');
      setDescripcion('');
      setEsUnico(false);
      setPokemonBase('');
    } catch (error) {
      console.error(error);
      alert('Error al crear poder');
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();

    if (!nombreItem.trim()) {
      alert('El nombre del item es obligatorio');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('nombre', nombreItem);
      if (imagenItem) formData.append('imagen', imagenItem);

      await api.post('/items', formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Item creado con éxito!');
      setNombreItem('');
      setImagenItem(null);
    } catch (error) {
      console.error(error);
      alert('Error al crear item');
    }
  };

  return (
    <div className="crear-poder-container">
      <h2>Crear nuevo Poder</h2>
      <form onSubmit={handlePoderSubmit}>
        <input
          type="text"
          placeholder="Nombre del poder"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <button type="submit">Crear Poder</button>
      </form>

      <h2>Crear nuevo Item</h2>
      <form onSubmit={handleItemSubmit}>
        <input
          type="text"
          placeholder="Nombre del item"
          value={nombreItem}
          onChange={(e) => setNombreItem(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagenItem(e.target.files[0])}
        />
        <button type="submit">Crear Item</button>
      </form>
    </div>
  );
}
