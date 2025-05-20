import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Header from '../../components/Header/Header';
import ScheduleForm from '../../components/Schedule/ScheduleForm';

function Schedule() {
  const { user } = useSelector(state => state.auth);
  const [schedule, setSchedule] = useState({ classes: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar el horario actual del usuario
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!user || !user.uid) return;

      setIsLoading(true);
      setError('');

      try {
        const docRef = doc(db, 'userSettings', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setSchedule(userData.schedule || { classes: [] });
        } else {
          // Horario por defecto si no existe ninguno
          setSchedule({ classes: [] });
        }
      } catch (error) {
        console.error('Error al cargar el horario:', error);
        setError('No se pudo cargar el horario. Inténtalo de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [user]);

  // Guardar el horario del usuario
  const handleSaveSchedule = async (newSchedule) => {
    if (!user || !user.uid) {
      throw new Error('Usuario no autenticado');
    }

    setIsLoading(true);
    setError('');

    try {
      const userDocRef = doc(db, 'userSettings', user.uid);
      
      // Obtener la configuración actual para actualizar solo el horario
      const docSnap = await getDoc(userDocRef);
      const currentData = docSnap.exists() ? docSnap.data() : {};
      
      // Actualizar solo la sección de schedule
      await setDoc(userDocRef, {
        ...currentData,
        schedule: newSchedule
      });
      
      setSchedule(newSchedule);
      return true;
    } catch (error) {
      console.error('Error al guardar el horario:', error);
      setError('No se pudo guardar el horario. Inténtalo de nuevo más tarde.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-center text-gray-600">
              Necesitas iniciar sesión para acceder a esta página.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Horario de Clases</h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <ScheduleForm 
              initialSchedule={schedule} 
              onSave={handleSaveSchedule} 
              isLoading={isLoading} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Schedule;