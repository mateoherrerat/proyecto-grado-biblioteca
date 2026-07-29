"use client";

import React, { useState } from "react";
import { Newspaper, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function PaginaAdminPublicaciones() {
  const [noticias, setNoticias] = useState([
    { id: 1, titulo: "Nuevas adquisiciones literarias segundo semestre 2026", fecha: "18 Jul 2026", categoria: "Novedades" },
    { id: 2, titulo: "Taller interactivo de técnicas de lectura veloz", fecha: "12 Jul 2026", categoria: "Eventos" },
  ]);

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("Novedades");

  const handlePublicar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo) return;
    setNoticias([
      { id: Date.now(), titulo, fecha: "Hoy", categoria },
      ...noticias,
    ]);
    setTitulo("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Gestión de Publicaciones y Avisos</h1>
          <p className="text-xs text-muted-foreground">Publica comunicados para la comunidad estudiantil y lectores.</p>
        </div>
      </div>

      {/* Editor Rápido */}
      <Card className="shadow-xs max-w-2xl">
        <CardHeader>
          <CardTitle>Crear Nuevo Anuncio</CardTitle>
          <CardDescription>Publica noticias o comunicados institucionales en el portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePublicar} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título de la Publicación</Label>
              <Input
                id="titulo"
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Horarios especiales por semana cultural..."
                className="h-10 text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger id="categoria" className="h-10">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Novedades">Novedades</SelectItem>
                  <SelectItem value="Eventos">Eventos</SelectItem>
                  <SelectItem value="Avisos">Avisos Oficiales</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" size="sm" className="font-semibold">
              Publicar en Portal
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Anuncios */}
      <Card className="shadow-xs">
        <CardHeader className="bg-muted/50 border-b border-border py-3">
          <CardTitle className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
            Anuncios Publicados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-border">
          {noticias.map((n) => (
            <div key={n.id} className="p-4 flex items-center justify-between hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3">
                <Badge variant="amber" className="font-bold">
                  {n.categoria}
                </Badge>
                <span className="font-semibold text-xs text-foreground">{n.titulo}</span>
                <span className="text-[11px] text-muted-foreground">({n.fecha})</span>
              </div>
              <Button
                size="icon-xs"
                variant="ghost"
                onClick={() => setNoticias(noticias.filter((item) => item.id !== n.id))}
                className="rounded-lg text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
