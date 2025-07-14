import { useState, useEffect } from 'react';
import api from '../api/api';
import '../styles/BuscadorPokemon.scss';

export default function BuscadorPokemon({ onSeleccionar }) {
  const [nombre, setNombre] = useState('');
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (nombre.trim()) {
        api.get(`/pokemon/buscar/nombre?nombre=${nombre}`)
          .then(res => setResultados(res.data))
          .catch(() => setResultados([]));
      } else {
        setResultados([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [nombre]);

  return (
    <div className="buscador-pokemon">
      <input
        type="text"
        placeholder="Pon el nombre del Pokémon"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <div className="resultados">
        {resultados.map(p => (
          <div key={p.id} className="resultado-card" onClick={() => onSeleccionar(p)}>
            <img
              src={p.imagen.startsWith('http') ? p.imagen : `http://localhost:3000${p.imagen}`}
              alt={p.nombre}
            />
            <p>{p.nombre}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
