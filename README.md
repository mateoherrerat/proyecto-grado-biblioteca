# Sistema de Gestión de Biblioteca (BooksHub) - Proyecto de Grado

Bienvenido al repositorio del **Sistema de Gestión de Biblioteca (BooksHub)**. Este proyecto implementa una plataforma de biblioteca con división clara entre la experiencia pública de **Lectores / Visitantes** y el **Panel de Control Administrativo**.

---

## 🏛️ Arquitectura del Proyecto y Rutas

El proyecto está estructurado con Next.js (App Router), TailwindCSS, **Shadcn UI Nivel Nativo** y **Phosphor Icons**, aplicando la regla de color **60-30-10** y par de fuentes **Playfair Display** + **Inter**.

```text
proyecto-grado-biblioteca/
├── README.md                           # Documentación general y bitácora de errores/correcciones
├── frontend-biblioteca/
│   ├── src/
│   │   ├── app/                        # App Router de Next.js
│   │   │   ├── (auth)/                 # Autenticación Funcional
│   │   │   │   ├── login/page.tsx      # Renderiza directamente LoginForm de Shadcn UI
│   │   │   │   └── registro/page.tsx   # Renderiza directamente SignupForm de Shadcn UI
│   │   │   ├── admin/                  # Dashboard Administrativo (Primitivos Shadcn UI)
│   │   │   │   ├── layout.tsx          # Shell con SidebarProvider, AppSidebar & SidebarInset
│   │   │   │   ├── page.tsx            # Resumen KPIs y actividad
│   │   │   │   ├── libros/page.tsx     # CRUD de Libros
│   │   │   │   ├── autores/page.tsx    # CRUD de Autores
│   │   │   │   ├── sedes/page.tsx      # Gestión de Sedes
│   │   │   │   ├── multas/page.tsx     # Control de Préstamos y Multas
│   │   │   │   ├── publicaciones/page.tsx # Editor de noticias
│   │   │   │   └── configuracion/page.tsx # Parámetros del sistema
│   │   │   ├── libros/                 # Catálogo interactivo de libros
│   │   │   │   ├── page.tsx            # Filtros en 2 niveles respirables
│   │   │   │   └── [id]/page.tsx       # Detalle de libro y solicitud de préstamo
│   │   │   ├── autores/page.tsx        # Directorio de autores
│   │   │   ├── sedes/page.tsx          # Directorio de sedes físicas
│   │   │   ├── publicaciones/page.tsx  # Novedades y avisos
│   │   │   ├── mis-prestamos/page.tsx  # Panel del lector autenticado
│   │   │   ├── layout.js               # Root layout con Google Fonts (Playfair + Inter)
│   │   │   └── page.js                 # Landing Page unificada BooksHub
│   │   ├── components/                 # Componentes oficiales Shadcn UI y app (kebab-case)
│   │   │   ├── login-form.tsx          # Formulario de Login Shadcn UI
│   │   │   ├── signup-form.tsx         # Formulario de Registro Shadcn UI
│   │   │   ├── app-sidebar.tsx         # Menú lateral oficial de Shadcn UI
│   │   │   ├── site-header.tsx         # Header oficial con Breadcrumbs y SidebarTrigger
│   │   │   ├── libros/tarjeta-libro.tsx
│   │   │   ├── navegacion/encabezado-navegacion.tsx
│   │   │   ├── pie-pagina/pie-pagina.tsx
│   │   │   └── ui/                     # Primitivos Shadcn (button, input, sidebar, field)
│   │   └── context/contexto-autenticacion.tsx # Sesión global persistente en localStorage
└── backend-biblioteca/                 # Servicio backend API
```

---

## 🎨 Sistema de Diseño y Estándares

1. **Autenticación Funcional (Login & Registro):**
   - Integración directa con los componentes oficiales `LoginForm` (`src/components/login-form.tsx`) y `SignupForm` (`src/components/signup-form.tsx`).
   - El login reconoce automáticamente las credenciales institucionales (ej. correo de administrador redirige a `/admin` y correo de estudiante redirige a `/mis-prestamos`). Sin selectores manuales sobrecargados.
   - Persistencia de sesión con `localStorage` en `ContextoAutenticacion`.

2. **Navbar Respirable en 3 Columnas:**
   - La barra de navegación principal incluye 3 zonas limpias: Logo a la izquierda, Enlaces principales al centro y Buscador + Acciones a la derecha. El selector utilitario de pruebas se desplaza a una barra superior.

3. **Tipografía Calibrada (Playfair Display + Inter):**
   - Título Hero en `text-3xl sm:text-4xl lg:text-5xl` con `leading-[1.18]` armónico.

4. **Nomenclatura y Convenciones:**
   - Todo el código sigue la convención `kebab-case` (`encabezado-navegacion.tsx`, `contexto-autenticacion.tsx`, `tarjeta-libro.tsx`).

---

## 📝 Bitácora de Errores, Correcciones y Resoluciones Tecnológicas

| Fecha | Archivo / Módulo | Problema / Error Identificado | Solución / Corrección Aplicada | Estado |
| :--- | :--- | :--- | :--- | :--- |
| 2026-07-21 | `login-form.tsx` | Presencia de selector manual de rol entorpeciendo el flujo de login | Remoción del selector y detección/redirección automática por credenciales institucionales | ✅ Resuelto |
| 2026-07-21 | `encabezado-navegacion.tsx` | Desbordamiento del Navbar por superposición del demo switcher de roles | Reorganización en layout de 3 zonas y traslado del switcher a barra utilitaria superior | ✅ Resuelto |
| 2026-07-21 | `admin/layout.tsx` | Inconsistencia al no utilizar los componentes nativos instalados por Shadcn UI | Implementación de `SidebarProvider`, `AppSidebar`, `SidebarInset` y `SiteHeader` oficiales | ✅ Resuelto |
| 2026-07-21 | `libros/page.tsx` | Colisión de filtros de categoría y casilla "Solo Disponibles" en el catálogo | Reestructuración de la barra de filtros en 2 niveles respirables con scroll suave | ✅ Resuelto |

---

## 🚀 Verificación del Proyecto

```bash
cd frontend-biblioteca
pnpm build
```

Servidor local activo: `http://localhost:3001`
