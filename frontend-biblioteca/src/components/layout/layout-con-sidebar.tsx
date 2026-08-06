"use client";

import React from "react";
import { ContenedorPagina } from "@/components/ui/contenedor-pagina";
import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import { cn } from "@/lib/utils";

interface LayoutConSidebarProps {
  titulo: string;
  subtitulo?: string;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  accionesHeader?: React.ReactNode;
  maxAnchoClass?: string;
  className?: string;
}

export function LayoutConSidebar({
  titulo,
  subtitulo,
  sidebar,
  children,
  accionesHeader,
  maxAnchoClass = "max-w-[1400px]",
  className,
}: LayoutConSidebarProps) {
  return (
    <ContenedorPagina maxAnchoClass={maxAnchoClass}>
      <EncabezadoPagina
        titulo={titulo}
        subtitulo={subtitulo}
        acciones={accionesHeader}
      />

      {/* Disposición Flex de 2 Columnas con Sidebar Adherente */}
      <div className={cn("flex flex-col lg:flex-row gap-8 items-start w-full", className)}>
        {/* Panel Lateral Adherente */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6 sticky top-24">
          {sidebar}
        </aside>

        {/* Área Principal de Resultados / Contenido */}
        <main className="flex-1 w-full space-y-6">
          {children}
        </main>
      </div>
    </ContenedorPagina>
  );
}
