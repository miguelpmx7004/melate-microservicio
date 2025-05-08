import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const handleSqlError = (res: Response, error: any): boolean => {
  const sqlErrorCode = error?.number;
  const errorMessage = error instanceof Error ? error.message : 'Se ha presentado un error desconocido';

  switch (sqlErrorCode) {
    case 208: // Tabla no encontrada
      res.status(StatusCodes.NOT_FOUND).json({ success: false, statusCode: StatusCodes.NOT_FOUND, message: 'La tabla de sorteos no fue encontrada', data: null, error: errorMessage });
      return true;
    case 207: // Columna inválida
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, statusCode: StatusCodes.BAD_REQUEST, message: 'Una o más columnas no son válidas', data: null, error: errorMessage });
      return true;
    case 2627: // Ya existe registro
      res.status(StatusCodes.CONFLICT).json({ success: false, statusCode: StatusCodes.CONFLICT, message: 'Ya existe un elemento con ese identificador', data: null, error: errorMessage });
      return true;
    case 4060: // Base de datos inválida
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'No se puede conectar a la base de datos', data: null, error: errorMessage });
      return true;
    default:
      return false; // No se manejó, lo puedes atrapar como error general
  }
};
