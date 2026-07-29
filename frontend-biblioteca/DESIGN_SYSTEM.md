# Sistema de Diseño & Tokens — LaBiblioteca (BooksHub)

Este documento sirve como la única fuente de verdad visual y de layout para el desarrollo de la interfaz de usuario de **LaBiblioteca**.

---

## 🎨 1. Sistema de Colores (Regla 60-30-10)

Todas las superficies y componentes interactivos deben utilizar estrictamente las variables CSS semánticas definidas en `src/app/globals.css`:

### 🟢 60% Dominante — Fondo & Estructura Principal
- `--background`: `#FDFBF7` (Claro) / `#181513` (Oscuro) -> `bg-background`
- `--card`: `#FFFFFF` (Claro) / `#221E1B` (Oscuro) -> `bg-card`

### 🟡 30% Secundario — Superficies, Bordes & Textos
- `--muted`: `#F3EFE6` (Claro) / `#2A2420` (Oscuro) -> `bg-muted`, `text-muted-foreground`
- `--border`: `#E8E2D5` (Claro) / `#38312B` (Oscuro) -> `border-border`
- `--secondary`: `#6E675F` (Claro) / `#3A332E` (Oscuro) -> `bg-secondary`

### 🟠 10% Acento — Interacciones & Destacados
- `--primary`: `#C58B2B` (Ámbar Cálido) / `#D49836` (Dorado) -> `bg-primary`, `text-primary`
- `--accent`: `#F4EAD3` (Claro) / `#382F26` (Oscuro) -> `bg-accent`, `text-accent-foreground`

---

## ✍️ 2. Tipografía

- **Títulos & Hero (`font-serif`):** `Playfair Display` (cargada mediante `next/font/google` en `src/app/layout.tsx`). Aplicar siempre en `h1`, `h2`, `h3` o elementos con la clase `.font-serif-title`.
- **Cuerpo & UI (`font-sans`):** `Inter` (cargada en `RootLayout`). Aplicar en párrafos, botones, campos de entrada y tablas.

---

## 🧊 3. Glassmorphism Estandarizado

Utilizar las clases utilitarias de `globals.css`:
1. `.glass-header`: Encabezados flotantes y navegación pública.
2. `.glass-card`: Tarjetas destacadas de libros, noticias y filtros.
3. `.glass-modal`: Diálogos y ventanas modales de confirmación (`Dialog`).

---

## 🧩 4. Layouts Compartidos

- **Páginas Públicas:** Todas las páginas de libre acceso deben estar envueltas en `<LayoutPublico>` (`@/components/navegacion/layout-publico`). Prohibido volver a importar `<EncabezadoNavegacion />` y `<PiePagina />` individualmente.
- **Panel Administrativo:** Las páginas dentro de `/admin/*` deben utilizar el layout nativo `LayoutAdmin` (`@/app/admin/layout.tsx`) apoyado en `SidebarProvider` y `AppSidebar`.
- **Estados Vacíos:** Cuando un filtro o búsqueda no retorne resultados, utilizar siempre `<EstadoVacio>` (`@/components/ui/estado-vacio`).

---

## 📦 5. Primitivos UI & Servicios

- **Componentes UI:** Toda la librería interactiva proviene de **Shadcn UI sobre Base UI** (`@base-ui/react`). Prohibido importar primitivos legacy de `@radix-ui/*`.
- **Iconografía:** Consolidada exclusivamente en `lucide-react`.
- **Peticiones HTTP:** Todo consumo de datos debe realizarse mediante `src/services/api.js` (prohibido utilizar `fetch()` directo).
