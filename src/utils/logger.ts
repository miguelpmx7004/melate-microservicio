// // src/utils/logger.ts
// import fs from 'fs';
// import path from 'path';

// const logFilePath = path.join(__dirname, '../logs/app.log');

// export const Logger = {
//   log: (message: string) => {
//     const timestamp = new Date().toISOString();
//     const fullMessage = `[${timestamp}] ${message}\n`;

//     // Asegura que el directorio "logs" exista
//     const logDir = path.dirname(logFilePath);
//     if (!fs.existsSync(logDir)) {
//       fs.mkdirSync(logDir, { recursive: true });
//     }

//     fs.appendFileSync(logFilePath, fullMessage, { encoding: 'utf-8' });
//     console.log(fullMessage); // También imprime en consola si deseas
//   },
// };

// src/utils/logger.ts
import fs from 'fs';
import path from 'path';

const logDir = path.join(__dirname, '../logs');
const logFilePath = path.join(logDir, 'app.log');

const writeJsonLog = (entry: any) => {
  const logLine = JSON.stringify(entry) + '\n';
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  fs.appendFileSync(logFilePath, logLine, { encoding: 'utf-8' });
};

export const Logger = {
  log: (module: string, action: string, message: string, code: string, user: string = 'anonymous') => {
    writeJsonLog({
      timestamp: new Date().toISOString(),
      user,
      module,
      action,
      status: 'success',
      message,
      code,
    });
  },

  error: (module: string, action: string, message: string, error: any, code: string, user: string = 'anonymous') => {
    writeJsonLog({
      timestamp: new Date().toISOString(),
      user,
      module,
      action,
      status: 'error',
      message,
      error: error?.toString() ?? null,
      code,
    });
  }
};
