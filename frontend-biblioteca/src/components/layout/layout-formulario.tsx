"use client";

import React from "react";
import { ContenedorPagina } from "@/components/ui/contenedor-pagina";
import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import { cn } from "@/lib/utils";

interface LayoutFormularioProps {
  titulo: string;
  subtitulo?: string;
  bannerNotificacion?: React.ReactNode;
  children: React.ReactNode;
  maxAnchoClass?: string;
  className?: string;
}

export function LayoutFormulario({
  titulo,
  subtitulo,
  bannerNotificacion,
  children,
  maxAnchoClass = "max-w-7xl",
  className,
}: LayoutFormularioProps) {
  return (
    <ContenedorPagina maxAnchoClass={maxAnchoClass}>
      {/* Banner de Notificación */}
      {bannerNotificacion && <div className="mb-6">{bannerNotificacion}</div>}

      {/* Encabezado Estandarizado */}
      <EncabezadoPagina
        titulo={titulo}
        subtitulo={subtitulo}
      />

      {/* Cuerpo del Formulario / Pestañas de Ajustes */}
      <div className={cn("space-y-8", className)}>
        {children}
      </div>
    </ContenedorPagina>
  );
}
