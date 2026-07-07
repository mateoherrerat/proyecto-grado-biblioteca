import * as resenasService from '../services/resenas.service.js';

/**
 * Controlador para obtener todas las reseñas y calificaciones de una sede física.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const getResenasDeBiblioteca = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resenas = await resenasService.getResenasDeBiblioteca(id);
    
    res.status(200).json({
      success: true,
      data: resenas
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para calificar una sede física de la biblioteca.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const crearResena = async (req, res, next) => {
  try {
    const { id_biblioteca, id_usuario, valoracion, comentarios } = req.body;
    const nuevaResena = await resenasService.crearResena({
      id_biblioteca,
      id_usuario,
      valoracion,
      comentarios
    });
    
    res.status(201).json({
      success: true,
      data: nuevaResena
    });
  } catch (error) {
    next(error);
  }
};
