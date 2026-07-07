import * as multasService from '../services/multas.service.js';

/**
 * Controlador para obtener el listado de todas las multas pendientes en el sistema.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar la gestión del error.
 * @returns {Promise<void>}
 */
export const getMultasPendientes = async (req, res, next) => {
  try {
    const multas = await multasService.getMultasPendientes();
    
    res.status(200).json({
      success: true,
      data: multas
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para registrar el pago de una multa mediante su ID.
 * Modifica el estado a 'Pagada' y guarda la fecha de pago.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar la gestión del error.
 * @returns {Promise<void>}
 */
export const registrarPago = async (req, res, next) => {
  try {
    const { id } = req.params;
    const multaActualizada = await multasService.registrarPago(id);
    
    res.status(200).json({
      success: true,
      data: multaActualizada
    });
  } catch (error) {
    next(error);
  }
};
