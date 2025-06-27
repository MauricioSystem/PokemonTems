import { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/RegisterPage.scss';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { username, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      navigate('/');
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Error al registrar');
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Crear cuenta</h2>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
        <button type="submit">Registrarse</button>
        <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </form>
    </div>
  );
}
