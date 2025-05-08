import * as dotenv from 'dotenv';
import { config as sqlConfig } from 'mssql';

// Cargar .env antes de acceder a las variables
dotenv.config();

// Validar que todas las variables necesarias estén presentes
const requiredVars = ['DB_USER', 'DB_PASSWORD', 'DB_SERVER', 'DB_NAME'];
const missingVars = requiredVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  throw new Error(`Faltan las siguientes variables de entorno en el archivo .env: ${missingVars.join(', ')}`);
}

// Configuración de conexión a SQL Server
const dbConfig: sqlConfig = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export default dbConfig;
