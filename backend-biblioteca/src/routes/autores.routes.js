import { Router } from 'express';
import * as autoresController from '../controllers/autores.controller.js';

const router = Router();

/**
 * @route GET /api/autores
 * @desc Obtiene la lista completa de autores registrados.
 */
router.get('/autores', autoresController.getAllAutores);

/**
 * @route GET /api/autores/:id
 * @desc Recupera la información de un autor específico por su ID.
 */
router.get('/autores/:id', autoresController.getAutorById);

/**
 * @route POST /api/autores
 * @desc Registra un nuevo autor en el sistema proporcionando su nombre en el cuerpo.
 */
router.post('/autores', autoresController.createAutor);

/**
 * @route PUT /api/autores/:id
 * @desc Actualiza el nombre de un autor existente.
 */
router.put('/autores/:id', autoresController.updateAutor);

/**
 * @route DELETE /api/autores/:id
 * @desc Elimina un autor del sistema (siempre que no tenga libros asociados).
 */
router.delete('/autores/:id', autoresController.deleteAutor);

export default router;
