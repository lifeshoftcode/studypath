import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/UI/Button';
import { PROTECTED_ROUTES } from '../../routes/routes';
import { createPensum } from '../../redux/slices/pensumSlice';
import { validatePensum, exampleMinimalPensum } from '../../data/pensumSchema';
import { validatePrerequisites } from '../../utils/pensumValidation';

const ImportPensum = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.pensum);
  
  const [jsonData, setJsonData] = useState('');
  const [formError, setFormError] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const handleBack = () => {
    navigate(PROTECTED_ROUTES.DASHBOARD);
  };
  
  const handleJsonChange = (e) => {
    setJsonData(e.target.value);
    setFormError('');
    setValidationResult(null);
    setPreview(null);
  };
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setFormError('Por favor, sube un archivo JSON válido');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setJsonData(event.target.result);
      setFormError('');
      setValidationResult(null);
      setPreview(null);
    };
    reader.onerror = () => {
      setFormError('Error al leer el archivo');
    };
    reader.readAsText(file);
  };
  
  const generateEmptyTemplate = () => {
    const template = exampleMinimalPensum;
    setJsonData(JSON.stringify(template, null, 2));
    setFormError('');
    setValidationResult(null);
    setPreview(null);
  };
  
  const validateJson = () => {
    try {
      // Intentar parsear el JSON
      const parsedData = JSON.parse(jsonData);
      
      // Validar la estructura básica del pensum
      const structureValidation = validatePensum(parsedData);
      
      // Validar también los prerrequisitos si la estructura básica es válida
      let prerequisitesValidation = { valid: true, errors: [] };
      if (structureValidation.valid) {
        prerequisitesValidation = validatePrerequisites(parsedData);
      }
      
      // Combinar los resultados de ambas validaciones
      const validationResult = {
        valid: structureValidation.valid,  // Consideramos válido si la estructura básica está bien
        errors: [...structureValidation.errors, ...prerequisitesValidation.errors]
      };
      
      setValidationResult(validationResult);
      
      // Mostrar la previsualización si la estructura básica es válida, incluso con errores en los prerrequisitos
      if (structureValidation.valid) {
        setPreview(parsedData);
      }
      
      return validationResult;
    } catch (error) {
      setFormError(`Error al analizar el JSON: ${error.message}`);
      setValidationResult({ valid: false, errors: [error.message] });
      return { valid: false };
    }
  };
  
  const handleValidate = () => {
    validateJson();
  };
  
  const handleSubmit = async () => {
    const validation = validateJson();
    
    // Si hay una previsualización, permitir la importación incluso con errores leves
    if (!preview) {
      return;
    }
    
    try {
      // Enviar a Redux/Firebase
      const pensumData = JSON.parse(jsonData);
      const resultAction = await dispatch(createPensum(pensumData));
      
      if (createPensum.fulfilled.match(resultAction)) {
        // Éxito - redirigir al dashboard
        navigate(PROTECTED_ROUTES.DASHBOARD);
      }
    } catch (err) {
      setFormError(`Error al crear el pensum: ${err.message}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Importar Plan de Estudio</h1>
        
        {/* Errores */}
        {(formError || error) && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700">{formError || error}</p>
          </div>
        )}
        
        {/* Resultado de validación */}
        {validationResult && (
          <div className={`mb-6 p-4 rounded border-l-4 ${validationResult.valid ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
            <p className={validationResult.valid ? 'text-green-700' : 'text-red-700'}>
              {validationResult.valid 
                ? '✅ El JSON es válido y cumple con la estructura requerida' 
                : '❌ El JSON no cumple con la estructura requerida'}
            </p>
            {!validationResult.valid && validationResult.errors && (
              <ul className="mt-2 list-disc list-inside text-red-700">
                {validationResult.errors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        {/* Instrucciones */}
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <h2 className="font-semibold text-blue-700 mb-2">Instrucciones:</h2>
          <ol className="list-decimal list-inside text-blue-600 space-y-1">
            <li>Sube un archivo JSON o pega el contenido JSON en el área de texto.</li>
            <li>El JSON debe contener todos los campos obligatorios (career, title, faculty, terms).</li>
            <li>Valida primero el JSON para comprobar que tiene la estructura correcta.</li>
            <li>Una vez validado, podrás importar el pensum a la plataforma.</li>
          </ol>
          <div className="mt-3 flex justify-end space-x-4">
            <a 
              href="/pensum_example.json" 
              download="pensum_ejemplo.json"
              className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Ejemplo Básico
            </a>
            <a 
              href="/pensum_example_full.json" 
              download="pensum_ejemplo_completo.json"
              className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Ejemplo Completo
            </a>
          </div>
        </div>
        
        {/* Sección de carga */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Archivo JSON</h2>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          
          <div className="border border-gray-300 rounded-md mb-4">
            <textarea
              value={jsonData}
              onChange={handleJsonChange}
              rows={15}
              className="w-full p-3 font-mono text-sm"
              placeholder='{\n  "career": "Nombre de la carrera",\n  "title": "Título a obtener",\n  "faculty": "Facultad",\n  "terms": [\n    {\n      "number": 1,\n      "name": "Primer semestre",\n      "subjects": [\n        {\n          "code": "CS101",\n          "name": "Introducción a la Programación",\n          "credits": 4\n        }\n      ]\n    }\n  ]\n}'
            ></textarea>
          </div>
          
          <div className="flex space-x-3 justify-between">
            <Button 
              onClick={generateEmptyTemplate}
              variant="outline"
              disabled={isLoading}
            >
              Generar Plantilla
            </Button>
            <Button 
              onClick={handleValidate}
              variant="secondary"
              disabled={!jsonData.trim() || isLoading}
            >
              Validar JSON
            </Button>
          </div>
        </div>
        
        {/* Previsualización */}
        {preview && (
          <div className="mb-6 border border-gray-200 rounded-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Previsualización</h2>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl">{preview.career}</h3>
                  <p className="text-gray-600">{preview.title}</p>
                  <p className="text-gray-600">{preview.faculty}</p>
                  {preview.university && <p className="text-gray-500 text-sm">{preview.university}</p>}
                </div>
                
                <div className="mt-3 md:mt-0 bg-white p-3 rounded-md border border-gray-200">
                  <h4 className="font-semibold text-sm text-gray-700">Información General</h4>
                  <ul className="text-sm text-gray-600">
                    <li>Términos: {preview.terms.length}</li>
                    <li>
                      Asignaturas: {preview.terms.reduce((total, term) => total + term.subjects.length, 0)}
                    </li>
                    <li>
                      Total de créditos: {preview.totalCredits || preview.terms.reduce((total, term) => 
                        total + term.subjects.reduce((subtotal, subject) => subtotal + subject.credits, 0), 0
                      )}
                    </li>
                    {preview.version && <li>Versión: {preview.version}</li>}
                  </ul>
                </div>
              </div>
              
              <div className="mb-4">
                {preview.description && (
                  <div className="bg-white p-3 rounded-md border border-gray-200 mb-3">
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">Descripción</h4>
                    <p className="text-sm text-gray-600">{preview.description}</p>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Estructura del Plan de Estudios</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {preview.terms.slice(0, 6).map((term, i) => (
                    <div key={i} className="bg-white border border-gray-200 p-3 rounded-md">
                      <p className="font-medium">{term.name} (#{term.number})</p>
                      <p className="text-sm text-gray-600 mb-2">Asignaturas: {term.subjects.length}</p>
                      
                      {term.subjects.length > 0 && (
                        <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                          <p className="text-xs text-gray-500 mb-1">Ejemplos:</p>
                          <ul className="text-xs text-gray-600">
                            {term.subjects.slice(0, 3).map((subject, j) => (
                              <li key={j} className="mb-1">
                                <span className="text-gray-700 font-medium">{subject.code}</span> - {subject.name}
                              </li>
                            ))}
                            {term.subjects.length > 3 && (
                              <li className="text-gray-500">+{term.subjects.length - 3} más...</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                  {preview.terms.length > 6 && (
                    <div className="bg-white border border-gray-200 p-3 rounded-md text-center flex items-center justify-center">
                      <p className="text-gray-600">+{preview.terms.length - 6} términos más...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Botones de navegación */}
        <div className="flex justify-between">
          <Button onClick={handleBack} variant="outline">
            Cancelar
          </Button>
          
          <Button 
            onClick={handleSubmit}
            variant="primary"
            disabled={!preview || isLoading}
          >
            {isLoading ? 'Importando...' : 'Importar Plan de Estudio'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportPensum;
