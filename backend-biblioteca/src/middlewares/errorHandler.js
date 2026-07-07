import logger from '../utils/logger.js';

/**
 * Middleware global para el manejo centralizado de errores.
 * Atrapa cualquier excepción ocurrida en las rutas y devuelve un JSON uniforme.
 * 
 * @param {Error} err - Objeto de error
 * @param {import('express').Request} req - Request de Express
 * @param {import('express').Response} res - Response de Express
 * @param {import('express').NextFunction} next - Siguiente middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  // Registrar el error detalladamente en la consola del servidor
  logger.error(`${req.method} ${req.path} - Código: ${statusCode} - Mensaje: ${message}`, err);

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      // Solo exponer la pila de llamadas (stack trace) en desarrollo por seguridad
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  });
};
export default errorHandler;
