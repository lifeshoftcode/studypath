
/**
 * Application routes constants.
 * Use these constants instead of hardcoded strings for route paths.
 */

// Public routes
export const PUBLIC_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  HOME: '/',
};

// Protected routes
export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  PENSUM_TRACKING: '/seguimiento/:id',
  PENSUM_TRACKING_WITH_ID: (id) => `/seguimiento/${id}`,
  CREATE_PENSUM: '/create-pensum', // English route name for internal use
  EDIT_PENSUM: '/edit-pensum/:id',
  EDIT_PENSUM_WITH_ID: (id) => `/edit-pensum/${id}`,
  IMPORT_PENSUM: '/import-pensum',
  SEARCH_PENSUMS: '/search-pensums',
  AI_SETTINGS: '/configuracion-ia',
  SCHEDULE: '/schedule',
};

// Route namespace mapping (for showing Spanish URLs in the browser)
export const ROUTE_MAPPINGS = {
  // English routes to Spanish URL paths (for display in browser)
  [PROTECTED_ROUTES.CREATE_PENSUM]: '/crear-pensum',
  [PROTECTED_ROUTES.EDIT_PENSUM]: '/editar-pensum/:id', 
  [PROTECTED_ROUTES.IMPORT_PENSUM]: '/importar-pensum',
  [PROTECTED_ROUTES.SEARCH_PENSUMS]: '/buscar-pensums',
  [PROTECTED_ROUTES.SCHEDULE]: '/horario',
};

// Helper function to get the display path
export const getDisplayPath = (routePath) => {
  return ROUTE_MAPPINGS[routePath] || routePath;
};
