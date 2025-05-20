export interface Draw {
  Id: number;
  Numero1: number;
  Numero2: number;
  Numero3: number;
  Numero4: number;
  Numero5: number;
  Numero6: number;
  Numero7: number;
  Bolsa: number;
  Fecha: string; // o Date si ya viene parseado
}

export interface NumberPair {
  Numero1: number;
  Numero2: number;
  Numero3: number;
  Numero4: number;
  Numero5: number;
  Numero6: number;
  Numero7: number;
}

export interface ResponseValidation {
  success: boolean;
  message: string;
}
  
export interface OperationResult {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;
  error: { 
    description: string | null;
    code: number | null;
  } | null;
  app: {
    name: string;
    action: string;
    timestamp: string;
    user: string;
  }
}

export interface IUserService {
  getCurrentUser(): string;
}