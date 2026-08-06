"use client";

import React from "react";
import Link from "next/link";
import { ContenedorPagina } from "@/components/ui/contenedor-pagina";
import { cn } from "@/lib/utils";

interface MigasDePanItem {
  label: string;
  href?: string;
}

interface LayoutDetalleProps {
  migasDePan: MigasDePanItem[];
  columnaIzquierda: React.ReactNode;
  columnaDerecha: React.ReactNode;
  seccionInferior?: React.ReactNode;
  className?: string;
}

export function LayoutDetalle({
  migasDePan,
  columnaIzquierda,
  columnaDerecha,
  seccionInferior,
  className,
}: LayoutDetalleProps) {
  return (
    <ContenedorPagina maxAnchoClass="max-w-7xl">
      {/* Barra de Migas de Pan Estandarizada */}
      <nav aria-label="Ruta de navegación" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground font-medium flex-wrap">
        {migasDePan.map((item, index) => {
          const esUltimo = index === migasDePan.length - 1;
          return (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-border">/</span>}
              {item.href && !esUltimo ? (
                <Link href={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-bold truncate max-w-[200px] sm:max-w-xs">
                  {item.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Disposición a 2 Columnas para Detalle */}
      <div className={cn("grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-10", className)}>
        {/* Columna Lateral (Imagen / Portada / Resumen) */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center">
          {columnaIzquierda}
        </div>

        {/* Columna Principal (Ficha Técnica / Acciones / Descripción) */}
        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          {columnaDerecha}
        </div>
      </div>

      {/* Sección Inferior (Reseñas / Libros Relacionados / Comentarios) */}
      {seccionInferior && <div className="mt-12 space-y-8">{seccionInferior}</div>}
    </ContenedorPagina>
  );
}
