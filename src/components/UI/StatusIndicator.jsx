import React from 'react';

function StatusIndicator({ 
  status, 
  className = '',
  size = 'medium',
  label,
  showLabel = false,
  customColors = null,
  animate = false,
  ...rest
}) {
  const sizeClasses = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  };

  const statusLabels = {
    approved: 'Aprobada',
    inProgress: 'En curso',
    pending: 'Pendiente',
    failed: 'Reprobada'
  };

  const getStatusColor = (status) => {
    if (customColors && customColors[status]) {
      return customColors[status];
    }
    
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'inProgress': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      case 'pending': 
      default: return 'bg-gray-400';
    }
  };

  const animationClass = animate ? 'animate-pulse' : '';
  const sizeClass = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className="inline-flex items-center">
      <span 
        className={`inline-block ${sizeClass} rounded-full mr-2 ${getStatusColor(status)} ${animationClass} ${className}`}
        {...rest}
      ></span>
      {(showLabel || label) && (
        <span className="text-sm text-gray-700">
          {label || statusLabels[status] || status}
        </span>
      )}
    </div>
  );
}

export default StatusIndicator;