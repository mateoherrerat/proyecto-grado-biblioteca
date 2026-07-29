/**
 * Utilidad de búsqueda difusa (Fuzzy Search) para tolerancia a errores ortográficos y tildes.
 */

/**
 * Normaliza un texto removiendo tildes, diacríticos y convirtiéndolo a minúsculas.
 */
export function normalizarTexto(texto: string = ""): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Calcula la distancia Levenshtein entre dos cadenas.
 */
export function distanciaLevenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + costo
      );
    }
  }

  return matrix[a.length][b.length];
}

/**
 * Evalúa si un término de búsqueda coincide con un texto objetivo,
 * soportando sin tildes, coincidencias parciales y tolerando errores de ortografía.
 */
export function coincideFuzzy(query: string = "", textoObjetivo: string = ""): boolean {
  const normQuery = normalizarTexto(query);
  const normTexto = normalizarTexto(textoObjetivo);

  if (!normQuery) return true;
  if (!normTexto) return false;

  // 1. Coincidencia exacta de subcadena (ignorando tildes y mayúsculas)
  if (normTexto.includes(normQuery)) return true;

  // 2. Tokenización en palabras
  const palabrasQuery = normQuery.split(/\s+/).filter(Boolean);
  const palabrasObjetivo = normTexto.split(/\s+/).filter(Boolean);

  // Si alguna palabra clave de la búsqueda es substring directo de alguna palabra del objetivo
  const todasPalabrasCoinciden = palabrasQuery.every((qWord) => {
    return palabrasObjetivo.some((tWord) => {
      // Substring directo
      if (tWord.includes(qWord) || qWord.includes(tWord)) return true;

      // Si la palabra tiene al menos 3 caracteres, permitir hasta 1 error (ej: "orwel" vs "orwell")
      // Si la palabra tiene al menos 6 caracteres, permitir hasta 2 errores (ej: "servantes" vs "cervantes")
      const dist = distanciaLevenshtein(qWord, tWord);
      if (qWord.length >= 6 && dist <= 2) return true;
      if (qWord.length >= 3 && dist <= 1) return true;

      return false;
    });
  });

  return todasPalabrasCoinciden;
}
