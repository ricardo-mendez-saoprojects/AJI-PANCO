# Andre Fernández «Aji-Panco» — Web oficial

Landing de un peleador profesional de Muay Thai y K-1. Sitio estático de una sola página:
HTML + Gulp + SCSS + JS vanilla, sin frameworks. Misma arquitectura que `Web - SAOProjects`
y `Web - Horario-CIB`.

**Producción:** https://andrefernandez.es

> 📄 **La documentación completa está en [DOCUMENTACION.md](DOCUMENTACION.md)**: sistema de
> diseño, tokens y contrastes, paletas alternativas, cómo funcionan el acordeón y la galería,
> mapa de fotos, despliegue y lo que queda pendiente. Este README es solo el arranque.

## Arranque

Los HTML se abren directamente o con cualquier servidor estático, sin compilar nada:
`public/build/` está versionado.

```bash
npm install
npm run dev      # compila y vigila cambios (expandido, con sourcemaps)
npm run build    # producción, minificado
```

Servidor local:

```bash
python3 -m http.server 8901
```

**Antes de commitear cambios de `src/`, ejecuta `npm run build`.** El CSS de producción lleva
hash de contenido; `revIndex` reescribe solo el `<link>` de los dos HTML y `limpiaCss` borra
los hashes viejos y la salida de desarrollo. No hay que tocar nada a mano.

## Estructura

```
src/scss/
  app.scss        entrada principal (solo @use)
  paletas.scss    entrada aparte: paletas alternativas de desarrollo
  base/           _variables (tokens), _globales, _tipografia
  ui/             _botones, _cards, _nav, _footer, _animaciones
  paginas/        _home (barril) + una hoja por sección
src/js/
  main.js         nav, menú móvil, reveal, FAQ, contadores
  paletas.js      conmutador de paletas (inerte sin ?paletas en la URL)
src/img/
  fotos/          las 26 fotos que usa la web
  sin-usar/       material que hoy no aparece — NO se compila
public/build/     salida de gulp (versionada)
```

## Ver las paletas alternativas

Cinco variantes oscuras sobre la página completa. Añade `?paletas` a la URL:

```
http://localhost:8901/?paletas
```

La hoja solo se descarga con ese parámetro: el visitante nunca la carga y la paleta de
producción sigue siendo la carmesí.

## Antes de tocar nada

- No pongas texto de acento en `--accent`: suspende AA. Para eso está `--accent-text`.
- Si reordenas los paneles de Momentos, revisa los `object-position` por `nth-child`.
- Si añades un logotipo, recórtalo a su caja de contenido o se verá de distinto tamaño.

El detalle de cada una de estas trampas, en [DOCUMENTACION.md](DOCUMENTACION.md).
