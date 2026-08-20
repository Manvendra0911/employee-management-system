import axios from 'axios';

// Single configurable base URL for the entire app. Never hardcode
// http://localhost:8080 inside individual components/services.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Normalizes backend errors (ErrorResponse shape: { status, error,
// message, path, timestamp, fieldErrors }) into a single shape the UI
// can rely on, whether the failure came from the server, the network,
// or something else entirely.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { data } = error.response;
      return Promise.reject({
        status: error.response.status,
        message: data?.message || 'Something went wrong. Please try again.',
        fieldErrors: data?.fieldErrors || null,
      });
    }
    if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'Could not reach the server. Check that the backend is running.',
        fieldErrors: null,
      });
    }
    return Promise.reject({
      status: -1,
      message: error.message || 'An unexpected error occurred.',
      fieldErrors: null,
    });
  }
);

export default api;
