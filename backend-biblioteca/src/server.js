import app from './app.js';
import dotenv from 'dotenv';
import logger from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Servidor iniciado y escuchando en el puerto ${PORT}`);
  logger.info(`Endpoint de verificación de salud: http://localhost:${PORT}/api/health`);
});

// Manejo de señales para un apagado ordenado (graceful shutdown)
const gracefulShutdown = () => {
  logger.info('Apagando el servidor y cerrando el pool de conexiones a la base de datos...');
  server.close(() => {
    logger.info('Servidor HTTP cerrado.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
