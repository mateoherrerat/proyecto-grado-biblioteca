import * as bibliotecasRepository from '../repositories/bibliotecas.repository.js';

/**
 * Obtiene el listado completo de sedes físicas registradas.
 * 
 * @returns {Promise<Array<object>>} Lista de sedes.
 */
export const getAllBibliotecas = async () => {
  return await bibliotecasRepository.findAll();
};

/**
 * Recupera la información de una sede física por su ID.
 * Lanza un error HTTP 404 si la sede no existe.
 * 
 * @param {number|string} id - El ID de la sede (id_biblioteca).
 * @returns {Promise<object>} El objeto de la sede.
 * @throws {Error} Si la sede no es encontrada.
 */
export const getBibliotecaById = async (id) => {
  const biblioteca = await bibliotecasRepository.findById(id);
  
  if (!biblioteca) {
    const error = new Error(`La sede física con ID ${id} no fue encontrada.`);
    error.statusCode = 404;
    throw error;
  }
  
  return biblioteca;
};

/**
 * Registra una nueva sede física en el sistema validando sus datos.
 * 
 * @param {object} data - Datos de la sede a registrar.
 * @param {string} data.nombre - Nombre de la sede.
 * @returns {Promise<object>} La sede creada.
 * @throws {Error} Si el nombre está vacío.
 */
export const createBiblioteca = async (data) => {
  const { nombre } = data;
  
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    const error = new Error('El nombre de la sede física es obligatorio y debe ser un texto válido.');
    error.statusCode = 400;
    throw error;
  }
  
  const sanitizedData = {
    ...data,
    nombre: nombre.trim(),
    direccion: data.direccion ? data.direccion.trim() : null,
    horarios: data.horarios ? data.horarios.trim() : null,
    telefono: data.telefono ? data.telefono.trim() : null,
    ubicacion: data.ubicacion ? data.ubicacion.trim() : null,
  };
  
  return await bibliotecasRepository.create(sanitizedData);
};

/**
 * Actualiza la información de una sede física existente.
 * Valida la existencia previa de la sede.
 * 
 * @param {number|string} id - ID de la sede a actualizar.
 * @param {object} data - Nuevos datos para la sede.
 * @param {string} data.nombre - Nombre de la sede.
 * @returns {Promise<object>} La sede modificada.
 * @throws {Error} Si la sede no existe o el nombre es inválido.
 */
export const updateBiblioteca = async (id, data) => {
  // Verificar primero si la sede existe en el catálogo
  await getBibliotecaById(id);
  
  const { nombre } = data;
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    const error = new Error('El nombre de la sede es obligatorio para actualizar y debe ser válido.');
    error.statusCode = 400;
    throw error;
  }
  
  const sanitizedData = {
    ...data,
    nombre: nombre.trim(),
    direccion: data.direccion ? data.direccion.trim() : null,
    horarios: data.horarios ? data.horarios.trim() : null,
    telefono: data.telefono ? data.telefono.trim() : null,
    ubicacion: data.ubicacion ? data.ubicacion.trim() : null,
  };
  
  return await bibliotecasRepository.update(id, sanitizedData);
};

/**
 * Elimina el registro de una sede física del catálogo general.
 * Lanza un error si la sede no existe.
 * 
 * @param {number|string} id - ID de la sede a eliminar (id_biblioteca).
 * @returns {Promise<object>} La sede eliminada.
 * @throws {Error} Si la sede no existe.
 */
export const deleteBiblioteca = async (id) => {
  // Verificar primero la existencia
  await getBibliotecaById(id);
  
  return await bibliotecasRepository.deleteById(id);
};
