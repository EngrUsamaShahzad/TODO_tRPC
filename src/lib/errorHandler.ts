import { TRPCClientError } from '@trpc/client';
import { ERROR_MESSAGES } from './constants';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown): string => {
  // TRPCClientError
  if (error instanceof TRPCClientError) {
    const trpcError = error as any;
    
    // Check for specific error codes
    if (trpcError.data?.code === 'UNAUTHORIZED') {
      return ERROR_MESSAGES.AUTH_REQUIRED;
    }
    
    if (trpcError.data?.code === 'NOT_FOUND') {
      return ERROR_MESSAGES.TODO_NOT_FOUND;
    }
    
    if (trpcError.data?.code === 'CONFLICT') {
      return ERROR_MESSAGES.USER_EXISTS;
    }
    
    // Return the error message if available
    return trpcError.message || ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  // AppError
  if (error instanceof AppError) {
    return error.message;
  }

  // Standard Error
  if (error instanceof Error) {
    return error.message;
  }

  // Network errors
  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    if (err.code === 'NETWORK_ERROR' || err.code === 'ECONNREFUSED') {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
  }

  // Fallback
  return ERROR_MESSAGES.UNKNOWN_ERROR;
};

export const logError = (error: unknown, context?: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context || 'Error'}]:`, error);
  }
  
  // In production, send to error tracking service (Sentry, LogRocket, etc.)
  // Example: Sentry.captureException(error);
};

export const handleApiError = (error: unknown, context?: string): never => {
  logError(error, context);
  const message = handleError(error);
  throw new AppError(message);
};