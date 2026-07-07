import { Router } from 'express';
import * as librosController from '../controllers/libros.controller.js';

const router = Router();

/**
 * @route GET /api/libros
 * @desc Lista todos los libros con soporte para búsqueda (filtrado) por título o editorial.
 */
router.get('/libros', librosController.getAllLibros);

/**
 * @route GET /api/libros/:id
 * @desc Obtiene los detalles bibliográficos de un libro específico por su ID.
 */
router.get('/libros/:id', librosController.getLibroById);

/**
 * @route POST /api/libros
 * @desc Registra un nuevo libro en el sistema.
 */
router.post('/libros', librosController.createLibro);

/**
 * @route PUT /api/libros/:id
 * @desc Actualiza la información bibliográfica de un libro.
 */
router.put('/libros/:id', librosController.updateLibro);

/**
 * @route DELETE /api/libros/:id
 * @desc Elimina un libro del catálogo general.
 */
router.delete('/libros/:id', librosController.deleteLibro);

export default router;
