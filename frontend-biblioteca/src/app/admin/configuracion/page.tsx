"use client";

import React, { useState } from "react";
import { Settings, CheckCircle2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PaginaAdminConfiguracion() {
  const [diasMaximos, setDiasMaximos] = useState(14);
  const [tarifaMora, setTarifaMora] = useState(3000);
  const [limiteLibros, setLimiteLibros] = useState(3);
  const [guardado, setGuardado] = useState(false);

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-6">
        <h1 className="font-serif text-3xl font-bold text-foreground">Configuración del Sistema</h1>
        <p className="text-xs text-muted-foreground">Parámetros de préstamo, reglas de mora y límites por estudiante.</p>
      </div>

      <Card className="shadow-xs max-w-2xl">
        <CardHeader>
          <CardTitle>Reglas Globales de Préstamo</CardTitle>
          <CardDescription>Ajusta las políticas y montos de mora de la biblioteca.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGuardar} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="diasMaximos">Días Máximos de Préstamo Regular</Label>
              <Input
                id="diasMaximos"
                type="number"
                value={diasMaximos}
                onChange={(e) => setDiasMaximos(Number(e.target.value))}
                className="h-10 text-xs"
              />
              <p className="text-[11px] text-muted-foreground">Plazo por defecto en días calendario antes de marcar mora.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tarifaMora">Tarifa Diaria de Mora ($ COP / Día)</Label>
              <Input
                id="tarifaMora"
                type="number"
                value={tarifaMora}
                onChange={(e) => setTarifaMora(Number(e.target.value))}
                className="h-10 text-xs"
              />
              <p className="text-[11px] text-muted-foreground">Valor generado por día de retraso en la devolución.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="limiteLibros">Límite Máximo de Libros Simultáneos por Lector</Label>
              <Input
                id="limiteLibros"
                type="number"
                value={limiteLibros}
                onChange={(e) => setLimiteLibros(Number(e.target.value))}
                className="h-10 text-xs"
              />
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <Button type="submit" size="sm" className="gap-2 font-semibold">
                <Save className="h-4 w-4" /> Guardar Configuración
              </Button>

              {guardado && (
                <Badge variant="emerald" className="gap-1 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Parámetros actualizados
                </Badge>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
