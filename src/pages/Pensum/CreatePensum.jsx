import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import { PROTECTED_ROUTES } from '../../routes/routes';
import { createPensum } from '../../redux/slices/pensumSlice';
import { createSubjectTemplate, createTermTemplate } from '../../data/pensumSchema';

const CreatePensum = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.pensum);
  
  // Estado para el formulario básico
  const [basicInfo, setBasicInfo] = useState({
    career: '',
    title: '',
    faculty: '',
    university: '',
    description: '',
    isPublic: false,
    version: new Date().toISOString().split('T')[0]
  });

  // Estado para términos y asignaturas
  const [terms, setTerms] = useState([createTermTemplate(1)]);
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  
  // Estado para el formulario en general
  const [step, setStep] = useState(1); // 1: Información básica, 2: Términos, 3: Revisión
  const [formError, setFormError] = useState('');
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(PROTECTED_ROUTES.DASHBOARD);
    }
  };
  
  const handleNext = () => {
    if (step === 1) {
      // Validar información básica
      if (!basicInfo.career || !basicInfo.title || !basicInfo.faculty) {
        setFormError('Los campos Carrera, Título y Facultad son obligatorios');
        return;
      }
      
      setFormError('');
      setStep(2);
    } else if (step === 2) {
      // Validar que haya al menos un término con al menos una asignatura
      if (terms.length === 0) {
        setFormError('Debes agregar al menos un término');
        return;
      }
      
      // Verificar que todos los términos tienen al menos una asignatura
      const emptyTerms = terms.filter(term => !term.subjects || term.subjects.length === 0);
      if (emptyTerms.length > 0) {
        setFormError(`Hay ${emptyTerms.length} término(s) sin asignaturas`);
        return;
      }
      
      setFormError('');
      setStep(3);
    }
  };
  
  const handleSubmit = async () => {
    try {
      // Crear objeto pensum completo
      const pensumData = {
        ...basicInfo,
        terms
      };
      
      // Enviar a Redux/Firebase
      const resultAction = await dispatch(createPensum(pensumData));
      
      if (createPensum.fulfilled.match(resultAction)) {
        // Éxito - redirigir al dashboard
        navigate(PROTECTED_ROUTES.DASHBOARD);
      }
    } catch (err) {
      setFormError(`Error al crear el pensum: ${err.message}`);
    }
  };
  
  const handleBasicInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBasicInfo({
      ...basicInfo,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleAddTerm = () => {
    const newTermNumber = terms.length + 1;
    setTerms([...terms, createTermTemplate(newTermNumber)]);
    setCurrentTermIndex(terms.length);
  };
  
  const handleTermChange = (index, field, value) => {
    const updatedTerms = [...terms];
    updatedTerms[index] = {
      ...updatedTerms[index],
      [field]: value
    };
    setTerms(updatedTerms);
  };
  
  const handleAddSubject = (termIndex) => {
    const updatedTerms = [...terms];
    const newSubject = createSubjectTemplate();
    
    // Asegurarse de que subjects es un array
    if (!updatedTerms[termIndex].subjects) {
      updatedTerms[termIndex].subjects = [];
    }
    
    updatedTerms[termIndex].subjects.push(newSubject);
    setTerms(updatedTerms);
  };
  
  const handleSubjectChange = (termIndex, subjectIndex, field, value) => {
    const updatedTerms = [...terms];
    updatedTerms[termIndex].subjects[subjectIndex] = {
      ...updatedTerms[termIndex].subjects[subjectIndex],
      [field]: value
    };
    setTerms(updatedTerms);
  };
  
  const handleRemoveSubject = (termIndex, subjectIndex) => {
    const updatedTerms = [...terms];
    updatedTerms[termIndex].subjects.splice(subjectIndex, 1);
    setTerms(updatedTerms);
  };
  
  const handleRemoveTerm = (termIndex) => {
    if (terms.length === 1) {
      setFormError('Debe haber al menos un término');
      return;
    }
    
    const updatedTerms = terms.filter((_, index) => index !== termIndex);
    
    // Renumerar términos
    const renumberedTerms = updatedTerms.map((term, index) => ({
      ...term,
      number: index + 1,
      name: `Term ${index + 1}` // Actualizar nombre si es genérico
    }));
    
    setTerms(renumberedTerms);
    setCurrentTermIndex(Math.min(currentTermIndex, renumberedTerms.length - 1));
  };
  
  const renderBasicInfoForm = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Información Básica</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Carrera *"
          name="career"
          value={basicInfo.career}
          onChange={handleBasicInfoChange}
          placeholder="Ej. Ingeniería en Sistemas Computacionales"
          required
        />
        
        <Input
          label="Título *"
          name="title"
          value={basicInfo.title}
          onChange={handleBasicInfoChange}
          placeholder="Ej. Ingeniero en Sistemas Computacionales"
          required
        />
        
        <Input
          label="Facultad *"
          name="faculty"
          value={basicInfo.faculty}
          onChange={handleBasicInfoChange}
          placeholder="Ej. Facultad de Ingeniería"
          required
        />
        
        <Input
          label="Universidad"
          name="university"
          value={basicInfo.university}
          onChange={handleBasicInfoChange}
          placeholder="Ej. Universidad Tecnológica"
        />
        
        <Input
          label="Versión"
          name="version"
          value={basicInfo.version}
          onChange={handleBasicInfoChange}
          placeholder="Ej. 2023-A"
        />
        
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            value={basicInfo.description}
            onChange={handleBasicInfoChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe brevemente este plan de estudios..."
          ></textarea>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            checked={basicInfo.isPublic}
            onChange={handleBasicInfoChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublic" className="font-medium text-gray-700">
            Hacer este plan público
          </label>
        </div>
      </div>
    </div>
  );
  
  const renderTermsForm = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">Términos y Asignaturas</h2>
        <Button onClick={handleAddTerm} variant="secondary" size="small">
          Agregar Término
        </Button>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {terms.map((term, index) => (
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
      
      {terms[currentTermIndex] && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <Input
                label="Número"
                type="number"
                value={terms[currentTermIndex].number}
                onChange={(e) => handleTermChange(currentTermIndex, 'number', parseInt(e.target.value))}
                className="w-24"
                min="1"
              />
              <Input
                label="Nombre"
                value={terms[currentTermIndex].name}
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
            
            {terms[currentTermIndex].subjects && terms[currentTermIndex].subjects.length > 0 ? (
              <div className="space-y-4">
                {terms[currentTermIndex].subjects.map((subject, subjectIndex) => (
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
                      
                      <div className="col-span-full">
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
  );
  
  const renderReviewForm = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Revisar Plan de Estudio</h2>
      
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="text-lg font-semibold">{basicInfo.career}</h3>
        <p className="text-gray-600">{basicInfo.title} - {basicInfo.faculty}</p>
        {basicInfo.university && <p className="text-gray-500 text-sm">{basicInfo.university}</p>}
        
        <div className="mt-3">
          <span className={`px-2 py-1 rounded text-xs font-bold ${basicInfo.isPublic ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {basicInfo.isPublic ? 'Público' : 'Privado'}
          </span>
        </div>
        
        {basicInfo.description && (
          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">{basicInfo.description}</p>
          </div>
        )}
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Estructura Curricular</h3>
        
        <div className="space-y-6">
          {terms.map((term, termIndex) => (
            <div key={termIndex} className="border-t pt-4">
              <h4 className="font-semibold">{term.name} (#{term.number})</h4>
              
              <div className="mt-2 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créditos</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {term.subjects && term.subjects.map((subject, subjectIndex) => (
                      <tr key={subjectIndex}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{subject.code}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{subject.name}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{subject.credits}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                          {subject.theoryHours > 0 && `T: ${subject.theoryHours}`}
                          {subject.theoryHours > 0 && subject.practiceHours > 0 && ' / '}
                          {subject.practiceHours > 0 && `P: ${subject.practiceHours}`}
                          {!subject.theoryHours && !subject.practiceHours && '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Crear Nuevo Plan de Estudio</h1>
        
        {/* Pasos */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <div className={`h-1 w-10 ${step > 1 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <div className={`h-1 w-10 ${step > 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step === 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              3
            </div>
          </div>
        </div>
        
        {/* Errores */}
        {(formError || error) && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700">{formError || error}</p>
          </div>
        )}
        
        {/* Formularios por paso */}
        <div className="mb-8">
          {step === 1 && renderBasicInfoForm()}
          {step === 2 && renderTermsForm()}
          {step === 3 && renderReviewForm()}
        </div>
        
        {/* Botones de navegación */}
        <div className="flex justify-between">
          <Button onClick={handleBack} variant="outline">
            {step > 1 ? 'Atrás' : 'Cancelar'}
          </Button>
          
          <Button 
            onClick={step < 3 ? handleNext : handleSubmit}
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : step < 3 ? 'Siguiente' : 'Guardar Plan de Estudio'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePensum;
