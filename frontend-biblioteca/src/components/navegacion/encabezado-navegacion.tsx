"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAutenticacion } from "@/context/contexto-autenticacion";
import {
  Search,
  Bookmark,
  LogOut,
  BookOpen,
  LayoutDashboard,
  Menu,
  X,
  User,
  Settings,
  ArrowRight,
  FileText,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { librosService, autoresService, publicacionesService } from "@/services/api";
import { coincideFuzzy } from "@/lib/fuzzy-search";
import { ImagenPortadaLibro } from "@/components/libros/imagen-portada-libro";

export function EncabezadoNavegacion() {
  const pathname = usePathname();
  const router = useRouter();
  const { usuario, rol, estaAutenticado, cerrarSesion } = useAutenticacion();
  const [busqueda, setBusqueda] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Estados para el Buscador En Vivo Global
  const [resultadosLibros, setResultadosLibros] = useState<any[]>([]);
  const [resultadosAutores, setResultadosAutores] = useState<any[]>([]);
  const [resultadosNovedades, setResultadosNovedades] = useState<any[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [popoverAbierto, setPopoverAbierto] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Detección de Scroll para Header Dinámico (Aparece suavemente al subir)
  const [headerVisible, setHeaderVisible] = useState(true);
  const [enTop, setEnTop] = useState(true);
  const ultimoScrollY = useRef(0);

  // Ocultar header público en rutas administrativas
  if (pathname.startsWith("/admin")) {
    return null;
  }

  // Cerrar popover de búsqueda al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setPopoverAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Manejo inteligente de Scroll
  useEffect(() => {
    function manejarScroll() {
      const scrollActual = window.scrollY;

      if (scrollActual <= 20) {
        setEnTop(true);
        setHeaderVisible(true);
      } else {
        setEnTop(false);
        if (scrollActual > ultimoScrollY.current + 10) {
          setHeaderVisible(false);
        } else if (scrollActual < ultimoScrollY.current - 5) {
          setHeaderVisible(true);
        }
      }

      ultimoScrollY.current = scrollActual;
    }

    window.addEventListener("scroll", manejarScroll, { passive: true });
    return () => window.removeEventListener("scroll", manejarScroll);
  }, []);

  // Búsqueda en vivo al escribir en la barra superior
  useEffect(() => {
    const term = busqueda.trim();
    if (term.length < 2) {
      setResultadosLibros([]);
      setResultadosAutores([]);
      setResultadosNovedades([]);
      setPopoverAbierto(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setBuscando(true);
        const [dataLibros, dataAutores, dataNovedades] = await Promise.all([
          librosService.getAll(term).catch(() => []),
          autoresService.getAll().catch(() => []),
          publicacionesService.getAll().catch(() => []),
        ]);

        const librosMatch = (dataLibros || []).slice(0, 4);
        const autoresMatch = (dataAutores || [])
          .filter((a: any) => coincideFuzzy(term, a.nombre || ""))
          .slice(0, 3);
        const novedadesMatch = (dataNovedades || [])
          .filter(
            (p: any) =>
              coincideFuzzy(term, p.descripcion || "") ||
              coincideFuzzy(term, p.autor_nombre || "")
          )
          .slice(0, 2);

        setResultadosLibros(librosMatch);
        setResultadosAutores(autoresMatch);
        setResultadosNovedades(novedadesMatch);
        setPopoverAbierto(true);
      } catch (err) {
        console.error("Error en búsqueda global:", err);
      } finally {
        setBuscando(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [busqueda]);

  const ejecutarBusquedaGeneral = (query: string) => {
    if (!query.trim()) return;
    setPopoverAbierto(false);
    router.push(`/libros?q=${encodeURIComponent(query.trim())}`);
  };

  const navLinks = [
    { label: "Inicio", href: "/" },
    { label: "Libros", href: "/libros" },
    { label: "Autores", href: "/autores" },
    { label: "Sedes", href: "/sedes" },
    { label: "Novedades", href: "/publicaciones" },
  ];

  // Inicial del avatar de usuario
  const inicialUsuario = (usuario?.nombre || usuario?.email || "U").charAt(0).toUpperCase();

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        headerVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      } ${
        enTop
          ? "bg-background border-b border-border/60 shadow-2xs"
          : "bg-background/90 backdrop-blur-xl border-b border-border/80 shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* ZONA 1: LOGO DE LA MARCA */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-serif text-xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors leading-none">
              LaBiblioteca
            </span>
          </Link>

          {/* ZONA 2: MENÚ DE NAVEGACIÓN PRINCIPAL */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const activo =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activo
                      ? "bg-primary/10 text-primary font-extrabold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ZONA 3: BUSCADOR GLOBAL + PERFIL SHADCN DESPLEGABLE */}
          <div className="flex items-center gap-3">
            
            {/* Buscador Consistente */}
            <div className="relative w-40 sm:w-52 lg:w-64" ref={searchRef}>
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar en catálogo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onFocus={() => {
                  if (busqueda.trim().length >= 2) setPopoverAbierto(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    ejecutarBusquedaGeneral(busqueda);
                  }
                }}
                className="pl-8 pr-7 h-8 text-xs rounded-full bg-muted/40 border-border/60 focus:bg-background focus:ring-1 focus:ring-primary/40 transition-all"
              />

              {busqueda && (
                <button
                  onClick={() => {
                    setBusqueda("");
                    setPopoverAbierto(false);
                  }}
                  className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Popover Desplegable de Resultados */}
              {popoverAbierto && (
                <div className="absolute top-10 right-0 md:left-0 w-80 sm:w-96 bg-card border border-border/80 rounded-2xl shadow-xl p-3 z-50 text-xs space-y-3 backdrop-blur-xl">
                  
                  {buscando ? (
                    <div className="p-4 text-center text-muted-foreground text-xs font-medium">
                      Buscando coincidencias en la base de datos...
                    </div>
                  ) : (
                    <>
                      {/* Libros */}
                      {resultadosLibros.length > 0 && (
                        <div>
                          <span className="text-[10px] uppercase font-extrabold text-primary tracking-wider px-2 block mb-2 flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5" /> Libros BD ({resultadosLibros.length})
                          </span>
                          <div className="space-y-1.5">
                            {resultadosLibros.map((l) => (
                              <Link
                                key={l.id_libro}
                                href={`/libros/${l.slug || l.id_libro}`}
                                onClick={() => setPopoverAbierto(false)}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/80 transition-colors group"
                              >
                                <div className="w-8 h-10 rounded overflow-hidden bg-muted border border-border/40 shrink-0">
                                  <ImagenPortadaLibro
                                    libro={l}
                                    alt={l.titulo}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 truncate">
                                  <p className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                    {l.titulo}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground truncate">
                                    {l.autor || "Autor Desconocido"} • {l.categoria || "General"}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Autores */}
                      {resultadosAutores.length > 0 && (
                        <div className="pt-2 border-t border-border/60">
                          <span className="text-[10px] uppercase font-extrabold text-primary tracking-wider px-2 block mb-1.5 flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" /> Autores ({resultadosAutores.length})
                          </span>
                          <div className="space-y-1">
                            {resultadosAutores.map((a) => (
                              <Link
                                key={a.id_autor}
                                href={`/libros?q=${encodeURIComponent(a.nombre)}`}
                                onClick={() => setPopoverAbierto(false)}
                                className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/80 transition-colors"
                              >
                                <span className="font-bold text-foreground truncate">{a.nombre}</span>
                                <span className="text-[10px] text-primary font-bold">Ver catálogo ➔</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Novedades */}
                      {resultadosNovedades.length > 0 && (
                        <div className="pt-2 border-t border-border/60">
                          <span className="text-[10px] uppercase font-extrabold text-primary tracking-wider px-2 block mb-1.5 flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" /> Novedades BD ({resultadosNovedades.length})
                          </span>
                          <div className="space-y-1">
                            {resultadosNovedades.map((n) => (
                              <Link
                                key={n.id_novedad}
                                href="/publicaciones"
                                onClick={() => setPopoverAbierto(false)}
                                className="block p-2 rounded-xl hover:bg-muted/80 transition-colors"
                              >
                                <p className="font-semibold text-foreground line-clamp-1">{n.descripcion}</p>
                                <p className="text-[10px] text-muted-foreground">Por: {n.autor_nombre}</p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {resultadosLibros.length === 0 &&
                        resultadosAutores.length === 0 &&
                        resultadosNovedades.length === 0 && (
                          <div className="p-4 text-center text-muted-foreground text-xs font-medium">
                            No se encontraron coincidencias para "{busqueda}".
                          </div>
                        )}

                      {/* Pie del Popover */}
                      <button
                        onClick={() => ejecutarBusquedaGeneral(busqueda)}
                        className="w-full text-center py-2 bg-primary text-primary-foreground font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        Ver resultados en catálogo <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}

                </div>
              )}
            </div>

            {/* ZONA DE CUENTA DE USUARIO CON DROPDOWN DE SHADCN */}
            {estaAutenticado ? (
              <div className="flex items-center gap-2">
                
                {/* Botón Panel Admin (Solo visible para Administradores) */}
                {rol === "administrador" && (
                  <Button size="xs" variant="outline" className="rounded-full gap-1.5 text-xs font-bold h-8 px-3.5 border-primary/30 bg-primary/5 hover:bg-primary/15 text-primary transition-all shadow-2xs" asChild>
                    <Link href="/admin">
                      <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
                      <span className="hidden sm:inline">Panel Admin</span>
                    </Link>
                  </Button>
                )}

                {/* Avatar Interactivo con Dropdown Menu Shadcn Perfeccionado */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      title="Cuenta de usuario"
                      className="w-8.5 h-8.5 rounded-full bg-primary text-primary-foreground font-extrabold text-xs flex items-center justify-center shadow-xs hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                    >
                      {inicialUsuario}
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" sideOffset={14} className="w-64 p-2.5 rounded-2xl shadow-2xl border border-border/80 bg-card/95 backdrop-blur-xl z-[100]">
                    {/* Cabecera del Usuario */}
                    <div className="px-3 py-2 flex items-center gap-3 border-b border-border/60 mb-1.5 bg-muted/30 rounded-xl">
                      <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-sm shrink-0 shadow-2xs">
                        {inicialUsuario}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-xs font-extrabold text-foreground truncate">
                          {usuario?.nombre || "Usuario Lector"}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate font-medium">
                          {usuario?.email}
                        </span>
                        <span className="text-[9px] font-black text-primary uppercase tracking-wider mt-0.5">
                          {rol}
                        </span>
                      </div>
                    </div>

                    {/* Opciones Claras del Menú */}
                    <DropdownMenuItem asChild>
                      <Link href="/mis-prestamos" className="flex items-center gap-2.5 font-bold py-2 px-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                        <Bookmark className="h-4 w-4 text-primary" />
                        Mis Préstamos & Reservas
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/mis-prestamos?tab=favoritos" className="flex items-center gap-2.5 font-bold py-2 px-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                        <BookOpen className="h-4 w-4 text-amber-500" />
                        Libros Guardados (Favoritos)
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/configuracion" className="flex items-center gap-2.5 font-bold py-2 px-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        Configuración de Cuenta
                      </Link>
                    </DropdownMenuItem>

                    {rol === "administrador" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2.5 font-bold py-2 px-2.5 rounded-xl hover:bg-primary/10 text-primary transition-colors cursor-pointer">
                          <LayoutDashboard className="h-4 w-4 text-primary" />
                          Panel Administrativo
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator className="my-1 border-border/60" />

                    <DropdownMenuItem
                      onClick={cerrarSesion}
                      className="flex items-center gap-2.5 text-destructive font-bold py-2 px-2.5 rounded-xl hover:bg-destructive/10 cursor-pointer transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              </div>
            ) : (
              /* Botones de Iniciar Sesión / Registro */
              <div className="flex items-center gap-1.5">
                <Button size="xs" variant="ghost" asChild className="text-xs font-bold h-8 px-3">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button size="xs" asChild className="rounded-full text-xs font-bold h-8 px-3 shadow-2xs">
                  <Link href="/registro">Registrarse</Link>
                </Button>
              </div>
            )}

            {/* Menú Móvil Botón */}
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="md:hidden rounded-xl h-8 w-8"
            >
              {menuAbierto ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

          </div>

        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {menuAbierto && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1 text-xs font-bold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuAbierto(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-muted text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {estaAutenticado ? (
              <div className="pt-3 border-t border-border/60 space-y-2">
                <div className="px-3 py-1 flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-xs">{usuario?.nombre || usuario?.email}</p>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider">{rol}</p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs">
                    {inicialUsuario}
                  </div>
                </div>
                <Link
                  href="/mis-prestamos"
                  onClick={() => setMenuAbierto(false)}
                  className="block px-3 py-2.5 rounded-xl bg-muted font-bold"
                >
                  Mis Préstamos & Reservas
                </Link>
                {rol === "administrador" && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuAbierto(false)}
                    className="block px-3 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-center"
                  >
                    Dashboard Administrativo
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMenuAbierto(false);
                    cerrarSesion();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 font-bold"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-border/60 flex flex-col gap-2">
                <Button size="sm" variant="outline" asChild className="w-full rounded-xl">
                  <Link href="/login" onClick={() => setMenuAbierto(false)}>Iniciar Sesión</Link>
                </Button>
                <Button size="sm" asChild className="w-full rounded-xl">
                  <Link href="/registro" onClick={() => setMenuAbierto(false)}>Registrarse</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
