"use client";

import React from "react";
import { Building2, MapPin, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PaginaAdminSedes() {
  const sedes = [
    { id: "S-1", nombre: "Sede Principal INEM", ubicacion: "Edificio Central", capacidad: "12,450 libros", encargo: "Lic. María Fernández" },
    { id: "S-2", nombre: "Sede Norte", ubicacion: "Bloque Académico Norte", capacidad: "5,800 libros", encargo: "Lic. Ricardo Torres" },
    { id: "S-3", nombre: "Sede Centro", ubicacion: "Edificio Posgrados", capacidad: "8,900 libros", encargo: "Dra. Patricia Castro" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Gestión de Sedes</h1>
          <p className="text-xs text-muted-foreground">Administra las sedes físicas de la biblioteca institucional.</p>
        </div>
        <Button size="sm" className="rounded-full gap-2 font-semibold">
          <Plus className="h-4 w-4" /> Nueva Sede
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sedes.map((s) => (
          <Card key={s.id} className="shadow-xs hover:border-primary/40 transition-all p-6">
            <CardContent className="p-0">
              <div className="w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center mb-4">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground mb-1">{s.nombre}</h3>
              <p className="text-xs text-muted-foreground mb-4">{s.ubicacion}</p>
              <div className="pt-4 border-t border-border text-xs space-y-1.5">
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Capacidad:</span>
                  <span className="font-bold text-foreground">{s.capacidad}</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Encargado:</span>
                  <span className="font-bold text-foreground">{s.encargo}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
