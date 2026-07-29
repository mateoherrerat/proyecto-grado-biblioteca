const SUPABASE_STORAGE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://trkoyzcmgoflfrwleboo.supabase.co";

/**
 * Obtiene la URL exacta de la portada del libro proveniente de la base de datos o Supabase Storage.
 * Retorna null si el libro no posee imagen registrada.
 */
export function obtenerImagenPortada(libro?: {
  portada?: string | null;
  imagenPortada?: string | null;
} | null): string | null {
  if (!libro) return null;
  const p = libro.portada || libro.imagenPortada;

  if (!p || typeof p !== "string" || p.trim() === "") {
    return null;
  }

  const portadaTrim = p.trim();

  // Si ya es una URL HTTP/HTTPS completa
  if (portadaTrim.startsWith("http://") || portadaTrim.startsWith("https://")) {
    return portadaTrim;
  }

  // Construir la URL del bucket público 'covers' en Supabase Storage
  return `${SUPABASE_STORAGE_URL}/storage/v1/object/public/covers/${encodeURIComponent(portadaTrim)}`;
}
