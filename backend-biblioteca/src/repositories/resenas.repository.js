import { query } from '../config/database.js';

/**
 * Recupera todas las reseñas asociadas a una biblioteca específica.
 * Une con la tabla 'usuarios' para traer el nombre y correo del calificador.
 * 
 * @param {number|string} idBiblioteca - ID de la sede física (id_biblioteca).
 * @returns {Promise<Array<object>>} Listado de reseñas.
 */
export const findByBiblioteca = async (idBiblioteca) => {
  const text = `
    SELECT 
      r.id_resena,
      r.id_biblioteca,
      r.id_usuario,
      r.comentarios,
      r.valoracion,
      r.fecha,
      u.nombre AS usuario_nombre,
      u.correo AS usuario_correo
    FROM resenas_bibliotecas r
    INNER JOIN usuarios u ON r.id_usuario = u.id_usuario
    WHERE r.id_biblioteca = $1
    ORDER BY r.fecha DESC, r.id_resena DESC;
  `;
  const result = await query(text, [idBiblioteca]);
  return result.rows;
};

/**
 * Registra una nueva reseña o calificación para una sede física.
 * 
 * @param {object} data - Datos de la reseña.
 * @param {number|string} data.id_biblioteca - ID de la sede física.
 * @param {string} data.id_usuario - ID del usuario (UUID).
 * @param {number} data.valoracion - Calificación numérica (1-5).
 * @param {string} [data.comentarios] - Comentario del usuario.
 * @returns {Promise<object>} La reseña creada.
 */
export const create = async (data) => {
  const { id_biblioteca, id_usuario, valoracion, comentarios } = data;
  const text = `
    INSERT INTO resenas_bibliotecas (id_biblioteca, id_usuario, valoracion, comentarios, fecha)
    VALUES ($1, $2, $3, $4, CURRENT_DATE)
    RETURNING *;
  `;
  const result = await query(text, [id_biblioteca, id_usuario, valoracion, comentarios || null]);
  return result.rows[0];
};
