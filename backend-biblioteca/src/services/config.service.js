import * as configRepository from '../repositories/config.repository.js';

/**
 * Obtiene el listado completo de estados físicos configurados.
 * 
 * @returns {Promise<Array<object>>}
 */
export const getEstadosFisicos = async () => {
  return await configRepository.findEstadosFisicos();
};

/**
 * Registra un nuevo estado físico en la base de datos tras validar su nombre.
 * 
 * @param {string} tipo - El nombre del estado físico a registrar (tipo_estado).
 * @returns {Promise<object>} El estado físico creado.
 * @throws {Error} Si el nombre del estado está vacío.
 */
export const createEstadoFisico = async (tipo) => {
  if (!tipo || typeof tipo !== 'string' || tipo.trim() === '') {
    const error = new Error('El nombre de la categoría del estado físico es obligatorio.');
    error.statusCode = 400;
    throw error;
  }

  return await configRepository.createEstadoFisico(tipo.trim());
};

/**
 * Obtiene el listado completo de estados lógicos de disponibilidad.
 * 
 * @returns {Promise<Array<object>>}
 */
export const getDisponibilidades = async () => {
  return await configRepository.findDisponibilidades();
};
