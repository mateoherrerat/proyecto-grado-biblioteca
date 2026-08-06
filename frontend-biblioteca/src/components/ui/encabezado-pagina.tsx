"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface EncabezadoPaginaProps {
  titulo: string;
  subtitulo?: string;
  acciones?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function EncabezadoPagina({
  titulo,
  subtitulo,
  acciones,
  children,
  className,
}: EncabezadoPaginaProps) {
  return (
    <div
      className={cn(
        "mb-8 border-b border-border/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6",
        className
      )}
    >
      <div className="space-y-1">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          {titulo}
        </h1>
        {subtitulo && (
          <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-2xl leading-relaxed">
            {subtitulo}
          </p>
        )}
      </div>

      {(acciones || children) && (
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          {acciones}
          {children}
        </div>
      )}
    </div>
  );
}
