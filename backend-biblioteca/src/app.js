import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes.js';
import autoresRoutes from './routes/autores.routes.js';
import librosRoutes from './routes/libros.routes.js';
import librosAutoresRoutes from './routes/librosAutores.routes.js';
import bibliotecasRoutes from './routes/bibliotecas.routes.js';
import multasRoutes from './routes/multas.routes.js';
import publicacionesRoutes from './routes/publicaciones.routes.js';
import resenasRoutes from './routes/resenas.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import configRoutes from './routes/config.routes.js';
import preferenciasRoutes from './routes/preferencias.routes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json()); // Habilita lectura de payloads JSON en req.body
app.use(express.urlencoded({ extended: true })); // Habilita lectura de formularios codificados

// Montaje de enrutadores de la API
app.use('/api', healthRoutes);
app.use('/api', autoresRoutes);
app.use('/api', librosRoutes);
app.use('/api', librosAutoresRoutes);
app.use('/api', bibliotecasRoutes);
app.use('/api', multasRoutes);
app.use('/api', publicacionesRoutes);
app.use('/api', resenasRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', configRoutes);
app.use('/api', preferenciasRoutes);

// Ruta por defecto para endpoints inexistentes (404)
app.use((req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Middleware global de manejo de errores (debe ir al final de todo)
app.use(errorHandler);

export default app;
