import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { dbPool } from '../server';
import { SqlServerDataTypes } from '../enums';
import { IResult } from 'mssql';

export const checkDbConnection = (res: Response): boolean => {
  if (!dbPool) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ success: false, statusCode: StatusCodes.SERVICE_UNAVAILABLE, message: 'La base de datos no está conectada', data: null, error: 'La base de datos no está conectada' });
    return false;
  }

  return true;
};

export const checkTableExists = async (res: Response, tableName: string): Promise<boolean> => {
  const result = await dbPool.request().query(`SELECT OBJECT_ID('dbo.${tableName}', 'U') AS TableId`);
  const exists = result.recordset[0]?.TableId;

  if (!exists) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: `La tabla "${tableName}" no existe en la base de datos`, data: null, error: 'Tabla no encontrada' });
    return false;
  }

  return true;
};

export const checkDrawColumnsExists = async (res: Response): Promise<boolean> => {
  const expectedColumns = ['Numero1', 'Numero2', 'Numero3', 'Numero4', 'Numero5', 'Numero6', 'Numero7', 'Bolsa', 'Fecha'];
  const columnResult = await dbPool.request().query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Sorteos'`);

  const actualColumns = columnResult.recordset.map((col: any) => col.COLUMN_NAME);
  const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));

  if (missingColumns.length > 0) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: `Faltan las siguientes columnas en la tabla Sorteos: ${missingColumns.join(', ')}`, data: null, error: 'Columnas faltantes' });
    return false;
  }

  return true;
};

export const checkColumnExists = async (res: Response, columnName: string): Promise<boolean> => {
    const columnCheck = await dbPool.request().query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Sorteos' AND COLUMN_NAME = '${columnName}'`);

    if (columnCheck.recordset.length === 0) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'La columna "Id" no existe en la tabla Sorteos', data: null, error: 'Columna faltante' });
      return false;
    }

    return true;
};

export const checkColumnNumber = async (res: Response, column: any, columnName: string, type: SqlServerDataTypes): Promise<boolean> => {
//const validation = validateIdNumber(parsedId);

const parsedColumn = parseInt(column)

// Verifica si el Id fue proporcionado
if (parsedColumn === undefined || parsedColumn === null) { 
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, statusCode: StatusCodes.BAD_REQUEST, message: `La columna ${columnName} es requerida`, data: null, error: 'El Id es requerido' }); 
    return false;
}

// Verifica si el Id es un número
if (isNaN(Number(parsedColumn))) { 
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, statusCode: StatusCodes.BAD_REQUEST, message: `La columna ${columnName} no es un número` }); 
    return false;
}

// Verifica si el Id es entero
if (type !== "int") {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, StatusCode: StatusCodes.BAD_REQUEST, message: `La columna ${columnName} no es del tipo de dato ${type}` })
}

// Verifica si el Id es un número positivo
if (parsedColumn < 1) { 
    res.status(StatusCodes.BAD_REQUEST).json({ success: true, statusCode: StatusCodes.BAD_REQUEST, message: `La columna ${columnName} debe ser un número positivo` });
    return false; 
}

//res.status(StatusCodes.OK).json({ success: true, statusCode: StatusCodes.OK, message: `La columna ${columnName} es válida` });
return true;
};

export const checkQueryNotEmpty = async (res: Response, result: IResult<any>): Promise<boolean> => {
    if (!result.recordset || result.recordset.length === 0) {
      res.status(StatusCodes.OK).json({ success: true, statusCode: StatusCodes.OK, message: 'No hay información para la consulta solicitada', data: [], error: null });
      return true;
    }

    return true;
};

export const handleInternalError = (res: Response, actionMessage: string, error: any): void => {
  const errorMessage = error instanceof Error ? error.message : 'Se ha presentado un error desconocido';
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: `Ocurrió un error al ${actionMessage}`, data: null, error: errorMessage });
};
