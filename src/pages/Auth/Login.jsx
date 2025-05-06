import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, resetError } from '../../redux/slices/authSlice';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from '../../routes/routes';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector(state => state.auth);

  // Redireccionar si el usuario ya está autenticado
  useEffect(() => {
    if (user) {
      navigate(PROTECTED_ROUTES.DASHBOARD);
    }
    return () => {
      // Limpiar errores al desmontar el componente
      dispatch(resetError());
    };
  }, [user, navigate, dispatch]);

  // Mostrar error de la API
  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // Validación básica
    if (!email || !password) {
      setFormError('Por favor complete todos los campos');
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Iniciar Sesión</h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to={PUBLIC_ROUTES.REGISTER} className="font-medium text-blue-600 hover:text-blue-500">
              Regístrate
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {formError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {formError}
            </div>
          )}

          <div className="rounded-md -space-y-px">
            <Input
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
            
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
            />
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;