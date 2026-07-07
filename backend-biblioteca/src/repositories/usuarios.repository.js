import { query } from '../config/database.js';

/**
 * Obtiene el listado completo de todos los usuarios registrados en el sistema.
 * 
 * @returns {Promise<Array<object>>} Lista de usuarios.
 */
export const findAll = async () => {
  const text = 'SELECT id_usuario, nombre, correo FROM usuarios ORDER BY nombre ASC;';
  const result = await query(text);
  return result.rows;
};

/**
 * Recupera la información de un usuario específico mediante su ID.
 * 
 * @param {string} id - ID del usuario (tipo uuid).
 * @returns {Promise<object|null>} Objeto de usuario o null si no se encuentra.
 */
export const findById = async (id) => {
  const text = 'SELECT * FROM usuarios WHERE id_usuario = $1;';
  const result = await query(text, [id]);
  return result.rows[0] || null;
};
