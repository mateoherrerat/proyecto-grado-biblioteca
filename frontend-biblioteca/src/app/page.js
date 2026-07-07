"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { autoresService } from "../services/api";

export default function Home() {
  const [autoresCount, setAutoresCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Obtener estadísticas de autores de forma dinámica al montar
  useEffect(() => {
    async function fetchStats() {
      try {
        const autores = await autoresService.getAll();
        setAutoresCount(autores.length);
      } catch (error) {
        // En caso de que el backend no esté encendido aún, manejamos el error silenciosamente
        console.error("No se pudo conectar con el backend de autores:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Encabezado */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
          Resumen de la Biblioteca
        </h2>
        <p className="text-slate-400 mt-1 text-sm md:text-base">
          Monitoreo y administración de libros, autores y préstamos estudiantiles.
        </p>
      </div>

      {/* Cuadrícula Bento (Tarjetas de métricas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Tarjeta 1: Autores */}
        <Link href="/autores" className="block group">
          <div className="h-full bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all duration-300 relative overflow-hidden active:scale-[0.98]">
            <div className="absolute top-0 right-0 p-3 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors">
              <svg className="w-24 h-24 -mr-6 -mt-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Autores Registrados
            </span>
            <div className="text-4xl font-extrabold text-white mt-4 flex items-baseline gap-2">
              {loading ? (
                <span className="h-9 w-12 bg-slate-800 animate-pulse rounded-lg inline-block"></span>
              ) : (
                autoresCount
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-3 group-hover:text-indigo-400 transition-colors flex items-center gap-1">
              Ver y gestionar autores
              <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Tarjeta 2: Libros */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden opacity-75">
          <div className="absolute top-0 right-0 p-3 text-slate-700/20">
            <svg className="w-24 h-24 -mr-6 -mt-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Total de Libros
          </span>
          <div className="text-4xl font-extrabold text-white mt-4">124</div>
          <div className="text-[11px] text-slate-500 mt-3">
            Módulo libros (próximamente)
          </div>
        </div>

        {/* Tarjeta 3: Préstamos */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden opacity-75">
          <div className="absolute top-0 right-0 p-3 text-slate-700/20">
            <svg className="w-24 h-24 -mr-6 -mt-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Préstamos Activos
          </span>
          <div className="text-4xl font-extrabold text-white mt-4">18</div>
          <div className="text-[11px] text-slate-500 mt-3">
            8 por vencer esta semana
          </div>
        </div>

        {/* Tarjeta 4: Multas */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden opacity-75">
          <div className="absolute top-0 right-0 p-3 text-slate-700/20">
            <svg className="w-24 h-24 -mr-6 -mt-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Multas Pendientes
          </span>
          <div className="text-4xl font-extrabold text-rose-500 mt-4">3</div>
          <div className="text-[11px] text-slate-500 mt-3">
            Requieren devolución inmediata
          </div>
        </div>

      </div>

      {/* Panel de Bienvenida */}
      <div className="bg-linear-to-br from-indigo-900/30 via-slate-900/40 to-slate-950 border border-indigo-950 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-white">¿Qué deseas hacer hoy?</h3>
          <p className="text-slate-300 text-sm max-w-xl">
            Puedes comenzar agregando nuevos autores de libros al catálogo. Los módulos de gestión de libros y préstamos escolares se integrarán progresivamente sobre esta misma interfaz.
          </p>
        </div>
        <Link
          href="/autores"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/35 transition-all text-sm shrink-0"
        >
          Gestionar Autores
        </Link>
      </div>
    </div>
  );
}
