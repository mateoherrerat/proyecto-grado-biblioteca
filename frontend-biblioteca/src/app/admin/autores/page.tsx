"use client";

import React, { useState } from "react";
import { Users, Plus, Trash2, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function PaginaAdminAutores() {
  const [autores, setAutores] = useState([
    { id: "AUT-01", nombre: "Dr. Joseph Murphy", nacionalidad: "Irlandés", librosRegistrados: 14 },
    { id: "AUT-02", nombre: "Hermann Hesse", nacionalidad: "Alemán", librosRegistrados: 22 },
    { id: "AUT-03", nombre: "James Clear", nacionalidad: "Estadounidense", librosRegistrados: 8 },
    { id: "AUT-04", nombre: "Nora Roberts", nacionalidad: "Estadounidense", librosRegistrados: 30 },
  ]);

  const [modal, setModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");

  const handleAgregar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre) return;
    setAutores([
      ...autores,
      { id: `AUT-0${autores.length + 1}`, nombre, nacionalidad: nacionalidad || "Internacional", librosRegistrados: 0 },
    ]);
    setNombre("");
    setNacionalidad("");
    setModal(false);
  };

  const handleEliminar = (id: string) => {
    setAutores(autores.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Gestión de Autores</h1>
          <p className="text-xs text-muted-foreground">Registra y edita la información de autores en el catálogo.</p>
        </div>
        <Button size="sm" onClick={() => setModal(true)} className="rounded-full gap-2 font-semibold">
          <Plus className="h-4 w-4" /> Agregar Autor
        </Button>
      </div>

      <Card className="shadow-xs">
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre del Autor</TableHead>
                <TableHead>Nacionalidad</TableHead>
                <TableHead>Libros Vinculados</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {autores.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono font-bold text-xs">{a.id}</TableCell>
                  <TableCell className="font-semibold text-foreground">{a.nombre}</TableCell>
                  <TableCell>{a.nacionalidad}</TableCell>
                  <TableCell>
                    <Badge variant="amber" className="font-bold">
                      {a.librosRegistrados} Libros
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => handleEliminar(a.id)}
                      className="rounded-lg text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Agregar Autor con Base UI Dialog */}
      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleAgregar}>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Autor</DialogTitle>
              <DialogDescription>
                Completa la información del autor para asociar sus obras literarias.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  placeholder="Ej. Mario Vargas Llosa"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="h-10 text-xs"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nacionalidad">Nacionalidad</Label>
                <Input
                  id="nacionalidad"
                  placeholder="Ej. Peruano"
                  value={nacionalidad}
                  onChange={(e) => setNacionalidad(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" type="button" onClick={() => setModal(false)}>
                Cancelar
              </Button>
              <Button size="sm" type="submit">
                Guardar Autor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
