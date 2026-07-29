import { Router } from 'express';
import {
  getTodosPrestamos,
  getPrestamosUsuario,
  crearPrestamo,
  devolverPrestamo,
} from '../controllers/prestamos.controller.js';

const router = Router();

router.get('/prestamos', getTodosPrestamos);
router.get('/prestamos/usuario/:id', getPrestamosUsuario);
router.post('/prestamos', crearPrestamo);
router.patch('/prestamos/:id/devolucion', devolverPrestamo);

export default router;
