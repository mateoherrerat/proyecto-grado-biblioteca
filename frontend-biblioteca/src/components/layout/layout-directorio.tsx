"use client";

import React from "react";
import { ContenedorPagina } from "@/components/ui/contenedor-pagina";
import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import { cn } from "@/lib/utils";

interface LayoutDirectorioProps {
  titulo: string;
  subtitulo?: string;
  buscador?: React.ReactNode;
  children: React.ReactNode;
  columnasClass?: string;
  className?: string;
}

export function LayoutDirectorio({
  titulo,
  subtitulo,
  buscador,
  children,
  columnasClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  className,
}: LayoutDirectorioProps) {
  return (
    <ContenedorPagina>
      {/* Encabezado Unificado con Buscador */}
      <EncabezadoPagina
        titulo={titulo}
        subtitulo={subtitulo}
        acciones={buscador}
      />

      {/* Rejilla de Estructura de Contenido Consistente */}
      <div className={cn("grid gap-6 sm:gap-8", columnasClass, className)}>
        {children}
      </div>
    </ContenedorPagina>
  );
}
