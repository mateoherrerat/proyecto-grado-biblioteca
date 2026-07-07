import { Router } from 'express';
import * as resenasController from '../controllers/resenas.controller.js';

const router = Router();

/**
 * @route POST /api/bibliotecas/resenas
 * @desc Permite al usuario calificar una sede física (limpieza, atención, etc.).
 */
router.post('/bibliotecas/resenas', resenasController.crearResena);

/**
 * @route GET /api/bibliotecas/:id/resenas
 * @desc Obtiene todos los comentarios de una sede específica.
 */
router.get('/bibliotecas/:id/resenas', resenasController.getResenasDeBiblioteca);

export default router;
