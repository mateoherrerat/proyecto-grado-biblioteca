import * as resenasRepository from '../repositories/resenas.repository.js';
import * as bibliotecasRepository from '../repositories/bibliotecas.repository.js';
import * as usuariosRepository from '../repositories/usuarios.repository.js';

/**
 * Recupera todas las reseñas asociadas a una biblioteca.
 * Valida primero que la sede física exista.
 * 
 * @param {number|string} idBiblioteca - ID de la biblioteca.
 * @returns {Promise<Array<object>>} Listado de reseñas.
 * @throws {Error} Si la biblioteca no existe.
 */
export const getResenasDeBiblioteca = async (idBiblioteca) => {
  const biblioteca = await bibliotecasRepository.findById(idBiblioteca);
  if (!biblioteca) {
    const error = new Error(`La sede física con ID ${idBiblioteca} no existe.`);
    error.statusCode = 404;
    throw error;
  }
  return await resenasRepository.findByBiblioteca(idBiblioteca);
};

/**
 * Registra una nueva reseña tras validar los datos.
 * 
 * @param {object} data - Datos de la reseña.
 * @param {number|string} data.id_biblioteca - ID de la biblioteca.
 * @param {string} data.id_usuario - ID del usuario (UUID).
 * @param {number} data.valoracion - Calificación (1-5).
 * @param {string} [data.comentarios] - Comentario del usuario.
 * @returns {Promise<object>} La reseña creada.
 * @throws {Error} Si los datos son inválidos o no existen las referencias.
 */
export const crearResena = async (data) => {
  const { id_biblioteca, id_usuario, valoracion, comentarios } = data;

  if (!id_biblioteca) {
    const error = new Error('El ID de la biblioteca es obligatorio.');
    error.statusCode = 400;
    throw error;
  }

  if (!id_usuario) {
    const error = new Error('El ID del usuario es obligatorio.');
    error.statusCode = 400;
    throw error;
  }

  if (valoracion === undefined || valoracion === null) {
    const error = new Error('La valoración es obligatoria.');
    error.statusCode = 400;
    throw error;
  }

  const numValoracion = Number(valoracion);
  if (isNaN(numValoracion) || numValoracion < 1 || numValoracion > 5 || !Number.isInteger(numValoracion)) {
    const error = new Error('La valoración debe ser un número entero entre 1 y 5.');
    error.statusCode = 400;
    throw error;
  }

  // Verificar si la biblioteca existe
  const biblioteca = await bibliotecasRepository.findById(id_biblioteca);
  if (!biblioteca) {
    const error = new Error(`La sede física con ID ${id_biblioteca} no existe en el sistema.`);
    error.statusCode = 400;
    throw error;
  }

  // Verificar si el usuario existe
  const usuario = await usuariosRepository.findById(id_usuario);
  if (!usuario) {
    const error = new Error(`El usuario con ID ${id_usuario} no existe en el sistema.`);
    error.statusCode = 400;
    throw error;
  }

  const sanitizedData = {
    id_biblioteca,
    id_usuario,
    valoracion: numValoracion,
    comentarios: comentarios ? comentarios.trim() : null
  };

  return await resenasRepository.create(sanitizedData);
};
