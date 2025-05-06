import React from 'react';

function Switch({
  checked,
  onChange,
  label,
  labelPosition = 'right',
  disabled = false,
  size = 'medium',
  variant = 'primary',
  className = '',
  ...rest
}) {
  const handleChange = (e) => {
    if (onChange && !disabled) {
      onChange(e.target.checked);
    }
  };

  // Configuración de variantes
  const variantColors = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-600',
    success: 'bg-green-500',
    danger: 'bg-red-500',
    warning: 'bg-yellow-500'
  };

  // Configuración de tamaños
  const sizeConfig = {
    small: {
      switch: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
      margins: 'mt-0.5 ml-0.5'
    },
    medium: {
      switch: 'w-11 h-6',
      thumb: 'w-4 h-4',
      translate: 'translate-x-5',
      margins: 'mt-1 ml-1'
    },
    large: {
      switch: 'w-14 h-7',
      thumb: 'w-5 h-5',
      translate: 'translate-x-7',
      margins: 'mt-1 ml-1'
    }
  };

  const currentSize = sizeConfig[size] || sizeConfig.medium;
  const activeColor = variantColors[variant] || variantColors.primary;

  return (
    <div className={`flex items-center ${className}`}>
      {labelPosition === 'left' && label && (
        <span className={`mr-2 text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>{label}</span>
      )}
      <div className={`relative inline-block ${currentSize.switch} transition-colors duration-200 ease-in-out ${disabled ? 'opacity-60' : ''}`}>
        <input
          type="checkbox"
          className="opacity-0 w-0 h-0 absolute"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          {...rest}
        />
        <span
          className={`absolute cursor-pointer inset-0 rounded-full transition-colors duration-200 ease-in-out ${
            checked ? activeColor : 'bg-gray-300'
          } ${disabled ? 'cursor-not-allowed' : ''}`}
        ></span>
        <span
          className={`absolute bg-white ${currentSize.thumb} ${currentSize.margins} rounded-full shadow transition-transform duration-200 ease-in-out transform ${
            checked ? currentSize.translate : 'translate-x-0'
          }`}
        ></span>
      </div>
      {labelPosition === 'right' && label && (
        <span className={`ml-2 text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>{label}</span>
      )}
    </div>
  );
}

export default Switch;