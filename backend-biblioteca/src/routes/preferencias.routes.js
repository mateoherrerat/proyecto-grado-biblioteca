import { Router } from 'express';
import * as preferenciasController from '../controllers/preferencias.controller.js';

const router = Router();

/**
 * @route GET /api/preferencias_usuarios/:idUsuario
 * @desc Obtiene todas las alertas y libros de interés configurados por un usuario.
 */
router.get('/preferencias_usuarios/:idUsuario', preferenciasController.getPreferenciasByUsuario);

/**
 * @route PATCH /api/preferencias_usuarios
 * @desc (Simulado) Actualiza la alerta de disponibilidad lógica para el libro preferido de un usuario.
 */
router.patch('/preferencias_usuarios', preferenciasController.updatePreferencia);

export default router;
