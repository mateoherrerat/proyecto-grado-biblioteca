"use client";

import React from "react";
import Link from "next/link";
import { Search, BookOpen, ArrowRight, AlertCircle, BellOff, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EstadoVacioProps {
  tipo?: "busqueda" | "prestamos" | "notificaciones" | "general" | "favoritos";
  titulo?: string;
  descripcion?: string;
  textoBoton?: string;
  enlaceBoton?: string;
  onAccion?: () => void;
}

export function EstadoVacio({
  tipo = "busqueda",
  titulo,
  descripcion,
  textoBoton,
  enlaceBoton = "/libros",
  onAccion,
}: EstadoVacioProps) {
  const configs = {
    busqueda: {
      icono: <Search className="h-10 w-10 text-primary" />,
      titulo: titulo || "No encontramos resultados para tu búsqueda",
      descripcion: descripcion || "Intenta buscar por otro término, verifica la ortografía o explora nuestras categorías destacadas.",
      textoBoton: textoBoton || "Explorar Todo el Catálogo",
    },
    prestamos: {
      icono: <BookOpen className="h-10 w-10 text-primary" />,
      titulo: titulo || "Tu lista de préstamos está vacía",
      descripcion: descripcion || "Aún no has solicitado libros en préstamo. Explora nuestro catálogo y solicita tus primeras lecturas.",
      textoBoton: textoBoton || "Buscar Libros Disponibles",
    },
    favoritos: {
      icono: <BookOpen className="h-10 w-10 text-primary" />,
      titulo: titulo || "Aún no has guardado libros",
      descripcion: descripcion || "Haz clic en el icono del marcador de cualquier tarjeta para añadirlo a tus lecturas guardadas.",
      textoBoton: textoBoton || "Explorar Catálogo",
    },
    notificaciones: {
      icono: <BellOff className="h-10 w-10 text-primary" />,
      titulo: titulo || "Estás al día con tus notificaciones",
      descripcion: descripcion || "No tienes notificaciones pendientes ni avisos de vencimientos en este momento.",
      textoBoton: textoBoton || "Volver al Inicio",
    },
    general: {
      icono: <Inbox className="h-10 w-10 text-primary" />,
      titulo: titulo || "Sin registros disponibles",
      descripcion: descripcion || "No hay elementos para mostrar en esta sección por el momento.",
      textoBoton: textoBoton || "Explorar Biblioteca",
    },
  };


  const configActual = configs[tipo] || configs.general;

  return (
    <Card className="rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs my-8">
      <CardContent className="p-0">
        <div className="w-20 h-20 rounded-full bg-accent/60 flex items-center justify-center mx-auto mb-6">
          {configActual.icono}
        </div>

        <h3 className="font-serif font-bold text-2xl text-foreground mb-3">
          {configActual.titulo}
        </h3>

        <p className="text-xs text-muted-foreground leading-relaxed mb-6">
          {configActual.descripcion}
        </p>

        {onAccion ? (
          <Button
            onClick={onAccion}
            className="rounded-full font-semibold gap-2 shadow-xs"
          >
            {configActual.textoBoton}
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            asChild
            className="rounded-full font-semibold gap-2 shadow-xs"
          >
            <Link href={enlaceBoton}>
              {configActual.textoBoton}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
