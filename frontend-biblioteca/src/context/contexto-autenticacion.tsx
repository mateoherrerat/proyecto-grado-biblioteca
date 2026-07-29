"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type RolUsuario = "invitado" | "lector" | "administrador";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  avatar?: string;
  codigoBiblioteca?: string;
}

interface ContextoAutenticacionTipo {
  usuario: Usuario | null;
  rol: RolUsuario;
  estaAutenticado: boolean;
  cargando: boolean;
  iniciarSesion: (email: string, password?: string, rol?: RolUsuario) => Promise<boolean>;
  registrarse: (nombre: string, email: string, codigo: string, password?: string) => Promise<boolean>;
  cerrarSesion: () => Promise<void>;
  cambiarRol: (nuevoRol: RolUsuario) => void;
}

const ContextoAutenticacion = createContext<ContextoAutenticacionTipo | undefined>(undefined);

const CLAVE_STORAGE_USUARIO = "bookshub_usuario_sesion";

export function ProveedorAutenticacion({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  // Escuchar la sesión de Supabase Auth
  useEffect(() => {
    // 1. Obtener la sesión activa de Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        const userEmail = u.email || "";
        const esAdmin = userEmail.toLowerCase().includes("admin");
        const rolAsignado: RolUsuario = (u.user_metadata?.rol as RolUsuario) || (esAdmin ? "administrador" : "lector");

        setUsuario({
          id: u.id,
          nombre: u.user_metadata?.nombre || userEmail.split("@")[0],
          email: userEmail,
          rol: rolAsignado,
          codigoBiblioteca: u.user_metadata?.codigoBiblioteca || `BIB-2026-${Math.floor(100 + Math.random() * 900)}`,
        });
      } else {
        // Cargar fallback local o dejar desautenticado por defecto
        try {
          const sesionLocal = localStorage.getItem(CLAVE_STORAGE_USUARIO);
          if (sesionLocal) {
            setUsuario(JSON.parse(sesionLocal));
          } else {
            setUsuario(null);
          }
        } catch {
          setUsuario(null);
        }
      }
      setCargando(false);
    });

    // 2. Suscribirse a cambios de estado de autenticación (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        const userEmail = u.email || "";
        const esAdmin = userEmail.toLowerCase().includes("admin");
        const rolAsignado: RolUsuario = (u.user_metadata?.rol as RolUsuario) || (esAdmin ? "administrador" : "lector");

        const nuevoUsuario: Usuario = {
          id: u.id,
          nombre: u.user_metadata?.nombre || userEmail.split("@")[0],
          email: userEmail,
          rol: rolAsignado,
          codigoBiblioteca: u.user_metadata?.codigoBiblioteca || `BIB-2026-${Math.floor(100 + Math.random() * 900)}`,
        };
        setUsuario(nuevoUsuario);
        localStorage.setItem(CLAVE_STORAGE_USUARIO, JSON.stringify(nuevoUsuario));
      } else {
        setUsuario(null);
        localStorage.removeItem(CLAVE_STORAGE_USUARIO);
      }
      setCargando(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const rol: RolUsuario = usuario?.rol || "invitado";
  const estaAutenticado = usuario !== null && usuario.rol !== "invitado";

  const iniciarSesion = async (email: string, password?: string, rolSolicitado?: RolUsuario): Promise<boolean> => {
    if (!email) return false;

    try {
      // Intentar iniciar sesión real con Supabase
      if (password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data.user) {
          const userEmail = data.user.email || email;
          const esAdmin = userEmail.toLowerCase().includes("admin");
          const rolFinal: RolUsuario = rolSolicitado || (esAdmin ? "administrador" : "lector");

          const nuevoUsuario: Usuario = {
            id: data.user.id,
            nombre: data.user.user_metadata?.nombre || userEmail.split("@")[0],
            email: userEmail,
            rol: rolFinal,
            codigoBiblioteca: data.user.user_metadata?.codigoBiblioteca || `BIB-2026-${Math.floor(100 + Math.random() * 900)}`,
          };

          setUsuario(nuevoUsuario);
          localStorage.setItem(CLAVE_STORAGE_USUARIO, JSON.stringify(nuevoUsuario));
          return true;
        }
      }
    } catch (err) {
      console.warn("Supabase Auth fallback:", err);
    }

    // Fallback de inicio de sesión directo para prototipo
    const nombreUsuario = email.split("@")[0].replace(".", " ");
    const esAdmin = email.toLowerCase().includes("admin");
    const rolAsignado: RolUsuario = rolSolicitado || (esAdmin ? "administrador" : "lector");

    const nuevoUsuario: Usuario = {
      id: `usr-${Date.now()}`,
      nombre: nombreUsuario.charAt(0).toUpperCase() + nombreUsuario.slice(1),
      email,
      rol: rolAsignado,
      codigoBiblioteca: `BIB-2026-${Math.floor(100 + Math.random() * 900)}`,
    };

    setUsuario(nuevoUsuario);
    localStorage.setItem(CLAVE_STORAGE_USUARIO, JSON.stringify(nuevoUsuario));
    return true;
  };

  const registrarse = async (nombre: string, email: string, codigo: string, password?: string): Promise<boolean> => {
    if (!email || !nombre) return false;

    try {
      if (password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nombre,
              codigoBiblioteca: codigo,
              rol: "lector",
            },
          },
        });

        if (!error && data.user) {
          const nuevoUsuario: Usuario = {
            id: data.user.id,
            nombre,
            email,
            rol: "lector",
            codigoBiblioteca: codigo || `BIB-2026-${Math.floor(100 + Math.random() * 900)}`,
          };
          setUsuario(nuevoUsuario);
          localStorage.setItem(CLAVE_STORAGE_USUARIO, JSON.stringify(nuevoUsuario));
          return true;
        }
      }
    } catch (err) {
      console.warn("Supabase SignUp fallback:", err);
    }

    const nuevoUsuario: Usuario = {
      id: `usr-${Date.now()}`,
      nombre,
      email,
      rol: "lector",
      codigoBiblioteca: codigo || `BIB-2026-${Math.floor(100 + Math.random() * 900)}`,
    };

    setUsuario(nuevoUsuario);
    localStorage.setItem(CLAVE_STORAGE_USUARIO, JSON.stringify(nuevoUsuario));
    return true;
  };

  const cerrarSesion = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Error signout Supabase:", e);
    }
    setUsuario(null);
    localStorage.removeItem(CLAVE_STORAGE_USUARIO);
  };

  const cambiarRol = (nuevoRol: RolUsuario) => {
    if (usuario) {
      const u = { ...usuario, rol: nuevoRol };
      setUsuario(u);
      localStorage.setItem(CLAVE_STORAGE_USUARIO, JSON.stringify(u));
    }
  };

  return (
    <ContextoAutenticacion.Provider
      value={{
        usuario,
        rol,
        estaAutenticado,
        cargando,
        iniciarSesion,
        registrarse,
        cerrarSesion,
        cambiarRol,
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
}

export function useAutenticacion() {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto) {
    throw new Error("useAutenticacion debe usarse dentro de un ProveedorAutenticacion");
  }
  return contexto;
}
