import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/api';
import '../styles/Navbar.scss';

export default function Navbar() {
const username = localStorage.getItem('username');
const isAdmin = localStorage.getItem('esAdmin') === 'true';
const token = localStorage.getItem('token');
const navigate = useNavigate();

const [usuarios, setUsuarios] = useState([]);
const [showDropdown, setShowDropdown] = useState(false);

useEffect(() => {
if (isAdmin) {
fetchUsuarios();
}
}, [isAdmin]);

const fetchUsuarios = async () => {
try {
const res = await api.get('/auth/all', {
headers: {
Authorization: token
}
});
setUsuarios(res.data);
} catch (error) {
console.error('Error al cargar usuarios:', error);
}
};

const handleToggleAdmin = async (id) => {
try {
await api.put(`/auth/${id}/toggle-admin`, {}, {
  headers: {
    Authorization: token
  }
});

fetchUsuarios();
} catch (error) {
console.error('Error al cambiar rol:', error);
}
};

const handleLogout = () => {
localStorage.clear();
navigate('/login');
};

const handleCrearPokemon = () => {
navigate('/crear-pokemon');
};

const handleCrearPoder = () => {
navigate('/crear-poder');
};

return (
  <nav className="navbar">
    <div className="logo">Poké-Miauricio</div>
    <div className="nav-links">
      <span className="username">Hola, {username}</span>
      {isAdmin && (
        <>
          <button onClick={handleCrearPokemon}>Crear Pokémon</button>
          <button onClick={handleCrearPoder}>Crear Poder</button>
          <div className="dropdown-container">
            <button onClick={() => setShowDropdown(!showDropdown)}>
              Usuarios
            </button>
            {showDropdown && (
              <div className="dropdown-list">
                {usuarios.map((u) => (
                  <div key={u.id} className="dropdown-item">
                    <span>{u.username}</span>
                    <label>
                      <input
                        type="checkbox"
                        checked={u.esAdmin}
                        onChange={() => handleToggleAdmin(u.id, !u.esAdmin)}
                      />
                      Admin
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  </nav>
);
}