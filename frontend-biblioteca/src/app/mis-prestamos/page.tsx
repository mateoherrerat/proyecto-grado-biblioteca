"use client";

import React, { useState, useEffect, Suspense } from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LayoutDashboard } from "@/components/layout/layout-dashboard";
import { useAutenticacion } from "@/context/contexto-autenticacion";
import { EstadoVacio } from "@/components/ui/estado-vacio";
import { Loader2 } from "lucide-react";
import {
  Bookmark,
  Clock,
  CheckCircle2,
  BookOpen,
  IdCard,
  Trash2,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ... Keep existing logic inside ContenidoMisPrestamos ...
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { prestamosService } from "@/services/api";

function ContenidoMisPrestamos() {

  const searchParams = useSearchParams();
  const { usuario, estaAutenticado } = useAutenticacion();
  
  const [tabActiva, setTabActiva] = useState<"prestamos" | "favoritos">("prestamos");
  const [prestamos, setPrestamos] = useState<any[]>([]);
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [notificacionExito, setNotificacionExito] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "favoritos") {
      setTabActiva("favoritos");
    }

    if (searchParams.get("solicitudExito") === "true") {
      setNotificacionExito(true);
      const timer = setTimeout(() => setNotificacionExito(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);


  // Cargar préstamos y favoritos almacenados
  useEffect(() => {
    cargarDatos();
  }, [estaAutenticado]);

  const cargarDatos = async () => {
    try {
      let prestamosBackend: any[] = [];
      if (usuario?.id) {
        try {
          const resp = await prestamosService.getByUsuario(usuario.id);
          if (Array.isArray(resp) && resp.length > 0) {
            prestamosBackend = resp.map((p: any) => ({
              id: p.id_prestamo,
              id_libro: p.id_libro,
              titulo: p.libro_titulo || "Libro",
              autor: p.usuario_nombre || "Autor Registrado",
              sede: p.sede || "Biblioteca Central",
              estado: p.estado || "En curso",
              fechaSolicitud: p.fecha_prestamo ? new Date(p.fecha_prestamo).toLocaleDateString("es-CO") : "Reciente",
              fechaLimite: p.fecha_devolucion ? new Date(p.fecha_devolucion).toLocaleDateString("es-CO") : "Próximamente",
            }));
          }
        } catch (e) {
          console.warn("Backend prestamos fallback:", e);
        }
      }

      const pLocal = JSON.parse(localStorage.getItem("bookshub_prestamos_usuario") || "[]");
      const f = JSON.parse(localStorage.getItem("bookshub_favoritos") || "[]");
      
      const prestamosCombinados = [...pLocal, ...prestamosBackend];

      if (prestamosCombinados.length === 0 && estaAutenticado) {
        const prestamosIniciales = [
          {
            id: "pres-101",
            id_libro: "5",
            titulo: "El principito",
            autor: "Antoine de Saint-Exupéry",
            sede: "Biblioteca Norte",
            estado: "En curso",
            fechaSolicitud: "12 de Julio, 2026",
            fechaLimite: "26 de Julio, 2026",
          },
          {
            id: "pres-102",
            id_libro: "1",
            titulo: "1984",
            autor: "George Orwell",
            sede: "Biblioteca Central",
            estado: "Pendiente de retiro",
            fechaSolicitud: "20 de Julio, 2026",
            fechaLimite: "27 de Julio, 2026",
          },
        ];
        setPrestamos(prestamosIniciales);
      } else {
        setPrestamos(prestamosCombinados);
      }

      setFavoritos(f);
    } catch {
      setPrestamos([]);
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

  const cancelarPrestamo = (id: string) => {
    try {
      const nuevos = prestamos.filter((p) => String(p.id) !== String(id));
      localStorage.setItem("bookshub_prestamos_usuario", JSON.stringify(nuevos));
      setPrestamos(nuevos);
    } catch (e) {
      console.error(e);
    }
  };

  if (!estaAutenticado) {
    return (
      <main className="flex-1 max-w-7xl mx-auto px-4 py-16 w-full flex items-center justify-center">
        <EstadoVacio
          tipo="general"
          titulo="Inicia sesión para ver tus préstamos"
          descripcion="Debes estar registrado como lector para consultar el historial de libros solicitados, reservas activas y tus libros guardados."
          enlaceBoton="/login"
          textoBoton="Iniciar Sesión"
        />
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Banner de Notificación de Solicitud Exitosa */}
        {notificacionExito && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-between shadow-2xs animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-extrabold text-sm">¡Solicitud de préstamo registrada con éxito!</p>
                <p className="text-xs opacity-90">Tu libro ha sido apartado. Puedes acercarte a retirarlo en el punto asignado.</p>
              </div>
            </div>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => setNotificacionExito(false)}
              className="text-xs font-bold hover:bg-emerald-500/20"
            >
              Entendido
            </Button>
          </div>
        )}

        {/* Cabecera Tarjeta Perfil & Panel de Control del Lector */}
        <Card className="mb-8 overflow-hidden border-border/80 shadow-md">
          <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-card via-card to-primary/5">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-md">
                <AvatarFallback className="bg-primary text-primary-foreground font-serif font-extrabold text-2xl">
                  {usuario?.nombre?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl font-extrabold text-foreground">{usuario?.nombre}</h1>
                  <Badge variant="emerald" className="font-bold text-[10px]">
                    Lector Activo
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">{usuario?.email}</p>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1.5 font-mono">
                  <span className="flex items-center gap-1 font-bold">
                    <IdCard className="h-3.5 w-3.5 text-primary" />
                    {usuario?.codigoBiblioteca || "BIB-2026-352"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
              <div className="bg-background/80 backdrop-blur-md p-3.5 rounded-2xl text-center border border-border/80 shadow-2xs">
                <span className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Solicitudes</span>
                <span className="font-serif font-extrabold text-xl text-primary">{prestamos.length}</span>
              </div>
              <div className="bg-background/80 backdrop-blur-md p-3.5 rounded-2xl text-center border border-border/80 shadow-2xs">
                <span className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Guardados</span>
                <span className="font-serif font-extrabold text-xl text-amber-600">{favoritos.length}</span>
              </div>
              <div className="bg-background/80 backdrop-blur-md p-3.5 rounded-2xl text-center border border-border/80 shadow-2xs">
                <span className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Multas</span>
                <span className="font-serif font-extrabold text-xl text-emerald-600">$0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Encabezado de Sección */}
        <div className="flex items-center justify-between border-b border-border/60 mb-6 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-xl font-extrabold text-foreground">
              Mis Préstamos & Reservas ({prestamos.length})
            </h2>
          </div>
          <Button variant="outline" size="xs" asChild className="rounded-xl font-bold gap-1.5 shadow-2xs">
            <Link href="/favoritos">
              <Bookmark className="h-3.5 w-3.5 text-amber-500" /> Ver Libros Guardados ({favoritos.length})
            </Link>
          </Button>
        </div>

        {/* CONTENIDO: PRÉSTAMOS Y RESERVAS */}
        <div className="space-y-4">
          {prestamos.length === 0 ? (
            <EstadoVacio
              tipo="busqueda"
              titulo="No tienes préstamos ni reservas activas"
              descripcion="Explora el catálogo general para consultar ejemplares disponibles en nuestras sedes y realizar solicitudes de retiro."
              enlaceBoton="/libros"
              textoBoton="Explorar Catálogo de Libros"
            />
          ) : (
            prestamos.map((pres) => (
              <Card
                key={pres.id}
                className="hover:border-primary/40 transition-all shadow-xs border-border/80"
              >
                <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-12 h-14 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold shrink-0">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-serif font-extrabold text-base text-foreground">{pres.titulo}</h3>
                      <p className="text-xs text-muted-foreground font-medium">por {pres.autor || "Autor Registrado"}</p>
                      <span className="text-[11px] text-primary font-bold block mt-1">
                        📍 Sede de Retiro: {pres.sede || "Biblioteca Central"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-border/60">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-extrabold text-muted-foreground block">Fecha Límite</span>
                      <span className="text-xs font-extrabold text-foreground">{pres.fechaLimite}</span>
                    </div>

                    <Badge
                      variant={pres.estado === "Pendiente de retiro" ? "amber" : "emerald"}
                      className="font-bold text-[10px] px-3 py-1"
                    >
                      {pres.estado}
                    </Badge>

                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => cancelarPrestamo(pres.id)}
                      className="text-xs font-bold text-destructive hover:bg-destructive/10 rounded-xl"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

      </main>
  );
}

export default function PaginaMisPrestamos() {
  return (
    <LayoutDashboard
      titulo="Mi Panel de Préstamos"
      subtitulo="Administra tus solicitudes activas, reservas en biblioteca y libros guardados."
    >
      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs font-medium text-muted-foreground">
            Cargando préstamos y libros guardados...
          </p>
        </div>
      }>
        <ContenidoMisPrestamos />
      </Suspense>
    </LayoutDashboard>
  );
}

