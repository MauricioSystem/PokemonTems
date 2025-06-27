
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('esAdmin') === 'true';

  if (!token || !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
}
