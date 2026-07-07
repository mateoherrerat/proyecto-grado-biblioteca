import { query } from '../config/database.js';

/**
 * Obtiene la lista completa de estados físicos registrados para los ejemplares.
 * 
 * @returns {Promise<Array<object>>} Listado de estados físicos.
 */
export const findEstadosFisicos = async () => {
  const text = 'SELECT * FROM estados_fisicos ORDER BY id_estado_fisico ASC;';
  const result = await query(text);
  return result.rows;
};

/**
 * Registra una nueva categoría de estado físico de libros en la base de datos.
 * 
 * @param {string} tipo - El nombre del estado físico (tipo_estado).
 * @returns {Promise<object>} El objeto del estado físico creado.
 */
export const createEstadoFisico = async (tipo) => {
  const text = 'INSERT INTO estados_fisicos (tipo_estado) VALUES ($1) RETURNING *;';
  const result = await query(text, [tipo]);
  return result.rows[0];
};

/**
 * Obtiene la lista completa de estados lógicos de disponibilidad en la biblioteca.
 * 
 * @returns {Promise<Array<object>>} Listado de disponibilidades lógicas.
 */
export const findDisponibilidades = async () => {
  const text = 'SELECT * FROM estados_disponibilidades ORDER BY id_estado_disponibilidad ASC;';
  const result = await query(text);
  return result.rows;
};
