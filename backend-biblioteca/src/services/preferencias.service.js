import * as preferenciasRepository from '../repositories/preferencias.repository.js';
import * as usuariosRepository from '../repositories/usuarios.repository.js';

/**
 * Obtiene todas las preferencias de seguimiento de libros de un usuario.
 * 
 * @param {string} idUsuario - UUID del usuario.
 * @returns {Promise<Array<object>>} Listado de libros en seguimiento.
 * @throws {Error} Si el usuario no existe.
 */
export const getPreferenciasPorUsuario = async (idUsuario) => {
  const usuario = await usuariosRepository.findById(idUsuario);
  if (!usuario) {
    const error = new Error(`El usuario con ID ${idUsuario} no existe.`);
    error.statusCode = 404;
    throw error;
  }

  return await preferenciasRepository.findPreferenciasEnriquecidasPorUsuario(idUsuario);
};

/**
 * Actualiza el estado lógico por el que el usuario quiere ser alertado para un libro de interés.
 * 
 * @param {string} idUsuario - UUID del usuario.
 * @param {number|string} idLibro - ID del libro.
 * @param {number|string|null} idEstado - ID del estado de disponibilidad.
 * @returns {Promise<object>} El registro de preferencia actualizado.
 * @throws {Error} Si no existe la preferencia previa.
 */
export const updatePreferenciaAlerta = async (idUsuario, idLibro, idEstado) => {
  // Validar existencia de la preferencia
  const pref = await preferenciasRepository.findByUsuarioYLibro(idUsuario, idLibro);
  if (!pref) {
    const error = new Error('No existe una preferencia registrada para este usuario y libro.');
    error.statusCode = 404;
    throw error;
  }

  const result = await preferenciasRepository.updatePreferenciaAlerta(idUsuario, idLibro, idEstado);
  return {
    ...result,
    id_usuario: idUsuario,
    id_libro: idLibro
  };
};
