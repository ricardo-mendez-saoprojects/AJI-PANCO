/* ─── Conmutador de paletas · SOLO DESARROLLO ───
 *
 * No hace nada salvo que la URL lleve `?paletas`. En ese caso inyecta
 * public/build/css/paletas.css y un panel flotante para ver el index completo
 * con cada variante oscura. La elección se recuerda en sessionStorage para que
 * sobreviva a las recargas mientras se compara.
 *
 *   http://localhost:8901/?paletas
 *
 * La paleta de producción es la carmesí y vive en base/_variables.scss: aquí
 * no se define ningún color, solo se cambia el atributo data-paleta del body.
 */
(function () {
  if (!new URLSearchParams(location.search).has('paletas')) return;

  var PALETAS = [
    { id: '',       nombre: 'Carmesí',  muestra: '#d21f2c', nota: 'Producción' },
    { id: 'oro',    nombre: 'Oro',      muestra: '#c8952f' },
    { id: 'acero',  nombre: 'Acero',    muestra: '#0d74b4' },
    { id: 'jade',   nombre: 'Jade',     muestra: '#10795a' },
    { id: 'hueso',  nombre: 'Hueso',    muestra: '#f5f2ec' }
  ];

  var hoja = document.createElement('link');
  hoja.rel = 'stylesheet';
  hoja.href = 'public/build/css/paletas.css';
  document.head.appendChild(hoja);

  var dock = document.createElement('div');
  dock.className = 'paletas-dock';
  dock.innerHTML = '<h6>Paletas oscuras</h6>';

  var botones = PALETAS.map(function (p) {
    var b = document.createElement('button');
    b.type = 'button';
    b.dataset.paleta = p.id;
    b.innerHTML = '<i class="muestra" style="background:' + p.muestra + '"></i>' + p.nombre;
    b.addEventListener('click', function () { aplicar(p.id); });
    dock.appendChild(b);
    return b;
  });

  var nota = document.createElement('p');
  nota.className = 'nota';
  nota.textContent = 'Panel de desarrollo. No se carga sin ?paletas en la URL.';
  dock.appendChild(nota);

  function aplicar(id) {
    if (id) {
      document.body.dataset.paleta = id;
    } else {
      delete document.body.dataset.paleta;
    }
    try { sessionStorage.setItem('paleta', id); } catch (e) { /* modo privado */ }
    botones.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.paleta === id));
    });
  }

  document.body.appendChild(dock);

  var guardada = '';
  try { guardada = sessionStorage.getItem('paleta') || ''; } catch (e) { /* ídem */ }
  aplicar(guardada);
})();
