import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { setUser } from './redux/slices/authSlice';
import { PUBLIC_ROUTES, PROTECTED_ROUTES, ROUTE_MAPPINGS } from './routes/routes';

// Rutas protegidas
import ProtectedRoute from './routes/ProtectedRoute';

// Páginas públicas
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import NotFound from './pages/NotFound/NotFound';

// Páginas protegidas
import Dashboard from './pages/Dashboard/Dashboard';
import PensumView from './pages/Pensum/PensumView';
import AISettings from './pages/AISettings/AISettings';
import CreatePensum from './pages/Pensum/CreatePensum';
import EditPensum from './pages/Pensum/EditPensum';
import ImportPensum from './pages/Pensum/ImportPensum';

function App() {
  const dispatch = useDispatch();

  // Observer para el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Usuario autenticado
        dispatch(setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || currentUser.email.split('@')[0],
        }));
      } else {
        // Usuario no autenticado
        dispatch(setUser(null));
      }
    });

    // Limpiar el observer al desmontar
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path={PUBLIC_ROUTES.LOGIN} element={<Login />} />
        <Route path={PUBLIC_ROUTES.REGISTER} element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path={PROTECTED_ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={PROTECTED_ROUTES.PENSUM_TRACKING} element={<PensumView />} />
          <Route path={PROTECTED_ROUTES.AI_SETTINGS} element={<AISettings />} />
          
          {/* Route mappings for Spanish URLs with English internal names */}
          <Route path={ROUTE_MAPPINGS[PROTECTED_ROUTES.CREATE_PENSUM]} element={<CreatePensum />} />
          <Route path={ROUTE_MAPPINGS[PROTECTED_ROUTES.EDIT_PENSUM]} element={<EditPensum />} />
          <Route path={ROUTE_MAPPINGS[PROTECTED_ROUTES.IMPORT_PENSUM]} element={<ImportPensum />} />
          <Route path={ROUTE_MAPPINGS[PROTECTED_ROUTES.SEARCH_PENSUMS]} element={<NotFound />} />
          
          {/* Rutas internas en inglés para acceso programático */}
          <Route path={PROTECTED_ROUTES.IMPORT_PENSUM} element={<ImportPensum />} />
        </Route>
        
        {/* Default route - redirects to dashboard if authenticated or login if not */}
        <Route path={PUBLIC_ROUTES.HOME} element={<Navigate to={PROTECTED_ROUTES.DASHBOARD} />} />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
