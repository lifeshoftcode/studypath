
// Configurando una instancia de Genkit con la API key desde variables de entorno
const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY || '';
const endpoint = 'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText';

// Crear la instancia de genkit solo si tenemos una API key
/**
 * Llamada genérica a la Generative AI API
 * @param {string} prompt - Text prompt a enviar
 * @returns {Promise<string>} - Texto generado
 */

async function fetchGenerate(prompt) {

    const url = `${endpoint}?key=${apiKey}`;
    const body = {
        prompt: { text: prompt },
        temperature: 0.7,
        maxOutputTokens: 256
    };
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(`Error ${res.status}: ${err.error.message}`);
    }
    const { candidates } = await res.json();
    return candidates[0].output;
}

/**
 * Genera recomendaciones personalizadas para el estudiante basadas en su progreso
 * @param {Object} pensumData - Datos del plan de estudios
 * @param {Object} progress - Progreso actual del estudiante
 * @returns {Promise<string>} - Recomendaciones personalizadas
 */
export const generateRecommendations = async (pensumData, progress) => {
    try {
        if (!apiKey) {
            return "Se requiere una API key de Google AI para usar esta funcionalidad. Configúrala en la sección de configuración de IA.";
        }

        // Formatear datos para enviar al modelo
        const completedCourses = Object.entries(progress)
            .filter(([_, status]) => status === 'approved')
            .map(([code]) => code);

        const inProgressCourses = Object.entries(progress)
            .filter(([_, status]) => status === 'inProgress')
            .map(([code]) => code);

        // Crear un prompt para el modelo
        const prompt = `
      Como consejero académico, analiza el progreso del estudiante en su plan de estudios y proporciona recomendaciones personalizadas.
      
      Plan de estudios: ${pensumData.career} - ${pensumData.title}
      Facultad: ${pensumData.faculty}
      
      Asignaturas aprobadas: ${completedCourses.join(', ')}
      Asignaturas en curso: ${inProgressCourses.join(', ')}
      
      Basándote en el progreso actual del estudiante:
      1. Recomienda cuáles deberían ser las próximas asignaturas a cursar
      2. Identifica áreas donde el estudiante podría necesitar reforzamiento
      3. Sugiere estrategias para optimizar su progreso académico
      
      Proporciona recomendaciones concisas y personalizadas en forma de lista.
    `;

        // Hacemos la solicitud directamente para evitar problemas con AsyncLocalStorage
        const { text } = await fetchGenerate(prompt);
        return text;
    } catch (error) {
        console.error('Error generando recomendaciones:', error);
        return 'No se pudieron generar recomendaciones en este momento. Por favor, intenta más tarde.';
    }
};

/**
 * Analiza el patrón de aprendizaje del estudiante basado en su progreso
 * @param {Object} progress - Progreso actual del estudiante
 * @returns {Promise<string>} - Análisis del patrón de aprendizaje
 */
export const analyzeLearningPattern = async (progress) => {
    try {
        if (!apiKey) {
            return "Se requiere una API key de Google AI para usar esta funcionalidad.";
        }

        const prompt = `
      Como experto en análisis de datos educativos, examina el siguiente progreso académico
      y proporciona un análisis sobre los patrones de aprendizaje del estudiante.
      
      Progreso académico: ${JSON.stringify(progress)}
      
      Analiza:
      1. Ritmo de avance académico
      2. Áreas de fortaleza y debilidad
      3. Posibles estrategias para mejorar el rendimiento académico
      
      Proporciona un análisis conciso en forma de párrafos cortos.
    `;

        const { text } = await fetchGenerate(prompt);
        return text;
    } catch (error) {
        console.error('Error analizando patrón de aprendizaje:', error);
        return 'No se pudo analizar el patrón de aprendizaje en este momento. Por favor, intenta más tarde.';
    }
};

/**
 * Genera un plan de estudio personalizado para el próximo período académico
 * @param {Object} pensumData - Datos del plan de estudios
 * @param {Object} progress - Progreso actual del estudiante
 * @returns {Promise<string>} - Plan de estudio para el próximo período
 */
export const generateStudyPlan = async (pensumData, progress) => {
    try {
        if (!apiKey) {
            return "Se requiere una API key de Google AI para usar esta funcionalidad.";
        }

        // Formatear datos relevantes
        const terms = pensumData.terms.map(term => ({
            number: term.number,
            name: term.name,
            subjects: term.subjects.map(subject => ({
                code: subject.code,
                name: subject.name,
                credits: subject.credits,
                status: progress[subject.code] || 'pending',
                prerequisites: subject.prerequisites || []
            }))
        }));

        const prompt = `
      Como planificador académico, genera un plan de estudio personalizado para el próximo período académico
      basado en el progreso actual del estudiante.
      
      Datos del plan de estudios: ${JSON.stringify(terms)}
      
      Considerando:
      1. Asignaturas pendientes y sus prerrequisitos
      2. Distribución óptima de créditos académicos
      3. Secuencia lógica de materias
      
      Genera un plan de estudio recomendado para el próximo período académico, indicando:
      1. Asignaturas a cursar
      2. Justificación de cada selección
      3. Total de créditos recomendados
      
      Proporciona el plan en formato estructurado y fácil de leer.
    `;

        const { text } = await fetchGenerate(prompt);
        return text;
    } catch (error) {
        console.error('Error generando plan de estudio:', error);
        return 'No se pudo generar el plan de estudio en este momento. Por favor, intenta más tarde.';
    }
};

/**
 * Función simple para probar la conexión con el modelo de IA
 * @param {string} name - Nombre del usuario para personalizar la respuesta
 * @returns {Promise<string>} - Respuesta del modelo
 */
export const testAI = async (name) => {
    try {
        if (!apiKey) {
            return "Se requiere una API key de Google AI para usar esta funcionalidad. Por favor, configúrala en la sección de configuración de IA.";
        }

        // Usamos la generación directa sin flows para evitar problemas con AsyncLocalStorage
        const prompt = `Hola Gemini, mi nombre es ${name} y estoy usando StudyPath para seguimiento académico. Dame un consejo breve para tener éxito en mis estudios.`;
        const { text } = await fetchGenerate(prompt);
        return text;
    } catch (error) {
        console.error('Error en el test de IA:', error);
        return `Error conectando con el modelo: ${error.message}`;
    }
};

export default {
    generateRecommendations,
    analyzeLearningPattern,
    generateStudyPlan,
    testAI
};