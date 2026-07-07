"use client";

import { useState, useEffect } from "react";
import { bibliotecasService, resenasService, usuariosService } from "../../services/api";

export default function SedesPage() {
  const [sedes, setSedes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado del formulario
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    horarios: "",
    telefono: "",
    ubicacion: "",
  });
  
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Estados para reseñas y usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [resenasPorSede, setResenasPorSede] = useState({});
  const [resenasLoading, setResenasLoading] = useState({});
  const [expandedSedeId, setExpandedSedeId] = useState(null);
  const [formResena, setFormResena] = useState({
    id_usuario: "",
    valoracion: 5,
    comentarios: ""
  });

  // Cargar sedes y usuarios al montar
  useEffect(() => {
    cargarSedes();
    cargarUsuarios();
  }, []);

  const cargarSedes = async () => {
    setLoading(true);
    try {
      const data = await bibliotecasService.getAll();
      setSedes(data);
      // Cargar reseñas para cada sede al cargar la lista para calcular promedios
      data.forEach((s) => {
        cargarResenasSede(s.id_biblioteca);
      });
    } catch (error) {
      showFeedback("error", "No se pudieron obtener las sedes. Verifica que el backend esté encendido.");
    } finally {
      setLoading(false);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const data = await usuariosService.getAll();
      setUsuarios(data);
    } catch (error) {
      console.error("No se pudieron cargar los usuarios:", error);
    }
  };

  const cargarResenasSede = async (idSede) => {
    setResenasLoading((prev) => ({ ...prev, [idSede]: true }));
    try {
      const data = await resenasService.getPorBiblioteca(idSede);
      setResenasPorSede((prev) => ({ ...prev, [idSede]: data }));
    } catch (error) {
      console.error(`Error al cargar reseñas de la sede ${idSede}:`, error);
    } finally {
      setResenasLoading((prev) => ({ ...prev, [idSede]: false }));
    }
  };

  const toggleResenas = (idSede) => {
    if (expandedSedeId === idSede) {
      setExpandedSedeId(null);
    } else {
      setExpandedSedeId(idSede);
      cargarResenasSede(idSede);
      // Reset form reseña
      setFormResena({
        id_usuario: "",
        valoracion: 5,
        comentarios: ""
      });
    }
  };

  const handleSubmitResena = async (e, idSede) => {
    e.preventDefault();
    if (!formResena.id_usuario || !formResena.valoracion) return;

    try {
      await resenasService.crear({
        id_biblioteca: idSede,
        id_usuario: formResena.id_usuario,
        valoracion: formResena.valoracion,
        comentarios: formResena.comentarios
      });
      showFeedback("success", "¡Calificación guardada con éxito!");
      cargarResenasSede(idSede); // Recargar
      // Limpiar formulario
      setFormResena({
        id_usuario: "",
        valoracion: 5,
        comentarios: ""
      });
    } catch (error) {
      showFeedback("error", error.message || "No se pudo registrar la calificación.");
    }
  };

  const calcularPromedio = (idSede) => {
    const list = resenasPorSede[idSede] || [];
    if (list.length === 0) return null;
    const sum = list.reduce((acc, r) => acc + Number(r.valoracion || 0), 0);
    return (sum / list.length).toFixed(1);
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
    if (!form.nombre.trim()) return;

    setSubmitting(true);
    try {
      if (editingId) {
        // Actualizar sede existente
        const actualizado = await bibliotecasService.update(editingId, form);
        setSedes((prev) => prev.map((s) => (s.id_biblioteca === editingId ? actualizado : s)));
        showFeedback("success", `Sede "${form.nombre}" actualizada con éxito.`);
        handleCancel();
      } else {
        // Registrar nueva sede
        const nuevo = await bibliotecasService.create(form);
        setSedes((prev) => [...prev, nuevo]);
        showFeedback("success", `Sede "${nuevo.nombre}" agregada al sistema.`);
        resetForm();
      }
    } catch (error) {
      showFeedback("error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditStart = (sede) => {
    setEditingId(sede.id_biblioteca);
    setForm({
      nombre: sede.nombre || "",
      direccion: sede.direccion || "",
      horarios: sede.horarios || "",
      telefono: sede.telefono || "",
      ubicacion: sede.ubicacion || "",
    });
  };

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la sede "${nombre}" de la red física?`)) {
      return;
    }

    try {
      await bibliotecasService.delete(id);
      setSedes((prev) => prev.filter((s) => s.id_biblioteca !== id));
      showFeedback("success", `La sede "${nombre}" ha sido eliminada.`);
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
      nombre: "",
      direccion: "",
      horarios: "",
      telefono: "",
      ubicacion: "",
    });
  };

  // Filtrar sedes localmente
  const sedesFiltradas = sedes.filter((sede) =>
    sede.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sede.direccion && sede.direccion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Encabezado */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Red de Sedes Físicas</h2>
        <p className="text-slate-400 mt-1 text-sm">
          Registra y administra las ubicaciones físicas, horarios de atención y datos de contacto de la red de bibliotecas.
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

      {/* Grid de Contenido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Formulario lateral */}
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-lg text-white">
            {editingId ? "Editar Detalles de Sede" : "Registrar Sede Física"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Nombre de la Sede *
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleInputChange}
                placeholder="Ej. Sede Central INEM"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Dirección Física
              </label>
              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleInputChange}
                placeholder="Ej. Av. Principal # 12-34"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Teléfono de Contacto
              </label>
              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleInputChange}
                placeholder="Ej. +57 300 123 4567"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Horarios */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Horarios de Atención
              </label>
              <input
                type="text"
                name="horarios"
                value={form.horarios}
                onChange={handleInputChange}
                placeholder="Ej. Lunes a Viernes 8:00 AM - 5:00 PM"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Ubicación / Mapa URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Enlace de Mapa (URL)
              </label>
              <input
                type="url"
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleInputChange}
                placeholder="Ej. https://maps.google.com/..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Botones */}
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
                {submitting ? "Procesando..." : editingId ? "Guardar" : "Registrar Sede"}
              </button>
            </div>
          </form>
        </div>

        {/* Bento Grid o Lista de Sedes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Barra de Filtro */}
          <div className="flex items-center justify-between gap-4 bg-slate-900/10 border border-slate-800/40 rounded-2xl p-4">
            <h3 className="font-semibold text-base text-white">Sedes Activas ({sedesFiltradas.length})</h3>
            
            <div className="relative w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Buscar por nombre o dirección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Listado de Sedes */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full mx-auto"></div>
              <p className="text-slate-500 text-xs">Cargando sedes de la red...</p>
            </div>
          ) : sedesFiltradas.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-800 rounded-xl">
              <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-slate-400 font-medium text-sm">No se encontraron sedes físicas</p>
              <p className="text-slate-600 text-xs mt-1">Registra tu primera sede en el formulario de la izquierda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {sedesFiltradas.map((sede) => (
                <div 
                  key={sede.id_biblioteca} 
                  className={`bg-slate-900/30 border rounded-2xl p-6 flex flex-col justify-between gap-4 transition-all duration-300 ${
                    editingId === sede.id_biblioteca ? "border-indigo-500/50 bg-indigo-950/5" : "border-slate-800/80 hover:border-slate-700/60"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-lg text-white tracking-tight">{sede.nombre}</h4>
                        {calcularPromedio(sede.id_biblioteca) && (
                          <div className="flex items-center gap-1 mt-0.5 text-xs text-amber-400 font-semibold">
                            <span>⭐</span>
                            <span>{calcularPromedio(sede.id_biblioteca)}</span>
                            <span className="text-slate-500 font-normal">({resenasPorSede[sede.id_biblioteca]?.length || 0})</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {sede.ubicacion && (
                          <a 
                            href={sede.ubicacion} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1.5 bg-slate-800 hover:bg-indigo-600 rounded-lg text-slate-400 hover:text-white transition-all"
                            title="Ver en Google Maps"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      {/* Dirección */}
                      {sede.direccion && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>{sede.direccion}</span>
                        </div>
                      )}

                      {/* Teléfono */}
                      {sede.telefono && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{sede.telefono}</span>
                        </div>
                      )}

                      {/* Horarios */}
                      {sede.horarios && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{sede.horarios}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center justify-between border-t border-slate-800/40 pt-3">
                    <button
                      onClick={() => toggleResenas(sede.id_biblioteca)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold py-1.5 px-3 rounded-lg hover:bg-indigo-500/10 transition-colors"
                    >
                      {expandedSedeId === sede.id_biblioteca ? "Ocultar Reseñas" : `Reseñas (${resenasPorSede[sede.id_biblioteca]?.length || 0})`}
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditStart(sede)}
                        className="text-xs text-slate-400 hover:text-indigo-400 font-semibold py-1.5 px-2.5 rounded-lg hover:bg-indigo-500/10 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(sede.id_biblioteca, sede.nombre)}
                        className="text-xs text-slate-500 hover:text-rose-400 font-semibold py-1.5 px-2.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {/* Panel de Reseñas Expansible */}
                  {expandedSedeId === sede.id_biblioteca && (
                    <div className="mt-4 border-t border-slate-800/60 pt-4 space-y-4 transition-all duration-300">
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Calificaciones de la Sede</h5>
                      
                      {/* Lista de reseñas */}
                      {resenasLoading[sede.id_biblioteca] ? (
                        <div className="py-4 text-center">
                          <div className="h-4 w-4 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full mx-auto"></div>
                        </div>
                      ) : (resenasPorSede[sede.id_biblioteca] || []).length === 0 ? (
                        <p className="text-[11px] text-slate-500 italic">Esta sede física no cuenta con opiniones aún.</p>
                      ) : (
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                          {(resenasPorSede[sede.id_biblioteca] || []).map((r) => (
                            <div key={r.id_resena} className="bg-slate-950 border border-slate-900 rounded-xl p-3 space-y-1">
                              <div className="flex items-center justify-between gap-2 text-[10px]">
                                <span className="font-semibold text-slate-300">{r.usuario_nombre}</span>
                                <span className="text-amber-400 font-bold">{"⭐".repeat(r.valoracion)}</span>
                              </div>
                              {r.comentarios && (
                                <p className="text-xs text-slate-400 leading-relaxed italic">"{r.comentarios}"</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Formulario de nueva reseña */}
                      <form onSubmit={(e) => handleSubmitResena(e, sede.id_biblioteca)} className="bg-slate-950 border border-slate-900 rounded-xl p-4 space-y-3">
                        <h6 className="text-[11px] font-bold text-slate-400">Dejar una Opinión</h6>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {/* Seleccionar usuario */}
                          <div>
                            <label className="block text-[10px] text-slate-500 mb-1">Usuario *</label>
                            <select
                              value={formResena.id_usuario}
                              onChange={(e) => setFormResena(prev => ({ ...prev, id_usuario: e.target.value }))}
                              required
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-300 focus:outline-none"
                            >
                              <option value="">Seleccionar...</option>
                              {usuarios.map(u => (
                                <option key={u.id_usuario} value={u.id_usuario}>{u.nombre}</option>
                              ))}
                            </select>
                          </div>

                          {/* Seleccionar valoración */}
                          <div>
                            <label className="block text-[10px] text-slate-500 mb-1">Valoración *</label>
                            <select
                              value={formResena.valoracion}
                              onChange={(e) => setFormResena(prev => ({ ...prev, valoracion: Number(e.target.value) }))}
                              required
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-300 focus:outline-none"
                            >
                              <option value="5">5 Estrellas</option>
                              <option value="4">4 Estrellas</option>
                              <option value="3">3 Estrellas</option>
                              <option value="2">2 Estrellas</option>
                              <option value="1">1 Estrella</option>
                            </select>
                          </div>
                        </div>

                        {/* Comentarios */}
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1">Comentario</label>
                          <textarea
                            value={formResena.comentarios}
                            onChange={(e) => setFormResena(prev => ({ ...prev, comentarios: e.target.value }))}
                            placeholder="Ej. Sede limpia, excelente atención."
                            rows={2}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-[10px] py-1.5 px-3 rounded-lg transition-all"
                        >
                          Calificar Sede
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
