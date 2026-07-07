import { Router } from 'express';
import * as configController from '../controllers/config.controller.js';

const router = Router();

/**
 * @route GET /api/config/estados
 * @desc Lista todas las opciones de estado físico de libros.
 */
router.get('/config/estados', configController.getEstadosFisicos);

/**
 * @route POST /api/config/estados
 * @desc Agrega una nueva categoría de estado físico.
 */
router.post('/config/estados', configController.createEstadoFisico);

/**
 * @route GET /api/config/disponibilidad
 * @desc Consulta los estados lógicos de disponibilidad del catálogo.
 */
router.get('/config/disponibilidad', configController.getDisponibilidades);

export default router;
