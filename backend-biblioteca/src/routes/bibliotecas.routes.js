import { Router } from 'express';
import * as bibliotecasController from '../controllers/bibliotecas.controller.js';

const router = Router();

/**
 * @route GET /api/bibliotecas
 * @desc Lista todas las sedes disponibles de la red de bibliotecas.
 */
router.get('/bibliotecas', bibliotecasController.getAllBibliotecas);

/**
 * @route GET /api/bibliotecas/:id
 * @desc Obtiene los detalles de una sede específica por su ID.
 */
router.get('/bibliotecas/:id', bibliotecasController.getBibliotecaById);

/**
 * @route POST /api/bibliotecas
 * @desc Registra una nueva sede física con su dirección, horario y contacto.
 */
router.post('/bibliotecas', bibliotecasController.createBiblioteca);

/**
 * @route PUT /api/bibliotecas/:id
 * @desc Actualiza los datos de contacto o ubicación de una sede.
 */
router.put('/bibliotecas/:id', bibliotecasController.updateBiblioteca);

/**
 * @route DELETE /api/bibliotecas/:id
 * @desc Elimina el registro de una sede de la red.
 */
router.delete('/bibliotecas/:id', bibliotecasController.deleteBiblioteca);

export default router;
