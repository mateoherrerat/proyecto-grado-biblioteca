import * as autoresRepository from '../repositories/autores.repository.js';

/**
 * Obtiene todos los autores de la base de datos.
 * 
 * @returns {Promise<Array<object>>} Lista de autores.
 */
export const getAllAutores = async () => {
  return await autoresRepository.findAll();
};

/**
 * Obtiene la información de un autor por su ID.
 * Lanza un error HTTP 404 si el autor no existe.
 * 
 * @param {number|string} id - El ID del autor.
 * @returns {Promise<object>} El objeto del autor.
 * @throws {Error} Si el autor no es encontrado.
 */
export const getAutorById = async (id) => {
  const autor = await autoresRepository.findById(id);
  
  if (!autor) {
    const error = new Error(`Autor con ID ${id} no encontrado.`);
    error.statusCode = 404;
    throw error;
  }
  
  return autor;
};

/**
 * Crea un nuevo autor en el sistema validando sus datos.
 * 
 * @param {string} nombre - El nombre del autor.
 * @returns {Promise<object>} El autor creado.
 * @throws {Error} Si el nombre es inválido o está vacío.
 */
export const createAutor = async (nombre) => {
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    const error = new Error('El nombre del autor es obligatorio y debe ser un texto válido.');
    error.statusCode = 400;
    throw error;
  }
  
  return await autoresRepository.create(nombre.trim());
};

/**
 * Actualiza la información de un autor existente.
 * Valida la existencia del autor y la corrección de los datos.
 * 
 * @param {number|string} id - El ID del autor a actualizar.
 * @param {string} nombre - El nuevo nombre para el autor.
 * @returns {Promise<object>} El autor actualizado.
 * @throws {Error} Si el autor no existe o el nombre es inválido.
 */
export const updateAutor = async (id, nombre) => {
  // Verificar primero si el autor existe en el sistema
  await getAutorById(id);
  
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    const error = new Error('El nombre del autor es obligatorio para actualizar y debe ser un texto válido.');
    error.statusCode = 400;
    throw error;
  }
  
  return await autoresRepository.update(id, nombre.trim());
};

/**
 * Elimina un autor del sistema siempre y cuando no tenga libros asociados.
 * Lanza un error si el autor no existe o si tiene dependencias en la base de datos.
 * 
 * @param {number|string} id - El ID del autor a eliminar.
 * @returns {Promise<object>} El objeto del autor eliminado.
 * @throws {Error} Si el autor no existe o tiene libros asociados.
 */
export const deleteAutor = async (id) => {
  // Verificar primero la existencia del autor
  await getAutorById(id);
  
  // Validar que no tenga libros asociados antes de proceder con el delete
  const hasAssociatedBooks = await autoresRepository.hasBooks(id);
  if (hasAssociatedBooks) {
    const error = new Error('No se puede eliminar el autor debido a que tiene libros asociados en el sistema.');
    error.statusCode = 400;
    throw error;
  }
  
  return await autoresRepository.deleteById(id);
};
