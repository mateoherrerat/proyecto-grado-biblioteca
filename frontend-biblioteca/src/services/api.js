const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Realiza peticiones HTTP al backend de Express administrando el formato Envelope Pattern.
 * 
 * @param {string} endpoint - El path del endpoint a consultar (ej: '/autores').
 * @param {object} [options] - Opciones opcionales de la petición HTTP (method, headers, body).
 * @returns {Promise<any>} Los datos devueltos en el campo 'data' del JSON de éxito.
 * @throws {Error} Si el estado de la respuesta no es 2xx o hay problemas de red.
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Ocurrió un error inesperado en el servidor.');
    }
    
    return result.data;
  } catch (err) {
    if (err.name === 'TypeError' || err.message.includes('fetch')) {
      throw new Error('No se pudo establecer conexión con el servidor. Verifica que el backend esté en ejecución.');
    }
    throw err;
  }
};


export const autoresService = {
  /**
   * Obtiene la lista de todos los autores registrados.
   * 
   * @returns {Promise<Array<object>>}
   */
  getAll: () => fetchAPI('/autores'),
  
  /**
   * Obtiene un autor específico por su ID.
   * 
   * @param {number|string} id - ID del autor (id_autor).
   * @returns {Promise<object>}
   */
  getById: (id) => fetchAPI(`/autores/${id}`),
  
  /**
   * Registra un nuevo autor en la base de datos.
   * 
   * @param {string} nombre - El nombre del autor.
   * @returns {Promise<object>} El autor creado.
   */
  create: (nombre) => fetchAPI('/autores', {
    method: 'POST',
    body: JSON.stringify({ nombre }),
  }),
  
  /**
   * Actualiza el nombre de un autor existente.
   * 
   * @param {number|string} id - ID del autor.
   * @param {string} nombre - Nuevo nombre.
   * @returns {Promise<object>} El autor actualizado.
   */
  update: (id, nombre) => fetchAPI(`/autores/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ nombre }),
  }),
  
  /**
   * Elimina un autor si no tiene libros asociados.
   * 
   * @param {number|string} id - ID del autor.
   * @returns {Promise<object>} El autor eliminado.
   */
  delete: (id) => fetchAPI(`/autores/${id}`, {
    method: 'DELETE',
  }),
};

export const librosService = {
  /**
   * Obtiene la lista de todos los libros registrados, opcionalmente filtrados.
   * 
   * @param {string} [filter] - Filtro de búsqueda por título o de editorial.
   * @returns {Promise<Array<object>>}
   */
  getAll: (filter) => fetchAPI(filter ? `/libros?filter=${encodeURIComponent(filter)}` : '/libros'),
  
  /**
   * Obtiene los detalles de un libro específico por su ID.
   * 
   * @param {number|string} id - ID del libro (id_libro).
   * @returns {Promise<object>}
   */
  getById: (id) => fetchAPI(`/libros/${id}`),
  
  /**
   * Registra un nuevo libro en la base de datos.
   * 
   * @param {object} libroData - Datos del libro a registrar.
   * @returns {Promise<object>} El libro creado.
   */
  create: (libroData) => fetchAPI('/libros', {
    method: 'POST',
    body: JSON.stringify(libroData),
  }),
  
  /**
   * Actualiza la información de un libro.
   * 
   * @param {number|string} id - ID del libro.
   * @param {object} libroData - Nuevos datos del libro.
   * @returns {Promise<object>} El libro modificado.
   */
  update: (id, libroData) => fetchAPI(`/libros/${id}`, {
    method: 'PUT',
    body: JSON.stringify(libroData),
  }),
  
  /**
   * Elimina un libro del catálogo general.
   * 
   * @param {number|string} id - ID del libro a eliminar.
   * @returns {Promise<object>} El libro eliminado.
   */
  delete: (id) => fetchAPI(`/libros/${id}`, {
    method: 'DELETE',
  }),
};

export const librosAutoresService = {
  /**
   * Obtiene la lista de todos los autores asociados a un libro específico.
   * 
   * @param {number|string} idLibro - ID del libro.
   * @returns {Promise<Array<object>>} Lista de autores asociados.
   */
  getAutoresByLibro: (idLibro) => fetchAPI(`/libros/${idLibro}/autores`),
  
  /**
   * Crea una nueva asociación N:M vinculando un autor a un libro.
   * 
   * @param {number|string} idAutor - ID del autor.
   * @param {number|string} idLibro - ID del libro.
   * @returns {Promise<object>} La relación creada.
   */
  associate: (idAutor, idLibro) => fetchAPI('/libros-autores', {
    method: 'POST',
    body: JSON.stringify({ id_autor: idAutor, id_libro: idLibro }),
  }),
  
  /**
   * Rompe la relación entre un autor y un libro.
   * 
   * @param {number|string} idRelation - ID de la relación (id_autor_libro).
   * @returns {Promise<object>} La relación eliminada.
   */
  disassociate: (idRelation) => fetchAPI(`/libros-autores/${idRelation}`, {
    method: 'DELETE',
  }),
};

export const bibliotecasService = {
  /**
   * Obtiene el listado completo de sedes físicas registradas.
   * 
   * @returns {Promise<Array<object>>}
   */
  getAll: () => fetchAPI('/bibliotecas'),
  
  /**
   * Obtiene los detalles de una sede física específica por su ID.
   * 
   * @param {number|string} id - ID de la sede (id_biblioteca).
   * @returns {Promise<object>}
   */
  getById: (id) => fetchAPI(`/bibliotecas/${id}`),
  
  /**
   * Registra una nueva sede física en la base de datos.
   * 
   * @param {object} data - Datos de la sede a crear.
   * @returns {Promise<object>} La sede creada.
   */
  create: (data) => fetchAPI('/bibliotecas', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  /**
   * Actualiza la información de una sede física existente.
   * 
   * @param {number|string} id - ID de la sede.
   * @param {object} data - Nuevos datos.
   * @returns {Promise<object>} La sede modificada.
   */
  update: (id, data) => fetchAPI(`/bibliotecas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  /**
   * Elimina una sede física de la base de datos.
   * 
   * @param {number|string} id - ID de la sede a eliminar (id_biblioteca).
   * @returns {Promise<object>} La sede eliminada.
   */
  delete: (id) => fetchAPI(`/bibliotecas/${id}`, {
    method: 'DELETE',
  }),
};

export const multasService = {
  /**
   * Obtiene la lista de todas las multas que aún no han sido pagadas.
   * 
   * @returns {Promise<Array<object>>} Listado de multas pendientes.
   */
  getPendientes: () => fetchAPI('/multas/pendientes'),

  /**
   * Registra la fecha de pago y cambia el estado de una multa a "Pagada".
   * 
   * @param {number|string} id - ID de la multa (id_multa).
   * @returns {Promise<object>} La multa pagada y actualizada.
   */
  registrarPago: (id) => fetchAPI(`/multas/${id}/pago`, {
    method: 'PATCH',
  }),
};

export const publicacionesService = {
  /**
   * Obtiene la lista de todas las publicaciones registradas.
   * 
   * @returns {Promise<Array<object>>} Listado de publicaciones.
   */
  getAll: () => fetchAPI('/publicaciones'),

  /**
   * Crea una nueva publicación en el sistema.
   * 
   * @param {object} data - Datos de la publicación (id_autor, descripcion, slug, fecha).
   * @returns {Promise<object>} La publicación creada.
   */
  create: (data) => fetchAPI('/publicaciones', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  /**
   * Obtiene la lista de libros vinculados a una publicación.
   * 
   * @param {number|string} idNovedad - ID de la publicación.
   * @returns {Promise<Array<object>>} Libros asociados.
   */
  getLibros: (idNovedad) => fetchAPI(`/publicaciones/${idNovedad}/libros`),

  /**
   * Vincula un libro a una publicación destacada.
   * 
   * @param {number|string} idNovedad - ID de la publicación.
   * @param {number|string} idLibro - ID del libro.
   * @returns {Promise<object>} La relación creada.
   */
  vincularLibro: (idNovedad, idLibro) => fetchAPI('/publicaciones/lib', {
    method: 'POST',
    body: JSON.stringify({ id_novedad: idNovedad, id_libro: idLibro }),
  }),

  /**
   * Desvincula un libro de una publicación.
   * 
   * @param {number|string} idNovedad - ID de la publicación.
   * @param {number|string} idLibro - ID del libro a desvincular.
   * @returns {Promise<object>} La relación eliminada.
   */
  desvincularLibro: (idNovedad, idLibro) => fetchAPI('/novedades/desvincular', {
    method: 'DELETE',
    body: JSON.stringify({ id_novedad: idNovedad, id_libro: idLibro }),
  }),
};

export const resenasService = {
  getByLibro: (idLibro) => fetchAPI(`/libros/${idLibro}/resenas`),
  crearResenaLibro: (data) => fetchAPI('/libros/resenas', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getByBiblioteca: (idBiblioteca) => fetchAPI(`/bibliotecas/${idBiblioteca}/resenas`),
  getPorBiblioteca: (idBiblioteca) => fetchAPI(`/bibliotecas/${idBiblioteca}/resenas`),
  crear: (data) => fetchAPI('/bibliotecas/resenas', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  crearResenaBiblioteca: (data) => fetchAPI('/bibliotecas/resenas', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export const usuariosService = {
  getAll: () => fetchAPI('/usuarios'),
};

export const configService = {
  getEstados: () => fetchAPI('/config/estados'),
  crearEstado: (tipo) => fetchAPI('/config/estados', {
    method: 'POST',
    body: JSON.stringify({ tipo_estado: tipo }),
  }),
  getDisponibilidades: () => fetchAPI('/config/disponibilidad'),
};

export const preferenciasService = {
  getByUsuario: (idUsuario) => fetchAPI(`/preferencias_usuarios/${idUsuario}`),
  updateAlerta: (idUsuario, idLibro, idEstado) => fetchAPI('/preferencias_usuarios', {
    method: 'PATCH',
    body: JSON.stringify({
      id_usuario: idUsuario,
      id_libro: idLibro,
      id_estado_disponibilidad_libro: idEstado
    }),
  }),
};

export const prestamosService = {
  getAll: () => fetchAPI('/prestamos'),
  getByUsuario: (idUsuario) => fetchAPI(`/prestamos/usuario/${idUsuario}`),
  crear: (data) => fetchAPI('/prestamos', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  devolver: (id) => fetchAPI(`/prestamos/${id}/devolucion`, {
    method: 'PATCH',
  }),
};







