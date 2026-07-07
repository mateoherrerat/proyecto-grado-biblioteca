import * as multasRepository from '../repositories/multas.repository.js';

/**
 * Obtiene el listado de todas las multas que están pendientes de pago, con datos de usuario y libro.
 * 
 * @returns {Promise<Array<object>>} Listado enriquecido de multas.
 */
export const getMultasPendientes = async () => {
  return await multasRepository.findPendientesEnriquecidas();
};

/**
 * Registra el pago de una multa tras validar su existencia y que esté en estado 'Pendiente'.
 * 
 * @param {number|string} id - ID de la multa a pagar.
 * @returns {Promise<object>} Objeto de la multa actualizada.
 * @throws {Error} Si la multa no existe o ya se encuentra pagada.
 */
export const registrarPago = async (id) => {
  // Verificar existencia previa
  const multa = await multasRepository.findById(id);
  
  if (!multa) {
    const error = new Error(`La multa con ID ${id} no fue encontrada en el sistema.`);
    error.statusCode = 404;
    throw error;
  }
  
  // Validar si la multa ya fue pagada
  if (multa.estado === 'Pagada') {
    const error = new Error(`La multa con ID ${id} ya ha sido registrada como Pagada.`);
    error.statusCode = 400;
    throw error;
  }
  
  return await multasRepository.registrarPago(id);
};
