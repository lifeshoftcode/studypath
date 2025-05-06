import React, { useState, useRef, useEffect } from 'react';

function Select({ 
  value, 
  onChange, 
  options, 
  disabled = false, 
  placeholder = "Seleccionar", 
  className = '',
  variant = 'primary',
  ...rest 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const selectRef = useRef(null);

  // Establecer la etiqueta seleccionada basada en el valor actual
  useEffect(() => {
    const selected = options.find(option => option.value === value);
    setSelectedLabel(selected ? selected.label : placeholder);
  }, [value, options, placeholder]);

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Manejar la selección de una opción
  const handleSelect = (option) => {
    const event = {
      target: {
        value: option.value
      }
    };
    onChange(event);
    setIsOpen(false);
  };

  // Variantes de estilo del select
  const variantStyles = {
    primary: 'bg-white border-gray-300 text-gray-700 hover:border-blue-400',
    secondary: 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400',
    outline: 'bg-transparent border-gray-300 text-gray-700 hover:border-blue-400',
    minimal: 'bg-transparent border-transparent text-gray-700 hover:bg-gray-100'
  };

  // Obtener el estilo de la variante seleccionada
  const variantStyle = variantStyles[variant] || variantStyles.primary;

  return (
    <div 
      className={`relative w-full ${className}`}
      ref={selectRef}
    >
      <button
        type="button"
        className={`w-full flex items-center justify-between p-2 px-3 border rounded-md shadow-sm transition-colors duration-200 ${variantStyle} ${
          disabled ? 'opacity-60 cursor-not-allowed bg-gray-100' : 'cursor-pointer'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        {...rest}
      >
        <span className="truncate">{selectedLabel}</span>
        <svg 
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg py-1 max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors duration-150 ${
                option.value === value ? 'bg-blue-100' : ''
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      
      {/* Select nativo oculto para mantener accesibilidad */}
      <select 
        className="opacity-0 absolute -z-10 w-0 h-0"
        value={value}
        onChange={onChange}
        tabIndex={-1}
        aria-hidden="true"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;