import { LOG_DRAW_CODES } from "../constants/logCodes";
import { checkColumnNumber, checkDrawDate, checkFormatAndUniqueNumbers, checkPrizePool } from "../middlewares/validationsBusiness";
import { OperationResult } from "../models/models";
import { createDrawQuery, deleteDrawQuery, getAllDrawsQuery, getDrawByIdQuery, updateDrawQuery } from "../repositories/draw.repository";
import { handleServiceError } from "../utils/errorServiceHandler";
import { Logger } from "../utils/logger";

export const getAllDrawsService = async (user: string): Promise<OperationResult> => {
  let operationResult: OperationResult;

  try {
    Logger.log("draw.services", "getAllDrawsService()", `Usuario: (${user}) inició la operación`, LOG_DRAW_CODES.GET_ALL_SUCCESS, user );
    operationResult = await getAllDrawsQuery(user);

    if (!operationResult.success) {
      Logger.error("draw.services", "getAllDrawsService()", operationResult.message, operationResult.error, LOG_DRAW_CODES.GET_ALL_ERROR, user);
      return operationResult;
    }

    Logger.log("draw.services", "getAllDrawsService()", operationResult.message, LOG_DRAW_CODES.GET_ALL_SUCCESS, user);
    return operationResult;
  } catch (error: any) {
    Logger.error("draw.services", "getAllDrawsService()", error.message, error, LOG_DRAW_CODES.GET_ALL_ERROR, user);
    return handleServiceError({ error, action: "getAllDrawsService()", user: user });
  }
};

export const getDrawByIdService = async (params: any, user: string): Promise<OperationResult> => {
  let operationResult: OperationResult;

  try {
    Logger.log("draw.services", "getDrawByIdService()", `Usuario: (${user}) inició la operación`, LOG_DRAW_CODES.GET_BY_ID_SUCCESS, user);
    // Valida el tipo de dato de la columna "id".
    operationResult = await checkColumnNumber("id", params);
    if (!operationResult.success) {
      Logger.error("draw.services", "getDrawByIdService()", operationResult.message, operationResult.error, LOG_DRAW_CODES.GET_BY_ID_ERROR, user);
      return operationResult;
    }

    operationResult = await getDrawByIdQuery(params, user);
    if (!operationResult.success) {
      Logger.error("draw.services", "getDrawByIdService()", operationResult.message, operationResult.error, LOG_DRAW_CODES.GET_BY_ID_ERROR, user);
      return operationResult;
    }

    Logger.log("draw.services", "getDrawByIdService()", operationResult.message, LOG_DRAW_CODES.GET_BY_ID_SUCCESS, user);
    return operationResult;
  } catch (error: any) {
    Logger.error("draw.services", "getDrawByIdService()", error.message, error, LOG_DRAW_CODES.GET_BY_ID_ERROR, user);
    return handleServiceError({ error, action: "getDrawByIdService()", user: user });
  }
};

export const createDrawService = async (body: any, user: string): Promise<OperationResult> => {
  let operationResult: OperationResult;

  try {
    Logger.log("draw.services", "createDrawService()", `Usuario: (${user}) inició la operación`, LOG_DRAW_CODES.CREATE_SUCCESS, user);
    // Valida los números.
    operationResult = await checkFormatAndUniqueNumbers(body);
    if (!operationResult.success) {
      Logger.error("draw.services", "createDrawService()", operationResult.message, operationResult.error, LOG_DRAW_CODES.CREATE_ERROR, user);
      return operationResult;
    }

    // Valida la bolsa.
    operationResult = await checkPrizePool("Bolsa", body);
    if (!operationResult.success) {
      Logger.error("draw.services", "createDrawService()", operationResult.message, operationResult.error, LOG_DRAW_CODES.CREATE_ERROR, user);
      return operationResult;
    }

    // Valida la fecha.
    operationResult = await checkDrawDate("Fecha", body);
    if (!operationResult.success) {
      Logger.error("draw.services", "createDrawService()", operationResult.message, operationResult.error, LOG_DRAW_CODES.CREATE_ERROR, user);
      return operationResult;
    }

    operationResult = await createDrawQuery(body, user);
    if (!operationResult.success) {
      Logger.log("draw.services", "createDrawService()", operationResult.message, LOG_DRAW_CODES.CREATE_ERROR, user);
      return operationResult;
    }

    Logger.log("draw.services", "createDrawService()", operationResult.message, LOG_DRAW_CODES.CREATE_SUCCESS, user);
    return operationResult;
  } catch (error: any) {
    Logger.error("draw.services", "createDrawService()", error.message, error, LOG_DRAW_CODES.CREATE_ERROR, user);
    return handleServiceError({ error, action: "createDrawService()", user: user });
  }
};

export const updateDrawService = async (body: any, params: any, user: string): Promise<OperationResult> => {
  let operationResult: OperationResult;

  try {
    Logger.log("draw.services", "updateDrawService()", `Usuario: (${user}) inició la operación`, LOG_DRAW_CODES.UPDATE_SUCCESS, user);
    // Valida el tipo de dato de la columna "id".
    operationResult = await checkColumnNumber("id", params);
    if (!operationResult.success) {
      Logger.error("draw.services", "updateDrawService()", operationResult.message, operationResult.error, LOG_DRAW_CODES.UPDATE_ERROR, user);
      return operationResult;
    }

    // Valida los números.
    operationResult = await checkFormatAndUniqueNumbers(body);
    if (!operationResult.success) {
      Logger.error("draw.services", "updateDrawService()", operationResult.message, operationResult.error, LOG_DRAW_CODES.UPDATE_ERROR, user);
      return operationResult;
    }

    // Valida la bolsa.
    operationResult = await checkPrizePool("Bolsa", body);
    if (!operationResult.success) {
      Logger.error("draw.services", "updateDrawService()", operationResult.message, operationResult.error, LOG_DRAW_CODES.UPDATE_ERROR, user);
      return operationResult;
    }

    // Valida la fecha.
    operationResult = await checkDrawDate("Fecha", body);
    if (!operationResult.success) {
      Logger.error("draw.services", "updateDrawService()", operationResult.message, operationResult.error, LOG_DRAW_CODES.UPDATE_ERROR, user);
      return operationResult;
    }

    operationResult = await updateDrawQuery(body, params, user);
    if(!operationResult.success) {
      Logger.error("draw.services", "updateDrawService()", operationResult.message, operationResult.error, LOG_DRAW_CODES.UPDATE_ERROR, user);
      return operationResult;
    }

    Logger.log("draw.services", "updateDrawService()", operationResult.message, LOG_DRAW_CODES.UPDATE_SUCCESS, user);
    return operationResult;
  } catch (error: any) {
    Logger.error("draw.services", "updateDrawService()", error.message, error, LOG_DRAW_CODES.UPDATE_ERROR, user);
    return handleServiceError({ error, action: "updateDrawService()", user: user });
  }
};

export const deleteDrawService = async (params: any, user: string): Promise<OperationResult> => {
  let operationResult: OperationResult;

  try {
    Logger.log("draw.services", "deleteDrawService()", `Usuario: (${user}) inició la operación`, LOG_DRAW_CODES.DELETE_SUCCESS, user);
    // Valida el tipo de dato de la columna "id".
    operationResult = await checkColumnNumber("id", params);
    if (!operationResult.success) {
      Logger.error("draw.services", "deleteDrawService()", operationResult.message, operationResult.error, LOG_DRAW_CODES.DELETE_ERROR, user);
      return operationResult;
    }

    operationResult = await deleteDrawQuery(params, user);
    if (!operationResult.success) {
      Logger.error("draw.services", "deleteDrawService()", operationResult.message, operationResult.error, LOG_DRAW_CODES.DELETE_ERROR, user);
      return operationResult;
    }

    Logger.log("draw.services", "deleteDrawService()", operationResult.message, LOG_DRAW_CODES.DELETE_SUCCESS, user);
    return operationResult;
  } catch (error: any) {
    Logger.error("draw.services", "deleteDrawService()", error.message, error, LOG_DRAW_CODES.DELETE_ERROR, user);
    return handleServiceError({ error, action: "deleteDrawService", user: user });
  }
};
