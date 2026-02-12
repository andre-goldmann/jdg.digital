export const environment = {
  production: true,
  configEndpoint: 'https://api.oelapa.com/webhook/api/frontendconfig',
  reservationApiUrl: 'https://api.oelapa.com/webhook/api/reservervations',
  jwtSecret: 'a-string-secret-at-least-256-bits-long',
  apiTimeout: 30000 // 30 seconds timeout for API requests
};
