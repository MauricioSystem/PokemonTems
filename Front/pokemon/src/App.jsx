import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CrearPokemonPage from './pages/CrearPokemonPage'; 
import CrearPoderPage from './pages/CrearPoderPage';
import CrearEquipoPage from './pages/CrearEquipoPage'; 
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <BrowserRouter>
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

        <Route path="/crear-equipo" element={<CrearEquipoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
