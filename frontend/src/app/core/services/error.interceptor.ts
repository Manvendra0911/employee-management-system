import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '../models/api-error.model';

/**
 * Normalizes every failed HTTP call into a single ApiError shape,
 * whether the failure came from the server (backend's ErrorResponse:
 * { status, error, message, path, timestamp, fieldErrors }), the
 * network, or something else entirely. This is the Angular HttpClient
 * equivalent of the axios response interceptor in the original React
 * app's services/api.js.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let apiError: ApiError;

      if (error.error instanceof ErrorEvent || error.status === 0) {
        // Client-side / network error - the request never reached the server.
        apiError = {
          status: 0,
          message: 'Could not reach the server. Check that the backend is running.',
          fieldErrors: null,
        };
      } else if (error.status > 0) {
        const body = error.error;
        apiError = {
          status: error.status,
          message: body?.message || 'Something went wrong. Please try again.',
          fieldErrors: body?.fieldErrors || null,
        };
      } else {
        apiError = {
          status: -1,
          message: error.message || 'An unexpected error occurred.',
          fieldErrors: null,
        };
      }

      return throwError(() => apiError);
    })
  );
};
