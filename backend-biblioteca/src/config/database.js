import pg from 'pg';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';

// Soporte para URL de conexión completa o variables individuales
const connectionString = process.env.DATABASE_URL;

let sslConfig = false;
if (isProduction) {
  sslConfig = { rejectUnauthorized: false };
} else {
  // En desarrollo local, si no es localhost, habilitamos SSL (requerido por Supabase)
  const host = connectionString 
    ? (connectionString.includes('@') ? connectionString.split('@')[1].split('/')[0].split(':')[0] : '')
    : process.env.DB_HOST;
  const isLocal = !host || host === 'localhost' || host === '127.0.0.1' || host === '::1';
  if (!isLocal) {
    sslConfig = { rejectUnauthorized: false };
  }
}

const poolConfig = connectionString
  ? {
      connectionString,
      ssl: sslConfig,
    }
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME,
      ssl: sslConfig,
    };

const pool = new Pool(poolConfig);

// Evento que se dispara al conectar un cliente al pool
pool.on('connect', () => {
  logger.info('Conexión con la base de datos establecida correctamente.');
});

// Manejo de errores inesperados en clientes inactivos del pool
pool.on('error', (err) => {
  logger.fatal('Error inesperado de conexión en el pool de la base de datos', err);
  process.exit(-1);
});

/**
 * Función helper para ejecutar consultas SQL simplificando la obtención del cliente.
 * Evita tener que liberar el cliente manualmente en consultas simples.
 * 
 * @param {string} text - Consulta SQL (ej: 'SELECT * FROM libros WHERE id = $1')
 * @param {Array} params - Parámetros de la consulta
 * @returns {Promise<import('pg').QueryResult>}
 */
export const query = (text, params) => pool.query(text, params);

export default pool;
