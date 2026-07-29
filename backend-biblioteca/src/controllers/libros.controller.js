import * as librosService from '../services/libros.service.js';

/**
 * Controlador para obtener todos los libros, soportando filtrado opcional por query string.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const getAllLibros = async (req, res, next) => {
  try {
    const { filter } = req.query;
    const libros = await librosService.getAllLibros(filter);
    
    res.status(200).json({
      success: true,
      data: libros
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para recuperar los detalles técnicos de un libro por su ID.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const getLibroById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const libro = await librosService.getLibroById(id);
    
    res.status(200).json({
      success: true,
      data: libro
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para crear un nuevo registro de libro.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const createLibro = async (req, res, next) => {
  try {
    const { isbn, titulo, editorial, sinopsis, fecha_publicacion, portada, id_categoria, slug } = req.body;
    const newLibro = await librosService.createLibro({
      isbn,
      titulo,
      editorial,
      sinopsis,
      fecha_publicacion,
      portada,
      id_categoria,
      slug
    });
    
    res.status(201).json({
      success: true,
      data: newLibro
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para modificar la información de un libro existente.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const updateLibro = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isbn, titulo, editorial, sinopsis, fecha_publicacion, portada, id_categoria, slug } = req.body;
    const updatedLibro = await librosService.updateLibro(id, {
      isbn,
      titulo,
      editorial,
      sinopsis,
      fecha_publicacion,
      portada,
      id_categoria,
      slug
    });
    
    res.status(200).json({
      success: true,
      data: updatedLibro
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para eliminar un libro del catálogo general.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const deleteLibro = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedLibro = await librosService.deleteLibro(id);
    
    res.status(200).json({
      success: true,
      data: deletedLibro
    });
  } catch (error) {
    next(error);
  }
};
