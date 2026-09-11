const { src, dest, watch, parallel, series } = require('gulp');
const sass         = require('gulp-sass')(require('sass'));
const sourcemaps   = require('gulp-sourcemaps');
const postcss      = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano      = require('cssnano');
const terser       = require('gulp-terser');
const rename       = require('gulp-rename');
const imagemin     = require('gulp-imagemin');
const webp         = require('gulp-webp');
const avif         = require('gulp-avif');
const cache        = require('gulp-cache');
const crypto       = require('crypto');
const path         = require('path');
const fs           = require('fs');
const { Transform } = require('stream');

const paths = {
  scss:     'src/scss/app.scss',
  // Entrada aparte: las paletas alternativas son una herramienta de desarrollo
  // y no deben acabar dentro de app.css (ver src/scss/paletas.scss).
  scssPal:  'src/scss/paletas.scss',
  scssAll:  'src/scss/**/*.scss',
  js:       'src/js/**/*.js',
  // src/img/sin-usar/ guarda material del equipo que hoy no aparece en la web
  // (infografía de estilos, fichas de los entrenadores, lifestyle). Se queda
  // en el repo pero no se compila: eran ~1 MB de peso muerto en el despliegue.
  imagenes: ['src/img/**/*', '!src/img/sin-usar/**'],
  bitmaps:  ['src/img/**/*.{png,jpg}', '!src/img/sin-usar/**'],
  fuentes:   'src/fonts/**/*.{woff,woff2}',
  destCss:   'public/build/css',
  destJs:    'public/build/js',
  destImg:   'public/build/img',
  destFonts: 'public/build/fonts',
};

// El .htaccess cachea el CSS un año, así que el build de producción le pone un
// hash de contenido al nombre. Para que eso no obligue a editar el <link> a
// mano en cada despliegue, `revIndex` reescribe la referencia en index.html y
// `limpiaCss` borra los hashes viejos.
let cssHasheado = null;

function contentHash() {
  return new Transform({
    objectMode: true,
    transform(file, enc, cb) {
      if (file.isBuffer()) {
        const hash = crypto.createHash('md5').update(file.contents).digest('hex').slice(0, 8);
        const ext  = path.extname(file.path);
        const base = path.basename(file.path, ext);
        file.path  = path.join(path.dirname(file.path), `${base}.${hash}${ext}`);
        cssHasheado = path.basename(file.path);
      }
      cb(null, file);
    }
  });
}

function css() {
  return src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.destCss));
}

function cssBuild() {
  return src(paths.scss)
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([ autoprefixer(), cssnano() ]))
    .pipe(contentHash())
    .pipe(dest(paths.destCss));
}

// paletas.css no lleva hash: nadie la enlaza desde el HTML, la inyecta
// paletas.js por su nombre fijo.
function cssPaletas() {
  return src(paths.scssPal)
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([ autoprefixer(), cssnano() ]))
    .pipe(dest(paths.destCss));
}

// Apunta el <link> de cada HTML al CSS recién hasheado.
const htmls = ['index.html', '404.html'];

function revIndex(done) {
  if (!cssHasheado) return done();
  for (const archivo of htmls) {
    if (!fs.existsSync(archivo)) continue;
    const html = fs.readFileSync(archivo, 'utf8');
    const nuevo = html.replace(
      /public\/build\/css\/app(\.[a-f0-9]{8})?\.css/g,
      `public/build/css/${cssHasheado}`
    );
    if (nuevo !== html) fs.writeFileSync(archivo, nuevo);
  }
  done();
}

// Añade y actualiza cache-busting (?v=<hash>) a las imágenes para que el navegador
// invalide la caché automáticamente al actualizar cualquier asset en public/build/img.
function revImages(done) {
  for (const archivo of htmls) {
    if (!fs.existsSync(archivo)) continue;
    const html = fs.readFileSync(archivo, 'utf8');
    const nuevo = html.replace(
      /(public\/build\/img\/[a-zA-Z0-9_\-\.\/]+?\.(?:png|jpg|jpeg|webp|avif|svg))(?:\?v=[a-f0-9]+)?/g,
      (match, relPath) => {
        const fullPath = path.join(__dirname, relPath);
        if (fs.existsSync(fullPath)) {
          const hash = crypto.createHash('md5').update(fs.readFileSync(fullPath)).digest('hex').slice(0, 8);
          return `${relPath}?v=${hash}`;
        }
        return match;
      }
    );
    if (nuevo !== html) fs.writeFileSync(archivo, nuevo);
  }
  done();
}

// Deja en public/build/css solo lo que sirve producción: el app.<hash>.css de
// esta build y paletas.css. Se borran los hashes de builds anteriores y también
// el app.css sin minificar con su sourcemap que deja `npm run dev` — nadie lo
// enlaza y publicarlo expondría las fuentes SCSS.
function limpiaCss(done) {
  if (!fs.existsSync(paths.destCss)) return done();
  for (const f of fs.readdirSync(paths.destCss)) {
    const hashViejo = /^app\.[a-f0-9]{8}\.css$/.test(f) && f !== cssHasheado;
    const sobraDeDev = f === 'app.css' || f.endsWith('.map');
    if (hashViejo || sobraDeDev) fs.unlinkSync(path.join(paths.destCss, f));
  }
  done();
}

function javascript() {
  return src(paths.js)
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.destJs));
}

function imagenes() {
  return src(paths.imagenes)
    .pipe(cache(imagemin({ optimizationLevel: 3 })))
    .pipe(dest(paths.destImg));
}

function versionWebp() {
  return src(paths.bitmaps)
    .pipe(webp({ quality: 72 }))
    .pipe(dest(paths.destImg));
}

function versionAvif() {
  return src(paths.bitmaps)
    .pipe(avif({ quality: 50 }))
    .pipe(dest(paths.destImg));
}

function fuentes() {
  return src(paths.fuentes)
    .pipe(dest(paths.destFonts));
}

function dev(done) {
  watch(paths.scssAll,  parallel(css, cssPaletas));
  watch(paths.js,       javascript);
  watch(paths.imagenes, parallel(imagenes, versionWebp, versionAvif));
  watch(paths.fuentes,  fuentes);
  done();
}

exports.css         = css;
exports.javascript  = javascript;
exports.imagenes    = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.fuentes     = fuentes;
exports.revImages   = revImages;
exports.dev   = series(parallel(css, cssPaletas, javascript, imagenes, versionWebp, versionAvif, fuentes), dev);
exports.build = series(
  parallel(cssBuild, cssPaletas, javascript, imagenes, versionWebp, versionAvif, fuentes),
  revIndex,
  revImages,
  limpiaCss
);
