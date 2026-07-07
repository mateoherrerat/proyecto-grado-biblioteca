"use client";

import { useState, useEffect } from "react";
import { publicacionesService, autoresService, librosService } from "../../services/api";

export default function PublicacionesPage() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [autores, setAutores] = useState([]);
  const [libros, setLibros] = useState([]);
  
  // Mapa de libros vinculados por id_novedad
  const [librosPorPublicacion, setLibrosPorPublicacion] = useState({});
  const [librosLoading, setLibrosLoading] = useState({});

  // Estados del formulario de nueva publicación
  const [form, setForm] = useState({
    id_autor: "",
    descripcion: "",
    slug: "",
    fecha: new Date().toISOString().split("T")[0],
  });

  // selectores locales de vinculación (id_novedad -> id_libro_seleccionado)
  const [vincularSeleccion, setVincularSeleccion] = useState({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    inicializarDatos();
  }, []);

  const inicializarDatos = async () => {
    setLoading(true);
    try {
      const [pubData, autData, libData] = await Promise.all([
        publicacionesService.getAll(),
        autoresService.getAll(),
        librosService.getAll()
      ]);

      setPublicaciones(pubData);
      setAutores(autData);
      setLibros(libData);

      // Cargar libros vinculados para cada publicación en paralelo
      pubData.forEach((pub) => {
        cargarLibrosDeNovedad(pub.id_novedad);
      });

    } catch (error) {
      showFeedback("error", "Error al cargar la información inicial.");
    } finally {
      setLoading(false);
    }
  };

  const cargarLibrosDeNovedad = async (idNovedad) => {
    setLibrosLoading((prev) => ({ ...prev, [idNovedad]: true }));
    try {
      const librosVinculados = await publicacionesService.getLibros(idNovedad);
      setLibrosPorPublicacion((prev) => ({
        ...prev,
        [idNovedad]: librosVinculados
      }));
    } catch (error) {
      console.error(`Error al cargar libros de novedad ${idNovedad}:`, error);
    } finally {
      setLibrosLoading((prev) => ({ ...prev, [idNovedad]: false }));
    }
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: "", message: "" });
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitPublicacion = async (e) => {
    e.preventDefault();
    if (!form.id_autor || !form.descripcion.trim()) return;

    setSubmitting(true);
    try {
      const nueva = await publicacionesService.create(form);
      setPublicaciones((prev) => [
        { ...nueva, autor_nombre: autores.find(a => String(a.id_autor) === String(nueva.id_autor))?.nombre || "Autor" },
        ...prev
      ]);
      setLibrosPorPublicacion((prev) => ({ ...prev, [nueva.id_novedad]: [] }));
      showFeedback("success", "Anuncio publicado correctamente.");
      
      // Reset form
      setForm({
        id_autor: "",
        descripcion: "",
        slug: "",
        fecha: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      showFeedback("error", error.message || "Error al crear la publicación.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVincularLibro = async (idNovedad) => {
    const idLibro = vincularSeleccion[idNovedad];
    if (!idLibro) return;

    try {
      await publicacionesService.vincularLibro(idNovedad, idLibro);
      // Recargar libros para esa novedad
      await cargarLibrosDeNovedad(idNovedad);
      // Reset selector
      setVincularSeleccion((prev) => ({ ...prev, [idNovedad]: "" }));
      showFeedback("success", "Libro vinculado exitosamente a la novedad.");
    } catch (error) {
      showFeedback("error", error.message || "No se pudo vincular el libro.");
    }
  };

  const handleDesvincularLibro = async (idNovedad, idLibro, tituloLibro) => {
    if (!confirm(`¿Deseas desvincular el libro "${tituloLibro}" de esta publicación destacada?`)) {
      return;
    }

    try {
      await publicacionesService.desvincularLibro(idNovedad, idLibro);
      // Actualizar estado local
      setLibrosPorPublicacion((prev) => ({
        ...prev,
        [idNovedad]: (prev[idNovedad] || []).filter((l) => l.id_libro !== idLibro)
      }));
      showFeedback("success", "Libro desvinculado con éxito.");
    } catch (error) {
      showFeedback("error", error.message || "No se pudo desvincular el libro.");
    }
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
    const date = new Date(fechaStr);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Encabezado */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Novedades y Anuncios Web</h2>
        <p className="text-slate-400 mt-1 text-sm">
          Publica comunicados escolares y destaca libros o adquisiciones recientes de la biblioteca.
        </p>
      </div>

      {/* Alertas */}
      {feedback.message && (
        <div 
          className={`p-4 rounded-xl border flex items-start gap-3 transition-all duration-300 ${
            feedback.type === "success" 
              ? "bg-emerald-950/40 border-emerald-800 text-emerald-300" 
              : "bg-rose-950/40 border-rose-800 text-rose-300"
          }`}
        >
          {feedback.type === "success" ? (
            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          <div>
            <p className="text-sm font-semibold">{feedback.type === "success" ? "Operación exitosa" : "Error de Operación"}</p>
            <p className="text-xs opacity-90 mt-0.5">{feedback.message}</p>
          </div>
        </div>
      )}

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Formulario lateral */}
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-lg text-white">Escribir Publicación</h3>
          
          <form onSubmit={handleSubmitPublicacion} className="space-y-4">
            {/* Autor firmante */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Autor Relacionado *
              </label>
              <select
                name="id_autor"
                value={form.id_autor}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="">Selecciona un autor...</option>
                {autores.map((a) => (
                  <option key={a.id_autor} value={a.id_autor}>
                    {a.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Fecha del Comunicado
              </label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Slug personalizado opcional */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Slug del Enlace (Opcional)
              </label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleInputChange}
                placeholder="Ej. lanzamiento-libro-terror"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Contenido / Descripción */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Cuerpo de la Noticia / Anuncio *
              </label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleInputChange}
                placeholder="Detalla la noticia o anuncio aquí..."
                required
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-medium text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
            >
              {submitting ? "Publicando..." : "Publicar Anuncio"}
            </button>
          </form>
        </div>

        {/* Listado de Anuncios y Novedades */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-semibold text-base text-white">Anuncios en Línea ({publicaciones.length})</h3>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full mx-auto"></div>
              <p className="text-slate-500 text-xs">Cargando publicaciones...</p>
            </div>
          ) : publicaciones.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/5">
              <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7" />
              </svg>
              <p className="text-slate-400 font-medium text-sm">No hay publicaciones activas</p>
              <p className="text-slate-600 text-xs mt-1">Escribe tu primer anuncio usando el formulario lateral.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {publicaciones.map((pub) => {
                const vinculados = librosPorPublicacion[pub.id_novedad] || [];
                const estaCargando = librosLoading[pub.id_novedad];
                const libroSeleccionado = vincularSeleccion[pub.id_novedad] || "";

                // Filtrar libros que aún no están asociados a esta publicación
                const librosDisponiblesParaVincular = libros.filter(
                  (l) => !vinculados.some((v) => String(v.id_libro) === String(l.id_libro))
                );

                return (
                  <div 
                    key={pub.id_novedad}
                    className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 space-y-6 hover:border-slate-800 transition-colors"
                  >
                    {/* Detalles de la Publicidad */}
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs bg-slate-800 border border-slate-700/60 px-3 py-1 rounded-full text-slate-300 font-semibold">
                          Autor: {pub.autor_nombre}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {formatearFecha(pub.fecha)}
                        </span>
                      </div>
                      <p className="text-slate-100 text-sm leading-relaxed whitespace-pre-wrap">
                        {pub.descripcion}
                      </p>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Link slug: /novedades/{pub.slug}
                      </div>
                    </div>

                    {/* Libros Vinculados (Destacados) */}
                    <div className="pt-4 border-t border-slate-800/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Libros Recomendados
                        </h4>
                        {estaCargando && (
                          <div className="h-3 w-3 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full"></div>
                        )}
                      </div>

                      {/* Lista de libros asignados */}
                      {vinculados.length === 0 ? (
                        <p className="text-[11px] text-slate-600 italic">No hay libros asociados a este anuncio.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {vinculados.map((l) => (
                            <div 
                              key={l.id_libro}
                              className="bg-slate-950 border border-slate-800 rounded-xl py-1.5 pl-3 pr-2 flex items-center gap-2 group transition-colors hover:border-slate-700"
                            >
                              <div className="text-xs text-slate-300 font-medium max-w-[180px] truncate">
                                {l.titulo}
                              </div>
                              <button
                                onClick={() => handleDesvincularLibro(pub.id_novedad, l.id_libro, l.titulo)}
                                className="text-slate-500 hover:text-rose-400 p-0.5 rounded-md hover:bg-rose-500/10 transition-colors"
                                title="Desvincular libro"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Selector para vincular un libro nuevo */}
                      <div className="flex items-center gap-2 pt-2">
                        <select
                          value={libroSeleccionado}
                          onChange={(e) => 
                            setVincularSeleccion((prev) => ({ ...prev, [pub.id_novedad]: e.target.value }))
                          }
                          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors flex-1"
                        >
                          <option value="">Destacar un libro en esta publicación...</option>
                          {librosDisponiblesParaVincular.map((l) => (
                            <option key={l.id_libro} value={l.id_libro}>
                              {l.titulo}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleVincularLibro(pub.id_novedad)}
                          disabled={!libroSeleccionado}
                          className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-semibold text-xs py-1.5 px-3 rounded-xl transition-all"
                        >
                          Vincular
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
