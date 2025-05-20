import { Request, Response } from 'express';
import { handleSqlError } from '../utils/sqlErrorHandler';
import { createDrawService, deleteDrawService, getAllDrawsService, getDrawByIdService, updateDrawService } from '../services/draw.services';
import { OperationResult, IUserService } from '../models/models';
import { handleInternalError } from '../utils/dbValidations';
import { UserService } from '../services/user.services';
import { Logger } from '../utils/logger';
import { LOG_DRAW_CODES } from '../constants/logCodes';

const getUser = (res: Response): string => {
  const userService: IUserService = new UserService();
  const user =  userService.getCurrentUser();

  try {
    Logger.log('draws.controller', 'getUser()', `El usuario (${ user }) se obtuvo de forma exitosa`, LOG_DRAW_CODES.GET_USER_SUCCESS, user);

    return user;
  }
  catch (error: any) {
    Logger.error('draws.controller', 'getUser()', `Error al obtener usuario: ${error.message}`, error, LOG_DRAW_CODES.GET_USER_ERROR, user);
    if (!handleSqlError(res, error)) { handleInternalError(res, 'Obtener usuario', error); }
    return 'anonymous';
  }
};

//#region   <<<   I m p l e m e n t a c i ó n   d e l   C R U D   >>>
export const getAllDraw = async (req: Request, res: Response): Promise<void> => {
  let user = 'anonymous';

  try {
    user = getUser(res);

    Logger.log('draws.controller', 'getAllDraw()', `Usuario: (${user}) inició la operación`, LOG_DRAW_CODES.GET_USER_SUCCESS, user);
    let operationResult: OperationResult;

    // Realiza la consulta de los sorteos.
    operationResult = await getAllDrawsService(user);
    if (!operationResult.success) { 
      Logger.error('draws.controller', 'getAllDraw()', `Fallo: ${operationResult.message}`, operationResult.error, LOG_DRAW_CODES.GET_ALL_ERROR, user);

      res.status(operationResult.statusCode).json(operationResult); 
      return; 
    }

    // Respuesta exitosa.
    Logger.log('draws.controller', 'getAllDraw()', `Éxito: ${operationResult.message}`, LOG_DRAW_CODES.GET_ALL_SUCCESS, user);
    res.status(operationResult.statusCode).json(operationResult);
    return;
  } catch (error: any) {
    Logger.error('draws.controller', 'getAllDraw()', `Error: ${error.message}`, error, LOG_DRAW_CODES.GET_ALL_ERROR, user);
    if (!handleSqlError(res, error)) {
      handleInternalError(res, 'Obtener sorteos', error);
    }
  }
};

export const getDrawById = async (req: Request, res: Response): Promise<void> => {
  let user = 'anonymous';

  try {
    user = getUser(res);

    Logger.log('draws.controller', 'getDrawById()', `Usuario: (${user}) inició la operación`, LOG_DRAW_CODES.GET_USER_SUCCESS, user);
    let operationResult: OperationResult;

    // Realiza la consulta del sorteo.
    operationResult = await getDrawByIdService(req.params, user);
    if (!operationResult.success) { 
      Logger.error('draws.controller', 'getDrawById()', `Fallo: ${operationResult.message}`, operationResult.error, LOG_DRAW_CODES.GET_BY_ID_ERROR, user);
      res.status(operationResult.statusCode).json(operationResult); 
      return; 
    }

    // Respuesta exitosa.
    Logger.log('draws.controller', 'getDrawById()', `Éxito: ${operationResult.message}`, LOG_DRAW_CODES.GET_BY_ID_SUCCESS, user);
    res.status(operationResult.statusCode).json(operationResult);
    return;
  } catch (error: any) {
    Logger.error('draws.controller', 'getDrawById()', `Error: ${error.message}`, error, LOG_DRAW_CODES.GET_BY_ID_ERROR, user);
    if (!handleSqlError(res, error)) {
      handleInternalError(res, 'Obtener sorteo', error);
    }
  }
};

export const createDraw = async (req: Request, res: Response): Promise<void> => {
  let user = 'anonymous';

  try {
    user = getUser(res);

    Logger.log('draws.controller', 'createDraw()', `Usuario: (${user}) inició la operación`, LOG_DRAW_CODES.GET_USER_SUCCESS, user);
    let operationResult: OperationResult;

    // Inserta el nuevo sorteo.
    operationResult = await createDrawService(req.body, user);
    if (!operationResult.success) { 
      Logger.error('draws.controller', 'createDraw()', `Fallo: ${operationResult.message}`, operationResult.error, LOG_DRAW_CODES.CREATE_ERROR, user);
      res.status(operationResult.statusCode).json(operationResult); 
      return; 
    }

    // Respuesta exitosa.
    Logger.log('draws.controller', 'createDraw()', `Éxito: ${operationResult.message}`, LOG_DRAW_CODES.CREATE_SUCCESS, user);
    res.status(operationResult.statusCode).json(operationResult);
    return;
  } catch (error: any) {
    Logger.error('draws.controller', 'createDraw()', `Error: ${error.message}`, error, LOG_DRAW_CODES.CREATE_ERROR, user);
    if (!handleSqlError(res, error)) {
      handleInternalError(res, 'Insertar sorteos', error);
    }
  }
};

export const updateDraw = async (req: Request, res: Response): Promise<void> => {
  let user = 'anonymous';

  try {
    user = getUser(res);

    Logger.log('draws.controller', 'updateDraw()', `Usuario: (${user}) inició la operación`, LOG_DRAW_CODES.GET_USER_SUCCESS, user);
    let operationResult: OperationResult;

    // Modifica el sorteo.
    operationResult = await updateDrawService(req.body, req.params, user);
    if (!operationResult.success) { 
      Logger.error('draws.controller', 'updateDraw()', `Fallo: ${operationResult.message}`, operationResult.error, LOG_DRAW_CODES.UPDATE_ERROR, user);
      res.status(operationResult.statusCode).json(operationResult); 
      return; 
    }

    // Respuesta exitosa.
    Logger.log('draws.controller', 'updateDraw()', `Éxito: ${operationResult.message}`, LOG_DRAW_CODES.UPDATE_SUCCESS, user);
    res.status(operationResult.statusCode).json(operationResult);
    return;
  } catch (error: any) {
    if (!handleSqlError(res, error)) {
      Logger.error('draws.controller', 'updateDraw()', `Error: ${error.message}`, error, LOG_DRAW_CODES.UPDATE_ERROR, user);
      handleInternalError(res, 'Modificar sorteos', error);
    }
  }
};

export const deleteDraw = async (req: Request, res: Response): Promise<void> => {
  let user = 'anonymous';

  try {
    user = getUser(res);

    Logger.log('draws.controller', 'deleteDraw()', `Usuario: (${user}) inició la operación`, LOG_DRAW_CODES.GET_USER_SUCCESS, user);
    let operationResult: OperationResult;

    // Elimina el sorteo.
    operationResult = await deleteDrawService(req.params, user);
    if (!operationResult.success) { 
      Logger.error('draws.controller', 'deleteDraw()', `Fallo: ${operationResult.message}`, operationResult.error, LOG_DRAW_CODES.DELETE_ERROR, user);
      res.status(operationResult.statusCode).json(operationResult); 
      return; 
    }
    
    // Respuesta exitosa.
    Logger.log('draws.controller', 'deleteDraw()', `Éxito: ${operationResult.message}`, LOG_DRAW_CODES.DELETE_SUCCESS, user);
    res.status(operationResult.statusCode).json(operationResult);
    return;
  } catch (error: any) {
    Logger.error('draws.controller', 'deleteDraw()', `Error: ${error.message}`, error, LOG_DRAW_CODES.DELETE_ERROR, user);
    if (!handleSqlError(res, error)) {
      handleInternalError(res, 'Eliminar sorteos', error);
    }
  }
};
//#endregion
