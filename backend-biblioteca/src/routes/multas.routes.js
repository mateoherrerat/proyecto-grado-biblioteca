import { Router } from 'express';
import * as multasController from '../controllers/multas.controller.js';

const router = Router();

/**
 * @route GET /api/multas/pendientes
 * @desc Lista todas las multas del sistema que aún no han sido pagadas.
 */
router.get('/multas/pendientes', multasController.getMultasPendientes);

/**
 * @route PATCH /api/multas/:id/pago
 * @desc Registra el pago y cobro de una multa específica en el sistema.
 */
router.patch('/multas/:id/pago', multasController.registrarPago);

export default router;
