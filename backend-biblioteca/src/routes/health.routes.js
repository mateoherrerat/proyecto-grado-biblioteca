import { Router } from 'express';
import { query } from '../config/database.js';
import logger from '../utils/logger.js';

const router = Router();

/**
 * @route GET /api/health
 * @desc Comprueba el estado de salud del backend y la conexión a PostgreSQL
 */
router.get('/health', async (req, res, next) => {
  try {
    // Realizamos una consulta simple de base de datos
    const result = await query('SELECT NOW() as now');
    
    return res.status(200).json({
      success: true,
      status: 'UP',
      timestamp: new Date().toISOString(),
      database: {
        status: 'CONNECTED',
        time: result.rows[0].now
      }
    });
  } catch (error) {
    // Registramos el fallo interno del pool, pero retornamos estado DEGRADED
    logger.error('Verificación de salud: Error al conectar a PostgreSQL', error);
    
    let errorMessage = error.message || error.toString();
    if (error.errors && Array.isArray(error.errors)) {
      errorMessage = error.errors.map(e => e.message).join('; ');
    }
    
    return res.status(500).json({
      success: false,
      status: 'DEGRADED',
      timestamp: new Date().toISOString(),
      database: {
        status: 'DISCONNECTED',
        error: errorMessage
      }
    });
  }
});

export default router;
