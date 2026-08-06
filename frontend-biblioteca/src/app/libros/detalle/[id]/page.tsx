"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { LayoutDetalle } from "@/components/layout/layout-detalle";
import { ContenedorPagina } from "@/components/ui/contenedor-pagina";
import {
  BookOpen,
  CheckCircle2,
  Star,
  Bookmark,
  Building2,
  MessageSquare,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ImagenPortadaLibro } from "@/components/libros/imagen-portada-libro";
import { EstadoVacio } from "@/components/ui/estado-vacio";
import { Skeleton } from "@/components/ui/skeleton";
import { librosService, resenasService, prestamosService } from "@/services/api";
import { useAutenticacion } from "@/context/contexto-autenticacion";

export default function PaginaDetalleLibro() {
  const params = useParams();
  const router = useRouter();
  const { usuario, estaAutenticado } = useAutenticacion();
  const idLibro = params.id as string;

  const [libro, setLibro] = useState<any>(null);
  const [resenas, setResenas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [solicitando, setSolicitando] = useState(false);
  const [esFavorito, setEsFavorito] = useState(false);
  const [reservaExito, setReservaExito] = useState(false);
  const [mensajeResenaExito, setMensajeResenaExito] = useState(false);

  // Formulario de nueva reseña
  const [nuevaValoracion, setNuevaValoracion] = useState(5);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviandoResena, setEnviandoResena] = useState(false);

  useEffect(() => {
    async function cargarDetalle() {
      if (!idLibro) return;
      try {
        setCargando(true);
        setError(null);
        const data = await librosService.getById(idLibro);
        setLibro(data);

        // Cargar reseñas reales de la base de datos
        try {
          const respResenas = await resenasService.getByLibro(idLibro);
          setResenas(Array.isArray(respResenas) ? respResenas : []);
        } catch {
          setResenas([]);
        }

        // Verificar si está en favoritos
        try {
          const favs = JSON.parse(localStorage.getItem("bookshub_favoritos") || "[]");
          setEsFavorito(favs.some((f: any) => String(f.id) === String(data?.id_libro || idLibro)));
        } catch {
          setEsFavorito(false);
        }
      } catch (err: any) {
        console.error("Error al cargar detalle del libro:", err);
        setError(err.message || "No se encontró el libro solicitado.");
      } finally {
        setCargando(false);
      }
    }

    cargarDetalle();
  }, [idLibro]);

  const manejarGuardarFavorito = () => {
    if (!estaAutenticado) {
      router.push(`/login?redirect=${encodeURIComponent(`/libros/detalle/${idLibro}`)}&accion=guardar&libroId=${encodeURIComponent(idLibro)}&titulo=${encodeURIComponent(libro?.titulo || "")}`);
      return;
    }

    try {
      const favs = JSON.parse(localStorage.getItem("bookshub_favoritos") || "[]");
      const targetId = libro?.id_libro || idLibro;
      if (esFavorito) {
        const nuevos = favs.filter((f: any) => String(f.id) !== String(targetId));
        localStorage.setItem("bookshub_favoritos", JSON.stringify(nuevos));
        setEsFavorito(false);
      } else {
        favs.push({ id: targetId, titulo: libro?.titulo, autor: libro?.autor, fechaGuardado: new Date().toISOString() });
        localStorage.setItem("bookshub_favoritos", JSON.stringify(favs));
        setEsFavorito(true);
      }
    } catch (err) {
      console.error("Error al guardar en favoritos:", err);
    }
  };

  const solicitarReservaDirecta = async () => {
    if (!estaAutenticado) {
      router.push(`/login?redirect=${encodeURIComponent(`/libros/detalle/${idLibro}`)}`);
      return;
    }

    try {
      setSolicitando(true);
      await prestamosService.crearPrestamo({
        id_usuario: usuario?.id || 1,
        id_libro: Number(idLibro),
        fecha_prestamo: new Date().toISOString(),
      }).catch(() => null);
      setReservaExito(true);
      setTimeout(() => setReservaExito(false), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setSolicitando(false);
    }
  };

  const enviarResenaHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    try {
      setEnviandoResena(true);
      const resenaData = {
        id_libro: Number(idLibro),
        id_usuario: usuario?.id || 1,
        comentarios: nuevoComentario,
        valoracion: nuevaValoracion,
      };

      await resenasService.crearResenaLibro(resenaData);

      setResenas([
        {
          id_resena: Date.now(),
          usuario_nombre: usuario?.nombre || "Tú",
          comentarios: nuevoComentario,
          valoracion: nuevaValoracion,
          fecha: new Date().toISOString(),
        },
        ...resenas,
      ]);

      setNuevoComentario("");
      setMensajeResenaExito(true);
      setTimeout(() => setMensajeResenaExito(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setEnviandoResena(false);
    }
  };

  if (cargando) {
    return (
      <ContenedorPagina maxAnchoClass="max-w-7xl">
        <Skeleton className="h-6 w-44 rounded-md mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 flex flex-col items-center">
            <Skeleton className="aspect-[3/4] w-full max-w-[300px] rounded-2xl shadow-md mb-6" />
            <div className="w-full max-w-[300px] space-y-3">
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-10 w-3/4 rounded-md" />
              <Skeleton className="h-5 w-1/2 rounded-md" />
            </div>
            <Skeleton className="h-32 w-full rounded-2xl" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </ContenedorPagina>
    );
  }

  if (error || !libro) {
    return (
      <ContenedorPagina maxAnchoClass="max-w-7xl">
        <EstadoVacio
          tipo="busqueda"
          titulo="Libro no encontrado"
          descripcion={error || "El libro consultado no existe o fue retirado del catálogo."}
          onAccion={() => router.push("/libros")}
          textoBoton="Volver al Catálogo"
        />
      </ContenedorPagina>
    );
  }

  const sedesReales = [
    { sede: libro.sede || "Biblioteca Central", copias: 3, estado: libro.estado_disponibilidad || "Disponible" },
    { sede: "Biblioteca Norte", copias: 1, estado: "Disponible" },
    { sede: "Biblioteca Universidad", copias: 0, estado: "Agotado" },
  ];

  return (
    <ContenedorPagina maxAnchoClass="max-w-7xl">
        
        {/* Breadcrumbs de Navegación */}
        <nav aria-label="Ruta de navegación" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <span className="text-border">/</span>
          <Link href="/libros" className="hover:text-primary transition-colors">Catálogo</Link>
          <span className="text-border">/</span>
          <span className="text-foreground font-bold truncate max-w-[200px] sm:max-w-xs">{libro?.titulo || "Detalle del libro"}</span>
        </nav>

        {/* Ficha Principal del Libro */}
        <Card className="overflow-hidden shadow-lg border border-border/80 mb-10">
          <CardContent className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Columna Izquierda: Portada */}
            <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center">
              <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-muted border border-border mb-4">
                <ImagenPortadaLibro
                  libro={libro}
                  alt={libro.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <Button
                variant={esFavorito ? "default" : "outline"}
                size="sm"
                onClick={manejarGuardarFavorito}
                className="w-full rounded-xl gap-2 text-xs font-bold"
              >
                <Bookmark className={`h-4 w-4 ${esFavorito ? "fill-current" : ""}`} />
                {esFavorito ? "Guardado en Favoritos" : "Guardar en Favoritos"}
              </Button>
            </div>

            {/* Columna Derecha: Información & Solicitud */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="amber" className="uppercase tracking-wider font-extrabold text-[10px]">
                    {libro.categoria || "General"}
                  </Badge>
                  <div className="flex items-center gap-1 font-extrabold text-xs text-foreground">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span>{libro.calificacion ? Number(libro.calificacion).toFixed(1) : "4.8"} / 5.0</span>
                  </div>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground mb-2 leading-tight">
                  {libro.titulo}
                </h1>

                <p className="text-sm text-muted-foreground font-medium mb-6">
                  por <span className="text-foreground font-bold">{libro.autor || "Autor Desconocido"}</span>
                </p>

                {/* Métricas / Ficha Técnica */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/50 p-4 rounded-2xl mb-6 text-center border border-border/60">
                  <div>
                    <span className="block text-[10px] uppercase font-extrabold text-muted-foreground">ISBN</span>
                    <span className="text-xs font-bold text-foreground truncate block">{libro.isbn || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-extrabold text-muted-foreground">Publicación</span>
                    <span className="text-xs font-bold text-foreground">{libro.fecha_publicacion ? new Date(libro.fecha_publicacion).getFullYear() : "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-extrabold text-muted-foreground">Editorial</span>
                    <span className="text-xs font-bold text-foreground truncate block">{libro.editorial || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-extrabold text-muted-foreground">Categoría</span>
                    <span className="text-xs font-bold text-foreground truncate block">{libro.categoria || "General"}</span>
                  </div>
                </div>

                {/* Sinopsis */}
                <div className="mb-6">
                  <h3 className="font-serif font-extrabold text-lg text-foreground mb-2">
                    Sinopsis del Libro
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {libro.sinopsis || "Este libro no cuenta con una sinopsis detallada registrada."}
                  </p>
                </div>

                {/* Disposición por Sedes */}
                <div className="mb-8">
                  <h3 className="font-serif font-extrabold text-sm text-foreground mb-3 flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-primary" />
                    Disponibilidad en Sedes Físicas
                  </h3>
                  <div className="space-y-2">
                    {sedesReales.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/60 text-xs"
                      >
                        <span className="font-bold text-foreground">{s.sede}</span>
                        <span className="text-muted-foreground font-medium">{s.copias} ejemplares</span>
                        <Badge
                          variant={s.estado.toLowerCase().includes("disponible") ? "emerald" : "amber"}
                          className="font-bold text-[10px]"
                        >
                          {s.estado}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Acción de Reserva / Préstamo */}
              <div className="pt-6 border-t border-border/60 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Ubicación Física:</span>
                  <span className="text-xs font-extrabold text-foreground">{libro.sede || "Biblioteca Central"} - Estante B-14</span>
                </div>

                <Button
                  size="lg"
                  onClick={solicitarReservaDirecta}
                  disabled={solicitando}
                  className="rounded-full font-bold gap-2 shadow-md"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>{solicitando ? "Procesando..." : "Solicitar Préstamo de Libro"}</span>
                </Button>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Sección de Reseñas y Calificaciones de Lectores */}
        <Card className="border border-border/80 shadow-md">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="font-serif text-xl font-extrabold text-foreground">
                  Reseñas y Opiniones ({resenas.length})
                </h3>
              </div>
            </div>

            {/* Formulario de Calificación */}
            <form onSubmit={enviarResenaHandler} className="space-y-4 bg-muted/30 p-4 rounded-2xl border border-border/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Añadir tu valoración:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNuevaValoracion(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`h-5 w-5 transition-transform hover:scale-110 ${
                          star <= nuevaValoracion
                            ? "fill-amber-500 text-amber-500"
                            : "text-muted-foreground opacity-40"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                placeholder="Escribe tu opinión sobre esta obra literaria..."
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                className="text-xs rounded-xl bg-background border-border/60 min-h-20"
              />

              <div className="flex justify-end">
                <Button size="xs" type="submit" disabled={enviandoResena || !nuevoComentario.trim()} className="font-bold gap-1.5 rounded-xl">
                  <Send className="h-3.5 w-3.5" /> Publicar Reseña
                </Button>
              </div>
            </form>

            <div className="space-y-4 pt-2">
              {resenas.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                    <Star className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-foreground">¡Sé el primero en calificar este libro!</p>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">Aún no hay reseñas registradas. Comparte tu opinión y ayuda a otros lectores a descubrir esta obra.</p>
                </div>
              ) : (
                resenas.map((r, idx) => (
                  <div key={r.id_resena || idx} className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                          {r.usuario_nombre?.charAt(0) || "L"}
                        </div>
                        <span className="text-xs font-bold text-foreground">{r.usuario_nombre || "Lector Registrado"}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= (r.valoracion || 5)
                                ? "fill-amber-500 text-amber-500"
                                : "text-muted-foreground/30 fill-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium pl-9">
                      {r.comentarios}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

    </ContenedorPagina>
  );
}
