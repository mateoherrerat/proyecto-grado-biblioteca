"use client";

import { useState, useEffect } from "react";
import { multasService } from "../../services/api";

export default function MultasPage() {
  const [multas, setMultas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Cargar multas al montar el componente
  useEffect(() => {
    cargarMultas();
  }, []);

  const cargarMultas = async () => {
    setLoading(true);
    try {
      const data = await multasService.getPendientes();
      setMultas(data);
    } catch (error) {
      showFeedback("error", "No se pudieron obtener las multas. Verifica la conexión con el servidor.");
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

  const handleRegistrarPago = async (id, usuario, monto) => {
    if (!confirm(`¿Confirmas el recibo del pago de $${monto} por parte de ${usuario}? Esto marcará la multa como pagada.`)) {
      return;
    }

    setProcessingId(id);
    try {
      await multasService.registrarPago(id);
      showFeedback("success", `Pago registrado correctamente. La multa de ${usuario} ha sido pagada.`);
      // Eliminar de la lista local
      setMultas((prev) => prev.filter((m) => m.id_multa !== id));
    } catch (error) {
      showFeedback("error", error.message || "No se pudo registrar el pago de la multa.");
    } finally {
      setProcessingId(null);
    }
  };

  // Filtrado local
  const multasFiltradas = multas.filter((m) => {
    const term = searchTerm.toLowerCase();
    const usuario = m.usuario_nombre ? m.usuario_nombre.toLowerCase() : "";
    const correo = m.usuario_correo ? m.usuario_correo.toLowerCase() : "";
    const libro = m.libro_titulo ? m.libro_titulo.toLowerCase() : "";
    const desc = m.descripcion ? m.descripcion.toLowerCase() : "";
    
    return usuario.includes(term) || correo.includes(term) || libro.includes(term) || desc.includes(term);
  });

  // Métricas
  const totalAdeudado = multas.reduce((acc, m) => acc + Number(m.monto || 0), 0);

  // Formato de moneda colombiana / pesos
  const formatearDinero = (monto) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(monto);
  };

  // Formato de fechas
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "N/A";
    const date = new Date(fechaStr);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Encabezado */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Multas y Penalizaciones</h2>
        <p className="text-slate-400 mt-1 text-sm">
          Administra los cobros pendientes de la biblioteca. Registra pagos y visualiza penalizaciones por devoluciones tardías o daños en ejemplares.
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

      {/* Grid de Métricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Total Multas */}
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Multas Pendientes</span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-4xl font-extrabold text-white tracking-tight">{multas.length}</span>
            <span className="text-slate-500 text-xs">casos activos</span>
          </div>
        </div>

        {/* Total Adeudado */}
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recaudo Pendiente</span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-4xl font-extrabold text-indigo-400 tracking-tight">{formatearDinero(totalAdeudado)}</span>
            <span className="text-slate-500 text-xs">COP total</span>
          </div>
        </div>

        {/* Estado del sistema */}
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between sm:col-span-2 md:col-span-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Acción Administrativa</span>
          <div className="mt-4 flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></div>
            <span className="text-sm text-slate-300 font-medium">Listas para ser cobradas</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtro y Buscador */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/10 border border-slate-800/40 rounded-2xl p-5">
        <div>
          <h3 className="font-semibold text-base text-white">Listado de Multas Activas</h3>
          <p className="text-xs text-slate-500 mt-0.5">Mostrando {multasFiltradas.length} multas de acuerdo al criterio de búsqueda</p>
        </div>
        
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar por usuario, correo o libro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Listado Principal */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="h-9 w-9 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full mx-auto"></div>
          <p className="text-slate-500 text-xs">Consultando base de datos de multas...</p>
        </div>
      ) : multasFiltradas.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/5">
          <svg className="w-14 h-14 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-400 font-semibold text-sm">¡Excelente! No hay multas pendientes</p>
          <p className="text-slate-600 text-xs mt-1">Todos los usuarios están al día con sus devoluciones.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {multasFiltradas.map((m) => (
            <div 
              key={m.id_multa}
              className="bg-slate-900/30 border border-slate-800/80 hover:border-slate-700/60 rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Cabecera Tarjeta: Monto y ID Prestamo */}
                <div className="flex items-start justify-between gap-3">
                  <div className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-xl text-lg font-bold">
                    {formatearDinero(m.monto)}
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2 py-1 rounded-md text-slate-400 uppercase tracking-wider font-semibold">
                    Préstamo #{m.id_prestamo}
                  </span>
                </div>

                {/* Detalles del Usuario y el Libro */}
                <div className="space-y-2.5">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuario Responsable</h4>
                    <p className="text-slate-100 text-sm font-bold mt-0.5">{m.usuario_nombre || "Usuario Desconocido"}</p>
                    <p className="text-slate-400 text-xs">{m.usuario_correo || "Sin correo electrónico"}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Libro Involucrado</h4>
                    <p className="text-slate-200 text-xs font-semibold mt-0.5">{m.libro_titulo || "Ejemplar del catálogo"}</p>
                  </div>

                  {m.descripcion && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Motivo</h4>
                      <p className="text-slate-400 text-xs mt-0.5 italic">"{m.descripcion}"</p>
                    </div>
                  )}

                  {/* Fechas del préstamo */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/40 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Fecha de Préstamo:</span>
                      <span className="text-slate-300 font-medium">{formatearFecha(m.fecha_prestamo)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Devolución Esperada:</span>
                      <span className="text-rose-400/80 font-medium">{formatearFecha(m.fecha_devolucion_esperada)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de Pago */}
              <div className="pt-3 border-t border-slate-800/40">
                <button
                  onClick={() => handleRegistrarPago(m.id_multa, m.usuario_nombre, formatearDinero(m.monto))}
                  disabled={processingId === m.id_multa}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white font-medium text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2"
                >
                  {processingId === m.id_multa ? (
                    <>
                      <div className="h-3 w-3 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                      Procesando pago...
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Registrar Recibo de Pago
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
