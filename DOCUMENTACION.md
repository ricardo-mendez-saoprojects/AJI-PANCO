# Andre Fernández «Aji-Panco» — Documentación del proyecto

Web oficial de un peleador profesional de Muay Thai y K-1. Sitio estático de una sola
página, construido con la misma arquitectura que `Web - SAOProjects` y `Web - Horario-CIB`.

**Dominio:** https://andrefernandez.es
**Repositorio:** https://github.com/ricardo-mendez-saoprojects/AJI-PANCO
**Estudio:** SAOProjects Studio
**Última actualización:** 1 de agosto de 2026

---

## 1. De dónde viene el proyecto

### 1.1 Los dos proyectos de referencia

`Web - SAOProjects` y `Web - Horario-CIB` comparten esqueleto: el README del CIB dice
explícitamente que sigue *"la misma arquitectura que Web - SAOProjects"*. Ese es el patrón
que se ha replicado aquí.

| | SAOProjects | Horario-CIB | Aji-Panco |
|---|---|---|---|
| Gulp: SCSS + JS | ✅ | ✅ | ✅ |
| Gulp: imágenes (imagemin + webp + avif) | ✅ | — | ✅ |
| Hash de contenido en el CSS de producción | ✅ | — | ✅ + reescritura automática del `<link>` |
| `public/build/` versionado | ✅ | ✅ | ✅ |
| Conmutador de tema claro/oscuro | ✅ | ✅ | ❌ (solo oscuro, a propósito) |
| Paletas alternativas conmutables | — | — | ✅ |

Reglas de la casa que se han mantenido:

- **CSS custom properties en `:root`** para todo lo que pueda cambiar.
- **Una única fuente de verdad para el acento de marca**; el resto se compone a partir de ahí.
- **Los contrastes AA se calculan y se anotan en un comentario junto al token.** En SAO se
  oscureció el verde de WhatsApp de 1,98:1 a 5,16:1 por esto; el CIB abre su archivo de
  variables con la tabla de ratios contra sus dos superficies.
- **JS plano**, sin módulos: nav con `.scrolled`, hamburguesa con focus trap y
  `aria-expanded`, `IntersectionObserver` con `unobserve`, `prefers-reduced-motion` respetado.
- **Cabeza completa**: OG, Twitter Card, canonical, JSON-LD, `robots.txt`, `sitemap.xml`,
  `404.html` propia y `.htaccess` de Hostinger.

### 1.2 El punto de partida

Un mockup monolítico: `index.html` de 592 líneas con CSS y JS en línea, carpetas `css/` y
`js/` vacías, 18 JPG sin usar y ~35 placeholders con datos inventados. El lenguaje visual
(negro cálido + carmesí + hueso + oro, Anton/Space Mono, marco de esquinas, grano de
película) era bueno y se conservó; lo demás se rehízo.

---

## 2. Arranque

Los HTML se abren directamente o con cualquier servidor estático, sin compilar nada:
`public/build/` está versionado.

```bash
npm install
npm run dev      # compila y vigila cambios (expandido, con sourcemaps)
npm run build    # producción, minificado
```

Servidor local: `python3 -m http.server 8901` (o `.claude/launch.json`).

**Antes de commitear cambios de `src/`, ejecuta `npm run build`.**

### El hash del CSS

El `.htaccess` cachea el CSS un año, así que el build de producción le pone un hash de
contenido al nombre (`app.<hash>.css`). Para que eso no obligue a editar el `<link>` a mano:

- `revIndex` reescribe la referencia en `index.html` y `404.html`.
- `limpiaCss` borra los hashes de builds anteriores **y también** el `app.css` sin minificar
  con su sourcemap que deja `npm run dev` — nadie lo enlaza y publicarlo expondría las
  fuentes SCSS. Es el mismo criterio que audita el `DESPLIEGUE.md` de SAOProjects.

---

## 3. Estructura

```
index.html          página única (incluye el sprite SVG de iconos)
404.html            página de error con el diseño de la web
.htaccess           producción en Hostinger
robots.txt · sitemap.xml

src/scss/
  app.scss          entrada principal (solo @use)
  paletas.scss      entrada aparte: paletas alternativas de desarrollo
  base/             _variables (tokens), _globales, _tipografia
  ui/               _botones, _cards, _nav, _footer, _animaciones
  paginas/          _home (barril) + una hoja por sección
src/js/
  main.js           nav, menú móvil, reveal, FAQ, contadores
  paletas.js        conmutador de paletas (inerte sin ?paletas en la URL)
src/img/
  fotos/            las 26 fotos que usa la web
  sin-usar/         material que hoy no aparece — NO se compila
  logo-gym.png · logo-sao.png · favicon.svg
public/build/       salida de gulp (versionada)
```

**`src/img/sin-usar/` no entra en el build.** Si mueves una foto ahí desde `fotos/`,
desaparece; si la traes de vuelta, entra sola en el siguiente `npm run build`. Sirve para no
arrastrar megas de material que la web no enseña.

`src/img/sin-usar/referencia/` guarda los assets de SAOProjects que se usaron como
referencia visual (iconos DevStack/YOOtheme, iconos de stock). **Está excluido del
repositorio**: son de terceros y no se redistribuyen.

### Secciones de la página

`inicio` → `historia` → `momentos` → `combates` → `cifras` → `trayectoria` → `galeria` →
`patrocinio` → `gimnasio` → `faq` → `contacto`

---

## 4. Sistema de diseño

### 4.1 Oscuro y solo oscuro

A diferencia de los otros dos proyectos **no hay conmutador de tema**: el negro cálido es la
identidad del deporte de contacto, no una preferencia del usuario. Todo vive en `:root`, no
existe un bloque `body.light-mode`. Eso elimina la mitad de la complejidad del archivo de
variables.

### 4.2 Tokens

Los nombres son **semánticos** (`--accent`, `--accent-2`) y no de color (`--crimson`,
`--gold`), porque sobre ellos se montan las paletas alternativas: un token llamado
`--crimson` conteniendo verde jade sería una mentira.

Contrastes verificados de la paleta de producción (sobre `--ink` #0b0809 · sobre
`--surface` #181215):

| Token | Valor | Ratio | Uso |
|---|---|---|---|
| `--bone` | `#f2ece3` | 16,98 · 15,74 | títulos |
| `--body` | `#cfc7bf` | 11,94 · 11,07 | párrafos |
| `--ash` | `#948b86` | 5,98 · 5,54 | texto secundario, metadatos |
| `--accent-text` | `#ff2f3e` | 5,44 · 5,04 | el acento **cuando es texto** |
| `--accent-2` | `#b3893f` | 6,24 · 5,78 | oro: hitos y palmarés |
| `--accent` | `#d21f2c` | 3,77 sobre ink | rellenos y bordes — **nunca texto** |
| `--on-accent` | `#ffffff` | 5,29 sobre `--accent` | texto del botón |

### 4.3 Radios

El mockup era de aristas vivas y las esquinas en pico quedaban duras sobre las fotos. Escala
corta a propósito, tres valores y ninguna excepción suelta:

| Token | Valor | Dónde |
|---|---|---|
| `--radius-sm` | 8px | botones, etiquetas, chips, celdas de datos |
| `--radius` | 14px | imágenes, tarjetas y bloques con fondo |
| `--radius-lg` | 20px | banner de patrocinio, combate destacado, paneles de momentos |

Los marcos de esquina de `.stmt-img` y `.mapa` se movieron de 12 a 18 px para que no los
recorte la curva.

### 4.4 Tipografía

Anton para titulares (condensada, mayúsculas, cartel de combate), Inter para texto corrido y
Space Mono para etiquetas y datos. Se cargan con `<link>` + `preconnect` y el truco
`media="print" onload="this.media='all'"`, con `<noscript>` de respaldo: un `@import` CSS
bloquearía el render.

### 4.5 Iconos

Sprite SVG inline al principio de `index.html`, con el patrón de SAOProjects: cada icono es
una **máscara de trazos** sobre un `<rect>` relleno con un degradado
(`--accent-deep → --accent → --accent-bright`). Como el sprite vive dentro de `<body>`, los
`var(--accent*)` de los stops ven los overrides de `body[data-paleta]` y **los iconos cambian
de color con la paleta activa**.

Cinco de dibujo propio, adaptados al Muay Thai: `ico-guante`, `ico-megafono`, `ico-saco`,
`ico-cinturon`, `ico-pantalon`. Tres de marca —`ico-whatsapp`, `ico-telefono`,
`ico-instagram`— en `currentColor` plano, sin degradado: un logotipo ajeno no se reinterpreta.

**Regla:** todo enlace a Instagram lleva su icono al lado. Hoy son cuatro (botón del
combate, pie del mapa, vía de contacto y footer).

### 4.6 Paletas alternativas

Cinco variantes oscuras para ver el index completo con cada una. Se activan añadiendo
`?paletas` a la URL:

```
http://localhost:8901/?paletas
```

Aparece un panel abajo a la izquierda. `paletas.css` **solo se descarga en ese caso**: el
visitante nunca la carga y la paleta de producción sigue siendo la carmesí.

| Paleta | Acento | Lectura |
|---|---|---|
| **Carmesí** (producción) | `#d21f2c` | La del mockup. Agresiva, la convención del deporte de contacto. |
| **Oro** | `#c8952f` | La más cercana a la marca del Kai Muay Free Fighters (su escudo ya es oro sobre negro). Lee a «campeonato». |
| **Acero** | `#0d74b4` | Los colores de la foto de entrada al ring. La más moderna; también la menos habitual en peleadores. |
| **Jade** | `#10795a` | Verde y oro del mongkon y el prajioud. La más «de linaje». |
| **Hueso** | `#f5f2ec` | Monocromo editorial. Deja respirar las fotos, pero el botón deja de gritar. |

Las cuatro alternativas están verificadas en AA; los ratios, en la cabecera de
`src/scss/paletas.scss`. Cambian el acento y la temperatura del negro; la estructura, el tipo
y el espaciado no se tocan, que es lo que permite compararlas.

---

## 5. Piezas con truco

### 5.1 Momentos (acordeón)

Seis paneles que crecen al pasar el ratón. Adaptado del patrón de referencia con tres
diferencias, documentadas en `src/scss/paginas/_momentos.scss`:

1. Las fotos son `<img>` dentro de `<picture>`, no `background-image`: así se conservan
   AVIF/WebP, `loading="lazy"` y los `width`/`height` que evitan CLS.
2. Se anima `flex-grow` en vez de `flex-basis`, lo que evita el cálculo de `100vw / n` y
   funciona con cualquier número de paneles.
3. El texto no aparece solo con el ratón: también con `:focus-within` (los paneles son
   enfocables con teclado) y **siempre** en pantallas sin puntero fino, donde el hover no
   existe y el contenido quedaría inaccesible.

Va **a ancho completo**, fuera de `.wrap`, y de borde a borde en escritorio: cuanto más ancho
el contenedor, más espacio real gana el panel abierto. Con `flex-grow: 11` el abierto se
lleva el **69 %** del ancho.

En reposo el velo va al **50 %** y solo se cierra al 92 % al abrirse. Con el 92 % permanente
los paneles cerrados se veían casi negros y no invitaban a pulsar. Además llevan
`cursor: pointer` y una marca «+» que se desvanece al abrir.

Cada panel tiene su propio `object-position` —igual que el `background-position` por elemento
del patrón original—, porque el panel abierto es una caja apaisada fija y con fotos que van
del 0,75 al 1,50 algo de recorte es inevitable: lo que se controla es *qué* se recorta.
**Si se reordenan los paneles hay que revisar esos `nth-child`.**

Los pies son descriptivos, no citas: no hay declaraciones reales de Andre que atribuirle.

### 5.2 Galería

Mosaico en columnas (`columns`), no rejilla. La versión anterior tenía filas de 200 px con
`object-fit: cover` y, con fotos que van del 0,56 al 1,51, recortaba casi todas —en varias se
comía la cabeza o el texto sobreimpreso—. Ahora cada figura ocupa su alto natural y **no se
recorta nada**, así que tampoco hacen falta rellenos para tapar huecos. Contrapartida
asumida: `columns` ordena de arriba abajo y luego salta de columna, así que el orden de
lectura no es el del HTML; en una galería de fotos da igual.

### 5.3 Tarjetas de combate

Sin `aspect-ratio` fijo: con 16/10 el cartel vertical del campeonato perdía la mitad de la
foto. La altura la marca la imagen. La tarjeta del campeonato va **en el centro** porque su
foto es vertical y por tanto la más alta; con `align-items: center` las dos apaisadas quedan
centradas a sus lados.

### 5.4 Logotipos

Kai Muay Free Fighters y SAOProjects aparecen en la franja «Equipo y colaboradores» bajo las
credenciales del hero (80 px) y en los dos huecos centrales de la banda de patrocinio
(46 px). En ambos van en escala de grises y se colorean al pasar por encima.

Dos trampas que ya mordieron una vez y conviene recordar:

- **`<picture>` es un elemento en línea de alto automático**, así que un `max-height` en
  porcentaje sobre la `<img>` no tiene contra qué resolverse y el logotipo se pinta a tamaño
  natural, desbordando su hueco. Por eso `.logo-slot picture` es un flex al 100 % de la celda.
- **Dos logotipos con la misma altura CSS pueden verse de tamaños distintos** si dentro de su
  lienzo ocupan proporciones diferentes. El de SAOProjects llenaba el 73 % de su PNG y el del
  gimnasio el 100 %: se veía un 37 % más pequeño. Se arregló recortando el PNG a su caja de
  contenido, no tocando el CSS. **Los dos archivos deben llenar su lienzo al 100 %.**

El logo del gimnasio venía en JPG con el tablero de transparencia *pintado dentro* del
archivo. Se convirtió a PNG con máscara circular (el logotipo es un círculo, así que las
esquinas con tablero se recortan limpias) y se bajó de 1080 a 480 px: pesaba 961 KB para
renderizarse a ~100 px.

---

## 6. Accesibilidad

Cinco fallos reales corregidos, cuatro heredados del mockup:

| | Antes | Ahora |
|---|---|---|
| `.eyebrow` en carmesí | `#d21f2c` → 3,77:1 ❌ | `--accent-text` `#ff2f3e` → 5,44:1 ✅ |
| `.logo-slot` | `#4b4247` → 2,06:1 ❌ | `--ash` → 5,98:1 ✅ |
| Hover de `.btn-fill` | blanco sobre `#ff2f3e` → 3,12:1 ❌ | el relleno ya no se aclara; el énfasis lo dan el resplandor y el desplazamiento ✅ |
| Placeholder del formulario | `#5c534f` → 2,66:1 ❌ | el formulario se eliminó (ver §7) |
| `.eyebrow` de la sección Historia | `.stmt-copy p` (0,1,1) le ganaba en especificidad y lo pintaba de color de párrafo | `:not(.eyebrow)` ✅ |

Además:

- **Menú móvil real.** Por debajo de 960 px el mockup ocultaba los enlaces y dejaba solo el
  botón de patrocinio: la web se quedaba literalmente sin navegación. Se portó la hamburguesa
  de SAOProjects, con focus trap, `aria-expanded` y cierre con `Escape`.
- `skip-link` al contenido.
- `aria-expanded` en el acordeón del FAQ.
- Jerarquía de encabezados sin saltos (un `h1`, diez `h2`, diez `h3`).
- `prefers-reduced-motion` respetado también en los contadores, que muestran el número final
  sin animar.
- Los paneles de Momentos son enfocables con teclado.

---

## 7. Contenido

### Datos verificados

- Récord **16-8-1**, con **2 victorias por KO** (25 combates profesionales)
- **Campeón Nacional de Perú (2012)** y **Campeón de España WMO (2024)**
- **56 kg**, 170 cm, Madrid
- Gimnasio: **Kai Muay Free Fighters**, Torrejón de Ardoz
- Contacto: **640 801 536** (mánager) · WhatsApp y llamada
- Instagram: [@andreesiitto._freefighters__](https://www.instagram.com/andreesiitto._freefighters__/) ·
  gimnasio: [@kaimuay.freefighters](https://www.instagram.com/kaimuay.freefighters)

### Lo que se quitó del mockup

- **Tres testimonios inventados** atribuidos a un coach, un promotor y un medio. Se
  sustituyeron por la línea de tiempo del palmarés, que son datos verificables.
- **El formulario de newsletter**, que no enviaba a ninguna parte. Se sustituyó por las vías
  de contacto reales. Como consecuencia **no se recogen datos personales**, así que hoy no
  hacen falta aviso legal ni política de privacidad; si se añade un formulario, sí.
- Las cifras inventadas (el mockup decía 9-2 y 5 KO).

### Lo que se añadió

- **Momentos** (acordeón) y **galería** de trayectoria.
- **Gimnasio con mapa incrustado**: la foto `coach-andre-lima` reveló que Andre también da
  clases, así que hay una segunda vía de conversión junto al patrocinio.

### Mapa de fotos

| Original | Ahora | Uso |
|---|---|---|
| `43.jpg` | `combate-patadas.jpg` | Hero + imagen social |
| `23.jpg` | `victoria-brazo-alto.jpg` | Historia + Momentos |
| `36 · 42 · 41 · 44.jpg` | `combate-*` · `victoria-esquina` | Momentos |
| `9.jpg` | `hero-entrada-ring.jpg` | Momentos |
| `24.jpg` | `cartel-hitman-leeds.jpg` | Combate destacado (sustituyó al `13.jpg`, que traía el marco de Instagram) |
| `5.jpg` | `cartel-campeon-wmo.jpg` | Tarjeta central de combates |
| `18 · 10.jpg` | `pesaje-careo` · `pesaje-freefighters` | Tarjeta y galería |
| `16.jpg` | `tailandia-patada.jpg` | Tarjeta |
| `31.jpg` | `entreno-manoplas.jpg` | Gimnasio |
| `25 · 26 · 32 · 33 · 34 · 35.jpg` | `entreno-*` | Galería |
| `8 · 17 · 11 · 7 · 12 · 14 · 6.jpg` | `retrato-guardia` · `vestuario` · `tailandia-*` · `peru-*` | Galería |
| `1 · 2 · 3 · 4 · 15 · 22.jpg` | `sin-usar/` | Sin uso actual. El `22.jpg` era duplicado de `pesaje-freefighters` y se borró. |

---

## 8. Rendimiento

| | |
|---|---|
| CSS de producción | 27 KB (minificado, sin sourcemap) |
| JS | 2,5 KB + 1,2 KB del conmutador de paletas |
| Fotos servidas (AVIF) | ~1,2 MB las 31 imágenes de la página |
| `public/build/` en disco | 7,7 MB (incluye jpg + webp + avif de cada foto) |

Todas las imágenes van en `<picture>` con AVIF → WebP → JPG, `loading="lazy"` (salvo el hero,
con `fetchpriority="high"`) y `width`/`height` para evitar CLS.

---

## 9. Despliegue

### Qué subir a `public_html/`

```
index.html · 404.html · robots.txt · sitemap.xml · .htaccess
public/build/   (carpeta completa)
```

### Qué NO subir

```
src/ · node_modules/ · gulpfile.js · package*.json · *.md · .claude/ · .git/
```

### `.htaccess`

Dominio canónico (`www` → sin `www`), `ErrorDocument 404`, gzip, cache de 1 año para
estáticos y 0 para HTML, y cabeceras de seguridad.

**No fuerza HTTPS a propósito**: Hostinger ya redirige http→https en su plataforma y una
regla `RewriteCond %{HTTPS} off` provocaría un bucle de redirección infinito, porque su SSL
termina en un proxy y Apache ve la petición como http. Misma nota que en `Web - SAOProjects`.

### Checklist tras publicar

- [ ] La home carga y el hero se ve bien encuadrado
- [ ] El acordeón de Momentos se abre al pasar el ratón y con teclado
- [ ] El mapa del gimnasio carga
- [ ] Los botones de WhatsApp abren el chat con el 640 801 536
- [ ] En móvil: la hamburguesa abre el menú y se cierra con `Escape`
- [ ] `/robots.txt` y `/sitemap.xml` responden
- [ ] Consola del navegador sin errores
- [ ] Alta en Google Search Console y envío del sitemap

---

## 10. Pendiente

**Bloqueante para publicar**

1. **Combate de Leeds.** El cartel no indica el año ni el resultado. Si ya se disputó, el
   bloque destacado debería pasar a la línea de tiempo.

**Importante, no bloqueante**

2. **Logotipo propio.** No hay ninguno. El favicon es provisional (marco de esquinas + «A»)
   y la imagen de Open Graph es una foto de combate.
3. **Instagram profesional.** Cuando exista, cambiar las cuatro referencias de `index.html`
   y la del JSON-LD.
4. **Logos de patrocinadores.** Dos huecos con iconografía de Muay Thai a la espera de marcas
   reales. En las fotos del pesaje ya aparecen varios (Rasta, Khallum, The Saw Room, Custom
   Fighter, Marrakech…): hay que pedirles los archivos.
5. **Dossier de patrocinio en PDF.** Hoy el CTA lleva a WhatsApp.
6. **Elegir paleta definitiva.** Abrir `?paletas` y decidir. La carmesí queda por defecto.

**Opcional**

7. **Testimonios reales.** Si aparecen citas del coach, un promotor o prensa, la sección se
   recupera con el diseño del mockup.
8. **Vídeo de fondo en el hero.** La foto funciona bien y pesa poco en AVIF; un vídeo es peso
   extra a cambio de poco.
9. **`victoria-brazo-alto` se usa dos veces**, en Historia y en el panel 5 del acordeón.
10. **La etiqueta «Equipo y colaboradores»** del hero es una decisión de redacción abierta a
    cambio; también puede eliminarse.
11. **Ritmo de fondos.** Historia y Momentos son las dos secciones sin la clase `alt`, así que
    van dos bloques seguidos con el mismo fondo. Como Momentos es de fotos a sangre no debería
    leerse como un muro plano, pero si molesta se arregla poniéndole `alt` a Momentos y
    quitándoselo a Combates.

---

## 11. Advertencias para quien continúe

- **Ejecuta `npm run build` antes de commitear** cambios de `src/`. Si dejas `npm run dev`
  corriendo, su watcher sobrescribe la salida con la versión de desarrollo.
- **No pongas texto de acento en `--accent`**: suspende AA. Para eso está `--accent-text`.
- **Si reordenas los paneles de Momentos**, revisa los `object-position` por `nth-child`.
- **Si añades un logotipo**, recórtalo a su caja de contenido antes de meterlo, o se verá de
  distinto tamaño que los demás.
- **Los pies del acordeón y de la galería son descriptivos.** No conviertas en cita algo que
  Andre no ha dicho.
- **`prefers-reduced-motion`** está respetado en toda la web; si añades animación, respétalo
  también.
