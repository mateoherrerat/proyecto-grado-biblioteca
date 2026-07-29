"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutPublico } from "@/components/navegacion/layout-publico";
import { EstadoVacio } from "@/components/ui/estado-vacio";
import { Users, BookOpen, ArrowRight, Search, Loader2, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { autoresService } from "@/services/api";
import { coincideFuzzy } from "@/lib/fuzzy-search";

export default function PaginaAutores() {
  const [autores, setAutores] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    async function cargarAutores() {
      try {
        setCargando(true);
        setError(null);
        const data = await autoresService.getAll();
        setAutores(data || []);
      } catch (err: any) {
        console.error("Error al cargar autores:", err);
        setError("No se pudo obtener la lista de autores desde la base de datos.");
      } finally {
        setCargando(false);
      }
    }

    cargarAutores();
  }, []);

  const autoresFiltrados = autores.filter((a) =>
    coincideFuzzy(busqueda, a.nombre || "")
  );

  return (
    <LayoutPublico>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Encabezado con Buscador */}
        <div className="mb-10 border-b border-border pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
              Directorio de Autores
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Explora las mentes literarias y autores registrados en nuestra base de datos ({autores.length} autores).
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 absolute left-3.5 top-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar autor por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9 pr-9 h-10 text-xs rounded-xl"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda("")}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Estado de Carga Pulido */}
        {cargando ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="p-6 flex flex-col justify-between border-border/30">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-full rounded-md" />
                  </div>
                </CardContent>
                <div className="pt-4 border-t border-border mt-4">
                  <Skeleton className="h-9 w-full rounded-xl" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <EstadoVacio
            tipo="busqueda"
            titulo="Error al cargar autores"
            descripcion={error}
            onAccion={() => window.location.reload()}
            textoBoton="Reintentar"
          />
        ) : autoresFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {autoresFiltrados.map((autor) => (
              <Card
                key={autor.id_autor}
                className="group hover:border-primary/40 hover:shadow-md transition-all p-6 flex flex-col justify-between"
              >
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center font-serif font-extrabold text-xl shrink-0 border-2 border-primary/20 shadow-sm">
                      {autor.nombre ? autor.nombre.charAt(0).toUpperCase() : "A"}
                    </div>
                    <Badge variant="amber" className="font-bold text-[11px] shrink-0">
                      {autor.libros_count ? `${autor.libros_count} Obras` : "Autor de Catálogo"}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {autor.nombre}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                      Autor literario registrado en la red de bibliotecas LaBiblioteca.
                    </p>
                  </div>
                </CardContent>

                <div className="pt-4 border-t border-border mt-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    asChild
                    className="w-full justify-between text-xs font-bold text-primary hover:text-primary hover:bg-primary/5 rounded-xl"
                  >
                    <Link href={`/libros?q=${encodeURIComponent(autor.nombre)}`}>
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" /> Ver libros en catálogo
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EstadoVacio
            tipo="busqueda"
            titulo="No se encontraron autores"
            descripcion={`No hay resultados que coincidan con "${busqueda}".`}
            onAccion={() => setBusqueda("")}
            textoBoton="Limpiar búsqueda"
          />
        )}
      </main>
    </LayoutPublico>
  );
}
