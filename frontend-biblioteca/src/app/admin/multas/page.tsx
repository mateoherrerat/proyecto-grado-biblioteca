"use client";

import React, { useState } from "react";
import { CircleDollarSign, CheckCircle2, AlertCircle, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function PaginaAdminMultas() {
  const [prestamos, setPrestamos] = useState([
    { id: "PR-201", estudiante: "Mateo Herrera", libro: "Thoughts to Inspire", diasMora: 4, multaCalculada: "$12,000 COP", estado: "Mora Pendiente" },
    { id: "PR-202", estudiante: "Sofía Ramírez", libro: "Believe in Yourself", diasMora: 0, multaCalculada: "$0 COP", estado: "Al Día" },
    { id: "PR-203", estudiante: "Carlos Mendoza", libro: "Siddhartha", diasMora: 2, multaCalculada: "$6,000 COP", estado: "Mora Pendiente" },
  ]);

  const handleCondonar = (id: string) => {
    setPrestamos(
      prestamos.map((p) => (p.id === id ? { ...p, estado: "Pagada / Condonada", multaCalculada: "$0 COP" } : p))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Préstamos Vencidos y Control de Multas</h1>
          <p className="text-xs text-muted-foreground">Gestiona las penalizaciones automáticas por entregas fuera de término.</p>
        </div>
      </div>

      <Card className="shadow-xs">
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Préstamo</TableHead>
                <TableHead>Estudiante / Lector</TableHead>
                <TableHead>Libro</TableHead>
                <TableHead>Días de Mora</TableHead>
                <TableHead>Multa Generada</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prestamos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono font-bold text-xs">{p.id}</TableCell>
                  <TableCell className="font-semibold text-foreground">{p.estudiante}</TableCell>
                  <TableCell>{p.libro}</TableCell>
                  <TableCell className="font-bold">{p.diasMora} días</TableCell>
                  <TableCell className="font-serif font-bold text-primary">{p.multaCalculada}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.estado === "Al Día"
                          ? "emerald"
                          : p.estado === "Mora Pendiente"
                          ? "destructive"
                          : "outline"
                      }
                      className="font-bold"
                    >
                      {p.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {p.estado === "Mora Pendiente" && (
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handleCondonar(p.id)}
                        className="rounded-lg font-semibold"
                      >
                        Registrar Pago
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
