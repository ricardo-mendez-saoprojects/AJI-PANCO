# AGENTS.md — Andre Fernández «Aji-Panco» (Web oficial)

Landing de un peleador profesional de Muay Thai y K-1. Sitio estático de una sola página.
Cliente real, en producción en: https://andrefernandez.es

## Arquetipo y Skills
- **Arquetipo:** `sao-web-estatica`.
- **Skills a cargar:** `sao-marca`, `sao-metodo`.
- **Prohibido:** No cargar `sao-php-mvc` (sitio estático sin backend PHP ni base de datos).

## Stack tecnológico y Comandos
- **Stack:** Gulp 4, Dart Sass, PostCSS/cssnano, JS vanilla + Terser, Apache.
- `npm run dev`: Compila y vigila cambios (SCSS expandido, con sourcemaps). No vigila HTML ni recarga el navegador.
- `npm run build`: Compila versión de producción (minificado y sellado con hashes de contenido).
- **Servidor local:** `python3 -m http.server 8901`.

## Reglas de Build y Salida
- **`public/build/` ESTÁ VERSIONADO:** No se edita a mano bajo ninguna circunstancia, pero **SÍ se commitea**. Permite servir el sitio estático sin requerir build previo.
- **Obligatorio:** Antes de commitear cualquier cambio en `src/`, ejecutar siempre `npm run build`.
- **Hash de CSS:** No editar manualmente el `<link>` con hash en `index.html` ni en `404.html`. La tarea `revIndex` del gulpfile lo actualiza automáticamente tras compilar y `limpiaCss` purga los hashes antiguos.
- **Paletas alternativas:** `src/scss/paletas.scss` y `src/js/paletas.js` son el banco de pruebas de cinco variantes oscuras (activables solo con `?paletas` en la URL). La paleta de producción fija es la **carmesí**. No integrar ninguna variante alternativa sin autorización explícita.
- **Material descartado:** `src/img/sin-usar/` no se compila ni se redistribuye. No tocar.

## Trampas conocidas — Leer antes de tocar
1. **Contraste de acento:** No utilizar `--accent` para texto ni titulares; suspende el ratio WCAG AA (4.5:1). Para textos sobre fondo oscuro usar siempre el token específico `--accent-text`.
2. **Acordeón de Momentos (`nth-child`):** Cada panel tiene su propio `object-position` declarado en CSS para encajar la foto apaisada. Si se reordenan o cambian paneles, hay que revisar obligatoriamente los `nth-child` en `src/scss/paginas/_momentos.scss`.
3. **Logotipos y cajas de contenido:** Todo logotipo nuevo debe recortarse a su caja de contenido útil al 100% de su lienzo antes de insertarlo. De lo contrario, logotipos con igual altura CSS se renderizarán a tamaños dispares (como ocurrió entre SAOProjects y Kai Muay).
4. **`<picture>` en slots de logotipos:** `<picture>` es un elemento en línea con alto intrínseco automático; un `max-height` en % sobre la `<img>` interna desborda. La clase `.logo-slot picture` debe ser un contenedor `flex` al 100% de su celda.
5. **Tarjetas de combate:** No aplicar `aspect-ratio` fijo (el cartel vertical del campeonato se recortaría a la mitad). La tarjeta central del campeonato es la más alta (formato vertical) y las laterales van apaisadas, centradas mediante `align-items: center`.
6. **Galería en `columns`:** El mosaico organiza las fotos de alto natural en columnas verticales para no recortar fotos ni generar huecos. El orden de lectura en pantalla va de arriba abajo por columna, difiriendo del orden lineal del HTML.
7. **Pies descriptivos (no citas):** Los textos al pie del acordeón y la galería son descripciones de combate, NO citas entrecomilladas ni declaraciones atribuidas a Andre.
8. **Movimiento reducido:** Toda animación o transición debe estar condicionada a `@media (prefers-reduced-motion: no-preference)`.
9. **Oscuro exclusivo:** El sitio no implementa modo claro ni responde a `prefers-color-scheme`. Es un sitio exclusivamente oscuro con acentos carmesí. No añadir modo claro.
10. **Rutas relativas obligatorias:** Ningún recurso (CSS, JS, imágenes, enlaces) debe empezar por `/`. El sitio debe operar tanto en la raíz de un dominio como en subdirectorios (ej. GitHub Pages).

## Zona Protegida
No modificar sin aviso previo y justificación técnica explícita:
- Metadatos del `<head>` (Open Graph, Twitter Cards, Canonical).
- Marcado de datos estructurados JSON-LD (`schema.org`).
- Jerarquía de encabezados (`h1` a `h6`).
- Estructura de URLs y enlaces ancla.
- Archivos de infraestructura: `robots.txt`, `sitemap.xml`, `.htaccess`.
- Textos de contenido (el copy es propiedad del cliente).

## Verificación Visual y UI
- Tras cada cambio en la interfaz, verificar visualmente y generar capturas en tres anchos:
  - Escritorio: **1440 px**
  - Tablet: **768 px**
  - Móvil: **375 px**
- **Autoridad de diseño:** Proponer siempre 2 direcciones visuales descritas en texto y esperar la decisión del usuario. Una vez elegida una dirección, no insistir en alternativas.

## Control de Versiones (Git)
- Rama de trabajo: `rediseno-produccion`.
- NUNCA hacer commit ni push sin aprobación expresa.
- Convención de commits: `tipo(ámbito): descripción en imperativo`.
