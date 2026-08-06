<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Reglas Generales

---

## 1. Antes de escribir código

- **No asumas, verifica.** Si una librería o framework puede tener cambios recientes o breaking changes respecto a lo que "sabes", revisa la documentación local del proyecto (`node_modules`, `README`) antes de escribir código. Si no encuentras documentación local suficiente, búscala en la web. Siempre trabaja asumiendo la última versión estable de la librería o framework, salvo que el proyecto especifique lo contrario.
- **Explora y reutiliza antes de crear.** Antes de crear un componente, función, hook, utilidad o archivo nuevo, busca si ya existe algo con la misma funcionalidad en el proyecto. Si existe, extiéndelo o reutilízalo en vez de duplicarlo.
- **Entiende el patrón de capas del proyecto** (rutas → controladores → servicios → repositorios, o el que aplique) y respétalo. No mezcles responsabilidades entre capas.
- **No ejecutes un build completo por cada cambio.** Como mucho, verifica que no haya errores (lint, type-check, o el chequeo más liviano disponible) del alcance modificado.
- **Antes de aplicar un cambio, evalúa que no rompa algo que ya esté funcionando.**
- **Si algo no te queda claro, pregunta antes de actuar.** No asumas ni infieras lo que crees que quiero — pregunta exactamente qué es lo que no entiendes.

## 2. Principio DRY (No te repitas)

- **Siempre que algo se repita, ábstralo.** Si una función, hook, validación o bloque de UI se repite, abstráelo inmediatamente (utilidad, hook personalizado, componente compartido) — no lo dejes duplicado "por ahora".
- Antes de escribir un header, sidebar, formulario o cualquier estructura repetible, revisa si debería vivir en un layout o componente compartido en lugar de duplicarse por página.

## 3. Tamaño y organización de archivos

- Mantén los archivos entre ~300 y 400 líneas como límite razonable. Si un archivo crece más allá de eso, es señal de que necesita dividirse.
- Arquitectura modular: cada archivo/módulo con una responsabilidad clara.
- **Imports limpios y ordenados**: no dejes imports sin usar ni elimines imports necesarios por accidente al refactorizar. Mantenlos agrupados y en un orden consistente. Revisa el archivo completo después de mover o renombrar cosas.
- Los archivos deben mantenerse ordenados y limpios: no agregues código, archivos, dependencias o abstracciones "por agregar" — solo lo que realmente aporte al cambio solicitado.

## 4. Nomenclatura

Un solo criterio para todo el proyecto, de modo que el nombre de un archivo, su componente/función y las variables relacionadas se puedan reconocer entre sí sin ambigüedad:

- **Archivos**: `kebab-case` (ej. `tarjeta-libro.tsx`, `autores.controller.js`).
- **Componentes**: `PascalCase`, y debe coincidir con el nombre del archivo que lo contiene (ej. `tarjeta-libro.tsx` → `TarjetaLibro`).
- **Funciones y variables**: `camelCase`.
- **Hooks personalizados**: `camelCase` con prefijo `use` (ej. `useAutenticacion`).
- **Un solo idioma para todo**: archivos, funciones, variables y nombres de dominio en el mismo idioma en todo el proyecto — si ya está en español, sigue en español; si está en inglés, sigue en inglés. Nunca mezcles los dos en el mismo nivel.
- **Mismo nombre para la misma entidad en todas las capas**: si algo se llama `libro` en la base de datos, debe llamarse `libro` (o su traducción exacta y consistente) en el repository, el service, el controller, el componente y la variable de estado — no lo renombres de una capa a otra.

## 5. Seguridad y datos

- Nunca expongas credenciales, tokens o contraseñas en respuestas de API, logs o código.
- Toda consulta a base de datos con datos externos debe ser parametrizada (nunca concatenar strings en SQL).
- Valida y sanea cualquier input externo (`body`, `query`, `params`) antes de usarlo en lógica de negocio o de acceder a la base de datos.
- No hagas `SELECT *` ni equivalentes contra tablas con datos sensibles de usuarios — sé explícito con las columnas.

## 6. Manejo de errores y logs

- Usa el logger del proyecto (si existe) en vez de `console.log`/`print` sueltos.
- Propaga los errores de forma consistente con el patrón que ya use el proyecto (middleware de errores, try/catch centralizado, etc.), no los silencies ni los manejes de forma distinta en cada archivo.

## 7. Frontend / UI y dirección de diseño

- **Parte del contenido real, no de una plantilla.** Antes de diseñar algo, ten claro el tema/producto real, su audiencia y el objetivo de esa pantalla puntual. Las decisiones distintivas nacen del contenido real del proyecto, no de un patrón genérico reutilizable en cualquier otro.
- **Evita los defaults genéricos de IA.** Hay combinaciones que se repiten tanto en diseños generados por IA que ya se sienten templadas: fondo crema con serif de alto contraste y acento terracota; fondo casi negro con un único acento neón; layout tipo periódico con líneas finas y columnas densas. Úsalas solo si el proyecto las pide explícitamente. Tampoco fuerces un estilo visual no pedido (dark mode, glassmorphism, badges tipo "pill", gradientes llamativos) si el proyecto ya tiene una identidad definida — respeta lo existente antes de decorar.
- Contempla siempre los tres estados de cualquier vista con datos: **carga, vacío y error** — no solo el "camino feliz". Los estados vacíos y de error deben explicar qué pasó y cómo resolverlo, en el tono de la interfaz, sin quedarse vagos ni disculparse.
- Mobile-first y accesible por defecto: contraste adecuado, navegación por teclado con foco visible, tamaños de texto legibles, y respeto a las preferencias de movimiento reducido del sistema (`prefers-reduced-motion`).
- **Inputs en formularios**: usa un tamaño de fuente lo suficientemente grande en mobile — tamaños de fuente muy pequeños disparan zoom automático en iOS Safari al enfocar el input. Si necesitas reducir el tamaño, hazlo solo en breakpoints de escritorio, y verifica el comportamiento en mobile antes de dar el ajuste por terminado.
- **Tipografía con intención.** Combina las fuentes de forma deliberada para el proyecto (no la combinación por defecto que usarías en cualquier otro) y define una escala consistente y reutilizable de tamaños y pesos — evita valores arbitrarios sueltos para roles visuales equivalentes.
- **Los elementos estructurales deben significar algo.** Numeración, separadores, etiquetas: úsalos solo si aportan información real sobre el contenido. Por ejemplo, no agregues marcadores tipo "01 / 02 / 03" si el contenido no es realmente una secuencia u orden.
- **Animación con propósito.** Antes de agregar una animación, pregúntate si realmente sirve al contenido. El exceso de movimiento sin motivo es una de las señales más claras de que un diseño "se ve hecho por IA".
- **Ajusta la ejecución a la dirección elegida.** Una dirección minimalista exige precisión en espaciado y detalle; una maximalista exige una ejecución más elaborada — pero en ambos casos, un solo elemento debe ser el protagonista, y todo lo demás debe mantenerse contenido y disciplinado.
- **Cuida la especificidad de los selectores CSS.** Selectores por tipo (ej. `.section`) y por elemento (ej. `.cta`) pueden anularse entre sí sin que sea evidente, sobre todo en paddings/márgenes entre secciones — revísalo al escribir estilos.
- **El texto también es diseño.** Nombra las cosas como las reconoce quien usa el producto, no como está construido el sistema por dentro. Usa voz activa y mantén el mismo nombre de una acción a lo largo de todo el flujo (si un botón dice "Publicar", la confirmación debe decir "Publicado", no "Enviado").

## 8. Al mover o reorganizar archivos

- Cuando reubiques archivos en subdirectorios, revisa **todas** las importaciones relativas afectadas (tanto las que apuntan hacia afuera del archivo movido como las que otros archivos usan para llegar a él). Esto es una fuente común de errores silenciosos.
- Al reutilizar un componente compartido (ej. un campo de formulario genérico) en varios lugares, verifica que el tipado de eventos/props sea compatible con la interfaz más amplia que declara ese componente, no solo con el caso de uso puntual.

## 9. Git y control de versiones

- Mensajes de commit siguiendo Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, etc.).
- Nunca commitear archivos de entorno (`.env`) ni credenciales.

## 10. Comportamiento general del agente

- Si una decisión implica un cambio de arquitectura significativo (no solo una implementación puntual), pregunta antes de proceder en vez de asumir.
- **No agregues nada que no se te haya pedido.** Completa la acción exactamente con lo que se solicitó, ni de más ni de menos.
- Al terminar un cambio, revisa que no queden imports muertos, código comentado innecesario o console.logs de depuración.

---

*Última actualización: 5/08/26
