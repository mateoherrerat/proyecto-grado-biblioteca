import * as autoresService from '../services/autores.service.js';

/**
 * Controlador para obtener la lista completa de autores.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const getAllAutores = async (req, res, next) => {
  try {
    const autores = await autoresService.getAllAutores();
    
    res.status(200).json({
      success: true,
      data: autores
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para obtener un autor específico por su ID.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const getAutorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const autor = await autoresService.getAutorById(id);
    
    res.status(200).json({
      success: true,
      data: autor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para registrar un nuevo autor.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const createAutor = async (req, res, next) => {
  try {
    const { nombre } = req.body;
    const newAutor = await autoresService.createAutor(nombre);
    
    res.status(201).json({
      success: true,
      data: newAutor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para actualizar los datos de un autor existente.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const updateAutor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const updatedAutor = await autoresService.updateAutor(id, nombre);
    
    res.status(200).json({
      success: true,
      data: updatedAutor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para eliminar un autor del sistema.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const deleteAutor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedAutor = await autoresService.deleteAutor(id);
    
    res.status(200).json({
      success: true,
      data: deletedAutor
    });
  } catch (error) {
    next(error);
  }
};
