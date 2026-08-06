"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDirectorio } from "@/components/layout/layout-directorio";
import { EstadoVacio } from "@/components/ui/estado-vacio";
import { Building2, MapPin, Clock, Phone, Search, Loader2, CheckCircle2, Navigation, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bibliotecasService } from "@/services/api";
import { coincideFuzzy } from "@/lib/fuzzy-search";

export default function PaginaSedes() {
  const [sedes, setSedes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    async function cargarSedes() {
      try {
        setCargando(true);
        setError(null);
        const data = await bibliotecasService.getAll();
        setSedes(data || []);
      } catch (err: any) {
        console.error("Error al cargar sedes físicas:", err);
        setError("No se pudo conectar con la red de bibliotecas.");
      } finally {
        setCargando(false);
      }
    }

    cargarSedes();
  }, []);

  // Calcular si la sede está abierta en este momento (8:00 AM - 6:00 PM)
  const horaActual = new Date().getHours();
  const estaAbiertaHoy = horaActual >= 8 && horaActual < 18;

  const sedesFiltradas = sedes.filter((s) => {
    const nombre = s.nombre || "";
    const ciudad = s.ubicacion || "";
    const direccion = s.direccion || "";
    return (
      coincideFuzzy(busqueda, nombre) ||
      coincideFuzzy(busqueda, ciudad) ||
      coincideFuzzy(busqueda, direccion)
    );
  });

  return (
    <LayoutDirectorio
      titulo="Sedes Físicas & Bibliotecas"
      subtitulo={`Directorio de sedes y puntos de atención de la red de bibliotecas LaBiblioteca (${sedes.length} sedes registradas).`}
      buscador={
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3.5 top-3 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por sede, ciudad o dirección..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9 h-10 text-xs rounded-xl border-border/80 shadow-xs"
          />
        </div>
      }
    >

        {/* Estado de Carga Pulido */}
        {cargando ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="p-6 flex flex-col justify-between border-border/80">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="w-12 h-12 rounded-2xl" />
                    <Skeleton className="h-6 w-28 rounded-full" />
                  </div>
                  <Skeleton className="h-7 w-3/4 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-5/6 rounded-md" />
                    <Skeleton className="h-4 w-2/3 rounded-md" />
                  </div>
                </CardContent>
                <div className="pt-3 border-t border-border/60 mt-4">
                  <Skeleton className="h-9 w-full rounded-xl" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <EstadoVacio
            tipo="busqueda"
            titulo="Error al cargar sedes"
            descripcion={error}
            onAccion={() => window.location.reload()}
            textoBoton="Reintentar"
          />
        ) : sedesFiltradas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sedesFiltradas.map((sede) => (
              <Card
                key={sede.id_biblioteca}
                className="group hover:border-primary/40 hover:shadow-md transition-all p-6 flex flex-col justify-between border border-border/80 shadow-xs"
              >
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                      <Building2 className="h-6 w-6" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={estaAbiertaHoy ? "emerald" : "amber"}
                        className="font-semibold text-[11px]"
                      >
                        {estaAbiertaHoy ? "● Abierto Ahora" : "○ Cerrado"}
                      </Badge>
                      <Badge variant="outline" className="font-semibold text-[11px]">
                        {sede.ubicacion || "Sede Física"}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-base text-foreground mb-3 group-hover:text-primary transition-colors">
                    {sede.nombre}
                  </h3>

                  <div className="space-y-2.5 text-xs text-muted-foreground mb-5 font-medium">
                    <p className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{sede.direccion || "Av. Las Vegas Cra #48 1-125"}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{sede.horarios || "Lunes a Viernes 8:00 AM - 6:00 PM"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary shrink-0" />
                      <span>{sede.telefono || "+57 (604) 426-6460"}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/60 mb-4 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block mb-1.5">
                      Servicios de Préstamo:
                    </span>
                    <div className="flex items-center gap-2 text-xs text-foreground font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Consulta en Sala & Préstamo Externo</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Devolución en Red de Bibliotecas</span>
                    </div>
                  </div>
                </CardContent>

                <div className="pt-3 border-t border-border/60">
                  <Button size="sm" variant="outline" asChild className="w-full rounded-xl text-xs font-bold gap-1 shadow-2xs">
                    <Link href={`/libros?q=${encodeURIComponent(sede.nombre)}`}>
                      Explorar Libros en esta Sede <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EstadoVacio
            tipo="busqueda"
            titulo="No se encontraron sedes"
            descripcion={`No existen sedes registradas que coincidan con "${busqueda}".`}
            onAccion={() => setBusqueda("")}
            textoBoton="Limpiar búsqueda"
          />
        )}
    </LayoutDirectorio>
  );
}
