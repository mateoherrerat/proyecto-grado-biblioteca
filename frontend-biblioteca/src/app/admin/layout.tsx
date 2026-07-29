import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Dashboard Administrativo - BooksHub",
  description: "Panel de control y gestión de libros, préstamos, autores y sedes de la biblioteca escolar",
};

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        {/* Componente Sidebar Nativo de Shadcn UI */}
        <AppSidebar />

        {/* SidebarInset Contenedor Nativo de Shadcn UI */}
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          <SiteHeader />
          <main className="p-6 sm:p-8 lg:p-10 flex-1 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
