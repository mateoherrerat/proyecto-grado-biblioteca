# Contexto del Proyecto: Sistema de Gestión de Biblioteca (BooksHub)

Este documento proporciona un contexto técnico exhaustivo sobre el proyecto "LaBiblioteca" (BooksHub), diseñado específicamente para ser consumido por un asistente de Inteligencia Artificial (IA) u otro desarrollador para entender la arquitectura, reglas, estructura y estado del código antes de realizar modificaciones.

## 1. Visión General del Proyecto
**LaBiblioteca (BooksHub)** es una plataforma web integral para la gestión de préstamos, catálogo de libros y administración de una red de bibliotecas físicas. El sistema separa claramente la experiencia pública (Lectores/Visitantes) del Panel de Control Administrativo.

El proyecto está estructurado como un **monorepo** que contiene dos sub-proyectos principales:
- `backend-biblioteca`: API RESTful en Node.js (Puerto 3000)
- `frontend-biblioteca`: Aplicación web interactiva en Next.js (Puerto 3001)

## 2. Stack Tecnológico

### Backend (`backend-biblioteca`)
- **Entorno**: Node.js 20 (Configurado como ECMAScript module: `type: "module"`)
- **Framework**: Express 4
- **Base de Datos**: PostgreSQL (usando el paquete `pg`)
- **Dependencias clave**: `cors`, `dotenv`, `express`, `pg`
- **Arquitectura**: Patrón estricto de capas (Routes → Controllers → Services → Repositories → DB)

### Frontend (`frontend-biblioteca`)
- **Framework**: Next.js 15.x (App Router)
- **React**: Versión 19.x
- **Estilos**: TailwindCSS v4, Vanilla CSS (tokens base en globals.css)
- **UI Components**: Shadcn UI (Nivel Nativo instalado localmente), Radix UI
- **Iconos**: Phosphor Icons, Lucide React
- **Autenticación**: Persistencia de sesión en `localStorage` (Clave: `bookshub_usuario_sesion`) gestionada a través de un Context global.
- **Reglas de Diseño Visual**: Aplicación de la regla de color 60-30-10, combinación de fuentes Playfair Display (Títulos/Hero) e Inter (Contenido general), diseño "Glassmorphic" flotante para interfaces, estados vacíos estilizados.

## 3. Arquitectura del Backend

El backend sigue un pipeline de ejecución claro y un patrón estricto de capas para separar la lógica de negocio de la capa de red.

### Patrón de Capas
1. **Routes (`src/routes/`)**: Define exclusivamente los endpoints y asocia los controladores. Pipeline en `app.js`: `cors() -> express.json() -> Routes -> 404 handler -> errorHandler`.
2. **Controllers (`src/controllers/`)**: Extrae datos del request (`req`), invoca al Service, y responde utilizando un **Envelope Pattern** estricto. Atrapa errores y los delega a `next()`.
3. **Services (`src/services/`)**: Contiene la lógica de negocio pura. No tiene dependencias de Express (no recibe `req` ni `res`).
4. **Repositories (`src/repositories/`)**: Encargados exclusivos del acceso a datos. Usan consultas SQL parametrizadas para evitar inyección SQL. Utilizan la función `query()` exportada desde la configuración.
5. **Config (`src/config/database.js`)**: Configura el pool de conexiones a PostgreSQL y exporta la función `query(sql, params)`, que es el punto crítico de acceso a datos (Hotspot principal del backend).

### Envelope Pattern (Obligatorio)
Todas las respuestas del backend DEBEN seguir este formato, ya que el Frontend confía ciegamente en esta estructura para procesar la data:
- Éxito: `res.status(200).json({ status: 'success', data: result });`
- Error (manejado por el middleware global `errorHandler`): `res.status(400|500).json({ status: 'error', error: { message: 'Descripción...' } });`

### Entidades y Módulos de la API
- **Usuarios & Auth**: `/api/usuarios`, preferencias de perfil `/api/preferencias_usuarios`.
- **Catálogo Core**: `/api/libros`, `/api/autores`, relación `/api/libros-autores`.
- **Inventario y Red**: `/api/bibliotecas` (sedes).
- **Operaciones de Préstamo**: `/api/prestamos` y gestión de penalizaciones en `/api/multas`.
- **Interacción de Usuario**: `/api/libros/:id/resenas` y `/api/bibliotecas/:id/resenas`.
- **Portal de Novedades**: `/api/publicaciones`.
- **Sistema**: `/api/health`, `/api/config` (estados, disponibilidad).

## 4. Arquitectura del Frontend

Basado en el **App Router** de Next.js (`src/app/`), la aplicación separa claramente contextos de acceso:

### Estructura de Rutas y Layouts
- `/(auth)/login`, `/(auth)/registro`: Vistas de autenticación "Standalone" (sin header/footer globales), usando componentes oficiales de Shadcn UI (`LoginForm`, `SignupForm`). Incorporan lógica de redirección automática por tipo de credencial institucional (Admin vs Lector).
- `/admin/*`: Panel administrativo privado. Renderizado usando el layout moderno de Shadcn (`SidebarProvider`, `AppSidebar` y `SidebarInset`).
- `/libros/*`: Catálogo interactivo, con barra de filtros respirable a dos niveles y vista de detalle (incluye componente `<ImagenPortadaLibro>` y solicitud de préstamo).
- `/mis-prestamos`: Dashboard privado del lector autenticado.
- `/autores`, `/sedes`, `/publicaciones`: Directorios de contenido público.
- `/`: Landing page unificada.

### Componentes y Servicios Clave
- **Capa API (`src/services/api.js`)**: Punto de entrada único para solicitudes HTTP al backend. Exporta servicios por módulo (ej. `librosService.getAll()`) que resuelven directamente el payload (`result.data`). **Regla**: Prohibido crear llamadas `fetch()` directas dentro de componentes de UI.
- **Contexto de Autenticación (`src/context/contexto-autenticacion.tsx`)**: Hook `useAutenticacion()` provee las variables de sesión (`{ id, nombre, email, rol, codigoBiblioteca }`). Es la única forma permitida de acceder a la sesión (no acceder a localStorage de manera directa).
- **Utilidades de UI**: 
  - `cn()` en `src/lib/utils.ts`: Utilitario principal para condicionalidad y combinación segura de clases de Tailwind. Se debe usar siempre que se unan strings de clases.
  - `coincideFuzzy()` en `src/lib/fuzzy-search.ts`: Algoritmo de búsqueda difusa utilizado en el cliente.
- **Componentes de Core UI (`src/components/`)**: Uso extensivo del `<EncabezadoNavegacion>` central, primitivos de UI de Shadcn, y el componente universal `<EstadoVacio>` cuando no se cargan datos en listas.

## 5. Base de Datos (PostgreSQL)

### Tablas y Relaciones Centrales
- `usuarios`: `id_usuario`, `nombre`, `email`, `contrasena`, `rol`, `codigo_biblioteca`. El campo contrasena NUNCA se debe proyectar en respuestas GET.
- `libros`: Información bibliográfica base (`id_libro`, `isbn`, `titulo`, `editorial`, `sinopsis`, `portada`).
- `autores` y tabla pivote `autores_libros` (Relación N:M).
- `bibliotecas`: Entidad que representa la sucursal física.
- `ejemplares`: Entidad puente que materializa el inventario físico: asocia un `id_libro` a una sede (`id_biblioteca`) con un estado (`id_estado_fisico`). Un libro genérico puede tener 10 ejemplares físicos repartidos en 3 bibliotecas.
- `prestamos`: El acto de prestar, contiene la fecha límite, estado del préstamo y apunta al usuario.
- `prestamos_libros`: Relación N:M que enlaza `id_prestamo` específicamente con un `id_ejemplar` (el objeto físico), no con el libro abstracto.
- Otras tablas: `multas`, `resenas_libros`, `publicaciones`, `publicaciones_libros`.

### Reglas Críticas de Consultas (SQL)
- NUNCA usar `SELECT *` en entornos de producción, siempre enumerar las columnas necesarias.
- SIEMPRE usar consultas parametrizadas (ej. `$1`, `$2`) en los repositorios.
- El patrón estándar para obtener datos enriquecidos de un préstamo es un `JOIN` secuencial: `prestamos` -> `prestamos_libros` -> `ejemplares` -> `libros`.

## 6. Convenciones de Código y Flujos de Desarrollo

1. **Descubrimiento Cognitivo para IAs**: En lugar de lectura secuencial o "grep", la herramienta preferida es `codebase-memory-mcp` (comandos de CLI para rastrear grafos, encontrar llamadas de funciones o leer arquitectura) usando `index_repository`, `search_graph`, y `trace_path`.
2. **Nomenclatura (Naming Conventions)**:
   - **Backend**: Ficheros separados por puntos `kebab-case.tipo.js` (ej. `autores.controller.js`).
   - **Frontend (Componentes)**: `kebab-case-componente.tsx` para archivos, y `PascalCase` para el nombre de la función exportada.
   - **Frontend (Páginas)**: Patrón App Router `page.tsx`, `layout.tsx` anidados en carpetas con el nombre de ruta.
   - **Variables/Estado**: `camelCase` en idioma español (`terminoBusqueda`, `listaLibros`).
   - **Funciones/Hooks**: `camelCase` o prefijo `use` + `PascalCase`.
3. **Flujo de adición de Features (Backend)**: Al agregar un endpoint, el orden estructural recomendado es: 
   `repository.js` -> `service.js` -> `controller.js` -> `routes.js` -> Importación y registro en `app.js`.
4. **Manejo de Errores**: En el backend, cualquier error en un controlador debe ser capturado (`catch`) y enviado a la cascada de middlewares: `next(error);`. El logger (winston/custom) se maneja a nivel de aplicación en el error handler.
5. **Logger**: Siempre usar `logger.info()` o `logger.error()` del archivo `src/utils/logger.js`, y evitar el uso general de `console.log()` en backend.
