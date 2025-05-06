import { useState } from 'react';
import { generateRecommendations, testAI } from '../../services/ai/geminiService';
import Button from '../UI/Button';

/**
 * Componente para mostrar recomendaciones generadas por IA
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.pensumData - Datos del plan de estudios
 * @param {Object} props.progress - Progreso actual del estudiante
 */
function RecommendationsPanel({ pensumData, progress, userName = 'estudiante' }) {
  const [recommendations, setRecommendations] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateRecommendations(pensumData, progress);
      setRecommendations(result);
    } catch (err) {
      console.error('Error obteniendo recomendaciones:', err);
      setError('No se pudieron generar recomendaciones. Por favor, intenta más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAI = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await testAI(userName);
      setRecommendations(result);
    } catch (err) {
      console.error('Error probando IA:', err);
      setError('Error al conectar con el modelo de IA. Por favor, intenta más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Asistente académico IA
        </h2>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="small"
            onClick={handleTestAI}
            disabled={isLoading}
          >
            {isLoading ? 'Consultando...' : 'Consejos rápidos'}
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={handleGetRecommendations}
            disabled={isLoading || !pensumData}
          >
            {isLoading ? 'Generando...' : 'Obtener recomendaciones'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 text-red-700 text-sm">
          <p>{error}</p>
        </div>
      )}

      {recommendations ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="markdown prose" style={{ whiteSpace: 'pre-wrap' }}>
            {recommendations}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 text-center text-gray-500 rounded">
          <p>Utiliza la IA para obtener recomendaciones personalizadas basadas en tu progreso académico.</p>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        <p>Las recomendaciones son generadas por IA y deben ser validadas por un asesor académico.</p>
      </div>
    </div>
  );
}

export default RecommendationsPanel;