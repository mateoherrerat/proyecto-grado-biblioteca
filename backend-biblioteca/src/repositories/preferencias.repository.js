import { query } from '../config/database.js';

/**
 * Obtiene el listado de preferencias (libros seguidos) de un usuario.
 * Une con las tablas 'libros' y 'estados_disponibilidades' para devolver datos claros al frontend.
 * 
 * @param {string} idUsuario - UUID del usuario.
 * @returns {Promise<Array<object>>} Listado enriquecido de libros de interés.
 */
export const findPreferenciasEnriquecidasPorUsuario = async (idUsuario) => {
  const text = `
    SELECT 
      p.id_preferencia_usuario,
      p.id_usuario,
      p.id_libro,
      p.id_estado_disponibilidad_libro,
      l.titulo AS libro_titulo,
      ed.tipo_estado_disponibilidad AS estado_alerta_nombre
    FROM preferencias_usuarios p
    INNER JOIN libros l ON p.id_libro = l.id_libro
    LEFT JOIN estados_disponibilidades ed ON p.id_estado_disponibilidad_libro = ed.id_estado_disponibilidad
    WHERE p.id_usuario = $1
    ORDER BY p.id_preferencia_usuario ASC;
  `;
  const result = await query(text, [idUsuario]);
  return result.rows;
};

/**
 * Actualiza la preferencia de estado de disponibilidad (alerta) para un libro seguido por un usuario.
 * 
 * @param {string} idUsuario - UUID del usuario.
 * @param {number|string} idLibro - ID del libro.
 * @param {number|string|null} idEstado - ID del estado de disponibilidad por el que se quiere alertar.
 * @returns {Promise<object|null>} El registro modificado.
 */
export const updatePreferenciaAlerta = async (idUsuario, idLibro, idEstado) => {
  const text = `
    UPDATE preferencias_usuarios
    SET id_estado_disponibilidad_libro = $3
    WHERE id_usuario = $1 AND id_libro = $2
    RETURNING *;
  `;
  const result = await query(text, [idUsuario, idLibro, idEstado || null]);
  return result.rows[0] || null;
};

/**
 * Comprueba si un usuario tiene guardado un libro en su lista de preferencias.
 * 
 * @param {string} idUsuario - UUID del usuario.
 * @param {number|string} idLibro - ID del libro.
 * @returns {Promise<object|null>} El registro de la preferencia o null.
 */
export const findByUsuarioYLibro = async (idUsuario, idLibro) => {
  const text = 'SELECT * FROM preferencias_usuarios WHERE id_usuario = $1 AND id_libro = $2;';
  const result = await query(text, [idUsuario, idLibro]);
  return result.rows[0] || null;
};
