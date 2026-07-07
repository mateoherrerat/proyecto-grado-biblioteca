import * as librosAutoresService from '../services/librosAutores.service.js';

/**
 * Controlador para crear una nueva asociación entre un autor y un libro.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const associate = async (req, res, next) => {
  try {
    const { id_autor, id_libro } = req.body;
    
    // Validar parámetros obligatorios en la solicitud
    if (!id_autor || !id_libro) {
      const error = new Error('Los campos id_autor e id_libro son obligatorios.');
      error.statusCode = 400;
      throw error;
    }
    
    const relation = await librosAutoresService.associateAutorLibro(id_autor, id_libro);
    
    res.status(201).json({
      success: true,
      data: relation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para listar todos los autores asociados a un libro específico.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const getAutoresByLibro = async (req, res, next) => {
  try {
    const { id } = req.params; // ID del libro (id_libro)
    const autores = await librosAutoresService.getAutoresByLibroId(id);
    
    res.status(200).json({
      success: true,
      data: autores
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para eliminar la relación entre un autor y un libro.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const disassociate = async (req, res, next) => {
  try {
    const { id } = req.params; // ID de la relación (id_autor_libro)
    const deletedRelation = await librosAutoresService.disassociateAutorLibro(id);
    
    res.status(200).json({
      success: true,
      data: deletedRelation
    });
  } catch (error) {
    next(error);
  }
};
