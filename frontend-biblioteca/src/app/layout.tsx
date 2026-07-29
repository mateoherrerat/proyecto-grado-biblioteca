import React from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ProveedorAutenticacion } from "@/context/contexto-autenticacion";
import { TooltipProvider } from "@/components/ui/tooltip";

const fontInter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fontPlayfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "LaBiblioteca - Consulta y Reserva de Ejemplares Físicos",
  description: "Plataforma de consulta de catálogo de libros, préstamos y reserva de ejemplares físicos en red de bibliotecas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fontInter.variable} ${fontPlayfair.variable}`}>
      <body className="bg-background text-foreground antialiased selection:bg-accent selection:text-accent-foreground min-h-screen flex flex-col font-sans">
        <ProveedorAutenticacion>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ProveedorAutenticacion>
      </body>
    </html>
  );
}
