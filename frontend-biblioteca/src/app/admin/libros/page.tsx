"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Search, Trash2, Pencil, Loader2, Image as ImageIcon } from "lucide-react";
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
import { librosService } from "@/services/api";

import { ImagenPortadaLibro } from "@/components/libros/imagen-portada-libro";

export default function PaginaAdminLibros() {
  const [busqueda, setBusqueda] = useState("");
  const [libros, setLibros] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Campos del formulario
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevoIsbn, setNuevoIsbn] = useState("");
  const [nuevaEditorial, setNuevaEditorial] = useState("");
  const [nuevaSinopsis, setNuevaSinopsis] = useState("");
  const [nuevaPortada, setNuevaPortada] = useState("");

  const cargarLibros = async () => {
    try {
      setCargando(true);
      const data = await librosService.getAll();
      setLibros(data || []);
    } catch (err) {
      console.error("Error al obtener libros en admin:", err);
    } finally {
      setCargando(false);
    }

  };

  useEffect(() => {
    cargarLibros();
  }, []);

  const handleAgregar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTitulo) return;

    try {
      setGuardando(true);
      await librosService.create({
        titulo: nuevoTitulo,
        isbn: nuevoIsbn || null,
        editorial: nuevaEditorial || null,
        sinopsis: nuevaSinopsis || null,
        portada: nuevaPortada || null,
      });

      // Limpiar formulario y recargar
      setNuevoTitulo("");
      setNuevoIsbn("");
      setNuevaEditorial("");
      setNuevaSinopsis("");
      setNuevaPortada("");
      setModalAbierto(false);
      await cargarLibros();
    } catch (err: any) {
      alert("Error al registrar libro: " + (err.message || "Ocurrió un error"));
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id: number | string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este libro?")) return;
    try {
      await librosService.delete(id);
      await cargarLibros();
    } catch (err: any) {
      alert("Error al eliminar libro: " + (err.message || "Ocurrió un error"));
    }
  };

  const librosFiltrados = libros.filter((l) => {
    const titulo = l.titulo || "";
    const autor = l.autor || "";
    const isbn = l.isbn || "";
    const editorial = l.editorial || "";
    const term = busqueda.toLowerCase();

    return (
      titulo.toLowerCase().includes(term) ||
      autor.toLowerCase().includes(term) ||
      isbn.toLowerCase().includes(term) ||
      editorial.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Gestión del Inventario de Libros
          </h1>
          <p className="text-xs text-muted-foreground">
            Administra los títulos ({libros.length} registrados), ISBNs, editoriales y portadas del catálogo.
          </p>
        </div>

        <Button size="sm" onClick={() => setModalAbierto(true)} className="rounded-full gap-2 font-semibold">
          <Plus className="h-4 w-4" /> Agregar Nuevo Libro
        </Button>
      </div>

      {/* Buscador & Tabla */}
      <Card className="shadow-xs">
        <CardContent className="p-5 space-y-4">
          <div className="relative max-w-md">
            <Search className="h-4 w-4 absolute left-3.5 top-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por título, autor, ISBN o editorial..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9 h-10 text-xs rounded-xl"
            />
          </div>

          {cargando ? (
            <div className="flex items-center justify-center py-12 gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Cargando catálogo de la base de datos...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Portada</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Título del Libro</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Editorial</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {librosFiltrados.slice(0, 50).map((l) => (
                  <TableRow key={l.id_libro || l.id}>
                    <TableCell>
                      <div className="h-10 w-8 rounded overflow-hidden bg-muted border border-border shrink-0">
                        <ImagenPortadaLibro
                          libro={l}
                          alt={l.titulo}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-mono font-bold text-xs">LIB-{l.id_libro}</TableCell>
                    <TableCell className="font-semibold text-foreground max-w-xs truncate">{l.titulo}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{l.autor || "Autor Desconocido"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {l.categoria || "General"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{l.isbn || "N/A"}</TableCell>
                    <TableCell className="text-xs">{l.editorial || "N/A"}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => handleEliminar(l.id_libro || l.id)}
                        className="rounded-lg text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal Agregar Libro con Base UI Dialog */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleAgregar}>
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Libro</DialogTitle>
              <DialogDescription>
                Ingresa los datos del libro e imagen de portada para incorporarlo al catálogo general.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título del Libro *</Label>
                <Input
                  id="titulo"
                  placeholder="Ej. Cien Años de Soledad"
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  className="h-10 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    placeholder="Ej. 978-8420471839"
                    value={nuevoIsbn}
                    onChange={(e) => setNuevoIsbn(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editorial">Editorial</Label>
                  <Input
                    id="editorial"
                    placeholder="Ej. Alfaguara"
                    value={nuevaEditorial}
                    onChange={(e) => setNuevaEditorial(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="portada">URL Imagen de Portada</Label>
                <div className="relative">
                  <ImageIcon className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="portada"
                    placeholder="https://images.unsplash.com/... o dejar vacío para auto-obtener por ISBN"
                    value={nuevaPortada}
                    onChange={(e) => setNuevaPortada(e.target.value)}
                    className="pl-9 h-10 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sinopsis">Sinopsis</Label>
                <textarea
                  id="sinopsis"
                  rows={3}
                  placeholder="Resumen o sinopsis del libro..."
                  value={nuevaSinopsis}
                  onChange={(e) => setNuevaSinopsis(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" type="button" onClick={() => setModalAbierto(false)}>
                Cancelar
              </Button>
              <Button size="sm" type="submit" disabled={guardando}>
                {guardando ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Guardando...
                  </>
                ) : (
                  "Guardar Libro"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
