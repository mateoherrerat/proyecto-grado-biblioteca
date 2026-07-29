import { Router } from 'express';
import {
  getResenasDeBiblioteca,
  crearResena,
  getResenasDeLibro,
  crearResenaLibro,
} from '../controllers/resenas.controller.js';

const router = Router();

router.get('/bibliotecas/:id/resenas', getResenasDeBiblioteca);
router.post('/bibliotecas/resenas', crearResena);

router.get('/libros/:id/resenas', getResenasDeLibro);
router.post('/libros/resenas', crearResenaLibro);

export default router;
