import { Router } from 'express';
import * as librosAutoresController from '../controllers/librosAutores.controller.js';

const router = Router();

/**
 * @route POST /api/libros-autores
 * @desc Crea la relación N:M asociando un autor a un libro específico.
 */
router.post('/libros-autores', librosAutoresController.associate);

/**
 * @route GET /api/libros/:id/autores
 * @desc Lista todos los autores que participaron en un libro específico.
 */
router.get('/libros/:id/autores', librosAutoresController.getAutoresByLibro);

/**
 * @route DELETE /api/libros-autores/:id
 * @desc Rompe la asociación entre un autor y un libro usando el ID de la relación.
 */
router.delete('/libros-autores/:id', librosAutoresController.disassociate);

export default router;
