import { query } from '../config/database.js';

/**
 * Obtiene la lista completa de autores registrados, ordenados por su ID de forma ascendente.
 * 
 * @returns {Promise<Array<object>>} Lista de objetos de autores con sus datos.
 */
export const findAll = async () => {
  const result = await query(`
    SELECT 
      a.id_autor,
      a.nombre,
      COUNT(al.id_libro)::int AS libros_count
    FROM autores a
    LEFT JOIN autores_libros al ON a.id_autor = al.id_autor
    GROUP BY a.id_autor
    ORDER BY a.nombre ASC;
  `);
  return result.rows;
};

/**
 * Recupera la información de un autor específico por su ID.
 * 
 * @param {number|string} id - El ID del autor a buscar (id_autor).
 * @returns {Promise<object|null>} El objeto del autor encontrado, o null si no existe.
 */
export const findById = async (id) => {
  const result = await query('SELECT * FROM autores WHERE id_autor = $1;', [id]);
  return result.rows[0] || null;
};

/**
 * Registra un nuevo autor en el sistema proporcionando su nombre.
 * 
 * @param {string} nombre - El nombre del autor a registrar.
 * @returns {Promise<object>} El objeto del autor creado.
 */
export const create = async (nombre) => {
  const result = await query('INSERT INTO autores (nombre) VALUES ($1) RETURNING *;', [nombre]);
  return result.rows[0];
};

/**
 * Actualiza el nombre de un autor existente en la base de datos.
 * 
 * @param {number|string} id - El ID del autor a modificar.
 * @param {string} nombre - El nuevo nombre del autor.
 * @returns {Promise<object|null>} El objeto del autor modificado, o null si no se afectó ninguna fila.
 */
export const update = async (id, nombre) => {
  const result = await query(
    'UPDATE autores SET nombre = $2 WHERE id_autor = $1 RETURNING *;',
    [id, nombre]
  );
  return result.rows[0] || null;
};

/**
 * Elimina un autor de la base de datos.
 * 
 * @param {number|string} id - El ID del autor a eliminar.
 * @returns {Promise<object|null>} El objeto del autor eliminado, o null si no existía.
 */
export const deleteById = async (id) => {
  const result = await query('DELETE FROM autores WHERE id_autor = $1 RETURNING *;', [id]);
  return result.rows[0] || null;
};

/**
 * Verifica si un autor tiene libros asociados en la tabla de autores_libros.
 * 
 * @param {number|string} id - El ID del autor a comprobar.
 * @returns {Promise<boolean>} Verdadero si el autor tiene uno o más libros, falso de lo contrario.
 */
export const hasBooks = async (id) => {
  const result = await query(
    'SELECT EXISTS(SELECT 1 FROM autores_libros WHERE id_autor = $1) as "hasBooks";',
    [id]
  );
  
  // Retornar explícitamente el booleano devuelto por EXISTS de PostgreSQL
  return result.rows[0].hasBooks;
};
