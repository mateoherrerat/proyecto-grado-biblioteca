"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { LayoutPublico } from "@/components/navegacion/layout-publico";
import { TarjetaLibro, TarjetaLibroSkeleton } from "@/components/libros/tarjeta-libro";
import {
  BookOpen,
  Sparkles,
  Quote,
  Flame,
  ArrowRight,
  Building2,
  MapPin,
  CheckCircle2,
  Filter,
  Search,
  CalendarCheck,
  PackageCheck,
  Users,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  librosService,
  publicacionesService,
  bibliotecasService,
} from "@/services/api";

export default function PaginaInicioLanding() {
  // Estados de datos de la Base de Datos
  const [libros, setLibros] = useState<any[]>([]);
  const [novedades, setNovedades] = useState<any[]>([]);
  const [sedes, setSedes] = useState<any[]>([]);
  const [autores, setAutores] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDatosInicio() {
      try {
        setCargando(true);
        const [dataLibros, dataNovedades, dataSedes, dataAutores] = await Promise.all([
          librosService.getAll().catch(() => []),
          publicacionesService.getAll().catch(() => []),
          bibliotecasService.getAll().catch(() => []),
          import("@/services/api").then(m => m.autoresService.getAll()).catch(() => []),
        ]);

        setLibros(dataLibros || []);
        setNovedades(dataNovedades || []);
        setSedes(dataSedes || []);
        setAutores(dataAutores || []);
      } catch (err) {
        console.error("Error al cargar datos en el portal:", err);
      } finally {
        setCargando(false);
      }
    }

    cargarDatosInicio();
  }, []);

  // Extraer dinámicamente las categorías reales sincronizadas con la página de libros
  const categoriasExtraidas = useMemo(() => {
    return Array.from(
      new Set(libros.map((l) => l.categoria).filter(Boolean))
    ) as string[];
  }, [libros]);

  // Selección aleatoria de exactamente 4 libros (1 sola fila en pantallas grandes)
  const librosDestacadosAleatorios = useMemo(() => {
    if (!libros || libros.length === 0) return [];
    return [...libros].sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [libros]);

  return (
    <LayoutPublico>
      {/* SECCIÓN HERO PRINCIPAL */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-border bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-0">
          
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
            Consulta disponibilidad y reserva tus{" "}
            <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-8">
              libros físicos
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
            Verifica en tiempo real la presencia de ejemplares en nuestras sedes, realiza la reserva de tu libro en línea y retíralo personalmente en el punto físico asignado.
          </p>

          {/* Botones de Acción Directa */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-10">
            <Button size="lg" className="w-full sm:w-auto rounded-full font-bold gap-2 shadow-sm text-xs" asChild>
              <Link href="/libros">
                <BookOpen className="h-4 w-4" /> Consultar Catálogo ({libros.length})
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full font-bold gap-2 text-xs" asChild>
              <Link href="/sedes">
                <Building2 className="h-4 w-4 text-primary" /> Ver Puntos Físicos ({sedes.length})
              </Link>
            </Button>
          </div>

          {/* Filtros de Categorías Sincronizados con /libros */}
          {categoriasExtraidas.length > 0 && (
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
              <span className="text-xs font-bold text-muted-foreground mr-1 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-primary" /> Categorías disponibles:
              </span>
              {categoriasExtraidas.slice(0, 7).map((cat) => (
                <Button
                  key={cat}
                  size="xs"
                  variant="secondary"
                  asChild
                  className="rounded-full text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all shadow-2xs"
                >
                  <Link href={`/libros?cat=${encodeURIComponent(cat)}`}>
                    {cat}
                  </Link>
                </Button>
              ))}
            </div>
          )}

          {/* Métricas de Inventario Físico */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mt-10 pt-6 border-t border-border/50">
            <div className="p-2 text-center">
              {cargando ? (
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="h-8 w-16 mx-auto rounded-md" />
                  <Skeleton className="h-3 w-24 mx-auto rounded-md" />
                </div>
              ) : (
                <>
                  <p className="font-serif text-2xl sm:text-3xl font-extrabold text-primary">{libros.length}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Títulos en Catálogo</p>
                </>
              )}
            </div>

            <div className="p-2 text-center border-l border-border/50">
              {cargando ? (
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="h-8 w-12 mx-auto rounded-md" />
                  <Skeleton className="h-3 w-24 mx-auto rounded-md" />
                </div>
              ) : (
                <>
                  <p className="font-serif text-2xl sm:text-3xl font-extrabold text-primary">{sedes.length || 3}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Puntos Físicos</p>
                </>
              )}
            </div>

            <div className="p-2 text-center border-l border-border/50">
              {cargando ? (
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="h-8 w-12 mx-auto rounded-md" />
                  <Skeleton className="h-3 w-20 mx-auto rounded-md" />
                </div>
              ) : (
                <>
                  <p className="font-serif text-2xl sm:text-3xl font-extrabold text-primary">{autores.length}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Autores</p>
                </>
              )}
            </div>

            <div className="p-2 text-center border-l border-border/50">
              {cargando ? (
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="h-8 w-12 mx-auto rounded-md" />
                  <Skeleton className="h-3 w-24 mx-auto rounded-md" />
                </div>
              ) : (
                <>
                  <p className="font-serif text-2xl sm:text-3xl font-extrabold text-primary">{novedades.length}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Novedades</p>
                </>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* PASOS PARA LA RESERVA Y RETIRO FÍSICO */}
      <section className="py-14 bg-muted/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
              ¿Cómo funciona el servicio de reserva?
            </h2>
            <p className="text-xs text-muted-foreground">
              Proceso sencillo de verificación de ejemplares y retiro presencial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:border-primary/40 transition-all border border-border">
              <CardContent className="p-0 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="font-serif font-bold text-base text-foreground mb-2">1. Consulta Disponibilidad</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Busca en el catálogo el título de tu interés y verifica en qué sede física se encuentran las copias disponibles.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:border-primary/40 transition-all border border-border">
              <CardContent className="p-0 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <CalendarCheck className="h-6 w-6" />
                </div>
                <h3 className="font-serif font-bold text-base text-foreground mb-2">2. Solicita tu Reserva</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Haz clic en "Solicitar Préstamo" para apartar tu ejemplar físico temporalmente mientras te desplazas al punto.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:border-primary/40 transition-all border border-border">
              <CardContent className="p-0 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <PackageCheck className="h-6 w-6" />
                </div>
                <h3 className="font-serif font-bold text-base text-foreground mb-2">3. Retira en Punto Físico</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Acércate a la sede física seleccionada, presenta tu carnet o documento y reclama tu libro para lectura o préstamo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECCIÓN LIBROS DESTACADOS (1 SOLA FILA DE 4 LIBROS ALEATORIOS) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-1">
              <Flame className="h-4 w-4" /> Selección Aleatoria del Catálogo
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground">Libros Recomendados</h2>
          </div>
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex gap-1 text-xs font-bold text-primary">
            <Link href="/libros">
              Ver catálogo completo ({libros.length}) <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {cargando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <TarjetaLibroSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {librosDestacadosAleatorios.map((libro) => (
              <TarjetaLibro key={libro.id_libro || libro.id} {...libro} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Button size="sm" variant="outline" asChild className="w-full rounded-xl">
            <Link href="/libros">Ver todo el catálogo ({libros.length})</Link>
          </Button>
        </div>
      </section>

      {/* SECCIÓN CITAS LITERARIAS */}
      <section className="py-20 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Quote className="h-10 w-10 text-primary/30 mx-auto mb-4" />
          <blockquote className="font-serif text-2xl sm:text-3xl font-semibold text-foreground italic leading-relaxed mb-6">
            "Un libro abierto es un cerebro que habla; cerrado un amigo que espera; olvidado, un alma que perdona."
          </blockquote>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">— Proverbio Hindú</p>
        </div>
      </section>
    </LayoutPublico>
  );
}
