import * as dotenv from 'dotenv';
dotenv.config(); // ⚠️ Siempre debe ir primero

import express from 'express';
import cors from 'cors';
import sql from 'mssql';

import drawsRouter from './routes/draws.routes';
import dbConfig from './config/db.config'; // Ajusta la ruta si es necesario

const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

// Exportar pool para su uso en controladores
let dbPool: sql.ConnectionPool;
export { dbPool };

// Conectar a la base de datos
sql.connect(dbConfig).then(pool => {
  dbPool = pool;
  console.log('✅ Conectado a SQL Server');

  // Rutas
  app.use('/api/draws', drawsRouter);

  app.listen(port, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
  });

}).catch(err => {
  console.error('❌ Error al conectar a SQL Server:', err.message);
});
