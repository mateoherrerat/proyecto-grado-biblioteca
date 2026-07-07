import * as publicacionesRepository from '../repositories/publicaciones.repository.js';
import * as autoresRepository from '../repositories/autores.repository.js';
import * as librosRepository from '../repositories/libros.repository.js';

/**
 * Obtiene todas las publicaciones del sistema enriquecidas con el autor.
 * 
 * @returns {Promise<Array<object>>} Listado de publicaciones.
 */
export const getAllPublicaciones = async () => {
  return await publicacionesRepository.findAllEnriquecidas();
};

/**
 * Registra una nueva publicación en el sistema tras validar sus campos obligatorios.
 * 
 * @param {object} data - Datos de la publicación.
 * @param {number|string} data.id_autor - ID del autor firmante.
 * @param {string} data.descripcion - Cuerpo del anuncio.
 * @param {string} [data.slug] - Slug manual.
 * @param {string|Date} [data.fecha] - Fecha del anuncio.
 * @returns {Promise<object>} La publicación creada.
 * @throws {Error} Si faltan campos o el autor no existe.
 */
export const createPublicacion = async (data) => {
  const { id_autor, descripcion, slug, fecha } = data;

  if (!id_autor) {
    const error = new Error('El ID del autor es obligatorio.');
    error.statusCode = 400;
    throw error;
  }

  if (!descripcion || typeof descripcion !== 'string' || descripcion.trim() === '') {
    const error = new Error('La descripción/contenido de la publicación es obligatoria.');
    error.statusCode = 400;
    throw error;
  }

  // Verificar si el autor existe
  const autor = await autoresRepository.findById(id_autor);
  if (!autor) {
    const error = new Error(`El autor con ID ${id_autor} no existe en el sistema.`);
    error.statusCode = 400;
    throw error;
  }

  // Generar un slug si no se provee
  let generatedSlug = slug;
  if (!generatedSlug || generatedSlug.trim() === '') {
    const cleanText = descripcion
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // quitar acentos
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    generatedSlug = `${cleanText.slice(0, 50)}-${Date.now()}`;
  }

  const finalFecha = fecha ? new Date(fecha) : new Date();

  return await publicacionesRepository.create({
    id_autor,
    descripcion: descripcion.trim(),
    fecha: finalFecha,
    slug: generatedSlug
  });
};

/**
 * Obtiene el listado de libros asociados a una novedad.
 * 
 * @param {number|string} idNovedad - ID de la publicación.
 * @returns {Promise<Array<object>>} Lista de libros vinculados.
 * @throws {Error} Si la publicación no existe.
 */
export const getLibrosDePublicacion = async (idNovedad) => {
  const publicacion = await publicacionesRepository.findById(idNovedad);
  if (!publicacion) {
    const error = new Error(`La publicación con ID ${idNovedad} no existe.`);
    error.statusCode = 404;
    throw error;
  }
  return await publicacionesRepository.findLibrosVinculados(idNovedad);
};

/**
 * Vincula un libro a una publicación tras validar la existencia de ambos.
 * 
 * @param {number|string} idNovedad - ID de la publicación.
 * @param {number|string} idLibro - ID del libro.
 * @returns {Promise<object>} La relación creada.
 * @throws {Error} Si no existen los IDs o ya están vinculados.
 */
export const vincularLibro = async (idNovedad, idLibro) => {
  // Validar existencia de la publicación
  const publicacion = await publicacionesRepository.findById(idNovedad);
  if (!publicacion) {
    const error = new Error(`La publicación con ID ${idNovedad} no existe.`);
    error.statusCode = 404;
    throw error;
  }

  // Validar existencia del libro
  const libro = await librosRepository.findById(idLibro);
  if (!libro) {
    const error = new Error(`El libro con ID ${idLibro} no existe.`);
    error.statusCode = 404;
    throw error;
  }

  // Validar duplicado
  const existe = await publicacionesRepository.existeRelacion(idNovedad, idLibro);
  if (existe) {
    const error = new Error('Este libro ya está vinculado a la publicación.');
    error.statusCode = 400;
    throw error;
  }

  return await publicacionesRepository.vincularLibro(idNovedad, idLibro);
};

/**
 * Quita la vinculación de un libro con una publicación específica.
 * 
 * @param {number|string} idNovedad - ID de la publicación.
 * @param {number|string} idLibro - ID del libro.
 * @returns {Promise<object>} La relación desvinculada.
 * @throws {Error} Si no existe la relación.
 */
export const desvincularLibro = async (idNovedad, idLibro) => {
  // Validar si existe la relación antes de borrar
  const existe = await publicacionesRepository.existeRelacion(idNovedad, idLibro);
  if (!existe) {
    const error = new Error('No existe la vinculación entre el libro y la publicación indicados.');
    error.statusCode = 404;
    throw error;
  }

  return await publicacionesRepository.desvincularLibro(idNovedad, idLibro);
};
