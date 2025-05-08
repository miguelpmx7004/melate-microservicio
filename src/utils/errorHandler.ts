import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

interface ErrorResponseOptions { 
  res: Response;
  statusCode?: number;
  message: string;
  error?: any;
}

export const handleErrorResponse = ({ res, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, message, error = null, }: ErrorResponseOptions): void => {
  const errorMessage = error instanceof Error ? error.message : error ?? 'Se ha presentado un error desconocido';

  res.status(statusCode).json({ success: false, statusCode, message, data: null, error: errorMessage, });
};
