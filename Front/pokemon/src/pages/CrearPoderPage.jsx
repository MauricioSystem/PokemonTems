import { useState, useEffect } from 'react';
import api from '../api/api';
import '../styles/CrearPoderPage.scss';

export default function CrearPoderPage() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [esUnico, setEsUnico] = useState(false);
  const [pokemonBase, setPokemonBase] = useState('');
  const [pokemons] = useState([]);

  const [poderes, setPoderes] = useState([]);
  const [editPoderId, setEditPoderId] = useState(null);

  const [nombreItem, setNombreItem] = useState('');
  const [imagenItem, setImagenItem] = useState(null);
  const [items, setItems] = useState([]);
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      const [pRes, iRes] = await Promise.all([api.get('/poderes'), api.get('/items')]);
      setPoderes(pRes.data);
      setItems(iRes.data);
    };
    fetchAll();
  }, []);

  const handlePoderSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return alert('El nombre del poder es obligatorio');

    try {
      const token = localStorage.getItem('token');
      const body = { nombre, descripcion, esUnico, pokemonBase: esUnico ? pokemonBase : null };

      if (editPoderId) {
        await api.put(`/poderes/${editPoderId}`, body, { headers: { Authorization: token } });
        alert('Poder actualizado');
      } else {
        await api.post('/poderes', body, { headers: { Authorization: token } });
        alert('Poder creado');
      }

      const res = await api.get('/poderes');
      setPoderes(res.data);
      setNombre('');
      setDescripcion('');
      setEsUnico(false);
      setPokemonBase('');
      setEditPoderId(null);
    } catch (err) {
      console.error(err);
      alert('Error al guardar poder');
    }
  };

  const handleEditarPoder = (p) => {
    setEditPoderId(p.id);
    setNombre(p.nombre);
    setDescripcion(p.descripcion || '');
    setEsUnico(p.esUnico || false);
    setPokemonBase(p.pokemonBase || '');
  };

  const handleEliminarPoder = async (id) => {
    if (!confirm('¿Seguro de eliminar este poder?')) return;
    await api.delete(`/poderes/${id}`);
    setPoderes(poderes.filter(p => p.id !== id));
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    if (!nombreItem.trim()) return alert('Nombre obligatorio');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('nombre', nombreItem);
      if (imagenItem) formData.append('imagen', imagenItem);

      if (editItemId) {
        await api.put(`/items/${editItemId}`, formData, {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Item actualizado');
      } else {
        await api.post('/items', formData, {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Item creado');
      }

      const res = await api.get('/items');
      setItems(res.data);
      setNombreItem('');
      setImagenItem(null);
      setEditItemId(null);
    } catch (err) {
      console.error(err);
      alert('Error al guardar item');
    }
  };

  const handleEditarItem = (item) => {
    setEditItemId(item.id);
    setNombreItem(item.nombre);
    setImagenItem(null); 
  };

  const handleEliminarItem = async (id) => {
    if (!confirm('¿Seguro de eliminar este item?')) return;
    await api.delete(`/items/${id}`);
    setItems(items.filter(i => i.id !== id));
  };

return (
  <div className="crear-poder-page">
    <div className="contenedor-principal">

      <div className="lista lista-poderes">
        <h3>Poderes</h3>
        <ul>
          {poderes.map(p => (
            <li key={p.id}>
              {p.nombre}
              <div>
                <button onClick={() => handleEditarPoder(p)}>Editar</button>
                <button onClick={() => handleEliminarPoder(p.id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="form-section">
        <h2>{editPoderId ? 'Editar Poder' : 'Crear nuevo Poder'}</h2>
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
          <label>
            <input
              type="checkbox"
              checked={esUnico}
              onChange={(e) => setEsUnico(e.target.checked)}
            />
            Poder único
          </label>
          {esUnico && (
            <select value={pokemonBase} onChange={(e) => setPokemonBase(e.target.value)}>
              <option value="">Seleccione un Pokémon</option>
              {pokemons.map((p) => (
                <option key={p.id} value={p.nombre}>{p.nombre}</option>
              ))}
            </select>
          )}
          <button type="submit">{editPoderId ? 'Actualizar' : 'Crear'} Poder</button>
        </form>

        <h2>{editItemId ? 'Editar Item' : 'Crear nuevo Item'}</h2>
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
          <button type="submit">{editItemId ? 'Actualizar' : 'Crear'} Item</button>
        </form>
      </div>


      <div className="lista lista-items">
        <h3>Items</h3>
        <ul>
          {items.map(i => (
            <li key={i.id}>
              {i.nombre}
              <div>
                <button onClick={() => handleEditarItem(i)}>Editar</button>
                <button onClick={() => handleEliminarItem(i.id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  </div>
);
}