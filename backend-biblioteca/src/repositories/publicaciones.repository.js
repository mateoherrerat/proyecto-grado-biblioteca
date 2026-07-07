import { query } from '../config/database.js';

/**
 * Recupera todas las publicaciones registradas en el sistema, enriquecidas con el nombre del autor.
 * Ordenado de la más reciente a la más antigua.
 * 
 * @returns {Promise<Array<object>>} Listado de publicaciones.
 */
export const findAllEnriquecidas = async () => {
  const text = `
    SELECT p.*, a.nombre AS autor_nombre 
    FROM publicaciones p 
    INNER JOIN autores a ON p.id_autor = a.id_autor 
    ORDER BY p.fecha DESC, p.id_novedad DESC;
  `;
  const result = await query(text);
  return result.rows;
};

/**
 * Busca una publicación por su clave primaria (id_novedad).
 * 
 * @param {number|string} id - ID de la publicación.
 * @returns {Promise<object|null>} La publicación o null si no se encuentra.
 */
export const findById = async (id) => {
  const text = 'SELECT * FROM publicaciones WHERE id_novedad = $1;';
  const result = await query(text, [id]);
  return result.rows[0] || null;
};

/**
 * Registra una nueva publicación en el sistema.
 * 
 * @param {object} data - Datos de la publicación.
 * @param {number|string} data.id_autor - ID del autor de la publicación.
 * @param {string} data.descripcion - Cuerpo del anuncio.
 * @param {string} data.fecha - Fecha del anuncio (YYYY-MM-DD).
 * @param {string} data.slug - Enlace o slug de la publicación.
 * @returns {Promise<object>} La publicación creada.
 */
export const create = async (data) => {
  const { id_autor, descripcion, fecha, slug } = data;
  const text = `
    INSERT INTO publicaciones (id_autor, descripcion, fecha, slug)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await query(text, [id_autor, descripcion, fecha, slug]);
  return result.rows[0];
};

/**
 * Recupera el listado de todos los libros vinculados a una publicación/novedad específica.
 * 
 * @param {number|string} idNovedad - ID de la publicación (id_novedad).
 * @returns {Promise<Array<object>>} Lista de libros vinculados.
 */
export const findLibrosVinculados = async (idNovedad) => {
  const text = `
    SELECT l.* 
    FROM libros l 
    INNER JOIN publicaciones_libros pl ON l.id_libro = pl.id_libro 
    WHERE pl.id_novedad = $1
    ORDER BY l.id_libro ASC;
  `;
  const result = await query(text, [idNovedad]);
  return result.rows;
};

/**
 * Vincula un libro a una publicación específica.
 * 
 * @param {number|string} idNovedad - ID de la publicación.
 * @param {number|string} idLibro - ID del libro.
 * @returns {Promise<object>} La relación creada en publicaciones_libros.
 */
export const vincularLibro = async (idNovedad, idLibro) => {
  const text = `
    INSERT INTO publicaciones_libros (id_novedad, id_libro)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const result = await query(text, [idNovedad, idLibro]);
  return result.rows[0];
};

/**
 * Quita la relación entre un libro y una publicación.
 * 
 * @param {number|string} idNovedad - ID de la publicación.
 * @param {number|string} idLibro - ID del libro a desvincular.
 * @returns {Promise<object|null>} La relación eliminada, o null si no existía.
 */
export const desvincularLibro = async (idNovedad, idLibro) => {
  const text = `
    DELETE FROM publicaciones_libros 
    WHERE id_novedad = $1 AND id_libro = $2
    RETURNING *;
  `;
  const result = await query(text, [idNovedad, idLibro]);
  return result.rows[0] || null;
};

/**
 * Verifica si ya existe una relación específica entre un libro y una publicación.
 * 
 * @param {number|string} idNovedad - ID de la publicación.
 * @param {number|string} idLibro - ID del libro.
 * @returns {Promise<boolean>} True si ya existe, false en caso contrario.
 */
export const existeRelacion = async (idNovedad, idLibro) => {
  const text = `
    SELECT 1 FROM publicaciones_libros 
    WHERE id_novedad = $1 AND id_libro = $2 
    LIMIT 1;
  `;
  const result = await query(text, [idNovedad, idLibro]);
  return result.rowCount > 0;
};
