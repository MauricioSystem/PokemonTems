import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.scss';

export default function Navbar() {
//const username = localStorage.getItem('username');
const isAdmin = localStorage.getItem('esAdmin') === 'true';
const navigate = useNavigate();


const handleLogout = () => {
localStorage.clear();
navigate('/login');
};

const handleIrUsuarios = () => {
    navigate('/Usuarios');
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
        {isAdmin && (
          <>
            <button onClick={handleCrearPokemon}>Crear Pokémon</button>
            <button onClick={handleCrearPoder}>Crear Poder</button>
            <button onClick={handleIrUsuarios}>Usuarios</button>
          </>
        )}
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </nav>
  );
}