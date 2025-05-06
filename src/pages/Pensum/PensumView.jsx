import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPensumById, updatePensumProgress } from '../../redux/slices/pensumSlice';
import Header from '../../components/Header/Header';
import Select from '../../components/UI/Select';
import Button from '../../components/UI/Button';
import StatusIndicator from '../../components/UI/StatusIndicator';
import RecommendationsPanel from '../../components/AI/RecommendationsPanel';
import { PROTECTED_ROUTES } from '../../routes/routes';
import { calculateStats, calculateTermProgress, arePrerequisitesMet } from '../../utils/pensumUtils';
import { SUBJECT_STATUS } from '../../data/models';

function PensumView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPensum, isLoading, error } = useSelector(state => state.pensum);
  
  // Estado para almacenar el progreso del estudiante
  const [progress, setProgress] = useState({});
  const [stats, setStats] = useState({
    approvedCredits: 0,
    totalCredits: 0,
    progressPercentage: 0,
    approvedSubjects: 0,
    totalSubjects: 0
  });
  
  // Estado para el cuatrimestre seleccionado
  const [selectedTerm, setSelectedTerm] = useState(1);

  // Actualizar estadísticas de progreso
  const updateStats = useCallback((currentProgress, pensum = currentPensum) => {
    if (!pensum || !pensum.terms) return;
    
    const statsData = calculateStats(pensum, currentProgress);
    setStats(statsData);
  }, [currentPensum]);

  // Cargar pensum y progreso
  useEffect(() => {
    if (id) {
      dispatch(getPensumById(id));
    }
  }, [dispatch, id]);

  // Inicializar datos cuando se carga el pensum
  useEffect(() => {
    if (currentPensum) {
      const initialProgress = currentPensum.progress || {};
      setProgress(initialProgress);
      updateStats(initialProgress, currentPensum);
    }
  }, [currentPensum, updateStats]);

  // Manejar el cambio de estado de una asignatura
  const handleSubjectChange = (code, event) => {
    const newStatus = event.target.value;
    const newProgress = { ...progress, [code]: newStatus };
    
    setProgress(newProgress);
    dispatch(updatePensumProgress({ pensumId: id, progress: newProgress }));
    updateStats(newProgress);
  };

  // Obtener estadísticas de progreso para un término específico
  const getTermProgressStats = (term) => {
    if (!term || !term.subjects) return { approved: 0, total: 0, percentage: 0 };
    
    const termProgressPercentage = calculateTermProgress(term, progress);
    const approved = term.subjects.filter(s => progress[s.code] === SUBJECT_STATUS.APPROVED).length;
    
    return {
      approved,
      total: term.subjects.length,
      percentage: termProgressPercentage
    };
  };

  // Verificar si una asignatura tiene prerrequisitos aprobados (solo informativo)
  const hasCompletedPrerequisites = (subject) => {
    return arePrerequisitesMet(subject, progress);
  };

  // Función para determinar el color basado en el porcentaje de completitud
  const getProgressColor = (percentage) => {
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-green-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-red-400';
  };

  // Si está cargando, mostrar indicador
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Cargando plan de estudios...</p>
        </div>
      </div>
    );
  }

  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button variant="primary" onClick={() => navigate(PROTECTED_ROUTES.DASHBOARD)}>
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Si no hay pensum, mostrar mensaje
  if (!currentPensum || !currentPensum.terms) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Plan no encontrado</h2>
          <p className="text-gray-600 mb-6">No se ha encontrado el plan de estudios solicitado.</p>
          <Button variant="primary" onClick={() => navigate(PROTECTED_ROUTES.DASHBOARD)}>
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Obtener el cuatrimestre actual seleccionado
  const currentTerm = currentPensum.terms.find(term => term.number === selectedTerm) || currentPensum.terms[0];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 font-sans">
      {/* Header con navegación */}
      <header className="bg-white shadow mb-6 rounded-lg">
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {currentPensum.career}
          </h1>
          <Button 
            onClick={() => navigate(PROTECTED_ROUTES.DASHBOARD)}
            variant="outline"
            size="small"
          >
            Volver al Dashboard
          </Button>
        </div>
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-600">{currentPensum.title} - {currentPensum.faculty}</p>
        </div>
      </header>

      {/* Dashboard con estadísticas y navegación de cuatrimestres */}
      <div className="mb-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Navegación por píldoras para cuatrimestres - ocupa 8/12 */}
          <div className="col-span-12 md:col-span-8 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-sm font-bold mb-3 text-gray-700">Cuatrimestres:</h2>
            <div className="flex flex-wrap gap-3">
              {currentPensum.terms.map((term) => {
                const termProgress = getTermProgressStats(term);
                const progressColor = getProgressColor(termProgress.percentage);
                
                return (
                  <button
                    key={term.number}
                    onClick={() => setSelectedTerm(term.number)}
                    className={`relative group`}
                    title={term.name}
                  >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-medium transition-transform duration-200 ${
                      selectedTerm === term.number
                        ? `${progressColor} ring-2 ring-offset-2 ring-blue-300 scale-110`
                        : `${progressColor} hover:scale-105`
                    }`}>
                      {term.number}
                    </div>
                    <div className="mt-1 text-xs text-center font-medium text-gray-600">
                      ({termProgress.percentage}%)
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Estadísticas - ocupan 4/12 */}
          <div className="col-span-12 md:col-span-4 grid grid-cols-3 gap-2">
            <div className="bg-white rounded-lg p-2 shadow-sm flex flex-col items-center justify-center">
              <div className="text-xl font-bold text-blue-500">{stats.progressPercentage}%</div>
              <div className="text-xs text-gray-500">Avance</div>
            </div>
            <div className="bg-white rounded-lg p-2 shadow-sm flex flex-col items-center justify-center">
              <div className="text-xl font-bold text-blue-500">{stats.approvedCredits}/{stats.totalCredits}</div>
              <div className="text-xs text-gray-500">Créditos</div>
            </div>
            <div className="bg-white rounded-lg p-2 shadow-sm flex flex-col items-center justify-center">
              <div className="text-xl font-bold text-blue-500">{stats.approvedSubjects}/{stats.totalSubjects}</div>
              <div className="text-xs text-gray-500">Materias</div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de recomendaciones de IA */}
      <div className="mb-6">
        <RecommendationsPanel 
          pensumData={currentPensum} 
          progress={progress}
          userName={currentPensum.student?.name || "estudiante"}
        />
      </div>

      {/* Mostrar solo el cuatrimestre seleccionado */}
      <div className="mb-6 border border-gray-200 rounded-lg shadow-sm bg-white">
        <div className="bg-blue-500 text-white p-3 font-bold flex justify-between items-center rounded-t-lg">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            {currentTerm.name}
          </div>
          <div className="flex items-center text-sm">
            <Button 
              variant="minimal" 
              size="small"
              className="text-white mr-1"
              onClick={() => setSelectedTerm(prevTerm => Math.max(1, prevTerm - 1))}
              disabled={selectedTerm <= 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </Button>
            <Button 
              variant="minimal" 
              size="small"
              className="text-white"
              onClick={() => setSelectedTerm(prevTerm => Math.min(currentPensum.terms.length, prevTerm + 1))}
              disabled={selectedTerm >= currentPensum.terms.length}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        </div>
        
        <div className="p-2 flex justify-between items-center border-b">
          {(() => {
            const termProgress = getTermProgressStats(currentTerm);
            return (
              <div className="flex items-center w-full">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mr-3">
                  <div 
                    className={`h-full ${termProgress.percentage === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                    style={{ width: `${termProgress.percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm font-medium whitespace-nowrap">
                  {termProgress.approved}/{termProgress.total} ({termProgress.percentage}%)
                </div>
              </div>
            );
          })()}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase">
                <th className="text-left p-3 border-b border-gray-200">Código</th>
                <th className="text-left p-3 border-b border-gray-200">Asignatura</th>
                <th className="text-left p-3 border-b border-gray-200">Créditos</th>
                <th className="text-center p-3 border-b border-gray-200">Estado</th>
              </tr>
            </thead>
            <tbody>
              {currentTerm.subjects.map((subject) => {
                const status = progress[subject.code] || SUBJECT_STATUS.PENDING;
                const prerequisitesCompleted = hasCompletedPrerequisites(subject);
                
                const statusOptions = [
                  { value: SUBJECT_STATUS.PENDING, label: 'Pendiente' },
                  { value: SUBJECT_STATUS.IN_PROGRESS, label: 'Cursando' },
                  { value: SUBJECT_STATUS.APPROVED, label: 'Aprobada' },
                  { value: SUBJECT_STATUS.FAILED, label: 'Reprobada' }
                ];
                
                return (
                  <tr key={subject.code} className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                    <td className="p-3 text-sm">{subject.code}</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <StatusIndicator status={status} size="small" />
                        <span className="mr-2 text-sm">{subject.name}</span>
                        {!prerequisitesCompleted && status !== SUBJECT_STATUS.PENDING && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full">
                            Prereq. pendientes
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-sm">{subject.credits}</td>
                    <td className="p-3 text-center">
                      <div className="inline-block w-32">
                        <Select 
                          value={status}
                          onChange={(e) => handleSubjectChange(subject.code, e)}
                          options={statusOptions}
                          variant="secondary"
                          className="text-sm"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PensumView;