"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAutenticacion } from "@/context/contexto-autenticacion";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Building2,
  CircleDollarSign,
  Newspaper,
  Settings,
  ExternalLink,
  LogOut,
  UserCheck,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { usuario, cerrarSesion } = useAutenticacion();

  const menuAdmin = [
    { title: "Resumen Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Gestión de Libros", url: "/admin/libros", icon: BookOpen },
    { title: "Gestión de Autores", url: "/admin/autores", icon: Users },
    { title: "Gestión de Sedes", url: "/admin/sedes", icon: Building2 },
    { title: "Préstamos y Multas", url: "/admin/multas", icon: CircleDollarSign },
    { title: "Noticias y Publicaciones", url: "/admin/publicaciones", icon: Newspaper },
    { title: "Configuración", url: "/admin/configuracion", icon: Settings },
  ];

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground" {...props}>
      {/* Header del Sidebar */}
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent">
              <Link href="/">
                <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-xs">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-serif font-bold text-base text-sidebar-foreground">BooksHub</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Panel Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Contenido / Navegación */}
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 mb-2">
            Navegación Principal
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1">
            <SidebarMenu>
              {menuAdmin.map((item) => {
                const Icono = item.icon;
                const estaActivo = item.url === "/admin" ? pathname === "/admin" : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      className={`h-10 rounded-xl px-3 transition-colors ${
                        estaActivo
                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <Icono className={`h-4 w-4 ${estaActivo ? "text-sidebar-primary-foreground" : "text-muted-foreground"}`} />
                        <span className="text-xs">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto pt-4 border-t border-sidebar-border">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-10 rounded-xl px-3 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent">
                  <Link href="/" className="flex items-center gap-3">
                    <ExternalLink className="h-4 w-4 text-sidebar-primary" />
                    <span className="text-xs font-semibold">Ver Landing Público</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer del Sidebar */}
      <SidebarFooter className="p-3 border-t border-sidebar-border bg-sidebar-accent/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Avatar className="h-8 w-8 border border-sidebar-border">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
                {usuario?.nombre?.substring(0, 2).toUpperCase() || "AD"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden text-xs">
              <span className="font-semibold text-sidebar-foreground truncate text-xs">
                {usuario?.nombre || "Administrador"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {usuario?.email || "admin@biblioteca.edu.co"}
              </span>
            </div>
          </div>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={cerrarSesion}
            title="Cerrar sesión"
            className="text-muted-foreground hover:text-destructive hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
