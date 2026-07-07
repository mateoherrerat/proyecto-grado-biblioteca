import { query } from '../config/database.js';

/**
 * Obtiene el listado completo de sedes de la red de bibliotecas, ordenados por su ID.
 * 
 * @returns {Promise<Array<object>>} Lista de sedes físicas de la biblioteca.
 */
export const findAll = async () => {
  const result = await query('SELECT * FROM bibliotecas ORDER BY id_biblioteca ASC;');
  return result.rows;
};

/**
 * Recupera la información de una sede física por su ID.
 * 
 * @param {number|string} id - El ID de la sede (id_biblioteca).
 * @returns {Promise<object|null>} El objeto de la sede o null si no existe.
 */
export const findById = async (id) => {
  const result = await query('SELECT * FROM bibliotecas WHERE id_biblioteca = $1;', [id]);
  return result.rows[0] || null;
};

/**
 * Registra una nueva sede física en la base de datos.
 * 
 * @param {object} data - Datos de la sede a registrar.
 * @param {string} data.nombre - Nombre de la sede.
 * @param {string} [data.direccion] - Dirección física.
 * @param {string} [data.horarios] - Horario de atención al público.
 * @param {string} [data.telefono] - Teléfono de contacto.
 * @param {string} [data.ubicacion] - Enlace a ubicación geográfica o mapa.
 * @returns {Promise<object>} El objeto de la sede creado.
 */
export const create = async (data) => {
  const { nombre, direccion, horarios, telefono, ubicacion } = data;
  const text = `
    INSERT INTO bibliotecas (nombre, direccion, horarios, telefono, ubicacion)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const params = [
    nombre,
    direccion || null,
    horarios || null,
    telefono || null,
    ubicacion || null,
  ];
  
  const result = await query(text, params);
  return result.rows[0];
};

/**
 * Actualiza la información de ubicación o contacto de una sede.
 * 
 * @param {number|string} id - El ID de la sede a actualizar.
 * @param {object} data - Nuevos datos para la sede.
 * @param {string} data.nombre - Nombre de la sede.
 * @param {string} [data.direccion] - Nueva dirección.
 * @param {string} [data.horarios] - Nuevos horarios.
 * @param {string} [data.telefono] - Nuevo teléfono de contacto.
 * @param {string} [data.ubicacion] - Nuevo enlace de mapa.
 * @returns {Promise<object|null>} El objeto de la sede actualizado, o null si no se encontró.
 */
export const update = async (id, data) => {
  const { nombre, direccion, horarios, telefono, ubicacion } = data;
  const text = `
    UPDATE bibliotecas
    SET nombre = $2, direccion = $3, horarios = $4, telefono = $5, ubicacion = $6
    WHERE id_biblioteca = $1
    RETURNING *;
  `;
  const params = [
    id,
    nombre,
    direccion || null,
    horarios || null,
    telefono || null,
    ubicacion || null,
  ];
  
  const result = await query(text, params);
  return result.rows[0] || null;
};

/**
 * Elimina una sede física de la base de datos.
 * 
 * @param {number|string} id - El ID de la sede a eliminar (id_biblioteca).
 * @returns {Promise<object|null>} El objeto de la sede eliminado, o null si no existía.
 */
export const deleteById = async (id) => {
  const result = await query('DELETE FROM bibliotecas WHERE id_biblioteca = $1 RETURNING *;', [id]);
  return result.rows[0] || null;
};
