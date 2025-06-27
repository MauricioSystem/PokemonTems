/* eslint-disable no-unused-vars */
import { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginPage.scss';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('username', res.data.username);
    localStorage.setItem('esAdmin', res.data.esAdmin); 
    navigate('/');
  } catch (error) {
    alert('Credenciales incorrectas');
  }
};

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
        <button type="submit">Entrar</button>
        <p>¿No tienes cuenta? <Link to="/register">Registrarse</Link></p>
      </form>
    </div>
  );
}
