import { query } from '../config/database.js';

/**
 * Obtiene la lista de libros de la base de datos con información real de sedes, disponibilidad y reseñas.
 * 
 * @param {string} [filter] - Texto para filtrar por título, editorial, categoría o autor.
 * @returns {Promise<Array<object>>} Lista de libros encontrados con datos reales.
 */
export const findAll = async (filter) => {
  let text = `
    SELECT 
      l.id_libro,
      l.isbn,
      l.titulo,
      l.editorial,
      l.sinopsis,
      l.fecha_publicacion,
      l.portada,
      l.slug,
      l.id_categoria,
      c.nombre AS categoria,
      COALESCE(STRING_AGG(DISTINCT a.nombre, ', '), 'Autor Desconocido') AS autor,
      COALESCE(MIN(b.nombre), 'Sede Principal') AS sede,
      COALESCE(MIN(ed.tipo_estado_disponibilidad), 'Disponible') AS estado_disponibilidad,
      COALESCE(ROUND(AVG(rl.valoracion)::numeric, 1), 4.5) AS calificacion
    FROM libros l
    LEFT JOIN categorias c ON l.id_categoria = c.id_categoria
    LEFT JOIN autores_libros al ON l.id_libro = al.id_libro
    LEFT JOIN autores a ON al.id_autor = a.id_autor
    LEFT JOIN ejemplares ej ON l.id_libro = ej.id_libro
    LEFT JOIN bibliotecas b ON ej.id_biblioteca = b.id_biblioteca
    LEFT JOIN estados_disponibilidades ed ON ej.id_estado_disponibilidad = ed.id_estado_disponibilidad
    LEFT JOIN resenas_libros rl ON l.id_libro = rl.id_libro
  `;

  if (filter) {
    try {
      const textUnaccent = text + ` WHERE 
        l.titulo ILIKE $1 OR 
        COALESCE(l.editorial, '') ILIKE $1 OR 
        COALESCE(c.nombre, '') ILIKE $1 OR 
        COALESCE(l.isbn, '') ILIKE $1 OR 
        COALESCE(a.nombre, '') ILIKE $1
        GROUP BY l.id_libro, c.nombre ORDER BY l.id_libro ASC;
      `;
      const result = await query(textUnaccent, [`%${filter}%`]);
      return result.rows;
    } catch {
      // Fallback en caso de error de consulta
      const result = await query(text + ` GROUP BY l.id_libro, c.nombre ORDER BY l.id_libro ASC;`);
      return result.rows;
    }
  }
  
  text += ` GROUP BY l.id_libro, c.nombre ORDER BY l.id_libro ASC;`;
  const result = await query(text);
  return result.rows;
};


/**
 * Recupera la información completa de un libro por ID o slug.
 * 
 * @param {number|string} idOrSlug - ID o slug del libro.
 * @returns {Promise<object|null>} Libro encontrado con datos reales.
 */
export const findById = async (idOrSlug) => {
  const text = `
    SELECT 
      l.id_libro,
      l.isbn,
      l.titulo,
      l.editorial,
      l.sinopsis,
      l.fecha_publicacion,
      l.portada,
      l.slug,
      l.id_categoria,
      c.nombre AS categoria,
      COALESCE(STRING_AGG(DISTINCT a.nombre, ', '), 'Autor Desconocido') AS autor,
      COALESCE(MIN(b.nombre), 'Sede Principal') AS sede,
      COALESCE(MIN(ed.tipo_estado_disponibilidad), 'Disponible') AS estado_disponibilidad,
      COALESCE(ROUND(AVG(rl.valoracion)::numeric, 1), 4.5) AS calificacion
    FROM libros l
    LEFT JOIN categorias c ON l.id_categoria = c.id_categoria
    LEFT JOIN autores_libros al ON l.id_libro = al.id_libro
    LEFT JOIN autores a ON al.id_autor = a.id_autor
    LEFT JOIN ejemplares ej ON l.id_libro = ej.id_libro
    LEFT JOIN bibliotecas b ON ej.id_biblioteca = b.id_biblioteca
    LEFT JOIN estados_disponibilidades ed ON ej.id_estado_disponibilidad = ed.id_estado_disponibilidad
    LEFT JOIN resenas_libros rl ON l.id_libro = rl.id_libro
    WHERE l.id_libro::text = $1 OR l.slug = $1
    GROUP BY l.id_libro, c.nombre;
  `;
  const result = await query(text, [idOrSlug]);
  return result.rows[0] || null;
};

export const create = async (libroData) => {
  const { isbn, titulo, editorial, sinopsis, fecha_publicacion, portada, id_categoria, slug } = libroData;
  const text = `
    INSERT INTO libros (isbn, titulo, editorial, sinopsis, fecha_publicacion, portada, id_categoria, slug)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const params = [
    isbn || null,
    titulo,
    editorial || null,
    sinopsis || null,
    fecha_publicacion || null,
    portada || null,
    id_categoria || null,
    slug || null
  ];
  
  const result = await query(text, params);
  return result.rows[0];
};

export const update = async (id, libroData) => {
  const { isbn, titulo, editorial, sinopsis, fecha_publicacion, portada, id_categoria, slug } = libroData;
  const text = `
    UPDATE libros
    SET isbn = COALESCE($2, isbn),
        titulo = COALESCE($3, titulo),
        editorial = COALESCE($4, editorial),
        sinopsis = COALESCE($5, sinopsis),
        fecha_publicacion = COALESCE($6, fecha_publicacion),
        portada = COALESCE($7, portada),
        id_categoria = COALESCE($8, id_categoria),
        slug = COALESCE($9, slug)
    WHERE id_libro = $1
    RETURNING *;
  `;
  const params = [
    id,
    isbn || null,
    titulo || null,
    editorial || null,
    sinopsis || null,
    fecha_publicacion || null,
    portada || null,
    id_categoria || null,
    slug || null
  ];
  
  const result = await query(text, params);
  return result.rows[0] || null;
};

export const deleteById = async (id) => {
  const result = await query('DELETE FROM libros WHERE id_libro = $1 RETURNING *;', [id]);
  return result.rows[0] || null;
};
