import * as prestamosRepository from '../repositories/prestamos.repository.js';

export const obtenerTodos = async () => {
  return await prestamosRepository.findAll();
};

export const obtenerPorUsuario = async (idUsuario) => {
  if (!idUsuario) {
    throw new Error('El ID de usuario es requerido.');
  }
  return await prestamosRepository.findByUsuario(idUsuario);
};

export const solicitarPrestamo = async (prestamoData) => {
  const { id_usuario, id_ejemplar } = prestamoData;
  if (!id_usuario) {
    throw new Error('El ID del usuario es obligatorio para solicitar un préstamo.');
  }

  const prestamoCreado = await prestamosRepository.create(prestamoData);

  if (id_ejemplar) {
    await prestamosRepository.asociarEjemplar(prestamoCreado.id_prestamo, id_ejemplar);
  }

  return prestamoCreado;
};

export const registrarDevolucion = async (idPrestamo) => {
  if (!idPrestamo) {
    throw new Error('El ID del préstamo es obligatorio.');
  }
  const actualizado = await prestamosRepository.marcarDevolucion(idPrestamo);
  if (!actualizado) {
    throw new Error('No se encontró el préstamo solicitado.');
  }
  return actualizado;
};
