import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { user } = useSelector(state => state.auth);

  // Si el usuario no está autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está autenticado, renderizar las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;