import { useState } from 'react';
import Button from '../UI/Button';
import Input from '../UI/Input';

/**
 * Componente para administrar configuraciones de IA
 * @param {Object} props
 * @param {Function} props.onSaveSettings - Función para guardar configuraciones
 * @param {Object} props.initialSettings - Configuraciones iniciales
 */
function AISettings({ onSaveSettings, initialSettings = {} }) {
  const [settings, setSettings] = useState({
    apiKey: initialSettings.apiKey || '',
    modelPreference: initialSettings.modelPreference || 'gemini15Flash',
    ...initialSettings
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      await onSaveSettings(settings);
      setMessage({
        text: 'Configuración guardada con éxito',
        type: 'success'
      });
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      setMessage({
        text: 'Error al guardar configuración',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Configuración de IA
        </h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key de Google AI
          </label>
          <Input 
            type="password"
            name="apiKey"
            value={settings.apiKey}
            onChange={handleChange}
            placeholder="Ingresa tu API Key de Google AI"
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Puedes obtener tu API Key en la consola de Google Cloud.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modelo preferido
          </label>
          <select
            name="modelPreference"
            value={settings.modelPreference}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="gemini15Flash">Gemini 1.5 Flash (Rápido)</option>
            <option value="gemini15Pro">Gemini 1.5 Pro (Avanzado)</option>
          </select>
        </div>
        
        {message.text && (
          <div className={`p-3 rounded text-sm ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border-l-4 border-green-500' 
              : 'bg-red-50 text-red-700 border-l-4 border-red-500'
          }`}>
            {message.text}
          </div>
        )}
        
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar configuración'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AISettings;