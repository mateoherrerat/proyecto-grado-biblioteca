"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAutenticacion } from "@/context/contexto-autenticacion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registrarse } = useAutenticacion();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const redirectUrl = searchParams.get("redirect");
  const accion = searchParams.get("accion");
  const libroId = searchParams.get("libroId");
  const tituloLibro = searchParams.get("titulo") || "Libro Seleccionado";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre || !email) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (!password || password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    setCargando(true);

    try {
      const exito = await registrarse(nombre, email, "", password);
      if (exito) {
        if (accion === "solicitar" && libroId) {
          const prestamos = JSON.parse(localStorage.getItem("bookshub_prestamos_usuario") || "[]");
          prestamos.unshift({
            id: `prest-${Date.now()}`,
            id_libro: libroId,
            titulo: tituloLibro,
            autor: "Autor General",
            sede: "Sede Principal",
            estado: "Pendiente de retiro",
            fechaSolicitud: new Date().toLocaleDateString("es-CO"),
            fechaLimite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("es-CO"),
          });
          localStorage.setItem("bookshub_prestamos_usuario", JSON.stringify(prestamos));
          router.push("/mis-prestamos?solicitudExito=true");
        } else if (accion === "guardar" && libroId) {
          const favs = JSON.parse(localStorage.getItem("bookshub_favoritos") || "[]");
          if (!favs.some((f: any) => String(f.id) === String(libroId))) {
            favs.push({ id: libroId, titulo: tituloLibro, fechaGuardado: new Date().toISOString() });
            localStorage.setItem("bookshub_favoritos", JSON.stringify(favs));
          }
          router.push(redirectUrl || "/mis-prestamos");
        } else {
          router.push(redirectUrl || "/mis-prestamos");
        }
      } else {
        setError("No se pudo completar el registro.");
      }
    } catch (err) {
      setError("Error durante el registro.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          
          {/* Header Consistente con LaBiblioteca */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex flex-row items-center justify-center gap-2.5 font-medium">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-2xs">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-serif text-xl font-bold text-foreground">
                LaBiblioteca
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground mt-1">
              Crear una cuenta
            </h1>
            <div className="text-center text-xs text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link href={`/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`} className="underline underline-offset-4 font-bold text-primary hover:text-primary/80">
                Iniciar Sesión
              </Link>
            </div>
          </div>

          {accion === "solicitar" && (
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold text-center">
              Crea tu cuenta para completar la solicitud de préstamo de "{tituloLibro}".
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre" className="text-xs font-bold">Nombre Completo</Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Juan Carlos Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs font-bold">Correo Institucional</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@correo.edu.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-xs font-bold">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <Button type="submit" disabled={cargando} className="w-full h-10 font-bold text-xs rounded-xl mt-1 shadow-2xs">
              {cargando ? "Creando Cuenta..." : "Completar Registro"}
            </Button>
          </div>

        </div>
      </form>

      {/* Términos y privacidad */}
      <div className="text-muted-foreground text-center text-[11px] text-balance leading-relaxed [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        Al continuar, aceptas nuestros{" "}
        <a href="#">Términos de Servicio</a> y{" "}
        <a href="#">Políticas de Privacidad</a>.
      </div>
    </div>
  );
}
