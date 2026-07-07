import { query } from '../config/database.js';

/**
 * Recupera todas las multas que se encuentran en estado 'Pendiente' con información detallada del préstamo, usuario y libro.
 * 
 * @returns {Promise<Array<object>>} Listado enriquecido de multas pendientes.
 */
export const findPendientesEnriquecidas = async () => {
  const text = `
    SELECT 
      m.id_multa,
      m.id_prestamo,
      m.monto,
      m.fecha_pago,
      m.descripcion,
      m.estado,
      u.nombre AS usuario_nombre,
      u.correo AS usuario_correo,
      p.fecha_prestamo,
      p.fecha_devolucion AS fecha_devolucion_esperada,
      l.titulo AS libro_titulo
    FROM multas m
    INNER JOIN prestamos p ON m.id_prestamo = p.id_prestamo
    INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
    LEFT JOIN prestamos_libros pl ON p.id_prestamo = pl.id_prestamo
    LEFT JOIN ejemplares e ON pl.id_ejemplar = e.id_ejemplar
    LEFT JOIN libros l ON e.id_libro = l.id_libro
    WHERE m.estado = 'Pendiente'
    ORDER BY m.id_multa ASC;
  `;
  const result = await query(text);
  return result.rows;
};

/**
 * Busca una multa por su clave primaria (id_multa).
 * 
 * @param {number|string} id - El ID de la multa.
 * @returns {Promise<object|null>} Objeto de la multa o null si no se encuentra.
 */
export const findById = async (id) => {
  const text = 'SELECT * FROM multas WHERE id_multa = $1;';
  const result = await query(text, [id]);
  return result.rows[0] || null;
};

/**
 * Registra el pago de una multa, actualizando su estado a 'Pagada' y asignando la fecha de pago actual.
 * 
 * @param {number|string} id - El ID de la multa a actualizar (id_multa).
 * @returns {Promise<object|null>} Objeto de la multa actualizada o null si no existía.
 */
export const registrarPago = async (id) => {
  const text = `
    UPDATE multas 
    SET fecha_pago = CURRENT_DATE, estado = 'Pagada' 
    WHERE id_multa = $1 
    RETURNING *;
  `;
  const result = await query(text, [id]);
  return result.rows[0] || null;
};
