import { Router } from 'express';
import * as usuariosController from '../controllers/usuarios.controller.js';

const router = Router();

/**
 * @route GET /api/usuarios
 * @desc Lista todos los usuarios registrados en el sistema.
 */
router.get('/usuarios', usuariosController.getUsuarios);

export default router;
