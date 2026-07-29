import * as prestamosService from '../services/prestamos.service.js';

export const getTodosPrestamos = async (req, res, next) => {
  try {
    const prestamos = await prestamosService.obtenerTodos();
    res.status(200).json({
      status: 'success',
      data: prestamos,
    });
  } catch (error) {
    next(error);
  }
};

export const getPrestamosUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prestamos = await prestamosService.obtenerPorUsuario(id);
    res.status(200).json({
      status: 'success',
      data: prestamos,
    });
  } catch (error) {
    next(error);
  }
};

export const crearPrestamo = async (req, res, next) => {
  try {
    const nuevoPrestamo = await prestamosService.solicitarPrestamo(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Préstamo solicitado exitosamente.',
      data: nuevoPrestamo,
    });
  } catch (error) {
    next(error);
  }
};

export const devolverPrestamo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prestamoDevuelto = await prestamosService.registrarDevolucion(id);
    res.status(200).json({
      status: 'success',
      message: 'Devolución registrada correctamente.',
      data: prestamoDevuelto,
    });
  } catch (error) {
    next(error);
  }
};
