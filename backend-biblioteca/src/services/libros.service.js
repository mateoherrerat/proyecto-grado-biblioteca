import * as librosRepository from '../repositories/libros.repository.js';

/**
 * Obtiene todos los libros, aplicando filtros opcionales.
 * 
 * @param {string} [filter] - Filtro de búsqueda por título o editorial.
 * @returns {Promise<Array<object>>} Lista de libros.
 */
export const getAllLibros = async (filter) => {
  return await librosRepository.findAll(filter);
};

/**
 * Recupera un libro por su ID.
 * Lanza un error HTTP 404 si el libro no existe.
 * 
 * @param {number|string} id - El ID del libro (id_libro).
 * @returns {Promise<object>} El libro encontrado.
 * @throws {Error} Si el libro no existe.
 */
export const getLibroById = async (id) => {
  const libro = await librosRepository.findById(id);
  
  if (!libro) {
    const error = new Error(`Libro con ID ${id} no encontrado.`);
    error.statusCode = 404;
    throw error;
  }
  
  return libro;
};

/**
 * Registra un nuevo libro en la biblioteca realizando validaciones.
 * 
 * @param {object} libroData - Datos del nuevo libro.
 * @param {string} libroData.titulo - Título del libro.
 * @returns {Promise<object>} El libro registrado.
 * @throws {Error} Si falten datos obligatorios.
 */
export const createLibro = async (libroData) => {
  const { titulo } = libroData;
  
  if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
    const error = new Error('El título del libro es obligatorio y debe ser un texto válido.');
    error.statusCode = 400;
    throw error;
  }
  
  // Limpiar espacios en los textos antes de guardar
  const sanitizedData = {
    ...libroData,
    titulo: titulo.trim(),
    isbn: libroData.isbn ? libroData.isbn.trim() : null,
    editorial: libroData.editorial ? libroData.editorial.trim() : null,
    sinopsis: libroData.sinopsis ? libroData.sinopsis.trim() : null,
  };
  
  return await librosRepository.create(sanitizedData);
};

/**
 * Modifica la información bibliográfica de un libro existente.
 * Valida la existencia del libro y los datos modificados.
 * 
 * @param {number|string} id - ID del libro a actualizar.
 * @param {object} libroData - Nuevos datos del libro.
 * @param {string} libroData.titulo - Nuevo título.
 * @returns {Promise<object>} El libro actualizado.
 * @throws {Error} Si el libro no existe o si faltan datos obligatorios.
 */
export const updateLibro = async (id, libroData) => {
  // Verificar primero si el libro existe en el catálogo
  await getLibroById(id);
  
  const { titulo } = libroData;
  if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
    const error = new Error('El título del libro es obligatorio para actualizar y debe ser válido.');
    error.statusCode = 400;
    throw error;
  }
  
  const sanitizedData = {
    ...libroData,
    titulo: titulo.trim(),
    isbn: libroData.isbn ? libroData.isbn.trim() : null,
    editorial: libroData.editorial ? libroData.editorial.trim() : null,
    sinopsis: libroData.sinopsis ? libroData.sinopsis.trim() : null,
  };
  
  return await librosRepository.update(id, sanitizedData);
};

/**
 * Elimina el registro de un libro del catálogo general.
 * Lanza un error si el libro no existe.
 * 
 * @param {number|string} id - ID del libro a eliminar.
 * @returns {Promise<object>} El libro eliminado.
 * @throws {Error} Si el libro no existe.
 */
export const deleteLibro = async (id) => {
  // Verificar primero si el libro existe antes de intentar eliminarlo
  await getLibroById(id);
  
  return await librosRepository.deleteById(id);
};
