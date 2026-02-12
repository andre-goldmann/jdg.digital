export const environment = {
  production: false,
  configEndpoint: 'http://localhost:5678/webhook/api/frontendconfig',
  reservationApiUrl: 'http://localhost:5678/webhook/api/reservervations',
  jwtSecret: 'a-string-secret-at-least-256-bits-long',
  apiTimeout: 30000 // 30 seconds timeout for API requests
};
