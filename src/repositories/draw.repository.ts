import { dbPool } from '../server';
import { checkColumnExists, checkColumnsExists, checkCreateRowsAffected, checkDbConnection, checkDeleteRowsAffected, checkQueryNotEmpty, checkTableExists, checkUpdateRowsAffected } from '../middlewares/validationsDatabase';
import { OperationResult } from '../models/models';
import { DateTime, Decimal, Int } from 'mssql';
import { handleRepositoryError } from '../utils/errorRepositoryHandler';
import { Logger } from '../utils/logger';
import { LOG_DRAW_CODES } from '../constants/logCodes';

export const getAllDrawsQuery = async (user: string): Promise<OperationResult> => {
  let operationResult: OperationResult;

  try {
    Logger.log("draw.repository", "getAllDrawsQuery()", `Usuario: (${user}) inició la operación`, LOG_DRAW_CODES.GET_ALL_SUCCESS, user );
    // Valida la conexión a la base de datos.
    operationResult = checkDbConnection();
    if (!operationResult.success) {
      Logger.error("draw.repository", "getAllDrawsQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.GET_ALL_ERROR, user);
      return operationResult;
    }

    // Valida la existencia de la tabla "Sorteos".
    operationResult = await checkTableExists('Sorteos');
    if (!operationResult.success) {
      Logger.error("draw.repository", "getAllDrawsQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.GET_ALL_ERROR, user);
      return operationResult;
    }

    const result = await dbPool
      .request()
      .query(`SELECT Id, Numero1, Numero2, Numero3, Numero4, Numero5, Numero6, Numero7, Bolsa, Fecha FROM dbo.Sorteos ORDER BY Id DESC`);
    
    // Valida si no obtuvo información.
    operationResult = await checkQueryNotEmpty(result);
    if (!operationResult.success) {
      Logger.error("draw.repository", "getAllDrawsQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.GET_ALL_ERROR, user);
      return operationResult;
    }

    // Respuesta exitosa.
    operationResult.message = 'La información de los sorteos se obtuvo con éxito';
    Logger.log("draw.repository", "getAllDrawsQuery()", operationResult.message, LOG_DRAW_CODES.GET_ALL_SUCCESS, user);
    return operationResult;
  }
  catch (error: any) {
    Logger.error("draw.repository", "getAllDrawsQuery()", error.message, error, LOG_DRAW_CODES.GET_ALL_ERROR, user);
    return handleRepositoryError({ error, action: 'getAllDrawsQuery()', user: user });
  }
};

export const getDrawByIdQuery = async (params: any, user: string): Promise<OperationResult> => {
  let operationResult: OperationResult;

  try {
    Logger.log("draw.repository", "getDrawByIdQuery()", `Usuario: (${user}) inició la operación`, LOG_DRAW_CODES.GET_BY_ID_SUCCESS, user );
    // Valida la conexión a la base de datos.
    operationResult = checkDbConnection();
    if (!operationResult.success) {
      Logger.error("draw.repository", "getDrawByIdQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.GET_BY_ID_ERROR, user);
      return operationResult;
    }

    // Valida la existencia de la tabla "Sorteos".
    operationResult = await checkTableExists('Sorteos');
    if (!operationResult.success) {
      Logger.error("draw.repository", "getDrawByIdQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.GET_BY_ID_ERROR, user);
      return operationResult;
    }

    // Valida existencia de la columna "Id".
    operationResult = await checkColumnExists('Sorteos', 'Id');
    if (!operationResult.success) {
      Logger.error("draw.repository", "getDrawByIdQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.GET_BY_ID_ERROR, user);
      return operationResult;
    }

    const result = await dbPool.request()
      .input('Id', Int, parseInt(params.id))
      .query(`SELECT Id, Numero1, Numero2, Numero3, Numero4, Numero5, Numero6, Numero7, Bolsa, Fecha FROM dbo.Sorteos WHERE Id = @Id`);
  
    // Valida si no obtuvo información.
    operationResult = await checkQueryNotEmpty(result);
    if (!operationResult.success) {
      Logger.error("draw.repository", "getDrawByIdQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.GET_BY_ID_ERROR, user);
      return operationResult;
    }      

    // Respuesta exitosa.
    operationResult.message = `La información del sorteo ${parseInt(params.id)} se obtuvo con éxito`;
    Logger.log("draw.repository", "getDrawByIdQuery()", operationResult.message, LOG_DRAW_CODES.GET_BY_ID_SUCCESS, user);
    return operationResult;
  }
  catch (error: any) {
    Logger.error("draw.repository", "getDrawByIdQuery()", error.message, error, LOG_DRAW_CODES.GET_BY_ID_ERROR, user);
    return handleRepositoryError({ error, action: 'getDrawByIdQuery()', user: user });
  }
};

export const createDrawQuery = async (body: any, user: string): Promise<OperationResult> => {
  let operationResult: OperationResult;

  try {
    Logger.log("draw.repository", "createDrawQuery()", `Usuario: (${user}) inició la operación`, LOG_DRAW_CODES.CREATE_SUCCESS, user );
    // Valida la conexión a la base de datos.
    operationResult = checkDbConnection();
    if (!operationResult.success) {
      Logger.error("draw.repository", "createDrawQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.CREATE_ERROR, user);
      return operationResult;
    }

    // Valida la existencia de la tabla "Sorteos".
    operationResult = await checkTableExists('Sorteos');
    if (!operationResult.success) {
      Logger.error("draw.repository", "createDrawQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.CREATE_ERROR, user);
      return operationResult;
    }

    // Valida la existencia de las columnas.
    operationResult = await checkColumnsExists('Sorteos', body);
    if (!operationResult.success) {
      Logger.error("draw.repository", "createDrawQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.CREATE_ERROR, user);
      return operationResult;
    }

    const result = await dbPool.request()
      .input('Id', Int, body.Id)
      .input('Numero1', Int, body.Numero1)
      .input('Numero2', Int, body.Numero2)
      .input('Numero3', Int, body.Numero3)
      .input('Numero4', Int, body.Numero4)
      .input('Numero5', Int, body.Numero5)
      .input('Numero6', Int, body.Numero6)
      .input('Numero7', Int, body.Numero7)
      .input('Bolsa', Decimal, body.Bolsa)
      .input('Fecha', DateTime, body.Fecha)
      .query(`INSERT INTO dbo.Sorteos (Id,  Numero1,  Numero2,  Numero3,  Numero4,  Numero5,  Numero6,  Numero7,  Bolsa,  Fecha) 
                                VALUES (@Id, @Numero1, @Numero2, @Numero3, @Numero4, @Numero5, @Numero6, @Numero7, @Bolsa, @Fecha)`);

    const rowsAffected = result.rowsAffected?.[0] || 0;

    // Valida si hubo registros afectados.
    operationResult = await checkCreateRowsAffected(rowsAffected);
    if (!operationResult.success) {
      Logger.error("draw.repository", "createDrawQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.CREATE_ERROR, user);
      return operationResult;
    }

    // Respuesta exitosa.
    operationResult.message = 'El sorteo fue agregado en forma exitosa';
    Logger.log("draw.repository", "createDrawQuery()", operationResult.message, LOG_DRAW_CODES.CREATE_SUCCESS, user);
    return operationResult;
  }
  catch (error: any) {
    Logger.error("draw.repository", "createDrawQuery()", error.message, error, LOG_DRAW_CODES.CREATE_ERROR, user);
    return handleRepositoryError({ error, action: 'createDrawQuery()', user: user });
  }
};

export const updateDrawQuery = async (body: any, params: any, user: string): Promise<OperationResult> => {
  let operationResult: OperationResult;

  try {
    Logger.log("draw.repository", "updateDrawQuery()", `Usuario: (${user}) inició la operación`, LOG_DRAW_CODES.UPDATE_SUCCESS, user );
    // Valida la conexión a la base de datos.
    operationResult = checkDbConnection();
    if (!operationResult.success) {
      Logger.error("draw.repository", "updateDrawQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.UPDATE_ERROR, user);
      return operationResult;
    }

    // Valida la existencia de la tabla "Sorteos".
    operationResult = await checkTableExists('Sorteos');
    if (!operationResult.success) {
      Logger.error("draw.repository", "updateDrawQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.UPDATE_ERROR, user);
      return operationResult;
    }

    // Valida la existencia de las columnas.
    operationResult = await checkColumnsExists('Sorteos', body);
    if (!operationResult.success) {
      Logger.error("draw.repository", "updateDrawQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.UPDATE_ERROR, user);
      return operationResult;
    }

    // Valida existencia de la columna "Id".
    operationResult = await checkColumnExists('Sorteos', 'Id');
    if (!operationResult.success) {
      Logger.error("draw.repository", "updateDrawQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.UPDATE_ERROR, user);
      return operationResult;
    }

    // Modificar sorteo
    const result = await dbPool.request()
      .input('Id', Int, params.id)
      .input('Numero1', Int, body.Numero1)
      .input('Numero2', Int, body.Numero2)
      .input('Numero3', Int, body.Numero3)
      .input('Numero4', Int, body.Numero4)
      .input('Numero5', Int, body.Numero5)
      .input('Numero6', Int, body.Numero6)
      .input('Numero7', Int, body.Numero7)
      .input('Bolsa', Decimal, body.Bolsa)
      .input('Fecha', DateTime, body.Fecha)
      .query(`
        UPDATE dbo.Sorteos 
        SET    Numero1 = @Numero1, Numero2 = @Numero2, Numero3 = @Numero3,
              Numero4 = @Numero4, Numero5 = @Numero5, Numero6 = @Numero6,
              Numero7 = @Numero7, Bolsa = @Bolsa, Fecha = @Fecha
        WHERE  Id = @Id
      `);

    const rowsAffected = result.rowsAffected?.[0] || 0;

    // Valida si hubo registros afectados.
    operationResult = await checkUpdateRowsAffected(rowsAffected);
    if (!operationResult.success) {
      Logger.error("draw.repository", "updateDrawQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.UPDATE_ERROR, user);
      return operationResult;
    }

    // Respuesta exitosa.
    operationResult.message = `El sorteo ${ parseInt(params.id) } fue modificado con éxito`;
    Logger.log("draw.repository", "updateDrawQuery()", operationResult.message, LOG_DRAW_CODES.UPDATE_SUCCESS, user);
    return operationResult;
  }
  catch (error: any) {
    Logger.error("draw.repository", "updateDrawQuery()", error.message, error, LOG_DRAW_CODES.UPDATE_ERROR, user);
    return handleRepositoryError({ error, action: 'updateDrawQuery()', user: user });
  }
};

export const deleteDrawQuery = async (params: any, user: string): Promise<OperationResult> => {
  let operationResult: OperationResult;

  try {
    Logger.log("draw.repository", "deleteDrawQuery()", `Usuario: (${user}) inició la operación`, LOG_DRAW_CODES.DELETE_SUCCESS, user );
    // Valida la conexión a la base de datos.
    operationResult = checkDbConnection();
    if (!operationResult.success) {
      Logger.error("draw.repository", "deleteDrawQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.DELETE_ERROR, user);
      return operationResult;
    }

    // Valida la existencia de la tabla "Sorteos".
    operationResult = await checkTableExists('Sorteos');
    if (!operationResult.success) {
      Logger.error("draw.repository", "deleteDrawQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.DELETE_ERROR, user);
      return operationResult;
    }

    // Valida existencia de la columna "Id".
    operationResult = await checkColumnExists('Sorteos', 'Id');
    if (!operationResult.success) {
      Logger.error("draw.repository", "deleteDrawQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.DELETE_ERROR, user);
      return operationResult;
    }

    // Ejecutar eliminación
    const result = await dbPool.request()
      .input('Id', Int, parseInt(params.id))
      .query(`DELETE 
              FROM   dbo.Sorteos 
              WHERE  Id = @Id`);

    const rowsAffected = result.rowsAffected?.[0] || 0;

    // Valida si hubo registros afectados.
    operationResult = await checkDeleteRowsAffected(rowsAffected);
    if (!operationResult.success) {
      Logger.error("draw.repository", "deleteDrawQuery()", operationResult.message, operationResult.error, LOG_DRAW_CODES.DELETE_ERROR, user);
      return operationResult;
    }

    // Respuesta exitosa.
    operationResult.message = `El sorteo ${ parseInt(params.id) } fue eliminado con éxito`;
    Logger.log("draw.repository", "deleteDrawQuery()", operationResult.message, LOG_DRAW_CODES.DELETE_SUCCESS, user);
    return operationResult;
  }
  catch (error: any) {
    Logger.error("draw.repository", "deleteDrawQuery()", error.message, error, LOG_DRAW_CODES.DELETE_ERROR, user);
    return handleRepositoryError({ error, action: 'deleteDrawQuery()', user: user });
  }
};
