import * as usuariosRepository from '../repositories/usuarios.repository.js';

/**
 * Obtiene el listado completo de usuarios en el sistema.
 * 
 * @returns {Promise<Array<object>>} Listado de usuarios.
 */
export const getAllUsuarios = async () => {
  return await usuariosRepository.findAll();
};
