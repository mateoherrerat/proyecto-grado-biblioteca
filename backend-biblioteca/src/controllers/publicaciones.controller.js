import * as publicacionesService from '../services/publicaciones.service.js';

/**
 * Controlador para obtener el listado cronológico de todas las publicaciones del sistema.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const getPublicaciones = async (req, res, next) => {
  try {
    const publicaciones = await publicacionesService.getAllPublicaciones();
    res.status(200).json({
      success: true,
      data: publicaciones
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para registrar una nueva publicación o anuncio.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const createPublicacion = async (req, res, next) => {
  try {
    const { id_autor, descripcion, slug, fecha } = req.body;
    const nueva = await publicacionesService.createPublicacion({
      id_autor,
      descripcion,
      slug,
      fecha
    });
    res.status(201).json({
      success: true,
      data: nueva
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para obtener la lista de libros vinculados a una publicación de novedad.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const getLibrosDePublicacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const libros = await publicacionesService.getLibrosDePublicacion(id);
    res.status(200).json({
      success: true,
      data: libros
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para vincular un libro a una publicación específica.
 * Soporta leer tanto id_novedad como id_publicacion del payload body.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const vincularLibro = async (req, res, next) => {
  try {
    const { id_novedad, id_publicacion, id_libro } = req.body;
    const targetNovedadId = id_novedad || id_publicacion;

    if (!targetNovedadId) {
      const error = new Error('El ID de la publicación (id_novedad o id_publicacion) es obligatorio.');
      error.statusCode = 400;
      throw error;
    }

    if (!id_libro) {
      const error = new Error('El ID del libro (id_libro) es obligatorio.');
      error.statusCode = 400;
      throw error;
    }

    const relacion = await publicacionesService.vincularLibro(targetNovedadId, id_libro);
    res.status(201).json({
      success: true,
      data: relacion
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para desvincular un libro de una publicación específica.
 * Soporta recibir parámetros desde body, query string o parámetros de ruta.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const desvincularLibro = async (req, res, next) => {
  try {
    // Buscar en body, query o params
    const id_novedad = req.body.id_novedad || req.query.id_novedad || req.body.id_publicacion || req.query.id_publicacion || req.params.id;
    const id_libro = req.body.id_libro || req.query.id_libro || req.params.idLibro;

    if (!id_novedad) {
      const error = new Error('El ID de la publicación (id_novedad o id_publicacion) es obligatorio.');
      error.statusCode = 400;
      throw error;
    }

    if (!id_libro) {
      const error = new Error('El ID del libro (id_libro) es obligatorio.');
      error.statusCode = 400;
      throw error;
    }

    const desvinculado = await publicacionesService.desvincularLibro(id_novedad, id_libro);
    res.status(200).json({
      success: true,
      data: desvinculado
    });
  } catch (error) {
    next(error);
  }
};
