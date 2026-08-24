// Production environment configuration.
// Swapped in automatically for `ng build` (production is the default
// build configuration) via the fileReplacements entry in angular.json.
//
// Before deploying, change apiBaseUrl to the public URL of your deployed
// Spring Boot backend, e.g. 'https://your-backend.onrender.com/api'.
export const environment = {
  production: true,
  apiBaseUrl: 'http://localhost:8080/api',
};
