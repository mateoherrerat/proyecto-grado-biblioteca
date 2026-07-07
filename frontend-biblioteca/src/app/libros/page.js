"use client";

import { useState, useEffect } from "react";
import { librosService, autoresService, librosAutoresService } from "../../services/api";

export default function LibrosPage() {
  const [libros, setLibros] = useState([]);
  const [allAutores, setAllAutores] = useState([]);
  const [selectedAutorId, setSelectedAutorId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado del formulario
  const [form, setForm] = useState({
    isbn: "",
    titulo: "",
    editorial: "",
    fecha_publicacion: "",
    sinopsis: "",
  });
  
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Cargar libros y autores al montar
  useEffect(() => {
    cargarTodosLosAutores();
  }, []);

  // Recargar libros con retardo ante cambios del buscador
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      cargarLibros(searchTerm);
    }, 300);
    
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const cargarTodosLosAutores = async () => {
    try {
      const data = await autoresService.getAll();
      setAllAutores(data);
    } catch (error) {
      console.error("Error al cargar autores:", error);
    }
  };

  const cargarLibros = async (filter) => {
    setLoading(true);
    try {
      const librosData = await librosService.getAll(filter);
      
      // Obtener autores asociados para cada libro de manera paralela
      const librosConAutores = await Promise.all(
        librosData.map(async (libro) => {
          try {
            const autores = await librosAutoresService.getAutoresByLibro(libro.id_libro);
            return { ...libro, autores };
          } catch {
            return { ...libro, autores: [] };
          }
        })
      );
      
      setLibros(librosConAutores);
    } catch (error) {
      showFeedback("error", "No se pudieron obtener los libros. Verifica que el backend esté encendido.");
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;

    setSubmitting(true);
    try {
      if (editingId) {
        // Actualizar libro existente
        const actualizado = await librosService.update(editingId, form);
        
        // Conservar los autores que ya tenía en memoria local
        const libroPrevio = libros.find(l => l.id_libro === editingId);
        const libroCompleto = { ...actualizado, autores: libroPrevio ? libroPrevio.autores : [] };
        
        setLibros((prev) => prev.map((l) => (l.id_libro === editingId ? libroCompleto : l)));
        showFeedback("success", `Libro "${form.titulo}" actualizado con éxito.`);
        handleCancel();
      } else {
        // Registrar nuevo libro (inicia sin autores asociados)
        const nuevo = await librosService.create(form);
        setLibros((prev) => [...prev, { ...nuevo, autores: [] }]);
        showFeedback("success", `Libro "${nuevo.titulo}" agregado al catálogo.`);
        resetForm();
      }
    } catch (error) {
      showFeedback("error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditStart = (libro) => {
    setEditingId(libro.id_libro);
    setForm({
      isbn: libro.isbn || "",
      titulo: libro.titulo || "",
      editorial: libro.editorial || "",
      fecha_publicacion: libro.fecha_publicacion ? libro.fecha_publicacion.substring(0, 10) : "",
      sinopsis: libro.sinopsis || "",
    });
    setSelectedAutorId("");
  };

  const handleDelete = async (id, titulo) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el libro "${titulo}" del catálogo general?`)) {
      return;
    }

    try {
      await librosService.delete(id);
      setLibros((prev) => prev.filter((l) => l.id_libro !== id));
      showFeedback("success", `El libro "${titulo}" ha sido eliminado.`);
    } catch (error) {
      showFeedback("error", error.message);
    }
  };

  // Asociar un nuevo autor al libro en edición
  const handleAddAuthor = async () => {
    if (!selectedAutorId || !editingId) return;
    
    try {
      const relation = await librosAutoresService.associate(selectedAutorId, editingId);
      const autorInfo = allAutores.find(a => a.id_autor === parseInt(selectedAutorId, 10));
      
      if (autorInfo) {
        // Añadir localmente al autor a la lista del libro
        setLibros(prev => prev.map(l => {
          if (l.id_libro === editingId) {
            const nuevosAutores = [...(l.autores || []), { 
              id_autor: autorInfo.id_autor, 
              nombre: autorInfo.nombre, 
              id_autor_libro: relation.id_autor_libro 
            }];
            return { ...l, autores: nuevosAutores };
          }
          return l;
        }));
        showFeedback("success", `Autor "${autorInfo.nombre}" asociado al libro.`);
        setSelectedAutorId("");
      }
    } catch (error) {
      showFeedback("error", error.message);
    }
  };

  // Remover asociación entre autor y libro
  const handleRemoveAuthor = async (idRelation, nombreAutor) => {
    if (!confirm(`¿Deseas quitar a "${nombreAutor}" de los autores de este libro?`)) return;

    try {
      await librosAutoresService.disassociate(idRelation);
      
      // Remover localmente el autor
      setLibros(prev => prev.map(l => {
        if (l.id_libro === editingId) {
          return { ...l, autores: (l.autores || []).filter(a => a.id_autor_libro !== idRelation) };
        }
        return l;
      }));
      showFeedback("success", `Asociación de "${nombreAutor}" removida.`);
    } catch (error) {
      showFeedback("error", error.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      isbn: "",
      titulo: "",
      editorial: "",
      fecha_publicacion: "",
      sinopsis: "",
    });
    setSelectedAutorId("");
  };

  // Filtrar los autores en el dropdown para omitir los que ya están asignados a este libro
  const libroEnEdicion = libros.find(l => l.id_libro === editingId);
  const autoresAsignadosIds = libroEnEdicion ? (libroEnEdicion.autores || []).map(a => a.id_autor) : [];
  const autoresDisponibles = allAutores.filter(a => !autoresAsignadosIds.includes(a.id_autor));

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Encabezado */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Catálogo de Libros</h2>
        <p className="text-slate-400 mt-1 text-sm">
          Registra y administra los detalles bibliográficos y los autores de cada libro.
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

      {/* Layout de Dos Columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Panel Izquierdo: Formulario e Integración N:M */}
        <div className="space-y-6">
          {/* Formulario */}
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-lg text-white">
              {editingId ? "Editar Información" : "Registrar Nuevo Libro"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Título del Libro *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleInputChange}
                  placeholder="Ej. Cien años de soledad"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  ISBN
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={form.isbn}
                  onChange={handleInputChange}
                  placeholder="Ej. 978-3-16-148410-0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Editorial
                </label>
                <input
                  type="text"
                  name="editorial"
                  value={form.editorial}
                  onChange={handleInputChange}
                  placeholder="Ej. Editorial Sudamericana"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Fecha de Publicación
                </label>
                <input
                  type="date"
                  name="fecha_publicacion"
                  value={form.fecha_publicacion}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Sinopsis o Resumen
                </label>
                <textarea
                  name="sinopsis"
                  value={form.sinopsis}
                  onChange={handleInputChange}
                  placeholder="Breve resumen..."
                  rows="3"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-medium text-sm py-2.5 px-4 rounded-xl transition-all"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-medium text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
                >
                  {submitting ? "Procesando..." : editingId ? "Guardar" : "Registrar"}
                </button>
              </div>
            </form>
          </div>

          {/* Gestión de Autores (Sólo visible al editar un libro) */}
          {editingId && (
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <h4 className="font-semibold text-sm text-white uppercase tracking-wider">
                Autores de este Libro
              </h4>

              {/* Agregar relación */}
              <div className="flex gap-2">
                <select
                  value={selectedAutorId}
                  onChange={(e) => setSelectedAutorId(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Seleccionar Autor --</option>
                  {autoresDisponibles.map((a) => (
                    <option key={a.id_autor} value={a.id_autor}>
                      {a.nombre}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddAuthor}
                  disabled={!selectedAutorId}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all active:scale-95 shrink-0"
                >
                  Agregar
                </button>
              </div>

              {/* Lista de autores vinculados */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {!libroEnEdicion?.autores || libroEnEdicion.autores.length === 0 ? (
                  <p className="text-xs italic text-slate-600 py-2">
                    Este libro aún no tiene autores asociados.
                  </p>
                ) : (
                  libroEnEdicion.autores.map((autor) => (
                    <div 
                      key={autor.id_autor}
                      className="flex items-center justify-between bg-slate-950/60 border border-slate-800/50 rounded-xl px-3.5 py-2 text-xs text-slate-200"
                    >
                      <span className="font-medium truncate mr-2">{autor.nombre}</span>
                      <button
                        onClick={() => handleRemoveAuthor(autor.id_autor_libro, autor.nombre)}
                        className="text-slate-500 hover:text-rose-400 font-bold shrink-0 transition-colors p-1"
                        title="Eliminar asociación"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Panel Derecho: Listado de Libros */}
        <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="font-semibold text-lg text-white">Catálogo General</h3>
            
            {/* Buscador */}
            <div className="relative w-full sm:w-72">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Filtrar por título o editorial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Tabla de Libros */}
          {loading && libros.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full mx-auto"></div>
              <p className="text-slate-500 text-xs">Cargando catálogo de libros...</p>
            </div>
          ) : libros.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-800 rounded-xl">
              <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-slate-400 font-medium text-sm">No se encontraron libros</p>
              <p className="text-slate-600 text-xs mt-1">Registra tu primer libro en el formulario de la izquierda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800/80">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800/80 text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-3.5 px-4 w-28">ISBN</th>
                    <th className="py-3.5 px-4">Libro / Editorial</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Autores</th>
                    <th className="py-3.5 px-4 w-40 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {libros.map((libro) => (
                    <tr 
                      key={libro.id_libro} 
                      className={`transition-colors align-top ${
                        editingId === libro.id_libro ? "bg-indigo-950/10 hover:bg-indigo-950/20" : "hover:bg-slate-900/10"
                      }`}
                    >
                      <td className="py-4 px-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                        {libro.isbn || <span className="italic text-slate-700">Sin ISBN</span>}
                      </td>
                      <td className="py-4 px-4 space-y-1.5">
                        <p className="font-semibold text-slate-100 leading-tight">{libro.titulo}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{libro.editorial || "Edición Independiente"}</span>
                          {libro.fecha_publicacion && (
                            <>
                              <span className="text-slate-700">•</span>
                              <span>{libro.fecha_publicacion.substring(0, 4)}</span>
                            </>
                          )}
                        </div>
                      </td>
                      {/* Listado de Autores (Píldoras) */}
                      <td className="py-4 px-4 hidden md:table-cell max-w-xs">
                        <div className="flex flex-wrap gap-1.5">
                          {!libro.autores || libro.autores.length === 0 ? (
                            <span className="text-slate-600 text-xs italic">Sin autores</span>
                          ) : (
                            libro.autores.map((a) => (
                              <span 
                                key={a.id_autor}
                                className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md text-[10px] font-medium border border-slate-700/50"
                              >
                                {a.nombre}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleEditStart(libro)}
                          className="text-xs text-slate-400 hover:text-indigo-400 font-medium py-1 px-2.5 rounded-lg hover:bg-indigo-500/10 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(libro.id_libro, libro.titulo)}
                          className="text-xs text-slate-500 hover:text-rose-400 font-medium py-1 px-2.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
