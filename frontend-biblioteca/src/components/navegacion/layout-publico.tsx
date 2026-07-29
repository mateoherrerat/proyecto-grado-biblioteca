"use client";

import React from "react";
import { EncabezadoNavegacion } from "@/components/navegacion/encabezado-navegacion";
import { PiePagina } from "@/components/pie-pagina/pie-pagina";

interface LayoutPublicoProps {
  children: React.ReactNode;
}

export function LayoutPublico({ children }: LayoutPublicoProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-accent selection:text-accent-foreground">
      <EncabezadoNavegacion />
      <main className="flex-1 w-full flex flex-col">{children}</main>
      <PiePagina />
    </div>
  );
}
