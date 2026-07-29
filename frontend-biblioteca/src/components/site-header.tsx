"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PanelLeft, Search, Bell } from "lucide-react";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  // Formatear el nombre del módulo actual
  const obtenerNombreModulo = (path: string) => {
    if (path === "/admin") return "Resumen General";
    if (path.includes("/libros")) return "Inventario de Libros";
    if (path.includes("/autores")) return "Gestión de Autores";
    if (path.includes("/sedes")) return "Sedes y Ubicaciones";
    if (path.includes("/multas")) return "Préstamos y Multas";
    if (path.includes("/publicaciones")) return "Avisos y Noticias";
    if (path.includes("/configuracion")) return "Configuración";
    return "Administración";
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center border-b border-border bg-background/95 backdrop-blur-md px-4 sm:px-6">
      <div className="flex w-full items-center justify-between gap-4">
        
        {/* Toggle Sidebar & Breadcrumb */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-9 w-9 rounded-xl text-foreground"
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
          
          <Separator orientation="vertical" className="h-4" />
          
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin" className="text-muted-foreground hover:text-primary">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold text-foreground">
                  {obtenerNombreModulo(pathname)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Buscador Rápido y Notificaciones */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block w-48 lg:w-64">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar en panel..."
              className="pl-9 h-9 text-xs rounded-full bg-card"
            />
          </div>

          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground">
            <Bell className="h-4 w-4" />
          </Button>
        </div>

      </div>
    </header>
  );
}
