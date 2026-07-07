import * as librosAutoresRepository from '../repositories/librosAutores.repository.js';
import * as autoresRepository from '../repositories/autores.repository.js';
import * as librosRepository from '../repositories/libros.repository.js';

/**
 * Crea una nueva asociación entre un autor y un libro.
 * Valida la existencia de ambos recursos y que no exista una asociación duplicada.
 * 
 * @param {number|string} idAutor - El ID del autor.
 * @param {number|string} idLibro - El ID del libro.
 * @returns {Promise<object>} La relación creada.
 * @throws {Error} Si no existe el autor o el libro, o si ya están asociados.
 */
export const associateAutorLibro = async (idAutor, idLibro) => {
  // 1. Validar existencia del autor
  const autor = await autoresRepository.findById(idAutor);
  if (!autor) {
    const error = new Error(`El autor con ID ${idAutor} no existe.`);
    error.statusCode = 404;
    throw error;
  }
  
  // 2. Validar existencia del libro
  const libro = await librosRepository.findById(idLibro);
  if (!libro) {
    const error = new Error(`El libro con ID ${idLibro} no existe.`);
    error.statusCode = 404;
    throw error;
  }
  
  // 3. Evitar duplicación de relaciones
  const relationExists = await librosAutoresRepository.exists(idAutor, idLibro);
  if (relationExists) {
    const error = new Error(`El autor "${autor.nombre}" ya está asociado al libro "${libro.titulo}".`);
    error.statusCode = 400;
    throw error;
  }
  
  return await librosAutoresRepository.create(idAutor, idLibro);
};

/**
 * Obtiene el listado de autores que participaron en un libro.
 * Valida primero la existencia del libro.
 * 
 * @param {number|string} idLibro - El ID del libro.
 * @returns {Promise<Array<object>>} Lista de autores con su respectivo ID de asociación.
 * @throws {Error} Si el libro no existe.
 */
export const getAutoresByLibroId = async (idLibro) => {
  // Validar existencia del libro
  const libro = await librosRepository.findById(idLibro);
  if (!libro) {
    const error = new Error(`El libro con ID ${idLibro} no existe.`);
    error.statusCode = 404;
    throw error;
  }
  
  return await librosAutoresRepository.findAuthorsByBookId(idLibro);
};

/**
 * Elimina una relación entre autor y libro.
 * Valida la existencia de la relación antes de proceder con el borrado.
 * 
 * @param {number|string} id - El ID de la relación (id_autor_libro).
 * @returns {Promise<object>} La relación eliminada.
 * @throws {Error} Si la relación no es encontrada.
 */
export const disassociateAutorLibro = async (id) => {
  // Validar existencia de la relación
  const relation = await librosAutoresRepository.findById(id);
  if (!relation) {
    const error = new Error(`La asociación con ID ${id} no existe.`);
    error.statusCode = 404;
    throw error;
  }
  
  return await librosAutoresRepository.deleteById(id);
};
