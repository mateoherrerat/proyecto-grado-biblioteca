"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, Star, MapPin, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAutenticacion } from "@/context/contexto-autenticacion";
import { ImagenPortadaLibro } from "./imagen-portada-libro";
import { Skeleton } from "@/components/ui/skeleton";

export interface LibroProps {
  id?: string | number;
  id_libro?: string | number;
  slug?: string;
  titulo: string;
  autor?: string;
  categoria?: string;
  imagenPortada?: string;
  portada?: string;
  isbn?: string;
  disponible?: boolean;
  estado_disponibilidad?: string;
  calificacion?: number | string;
  sede?: string;
  paginas?: number;
  editorial?: string;
}

export function TarjetaLibro(props: LibroProps) {
  const router = useRouter();
  const { estaAutenticado } = useAutenticacion();
  
  const {
    titulo,
    autor = "Autor Desconocido",
    categoria = "General",
  } = props;

  const libroId = props.slug || props.id_libro || props.id || "1";

  // Datos reales traídos directamente de PostgreSQL
  const estaDisponible = props.estado_disponibilidad
    ? props.estado_disponibilidad.toLowerCase().includes("disponible")
    : props.disponible !== false;

  const estadoTexto = props.estado_disponibilidad || (estaDisponible ? "Disponible" : "En préstamo");
  const calificacionReal = props.calificacion ? Number(props.calificacion).toFixed(1) : "4.5";
  const sedeReal = props.sede || "Sede Principal";

  const [esFavorito, setEsFavorito] = useState(false);
  const [solicitando, setSolicitando] = useState(false);

  // Verificar si ya está en favoritos en localStorage
  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem("bookshub_favoritos") || "[]");
      setEsFavorito(favs.some((f: any) => String(f.id) === String(libroId)));
    } catch {
      setEsFavorito(false);
    }
  }, [libroId]);

  // Manejar clic en Guardar / Favoritos
  const manejarGuardar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!estaAutenticado) {
      router.push(`/login?redirect=${encodeURIComponent('/libros')}&accion=guardar&libroId=${encodeURIComponent(String(libroId))}&titulo=${encodeURIComponent(titulo)}`);
      return;
    }

    try {
      const favs = JSON.parse(localStorage.getItem("bookshub_favoritos") || "[]");
      if (esFavorito) {
        const nuevos = favs.filter((f: any) => String(f.id) !== String(libroId));
        localStorage.setItem("bookshub_favoritos", JSON.stringify(nuevos));
        setEsFavorito(false);
      } else {
        favs.push({ id: libroId, titulo, autor, sede: sedeReal, fechaGuardado: new Date().toISOString() });
        localStorage.setItem("bookshub_favoritos", JSON.stringify(favs));
        setEsFavorito(true);
      }
    } catch (err) {
      console.error("Error al guardar en favoritos:", err);
    }
  };

  // Manejar clic en Solicitar Préstamo
  const manejarSolicitud = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!estaAutenticado) {
      router.push(`/login?redirect=${encodeURIComponent('/libros')}&accion=solicitar&libroId=${encodeURIComponent(String(libroId))}&titulo=${encodeURIComponent(titulo)}`);
      return;
    }

    setSolicitando(true);
    try {
      const prestamos = JSON.parse(localStorage.getItem("bookshub_prestamos_usuario") || "[]");
      const nuevoPrestamo = {
        id: `prest-${Date.now()}`,
        id_libro: libroId,
        titulo,
        autor,
        sede: sedeReal,
        estado: "Pendiente de retiro",
        fechaSolicitud: new Date().toLocaleDateString("es-CO"),
        fechaLimite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("es-CO"),
      };
      prestamos.unshift(nuevoPrestamo);
      localStorage.setItem("bookshub_prestamos_usuario", JSON.stringify(prestamos));
      
      router.push("/mis-prestamos?solicitudExito=true");
    } catch (err) {
      console.error("Error al crear préstamo:", err);
    } finally {
      setSolicitando(false);
    }
  };

  return (
    <Card className="group flex flex-col justify-between overflow-hidden border-border/30 hover:border-primary/30 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <CardContent className="p-4">
        {/* Contenedor Imagen Portada */}
        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-muted mb-4 shadow-xs group-hover:shadow-sm transition-shadow">
          <ImagenPortadaLibro
            libro={props}
            alt={titulo}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Badge Estado Disponibilidad Real */}
          <div className="absolute top-2.5 left-2.5 z-10">
            {estaDisponible ? (
              <Badge variant="emerald" className="gap-1 text-[11px] font-semibold">
                <CheckCircle2 className="h-3 w-3" /> {estadoTexto}
              </Badge>
            ) : (
              <Badge variant="amber" className="gap-1 text-[11px] font-semibold">
                <Clock className="h-3 w-3" /> {estadoTexto}
              </Badge>
            )}
          </div>

          {/* Botón Favorito / Guardar Funcional */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={manejarGuardar}
            title={esFavorito ? "Quitar de favoritos" : "Guardar en favoritos"}
            className={`absolute top-2.5 right-2.5 z-10 rounded-full backdrop-blur-md transition-colors ${
              esFavorito
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-background/80 text-muted-foreground hover:text-primary hover:bg-background"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${esFavorito ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Información Bibliográfica Real */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-primary tracking-wide uppercase truncate max-w-[150px]">
              {categoria}
            </span>
            <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold shrink-0">
              <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
              <span>{calificacionReal}</span>
            </div>
          </div>

          <h3 className="font-serif font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {titulo}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-1 font-medium">
            {autor}
          </p>

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
            <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="truncate">{sedeReal}</span>
          </div>
        </div>
      </CardContent>

      {/* Botones de Acción Funcionales */}
      <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full text-xs font-semibold rounded-xl border-border/60 hover:bg-muted"
        >
          <Link href={`/libros/${libroId}`}>Ver Detalle</Link>
        </Button>
        <Button
          size="sm"
          onClick={manejarSolicitud}
          disabled={!estaDisponible || solicitando}
          className="w-full text-xs font-semibold rounded-xl shadow-2xs"
        >
          {solicitando ? "Procesando..." : "Solicitar"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function TarjetaLibroSkeleton() {
  return (
    <Card className="flex flex-col justify-between overflow-hidden border-border/30">

      <CardContent className="p-4">
        <Skeleton className="aspect-[3/4] w-full rounded-xl mb-4" />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-3 w-8 rounded-full" />
          </div>
          <Skeleton className="h-5 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
          <Skeleton className="h-3 w-2/3 rounded-md" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
        <Skeleton className="h-9 w-full rounded-xl" />
        <Skeleton className="h-9 w-full rounded-xl" />
      </CardFooter>
    </Card>
  );
}

