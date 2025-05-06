import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/UI/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-6">
          <h2 className="mt-6 text-6xl font-extrabold text-blue-500">404</h2>
          <h3 className="mt-2 text-3xl font-bold text-gray-900">Página no encontrada</h3>
          <p className="mt-4 text-gray-600">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>
        
        <div>
          <Link to="/">
            <Button variant="primary" className="mx-auto">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;