// Normalized error shape produced by the errorInterceptor for every
// failed HTTP call, whether the failure came from the server (backend's
// ErrorResponse), the network, or somewhere else entirely. Components
// only ever need to deal with this one shape.
export interface ApiError {
  status: number;
  message: string;
  fieldErrors: Record<string, string> | null;
}
