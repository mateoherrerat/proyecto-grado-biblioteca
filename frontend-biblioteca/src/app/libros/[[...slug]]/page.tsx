"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { LayoutConSidebar } from "@/components/layout/layout-con-sidebar";
import { TarjetaLibro, TarjetaLibroSkeleton } from "@/components/libros/tarjeta-libro";
import { EstadoVacio } from "@/components/ui/estado-vacio";
import { Search, Filter, Loader2, X, RotateCcw, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { librosService } from "@/services/api";
import { coincideFuzzy } from "@/lib/fuzzy-search";

const ELEMENTOS_POR_PAGINA = 12;

function parsearParametrosRuta(slugArray?: string[]) {
  if (!slugArray || slugArray.length === 0) {
    return { pagina: 1, busqueda: "" };
  }

  const primerSegmento = slugArray[0];
  const numPagina = parseInt(primerSegmento, 10);

  if (!isNaN(numPagina) && numPagina > 0) {
    const busquedaSegmento = slugArray[1]
      ? decodeURIComponent(slugArray[1]).replace(/-/g, " ")
      : "";
    return { pagina: numPagina, busqueda: busquedaSegmento };
  }

  const busquedaSegmento = decodeURIComponent(primerSegmento).replace(/-/g, " ");
  return { pagina: 1, busqueda: busquedaSegmento };
}

function ContenidoCatalogoLibros() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeParams = useParams();

  const slugArray = routeParams.slug as string[] | undefined;
  const { pagina: paginaUrl, busqueda: busquedaUrl } = parsearParametrosRuta(slugArray);

  const catParam = searchParams.get("cat") || searchParams.get("categoria") || "";
  const dispParam = searchParams.get("disp") === "true";

  const [libros, setLibros] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados locales
  const [busqueda, setBusqueda] = useState(busquedaUrl);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(catParam || "Todas");
  const [soloDisponibles, setSoloDisponibles] = useState(dispParam);

  const paginaActual = paginaUrl;

  // Cargar libros del backend una sola vez
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

  // Actualizar suavemente la URL en la barra del navegador sin reiniciar el componente
  useEffect(() => {
    const timer = setTimeout(() => {
      const queryParams = new URLSearchParams();
      if (categoriaSeleccionada && categoriaSeleccionada !== "Todas") {
        queryParams.set("cat", categoriaSeleccionada);
      }
      if (soloDisponibles) {
        queryParams.set("disp", "true");
      }

      const queryPart = queryParams.toString() ? `?${queryParams.toString()}` : "";
      const slugBusqueda = busqueda.trim()
        ? `/${encodeURIComponent(busqueda.trim().toLowerCase().replace(/\s+/g, "-"))}`
        : "";

      const targetPath = `/libros/${paginaActual}${slugBusqueda}${queryPart}`;

      if (typeof window !== "undefined") {
        const actualPath = window.location.pathname + window.location.search;
        if (actualPath !== targetPath) {
          window.history.replaceState(null, "", targetPath);
        }
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [busqueda, categoriaSeleccionada, soloDisponibles, paginaActual]);

  const construirUrlPagina = (numPagina: number) => {
    const queryParams = new URLSearchParams();
    if (categoriaSeleccionada && categoriaSeleccionada !== "Todas") queryParams.set("cat", categoriaSeleccionada);
    if (soloDisponibles) queryParams.set("disp", "true");

    const queryPart = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const slugBusqueda = busqueda.trim()
      ? `/${encodeURIComponent(busqueda.trim().toLowerCase().replace(/\s+/g, "-"))}`
      : "";

    return `/libros/${numPagina}${slugBusqueda}${queryPart}`;
  };

  // Categorías fijas y extraídas dinámicamente de la BD
  const categoriasExtraidas = Array.from(
    new Set(libros.map((l) => l.categoria).filter(Boolean))
  ) as string[];
  
  const categoriasPredefinidas = ["Todas", "Distopía", "Fantasía", "Terror", "Clásico", "Romance", "Ficción", "Thriller"];
  const categorias = Array.from(new Set([...categoriasPredefinidas, ...categoriasExtraidas]));

  const hayFiltrosActivos = categoriaSeleccionada !== "Todas" || soloDisponibles || busqueda.trim() !== "";

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

  // Cálculo de paginación
  const totalPaginas = Math.ceil(librosFiltrados.length / ELEMENTOS_POR_PAGINA) || 1;
  const librosPaginados = librosFiltrados.slice(
    (paginaActual - 1) * ELEMENTOS_POR_PAGINA,
    paginaActual * ELEMENTOS_POR_PAGINA
  );

  const generarNumerosPaginas = () => {
    const paginas: (number | string)[] = [];
    if (totalPaginas <= 5) {
      for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
    } else {
      paginas.push(1);
      if (paginaActual > 3) paginas.push("...");
      
      const inicio = Math.max(2, paginaActual - 1);
      const fin = Math.min(totalPaginas - 1, paginaActual + 1);
      
      for (let i = inicio; i <= fin; i++) {
        paginas.push(i);
      }
      
      if (paginaActual < totalPaginas - 2) paginas.push("...");
      paginas.push(totalPaginas);
    }
    return paginas;
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoriaSeleccionada("Todas");
    setSoloDisponibles(false);
    router.push("/libros/1", { scroll: false });
  };

  return (
    <LayoutConSidebar
      titulo="Catálogo General de Libros"
      subtitulo={`Explora la colección completa de ejemplares físicos disponibles en la red de bibliotecas (${libros.length} títulos).`}
      sidebar={
        <>
          <div className="relative w-full">
            <Search className="h-4 w-4 absolute left-3.5 top-3 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar por título, autor..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-9 h-10 text-xs rounded-xl border-border/80 shadow-xs bg-background focus-visible:ring-primary"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda("")}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                title="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Card className="shadow-xs border-border/80">
            <CardHeader className="p-4 pb-3 border-b border-border/60 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                <Filter className="h-4 w-4 text-primary" />
                Filtros de búsqueda
              </CardTitle>
              {hayFiltrosActivos && (
                <button
                  onClick={limpiarFiltros}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  Limpiar
                </button>
              )}
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Categoría
                </label>
                <Select
                  value={categoriaSeleccionada}
                  onValueChange={setCategoriaSeleccionada}
                >
                  <SelectTrigger className="w-full h-9 text-xs rounded-xl border-border/60 bg-background">
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pt-3 border-t border-border/40">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="disponible-sidebar"
                    checked={soloDisponibles}
                    onCheckedChange={(c) => setSoloDisponibles(!!c)}
                  />
                  <label
                    htmlFor="disponible-sidebar"
                    className="text-xs font-semibold text-foreground cursor-pointer select-none"
                  >
                    Solo libros disponibles
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>Resultados encontrados</span>
                <Badge variant="outline" className="text-[11px] font-bold">
                  {librosFiltrados.length}
                </Badge>
              </div>

            </CardContent>
          </Card>
        </>
      }
    >
      {cargando ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {librosPaginados.map((libro) => (
                  <TarjetaLibro key={libro.id_libro || libro.id} {...libro} />
                ))}
              </div>

              {/* Componente Paginación Shadcn con URLs limpia en la ruta */}
              {totalPaginas > 1 && (
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/60 pt-6">
                  <p className="text-xs text-muted-foreground font-medium">
                    Mostrando{" "}
                    <span className="font-bold text-foreground">
                      {(paginaActual - 1) * ELEMENTOS_POR_PAGINA + 1}
                    </span>{" "}
                    a{" "}
                    <span className="font-bold text-foreground">
                      {Math.min(
                        paginaActual * ELEMENTOS_POR_PAGINA,
                        librosFiltrados.length
                      )}
                    </span>{" "}
                    de{" "}
                    <span className="font-bold text-foreground">
                      {librosFiltrados.length}
                    </span>{" "}
                    libros
                  </p>

                  <Pagination className="w-auto mx-0">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href={construirUrlPagina(Math.max(1, paginaActual - 1))}
                          disabled={paginaActual === 1}
                        />
                      </PaginationItem>

                      {generarNumerosPaginas().map((num, i) => (
                        <PaginationItem key={i}>
                          {num === "..." ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              href={construirUrlPagina(Number(num))}
                              isActive={paginaActual === num}
                            >
                              {num}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href={construirUrlPagina(Math.min(totalPaginas, paginaActual + 1))}
                          disabled={paginaActual === totalPaginas}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <EstadoVacio
              tipo="busqueda"
              titulo="No se encontraron libros"
              descripcion={
                busqueda
                  ? `No existen libros en el catálogo que coincidan con "${busqueda}".`
                  : "Intenta ajustar tus términos de búsqueda o desactiva los filtros seleccionados."
              }
              onAccion={limpiarFiltros}
              textoBoton="Restablecer Filtros"
            />
          )}
    </LayoutConSidebar>
  );
}

export default function PaginaCatalogoLibros() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ContenidoCatalogoLibros />
    </Suspense>
  );
}
