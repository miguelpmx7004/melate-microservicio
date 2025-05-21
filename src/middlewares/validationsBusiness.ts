import { StatusCodes } from "http-status-codes";
import { SqlServerDataTypes } from "../enums";
import { NumberPair, OperationResult } from "../models/models";
import { APP_NAME } from "../constants/constants";

/**
 * checkColumnProvided: Verifica si una columna específica fue proporcionada en los parámetros recibidos.
 * 
 * @param {string} columnName - El nombre de la columna que se espera esté presente en el objeto `params`.
 * @param {any} params - El objeto que contiene los valores enviados, normalmente una petición o DTO.
 * @returns {Promise<OperationResult>} Resultado de la validación: success = true si fue proporcionada, success = false si no.
 */
export const checkColumnProvided = async (columnName: string, params: any): Promise<OperationResult> => {
  let operationResult: OperationResult;

  const parsedColumn = parseInt(params[columnName]);

  // Verifica si el Id fue proporcionado
  if (parsedColumn === undefined || parsedColumn === null) { 
    operationResult = {
      success: false,
      statusCode:StatusCodes.BAD_REQUEST,
      message: `La columna ${ columnName } es requerida`,
      data: null,
      error: { description: `La columna ${ columnName } es requerida`, code: 400 },
      app: { name: APP_NAME, action: 'checkColumnNumber', timestamp: new Date().toISOString(), user: 'system' }
    };

    return operationResult;
  }

  // Validación exitosa.
  operationResult = {
    success: true,
    statusCode:StatusCodes.OK,
    message: `La columna si fue proporcinada`,
    data: null,
    error: null,
    app: { name: APP_NAME, action: 'checkColumnNumber', timestamp: new Date().toISOString(), user: 'system' }
  };

  return operationResult;
};

/**
 * checkColumnNumber: Verifica si una columna específica es un número.
 * 
 * @param {string} columnName - El nombre de la columna que se espera esté presente en el objeto `params`.
 * @param {any} params - El objeto que contiene los valores enviados, normalmente una petición o DTO.
 * @returns {Promise<OperationResult>} Resultado de la validación: success = true si fue proporcionada, success = false si no.
 */
export const checkColumnNumber = async (columnName: string, params: any): Promise<OperationResult> => {
  let operationResult: OperationResult;

  const parsedColumn = parseInt(params[columnName]);

  // Valida si la columna fue proporcionada.
  operationResult = await checkColumnProvided(columnName, params);
  if (!operationResult.success) return operationResult;

  // Verifica si la columna es un número
  if (isNaN(Number(parsedColumn))) { 
    operationResult = {
      success: false,
      statusCode:StatusCodes.BAD_REQUEST,
      message: `La columna ${ columnName } no es un número`,
      data: null,
      error: { description: `La columna ${ columnName } no es un número`, code: 400 },
      app: { name: APP_NAME, action: 'checkColumnNumber', timestamp: new Date().toISOString(), user: 'system' }
    };

    return operationResult;
  }

  // Validación exitosa.
  operationResult = {
    success: true,
    statusCode:StatusCodes.OK,
    message: `La columna ${ columnName } es es un número`,
    data: null,
    error: null,
    app: { name: APP_NAME, action: 'checkColumnNumber', timestamp: new Date().toISOString(), user: 'system' }
  };

  return operationResult;
};

/**
 * checkColumnDataType: Verifica si una columna específica es del tipo de dato esperado.
 * 
 * @param {string} columnName - El nombre de la columna que se espera esté presente en el objeto `params`.
 * @param {any} params - El objeto que contiene los valores enviados, normalmente una petición o DTO.
 * @returns {Promise<OperationResult>} Resultado de la validación: success = true si fue proporcionada, success = false si no.
 */
export const checkColumnDataType = async (columnName: string, params: any, type: SqlServerDataTypes): Promise<OperationResult> => {
  let operationResult: OperationResult;

  const parsedColumn = params[columnName];

  // Valida si la columna fue proporcionada.
  operationResult = await checkColumnProvided(columnName, params);
  if (!operationResult.success) return operationResult;

  // Valida el tipo de dato de la columna.
  switch (type) {
    case SqlServerDataTypes.INT:
      if (!Number.isInteger(params[columnName])) {
        operationResult = {
          success: false,
          statusCode:StatusCodes.BAD_REQUEST,
          message: `La columna ${ columnName } no es un tipo de dato INT`,
          data: null,
          error: { description: `La columna ${ columnName } no es un tipo de dato INT`, code: 400 },
          app: { name: APP_NAME, action: 'checkColumnDataType', timestamp: new Date().toISOString(), user: 'system' }
        };
    
        return operationResult;
      }
      break;
    case SqlServerDataTypes.CHAR:
    case SqlServerDataTypes.VARCHAR:
      if (typeof params[columnName] !== 'string') {
        operationResult = {
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: `La columna ${columnName} no es un tipo de dato CHAR`,
          data: null,
          error: { description: `La columna ${columnName} no es un tipo de dato CHAR`, code: 400 },
          app: { name: APP_NAME, action: 'checkColumnDataType', timestamp: new Date().toISOString(), user: 'system' }
        };
    
        return operationResult;
      }
      break;
    case SqlServerDataTypes.DATETIME:
      let dateValue = new Date(params[columnName]);

      if (typeof params[columnName] !== 'string' && !(params[columnName] instanceof Date) || isNaN(dateValue.getTime())) {
        operationResult = {
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: `La columna ${columnName} no es un tipo de dato DATETIME válido`,
          data: null,
          error: { description: `La columna ${columnName} debe contener una fecha válida (DATETIME)`, code: 400 },
          app: { name: APP_NAME, action: 'checkColumnDataType', timestamp: new Date().toISOString(), user: 'system' }
        }

        return operationResult;
      }
      break;
    default:
      operationResult = {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: `La columna ${columnName} no es un tipo de dato válido`,
        data: null,
        error: { description: `La columna ${columnName} debe ser un tipo de dato válido`, code: 400 },
        app: { name: APP_NAME, action: 'checkColumnDataType', timestamp: new Date().toISOString(), user: 'system' }
      }

      return operationResult;
  };

  // Validación exitosa.
  operationResult = {
    success: true,
    statusCode:StatusCodes.OK,
    message: `La columna tiene un tipo de dato válido`,
    data: null,
    error: null,
    app: { name: APP_NAME, action: 'checkColumnDataType', timestamp: new Date().toISOString(), user: 'system' }
  };

  return operationResult;
};

/**
 * checkColumnIsPositive: Verifica si una columna específica es un número positivo.
 * 
 * @param {string} columnName - El nombre de la columna que se espera esté presente en el objeto `params`.
 * @param {any} params - El objeto que contiene los valores enviados, normalmente una petición o DTO.
 * @returns {Promise<OperationResult>} Resultado de la validación: success = true si fue proporcionada, success = false si no.
 */
export const checkColumnIsPositive = async (columnName: string, params: any): Promise<OperationResult> => {
  let operationResult: OperationResult;
  
  // Valida si la columna fue proporcionada.
  operationResult = await checkColumnProvided(columnName, params);
  if (!operationResult.success) return operationResult;

  const parsedColumn =parseInt(params[columnName]);

  // Verifica si el Id es un número positivo
  if (parsedColumn < 1) { 
    operationResult = {
      success: false,
      statusCode:StatusCodes.BAD_REQUEST,
      message: `La columna ${ columnName } debe ser un número positivo`,
      data: null,
      error: { description: `La columna debe ser un número positivo`, code: 400 },
      app: { name: APP_NAME, action: 'checkColumnNumber', timestamp: new Date().toISOString(), user: 'system' }
    };

    return operationResult;
  }

  // Validación exitosa.
  operationResult = {
    success: true,
    statusCode:StatusCodes.OK,
    message: `La columna ${ columnName } es un valor positivo`,
    data: null,
    error: null,
    app: { name: APP_NAME, action: 'checkColumnIsPositive', timestamp: new Date().toISOString(), user: 'system' }
  };

  return operationResult;
};

/**
 * checkPrizePool: Verifica si una columna específica es una bolsa válida.
 * 
 * @param {string} columnName - El nombre de la columna que se espera esté presente en el objeto `params`.
 * @param {any} params - El objeto que contiene los valores enviados, normalmente una petición o DTO.
 * @returns {Promise<OperationResult>} Resultado de la validación: success = true si fue proporcionada, success = false si no.
 */
export const checkPrizePool = async (columnName: string, params: any): Promise<OperationResult> => {
  let operationResult: OperationResult;

  // Valida si la columna fue proporcionada.
  operationResult = await checkColumnProvided(columnName, params);
  if (!operationResult.success) return operationResult;

  // Valida si la bolsa es un número.
  operationResult = await checkColumnNumber(columnName, params);
  if (!operationResult.success) return operationResult;

  // Valida si la bolsa es un número positivo.
  operationResult = await checkColumnIsPositive(columnName, params);
  if (!operationResult.success) return operationResult;

  // Validación exitosa.
  operationResult = {
    success: true,
    statusCode:StatusCodes.OK,
    message: `La bolsa es válida`,
    data: null,
    error: null,
    app: { name: APP_NAME, action: 'checkPrizePool', timestamp: new Date().toISOString(), user: 'system' }
  };

  return operationResult;
};

/**
 * checkDrawDate: Verifica si una columna específica es una fecha válida.
 * 
 * @param {string} columnName - El nombre de la columna que se espera esté presente en el objeto `params`.
 * @param {any} params - El objeto que contiene los valores enviados, normalmente una petición o DTO.
 * @returns {Promise<OperationResult>} Resultado de la validación: success = true si fue proporcionada, success = false si no.
 */
export const checkDrawDate = async (columnName: string, params: any): Promise<OperationResult> => {
  let operationResult: OperationResult;

  // Valida si la fecha fue proporcionada.
  operationResult = await checkColumnProvided(columnName, params);
  if (!operationResult.success) return operationResult;

  // Valida si la fecha es una fecha válida.
  if (isNaN(Date.parse(params.Fecha))) {
    operationResult = {
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: `La columna ${ columnName } no tiene un formato válido`,
      data: null,
      error: { description: `La columns ${ columnName } no tiene un formato válido`, code: 400 },
      app: { name: APP_NAME, action: 'checkDrawDate', timestamp: new Date().toISOString(), user: 'system' }
    };

    return operationResult;
  }

  // Valida si la fecha es anterior a la fecha actual.
  if (Date.now() < Date.parse(params.Fecha)) {
    operationResult = {
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: `La columna ${ columnName } no puede ser posterior a la fecha actual`,
      data: null,
      error: { description: `La columna ${ columnName } no puede ser posterior a la fecha actual`, code: 400 },
      app: { name: APP_NAME, action: 'checkDrawDate', timestamp: new Date().toISOString(), user: 'system' }
    };

    return operationResult;
  }

  // Validación exitosa.
  operationResult = {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'La Fecha es válida',
    data: null,
    error: null,
    app: { name: APP_NAME, action: 'checkDrawDate', timestamp: new Date().toISOString(), user: 'system' }
  };

  return operationResult;
};

/**
 * checkFormatAndUniqueNumbers: Verifica si los números proporcionados son números y únicos.
 * 
 * @param {string} columnName - El nombre de la columna que se espera esté presente en el objeto `params`.
 * @param {any} params - El objeto que contiene los valores enviados, normalmente una petición o DTO.
 * @returns {Promise<OperationResult>} Resultado de la validación: success = true si fue proporcionada, success = false si no.
 */
export const checkFormatAndUniqueNumbers = async (body:any): Promise<OperationResult> => {
  let operationResult: OperationResult;
  let numberPair: NumberPair;
  numberPair = { Numero1: body.Numero1, Numero2: body.Numero2, Numero3: body.Numero3, Numero4: body.Numero4, Numero5: body.Numero5, Numero6: body.Numero6, Numero7: body.Numero7 };

  const entries = Object.entries(numberPair);

  for (const [key, value] of entries) {
    // Verifica si los números fueron proporcionados
    operationResult = await checkColumnProvided(`${key.charAt(0).toUpperCase() + key.slice(1)}`, body);
    if (!operationResult.success) return operationResult;

    // Verifica si los datos proporcionados son números
    operationResult = await checkColumnNumber(`${key.charAt(0).toUpperCase() + key.slice(1)}`, body);
    if (!operationResult.success) return operationResult;

    // Verifica que los números sean únicos
    const values = entries.map(([_, value]) => value);
    const seen = new Set<number>();

    for (let i = 0; i < values.length; i++) {
      if (seen.has(values[i])) { 
        operationResult = {
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: `Numero${i + 1} debe ser único`,
          data: null,
          error: { description: `Numero${i + 1} debe ser único`, code: 400 },
          app: { name: APP_NAME, action: 'checkFormatAndUniqueNumbers', timestamp: new Date().toISOString(), user: 'system' }
        };

        seen.add(values[i]);

        return operationResult;
      };
    };
  };

  // Respuesta exitosa.
  operationResult = {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Los números del 1 al 7 son válidos',
    data: null,
    error: null,
    app: { name: APP_NAME, action: 'checkFormatAndUniqueNumbers', timestamp: new Date().toISOString(), user: 'system' }
  };

  return operationResult;
};
