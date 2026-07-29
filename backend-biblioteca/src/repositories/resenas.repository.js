import { query } from '../config/database.js';

/**
 * Recupera todas las reseñas asociadas a una biblioteca específica.
 * 
 * @param {number|string} idBiblioteca - ID de la sede física.
 * @returns {Promise<Array<object>>}
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
 * Registra una nueva reseña para una sede física.
 * 
 * @param {object} data - Datos de la reseña.
 * @returns {Promise<object>}
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

/**
 * Recupera todas las reseñas de un libro en particular.
 * 
 * @param {number|string} idLibro - ID del libro.
 * @returns {Promise<Array<object>>}
 */
export const findByLibro = async (idLibro) => {
  const text = `
    SELECT 
      r.id_resena,
      r.id_libro,
      r.id_usuario,
      r.comentarios,
      r.valoracion,
      r.fecha,
      u.nombre AS usuario_nombre,
      u.correo AS usuario_correo
    FROM resenas_libros r
    LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
    WHERE r.id_libro = $1
    ORDER BY r.fecha DESC, r.id_resena DESC;
  `;
  const result = await query(text, [idLibro]);
  return result.rows;
};

/**
 * Registra una reseña para un libro.
 * 
 * @param {object} data - Datos de la reseña de libro.
 * @returns {Promise<object>}
 */
export const createResenaLibro = async (data) => {
  const { id_libro, id_usuario, valoracion, comentarios } = data;
  const text = `
    INSERT INTO resenas_libros (id_libro, id_usuario, valoracion, comentarios, fecha)
    VALUES ($1, $2, $3, $4, CURRENT_DATE)
    RETURNING *;
  `;
  const result = await query(text, [id_libro, id_usuario, valoracion, comentarios || null]);
  return result.rows[0];
};
