import React, { Suspense } from "react";
import Link from "next/link";
import { SignupForm } from "@/components/signup-form";
import { ArrowLeft, Loader2 } from "lucide-react";

export const metadata = {
  title: "Crear Cuenta - LaBiblioteca",
  description: "Regístrate como lector de LaBiblioteca para reservar libros físicos en nuestra red de bibliotecas.",
};

export default function PaginaRegistro() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
      
      {/* Botón flotante para regresar al inicio */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-card border border-border/80 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all shadow-2xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al inicio
        </Link>
      </div>

      {/* Resplandores decorativos de fondo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      {/* Tarjeta de Formulario Centrada */}
      <div className="w-full max-w-sm sm:max-w-md bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-xl relative z-10">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-xs font-medium text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span>Cargando formulario...</span>
          </div>
        }>
          <SignupForm />
        </Suspense>
      </div>

      <p className="mt-6 text-[11px] text-muted-foreground text-center relative z-10 font-medium">
        © 2026 LaBiblioteca · Av. Las Vegas Cra #48 1-125, El Poblado, Medellín
      </p>

    </div>
  );
}
