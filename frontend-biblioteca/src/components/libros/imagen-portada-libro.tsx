"use client";

import React, { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { obtenerImagenPortada } from "@/lib/libros-utils";

interface ImagenPortadaLibroProps {
  libro: {
    portada?: string | null;
    imagenPortada?: string | null;
    titulo?: string | null;
  };
  alt: string;
  className?: string;
  aspectRatioClass?: string;
}

export function ImagenPortadaLibro({ libro, alt, className = "w-full h-full object-cover" }: ImagenPortadaLibroProps) {
  const urlInicial = obtenerImagenPortada(libro);
  const [src, setSrc] = useState<string | null>(urlInicial);
  const [errorCarga, setErrorCarga] = useState<boolean>(!urlInicial);

  useEffect(() => {
    const url = obtenerImagenPortada(libro);
    setSrc(url);
    setErrorCarga(!url);
  }, [libro.portada, libro.imagenPortada]);

  if (errorCarga || !src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-muted/70 text-muted-foreground border border-border/40 select-none text-center rounded-inherit">
        <BookOpen className="h-9 w-9 text-muted-foreground/50 mb-2 stroke-[1.5]" />
        <span className="text-[11px] font-semibold text-muted-foreground/80">Sin imagen</span>
        {libro.titulo && (
          <span className="text-[10px] text-muted-foreground/60 line-clamp-2 mt-1.5 px-2 font-serif">
            {libro.titulo}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrorCarga(true)}
    />
  );
}
