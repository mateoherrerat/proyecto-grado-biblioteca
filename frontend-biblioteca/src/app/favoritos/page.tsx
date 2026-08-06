"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { LayoutDashboard } from "@/components/layout/layout-dashboard";
import { useAutenticacion } from "@/context/contexto-autenticacion";
import { EstadoVacio } from "@/components/ui/estado-vacio";
import {
  Bookmark,
  BookOpen,
  IdCard,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function ContenidoFavoritos() {
  const { usuario, estaAutenticado } = useAutenticacion();
  const [favoritos, setFavoritos] = useState<any[]>([]);

  useEffect(() => {
    if (estaAutenticado) {
      cargarFavoritos();
    }
  }, [estaAutenticado]);

  const cargarFavoritos = () => {
    try {
      const f = JSON.parse(localStorage.getItem("bookshub_favoritos") || "[]");
      setFavoritos(f);
    } catch {
      setFavoritos([]);
    }
  };

  const eliminarFavorito = (id: string | number) => {
    try {
      const nuevos = favoritos.filter((item) => String(item.id) !== String(id));
      localStorage.setItem("bookshub_favoritos", JSON.stringify(nuevos));
      setFavoritos(nuevos);
    } catch (e) {
      console.error(e);
    }
  };

  if (!estaAutenticado) {
    return (
      <main className="flex-1 max-w-7xl mx-auto px-4 py-16 w-full flex items-center justify-center">
        <EstadoVacio
          tipo="general"
          titulo="Inicia sesión para ver tus libros guardados"
          descripcion="Debes estar registrado como lector para guardar libros de tu interés y consultar tu lista de favoritos."
          enlaceBoton="/login"
          textoBoton="Iniciar Sesión"
        />
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      
      {/* Cabecera Tarjeta Perfil del Lector */}
      <Card className="mb-8 overflow-hidden border-border/80 shadow-md">
        <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-card via-card to-amber-500/5">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-amber-500/20 shadow-md">
              <AvatarFallback className="bg-amber-500 text-white font-serif font-extrabold text-2xl">
                {usuario?.nombre?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-extrabold text-foreground">{usuario?.nombre}</h1>
                <Badge variant="amber" className="font-bold text-[10px]">
                  Libros Guardados
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">{usuario?.email}</p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1.5 font-mono">
                <span className="flex items-center gap-1 font-bold">
                  <IdCard className="h-3.5 w-3.5 text-amber-500" />
                  {usuario?.codigoBiblioteca || "BIB-2026-352"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" size="sm" asChild className="rounded-xl font-bold gap-2 shadow-2xs">
              <Link href="/mis-prestamos">
                <ShoppingBag className="h-4 w-4 text-primary" /> Mis Préstamos & Reservas
              </Link>
            </Button>
            <div className="bg-background/80 backdrop-blur-md p-3.5 rounded-2xl text-center border border-border/80 shadow-2xs min-w-28">
              <span className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Guardados</span>
              <span className="font-serif font-extrabold text-xl text-amber-600">{favoritos.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Título de Sección */}
      <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-amber-500" />
          <h2 className="font-serif text-xl font-extrabold text-foreground">
            Tus Libros Guardados ({favoritos.length})
          </h2>
        </div>
        <Button variant="ghost" size="xs" asChild className="text-xs font-bold text-primary">
          <Link href="/libros">
            Explorar más en el catálogo <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {/* Grilla de Favoritos */}
      {favoritos.length === 0 ? (
        <EstadoVacio
          tipo="favoritos"
          titulo="Aún no has guardado libros"
          descripcion="Haz clic en el icono del marcador de cualquier tarjeta del catálogo para guardar tus libros de interés y consultarlos más tarde."
          enlaceBoton="/libros"
          textoBoton="Ver Catálogo de Libros"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoritos.map((fav) => (
            <Card key={fav.id} className="hover:border-amber-500/40 transition-all shadow-xs border-border/80">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-12 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center font-bold shrink-0">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-amber-600 tracking-wider block">Guardado</span>
                      <h3 className="font-serif font-bold text-base text-foreground line-clamp-1 mt-0.5">{fav.titulo}</h3>
                      <p className="text-xs text-muted-foreground font-medium truncate">{fav.autor || "Autor Registrado"}</p>
                    </div>
                  </div>
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => eliminarFavorito(fav.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                    title="Eliminar de favoritos"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <Button size="xs" asChild className="w-full rounded-xl font-bold gap-1 shadow-2xs">
                  <Link href={`/libros/detalle/${fav.id}`}>
                    Solicitar o Ver Detalle <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

    </main>
  );
}

export default function PaginaFavoritos() {
  return (
    <LayoutDashboard
      titulo="Libros Guardados (Favoritos)"
      subtitulo="Colección de libros y obras que has apartado para lectura o préstamos futuros."
    >
      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs font-medium text-muted-foreground">
            Cargando tus libros guardados...
          </p>
        </div>
      }>
        <ContenidoFavoritos />
      </Suspense>
    </LayoutDashboard>
  );
}
