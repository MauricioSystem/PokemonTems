import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.scss';

export default function Navbar() {
  const username = localStorage.getItem('username');
  const isAdmin = localStorage.getItem('esAdmin') === 'true';
  const navigate = useNavigate();

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
      <div className="logo">PokéBuilder</div>
      <div className="nav-links">
        <span className="username">Hola, {username}</span>
        {isAdmin && (
          <>
            <button onClick={handleCrearPokemon} className="crear-pokemon-btn">
              Crear Pokémon
            </button>
            <button onClick={handleCrearPoder} className="crear-poder-btn">
              Crear Poder
            </button>
          </>
        )}
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </nav>
  );
}
