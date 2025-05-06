import React from 'react';

function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  className = '',
  icon,
  iconPosition = 'left',
  ...rest 
}) {
  const baseClasses = 'rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 shadow-sm inline-flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-300 border border-blue-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300 border border-gray-300',
    outline: 'bg-transparent hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-blue-400 focus:ring-blue-300',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-300 border border-green-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-300 border border-red-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-300 border border-yellow-500',
    minimal: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-transparent focus:ring-gray-200',
  };
  
  const sizeClasses = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  };
  
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.medium} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </button>
  );
}

export default Button;