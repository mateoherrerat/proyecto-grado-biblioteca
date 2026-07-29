import * as resenasService from '../services/resenas.service.js';

export const getResenasDeBiblioteca = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resenas = await resenasService.getResenasDeBiblioteca(id);
    res.status(200).json({
      status: 'success',
      data: resenas,
    });
  } catch (error) {
    next(error);
  }
};

export const crearResena = async (req, res, next) => {
  try {
    const nuevaResena = await resenasService.crearResena(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Reseña registrada con éxito.',
      data: nuevaResena,
    });
  } catch (error) {
    next(error);
  }
};

export const getResenasDeLibro = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resenas = await resenasService.getResenasDeLibro(id);
    res.status(200).json({
      status: 'success',
      data: resenas,
    });
  } catch (error) {
    next(error);
  }
};

export const crearResenaLibro = async (req, res, next) => {
  try {
    const nuevaResena = await resenasService.crearResenaLibro(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Calificación de libro guardada con éxito.',
      data: nuevaResena,
    });
  } catch (error) {
    next(error);
  }
};
