"use client";

import { useState, useEffect } from "react";
import { configService, usuariosService, preferenciasService } from "../../services/api";

export default function ConfiguracionPage() {
  const [estadosFisicos, setEstadosFisicos] = useState([]);
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Estados de carga generales
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [submittingEstado, setSubmittingEstado] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Formulario nuevo estado físico
  const [nuevoEstado, setNuevoEstado] = useState("");

  // Estados de Preferencias de Usuario
  const [selectedUsuario, setSelectedUsuario] = useState("");
  const [preferencias, setPreferencias] = useState([]);
  const [loadingPrefs, setLoadingPrefs] = useState(false);
  const [updatingPrefId, setUpdatingPrefId] = useState(null); // idLibro que se está actualizando

  // Estados locales para los selectores de alerta de cada preferencia (idLibro -> idEstado)
  const [alertasForm, setAlertasForm] = useState({});

  useEffect(() => {
    cargarConfiguraciones();
  }, []);

  const cargarConfiguraciones = async () => {
    setLoadingConfig(true);
    try {
      const [estData, dispData, usrData] = await Promise.all([
        configService.getEstados(),
        configService.getDisponibilidades(),
        usuariosService.getAll(),
      ]);

      setEstadosFisicos(estData);
      setDisponibilidades(dispData);
      setUsuarios(usrData);
    } catch (error) {
      showFeedback("error", "Error al conectar con la base de datos de configuraciones.");
    } finally {
      setLoadingConfig(false);
    }
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: "", message: "" });
    }, 5000);
  };

  const handleCrearEstado = async (e) => {
    e.preventDefault();
    if (!nuevoEstado.trim()) return;

    setSubmittingEstado(true);
    try {
      const creado = await configService.crearEstado(nuevoEstado);
      setEstadosFisicos((prev) => [...prev, creado]);
      setNuevoEstado("");
      showFeedback("success", `Categoría de estado "${creado.tipo_estado}" creada con éxito.`);
    } catch (error) {
      showFeedback("error", error.message || "Error al crear el estado físico.");
    } finally {
      setSubmittingEstado(false);
    }
  };

  const handleUsuarioChange = async (e) => {
    const idUsuario = e.target.value;
    setSelectedUsuario(idUsuario);
    setPreferencias([]);

    if (!idUsuario) return;

    setLoadingPrefs(true);
    try {
      const data = await preferenciasService.getByUsuario(idUsuario);
      setPreferencias(data);
      
      // Inicializar el formulario de alertas local con los valores actuales
      const initialAlertas = {};
      data.forEach((p) => {
        initialAlertas[p.id_libro] = p.id_estado_disponibilidad_libro || "";
      });
      setAlertasForm(initialAlertas);
    } catch (error) {
      showFeedback("error", error.message || "No se pudieron obtener las preferencias del usuario.");
    } finally {
      setLoadingPrefs(false);
    }
  };

  const handleActualizarAlerta = async (idLibro, libroTitulo) => {
    const nuevoEstadoAlerta = alertasForm[idLibro] ? Number(alertasForm[idLibro]) : null;

    setUpdatingPrefId(idLibro);
    try {
      await preferenciasService.updateAlerta(selectedUsuario, idLibro, nuevoEstadoAlerta);
      showFeedback("success", `Alerta de disponibilidad para "${libroTitulo}" actualizada.`);
      
      // Actualizar listado local de preferencias
      setPreferencias((prev) =>
        prev.map((p) =>
          p.id_libro === idLibro
            ? {
                ...p,
                id_estado_disponibilidad_libro: nuevoEstadoAlerta,
                estado_alerta_nombre: disponibilidades.find(
                  (d) => Number(d.id_estado_disponibilidad) === nuevoEstadoAlerta
                )?.tipo_estado_disponibilidad || "Sin Alerta",
              }
            : p
        )
      );
    } catch (error) {
      showFeedback("error", error.message || "No se pudo actualizar la alerta de disponibilidad.");
    } finally {
      setUpdatingPrefId(null);
    }
  };

  // Color-coding para badges de disponibilidad
  const getBadgeColorClass = (idDisp) => {
    const id = Number(idDisp);
    switch (id) {
      case 1: // En catálogo
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
      case 2: // Prestado
        return "bg-sky-500/10 border-sky-500/30 text-sky-400";
      case 3: // Extraviado
        return "bg-rose-500/10 border-rose-500/30 text-rose-400";
      case 4: // Reservado
        return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      default:
        return "bg-slate-800 border-slate-700 text-slate-400";
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Encabezado */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Configuración del Sistema</h2>
        <p className="text-slate-400 mt-1 text-sm">
          Administra las taxonomías, catalogaciones físicas y las preferencias de seguimiento de alertas de los usuarios.
        </p>
      </div>

      {/* Alertas de Feedback */}
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

      {loadingConfig ? (
        <div className="py-24 text-center space-y-3">
          <div className="h-9 w-9 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full mx-auto"></div>
          <p className="text-slate-500 text-xs">Cargando base de datos de configuración...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Tarjeta 1: Estados Físicos de Libros */}
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-white">Estados Físicos</h3>
              <p className="text-xs text-slate-500 mt-0.5">Categorías de conservación física de ejemplares.</p>
            </div>

            {/* Listado */}
            <div className="flex flex-wrap gap-2">
              {estadosFisicos.map((e) => (
                <span 
                  key={e.id_estado_fisico}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-medium"
                >
                  {e.tipo_estado}
                </span>
              ))}
            </div>

            {/* Formulario */}
            <form onSubmit={handleCrearEstado} className="pt-4 border-t border-slate-800/60 space-y-3">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Registrar Nuevo Estado Físico
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej. Dañado, Portada suelta..."
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                  required
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={submittingEstado}
                  className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-semibold text-xs py-2 px-3 rounded-xl transition-all"
                >
                  {submittingEstado ? "Creando..." : "Agregar"}
                </button>
              </div>
            </form>
          </div>

          {/* Tarjeta 2: Disponibilidades Lógicas */}
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-white">Disponibilidad Lógica</h3>
              <p className="text-xs text-slate-500 mt-0.5">Estados operativos de los libros en catálogo.</p>
            </div>

            {/* Listado */}
            <div className="grid grid-cols-1 gap-2">
              {disponibilidades.map((d) => (
                <div 
                  key={d.id_estado_disponibilidad}
                  className={`px-3 py-2.5 border rounded-xl flex items-center justify-between text-xs font-semibold ${getBadgeColorClass(d.id_estado_disponibilidad)}`}
                >
                  <span>{d.tipo_estado_disponibilidad}</span>
                  <span className="text-[10px] opacity-65 font-mono">ID: {d.id_estado_disponibilidad}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjeta 3: Preferencias de Seguimiento de Usuarios */}
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-white">Alertas de Libros</h3>
              <p className="text-xs text-slate-500 mt-0.5">Preferencias de alertas de disponibilidad de los usuarios.</p>
            </div>

            {/* Selector de usuario */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Seleccionar Usuario
              </label>
              <select
                value={selectedUsuario}
                onChange={handleUsuarioChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="">Selecciona un usuario...</option>
                {usuarios.map((u) => (
                  <option key={u.id_usuario} value={u.id_usuario}>
                    {u.nombre} ({u.correo})
                  </option>
                ))}
              </select>
            </div>

            {/* Lista de libros seguidos por el usuario */}
            <div className="space-y-4 pt-4 border-t border-slate-800/60">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Libros en Interés y Alertas
              </h4>

              {loadingPrefs ? (
                <div className="py-8 text-center">
                  <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full mx-auto"></div>
                </div>
              ) : !selectedUsuario ? (
                <p className="text-xs text-slate-600 italic">Selecciona un usuario arriba para auditar sus preferencias.</p>
              ) : preferencias.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Este usuario no sigue ningún libro actualmente.</p>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {preferencias.map((p) => {
                    const localFormValue = alertasForm[p.id_libro] || "";
                    
                    return (
                      <div 
                        key={p.id_preferencia_usuario} 
                        className="bg-slate-950 border border-slate-900 rounded-xl p-4 space-y-3 hover:border-slate-800 transition-colors"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-200">{p.libro_titulo}</p>
                          <span className="text-[10px] text-slate-500">
                            Alerta activa: <span className="text-indigo-400 font-semibold">{p.estado_alerta_nombre || "Sin Alerta"}</span>
                          </span>
                        </div>

                        {/* Modificador de alerta */}
                        <div className="flex gap-2">
                          <select
                            value={localFormValue}
                            onChange={(e) =>
                              setAlertasForm((prev) => ({ ...prev, [p.id_libro]: e.target.value }))
                            }
                            className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-[11px] text-slate-300 focus:outline-none flex-1"
                          >
                            <option value="">Desactivar alerta</option>
                            {disponibilidades.map((d) => (
                              <option key={d.id_estado_disponibilidad} value={d.id_estado_disponibilidad}>
                                Alerta al pasar a: {d.tipo_estado_disponibilidad}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleActualizarAlerta(p.id_libro, p.libro_titulo)}
                            disabled={updatingPrefId === p.id_libro}
                            className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-semibold text-[10px] py-1.5 px-3 rounded-lg transition-all"
                          >
                            {updatingPrefId === p.id_libro ? "Guardando..." : "Guardar"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
