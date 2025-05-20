import { useState } from 'react';
import Button from '../UI/Button';
import Input from '../UI/Input';

function ScheduleForm({ initialSchedule = { classes: [] }, onSave, isLoading }) {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [currentClass, setCurrentClass] = useState({
    subjectCode: '',
    subjectName: '',
    day: 'Lunes',
    startTime: '08:00',
    endTime: '09:30',
    location: '',
    professor: ''
  });
  const [editing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Days of the week in Spanish
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const handleClassChange = (e) => {
    const { name, value } = e.target;
    setCurrentClass(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClass = () => {
    // Validate that required fields are not empty
    if (!currentClass.subjectName || !currentClass.startTime || !currentClass.endTime) {
      setMessage({
        text: 'Por favor completa al menos el nombre de la asignatura y los horarios',
        type: 'error'
      });
      return;
    }

    // Add new class or update existing one
    if (editing && editIndex > -1) {
      // Update existing class
      const updatedClasses = [...schedule.classes];
      updatedClasses[editIndex] = currentClass;
      setSchedule({ ...schedule, classes: updatedClasses });
      setEditing(false);
      setEditIndex(-1);
    } else {
      // Add new class
      setSchedule({
        ...schedule,
        classes: [...schedule.classes, currentClass]
      });
    }

    // Reset the form
    setCurrentClass({
      subjectCode: '',
      subjectName: '',
      day: 'Lunes',
      startTime: '08:00',
      endTime: '09:30',
      location: '',
      professor: ''
    });
    
    setMessage({
      text: editing ? 'Clase actualizada correctamente' : 'Clase agregada correctamente',
      type: 'success'
    });

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  const handleEditClass = (index) => {
    setCurrentClass(schedule.classes[index]);
    setEditing(true);
    setEditIndex(index);
  };

  const handleDeleteClass = (index) => {
    const updatedClasses = [...schedule.classes];
    updatedClasses.splice(index, 1);
    setSchedule({ ...schedule, classes: updatedClasses });
    
    // If currently editing this class, reset the form
    if (editing && editIndex === index) {
      setCurrentClass({
        subjectCode: '',
        subjectName: '',
        day: 'Lunes',
        startTime: '08:00',
        endTime: '09:30',
        location: '',
        professor: ''
      });
      setEditing(false);
      setEditIndex(-1);
    }
    
    setMessage({
      text: 'Clase eliminada correctamente',
      type: 'success'
    });

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  const handleSaveSchedule = async () => {
    setMessage({ text: '', type: '' });
    
    try {
      await onSave(schedule);
      setMessage({
        text: 'Horario guardado con éxito',
        type: 'success'
      });
    } catch (error) {
      console.error('Error al guardar el horario:', error);
      setMessage({
        text: 'Error al guardar el horario',
        type: 'error'
      });
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditIndex(-1);
    setCurrentClass({
      subjectCode: '',
      subjectName: '',
      day: 'Lunes',
      startTime: '08:00',
      endTime: '09:30',
      location: '',
      professor: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {editing ? 'Editar Clase' : 'Agregar Nueva Clase'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Código de Asignatura"
            name="subjectCode"
            value={currentClass.subjectCode}
            onChange={handleClassChange}
            placeholder="Ej. MAT-101"
          />
          
          <Input 
            label="Nombre de Asignatura *"
            name="subjectName"
            value={currentClass.subjectName}
            onChange={handleClassChange}
            placeholder="Ej. Cálculo I"
            required
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Día de la semana
            </label>
            <select
              name="day"
              value={currentClass.day}
              onChange={handleClassChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {daysOfWeek.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Input 
              label="Hora Inicio *"
              name="startTime"
              type="time"
              value={currentClass.startTime}
              onChange={handleClassChange}
              required
            />
            
            <Input 
              label="Hora Fin *"
              name="endTime"
              type="time"
              value={currentClass.endTime}
              onChange={handleClassChange}
              required
            />
          </div>
          
          <Input 
            label="Ubicación"
            name="location"
            value={currentClass.location}
            onChange={handleClassChange}
            placeholder="Ej. Aula 101, Edificio A"
          />
          
          <Input 
            label="Profesor"
            name="professor"
            value={currentClass.professor}
            onChange={handleClassChange}
            placeholder="Ej. Dr. Martínez"
          />
        </div>
        
        <div className="flex justify-end mt-4 space-x-2">
          {editing && (
            <Button
              variant="secondary"
              onClick={cancelEdit}
            >
              Cancelar
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleAddClass}
          >
            {editing ? 'Actualizar Clase' : 'Agregar Clase'}
          </Button>
        </div>
      </div>
      
      {/* Display current schedule */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Horario Actual</h2>
        
        {schedule.classes.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No hay clases en tu horario</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Día</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asignatura</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profesor</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedule.classes.map((classItem, index) => (
                  <tr key={index} className={editIndex === index ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{classItem.day}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {classItem.startTime} - {classItem.endTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{classItem.subjectName}</div>
                      <div className="text-xs text-gray-500">{classItem.subjectCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{classItem.location || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{classItem.professor || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="secondary"
                          size="small"
                          onClick={() => handleEditClass(index)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="danger"
                          size="small"
                          onClick={() => handleDeleteClass(index)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {message.text && (
          <div className={`mt-4 p-3 rounded text-sm ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border-l-4 border-green-500' 
              : 'bg-red-50 text-red-700 border-l-4 border-red-500'
          }`}>
            {message.text}
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <Button
            variant="primary"
            onClick={handleSaveSchedule}
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar Horario'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ScheduleForm;