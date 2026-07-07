import * as configService from '../services/config.service.js';

/**
 * Controlador para listar todos los estados físicos del sistema.
 * 
 * @param {import('express').Request} req - Solicitud de Express.
 * @param {import('express').Response} res - Respuesta de Express.
 * @param {import('express').NextFunction} next - Middleware de error.
 * @returns {Promise<void>}
 */
export const getEstadosFisicos = async (req, res, next) => {
  try {
    const estados = await configService.getEstadosFisicos();
    res.status(200).json({
      success: true,
      data: estados
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para crear un nuevo estado físico de ejemplares.
 * Soporta la lectura flexible de 'tipo_estado' o 'nombre_estado'.
 * 
 * @param {import('express').Request} req - Solicitud de Express.
 * @param {import('express').Response} res - Respuesta de Express.
 * @param {import('express').NextFunction} next - Middleware de error.
 * @returns {Promise<void>}
 */
export const createEstadoFisico = async (req, res, next) => {
  try {
    const { tipo_estado, nombre_estado } = req.body;
    const tipo = tipo_estado || nombre_estado;

    const nuevo = await configService.createEstadoFisico(tipo);
    res.status(201).json({
      success: true,
      data: nuevo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para listar las opciones de disponibilidad lógica.
 * 
 * @param {import('express').Request} req - Solicitud de Express.
 * @param {import('express').Response} res - Respuesta de Express.
 * @param {import('express').NextFunction} next - Middleware de error.
 * @returns {Promise<void>}
 */
export const getDisponibilidades = async (req, res, next) => {
  try {
    const disponibilidades = await configService.getDisponibilidades();
    res.status(200).json({
      success: true,
      data: disponibilidades
    });
  } catch (error) {
    next(error);
  }
};
