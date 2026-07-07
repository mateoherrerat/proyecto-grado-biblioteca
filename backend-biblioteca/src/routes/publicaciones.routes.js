import { Router } from 'express';
import * as publicacionesController from '../controllers/publicaciones.controller.js';

const router = Router();

/**
 * @route GET /api/publicaciones
 * @desc Lista todas las noticias y anuncios vigentes.
 */
router.get('/publicaciones', publicacionesController.getPublicaciones);

/**
 * @route POST /api/publicaciones
 * @desc Crea un anuncio o noticia (ej: "Nuevas adquisiciones de Abril").
 */
router.post('/publicaciones', publicacionesController.createPublicacion);

/**
 * @route GET /api/publicaciones/:id/libros
 * @desc Obtiene todos los libros vinculados a una publicación de novedad.
 */
router.get('/publicaciones/:id/libros', publicacionesController.getLibrosDePublicacion);

/**
 * @route POST /api/publicaciones/lib
 * @desc Vincula un libro específico a una publicación destacada (Novedades).
 */
router.post('/publicaciones/lib', publicacionesController.vincularLibro);

/**
 * @route POST /api/novedades/vincular
 * @desc Relaciona un libro específico con una noticia o banner de la web.
 */
router.post('/novedades/vincular', publicacionesController.vincularLibro);

/**
 * @route DELETE /api/novedades/desvincular
 * @desc Quita un libro de una publicación destacada.
 */
router.delete('/novedades/desvincular', publicacionesController.desvincularLibro);

/**
 * @route DELETE /api/publicaciones/:id/libros/:idLibro
 * @desc Desvincula un libro de una publicación (Ruta REST estándar).
 */
router.delete('/publicaciones/:id/libros/:idLibro', publicacionesController.desvincularLibro);

export default router;
