import { StatusCodes } from 'http-status-codes';
import { OperationResult } from '../models/models';
import { APP_NAME } from '../constants/constants';

interface ErrorHandlerParams { 
  error: any;
  action: string;
  user: string;
}

export function handleRepositoryError({ error, action, user }: ErrorHandlerParams): OperationResult {
  const operationResult: OperationResult = {
    success: false,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: `Se ha producido un error al ejecutar ${action}`,
    data: null,
    error: { description: error?.message ?? 'Error desconocido', code: error?.number ?? 'N/A' },
    app: { name: APP_NAME, action: action, timestamp: new Date().toISOString(), user: user }
  };

  return operationResult;
}
