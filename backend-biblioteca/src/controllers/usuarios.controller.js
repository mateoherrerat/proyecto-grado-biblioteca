import * as usuariosService from '../services/usuarios.service.js';

/**
 * Controlador para obtener el listado completo de usuarios en el sistema.
 * 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores.
 * @returns {Promise<void>}
 */
export const getUsuarios = async (req, res, next) => {
  try {
    const usuarios = await usuariosService.getAllUsuarios();
    
    res.status(200).json({
      success: true,
      data: usuarios
    });
  } catch (error) {
    next(error);
  }
};
