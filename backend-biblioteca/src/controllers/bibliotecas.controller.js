import * as bibliotecasService from '../services/bibliotecas.service.js';

/**
 * Controlador para obtener el listado completo de sedes físicas.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const getAllBibliotecas = async (req, res, next) => {
  try {
    const sedes = await bibliotecasService.getAllBibliotecas();
    
    res.status(200).json({
      success: true,
      data: sedes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para obtener los detalles de una sede específica por su ID.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const getBibliotecaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sede = await bibliotecasService.getBibliotecaById(id);
    
    res.status(200).json({
      success: true,
      data: sede
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para registrar una nueva sede física.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const createBiblioteca = async (req, res, next) => {
  try {
    const { nombre, direccion, horarios, telefono, ubicacion } = req.body;
    const newSede = await bibliotecasService.createBiblioteca({
      nombre,
      direccion,
      horarios,
      telefono,
      ubicacion
    });
    
    res.status(201).json({
      success: true,
      data: newSede
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para actualizar los datos de ubicación o contacto de una sede.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const updateBiblioteca = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, direccion, horarios, telefono, ubicacion } = req.body;
    const updatedSede = await bibliotecasService.updateBiblioteca(id, {
      nombre,
      direccion,
      horarios,
      telefono,
      ubicacion
    });
    
    res.status(200).json({
      success: true,
      data: updatedSede
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para eliminar una sede física.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const deleteBiblioteca = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedSede = await bibliotecasService.deleteBiblioteca(id);
    
    res.status(200).json({
      success: true,
      data: deletedSede
    });
  } catch (error) {
    next(error);
  }
};
