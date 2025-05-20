import { NumberPair, OperationResult } from '../models/models';
import { StatusCodes } from "http-status-codes";
import { dbPool } from "../server";
import { IResult } from 'mssql';
import { APP_NAME } from '../constants/constants';
import { SqlServerDataTypes } from '../enums';

export const checkDbConnection = (): OperationResult => {
  let operationResult: OperationResult;

  if (!dbPool) {
    operationResult = { 
      success: false, 
      statusCode: StatusCodes.SERVICE_UNAVAILABLE, 
      message: 'La base de datos no está conectada', 
      data: null,
      error: { description: 'La base de datos no está disponible', code: 503 },
      app: { name: APP_NAME, action: 'checkDbConnection', timestamp: new Date().toISOString(), user: 'system' }
    };
    
    return operationResult;
  }

  operationResult = { 
    success: true, 
    statusCode: StatusCodes.OK, 
    message: 'Esta conectado a la base de datos', 
    data: null,
    error: null,
    app: { name: APP_NAME, action: 'checkDbConnection', timestamp: new Date().toISOString(), user: 'system' }
  };

  return operationResult;
};

export const checkQueryNotEmpty = async (result: IResult<any>): Promise<OperationResult> => {
  let operationResult: OperationResult;
  
  if (!result.recordset || result.recordset.length === 0) {
    operationResult = {
      success: false,
      statusCode: StatusCodes.OK,
      message: 'No se obtuvo información para la consulta solicitada',
      data: null,
      error: null,
      app: { name: APP_NAME, action: 'checkQueryNotEmpty', timestamp: new Date().toISOString(), user: 'system' }
    };

    return operationResult;
  }

  operationResult = {
    success: true,
    statusCode:StatusCodes.OK,
    message: 'La información se obtuvo con éxito',
    data: result.recordset,
    error: null,
    app: { name: APP_NAME, action: 'checkQueryNotEmpty', timestamp: new Date().toISOString(), user: 'system' }
  };

  return operationResult;
};

export const checkTableExists = async (tableName: string): Promise<OperationResult> => {
  let operationResult: OperationResult;

  if (!dbPool) {
    operationResult = { 
      success: false, 
      statusCode: StatusCodes.SERVICE_UNAVAILABLE, 
      message: 'La base de datos no está conectada', 
      data: null,
      error: { description: 'La base de datos no está disponible', code: 503 },
      app: { name: APP_NAME, action: 'checkTableExists', timestamp: new Date().toISOString(), user: 'system' }
    };
    
    return operationResult;
  }

  const result = await dbPool.request().query(`SELECT OBJECT_ID('dbo.${tableName}', 'U') AS TableId`);
  const exists = result.recordset[0]?.TableId;

  if (!exists) {
    operationResult = {
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: `La tabla "${tableName}" no existe en la base de datos`,
      data: null,
      error: { description: `La tabla "${tableName}" no existe en la base de datos`, code: 404 },
      app: { name: APP_NAME, action: 'checkTableExists', timestamp: new Date().toISOString(), user: 'system' }
    };
  }

  operationResult = {
    success: true,
    statusCode: StatusCodes.OK,
    message: `La tabla "${tableName}" existe en la base de datos`,
    data: null,
    error: null,
    app: { name: APP_NAME, action: 'checkTableExists', timestamp: new Date().toISOString(), user: 'system' }
  };

  return operationResult;
};

export const checkColumnExists = async (tableName: string, columnName: string): Promise<OperationResult> => {
  let operationResult: OperationResult;

  if (!dbPool) {
    operationResult = { 
      success: false, 
      statusCode: StatusCodes.SERVICE_UNAVAILABLE, 
      message: 'La base de datos no está conectada', 
      data: null,
      error: { description: 'La base de datos no está disponible', code: 503 },
      app: { name: APP_NAME, action: 'checkColumnExists', timestamp: new Date().toISOString(), user: 'system' }
    };
    
    return operationResult;
  }

  const columnResult = await dbPool.request().query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}' AND COLUMN_NAME = '${columnName}'`);

  if (columnResult.recordset.length === 0) {
    operationResult = {
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: `La columna ${ columnName } no se encontró en la tabla ${ tableName }.`,
      data: null,
      error: { description: `La columna ${ columnName } no se encontró en la tabla ${ tableName }.`, code: 404 },
      app: { name: APP_NAME, action: 'checkColumnExists', timestamp: new Date().toISOString(), user: 'system' }
    };

    return operationResult;
  }

  // validación exitosa.
  operationResult = {
    success: true,
      statusCode: StatusCodes.OK,
      message: `La columna ${ columnName } existe en la tabla ${ tableName }.`,
      data: null,
      error: null,
      app: { name: APP_NAME, action: 'checkColumnExists', timestamp: new Date().toISOString(), user: 'system' }
  };

  return operationResult;
};

export const checkColumnsExists = async (tableName: string, body: any): Promise<OperationResult> => {
  let operationResult: OperationResult;

  if (!dbPool) {
    operationResult = { 
      success: false, 
      statusCode: StatusCodes.SERVICE_UNAVAILABLE, 
      message: 'La base de datos no está conectada', 
      data: null,
      error: { description: 'La base de datos no está disponible', code: 503 },
      app: { name: APP_NAME, action: 'checkColumnsExists', timestamp: new Date().toISOString(), user: 'system' }
    };
    
    return operationResult;
  }

  const columnsResult = await dbPool.request().query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`);
  const validColumns = columnsResult.recordset.map(row => row.COLUMN_NAME);
  const bodyColumns = Object.keys(body);
  const invalidColumns = bodyColumns.filter(key => !validColumns.includes(key));

  if (invalidColumns.length > 0) {
    operationResult = {
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Algunas columnas no es válidas',
      data: null,
      error: { description: 'Algunas columnas no es válidas', code: 400},
      app: { name: APP_NAME, action: 'checkColumnsExists', timestamp: new Date().toISOString(), user: 'system' }
    };

    return operationResult;
  }

  // Validación exitosa
  operationResult = {
    success: true,
    statusCode:StatusCodes.OK,
    message: `Las columnas son válidas`,
    data: null,
    error: null,
    app: { name: APP_NAME, action: 'checkColumnsExists', timestamp: new Date().toISOString(), user: 'system' }
  };

  return operationResult;
}

// Pasar a Business
// export const checkColumnNumber = async (params: any, type: SqlServerDataTypes): Promise<OperationResult> => {
//   let operationResult: OperationResult;

//   const parsedColumn = parseInt(params.id);

//   // Verifica si el Id fue proporcionado
//   if (parsedColumn === undefined || parsedColumn === null) { 
//     operationResult = {
//       success: false,
//       statusCode:StatusCodes.BAD_REQUEST,
//       message: `La columna es requerida`,
//       data: null,
//       error: { description: `La columna es requerida`, code: 400 },
//       app: { name: APP_NAME, action: 'checkColumnNumber', timestamp: new Date().toISOString(), user: 'system' }
//     };

//     return operationResult;
//   }

//   // Verifica si el Id es un número
//   if (isNaN(Number(parsedColumn))) { 
//     operationResult = {
//       success: false,
//       statusCode:StatusCodes.BAD_REQUEST,
//       message: `La columna no es un número`,
//       data: null,
//       error: { description: `La columna no es un número`, code: 400 },
//       app: { name: APP_NAME, action: 'checkColumnNumber', timestamp: new Date().toISOString(), user: 'system' }
//     };

//     return operationResult;
//   }

//   // Verifica si el Id es entero
//   if (type !== "int") {
//     operationResult = {
//       success: false,
//       statusCode:StatusCodes.BAD_REQUEST,
//       message: `La columna no es del tipo de dato ${type}`,
//       data: null,
//       error: { description: `La columna no es del tipo de dato ${type}`, code: 400 },
//       app: { name: APP_NAME, action: 'checkColumnNumber', timestamp: new Date().toISOString(), user: 'system' }
//     };

//     return operationResult;
//   }

//   // Verifica si el Id es un número positivo
//   if (parsedColumn < 1) { 
//     operationResult = {
//       success: false,
//       statusCode:StatusCodes.BAD_REQUEST,
//       message: `La columna debe ser un número positivo`,
//       data: null,
//       error: { description: `La columna debe ser un número positivo`, code: 400 },
//       app: { name: APP_NAME, action: 'checkColumnNumber', timestamp: new Date().toISOString(), user: 'system' }
//     };

//     return operationResult;
//   }

//   // Validación exitosa.
//   operationResult = {
//     success: true,
//     statusCode:StatusCodes.OK,
//     message: `La columna es válida`,
//     data: null,
//     error: null,
//     app: { name: APP_NAME, action: 'checkColumnNumber', timestamp: new Date().toISOString(), user: 'system' }
//   };

//   return operationResult;
// };

// Pasar a Business
// export const checkPrizePool = async (prizePool: any): Promise<OperationResult> => {
//   let operationResult: OperationResult;

//   // Valida si la bolsa fue proporcionada.
//   if (prizePool === undefined || prizePool === null) {
//     operationResult = {
//       success: false,
//       statusCode: StatusCodes.BAD_REQUEST,
//       message: 'La Bolsa del sorteo es requerida',
//       data: null,
//       error: { description: 'La Bolsa del sorteo es requerida', code: 400 },
//       app: { name: APP_NAME, action: 'checkPrizePool', timestamp: new Date().toISOString(), user: 'system' }
//     };

//     return operationResult;
//   }

//   // Valida si la bolsa es un número.
//   if (isNaN(Number(prizePool))) {
//     operationResult = {
//       success: false,
//       statusCode: StatusCodes.BAD_REQUEST,
//       message: 'La Bolsa no es un importe válido',
//       data: null,
//       error: { description: 'La Bolsa no es un importe válido', code: 400 },
//       app: { name: APP_NAME, action: 'checkPrizePool', timestamp: new Date().toISOString(), user: 'system' }
//     };

//     return operationResult;
//   }

//   // Valida si la bolsa es un número positivo.
//   if (prizePool < 0) {
//     operationResult = {
//       success: false,
//       statusCode: StatusCodes.BAD_REQUEST,
//       message: 'La Bolsa debe ser un importe positivo',
//       data: null,
//       error: { description: 'La Bolsa debe ser un importe positivo', code: 400 },
//       app: { name: APP_NAME, action: 'checkPrizePool', timestamp: new Date().toISOString(), user: 'system' }
//     };

//     return operationResult;
//   }

//   // Validación exitosa.
//   operationResult = {
//     success: true,
//     statusCode:StatusCodes.OK,
//     message: `La bolsa es válida`,
//     data: null,
//     error: null,
//     app: { name: APP_NAME, action: 'checkPrizePool', timestamp: new Date().toISOString(), user: 'system' }
//   };

//   return operationResult;
// };

// Pasar a Business
// export const checkDrawDate = async (drawDate: any): Promise<OperationResult> => {
//   let operationResult: OperationResult;

//   // Valida si la fecha fue proporcionada.
//   if (drawDate === undefined || drawDate === null) {
//     operationResult = {
//       success: false,
//       statusCode: StatusCodes.BAD_REQUEST,
//       message: 'La Fecha del sorteo es querida',
//       data: null,
//       error: { description: 'La Fecha del sorteo es querida', code: 400 },
//       app: { name: APP_NAME, action: 'checkDrawDate', timestamp: new Date().toISOString(), user: 'system' }
//     };

//     return operationResult;
//   }

//   // Valida si la fecha es una fecha válida.
//   if (isNaN(Date.parse(drawDate))) {
//     operationResult = {
//       success: false,
//       statusCode: StatusCodes.BAD_REQUEST,
//       message: 'La Fecha del sorteo no tiene un formato válido',
//       data: null,
//       error: { description: 'La Fecha del sorteo no tiene un formato válido', code: 400 },
//       app: { name: APP_NAME, action: 'checkDrawDate', timestamp: new Date().toISOString(), user: 'system' }
//     };

//     return operationResult;
//   }

//   // Valida si la fecha es anterior a la fecha actual.
//   if (Date.now() < drawDate) {
//     operationResult = {
//       success: false,
//       statusCode: StatusCodes.BAD_REQUEST,
//       message: 'La Fecha del sorteo no puede ser posterior a la fecha actual',
//       data: null,
//       error: { description: 'La Fecha del sorteo no puede ser posterior a la fecha actual', code: 400 },
//       app: { name: APP_NAME, action: 'checkDrawDate', timestamp: new Date().toISOString(), user: 'system' }
//     };

//     return operationResult;
//   }

//   // Validación exitosa.
//   operationResult = {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: 'La Fecha es válida',
//     data: null,
//     error: null,
//     app: { name: APP_NAME, action: 'checkDrawDate', timestamp: new Date().toISOString(), user: 'system' }
//   };

//   return operationResult;
// };

export const checkCreateRowsAffected = async (rowsAffected: number): Promise<OperationResult> => {
  let operationResult: OperationResult;

  // Valida si hubo registros afectados.
  if (rowsAffected === 0) {
    operationResult = {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'No se pudo insertar el registro.',
      data: null,
      error: { description: 'La operación de inserción no afectó ninguna fila.', code: 1003 },
      app: { name: APP_NAME, action: 'checkCreateRowsAffected', timestamp: new Date().toISOString(), user: 'system' }
    };

    return operationResult;
  }

  // Respuesta exitosa.
  operationResult = {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'El registro fue agregado en forma éxitosa.',
    data: null,
    error: null,
    app: { name: APP_NAME, action: 'checkRowsAffected', timestamp: new Date().toISOString(), user: 'system' }
  };

  return operationResult;
};

export const checkUpdateRowsAffected = async (rowsAffected: number): Promise<OperationResult> => {
  let operationResult: OperationResult;

  // Valida si hubo registros afectados.
  if (rowsAffected === 0) {
    operationResult = {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'No se pudo modificar el registro.',
      data: null,
      error: { description: 'La operación de modificación no afectó ninguna fila.', code: 1003 },
      app: { name: APP_NAME, action: 'checkUpdateRowsAffected', timestamp: new Date().toISOString(), user: 'system' }
    };

    return operationResult;
  }

  // Respuesta exitosa.
  operationResult = {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'El registro fue agregado en forma éxitosa.',
    data: null,
    error: null,
    app: { name: APP_NAME, action: 'checkRowsAffected', timestamp: new Date().toISOString(), user: 'system' }
  };

  return operationResult;
};

export const checkDeleteRowsAffected = async (rowsAffected: number): Promise<OperationResult> => {
  let operationResult: OperationResult;

  // Valida si hubo registros afectados.
  if (rowsAffected === 0) {
    operationResult = {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'No se pudo eliminar el registro.',
      data: null,
      error: { description: 'La operación de eliminación no afectó ninguna fila.', code: 1003 },
      app: { name: APP_NAME, action: 'checkDeleteRowsAffected', timestamp: new Date().toISOString(), user: 'system' }
    };

    return operationResult;
  }

  // Respuesta exitosa.
  operationResult = {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'El registro fue agregado en forma éxitosa.',
    data: null,
    error: null,
    app: { name: APP_NAME, action: 'checkRowsAffected', timestamp: new Date().toISOString(), user: 'system' }
  };

  return operationResult;
};

// Pasar a Business
// export const checkFormatAndUniqueNumbers = async (body:any): Promise<OperationResult> => {
//   let operationResult: OperationResult;
//   let numberPair: NumberPair;
//   numberPair = { Numero1: body.Numero1, Numero2: body.Numero2, Numero3: body.Numero3, Numero4: body.Numero4, Numero5: body.Numero5, Numero6: body.Numero6, Numero7: body.Numero7 };

//   const entries = Object.entries(numberPair);

//   for (const [key, value] of entries) {
//     // Verifica si los números fueron proporcionados
//     if (value === undefined || value === null) {



//       operationResult = {
//         success: false,
//         statusCode: StatusCodes.BAD_REQUEST,
//         message: `${key.charAt(0).toUpperCase() + key.slice(1)} es requerido`,
//         data: null,
//         error: { description: `${key.charAt(0).toUpperCase() + key.slice(1)} es requerido`, code: 400 },
//         app: { name: APP_NAME, action: 'checkFormatAndUniqueNumbers', timestamp: new Date().toISOString(), user: 'system' }
//       };

//       return operationResult;
//       //return { success: false, statusCode: StatusCodes.BAD_REQUEST, message: `${key.charAt(0).toUpperCase() + key.slice(1)} es requerido` };
//     }

//     // Verifica si los datos proporcionados son números
//     if (isNaN(Number(value))) {
//       operationResult = {
//         success: false,
//         statusCode: StatusCodes.BAD_REQUEST,
//         message: `${key.charAt(0).toUpperCase() + key.slice(1)} no es un número`,
//         data: null,
//         error: { description: `${key.charAt(0).toUpperCase() + key.slice(1)} no es un número`, code: 400 },
//         app: { name: APP_NAME, action: 'checkFormatAndUniqueNumbers', timestamp: new Date().toISOString(), user: 'system' }
//       };

//       return operationResult;
//       //return { success: false, statusCode: StatusCodes.BAD_REQUEST, message: `${key.charAt(0).toUpperCase() + key.slice(1)} no es un número` };
//     }

//     // Verifica que los números sean únicos
//     const values = entries.map(([_, value]) => value);
//     const seen = new Set<number>();

//     for (let i = 0; i < values.length; i++) {
//       if (seen.has(values[i])) { 
//         operationResult = {
//           success: false,
//           statusCode: StatusCodes.BAD_REQUEST,
//           message: `Numero${i + 1} debe ser único`,
//           data: null,
//           error: { description: `Numero${i + 1} debe ser único`, code: 400 },
//           app: { name: APP_NAME, action: 'checkFormatAndUniqueNumbers', timestamp: new Date().toISOString(), user: 'system' }
//         };

//         seen.add(values[i]);

//         return operationResult;
//       };

//       //return { success: false, statusCode: StatusCodes.BAD_REQUEST, message: `Numero${i + 1} debe ser único` }; }
      
//     };
//   };

//   // Respuesta exitosa.
//   operationResult = {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: 'Los números del 1 al 7 son válidos',
//     data: null,
//     error: null,
//     app: { name: APP_NAME, action: 'checkFormatAndUniqueNumbers', timestamp: new Date().toISOString(), user: 'system' }
//   };

//   return operationResult;
// };