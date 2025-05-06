import React from 'react';

function Input({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  label,
  name,
  id,
  disabled = false,
  error,
  className = '',
  variant = 'primary',
  icon,
  iconPosition = 'left',
  ...rest
}) {
  const variants = {
    primary: 'border-gray-300 focus:border-blue-400 bg-white',
    secondary: 'border-gray-300 focus:border-gray-400 bg-gray-50',
    outline: 'border-gray-300 bg-transparent',
    minimal: 'border-transparent bg-gray-100 focus:bg-gray-50'
  };

  const variantStyle = variants[variant] || variants.primary;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          name={name}
          id={id || name}
          disabled={disabled}
          className={`w-full py-2 px-3 rounded-md shadow-sm transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50
            ${variantStyle}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-300' : ''}
            ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-100' : ''}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${className}`
          }
          {...rest}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default Input;