import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sistema de Biblioteca - INEM",
  description: "Proyecto de grado de biblioteca escolar con Node.js, Express, PostgreSQL y Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="h-full bg-slate-950 text-slate-100 antialiased flex flex-col md:flex-row overflow-hidden">
        {/* Barra Lateral (Sidebar) */}
        <aside className="w-full md:w-64 bg-slate-900/40 backdrop-blur-md border-b md:border-b-0 md:border-r border-slate-800/80 flex flex-col shrink-0">
          {/* Logo / Cabecera */}
          <div className="p-6 border-b border-slate-800/60 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
              B
            </div>
            <div>
              <h1 className="font-semibold text-base tracking-tight bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Biblioteca INEM
              </h1>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                Proyecto de Grado
              </p>
            </div>
          </div>

          {/* Menú de Navegación */}
          <nav className="flex-1 p-4 space-y-1.5">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/40 active:scale-[0.98] transition-all group"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium text-sm">Dashboard</span>
            </Link>

            <Link
              href="/autores"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/40 active:scale-[0.98] transition-all group"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="font-medium text-sm">Autores</span>
            </Link>

            <Link 
              href="/libros" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/40 active:scale-[0.98] transition-all group"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="font-medium text-sm">Libros</span>
            </Link>

            <Link 
              href="/sedes" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/40 active:scale-[0.98] transition-all group"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-sm">Sedes</span>
            </Link>

            <Link 
              href="/multas" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/40 active:scale-[0.98] transition-all group"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-sm">Multas</span>
            </Link>

            <Link 
              href="/publicaciones" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/40 active:scale-[0.98] transition-all group"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6m-6 4h3" />
              </svg>
              <span className="font-medium text-sm">Publicaciones</span>
            </Link>

            <Link 
              href="/configuracion" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/40 active:scale-[0.98] transition-all group"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-sm">Configuración</span>
            </Link>
          </nav>

          {/* Footer del Sidebar */}
          <div className="p-4 border-t border-slate-800/60 text-center text-xs text-slate-500">
            Base de datos: <span className="text-emerald-500 font-semibold">PostgreSQL</span>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
