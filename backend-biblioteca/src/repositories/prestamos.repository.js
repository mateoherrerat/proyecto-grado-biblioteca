import { query } from '../config/database.js';

/**
 * Obtiene todos los préstamos registrados en el sistema con datos de libros y usuarios.
 * 
 * @returns {Promise<Array<object>>}
 */
export const findAll = async () => {
  const text = `
    SELECT 
      p.id_prestamo,
      p.fecha_prestamo,
      p.fecha_devolucion,
      p.estado,
      p.id_usuario,
      u.nombre AS usuario_nombre,
      u.correo AS usuario_correo,
      pl.id_ejemplar,
      l.id_libro,
      l.titulo AS libro_titulo,
      l.portada AS libro_portada,
      COALESCE(b.nombre, 'Biblioteca Central') AS sede
    FROM prestamos p
    LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
    LEFT JOIN prestamos_libros pl ON p.id_prestamo = pl.id_prestamo
    LEFT JOIN ejemplares ej ON pl.id_ejemplar = ej.id_ejemplar
    LEFT JOIN libros l ON ej.id_libro = l.id_libro
    LEFT JOIN bibliotecas b ON ej.id_biblioteca = b.id_biblioteca
    ORDER BY p.fecha_prestamo DESC;
  `;
  const result = await query(text);
  return result.rows;
};

/**
 * Obtiene los préstamos de un usuario específico.
 * 
 * @param {string|number} idUsuario - ID del usuario.
 * @returns {Promise<Array<object>>}
 */
export const findByUsuario = async (idUsuario) => {
  const text = `
    SELECT 
      p.id_prestamo,
      p.fecha_prestamo,
      p.fecha_devolucion,
      p.estado,
      p.id_usuario,
      pl.id_ejemplar,
      l.id_libro,
      l.titulo AS libro_titulo,
      l.portada AS libro_portada,
      COALESCE(b.nombre, 'Biblioteca Central') AS sede
    FROM prestamos p
    LEFT JOIN prestamos_libros pl ON p.id_prestamo = pl.id_prestamo
    LEFT JOIN ejemplares ej ON pl.id_ejemplar = ej.id_ejemplar
    LEFT JOIN libros l ON ej.id_libro = l.id_libro
    LEFT JOIN bibliotecas b ON ej.id_biblioteca = b.id_biblioteca
    WHERE p.id_usuario = $1
    ORDER BY p.fecha_prestamo DESC;
  `;
  const result = await query(text, [idUsuario]);
  return result.rows;
};

/**
 * Registra un préstamo en la base de datos.
 * 
 * @param {object} data - Datos del préstamo (id_usuario, fecha_devolucion, estado).
 * @returns {Promise<object>}
 */
export const create = async (data) => {
  const { id_usuario, fecha_devolucion, estado } = data;
  const text = `
    INSERT INTO prestamos (id_usuario, fecha_prestamo, fecha_devolucion, estado)
    VALUES ($1, CURRENT_DATE, COALESCE($2, CURRENT_DATE + INTERVAL '7 days'), COALESCE($3, 'Pendiente de retiro'))
    RETURNING *;
  `;
  const result = await query(text, [id_usuario, fecha_devolucion || null, estado || null]);
  return result.rows[0];
};

/**
 * Vincula un ejemplar a un préstamo.
 * 
 * @param {number|string} idPrestamo - ID del préstamo.
 * @param {number|string} idEjemplar - ID del ejemplar físico.
 * @returns {Promise<object>}
 */
export const asociarEjemplar = async (idPrestamo, idEjemplar) => {
  const text = `
    INSERT INTO prestamos_libros (id_prestamo, id_ejemplar)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const result = await query(text, [idPrestamo, idEjemplar]);
  return result.rows[0];
};

/**
 * Registra la devolución de un préstamo cambiando su estado a 'Devuelto'.
 * 
 * @param {number|string} idPrestamo - ID del préstamo.
 * @returns {Promise<object|null>}
 */
export const marcarDevolucion = async (idPrestamo) => {
  const text = `
    UPDATE prestamos
    SET estado = 'Devuelto', fecha_devolucion = CURRENT_DATE
    WHERE id_prestamo = $1
    RETURNING *;
  `;
  const result = await query(text, [idPrestamo]);
  return result.rows[0] || null;
};
