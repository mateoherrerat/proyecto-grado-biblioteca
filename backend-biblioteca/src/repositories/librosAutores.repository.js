import { query } from '../config/database.js';

/**
 * Registra una nueva asociación entre un autor y un libro.
 * 
 * @param {number|string} idAutor - El ID del autor.
 * @param {number|string} idLibro - El ID del libro.
 * @returns {Promise<object>} El objeto de la relación creado.
 */
export const create = async (idAutor, idLibro) => {
  const text = 'INSERT INTO autores_libros (id_autor, id_libro) VALUES ($1, $2) RETURNING *;';
  const params = [idAutor, idLibro];
  const result = await query(text, params);
  return result.rows[0];
};

/**
 * Obtiene todos los autores asociados a un libro específico.
 * Retorna tanto la información del autor como el ID de la relación.
 * 
 * @param {number|string} idLibro - El ID del libro.
 * @returns {Promise<Array<object>>} Lista de autores asociados con sus IDs de relación.
 */
export const findAuthorsByBookId = async (idLibro) => {
  const text = `
    SELECT a.id_autor, a.nombre, al.id_autor_libro 
    FROM autores a 
    JOIN autores_libros al ON a.id_autor = al.id_autor 
    WHERE al.id_libro = $1 
    ORDER BY a.nombre ASC;
  `;
  const params = [idLibro];
  const result = await query(text, params);
  return result.rows;
};

/**
 * Recupera una asociación específica por su ID.
 * 
 * @param {number|string} id - El ID de la relación (id_autor_libro).
 * @returns {Promise<object|null>} El objeto de la relación o null si no existe.
 */
export const findById = async (id) => {
  const text = 'SELECT * FROM autores_libros WHERE id_autor_libro = $1;';
  const result = await query(text, [id]);
  return result.rows[0] || null;
};

/**
 * Verifica si ya existe una asociación entre un autor y un libro específicos.
 * 
 * @param {number|string} idAutor - El ID del autor.
 * @param {number|string} idLibro - El ID del libro.
 * @returns {Promise<boolean>} Verdadero si ya existe la relación, falso de lo contrario.
 */
export const exists = async (idAutor, idLibro) => {
  const text = 'SELECT EXISTS(SELECT 1 FROM autores_libros WHERE id_autor = $1 AND id_libro = $2) as "exists";';
  const params = [idAutor, idLibro];
  const result = await query(text, params);
  return result.rows[0].exists;
};

/**
 * Elimina una asociación autor-libro de la base de datos.
 * 
 * @param {number|string} id - El ID de la relación a eliminar (id_autor_libro).
 * @returns {Promise<object|null>} El objeto de la relación eliminado, o null si no existía.
 */
export const deleteById = async (id) => {
  const text = 'DELETE FROM autores_libros WHERE id_autor_libro = $1 RETURNING *;';
  const result = await query(text, [id]);
  return result.rows[0] || null;
};
