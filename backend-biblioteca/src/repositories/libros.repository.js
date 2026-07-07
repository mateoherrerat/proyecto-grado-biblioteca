import { query } from '../config/database.js';

/**
 * Obtiene la lista de libros de la base de datos.
 * Si se provee un filtro, busca coincidencias en el título o en la editorial.
 * 
 * @param {string} [filter] - Texto para filtrar por título o editorial.
 * @returns {Promise<Array<object>>} Lista de libros encontrados.
 */
export const findAll = async (filter) => {
  if (filter) {
    // Usar ILIKE para realizar una búsqueda insensible a mayúsculas y acentos (dependiendo de la collation)
    const text = 'SELECT * FROM libros WHERE titulo ILIKE $1 OR editorial ILIKE $1 ORDER BY id_libro ASC;';
    const params = [`%${filter}%`];
    const result = await query(text, params);
    return result.rows;
  }
  
  const result = await query('SELECT * FROM libros ORDER BY id_libro ASC;');
  return result.rows;
};

/**
 * Recupera la información de un libro específico por su ID.
 * 
 * @param {number|string} id - El ID del libro (id_libro).
 * @returns {Promise<object|null>} El libro encontrado, o null si no existe.
 */
export const findById = async (id) => {
  const result = await query('SELECT * FROM libros WHERE id_libro = $1;', [id]);
  return result.rows[0] || null;
};

/**
 * Crea un nuevo libro en la base de datos.
 * 
 * @param {object} libroData - Objeto con la información bibliográfica del libro.
 * @param {string} [libroData.isbn] - Código ISBN del libro.
 * @param {string} libroData.titulo - Título del libro.
 * @param {string} [libroData.editorial] - Editorial del libro.
 * @param {string} [libroData.sinopsis] - Sinopsis del libro.
 * @param {string|Date} [libroData.fecha_publicacion] - Fecha de publicación.
 * @returns {Promise<object>} El objeto del libro creado.
 */
export const create = async (libroData) => {
  const { isbn, titulo, editorial, sinopsis, fecha_publicacion } = libroData;
  const text = `
    INSERT INTO libros (isbn, titulo, editorial, sinopsis, fecha_publicacion)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const params = [isbn || null, titulo, editorial || null, sinopsis || null, fecha_publicacion || null];
  
  const result = await query(text, params);
  return result.rows[0];
};

/**
 * Actualiza la información bibliográfica de un libro en la base de datos.
 * 
 * @param {number|string} id - El ID del libro a modificar (id_libro).
 * @param {object} libroData - Objeto con la nueva información.
 * @param {string} [libroData.isbn] - Nuevo código ISBN.
 * @param {string} libroData.titulo - Nuevo título.
 * @param {string} [libroData.editorial] - Nueva editorial.
 * @param {string} [libroData.sinopsis] - Nueva sinopsis.
 * @param {string|Date} [libroData.fecha_publicacion] - Nueva fecha de publicación.
 * @returns {Promise<object|null>} El libro modificado, o null si no se afectó ninguna fila.
 */
export const update = async (id, libroData) => {
  const { isbn, titulo, editorial, sinopsis, fecha_publicacion } = libroData;
  const text = `
    UPDATE libros
    SET isbn = $2, titulo = $3, editorial = $4, sinopsis = $5, fecha_publicacion = $6
    WHERE id_libro = $1
    RETURNING *;
  `;
  const params = [id, isbn || null, titulo, editorial || null, sinopsis || null, fecha_publicacion || null];
  
  const result = await query(text, params);
  return result.rows[0] || null;
};

/**
 * Elimina un libro del catálogo general de la base de datos.
 * 
 * @param {number|string} id - El ID del libro a eliminar (id_libro).
 * @returns {Promise<object|null>} El libro eliminado, o null si no existía.
 */
export const deleteById = async (id) => {
  const result = await query('DELETE FROM libros WHERE id_libro = $1 RETURNING *;', [id]);
  return result.rows[0] || null;
};
