"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutPublico } from "@/components/navegacion/layout-publico";
import { EstadoVacio } from "@/components/ui/estado-vacio";
import { Calendar, User, ArrowRight, Search, Loader2, Sparkles, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { publicacionesService } from "@/services/api";
import { coincideFuzzy } from "@/lib/fuzzy-search";

export default function PaginaPublicaciones() {
  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    async function cargarPublicaciones() {
      try {
        setCargando(true);
        setError(null);
        const data = await publicacionesService.getAll();
        setPublicaciones(data || []);
      } catch (err: any) {
        console.error("Error al cargar publicaciones:", err);
        setError("No se pudieron cargar las novedades desde la base de datos.");
      } finally {
        setCargando(false);
      }
    }

    cargarPublicaciones();
  }, []);

  const publicacionesFiltradas = publicaciones.filter((p) => {
    const desc = p.descripcion || "";
    const autor = p.autor_nombre || "";
    return coincideFuzzy(busqueda, desc) || coincideFuzzy(busqueda, autor);
  });

  function formatearFecha(fechaStr?: string) {
    if (!fechaStr) return "Reciente";
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return fechaStr;
    }
  }

  return (
    <LayoutPublico>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Header con Buscador */}
        <div className="mb-10 border-b border-border pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
              Novedades & Publicaciones
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Comunicados oficiales, notas de autores y anuncios de la red de bibliotecas LaBiblioteca ({publicaciones.length} publicaciones).
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 absolute left-3.5 top-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por contenido o autor..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="p-6 flex flex-col justify-between border border-border">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-4 w-28 rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                  </div>
                </CardContent>
                <div className="pt-4 border-t border-border mt-4 flex items-center justify-between">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-8 w-36 rounded-xl" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <EstadoVacio
            tipo="busqueda"
            titulo="Error al cargar publicaciones"
            descripcion={error}
            onAccion={() => window.location.reload()}
            textoBoton="Reintentar"
          />
        ) : publicacionesFiltradas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publicacionesFiltradas.map((pub) => (
              <Card
                key={pub.id_novedad}
                className="group overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between border border-border border-l-4 border-l-primary/60 hover:border-l-primary"
              >
                <CardContent className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <Badge variant="amber" className="font-bold gap-1">
                      <Sparkles className="h-3 w-3" /> Novedad BD #{pub.id_novedad}
                    </Badge>
                    <span className="flex items-center gap-1 font-medium text-xs">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {formatearFecha(pub.fecha)}
                    </span>
                  </div>

                  <p className="text-sm font-serif font-medium text-foreground leading-relaxed line-clamp-4">
                    {pub.descripcion}
                  </p>
                </CardContent>

                <div className="px-6 sm:px-8 pb-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-bold text-foreground">
                    <User className="h-3.5 w-3.5 text-primary" /> {pub.autor_nombre || "Autor Desconocido"}
                  </span>
                  
                  <Button variant="outline" size="sm" asChild className="rounded-xl text-xs font-bold gap-1">
                    <Link href={`/autores`}>
                      Ver en Autores <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EstadoVacio
            tipo="busqueda"
            titulo="No se encontraron publicaciones"
            descripcion={`No existen novedades registradas que coincidan con "${busqueda}".`}
            onAccion={() => setBusqueda("")}
            textoBoton="Limpiar búsqueda"
          />
        )}
      </main>
    </LayoutPublico>
  );
}
