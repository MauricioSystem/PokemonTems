import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CrearPokemonPage from './pages/CrearPokemonPage'; 
import CrearPoderPage from './pages/CrearPoderPage';
import CrearEquipoPage from './pages/CrearEquipoPage'; 
import AdminRoute from './components/AdminRoute';
import EditarEquipoPage from './pages/EditarEquipoPage';
import UsuariosPage from './pages/UsuariosPage';
import AudioPlayer from './components/AudioPlayer';

function App() {
  return (
    <BrowserRouter>
      <AudioPlayer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/crear-pokemon" element={
          <AdminRoute>
            <CrearPokemonPage />
          </AdminRoute>
        } />
  
        <Route path="/crear-poder" element={
          <AdminRoute>
            <CrearPoderPage />
          </AdminRoute>
        } />
        <Route path="/Usuarios" element={
          <AdminRoute>
            <UsuariosPage />
          </AdminRoute>
        } />

        <Route path="/crear-equipo" element={<CrearEquipoPage />} />
        <Route path="/editar-equipo/:id" element={<EditarEquipoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
