import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const handleInternalError = (res: Response, actionMessage: string, error: any): void => {
  const errorMessage = error instanceof Error ? error.message : 'Se ha presentado un error desconocido';
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: `Ocurrió un error al ${actionMessage}`, data: null, error: errorMessage });
};
