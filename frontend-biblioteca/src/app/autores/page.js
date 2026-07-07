"use client";

import { useState, useEffect } from "react";
import { autoresService } from "../../services/api";

export default function AutoresPage() {
  const [autores, setAutores] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingNombre, setEditingNombre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Cargar lista de autores
  useEffect(() => {
    cargarAutores();
  }, []);

  const cargarAutores = async () => {
    setLoading(true);
    try {
      const data = await autoresService.getAll();
      setAutores(data);
    } catch (error) {
      showFeedback("error", "No se pudo conectar con el servidor. Verifica que el backend esté encendido.");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    // Desvanecer el mensaje automáticamente tras 5 segundos
    setTimeout(() => {
      setFeedback({ type: "", message: "" });
    }, 5000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;

    setSubmitting(true);
    try {
      const nuevoAutor = await autoresService.create(nuevoNombre);
      setAutores((prev) => [...prev, nuevoAutor]);
      setNuevoNombre("");
      showFeedback("success", `Autor "${nuevoAutor.nombre}" registrado correctamente.`);
    } catch (error) {
      showFeedback("error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditStart = (autor) => {
    setEditingId(autor.id_autor);
    setEditingNombre(autor.nombre);
  };

  const handleUpdate = async (id) => {
    if (!editingNombre.trim()) return;
    
    // Si el nombre no cambió, cancelar edición sin llamar a la API
    const original = autores.find(a => a.id_autor === id);
    if (original && original.nombre === editingNombre.trim()) {
      setEditingId(null);
      return;
    }

    try {
      const actualizado = await autoresService.update(id, editingNombre);
      setAutores((prev) =>
        prev.map((a) => (a.id_autor === id ? actualizado : a))
      );
      setEditingId(null);
      showFeedback("success", "Nombre del autor actualizado.");
    } catch (error) {
      showFeedback("error", error.message);
    }
  };

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar al autor "${nombre}"?`)) {
      return;
    }

    try {
      await autoresService.delete(id);
      setAutores((prev) => prev.filter((a) => a.id_autor !== id));
      showFeedback("success", `El autor "${nombre}" ha sido eliminado.`);
    } catch (error) {
      // Capturamos el error 400 cuando tiene libros vinculados
      showFeedback("error", error.message);
    }
  };

  // Filtrar autores localmente según el término de búsqueda
  const autoresFiltrados = autores.filter((autor) =>
    autor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Administración de Autores</h2>
          <p className="text-slate-400 mt-1 text-sm">
            Registra, edita o elimina autores del catálogo de la biblioteca.
          </p>
        </div>
      </div>

      {/* Banners de Notificaciones */}
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
            <p className="text-sm font-semibold">{feedback.type === "success" ? "Operación exitosa" : "Error en el servidor"}</p>
            <p className="text-xs opacity-90 mt-0.5">{feedback.message}</p>
          </div>
        </div>
      )}

      {/* Grid: Registro y Lista */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Formulario de Registro */}
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-lg text-white">Registrar Nuevo Autor</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder="Ej. Gabriel García Márquez"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-medium text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
            >
              {submitting ? "Registrando..." : "Registrar Autor"}
            </button>
          </form>
        </div>

        {/* Listado y Búsqueda */}
        <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="font-semibold text-lg text-white">Autores Registrados</h3>
            
            {/* Buscador */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Buscar autor por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Tabla de Resultados */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full mx-auto"></div>
              <p className="text-slate-500 text-xs">Cargando catálogo de autores...</p>
            </div>
          ) : autoresFiltrados.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-800 rounded-xl">
              <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-slate-400 font-medium text-sm">No se encontraron autores</p>
              <p className="text-slate-600 text-xs mt-1">Intenta con otra búsqueda o agrega uno nuevo.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800/80">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800/80 text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-3.5 px-4 w-20">ID</th>
                    <th className="py-3.5 px-4">Nombre Completo</th>
                    <th className="py-3.5 px-4 w-40 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {autoresFiltrados.map((autor) => (
                    <tr 
                      key={autor.id_autor} 
                      className="hover:bg-slate-900/20 group/row transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                        {autor.id_autor}
                      </td>
                      <td className="py-3.5 px-4 text-slate-200">
                        {editingId === autor.id_autor ? (
                          <input
                            type="text"
                            value={editingNombre}
                            onChange={(e) => setEditingNombre(e.target.value)}
                            onBlur={() => handleUpdate(autor.id_autor)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleUpdate(autor.id_autor);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            autoFocus
                            className="bg-slate-950 border border-indigo-500 rounded px-2 py-1 text-sm text-slate-100 focus:outline-none w-full"
                          />
                        ) : (
                          <span 
                            onClick={() => handleEditStart(autor)} 
                            className="cursor-pointer border-b border-dashed border-transparent hover:border-slate-500"
                            title="Haz clic para editar"
                          >
                            {autor.nombre}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {/* Editar */}
                        <button
                          onClick={() => {
                            if (editingId === autor.id_autor) {
                              handleUpdate(autor.id_autor);
                            } else {
                              handleEditStart(autor);
                            }
                          }}
                          className="text-xs text-slate-400 hover:text-indigo-400 font-medium py-1 px-2.5 rounded-lg hover:bg-indigo-500/10 transition-colors"
                        >
                          {editingId === autor.id_autor ? "Guardar" : "Editar"}
                        </button>
                        
                        {/* Eliminar */}
                        <button
                          onClick={() => handleDelete(autor.id_autor, autor.nombre)}
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
