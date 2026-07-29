"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutPublico } from "@/components/navegacion/layout-publico";
import { TarjetaLibro, TarjetaLibroSkeleton } from "@/components/libros/tarjeta-libro";
import { EstadoVacio } from "@/components/ui/estado-vacio";
import { Search, Filter, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { librosService } from "@/services/api";
import { coincideFuzzy } from "@/lib/fuzzy-search";

function ContenidoCatalogoLibros() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const catParam = searchParams.get("cat") || searchParams.get("categoria") || "";

  const [libros, setLibros] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState(queryParam);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(catParam || "Todas");
  const [soloDisponibles, setSoloDisponibles] = useState(false);

  useEffect(() => {
    if (queryParam) setBusqueda(queryParam);
    if (catParam) setCategoriaSeleccionada(catParam);
  }, [queryParam, catParam]);

  useEffect(() => {
    async function cargarLibros() {
      try {
        setCargando(true);
        setError(null);
        const data = await librosService.getAll();
        setLibros(data || []);
      } catch (err: any) {
        console.error("Error al cargar catálogo de libros:", err);
        setError("No se pudo conectar con el catálogo de libros.");
      } finally {
        setCargando(false);
      }
    }

    cargarLibros();
  }, []);

  // Categorías fijas y extraídas dinámicamente de la BD
  const categoriasExtraidas = Array.from(
    new Set(libros.map((l) => l.categoria).filter(Boolean))
  ) as string[];
  
  const categoriasPredefinidas = ["Todas", "Distopía", "Fantasía", "Terror", "Clásico", "Romance", "Ficción", "Thriller"];
  const categorias = Array.from(new Set([...categoriasPredefinidas, ...categoriasExtraidas]));

  const librosFiltrados = libros.filter((libro) => {
    const titulo = libro.titulo || "";
    const autor = libro.autor || "";
    const editorial = libro.editorial || "";
    const categoria = libro.categoria || "";
    const isbn = libro.isbn || "";
    const term = busqueda.toLowerCase().trim();

    const coincideBusqueda =
      !term ||
      coincideFuzzy(term, titulo) ||
      coincideFuzzy(term, autor) ||
      coincideFuzzy(term, editorial) ||
      coincideFuzzy(term, categoria) ||
      coincideFuzzy(term, isbn);

    const coincideCategoria =
      categoriaSeleccionada === "Todas" ||
      categoria.toLowerCase() === categoriaSeleccionada.toLowerCase();

    const estaDisp = libro.estado_disponibilidad
      ? libro.estado_disponibilidad.toLowerCase().includes("disponible")
      : libro.disponible !== false;

    const coincideDisponibilidad = !soloDisponibles || estaDisp;

    return coincideBusqueda && coincideCategoria && coincideDisponibilidad;
  });

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      
      {/* Cabecera del Catálogo */}
      <div className="mb-8 border-b border-border/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-foreground mb-1.5">
            Catálogo General de Libros
          </h1>
          <p className="text-xs text-muted-foreground font-medium">
            Explora la colección completa de ejemplares físicos disponibles en la red de bibliotecas ({libros.length} títulos).
          </p>
        </div>
      </div>

      {/* Barra de Filtros Shadcn Card */}
      <Card className="mb-8 shadow-xs border-border/80">
        <CardContent className="p-5 space-y-4">
          
          {/* Fila Superior: Buscador Rápido + Checkbox Solo Disponibles */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80 lg:w-96">
              <Search className="h-4 w-4 absolute left-3.5 top-3 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por título, autor, categoría o editorial..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-9 pr-8 h-10 text-xs rounded-xl border-border/60"
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda("")}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <Checkbox
                id="soloDisponibles"
                checked={soloDisponibles}
                onCheckedChange={(checked) => setSoloDisponibles(!!checked)}
              />
              <label htmlFor="soloDisponibles" className="text-xs font-bold text-foreground cursor-pointer select-none">
                Mostrar solo libros disponibles
              </label>
            </div>
          </div>

          {/* Fila Inferior: Píldoras de Categoría */}
          <div className="pt-3 border-t border-border/60 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Filter className="h-3.5 w-3.5 text-primary shrink-0 mr-1" />
            {categorias.map((cat) => (
              <Button
                key={cat}
                size="xs"
                variant={categoriaSeleccionada === cat ? "default" : "secondary"}
                onClick={() => setCategoriaSeleccionada(cat)}
                className={`rounded-full text-xs font-bold shrink-0 transition-all ${
                  categoriaSeleccionada === cat ? "shadow-2xs" : "bg-muted/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>

        </CardContent>
      </Card>

      {/* Indicador de Carga Pulido */}
      {cargando ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <TarjetaLibroSkeleton key={index} />
          ))}
        </div>
      ) : error ? (

        <EstadoVacio
          tipo="busqueda"
          titulo="Error al cargar libros"
          descripcion={error}
          onAccion={() => window.location.reload()}
          textoBoton="Reintentar"
        />
      ) : librosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {librosFiltrados.map((libro) => (
            <TarjetaLibro key={libro.id_libro || libro.id} {...libro} />
          ))}
        </div>
      ) : (
        <EstadoVacio
          tipo="busqueda"
          titulo="No se encontraron libros"
          descripcion={
            busqueda
              ? `No existen libros en el catálogo que coincidan con "${busqueda}".`
              : "Intenta ajustar tus términos de búsqueda o desactiva los filtros seleccionados."
          }
          onAccion={() => {
            setBusqueda("");
            setCategoriaSeleccionada("Todas");
            setSoloDisponibles(false);
          }}
          textoBoton="Restablecer Filtros"
        />
      )}

    </main>
  );
}

export default function PaginaCatalogoLibros() {
  return (
    <LayoutPublico>
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <ContenidoCatalogoLibros />
      </Suspense>
    </LayoutPublico>
  );
}
