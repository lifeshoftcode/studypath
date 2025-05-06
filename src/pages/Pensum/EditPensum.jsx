import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { PROTECTED_ROUTES } from '../../routes/routes';
import { getPensumById, updatePensum } from '../../redux/slices/pensumSlice';
import { validatePensum, createSubjectTemplate, createTermTemplate } from '../../data/pensumSchema';

const EditPensum = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPensum, isLoading, error } = useSelector(state => state.pensum);
  
  // Estado para el formulario
  const [formData, setFormData] = useState(null);
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [formError, setFormError] = useState('');
  
  // Cargar el pensum a editar
  useEffect(() => {
    if (id) {
      dispatch(getPensumById(id));
    }
  }, [dispatch, id]);
  
  // Cuando se carga el pensum, inicializar el formulario
  useEffect(() => {
    if (currentPensum && !formData) {
      setFormData({
        ...currentPensum,
        // Clonar propiedades para evitar modificar el estado de Redux directamente
        terms: JSON.parse(JSON.stringify(currentPensum.terms || []))
      });
    }
  }, [currentPensum, formData]);
  
  const handleFormChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleBack = () => {
    navigate(PROTECTED_ROUTES.DASHBOARD);
  };
  
  const handleAddTerm = () => {
    if (!formData) return;
    
    const newTermNumber = formData.terms.length + 1;
    setFormData({
      ...formData,
      terms: [...formData.terms, createTermTemplate(newTermNumber)]
    });
    setCurrentTermIndex(formData.terms.length);
  };
  
  const handleTermChange = (index, field, value) => {
    if (!formData) return;
    
    const updatedTerms = [...formData.terms];
    updatedTerms[index] = {
      ...updatedTerms[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      terms: updatedTerms
    });
  };
  
  const handleAddSubject = (termIndex) => {
    if (!formData) return;
    
    const updatedTerms = [...formData.terms];
    const newSubject = createSubjectTemplate();
    
    // Asegurarse de que subjects es un array
    if (!updatedTerms[termIndex].subjects) {
      updatedTerms[termIndex].subjects = [];
    }
    
    updatedTerms[termIndex].subjects.push(newSubject);
    
    setFormData({
      ...formData,
      terms: updatedTerms
    });
  };
  
  const handleSubjectChange = (termIndex, subjectIndex, field, value) => {
    if (!formData) return;
    
    const updatedTerms = [...formData.terms];
    updatedTerms[termIndex].subjects[subjectIndex] = {
      ...updatedTerms[termIndex].subjects[subjectIndex],
      [field]: value
    };
    
    setFormData({
      ...formData,
      terms: updatedTerms
    });
  };
  
  const handleRemoveSubject = (termIndex, subjectIndex) => {
    if (!formData) return;
    
    const updatedTerms = [...formData.terms];
    updatedTerms[termIndex].subjects.splice(subjectIndex, 1);
    
    setFormData({
      ...formData,
      terms: updatedTerms
    });
  };
  
  const handleRemoveTerm = (termIndex) => {
    if (!formData) return;
    
    if (formData.terms.length === 1) {
      setFormError('Debe haber al menos un término');
      return;
    }
    
    const updatedTerms = formData.terms.filter((_, index) => index !== termIndex);
    
    // Renumerar términos
    const renumberedTerms = updatedTerms.map((term, index) => ({
      ...term,
      number: index + 1,
      name: term.name.startsWith('Término ') ? `Término ${index + 1}` : term.name
    }));
    
    setFormData({
      ...formData,
      terms: renumberedTerms
    });
    
    setCurrentTermIndex(Math.min(currentTermIndex, renumberedTerms.length - 1));
  };
  
  const handleSubmit = async () => {
    try {
      // Validar el pensum
      const validation = validatePensum(formData);
      if (!validation.valid) {
        setFormError(`Datos inválidos: ${validation.errors.join(', ')}`);
        return;
      }
      
      // Enviar a Redux/Firebase
      const resultAction = await dispatch(updatePensum({ 
        pensumId: id, 
        updatedData: formData 
      }));
      
      if (updatePensum.fulfilled.match(resultAction)) {
        // Éxito - redirigir al dashboard
        navigate(PROTECTED_ROUTES.DASHBOARD);
      }
    } catch (err) {
      setFormError(`Error al actualizar el pensum: ${err.message}`);
    }
  };
  
  // Si está cargando, mostrar indicador
  if (isLoading && !formData) {
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
  if (error && !formData) {
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
  if (!formData) {
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
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Editar Plan de Estudio</h1>
        
        {/* Errores */}
        {(formError || error) && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700">{formError || error}</p>
          </div>
        )}
        
        {/* Información básica */}
        <div className="mb-8 border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Información Básica</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Carrera *"
              value={formData.career}
              onChange={(e) => handleFormChange('career', e.target.value)}
              placeholder="Ej. Ingeniería en Sistemas Computacionales"
              required
            />
            
            <Input
              label="Título *"
              value={formData.title}
              onChange={(e) => handleFormChange('title', e.target.value)}
              placeholder="Ej. Ingeniero en Sistemas Computacionales"
              required
            />
            
            <Input
              label="Facultad *"
              value={formData.faculty}
              onChange={(e) => handleFormChange('faculty', e.target.value)}
              placeholder="Ej. Facultad de Ingeniería"
              required
            />
            
            <Input
              label="Universidad"
              value={formData.university || ''}
              onChange={(e) => handleFormChange('university', e.target.value)}
              placeholder="Ej. Universidad Tecnológica"
            />
            
            <Input
              label="Versión"
              value={formData.version || ''}
              onChange={(e) => handleFormChange('version', e.target.value)}
              placeholder="Ej. 2023-A"
            />
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe brevemente este plan de estudios..."
              ></textarea>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isPublic"
                checked={Boolean(formData.isPublic)}
                onChange={(e) => handleFormChange('isPublic', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="font-medium text-gray-700">
                Hacer este plan público
              </label>
            </div>
          </div>
        </div>
        
        {/* Términos y Asignaturas */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Términos y Asignaturas</h2>
            <Button onClick={handleAddTerm} variant="secondary" size="small">
              Agregar Término
            </Button>
          </div>
          
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {formData.terms && formData.terms.map((term, index) => (
              <button
                key={index}
                onClick={() => setCurrentTermIndex(index)}
                className={`py-2 px-4 rounded-lg ${
                  currentTermIndex === index 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {term.name || `Término ${term.number}`}
              </button>
            ))}
          </div>
          
          {formData.terms && formData.terms[currentTermIndex] && (
            <div className="border border-gray-200 rounded-lg p-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                  <Input
                    label="Número"
                    type="number"
                    value={formData.terms[currentTermIndex].number}
                    onChange={(e) => handleTermChange(currentTermIndex, 'number', parseInt(e.target.value))}
                    className="w-24"
                    min="1"
                  />
                  <Input
                    label="Nombre"
                    value={formData.terms[currentTermIndex].name}
                    onChange={(e) => handleTermChange(currentTermIndex, 'name', e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => handleRemoveTerm(currentTermIndex)}
                  variant="danger"
                  size="small"
                >
                  Eliminar Término
                </Button>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">Asignaturas</h3>
                  <Button 
                    onClick={() => handleAddSubject(currentTermIndex)}
                    variant="secondary"
                    size="small"
                  >
                    Agregar Asignatura
                  </Button>
                </div>
                
                {formData.terms[currentTermIndex].subjects && formData.terms[currentTermIndex].subjects.length > 0 ? (
                  <div className="space-y-4">
                    {formData.terms[currentTermIndex].subjects.map((subject, subjectIndex) => (
                      <div key={subjectIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <Input
                            label="Código *"
                            value={subject.code}
                            onChange={(e) => handleSubjectChange(currentTermIndex, subjectIndex, 'code', e.target.value)}
                            placeholder="Ej. CS101"
                            required
                          />
                          <Input
                            label="Nombre *"
                            value={subject.name}
                            onChange={(e) => handleSubjectChange(currentTermIndex, subjectIndex, 'name', e.target.value)}
                            placeholder="Ej. Introducción a la Programación"
                            required
                          />
                          <Input
                            label="Créditos *"
                            type="number"
                            value={subject.credits}
                            onChange={(e) => handleSubjectChange(currentTermIndex, subjectIndex, 'credits', parseInt(e.target.value))}
                            placeholder="Ej. 3"
                            min="0"
                            required
                          />
                          
                          <div className="flex space-x-3">
                            <Input
                              label="Horas Teóricas"
                              type="number"
                              value={subject.theoryHours || 0}
                              onChange={(e) => handleSubjectChange(currentTermIndex, subjectIndex, 'theoryHours', parseInt(e.target.value))}
                              className="w-24"
                              min="0"
                            />
                            <Input
                              label="Horas Prácticas"
                              type="number"
                              value={subject.practiceHours || 0}
                              onChange={(e) => handleSubjectChange(currentTermIndex, subjectIndex, 'practiceHours', parseInt(e.target.value))}
                              className="w-24"
                              min="0"
                            />
                          </div>
                          
                          <div className="col-span-full mt-2">
                            <Button 
                              onClick={() => handleRemoveSubject(currentTermIndex, subjectIndex)}
                              variant="danger"
                              size="small"
                            >
                              Eliminar Asignatura
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No hay asignaturas en este término</p>
                    <Button 
                      onClick={() => handleAddSubject(currentTermIndex)}
                      variant="secondary"
                      className="mt-2"
                      size="small"
                    >
                      Agregar Asignatura
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Botones de navegación */}
        <div className="flex justify-between">
          <Button onClick={handleBack} variant="outline">
            Cancelar
          </Button>
          
          <Button 
            onClick={handleSubmit}
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPensum;
