import * as preferenciasService from '../services/preferencias.service.js';

/**
 * Controlador para obtener la lista de libros en seguimiento de un usuario.
 * 
 * @param {import('express').Request} req - Solicitud de Express.
 * @param {import('express').Response} res - Respuesta de Express.
 * @param {import('express').NextFunction} next - Middleware de error.
 * @returns {Promise<void>}
 */
export const getPreferenciasByUsuario = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;
    const prefs = await preferenciasService.getPreferenciasPorUsuario(idUsuario);
    res.status(200).json({
      success: true,
      data: prefs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para actualizar la preferencia de alerta de disponibilidad de un libro.
 * 
 * @param {import('express').Request} req - Solicitud de Express.
 * @param {import('express').Response} res - Respuesta de Express.
 * @param {import('express').NextFunction} next - Middleware de error.
 * @returns {Promise<void>}
 */
export const updatePreferencia = async (req, res, next) => {
  try {
    const { id_usuario, id_libro, id_estado_disponibilidad_libro } = req.body;

    if (!id_usuario) {
      const error = new Error('El ID del usuario (id_usuario) es obligatorio.');
      error.statusCode = 400;
      throw error;
    }

    if (!id_libro) {
      const error = new Error('El ID del libro (id_libro) es obligatorio.');
      error.statusCode = 400;
      throw error;
    }

    const actualizada = await preferenciasService.updatePreferenciaAlerta(
      id_usuario,
      id_libro,
      id_estado_disponibilidad_libro
    );

    res.status(200).json({
      success: true,
      data: actualizada
    });
  } catch (error) {
    next(error);
  }
};
