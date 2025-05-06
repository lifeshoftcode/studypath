/**
 * Utility functions for handling dates consistently across the application
 */

/**
 * Format a date value (string, Date object, or Firebase Timestamp) to a localized string
 * @param {string|Date|Object} dateValue - The date to format
 * @param {string} locale - The locale to use for formatting (default: 'es-ES')
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateValue, locale = 'es-ES', options = {}) => {
  if (!dateValue) return 'N/A';
  
  let date;
  
  // Handle different date formats
  if (typeof dateValue === 'string') {
    // If it's an ISO string
    date = new Date(dateValue);
  } else if (dateValue instanceof Date) {
    // If it's already a Date object
    date = dateValue;
  } else if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
    // If it's a Firebase Timestamp
    date = new Date(dateValue.seconds * 1000);
  } else {
    return 'Fecha desconocida';
  }
  
  if (isNaN(date.getTime())) return 'Fecha inválida';
  
  const defaultOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
};

/**
 * Format a date for relative time display (e.g., "2 days ago")
 * @param {string|Date|Object} dateValue - The date to format
 * @param {string} locale - The locale to use for formatting (default: 'es-ES')
 * @returns {string} - Formatted relative time
 */
export const formatRelativeTime = (dateValue, locale = 'es-ES') => {
  if (!dateValue) return 'N/A';
  
  let date;
  
  // Handle different date formats (same as formatDate)
  if (typeof dateValue === 'string') {
    date = new Date(dateValue);
  } else if (dateValue instanceof Date) {
    date = dateValue;
  } else if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
    date = new Date(dateValue.seconds * 1000);
  } else {
    return 'Fecha desconocida';
  }
  
  if (isNaN(date.getTime())) return 'Fecha inválida';
  
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  // Simplified relative time formatting
  if (diffSecs < 60) {
    return 'hace unos segundos';
  } else if (diffMins < 60) {
    return `hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffHours < 24) {
    return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  } else if (diffDays < 30) {
    return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
  } else {
    // For older dates, fall back to standard format
    return formatDate(date, locale);
  }
};

/**
 * Convert Firebase Timestamp to ISO string
 * @param {Object} timestamp - Firebase Timestamp object
 * @returns {string} - ISO date string
 */
export const timestampToISOString = (timestamp) => {
  if (!timestamp) return null;
  
  if (typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  
  return null;
};

export default {
  formatDate,
  formatRelativeTime,
  timestampToISOString
};
