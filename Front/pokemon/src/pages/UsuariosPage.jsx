import { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import '../styles/UsuariosPage.scss';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [passwords, setPasswords] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await api.get('/auth/all', {
        headers: { Authorization: token }
      });
      setUsuarios(res.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleToggleAdmin = async (id) => {
    try {
      await api.put(`/auth/${id}/toggle-admin`, {}, {
        headers: { Authorization: token }
      });
      fetchUsuarios();
    } catch (error) {
      console.error('Error al cambiar rol:', error);
    }
  };

  const handlePasswordChange = (id, value) => {
    setPasswords({ ...passwords, [id]: value });
  };

  const handleActualizarPassword = async (id) => {
  const nueva = passwords[id];
  if (!nueva || nueva.length < 4) {
    alert('La nueva contraseña debe tener al menos 4 caracteres');
    return;
  }

  try {
    await api.put(`/auth/${id}/cambiar-password`, {
      nuevaPassword: nueva
    }, {
      headers: { Authorization: token }
    });
    alert('Contraseña actualizada');
    setPasswords({ ...passwords, [id]: '' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    alert('Error al actualizar contraseña');
  }
};


  return (
    <>
      <div className="usuarios-container">
        <Navbar />
        <h2>Gestión de Usuarios</h2>
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Admin</th>
              <th>Nueva contraseña</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={u.esAdmin}
                    onChange={() => handleToggleAdmin(u.id)}
                  />
                </td>
                <td>
                  <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={passwords[u.id] || ''}
                    onChange={(e) => handlePasswordChange(u.id, e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => handleActualizarPassword(u.id)}>
                    Cambiar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
