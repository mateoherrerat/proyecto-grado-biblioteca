import * as resenasRepository from '../repositories/resenas.repository.js';

export const getResenasDeBiblioteca = async (idBiblioteca) => {
  if (!idBiblioteca) {
    throw new Error('El ID de la biblioteca es requerido.');
  }
  return await resenasRepository.findByBiblioteca(idBiblioteca);
};

export const crearResena = async (data) => {
  const { id_biblioteca, id_usuario, valoracion } = data;
  if (!id_biblioteca || !id_usuario || !valoracion) {
    throw new Error('Los campos id_biblioteca, id_usuario y valoracion son obligatorios.');
  }
  return await resenasRepository.create(data);
};

export const getResenasDeLibro = async (idLibro) => {
  if (!idLibro) {
    throw new Error('El ID del libro es requerido.');
  }
  return await resenasRepository.findByLibro(idLibro);
};

export const crearResenaLibro = async (data) => {
  const { id_libro, id_usuario, valoracion } = data;
  if (!id_libro || !id_usuario || !valoracion) {
    throw new Error('Los campos id_libro, id_usuario y valoracion son obligatorios.');
  }
  return await resenasRepository.createResenaLibro(data);
};
