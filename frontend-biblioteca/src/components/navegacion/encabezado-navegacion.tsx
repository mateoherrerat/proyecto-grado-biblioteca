"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAutenticacion } from "@/context/contexto-autenticacion";
import {
  Bookmark,
  LogOut,
  BookOpen,
  LayoutDashboard,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function EncabezadoNavegacion() {
  const pathname = usePathname();
  const { usuario, rol, estaAutenticado, cerrarSesion } = useAutenticacion();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Ocultar header público en rutas administrativas
  if (pathname.startsWith("/admin")) {
    return null;
  }

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
    <header className="sticky top-0 z-[100] bg-background/95 backdrop-blur-md border-b border-border/80 shadow-xs">
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
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

          {/* ZONA 3: PERFIL Y AUTENTICACIÓN */}
          <div className="flex items-center gap-3">
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

                {/* Avatar Interactivo con Dropdown Menu Shadcn */}
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
                      <Link href="/favoritos" className="flex items-center gap-2.5 font-bold py-2 px-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
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
                <Link
                  href="/favoritos"
                  onClick={() => setMenuAbierto(false)}
                  className="block px-3 py-2.5 rounded-xl hover:bg-muted font-bold"
                >
                  Libros Guardados (Favoritos)
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
