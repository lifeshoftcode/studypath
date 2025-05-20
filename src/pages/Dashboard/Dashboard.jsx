import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getUserPensums } from '../../redux/slices/pensumSlice';
import { logoutUser } from '../../redux/slices/authSlice';
import Button from '../../components/UI/Button';
import { PROTECTED_ROUTES, ROUTE_MAPPINGS } from '../../routes/routes';
import { formatDate } from '../../utils/dateUtils';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { userPensums, isLoading, error } = useSelector(state => state.pensum);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      dispatch(getUserPensums());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Filtrar pensums por búsqueda
  const filteredPensums = searchTerm.trim() === '' 
    ? userPensums
    : userPensums.filter(p => 
        p.career.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            StudyPath
          </h1>
          
          <div className="flex items-center">
            <span className="mr-4 text-gray-600">Hola, {user?.displayName}</span>
            <Button onClick={handleLogout} variant="outline" size="small">
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Mis Planes de Estudio</h2>
          <div className="flex flex-wrap gap-2">
            <Link to={ROUTE_MAPPINGS[PROTECTED_ROUTES.SCHEDULE]}>
              <Button variant="outline" size="small">
                Horario de Clases
              </Button>
            </Link>
            <Link to={ROUTE_MAPPINGS[PROTECTED_ROUTES.SEARCH_PENSUMS]}>
              <Button variant="outline" size="small">
                Buscar Planes Públicos
              </Button>
            </Link>
            <Link to={ROUTE_MAPPINGS[PROTECTED_ROUTES.IMPORT_PENSUM]}>
              <Button variant="secondary" size="small">
                Importar JSON
              </Button>
            </Link>
            <Link to={ROUTE_MAPPINGS[PROTECTED_ROUTES.CREATE_PENSUM]}>
              <Button variant="primary" size="small">
                Crear Plan
              </Button>
            </Link>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar en mis planes de estudio..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Estado de carga */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-600">Cargando planes de estudio...</p>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Lista de pensums */}
        {!isLoading && !error && (
          <>
            {filteredPensums.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {searchTerm ? (
                  <p className="mt-2 text-gray-600">No se encontraron planes de estudio que coincidan con tu búsqueda.</p>
                ) : (
                  <>
                    <p className="mt-2 text-xl font-semibold text-gray-600">Aún no tienes planes de estudio</p>
                    <p className="mt-1 text-gray-500">Crea tu primer plan o busca planes públicos para empezar.</p>
                    <div className="mt-4">
                      <Link to={ROUTE_MAPPINGS[PROTECTED_ROUTES.CREATE_PENSUM]}>
                        <Button variant="primary">
                          Crear Nuevo Plan
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPensums.map((pensum) => (
                  <div key={pensum.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{pensum.career}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${pensum.isPublic ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {pensum.isPublic ? 'Público' : 'Privado'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{pensum.title}</p>
                      <p className="text-xs text-gray-500 mt-3">Facultad: {pensum.faculty}</p>

                      {/* Barra de progreso */}
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-500 h-2.5 rounded-full" 
                            style={{ width: `${calculateProgress(pensum)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">
                            Progreso: {calculateProgress(pensum)}%
                          </span>
                          <span className="text-xs text-gray-500">
                            Actualizado: {formatDate(pensum.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-3 flex justify-between">
                      <Link to={PROTECTED_ROUTES.PENSUM_TRACKING_WITH_ID(pensum.id)}>
                        <Button variant="primary" size="small">
                          Ver Seguimiento
                        </Button>
                      </Link>
                      <Link to={`${ROUTE_MAPPINGS[PROTECTED_ROUTES.EDIT_PENSUM].replace(':id', pensum.id)}`}>
                        <Button variant="secondary" size="small">
                          Editar
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

// Función auxiliar para calcular el progreso en porcentaje
const calculateProgress = (pensum) => {
  if (!pensum.progress) return 0;
  
  const totalSubjects = Object.keys(pensum.progress).length;
  if (totalSubjects === 0) return 0;
  
  const approvedSubjects = Object.values(pensum.progress).filter(
    status => status === 'approved'
  ).length;
  
  return Math.round((approvedSubjects / totalSubjects) * 100);
};

// Función auxiliar para formatear la fecha
export default Dashboard;