import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DateTime, Decimal, Int } from 'mssql';
import { dbPool } from '../server';
import { checkColumnExists, checkColumnNumber, checkDbConnection, checkDrawColumnsExists, checkQueryNotEmpty, checkTableExists, handleInternalError } from '../utils/dbValidations';
import { SqlServerDataTypes } from '../enums';
import { handleSqlError } from '../utils/sqlErrorHandler';

type NumberPair = { number1: any, number2: any, number3: any, number4: any, number5: any, number6: any, number7: any };

//#region   <<<   I m p l e m e n t a c i ó n   d e l   C R U D   >>>
export const getAllDraw = async (req: Request, res: Response): Promise<void> => {
  // Valida la conexión a la base de datos.
  if (!checkDbConnection(res)) return;

  try {
    const result = await dbPool
      .request()
      .query(`SELECT Id, Numero1, Numero2, Numero3, Numero4, Numero5, Numero6, Numero7, Bolsa, Fecha FROM dbo.Sorteos ORDER BY Id desc`);

    // Validar si no hay registros
    if (!checkQueryNotEmpty(res, result)) return;

    // Respuesta exitosa
    res.status(StatusCodes.OK).json({ success: true, statusCode: StatusCodes.OK, message: 'La información de los sorteos se obtuvo con éxito', data: result.recordset, error: null });
    return;
  } catch (error: any) {
    if (!handleSqlError(res, error)) {
      handleInternalError(res, 'Obtener sorteos', error);
    }
  }
};

export const getDrawById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // Valida la conexión a la base de datos.
  if (!checkDbConnection(res)) return;

  // Valida existencia de la tabla "Sorteos".
  if (!await checkTableExists(res, 'Sorteos')) return;

  // Valida existencia de la columna "Id".
  if (!await checkColumnExists(res, 'Id')) return;

  // Valida el tipo de dato de la columna "Id".
  if (!await checkColumnNumber(res, id, 'Id', SqlServerDataTypes.INT)) return;

  try {
    const result = await dbPool.request()
      .input('Id', Int, parseInt(id))
      .query(`SELECT Id, Numero1, Numero2, Numero3, Numero4, Numero5, Numero6, Numero7, Bolsa, Fecha FROM dbo.Sorteos WHERE Id = @Id`);

    const draw = result.recordset[0];

    // Validar si no hay registros
    if (!checkQueryNotEmpty(res, result)) return;

    res.status(StatusCodes.OK).json({ success: true, statusCode: StatusCodes.OK, message: 'El sorteo fue obtenido con éxito', data: draw, error: null });

  } catch (error: any) {
    if (!handleSqlError(res, error)) {
      handleInternalError(res, 'Obtener sorteos', error);
    }
  }
};

export const createDraw = async (req: Request, res: Response): Promise<void> => {
  const { Id, Numero1, Numero2, Numero3, Numero4, Numero5, Numero6, Numero7, Bolsa, Fecha } = req.body;

  // Valida la conexión a la base de datos.
  if (!checkDbConnection(res)) return;

  // Valida existencia de la tabla "Sorteos".
  if (!await checkTableExists(res, 'Sorteos')) return;

  // Validación de los números ganadores
  const numbers: NumberPair = { number1: Numero1, number2: Numero2, number3: Numero3, number4: Numero4, number5: Numero5, number6: Numero6, number7: Numero7 };

  let validation = validateIdNumber(Id);
  validation = validateNumbers(numbers);
  if (!validation.success) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: validation.success, statusCode: validation.statusCode, message: validation.message, data: null, error: null });
    return;
  }

  // Validación de la bolsa
  validation = validatePrizePool(Bolsa);
  if (!validation.success) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: validation.success, statusCode: validation.statusCode, message: validation.message, data: null, error: null });
    return;
  }

  // Validación de la fecha
  validation = validateDate(Fecha);
  if (!validation.success) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: validation.success, statusCode: validation.statusCode, message: validation.message, data: null, error: null });
    return;
  }

  try {
    await dbPool.request()
      .input('Id', Int, Id)
      .input('Numero1', Int, Numero1)
      .input('Numero2', Int, Numero2)
      .input('Numero3', Int, Numero3)
      .input('Numero4', Int, Numero4)
      .input('Numero5', Int, Numero5)
      .input('Numero6', Int, Numero6)
      .input('Numero7', Int, Numero7)
      .input('Bolsa', Decimal, Bolsa)
      .input('Fecha', DateTime, Fecha)
      .query(`INSERT INTO dbo.Sorteos (Id,  Numero1,  Numero2,  Numero3,  Numero4,  Numero5,  Numero6,  Numero7,  Bolsa,  Fecha) 
                               VALUES (@Id, @Numero1, @Numero2, @Numero3, @Numero4, @Numero5, @Numero6, @Numero7, @Bolsa, @Fecha)`);

    res.status(StatusCodes.CREATED).json({ success: true, statusCode: StatusCodes.CREATED, message: 'El sorteo fue creado con éxito', data: { Id }, error: null });

  } catch (error: any) {
    if (!handleSqlError(res, error)) {
      handleInternalError(res, 'Obtener sorteos', error);
    }
  }
};

export const updateDraw = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { Numero1, Numero2, Numero3, Numero4, Numero5, Numero6, Numero7, Bolsa, Fecha } = req.body;

    const parsedId = parseInt(id);

    // Valida la conexión a la base de datos.
    if (!checkDbConnection(res)) return;

    // Valida existencia de la tabla "Sorteos".
    if (!await checkTableExists(res, 'Sorteos')) return;

    // Validar estructura de la tabla Sorteos
    if (!await checkDrawColumnsExists(res)) return;

    const numbers: NumberPair = { number1: Numero1, number2: Numero2, number3: Numero3, number4: Numero4, number5: Numero5, number6: Numero6, number7: Numero7 };

    // Validaciones de negocio
    const validations = [validateIdNumber(parsedId), validateNumbers(numbers), validatePrizePool(Bolsa), validateDate(Fecha)];

    for (const validation of validations) {
      if (!validation.success) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, statusCode: StatusCodes.BAD_REQUEST, message: validation.message, data: null, error: null });
        return;
      }
    }

    // Actualizar sorteo
    await dbPool.request()
      .input('Id', Int, parsedId)
      .input('Numero1', Int, Numero1)
      .input('Numero2', Int, Numero2)
      .input('Numero3', Int, Numero3)
      .input('Numero4', Int, Numero4)
      .input('Numero5', Int, Numero5)
      .input('Numero6', Int, Numero6)
      .input('Numero7', Int, Numero7)
      .input('Bolsa', Decimal, Bolsa)
      .input('Fecha', DateTime, Fecha)
      .query(`
        UPDATE dbo.Sorteos 
        SET    Numero1 = @Numero1, Numero2 = @Numero2, Numero3 = @Numero3,
               Numero4 = @Numero4, Numero5 = @Numero5, Numero6 = @Numero6,
               Numero7 = @Numero7, Bolsa = @Bolsa, Fecha = @Fecha
        WHERE  Id = @Id
      `);

    res.status(StatusCodes.OK).json({ success: true, statusCode: StatusCodes.OK, message: 'El sorteo fue actualizado con éxito', data: { id: parsedId }, error: null });

  } catch (error: any) {
    if (!handleSqlError(res, error)) {
      handleInternalError(res, 'Obtener sorteos', error);
    }
  }
};

export const deleteDraw = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Valida la conexión a la base de datos.
    if (!checkDbConnection(res)) return;

    // Valida existencia de la tabla "Sorteos".
    if (!await checkTableExists(res, 'Sorteos')) return;

    // Valida existencia de la columna "Id".
    if (!await checkColumnExists(res, 'Id')) return;

    // Valida el tipo de dato de la columna "Id".
    if (!await checkColumnNumber(res, id, 'Id', SqlServerDataTypes.INT)) return;

    // Ejecutar eliminación
    await dbPool.request().input('Id', Int, parseInt(id)).query('DELETE FROM dbo.Sorteos WHERE Id = @Id');

    res.status(StatusCodes.ACCEPTED).json({ success: true, statusCode: StatusCodes.ACCEPTED, message: 'El sorteo fue eliminado con éxito', data: { id: parseInt(id) }, error: null });
    return;
  } catch (error) {
    if (!handleSqlError(res, error)) {
      handleInternalError(res, 'Obtener sorteos', error);
    }
  }
};
//#endregion

//#region   <<<   V a l i d a c i o n e s   >>>
const validateNumbers = (numbers: NumberPair): { success: boolean, statusCode: StatusCodes, message?: string } => {
  let validation: any;

  validation = validateFormatNumbers(numbers);
  if (!validation.success) { return { success: validation.success, statusCode: validation.statusCode, message: validation.message }; }

  validation = validateNumber(numbers.number1, 1, 51);
  if (!validation.success) { return { success: validation.success, statusCode: validation.statusCode, message: validation.message }; }

  validation = validateNumber(numbers.number2, 2, 52);
  if (!validation.success) { return { success: validation.success, statusCode: validation.statusCode, message: validation.message }; }

  validation = validateNumber(numbers.number3, 3, 53);
  if (!validation.success) { return { success: validation.success, statusCode: validation.statusCode, message: validation.message }; }

  validation = validateNumber(numbers.number4, 4, 54);
  if (!validation.success) { return { success: validation.success, statusCode: validation.statusCode, message: validation.message }; }

  validation = validateNumber(numbers.number5, 5, 55);
  if (!validation.success) { return { success: validation.success, statusCode: validation.statusCode, message: validation.message }; }

  validation = validateNumber(numbers.number6, 6, 56);
  if (!validation.success) { return { success: validation.success, statusCode: validation.statusCode, message: validation.message }; }

  validation = validateNumber(numbers.number7, 1, 56);
  if (!validation.success) { return { success: validation.success, statusCode: validation.statusCode, message: validation.message }; }

  return { success: true, statusCode: StatusCodes.OK, message: 'Los números son válidos' };
}

const validateFormatNumbers = (numbers: NumberPair): { success: boolean, statusCode: StatusCodes, message: string } => {
  const entries = Object.entries(numbers);

  for (const [key, value] of entries) {
    // Verifica si los números fueron proporcionados
    if (value === undefined || value === null) {
      return { success: false, statusCode: StatusCodes.BAD_REQUEST, message: `${key.charAt(0).toUpperCase() + key.slice(1)} es requerido` };
    }

    // Verifica si los datos proporcionados son números
    if (isNaN(Number(value))) {
      return { success: false, statusCode: StatusCodes.BAD_REQUEST, message: `${key.charAt(0).toUpperCase() + key.slice(1)} no es un número` };
    }

    // Verifica que los números sean únicos
    const values = entries.map(([_, value]) => value);
    const seen = new Set<number>();

    for (let i = 0; i < values.length; i++) {
      if (seen.has(values[i])) { return { success: false, statusCode: StatusCodes.BAD_REQUEST, message: `Numero${i + 1} debe ser único` }; }
      seen.add(values[i]);
    }
  };

  // Retorna una validación exitosa
  return { success: true, statusCode: StatusCodes.OK, message: 'Los números del 1 al 7 son válidos' };
};

const validateNumber = (number: any, validLowerLimit: number, validUpperLimit: number): { success: boolean, statusCode: StatusCodes, message?: string } => {
  // Verifica si el número fue proporcionado
  if (number === undefined || number === null) {
    return { success: false, statusCode: StatusCodes.BAD_REQUEST, message: 'El número es requerido' };
  }

  // Intenta convertir a número
  const parsed = Number(number);

  // Verifica si es un número válido
  if (isNaN(parsed)) {
    return { success: false, statusCode: StatusCodes.BAD_REQUEST, message: 'El valor proporcionado no es un número válido' };
  }

  // Verifica rango válido (de validLowerLimit a validUpperLimit)
  if (parsed < validLowerLimit || parsed > validUpperLimit) {
    return { success: false, statusCode: StatusCodes.BAD_REQUEST, message: `El número (${parsed}) debe estar entre ${validLowerLimit} y ${validUpperLimit}` };
  }

  // Todo está bien
  return { success: true, statusCode: StatusCodes.OK, message: 'El número es válido' };
};

const validateIdNumber = (id: any): { success: boolean, statusCode: StatusCodes, message?: string } => {
  // Verifica si el Id fue proporcionado
  if (id === undefined || id === null) { return { success: false, statusCode: StatusCodes.BAD_REQUEST, message: 'El Id es requerido' }; }

  // Verifica si el Id es un número
  if (isNaN(Number(id))) { return { success: false, statusCode: StatusCodes.BAD_REQUEST, message: 'El Id no es un número' }; }

  // Verifica si el Id es un número positivo
  if (id < 1) { return { success: true, statusCode: StatusCodes.BAD_REQUEST, message: 'El Id debe ser un número positivo' }; }

  return { success: true, statusCode: StatusCodes.OK, message: 'El Id es válido' };
};

const validatePrizePool = (prizePool: any): { success: boolean, statusCode: StatusCodes, message?: string } => {
  // Verifica si la bolsa fue proporcionada
  if (prizePool === undefined || prizePool === null) { return { success: false, statusCode: StatusCodes.BAD_REQUEST, message: 'La Bolsa del sorteo es requerida' }; }

  // Verifica si la bolsa es un número
  if (isNaN(Number(prizePool))) { return { success: false, statusCode: StatusCodes.BAD_REQUEST, message: 'La Bolsa no es un importe válido' }; }
  
  // Verifica si la bolsa es un importe positivo
  if (prizePool < 0) { return { success: false, statusCode: StatusCodes.BAD_REQUEST, message: 'La Bolsa debe ser un importe positivo' }; }

  return { success: true, statusCode: StatusCodes.OK, message: 'La Bolsa es válida' };
};

const validateDate = (drawDate: any): { success: boolean, statusCode: StatusCodes, message?: string } => {
  // Verifica si la fecha fue proporcionada
  if (drawDate === undefined || drawDate === null) { return { success: false, statusCode: StatusCodes.BAD_REQUEST, message: 'La Fecha del sorteo es querida' }; }

  // Verifica si la fecha es una fecha válida
  if (isNaN(Date.parse(drawDate))) { return { success: false, statusCode: StatusCodes.BAD_REQUEST, message: 'La Fecha del sorteo no tiene un formato válido' }; }

  // Verifica si la fecha es anterior a la fecha actual
  if (Date.now() < drawDate) { return { success: false, statusCode: StatusCodes.BAD_REQUEST, message: 'La Fecha del sorteo no puede ser posterior a la fecha actual' }; }
  
  return { success: true, statusCode: StatusCodes.OK, message: 'La Fecha es válida' };
}
//#endregion
