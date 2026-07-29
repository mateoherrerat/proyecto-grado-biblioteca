"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Mail,
  MapPin,
  Phone,
  Globe,
  Share2,
  AtSign,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PiePagina() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground border-t border-sidebar-border pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Columnas de Navegación del Pie de Página */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-sidebar-border">
          
          {/* Columna 1: Marca & Descripción */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-sidebar-foreground">
                LaBiblioteca
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Plataforma de consulta de disponibilidad y reserva de ejemplares físicos para la red de bibliotecas.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Button size="icon-sm" variant="ghost" className="rounded-full bg-sidebar-accent hover:bg-primary hover:text-primary-foreground text-muted-foreground h-8 w-8">
                <Globe className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon-sm" variant="ghost" className="rounded-full bg-sidebar-accent hover:bg-primary hover:text-primary-foreground text-muted-foreground h-8 w-8">
                <Share2 className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon-sm" variant="ghost" className="rounded-full bg-sidebar-accent hover:bg-primary hover:text-primary-foreground text-muted-foreground h-8 w-8">
                <AtSign className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon-sm" variant="ghost" className="rounded-full bg-sidebar-accent hover:bg-primary hover:text-primary-foreground text-muted-foreground h-8 w-8">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="font-serif font-bold text-sidebar-foreground mb-3 text-xs uppercase tracking-wider">Explorar</h4>
            <ul className="space-y-2 text-xs text-muted-foreground font-medium">
              <li><Link href="/libros" className="hover:text-primary transition-colors">Catálogo de Libros</Link></li>
              <li><Link href="/autores" className="hover:text-primary transition-colors">Autores Destacados</Link></li>
              <li><Link href="/sedes" className="hover:text-primary transition-colors">Sedes y Horarios</Link></li>
              <li><Link href="/publicaciones" className="hover:text-primary transition-colors">Noticias y Eventos</Link></li>
            </ul>
          </div>

          {/* Columna 3: Servicios */}
          <div>
            <h4 className="font-serif font-bold text-sidebar-foreground mb-3 text-xs uppercase tracking-wider">Servicios</h4>
            <ul className="space-y-2 text-xs text-muted-foreground font-medium">
              <li><Link href="/mis-prestamos" className="hover:text-primary transition-colors">Préstamos y Reservas</Link></li>
              <li><Link href="/mis-prestamos" className="hover:text-primary transition-colors">Renovación de Libro</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Acceso de Usuarios</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Portal Administrativo</Link></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="font-serif font-bold text-sidebar-foreground mb-3 text-xs uppercase tracking-wider">Contacto</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>Av. Las Vegas Cra #48 1-125, El Poblado, Medellín</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>+57 (604) 426-6460</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>contacto@inemjose.edu.co</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Barra de Boletín Compacta Abajo */}
        <div className="py-4 border-b border-sidebar-border flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="font-bold text-sidebar-foreground">Suscríbete al boletín:</span>
            <span className="text-muted-foreground hidden sm:inline text-[11px]">Recibe avisos de nuevos libros agregados al catálogo.</span>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Input
              type="email"
              placeholder="Tu correo de contacto..."
              className="h-8 text-xs bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground rounded-lg w-full md:w-56"
            />
            <Button size="xs" className="rounded-lg text-xs font-bold shrink-0 h-8 px-3">
              Suscribir
            </Button>
          </div>
        </div>

        {/* Derechos de Autor */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-muted-foreground gap-3">
          <p>© 2026 LaBiblioteca - Sistema de Consulta y Reserva de Libros. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary">Políticas de Privacidad</a>
            <a href="#" className="hover:text-primary">Términos de Servicio</a>
            <a href="#" className="hover:text-primary">Reglamento de Préstamos</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
