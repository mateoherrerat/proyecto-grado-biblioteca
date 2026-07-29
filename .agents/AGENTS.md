# AGENTS.md — Reglas Globales del Proyecto LaBiblioteca

Utiliza esto en la terminal antes de revisar cualquier archivo de este proyecto:

Recuerda que aunque diga mcp es un cli

> **Generado automáticamente por `codebase-memory-mcp` v0.9.0**
> Índice del grafo: **830 nodos · 1 661 aristas** (rama `main`, SHA `5ca871b`)
> Última actualización: 2026-07-22
>
> **⚠️ REGLA DE ACTUALIZACIÓN**: Este archivo DEBE re-generarse cada vez que:
> - Se añada o elimine un módulo backend (controller/service/repository/route).
> - Se cree una nueva página o componente relevante en el frontend.
> - Se modifique el esquema de la base de datos PostgreSQL.
> - Se realice un refactor estructural significativo.
>
> Comando para re-indexar y regenerar:
> ```bash
> npx codebase-memory-mcp cli index_repository --repo-path . --name proyecto-grado-biblioteca --mode fast
> npx codebase-memory-mcp cli get_architecture --args-file .agents/arch_args.json
> ```

---

## 1. Visión General del Proyecto

**LaBiblioteca** es una plataforma web para gestión de préstamos, catálogo y administración de una red de bibliotecas físicas. Está compuesta por dos sub-proyectos en un monorepo:

| Sub-proyecto | Stack | Puerto |
|---|---|---|
| `backend-biblioteca` | Node.js 20 + Express 4 + PostgreSQL (pg) | `3000` |
| `frontend-biblioteca` | Next.js 15 (App Router) + Shadcn UI + TailwindCSS | `3001` |

---

## 2. Arquitectura del Backend (`backend-biblioteca`)

### 2.1 Patrón de Capas Estricto

```
Routes → Controllers → Services → Repositories → PostgreSQL
```

- **Routes** (`src/routes/`): Solo define los endpoints y delega al controller.
- **Controllers** (`src/controllers/`): Extrae datos del `req`, llama al service, responde con el Envelope Pattern.
- **Services** (`src/services/`): Lógica de negocio pura. No accede a `req`/`res`.
- **Repositories** (`src/repositories/`): Únicamente SQL parametrizado. Usa `query()` de `src/config/database.js`.
- **Config** (`src/config/database.js`): Pool de conexiones PostgreSQL. Función `query(sql, params)` es el punto de entrada único a la BD.

### 2.2 Módulos del Backend

| Módulo | Route prefix | Controller | Service | Repository |
|---|---|---|---|---|
| Salud | `GET /api/health` | _(inline en health.routes.js)_ | — | — |
| Autores | `/api/autores` | `autores.controller.js` | `autores.service.js` | `autores.repository.js` |
| Libros | `/api/libros` | `libros.controller.js` | `libros.service.js` | `libros.repository.js` |
| Libros-Autores (N:M) | `/api/libros-autores` | `librosAutores.controller.js` | `librosAutores.service.js` | `librosAutores.repository.js` |
| Bibliotecas (Sedes) | `/api/bibliotecas` | `bibliotecas.controller.js` | `bibliotecas.service.js` | `bibliotecas.repository.js` |
| Multas | `/api/multas` | `multas.controller.js` | `multas.service.js` | `multas.repository.js` |
| Publicaciones | `/api/publicaciones` | `publicaciones.controller.js` | `publicaciones.service.js` | `publicaciones.repository.js` |
| Reseñas | `/api/libros/:id/resenas`, `/api/bibliotecas/:id/resenas` | `resenas.controller.js` | `resenas.service.js` | `resenas.repository.js` |
| Usuarios | `/api/usuarios` | `usuarios.controller.js` | `usuarios.service.js` | `usuarios.repository.js` |
| Config (estados, disponibilidad) | `/api/config` | `config.controller.js` | — | `config.repository.js` |
| Preferencias de usuario | `/api/preferencias_usuarios` | `preferencias.controller.js` | `preferencias.service.js` | `preferencias.repository.js` |
| Préstamos | `/api/prestamos` | `prestamos.controller.js` | `prestamos.service.js` | `prestamos.repository.js` |

### 2.3 Envelope Pattern (OBLIGATORIO en todas las respuestas)

```js
// Éxito
res.status(200).json({ status: 'success', data: result });

// Error (manejado por errorHandler middleware)
res.status(4xx|5xx).json({ status: 'error', error: { message: '...' } });
```

**NUNCA** devolver datos directamente sin el envelope. El frontend en `api.js` depende de `result.data`.

### 2.4 Hotspot Crítico: `query()` en database.js

- **fan-in: 49** — Es la función más llamada del backend.
- **REGLA**: Todos los repositories DEBEN importar y usar `query` de `src/config/database.js`. Nunca crear conexiones propias.
- **REGLA**: Toda consulta SQL DEBE usar parámetros (`$1`, `$2`, ...) para prevenir SQL Injection.

### 2.5 Rutas API Completas

```
GET    /api/health
GET    /api/autores
GET    /api/autores/:id
POST   /api/autores
PUT    /api/autores/:id
DELETE /api/autores/:id
GET    /api/libros
GET    /api/libros/:id
POST   /api/libros
PUT    /api/libros/:id
DELETE /api/libros/:id
GET    /api/libros/:idLibro/autores
POST   /api/libros-autores
DELETE /api/libros-autores/:idRelation
GET    /api/bibliotecas
GET    /api/bibliotecas/:id
POST   /api/bibliotecas
PUT    /api/bibliotecas/:id
DELETE /api/bibliotecas/:id
GET    /api/multas/pendientes
PATCH  /api/multas/:id/pago
GET    /api/publicaciones
POST   /api/publicaciones
GET    /api/publicaciones/:idNovedad/libros
POST   /api/publicaciones/lib
DELETE /api/novedades/desvincular
GET    /api/libros/:id/resenas
POST   /api/libros/resenas
GET    /api/bibliotecas/:idBiblioteca/resenas
POST   /api/bibliotecas/resenas
GET    /api/usuarios
GET    /api/config/estados
POST   /api/config/estados
GET    /api/config/disponibilidad
GET    /api/preferencias_usuarios/:idUsuario
PATCH  /api/preferencias_usuarios
GET    /api/prestamos
GET    /api/prestamos/usuario/:idUsuario
POST   /api/prestamos
PATCH  /api/prestamos/:id/devolucion
```

### 2.6 Middleware Pipeline en `app.js`

```
cors() → express.json() → express.urlencoded() → [Routes] → 404 handler → errorHandler
```

El `errorHandler` en `src/middlewares/errorHandler.js` captura todos los errores y responde con el Envelope de error.

### 2.7 Logger (`src/utils/logger.js`)

- **fan-in: 4** — Funciones: `formatMessage`, `error`, `info`, `fatal`, `gracefulShutdown`.
- **REGLA**: Siempre usar `logger.info()` / `logger.error()` en lugar de `console.log`.

---

## 3. Arquitectura del Frontend (`frontend-biblioteca`)

### 3.1 Estructura de Páginas (App Router de Next.js 15)

```
src/app/
├── (auth)/              # Auth standalone: /login, /registro (SIN header/footer)
├── admin/               # Panel de administración (/admin)
├── autores/             # Directorio de autores (/autores)
├── configuracion/       # Configuración de cuenta (/configuracion)
├── libros/              # Catálogo de libros (/libros)
│   └── [id]/            # Detalle de libro + reseñas (/libros/:id)
├── mis-prestamos/       # Dashboard de préstamos del lector (/mis-prestamos)
├── multas/              # Módulo de multas (/multas)
├── publicaciones/       # Novedades/comunicados (/publicaciones)
├── sedes/               # Directorio de bibliotecas físicas (/sedes)
├── globals.css          # Estilos globales + tokens CSS
├── layout.tsx           # Root layout (Provider de autenticación)
└── page.tsx             # Homepage (/)
```

### 3.2 Hotspots del Frontend

| Función | Fan-in | Archivo |
|---|---|---|
| `cn()` | **77** | `src/lib/utils.ts` — Combina clases Tailwind. SIEMPRE usar en vez de concatenar strings de clases. |
| `fetchAPI()` | **25** | `src/services/api.js` — Punto único de comunicación con el backend. |
| `useAutenticacion()` | **11** | `src/context/contexto-autenticacion.tsx` — Hook de sesión del usuario. |
| `coincideFuzzy()` | **5** | `src/lib/fuzzy-search.ts` — Búsqueda difusa en catálogo/autores/publicaciones. |
| `useSidebar()` | **7** | `src/components/ui/sidebar.tsx` — Estado del sidebar en layout admin. |

### 3.3 Contexto de Autenticación

- **Archivo**: `src/context/contexto-autenticacion.tsx`
- **Hook de consumo**: `useAutenticacion()` (fan-in 11 — muy usado)
- **Sesión persistida en**: `localStorage` bajo la clave `bookshub_usuario_sesion`
- **Campos de sesión**: `{ id, nombre, email, rol, codigoBiblioteca }`
- **REGLA**: NUNCA leer localStorage directamente en componentes. Siempre usar `useAutenticacion()`.
- Funciones exportadas: `iniciarSesion`, `cerrarSesion`, `usuario`, `autenticado`

### 3.4 Capa de Servicios (`src/services/api.js`)

Todos los servicios HTTP se exportan desde un único archivo. Patrón:

```js
export const [modulo]Service = {
  getAll:    () => fetchAPI('/[ruta]'),
  getById:   (id) => fetchAPI(`/[ruta]/${id}`),
  create:    (data) => fetchAPI('/[ruta]', { method: 'POST', body: JSON.stringify(data) }),
  update:    (id, data) => fetchAPI(`/[ruta]/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete:    (id) => fetchAPI(`/[ruta]/${id}`, { method: 'DELETE' }),
};
```

Servicios disponibles:
- `autoresService` · `librosService` · `librosAutoresService`
- `bibliotecasService` · `multasService` · `publicacionesService`
- `resenasService` · `usuariosService` · `configService`
- `preferenciasService` · `prestamosService`

**REGLA**: Agregar cualquier nuevo endpoint SOLO en este archivo. No crear `fetch()` sueltos en los componentes.

### 3.5 Componentes Clave

| Componente | Ruta | Propósito |
|---|---|---|
| `EncabezadoNavegacion` | `src/components/navegacion/encabezado-navegacion.tsx` | Header global con buscador popover y menú de usuario |
| `ImagenPortadaLibro` | _(inline en páginas de libros)_ | Imagen de portada resiliente con fallback a gradiente |
| `EstadoVacio` | _(componente reutilizable)_ | Estado vacío para listas sin resultados |
| `SidebarProvider` / `useSidebar` | `src/components/ui/sidebar.tsx` | Layout del panel admin con sidebar |
| `DropdownMenu` | `src/components/ui/dropdown-menu.tsx` | Menú desplegable del avatar de usuario (sideOffset=14, mt-3) |

### 3.6 Clusters del Frontend por Cohesión

| Cluster | Cohesión | Nodos principales |
|---|---|---|
| UI Components (Sidebar) | 0.92 | `cn`, `SlotComp`, `SidebarMenuButton`, `SidebarProvider` |
| API + Detalle de Libro | 0.90 | `fetchAPI`, `cargarDetalle`, `PaginaDetalleLibro`, `getByLibro` |
| Catálogo + Búsqueda | 0.92 | `getAll`, `coincideFuzzy`, `EncabezadoNavegacion`, `PaginaPublicaciones` |
| Auth + Préstamos | 0.75 | `useAutenticacion`, `PaginaMisPrestamos`, `ImagenPortadaLibro`, `LoginForm` |

---

## 4. Base de Datos PostgreSQL

### 4.1 Tablas Principales

| Tabla | Campos clave |
|---|---|
| `usuarios` | `id_usuario`, `nombre`, `email`, `contrasena`, `rol`, `codigo_biblioteca` |
| `libros` | `id_libro`, `isbn`, `titulo`, `editorial`, `sinopsis`, `fecha_publicacion`, `portada`, `categoria` |
| `autores` | `id_autor`, `nombre` |
| `autores_libros` | `id_autor_libro`, `id_autor`, `id_libro` |
| `bibliotecas` | `id_biblioteca`, `nombre`, `ubicacion`, `direccion`, `telefono`, `horarios` |
| `ejemplares` | `id_ejemplar`, `id_libro`, `id_biblioteca`, `id_estado_fisico` |
| `prestamos` | `id_prestamo`, `id_usuario`, `fecha_prestamo`, `fecha_devolucion`, `estado` |
| `prestamos_libros` | `id_prestamo`, `id_ejemplar` |
| `resenas_libros` | `id_resena`, `id_libro`, `id_usuario`, `comentarios`, `valoracion`, `fecha` |
| `multas` | `id_multa`, `id_prestamo`, `monto`, `estado`, `fecha_pago` |
| `publicaciones` | `id_novedad`, `id_autor`, `descripcion`, `slug`, `fecha` |
| `publicaciones_libros` | `id_novedad`, `id_libro` |
| `preferencias_usuarios` | `id_usuario`, `id_libro`, `id_estado_disponibilidad_libro` |

### 4.2 Reglas de Base de Datos

- **NUNCA** usar `SELECT *` en producción. Siempre listar columnas explícitas.
- **SIEMPRE** usar parámetros posicionales (`$1`, `$2`) para prevenir SQL Injection.
- Los JOINs entre `prestamos`, `prestamos_libros`, `ejemplares` y `libros` son el patrón estándar para cargar préstamos enriquecidos.
- La tabla `ejemplares` es el inventario físico; un `libro` puede tener múltiples `ejemplares` en distintas `bibliotecas`.

---

## 5. Convenciones de Código

### 5.1 Nombrado

| Tipo | Convención | Ejemplo |
|---|---|---|
| Archivos backend | `kebab-case.tipo.js` | `autores.controller.js` |
| Archivos frontend | `kebab-case-componente.tsx` | `encabezado-navegacion.tsx` |
| Páginas Next.js | `page.tsx` dentro de carpeta de ruta | `app/libros/page.tsx` |
| Funciones ES Module | `camelCase` | `getAllAutores`, `crearPrestamo` |
| Componentes React | `PascalCase` | `PaginaCatalogoLibros` |
| Hooks personalizados | `use` + `PascalCase` | `useAutenticacion` |
| Variables de estado | `camelCase` en español | `terminoBusqueda`, `listaLibros` |

### 5.2 Backend — Patrón de Controller

```js
export const getAll[Entidad] = async (req, res, next) => {
  try {
    const result = await [entidad]Service.getAll();
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error); // Delegar al errorHandler global
  }
};
```

### 5.3 Frontend — Patrón de Carga de Datos

```tsx
'use client';
import { useEffect, useState } from 'react';
import { [modulo]Service } from '@/services/api';

export default function PaginaEjemplo() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const result = await [modulo]Service.getAll();
        setDatos(result);
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);
  // ...
}
```

### 5.4 Styling

- **Motor CSS**: TailwindCSS v4 + tokens en `globals.css`.
- **Combinar clases**: `cn()` de `src/lib/utils.ts` (fan-in 77 — es el helper más usado del proyecto).
- **Componentes UI**: Shadcn UI — importar de `@/components/ui/[componente]`.
- **Tipografía**: `font-serif` para títulos de marca LaBiblioteca; `font-sans` para contenido.
- **Dark mode**: Soportado mediante clase `.dark` en el root.

---

## 6. Reglas del Agente (AI)

### 6.1 Descubrimiento de Código

1. **SIEMPRE** usar `codebase-memory-mcp` para descubrir código antes de grep/glob:
   - `search_graph` → encontrar funciones, clases, rutas por patrón.
   - `trace_path` → rastrear quién llama a una función o qué llama.
   - `get_code_snippet` → leer el código fuente de una función/clase específica.
   - `get_architecture` → resumen arquitectural de alto nivel.
2. Usar grep/glob solo para: literales de strings, mensajes de error, valores de config, archivos no-código.

### 6.2 Al Añadir Endpoints Backend

1. Crear/actualizar en orden: `repository.js` → `service.js` → `controller.js` → `routes.js` → registrar en `app.js`.
2. Seguir el Envelope Pattern en TODAS las respuestas.
3. Usar `next(error)` para propagar errores al middleware global.
4. SQL siempre parametrizado con `$1`, `$2`, etc.

### 6.3 Al Añadir Páginas/Componentes Frontend

1. Agregar la página en `src/app/[ruta]/page.tsx`.
2. Si necesita datos del backend, agregar el método al servicio correspondiente en `src/services/api.js`.
3. Usar `useAutenticacion()` para acceso a la sesión del usuario.
4. Usar `cn()` para todas las combinaciones de clases Tailwind.
5. Las páginas de auth (`/login`, `/registro`) son standalone — NO incluir header/footer.

### 6.4 Consistencia de UI

- **Identidad visual**: Logo `BookOpen` + nombre `LaBiblioteca` en `font-serif`.
- **Institución**: Dirección `Av. Las Vegas Cra #48 1-125, El Poblado, Medellín`.
- **Contacto**: `+57 (604) 426-6460` · `contacto@inemjose.edu.co`.
- **Header**: Glassmorphic flotante. Dropdown de usuario anclado al avatar con `sideOffset={14}`.
- **Estados vacíos**: Siempre mostrar un estado visual amigable cuando no hay datos.
- **Búsqueda**: Usar `coincideFuzzy()` de `src/lib/fuzzy-search.ts` para filtrado client-side.

### 6.5 Seguridad

- No exponer contraseñas ni tokens en respuestas API.
- No hacer `SELECT *` con datos de usuarios.
- Siempre validar y sanear `req.body` antes de pasarlo al service/repository.
- El campo `contrasena` en la tabla `usuarios` NUNCA debe aparecer en respuestas GET.

---

## 7. Procedimiento de Actualización de este Archivo

### Cuándo actualizar

- ✅ Al añadir un nuevo módulo backend (route/controller/service/repository).
- ✅ Al crear una nueva página Next.js significativa.
- ✅ Al modificar el esquema PostgreSQL (nueva tabla, columna, relación).
- ✅ Al refactorizar la arquitectura de forma estructural.
- ✅ Al menos **una vez por semana** en períodos de desarrollo activo.

### Cómo actualizar

```bash
# 1. Re-indexar el proyecto
npx codebase-memory-mcp cli index_repository \
  --repo-path c:/Desarrollo/proyecto-grado-biblioteca \
  --name proyecto-grado-biblioteca \
  --mode fast

# 2. Obtener arquitectura actualizada
npx codebase-memory-mcp cli get_architecture \
  --args-file .agents/arch_args.json

# 3. Buscar nuevos hotspots
npx codebase-memory-mcp cli search_graph \
  --args-file .agents/search_args.json

# 4. Actualizar este AGENTS.md con los hallazgos
```

### Archivo de args de referencia para re-indexación

Guardar en `.agents/arch_args.json`:
```json
{"project": "proyecto-grado-biblioteca", "aspects": ["overview"]}
```

---

*Generado por `codebase-memory-mcp` v0.9.0 · Proyecto: proyecto-grado-biblioteca · Branch: main*
