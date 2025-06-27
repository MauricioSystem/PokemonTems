import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Navbar from '../components/Navbar';
import '../styles/HomePage.scss';

export default function HomePage() {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const res = await api.get('/equipos', {
          headers: { Authorization: token }
        });
        setEquipos(res.data);
      } catch (error) {
        console.error('Error al cargar equipos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipos();
  }, [token]);

  const handleCrearEquipo = () => {
    navigate('/crear-equipo');
  };

  const handleEditar = (equipoId) => {
    navigate(`/editar-equipo/${equipoId}`);
  };

  const handleEliminar = async (equipoId) => {
    if (!window.confirm('¿Estás seguro de eliminar este equipo?')) return;
    try {
      await api.delete(`/equipos/${equipoId}`, {
        headers: { Authorization: token }
      });
      setEquipos(equipos.filter(e => e.id !== equipoId));
    } catch (error) {
      console.error('Error al eliminar equipo:', error);
    }
  };

  return (
    <div className="home-container">
      <Navbar />
      <h1>Hola, {username} </h1>
      <p>Bienvenido al creador de equipos Pokémon. ¡Prepárate para armar tu mejor escuadrón!</p>

      {loading ? (
        <p>Cargando equipos...</p>
      ) : equipos.length === 0 ? (
        <p className="sin-equipos">Usuario sin equipos</p>
      ) : (
        <div className="equipos-grid">
          {equipos.map(equipo => (
            <div key={equipo.id} className="equipo-card">
              <h3>{equipo.nombre}</h3>
              <div className="pokemon-grid">
                {equipo.pokemons && equipo.pokemons.length > 0 ? (
                  equipo.pokemons.map(p => (
                    <div key={p.id} className="pokemon-item">
                      <img
                        src={p.imagen.startsWith('http') ? p.imagen : `http://localhost:3000${p.imagen}`}
                        alt={p.nombre}
                      />
                      <p>{p.nombre}</p>
                    </div>
                  ))
                ) : (
                  <p className="sin-pokemon">Equipo sin Pokémon</p>
                )}
              </div>
              <div className="equipo-actions">
                <button onClick={() => handleEditar(equipo.id)}>Editar equipo</button>
                <button onClick={() => handleEliminar(equipo.id)}>Eliminar equipo</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="crear-equipo-btn-container">
        <button onClick={handleCrearEquipo}>Crear nuevo equipo</button>
      </div>
    </div>
  );
}
