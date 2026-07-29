"use client";

import React, { useState } from "react";
import { LayoutPublico } from "@/components/navegacion/layout-publico";
import { useAutenticacion } from "@/context/contexto-autenticacion";
import { User, Bell, Shield, Save, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function PaginaConfiguracion() {
  const { usuario, estaAutenticado } = useAutenticacion();
  const [nombre, setNombre] = useState(usuario?.nombre || "Usuario Lector");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifNovedades, setNotifNovedades] = useState(true);
  const [guardadoExito, setGuardadoExito] = useState(false);

  const manejarGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    setGuardadoExito(true);
    setTimeout(() => setGuardadoExito(false), 3000);
  };

  return (
    <LayoutPublico>
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {guardadoExito && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 flex items-center gap-3 font-bold text-xs shadow-2xs">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Configuración y preferencias actualizadas correctamente.</span>
          </div>
        )}

        <div className="mb-8 border-b border-border/80 pb-6 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
          <div>
            <h1 className="font-serif text-3xl font-extrabold text-foreground mb-1.5">
              Configuración y Perfil
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Administra tus datos personales, preferencias de notificación y seguridad de la cuenta en LaBiblioteca.
            </p>
          </div>
          {estaAutenticado && (
            <div className="flex items-center gap-3 bg-muted/50 rounded-2xl px-4 py-3 border border-border/60">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-extrabold text-xl flex items-center justify-center shadow-sm shrink-0">
                {(usuario?.nombre || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-extrabold text-foreground leading-tight">{usuario?.nombre || "Usuario Lector"}</p>
                <p className="text-xs text-muted-foreground font-medium">{usuario?.email}</p>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-0.5">{usuario?.rol || "lector"}</p>
              </div>
            </div>
          )}
        </div>

        <Tabs defaultValue="perfil" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md bg-muted/60 p-1 rounded-xl">
            <TabsTrigger value="perfil" className="gap-2 text-xs font-bold rounded-lg">
              <User className="h-4 w-4" /> Perfil
            </TabsTrigger>
            <TabsTrigger value="notificaciones" className="gap-2 text-xs font-bold rounded-lg">
              <Bell className="h-4 w-4" /> Notificaciones
            </TabsTrigger>
            <TabsTrigger value="seguridad" className="gap-2 text-xs font-bold rounded-lg">
              <Shield className="h-4 w-4" /> Seguridad
            </TabsTrigger>
          </TabsList>

          {/* Pestaña Perfil */}
          <TabsContent value="perfil">
            <Card className="shadow-xs border-border/80">
              <CardHeader>
                <CardTitle className="font-serif text-xl font-bold">Información del Lector</CardTitle>
                <CardDescription className="text-xs font-medium">
                  Actualiza tus datos personales registrados en la red de bibliotecas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={manejarGuardar} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre" className="text-xs font-bold">Nombre Completo</Label>
                      <Input
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="h-10 text-xs rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="correo" className="text-xs font-bold">Correo Institucional</Label>
                      <Input
                        id="correo"
                        value={usuario?.email || "usuario@correo.edu.co"}
                        disabled
                        className="h-10 text-xs rounded-xl bg-muted/60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="codigo" className="text-xs font-bold">Código de Carné</Label>
                      <Input
                        id="codigo"
                        value={usuario?.codigoBiblioteca || "BIB-2026-352"}
                        disabled
                        className="h-10 text-xs rounded-xl bg-muted/60 font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rol" className="text-xs font-bold">Tipo de Usuario</Label>
                      <Input
                        id="rol"
                        value={usuario?.rol ? usuario.rol.toUpperCase() : "LECTOR"}
                        disabled
                        className="h-10 text-xs rounded-xl bg-muted/60 font-bold text-primary"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/60 flex justify-end">
                    <Button type="submit" size="sm" className="gap-2 font-bold rounded-xl shadow-2xs">
                      <Save className="h-4 w-4" /> Guardar Cambios
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña Notificaciones */}
          <TabsContent value="notificaciones">
            <Card className="shadow-xs border-border/80">
              <CardHeader>
                <CardTitle className="font-serif text-xl font-bold">Preferencias de Avisos</CardTitle>
                <CardDescription className="text-xs font-medium">
                  Elige cómo quieres recibir las alertas de vencimiento y confirmaciones de reservas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold">Alertas por Correo Electrónico</Label>
                    <p className="text-[11px] text-muted-foreground font-medium">Recordatorios 2 días antes del vencimiento de devoluciones.</p>
                  </div>
                  <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-4">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold">Avisos por SMS</Label>
                    <p className="text-[11px] text-muted-foreground font-medium">Notificaciones de confirmación de reserva en tu teléfono.</p>
                  </div>
                  <Switch checked={notifSms} onCheckedChange={setNotifSms} />
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-4">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold">Boletín de Nuevos Libros</Label>
                    <p className="text-[11px] text-muted-foreground font-medium">Recomendaciones semanales sobre adquisiciones del catálogo.</p>
                  </div>
                  <Switch checked={notifNovedades} onCheckedChange={setNotifNovedades} />
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-4">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold">Recordatorio de Vencimiento de Préstamo</Label>
                    <p className="text-[11px] text-muted-foreground font-medium">Alerta 48h antes de que venza el plazo de tu préstamo activo.</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="pt-4 border-t border-border/60 flex justify-end">
                  <Button size="sm" onClick={manejarGuardar} className="gap-2 font-bold rounded-xl shadow-2xs">
                    <Save className="h-4 w-4" /> Guardar Preferencias
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña Seguridad */}
          <TabsContent value="seguridad">
            <Card className="shadow-xs border-border/80">
              <CardHeader>
                <CardTitle className="font-serif text-xl font-bold">Contraseña y Accesos</CardTitle>
                <CardDescription className="text-xs font-medium">
                  Cambia tu clave de acceso institucional o gestiona tus credenciales.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={manejarGuardar} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="actual" className="text-xs font-bold">Contraseña Actual</Label>
                    <Input id="actual" type="password" placeholder="••••••••" className="h-10 text-xs rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nueva" className="text-xs font-bold">Nueva Contraseña</Label>
                    <Input id="nueva" type="password" placeholder="••••••••" className="h-10 text-xs rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmar" className="text-xs font-bold">Confirmar Nueva Contraseña</Label>
                    <Input id="confirmar" type="password" placeholder="••••••••" className="h-10 text-xs rounded-xl" />
                  </div>

                  <div className="pt-4 border-t border-border/60 flex justify-end">
                    <Button type="submit" size="sm" className="gap-2 font-bold rounded-xl shadow-2xs">
                      <Save className="h-4 w-4" /> Actualizar Contraseña
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </LayoutPublico>
  );
}
